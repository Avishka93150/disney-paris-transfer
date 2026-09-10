import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n/config';
import { PAGE_KEYS, path } from '@/lib/i18n/routes';
import { ROUTE_PAGES } from '@/lib/prices';
import { absoluteUrl } from '@/lib/site';

/**
 * Sitemap: every page, in all 7 languages, with the `hreflang` alternates —
 * this is what lets Google serve the right version to each visitor.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  const languagesFor = (segments: string[]) =>
    Object.fromEntries(
      LOCALES.map((locale) => {
        const [page, slug] = segments as [(typeof PAGE_KEYS)[number], string | undefined];
        return [locale, absoluteUrl(path(locale, page, ...(slug ? [slug] : [])))];
      }),
    );

  for (const locale of LOCALES) {
    for (const page of PAGE_KEYS) {
      entries.push({
        url: absoluteUrl(path(locale, page)),
        lastModified,
        changeFrequency: page === 'home' ? 'weekly' : 'monthly',
        priority: page === 'home' ? 1 : page === 'prices' || page === 'booking' ? 0.9 : 0.7,
        alternates: { languages: languagesFor([page]) },
      });
    }

    for (const route of ROUTE_PAGES) {
      entries.push({
        url: absoluteUrl(path(locale, 'routes', route.slug)),
        lastModified,
        changeFrequency: 'monthly',
        priority: route.featured ? 0.9 : 0.6,
        alternates: { languages: languagesFor(['routes', route.slug]) },
      });
    }
  }

  return entries;
}
