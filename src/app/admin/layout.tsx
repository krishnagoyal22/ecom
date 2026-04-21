import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin =
    user.email === "goyalkrishna006@gmail.com" || profile?.role === "admin";

  if (!isAdmin) {
    redirect("/customer");
  }

  const signOut = async () => {
    "use server";
    const sb = await createClient();
    await sb.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="eyebrow">Admin workspace</span>
          <div className="brand-mark">
            <span className="brand-mark-badge" />
            <span>Sunroom Control</span>
          </div>
          <p>
            Manage products, fulfillment, and user roles with a cleaner
            responsive control panel.
          </p>
        </div>

        <nav className="sidebar-nav">
          <Link href="/admin" className="btn btn-secondary sidebar-link">
            Overview
          </Link>
          <Link
            href="/admin/products"
            className="btn btn-secondary sidebar-link"
          >
            Products
          </Link>
          <Link href="/admin/orders" className="btn btn-secondary sidebar-link">
            Orders
          </Link>
          <Link href="/admin/users" className="btn btn-secondary sidebar-link">
            Users
          </Link>
          <Link href="/customer" className="btn btn-ghost sidebar-link">
            Back to storefront
          </Link>
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="label">Signed in</div>
            <strong>{user.email}</strong>
          </div>

          <form action={signOut}>
            <button className="btn btn-secondary sidebar-link" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
