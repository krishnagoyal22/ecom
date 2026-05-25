import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

const PRODUCT_IMAGE_BUCKET = 'product-images';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseAdmin(supabaseUrl, supabaseServiceKey);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadProductImage(supabase: ReturnType<typeof getAdminClient>, formData: FormData) {
  const image = formData.get('image') as File | null;

  if (!image || image.size === 0) {
    return null;
  }

  const bucketResult = await supabase.storage.getBucket(PRODUCT_IMAGE_BUCKET);
  if (bucketResult.error) {
    const { error: createBucketError } = await supabase.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
    });

    if (createBucketError && !createBucketError.message.toLowerCase().includes('already exists')) {
      throw new Error(`Failed to prepare image bucket: ${createBucketError.message}`);
    }
  } else if (!bucketResult.data.public) {
    const { error: updateBucketError } = await supabase.storage.updateBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
    });

    if (updateBucketError) {
      throw new Error(`Failed to make image bucket public: ${updateBucketError.message}`);
    }
  }

  const fileName = sanitizeFileName(image.name) || 'product-image';
  const storagePath = `${Date.now()}-${crypto.randomUUID()}-${fileName}`;
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(storagePath, image, {
      contentType: image.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function POST(request: NextRequest) {
  const supabase = getAdminClient();
  const formData = await request.formData();
  const mode = formData.get('mode') as string;
  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const description = ((formData.get('description') as string | null) || '').trim();
  const category = formData.get('category') as string;
  const existingImageUrl = formData.get('existing_image_url') as string | null;
  const uploadedImageUrl = await uploadProductImage(supabase, formData);
  const image_url = uploadedImageUrl || existingImageUrl || null;

  const payload = {
    title,
    description: description || null,
    price: 0,
    image_url,
    category: category || 'Uncategorized',
    stock_quantity: 0,
  };

  if (mode === 'edit' && id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id);

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from('products').insert(payload);

    if (error) {
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/customer');
  return NextResponse.redirect(new URL('/admin/products', request.url), 303);
}
