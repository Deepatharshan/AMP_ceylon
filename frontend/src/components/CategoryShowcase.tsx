'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  featuredImage: string;
  products: ShowcaseProduct[];
}

export default function CategoryShowcase({
  title,
  description,
  categoryLink,
  featuredImage,
  products
}: CategoryShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Take up to 6 products for the showcase row
  const displayProducts = products.slice(0, 6);

  return (
    <section className="py-4 md:py-8 px-0 w-full mx-auto overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section (Optional) */}
        {title && (
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900 mb-4 font-inter">
              {title}
            </h2>
            {description && (
              <p className="text-gray-700 font-medium leading-relaxed mb-8 text-sm md:text-base">
                {description}
              </p>
            )}
            {categoryLink && (
              <Link 
                href={categoryLink}
                className="inline-flex items-center justify-center bg-[#282c34] hover:bg-black text-white px-8 py-3 rounded shadow-sm text-sm font-semibold tracking-wide transition-colors"
              >
                Shop Now
              </Link>
            )}
          </div>
        )}

        {/* Gallery Section */}
        <div className="relative w-full flex items-center group">
          
          {/* Optional Left Arrow */}
          <button className="absolute -left-5 z-10 w-10 h-10 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" aria-label="Previous">
            <ArrowLeft size={16} className="text-gray-400" />
          </button>

          <div className="flex w-full h-[450px] md:h-[550px] gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x">
            {/* Expandable Product Cards */}
            {displayProducts.map((product, idx) => {
              const isHovered = hoveredIndex === idx;
              
              return (
                <motion.div
                  key={product.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  layout
                  initial={{ flex: 1 }}
                  animate={{ 
                    flex: isHovered ? 2.5 : (hoveredIndex === null ? 1 : 0.8) 
                  }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="relative h-full overflow-hidden cursor-pointer group/card bg-gray-100 shrink-0 w-[50vw] md:w-auto snap-center"
                >
                  <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    
                    {/* Gradient Overlay for text readability */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
                    
                    {/* Product Details */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end">
                      <h3 className={`font-semibold text-lg md:text-xl truncate transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 md:opacity-100 md:translate-y-0'}`}>
                        {product.name}
                      </h3>
                      <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <span className="text-xs uppercase tracking-widest border border-white/40 px-6 py-2 hover:bg-white hover:text-black transition-colors inline-block">
                          View
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Optional Right Arrow */}
          <button className="absolute -right-5 z-10 w-10 h-10 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Next">
            <ArrowRight size={16} className="text-gray-400" />
          </button>

        </div>
      </div>
    </section>
  );
}
