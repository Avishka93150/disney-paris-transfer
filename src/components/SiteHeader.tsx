import Link from 'next/link';
import { LanguageSelect } from './LanguageSelect';
import { MobileNav, type NavItem } from './MobileNav';
import { PhoneMenu } from './PhoneMenu';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n';
import { type PageKey, path } from '@/lib/i18n/routes';

/** Sticky header, carried over from `project/SiteHeader.dc.html`. */
export function SiteHeader({
  locale,
  active,
  showFlags = true,
}: {
  locale: Locale;
  active?: PageKey;
  showFlags?: boolean;
}) {
  const dict = getDictionary(locale);

  const items: NavItem[] = (
    [
      ['home', dict.nav.home],
      ['routes', dict.nav.routes],
      ['prices', dict.nav.prices],
      ['about', dict.nav.about],
      ['faq', dict.nav.faq],
      ['contact', dict.nav.contact],
    ] as [PageKey, string][]
  ).map(([key, label]) => ({ href: path(locale, key), label, active: key === active }));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface font-sans">
      <div className="relative mx-auto flex min-h-14 max-w-[1200px] flex-wrap items-center gap-5 px-6 py-2.5">
        <Link
          href={path(locale, 'home')}
          className="flex flex-col whitespace-nowrap leading-[1.1] no-underline"
        >
          <span className="font-display text-[21px] text-ink">
            {dict.common.brand} <span className="text-brand">{dict.common.brandAccent}</span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink-faint">
            {dict.common.tagline}
          </span>
        </Link>

        <nav className="ml-auto hidden flex-wrap items-center gap-5 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={`whitespace-nowrap text-[15px] no-underline hover:text-brand ${
                item.active ? 'font-extrabold text-brand' : 'font-semibold text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <LanguageSelect locale={locale} label={dict.common.langLabel} showFlags={showFlags} />

          <div className="hidden sm:block">
            <PhoneMenu callLabel={dict.common.callNow} whatsappLabel={dict.common.writeWhatsapp} />
          </div>

          <Link
            href={path(locale, 'booking')}
            className="whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-[15px] font-extrabold text-surface no-underline hover:bg-brand-dark"
          >
            {dict.common.book}
          </Link>

          <MobileNav items={items} label={dict.common.menu} />
        </div>
      </div>
    </header>
  );
}
