import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="auth-wrapper">
      <div className="card text-center" style={{ maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome to Our Store</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Discover the best products at unbeatable prices.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {!user ? (
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Go to Login
            </Link>
          ) : (
            <Link href="/customer" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Go to Store
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
