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

  // Fullscreen initial overlay animation (fades out as scrolling begins)
  const introOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.95]);
  const introY = useTransform(scrollYProgress, [0, 0.18], [0, -30]);

  // Left-side content reveal animation
  const leftOpacity = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.15, 0.65], [-50, 0]);
  const leftY = useTransform(scrollYProgress, [0.15, 0.65], [20, 0]);

  // Right-side image transform (shrinks from full screen to card on the right)
  const imageScale = useTransform(scrollYProgress, [0, 0.65], [2.2, 1]);
  const imageX = useTransform(scrollYProgress, [0, 0.65], ['-25vw', '0vw']);
  const imageRadius = useTransform(scrollYProgress, [0, 0.65], ['0px', '16px']);
  const imageShadow = useTransform(
    scrollYProgress,
    [0.3, 0.65],
    ['0px 0px 0px rgba(0,0,0,0)', '0px 25px 50px -12px rgba(58,8,26,0.25)']
  );

  // Overlay on the image
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.65], [0.45, 0.25, 0.1]);

  // Floating badge on the image
  const badgeOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0.45, 0.7], [20, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[220vh] bg-[#f8f5f2]">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-t border-[#ececec]">
        
        {/* Main Content Layout */}
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10 py-6">
          
          {/* Left Text Content (Appears and slides in with scroll) */}
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

          {/* Right Image Container (Shrinks from full screen to right side) */}
          <div className="w-full md:w-1/2 relative h-[360px] sm:h-[460px] md:h-[580px] flex items-center justify-center">
            <motion.div
              style={{
                scale: imageScale,
                x: imageX,
                borderRadius: imageRadius,
                boxShadow: imageShadow,
              }}
              className="w-full h-full relative overflow-hidden origin-center will-change-transform"
            >
              <img
                src="/cartonbox.jpg"
                alt="Corrugated Carton Boxes Warehouse"
                className="w-full h-full object-cover select-none"
              />
              
              {/* Dynamic Dark Gradient Overlay */}
              <motion.div
                style={{ opacity: darkOverlayOpacity }}
                className="absolute inset-0 bg-black pointer-events-none"
              />

              {/* Floating Badge (Pops in as it settles to card form) */}
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

        {/* Fullscreen Initial Intro (Visible at progress 0, fades out smoothly on scroll) */}
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
