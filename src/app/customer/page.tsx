import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

export default async function CustomerPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const displayProducts = products || [];

  // Group products by category
  const groupedProducts = displayProducts.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div>
      <div className="header fade-in">
        <div>
          <h1 className="text-gradient">Welcome to our Premium Store</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0', fontSize: '1.125rem' }}>Browse our latest curated products below.</p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          Could not fetch products live from Supabase. Did you run the SQL script? Error: {error.message}
        </div>
      )}

      {displayProducts.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No products found in the store! Ask the administrator to add some.
        </div>
      )}

      {/* Render dynamically grouped sections */}
      {categories.map((category) => (
        <section key={category} style={{ marginTop: '1rem', marginBottom: '4rem' }} className="fade-in">
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {category}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {groupedProducts[category].map((product) => (
              <Link href={`/customer/product/${product.id}`} key={product.id} className="card product-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}>
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
                     <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <span className="badge">
                    {product.category || 'Standard'}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: 'var(--text-primary)' }}>{product.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)', marginTop: '0.5rem' }}>${Number(product.price).toFixed(2)}</p>
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
