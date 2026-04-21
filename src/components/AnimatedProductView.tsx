'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AddToCartButton from '@/components/AddToCartButton';

type ProductDetail = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | string;
  stock_quantity: number;
  image_url?: string | null;
};

gsap.registerPlugin(useGSAP);

export default function AnimatedProductView({ product }: { product: ProductDetail }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.product-image-section', {
      x: -50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
    });

    gsap.from('.product-detail-item', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.35,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="card product-detail-shell">
      <div className="product-image-section product-detail-media">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 960px) 100vw, 50vw"
            priority
          />
        ) : (
          <span>No image available</span>
        )}
      </div>

      <div className="product-detail-copy">
        <span className="product-detail-item badge">{product.category || 'Standard'}</span>
        <h1 className="product-detail-item product-detail-title">{product.title}</h1>
        <p className="product-detail-item product-detail-price">Rs. {Number(product.price).toFixed(2)}</p>

        <div className="product-detail-item product-detail-block">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ lineHeight: 1.7 }}>
            {product.description || 'No detailed description is available for this product yet.'}
          </p>
        </div>

        <div className="product-detail-item">
          <span
            className={product.stock_quantity > 0 ? 'badge badge-warm' : 'badge badge-danger'}
          >
            {product.stock_quantity > 5
              ? 'In stock'
              : product.stock_quantity > 0
                ? `Only ${product.stock_quantity} left`
                : 'Out of stock'}
          </span>
        </div>

        <div className="product-detail-item" style={{ maxWidth: '260px' }}>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
