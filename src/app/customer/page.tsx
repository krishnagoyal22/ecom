import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";
import AnimatedCatalog from "@/components/AnimatedCatalog";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

type Product = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url?: string | null;
};

export default async function CustomerPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q || "";

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
    );
  }

  const { data: products, error } = await query;
  const displayProducts = (products || []) as Product[];

  const groupedProducts = displayProducts.reduce(
    (acc, product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  const categories = Object.keys(groupedProducts).sort();
  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category] = groupedProducts[category].length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="panel-grid">
      <section className="store-catalog-intro fade-in">
        <h1>
          <span className="text-gradient">KOTTIAR CREATIONS</span>
        </h1>
        <h2>PREMIUM GLASS BANGLES</h2>
        <p>
          A focused catalog for exploring Kottiar bangles designs by collection,
          finish, and style.
        </p>
      </section>

      <Suspense fallback={<div className="empty-state">Loading search...</div>}>
        <SearchInput />
      </Suspense>

      {error ? (
        <div className="info-banner">
          Could not fetch the catalog from Supabase. Did you run the SQL script?
          Error: {error.message}
        </div>
      ) : null}

      {displayProducts.length === 0 && !error ? (
        <div className="empty-state">
          No products are available yet. Ask the administrator to add some
          items.
        </div>
      ) : null}

      {displayProducts.length > 0 ? (
        <AnimatedCatalog
          categories={categories}
          categoryCounts={categoryCounts}
          groupedProducts={groupedProducts}
        />
      ) : null}
    </div>
  );
}
