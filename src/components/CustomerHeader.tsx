'use client';

import { useRef } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CustomerHeader({ userEmail, isAdmin }: { userEmail: string | undefined, isAdmin?: boolean }) {
  const { totalItems } = useCart();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, { scope: navRef });

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav ref={navRef} style={{ padding: '1rem 2rem', background: 'var(--panel-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/customer">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', margin: 0, cursor: 'pointer' }}>E-Commerce</h2>
        </Link>
        <Link href="/customer" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Shop</Link>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/customer/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ position: 'relative' }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: 'var(--danger)',
                color: 'white',
                borderRadius: '50%',
                padding: '0.1rem 0.4rem',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </span>
          <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>Cart</span>
        </Link>

        <Link href="/customer/orders" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', marginLeft: '0.5rem' }}>
          Orders
        </Link>

        {isAdmin && (
          <Link href="/admin" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', textDecoration: 'none', marginLeft: '0.5rem', fontWeight: 'bold' }}>
            Admin
          </Link>
        )}

        {userEmail && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>| {userEmail}</span>
            <button 
              onClick={handleSignOut}
              style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
