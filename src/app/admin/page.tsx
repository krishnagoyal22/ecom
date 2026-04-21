import Link from 'next/link';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

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

export default async function AdminDashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let authUsersCount = 0;
  if (supabaseServiceKey && supabaseServiceKey !== 'your-service-role-key-here') {
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
    if (authData?.users) {
      authUsersCount = authData.users.length;
    }
  }

  const supabase = await createClient();
  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at')
    .order('created_at', { ascending: false });
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const totalOrders = allOrders ? allOrders.length : 0;
  const totalRevenue = allOrders
    ? allOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
    : 0;
  const recentOrders = allOrders ? allOrders.slice(0, 5) : [];

  return (
    <div className="admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Overview</span>
          <h1>Store control at a glance.</h1>
          <p>Track revenue, orders, products, and account growth from a dashboard that works just as well on mobile.</p>
        </div>
        <Link href="/admin/orders" className="btn btn-primary">
          Review orders
        </Link>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <div className="label">Current revenue</div>
          <strong>Rs. {totalRevenue.toFixed(2)}</strong>
          <span>Based on {totalOrders} total orders</span>
        </article>
        <article className="metric-card">
          <div className="label">Orders placed</div>
          <strong>{totalOrders}</strong>
          <span>All-time order count</span>
        </article>
        <article className="metric-card">
          <div className="label">Active products</div>
          <strong>{totalProducts || 0}</strong>
          <span>Items available in the catalog</span>
        </article>
        <article className="metric-card">
          <div className="label">Registered accounts</div>
          <strong>{authUsersCount}</strong>
          <span>Users found in Supabase Auth</span>
        </article>
      </section>

      <section className="panel-card">
        <div className="panel-card-header">
          <div className="page-head-copy">
            <h2>Recent orders</h2>
            <p>The latest activity from the storefront, with clearer status visibility.</p>
          </div>
          <Link href="/admin/orders" className="subtle-link">
            View all orders
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">No orders have been placed yet.</div>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>...{order.id.split('-').pop()}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusClass(order.status)}>{order.status}</span>
                    </td>
                    <td>Rs. {Number(order.total_amount).toFixed(2)}</td>
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
