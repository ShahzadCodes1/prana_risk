/**
 * Hero: a cinematic frame. Four photos (Wall Street, Condo, Brownstone, Business) switch
 * from the round thumbnails or on a gentle autoplay. The new photo opens in a circle that
 * grows from its thumbnail, the giant outlined word drops out and waves back in letter by
 * letter, and the glass card updates.
 */
const SLIDES = [
  { word: 'WALL STREET', card: 'Your broker on Wall Street, New York City', href: '#reach' },
  { word: 'CONDO', card: 'NYC condo & co-op insurance', href: '#products' },
  { word: 'BROWNSTONE', card: 'NYC brownstone & home insurance', href: '#products' },
  { word: 'BUSINESS', card: 'Customized business & commercial insurance', href: '#coverage' },
];

function letters(el: HTMLElement, text: string, state: 'in' | 'below') {
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = `cl ${state === 'below' ? 'is-below' : ''}`;
    s.style.setProperty('--i', String(i));
    s.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(s);
  });
}

export function initHero({ reducedMotion }: { reducedMotion: boolean }) {
  const section = document.getElementById('top')!;
  const slides = [...section.querySelectorAll<HTMLElement>('.hero-slide')];
  const thumbs = [...section.querySelectorAll<HTMLButtonElement>('.hero-thumb')];
  const word = section.querySelector<HTMLElement>('[data-word]')!;
  const card = section.querySelector<HTMLAnchorElement>('[data-card]')!;
  const cardText = section.querySelector<HTMLElement>('[data-card-text]')!;
  const index = section.querySelector<HTMLElement>('[data-index]')!;
  let current = 0;
  let busy = false;
  let timer = 0;
  let visible = true;
  let hovering = false;

  letters(word, SLIDES[0].word, 'below');

  function go(n: number, from?: HTMLElement) {
    if (n === current || busy) return;
    busy = true;
    const prev = slides[current];
    const next = slides[n];
    // circle grows from the thumbnail (or from the right edge for autoplay)
    const fr = section.getBoundingClientRect();
    const src = (from ?? thumbs[n]).getBoundingClientRect();
    const cx = ((src.left + src.width / 2 - fr.left) / fr.width) * 100;
    const cy = ((src.top + src.height / 2 - fr.top) / fr.height) * 100;
    next.style.setProperty('--cx', `${cx}%`);
    next.style.setProperty('--cy', `${cy}%`);
    next.classList.remove('is-prev');
    next.classList.add('is-entering');
    prev.classList.add('is-prev');
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add('is-active')));
    const done = () => {
      prev.classList.remove('is-active', 'is-prev');
      next.classList.remove('is-entering');
      busy = false;
    };
    reducedMotion ? done() : setTimeout(done, 1300);

    // giant word: letters drop out, the new word waves in
    word.classList.add('is-out');
    setTimeout(() => {
      letters(word, SLIDES[n].word, 'below');
      word.classList.remove('is-out');
      requestAnimationFrame(() => requestAnimationFrame(() => word.querySelectorAll('.cl').forEach((l) => l.classList.remove('is-below'))));
    }, reducedMotion ? 0 : 420);

    card.classList.add('is-swapping');
    setTimeout(() => {
      cardText.textContent = SLIDES[n].card;
      card.href = SLIDES[n].href;
      index.textContent = String(n + 1).padStart(2, '0');
      card.classList.remove('is-swapping');
    }, reducedMotion ? 0 : 350);

    thumbs.forEach((t, i) => {
      t.classList.toggle('is-active', i === n);
      t.setAttribute('aria-selected', String(i === n));
    });
    current = n;
    restart();
  }

  function restart() {
    clearTimeout(timer);
    if (reducedMotion) return;
    // re-trigger the progress ring on the active thumbnail
    thumbs.forEach((t) => t.classList.remove('is-timing'));
    void section.offsetWidth;
    if (visible && !hovering) {
      thumbs[current].classList.add('is-timing');
      // each photo holds for 2 s once its 1.3 s circle reveal has finished
      timer = window.setTimeout(() => go((current + 1) % slides.length), 3300);
    }
  }

  thumbs.forEach((t, i) => t.addEventListener('click', () => go(i, t)));
  const rail = section.querySelector<HTMLElement>('.hero-thumbs')!;
  rail.addEventListener('pointerenter', () => ((hovering = true), restart()));
  rail.addEventListener('pointerleave', () => ((hovering = false), restart()));
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    restart();
  }, { threshold: 0.3 }).observe(section);

  return {
    start() {
      section.classList.add('is-in');
      setTimeout(() => word.querySelectorAll('.cl').forEach((l) => l.classList.remove('is-below')), reducedMotion ? 0 : 500);
      restart();
    },
  };
}
