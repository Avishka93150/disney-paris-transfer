import { Bree_Serif, Nunito } from 'next/font/google';

/** Headings — taken from the mockups. */
export const breeSerif = Bree_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bree-serif',
});

/**
 * Body copy. `cyrillic` is required for Russian; Chinese and Japanese fall back
 * to the system fonts, which is standard practice (shipping full CJK subsets
 * would cost several megabytes).
 */
export const nunito = Nunito({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-nunito',
});

export const fontVariables = `${breeSerif.variable} ${nunito.variable}`;
