import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CustomerHeader from '@/components/CustomerHeader';
import { CartProvider } from '@/context/CartContext';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/login');
  }

  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomerHeader userEmail={user.email} />
        
        {/* Main Content Area */}
        <main className="container" style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>
    </CartProvider>
  );
}
