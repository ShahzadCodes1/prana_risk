/**
 * Light scroll effects (no pinning, no fading of content):
 *  - header progress line
 *  - hero: photo drifts slightly slower than the page
 *  - photos (.clip-img) wipe open from the bottom as they enter; the image inside has a gentle parallax
 *  - [data-scrub] elements get --e / --p: Venn, map routes and map drift, the business-card deck
 *    dealing out, the quote form folding down, the footer wordmark rising
 *  - business cards tilt toward the pointer with a moving glare (desktop)
 *  - coverage cards stack: each sticks below the header and recedes as the next slides over it
 *    (wide, tall-enough screens)
 *  - featured products: the property cards glide sideways while the page scrolls (wide screens)
 */
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

function splitWords(root: HTMLElement) {
  let i = 0;
  const walk = (node: Node) =>
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (c.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(' '));
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.style.setProperty('--i', String(i++));
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === Node.ELEMENT_NODE) walk(c);
    });
  walk(root);
}

export function initScrollFx({ reducedMotion }: { reducedMotion: boolean }) {
  const header = document.querySelector<HTMLElement>('.site-header')!;
  const bar = header.querySelector<HTMLElement>('.scroll-progress');
  const hero = document.getElementById('top')!;
  document.querySelectorAll<HTMLElement>('[data-split]').forEach(splitWords);
  const els = [...document.querySelectorAll<HTMLElement>('.clip-img, [data-scrub]')];
  if (reducedMotion) els.forEach((el) => (el.style.setProperty('--e', '1'), el.style.setProperty('--p', '1')));
  const root = document.documentElement;
  const stackCards = [...document.querySelectorAll<HTMLElement>('[data-stack] > .cov-card')];
  const pin = document.querySelector<HTMLElement>('[data-hscroll]');
  const track = pin?.querySelector<HTMLElement>('.prod-grid');
  const hCards = track ? [...track.querySelectorAll<HTMLElement>('.prod-card')] : [];
  const hBar = pin?.querySelector<HTMLElement>('.products-progress span');
  const hCount = pin?.querySelector<HTMLElement>('.products-count');
  const wide = window.matchMedia('(min-width: 961px) and (min-height: 640px)');
  // the pinned effects need position: sticky inside overflow: clip sections (Safari 16+, all evergreen
  // browsers); older engines keep the plain grids
  const canPin = typeof CSS !== 'undefined' && CSS.supports('overflow', 'clip');
  let horizontal = false;
  let hDistance = 0;
  let pinTop = 0;
  let lastCount = -1;

  function layout() {
    const vh = window.innerHeight;
    horizontal = canPin && !reducedMotion && wide.matches && !!pin && !!track;
    root.classList.toggle('has-hscroll', horizontal);
    root.classList.toggle('has-stack', canPin && !reducedMotion && wide.matches && vh >= 700);
    if (!pin || !track) return;
    track.style.transform = '';
    if (horizontal) {
      const stage = pin.querySelector<HTMLElement>('.products-stage')!;
      hDistance = Math.max(0, track.scrollWidth - stage.clientWidth);
      pin.style.height = `${hDistance + vh}px`;
      pinTop = pin.getBoundingClientRect().top + window.scrollY;
    } else pin.style.height = '';
  }

  function update(y: number) {
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const rects = reducedMotion ? [] : els.map((el) => el.getBoundingClientRect());
    const stack = root.classList.contains('has-stack') ? stackCards.map((c) => c.getBoundingClientRect().top) : [];
    const stickyTop = header.offsetHeight + 24;
    const cardRects = horizontal ? hCards.map((c) => c.getBoundingClientRect()) : [];
    const vw = window.innerWidth;
    if (bar) bar.style.transform = `scaleX(${clamp01(y / Math.max(max, 1)).toFixed(4)})`;
    if (!reducedMotion) hero.style.setProperty('--p', clamp01(y / Math.max(hero.offsetHeight, 1)).toFixed(4));
    rects.forEach((r, i) => {
      if (r.bottom < -vh || r.top > vh * 2) return;
      // the footer wordmark is the last thing on the page: finish exactly at the bottom
      const e = els[i].classList.contains('footer-wordmark') ? clamp01(1 - (max - y) / (vh * 0.45)) : clamp01((vh - r.top) / (vh * 0.55));
      els[i].style.setProperty('--e', e.toFixed(4));
      els[i].style.setProperty('--p', clamp01((vh - r.top) / (vh + r.height)).toFixed(4));
    });

    // stacking cards: as card i+1 slides up over card i, card i recedes
    stack.forEach((_, i) => {
      const next = stack[i + 1];
      const q = next === undefined ? 0 : clamp01((vh - next) / (vh - stickyTop));
      stackCards[i].style.setProperty('--q', q.toFixed(4));
    });

    // horizontal product gallery
    if (horizontal && track) {
      const p = clamp01((y - pinTop) / Math.max(hDistance, 1));
      track.style.transform = `translate3d(${(-p * hDistance).toFixed(1)}px, 0, 0)`;
      if (hBar) hBar.style.transform = `scaleX(${(0.25 + p * 0.75).toFixed(4)})`;
      const n = Math.min(hCards.length, 1 + Math.round(p * (hCards.length - 1)));
      if (hCount && n !== lastCount) {
        hCount.textContent = String(n).padStart(2, '0');
        lastCount = n;
      }
      cardRects.forEach((r, i) => {
        const x = (r.left + r.width / 2 - vw / 2) / vw; // -1..1 across the screen
        hCards[i].style.setProperty('--x', Math.max(-1.2, Math.min(1.2, x)).toFixed(4));
      });
    }
  }

  layout();
  let t = 0;
  const relayout = () => {
    cancelAnimationFrame(t);
    t = requestAnimationFrame(() => {
      layout();
      update(window.scrollY);
    });
  };
  window.addEventListener('resize', relayout);
  wide.addEventListener('change', relayout);
  window.addEventListener('load', relayout);
  document.fonts?.ready.then(relayout);
  // business cards: pointer tilt + glare
  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('.fan-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const yy = (e.clientY - r.top) / r.height;
        card.style.setProperty('--tx', ((x - 0.5) * 12).toFixed(2) + 'deg');
        card.style.setProperty('--ty', ((0.5 - yy) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (yy * 100).toFixed(1) + '%');
        card.classList.add('is-hover');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-hover');
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
      });
    });
  }
  return { update, relayout };
}
