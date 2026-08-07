'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ShowcaseProduct {
  id: string;
  name: string;
  description?: string;
  image: string;
  price?: number;
  slug: string;
  colors?: string[];
}

interface CategoryShowcaseProps {
  title?: string;
  description?: string;
  categoryLink?: string;
  featuredImage?: string; // no longer used
  products: ShowcaseProduct[];
}

export default function CategoryShowcase({
  title,
  description,
  categoryLink,
  products
}: CategoryShowcaseProps) {
  // Take up to 8 products for the grid
  const displayProducts = products.slice(0, 8);

  // Helper to map color names to hex codes if needed, though Tailwind supports many standard names.
  const getColorHex = (colorName: string) => {
    const c = colorName.toLowerCase().trim();
    if (c === 'white') return '#ffffff';
    if (c === 'black') return '#000000';
    if (c === 'red') return '#ef4444';
    if (c === 'blue') return '#3b82f6';
    if (c === 'green') return '#22c55e';
    if (c === 'yellow') return '#eab308';
    if (c === 'gray' || c === 'grey') return '#9ca3af';
    if (c === 'brown') return '#8b4513';
    return c; // fallback, could be a hex code already
  };

  return (
    <section className="py-4 md:py-8 px-4 md:px-8 w-full mx-auto">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section (Optional) */}
        {title && (
          <div className="mb-10 max-w-2xl text-center mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4 font-inter">
              {title}
            </h2>
            {description && (
              <p className="text-gray-500 font-medium leading-relaxed mb-8 text-sm md:text-base">
                {description}
              </p>
            )}
            {categoryLink && (
              <Link 
                href={categoryLink}
                className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 text-sm font-semibold tracking-wide transition-colors"
              >
                Shop all {title.replace('SHOP ', '').toLowerCase()} &gt;
              </Link>
            )}
          </div>
        )}

        {/* Clean Static Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {displayProducts.map((product) => {
            const hasColors = product.colors && product.colors.length > 0;
            const displayColors = hasColors ? product.colors!.slice(0, 3) : [];
            const extraColors = hasColors ? product.colors!.length - 3 : 0;
              
            return (
              <div key={product.id} className="flex flex-col h-full group items-start bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden">
                <Link href={`/product/${product.slug}`} className="flex flex-col h-full block w-full text-left">
                  {/* Image Container */}
                  <div className="w-full shrink-0 aspect-[4/5] bg-gradient-to-b from-[#fafafa] to-[#f4f4f6] relative flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500 z-10" />
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 mix-blend-multiply drop-shadow-sm group-hover:drop-shadow-md transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="mt-5 flex flex-col items-start px-5 flex-1 w-full">
                    <h3 className="font-bold text-lg text-gray-900 tracking-tight group-hover:text-black transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description ? (
                      <p className="text-gray-500 text-[11px] leading-relaxed mt-1.5 line-clamp-2">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-[11px] leading-relaxed mt-1.5 line-clamp-2">
                        Premium botanical arrangement handcrafted for durability.
                      </p>
                    )}

                    {/* Color Variations as Pill Tags */}
                    {hasColors && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 mb-2">
                        {displayColors.map((color, idx) => (
                          <div 
                            key={idx} 
                            className="px-2.5 py-1 bg-gray-100/80 rounded-full flex items-center gap-1.5"
                            title={color}
                          >
                            <div className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: getColorHex(color) }}></div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{color}</span>
                          </div>
                        ))}
                        {extraColors > 0 && (
                          <div className="px-2.5 py-1 bg-gray-100/80 rounded-full flex items-center">
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">+{extraColors}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="mt-auto pt-4 pb-5 w-full">
                      <span className="flex w-full items-center justify-center py-2.5 bg-[#3a081a] text-white text-xs font-semibold rounded-2xl shadow-sm hover:bg-[#280512] hover:shadow-[0_8px_20px_rgba(58,8,26,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                        Inquiry now
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
