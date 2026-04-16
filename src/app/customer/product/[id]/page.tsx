import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/customer" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Back to Shop
        </Link>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '3rem', padding: '2rem' }}>
        {/* Left Side: Image */}
        <div style={{ 
          flex: '1 1 400px', 
          minHeight: '400px', 
          backgroundColor: 'rgba(0,0,0,0.3)', 
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          {product.image_url ? (
             <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
          ) : (
            <span>No Image Available</span>
          )}
        </div>

        {/* Right Side: Details */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ 
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.title}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '1.5rem' }}>
            ${Number(product.price).toFixed(2)}
          </p>
          
          <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {product.description || 'No detailed description provided for this product.'}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.875rem', color: product.stock_quantity > 0 ? 'var(--text-secondary)' : 'var(--danger)' }}>
              {product.stock_quantity > 5 ? 'In Stock' : product.stock_quantity > 0 ? `Only ${product.stock_quantity} left in stock` : 'Currently Unavailable'}
            </span>
          </div>

          <div style={{ maxWidth: '250px' }}>
             <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
