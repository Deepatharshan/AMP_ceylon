'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
}

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) {
          // Map to fit page format
          const mapped = data.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            image_url: item.image_url,
            category: item.category
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

  const filteredProducts = activeCategory === "All Collections" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#333]">
      <div className="bg-[#3a081a] h-32 w-full relative">
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
              Our Collections
            </h1>
            <p className="text-gray-600 leading-relaxed text-sm">
              Designed in-house by our master florists, our collections represent the pinnacle of artificial botanical artistry. Each arrangement is meticulously hand-crafted using premium polyesters and artisanal resins to replicate the delicate texture and organic movement of nature.
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
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-12">
            
            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                Categories
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeCategory === category 
                          ? 'bg-[#3a081a] text-white font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group cursor-pointer flex flex-col">
                    <div className="relative aspect-square mb-6 overflow-hidden bg-gray-100">
                      <Image 
                        src={product.image_url || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'} 
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 tracking-wider">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <p>No items found in {activeCategory}.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-16 gap-2">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-400 text-sm">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#3a081a] text-white text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 hover:border-gray-400 text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 hover:border-gray-400 text-sm">3</button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-400 text-sm">&gt;</button>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
