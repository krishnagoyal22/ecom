'use client';

import { useCart } from '@/context/CartContext';

type CartProduct = {
  id: string;
  title: string;
  price: number | string;
  image_url?: string | null;
  stock_quantity: number;
};

export default function AddToCartButton({ product }: { product: CartProduct }) {
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
      {isOutOfStock ? 'Sold out' : 'Add to cart'}
    </button>
  );
}
