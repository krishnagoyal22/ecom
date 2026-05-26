import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { deleteProduct, syncProductsFromImageBucket } from './actions';

export default async function AdminProductsPage() {
  let syncMessage = '';
  try {
    const result = await syncProductsFromImageBucket();
    syncMessage =
      result.inserted > 0 || result.deleted > 0
        ? `Synced ${result.inserted} product${result.inserted === 1 ? '' : 's'} from product-images and deleted ${result.deleted} product${result.deleted === 1 ? '' : 's'} outside bucket categories.`
        : '';
  } catch (error) {
    syncMessage = error instanceof Error ? error.message : 'Could not sync products from product-images.';
  }

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
          <p>Edit product details and images without the admin layout collapsing on smaller screens.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </section>

      {syncMessage ? <div className="info-banner">{syncMessage}</div> : null}

      <section className="panel-card">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={4}>
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
                            unoptimized
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
