import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="auth-wrapper">
      <div className="card auth-form text-center" style={{ maxWidth: '520px' }}>
        <span className="eyebrow" style={{ margin: '0 auto' }}>
          Not found
        </span>
        <h1 style={{ fontSize: '4rem', margin: '1rem 0 0.5rem' }}>404</h1>
        <h2 style={{ marginBottom: '0.8rem' }}>Page not found</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          We couldn&apos;t find the page or product you were looking for. It may have been moved or removed.
        </p>
        <Link href="/customer" className="btn btn-primary">
          Return to storefront
        </Link>
      </div>
    </div>
  );
}
