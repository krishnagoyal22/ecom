import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  let product = null;
  let fetchError = '';

  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    product = data;
    fetchError = error?.message || '';
  } catch (error) {
    fetchError = error instanceof Error ? error.message : 'Failed to fetch product details.';
  }

  if (fetchError) {
    return (
      <div className="admin-form-shell admin-panel fade-in">
        <section className="page-head">
          <div className="page-head-copy">
            <Link href="/admin/products" className="subtle-link">
              Back to products
            </Link>
            <h2>Edit product</h2>
          </div>
        </section>

        <section className="panel-card">
          <div className="info-banner">
            Could not fetch this product from Supabase. Error: {fetchError}
          </div>
        </section>
      </div>
    );
  }

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
        <form action="/admin/products/submit" method="post" encType="multipart/form-data" className="responsive-stack">
          <input type="hidden" name="mode" value="edit" />
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="existing_image_url" value={product.image_url || ''} />

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

          <div>
            <label className="label" htmlFor="image">
              Replace product image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              className="input-field"
              accept="image/*"
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
