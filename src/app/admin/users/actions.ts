'use server';

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
  
  const id = formData.get('id') as string;
  const newRole = formData.get('role') as string;

  // Check if profile exists first
  const { data: existingProfile } = await supabaseAdmin.from('profiles').select('id').eq('id', id).single();

  let actionError = null;

  if (existingProfile) {
    const { error } = await supabaseAdmin.from('profiles').update({ role: newRole }).eq('id', id);
    actionError = error;
  } else {
    // If they slipped past the trigger, force insert a new core profile for them
    const { error } = await supabaseAdmin.from('profiles').insert({ id, role: newRole });
    actionError = error;
  }

  if (actionError) {
    throw new Error(`Failed to update user role: ${actionError.message}`);
  }

  revalidatePath('/admin/users');
}
