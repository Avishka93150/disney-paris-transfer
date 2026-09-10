import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/** Content width from the mockups: 1200 px, 24 px of side padding. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1200px] px-6 ${className}`}>{children}</div>;
}

/** The sand-coloured title band on inner pages. */
export function PageHero({
  title,
  lead,
  children,
  narrow = false,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className="bg-sand px-6 py-14">
      <div className={`mx-auto ${narrow ? 'max-w-[900px]' : 'max-w-[1200px]'}`}>
        {children}
        <h1 className="m-0 mb-3 font-display text-[32px] leading-tight sm:text-[40px]">{title}</h1>
        {lead ? (
          <p className="m-0 max-w-[680px] text-[17px] leading-[1.7] text-ink-soft">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}

const BUTTON_BASE =
  'inline-block rounded-full text-center font-extrabold no-underline transition-colors';

/** CTA plein terracotta. */
export function PrimaryLink({
  className = '',
  ...props
}: ComponentProps<typeof Link> & { className?: string }) {
  return (
    <Link
      {...props}
      className={`${BUTTON_BASE} bg-brand px-[30px] py-[15px] text-[17px] text-surface hover:bg-brand-dark ${className}`}
    />
  );
}

/** CTA secondaire, contour terracotta sur fond clair. */
export function OutlineLink({
  className = '',
  ...props
}: ComponentProps<typeof Link> & { className?: string }) {
  return (
    <Link
      {...props}
      className={`${BUTTON_BASE} border-2 border-brand bg-surface px-[26px] py-[13px] text-[17px] text-brand hover:bg-sand ${className}`}
    />
  );
}

/** The "external link" variant of the CTAs (WhatsApp, phone). */
export function ExternalButton({
  href,
  variant = 'primary',
  className = '',
  children,
}: {
  href: string;
  variant?: 'primary' | 'outline' | 'gold' | 'goldOutline';
  className?: string;
  children: ReactNode;
}) {
  const styles = {
    primary: 'bg-brand px-[30px] py-[15px] text-[17px] text-surface hover:bg-brand-dark',
    outline: 'border-2 border-brand bg-surface px-[26px] py-[13px] text-[17px] text-brand hover:bg-sand',
    gold: 'bg-gold px-[30px] py-[15px] text-[17px] text-ink hover:bg-gold-dark',
    goldOutline: 'border-2 border-gold px-[26px] py-[13px] text-[17px] text-gold hover:bg-ink-light',
  }[variant];

  const external = href.startsWith('http');

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${BUTTON_BASE} ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

/** Hatched photo placeholder, waiting for the client's real images. */
export function PhotoPlaceholder({
  label,
  aspect = 'aspect-[4/3]',
  className = '',
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`photo-placeholder flex items-center justify-center overflow-hidden ${aspect} ${className}`}
    >
      <span className="rounded-lg bg-surface px-3.5 py-2 font-mono text-[13px] text-ink-mute">
        {label}
      </span>
    </div>
  );
}

/** Bandeau sombre de fin de page. */
export function DarkCta({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[900px] px-6 py-16 text-center">
        <h2 className="m-0 mb-3.5 font-display text-[28px] text-surface sm:text-[34px]">{title}</h2>
        <p className="m-0 mb-7 text-[17px] text-cream-soft">{lead}</p>
        <div className="flex flex-wrap justify-center gap-3.5">{children}</div>
      </div>
    </section>
  );
}

/** Injects a JSON-LD object into the page (SEO). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Built server-side from our own data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
