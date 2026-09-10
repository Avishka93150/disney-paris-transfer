'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { LanguageSelect } from './LanguageSelect';
import { MobileNav, type NavItem } from './MobileNav';
import { PhoneMenu } from './PhoneMenu';
import type { Locale } from '@/lib/i18n/config';
import type { ResolvedMegaMenu } from '@/lib/transfersMenu';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteHeaderBar({
  locale,
  brand,
  brandAccent,
  tagline,
  homeHref,
  homeLabel,
  homeActive,
  menus,
  items,
  routesActive,
  langLabel,
  showFlags,
  callLabel,
  whatsappLabel,
  bookHref,
  bookLabel,
  menuLabel,
}: {
  locale: Locale;
  brand: string;
  brandAccent: string;
  tagline: string;
  homeHref: string;
  homeLabel: string;
  homeActive: boolean;
  menus: ResolvedMegaMenu[];
  items: NavItem[];
  routesActive: boolean;
  langLabel: string;
  showFlags: boolean;
  callLabel: string;
  whatsappLabel: string;
  bookHref: string;
  bookLabel: string;
  menuLabel: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const panelId = useId();
  const openMenu = menus.find((menu) => menu.id === openId) ?? null;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenId(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative" onMouseLeave={() => setOpenId(null)}>
      <div className="relative mx-auto flex min-h-14 max-w-[1200px] flex-wrap items-center gap-4 px-6 py-2.5 lg:gap-5">
        <Link href={homeHref} className="flex min-w-0 flex-col leading-[1.1] no-underline">
          <span className="font-display text-[21px] text-ink">
            {brand} <span className="text-brand">{brandAccent}</span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink-faint">
            {tagline}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-4 lg:flex xl:gap-5">
          <Link
            href={homeHref}
            aria-current={homeActive ? 'page' : undefined}
            className={`whitespace-nowrap text-[15px] no-underline hover:text-brand ${
              homeActive ? 'font-extrabold text-brand' : 'font-semibold text-ink'
            }`}
            onMouseEnter={() => setOpenId(null)}
          >
            {homeLabel}
          </Link>

          {menus.map((menu) => {
            const open = openId === menu.id;
            return (
              <Link
                key={menu.id}
                href={menu.href}
                aria-expanded={open}
                aria-controls={`${panelId}-${menu.id}`}
                className={`inline-flex items-center gap-1 whitespace-nowrap text-[15px] no-underline hover:text-brand ${
                  routesActive || open ? 'font-extrabold text-brand' : 'font-semibold text-ink'
                }`}
                onMouseEnter={() => setOpenId(menu.id)}
                onFocus={() => setOpenId(menu.id)}
              >
                {menu.label}
                <Chevron open={open} />
              </Link>
            );
          })}

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={`whitespace-nowrap text-[15px] no-underline hover:text-brand ${
                item.active ? 'font-extrabold text-brand' : 'font-semibold text-ink'
              }`}
              onMouseEnter={() => setOpenId(null)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <LanguageSelect locale={locale} label={langLabel} showFlags={showFlags} />

          <div className="hidden sm:block">
            <PhoneMenu callLabel={callLabel} whatsappLabel={whatsappLabel} />
          </div>

          <Link
            href={bookHref}
            className="whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-[15px] font-extrabold text-surface no-underline hover:bg-brand-dark"
          >
            {bookLabel}
          </Link>

          <MobileNav items={items} menus={menus} homeHref={homeHref} homeLabel={homeLabel} homeActive={homeActive} label={menuLabel} />
        </div>
      </div>

      {openMenu ? (
        <div
          id={`${panelId}-${openMenu.id}`}
          className="absolute left-0 right-0 top-full z-[80] border-b border-line bg-surface shadow-popover"
          onMouseEnter={() => setOpenId(openMenu.id)}
        >
          <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-6 md:grid-cols-3">
            {openMenu.groups.map((group) => (
              <div key={group.heading}>
                <p className="m-0 mb-3 text-[11px] font-extrabold uppercase tracking-[1.4px] text-ink-mute">
                  {group.heading}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <Link
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      onClick={() => setOpenId(null)}
                      className="rounded-[10px] px-2 py-1.5 text-[14px] font-semibold text-ink no-underline hover:bg-sand hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="md:col-span-3">
              <Link
                href={openMenu.href}
                onClick={() => setOpenId(null)}
                className="text-[13px] font-extrabold text-brand no-underline hover:text-brand-dark"
              >
                {openMenu.viewAll} →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
