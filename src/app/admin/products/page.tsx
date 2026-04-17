import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProduct } from './actions';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  return (
    <>
      <div className="header fade-in">
        <h1>Products Management</h1>
        <Link href="/admin/products/new" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-primary)', textDecoration: 'none' }}>
          + Add Product
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Image</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Price</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Stock</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No products found. Add one!</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.25rem', overflow: 'hidden', position: 'relative' }}>
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="40px" />
                        ) : null}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>{product.title}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <span className="badge">{product.category || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--success)' }}>
                      ₹{Number(product.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ color: product.stock_quantity > 0 ? '' : 'var(--danger)' }}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/products/${product.id}/edit`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                          Edit
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button className="btn btn-secondary" type="submit" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
