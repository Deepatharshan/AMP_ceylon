import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> | { id: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const { data: product } = await supabase
      .from('products')
      .select('name, description, image_url')
      .eq('id', id)
      .single();
      
    if (!product) {
      return { title: 'Product Not Found | AMP Ceylon' };
    }

    return {
      title: ` | AMP Ceylon`,
      description: product.description?.substring(0, 160) || 'Premium artificial botanical product by AMP Ceylon.',
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160) || '',
        images: product.image_url ? [{ url: product.image_url }] : [],
      },
      alternates: {
        canonical: `/product/${id}`,
      },
    };
  } catch (error) {
    return { title: 'Product | AMP Ceylon' };
  }
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ClientPage params={params} />;
}
