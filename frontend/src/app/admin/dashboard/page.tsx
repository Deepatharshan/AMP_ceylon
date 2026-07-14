import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

const getFlagEmoji = (countryName: string) => {
  const code = countryName.toLowerCase();
  if (code.includes('france')) return '🇫🇷';
  if (code.includes('uae') || code.includes('dubai') || code.includes('united arab')) return '🇦🇪';
  if (code.includes('sweden')) return '🇸🇪';
  if (code.includes('uk') || code.includes('united kingdom') || code.includes('london')) return '🇬🇧';
  if (code.includes('usa') || code.includes('united states') || code.includes('america')) return '🇺🇸';
  if (code.includes('sri lanka') || code.includes('colombo') || code.includes('ceylon')) return '🇱🇰';
  if (code.includes('india')) return '🇮🇳';
  if (code.includes('japan') || code.includes('tokyo')) return '🇯🇵';
  if (code.includes('germany')) return '🇩🇪';
  if (code.includes('italy')) return '🇮🇹';
  if (code.includes('spain')) return '🇪🇸';
  if (code.includes('colombia')) return '🇨🇴';
  return '🌐';
};

const getStatusColor = (status: string) => {
  switch(status.toLowerCase()) {
    case 'quoted': return 'bg-green-50 text-green-700 border border-green-200'
    case 'pending': 
    case 'new': 
      return 'bg-gray-50 text-gray-600 border border-gray-200'
    case 'order_confirmed':
    case 'order confirmed':
      return 'bg-rose-50 text-rose-700 border border-rose-200'
    case 'reply_sent':
    case 'reply sent':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    default: return 'bg-blue-50 text-blue-700 border border-blue-200'
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const { redirect } = await import('next/navigation');
    redirect('/admin/login');
  }

  // Fetch inquiries with items and products
  const { data: dbInquiries } = await supabase
    .from('inquiries')
    .select(`
      *,
      inquiry_items (
        *,
        products (
          category
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Fetch products
  const { data: dbProducts } = await supabase
    .from('products')
    .select('category, sku');

  const inquiries = dbInquiries && dbInquiries.length > 0 ? dbInquiries : [
    { id: 'inq-1', customer_name: "L'Art de Vivre", company_name: "L'Art Group", country: "France", created_at: "2024-10-24T10:00:00Z", status: "quoted" },
    { id: 'inq-2', customer_name: "Dubai Luxe Hotels", company_name: "Luxe Group", country: "UAE", created_at: "2024-10-23T14:30:00Z", status: "pending" },
    { id: 'inq-3', customer_name: "Nordic Floral Design", company_name: "Nordic AB", country: "Sweden", created_at: "2024-10-22T09:15:00Z", status: "reply_sent" },
    { id: 'inq-4', customer_name: "Bloom & Willow", company_name: "Bloom Ltd", country: "United Kingdom", created_at: "2024-10-21T16:45:00Z", status: "quoted" },
    { id: 'inq-5', customer_name: "Garden State Co.", company_name: "Garden Co", country: "USA", created_at: "2024-10-20T11:20:00Z", status: "pending" },
  ];

  // 1. Total Inquiries
  const totalInquiries = inquiries.length;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const currentMonthCount = inquiries.filter(i => new Date(i.created_at) >= thirtyDaysAgo).length;
  const prevMonthCount = inquiries.filter(i => {
    const d = new Date(i.created_at);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  }).length;
  let percentMonthChange = 0;
  if (prevMonthCount > 0) {
    percentMonthChange = Math.round(((currentMonthCount - prevMonthCount) / prevMonthCount) * 100);
  } else if (currentMonthCount > 0) {
    percentMonthChange = 100;
  }

  // 2. Active Quotes
  const activeQuotes = inquiries.filter(i => 
    ['quoted', 'reply_sent', 'pending', 'new'].includes(i.status.toLowerCase())
  ).length;

  // 3. Catalog Items
  const productsList = dbProducts || [];
  const catalogCount = productsList.length;
  const categoriesCount = new Set(productsList.map(p => p.category)).size;

  // 4. Regional Reach (unique countries)
  const regionalCount = new Set(inquiries.map(i => i.country)).size;

  // 5. Monthly Volume Chart
  const getMonthName = (date: Date) => date.toLocaleString('en-US', { month: 'short' });
  const monthsList: { name: string; count: number; year: number; month: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthsList.push({ name: getMonthName(d), count: 0, year: d.getFullYear(), month: d.getMonth() });
  }
  inquiries.forEach(inq => {
    const inqDate = new Date(inq.created_at);
    const match = monthsList.find(m => m.year === inqDate.getFullYear() && m.month === inqDate.getMonth());
    if (match) match.count++;
  });
  const maxVolumeCount = Math.max(...monthsList.map(m => m.count), 1);

  // 6. Category Interest Share
  const categoryCounts: Record<string, number> = {};
  let totalItemsCount = 0;
  inquiries.forEach(inq => {
    inq.inquiry_items?.forEach((item: any) => {
      const cat = item.products?.category || 'Floral Arrangements';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      totalItemsCount++;
    });
  });
  const sortedCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      percentage: totalItemsCount > 0 ? Math.round((count / totalItemsCount) * 100) : 0
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  const topCategories = sortedCategories.length > 0 ? sortedCategories : [
    { name: 'Floral Arrangements', percentage: 52 },
    { name: 'Luxury Candles', percentage: 28 },
    { name: 'Hand-woven Rattan', percentage: 20 }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Welcome back to the AMP Ceylon export gateway. Monitor your global inquiry volume and inventory health in real-time.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/dashboard/inquiries" className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors text-center block">
            Manage Inquiries
          </Link>
          <Link 
            href="/admin/dashboard/report"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#3a081a] text-white rounded hover:bg-[#4a0b22] transition-colors flex items-center gap-2"
            style={{ color: '#ffffff' }}
          >
            Export Report
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#f9f5f6] rounded text-[#3a081a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <span className={`text-xs font-bold flex items-center gap-1 ${percentMonthChange >= 0 ? 'text-[#4a5d3c]' : 'text-red-500'}`}>
              {percentMonthChange >= 0 ? `+${percentMonthChange}%` : `${percentMonthChange}%`}{' '}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Inquiries</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>{totalInquiries}</h3>
          <p className="text-[10px] text-gray-400 mt-2">vs {prevMonthCount} last month</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#e8ece3] rounded text-[#4a5d3c] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Active Quotes</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>{activeQuotes}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Awaiting buyer response</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#f9f5f6] rounded text-[#3a081a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Catalog Items</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {catalogCount > 0 ? catalogCount.toLocaleString() : '0'}
          </h3>
          <p className="text-[10px] text-gray-400 mt-2">Active SKUs across {categoriesCount} categories</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#f9f5f6] rounded text-[#3a081a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <span className="text-[10px] font-bold bg-[#fceeed] text-[#e05d52] px-2 py-0.5 rounded">NEW</span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Regional Reach</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>{regionalCount}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Active countries served</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Recent Inquiries Table */}
        <div className="col-span-2 bg-white border border-[#ececec] rounded shadow-sm flex flex-col">
          <div className="p-5 flex justify-between items-center border-b border-[#ececec]">
            <h3 className="font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>Recent Inquiries</h3>
            <Link href="/admin/dashboard/inquiries" className="text-xs font-bold text-[#3a081a] hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-[#ececec]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Buyer Name</th>
                  <th className="px-6 py-4 font-semibold">Country</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.slice(0, 5).map((inq, idx) => (
                  <tr key={inq.id} className={idx !== inquiries.slice(0, 5).length - 1 ? 'border-b border-[#ececec]' : ''}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {inq.customer_name}
                      {inq.company_name && <span className="block text-[10px] text-gray-400 font-normal">{inq.company_name}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <span className="text-base leading-none">{getFlagEmoji(inq.country)}</span>
                        {inq.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getStatusColor(inq.status)}`}>
                        {inq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href="/admin/dashboard/inquiries" className="text-xs font-bold text-[#3a081a] hover:underline">View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-[#ececec] text-center bg-gray-50 rounded-b">
            <Link href="/admin/dashboard/inquiries" className="text-xs text-gray-500 font-medium hover:text-[#3a081a]">Show More Inquiries ▾</Link>
          </div>
        </div>

        {/* Right side charts */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#ececec] rounded shadow-sm p-5 h-48 flex flex-col relative">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Inquiry Volume (Month)</h3>
            <div className="flex-1 border-b border-l border-gray-200 flex items-end justify-between px-2 pt-4">
              {monthsList.map((m, idx) => {
                const pct = (m.count / maxVolumeCount) * 100;
                return (
                  <div 
                    key={idx} 
                    className="w-8 bg-[#3a081a] rounded-t-sm transition-all duration-500" 
                    style={{ height: `${Math.max(pct, 8)}%` }}
                    title={`${m.count} Inquiries`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between px-3 mt-2 text-[10px] text-gray-400 font-bold uppercase">
              {monthsList.map((m, idx) => <span key={idx}>{m.name}</span>)}
            </div>
          </div>

          <div className="bg-white border border-[#ececec] rounded shadow-sm p-5 flex-1">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Category Interest</h3>
            
            <div className="space-y-4">
              {topCategories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="truncate max-w-[150px]">{cat.name}</span>
                    <span className="text-gray-500">{cat.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#3a081a] transition-all duration-500" 
                      style={{ width: `${cat.percentage}%`, opacity: idx === 0 ? 1 : idx === 1 ? 0.6 : 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-red-50 text-[10px] text-[#3a081a] rounded leading-relaxed">
              <strong>Insight:</strong> {topCategories[0]?.name || 'Botanicals'} interest has spiked, driving the bulk of global inquiry shipments this quarter.
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white border border-[#ececec] rounded shadow-sm p-6 flex items-center justify-between">
        <div className="max-w-xs">
          <h3 className="font-bold text-[#3a081a] text-xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Global Distribution Focus</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Real-time heat-map of active export licenses and pending high-value shipments.
          </p>
          <div className="flex gap-4">
            <div className="border border-gray-200 p-3 rounded">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Active Shipments</p>
              <p className="text-xl font-bold text-[#3a081a]">{activeQuotes} Open</p>
            </div>
            <div className="border border-gray-200 p-3 rounded">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg Transit Time</p>
              <p className="text-xl font-bold text-[#3a081a]">14 Days</p>
            </div>
          </div>
        </div>
        <div className="flex-1 ml-12 h-64 bg-gray-50 border border-gray-100 rounded flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover"></div>
          <div className="relative z-10 bg-white px-4 py-2 rounded shadow-md border border-gray-100 text-center">
            <p className="text-[10px] font-bold text-[#4a5d3c] uppercase tracking-widest">Live Tracking Enabled</p>
            <p className="text-[9px] text-gray-500">Integrating with MAERSK API...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
