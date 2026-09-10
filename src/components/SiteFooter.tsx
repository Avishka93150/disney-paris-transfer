import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import { ROUTE_PAGES } from '@/lib/prices';
import { site } from '@/lib/site';

/** Pied de page repris de `project/SiteFooter.dc.html`. */
export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const zone = (id: keyof typeof dict.zones) => dict.zones[id];

  const siteLinks = [
    { href: path(locale, 'prices'), label: dict.nav.prices },
    { href: path(locale, 'booking'), label: dict.footer.booking },
    { href: path(locale, 'about'), label: dict.nav.about },
    { href: path(locale, 'faq'), label: dict.nav.faq },
    { href: path(locale, 'contact'), label: dict.nav.contact },
  ];

  return (
    <footer className="bg-ink font-sans text-line">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-8 pt-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-2.5 font-display text-[22px] text-surface">
            {dict.common.brand} <span className="text-gold">{dict.common.brandAccent}</span>
          </div>
          <p className="m-0 text-sm leading-[1.7] text-cream-soft">{dict.footer.blurb}</p>
          <p className="mb-0 mt-3.5 text-[13px] text-ink-faint">{dict.footer.disclaimer}</p>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1.2px] text-gold">
            {dict.footer.colRoutes}
          </div>
          <div className="flex flex-col gap-[9px] text-sm">
            {ROUTE_PAGES.filter((route) => route.featured).map((route) => (
              <Link
                key={route.slug}
                href={routePath(locale, route.slug)}
                className="text-line no-underline hover:text-gold"
              >
                {zone(route.from)} ↔ {zone(route.to)}
              </Link>
            ))}
            <Link href={path(locale, 'prices')} className="text-line no-underline hover:text-gold">
              {dict.prices.toursTitle}
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1.2px] text-gold">
            {dict.footer.colSite}
          </div>
          <div className="flex flex-col gap-[9px] text-sm">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-line no-underline hover:text-gold">
                {link.label}
              </Link>
            ))}
            <Link href={path(locale, 'terms')} className="text-line no-underline hover:text-gold">
              {dict.footer.terms}
            </Link>
            <Link href={path(locale, 'privacy')} className="text-line no-underline hover:text-gold">
              {dict.footer.privacy}
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-extrabold uppercase tracking-[1.2px] text-gold">
            {dict.footer.colContact}
          </div>
          <div className="flex flex-col gap-[9px] text-sm">
            <a href={site.phoneHref} className="text-base font-extrabold text-surface no-underline hover:text-gold">
              {site.phoneDisplay}
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-line no-underline hover:text-gold"
            >
              {dict.footer.whatsappLine}
            </a>
            <a href={`mailto:${site.email}`} className="break-all text-line no-underline hover:text-gold">
              {site.email}
            </a>
            <span className="text-cream-soft">{dict.common.availability}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-light">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-4 text-xs text-ink-faint sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span>{dict.footer.rights}</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label={dict.footer.colLegal}>
            <Link href={path(locale, 'terms')} className="text-ink-faint no-underline hover:text-gold">
              {dict.footer.terms}
            </Link>
            <Link href={path(locale, 'privacy')} className="text-ink-faint no-underline hover:text-gold">
              {dict.footer.privacy}
            </Link>
            <Link href={path(locale, 'cookies')} className="text-ink-faint no-underline hover:text-gold">
              {dict.footer.cookies}
            </Link>
          </nav>
          <span>{dict.footer.seoLine}</span>
        </div>
      </div>
    </footer>
  );
}
