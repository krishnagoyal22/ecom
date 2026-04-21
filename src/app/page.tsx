import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="hero-shell">
      <div className="container">
        <div className="hero-topbar fade-in">
          <div className="brand-mark">
            <span className="brand-mark-badge" />
            <span>Sunroom Market</span>
          </div>
          <div className="nav-actions">
            <Link href="/customer" className="btn btn-ghost">
              Browse store
            </Link>
            <Link href={user ? '/customer' : '/login'} className="btn btn-secondary">
              {user ? 'My shop' : 'Sign in'}
            </Link>
          </div>
        </div>

        <section className="hero-grid fade-in">
          <article className="card hero-copy">
            <div>
              <span className="eyebrow">Curated everyday joy</span>
              <h1 className="hero-title">
                Shop a <span className="text-gradient">fun</span> little brighter.
              </h1>
              <p>
                A lively storefront for discovering playful finds, polished essentials, and
                beautifully organized shopping flows that feel more boutique than boilerplate.
              </p>

              <div className="hero-actions">
                <Link href={user ? '/customer' : '/login'} className="btn btn-primary">
                  {user ? 'Enter the store' : 'Start shopping'}
                </Link>
                <Link href="/signup" className="btn btn-secondary">
                  Create account
                </Link>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <strong>24h</strong>
                <span>fresh catalog rhythm</span>
              </div>
              <div className="stat-card">
                <strong>Soft</strong>
                <span>playful visual language</span>
              </div>
              <div className="stat-card">
                <strong>Fast</strong>
                <span>Next.js powered storefront</span>
              </div>
            </div>
          </article>

          <aside className="card hero-spotlight">
            <div>
              <span className="eyebrow">Inside the experience</span>
              <h2 style={{ fontSize: '2.6rem', marginTop: '1rem' }}>A storefront with some personality.</h2>
              <p style={{ marginTop: '0.9rem', lineHeight: 1.7 }}>
                Warmer colors, friendlier motion, and a more editorial layout help the project feel
                like a real shopping brand from the first screen.
              </p>
            </div>

            <div className="spotlight-showcase">
              <div className="spotlight-pill-grid">
                <span className="spotlight-pill">Smooth category browsing</span>
                <span className="spotlight-pill">Layered cards</span>
                <span className="spotlight-pill">Animated catalog</span>
                <span className="spotlight-pill">Responsive layouts</span>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Designed for delight, not just utility.</h3>
                <p>
                  The visual refresh centers on charm, clarity, and more reusable frontend structure.
                </p>
              </div>
            </div>

            <div className="spotlight-note">
              <p>
                {user
                  ? 'You are signed in, so the store is ready right away.'
                  : 'Sign in or create an account to move from the welcome layer into the live catalog.'}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
