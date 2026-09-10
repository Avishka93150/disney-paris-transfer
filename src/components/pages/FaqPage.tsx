import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ExternalButton, JsonLd, PageHero } from '@/components/ui';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { faqJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';

/** FAQ — reprise de `project/FAQ.dc.html`, avec balisage FAQPage. */
export function FaqPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} active="faq" />
      <JsonLd data={faqJsonLd(dict.faq.items)} />

      <main id="contenu">
        <PageHero title={dict.faq.h1} lead={dict.faq.lead} narrow />

        <section className="mx-auto flex max-w-[900px] flex-col gap-3 px-6 py-14">
          {dict.faq.items.map((item) => (
            <details
              key={item.q}
              className="rounded-[14px] border border-line bg-surface px-[22px] py-[18px]"
            >
              <summary className="cursor-pointer text-[17px] font-extrabold">{item.q}</summary>
              <p className="mb-0 mt-3 text-[15px] leading-[1.75] text-ink-soft">{item.a}</p>
            </details>
          ))}

          <div className="mt-6 text-center">
            <p className="m-0 mb-4 text-base text-ink-soft">{dict.faq.moreTitle}</p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <ExternalButton
                href={site.whatsappHref}
                variant="primary"
                className="!px-[26px] !py-[13px] !text-base"
              >
                {dict.common.writeWhatsapp}
              </ExternalButton>
              <ExternalButton
                href={site.phoneHref}
                variant="outline"
                className="!px-[22px] !py-[11px] !text-base"
              >
                📞 {site.phoneDisplay}
              </ExternalButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
