'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="panel-grid fade-in">
        <section className="card empty-card">
          <h2 style={{ marginBottom: '1rem' }}>Your wishlist is empty</h2>
          <p style={{ marginBottom: '1.5rem' }}>Save products from the shop and revisit them here.</p>
          <Link href="/customer" className="btn btn-primary">
            Browse shop
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="panel-grid fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Wishlist</span>
          <h1>Saved products</h1>
          <p>Keep your favorite catalog pieces close while you browse.</p>
        </div>
      </section>

      <div className="wishlist-grid">
        {items.map((item) => (
          <article key={item.id} className="product-card">
            <Link href={`/customer/product/${item.id}`} className="wishlist-card-link">
              <div className="product-image-shell">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
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
                <span className="badge">{item.category || 'Standard'}</span>
                <h3 className="product-title">{item.title}</h3>
                <p className="product-description">
                  {item.description || 'A fresh new arrival waiting for its full story.'}
                </p>
              </div>
            </Link>

            <button
              className="btn btn-ghost"
              onClick={() => removeFromWishlist(item.id)}
              type="button"
              style={{ color: 'var(--danger)' }}
            >
              Remove
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
