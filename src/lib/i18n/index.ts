import { DEFAULT_LOCALE, type Locale } from './config';
import { fr } from './dictionaries/fr';
import { en } from './dictionaries/en';
import { es } from './dictionaries/es';
import { it } from './dictionaries/it';
import { ru } from './dictionaries/ru';
import { zh } from './dictionaries/zh';
import { ja } from './dictionaries/ja';
import type { Dictionary } from './types';
import { isTourId, isZoneId, parseTourDest } from '../prices';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, es, it, ru, zh, ja };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Fills a template's placeholders: `fill('{a} → {b}', {a: 'CDG'})`.
 * A placeholder with no value is left as-is, which makes it visible in testing
 * rather than silently producing "undefined".
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}

/** "≈ 45 min", "≈ 1 h 30" — in the current language's own words. */
export function formatDuration(dict: Dictionary, minutes: number): string {
  const { approx, minutes: min, hour } = dict.common;
  if (minutes < 60) return `${approx} ${minutes} ${min}`;

  const h = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${approx} ${h} ${hour}` : `${approx} ${h} ${hour} ${rest}`;
}

export function formatDistance(dict: Dictionary, km: number): string {
  return `${dict.common.approx} ${km} ${dict.common.km}`;
}

/** Zone name, or the tour title when `to` is a `tour:…` destination. */
export function destinationLabel(dict: Dictionary, id: string): string {
  if (isZoneId(id)) return dict.zones[id];
  const tour = parseTourDest(id) ?? (isTourId(id) ? id : null);
  if (tour) return dict.tours[tour].name;
  return id;
}

export type { Dictionary };
export { LOCALES, LOCALE_META, DEFAULT_LOCALE, isLocale, matchLocale } from './config';
export type { Locale } from './config';
