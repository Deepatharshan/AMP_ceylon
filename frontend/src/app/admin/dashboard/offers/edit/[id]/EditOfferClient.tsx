'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { CloudUpload } from 'lucide-react';
import { updateOffer } from '../../actions';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRouter } from 'next/navigation';
import PreviewModal from '../../PreviewModal';

export default function EditOfferClient({ initialOffer }: { initialOffer: any }) {
  const [isActive, setIsActive] = useState(initialOffer.is_active);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(initialOffer.target_regions || ['Global']);
  
  // Cropper State
  const [imgSrc, setImgSrc] = useState<string>(''); // For newly selected local image
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [showPreview, setShowPreview] = useState(false);
  const [previewOffer, setPreviewOffer] = useState<any>(null);

  // We only show cropper for NEW images. If they don't upload a new image, we just keep the old URL.
  // The existing image is shown if no new image is selected.
  const displayImage = imgSrc || initialOffer.image_url;

  const toggleRegion = (region: string) => {
    if (region === 'Global') {
      setSelectedRegions(['Global']);
      return;
    }
    
    setSelectedRegions(prev => {
      const withoutGlobal = prev.filter(r => r !== 'Global');
      if (withoutGlobal.includes(region)) {
        const newRegions = withoutGlobal.filter(r => r !== region);
        return newRegions.length === 0 ? ['Global'] : newRegions;
      }
      return [...withoutGlobal, region];
    });
  };

  const regions = ['Global', 'Europe', 'North America', 'East Asia', 'Middle East'];

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); 
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 3 / 4, width, height),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    formData.set('isActive', isActive.toString());
    formData.delete('targetRegions'); 
    selectedRegions.forEach(r => formData.append('targetRegions', r));

    // Append cropped image if a NEW image was selected and cropped
    if (imgSrc && completedCrop && imgRef.current) {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      if (croppedBlob) {
        formData.set('image', croppedBlob, 'offer_banner.jpg');
      }
    } else {
      // Remove any dummy file from the input if they didn't upload/crop one
      formData.delete('image');
    }

    try {
      await updateOffer(initialOffer.id, formData);
      router.push('/admin/dashboard/offers');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Failed to update offer. Please check console for details.');
    }
  };

  const handlePreview = async () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    let imageUrl = displayImage; 
    if (imgSrc && completedCrop && imgRef.current) {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      if (croppedBlob) {
        imageUrl = URL.createObjectURL(croppedBlob);
      }
    }

    setPreviewOffer({
      title: formData.get('title'),
      description: formData.get('description'),
      code: initialOffer.code,
      image_url: imageUrl,
      type: initialOffer.type,
    });
    setShowPreview(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#fcfbf9]">
      <div className="bg-[#fcfbf9] px-8 pt-6 pb-2">
        <div className="flex items-center text-xs text-gray-500 mb-6 font-medium">
          <Link href="/admin/dashboard" className="hover:text-[#3a081a]">AMP Ceylon</Link>
          <span className="mx-2">/</span>
          <Link href="/admin/dashboard/offers" className="hover:text-[#3a081a]">Offers</Link>
          <span className="mx-2">/</span>
          <span className="text-[#3a081a]">Edit {initialOffer.type === 'CAMPAIGN' ? 'Campaign' : 'Offer'}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Edit {initialOffer.type === 'CAMPAIGN' ? 'Campaign' : 'Offer'}: {initialOffer.title}
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mb-8">
          Update the {initialOffer.type === 'CAMPAIGN' ? 'marketing campaign' : 'promotional offer'} details.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="px-8 pb-12 max-w-5xl flex flex-col gap-12">
        
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 border-t border-[#ececec] pt-8">
          <div>
            <h3 className="text-lg font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Basic Details</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">Core identity and description of the promotional offer.</p>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Offer Title</label>
              <input 
                type="text" 
                name="title"
                defaultValue={initialOffer.title}
                required
                className="w-full px-4 py-3 bg-white border border-[#ececec] rounded outline-none focus:border-[#3a081a] text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                name="description"
                rows={4}
                defaultValue={initialOffer.description}
                required
                className="w-full px-4 py-3 bg-white border border-[#ececec] rounded outline-none focus:border-[#3a081a] text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Pricing & Validity */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 border-t border-[#ececec] pt-8">
          <div>
            <h3 className="text-lg font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{initialOffer.type === 'CAMPAIGN' ? 'Validity' : 'Pricing & Validity'}</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{initialOffer.type === 'CAMPAIGN' ? 'Set the active duration of this campaign.' : 'Set the financial parameters and duration of the promotion.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {initialOffer.type !== 'CAMPAIGN' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Discount Type</label>
                  <select name="discountType" defaultValue={initialOffer.discount_type} className="w-full px-4 py-3 bg-white border border-[#ececec] rounded outline-none focus:border-[#3a081a] text-sm">
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Value</label>
                  <input 
                    type="number" 
                    name="discountValue"
                    defaultValue={initialOffer.discount_value}
                    required
                    className="w-full px-4 py-3 bg-white border border-[#ececec] rounded outline-none focus:border-[#3a081a] text-sm"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Valid From</label>
              <input 
                type="date" 
                name="validFrom"
                defaultValue={initialOffer.valid_from ? initialOffer.valid_from.split('T')[0] : ''}
                className="w-full px-4 py-3 bg-white border border-[#ececec] rounded outline-none focus:border-[#3a081a] text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Valid To</label>
              <input 
                type="date" 
                name="validTo"
                defaultValue={initialOffer.valid_to ? initialOffer.valid_to.split('T')[0] : ''}
                className="w-full px-4 py-3 bg-white border border-[#ececec] rounded outline-none focus:border-[#3a081a] text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Offer Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 border-t border-[#ececec] pt-8">
          <div>
            <h3 className="text-lg font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Offer Imagery</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">Upload and crop a high-resolution banner. Leave empty to keep the existing image.</p>
          </div>
          <div className="flex flex-col gap-4">
            
            {!imgSrc && (
              <div className="flex flex-col gap-4">
                 <div className="bg-gray-100 rounded-lg p-2 max-w-xs border border-[#ececec]">
                   <img src={displayImage} alt="Current Offer" className="w-full h-auto object-cover rounded" />
                 </div>
                 <label className="border-2 border-dashed border-[#ececec] bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[#f4e6ea] text-[#3a081a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <CloudUpload size={20} />
                  </div>
                  <p className="text-sm font-bold text-[#333] mb-1">Upload New Image</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">SVG, PNG, JPG (max. 10MB)</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onSelectFile}
                  />
                </label>
              </div>
            )}

            {imgSrc && (
              <div className="flex flex-col gap-4">
                <div className="bg-gray-50 p-4 border border-[#ececec] rounded-lg">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    className="max-h-[500px] w-auto mx-auto object-contain"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      className="max-h-[500px]"
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Drag to adjust the cropping area.</p>
                  <button 
                    type="button" 
                    onClick={() => { setImgSrc(''); setCrop(undefined); setCompletedCrop(null); }}
                    className="text-xs font-bold text-[#3a081a] uppercase tracking-widest underline decoration-[#3a081a]/30 underline-offset-4 hover:decoration-[#3a081a]"
                  >
                    Cancel Edit
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Targeting */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 border-t border-[#ececec] pt-8">
          <div>
            <h3 className="text-lg font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Targeting</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">Define which regions or segments can access this promotion.</p>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Target Regions</label>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className={`px-4 py-2 text-xs rounded border transition-colors ${
                      selectedRegions.includes(region)
                        ? 'bg-[#3a081a] text-white border-[#3a081a]'
                        : 'bg-white text-gray-600 border-[#ececec] hover:border-gray-300'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-[#ececec] rounded-lg p-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#333] mb-1">Visibility Status</h4>
                <p className="text-xs text-gray-500">When active, the offer is immediately visible to target clients.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${isActive ? 'bg-[#3a081a]' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-[#ececec] mt-4">
          <Link 
            href="/admin/dashboard/offers"
            className="px-6 py-3 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-transparent"
          >
            Cancel
          </Link>
          <button 
            type="button"
            onClick={handlePreview}
            className="px-8 py-3 rounded text-sm font-medium border border-[#3a081a] text-[#3a081a] hover:bg-[#f4e6ea] transition-colors"
          >
            Preview
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#3a081a] text-white px-8 py-3 rounded text-sm font-medium transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2a0512]'}`}
          >
            {isSubmitting ? 'Saving...' : `Update ${initialOffer.type === 'CAMPAIGN' ? 'Campaign' : 'Offer'}`}
          </button>
        </div>

      </form>

      {showPreview && previewOffer && (
        <PreviewModal 
          offer={previewOffer} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}
