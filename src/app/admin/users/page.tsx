import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

export default async function AdminUsersPage() {
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
      <div className="header fade-in">
        <h1>User Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View all registered accounts in your Supabase Auth instance.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {authError ? (
          <div style={{ color: 'var(--danger)', padding: '2rem' }}>
            <p style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Could not fetch users directly from Auth API.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Error details: {authError.message}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>UUID</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Email</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Account Joined</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Last Sign In</th>
                </tr>
              </thead>
              <tbody>
                {users?.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No registered users found.</td>
                  </tr>
                ) : (
                  users?.map((u) => (
                    <tr key={u.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                        <span title={u.id}>{u.id.split('-')[0]}...{u.id.split('-').pop()}</span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                         {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                         {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
