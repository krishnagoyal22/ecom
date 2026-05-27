import Link from 'next/link';

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;

  return (
    <div className="admin-form-shell admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <Link href="/admin/products" className="subtle-link">
            Back to products
          </Link>
          <h2>Add a new product</h2>
          <p>Create a fresh catalog item with mobile-friendly form layout and cleaner spacing.</p>
        </div>
      </section>

      <section className="panel-card">
        {error ? (
          <div className="status-message status-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        ) : null}

        <form action="/admin/products/submit" method="post" encType="multipart/form-data" className="responsive-stack">
          <input type="hidden" name="mode" value="new" />
          <div className="form-grid">
            <div>
              <label className="label" htmlFor="title">
                Product title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="input-field"
                required
                placeholder="Premium wireless headphones"
              />
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
                placeholder="Electronics"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="image">
              Product image
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
              placeholder="Describe the product, materials, highlights, and why it belongs in the collection."
            />
          </div>

          <div className="form-actions">
            <Link href="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save product
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
