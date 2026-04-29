'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';

export default function CustomerHeader({
  userEmail,
  isAdmin,
}: {
  userEmail: string | undefined;
  isAdmin?: boolean;
}) {
  const { totalItems } = useCart();
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
            <span>Sunroom Market</span>
          </Link>
          <Link href="/customer" className="nav-link">
            Shop
          </Link>
          <Link href="/customer/orders" className="nav-link">
            Orders
          </Link>
          <Link href="/customer/cart" className="nav-link">
            Cart
            {totalItems > 0 ? <span className="cart-badge">{totalItems}</span> : null}
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="nav-link" style={{ color: 'var(--accent-primary)' }}>
              Admin
            </Link>
          ) : null}
        </div>

        <div className="nav-actions">
          {userEmail ? <span className="nav-meta">{userEmail}</span> : null}
          <button onClick={handleSignOut} className="btn btn-secondary" type="button">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
