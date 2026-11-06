/**
 * Loading screen. The critical CSS in index.html keeps everything except this screen
 * invisible, so no unstyled HTML is ever painted. We wait for the stylesheet, the web
 * fonts and the hero photo (with a minimum time for the logo to draw and a hard cap so
 * a slow network never traps the visitor), then lift the screen away.
 */
export function runPreloader({ reducedMotion }: { reducedMotion: boolean }) {
  const root = document.documentElement;
  const el = document.getElementById('preloader')!;
  const bar = el.querySelector<HTMLElement>('.preloader-bar i')!;
  const count = el.querySelector<HTMLElement>('.preloader-count')!;
  const heroImg = document.getElementById('hero-img') as HTMLImageElement | null;

  const tasks: Promise<unknown>[] = [
    document.fonts?.ready ?? Promise.resolve(),
    heroImg ? (heroImg.complete ? Promise.resolve() : heroImg.decode().catch(() => undefined)) : Promise.resolve(),
  ];
  const minTime = reducedMotion ? 300 : 1200;
  const maxTime = 7000;
  const t0 = performance.now();
  let done = 0;
  let shown = 0;
  let target = 0;

  const paint = () => {
    shown += (target - shown) * 0.12;
    if (target - shown < 0.002) shown = target;
    bar.parentElement!.style.setProperty('--p', shown.toFixed(3));
    bar.style.transform = `scaleX(${shown.toFixed(3)})`;
    count.textContent = `${Math.round(shown * 100)}%`;
    if (shown < 1) requestAnimationFrame(paint);
  };
  requestAnimationFrame(paint);

  // progress is a blend of finished tasks and elapsed time, so it never stalls visually
  const tick = setInterval(() => {
    const time = Math.min(1, (performance.now() - t0) / minTime);
    target = Math.min(0.96, done / tasks.length * 0.7 + time * 0.3);
  }, 60);
  tasks.forEach((p) => p.then(() => done++));

  const ready = Promise.all(tasks);
  const min = new Promise((r) => setTimeout(r, minTime));
  const cap = new Promise((r) => setTimeout(r, maxTime));

  return Promise.race([Promise.all([ready, min]), cap]).then(
    () =>
      new Promise<void>((resolve) => {
        clearInterval(tick);
        target = 1;
        requestAnimationFrame(paint);
        setTimeout(() => {
          root.classList.add('is-ready'); // page becomes visible underneath
          el.classList.add('is-leaving'); // screen lifts away (slide up), revealing the hero
          el.setAttribute('aria-hidden', 'true');
          const finish = () => {
            el.remove();
            resolve();
          };
          if (reducedMotion) finish();
          else el.addEventListener('transitionend', finish, { once: true });
          setTimeout(finish, 1400); // safety
        }, reducedMotion ? 0 : 380);
      })
  );
}
