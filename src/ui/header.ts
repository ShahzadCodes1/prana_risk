/** Header: scrolled state, mobile menu (focus-trapped, Escape to close). */
export function initHeader(onNavigate: (hash: string) => void) {
  const header = document.getElementById('site-header')!;
  const toggle = header.querySelector<HTMLButtonElement>('.menu-toggle')!;
  const label = toggle.querySelector('.sr-only')!;
  const menu = document.getElementById('mobile-menu')!;
  const root = document.documentElement;
  let open = false;
  let closeTimer = 0;

  const setScrolled = (y: number) => header.classList.toggle('is-scrolled', y > 24);

  function setOpen(next: boolean) {
    if (open === next) return;
    open = next;
    window.clearTimeout(closeTimer);
    if (next) {
      menu.hidden = false;
      // next frame so the clip-path transition runs
      requestAnimationFrame(() => root.classList.add('menu-open'));
      menu.querySelectorAll<HTMLElement>('li a').forEach((a, i) => (a.style.transitionDelay = `${0.12 + i * 0.05}s`));
      menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    } else {
      root.classList.remove('menu-open');
      menu.querySelectorAll<HTMLElement>('li a').forEach((a) => (a.style.transitionDelay = '0s'));
      closeTimer = window.setTimeout(() => (menu.hidden = true), 700);
      toggle.focus({ preventScroll: true });
    }
    toggle.setAttribute('aria-expanded', String(next));
    label.textContent = next ? 'Close menu' : 'Open menu';
  }

  toggle.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') {
      // keep focus inside menu + toggle
      const items = [toggle, ...menu.querySelectorAll<HTMLElement>('a')];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (m) => m.matches && setOpen(false));

  // in-page navigation
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href')!;
    e.preventDefault();
    if (open) setOpen(false);
    onNavigate(hash);
  });

  return { setScrolled };
}
