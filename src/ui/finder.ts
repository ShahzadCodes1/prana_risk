/**
 * Insurance estimate tool (coverage finder): three short steps that turn a visitor's answers
 * into a checklist of coverages, using the coverage names listed on this page. No prices.
 * "Get a Quote for These" fills the quote form's message box and scrolls to it.
 */
const BASE: Record<string, string[]> = {
  home: [],
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

/**
 * Typical annual cost per coverage, from published 2026 averages (not quotes):
 * NerdWallet (NYC condo, Jul 2026), ValuePenguin (NY homeowners Sep 2026, NYC auto Oct 2026,
 * $1M umbrella Jul 2026, $500k 20-year term life ages 30-50 Sep 2026, NY Silver plan age 40 2026),
 * Insureon small-business medians (Feb-Jul 2026), Medicare.gov (2026 standard Part B premium).
 * Anything without a reliable published figure is priced on review.
 */
const PRICES: Record<string, [number, number]> = {
  'Co-op & Condo': [610, 610],
  'Home & Brownstone': [1339, 1339],
  Auto: [5220, 5220],
  Umbrella: [150, 350],
  'General Liability': [538, 538],
  'Errors & Omissions': [1056, 1056],
  'Workers Compensation': [648, 648],
  'Employment Practices': [3084, 3084],
  'Commercial Property': [1296, 1296],
  'Directors & Officers': [1596, 1596],
  'Term Life': [336, 1416],
  'Individual Health': [13080, 13080],
  Medicare: [2435, 2435],
};
const BUSINESS_PRICES: Record<string, [number, number]> = { Cyber: [1548, 1548], Umbrella: [1032, 1032] };
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const range = ([lo, hi]: [number, number]) => (lo === hi ? usd(lo) : `${usd(lo)}–${usd(hi)}`);
const per = (r: [number, number]) => `${range(r)}/yr`;

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
  const total = root.querySelector<HTMLElement>('[data-result-total]')!;
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
    let lo = 0;
    let hi = 0;
    let review = 0;
    const lines: string[] = [];
    list.replaceChildren(
      ...items.map((i) => {
        const price = (t === 'business' && BUSINESS_PRICES[i]) || PRICES[i];
        const li = document.createElement('li');
        const name = document.createElement('span');
        const cost = document.createElement('b');
        name.textContent = i;
        if (price) {
          lo += price[0];
          hi += price[1];
          cost.textContent = per(price);
        } else {
          review++;
          cost.textContent = 'Priced on review';
          cost.className = 'is-review';
        }
        lines.push(`${i} (${cost.textContent})`);
        li.append(name, cost);
        return li;
      }),
    );
    const est = lo ? `${range([lo, hi])} per year (about ${range([lo / 12, hi / 12])} a month)` : '';
    total.hidden = !lo;
    total.querySelector('b')!.textContent = est;
    total.querySelector('small')!.textContent = review
      ? `Plus ${review} ${review > 1 ? 'items' : 'item'} we price once we know your details.`
      : '';
    summary = `Insurance estimate tool: ${head} - ${lines.join(', ')}.${est ? ` Expected total: ${est}.` : ''}`;
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
