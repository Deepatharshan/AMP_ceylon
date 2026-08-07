'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { saveProduct, lookupBarcode } from './actions';
import { createClient } from '@/utils/supabase/client';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ProductPreviewModal from './ProductPreviewModal';

interface Product {
  id?: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  materials: string[];
  colors: string[];
  is_top_seller: boolean;
  is_new_collection: boolean;
  is_limited_product: boolean;
  image_url: string;
}

export default function ProductForm({ product, businessLine = 'FLORAL' }: { product?: Product, businessLine?: string }) {
  // Custom Confirm & Save states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultProduct = {
    id: '',
    name: '',
    description: '',
    sku: '',
    category: '',
    price: 0,
    materials: [],
    colors: [],
    is_top_seller: false,
    is_new_collection: false,
    is_limited_product: false,
    image_url: '',
  };

  const data = product || defaultProduct;
  
  // Controlled form states
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [sku, setSku] = useState(data.sku);
  const [category, setCategory] = useState(data.category);
  const [price, setPrice] = useState(data.price ? String(data.price) : '0');
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string }[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function loadCategories() {
      let query = supabase
        .from('categories')
        .select('id, name');
        
      if (businessLine === 'FLORAL') {
        query = query.or('business_line.eq.FLORAL,business_line.is.null');
      } else {
        query = query.eq('business_line', businessLine);
      }
      
      const { data, error } = await query.order('name', { ascending: true });

      if (data && data.length > 0) {
        setDbCategories(data);
      }
    }
    loadCategories();
  }, []);
  
  const parseArrayToCommaString = (field: any): string => {
    if (Array.isArray(field)) return field.join(', ');
    if (typeof field === 'string') {
      let trimmed = field.trim();
      while (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.join(', ');
          if (typeof parsed === 'string') {
            trimmed = parsed.trim();
          } else {
            break;
          }
        } catch (e) {
          return trimmed
            .substring(1, trimmed.length - 1)
            .split(',')
            .map(s => s.replace(/["']/g, '').trim())
            .filter(Boolean)
            .join(', ');
        }
      }
      return trimmed;
    }
    return '';
  };

  const [materials, setMaterials] = useState(parseArrayToCommaString(data.materials));
  const [colors, setColors] = useState(parseArrayToCommaString(data.colors));
  
  // New fields
  const [stockCount, setStockCount] = useState((product as any)?.stock_count !== undefined ? String((product as any).stock_count) : '0');
  const [activeCount, setActiveCount] = useState((product as any)?.active_count !== undefined ? String((product as any).active_count) : '0');
  const [size, setSize] = useState((product as any)?.size || '');
  const [market, setMarket] = useState((product as any)?.market || 'Both');

  // Checkbox Visibility States
  const [isTopSeller, setIsTopSeller] = useState(!!data.is_top_seller);
  const [isNewCollection, setIsNewCollection] = useState(!!data.is_new_collection);
  const [isLimitedProduct, setIsLimitedProduct] = useState(!!data.is_limited_product);

  // Multi-image upload states (up to 4 slots)
  const [imageUrls, setImageUrls] = useState<string[]>(
    (product as any)?.image_urls || (data.image_url ? [data.image_url] : [])
  );
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  
  // Crop & Preview States
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Barcode search state
  const [barcode, setBarcode] = useState('');
  const [showScanner, setShowScanner] = useState(true);

  const handleBarcodeLookup = async () => {
    if (!barcode.trim()) return;

    try {
      const res = await lookupBarcode(barcode.trim());
      if (res.success && res.data) {
        const prod = res.data;
        setName(prod.name || '');
        setDescription(prod.description || '');
        setSku(prod.sku || barcode.trim());
        setCategory(prod.category || 'Floral Arrangements');
        setPrice(prod.price ? String(prod.price) : '0');
        
        setSize(prod.size || '');
        setMarket(prod.market || 'Both');
        
        const mats = Array.isArray(prod.materials) ? prod.materials.join(', ') : (prod.materials || '');
        setMaterials(mats);
        
        const cols = Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || '');
        setColors(cols);

        setIsTopSeller(!!prod.is_top_seller);
        setIsNewCollection(!!prod.is_new_collection);
        setIsLimitedProduct(!!prod.is_limited_product);

        if (prod.image_urls && prod.image_urls.length > 0) {
          setImageUrls(prod.image_urls);
        } else if (prod.image_url) {
          setImageUrls([prod.image_url]);
        }
        showToast('Barcode scanned successfully.');
      } else {
        showToast(res.message || 'Barcode not found. Feel free to type details manually.', 'error');
      }
    } catch (err) {
      console.error('Error looking up barcode:', err);
      showToast('Network or local connection error. Feel free to type details manually.', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(slotIndex);
    setUploadError('');

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImageSrc(reader.result?.toString() || null);
      setCrop(undefined);
      setCompletedCrop(null);
    });
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 4 / 5, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.95
      );
    });
  };

  useEffect(() => {
    if (completedCrop && completedCrop.width && completedCrop.height && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pixelRatio = window.devicePixelRatio || 1;
      const targetWidth = crop.width * scaleX;
      const targetHeight = crop.height * scaleY;
      
      canvas.width = targetWidth * pixelRatio;
      canvas.height = targetHeight * pixelRatio;
      
      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        targetWidth,
        targetHeight
      );
    }
  }, [completedCrop]);

  const handleCropCompleteAndUpload = async () => {
    if (uploadingIndex === null || !completedCrop || !imgRef.current) return;

    const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
    if (!croppedBlob) return;

    try {
      const supabase = createClient();
      
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
      const filePath = `products/${fileName}`;

      const { error: err } = await supabase.storage
        .from('product-images')
        .upload(filePath, croppedBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (err) throw err;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const updatedUrls = [...imageUrls];
      updatedUrls[uploadingIndex] = publicUrl;
      setImageUrls(updatedUrls);
      showToast('Image cropped and uploaded successfully!');
      setCropImageSrc(null);
      setCompletedCrop(null);
      setCrop(undefined);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploadingIndex(null);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);

    try {
      // 1. Identify which fields were changed
      const changedFields: string[] = [];
      const orig = product || defaultProduct;

      if (name !== orig.name) changedFields.push('PRODUCT NAME');
      if (description !== orig.description) changedFields.push('DESCRIPTION');
      if (category !== orig.category) changedFields.push('CATEGORY');
      if (parseFloat(price) !== orig.price) changedFields.push('PRICE');
      if (market !== (orig as any).market) changedFields.push('TARGET MARKET');
      if (parseInt(stockCount, 10) !== (orig as any).stock_count) changedFields.push('TOTAL STOCK COUNT');
      if (parseInt(activeCount, 10) !== (orig as any).active_count) changedFields.push('ACTIVE STOCK COUNT');
      if (sku !== orig.sku) changedFields.push('ITEM CODE / SKU');
      if (size !== (orig as any).size) changedFields.push('SIZE (DIMENSIONS)');
      
      const origMaterialsStr = Array.isArray(orig.materials) ? orig.materials.join(', ') : (orig.materials || '');
      if (materials !== origMaterialsStr) changedFields.push('MATERIALS USED');

      const origColorsStr = Array.isArray(orig.colors) ? orig.colors.join(', ') : (orig.colors || '');
      if (colors !== origColorsStr) changedFields.push('COLORS AVAILABLE');

      const origImageUrls = (orig as any).image_urls || (orig.image_url ? [orig.image_url] : []);
      if (imageUrls.filter(Boolean).join(',') !== origImageUrls.filter(Boolean).join(',')) {
        changedFields.push('GALLERY IMAGES');
      }

      if (isTopSeller !== !!orig.is_top_seller) changedFields.push('TOP SELLER BANNER');
      if (isNewCollection !== !!orig.is_new_collection) changedFields.push('NEW COLLECTION BANNER');
      if (isLimitedProduct !== !!orig.is_limited_product) changedFields.push('LIMITED PRODUCT BANNER');

      const formData = new FormData();
      if (data.id) formData.append('id', data.id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('sku', sku);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock_count', stockCount);
      formData.append('active_count', activeCount);
      formData.append('size', size);
      formData.append('market', market);
      formData.append('business_line', businessLine);
      formData.append('materials', materials);
      formData.append('colors', colors);
      formData.append('image_urls', imageUrls.filter(Boolean).join(','));

      // Include visibility defaults
      formData.append('is_top_seller', isTopSeller ? 'on' : 'off');
      formData.append('is_new_collection', isNewCollection ? 'on' : 'off');
      formData.append('is_limited_product', isLimitedProduct ? 'on' : 'off');

      // 3. Call server action
      const res = await saveProduct(null, formData);

      if (res && res.success === false) {
        showToast(res.message || 'Failed to save product.', 'error');
      } else {
        // Show success toast detailing what was modified
        const listStr = changedFields.length > 0 ? changedFields.join(', ') : 'No modifications';
        showToast(`Successfully saved! Updated fields: ${listStr}`, 'success');
        
        // Wait 3 seconds to let them see the toast, then redirect!
        setTimeout(() => {
          window.location.href = '/admin/dashboard/catalog';
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      showToast(err.message || 'An error occurred while saving.', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-6 uppercase tracking-wider">
        <Link href="/admin/dashboard/catalog" className="hover:underline">Catalog</Link>
        <span>&gt;</span>
        <span className="text-[#3a081a] font-bold">
          {product?.id ? 'Edit Inventory Entry' : 'New Inventory Entry'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Hidden inputs */}
        {data.id && <input type="hidden" name="id" value={data.id} />}

        {/* Left Form Column */}
        <div className="flex-1 space-y-6">
          {/* Barcode Scanner Simulator */}
          {showScanner ? (
            <div className="bg-[#fcfbf9] p-4 border border-dashed border-gray-300 rounded flex flex-col md:flex-row items-center justify-between gap-4 relative">
              <button
                type="button"
                onClick={() => setShowScanner(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Hide Barcode Scanner"
              >
                ✕
              </button>
              
              <div className="flex-1">
                <label className="text-xs font-bold text-[#3a081a] uppercase tracking-wider block mb-1">
                  Barcode Scanner Integration
                </label>
                <p className="text-[10px] text-gray-500">
                  Scan a barcode or enter it below to auto-populate product details.
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0 pr-4 md:pr-0">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevents saving the product prematurely
                      handleBarcodeLookup();
                    }
                  }}
                  placeholder="e.g., Y01AZAU01/SP E40025G"
                  className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full md:w-60 bg-white"
                />
                <button
                  type="button"
                  onClick={handleBarcodeLookup}
                  className="bg-[#3a081a] hover:bg-[#4a0b22] text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  Scan Barcode
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="text-xs text-[#3a081a] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                Show Barcode Scanner
              </button>
            </div>
          )}

          <div className="bg-white p-6 border border-[#ececec] rounded shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#3a081a] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              PRODUCT DETAILS
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                PRODUCT NAME
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                placeholder="e.g., Majestic Orchid 'Silk Series'"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                placeholder="Describe the botanical features, artistry, and export grade..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  CATEGORY
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white cursor-pointer"
                >
                  <option value="" disabled>Select a category</option>
                  {dbCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  PRICE (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  TARGET MARKET
                </label>
                <select
                  name="market"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white cursor-pointer"
                >
                  <option value="Export Market">Export Market</option>
                  <option value="Local Market">Local Market</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#ececec] rounded shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#3a081a] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              INVENTORY & TRACKING
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  TOTAL STOCK COUNT
                </label>
                <input
                  type="number"
                  name="stock_count"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  ACTIVE STOCK COUNT
                </label>
                <input
                  type="number"
                  name="active_count"
                  value={activeCount}
                  onChange={(e) => setActiveCount(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#ececec] rounded shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#3a081a] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              SPECIFICATIONS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  ITEM CODE / BARCODE SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="e.g. Y01AZAU01/SP E40025G"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  SIZE (DIMENSIONS)
                </label>
                <input
                  type="text"
                  name="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="e.g., 27X15X16.5CM H"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  MATERIALS USED (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  name="materials"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="Premium Silk, Hand-painted Po"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  COLORS AVAILABLE (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  name="colors"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white"
                  placeholder="Crimson, Pure White, Coral Pin"
                />
              </div>
            </div>
          </div>

          {/* Banners & Visibility */}
          <h3 className="text-base font-bold text-[#3a081a] uppercase tracking-widest border-b border-gray-100 pb-2 pt-4 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            BANNERS & VISIBILITY
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="is_top_seller" 
                checked={isTopSeller}
                onChange={(e) => setIsTopSeller(e.target.checked)}
                className="accent-[#3a081a] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold text-gray-800">Top Seller / Home Page</p>
                <p className="text-[10px] text-gray-500">Showcase 6 products on Home</p>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="is_new_collection" 
                checked={isNewCollection}
                onChange={(e) => setIsNewCollection(e.target.checked)}
                className="accent-[#3a081a] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold text-gray-800">New Collection</p>
                <p className="text-[10px] text-gray-500">Badge for first 30 days</p>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="is_limited_product" 
                checked={isLimitedProduct}
                onChange={(e) => setIsLimitedProduct(e.target.checked)}
                className="accent-[#3a081a] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold text-gray-800">Limited Product</p>
                <p className="text-[10px] text-gray-500">Seasonal availability label</p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Gallery Column */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 border border-[#ececec] rounded shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#3a081a] uppercase tracking-widest border-b border-gray-100 pb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              GALLERY DISPLAY
            </h3>

            {/* Main Display Preview */}
            <div className="aspect-square bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center relative overflow-hidden">
              {imageUrls.filter(Boolean)[0] ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageUrls.filter(Boolean)[0]}
                    alt="Primary Preview"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#3a081a]/80 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Primary Display
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-xs text-gray-500">Upload photos to view display</p>
                </div>
              )}
            </div>

            {/* Inline Cropper */}
            {cropImageSrc && uploadingIndex !== null && (
              <div className="bg-gray-50 p-4 border border-[#ececec] rounded shadow-sm mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-[#3a081a]">Crop Image (Slot {uploadingIndex + 1})</h4>
                  <button 
                    type="button"
                    onClick={() => {
                      setCropImageSrc(null);
                      setUploadingIndex(null);
                      setCrop(undefined);
                      setCompletedCrop(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="bg-white border border-[#ececec] rounded-lg p-2 mb-4 overflow-hidden flex justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    className="max-h-[400px] w-auto mx-auto object-contain"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={cropImageSrc}
                      className="max-h-[400px]"
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>

                {!!completedCrop && (
                  <div className="mb-4 flex flex-col items-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Live Preview</p>
                    <div className="border border-gray-200 rounded shadow-sm overflow-hidden bg-white">
                      <canvas
                        ref={previewCanvasRef}
                        style={{
                          objectFit: 'contain',
                          width: Math.round(completedCrop?.width ?? 0),
                          height: Math.round(completedCrop?.height ?? 0),
                          maxWidth: '100px',
                          maxHeight: '125px', // 4:5 ratio roughly
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Drag to adjust the 4:5 cropping area.</p>
                  <button 
                    type="button" 
                    onClick={handleCropCompleteAndUpload}
                    className="bg-[#3a081a] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#4a0b22] transition-colors shadow-sm cursor-pointer"
                  >
                    Crop & Upload
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Upload Slots */}
            <div className={`space-y-4 ${cropImageSrc ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block">
                Gallery Photos (1-4 Photos)
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((index) => {
                  const url = imageUrls[index];
                  const isUploading = uploadingIndex === index;
                  
                  return (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="aspect-square bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center relative overflow-hidden group">
                        {url ? (
                          <div className="relative w-full h-full">
                            <img
                              src={url}
                              alt={`Slot ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedUrls = [...imageUrls];
                                updatedUrls[index] = '';
                                setImageUrls(updatedUrls.filter(Boolean));
                              }}
                              className="absolute top-1 right-1 bg-white/90 hover:bg-white text-[#3a081a] p-0.5 rounded-full text-[10px] shadow-sm cursor-pointer z-10"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors">
                            {isUploading ? (
                              <div className="w-4 h-4 border-2 border-[#3a081a] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span className="text-[9px] text-gray-400 mt-1 uppercase font-semibold">Slot {index + 1}</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, index)}
                              disabled={uploadingIndex !== null}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Hidden input to pass all urls back as a comma-separated list */}
              <input type="hidden" name="image_urls" value={imageUrls.filter(Boolean).join(',')} />
              
              {uploadError && (
                <p className="text-[10px] text-red-600 font-semibold mt-2">{uploadError}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button 
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-full bg-white border border-[#3a081a] text-[#3a081a] py-3 rounded font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              PREVIEW CUSTOMER VIEW
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-[#3a081a] text-white py-3 rounded font-bold text-sm hover:bg-[#4a0b22] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'SAVE PRODUCT ✓'}
            </button>

            <Link 
              href="/admin/dashboard/catalog"
              className="w-full border border-gray-300 text-gray-600 py-3 rounded font-bold text-sm hover:bg-gray-50 transition-colors block text-center"
            >
              DISCARD
            </Link>
          </div>
        </div>
      </form>
      
      {/* Custom Edit/Save Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-6 text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200 text-xl font-bold">
              ?
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                Confirm Product Changes
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to apply these edits to the inventory database?
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                style={{ color: '#4b5563' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="bg-[#3a081a] hover:bg-[#4a0b22] text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                style={{ color: '#ffffff' }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center gap-3 text-left">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-sm shrink-0 ${
            toast.type === 'success' 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {toast.type === 'success' ? '✓' : '!'}
          </div>
          <div className="flex-1 text-xs text-gray-600 font-medium">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modals */}

      {showPreviewModal && (
        <ProductPreviewModal
          productData={{
            name,
            description,
            sku,
            category,
            price: parseFloat(price) || 0,
            materials,
            colors,
            is_top_seller: isTopSeller,
            is_new_collection: isNewCollection,
            is_limited_product: isLimitedProduct,
            imageUrls,
            size
          }}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}
