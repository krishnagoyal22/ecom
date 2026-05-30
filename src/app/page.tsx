import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ marginLeft: "0.5rem" }}
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="home-page kottiar-home">
      <header className="home-nav">
        <div className="home-nav-inner">
          <span className="home-logo">
            <span className="brand-mark-badge" aria-hidden="true" />
            <span>KottiarCatalog</span>
          </span>

          <div className="home-nav-actions">
            {!user ? (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm">
                  Sign in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Create account
                </Link>
              </>
            ) : (
              <Link href="/customer" className="btn btn-primary btn-sm">
                Open catalog
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="kottiar-hero">
        <div className="kottiar-hero-copy">
          <span className="badge">Kottiar creations</span>
          <img
            src="/logo/Kottiar creations logo.jpeg"
            alt="Kottiar Creations"
            style={{
              maxWidth: '380px',
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-sm)',
              margin: '1.2rem 0 1.5rem',
              display: 'block'
            }}
          />
          <p>
            Browse a focused catalog of Kottiar bangles, arranged for quick
            discovery by collection, finish, and style.
          </p>

          <div className="hero-actions">
            <Link
              href={user ? "/customer" : "/signup"}
              className="btn btn-primary btn-lg"
            >
              {user ? "Browse bangles" : "Start browsing"}
              <ArrowIcon />
            </Link>
            {!user ? (
              <Link href="/login" className="btn btn-secondary btn-lg">
                Sign in
              </Link>
            ) : null}
          </div>
        </div>

        <div className="kottiar-visual" aria-hidden="true">
          <div className="bangle-stack">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>KottiarCatalog</span>
      </footer>
    </main>
  );
}
