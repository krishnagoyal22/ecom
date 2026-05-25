'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import WishlistButton from '@/components/WishlistButton';
import CategoryHamburger from '@/components/CategoryHamburger';

gsap.registerPlugin(useGSAP);

type CatalogProduct = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url?: string | null;
};

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="product-card">
      <Link href={`/customer/product/${product.id}`} className="product-card-link">
        <div className="product-image-shell">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 320px"
              unoptimized
            />
          ) : (
            <div className="product-image-empty">No image yet</div>
          )}
        </div>

        <div className="product-copy">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="badge">{product.category || 'Standard'}</span>
          </div>
          <h3 className="product-title">{product.title}</h3>
          <p className="product-description">
            {product.description || 'A fresh new arrival waiting for its full story.'}
          </p>
        </div>
      </Link>

      <WishlistButton product={product} />
    </article>
  );
}

function CategorySection({
  category,
  products,
}: {
  category: string;
  products: CatalogProduct[];
}) {
  const [isHidden, setIsHidden] = useState(false);
  const [batchSize, setBatchSize] = useState(2);
  const [visibleCount, setVisibleCount] = useState(2);
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleProducts.length;

  useEffect(() => {
    const updateBatchSize = () => {
      const nextBatchSize = window.innerWidth >= 1180 ? 4 : window.innerWidth >= 900 ? 3 : 2;
      setBatchSize(nextBatchSize);
      setVisibleCount((current) => Math.max(nextBatchSize, Math.ceil(current / nextBatchSize) * nextBatchSize));
    };

    updateBatchSize();
    window.addEventListener('resize', updateBatchSize);
    return () => window.removeEventListener('resize', updateBatchSize);
  }, []);

  return (
    <section
      id={`category-${category.replace(/\s+/g, '-')}`}
      className="category-section"
    >
      <div className="category-header">
        <div>
          <span className="badge badge-warm">Category</span>
          <h2>{category}</h2>
        </div>

        <div className="category-actions">
          <p>{products.length} products in this set</p>
          <button
            className="btn btn-secondary"
            onClick={() => setIsHidden((current) => !current)}
            type="button"
          >
            {isHidden ? 'Show' : 'Hide'}
          </button>
        </div>
      </div>

      {!isHidden ? (
        <>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>

          {hasMore ? (
            <div className="show-more-row">
              <button
                className="btn btn-primary"
                onClick={() => setVisibleCount((current) => Math.min(products.length, current + batchSize))}
                type="button"
              >
                Show more
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

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

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div className="catalog-toolbar">
        <span className="eyebrow">Explore by collection</span>
        <CategoryHamburger categories={categories} />
      </div>

      {categories.map((category) => (
        <CategorySection
          category={category}
          products={groupedProducts[category]}
          key={category}
        />
      ))}
    </div>
  );
}
