import { createClient } from '@/utils/supabase/server';
import { updateOrderStatus } from './actions';

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  
  // Fetch orders with order_items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      created_at,
      shipping_address,
      user_id
    `)
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="header fade-in">
        <h1>Orders Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and update fulfillment status for customer orders.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Order ID</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Customer ID</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Subtotal</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'right' }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem' }}>{order.id.split('-')[0]}...</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                      <span title={order.user_id}>{order.user_id.split('-')[0]}...</span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--success)', fontWeight: 600 }}>
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                       <span className="badge" style={{ backgroundColor: order.status === 'Pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: order.status === 'Pending' ? '#eab308' : 'var(--accent-primary)', borderColor: order.status === 'Pending' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(99, 102, 241, 0.3)' }}>
                          {order.status}
                       </span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                      <form action={updateOrderStatus} style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="hidden" name="id" value={order.id} />
                        <select name="status" defaultValue={order.status} className="input-field" style={{ padding: '0.25rem', fontSize: '0.875rem', width: 'auto' }}>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
