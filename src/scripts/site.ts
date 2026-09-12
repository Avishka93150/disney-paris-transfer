/**
 * The one script every public page loads: header interactions, cookie
 * notice, home hero slideshow. Plain DOM, no framework, a few kilobytes.
 *
 * Every block is written to tolerate its markup being absent, so the same
 * bundle serves every page.
 */

const LOCALE_COOKIE = 'dpt_locale';
const COOKIE_CONSENT = 'dpt_cookies';

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

function hasCookie(name: string): boolean {
  return document.cookie.split(';').some((part) => part.trim().startsWith(`${name}=`));
}

/* ── Language picker ─────────────────────────────────────────────────────── */

for (const select of document.querySelectorAll<HTMLSelectElement>('[data-language-select]')) {
  select.addEventListener('change', () => {
    const option = select.selectedOptions[0];
    const href = option?.dataset.href;
    if (!option || !href) return;
    // Remember the choice so the next visit lands in the right place directly.
    setCookie(LOCALE_COOKIE, option.value);
    select.disabled = true;
    window.location.href = href;
  });
}

/* ── Phone popover ───────────────────────────────────────────────────────── */

for (const root of document.querySelectorAll<HTMLElement>('[data-phone-menu]')) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-phone-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-phone-panel]');
  if (!toggle || !panel) continue;

  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('mousedown', (event) => {
    if (!panel.hidden && !root.contains(event.target as Node)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

/* ── Mobile navigation ───────────────────────────────────────────────────── */

for (const root of document.querySelectorAll<HTMLElement>('[data-mobile-nav]')) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
  const icon = root.querySelector<HTMLElement>('[data-mobile-icon]');
  const panel = root.querySelector<HTMLElement>('[data-mobile-panel]');
  const main = root.querySelector<HTMLElement>('[data-mobile-root]');
  const submenus = root.querySelectorAll<HTMLElement>('[data-mobile-submenu]');
  if (!toggle || !panel || !main) continue;

  const showRoot = () => {
    main.hidden = false;
    submenus.forEach((menu) => (menu.hidden = true));
  };

  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (icon) icon.textContent = open ? '✕' : '☰';
    showRoot();
  };

  toggle.addEventListener('click', () => setOpen(panel.hidden));

  root.querySelectorAll<HTMLButtonElement>('[data-mobile-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.mobileOpen;
      main.hidden = true;
      submenus.forEach((menu) => (menu.hidden = menu.dataset.mobileSubmenu !== id));
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-mobile-back]').forEach((button) => {
    button.addEventListener('click', showRoot);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
}

/* ── Cookie notice ───────────────────────────────────────────────────────── */

for (const banner of document.querySelectorAll<HTMLElement>('[data-cookie-banner]')) {
  if (hasCookie(COOKIE_CONSENT)) continue;

  const applyPadding = () => {
    document.body.style.paddingBottom = window.matchMedia('(max-width: 640px)').matches ? '12rem' : '7.5rem';
  };

  banner.hidden = false;
  applyPadding();
  window.addEventListener('resize', applyPadding);

  banner.querySelector<HTMLButtonElement>('[data-cookie-accept]')?.addEventListener('click', () => {
    setCookie(COOKIE_CONSENT, '1');
    banner.hidden = true;
    document.body.style.paddingBottom = '';
    window.removeEventListener('resize', applyPadding);
  });
}

/* ── Hero slideshow ──────────────────────────────────────────────────────── */

for (const root of document.querySelectorAll<HTMLElement>('[data-hero-slideshow]')) {
  const slides = Array.from(root.querySelectorAll<HTMLImageElement>('[data-hero-slide]'));
  if (slides.length < 2) continue;

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer: number | null = null;

  const show = (next: number) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('opacity-100', i === next);
      slide.classList.toggle('opacity-0', i !== next);
    });
    index = next;
  };

  const sync = () => {
    if (timer != null) {
      window.clearInterval(timer);
      timer = null;
    }
    if (media.matches) {
      show(0);
      return;
    }
    timer = window.setInterval(() => show((index + 1) % slides.length), 6500);
  };

  sync();
  media.addEventListener('change', sync);
}
