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
            // Ensure a valid price format
            const formattedPrice = product.price 
              ? `Rs ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : 'Rs 0.00';
              
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
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                      From {formattedPrice}
                    </p>
                    
                    {/* Dummy color swatches to match Apple style */}
                    <div className="flex items-center gap-2 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="w-3 h-3 rounded-full bg-black border border-gray-200"></div>
                      <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-200"></div>
                      <span className="text-[10px] text-gray-400 ml-1">+1</span>
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
