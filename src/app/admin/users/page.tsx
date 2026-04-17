import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { updateUserRole } from './actions';

export default async function AdminUsersPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let usersWithRoles: any[] = [];
  let authError = null;

  if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key-here') {
    authError = new Error("SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. You need this to fetch the auth list natively.");
  } else {
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
    
    // Fetch auth users
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers();
    
    // Fetch profiles map
    const { data: profiles, error: profileErr } = await supabaseAdmin.from('profiles').select('id, role');

    if (authErr) {
      authError = authErr;
    } else {
      const profileMap = new Map(profiles?.map(p => [p.id, p.role]) || []);
      
      usersWithRoles = authData.users.map((u) => ({
        ...u,
        role: profileMap.get(u.id) || 'customer'
      }));
    }
  }

  return (
    <>
      <div className="header fade-in">
        <h1>User Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Assign administrative permissions and view registered accounts.</p>
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
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Email</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Joined</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersWithRoles.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No registered users found.</td>
                  </tr>
                ) : (
                  usersWithRoles.map((u) => (
                    <tr key={u.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                        {u.email} {u.email === 'goyalkrishna006@gmail.com' && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Owner)</span>}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                         <span className="badge" style={{ 
                            backgroundColor: u.email === 'goyalkrishna006@gmail.com' ? 'rgba(234, 179, 8, 0.2)' : u.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', 
                            color: u.email === 'goyalkrishna006@gmail.com' ? '#eab308' : u.role === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            borderColor: u.email === 'goyalkrishna006@gmail.com' ? 'rgba(234, 179, 8, 0.3)' : 'transparent'
                          }}>
                           {u.email === 'goyalkrishna006@gmail.com' ? 'OWNER' : u.role.toUpperCase()}
                         </span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                         {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                         {u.email !== 'goyalkrishna006@gmail.com' ? (
                           <form action={updateUserRole} style={{ display: 'inline-block' }}>
                              <input type="hidden" name="id" value={u.id} />
                              <input type="hidden" name="role" value={u.role === 'admin' ? 'customer' : 'admin'} />
                              <button type="submit" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                              </button>
                           </form>
                         ) : (
                           <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Immutable</span>
                         )}
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
