import Link from 'next/link';

export default function Home() {
  return (
    <main className="auth-wrapper">
      <div className="card text-center" style={{ maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome to the Admin System</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          This is a premium Next.js dashboard built without Tailwind CSS.
        </p>
        <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
          Go to Login
        </Link>
      </div>
    </main>
  );
}
