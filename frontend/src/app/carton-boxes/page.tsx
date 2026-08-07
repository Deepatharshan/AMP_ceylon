'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShieldCheck, Settings, Leaf } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  image_url?: string;
  category: string;
  description?: string;
  is_top_seller?: boolean;
  is_new_collection?: boolean;
  is_limited_product?: boolean;
}

function CartonsMain() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*').eq('business_line', 'CARTON').order('created_at', { ascending: false });
        if (error) throw error;
        
        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigating to product page when clicking add to cart
    if (typeof window === 'undefined') return;
    const cart = JSON.parse(localStorage.getItem('inquiry_cart') || '[]');
    const exists = cart.find((item: any) => item.id === product.id);
    if (exists) {
      exists.quantity = (exists.quantity || 1) + 100;
    } else {
      cart.push({ ...product, quantity: 100 });
    }
    localStorage.setItem('inquiry_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    showToast(`Added ${product.name} to your Inquiry Cart!`);
  };

  return (
    <main className="min-h-screen bg-[#fcfbfa] text-[#333]">
      <div className="bg-transparent w-full relative z-20" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      {/* Hero / Business Showcase Section */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f2f1ef] rounded-bl-[100px] -z-10 opacity-50"></div>
        
        <div className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left Content */}
            <div className="flex-1">
              <p className="text-[#4a0b22] text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                We Manufacture Carton Boxes
              </p>
              <h1 className="text-5xl lg:text-7xl text-[#3a081a] font-extrabold mb-6 leading-tight uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
                Strong.<br/>Reliable.<br/>Made For You.
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                High quality carton boxes for all your packing and packaging needs.
              </p>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 max-w-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3a081a] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                    <Package size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Premium<br/>Quality</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3a081a] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Strong &<br/>Durable</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3a081a] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                    <Settings size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Custom Sizes<br/>Available</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                    <Leaf size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Eco Friendly<br/>Materials</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Badge / Graphic */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-xl overflow-hidden shadow-2xl group">
                <Image 
                  src="/cartonbox.jpg" 
                  alt="Tailored Carton Packaging" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Text Badge */}
                <div className="absolute bottom-8 left-0 bg-[#fcfbfa] py-4 px-6 shadow-xl">
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">
                    Tailored Packaging
                  </p>
                  <h3 className="text-[#3a081a] font-bold text-lg">
                    For Every Industry
                  </h3>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Business Details Copy Section */}
      <div className="bg-[#fcfbfa] border-b border-gray-100">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* Left: Copy */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a081a] mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                We are now pleased to offer our carton boxes to local businesses.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We manufacture durable, high-quality corrugated boxes suitable for a wide range of industries, 
                including manufacturing, retail, food, agriculture, pharmaceuticals, e-commerce, and logistics.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you require small or large quantities, we would be delighted to provide packaging solutions tailored to your exact requirements.
              </p>
              <p className="text-[#3a081a] font-semibold leading-relaxed border-l-4 border-[#3a081a] pl-4">
                We sincerely invite you to send us your enquiries and specifications. Our team will be happy to prepare a competitive quotation and provide the most suitable packaging solution for your business.
              </p>
            </div>
            
            {/* Right: Capabilities List */}
            <div className="flex-1 w-full bg-white p-8 rounded-lg shadow-sm border border-[#ececec]">
              <h3 className="font-bold text-[#3a081a] uppercase tracking-wider mb-6">Our Capabilities Include:</h3>
              <ul className="grid grid-cols-1 gap-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#3a081a]/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[#3a081a] font-bold text-xs">✓</span></div>
                  Custom-made carton boxes in any size and specification
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#3a081a]/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[#3a081a] font-bold text-xs">✓</span></div>
                  Single-wall and double-wall corrugated boxes
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#3a081a]/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[#3a081a] font-bold text-xs">✓</span></div>
                  Custom printing with your company logo, brand name, and product information
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#3a081a]/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[#3a081a] font-bold text-xs">✓</span></div>
                  Strong, reliable packaging designed to protect your products during storage and transportation
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#3a081a]/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[#3a081a] font-bold text-xs">✓</span></div>
                  Competitive prices with consistent quality
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-[#3a081a]/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[#3a081a] font-bold text-xs">✓</span></div>
                  Prompt production and delivery
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-12">
          <h2 className="text-2xl font-bold text-[#3a081a] uppercase tracking-wider">
            Our Box Types
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Showing {products.length} products
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading our catalog...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <Link 
                href={`/product/${product.id}`}
                key={product.id} 
                className="group flex flex-col bg-white border border-[#ececec] p-5 rounded-lg shadow-sm hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer"
              >
                <div className="relative aspect-square mb-6 overflow-hidden bg-[#f8f8f8] rounded-md">
                  <Image 
                    src={product.image_url || 'https://images.unsplash.com/photo-1605649487212-4f40f00f074d?q=80&w=800&auto=format&fit=crop'} 
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                  />
                  {/* Category tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#3a081a] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm">
                      {product.category || 'Custom Box'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 text-center">
                  <h4 className="font-extrabold text-lg text-[#333] mb-3 uppercase tracking-wide group-hover:text-[#3a081a] transition-colors">
                    {product.name}
                  </h4>
                  
                  <button 
                    onClick={(e) => addToCart(e, product)}
                    className="w-full bg-[#f2f1ef] text-[#3a081a] py-3 px-4 rounded font-bold uppercase tracking-wider hover:bg-[#3a081a] hover:text-white transition-colors mt-auto border border-transparent group-hover:border-[#3a081a]"
                  >
                    Inquire Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-lg">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">No carton boxes have been added yet.</p>
            <p className="text-sm mt-2">Use the admin dashboard to add your box types.</p>
          </div>
        )}
      </div>

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-fade-in-up">
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

export default function CartonBoxesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#3a081a] font-bold">Loading...</div>}>
      <CartonsMain />
    </Suspense>
  );
}
