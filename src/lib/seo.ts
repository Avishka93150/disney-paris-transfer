import { getDictionary } from './i18n';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from './i18n/config';
import { type PageKey, path } from './i18n/routes';
import { absoluteUrl, site } from './site';

const DEFAULT_OG_IMAGE = '/transfers/airport.png';

/** Everything the `<head>` of a public page needs. Rendered by `PublicLayout.astro`. */
export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  /** `hreflang` → absolute URL, including `x-default`. */
  alternates: { hreflang: string; href: string }[];
  ogLocale: string;
  ogImage: string;
  robots: string;
};

/**
 * Metadata for a public page: title, description, canonical and `hreflang` to
 * the other languages (that last part is what stops Google treating the
 * translated versions as duplicate content).
 */
export function pageMetadata({
  locale,
  page,
  slug,
  title,
  description,
  image,
}: {
  locale: Locale;
  page: PageKey;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
}): PageMeta {
  const dict = getDictionary(locale);
  const seo = page === 'home' ? dict.seo.home : dict.seo[page];
  const rest = slug ? [slug] : [];

  const alternates: PageMeta['alternates'] = LOCALES.map((code) => ({
    hreflang: code,
    href: absoluteUrl(path(code, page, ...rest)),
  }));
  alternates.push({ hreflang: 'x-default', href: absoluteUrl(path(DEFAULT_LOCALE, page, ...rest)) });

  return {
    title: title ?? seo.title,
    description: description ?? seo.description,
    canonical: absoluteUrl(path(locale, page, ...rest)),
    alternates,
    ogLocale: LOCALE_META[locale].htmlLang.replace('-', '_'),
    ogImage: absoluteUrl(image ?? DEFAULT_OG_IMAGE),
    robots: 'index, follow, max-image-preview:large',
  };
}

/** JSON-LD, escaped so it can never close its own `<script>` tag. */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Business card, injected on the home page. */
export function localBusinessJsonLd(locale: Locale) {
  const dict = getDictionary(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    description: dict.footer.blurb,
    url: absoluteUrl(path(locale, 'home')),
    telephone: site.phone,
    email: site.email,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    priceRange: '€€',
    areaServed: [
      { '@type': 'Place', name: 'Paris' },
      { '@type': 'Place', name: 'Disneyland Paris' },
      { '@type': 'Place', name: 'Île-de-France' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl(path(locale, 'home')),
    inLanguage: locale,
    publisher: { '@id': `${site.url}/#business` },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  url,
  price,
  image,
}: {
  name: string;
  description: string;
  url: string;
  price: number | null;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Airport transfer',
    name,
    description,
    url,
    ...(image ? { image: absoluteUrl(image) } : {}),
    provider: { '@type': 'LocalBusiness', '@id': `${site.url}/#business`, name: site.name },
    areaServed: { '@type': 'Place', name: 'Île-de-France' },
    ...(price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: 'EUR',
            url,
          },
        }
      : {}),
  };
}
