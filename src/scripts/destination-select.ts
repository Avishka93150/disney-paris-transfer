/**
 * Behaviour of `DestinationSelect.astro`: open / close the listbox, pick an
 * option, keep the hidden input in sync and tell the surrounding widget
 * through a bubbling `change` event.
 */

const SELECTED = ['bg-sand', 'font-extrabold', 'text-brand'];
const UNSELECTED = ['bg-transparent', 'font-semibold', 'text-ink', 'hover:bg-sand'];

for (const root of document.querySelectorAll<HTMLElement>('[data-destination-select]')) {
  const input = root.querySelector<HTMLInputElement>('[data-ds-input]');
  const trigger = root.querySelector<HTMLButtonElement>('[data-ds-trigger]');
  const list = root.querySelector<HTMLElement>('[data-ds-list]');
  const label = root.querySelector<HTMLElement>('[data-ds-label]');
  const chevron = root.querySelector<SVGElement>('[data-ds-chevron]');
  const icons = root.querySelectorAll<SVGElement>('[data-ds-icon]');
  const options = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ds-option]'));
  if (!input || !trigger || !list || !label) continue;

  const setOpen = (open: boolean) => {
    list.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    chevron?.classList.toggle('rotate-180', open);
  };

  const choose = (option: HTMLButtonElement) => {
    const value = option.dataset.value ?? '';
    const kind = option.dataset.kind ?? '';

    input.value = value;
    label.textContent = option.textContent?.trim() ?? value;
    icons.forEach((icon) => icon.toggleAttribute('hidden', icon.dataset.dsIcon !== kind));
    options.forEach((item) => {
      const selected = item === option;
      item.setAttribute('aria-selected', String(selected));
      item.classList.remove(...SELECTED, ...UNSELECTED);
      item.classList.add(...(selected ? SELECTED : UNSELECTED));
    });

    setOpen(false);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  trigger.addEventListener('click', () => setOpen(list.hidden));
  options.forEach((option) => option.addEventListener('click', () => choose(option)));

  document.addEventListener('mousedown', (event) => {
    if (!list.hidden && !root.contains(event.target as Node)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !list.hidden) setOpen(false);
  });
}
