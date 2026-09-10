import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { fontVariables } from '@/lib/fonts';
import { getDictionary } from '@/lib/i18n';
import { LOCALES, LOCALE_META, isLocale } from '@/lib/i18n/config';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html lang={LOCALE_META[locale].htmlLang} className={fontVariables}>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:font-bold focus:text-surface"
        >
          {dict.common.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
