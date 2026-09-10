'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

/**
 * The number in the header opens a small "Call / WhatsApp" menu
 * (asked for by the client during the design phase).
 */
export function PhoneMenu({ callLabel, whatsappLabel }: { callLabel: string; whatsappLabel: string }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={container}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer whitespace-nowrap border-none bg-transparent p-0 font-sans text-[15px] font-extrabold text-ink hover:text-brand"
      >
        {site.phoneDisplay}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-[100] flex min-w-[210px] flex-col gap-2 rounded-[14px] border border-line bg-surface p-2.5 shadow-popover"
        >
          <a
            role="menuitem"
            href={site.phoneHref}
            className="flex items-center gap-2.5 rounded-[10px] bg-brand px-4 py-[11px] text-sm font-extrabold text-surface no-underline hover:bg-brand-dark"
          >
            📞 {callLabel}
          </a>
          <a
            role="menuitem"
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-[10px] bg-whatsapp px-4 py-[11px] text-sm font-extrabold text-ink no-underline hover:bg-whatsapp-dark"
          >
            💬 {whatsappLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
}
