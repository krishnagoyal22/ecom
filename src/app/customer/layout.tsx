import { redirect } from 'next/navigation';
import CustomerHeader from '@/components/CustomerHeader';
import { WishlistProvider } from '@/context/WishlistContext';
import { createClient } from '@/utils/supabase/server';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = user.email === 'goyalkrishna006@gmail.com' || profile?.role === 'admin';

  return (
    <WishlistProvider>
      <div className="customer-shell">
        <CustomerHeader userEmail={user.email} isAdmin={isAdmin} />
        <main className="container store-main">{children}</main>
      </div>
    </WishlistProvider>
  );
}
