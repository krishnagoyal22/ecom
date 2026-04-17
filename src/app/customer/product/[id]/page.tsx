import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AnimatedProductView from '@/components/AnimatedProductView';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/customer" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Back to Shop
        </Link>
      </div>

      <AnimatedProductView product={product} />
    </div>
  );
}
