import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

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

  // Fetch all orders to calculate revenue and count
  const { data: allOrders } = await supabase.from('orders').select('id, total_amount, status, created_at, shipping_address').order('created_at', { ascending: false });
  
  const totalOrders = allOrders ? allOrders.length : 0;
  const totalRevenue = allOrders ? allOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) : 0;
  const recentOrders = allOrders ? allOrders.slice(0, 5) : [];

  // Fetch products count
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });

  return (
    <>
      <div className="header fade-in">
        <h1>Dashboard Overview</h1>
        <button className="btn btn-primary" style={{ backgroundColor: 'var(--accent-primary)' }}>Download Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div className="label">Current Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Based on {totalOrders} orders</div>
        </div>
        <div className="card">
          <div className="label">Total Orders</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalOrders}</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>All time fulfillment</div>
        </div>
        <div className="card">
          <div className="label">Active Products</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalProducts || 0}</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>In your store catalogue</div>
        </div>
        <div className="card">
          <div className="label">Total User Accounts</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{authUsersCount}</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Registered via Supabase Auth</div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>View All Orders →</Link>
        </div>
        
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Order ID</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Date</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders placed yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem' }}>...{order.id.split('-').pop()}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <span className="badge" style={{ backgroundColor: order.status === 'Pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: order.status === 'Pending' ? '#eab308' : 'var(--accent-primary)', borderColor: order.status === 'Pending' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(99, 102, 241, 0.3)' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 600 }}>
                        ₹{Number(order.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
