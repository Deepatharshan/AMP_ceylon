'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tag } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  image_url?: string;
  category: string;
  description?: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadCart = async () => {
        const items = JSON.parse(localStorage.getItem('inquiry_cart') || '[]');
        setCartItems(items);
        
        const offerStr = localStorage.getItem('active_offer');
        if (offerStr) {
          try {
            const parsedOffer = JSON.parse(offerStr);
            const supabase = createClient();
            
            // Validate offer against database
            const { data, error } = await supabase
              .from('offers')
              .select('id, is_active, status')
              .eq('id', parsedOffer.id)
              .single();
              
            if (error || !data || !data.is_active || data.status !== 'Active') {
              // Offer is deleted, expired, or inactive
              localStorage.removeItem('active_offer');
              setActiveOffer(null);
            } else {
              setActiveOffer(parsedOffer);
            }
          } catch (err) {
            localStorage.removeItem('active_offer');
            setActiveOffer(null);
          }
        }
        setLoading(false);
      };
      
      loadCart();
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('inquiry_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleQuantityInput = (id: string, value: string) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 1) return;
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
    showToast('Item removed from your Inquiry Cart.');
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const supabase = createClient();
      
      // Build the items payload for the submit_inquiry RPC
      const itemsPayload = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        notes: `Requested SKU: ${item.sku}`
      }));

      const finalMessage = activeOffer 
        ? `[DISCOUNT CLAIMED: ${activeOffer.code} - ${activeOffer.discount_type?.toLowerCase() === 'percentage' ? activeOffer.discount_value + '%' : '$' + activeOffer.discount_value} OFF]\n\n${message || `Inquiry for ${cartItems.length} items.`}`
        : message || `Inquiry for ${cartItems.length} items.`;

      const { data, error: submitError } = await supabase.rpc('submit_inquiry', {
        p_customer_name: fullName,
        p_company_name: companyName || null,
        p_email: email,
        p_phone: null,
        p_country: country,
        p_message: finalMessage,
        p_items: itemsPayload
      });

      if (submitError) throw submitError;

      // Reset cart and offer
      saveCart([]);
      localStorage.removeItem('active_offer');
      setActiveOffer(null);

      setSuccess(true);
      setFullName('');
      setCompanyName('');
      setCountry('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Error submitting cart inquiry:', err);
      setError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalVarieties = cartItems.length;
  const totalVolume = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Add watermark
    try {
      const img = new window.Image();
      img.src = '/amplogo.png';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      if (img.width > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalAlpha = 0.08; // 8% opacity for watermark
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          
          // Center the watermark
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();
          const logoSize = 140; // Size of the logo in mm
          const x = (pdfWidth - logoSize) / 2;
          const y = (pdfHeight - logoSize) / 2;
          
          doc.addImage(dataUrl, 'PNG', x, y, logoSize, logoSize);
        }
      }
    } catch (e) {
      console.error('Could not load watermark', e);
    }
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(58, 8, 26); // #3a081a
    doc.text('AMP Ceylon', 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Export Manifest & Quote Request', 14, 32);
    
    doc.setFontSize(10);
    doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 40);
    
    // Total summary
    doc.text(`Total Varieties: ${totalVarieties}   |   Total Volume: ${totalVolume} Units`, 14, 48);

    // Table
    const tableColumn = ["Product Name", "SKU", "Category", "Quantity"];
    const tableRows = cartItems.map(item => [
      item.name,
      item.sku,
      item.category.toUpperCase(),
      item.quantity.toString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [58, 8, 26], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
    });

    doc.save('AMP_Ceylon_Export_Manifest.pdf');
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#333]">
      <div className="bg-transparent w-full relative" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl flex-1">
        <h1 className="text-4xl text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Inquiry Cart
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed mb-12">
          Review your selected items for the upcoming export season. Adjust quantities to match your container specifications before submitting for a professional trade quote.
        </p>

        {loading ? (
          <div className="py-20 text-center text-gray-500 animate-pulse">Loading inquiry items...</div>
        ) : success ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white border border-[#ececec] p-8 rounded shadow-sm">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-[#3a081a] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Quote Request Submitted!
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Thank you for requesting an export quote. Our logistics and pricing desk is already reviewing your details. A customized export manifest quote will be sent to your email address within 48 business hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/collections"
                className="inline-block w-full sm:w-auto text-center bg-white border border-[#3a081a] px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider text-[#3a081a] hover:bg-gray-50 transition-colors"
              >
                Floral & Decor
              </Link>
              <Link
                href="/carton-boxes"
                className="inline-block w-full sm:w-auto text-center bg-[#3a081a] px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#4a0b22] transition-colors"
                style={{ color: '#ffffff' }}
              >
                Carton Boxes
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#ececec] rounded shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-800 mb-4">Your Inquiry Cart is Empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Browse our catalog of premium hand-crafted botanicals and add items to request a custom bulk shipping estimate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <Link
                href="/collections"
                className="inline-block w-full sm:w-auto text-center bg-white border border-[#3a081a] px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider text-[#3a081a] hover:bg-gray-50 transition-colors"
              >
                Browse Floral & Decor
              </Link>
              <Link
                href="/carton-boxes"
                className="inline-block w-full sm:w-auto text-center bg-[#3a081a] px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#4a0b22] transition-colors"
                style={{ color: '#ffffff' }}
              >
                Browse Carton Boxes
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Columns - Cart List */}
            <div className="flex-1 w-full space-y-6">
              
              {activeOffer && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3 mb-8">
                  <Tag className="mt-0.5 text-green-600 shrink-0" size={18} />
                  <div>
                    <p className="font-bold text-sm">Discount Applied: {activeOffer.code}</p>
                    <p className="text-xs text-green-700 mt-1">
                      Your {activeOffer.discount_type?.toLowerCase() === 'percentage' ? `${activeOffer.discount_value}%` : `$${activeOffer.discount_value}`} discount will be applied to this inquiry order.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#ececec] rounded shadow-sm overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm text-gray-600 border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#ececec] text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                      <th className="px-6 py-4">Product Details</th>
                      <th className="px-6 py-4">Item Code</th>
                      <th className="px-6 py-4">Export Grade</th>
                      <th className="px-6 py-4 w-40">Quantity (Units)</th>
                      <th className="px-6 py-4 w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-b border-[#ececec] hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-6 flex gap-4 items-center">
                          <div className="relative w-16 h-16 bg-gray-50 border border-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.image_url || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{item.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-mono text-xs text-gray-500">
                          {item.sku}
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-2 py-0.5 border border-gray-300 text-[10px] font-bold rounded text-gray-500 bg-gray-50 uppercase tracking-wider">
                            CHOICE
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center border border-gray-300 rounded max-w-[120px] bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold transition-colors cursor-pointer text-gray-500"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={e => handleQuantityInput(item.id, e.target.value)}
                              className="w-12 h-8 text-center text-xs outline-none font-bold text-gray-800"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold transition-colors cursor-pointer text-gray-500"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Bar */}
              <div className="bg-white border border-[#ececec] rounded shadow-sm p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Total Selected Items: <span className="font-bold text-[#3a081a]">{totalVarieties} Varieties</span>
                  <span className="mx-3 text-gray-300">|</span>
                  Estimated Bulk Volume: <span className="font-bold text-[#3a081a]">{totalVolume} Units</span>
                </div>
                <button
                  type="button"
                  onClick={generatePDF}
                  className="border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  Export Manifest PDF
                </button>
              </div>
            </div>

            {/* Right Column - Request Form */}
            <div className="w-full lg:w-[400px] bg-white border border-[#ececec] rounded shadow-sm p-6 shrink-0">
              <h3 className="text-lg font-bold text-[#3a081a] uppercase tracking-wider border-b border-gray-100 pb-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                Request Export Quote
              </h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Please provide your trade details for a personalized bulk logistics and pricing proposal.
              </p>

              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Global Imports LLC"
                    className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Country *</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="United States"
                      className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="j.doe@company.com"
                      className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Message / Special Requirements</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Include any specific packaging or shipping port requests here..."
                    className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#3a081a] hover:bg-[#4a0b22] py-3 rounded text-xs font-semibold uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  style={{ color: '#ffffff' }}
                >
                  {submitting ? 'Submitting Request...' : 'SUBMIT QUOTE REQUEST ▻'}
                </button>
              </form>

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-4 flex gap-3 text-gray-500 text-[10px] leading-relaxed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <p>
                  No payment required. Our team will contact you with a customized export quote within 48 business hours.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 max-w-sm w-full bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-sm shrink-0">
            ✓
          </div>
          <div className="flex-1 text-sm text-gray-700 font-medium">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
