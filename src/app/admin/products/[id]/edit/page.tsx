import { updateProduct } from '../../actions';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

  if (!product) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/products" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            ← Back to Products
          </Link>
          <h2>Edit Product</h2>
        </div>
      </div>

      <div className="card">
        <form action={updateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="id" value={product.id} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label" htmlFor="title">Product Title</label>
              <input id="title" name="title" type="text" className="input-field" required defaultValue={product.title} />
            </div>
            <div>
              <label className="label" htmlFor="category">Category</label>
              <input id="category" name="category" type="text" className="input-field" required defaultValue={product.category} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div>
              <label className="label" htmlFor="price">Price ($)</label>
              <input id="price" name="price" type="number" step="0.01" className="input-field" required defaultValue={product.price} />
            </div>
            <div>
              <label className="label" htmlFor="stock_quantity">Stock Quantity</label>
              <input id="stock_quantity" name="stock_quantity" type="number" className="input-field" required defaultValue={product.stock_quantity} />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="image_url">Image URL</label>
            <input id="image_url" name="image_url" type="url" className="input-field" defaultValue={product.image_url || ''} />
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" className="input-field" rows={5} required defaultValue={product.description || ''}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-primary)' }}>
              Update Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
