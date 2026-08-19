'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function CartonHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Stage 1: Full-screen intro title (visible initially, fades out immediately on scroll 0 -> 0.15)
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const introY = useTransform(scrollYProgress, [0, 0.15], [0, -25]);

  // Stage 2: Left-side text content reveal (starts AFTER image clears left side: 0.38 -> 0.72)
  const leftOpacity = useTransform(scrollYProgress, [0.38, 0.72], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.38, 0.72], [-35, 0]);
  const leftY = useTransform(scrollYProgress, [0.38, 0.72], [20, 0]);

  // Stage 3: Image resizing and docking smoothly from full viewport to right-side card
  const imageWidth = useTransform(scrollYProgress, [0, 0.68], ['100vw', '100%']);
  const imageHeight = useTransform(scrollYProgress, [0, 0.68], ['100vh', '100%']);
  const imageTop = useTransform(scrollYProgress, [0, 0.68], ['calc(-50vh + 50%)', '0%']);
  const imageRadius = useTransform(scrollYProgress, [0, 0.68], ['0px', '20px']);
  const imageShadow = useTransform(
    scrollYProgress,
    [0.35, 0.68],
    ['0px 0px 0px rgba(0,0,0,0)', '0px 25px 50px -12px rgba(58,8,26,0.22)']
  );

  // Dark overlay (darker during fullscreen for contrast, subtle in card mode)
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.68], [0.45, 0.2, 0.05]);

  // Floating badge on the card (pops in at the end: 0.6 -> 0.8)
  const badgeOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0.6, 0.8], [15, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[220vh] bg-[#f8f5f2]">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-t border-[#ececec]">
        
        {/* Main Content Layout Grid */}
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10 py-6">
          
          {/* Left Text Content (Only appears after full-screen image shrinks) */}
          <motion.div
            style={{
              opacity: leftOpacity,
              x: leftX,
              y: leftY,
            }}
            className="w-full md:w-1/2 flex flex-col justify-center items-start z-10"
          >
            <p className="text-[#3a081a] text-xs font-bold uppercase tracking-widest mb-4">
              New Business Division
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3a081a] mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Premium Carton &<br /> Packaging Solutions
            </h2>
            <p className="text-gray-600 mb-8 sm:mb-10 leading-relaxed text-base sm:text-lg max-w-lg">
              Leveraging years of export packaging expertise, we now manufacture high-quality, durable corrugated carton boxes suitable for manufacturing, retail, e-commerce, and logistics right here in the local market.
            </p>

            <ul className="flex flex-col gap-3 mb-8 sm:mb-10 text-xs sm:text-sm text-gray-700 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3a081a]/10 flex items-center justify-center text-[#3a081a] shrink-0 font-bold">
                  ✓
                </span>
                Custom-made sizes & specifications
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3a081a]/10 flex items-center justify-center text-[#3a081a] shrink-0 font-bold">
                  ✓
                </span>
                Single-wall and double-wall corrugated
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3a081a]/10 flex items-center justify-center text-[#3a081a] shrink-0 font-bold">
                  ✓
                </span>
                Custom printing with your company logo
              </li>
            </ul>

            <Link
              href="/carton-boxes"
              className="px-8 py-4 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-3 group"
              style={{ color: '#ffffff' }}
            >
              Explore Carton Boxes
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Right Column Target Slot */}
          <div className="w-full md:w-1/2 relative h-[360px] sm:h-[460px] md:h-[580px] flex items-center justify-end">
            <motion.div
              style={{
                width: imageWidth,
                height: imageHeight,
                top: imageTop,
                right: 0,
                borderRadius: imageRadius,
                boxShadow: imageShadow,
              }}
              className="absolute overflow-hidden origin-center will-change-transform z-15"
            >
              <img
                src="/cartonbox.jpg"
                alt="Corrugated Carton Boxes Warehouse"
                className="w-full h-full object-cover select-none"
              />
              
              {/* Dynamic Overlay */}
              <motion.div
                style={{ opacity: darkOverlayOpacity }}
                className="absolute inset-0 bg-black pointer-events-none"
              />

              {/* Floating Badge (Appears when docked in card form) */}
              <motion.div
                style={{
                  opacity: badgeOpacity,
                  y: badgeY,
                }}
                className="absolute bottom-6 sm:bottom-8 left-0 z-20 pointer-events-none"
              >
                <div className="bg-[#fcfbfa] px-5 sm:px-6 py-3 sm:py-4 rounded-r shadow-xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                    Tailored Packaging
                  </p>
                  <p className="text-base sm:text-xl font-bold text-[#3a081a]">
                    For Every Industry
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Fullscreen Initial Intro (Only at scroll start 0 -> 0.15) */}
        <motion.div
          style={{
            opacity: introOpacity,
            scale: introScale,
            y: introY,
          }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs uppercase tracking-widest font-bold mb-4 shadow-lg">
            New Business Division
          </div>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl text-white font-normal drop-shadow-lg max-w-4xl tracking-tight leading-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Premium Carton &amp; Packaging
          </h1>
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium tracking-wider uppercase bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mt-4 animate-bounce">
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#3a081a]/5 -skew-x-12 transform origin-top-right pointer-events-none"></div>
      </div>
    </section>
  );
}
