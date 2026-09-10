'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';

const COOKIE_NAME = 'dpt_cookies';

function alreadyAccepted(): boolean {
  return document.cookie.split(';').some((part) => part.trim().startsWith(`${COOKIE_NAME}=`));
}

/** Essential-cookies notice. Language and admin session cookies stay required. */
export function CookieBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!alreadyAccepted());
  }, []);

  if (!visible) return null;

  function accept() {
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=31536000; samesite=lax`;
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-surface/95 px-4 py-4 shadow-lifted backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 max-w-[720px] text-sm leading-[1.6] text-ink-soft">{dict.cookieBanner.message}</p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link href={path(locale, 'cookies')} className="text-sm font-extrabold text-brand no-underline">
            {dict.cookieBanner.more}
          </Link>
          <button
            type="button"
            onClick={accept}
            className="cursor-pointer rounded-full border-none bg-brand px-5 py-2.5 font-sans text-sm font-extrabold text-surface hover:bg-brand-dark"
          >
            {dict.cookieBanner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
