import { createClient } from '@/utils/supabase/server';
import ProductForm from '../../../catalog/ProductForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditCartonPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/admin/dashboard/cartons"
          className="text-gray-400 hover:text-black transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </Link>
        <h2 className="text-2xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
          Edit Carton Box
        </h2>
      </div>
      
      <div className="bg-white rounded border border-[#ececec] shadow-sm overflow-hidden">
        <ProductForm product={product} businessLine="CARTON" />
      </div>
    </div>
  );
}
