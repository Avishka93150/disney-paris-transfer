'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ResolvedMegaMenu } from '@/lib/transfersMenu';

export type NavItem = { href: string; label: string; active: boolean };

/**
 * The mockups were only drawn at 1280 px wide. Below `lg`, the navigation
 * moves into a drop-down panel rather than breaking onto several lines.
 */
export function MobileNav({
  items,
  menus = [],
  homeHref,
  homeLabel,
  homeActive,
  label,
}: {
  items: NavItem[];
  menus?: ResolvedMegaMenu[];
  homeHref: string;
  homeLabel: string;
  homeActive: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setPanel(null);
  };

  const openMenu = menus.find((menu) => menu.id === panel) ?? null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          setOpen((value) => !value);
          setPanel(null);
        }}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-cream text-ink"
      >
        <span aria-hidden className="text-lg leading-none">
          {open ? '✕' : '☰'}
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-[90] max-h-[80vh] overflow-y-auto border-b border-line bg-surface p-4 shadow-popover">
          {openMenu ? (
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="mb-2 cursor-pointer rounded-[10px] border-0 bg-transparent px-3 py-2.5 text-left text-[15px] font-extrabold text-brand"
              >
                ← {openMenu.label}
              </button>
              <Link
                href={openMenu.href}
                onClick={close}
                className="rounded-[10px] px-3 py-2.5 text-[15px] font-semibold text-ink no-underline"
              >
                {openMenu.viewAll}
              </Link>
              {openMenu.groups.map((group) => (
                <div key={group.heading} className="mt-3">
                  <p className="m-0 mb-1 px-3 text-[11px] font-extrabold uppercase tracking-[1.2px] text-ink-mute">
                    {group.heading}
                  </p>
                  {group.links.map((link) => (
                    <Link
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      onClick={close}
                      className="block rounded-[10px] px-3 py-2 text-[15px] font-semibold text-ink no-underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link
                href={homeHref}
                onClick={close}
                className={`rounded-[10px] px-3 py-2.5 text-[15px] no-underline ${
                  homeActive ? 'bg-sand font-extrabold text-brand' : 'font-semibold text-ink'
                }`}
              >
                {homeLabel}
              </Link>
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => setPanel(menu.id)}
                  className="flex cursor-pointer items-center justify-between rounded-[10px] border-0 bg-transparent px-3 py-2.5 text-left text-[15px] font-semibold text-ink"
                >
                  <span>{menu.label}</span>
                  <span aria-hidden>›</span>
                </button>
              ))}
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`rounded-[10px] px-3 py-2.5 text-[15px] no-underline ${
                    item.active ? 'bg-sand font-extrabold text-brand' : 'font-semibold text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
