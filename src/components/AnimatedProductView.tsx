'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

gsap.registerPlugin(useGSAP);

export default function AnimatedProductView({ product }: { product: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal the main container
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Image slides in from left
    gsap.from('.product-image-section', {
      x: -50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    });

    // Details slide in from right with stagger
    gsap.from('.product-detail-item', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '3rem', padding: '2rem' }}>
      {/* Left Side: Image */}
      <div className="product-image-section" style={{ 
        flex: '1 1 400px', 
        minHeight: '400px', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {product.image_url ? (
           <Image src={product.image_url} alt={product.title} fill style={{ objectFit: 'cover', borderRadius: 'var(--radius)' }} sizes="(max-width: 768px) 100vw, 500px" priority />
        ) : (
          <span>No Image Available</span>
        )}
      </div>

      {/* Right Side: Details */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="product-detail-item" style={{ 
          display: 'inline-block',
          width: 'fit-content',
          fontSize: '0.875rem', 
          backgroundColor: 'rgba(99, 102, 241, 0.2)', 
          color: 'var(--accent-primary)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '1rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          {product.category || 'Standard'}
        </span>
        <h1 className="product-detail-item" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.title}</h1>
        <p className="product-detail-item" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '1.5rem' }}>
          ₹{Number(product.price).toFixed(2)}
        </p>
        
        <div className="product-detail-item" style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {product.description || 'No detailed description provided for this product.'}
          </p>
        </div>

        <div className="product-detail-item" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.875rem', color: product.stock_quantity > 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
            {product.stock_quantity > 5 ? 'In Stock' : product.stock_quantity > 0 ? `Only ${product.stock_quantity} left in stock` : 'Out of Stock'}
          </span>
        </div>

        <div className="product-detail-item" style={{ maxWidth: '250px' }}>
           <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
