'use client';

import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PreviewModal({ offer, onClose }: { offer: any, onClose: () => void }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);

  const handleClaim = () => {
    setShowSuccess(true);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    onClose();
  };

  const getDiscountText = () => {
    const type = offer?.discount_type?.toLowerCase();
    if (type === 'percentage') return `${offer.discount_value || '15'}% OFF`;
    if (type === 'fixed') return `$${offer.discount_value || '50'} OFF`;
    return '15% OFF'; // Default fallback for preview if missing
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${offer.type === 'CAMPAIGN' ? 'max-w-5xl min-h-[75vh]' : 'max-w-3xl'} bg-white flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-sm`}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={onClose}
              className={`absolute top-4 right-4 z-10 transition-colors rounded-full p-1 ${
                offer.type === 'CAMPAIGN' 
                  ? 'text-white/60 hover:text-white bg-black/20 hover:bg-black/40 md:text-gray-400 md:hover:text-white md:bg-transparent' 
                  : 'text-gray-400 hover:text-black bg-white/80 md:bg-transparent'
              }`}
            >
              <X size={offer.type === 'CAMPAIGN' ? 24 : 20} />
            </button>

            {/* Campaign Image (Full Size) OR Regular Offer Image (Half Size) */}
            <div className={`relative ${offer.type === 'CAMPAIGN' ? 'w-full h-full min-h-[75vh]' : 'w-full md:w-1/2 h-64 md:h-auto'} bg-gray-100 flex items-center justify-center text-gray-400 text-sm`}>
              {offer.image_url ? (
                <Image 
                  src={offer.image_url} 
                  alt={offer.title || 'Offer'}
                  fill
                  className="object-cover"
                />
              ) : (
                'No Image Selected'
              )}

              {/* Details Toggle Button for Campaign */}
              {offer.type === 'CAMPAIGN' && (
                <div className="absolute bottom-6 left-6 z-20">
                  <button 
                    onClick={() => setShowCampaignDetails(prev => !prev)}
                    className="bg-black/80 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl"
                  >
                    {showCampaignDetails ? 'Hide Details' : 'View Campaign Details'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Content / Overlay */}
            {offer.type === 'CAMPAIGN' ? (
              <AnimatePresence>
                {showCampaignDetails && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="absolute top-0 right-0 bottom-0 w-full md:w-[40%] bg-[#1a0a10]/95 backdrop-blur-xl border-l border-white/10 text-white p-8 md:p-12 z-10 flex flex-col justify-center"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-3 text-white/60">
                      Featured Campaign
                    </p>
                    <h2 className="text-4xl md:text-5xl text-white font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {offer.title || 'Your Offer Title Here'}
                    </h2>
                    <div className="mb-8">
                      <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap text-white/80">
                        {offer.description || 'Provide a compelling description for your offer to attract customers.'}
                      </p>
                      <div className="flex items-center gap-3 mt-6">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                          Valid Till: {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="w-full md:w-1/2 bg-white text-black p-8 md:p-12 flex flex-col justify-center">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-3 text-gray-400">
                  Limited Time Offer
                </p>
                <h2 className="text-2xl md:text-3xl text-[#3a081a] font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {offer.title || 'Your Offer Title Here'}
                </h2>
                <div className="mb-8">
                  <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap text-gray-600">
                    {offer.description || 'Provide a compelling description for your offer to attract customers.'}
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded font-bold text-lg tracking-wider border border-red-100">
                      {getDiscountText()}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Valid Till: {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <button 
                    type="button"
                    onClick={handleClaim}
                    className="w-full py-3 bg-[#3a081a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2a0512] transition-colors shadow-lg shadow-[#3a081a]/20"
                  >
                    Claim Discount
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Success Notification Modal (Preview) */}
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
