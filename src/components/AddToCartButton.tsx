'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <button
      className="btn btn-primary"
      style={{ width: '100%', marginTop: 'auto' }}
      disabled={isOutOfStock}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
      }}
    >
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
