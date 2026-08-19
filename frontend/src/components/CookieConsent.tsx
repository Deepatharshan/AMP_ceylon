'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Do not show on admin routes
    if (pathname?.startsWith('/admin')) {
      setIsVisible(false);
      return;
    }

    // Check if the user has already consented
    const hasConsented = localStorage.getItem('amp_cookie_consent');
    if (!hasConsented) {
      // Small delay so it slides in smoothly after page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleAccept = () => {
    localStorage.setItem('amp_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none flex justify-center"
        >
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-5 md:p-6 w-full max-w-4xl flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
            
            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#fcf9f2] shrink-0">
              <Cookie size={24} className="text-[#3a081a]" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-gray-900 font-bold text-lg mb-1">We value your privacy</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                <Link href="/privacy-policy" className="text-[#3a081a] font-semibold hover:underline ml-1">
                  Read our Privacy Policy.
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => setIsVisible(false)}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-[#3a081a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#2a0512] transition-colors shadow-md hover:shadow-lg"
              >
                Accept All
              </button>
            </div>
            
            {/* Absolute close button for mobile */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 md:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
