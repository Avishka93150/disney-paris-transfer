/** Departure filter on the prices page: show one panel, restyle the pills. */

const ACTIVE = ['border-brand', 'bg-brand', 'text-surface'];
const INACTIVE = ['border-line', 'bg-surface', 'text-ink'];

for (const root of document.querySelectorAll<HTMLElement>('[data-prices-tables]')) {
  const pills = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-prices-filter]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-prices-panel]'));

  const select = (id: string) => {
    for (const pill of pills) {
      const active = pill.dataset.pricesFilter === id;
      pill.setAttribute('aria-pressed', String(active));
      pill.classList.remove(...ACTIVE, ...INACTIVE);
      pill.classList.add(...(active ? ACTIVE : INACTIVE));
    }
    for (const panel of panels) panel.hidden = panel.dataset.pricesPanel !== id;
  };

  for (const pill of pills) {
    pill.addEventListener('click', () => select(pill.dataset.pricesFilter ?? ''));
  }
}
