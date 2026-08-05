'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalOffer({ offer }: { offer: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false); // Default false to prevent bottom banner flash
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Scroll listener for hiding banner on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // New useEffect to handle setting the banner height CSS variable
  useEffect(() => {
    if (!hasDismissed || isOpen || hidden) {
      document.documentElement.style.setProperty('--banner-height', '0px');
      return;
    }
    
    let observer: ResizeObserver | null = null;
    let timeout: NodeJS.Timeout;
    
    const observeHeight = () => {
      const el = document.getElementById('global-offer-banner');
      if (el) {
        document.documentElement.style.setProperty('--banner-height', `${el.offsetHeight}px`);
        observer = new ResizeObserver(() => {
          document.documentElement.style.setProperty('--banner-height', `${el.offsetHeight}px`);
        });
        observer.observe(el);
      } else {
        timeout = setTimeout(observeHeight, 50);
      }
    };
    
    observeHeight();
    
    return () => {
      if (observer) observer.disconnect();
      clearTimeout(timeout);
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, [hasDismissed, isOpen, hidden]);

  useEffect(() => {
    setIsClient(true);
    
    // Check if the user is on an admin page
    if (pathname?.startsWith('/admin')) return;
    
    // Check local storage to see if they've already seen this specific offer
    if (!offer) return;
    
    const dismissedKey = `dismissed_offer_${offer.id}`;
    const bannerDismissedKey = `banner_dismissed_${offer.id}`;
    const activeOfferKey = 'active_offer';
    
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';
    const isBannerDismissed = localStorage.getItem(bannerDismissedKey) === 'true';
    
    let isClaimed = false;
    const activeOfferJson = localStorage.getItem(activeOfferKey);
    if (activeOfferJson) {
      try {
        const claimedOffer = JSON.parse(activeOfferJson);
        if (claimedOffer.id === offer.id) {
          isClaimed = true;
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }
    
    if (isBannerDismissed) setIsPermanentlyHidden(true);

    // If they already claimed it, or dismissed it, keep it dismissed.
    if (isDismissed || isClaimed) {
      setHasDismissed(true);
    } else {
      setHasDismissed(false);
      // Wait a tiny bit and show it
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500); // Wait 0.5s before showing
      return () => clearTimeout(timer);
    }
  }, [offer, pathname]);

  if (!offer || pathname?.startsWith('/admin') || !isClient) return null;

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
    localStorage.setItem(`dismissed_offer_${offer.id}`, 'true');
  };

  const handleClaim = () => {
    localStorage.setItem('active_offer', JSON.stringify(offer));
    setShowSuccess(true);
  };

  const handleBannerDismiss = () => {
    setIsPermanentlyHidden(true);
    localStorage.setItem(`banner_dismissed_${offer.id}`, 'true');
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    handleClose();
  };

  const getDiscountText = () => {
    const type = offer?.discount_type?.toLowerCase();
    if (type === 'percentage') return `${offer.discount_value}% OFF`;
    if (type === 'fixed') return `$${offer.discount_value} OFF`;
    return 'Special Discount';
  };

  return (
    <>
      {/* The Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-sm"
            >
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black transition-colors bg-white/80 rounded-full p-1 md:bg-transparent"
              >
                <X size={20} />
              </button>

              {/* Left Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                <Image 
                  src={offer.image_url || 'https://images.unsplash.com/photo-1563241598-646bc5683794?q=80&w=800&auto=format&fit=crop'} 
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Limited Time Offer</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#3a081a] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {offer.title}
                </h2>
                <div className="mb-8">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {offer.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded font-bold text-lg tracking-wider border border-red-100">
                      {getDiscountText()}
                    </span>
                    {offer.valid_to && (
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Valid Till: {new Date(offer.valid_to).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleClaim}
                    className="w-full py-3 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors shadow-lg shadow-[#3a081a]/20"
                  >
                    Claim Discount
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slim Persistent Banner (Removed as per request to remove the maroon border) */}
      <AnimatePresence>
        {/* Banner disabled */}
      </AnimatePresence>

      {/* Success Notification Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discount Applied!</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Check out catalog and inquire with our company soon and get orders and discount
              </p>
              <button 
                onClick={handleSuccessOk}
                className="w-full py-3 bg-[#3a081a] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors rounded shadow-lg"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
