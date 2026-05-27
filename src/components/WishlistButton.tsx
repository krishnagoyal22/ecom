'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlist, type WishlistItem } from '@/context/WishlistContext';

export default function WishlistButton({ product }: { product: WishlistItem }) {
  const router = useRouter();
  const { addToWishlist, isGuest, isWishlisted } = useWishlist();
  const [isSaving, setIsSaving] = useState(false);
  const active = isWishlisted(product.id);

  return (
    <button
      className={active ? 'btn btn-secondary wishlist-button active' : 'btn btn-primary wishlist-button'}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isSaving) return;

        if (isGuest) {
          const shouldSignUp = window.confirm('Create an account to save bangles to your wishlist.');
          if (shouldSignUp) {
            router.push('/signup');
          }
          return;
        }

        setIsSaving(true);
        await addToWishlist(product);
        setIsSaving(false);
      }}
      disabled={isSaving}
      type="button"
    >
      {isSaving ? 'Saving...' : active ? 'In wishlist' : 'Add to wishlist'}
    </button>
  );
}
