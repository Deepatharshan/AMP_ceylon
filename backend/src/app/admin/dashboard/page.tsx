import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'

export default async function DashboardPage() {
  const supabase = await createClient()

  // We attempt to fetch inquiries, but if the table doesn't exist yet, we fallback to mock data
  const { data: dbInquiries, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
  
  const inquiries = dbInquiries && dbInquiries.length > 0 ? dbInquiries : [
    { id: 1, buyer_name: "L'Art de Vivre", country: "France", created_at: "2024-10-24T10:00:00Z", status: "QUOTED" },
    { id: 2, buyer_name: "Dubai Luxe Hotels", country: "UAE", created_at: "2024-10-23T14:30:00Z", status: "PENDING" },
    { id: 3, buyer_name: "Nordic Floral Design", country: "Sweden", created_at: "2024-10-22T09:15:00Z", status: "FOLLOW UP" },
    { id: 4, buyer_name: "Bloom & Willow", country: "UK", created_at: "2024-10-21T16:45:00Z", status: "QUOTED" },
    { id: 5, buyer_name: "Garden State Co.", country: "USA", created_at: "2024-10-20T11:20:00Z", status: "PENDING" },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'QUOTED': return 'bg-[#e8ece3] text-[#4a5d3c]'
      case 'PENDING': return 'bg-[#fceeed] text-[#e05d52]'
      case 'FOLLOW UP': return 'bg-[#ecd8dd] text-[#8e4554]'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Welcome back to the Botanical Heritage export gateway. Monitor your global inquiry volume and inventory health in real-time.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors">
            Date Range
          </button>
          <button className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#3a081a] text-white rounded hover:bg-[#4a0b22] transition-colors flex items-center gap-2">
            Export Report
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#f9f5f6] rounded text-[#3a081a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            </div>
            <span className="text-xs font-bold text-[#4a5d3c] flex items-center gap-1">+12% <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Inquiries</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>324</h3>
          <p className="text-[10px] text-gray-400 mt-2">vs 289 last month</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#e8ece3] rounded text-[#4a5d3c] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Active Quotes</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>48</h3>
          <p className="text-[10px] text-gray-400 mt-2">Awaiting buyer response</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#f9f5f6] rounded text-[#3a081a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Catalog Items</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>1,240</h3>
          <p className="text-[10px] text-gray-400 mt-2">Active SKUs across 8 categories</p>
        </div>

        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-8 h-8 bg-[#f9f5f6] rounded text-[#3a081a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <span className="text-[10px] font-bold bg-[#fceeed] text-[#e05d52] px-2 py-0.5 rounded">NEW</span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Regional Reach</p>
          <h3 className="text-3xl text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>42</h3>
          <p className="text-[10px] text-gray-400 mt-2">Active countries served</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Recent Inquiries Table */}
        <div className="col-span-2 bg-white border border-[#ececec] rounded shadow-sm flex flex-col">
          <div className="p-5 flex justify-between items-center border-b border-[#ececec]">
            <h3 className="font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>Recent Inquiries</h3>
            <button className="text-xs font-bold text-[#3a081a] hover:underline">View All</button>
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
                {inquiries.map((inq, idx) => (
                  <tr key={inq.id} className={idx !== inquiries.length - 1 ? 'border-b border-[#ececec]' : ''}>
                    <td className="px-6 py-4 font-medium text-gray-900">{inq.buyer_name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span className="text-lg">
                        {inq.country === 'France' ? '🇫🇷' : inq.country === 'UAE' ? '🇦🇪' : inq.country === 'Sweden' ? '🇸🇪' : inq.country === 'UK' ? '🇬🇧' : '🇺🇸'}
                      </span>
                      {inq.country}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(inq.status)}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-xs font-bold text-[#3a081a] hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-[#ececec] text-center bg-gray-50 rounded-b">
            <button className="text-xs text-gray-500 font-medium hover:text-[#3a081a]">Show More Inquiries ▾</button>
          </div>
        </div>

        {/* Right side charts */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#ececec] rounded shadow-sm p-5 h-48 flex flex-col relative">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Inquiry Volume (Month)</h3>
            <div className="flex-1 border-b border-l border-gray-200 flex items-end justify-between px-2 pt-4">
              {/* Fake chart bars */}
              <div className="w-8 bg-[#3a081a] opacity-30 h-12 rounded-t-sm"></div>
              <div className="w-8 bg-[#3a081a] opacity-50 h-24 rounded-t-sm"></div>
              <div className="w-8 bg-[#3a081a] opacity-80 h-20 rounded-t-sm"></div>
              <div className="w-8 bg-[#3a081a] h-32 rounded-t-sm"></div>
            </div>
            <div className="flex justify-between px-3 mt-2 text-[10px] text-gray-400 font-bold uppercase">
              <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
            </div>
          </div>

          <div className="bg-white border border-[#ececec] rounded shadow-sm p-5 flex-1">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Category Interest</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Polysilk Flora</span><span className="text-gray-500">52%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3a081a] w-[52%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Luxury Candles</span><span className="text-gray-500">28%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3a081a] opacity-60 w-[28%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Hand-woven Rattan</span><span className="text-gray-500">20%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3a081a] opacity-30 w-[20%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-red-50 text-[10px] text-[#3a081a] rounded leading-relaxed">
              <strong>Insight:</strong> Polysilk inquiry volume is up by 15% in the European market this quarter, specifically in high-UV resistance lines.
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
              <p className="text-xl font-bold text-[#3a081a]">12 Units</p>
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
