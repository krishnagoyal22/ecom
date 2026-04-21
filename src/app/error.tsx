'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="auth-wrapper">
      <div className="card auth-form text-center" style={{ maxWidth: '520px' }}>
        <span className="eyebrow" style={{ margin: '0 auto' }}>
          Something broke
        </span>
        <h1 style={{ fontSize: '3rem', margin: '1rem 0 0.5rem', color: 'var(--danger)' }}>Oops</h1>
        <h2 style={{ marginBottom: '0.8rem' }}>Something went wrong</h2>
        <p style={{ marginBottom: '1.2rem' }}>
          We hit an unexpected issue, but the error boundary caught it safely.
        </p>
        <div className="status-message status-error" style={{ marginBottom: '1.2rem' }}>
          {error.message || 'Unknown server fault.'}
        </div>
        <div className="form-actions" style={{ justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-secondary" type="button">
            Try again
          </button>
          <Link href="/customer" className="btn btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
