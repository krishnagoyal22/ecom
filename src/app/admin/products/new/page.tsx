import { addProduct } from '../actions';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/products" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            ← Back to Products
          </Link>
          <h2>Add New Product</h2>
        </div>
      </div>

      <div className="card">
        <form action={addProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label" htmlFor="title">Product Title</label>
              <input id="title" name="title" type="text" className="input-field" required placeholder="e.g. Premium Wireless Headphones" />
            </div>
            <div>
              <label className="label" htmlFor="category">Category</label>
              <input id="category" name="category" type="text" className="input-field" required placeholder="e.g. Electronics" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div>
              <label className="label" htmlFor="price">Price ($)</label>
              <input id="price" name="price" type="number" step="0.01" className="input-field" required placeholder="299.99" />
            </div>
            <div>
              <label className="label" htmlFor="stock_quantity">Stock Quantity</label>
              <input id="stock_quantity" name="stock_quantity" type="number" className="input-field" required placeholder="100" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="image_url">Image URL</label>
            <input id="image_url" name="image_url" type="url" className="input-field" placeholder="https://example.com/image.jpg" />
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" className="input-field" rows={5} required placeholder="Detailed product description..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-primary)' }}>
              Save Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
