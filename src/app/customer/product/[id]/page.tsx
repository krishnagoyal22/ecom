import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnimatedProductView from '@/components/AnimatedProductView';
import { createClient } from '@/utils/supabase/server';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <div className="panel-grid fade-in">
      <div>
        <Link href="/customer" className="subtle-link">
          Back to shop
        </Link>
      </div>

      <AnimatedProductView product={product} />
    </div>
  );
}
