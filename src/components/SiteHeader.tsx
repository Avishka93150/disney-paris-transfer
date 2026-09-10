import { SiteHeaderBar } from './SiteHeaderBar';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n';
import { type PageKey, path } from '@/lib/i18n/routes';
import { transferMegaMenus } from '@/lib/transfersMenu';
import type { NavItem } from './MobileNav';

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
  const menus = transferMegaMenus(locale, dict);

  const items: NavItem[] = (
    [
      ['prices', dict.nav.prices],
      ['about', dict.nav.about],
      ['faq', dict.nav.faq],
      ['contact', dict.nav.contact],
    ] as [PageKey, string][]
  ).map(([key, label]) => ({ href: path(locale, key), label, active: key === active }));

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-line bg-surface font-sans">
      <SiteHeaderBar
        locale={locale}
        brand={dict.common.brand}
        brandAccent={dict.common.brandAccent}
        tagline={dict.common.tagline}
        homeHref={path(locale, 'home')}
        homeLabel={dict.nav.home}
        homeActive={active === 'home'}
        menus={menus}
        items={items}
        moreLabel={dict.nav.more}
        moreItems={items.slice(1)}
        routesActive={active === 'routes'}
        langLabel={dict.common.langLabel}
        showFlags={showFlags}
        callLabel={dict.common.callNow}
        whatsappLabel={dict.common.writeWhatsapp}
        bookHref={path(locale, 'booking')}
        bookLabel={dict.common.book}
        menuLabel={dict.common.menu}
      />
    </header>
  );
}
