import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { adminConfigured, getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-6 py-16">
      <h1 className="m-0 mb-2 font-display text-[26px]">
        Disney Paris <span className="text-brand">Transfers</span>
      </h1>
      <p className="m-0 mb-7 text-[15px] text-ink-soft">Admin area.</p>

      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-6 text-[15px] leading-[1.7] text-ink-soft">
          <p className="m-0 mb-3 font-bold text-ink">Account not configured</p>
          <p className="m-0 mb-3">
            Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD_HASH</code> and{' '}
            <code>SESSION_SECRET</code> in your <code>.env</code> file.
          </p>
          <p className="m-0 rounded-[10px] bg-cream p-3 font-mono text-[13px]">
            npm run admin:hash -- &apos;your-password&apos;
          </p>
        </div>
      )}
    </main>
  );
}
