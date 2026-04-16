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

  return { success: true, orderId: order.id };
}
