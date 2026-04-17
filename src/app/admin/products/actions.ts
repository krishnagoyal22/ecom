'use server';

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
}

export async function addProduct(formData: FormData) {
  const supabase = getAdminClient();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const image_url = formData.get('image_url') as string;
  const category = formData.get('category') as string;
  const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10);

  const { error } = await supabase.from('products').insert({
    title,
    description,
    price,
    image_url: image_url || null,
    category: category || 'Uncategorized',
    stock_quantity: isNaN(stock_quantity) ? 0 : stock_quantity,
  });

  if (error) {
    throw new Error(`Failed to add product: ${error.message}`);
  }

  revalidatePath('/admin/products');
  revalidatePath('/customer');
  redirect('/admin/products');
}

export async function updateProduct(formData: FormData) {
  const supabase = getAdminClient();
  
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const image_url = formData.get('image_url') as string;
  const category = formData.get('category') as string;
  const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10);

  const { error } = await supabase.from('products').update({
    title,
    description,
    price,
    image_url: image_url || null,
    category: category || 'Uncategorized',
    stock_quantity: isNaN(stock_quantity) ? 0 : stock_quantity,
  }).eq('id', id);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  revalidatePath('/admin/products');
  revalidatePath('/customer');
  redirect('/admin/products');
}

export async function deleteProduct(formData: FormData) {
  const supabase = getAdminClient();
  const id = formData.get('id') as string;

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  revalidatePath('/admin/products');
  revalidatePath('/customer');
}
