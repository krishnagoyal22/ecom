import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { updateProduct } from '../../actions';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

  if (!product) {
    notFound();
  }

  return (
    <div className="admin-form-shell admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <Link href="/admin/products" className="subtle-link">
            Back to products
          </Link>
          <h2>Edit product</h2>
          <p>Update the listing details without losing readability on phones and smaller tablets.</p>
        </div>
      </section>

      <section className="panel-card">
        <form action={updateProduct} className="responsive-stack">
          <input type="hidden" name="id" value={product.id} />

          <div className="form-grid">
            <div>
              <label className="label" htmlFor="title">
                Product title
              </label>
              <input id="title" name="title" type="text" className="input-field" required defaultValue={product.title} />
            </div>
            <div>
              <label className="label" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                className="input-field"
                required
                defaultValue={product.category || ''}
              />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="label" htmlFor="price">
                Price (Rs.)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                className="input-field"
                required
                defaultValue={product.price}
              />
            </div>
            <div>
              <label className="label" htmlFor="stock_quantity">
                Stock quantity
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                className="input-field"
                required
                defaultValue={product.stock_quantity}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="image_url">
              Image URL
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              className="input-field"
              defaultValue={product.image_url || ''}
            />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="input-field textarea-field"
              required
              defaultValue={product.description || ''}
            />
          </div>

          <div className="form-actions">
            <Link href="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Update product
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
