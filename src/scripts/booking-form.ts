import type { Extra, Package } from '@/lib/catalog';
import { computeEstimate, renderEstimateBox, type EstimateLabels } from '@/lib/estimate';
import { fill } from '@/lib/i18n/fill';
import { isZoneId, type NightRule, type TripType, type Vehicle } from '@/lib/prices';

/**
 * Behaviour of `BookingForm.astro`: three steps, a live estimate that mirrors
 * the server's quote, submission to `/api/booking`, then the optional Stripe
 * Checkout hand-off.
 *
 * Without JavaScript the form still posts to `/api/booking` as a classic
 * form; the API answers with a plain confirmation page in that case.
 */

type Config = {
  locale: string;
  rates: Record<string, readonly number[]>;
  night: NightRule;
  vehicles: Vehicle[];
  packages: Package[];
  extras: Extra[];
  labels: EstimateLabels;
  text: { submit: string; submitting: string; payCta: string; packageUpTo: string };
};

type PaymentOffer = { enabled: boolean; amountCents: number; mode: 'full' | 'deposit' };
type BookingResponse = {
  ok: boolean;
  reference?: string | null;
  quotedCents?: number | null;
  payment?: PaymentOffer | null;
};

for (const root of document.querySelectorAll<HTMLElement>('[data-booking]')) {
  const configNode = root.querySelector<HTMLScriptElement>('[data-booking-config]');
  const form = root.querySelector<HTMLFormElement>('[data-booking-form]');
  if (!configNode?.textContent || !form) continue;
  const config = JSON.parse(configNode.textContent) as Config;

  const field = <T extends HTMLElement = HTMLInputElement>(name: string) =>
    form.querySelector<T>(`[name="${name}"]`);
  const value = (name: string) => field<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name)?.value ?? '';

  const panels = Array.from(form.querySelectorAll<HTMLElement>('[data-step-panel]'));
  const bars = Array.from(form.querySelectorAll<HTMLElement>('[data-step-bar]'));
  const labels = Array.from(form.querySelectorAll<HTMLElement>('[data-step-label]'));
  const back = form.querySelector<HTMLButtonElement>('[data-booking-back]');
  const next = form.querySelector<HTMLButtonElement>('[data-booking-next]');
  const submit = form.querySelector<HTMLButtonElement>('[data-booking-submit]');
  const samePlaceNote = form.querySelector<HTMLElement>('[data-same-place]');
  const estimateBox = form.querySelector<HTMLElement>('[data-booking-estimate]');
  const errorNote = form.querySelector<HTMLElement>('[data-booking-error]');
  const packageSelect = field<HTMLSelectElement>('package');
  const extraInputs = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-extra]'));

  const success = root.querySelector<HTMLElement>('[data-booking-success]');
  const refNode = root.querySelector<HTMLElement>('[data-booking-ref]');
  const payBox = root.querySelector<HTMLElement>('[data-booking-pay]');
  const payButton = root.querySelector<HTMLButtonElement>('[data-booking-pay-btn]');

  let step = Number(form.dataset.step ?? 0);
  let reference: string | null = null;

  const chosenExtras = (): Record<string, number> => {
    const chosen: Record<string, number> = {};
    for (const input of extraInputs) {
      const slug = input.dataset.extra ?? '';
      chosen[slug] = input instanceof HTMLInputElement ? (input.checked ? 1 : 0) : Number(input.value);
    }
    return chosen;
  };

  const samePlace = () => isZoneId(value('to')) && value('from') === value('to');

  const renderSteps = () => {
    panels.forEach((panel) => (panel.hidden = Number(panel.dataset.stepPanel) !== step));
    bars.forEach((bar, index) => {
      bar.classList.toggle('bg-brand', index <= step);
      bar.classList.toggle('bg-line', index > step);
    });
    labels.forEach((label, index) => {
      label.classList.toggle('text-brand', index === step);
      label.classList.toggle('text-ink-mute', index !== step);
    });
    if (back) back.hidden = step === 0;
    if (next) {
      next.hidden = step === 2;
      next.disabled = samePlace();
    }
    if (submit) submit.hidden = step !== 2;
    if (samePlaceNote) samePlaceNote.hidden = !(samePlace() && step === 0);
  };

  const renderPackages = () => {
    if (!packageSelect) return;
    const pax = Number(value('pax'));
    for (const option of Array.from(packageSelect.options)) {
      const max = Number(option.dataset.maxPax ?? Infinity);
      option.disabled = option.value !== '' && max < pax;
    }
    const current = packageSelect.selectedOptions[0];
    const slug = current && !current.disabled ? packageSelect.value : '';
    form.querySelectorAll<HTMLElement>('[data-package-info]').forEach((info) => {
      info.hidden = info.dataset.packageInfo !== slug || slug === '';
    });
  };

  const renderEstimate = () => {
    if (!estimateBox) return;
    const estimate = computeEstimate({
      packages: config.packages,
      packageSlug: value('package'),
      vehicle: value('vehicle'),
      from: value('from'),
      to: value('to'),
      pax: Number(value('pax')),
      trip: (value('trip') === 'rt' ? 'rt' : 'ow') as TripType,
      rates: config.rates,
      time: value('time'),
      night: config.night,
      vehicles: config.vehicles,
      extras: config.extras,
      chosenExtras: chosenExtras(),
    });
    estimateBox.innerHTML = renderEstimateBox(estimate, config.labels, config.night);
  };

  const render = () => {
    renderPackages();
    renderEstimate();
    renderSteps();
  };

  form.addEventListener('change', render);
  form.addEventListener('input', (event) => {
    if ((event.target as HTMLElement).getAttribute('name') === 'time') render();
  });

  back?.addEventListener('click', () => {
    step = Math.max(0, step - 1);
    renderSteps();
  });
  next?.addEventListener('click', () => {
    if (samePlace()) return;
    step = Math.min(2, step + 1);
    renderSteps();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (step !== 2) {
      if (!samePlace()) {
        step = Math.min(2, step + 1);
        renderSteps();
      }
      return;
    }
    if (!form.reportValidity()) return;

    if (errorNote) errorNote.hidden = true;
    if (submit) {
      submit.disabled = true;
      submit.textContent = config.text.submitting;
    }

    const payload = {
      locale: config.locale,
      from: value('from'),
      to: value('to'),
      trip: value('trip'),
      pax: Number(value('pax')),
      vehicle: value('vehicle'),
      bags: Number(value('bags') || 0),
      childSeats: Number(value('childSeats') || 0),
      date: value('date'),
      time: value('time'),
      flight: value('flight'),
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      message: value('message'),
      packageSlug: value('package'),
      extras: chosenExtras(),
      website: value('website'),
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as BookingResponse;
      if (!response.ok || !data.ok) throw new Error('booking_failed');

      reference = data.reference ?? null;
      if (refNode) refNode.textContent = reference ?? '';
      if (payBox && payButton && data.payment?.enabled) {
        payButton.textContent = fill(config.text.payCta, { price: Math.round(data.payment.amountCents / 100) });
        payBox.hidden = false;
      }
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    } catch {
      if (errorNote) errorNote.hidden = false;
      if (submit) {
        submit.disabled = false;
        submit.textContent = config.text.submit;
      }
    }
  });

  payButton?.addEventListener('click', async () => {
    if (!reference) return;
    payButton.disabled = true;
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const data = (await response.json()) as { ok: boolean; url?: string };
      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // fall through: re-enable the button
    }
    payButton.disabled = false;
  });

  render();
}
