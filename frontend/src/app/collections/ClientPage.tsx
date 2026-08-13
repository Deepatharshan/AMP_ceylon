'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES, SPECIFICATIONS } from '@/lib/mock-data';
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

function CollectionsMain() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category');
  
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(["All Collections"]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (categoryQuery) {
      setActiveCategory(categoryQuery);
    } else {
      setActiveCategory("All Collections");
    }
  }, [categoryQuery]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase.from('products').select('*').or('business_line.eq.FLORAL,business_line.is.null').order('created_at', { ascending: false });
        if (error) throw error;

        // Fetch categories from the admin-managed categories table
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name')
          .or('business_line.eq.FLORAL,business_line.is.null')
          .order('name', { ascending: true });
          
        if (catData && catData.length > 0) {
          setCategoriesList(["All Collections", ...catData.map(c => c.name)]);
        } else {
          setCategoriesList(["All Collections"]);
        }

        if (data) {
          // Map to fit page format
          const mapped = data.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            image_url: item.image_url,
            category: item.category,
            description: item.description || '',
            is_top_seller: item.is_top_seller,
            is_new_collection: item.is_new_collection,
            is_limited_product: item.is_limited_product
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Use a slightly longer timeout to allow React to fully swap out the images
    // and let the browser's native scroll-anchoring finish
    setTimeout(() => {
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const filteredProducts = activeCategory === "All Collections" 
    ? products 
    : products.filter(p => p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-transparent text-[#333]">
      <div className="bg-transparent w-full relative" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-12 mb-12">
          <div className="max-w-2xl">
            <p className="text-[#4a0b22] text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
              The Export Collection
            </p>
            <h1 className="text-5xl text-[#3a081a] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Wholesale Artificial Floral Arrangements & Decor
            </h1>
            <p className="text-gray-600 leading-relaxed text-sm">
              Designed in-house by our master florists, our collections represent the pinnacle of artificial botanical artistry. Each arrangement is meticulously hand-crafted using premium polyesters and artisanal resins to replicate the delicate texture and organic movement of nature. We supply wholesale artificial floral arrangements, bespoke lifelike plants, and premium botanical decor in bulk to global retail markets and supply chains.
            </p>
          </div>
          
          <div className="flex gap-8 mt-8 md:mt-0 text-center">
            <div>
              <div className="text-[#3a081a] font-bold text-xl">437</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Designs</div>
            </div>
            <div>
              <div className="text-[#3a081a] font-bold text-xl">Export</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Quality</div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 scroll-mt-[100px]" ref={gridRef}>
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-12">
            
            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                Categories
              </h3>
              <ul className="space-y-2 mt-4">
                {categoriesList.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`block w-[calc(100%+1.5rem)] text-left -ml-3 px-3 py-2 text-sm rounded-md transition-all ${
                        activeCategory === category 
                          ? 'bg-[#3a081a] text-white font-medium shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#3a081a]'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                Specifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {SPECIFICATIONS.map(spec => (
                  <span key={spec} className="bg-[#e8ece3] text-[#4a5d3c] text-xs px-3 py-1.5 rounded-sm font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Promo Box */}
            <div className="bg-[#f2f1ef] p-6 text-sm text-gray-700">
              <p className="font-bold mb-2 text-[#3a081a]">Turn-key OEM</p>
              <p className="mb-4">Looking for proprietary designs for your retail chain?</p>
              <a href="#" className="text-[#3a081a] font-bold underline decoration-1 underline-offset-4 hover:text-[#4a0b22]">
                Contact B2B Manager
              </a>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} items in <span className="font-semibold text-gray-800">{activeCategory}</span>
              </p>
              <div className="flex items-center gap-4">
                <select className="bg-transparent text-sm text-gray-600 font-medium outline-none cursor-pointer">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
              </div>
            </div>

            {/* Grid */}
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {currentProducts.map(product => (
                  <Link 
                    href={`/product/${product.id}`}
                    key={product.id} 
                    className="group flex flex-col bg-white border border-[#ececec] p-4 rounded shadow-sm hover:shadow transition-shadow cursor-pointer"
                  >
                    <div className="relative aspect-square mb-6 overflow-hidden bg-white rounded">
                      <Image 
                        src={product.image_url || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'} 
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-102"
                      />
                      {/* Banner tags overlay */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                        {product.is_top_seller && (
                          <span className="bg-[#3a081a] text-[#f5ebd3] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                            Top Seller
                          </span>
                        )}
                        {product.is_new_collection && (
                          <span className="bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                            New Collection
                          </span>
                        )}
                        {product.is_limited_product && (
                          <span className="bg-amber-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                            Limited Edition
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="font-bold text-base text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                        {product.description || "Premium botanical arrangement handcrafted for export quality and high-grade aesthetic durability."}
                      </p>
                      <div className="w-full bg-[#3a081a] text-white py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#4a0b22] text-center transition-colors mt-auto">
                        Inquire Now
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <p>No items found in {activeCategory}.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 gap-2">
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-sm transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:border-gray-400 cursor-pointer'}`}
                >
                  &lt;
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center text-sm transition-colors border ${
                      currentPage === i + 1 
                        ? 'bg-[#3a081a] border-[#3a081a] text-white' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-400 cursor-pointer'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-sm transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:border-gray-400 cursor-pointer'}`}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 max-w-sm w-full bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 text-green-600 border border-green-200 font-bold text-sm shrink-0">
            ✓
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

      <Footer />
    </main>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#fcfbf9] text-[#333]">
        <div className="bg-transparent w-full relative" style={{ height: 'calc(5rem + var(--banner-height, 0px))' }}>
          <Navbar />
        </div>
      </main>
    }>
      <CollectionsMain />
    </Suspense>
  );
}
