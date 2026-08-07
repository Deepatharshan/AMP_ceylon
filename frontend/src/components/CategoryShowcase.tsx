'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ShowcaseProduct {
  id: string;
  name: string;
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
              <div key={product.id} className="flex flex-col group items-center bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(58,8,26,0.12)] transition-all duration-500 overflow-hidden">
                <Link href={`/product/${product.slug}`} className="block w-full">
                  {/* Image Container */}
                  <div className="w-full aspect-[4/5] bg-gradient-to-b from-[#fafafa] to-[#f4f4f6] relative flex items-center justify-center shadow-inner transition-transform duration-500">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500 z-10" />
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 mix-blend-multiply drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="mt-6 text-center flex flex-col items-center px-6 pb-6">
                    <h3 className="font-semibold text-lg md:text-xl text-[#3a081a] tracking-tight group-hover:text-[#6a1533] transition-colors duration-300" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {product.name}
                    </h3>

                    {/* Color Variations */}
                    {hasColors && (
                      <div className="flex items-center gap-2.5 mt-4 opacity-90 group-hover:opacity-100 transition-opacity">
                        {displayColors.map((color, idx) => (
                          <div 
                            key={idx} 
                            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-black/10 shadow-inner ring-2 ring-transparent group-hover:ring-gray-100 transition-all"
                            style={{ backgroundColor: getColorHex(color) }}
                            title={color}
                          ></div>
                        ))}
                        {extraColors > 0 && (
                          <span className="text-[10px] text-gray-400 font-bold ml-1">+{extraColors}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Action Button (Permanently Visible) */}
                    <div className="mt-6 mb-2 flex items-center justify-center w-full">
                      <span className="block w-full mx-auto max-w-[160px] py-2.5 bg-[#2a0512] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:bg-[#3a081a] hover:shadow-lg hover:shadow-[#3a081a]/20 transition-all duration-300">
                        View Details
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
