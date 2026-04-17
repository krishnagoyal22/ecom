'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { processCheckout } from '../actions';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Delivery Form State
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format the delivery data into a clean string to fit in our DB schema
    const formattedShippingAddress = `Name: ${formData.fullName}\nAddress: ${formData.address}, ${formData.city}, ${formData.zip}\nPhone: ${formData.phone}`;

    const result = await processCheckout(items, totalPrice, formattedShippingAddress);

    if (result.success) {
      clearCart();
      alert(`Order Placed Successfully! Order tracking ID: ${result.orderId}\nIt will be shipped to: ${formData.address}`);
      router.push('/customer'); // Redirect to shop
    } else {
      setError(result.error || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Explore our premium catalog to add some items!</p>
        <Link href="/customer" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Secure Checkout</h1>
      
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left: Cart Items */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {item.image_url ? <Image src={item.image_url} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="80px" /> : 'IMG'}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--success)', fontWeight: 600, marginTop: '0.25rem' }}>₹{item.price.toFixed(2)}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '0.25rem', padding: '0.25rem' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>-</button>
                  <span style={{ minWidth: '2ch', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>+</button>
                </div>
                
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary & Delivery Details */}
        <form className="card auth-form" style={{ flex: '0 0 380px', position: 'sticky', top: '2rem' }} onSubmit={handleCheckout}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Delivery Information</h2>
          
          <input type="text" name="fullName" placeholder="Full Name" required className="input-field" value={formData.fullName} onChange={handleInputChange} />
          <input type="text" name="address" placeholder="Street Address" required className="input-field" value={formData.address} onChange={handleInputChange} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input type="text" name="city" placeholder="City" required className="input-field" value={formData.city} onChange={handleInputChange} />
            <input type="text" name="zip" placeholder="ZIP Code" required className="input-field" style={{ width: '120px' }} value={formData.zip} onChange={handleInputChange} />
          </div>
          <input type="tel" name="phone" placeholder="Phone Number" required className="input-field" value={formData.phone} onChange={handleInputChange} />

          <h2 style={{ fontSize: '1.25rem', margin: '1.5rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>Subtotal</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <span>Shipping</span>
            <span>Free Express Delivery</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--success)' }}>₹{totalPrice.toFixed(2)}</span>
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            style={{ width: '100%', height: '3rem', fontSize: '1.125rem' }} 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </form>
      </div>
    </div>
  );
}
