/**
 * The site's identity and contact details.
 * Everything comes from environment variables: nothing is hard-coded, so the
 * client can change their number without touching the code.
 */

const PHONE = process.env.NEXT_PUBLIC_PHONE || '+33781662122';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '33781662122';

export const site = {
  name: 'Disney Paris Transfers',
  domain: 'disneyparistransfers.com',
  url: (process.env.APP_URL || 'https://disneyparistransfers.com').replace(/\/$/, ''),
  phone: PHONE,
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || '07 81 66 21 22',
  phoneHref: `tel:${PHONE.replace(/\s/g, '')}`,
  whatsapp: WHATSAPP,
  whatsappHref: `https://wa.me/${WHATSAPP}`,
  email: process.env.NEXT_PUBLIC_EMAIL || 'contact@disneyparistransfers.com',
  /** Displayed currency — the rate grid is in euros. */
  currency: 'EUR',
} as const;

/** WhatsApp link with a pre-filled message. */
export function whatsappLink(message?: string): string {
  if (!message) return site.whatsappHref;
  return `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
