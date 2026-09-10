'use client';

import Link from 'next/link';
import { LanguageSelect } from './LanguageSelect';
import { MobileNav, type NavItem } from './MobileNav';
import { PhoneMenu } from './PhoneMenu';
import type { Locale } from '@/lib/i18n/config';
import type { ResolvedMegaMenu } from '@/lib/transfersMenu';

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className="h-2.5 w-2.5 shrink-0 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
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

function MegaMenu({
  menu,
  active,
  align = 'center',
}: {
  menu: ResolvedMegaMenu;
  active: boolean;
  align?: 'center' | 'end';
}) {
  return (
    <div className="group relative">
      <Link
        href={menu.href}
        className={`inline-flex items-center gap-1 whitespace-nowrap text-[15px] no-underline hover:text-brand ${
          active ? 'font-extrabold text-brand' : 'font-semibold text-ink'
        }`}
      >
        {menu.label}
        <Chevron />
      </Link>
      {/*
        CSS hover, like easygoshuttle.com: the panel is a child of `group`,
        so moving from the trigger into the card keeps :hover. `pt-3` is the
        bridge across the gap under the link.
      */}
      <div
        className={`absolute top-full z-[80] hidden pt-3 group-hover:block group-focus-within:block ${
          align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        }`}
      >
        <div className="w-[min(42rem,calc(100vw-1.5rem))] rounded-2xl border border-line bg-surface p-6 shadow-popover">
          <div className="columns-1 gap-x-10 sm:columns-2">
            {menu.groups.map((group) => (
              <div key={group.heading} className="mb-6 break-inside-avoid">
                <p className="m-0 mb-3 text-[12px] font-extrabold tracking-[0.04em] text-ink-mute uppercase">
                  {group.heading}
                </p>
                <div className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <Link
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      className="block text-[14px] leading-snug font-semibold text-ink no-underline hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href={menu.href}
            className="text-[13px] font-extrabold text-brand no-underline hover:text-brand-dark"
          >
            {menu.viewAll} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function MoreMenu({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-sans text-[15px] font-semibold whitespace-nowrap text-ink hover:text-brand"
      >
        {label}
        <Chevron />
      </button>
      <div className="absolute top-full right-0 z-[80] hidden pt-3 group-hover:block group-focus-within:block">
        <div className="min-w-[220px] rounded-2xl border border-line bg-surface py-2 shadow-popover">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 text-[14px] no-underline hover:bg-sand hover:text-brand ${
                item.active ? 'font-extrabold text-brand' : 'font-semibold text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
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
  moreLabel,
  moreItems,
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
  moreLabel: string;
  moreItems: NavItem[];
  routesActive: boolean;
  langLabel: string;
  showFlags: boolean;
  callLabel: string;
  whatsappLabel: string;
  bookHref: string;
  bookLabel: string;
  menuLabel: string;
}) {
  const pricesItem = items[0];

  return (
    <div className="relative">
      <div className="relative mx-auto flex min-h-14 max-w-[1200px] items-center gap-4 px-6 py-2.5 lg:gap-5">
        <Link href={homeHref} className="flex min-w-0 flex-col leading-[1.1] no-underline">
          <span className="font-display text-[21px] text-ink">
            {brand} <span className="text-brand">{brandAccent}</span>
          </span>
          <span className="text-[11px] font-bold tracking-[1.5px] text-ink-faint uppercase">
            {tagline}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-4 min-[1100px]:flex xl:gap-5">
          <Link
            href={homeHref}
            aria-current={homeActive ? 'page' : undefined}
            className={`whitespace-nowrap text-[15px] no-underline hover:text-brand ${
              homeActive ? 'font-extrabold text-brand' : 'font-semibold text-ink'
            }`}
          >
            {homeLabel}
          </Link>

          {menus.map((menu, index) => (
            <MegaMenu
              key={menu.id}
              menu={menu}
              active={routesActive}
              align={index === menus.length - 1 ? 'end' : 'center'}
            />
          ))}

          {pricesItem ? (
            <Link
              href={pricesItem.href}
              aria-current={pricesItem.active ? 'page' : undefined}
              className={`whitespace-nowrap text-[15px] no-underline hover:text-brand ${
                pricesItem.active ? 'font-extrabold text-brand' : 'font-semibold text-ink'
              }`}
            >
              {pricesItem.label}
            </Link>
          ) : null}

          <MoreMenu label={moreLabel} items={moreItems} />
        </nav>

        <div className="ml-auto flex items-center gap-3 min-[1100px]:ml-0">
          <LanguageSelect locale={locale} label={langLabel} showFlags={showFlags} />

          <div className="hidden xl:block">
            <PhoneMenu callLabel={callLabel} whatsappLabel={whatsappLabel} />
          </div>

          <Link
            href={bookHref}
            className="rounded-full bg-brand px-5 py-2.5 text-[15px] font-extrabold whitespace-nowrap text-surface no-underline hover:bg-brand-dark"
          >
            {bookLabel}
          </Link>

          <MobileNav
            items={items}
            menus={menus}
            homeHref={homeHref}
            homeLabel={homeLabel}
            homeActive={homeActive}
            label={menuLabel}
          />
        </div>
      </div>
    </div>
  );
}
