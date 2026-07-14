import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductForm from '../../ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('Error fetching product for edit:', error);
    return notFound();
  }

  // Map database format to form format if needed
  const mappedProduct = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    sku: product.sku,
    category: product.category,
    price: Number(product.price),
    materials: product.materials || [],
    colors: product.colors || [],
    is_top_seller: product.is_top_seller || false,
    is_new_collection: product.is_new_collection || false,
    is_limited_product: product.is_limited_product || false,
    image_url: product.image_url || '',
    image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
    stock_count: product.stock_count || 0,
    active_count: product.active_count || 0,
    size: product.size || '',
    market: product.market || 'Both',
  };

  return <ProductForm product={mappedProduct} />;
}
