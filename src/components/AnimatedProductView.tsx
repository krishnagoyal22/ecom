'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import WishlistButton from '@/components/WishlistButton';

type ProductDetail = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url?: string | null;
};

gsap.registerPlugin(useGSAP);

export default function AnimatedProductView({ product }: { product: ProductDetail }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

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

  useEffect(() => {
    if (!isImageZoomed) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsImageZoomed(false);
      }
    };

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageZoomed]);

  return (
    <div ref={containerRef} className="card product-detail-shell">
      <div className="product-image-section product-detail-media">
        {product.image_url ? (
          <button
            aria-label={`View ${product.title} fullscreen`}
            className="product-detail-zoom-trigger"
            onClick={() => setIsImageZoomed(true)}
            type="button"
          >
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 960px) 100vw, 50vw"
              priority
              unoptimized
            />
          </button>
        ) : (
          <span>No image available</span>
        )}
      </div>

      <div className="product-detail-copy">
        <span className="product-detail-item badge">{product.category || 'Standard'}</span>
        <h1 className="product-detail-item product-detail-title">{product.title}</h1>

        <div className="product-detail-item product-detail-block">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ lineHeight: 1.7 }}>
            {product.description || 'No detailed description is available for this product yet.'}
          </p>
        </div>

        <div className="product-detail-item" style={{ maxWidth: '260px' }}>
          <WishlistButton product={product} />
        </div>
      </div>

      {product.image_url && isImageZoomed ? (
        <div
          aria-label={`${product.title} fullscreen image`}
          aria-modal="true"
          className="product-image-lightbox"
          onClick={() => setIsImageZoomed(false)}
          role="dialog"
        >
          <button
            aria-label="Close fullscreen image"
            className="product-image-lightbox-close"
            onClick={() => setIsImageZoomed(false)}
            type="button"
          >
            Close
          </button>
          <div
            className="product-image-lightbox-frame"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
