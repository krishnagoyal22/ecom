import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="auth-wrapper">
      <div className="card text-center" style={{ maxWidth: '500px' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          We couldn't find the page or product you were looking for. It might have been moved or deleted.
        </p>
        <Link href="/customer" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}
