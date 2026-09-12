import { computeCalculator, type CalcConfig, type CalcState } from '@/lib/calculator';
import type { TripType } from '@/lib/prices';

/**
 * Behaviour of `PriceCalculator.astro`: read the controls, recompute the
 * view-model with the same function the server used, patch the DOM.
 */

const ACTIVE = ['border-brand', 'bg-sand'];
const INACTIVE = ['border-line', 'bg-surface'];
const FITS = ['cursor-pointer'];
const TOO_SMALL = ['cursor-not-allowed', 'opacity-45'];

function swap(el: Element, on: string[], off: string[]) {
  el.classList.remove(...off);
  el.classList.add(...on);
}

for (const root of document.querySelectorAll<HTMLElement>('[data-calc]')) {
  const configNode = root.querySelector<HTMLScriptElement>('[data-calc-config]');
  if (!configNode?.textContent) continue;
  const config = JSON.parse(configNode.textContent) as CalcConfig;

  const input = (name: string) => root.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`);
  const vehicleButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-calc-vehicle]'));
  const summary = root.querySelector<HTMLElement>('[data-calc-summary]');
  const price = root.querySelector<HTMLElement>('[data-calc-price]');
  const nightLine = root.querySelector<HTMLElement>('[data-calc-night-line]');
  const nightNote = root.querySelector<HTMLElement>('[data-calc-night-note]');
  const book = root.querySelector<HTMLAnchorElement>('[data-calc-book]');
  const whatsapp = root.querySelector<HTMLAnchorElement>('[data-calc-wa]');

  let vehicleId = vehicleButtons.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.calcVehicle ?? 'saloon';

  const readState = (): CalcState => ({
    from: input('from')?.value ?? 'cdg',
    to: input('to')?.value ?? 'disney',
    pax: Number(input('pax')?.value ?? 2),
    trip: (input('trip')?.value === 'rt' ? 'rt' : 'ow') as TripType,
    vehicleId,
    time: input('time')?.value ?? '',
  });

  const render = () => {
    const view = computeCalculator(readState(), config);

    for (const button of vehicleButtons) {
      const option = view.options.find((o) => o.id === button.dataset.calcVehicle);
      if (!option) continue;
      button.disabled = !option.fits;
      button.setAttribute('aria-pressed', String(option.active));
      swap(button, option.active ? ACTIVE : INACTIVE, option.active ? INACTIVE : ACTIVE);
      swap(button, option.fits ? FITS : TOO_SMALL, option.fits ? TOO_SMALL : FITS);
      const priceNode = button.querySelector<HTMLElement>('[data-calc-vehicle-price]');
      if (priceNode) priceNode.textContent = option.priceLabel;
    }

    if (summary) summary.textContent = view.summaryLabel;
    if (price) price.textContent = view.priceLabel;
    if (nightLine) {
      nightLine.hidden = view.nightLine == null;
      nightLine.textContent = view.nightLine ?? '';
    }
    if (nightNote) nightNote.hidden = !view.showNightNote;
    if (book) book.href = view.bookingUrl;
    if (whatsapp) whatsapp.href = view.whatsappUrl;
  };

  root.addEventListener('change', render);
  root.addEventListener('input', (event) => {
    if ((event.target as HTMLElement).getAttribute('name') === 'time') render();
  });
  for (const button of vehicleButtons) {
    button.addEventListener('click', () => {
      vehicleId = button.dataset.calcVehicle ?? vehicleId;
      render();
    });
  }
}
