/**
 * The few live touches of the back office. Everything is already correct
 * without JavaScript (the pages re-render from the server after each save);
 * this only keeps the previews in step while the admin types.
 */

/* ── Vehicles: "€80 becomes …" preview ───────────────────────────────────── */

for (const form of document.querySelectorAll<HTMLFormElement>('[data-vehicles-form]')) {
  const base = Number(form.dataset.example ?? 80);
  form.querySelectorAll<HTMLInputElement>('[data-vehicle-mult]').forEach((input) => {
    const target = form.querySelector<HTMLElement>(`[data-vehicle-example="${input.dataset.vehicleMult}"]`);
    if (!target) return;
    input.addEventListener('input', () => {
      const mult = Number.parseFloat(input.value.replace(',', '.'));
      target.textContent = Number.isFinite(mult) ? `${Math.round(base * mult)} €` : '—';
    });
  });
}

/* ── Add-ons: "charged per unit" hint ────────────────────────────────────── */

for (const form of document.querySelectorAll<HTMLFormElement>('[data-extra-form]')) {
  const hint = form.querySelector<HTMLElement>('[data-extra-hint]');
  const perUnit = form.querySelector<HTMLInputElement>('[name="perUnit"]');
  const maxQty = form.querySelector<HTMLInputElement>('[name="maxQty"]');
  const price = form.querySelector<HTMLInputElement>('[name="price"]');
  if (!hint || !perUnit || !maxQty || !price) continue;

  const update = () => {
    hint.textContent = perUnit.checked
      ? `Charged for each unit chosen — ${maxQty.value} × ${price.value || '0'} € at most.`
      : 'Charged once, whatever quantity the customer picks.';
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
}

/* ── Settings: night window and Stripe switch ────────────────────────────── */

for (const form of document.querySelectorAll<HTMLFormElement>('[data-settings-form]')) {
  const nightToggle = form.querySelector<HTMLInputElement>('[data-night-toggle]');
  const nightFields = form.querySelector<HTMLFieldSetElement>('[data-night-fields]');
  const summary = form.querySelector<HTMLElement>('[data-night-summary]');
  const start = form.querySelector<HTMLInputElement>('[name="nightStart"]');
  const end = form.querySelector<HTMLInputElement>('[name="nightEnd"]');
  const percent = form.querySelector<HTMLInputElement>('[name="nightSurchargePercent"]');

  const renderNight = () => {
    if (nightToggle && nightFields) nightFields.disabled = !nightToggle.checked;
    if (!summary || !start || !end || !percent) return;
    const p = Number(percent.value) || 0;
    const example = Math.round(80 * (1 + p / 100));
    const s = start.value || '—';
    const e = end.value || '—';
    // A window that ends at or before it starts runs through midnight.
    const wraps = end.value <= start.value;
    summary.innerHTML = wraps
      ? `Pickups from <strong>${s}</strong> in the evening through to <strong>${e}</strong> the next morning are charged <strong>+${p} %</strong>. An €80 transfer becomes <strong>${example} €</strong>. On a round trip the supplement applies to both legs, based on the outbound pickup time.`
      : `Pickups between <strong>${s}</strong> and <strong>${e}</strong> on the same day are charged <strong>+${p} %</strong>. An €80 transfer becomes <strong>${example} €</strong>. On a round trip the supplement applies to both legs, based on the outbound pickup time.`;
  };

  const stripeToggle = form.querySelector<HTMLInputElement>('[data-stripe-toggle]');
  const stripeKey = form.querySelector<HTMLInputElement>('[data-stripe-key]');
  const stripeFields = form.querySelector<HTMLFieldSetElement>('[data-stripe-fields]');
  const deposit = form.querySelector<HTMLInputElement>('[data-deposit-percent]');
  const modes = Array.from(form.querySelectorAll<HTMLInputElement>('[data-stripe-mode]'));

  const renderStripe = () => {
    if (stripeToggle) {
      const configured = stripeToggle.dataset.stripeConfigured === '1';
      // The switch can be ticked in the same save as a newly pasted key.
      stripeToggle.disabled = !configured && (stripeKey?.value.length ?? 0) === 0;
      if (stripeFields) stripeFields.disabled = !stripeToggle.checked;
    }
    if (deposit) deposit.disabled = modes.find((m) => m.checked)?.value !== 'deposit';
  };

  form.addEventListener('input', () => {
    renderNight();
    renderStripe();
  });
  form.addEventListener('change', () => {
    renderNight();
    renderStripe();
  });
}
