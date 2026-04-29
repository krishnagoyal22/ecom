import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="home-page">
      {/* Ambient background orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Nav */}
      <header className="home-nav">
        <div className="home-nav-inner">
          <span className="home-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <path d="M8 20L14 8L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.5 16H17.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span>Arcova</span>
          </span>

          <nav className="home-nav-links" aria-label="Site navigation">
            <a href="#features">Features</a>
            <a href="#categories">Categories</a>
            <a href="#about">About</a>
          </nav>

          <div className="home-nav-actions">
            {!user ? (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            ) : (
              <Link href="/customer" className="btn btn-primary btn-sm">Go to Store</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge">New Collection 2025</span>
        </div>

        <h1 className="hero-title">
          Shop Smarter,<br />
          <span className="text-gradient">Live Better</span>
        </h1>

        <p className="hero-subtitle">
          Discover curated products at unbeatable prices. Premium quality,
          fast delivery, and an experience built around you.
        </p>

        <div className="hero-actions">
          {!user ? (
            <>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Start Shopping
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginLeft: '0.5rem' }}>
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg">Sign In</Link>
            </>
          ) : (
            <Link href="/customer" className="btn btn-primary btn-lg">
              Browse Store
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginLeft: '0.5rem' }}>
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="hero-stats" aria-label="Store statistics">
          {[
            { value: '10K+', label: 'Products' },
            { value: '50K+', label: 'Customers' },
            { value: '4.9★', label: 'Rating' },
          ].map(({ value, label }) => (
            <div className="stat-item" key={label}>
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="features-section" id="features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Features</h2>
        <div className="features-grid">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M2 6h18M6 6V4a1 1 0 011-1h8a1 1 0 011 1v2M4 6l1.5 12h11L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: 'Curated Selection',
              desc: 'Every product hand-picked for quality and value.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M3 11l8-8 8 8M5 9v8a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: 'Fast Delivery',
              desc: 'Same-day dispatch on thousands of items.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 14.2l-4.8 2.6.9-5.3L4.2 7.7l5.4-.8L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: 'Top Rated',
              desc: 'Trusted by thousands of happy customers.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M11 2a9 9 0 100 18A9 9 0 0011 2zM11 6v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: '24/7 Support',
              desc: 'Our team is always here to help you.',
            },
          ].map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon" aria-hidden="true">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-banner" aria-labelledby="cta-heading">
        <div className="cta-inner">
          <h2 id="cta-heading" className="cta-title">
            Ready to find your next favourite?
          </h2>
          <p className="cta-sub">Join thousands of customers who shop with Arcova every day.</p>
          <Link href={user ? '/customer' : '/signup'} className="btn btn-primary btn-lg">
            {user ? 'Browse Store' : 'Create Free Account'}
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <span>© 2025 Arcova. All rights reserved.</span>
      </footer>
    </main>
  );
}
