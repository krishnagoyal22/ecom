import Link from 'next/link';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

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
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="admin-panel fade-in">
      <section className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Overview</span>
          <h1>Store control at a glance.</h1>
          <p>Manage products and account growth from a dashboard that works just as well on mobile.</p>
        </div>
        <Link href="/admin/products" className="btn btn-primary">
          Manage products
        </Link>
      </section>

      <section className="metrics-grid">
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
            <h2>Catalog tools</h2>
            <p>Add new products, update existing listings, and keep catalog images fresh.</p>
          </div>
          <Link href="/admin/products/new" className="subtle-link">
            Add product
          </Link>
        </div>

        <div className="admin-shortcuts">
          <Link href="/admin/products" className="btn btn-secondary">
            View products
          </Link>
          <Link href="/admin/users" className="btn btn-secondary">
            Manage users
          </Link>
        </div>
      </section>
    </div>
  );
}
