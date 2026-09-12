/**
 * Fills a template's placeholders: `fill('{a} → {b}', {a: 'CDG'})`.
 * A placeholder with no value is left as-is, which makes it visible in testing
 * rather than silently producing "undefined".
 *
 * Kept in its own module so the browser scripts can import it without
 * dragging the nine dictionaries into the bundle.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}
