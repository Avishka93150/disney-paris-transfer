import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import { path, routePath } from '@/lib/i18n/routes';
import type { ZoneId } from '@/lib/prices';

/**
 * Header mega-menus, modelled on easygoshuttle.com:
 * two dropdowns (Paris / Disneyland), each with grouped directional links.
 * Both directions of a priced connection share one route page.
 */

type MenuLink = { slug: string; from: ZoneId; to: ZoneId };
type MenuGroupId = 'airports' | 'city' | 'disney' | 'versailles';

export type ResolvedMenuLink = { href: string; label: string };
export type ResolvedMenuGroup = { heading: string; links: ResolvedMenuLink[] };
export type ResolvedMegaMenu = {
  id: string;
  label: string;
  href: string;
  viewAll: string;
  groups: ResolvedMenuGroup[];
};

const PARIS_AIRPORTS: MenuLink[] = [
  { slug: 'cdg-disneyland', from: 'cdg', to: 'disney' },
  { slug: 'cdg-paris', from: 'paris', to: 'cdg' },
  { slug: 'cdg-paris', from: 'cdg', to: 'paris' },
  { slug: 'orly-paris', from: 'orly', to: 'paris' },
  { slug: 'orly-paris', from: 'paris', to: 'orly' },
  { slug: 'paris-beauvais', from: 'beauvais', to: 'paris' },
  { slug: 'paris-beauvais', from: 'paris', to: 'beauvais' },
];

const PARIS_CITY: MenuLink[] = [
  { slug: 'paris-disneyland', from: 'paris', to: 'disney' },
  { slug: 'paris-disneyland', from: 'disney', to: 'paris' },
  { slug: 'cdg-ladefense', from: 'cdg', to: 'ladefense' },
  { slug: 'orly-ladefense', from: 'orly', to: 'ladefense' },
];

const PARIS_VERSAILLES: MenuLink[] = [
  { slug: 'paris-versailles', from: 'paris', to: 'versailles' },
  { slug: 'paris-versailles', from: 'versailles', to: 'paris' },
  { slug: 'cdg-versailles', from: 'cdg', to: 'versailles' },
  { slug: 'orly-versailles', from: 'orly', to: 'versailles' },
];

const DISNEY_TRANSFERS: MenuLink[] = [
  { slug: 'cdg-disneyland', from: 'cdg', to: 'disney' },
  { slug: 'orly-disneyland', from: 'orly', to: 'disney' },
  { slug: 'beauvais-disneyland', from: 'beauvais', to: 'disney' },
  { slug: 'cdg-disneyland', from: 'disney', to: 'cdg' },
  { slug: 'orly-disneyland', from: 'disney', to: 'orly' },
  { slug: 'beauvais-disneyland', from: 'disney', to: 'beauvais' },
  { slug: 'paris-disneyland', from: 'paris', to: 'disney' },
  { slug: 'paris-disneyland', from: 'disney', to: 'paris' },
];

const DISNEY_VERSAILLES: MenuLink[] = [
  { slug: 'disney-versailles', from: 'versailles', to: 'disney' },
  { slug: 'disney-versailles', from: 'disney', to: 'versailles' },
];

const DISNEY_NEAR: MenuLink[] = [
  { slug: 'disney-valeurope', from: 'disney', to: 'valeurope' },
  { slug: 'cdg-valeurope', from: 'cdg', to: 'valeurope' },
  { slug: 'orly-valeurope', from: 'orly', to: 'valeurope' },
  { slug: 'paris-valeurope', from: 'paris', to: 'valeurope' },
];

function groupHeading(dict: Dictionary, id: MenuGroupId): string {
  return dict.nav.groups[id];
}

function linkLabel(dict: Dictionary, link: MenuLink): string {
  return `${dict.zones[link.from]} → ${dict.zones[link.to]}`;
}

function resolveGroup(
  locale: Locale,
  dict: Dictionary,
  id: MenuGroupId,
  links: MenuLink[],
): ResolvedMenuGroup {
  return {
    heading: groupHeading(dict, id),
    links: links.map((link) => ({
      href: routePath(locale, link.slug),
      label: linkLabel(dict, link),
    })),
  };
}

/** Live mega-menus for the public header, in the visitor's language. */
export function transferMegaMenus(locale: Locale, dict: Dictionary): ResolvedMegaMenu[] {
  const allHref = path(locale, 'routes');
  return [
    {
      id: 'paris',
      label: dict.nav.parisTransfers,
      href: allHref,
      viewAll: dict.nav.viewAll,
      groups: [
        resolveGroup(locale, dict, 'airports', PARIS_AIRPORTS),
        resolveGroup(locale, dict, 'city', PARIS_CITY),
        resolveGroup(locale, dict, 'versailles', PARIS_VERSAILLES),
      ],
    },
    {
      id: 'disney',
      label: dict.nav.disneyTransfers,
      href: allHref,
      viewAll: dict.nav.viewAll,
      groups: [
        resolveGroup(locale, dict, 'disney', DISNEY_TRANSFERS),
        resolveGroup(locale, dict, 'versailles', DISNEY_VERSAILLES),
        resolveGroup(locale, dict, 'city', DISNEY_NEAR),
      ],
    },
  ];
}

export const HERO_PHOTOS = [
  '/transfers/airport.png',
  '/transfers/disney.png',
  '/transfers/paris.png',
  '/transfers/versailles.png',
] as const;
