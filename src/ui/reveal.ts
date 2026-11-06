/**
 * Scroll reveals: .reveal elements fade and slide up as they enter; headings ([data-split])
 * rise word by word out of a mask. Items that enter together are staggered. Driven from the
 * scroll loop so it stays reliable inside transformed elements.
 */
let pending: HTMLElement[] = [];

function show(el: HTMLElement, delay: number) {
  el.style.transitionDelay = `${delay}ms`;
  el.classList.add('is-shown');
  // drop the stagger once it has played, so hover effects respond immediately
  window.setTimeout(() => (el.style.transitionDelay = ''), delay + 1000);
}

export function checkReveals() {
  if (!pending.length) return;
  const vh = window.innerHeight;
  let k = 0;
  pending = pending.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.9) {
      show(el, r.bottom > 0 ? Math.min(k++, 6) * 90 : 0);
      return false;
    }
    return true;
  });
}

export function initReveals() {
  pending = [...document.querySelectorAll<HTMLElement>('.reveal, [data-split], .accomplishments li')];
  checkReveals();
}
