'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { processCheckout } from '../actions';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedShippingAddress = `Name: ${formData.fullName}\nAddress: ${formData.address}, ${formData.city}, ${formData.zip}\nPhone: ${formData.phone}`;
    const result = await processCheckout(items, totalPrice, formattedShippingAddress);

    if (result.success) {
      clearCart();
      alert(
        `Order placed successfully. Tracking ID: ${result.orderId}\nIt will be shipped to: ${formData.address}`
      );
      router.push('/customer');
      return;
    }

    setError(result.error || 'An unexpected error occurred.');
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="card empty-card">
        <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
        <p style={{ marginBottom: '1.5rem' }}>Explore the catalog and add a few favorites first.</p>
        <Link href="/customer" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="panel-grid fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Checkout</span>
          <h1>Secure checkout</h1>
          <p>Review your cart, enter delivery details, and confirm the order from a mobile-friendly layout.</p>
        </div>
      </section>

      {error ? <div className="status-message status-error">{error}</div> : null}

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.id} className="card cart-item">
              <div className="thumbnail" style={{ width: '5rem', height: '5rem', borderRadius: '22px' }}>
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="80px" />
                ) : (
                  'IMG'
                )}
              </div>

              <div className="cart-item-copy">
                <h3 style={{ fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ marginTop: '0.3rem', color: 'var(--success)', fontWeight: 700 }}>
                  Rs. {item.price.toFixed(2)}
                </p>
              </div>

              <div className="action-row">
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="quantity-button" type="button">
                    -
                  </button>
                  <span style={{ minWidth: '2ch', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-button" type="button">
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  type="button"
                  className="btn btn-ghost"
                  style={{ color: 'var(--danger)' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <form className="card auth-form summary-form" onSubmit={handleCheckout}>
          <h2 style={{ fontSize: '1.3rem' }}>Delivery information</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            required
            className="input-field"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Street address"
            required
            className="input-field"
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="inline-fields">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              className="input-field"
              value={formData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP"
              required
              className="input-field"
              value={formData.zip}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            required
            className="input-field"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <h2 style={{ fontSize: '1.3rem', marginTop: '0.6rem' }}>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free express delivery</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span style={{ color: 'var(--success)' }}>Rs. {totalPrice.toFixed(2)}</span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm and pay'}
          </button>
        </form>
      </div>
    </div>
  );
}
