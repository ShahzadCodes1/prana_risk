import './styles/base.css';
import './styles/header.css';
import './styles/site.css';
import './styles/founder.css';
import './styles/proof.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/fixes.css';
import Lenis from 'lenis';
import { runPreloader } from './ui/preloader';
import { initReveals, checkReveals } from './ui/reveal';
import { initHeader } from './ui/header';
import { initHero } from './ui/hero';
import { initScrollFx } from './ui/scroll-fx';
import { initFlaps } from './ui/extras';
import { initProof } from './ui/proof';
import { initContact } from './ui/contact';
import { initFinder } from './ui/finder';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth wheel scrolling on desktop only; touch devices keep native momentum scrolling.
const lenis = reducedMotion ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, syncTouch: false });
lenis?.stop(); // no scrolling under the loading screen
// a reload always starts at the hero (no restored scroll position, no jump to a #hash)
window.scrollTo(0, 0);
lenis?.scrollTo(0, { immediate: true, force: true });

function navigate(hash: string) {
  if (hash === '#top' || hash === '#') {
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    return;
  }
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return; // section not built: stay put rather than jump somewhere misleading
  // the header is always in its compact (scrolled) state once we land below the hero
  const compact = window.matchMedia('(max-width: 600px)').matches ? 64 : 68;
  const offset = -compact + 1;
  lenis ? lenis.scrollTo(target, { offset }) : window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reducedMotion ? 'auto' : 'smooth' });
}

const header = initHeader(navigate);
const hero = initHero({ reducedMotion });
const fx = initScrollFx({ reducedMotion });
initFlaps({ reducedMotion });
initProof({ reducedMotion });
initContact({ reducedMotion });
initFinder();

const heroEl = document.getElementById('top')!;
const headerEl = document.querySelector<HTMLElement>('.site-header')!;
function onScroll(y: number) {
  header.setScrolled(y);
  // white header while it sits over the dark hero frame
  headerEl.classList.toggle('on-dark', y < heroEl.offsetHeight - headerEl.offsetHeight - 10);
  fx.update(y);
  checkReveals();
}

if (lenis) {
  lenis.on('scroll', () => onScroll(lenis.scroll));
  const raf = (t: number) => {
    lenis.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
} else {
  window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
}
window.addEventListener('resize', () => onScroll(window.scrollY));
onScroll(window.scrollY);

runPreloader({ reducedMotion }).then(() => {
  lenis?.start();
  hero.start();
  initReveals();
  fx.relayout();
});

if (import.meta.env.DEV) {
  (window as any).__lenis = lenis;
  (window as any).__scrollTo = (y: number) => {
    lenis?.stop();
    window.scrollTo(0, y);
    onScroll(y);
  };
}
