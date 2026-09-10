import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { logoutAction } from './actions';
import { getSession } from '@/lib/auth';
import { fontVariables } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Admin — Disney Paris Transfers',
  // The back office must never show up in a search engine.
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: '/admin', label: 'Bookings' },
  { href: '/admin/rates', label: 'Rates' },
  { href: '/admin/packages', label: 'Packages & add-ons' },
  { href: '/admin/settings', label: 'Settings' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-cream">
        {session ? (
          <header className="border-b border-line bg-surface">
            <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-5 px-6 py-3">
              <Link href="/admin" className="font-display text-lg text-ink no-underline">
                Disney Paris <span className="text-brand">Transfers</span>
              </Link>

              <nav className="flex flex-wrap gap-4">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold text-ink no-underline hover:text-brand"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <form action={logoutAction} className="ml-auto">
                <button
                  type="submit"
                  className="cursor-pointer rounded-full border border-line bg-cream px-4 py-2 font-sans text-[13px] font-bold text-ink-soft hover:border-brand hover:text-brand"
                >
                  Sign out
                </button>
              </form>
            </div>
          </header>
        ) : null}

        {children}
      </body>
    </html>
  );
}
