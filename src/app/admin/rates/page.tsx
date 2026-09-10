import Link from 'next/link';
import { RatesEditor } from './RatesEditor';
import { requireAdmin } from '@/lib/auth';
import { getRates } from '@/lib/db';
import { en } from '@/lib/i18n/dictionaries/en';
import { ZONE_IDS, type ZoneId } from '@/lib/prices';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function AdminRates() {
  await requireAdmin();

  const rates = getRates();
  const settings = getSettings();
  const zone = (id: string) => en.zones[id as ZoneId] ?? id;

  const rows = Object.entries(rates)
    .map(([pair, prices]) => {
      const [from, to] = pair.split('-');
      return {
        pair,
        label: `${zone(from ?? '')} ↔ ${zone(to ?? '')}`,
        prices: prices.join(' '),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'en'));

  const zones = ZONE_IDS.map((id) => ({ id, label: en.zones[id] }));

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10">
      <h1 className="m-0 mb-2 font-display text-[28px]">Rates</h1>
      <p className="m-0 mb-6 max-w-[680px] text-[15px] leading-[1.7] text-ink-soft">
        These prices feed the home page calculator, the prices page and the route pages, in all
        7 languages. Changes are live on the site immediately.
      </p>

      <p className="mb-8 rounded-[10px] bg-sand p-4 text-sm leading-[1.6] text-ink-soft">
        {settings.nightSurchargeEnabled ? (
          <>
            A <strong>night supplement of +{settings.nightSurchargePercent} %</strong> is currently
            applied on top of these prices for pickups between{' '}
            <strong>{settings.nightStart}</strong> and <strong>{settings.nightEnd}</strong>. Enter
            daytime prices here.
          </>
        ) : (
          <>The night supplement is switched off — these prices apply at any hour.</>
        )}{' '}
        <Link href="/admin/settings" className="font-bold text-brand">
          Change night hours
        </Link>
      </p>

      <RatesEditor rows={rows} zones={zones} />
    </main>
  );
}
