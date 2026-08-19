'use client';

import React from 'react';
import Link from 'next/link';

export default function CartonHero() {
  return (
    <section className="relative w-full py-24 bg-[#f8f5f2] overflow-hidden border-t border-[#ececec]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start z-10">
          <p className="text-[#3a081a] text-xs font-bold uppercase tracking-widest mb-4">
            New Business Division
          </p>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl text-[#3a081a] mb-6 leading-tight" 
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Premium Carton &<br/> Packaging Solutions
          </h2>
          <p className="text-gray-600 mb-10 leading-relaxed text-lg max-w-lg">
            Leveraging years of export packaging expertise, we now manufacture high-quality, durable corrugated carton boxes suitable for manufacturing, retail, e-commerce, and logistics right here in the local market.
          </p>
          
          <ul className="flex flex-col gap-3 mb-10 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3a081a]/10 flex items-center justify-center text-[#3a081a]">✓</span>
              Custom-made sizes & specifications
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3a081a]/10 flex items-center justify-center text-[#3a081a]">✓</span>
              Single-wall and double-wall corrugated
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#3a081a]/10 flex items-center justify-center text-[#3a081a]">✓</span>
              Custom printing with your company logo
            </li>
          </ul>

          <Link 
            href="/carton-boxes"
            className="px-8 py-4 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-3 group"
            style={{ color: '#ffffff' }}
          >
            Explore Carton Boxes
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Image Grid/Hero Image */}
        <div className="w-full md:w-1/2 relative h-[500px] md:h-[600px] z-10 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="/cartonbox.jpg" 
            alt="Corrugated Carton Boxes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-0">
            <div className="bg-[#fcfbfa] px-6 py-4 rounded-r shadow-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tailored Packaging</p>
              <p className="text-xl font-bold text-[#3a081a]">For Every Industry</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#3a081a]/5 -skew-x-12 transform origin-top-right pointer-events-none"></div>
    </section>
  );
}
