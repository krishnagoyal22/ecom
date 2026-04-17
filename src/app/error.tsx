'use client';

import { useEffect } from 'react';
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
      <div className="card text-center" style={{ maxWidth: '500px' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '1rem' }}>Oops!</h1>
        <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          We encountered an unexpected error safely caught by our systems. 
        </p>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem', overflowWrap: 'break-word' }}>
          {error.message || 'Unknown server fault.'}
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-secondary">
            Try Again
          </button>
          <Link href="/customer" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
