'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-grid fade-in">
        <section className="card auth-showcase">
          <span className="eyebrow">Welcome back</span>
          <h1>Pick up where your cart left off.</h1>
          <p>
            Sign in to browse the live catalog, revisit saved picks, and move through the
            storefront with a little more style than the usual dashboard login.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <span className="badge badge-warm">01</span>
              <div>
                <strong>Curated storefront</strong>
                <p>Browse products by category with a smoother, more visual shopping flow.</p>
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
                <strong>Playful visual rhythm</strong>
                <p>Warm surfaces, editorial type, and softer panels make the app feel alive.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card auth-form">
          <div className="auth-form-header">
            <span className="eyebrow">Account access</span>
            <h2>Sign in</h2>
            <p>Use your email and password to enter the customer storefront.</p>
          </div>

          {error && <div className="status-message status-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-stack">
            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="hello@sunroom.shop"
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
              {loading ? 'Signing in...' : 'Enter store'}
            </button>
          </form>

          <p className="auth-footnote">
            New here? <Link href="/signup">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
