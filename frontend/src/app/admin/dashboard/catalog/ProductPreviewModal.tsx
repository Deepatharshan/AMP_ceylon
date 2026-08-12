'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag as TagIcon, LayoutGrid, Info } from 'lucide-react';
import Link from 'next/link';

interface ProductPreviewModalProps {
  productData: {
    name: string;
    description: string;
    sku: string;
    category: string;
    price: number;
    materials: string;
    colors: string;
    is_top_seller: boolean;
    is_new_collection: boolean;
    is_limited_product: boolean;
    imageUrls: string[];
    size: string;
  };
  onClose: () => void;
}

export default function ProductPreviewModal({ productData, onClose }: ProductPreviewModalProps) {
  const allImages = productData.imageUrls.filter(Boolean);
  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop');
  }
  
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const colorList = productData.colors.split(',').map(c => c.trim()).filter(Boolean);
  const materialList = productData.materials.split(',').map(m => m.trim()).filter(Boolean);
  
  const [viewMode, setViewMode] = useState<'detailed' | 'collection'>('detailed');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[90vh] bg-[#fcfbf9] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm z-10">
            <div className="flex items-center gap-2 text-[#3a081a]">
              <Info size={18} />
              <h3 className="font-semibold text-sm tracking-wide hidden md:block">Customer View Preview</h3>
            </div>
            
            <div className="flex items-center bg-gray-100 p-1 rounded shadow-inner">
              <button 
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded transition-colors ${viewMode === 'detailed' ? 'bg-white text-[#3a081a] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Detailed (4:5)
              </button>
              <button 
                onClick={() => setViewMode('collection')}
                className={`px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded transition-colors ${viewMode === 'collection' ? 'bg-white text-[#3a081a] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Collection Grid (1:1)
              </button>
            </div>

            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            {viewMode === 'detailed' ? (
            <div className="max-w-5xl mx-auto">
              
              {/* Breadcrumb Header */}
              <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-8 uppercase tracking-widest font-semibold">
                <span className="hover:underline cursor-pointer">Catalog</span>
                <span>&gt;</span>
                <span className="hover:underline cursor-pointer">{productData.category || 'Category'}</span>
                <span>&gt;</span>
                <span className="text-gray-800">{productData.name || 'Product Name'}</span>
              </div>

              {/* Main Product Section */}
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                
                {/* Left Column: Image Gallery */}
                <div className="w-full lg:w-1/2 flex gap-4">
                  {/* Thumbnail Strip */}
                  {allImages.length > 1 && (
                    <div className="flex flex-col gap-3 w-20 shrink-0">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(imgUrl)}
                          className={`aspect-square w-full bg-white border rounded overflow-hidden relative cursor-pointer ${
                            activeImage === imgUrl ? 'border-[#3a081a] ring-1 ring-[#3a081a]' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="object-contain p-1 w-full h-full" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main Image Display */}
                  <div className="flex-1 aspect-[4/5] bg-white border border-gray-200 rounded overflow-hidden relative shadow-sm group">
                    <img src={activeImage} alt={productData.name} className="object-contain p-4 w-full h-full transition-transform duration-700 group-hover:scale-105" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {productData.is_top_seller && (
                        <span className="bg-[#3a081a] text-[#f5ebd3] text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm">
                          Top Seller
                        </span>
                      )}
                      {productData.is_new_collection && (
                        <span className="bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm">
                          New Collection
                        </span>
                      )}
                      {productData.is_limited_product && (
                        <span className="bg-amber-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm">
                          Limited Edition
                        </span>
                      )}
                      <span className="bg-white text-gray-800 text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm border border-gray-100">
                        Export Grade
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-1/2 space-y-6 text-left">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{productData.category || 'Category'}</span>
                    <h1 className="text-4xl text-[#3a081a] mt-1 mb-2 font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {productData.name || 'Product Name'}
                    </h1>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">SKU: {productData.sku || 'N/A'}</p>
                  </div>

                  {/* Size/Arrangement selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Size / Arrangement</label>
                    <select
                      className="px-4 py-2 text-xs border border-gray-300 bg-white rounded focus:outline-none focus:border-[#3a081a] text-black w-full cursor-not-allowed"
                      disabled
                    >
                      <option>{productData.size || 'Standard Size'}</option>
                    </select>
                  </div>

                  {/* Color selection circles */}
                  {colorList.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Color Base Finish</label>
                      <div className="flex gap-3">
                        {colorList.map((color, idx) => (
                          <button
                            key={idx}
                            title={color}
                            className={`w-6 h-6 rounded-full border-2 ${idx === 0 ? 'border-[#3a081a] ring-2 ring-offset-1 ring-[#f4e6ea]' : 'border-gray-200'} shadow-sm`}
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Botanical Overview</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {productData.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Tags */}
                  {(materialList.length > 0 || colorList.length > 0) && (
                    <div className="pt-4 flex flex-wrap gap-2">
                      {materialList.map((m, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded">
                          <LayoutGrid size={12} /> {m}
                        </span>
                      ))}
                      {colorList.map((c, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-[#f4e6ea] text-[#3a081a] text-[10px] font-bold uppercase tracking-wider rounded">
                          <TagIcon size={12} /> {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add to Inquiry action */}
                  <div className="pt-8">
                    <button
                      className="w-full py-4 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors rounded shadow-lg shadow-[#3a081a]/20 cursor-not-allowed opacity-80"
                      disabled
                    >
                      Add to Inquiry Cart
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wider">
                      Export pricing calculated per volume container
                    </p>
                  </div>
                </div>
              </div>
            </div>
            ) : (
            <div className="max-w-5xl mx-auto py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                
                {/* Dummy Product 1 */}
                <div className="group flex flex-col bg-white border border-[#ececec] p-4 rounded shadow-sm opacity-40 grayscale pointer-events-none">
                  <div className="relative aspect-square mb-6 overflow-hidden bg-white rounded">
                    <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop" className="object-contain p-4 w-full h-full" alt="dummy" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-base text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Previous Product</h4>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">A sample description for an existing botanical item in the collection.</p>
                    <div className="w-full bg-[#3a081a] text-white py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider text-center">Inquire Now</div>
                  </div>
                </div>

                {/* Active Edit Product */}
                <div className="group flex flex-col bg-white border-2 border-[#3a081a] p-4 rounded shadow-2xl relative transform scale-105 z-10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3a081a] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-md">
                    Currently Editing
                  </div>
                  
                  <div className="relative aspect-square mb-6 overflow-hidden bg-white rounded border border-gray-100">
                    <img src={activeImage} alt={productData.name} className="object-contain p-4 w-full h-full" />
                    
                    {/* Tags */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                      {productData.is_top_seller && (
                        <span className="bg-[#3a081a] text-[#f5ebd3] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                          Top Seller
                        </span>
                      )}
                      {productData.is_new_collection && (
                        <span className="bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                          New Collection
                        </span>
                      )}
                      {productData.is_limited_product && (
                        <span className="bg-amber-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                          Limited Edition
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-base text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {productData.name || 'Product Name'}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                      {productData.description || 'Premium botanical arrangement handcrafted for export quality and high-grade aesthetic durability.'}
                    </p>
                    <div className="w-full bg-[#3a081a] text-white py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider text-center pointer-events-none">
                      Inquire Now
                    </div>
                  </div>
                </div>

                {/* Dummy Product 2 */}
                <div className="group flex flex-col bg-white border border-[#ececec] p-4 rounded shadow-sm opacity-40 grayscale pointer-events-none hidden xl:flex">
                  <div className="relative aspect-square mb-6 overflow-hidden bg-white rounded">
                    <img src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=800&auto=format&fit=crop" className="object-contain p-4 w-full h-full" alt="dummy" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-base text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Next Product</h4>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">A beautiful display item available for bulk wholesale orders.</p>
                    <div className="w-full bg-[#3a081a] text-white py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider text-center">Inquire Now</div>
                  </div>
                </div>

              </div>
            </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
