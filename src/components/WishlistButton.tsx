'use client';

import { useWishlist, type WishlistItem } from '@/context/WishlistContext';

export default function WishlistButton({ product }: { product: WishlistItem }) {
  const { addToWishlist, isWishlisted } = useWishlist();
  const active = isWishlisted(product.id);

  return (
    <button
      className={active ? 'btn btn-secondary wishlist-button active' : 'btn btn-primary wishlist-button'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToWishlist(product);
      }}
      type="button"
    >
      {active ? 'In wishlist' : 'Add to wishlist'}
    </button>
  );
}
