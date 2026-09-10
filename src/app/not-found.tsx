import Link from 'next/link';
import { fontVariables } from '@/lib/fonts';
import { getDictionary } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';

/**
 * 404 page. The app root does not render `<html>` (each section has its own
 * language), so this page supplies it itself.
 */
export default function NotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="mx-auto flex min-h-screen max-w-[640px] flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="font-display text-[64px] text-brand">404</div>
          <h1 className="m-0 font-display text-[28px]">
            {dict.common.brand} <span className="text-brand">{dict.common.brandAccent}</span>
          </h1>
          <p className="m-0 text-base text-ink-soft">{dict.routes.otherLead}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={path(DEFAULT_LOCALE, 'home')}
              className="rounded-full bg-brand px-7 py-3.5 font-extrabold text-surface no-underline hover:bg-brand-dark"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={path(DEFAULT_LOCALE, 'contact')}
              className="rounded-full border-2 border-brand bg-surface px-6 py-3 font-extrabold text-brand no-underline hover:bg-sand"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
