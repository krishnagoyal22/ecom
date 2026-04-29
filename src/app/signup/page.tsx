'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      'Registration worked. Depending on your Supabase email settings, you may need to confirm your email before signing in.'
    );
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-grid fade-in">
        <section className="card auth-showcase">
          <span className="eyebrow">Join the store</span>
          <h1>Build your account in one cheerful step.</h1>
          <p>
            Create a customer account to unlock the catalog, track orders, and step into a warmer,
            more polished shopping interface.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <span className="badge badge-warm">Fast</span>
              <div>
                <strong>Simple onboarding</strong>
                <p>Just email and password to get moving without unnecessary friction.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="badge">Fresh</span>
              <div>
                <strong>Modern browsing flow</strong>
                <p>Search, categories, and product cards are easier to scan and more fun to use.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="badge" style={{ background: 'rgba(221, 94, 137, 0.12)', borderColor: 'rgba(221, 94, 137, 0.18)', color: '#a93961' }}>
                Warm
              </span>
              <div>
                <strong>Friendly visual language</strong>
                <p>The refresh leans boutique and playful instead of plain dashboard styling.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card auth-form">
          <div className="auth-form-header">
            <span className="eyebrow">Create profile</span>
            <h2>Sign up</h2>
            <p>Register a new store account and head straight into the experience.</p>
          </div>

          {error && <div className="status-message status-error">{error}</div>}
          {success && <div className="status-message status-success">{success}</div>}

          <form onSubmit={handleSignup} className="auth-stack">
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
                placeholder="Choose a secure password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-footnote">
            Already registered? <Link href="/login">Log in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
