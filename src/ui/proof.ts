/**
 * Client reviews: a 3D coverflow. The focused review faces you; neighbours turn away into
 * depth. Arrows, swipe/drag, keyboard and a gentle autoplay that pauses on hover or focus.
 */
export function initProof({ reducedMotion }: { reducedMotion: boolean }) {
  const section = document.getElementById('reviews')!;
  const flow = section.querySelector<HTMLElement>('.coverflow')!;
  const cards = [...flow.querySelectorAll<HTMLElement>('.cf-card')];
  const bar = section.querySelector<HTMLElement>('.reviews-progress i')!;
  const [prev, next] = [...section.querySelectorAll<HTMLButtonElement>('.reviews-arrows button')];
  let index = 0;
  let timer = 0;
  let paused = false;

  function render() {
    const narrow = window.innerWidth < 700;
    cards.forEach((card, i) => {
      let d = i - index;
      // wrap around so the ring feels endless
      if (d > cards.length / 2) d -= cards.length;
      if (d < -cards.length / 2) d += cards.length;
      const a = Math.abs(d);
      const x = d * (narrow ? 78 : 56);
      const z = -a * (narrow ? 260 : 220);
      const ry = Math.max(-55, Math.min(55, -d * 38));
      card.style.transform = `translate(-50%, 0) translateX(${x}%) translateZ(${z}px) rotateY(${ry}deg)`;
      // the focused card and its direct neighbours stay fully opaque (readable text); further ones are hidden
      card.style.opacity = a > 1 ? '0' : '1';
      card.style.zIndex = String(100 - a);
      card.classList.toggle('is-active', d === 0);
      card.setAttribute('aria-hidden', String(d !== 0));
    });
    bar.style.width = `${100 / cards.length}%`;
    bar.style.transform = `translateX(${index * 100}%)`;
  }
  const go = (dir: number) => {
    index = (index + dir + cards.length) % cards.length;
    render();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  cards.forEach((c, i) => c.addEventListener('click', () => i !== index && ((index = i), render())));
  flow.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  // swipe / drag
  let sx = 0;
  let dragging = false;
  flow.addEventListener('pointerdown', (e) => {
    sx = e.clientX;
    dragging = true;
  });
  window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });

  // autoplay while in view, paused on hover / focus
  const tick = () => {
    if (!paused) go(1);
  };
  if (!reducedMotion) {
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(tick, 5200);
    }).observe(flow);
  }
  section.addEventListener('pointerenter', () => (paused = true));
  section.addEventListener('pointerleave', () => (paused = false));
  section.addEventListener('focusin', () => (paused = true));
  section.addEventListener('focusout', () => (paused = false));
  window.addEventListener('resize', render);
  render();
}
