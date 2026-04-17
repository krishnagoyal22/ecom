'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import CategoryHamburger from '@/components/CategoryHamburger';

// Register the GSAP plugin is generally good practice
gsap.registerPlugin(useGSAP);

export default function AnimatedCatalog({ categories, groupedProducts }: { categories: string[], groupedProducts: Record<string, any[]> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the category headers
    gsap.from('.category-header', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // Animate the product cards universally
    gsap.from('.product-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Interactive Category Navigation Menu */}
      <CategoryHamburger categories={categories} />

      {categories.map((category) => (
        <section id={`category-${category.replace(/\s+/g, '-')}`} key={category} style={{ marginTop: '1rem', marginBottom: '4rem' }}>
          <h2 className="category-header" style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {category}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {groupedProducts[category].map((product: any) => (
              <Link href={`/customer/product/${product.id}`} key={product.id} className="card product-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', transition: 'box-shadow 0.2s' }}>
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  position: 'relative'
                }}>
                  {product.image_url ? (
                     <Image src={product.image_url} alt={product.title} fill style={{ objectFit: 'cover', borderRadius: '0.5rem' }} sizes="(max-width: 768px) 100vw, 300px" />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <span className="badge">
                    {product.category || 'Standard'}
                  </span>
                  {product.stock_quantity <= 0 && (
                    <span className="badge" style={{ marginLeft: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      Out of Stock
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: 'var(--text-primary)' }}>{product.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)', marginTop: '0.5rem' }}>₹{Number(product.price).toFixed(2)}</p>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <AddToCartButton product={product} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
