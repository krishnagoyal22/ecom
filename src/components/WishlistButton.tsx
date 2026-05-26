'use client';

import { useRouter } from 'next/navigation';
import { useWishlist, type WishlistItem } from '@/context/WishlistContext';

export default function WishlistButton({ product }: { product: WishlistItem }) {
  const router = useRouter();
  const { addToWishlist, isGuest, isWishlisted } = useWishlist();
  const active = isWishlisted(product.id);

  return (
    <button
      className={active ? 'btn btn-secondary wishlist-button active' : 'btn btn-primary wishlist-button'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isGuest) {
          const shouldSignUp = window.confirm('Create an account to save bangles to your wishlist.');
          if (shouldSignUp) {
            router.push('/signup');
          }
          return;
        }

        addToWishlist(product);
      }}
      type="button"
    >
      {active ? 'In wishlist' : 'Add to wishlist'}
    </button>
  );
}
