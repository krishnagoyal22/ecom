import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

type OrderItem = {
  quantity: number;
  price_at_purchase: number | string;
  products:
    | Array<{
        title: string | null;
        image_url: string | null;
      }>
    | null;
};

type Order = {
  id: string;
  status: string;
  total_amount: number | string;
  created_at: string;
  shipping_address: string | null;
  order_items: OrderItem[] | null;
};

function getStatusClass(status: string) {
  switch (status) {
    case 'Pending':
      return 'status-pill status-pending';
    case 'Delivered':
      return 'status-pill status-delivered';
    case 'Cancelled':
      return 'status-pill status-cancelled';
    case 'Processing':
      return 'status-pill status-processing';
    case 'Shipped':
      return 'status-pill status-shipped';
    default:
      return 'status-pill status-customer';
  }
}

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="status-message status-error">Not authorized.</div>;
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `
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
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="status-message status-error">Could not fetch order history: {error.message}</div>;
  }

  const typedOrders = (orders || []) as unknown as Order[];

  return (
    <div className="panel-grid fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Orders</span>
          <h1>Your order history</h1>
          <p>Review shipping status, purchased items, and totals from a layout that adapts cleanly to mobile.</p>
        </div>
      </section>

      {typedOrders.length === 0 ? (
        <div className="card empty-card">
          <h2 style={{ marginBottom: '1rem' }}>No orders found</h2>
          <p style={{ marginBottom: '1.5rem' }}>You have not placed any orders yet. Let&apos;s fix that.</p>
          <Link href="/customer" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {typedOrders.map((order) => (
            <div key={order.id} className="card order-card">
              <div className="order-card-head">
                <div className="order-card-meta">
                  <div>
                    <div className="label">Order placed</div>
                    <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <div className="label">Total</div>
                    <strong style={{ color: 'var(--success)' }}>Rs. {Number(order.total_amount).toFixed(2)}</strong>
                  </div>
                  <div>
                    <div className="label">Ship to</div>
                    <strong>{order.shipping_address ? order.shipping_address.split('\n')[0] : 'Standard shipping'}</strong>
                  </div>
                </div>

                <div>
                  <div className="label">Order #{order.id.split('-')[0]}</div>
                  <span className={getStatusClass(order.status)}>{order.status}</span>
                </div>
              </div>

              <div className="order-card-body">
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Items in this delivery</h3>
                <div className="order-items">
                  {(order.order_items || []).map((item, index) => {
                    const productData = item.products?.[0] || null;
                    return (
                      <div key={`${order.id}-${index}`} className="order-item">
                        <div className="thumbnail" style={{ width: '5rem', height: '5rem', borderRadius: '22px' }}>
                          {productData?.image_url ? (
                            <Image
                              src={productData.image_url}
                              alt={productData.title || 'Product'}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="80px"
                            />
                          ) : (
                            'IMG'
                          )}
                        </div>

                        <div className="order-item-copy">
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>
                            {productData?.title || 'No longer available'}
                          </h4>
                          <p>
                            Qty: {item.quantity} x Rs. {Number(item.price_at_purchase).toFixed(2)}
                          </p>
                        </div>

                        <strong>Rs. {(Number(item.price_at_purchase) * item.quantity).toFixed(2)}</strong>
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
