'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useWishlist } from '@/context/WishlistContext';
import { createClient } from '@/utils/supabase/client';

export default function CustomerHeader({
  userEmail,
  isAdmin,
}: {
  userEmail: string | undefined;
  isAdmin?: boolean;
}) {
  const { isHydrated, totalItems } = useWishlist();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -48,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: navRef });

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav ref={navRef} className="top-nav">
      <div className="top-nav-inner">
        <div className="nav-links">
          <Link href="/customer" className="brand-mark">
            <span className="brand-mark-badge" />

          </Link>
          <Link href="/customer" className="nav-link">
            Catalog
          </Link>
          <Link href="/customer/wishlist" className="nav-link">
            Wishlist
            {isHydrated && totalItems > 0 ? <span className="cart-badge">{totalItems}</span> : null}
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="nav-link" style={{ color: 'var(--accent-primary)' }}>
              Admin
            </Link>
          ) : null}
        </div>

        <div className="nav-actions">
          {userEmail ? (
            <>
              <span className="nav-meta">{userEmail}</span>
              <button onClick={handleSignOut} className="btn btn-secondary" type="button">
                Sign out
              </button>
            </>
          ) : (
            <>
              <span className="nav-meta">Guest browsing</span>
              <Link href="/login" className="btn btn-secondary">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
