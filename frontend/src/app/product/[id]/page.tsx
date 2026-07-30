'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  image_url?: string;
  image_urls?: string[];
  category: string;
  price: number;
  size?: string;
  materials?: string[];
  colors?: string[];
  is_top_seller?: boolean;
  is_new_collection?: boolean;
  is_limited_product?: boolean;
  stock_count?: number;
}

const formatArrayForDisplay = (field: any): string => {
  if (Array.isArray(field)) {
    return field.join(', ');
  }
  if (typeof field === 'string') {
    let trimmed = field.trim();
    while (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        } else if (typeof parsed === 'string') {
          trimmed = parsed.trim();
        } else {
          break;
        }
      } catch (e) {
        trimmed = trimmed
          .substring(1, trimmed.length - 1)
          .split(',')
          .map(s => s.replace(/["']/g, '').trim())
          .join(', ');
        return trimmed;
      }
    }
    return trimmed;
  }
  return '';
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery and options state
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('Standard Desktop (45cm H x 30cm W)');
  const [selectedColor, setSelectedColor] = useState('Classic Ivory');
  const [quantity, setQuantity] = useState(100);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      try {
        const supabase = createClient();
        
        // Fetch current product
        const { data: prod, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (prod) {
          const parseArray = (field: any): string[] => {
            if (Array.isArray(field)) return field;
            if (typeof field === 'string') {
              let trimmed = field.trim();
              while (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try {
                  const parsed = JSON.parse(trimmed);
                  if (Array.isArray(parsed)) return parsed;
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
                    .filter(Boolean);
                }
              }
              return trimmed.split(',').map(s => s.trim()).filter(Boolean);
            }
            return [];
          };

          prod.materials = parseArray(prod.materials);
          prod.colors = parseArray(prod.colors);

          setProduct(prod);
          if (prod.size) {
            setSelectedSize(prod.size);
          }
          
          // Set active image
          const urls = prod.image_urls || (prod.image_url ? [prod.image_url] : []);
          setActiveImage(urls[0] || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop');

          // Fetch related products (same category, up to 4 items)
          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category', prod.category)
            .neq('id', id)
            .limit(4);

          if (related) {
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [id]);

  const handleAddToInquiry = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('inquiry_cart') || '[]');
    const exists = cart.find((item: any) => item.id === product.id);

    if (exists) {
      exists.quantity = (exists.quantity || 1) + quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        image_url: activeImage,
        category: product.category,
        description: product.description,
        quantity: quantity
      });
    }

    localStorage.setItem('inquiry_cart', JSON.stringify(cart));
    
    // Dispatch event to update navbar shopping bag count
    window.dispatchEvent(new Event('cart-updated'));

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] text-[#333] flex flex-col justify-between">
        <div className="bg-[#3a081a] h-32 w-full relative">
          <Navbar />
        </div>
        <div className="py-40 text-center text-gray-500 animate-pulse font-medium">Loading botanical details...</div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] text-[#333] flex flex-col justify-between">
        <div className="bg-[#3a081a] h-32 w-full relative">
          <Navbar />
        </div>
        <div className="py-40 text-center text-gray-500 font-medium">Product not found.</div>
        <Footer />
      </main>
    );
  }

  const allImages = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : (product.image_url ? [product.image_url] : ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop']);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#333]">
      <div className="bg-transparent w-full relative" style={{ height: 'calc(8rem + var(--banner-height, 0px))' }}>
        <Navbar />
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-8 uppercase tracking-widest font-semibold">
          <Link href="/collections" className="hover:underline">Catalog</Link>
          <span>&gt;</span>
          <span className="hover:underline">{product.category}</span>
          <span>&gt;</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2 flex gap-4">
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-3 w-20 shrink-0">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`aspect-square w-full bg-white border rounded overflow-hidden relative cursor-pointer ${
                      activeImage === imgUrl ? 'border-[#3a081a] ring-1 ring-[#3a081a]' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Display */}
            <div className="flex-1 aspect-[4/5] bg-white border border-gray-200 rounded overflow-hidden relative shadow-sm group">
              <img src={activeImage} alt={product.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.is_top_seller && (
                  <span className="bg-[#3a081a] text-[#f5ebd3] text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm">
                    Top Seller
                  </span>
                )}
                {product.is_new_collection && (
                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm">
                    New Collection
                  </span>
                )}
                {product.is_limited_product && (
                  <span className="bg-amber-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm">
                    Limited Edition
                  </span>
                )}
                <span className="bg-white text-gray-800 text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded shadow-sm border border-gray-100">
                  Export Grade
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: details */}
          <div className="w-full lg:w-1/2 space-y-6 text-left">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</span>
              <h1 className="text-4xl text-[#3a081a] mt-1 mb-2 font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>
                {product.name}
              </h1>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">SKU: {product.sku}</p>
            </div>

            {/* Size/Arrangement selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Size / Arrangement</label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="px-4 py-2 text-xs border border-gray-300 bg-white rounded focus:outline-none focus:border-[#3a081a] text-black w-full cursor-pointer"
              >
                <option>{product.size || 'Standard Size'}</option>
              </select>
            </div>

            {/* Color selection circles */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Color Base Finish</label>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 border text-xs font-medium rounded transition-all cursor-pointer ${
                        selectedColor === color 
                          ? 'border-[#3a081a] bg-[#3a081a] text-white' 
                          : 'border-gray-300 text-gray-600 hover:border-gray-500 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quote text / description */}
            <div className="space-y-4 pt-2">
              <p className="italic text-gray-600 text-sm leading-relaxed border-l-2 border-[#f5ebd3] pl-4">
                "{product.description || "Premium botanical arrangement handcrafted for export quality and high-grade aesthetic durability."}"
              </p>
            </div>

            {/* Add to Inquiry action */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-4">
                {/* Wholesale Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded overflow-hidden h-12 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 10))}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 font-bold transition-colors cursor-pointer text-gray-500 border-r border-gray-200"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-16 h-full text-center text-xs font-bold text-gray-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 10)}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 font-bold transition-colors cursor-pointer text-gray-500 border-l border-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToInquiry}
                  disabled={added}
                  className="flex-1 bg-[#3a081a] hover:bg-[#4a0b22] text-white h-12 rounded text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-green-700"
                >
                  <ShoppingBag size={14} />
                  {added ? 'ADDED TO INQUIRY ✓' : 'ADD TO INQUIRY'}
                </button>
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-semibold pt-1">
                <span>Minimum Order Qty: 12 Units</span>
                <span>Global Export Ready</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#3a081a]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div>
                  <span className="font-bold block text-[10px] uppercase text-[#3a081a] tracking-wider">ISO CERTIFIED</span>
                  Manufacturing Grade
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#3a081a]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                <div>
                  <span className="font-bold block text-[10px] uppercase text-[#3a081a] tracking-wider">FDA TEXTILE</span>
                  100% Recyclable Silk
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mb-20 text-left">
          <h3 className="text-lg font-bold text-[#3a081a] uppercase tracking-wider mb-6 border-b border-gray-100 pb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border border-[#ececec] rounded bg-white p-6 md:p-8">
            <table className="w-full text-xs text-gray-600">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-semibold uppercase tracking-wider text-gray-400 w-1/3">Size (Dimensions)</td>
                  <td className="py-4 text-gray-800 font-medium">{product.size || 'Standard Size'}</td>
                </tr>
                <tr className="border-b border-gray-100 last:border-0 text-left">
                  <td className="py-4 font-semibold uppercase tracking-wider text-gray-400 w-1/3">Materials Used</td>
                  <td className="py-4 text-gray-800 font-medium">
                    {Array.isArray(product.materials)
                      ? product.materials.join(', ')
                      : (typeof product.materials === 'string' ? product.materials : 'Premium Botanical Blends')}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-xs text-gray-600">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-semibold uppercase tracking-wider text-gray-400 w-1/3">Units Available</td>
                  <td className="py-4 text-gray-800 font-medium">{product.stock_count !== undefined ? `${product.stock_count} Units` : '0 Units'}</td>
                </tr>
                <tr className="border-b border-gray-100 last:border-0 text-left">
                  <td className="py-4 font-semibold uppercase tracking-wider text-gray-400 w-1/3">Colors Available</td>
                  <td className="py-4 text-gray-800 font-medium">
                    {Array.isArray(product.colors)
                      ? product.colors.join(', ')
                      : (typeof product.colors === 'string' ? product.colors : 'Standard Finishes')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Collections */}
        {relatedProducts.length > 0 && (
          <div className="text-left mb-12">
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-[#3a081a] uppercase tracking-wider" style={{ fontFamily: 'var(--font-playfair)' }}>
                Related Collections
              </h3>
              <Link href="/collections" className="text-xs text-gray-500 hover:text-[#3a081a] hover:underline font-semibold uppercase tracking-wider">
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link 
                  href={`/product/${p.id}`}
                  key={p.id}
                  className="group flex flex-col bg-white border border-[#ececec] p-3 rounded shadow-sm hover:shadow transition-shadow"
                >
                  <div className="aspect-square bg-gray-50 border border-gray-100 rounded overflow-hidden relative mb-4">
                    <img src={p.image_url} alt={p.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-102" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>{p.name}</h4>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mt-1">SKU: {p.sku}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </main>
  );
}
