import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { updateUserRole } from './actions';

type Role = 'admin' | 'customer';

type AdminUserRow = {
  id: string;
  email: string | null;
  created_at: string;
  role: Role;
};

function getRoleClass(email: string | null, role: Role) {
  if (email === 'goyalkrishna006@gmail.com') {
    return 'status-pill status-owner';
  }
  return role === 'admin' ? 'status-pill status-admin' : 'status-pill status-customer';
}

export default async function AdminUsersPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let usersWithRoles: AdminUserRow[] = [];
  let authError: Error | null = null;

  if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key-here') {
    authError = new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. Add it to fetch auth users in the admin panel.'
    );
  } else {
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers();
    const { data: profiles, error: profileErr } = await supabaseAdmin.from('profiles').select('id, role');

    if (authErr) {
      authError = authErr;
    } else if (profileErr) {
      authError = new Error(profileErr.message);
    } else {
      const profileMap = new Map(
        (profiles || []).map((profile) => [profile.id, (profile.role === 'admin' ? 'admin' : 'customer') as Role])
      );

      usersWithRoles = authData.users.map((user) => ({
        id: user.id,
        email: user.email ?? null,
        created_at: user.created_at,
        role: profileMap.get(user.id) || 'customer',
      }));
    }
  }

  return (
    <div className="admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Users</span>
          <h1>Role management</h1>
          <p>Review registered accounts and promote trusted users without breaking mobile layout.</p>
        </div>
      </section>

      <section className="panel-card">
        {authError ? (
          <div className="status-message status-error">
            <strong>Could not fetch users from Supabase Auth.</strong>
            <div style={{ marginTop: '0.35rem' }}>{authError.message}</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersWithRoles.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">No registered users found.</div>
                    </td>
                  </tr>
                ) : (
                  usersWithRoles.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.email || 'Unknown email'}
                        {user.email === 'goyalkrishna006@gmail.com' ? (
                          <span style={{ marginLeft: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.8rem' }}>
                            Owner
                          </span>
                        ) : null}
                      </td>
                      <td>
                        <span className={getRoleClass(user.email, user.role)}>
                          {user.email === 'goyalkrishna006@gmail.com' ? 'Owner' : user.role}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        {user.email !== 'goyalkrishna006@gmail.com' ? (
                          <form action={updateUserRole}>
                            <input type="hidden" name="id" value={user.id} />
                            <input
                              type="hidden"
                              name="role"
                              value={user.role === 'admin' ? 'customer' : 'admin'}
                            />
                            <button type="submit" className="btn btn-secondary">
                              {user.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                            </button>
                          </form>
                        ) : (
                          <span className="label" style={{ marginBottom: 0 }}>
                            Immutable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
