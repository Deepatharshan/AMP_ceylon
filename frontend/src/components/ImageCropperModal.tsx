'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crop as CropIcon, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onClose: () => void;
}

export default function ImageCropperModal({ imageSrc, onCropComplete, onClose }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const aspect = 4 / 5; // 4:5 detailed product view frame

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      }, 'image/jpeg', 0.95);
    } catch (e) {
      console.error(e);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#111] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        >
          <style>{`
            .reactEasyCrop_CropArea {
              overflow: visible !important;
            }
            .reactEasyCrop_CropArea::after {
              content: "Collection Grid View (1:1) Safe Zone";
              position: absolute;
              top: 50%;
              left: 0;
              right: 0;
              transform: translateY(-50%);
              aspect-ratio: 1 / 1;
              border: 1px dashed rgba(255, 255, 255, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: white;
              background: rgba(0, 0, 0, 0.2);
              pointer-events: none;
              text-align: center;
              padding: 10px;
              box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
            }
          `}</style>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1a1a1a]">
            <div className="flex items-center gap-2 text-white">
              <CropIcon size={18} />
              <h3 className="font-semibold text-sm">Crop Image (4:5 Detailed View)</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cropper Area */}
          <div className="flex-1 relative bg-gray-900">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: 'reactEasyCrop_Container',
                cropAreaClassName: 'reactEasyCrop_CropArea'
              }}
            />
          </div>
          
          <div className="bg-gray-900 px-6 pt-2 pb-4 text-center">
             <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Drag to pan. Use slider to zoom in/out. The outer 4:5 frame is the main product page. The inner 1:1 dashed square is the collections grid.
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 bg-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-4 w-full md:w-1/2">
              <ZoomOut size={18} className="text-gray-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(Number(e.target.value))
                }}
                className="w-full accent-[#3a081a]"
              />
              <ZoomIn size={18} className="text-gray-400" />
            </div>

            <div className="flex gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[#3a081a] text-white text-sm font-bold rounded hover:bg-[#4a0b22] transition-colors shadow-lg"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
