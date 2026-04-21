'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AddToCartButton from '@/components/AddToCartButton';
import CategoryHamburger from '@/components/CategoryHamburger';

gsap.registerPlugin(useGSAP);

type CatalogProduct = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | string;
  stock_quantity: number;
  image_url?: string | null;
};

export default function AnimatedCatalog({
  categories,
  groupedProducts,
}: {
  categories: string[];
  groupedProducts: Record<string, CatalogProduct[]>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.category-header', {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: 'power3.out',
    });

    gsap.from('.product-card', {
      y: 46,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div className="catalog-toolbar">
        <span className="eyebrow">Explore by collection</span>
        <CategoryHamburger categories={categories} />
      </div>

      {categories.map((category) => (
        <section
          id={`category-${category.replace(/\s+/g, '-')}`}
          key={category}
          className="category-section"
        >
          <div className="category-header">
            <div>
              <span className="badge badge-warm">Category</span>
              <h2>{category}</h2>
            </div>
            <p>{groupedProducts[category].length} products in this set</p>
          </div>

          <div className="product-grid">
            {groupedProducts[category].map((product) => (
              <Link href={`/customer/product/${product.id}`} key={product.id} className="product-card">
                <div className="product-image-shell">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  ) : (
                    <div className="product-image-empty">No image yet</div>
                  )}
                </div>

                <div className="product-copy">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge">{product.category || 'Standard'}</span>
                    {product.stock_quantity <= 0 ? <span className="badge badge-danger">Sold out</span> : null}
                  </div>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description || 'A fresh new arrival waiting for its full story.'}</p>
                </div>

                <div className="product-meta">
                  <span className="product-price">Rs. {Number(product.price).toFixed(2)}</span>
                </div>

                <AddToCartButton product={product} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
