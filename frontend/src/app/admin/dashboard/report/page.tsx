'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  size?: string;
  materials?: string[];
  colors?: string[];
  image_url?: string;
  image_urls?: string[];
}

interface ReportItem {
  product: Product;
  selected: boolean;
  colorCode: string;
  ctns: number;
  qty: number;
  price: number;
}

export default function ReportGeneratorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Invoice Headers
  const [invoiceNo, setInvoiceNo] = useState('306801/AMP-CEYLON-REP');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
  const [etd, setEtd] = useState('15/09/2026');
  const [recipient, setRecipient] = useState('3F221LX23/AMP-FLOWER GLASS');
  
  // Selected Report items list
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        if (data) {
          setProducts(data);
          // Initialize report items list
          const items: ReportItem[] = data.map(prod => {
            const firstColor = Array.isArray(prod.colors) ? prod.colors[0] : (prod.colors || 'STANDARD');
            return {
              product: prod,
              selected: true, // Default to select all
              colorCode: String(firstColor).substring(0, 10).toUpperCase(),
              ctns: 10, // Default mock carton count
              qty: 120, // Default mock qty
              price: prod.price || 4.50
            };
          });
          setReportItems(items);
        }
      } catch (err) {
        console.error('Failed to load products for report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleSelect = (idx: number) => {
    setReportItems(prev => prev.map((item, i) => i === idx ? { ...item, selected: !item.selected } : item));
  };

  const handleUpdateItem = (idx: number, key: keyof ReportItem, value: any) => {
    setReportItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));
  };

  const activeItems = reportItems.filter(item => item.selected);
  const totalCtns = activeItems.reduce((acc, curr) => acc + Number(curr.ctns || 0), 0);
  const totalQty = activeItems.reduce((acc, curr) => acc + Number(curr.qty || 0), 0);
  const totalAmount = activeItems.reduce((acc, curr) => acc + (Number(curr.qty || 0) * Number(curr.price || 0)), 0);

  // Approximate CFT calculation (volume metric: e.g. 2 CFT per carton)
  const totalCFT = Math.round(totalCtns * 2.0);

  const handleDownloadPDF = async () => {
    // Dynamic import to prevent next SSR window-undefined issues
    const html2canvas = (await import('html2canvas-pro')).default;
    const { jsPDF } = await import('jspdf');

    const element = document.getElementById('print-area');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
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
      pdf.save(`AMP_CEYLON_PROFORMA_${invoiceNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Configuration Header Panel (Hidden during Print) */}
      <div className="print:hidden bg-white border border-[#ececec] rounded shadow-sm p-6 mb-8 text-left space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Export Catalog Report Builder
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Configure parameters, select catalog items, and print or download a professional manifest.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download as PDF
            </button>
            <button
              onClick={() => window.print()}
              className="bg-[#3a081a] hover:bg-[#4a0b22] text-white px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              style={{ color: '#ffffff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Report
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-500 uppercase tracking-wider">Invoice No</label>
            <input 
              type="text" 
              value={invoiceNo} 
              onChange={e => setInvoiceNo(e.target.value)} 
              className="border border-gray-200 rounded p-2 text-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-500 uppercase tracking-wider">Invoice Date</label>
            <input 
              type="text" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="border border-gray-200 rounded p-2 text-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-500 uppercase tracking-wider">ETD Date</label>
            <input 
              type="text" 
              value={etd} 
              onChange={e => setEtd(e.target.value)} 
              className="border border-gray-200 rounded p-2 text-black"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-500 uppercase tracking-wider">TO (Recipient)</label>
            <input 
              type="text" 
              value={recipient} 
              onChange={e => setRecipient(e.target.value)} 
              className="border border-gray-200 rounded p-2 text-black"
            />
          </div>
        </div>

        {/* Catalog items selector table */}
        <div>
          <h4 className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Select Catalog Items to Include</h4>
          <div className="border border-[#ececec] rounded overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead className="bg-gray-50 font-bold uppercase tracking-wider text-gray-400 border-b border-[#ececec]">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">Include</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 w-24">Color Code</th>
                  <th className="px-4 py-3 w-20">Cartons</th>
                  <th className="px-4 py-3 w-24">Qty Ordered</th>
                  <th className="px-4 py-3 w-24">FOB Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 animate-pulse">Loading catalog options...</td>
                  </tr>
                ) : reportItems.length > 0 ? (
                  reportItems.map((item, idx) => (
                    <tr key={item.product.id} className="border-b border-[#ececec] last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={item.selected} 
                          onChange={() => handleToggleSelect(idx)} 
                          className="accent-[#3a081a] w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">{item.product.sku}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{item.product.name}</td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" 
                          value={item.colorCode} 
                          disabled={!item.selected}
                          onChange={e => handleUpdateItem(idx, 'colorCode', e.target.value)}
                          className="border border-gray-200 rounded p-1 w-full text-center text-[10px] text-black disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          value={item.ctns} 
                          disabled={!item.selected}
                          onChange={e => handleUpdateItem(idx, 'ctns', parseInt(e.target.value, 10) || 0)}
                          className="border border-gray-200 rounded p-1 w-full text-center text-black disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          value={item.qty} 
                          disabled={!item.selected}
                          onChange={e => handleUpdateItem(idx, 'qty', parseInt(e.target.value, 10) || 0)}
                          className="border border-gray-200 rounded p-1 w-full text-center text-black disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          step="0.01" 
                          value={item.price} 
                          disabled={!item.selected}
                          onChange={e => handleUpdateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                          className="border border-gray-200 rounded p-1 w-full text-center text-black disabled:opacity-50"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No products found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modern, Professional Report sheet viewport */}
      <div 
        id="print-area"
        className="report-sheet bg-white border border-[#d2d2d2] rounded p-8 sm:p-12 shadow-md relative overflow-hidden select-none text-left print:border-0 print:shadow-none print:p-0"
        style={{ minHeight: '297mm', width: '100%', position: 'relative' }}
      >
        
        {/* Background Watermark */}
        <div 
          className="watermark absolute select-none pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-35deg)',
            fontSize: '8vw',
            fontWeight: 900,
            color: 'rgba(58, 8, 26, 0.03)',
            whiteSpace: 'nowrap',
            zIndex: 0,
            letterSpacing: '0.75rem',
            fontFamily: 'sans-serif'
          }}
        >
          AMP CEYLON
        </div>

        {/* Sheet Content container */}
        <div className="relative z-10 space-y-4 flex flex-col justify-between" style={{ minHeight: '240mm' }}>
          
          {/* Header Block */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#3a081a] tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
                  AMP CEYLON (PVT) LTD.
                </h1>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mt-1.5 max-w-xl">
                  RING ROAD 3, PHASE 2, EXPORT PROCESSING ZONE, KATUNAYAKE, SRI LANKA.<br />
                  TEL: +94-11-2251026 &nbsp;|&nbsp; FAX: +94-11-2251029 &nbsp;|&nbsp; EMAIL: idg@eureka.lk
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Page : 1 / 1</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-100 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">Proforma Invoice No</span>
                <span className="font-mono font-bold text-gray-800">{invoiceNo}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">ETD</span>
                <span className="font-semibold text-gray-800">{etd}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">Date</span>
                <span className="font-semibold text-gray-800">{date}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">TO</span>
              <span className="font-bold text-gray-900">{recipient}</span>
            </div>
          </div>

          {/* Table manifest */}
          <div className="flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3a081a] border-t border-[#3a081a] text-[10px] uppercase text-[#3a081a] font-bold tracking-wider">
                  <th className="py-2.5 w-16 text-center">Your Item No</th>
                  <th className="py-2.5 w-24 text-center">Our Item No</th>
                  <th className="py-2.5 w-20 text-center">Color Code</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 w-16 text-center">No of Ctns</th>
                  <th className="py-2.5 w-20 text-center">Quantity Ordered</th>
                  <th className="py-2.5 w-36 text-right" colSpan={2}>
                    <div className="text-center font-bold border-b border-[#3a081a] pb-1 mb-1">FOB COLOMBO</div>
                    <div className="flex justify-between px-2">
                      <span>USD/Unit</span>
                      <span>Total USD</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeItems.map((item, idx) => {
                  const firstImg = item.product.image_urls?.[0] || item.product.image_url;
                  
                  return (
                    <tr key={idx} className="border-b border-gray-200 align-top">
                      <td className="py-3 font-mono text-[10px] text-gray-400 text-center">-</td>
                      <td className="py-3 font-mono text-[10px] font-bold text-gray-800 text-center">
                        {item.product.sku}
                      </td>
                      <td className="py-3 font-mono text-[10px] text-gray-500 text-center">
                        {item.colorCode}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-3">
                          {firstImg && (
                            <div className="relative w-8 h-8 rounded border border-gray-200 overflow-hidden shrink-0">
                              <img src={firstImg} alt="Preview" className="object-cover w-full h-full" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-800 leading-tight mb-1">{item.product.name}</div>
                            <div className="text-[9px] text-gray-400 font-medium tracking-wide leading-relaxed">
                              {item.product.size && <span>Size: {item.product.size}</span>}
                              {item.product.materials && item.product.materials.length > 0 && (
                                <span> &nbsp;|&nbsp; Materials: {
                                  Array.isArray(item.product.materials) ? item.product.materials.join(', ') : item.product.materials
                                }</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-700">{item.ctns} ctns</td>
                      <td className="py-3 text-center font-semibold text-gray-700">{item.qty} PCS</td>
                      <td className="py-3 text-right font-mono text-[10px] text-gray-600 pl-4">
                        ${item.price.toFixed(2)}/PC
                      </td>
                      <td className="py-3 text-right font-bold font-mono text-[10px] text-gray-800 pr-2">
                        ${(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Totals block */}
          <div className="border-t border-[#3a081a] pt-4 mt-8">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <div>
                <span>Total CFT is Approximately : {totalCFT}</span>
              </div>
              <div className="flex gap-16 items-center pr-2">
                <div className="text-center">
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400">Total Ctns</span>
                  <span className="text-sm font-bold text-gray-800">{totalCtns}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400">Total Qty</span>
                  <span className="text-sm font-bold text-gray-800">{totalQty} PCS</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400">Total FOB Value</span>
                  <span className="text-base font-bold text-[#3a081a] font-mono">
                    US$ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-6 pt-3 border-t border-dashed border-gray-200">
              <div className="text-[10px] text-gray-400 font-medium">
                Report generated via AMP Ceylon digital gateway.
              </div>
              <div className="text-center w-48 border-t border-gray-400 pt-1.5 text-[9px] uppercase tracking-widest font-bold text-gray-500">
                Authorized Signatory
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Global CSS for Printing layouts */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, control panel and anything print-hidden */
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
          /* Hide standard layout wrapper sidebars/headers */
          div.flex.h-screen > div:first-child {
            display: none !important;
          }
          div.flex.h-screen {
            display: block !important;
            height: auto !important;
            background: white !important;
          }
          div.flex-1.overflow-y-auto {
            padding: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          /* Target the report container card specifically */
          .report-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 10mm 15mm !important;
            margin: 0 !important;
            width: 100% !important;
            max-height: 297mm !important;
            height: 297mm !important;
            box-sizing: border-box !important;
            background: white !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 99999 !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          .watermark {
            color: rgba(58, 8, 26, 0.03) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

    </div>
  );
}
