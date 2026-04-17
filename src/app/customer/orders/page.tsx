import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function OrderHistoryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authorized</div>;
  }

  // Fetch the orders belonging to the user AND fetch their associated items + product metadata natively via PostgREST Join.
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      created_at,
      shipping_address,
      order_items (
        quantity,
        price_at_purchase,
        products (
          title,
          image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        Could not fetch order history: {error.message}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1 className="text-gradient">Your Order History</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Review your past checkouts and shipping statuses.</p>
        </div>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>No orders found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't placed any orders yet. Let's fix that!</p>
          <Link href="/customer" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Order Header */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Order Placed</p>
                    <p style={{ fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total</p>
                    <p style={{ fontWeight: 500, color: 'var(--success)' }}>₹{Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Ship To</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.shipping_address ? order.shipping_address.split('\n')[0] : 'Standard Shipping'}
                    </p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Order # {order.id.split('-')[0]}</p>
                  <span className="badge" style={{ backgroundColor: order.status === 'Pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: order.status === 'Pending' ? '#eab308' : 'var(--accent-primary)', borderColor: order.status === 'Pending' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(99, 102, 241, 0.3)' }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Items inside delivery</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {order.order_items && order.order_items.map((item: any, index: number) => {
                    const productData = item.products; // Extracted via join
                    return (
                      <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          {productData?.image_url ? (
                            <Image src={productData.image_url} alt="Product" fill style={{ objectFit: 'cover' }} sizes="80px" />
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>IMG</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{productData?.title || 'No longer available'}</h4>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Qty: {item.quantity} × ₹{Number(item.price_at_purchase).toFixed(2)}
                          </p>
                        </div>
                        <div style={{ fontWeight: 600 }}>
                           ₹{(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
