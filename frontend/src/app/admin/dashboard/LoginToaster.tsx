'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function ToasterContent() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      setShow(true);
      // Clean up the URL without a page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] bg-white border border-green-200 shadow-xl rounded-lg overflow-hidden flex"
        >
          <div className="w-2 bg-green-500"></div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Logged in successfully</h4>
              <p className="text-xs text-gray-500">Welcome to the AMP Ceylon Admin Dashboard.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LoginToaster() {
  return (
    <Suspense fallback={null}>
      <ToasterContent />
    </Suspense>
  );
}
