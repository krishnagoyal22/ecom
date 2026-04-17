'use server';

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
  
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;

  const { error } = await supabaseAdmin.from('orders').update({
    status,
  }).eq('id', id);

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}
