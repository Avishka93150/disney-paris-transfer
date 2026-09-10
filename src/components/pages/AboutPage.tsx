import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Container, OutlineLink, PageHero, PhotoPlaceholder, PrimaryLink } from '@/components/ui';
import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { path } from '@/lib/i18n/routes';

/** À propos — reprise de `project/APropos.dc.html`. */
export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const about = dict.about;

  return (
    <>
      <SiteHeader locale={locale} active="about" />

      <main id="contenu">
        <PageHero title={about.h1} lead={about.lead} />

        <Container className="grid items-center gap-14 py-16 lg:grid-cols-[1fr_1.3fr]">
          <PhotoPlaceholder label={about.photo} aspect="aspect-[3/4]" className="rounded-3xl" />

          <div>
            <h2 className="m-0 mb-[18px] font-display text-[28px]">{about.h2}</h2>
            <div className="flex flex-col gap-4 text-base leading-[1.75] text-ink-soft">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="m-0">
                  {paragraph}
                </p>
              ))}
              <p className="m-0 rounded-[10px] bg-sand px-4 py-3 font-mono text-sm text-ink-mute">
                {about.editorNote}
              </p>
            </div>
          </div>
        </Container>

        <section className="border-y border-line bg-surface">
          <Container className="grid gap-5 py-14 text-center sm:grid-cols-2 lg:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-[34px] text-brand">{stat.value}</div>
                <div className="text-sm font-bold text-ink-soft">{stat.label}</div>
              </div>
            ))}
          </Container>
        </section>

        <section className="mx-auto max-w-[900px] px-6 py-16 text-center">
          <h2 className="m-0 mb-3.5 font-display text-[30px]">{about.ctaTitle}</h2>
          <p className="m-0 mb-7 text-base text-ink-soft">{about.ctaLead}</p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <PrimaryLink href={path(locale, 'contact')}>{about.ctaContact}</PrimaryLink>
            <OutlineLink href={path(locale, 'booking')}>{about.ctaBook}</OutlineLink>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
