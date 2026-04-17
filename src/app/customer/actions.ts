'use server';

import { createClient } from '@/utils/supabase/server';
import { CartItem } from '@/context/CartContext';

export async function processCheckout(items: CartItem[], totalAmount: number, shippingAddress: string) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'User must be logged in to checkout.' };
  }

  // Fetch the user's profile ID (which is the same as auth UUID)
  const profileId = user.id;

  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: profileId,
      status: 'Pending',
      total_amount: totalAmount,
      shipping_address: shippingAddress 
    })
    .select()
    .single();

  if (orderError || !order) {
    return { success: false, error: 'Failed to create order tracking.' + orderError?.message };
  }

  // 2. Insert order items securely
  const orderItemsInsertData = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsInsertData);

  if (itemsError) {
    // Note: A robust system would implement a transaction rollback here.
    return { success: false, error: 'Failed to record items for the order.' };
  }

  // 3. Update product inventory securely using Service Role Key
  const { createClient: createSupabaseAdmin } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (supabaseServiceKey && supabaseServiceKey !== 'your-service-role-key-here') {
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
    
    for (const item of items) {
      // Fetch latest stock to carefully deduct
      const { data: product } = await supabaseAdmin.from('products').select('stock_quantity').eq('id', item.id).single();
      if (product) {
        const newStock = Math.max(0, product.stock_quantity - item.quantity);
        await supabaseAdmin.from('products').update({ stock_quantity: newStock }).eq('id', item.id);
      }
    }
  }

  return { success: true, orderId: order.id };
}
