'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { LOCALE_META, LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { PAGE_KEYS, SEGMENTS, pageKeyFromSegment } from '@/lib/i18n/routes';

/**
 * Language picker with flags (the mockups' "langFlags" setting).
 * It keeps the current page: `/en/prices` → `/es/precios`, not `/es`.
 */
export function LanguageSelect({ locale, label, showFlags }: { locale: Locale; label: string; showFlags: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function translatePath(target: Locale): string {
    const parts = pathname.split('/').filter(Boolean);
    const current = parts[0];
    // The first part is the current language; the rest describes the page.
    const rest = current && isLocale(current) ? parts.slice(1) : parts;
    const pageKey = pageKeyFromSegment(locale, rest[0]);

    if (!pageKey) return `/${target}`;

    const segment = SEGMENTS[pageKey][target];
    const tail = rest.slice(1); // route slugs: identical in every language
    return `/${[target, segment, ...tail].filter(Boolean).join('/')}`;
  }

  function onChange(value: string) {
    if (!isLocale(value)) return;
    // Remember the choice so the next visit lands in the right place directly.
    document.cookie = `dpt_locale=${value}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.push(translatePath(value)));
  }

  return (
    <select
      aria-label={label}
      value={locale}
      disabled={pending}
      onChange={(event) => onChange(event.target.value)}
      className="max-w-[4.75rem] cursor-pointer rounded-lg border border-line bg-cream px-1.5 py-1.5 font-sans text-[13px] font-bold text-ink disabled:opacity-60 sm:max-w-none sm:px-2"
    >
      {LOCALES.map((code) => (
        <option key={code} value={code}>
          {showFlags ? `${LOCALE_META[code].flag} ${LOCALE_META[code].label}` : LOCALE_META[code].label}
        </option>
      ))}
    </select>
  );
}

export { PAGE_KEYS };
