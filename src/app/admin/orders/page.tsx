import { createClient } from '@/utils/supabase/server';
import { updateOrderStatus } from './actions';

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

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, user_id')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Orders</span>
          <h1>Fulfillment management</h1>
          <p>Track order flow and update statuses from the same responsive admin surface.</p>
        </div>
      </section>

      <section className="panel-card">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {!orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">No orders found.</div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.split('-')[0]}...</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <span title={order.user_id}>{order.user_id.split('-')[0]}...</span>
                    </td>
                    <td>Rs. {Number(order.total_amount).toFixed(2)}</td>
                    <td>
                      <span className={getStatusClass(order.status)}>{order.status}</span>
                    </td>
                    <td>
                      <form action={updateOrderStatus} className="mini-form">
                        <input type="hidden" name="id" value={order.id} />
                        <select name="status" defaultValue={order.status} className="input-field">
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button type="submit" className="btn btn-primary">
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
      </section>
    </div>
  );
}
