import { Suspense } from 'react';
import SearchInput from '@/components/SearchInput';
import AnimatedCatalog from '@/components/AnimatedCatalog';
import { createClient } from '@/utils/supabase/server';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

type Product = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | string;
  stock_quantity: number;
  image_url?: string | null;
};

export default async function CustomerPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q || '';

  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data: products, error } = await query;
  const displayProducts = (products || []) as Product[];

  const groupedProducts = displayProducts.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const categories = Object.keys(groupedProducts).sort();

  return (
    <div className="panel-grid">
      <section className="store-hero">
        <article className="card store-panel store-hero-copy fade-in">
          <div>
            <span className="eyebrow">Customer storefront</span>
            <h1>
              A brighter way to <span className="text-gradient">browse</span>.
            </h1>
            <p>
              Explore your catalog by collection, search in real time, and move through the shop
              with a more editorial, warm, and playful frontend feel.
            </p>
          </div>

          <div className="store-kpis">
            <div className="store-kpi">
              <strong>{displayProducts.length}</strong>
              <span>products live</span>
            </div>
            <div className="store-kpi">
              <strong>{categories.length}</strong>
              <span>shop categories</span>
            </div>
            <div className="store-kpi">
              <strong>{searchQuery ? 'Filtered' : 'Open'}</strong>
              <span>{searchQuery ? `query: ${searchQuery}` : 'catalog view'}</span>
            </div>
          </div>
        </article>

        <aside className="card store-panel store-spotlight fade-in">
          <span className="eyebrow">Store mood</span>
          <h2 style={{ fontSize: '2.35rem', marginTop: '1rem' }}>Fresh picks, tidy sections, softer edges.</h2>
          <p style={{ marginTop: '0.9rem', lineHeight: 1.7 }}>
            This catalog keeps the existing data flow intact while making the shopping surface feel
            more intentional and enjoyable to spend time in.
          </p>
        </aside>
      </section>

      <Suspense fallback={<div className="empty-state">Loading search...</div>}>
        <SearchInput />
      </Suspense>

      {error ? (
        <div className="info-banner">
          Could not fetch products live from Supabase. Did you run the SQL script? Error: {error.message}
        </div>
      ) : null}

      {displayProducts.length === 0 && !error ? (
        <div className="empty-state">No products are available yet. Ask the administrator to add some items.</div>
      ) : null}

      {displayProducts.length > 0 ? (
        <AnimatedCatalog categories={categories} groupedProducts={groupedProducts} />
      ) : null}
    </div>
  );
}
