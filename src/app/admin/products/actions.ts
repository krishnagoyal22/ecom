'use server';

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

async function ensureProductImageBucketIsPublic(supabase: ReturnType<typeof getAdminClient>) {
  const bucketResult = await supabase.storage.getBucket(PRODUCT_IMAGE_BUCKET);
  if (bucketResult.error) {
    const { error: createBucketError } = await supabase.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
    });

    if (createBucketError && !createBucketError.message.toLowerCase().includes('already exists')) {
      throw new Error(`Failed to prepare image bucket: ${createBucketError.message}`);
    }

    return;
  }

  if (!bucketResult.data.public) {
    const { error: updateBucketError } = await supabase.storage.updateBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
    });

    if (updateBucketError) {
      throw new Error(`Failed to make image bucket public: ${updateBucketError.message}`);
    }
  }
}

function getProductTitleFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '').trim() || fileName;
}

async function uploadProductImage(supabase: ReturnType<typeof getAdminClient>, formData: FormData) {
  const image = formData.get('image') as File | null;

  if (!image || image.size === 0) {
    return null;
  }

  await ensureProductImageBucketIsPublic(supabase);

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

export async function syncProductsFromImageBucket() {
  const supabase = getAdminClient();
  await ensureProductImageBucketIsPublic(supabase);

  const { data: rootItems, error: rootError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .list('', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (rootError) {
    throw new Error(`Failed to list image bucket: ${rootError.message}`);
  }

  const bucketCategories = (rootItems || [])
    .filter((item) => !item.id)
    .map((item) => item.name);

  let deleted = 0;
  if (bucketCategories.length > 0) {
    const { data: productsOutsideBucketCategories, error: outsideCategoriesError } = await supabase
      .from('products')
      .select('id, category');

    if (outsideCategoriesError) {
      throw new Error(`Failed to compare product categories: ${outsideCategoriesError.message}`);
    }

    const productIdsToDelete = (productsOutsideBucketCategories || [])
      .filter((product) => !product.category || !bucketCategories.includes(product.category))
      .map((product) => product.id);

    if (productIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', productIdsToDelete);

      if (deleteError) {
        throw new Error(`Failed to delete products outside bucket categories: ${deleteError.message}`);
      }

      deleted = productIdsToDelete.length;
    }
  }

  const { data: existingProducts, error: existingProductsError } = await supabase
    .from('products')
    .select('image_url');

  if (existingProductsError) {
    throw new Error(`Failed to read existing products: ${existingProductsError.message}`);
  }

  const existingImageUrls = new Set(
    (existingProducts || [])
      .map((product) => product.image_url)
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
  );

  const productsToInsert = [];

  for (const category of bucketCategories) {
    const { data: files, error: filesError } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .list(category, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (filesError) {
      throw new Error(`Failed to list ${category}: ${filesError.message}`);
    }

    for (const file of files || []) {
      if (!file.id || file.name === '.emptyFolderPlaceholder') {
        continue;
      }

      const imagePath = `${category}/${file.name}`;
      const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(imagePath);

      if (existingImageUrls.has(data.publicUrl)) {
        continue;
      }

      existingImageUrls.add(data.publicUrl);
      productsToInsert.push({
        title: getProductTitleFromFileName(file.name),
        description: null,
        price: 0,
        image_url: data.publicUrl,
        category,
        stock_quantity: 0,
      });
    }
  }

  if (productsToInsert.length === 0) {
    return { inserted: 0, deleted };
  }

  const { error: insertError } = await supabase.from('products').insert(productsToInsert);

  if (insertError) {
    throw new Error(`Failed to add bucket products: ${insertError.message}`);
  }

  return { inserted: productsToInsert.length, deleted };
}

export async function addProduct(formData: FormData) {
  const supabase = getAdminClient();
  
  const title = formData.get('title') as string;
  const description = ((formData.get('description') as string | null) || '').trim();
  const image_url = await uploadProductImage(supabase, formData);
  const category = formData.get('category') as string;

  const { error } = await supabase.from('products').insert({
    title,
    description: description || null,
    price: 0,
    image_url: image_url || null,
    category: category || 'Uncategorized',
    stock_quantity: 0,
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
  const description = ((formData.get('description') as string | null) || '').trim();
  const existingImageUrl = formData.get('existing_image_url') as string;
  const uploadedImageUrl = await uploadProductImage(supabase, formData);
  const image_url = uploadedImageUrl || existingImageUrl;
  const category = formData.get('category') as string;

  const { error } = await supabase.from('products').update({
    title,
    description: description || null,
    price: 0,
    image_url: image_url || null,
    category: category || 'Uncategorized',
    stock_quantity: 0,
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
