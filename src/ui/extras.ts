/** Split-flap ("trading board") stats: digits flip through a few values, then settle. */
export function initFlaps({ reducedMotion }: { reducedMotion: boolean }) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (reducedMotion) return;
        [...e.target.querySelectorAll<HTMLElement>('i')].forEach((d, k) => {
          const final = d.textContent!;
          const flips = 8 + k * 4;
          let n = 0;
          const step = () => {
            n++;
            d.textContent = n >= flips ? final : String(Math.floor(Math.random() * 10));
            d.classList.remove('flip');
            void d.offsetWidth;
            d.classList.add('flip');
            if (n < flips) setTimeout(step, 70);
          };
          setTimeout(step, 200 + k * 90);
        });
      }),
    { threshold: 0.6 }
  );
  document.querySelectorAll('.flap').forEach((f) => io.observe(f));
}
