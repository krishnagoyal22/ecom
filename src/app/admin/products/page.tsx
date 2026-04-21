import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { deleteProduct } from './actions';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Products</span>
          <h1>Catalog management</h1>
          <p>Edit pricing, images, and stock without the admin layout collapsing on smaller screens.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </section>

      <section className="panel-card">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No products found yet. Add your first item to populate the storefront.</div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="thumbnail">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="56px"
                          />
                        ) : (
                          'No img'
                        )}
                      </div>
                    </td>
                    <td>{product.title}</td>
                    <td>
                      <span className="badge">{product.category || 'N/A'}</span>
                    </td>
                    <td>Rs. {Number(product.price).toFixed(2)}</td>
                    <td style={{ color: product.stock_quantity > 0 ? 'inherit' : 'var(--danger)' }}>
                      {product.stock_quantity}
                    </td>
                    <td>
                      <div className="action-row">
                        <Link href={`/admin/products/${product.id}/edit`} className="btn btn-secondary">
                          Edit
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button className="btn btn-ghost" type="submit" style={{ color: 'var(--danger)' }}>
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
      </section>
    </div>
  );
}
