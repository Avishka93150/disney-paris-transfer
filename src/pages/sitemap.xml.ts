import type { APIRoute } from 'astro';
import { LOCALES } from '@/lib/i18n/config';
import { PAGE_KEYS, path, type PageKey } from '@/lib/i18n/routes';
import { ROUTE_PAGES } from '@/lib/prices';
import { absoluteUrl } from '@/lib/site';

/**
 * Sitemap: every page, in all 9 languages, with the `hreflang` alternates —
 * this is what lets Google serve the right version to each visitor.
 */

type Entry = { loc: string; changefreq: string; priority: string; alternates: [string, string][] };

function escape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function priorityOf(page: PageKey): string {
  if (page === 'home') return '1.0';
  if (page === 'prices' || page === 'booking') return '0.9';
  if (page === 'terms' || page === 'privacy' || page === 'cookies') return '0.3';
  return '0.7';
}

function alternatesFor(page: PageKey, slug?: string): [string, string][] {
  const rest = slug ? [slug] : [];
  const links: [string, string][] = LOCALES.map((locale) => [locale, absoluteUrl(path(locale, page, ...rest))]);
  links.push(['x-default', absoluteUrl(path('en', page, ...rest))]);
  return links;
}

export function sitemapEntries(): Entry[] {
  const entries: Entry[] = [];

  for (const locale of LOCALES) {
    for (const page of PAGE_KEYS) {
      entries.push({
        loc: absoluteUrl(path(locale, page)),
        changefreq: page === 'home' ? 'weekly' : 'monthly',
        priority: priorityOf(page),
        alternates: alternatesFor(page),
      });
    }
    for (const route of ROUTE_PAGES) {
      entries.push({
        loc: absoluteUrl(path(locale, 'routes', route.slug)),
        changefreq: 'monthly',
        priority: route.featured ? '0.9' : '0.6',
        alternates: alternatesFor('routes', route.slug),
      });
    }
  }

  return entries;
}

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...sitemapEntries().map(
      (entry) =>
        `<url><loc>${escape(entry.loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority>${entry.alternates
          .map(([hreflang, href]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escape(href)}"/>`)
          .join('')}</url>`,
    ),
    '</urlset>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
