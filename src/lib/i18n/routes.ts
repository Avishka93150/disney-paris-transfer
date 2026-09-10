import { type Locale, LOCALES } from './config';

/**
 * Translated URL segments. These are what earn local search ranking:
 * `/es/precios` ranks where `/es/tarifs` would mean nothing to anyone.
 *
 * Route slugs (`cdg-disneyland`…) stay identical in every language: they are
 * proper nouns, and keeping them stable means one single source of truth for
 * the rate grid.
 */
export const PAGE_KEYS = [
  'home',
  'routes',
  'prices',
  'booking',
  'about',
  'faq',
  'contact',
  'terms',
  'privacy',
  'cookies',
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const SEGMENTS: Record<PageKey, Record<Locale, string>> = {
  home: { fr: '', en: '', es: '', it: '', de: '', pt: '', ru: '', zh: '', ja: '' },
  routes: {
    fr: 'trajets',
    en: 'transfers',
    es: 'traslados',
    it: 'trasferimenti',
    de: 'transfers',
    pt: 'transfers',
    ru: 'transfery',
    zh: 'transfers',
    ja: 'transfers',
  },
  prices: {
    fr: 'tarifs',
    en: 'prices',
    es: 'precios',
    it: 'prezzi',
    de: 'preise',
    pt: 'precos',
    ru: 'tseny',
    zh: 'prices',
    ja: 'prices',
  },
  booking: {
    fr: 'reservation',
    en: 'booking',
    es: 'reserva',
    it: 'prenotazione',
    de: 'buchung',
    pt: 'reserva',
    ru: 'bronirovanie',
    zh: 'booking',
    ja: 'booking',
  },
  about: {
    fr: 'a-propos',
    en: 'about',
    es: 'sobre-nosotros',
    it: 'chi-siamo',
    de: 'ueber-uns',
    pt: 'sobre',
    ru: 'o-nas',
    zh: 'about',
    ja: 'about',
  },
  faq: {
    fr: 'faq',
    en: 'faq',
    es: 'preguntas-frecuentes',
    it: 'domande-frequenti',
    de: 'faq',
    pt: 'perguntas-frequentes',
    ru: 'voprosy',
    zh: 'faq',
    ja: 'faq',
  },
  contact: {
    fr: 'contact',
    en: 'contact',
    es: 'contacto',
    it: 'contatti',
    de: 'kontakt',
    pt: 'contacto',
    ru: 'kontakty',
    zh: 'contact',
    ja: 'contact',
  },
  terms: {
    fr: 'conditions-generales',
    en: 'terms',
    es: 'condiciones',
    it: 'termini',
    de: 'agb',
    pt: 'termos',
    ru: 'usloviya',
    zh: 'terms',
    ja: 'terms',
  },
  privacy: {
    fr: 'confidentialite',
    en: 'privacy',
    es: 'privacidad',
    it: 'privacy',
    de: 'datenschutz',
    pt: 'privacidade',
    ru: 'konfidentsialnost',
    zh: 'privacy',
    ja: 'privacy',
  },
  cookies: {
    fr: 'cookies',
    en: 'cookies',
    es: 'cookies',
    it: 'cookie',
    de: 'cookies',
    pt: 'cookies',
    ru: 'cookie',
    zh: 'cookies',
    ja: 'cookies',
  },
};

export const LEGAL_PAGES: PageKey[] = ['terms', 'privacy', 'cookies'];

/** Builds a localised absolute path: `path('en', 'prices')` → `/en/prices`. */
export function path(locale: Locale, page: PageKey, ...rest: string[]): string {
  const segment = SEGMENTS[page][locale];
  const parts = [locale, segment, ...rest].filter((part) => part.length > 0);
  return `/${parts.join('/')}`;
}

/** Path of a route page: `/en/transfers/cdg-disneyland`. */
export function routePath(locale: Locale, slug: string): string {
  return path(locale, 'routes', slug);
}

/**
 * Recovers the current page from the first URL segment, so the language picker
 * can point at the translated equivalent of the same page.
 */
export function pageKeyFromSegment(locale: Locale, segment: string | undefined): PageKey | null {
  if (!segment) return 'home';
  for (const key of PAGE_KEYS) {
    if (SEGMENTS[key][locale] === segment) return key;
  }
  return null;
}

/** Every variant of a page, for the `hreflang` tags. */
export function alternateLinks(page: PageKey, ...rest: string[]): Record<string, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, path(locale, page, ...rest)]));
}
