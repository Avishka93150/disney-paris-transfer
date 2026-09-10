import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Container, PageHero, PrimaryLink } from '@/components/ui';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';
import { site } from '@/lib/site';

/** Contact — reprise de `project/Contact.dc.html`. */
export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const cards = [
    {
      href: site.phoneHref,
      icon: '📞',
      title: dict.contact.phoneTitle,
      value: site.phoneDisplay,
      note: dict.contact.phoneNote,
      external: false,
    },
    {
      href: site.whatsappHref,
      icon: '💬',
      title: dict.contact.whatsappTitle,
      value: site.phone,
      note: dict.contact.whatsappNote,
      external: true,
    },
    {
      href: `mailto:${site.email}`,
      icon: '✉️',
      title: dict.contact.emailTitle,
      value: site.email,
      note: dict.contact.emailNote,
      external: false,
    },
  ];

  return (
    <>
      <SiteHeader locale={locale} active="contact" />

      <main id="contenu">
        <PageHero title={dict.contact.h1} lead={dict.contact.lead} />

        <Container className="grid gap-5 py-14 md:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-8 text-ink no-underline hover:border-brand hover:shadow-card"
            >
              <span aria-hidden className="text-[30px]">
                {card.icon}
              </span>
              <span className="text-[19px] font-extrabold">{card.title}</span>
              <span className="break-all font-display text-[18px] text-brand sm:text-[22px]">
                {card.value}
              </span>
              <span className="text-sm text-ink-soft">{card.note}</span>
            </a>
          ))}
        </Container>

        <section className="mx-auto max-w-[900px] px-6 pb-16 text-center">
          <div className="rounded-3xl bg-ink px-8 py-12">
            <h2 className="m-0 mb-3 font-display text-[28px] text-surface">
              {dict.contact.ctaTitle}
            </h2>
            <p className="m-0 mb-6 text-base text-cream-soft">{dict.contact.ctaLead}</p>
            <PrimaryLink
              href={path(locale, 'booking')}
              className="!bg-gold !px-7 !py-3.5 !text-base !text-ink hover:!bg-gold-dark"
            >
              {dict.contact.ctaBtn}
            </PrimaryLink>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
