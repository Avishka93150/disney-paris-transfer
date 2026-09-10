'use client';

import Link from 'next/link';
import { useState } from 'react';

export type NavItem = { href: string; label: string; active: boolean };

/**
 * The mockups were only drawn at 1280 px wide. Below `lg`, the navigation
 * moves into a drop-down panel rather than breaking onto several lines.
 */
export function MobileNav({ items, label }: { items: NavItem[]; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-cream text-ink"
      >
        <span aria-hidden className="text-lg leading-none">
          {open ? '✕' : '☰'}
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-[90] flex flex-col gap-1 border-b border-line bg-surface p-4 shadow-popover">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-[10px] px-3 py-2.5 text-[15px] no-underline ${
                item.active ? 'bg-sand font-extrabold text-brand' : 'font-semibold text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
