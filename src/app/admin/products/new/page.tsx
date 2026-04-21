import Link from 'next/link';
import { addProduct } from '../actions';

export default function NewProductPage() {
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
        <form action={addProduct} className="responsive-stack">
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

          <div className="form-grid">
            <div>
              <label className="label" htmlFor="price">
                Price (Rs.)
              </label>
              <input id="price" name="price" type="number" step="0.01" className="input-field" required />
            </div>
            <div>
              <label className="label" htmlFor="stock_quantity">
                Stock quantity
              </label>
              <input id="stock_quantity" name="stock_quantity" type="number" className="input-field" required />
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
              placeholder="https://example.com/image.jpg"
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
