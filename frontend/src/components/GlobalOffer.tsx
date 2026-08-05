'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideToUnlock } from './ui/reward-card';

export default function GlobalOffer({ offer }: { offer: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false); // Default false to prevent bottom banner flash
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
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
    const isClaimed = !!localStorage.getItem(activeOfferKey);
    
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
    // The SlideToUnlock component shows an inline success message, so we just close the modal after a short delay
    setTimeout(() => {
      handleClose();
    }, 1500);
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

                <div className="flex flex-col gap-3 min-h-[140px] justify-center">
                  <AnimatePresence mode="wait">
                    {!isUnlocking ? (
                      <motion.button 
                        key="claim-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={() => setIsUnlocking(true)}
                        className="w-full py-3 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors shadow-lg shadow-[#3a081a]/20"
                      >
                        Claim Discount
                      </motion.button>
                    ) : (
                      <motion.div
                        key="slider-container"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                      >
                        <SlideToUnlock
                          onUnlock={handleClaim}
                          sliderText="Swipe to claim offer"
                          unlockedContent={
                            <div className="flex w-full items-center justify-center rounded-lg bg-green-50 p-4 text-green-700 border border-green-200 shadow-sm">
                              <Check size={20} className="mr-2" />
                              <span className="font-bold uppercase tracking-wider text-sm">Discount Applied!</span>
                            </div>
                          }
                          shimmer={true}
                          className="w-full max-w-none border-0 shadow-none p-0 bg-transparent"
                        >
                          <div className="text-center mb-2">
                            <p className="text-sm font-medium text-gray-700">Almost there!</p>
                          </div>
                        </SlideToUnlock>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

    </>
  );
}
