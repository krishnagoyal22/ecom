import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

export default async function AdminDashboardPage() {
  // Initialize Supabase Admin strictly on the server-side with the Service Role Key
  // This bypasses RLS and allows interacting directly with the Auth Admin API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let users = null;
  let authError = null;

  if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key-here') {
    authError = new Error("SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. You need this to fetch the auth list natively.");
  } else {
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      authError = error;
    } else {
      users = data.users;
    }
  }

  return (
    <>
      <div className="header">
        <h1>Dashboard Overview</h1>
        <button className="btn btn-primary">Download Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="label">Total Auth Users</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{users ? users.length : '--'}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Directly from Supabase Auth</div>
        </div>
        <div className="card">
          <div className="label">Active Sessions</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>42</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem' }}>+4% from last month</div>
        </div>
        <div className="card">
          <div className="label">Current Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>$12,400</div>
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>-2% from last month</div>
        </div>
      </div>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Registered Users (Supabase Auth API)</h2>
        <div className="card">
          {authError ? (
            <div style={{ color: 'var(--danger)', padding: '1rem' }}>
              <p style={{ fontWeight: 600 }}>Could not fetch users directly from Auth API.</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Error details: {authError.message}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>UUID</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Email</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No registered users found.</td>
                    </tr>
                  ) : (
                    users?.map((u) => (
                      <tr key={u.id}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem' }}>{u.id}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{u.email}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                           {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
