'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('error');
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/customer');
    router.refresh();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-grid fade-in">
        <section className="card auth-showcase">
          <span className="eyebrow">Welcome back</span>
          <h1>Return to KottiarCatalog.</h1>
          <p>
            Sign in to browse Kottiar bangle collections and revisit your saved
            designs.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <span className="badge badge-warm">01</span>
              <div>
                <strong>Curated catalog</strong>
                <p>Browse bangles by category with a smoother, more visual flow.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="badge">02</span>
              <div>
                <strong>Quick account access</strong>
                <p>Jump straight into cart and orders without extra clutter.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="badge" style={{ background: 'rgba(221, 94, 137, 0.12)', borderColor: 'rgba(221, 94, 137, 0.18)', color: '#a93961' }}>
                03
              </span>
              <div>
                <strong>Focused browsing</strong>
                <p>Warm surfaces and clear sections keep attention on the designs.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card auth-form">
          <div className="auth-form-header">
            <span className="eyebrow">Account access</span>
            <h2>Sign in</h2>
            <p>Use your email and password to enter KottiarCatalog.</p>
          </div>

          {error && <div className="status-message status-error">{error}</div>}

          <GoogleAuthButton />

          <div className="auth-divider">
            <span>or use email</span>
          </div>

          <form onSubmit={handleLogin} className="auth-stack">
            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="hello@kottiarcatalog.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter catalog'}
            </button>

            <Link href="/customer" className="btn btn-secondary">
              Continue as guest
            </Link>
          </form>

          <p className="auth-footnote">
            New here? <Link href="/signup">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
