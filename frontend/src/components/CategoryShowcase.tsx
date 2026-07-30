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
  title: string;
  description: string;
  categoryLink: string;
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

  // Take only up to 3 products for the showcase row
  const displayProducts = products.slice(0, 3);

  return (
    <section className="py-20 px-6 md:px-12 bg-white w-full mx-auto overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900 mb-4 font-inter">
            {title}
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed mb-8 text-sm md:text-base">
            {description}
          </p>
          <Link 
            href={categoryLink}
            className="inline-flex items-center justify-center bg-[#282c34] hover:bg-black text-white px-8 py-3 rounded shadow-sm text-sm font-semibold tracking-wide transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {/* Gallery Section */}
        <div className="relative w-full flex items-center group">
          
          {/* Optional Left Arrow */}
          <button className="absolute -left-5 z-10 w-10 h-10 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" aria-label="Previous">
            <ArrowLeft size={16} className="text-gray-400" />
          </button>

          <div className="flex w-full h-[450px] md:h-[550px] gap-2 md:gap-4 overflow-x-auto md:overflow-visible snap-x">
            
            {/* Main Featured Image */}
            <motion.div 
              className="relative h-full overflow-hidden shrink-0 w-[70vw] md:w-auto snap-center"
              layout
              animate={{ flex: hoveredIndex === null ? 3 : 2 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Image 
                src={featuredImage} 
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                <Link href={categoryLink} className="inline-block border border-white/70 text-white hover:bg-white hover:text-black px-6 py-2 backdrop-blur-sm transition-all text-xs font-bold tracking-widest uppercase">
                  Shop Collection
                </Link>
              </div>
            </motion.div>

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
                    
                    {/* Overlay that appears on hover */}
                    <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
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
