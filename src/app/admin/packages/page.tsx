import Link from 'next/link';
import { CatalogEditor } from './CatalogEditor';
import { requireAdmin } from '@/lib/auth';
import { listExtras, listPackages } from '@/lib/db';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function AdminPackages() {
  await requireAdmin();

  const packages = listPackages();
  const extras = listExtras();
  const settings = getSettings();

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10">
      <h1 className="m-0 mb-2 font-display text-[28px]">Packages &amp; add-ons</h1>
      <p className="m-0 mb-6 max-w-[720px] text-[15px] leading-[1.7] text-ink-soft">
        Everything here is yours to create — unlike the rate grid, which is fixed by connection.
        Changes appear on the site immediately.
      </p>

      <p className="mb-10 rounded-[10px] bg-sand p-4 text-sm leading-[1.6] text-ink-soft">
        Names and descriptions are shown to visitors <strong>exactly as typed</strong>, in all
        7 languages — they do not go through the site’s translations. Write them in the language
        most of your customers read.
        {settings.nightSurchargeEnabled ? (
          <>
            {' '}
            The night supplement of <strong>+{settings.nightSurchargePercent} %</strong> (
            {settings.nightStart}–{settings.nightEnd}) applies to any package left ticked below.{' '}
            <Link href="/admin/settings" className="font-bold text-brand">
              Change night hours
            </Link>
          </>
        ) : null}
      </p>

      <CatalogEditor packages={packages} extras={extras} />
    </main>
  );
}
