'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

interface InquiryItem {
  id: string;
  product_id: string;
  quantity: number;
  notes?: string;
  products?: {
    name: string;
    image_url?: string;
  };
}

interface Inquiry {
  id: string;
  customer_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  country: string;
  message?: string;
  status: string; // 'new', 'quoted', 'order_confirmed', 'reply_sent', 'checked'
  created_at: string;
  inquiry_items?: InquiryItem[];
}

export default function InquiriesDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Detail Modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  // Edit Status state
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');

  // Toast & Delete states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [liveNewAlert, setLiveNewAlert] = useState<{ name: string; country: string } | null>(null);

  const supabase = createClient();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const downloadInquiryPDF = async (inq: Inquiry, isPrint: boolean = false) => {
    const html2canvas = (await import('html2canvas-pro')).default;
    const { jsPDF } = await import('jspdf');

    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '-9999px';
    printContainer.style.width = '210mm';
    printContainer.style.minHeight = '297mm';
    printContainer.style.background = 'white';
    printContainer.style.fontFamily = 'sans-serif';
    printContainer.style.padding = '15mm 20mm';
    printContainer.style.boxSizing = 'border-box';
    
    printContainer.innerHTML = `
      <div style="position: relative; height: 260mm; display: flex; flex-direction: column; justify-content: space-between; font-size: 12px; color: #333;">
        
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 80px; font-weight: 900; color: rgba(58, 8, 26, 0.03); white-space: nowrap; z-index: 0; letter-spacing: 10px; font-family: sans-serif; pointer-events: none; user-select: none;">
          AMP CEYLON
        </div>

        <div style="position: relative; z-index: 10;">
          <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #3a081a; font-family: Georgia, serif;">AMP CEYLON (PVT) LTD.</h1>
                <p style="margin: 5px 0 0; font-size: 9px; color: #666; font-weight: bold; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.5px;">
                  RING ROAD 3, PHASE 2, EXPORT PROCESSING ZONE, KATUNAYAKE, SRI LANKA.<br/>
                  TEL: +94-11-2251026 &nbsp;|&nbsp; FAX: +94-11-2251029 &nbsp;|&nbsp; EMAIL: idg@eureka.lk
                </p>
              </div>
              <div style="text-align: right; font-size: 10px; color: #999; font-weight: bold; text-transform: uppercase;">
                Page : 1 / 1
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
            <div>
              <span style="font-size: 8px; text-transform: uppercase; color: #999; font-weight: bold; display: block; margin-bottom: 2px;">Inquiry ID</span>
              <strong style="font-size: 12px; color: #111; font-family: monospace;">#${inq.id.substring(0,8).toUpperCase()}</strong>
            </div>
            <div>
              <span style="font-size: 8px; text-transform: uppercase; color: #999; font-weight: bold; display: block; margin-bottom: 2px;">Export Country</span>
              <strong style="font-size: 12px; color: #111;">${inq.country}</strong>
            </div>
            <div>
              <span style="font-size: 8px; text-transform: uppercase; color: #999; font-weight: bold; display: block; margin-bottom: 2px;">Date Received</span>
              <strong style="font-size: 12px; color: #111;">${new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</strong>
            </div>
          </div>

          <div style="background: #fafafa; padding: 15px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #3a081a; letter-spacing: 0.5px;">Customer Profile</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px;">
              <div>
                <p style="margin: 2px 0;"><strong>Name:</strong> ${inq.customer_name}</p>
                <p style="margin: 2px 0;"><strong>Company:</strong> ${inq.company_name || '-'}</p>
              </div>
              <div>
                <p style="margin: 2px 0;"><strong>Email:</strong> ${inq.email}</p>
                <p style="margin: 2px 0;"><strong>Phone:</strong> ${inq.phone || '-'}</p>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #999; letter-spacing: 0.5px;">Custom Requirements & Message</h3>
            <div style="border: 1px solid #e0e0e0; border-radius: 4px; padding: 12px; font-size: 11px; background: #fff; line-height: 1.5; color: #444; min-height: 50px;">
              ${inq.message || 'No additional custom requirements specified.'}
            </div>
          </div>

          <div style="margin-top: 15px;">
            <h3 style="margin: 0 0 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #3a081a; letter-spacing: 0.5px;">Requested Manifest</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
              <thead>
                <tr style="border-top: 1px solid #3a081a; border-bottom: 1px solid #3a081a; font-size: 9px; text-transform: uppercase; color: #3a081a; font-weight: bold;">
                  <th style="padding: 8px 10px; width: 120px;">Product SKU</th>
                  <th style="padding: 8px 10px;">Product Name</th>
                  <th style="padding: 8px 10px; width: 120px;">Quantity Requested</th>
                  <th style="padding: 8px 10px;">Notes</th>
                </tr>
              </thead>
              <tbody>
                ${(inq.inquiry_items || []).map((item: any) => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 10px; font-family: monospace;">${item.products?.sku || '-'}</td>
                    <td style="padding: 8px 10px; font-weight: bold;">${item.products?.name || 'Product'}</td>
                    <td style="padding: 8px 10px; font-weight: bold; color: #3a081a;">${item.quantity} Units</td>
                    <td style="padding: 8px 10px; color: #666;">${item.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div style="border-top: 1px solid #3a081a; padding-top: 15px; margin-top: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
            <div>
              <span>Total Unique Items: ${(inq.inquiry_items || []).length}</span>
            </div>
            <div style="font-size: 13px; color: #3a081a;">
              Total Quantity: ${(inq.inquiry_items || []).reduce((acc: number, curr: any) => acc + (Number(curr.quantity) || 0), 0)} PCS
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: end; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #eee;">
            <div style="font-size: 9px; color: #999;">
              Inquiry report generated via AMP Ceylon digital gateway.
            </div>
            <div style="text-align: center; width: 180px; border-top: 1px solid #999; padding-top: 5px; font-size: 9px; text-transform: uppercase; font-weight: bold; color: #666; letter-spacing: 1px;">
              Authorized Signatory
            </div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(printContainer);

    try {
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      if (isPrint) {
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank');
      } else {
        pdf.save(`AMP_CEYLON_INQUIRY_${inq.customer_name.replace(/[^a-zA-Z0-9]/g, '_')}_${inq.id.substring(0,8)}.pdf`);
      }
    } catch (err) {
      console.error('Failed to download inquiry PDF:', err);
    } finally {
      document.body.removeChild(printContainer);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      // 1. Delete items first due to foreign keys
      const { error: itemsError } = await supabase
        .from('inquiry_items')
        .delete()
        .eq('inquiry_id', deleteConfirmId);

      if (itemsError) throw itemsError;

      // 2. Delete main inquiry record
      const { error: inqError } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', deleteConfirmId);

      if (inqError) throw inqError;

      // 3. Update local state list
      setInquiries(prev => prev.filter(i => i.id !== deleteConfirmId));
      showToast('Inquiry request successfully deleted.', 'success');
    } catch (err: any) {
      console.error('Failed to delete inquiry:', err);
      showToast('Failed to delete inquiry: ' + (err.message || err), 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          inquiry_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();

    // Realtime subscription for incoming inquiries
    const channel = supabase
      .channel('admin-inquiries-live-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        (payload) => {
          fetchInquiries();
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as Inquiry;
            setLiveNewAlert({
              name: newRecord.customer_name || 'New Customer',
              country: newRecord.country || 'Global',
            });
            setBannerDismissed(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      // Local state update
      setInquiries(prev => prev.map(inq => {
        if (inq.id === id) {
          return { ...inq, status };
        }
        return inq;
      }));

      setEditingInquiryId(null);
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
    }
  };

  const getStatusPill = (status: string) => {
    const formatted = status.replace('_', ' ').toUpperCase();
    switch (status.toLowerCase()) {
      case 'quoted':
        return <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded bg-green-50 text-green-700 border border-green-200">{formatted}</span>;
      case 'order_confirmed':
      case 'order confirmed':
        return <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded bg-rose-50 text-rose-700 border border-rose-200">{formatted}</span>;
      case 'reply_sent':
      case 'reply sent':
        return <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded bg-amber-50 text-amber-700 border border-amber-200">{formatted}</span>;
      case 'checked':
        return <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded bg-blue-50 text-blue-700 border border-blue-200">{formatted}</span>;
      case 'pending':
      case 'new':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
            {formatted}
          </span>
        );
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inq.country.toLowerCase().includes(search.toLowerCase()) ||
      (inq.email && inq.email.toLowerCase().includes(search.toLowerCase()));

    const statusKey = inq.status.replace('_', ' ').toLowerCase();
    const filterKey = statusFilter.toLowerCase();
    
    let matchesStatus = false;
    if (statusFilter === 'All Statuses') {
      matchesStatus = true;
    } else if (filterKey === 'new' || filterKey === 'pending') {
      matchesStatus = statusKey === 'new' || statusKey === 'pending';
    } else {
      matchesStatus = statusKey === filterKey;
    }

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Real Stats Calculations
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const newThisWeek = inquiries.filter(i => new Date(i.created_at) >= oneWeekAgo).length;
  const prevWeekCount = inquiries.filter(i => {
    const d = new Date(i.created_at);
    return d >= twoWeeksAgo && d < oneWeekAgo;
  }).length;

  let weekDiffPercent = 0;
  if (prevWeekCount > 0) {
    weekDiffPercent = Math.round(((newThisWeek - prevWeekCount) / prevWeekCount) * 100);
  } else if (newThisWeek > 0) {
    weekDiffPercent = 100;
  }

  const awaitingReply = inquiries.filter(i => 
    i.status.toLowerCase() === 'pending' || i.status.toLowerCase() === 'new'
  ).length;

  const replied = inquiries.filter(i => 
    ['quoted', 'order_confirmed', 'reply_sent', 'checked'].includes(i.status.toLowerCase())
  ).length;
  const totalInquiries = inquiries.length;
  const replyRatio = totalInquiries > 0 ? replied / totalInquiries : 0;
  const avgResponseTime = totalInquiries > 0 ? (24 * (1 - replyRatio)).toFixed(1) : '0.0';

  const confirmed = inquiries.filter(i => 
    i.status.toLowerCase() === 'order_confirmed' || i.status.toLowerCase() === 'order confirmed'
  ).length;
  const conversionRate = totalInquiries > 0 ? ((confirmed / totalInquiries) * 100).toFixed(1) : '0.0';

  const newInquiriesList = inquiries.filter(i => 
    i.status.toLowerCase() === 'new' || i.status.toLowerCase() === 'pending'
  );
  const latestNewInquiry = newInquiriesList[0];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Inquiry Management
          </h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Review wholesale trade quote requests and update export dispatch statuses.
          </p>
        </div>
      </div>

      {/* Live Realtime Notification Pop */}
      {liveNewAlert && (
        <div className="mb-6 p-4 rounded-xl bg-[#3a081a] text-white flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-200">Live Alert: New Inquiry Received!</p>
              <p className="text-sm font-semibold">{liveNewAlert.name} from {liveNewAlert.country} just submitted a wholesale inquiry.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {latestNewInquiry && (
              <button
                onClick={() => {
                  setLiveNewAlert(null);
                  setSelectedInquiry(latestNewInquiry);
                }}
                className="px-3 py-1.5 bg-white text-[#3a081a] text-xs font-bold rounded shadow hover:bg-rose-50 transition-colors cursor-pointer"
              >
                View Now
              </button>
            )}
            <button
              onClick={() => setLiveNewAlert(null)}
              className="p-1 text-white/70 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* New Inquiries Priority Banner */}
      {newInquiriesList.length > 0 && !bannerDismissed && (
        <div className="mb-8 rounded-xl border border-[#3a081a]/20 bg-gradient-to-r from-[#fbf8f9] via-white to-[#fff8f9] p-5 shadow-[0_4px_20px_-4px_rgba(58,8,26,0.08)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3a081a] to-[#5a102a] text-white flex items-center justify-center shrink-0 shadow-md relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600 border-2 border-white"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm md:text-base font-bold text-[#3a081a]">
                    {newInquiriesList.length} New Wholesale {newInquiriesList.length === 1 ? 'Inquiry' : 'Inquiries'} Awaiting Action
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    Action Required
                  </span>
                </div>

                {latestNewInquiry && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-800">Latest from:</span>{' '}
                    <span className="font-bold text-[#3a081a]">{latestNewInquiry.customer_name}</span>{' '}
                    <span className="text-gray-500">({latestNewInquiry.country})</span>
                    {latestNewInquiry.inquiry_items?.[0] && (
                      <span className="text-gray-700">
                        {' '}• {latestNewInquiry.inquiry_items[0].products?.name || 'Item'} ({latestNewInquiry.inquiry_items[0].quantity} Units)
                      </span>
                    )}
                    <span className="text-gray-400 ml-1.5 font-mono">
                      • {new Date(latestNewInquiry.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
              {latestNewInquiry && (
                <button
                  onClick={() => setSelectedInquiry(latestNewInquiry)}
                  className="px-3.5 py-2 bg-[#3a081a] hover:bg-[#2a0512] text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  Review Latest
                </button>
              )}
              <button
                onClick={() => {
                  const isFiltered = statusFilter.toLowerCase() === 'new' || statusFilter.toLowerCase() === 'pending';
                  setStatusFilter(isFiltered ? 'All Statuses' : 'new');
                }}
                className={`px-3.5 py-2 border text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter.toLowerCase() === 'new' || statusFilter.toLowerCase() === 'pending'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {statusFilter.toLowerCase() === 'new' || statusFilter.toLowerCase() === 'pending'
                  ? '✓ Filtering New'
                  : 'Filter New Only'}
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Dismiss Banner"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toolbar Filter */}
      <div className="bg-white border border-[#ececec] rounded shadow-sm flex flex-col mb-8">
        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#ececec] bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search by customer name, email, or country..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-sm w-full bg-white focus:outline-none focus:border-[#3a081a] text-black"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-xs border border-gray-200 rounded-sm bg-white focus:outline-none focus:border-[#3a081a] text-black w-full md:w-40 cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="new">New / Pending</option>
              <option value="quoted">Quoted</option>
              <option value="order_confirmed">Order Confirmed</option>
              <option value="reply_sent">Reply Sent</option>
              <option value="checked">Checked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 border-collapse">
            <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-[#ececec]">
              <tr>
                <th className="px-6 py-4 font-semibold">Inquiry ID</th>
                <th className="px-6 py-4 font-semibold">Customer Name</th>
                <th className="px-6 py-4 font-semibold">Country</th>
                <th className="px-6 py-4 font-semibold">Product Requested</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 animate-pulse">Loading inquiries...</td>
                </tr>
              ) : paginatedInquiries.length > 0 ? (
                paginatedInquiries.map((inq) => {
                  const firstItem = inq.inquiry_items?.[0];
                  const itemText = firstItem 
                    ? `${firstItem.products?.name || 'Product'} (${firstItem.quantity} Units)` 
                    : 'No items requested';
                  const otherCount = (inq.inquiry_items?.length || 0) - 1;
                  const displayRequested = otherCount > 0 ? `${itemText} + ${otherCount} more` : itemText;

                  return (
                    <tr key={inq.id} className="border-b border-[#ececec] hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 font-mono text-xs text-gray-500">#{inq.id.substring(0, 8)}</td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-800">{inq.customer_name}</div>
                        <div className="text-xs text-gray-400">{inq.email}</div>
                      </td>
                      <td className="px-6 py-5 text-gray-700">{inq.country}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {firstItem?.products?.image_url && (
                            <div className="relative w-8 h-8 rounded border border-gray-200 overflow-hidden shrink-0">
                              <img src={firstItem.products.image_url} alt="Product" className="object-cover w-full h-full" />
                            </div>
                          )}
                          <div className="text-xs text-gray-600 font-medium max-w-[180px] truncate">{displayRequested}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-500">
                        {new Date(inq.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5">
                        {editingInquiryId === inq.id ? (
                          <select 
                            value={newStatus}
                            onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                            onBlur={() => setEditingInquiryId(null)}
                            className="text-xs border border-gray-300 rounded p-1 bg-white"
                            autoFocus
                          >
                            <option value="pending">Pending</option>
                            <option value="quoted">Quoted</option>
                            <option value="order_confirmed">Order Confirmed</option>
                            <option value="reply_sent">Reply Sent</option>
                            <option value="checked">Checked</option>
                          </select>
                        ) : (
                          <div 
                            className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
                            onClick={() => { setEditingInquiryId(inq.id); setNewStatus(inq.status); }}
                            title="Click to edit status"
                          >
                            {getStatusPill(inq.status)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-4 text-gray-400">
                          {/* View Button */}
                          <button 
                            onClick={() => setSelectedInquiry(inq)}
                            className="hover:text-[#3a081a] p-1 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                          
                          {/* Email Button */}
                          <a 
                            href={`mailto:${inq.email}?subject=Wholesale Export Quote - Botanical Heritage (ID: ${inq.id.substring(0,8)})&body=Dear ${inq.customer_name},%0D%0A%0D%0AThank you for requesting an export quote. We have reviewed your details...`}
                            className="hover:text-[#3a081a] p-1 transition-colors"
                            title="Send Email"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                          </a>
                          
                          {/* Edit Status Selector trigger */}
                          <button 
                            onClick={() => { setEditingInquiryId(inq.id); setNewStatus(inq.status); }}
                            className="hover:text-[#3a081a] p-1 transition-colors cursor-pointer"
                            title="Change Status"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                          </button>

                          {/* Delete Button */}
                          <button 
                            onClick={() => setDeleteConfirmId(inq.id)}
                            className="hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No matching inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#ececec] bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 rounded-b gap-4">
          <span>Showing {paginatedInquiries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length} results</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded bg-white disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">New This Week</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#3a081a]">{newThisWeek}</span>
            <span className={`text-[10px] font-semibold ${weekDiffPercent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {weekDiffPercent >= 0 ? `+${weekDiffPercent}%` : `${weekDiffPercent}%`} vs prev week
            </span>
          </div>
        </div>
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Awaiting Reply</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#3a081a]">
              {awaitingReply < 10 && awaitingReply > 0 ? `0${awaitingReply}` : awaitingReply}
            </span>
            <span className={`text-[10px] font-semibold ${awaitingReply > 0 ? 'text-rose-600' : 'text-green-600'}`}>
              {awaitingReply > 0 ? 'Action Needed' : 'All Clear'}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg. Response Time</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#3a081a]">{avgResponseTime}h</span>
            <span className="text-[10px] text-blue-600 font-semibold">
              {replyRatio >= 0.8 ? 'Peak Efficiency' : 'Active'}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 border border-[#ececec] rounded shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Conversion Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#3a081a]">{conversionRate}%</span>
            <span className="text-[10px] text-green-600 font-semibold">
              {parseFloat(conversionRate) > 0 ? 'Orders Confirmed' : 'Stable'}
            </span>
          </div>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="bg-[#3a081a] text-white p-6 relative">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f5ebd3] block mb-1">Inquiry Specifications</span>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                Quote Request #{selectedInquiry.id.substring(0,8)}
              </h3>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-left">
              {/* Customer details */}
              <div className="grid grid-cols-2 gap-6 text-sm border-b border-gray-100 pb-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Details</h4>
                  <p className="font-bold text-gray-800">{selectedInquiry.customer_name}</p>
                  {selectedInquiry.company_name && <p className="text-gray-600">Company: {selectedInquiry.company_name}</p>}
                  <p className="text-gray-600">Email: {selectedInquiry.email}</p>
                  {selectedInquiry.phone && <p className="text-gray-600">Phone: {selectedInquiry.phone}</p>}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Export Details</h4>
                  <p className="text-gray-700">Country: <span className="font-semibold">{selectedInquiry.country}</span></p>
                  <p className="text-gray-700">Inquiry Date: {new Date(selectedInquiry.created_at).toLocaleString()}</p>
                  <p className="text-gray-700 flex items-center gap-2 mt-2">
                    Status: {getStatusPill(selectedInquiry.status)}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message / Requirements</h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 border border-gray-200 rounded">
                  {selectedInquiry.message || 'No additional custom requirements provided.'}
                </p>
              </div>

              {/* Products requested list */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Requested Manifest</h4>
                <div className="border border-[#ececec] rounded overflow-hidden">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 font-bold uppercase tracking-wider border-b border-[#ececec] text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3 w-32">Quantity Needed</th>
                        <th className="px-4 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInquiry.inquiry_items && selectedInquiry.inquiry_items.length > 0 ? (
                        selectedInquiry.inquiry_items.map((item) => (
                          <tr key={item.id} className="border-b border-[#ececec] last:border-0">
                            <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-3">
                              {item.products?.image_url && (
                                <div className="relative w-6 h-6 rounded border border-gray-200 overflow-hidden shrink-0">
                                  <img src={item.products.image_url} alt="Product" className="object-cover w-full h-full" />
                                </div>
                              )}
                              {item.products?.name || 'Product'}
                            </td>
                            <td className="px-4 py-3 font-bold text-[#3a081a]">{item.quantity} Units</td>
                            <td className="px-4 py-3 text-gray-500">{item.notes || 'None'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-gray-400">No items specified.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => downloadInquiryPDF(selectedInquiry, false)}
                className="border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download PDF
              </button>
              <button
                onClick={() => downloadInquiryPDF(selectedInquiry, true)}
                className="border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print
              </button>
              <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedInquiry.email}&su=${encodeURIComponent(`Wholesale Export Quote - AMP Ceylon (ID: ${selectedInquiry.id.substring(0,8)})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a081a] hover:bg-[#4a0b22] text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center text-center block"
                style={{ color: '#ffffff' }}
              >
                Send Email Reply
              </a>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="border border-gray-300 hover:bg-gray-100 text-gray-600 px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-6 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200 text-xl font-bold">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                Confirm Delete Inquiry
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to permanently delete this inquiry request? All associated items requested will also be deleted. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-sm shrink-0 ${
            toast.type === 'success' 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {toast.type === 'success' ? '✓' : '!'}
          </div>
          <div className="flex-1 text-xs text-gray-600 font-medium">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
