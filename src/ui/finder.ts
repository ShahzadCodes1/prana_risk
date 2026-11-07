/**
 * Insurance estimate tool (coverage finder): three short steps that turn a visitor's answers
 * into a checklist of coverages, using the coverage names listed on this page. No prices.
 * "Get a Quote for These" fills the quote form's message box and scrolls to it.
 */
const BASE: Record<string, string[]> = {
  home: ['Personal Property & Liability'],
  business: ['General Liability'],
  life: [],
  health: [],
};
const TITLES: Record<string, string> = {
  home: 'Home & Property',
  business: 'Business & Commercial',
  life: 'Life & Disability',
  health: 'Health Insurance',
};
const HOME_TYPE: Record<string, string> = {
  'NYC Condo': 'Co-op & Condo',
  'NYC Co-op': 'Co-op & Condo',
  'NYC Brownstone': 'Home & Brownstone',
  'NYC Home': 'Home & Brownstone',
};

export function initFinder() {
  const root = document.querySelector<HTMLElement>('[data-finder]');
  if (!root) return;
  const steps = [...root.querySelectorAll<HTMLElement>('.finder-step')];
  const bars = [...root.querySelectorAll<HTMLElement>('.finder-progress span')];
  const label = root.querySelector<HTMLElement>('[data-step-n]')!;
  const err = root.querySelector<HTMLElement>('[data-finder-error]')!;
  const back = root.querySelector<HTMLButtonElement>('[data-back]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const quote = root.querySelector<HTMLAnchorElement>('[data-quote]')!;
  const title = root.querySelector<HTMLElement>('[data-result-title]')!;
  const list = root.querySelector<HTMLElement>('[data-result-list]')!;
  let step = 1;
  let summary = '';

  const type = () => root.querySelector<HTMLInputElement>('input[name="fi-type"]:checked')?.value ?? '';
  const panel = (n: number) =>
    steps.find((s) => s.dataset.step === String(n) && (n !== 2 || s.dataset.for === type()))!;

  function show(n: number, focus = true) {
    step = n;
    steps.forEach((s) => (s.hidden = s !== panel(n)));
    bars.forEach((b, i) => b.classList.toggle('is-on', i < n));
    label.textContent = `Step ${n} of 3`;
    back.hidden = n === 1;
    next.hidden = n === 3;
    quote.hidden = n !== 3;
    err.hidden = true;
    if (focus) (n === 3 ? panel(3) : panel(n).querySelector<HTMLInputElement>('input'))?.focus({ preventScroll: true });
  }

  function fail(msg: string) {
    err.textContent = msg;
    err.hidden = false;
  }

  function build() {
    const t = type();
    const p = panel(2);
    const picked = p.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.value;
    const checks = [...p.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')].flatMap((c) => c.value.split('|'));
    let items = [...BASE[t]];
    let head = TITLES[t];
    if (t === 'home' && picked) {
      head = picked;
      items.push(HOME_TYPE[picked]);
    }
    if (t === 'health' && picked) items.push(picked === 'Medicare' ? 'Medicare' : `${picked} Health`);
    items = [...new Set([...items, ...checks])];
    title.textContent = head;
    list.replaceChildren(
      ...items.map((i) => {
        const li = document.createElement('li');
        li.textContent = i;
        return li;
      }),
    );
    summary = `Insurance estimate tool: ${head} - ${items.join(', ')}.`;
  }

  next.addEventListener('click', () => {
    if (step === 1) {
      if (!type()) return fail('Please choose what you would like to protect.');
      return show(2);
    }
    const p = panel(2);
    const radios = p.querySelectorAll('input[type="radio"]');
    if (radios.length && !p.querySelector('input[type="radio"]:checked')) return fail('Please choose one option.');
    if (!radios.length && !p.querySelector('input:checked')) return fail('Please tick at least one option.');
    build();
    show(3);
  });
  back.addEventListener('click', () => show(step - 1));
  root.addEventListener('change', () => (err.hidden = true));

  // hand the checklist to the quote form (the header's anchor handler does the scrolling)
  quote.addEventListener('click', () => {
    const msg = document.getElementById('f-message') as HTMLTextAreaElement | null;
    if (!msg) return;
    const prev = msg.dataset.finder;
    if (!msg.value.trim() || msg.value.trim() === prev) msg.value = summary;
    else if (!msg.value.includes(summary)) msg.value = `${summary}\n\n${msg.value}`;
    msg.dataset.finder = summary;
    msg.dispatchEvent(new Event('input', { bubbles: true }));
  });

  show(1, false);
}
