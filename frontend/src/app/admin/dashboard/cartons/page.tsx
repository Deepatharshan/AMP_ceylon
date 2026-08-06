import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import CatalogTable from '../catalog/CatalogTable';

export default async function CartonsPage() {
  const supabase = await createClient();

  const { data: products = [], error } = await supabase
    .from('products')
    .select('*')
    .eq('business_line', 'CARTON')
    .order('created_at', { ascending: false });

  const { data: inquiries = [] } = await supabase
    .from('inquiries')
    .select('status');

  if (error) {
    console.error('Failed to load products:', error);
  }

  const totalProducts = products?.length || 0;
  const categoriesCount = Array.from(new Set((products || []).map(p => p.category))).length;
  // Note: inquiries are shared across both for now unless we add business_line to inquiries too. 
  // Let's just show total global inquiries for now or filter if we can.
  const totalInquiries = inquiries?.length || 0;
  const totalOrders = (inquiries || []).filter(inq => 
    inq.status?.toLowerCase() === 'order_confirmed' || 
    inq.status?.toLowerCase() === 'order confirmed'
  ).length;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Carton Boxes Management
          </h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Manage and track your carton box inventory and offerings.
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/admin/dashboard/report"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#3a081a] rounded hover:bg-[#4a0b22] transition-colors flex items-center gap-2"
            style={{ color: '#ffffff' }}
          >
            Export Report
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </Link>
          <Link 
            href="/admin/dashboard/cartons/new"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#3a081a] rounded hover:bg-[#4a0b22] transition-colors flex items-center gap-2"
            style={{ color: '#ffffff' }}
          >
            + Add New Carton Box
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Cartons</p>
          <h3 className="text-3xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {totalProducts}
          </h3>
          <p className="text-[10px] text-gray-400 mt-2">Active items in catalog</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Categories</p>
          <h3 className="text-3xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {categoriesCount}
          </h3>
          <p className="text-[10px] text-gray-400 mt-2">Unique catalog collections</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Inquiries</p>
          <h3 className="text-3xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {totalInquiries}
          </h3>
          <p className="text-[10px] text-gray-400 mt-2">Global inquiries received</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {totalOrders}
          </h3>
          <p className="text-[10px] text-gray-400 mt-2">Total orders processed</p>
        </div>
      </div>

      {/* Catalog Table */}
      <CatalogTable initialProducts={products || []} businessLine="CARTON" />
    </div>
  );
}
