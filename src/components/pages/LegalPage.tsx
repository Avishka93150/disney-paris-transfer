import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/ui';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import type { PageKey } from '@/lib/i18n/routes';

type LegalKey = 'terms' | 'privacy' | 'cookies';

export function LegalPage({ locale, kind }: { locale: Locale; kind: LegalKey }) {
  const dict = getDictionary(locale);
  const doc = dict.legal[kind];

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="contenu">
        <PageHero title={doc.h1} lead={doc.lead} narrow>
          <p className="mb-3 text-[13px] font-bold text-ink-mute">{dict.legal.updated}</p>
        </PageHero>

        <article className="mx-auto max-w-[900px] px-6 py-14">
          {doc.sections.map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="m-0 mb-3 font-display text-[26px]">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-3 text-[16px] leading-[1.75] text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}

export function isLegalPage(page: PageKey): page is LegalKey {
  return page === 'terms' || page === 'privacy' || page === 'cookies';
}
