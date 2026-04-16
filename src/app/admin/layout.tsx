import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // To support sign out action
  const signOut = async () => {
    'use server';
    const sb = await createClient();
    await sb.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)' }}>AdminPanel</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            Overview
          </Link>
          <Link href="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none' }}>
            Users
          </Link>
          <Link href="/admin/settings" className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none' }}>
            Settings
          </Link>
        </nav>

        <div>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Logged in as:<br/>
            <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong>
          </div>
          <form action={signOut}>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
