import { defineMiddleware } from 'astro:middleware';
import { getCachedPage, setCachedPage } from '@/lib/cache';
import { LOCALES, matchLocale } from '@/lib/i18n/config';

export const LOCALE_COOKIE = 'dpt_locale';

const SECURITY_HEADERS: [string, string][] = [
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['X-Frame-Options', 'SAMEORIGIN'],
];

/** Paths that are neither public pages nor candidates for a locale redirect. */
function isReserved(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname === '/api' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/_image') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.[\w]+$/.test(pathname)
  );
}

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

/**
 * Three jobs, in order:
 *
 * 1. Redirect every public URL without a language prefix to the best language
 *    (the visitor's cookie, else `Accept-Language`, else English), with a 307
 *    so the choice — which depends on the visitor's headers — is never cached
 *    as permanent.
 * 2. Serve public pages from the in-process cache (see `src/lib/cache.ts`).
 *    A page is cached only when the URL carries no query string: the booking
 *    page reads `?from=…` to pre-fill itself and `?paid=1` when coming back
 *    from Stripe, and those must always be rendered fresh.
 * 3. Add the security headers on every response.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;

  if (!isReserved(pathname) && !hasLocalePrefix(pathname)) {
    const cookieLocale = context.cookies.get(LOCALE_COOKIE)?.value;
    const locale =
      cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
        ? cookieLocale
        : matchLocale(context.request.headers.get('accept-language'));

    const target = `/${locale}${pathname === '/' ? '' : pathname}${search}`;
    return context.redirect(target, 307);
  }

  const cacheable =
    context.request.method === 'GET' && hasLocalePrefix(pathname) && search === '';

  if (cacheable) {
    const hit = getCachedPage(pathname);
    if (hit) {
      const headers = new Headers(hit.headers);
      headers.set('X-Cache', 'HIT');
      return new Response(hit.body, { status: hit.status, headers });
    }
  }

  let response = await next();

  try {
    for (const [key, value] of SECURITY_HEADERS) response.headers.set(key, value);
  } catch {
    // `Response.redirect()` and a few other constructors produce immutable
    // headers: copy the response so the headers can be added.
    response = new Response(response.body, response);
    for (const [key, value] of SECURITY_HEADERS) response.headers.set(key, value);
  }

  if (
    cacheable &&
    response.status === 200 &&
    (response.headers.get('content-type') ?? '').includes('text/html')
  ) {
    const body = await response.text();
    response.headers.set('Cache-Control', 'public, max-age=60');
    const headers: [string, string][] = [...response.headers.entries()];
    setCachedPage(pathname, { body, headers, status: 200 });
    headers.push(['X-Cache', 'MISS']);
    return new Response(body, { status: 200, headers });
  }

  return response;
});
