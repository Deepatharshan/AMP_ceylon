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
              <div key={product.id} className="flex flex-col group items-center">
                <Link href={`/product/${product.slug}`} className="block w-full">
                  {/* Image Container */}
                  <div className="w-full aspect-[4/5] bg-[#fbfbfd] rounded-3xl overflow-hidden relative flex items-center justify-center p-8 transition-transform duration-300 group-hover:scale-[1.02]">
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-6 mix-blend-multiply"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="mt-8 text-center flex flex-col items-center">
                    <h3 className="font-semibold text-lg md:text-xl text-gray-900 tracking-tight">
                      {product.name}
                    </h3>

                    {/* Color Variations */}
                    {hasColors && (
                      <div className="flex items-center gap-2 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        {displayColors.map((color, idx) => (
                          <div 
                            key={idx} 
                            className="w-3 h-3 rounded-full border border-gray-200"
                            style={{ backgroundColor: getColorHex(color) }}
                            title={color}
                          ></div>
                        ))}
                        {extraColors > 0 && (
                          <span className="text-[10px] text-gray-400 ml-1">+{extraColors}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Action Button (Appears on Hover) */}
                    <div className="mt-4 h-10 flex items-center justify-center">
                      <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <span className="px-6 py-2.5 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-[#3a081a]/20">
                          Inquire Now
                        </span>
                      </div>
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
