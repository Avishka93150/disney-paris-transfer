import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES, matchLocale } from '@/lib/i18n/config';

const LOCALE_COOKIE = 'dpt_locale';

/**
 * Redirects every public URL without a language prefix to the best available
 * language: the visitor's cookie, else the Accept-Language header, else
 * English.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? cookieLocale
      : matchLocale(request.headers.get('accept-language'));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  // 307: the choice depends on the visitor's headers, so it must not be cached
  // as a permanent redirect.
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    /*
     * Every URL except:
     * - /api        (server routes)
     * - /admin      (back office, English only, never locale-prefixed)
     * - /_next      (Next.js assets)
     * - static files and the SEO files served from the root
     */
    '/((?!api|admin|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[\\w]+$).*)',
  ],
};

export { LOCALE_COOKIE, DEFAULT_LOCALE };
