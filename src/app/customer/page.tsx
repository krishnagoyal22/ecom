import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import SearchInput from '@/components/SearchInput';
import AnimatedCatalog from '@/components/AnimatedCatalog';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CustomerPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q || '';

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data: products, error } = await query;

  const displayProducts = products || [];

  // Group products by category
  const groupedProducts = displayProducts.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div>
      <div className="header fade-in">
        <div>
          <h1 className="text-gradient">Welcome to our Premium Store</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0', fontSize: '1.125rem' }}>Browse our latest curated products below.</p>
        </div>
      </div>

      <Suspense fallback={<div style={{ marginBottom: '2rem' }}>Loading search...</div>}>
        <SearchInput />
      </Suspense>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          Could not fetch products live from Supabase. Did you run the SQL script? Error: {error.message}
        </div>
      )}

      {displayProducts.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No products found in the store! Ask the administrator to add some.
        </div>
      )}

      {/* Render dynamically grouped sections via Animated GSAP Wrapper */}
      <AnimatedCatalog categories={categories} groupedProducts={groupedProducts} />
    </div>
  );
}
