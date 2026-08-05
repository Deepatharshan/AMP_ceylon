'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();

  // Smooth out the scroll progress for the SVG drawing
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  useEffect(() => {
    return scrollY.onChange((latest) => {
      // Show button after scrolling down 400px
      if (latest > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.5,
        y: isVisible ? 0 : 50,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed bottom-8 right-8 z-50 flex items-center justify-center p-3 rounded-full bg-white text-[#3a081a] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow ${!isVisible ? 'pointer-events-none' : 'pointer-events-auto'}`}
      aria-label="Scroll to top"
    >
      {/* Background Circle */}
      <svg width="44" height="44" viewBox="0 0 100 100" className="absolute -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#f4e6ea"
          strokeWidth="6"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3a081a"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      
      {/* Arrow Icon */}
      <ArrowUp className="w-5 h-5 relative z-10" />
    </motion.button>
  );
}
