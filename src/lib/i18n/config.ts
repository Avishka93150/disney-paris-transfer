/**
 * The site's 7 languages. English is the default: an un-prefixed URL lands on
 * `/en/...` unless the visitor's cookie or `Accept-Language` says otherwise.
 *
 * Every dictionary is typed against the `Dictionary` interface, so adding a key
 * breaks the build in the other six languages until it is translated. That is
 * intentional.
 */
export const LOCALES = ['en', 'fr', 'es', 'it', 'ru', 'zh', 'ja'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Flag + label shown in the header's language picker. */
export const LOCALE_META: Record<Locale, { flag: string; label: string; name: string; htmlLang: string }> = {
  en: { flag: '🇬🇧', label: 'EN', name: 'English', htmlLang: 'en-GB' },
  fr: { flag: '🇫🇷', label: 'FR', name: 'Français', htmlLang: 'fr-FR' },
  es: { flag: '🇪🇸', label: 'ES', name: 'Español', htmlLang: 'es-ES' },
  it: { flag: '🇮🇹', label: 'IT', name: 'Italiano', htmlLang: 'it-IT' },
  ru: { flag: '🇷🇺', label: 'RU', name: 'Русский', htmlLang: 'ru-RU' },
  zh: { flag: '🇨🇳', label: '中文', name: '简体中文', htmlLang: 'zh-CN' },
  ja: { flag: '🇯🇵', label: '日本語', name: '日本語', htmlLang: 'ja-JP' },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the best language from the Accept-Language header.
 * Falls back to English when nothing matches.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { tag: tag.trim().toLowerCase(), q: q ? Number.parseFloat(q.split('=')[1] ?? '1') : 1 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0] ?? '';
    // zh-hans, zh-tw… are all served by simplified Chinese.
    if (base === 'zh') return 'zh';
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
