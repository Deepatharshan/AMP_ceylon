'use client';

import { useState } from 'react';
import { Eye, Edit2, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteOffer } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PreviewModal from './PreviewModal';

export default function OfferActionsDropdown({ offer }: { offer: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      await deleteOffer(offer.id);
    } catch (error) {
      console.error(error);
      alert('Failed to delete offer.');
      setIsDeleting(false);
    }
  };

  const handleView = () => {
    setShowPreview(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleView}
        title="View Offer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <Eye size={16} />
      </button>

        <Link 
          href={`/admin/dashboard/offers/edit/${offer.id}`}
          title="Edit Offer"
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#3a081a] hover:bg-gray-100 transition-colors"
        >
          <Edit2 size={16} />
        </Link>

        <button 
          onClick={handleDeleteClick}
          title="Delete Offer"
          disabled={isDeleting}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin text-red-600" /> : <Trash2 size={16} />}
        </button>
      </div>

      {showPreview && (
        <PreviewModal 
          offer={offer} 
          onClose={() => setShowPreview(false)} 
        />
      )}

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-center text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Delete Offer?</h3>
                <p className="text-sm text-center text-gray-500 mb-6">
                  Are you sure you want to permanently delete this offer? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
