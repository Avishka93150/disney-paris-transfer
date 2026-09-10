import { PasswordForm } from './PasswordForm';
import { SettingsForm } from './SettingsForm';
import { SmtpForm } from './SmtpForm';
import { requireAdmin } from '@/lib/auth';
import {
  getSettings,
  secretHint,
  smtpFormValues,
  stripeConfigured,
  stripeSecretKey,
  stripeWebhookSecret,
} from '@/lib/settings';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  await requireAdmin();

  const settings = getSettings();
  const configured = stripeConfigured();
  const smtp = smtpFormValues();

  return (
    <main className="mx-auto max-w-[800px] px-6 py-10">
      <h1 className="m-0 mb-2 font-display text-[28px]">Settings</h1>
      <p className="m-0 mb-8 text-[15px] leading-[1.7] text-ink-soft">
        Night hours, online payment, mailbox and the admin password. Secrets pasted here
        override the <code>.env</code> file without a restart.
      </p>

      <div className="flex flex-col gap-8">
        <SettingsForm
          stripeEnabled={settings.stripeEnabled}
          stripeMode={settings.stripeMode}
          depositPercent={settings.depositPercent}
          stripeConfigured={configured}
          stripeSecretHint={secretHint(stripeSecretKey())}
          stripeWebhookSet={Boolean(stripeWebhookSecret())}
          nightSurchargeEnabled={settings.nightSurchargeEnabled}
          nightSurchargePercent={settings.nightSurchargePercent}
          nightStart={settings.nightStart}
          nightEnd={settings.nightEnd}
        />

        <SmtpForm {...smtp} />

        <PasswordForm email={process.env.ADMIN_EMAIL ?? ''} />
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <h2 className="m-0 mb-4 font-display text-xl">Public contact details</h2>
        <p className="m-0 mb-4 text-sm leading-[1.6] text-ink-soft">
          These come from the <code>.env</code> file and appear on every page, in all 7 languages.
          Change them there, then restart the site.
        </p>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ['Phone', site.phoneDisplay, 'NEXT_PUBLIC_PHONE_DISPLAY'],
              ['WhatsApp', site.whatsapp, 'NEXT_PUBLIC_WHATSAPP'],
              ['Email', site.email, 'NEXT_PUBLIC_EMAIL'],
              ['Site address', site.url, 'APP_URL'],
            ].map(([label, value, variable]) => (
              <tr key={variable} className="border-b border-line-strong last:border-0">
                <td className="py-2 pr-4 text-ink-soft">{label}</td>
                <td className="py-2 font-bold">{value}</td>
                <td className="py-2 text-right font-mono text-[12px] text-ink-mute">{variable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
