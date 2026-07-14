import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { MoreVertical, Plus, Megaphone, CalendarClock, TrendingUp } from 'lucide-react';
import OfferActionsDropdown from './OfferActionsDropdown';

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const supabase = await createClient();
  const { data: offers = [], error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback to empty array if error or no data (e.g. table not created yet)
  const safeOffers = offers || [];

  const activeCount = safeOffers.filter((o: any) => o.status === 'Active').length;
  const scheduledCount = safeOffers.filter((o: any) => o.status === 'Scheduled').length;
  const totalUsage = safeOffers.reduce((acc: number, o: any) => acc + (o.usage_count || 0), 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-[#ececec] px-8 py-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Offers & Campaigns
          </h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Manage seasonal floral incentives, bulk export discounts, and flash campaigns for international accounts.
          </p>
        </div>
        <Link 
          href="/admin/dashboard/offers/new"
          className="bg-[#3a081a] px-5 py-2.5 rounded text-sm font-medium flex items-center gap-2 hover:bg-[#2a0512] transition-colors"
          style={{ color: '#ffffff' }}
        >
          <Plus size={16} />
          Add New Offer
        </Link>
      </div>

      <div className="p-8 max-w-6xl">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 border border-[#ececec] rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#f4e6ea] text-[#3a081a] flex items-center justify-center">
                <Megaphone size={16} />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Status</span>
            </div>
            <p className="text-3xl font-bold text-[#333] mb-1">{activeCount}</p>
            <p className="text-sm text-gray-500 mb-4">Currently active export offers</p>
            <div className="flex items-center gap-2 text-xs font-medium text-green-600">
              <TrendingUp size={14} />
              <span>+2 from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#ececec] rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#e8f3ee] text-[#1e5a3f] flex items-center justify-center">
                <CalendarClock size={16} />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pipeline</span>
            </div>
            <p className="text-3xl font-bold text-[#333] mb-1">{scheduledCount}</p>
            <p className="text-sm text-gray-500 mb-4">Upcoming seasonal campaigns</p>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <CalendarClock size={14} />
              <span>Next: 'Autumn Silk' (Sept 15)</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#ececec] rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#f4e6ea] text-[#3a081a] flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Engagement</span>
            </div>
            <p className="text-3xl font-bold text-[#333] mb-1">{totalUsage}</p>
            <p className="text-sm text-gray-500 mb-4">Total inquiries using offers</p>
            <div className="flex items-center gap-2 text-xs font-medium text-[#3a081a]">
              <TrendingUp size={14} className="rotate-180" />
              <span>-0.1% vs Q2 average</span>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white border border-[#ececec] rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="flex items-center justify-between p-6 border-b border-[#ececec]">
            <h3 className="text-lg font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Managed Offers
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-[#ececec] text-sm text-gray-600 rounded bg-gray-50 hover:bg-gray-100">
                All Types
              </button>
              <button className="px-3 py-1.5 border border-[#ececec] text-sm text-gray-600 rounded bg-gray-50 hover:bg-gray-100">
                All Status
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfbf9] text-[10px] uppercase tracking-widest text-gray-500 border-b border-[#ececec]">
                  <th className="p-4 font-bold whitespace-nowrap">Offer Name</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Validity</th>
                  <th className="p-4 font-bold">Usage</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-[#ececec]">
                {safeOffers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No offers found. Create your first campaign above.
                    </td>
                  </tr>
                ) : (
                  safeOffers.map((offer: any) => (
                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <p className="font-semibold text-[#333] mb-0.5 whitespace-nowrap">{offer.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">CODE: {offer.code}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${
                          offer.type === 'SEASONAL' ? 'bg-[#e8f3ee] text-[#1e5a3f]' :
                          offer.type === 'EXCLUSIVE' ? 'bg-[#f4e6ea] text-[#8a385a]' :
                          offer.type === 'FLASH' ? 'bg-[#fee2e2] text-[#991b1b]' :
                          offer.type === 'VOLUME' ? 'bg-gray-100 text-gray-600' :
                          'bg-[#e0f2fe] text-[#0369a1]'
                        }`}>
                          {offer.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            offer.status === 'Active' ? 'bg-green-500' :
                            offer.status === 'Scheduled' ? 'bg-gray-400' :
                            'bg-red-500'
                          }`}></span>
                          <span className={
                            offer.status === 'Active' ? 'text-gray-700 font-medium' :
                            offer.status === 'Scheduled' ? 'text-gray-500' :
                            'text-red-600 font-medium'
                          }>
                            {offer.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                        {offer.valid_from ? new Date(offer.valid_from).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'N/A'} - {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'N/A'}
                      </td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">
                        {offer.usage_count.toLocaleString()} {offer.status === 'Scheduled' ? '(Pending)' : 'inquiries'}
                      </td>
                      <td className="p-4 flex justify-center">
                        <OfferActionsDropdown offer={offer} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between p-4 border-t border-[#ececec] bg-gray-50 text-xs text-gray-500">
            <span>Showing {safeOffers.length > 0 ? `1-${safeOffers.length}` : '0'} of {safeOffers.length} campaigns</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 border border-[#ececec] bg-white rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button className="w-8 h-8 flex items-center justify-center bg-[#3a081a] text-white rounded">1</button>
              <button className="px-3 py-1.5 border border-[#ececec] bg-white rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>

        {/* Strategic Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-[#3a081a] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Strategic Guidance
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Our promotional strategy is designed to balance the seasonal shifts in global floral demand. High-performing offers typically focus on the quality of the 'Everlasting' synthetic petals and industrial-grade stems required for large-scale hotel installations.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full border border-[#3a081a] text-[#3a081a] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#333] mb-0.5">Standardized Export Grade</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">All offers must align with ISO-9001 certified artificial material standards.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full border border-[#3a081a] text-[#3a081a] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#333] mb-0.5">Volume Incentives</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Tiered discounts activate at container-load milestones (20ft/40ft HQ).</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-xl overflow-hidden h-64 md:h-auto border border-[#ececec]">
            <Image 
              src="https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=800&auto=format&fit=crop"
              alt="Factory Inventory"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
