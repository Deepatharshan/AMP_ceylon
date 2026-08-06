import ProductForm from '../../catalog/ProductForm';
import Link from 'next/link';

export default function NewCartonPage() {
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
          Add New Carton Box
        </h2>
      </div>
      
      <div className="bg-white rounded border border-[#ececec] shadow-sm overflow-hidden">
        <ProductForm businessLine="CARTON" />
      </div>
    </div>
  );
}
