'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveProduct } from './actions';

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

export default function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, isPending] = useActionState(saveProduct, null);

  const defaultProduct = {
    id: '',
    name: '',
    description: '',
    sku: '',
    category: 'Floral Arrangements',
    price: 0,
    materials: [],
    colors: [],
    is_top_seller: false,
    is_new_collection: false,
    is_limited_product: false,
    image_url: '',
  };

  const data = product || defaultProduct;

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

      {state?.success === false && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {state.message}
        </div>
      )}

      <form action={formAction} className="flex flex-col lg:flex-row gap-8">
        {/* Hidden inputs */}
        {data.id && <input type="hidden" name="id" value={data.id} />}

        {/* Left Form Column */}
        <div className="flex-1 space-y-6 bg-white p-6 border border-[#ececec] rounded shadow-sm">
          <h3 className="text-sm font-bold text-[#3a081a] uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
            Product Details
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={data.name}
              required
              className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
              placeholder="e.g., Majestic Orchid 'Silk Series'"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={data.description}
              rows={5}
              required
              className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
              placeholder="Describe the botanical features, artistry, and export grade..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                defaultValue={data.sku}
                required
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                placeholder="FL-ROSE-001"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Category
              </label>
              <select
                name="category"
                defaultValue={data.category}
                required
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full bg-white cursor-pointer"
              >
                <option value="Floral Arrangements">Floral Arrangements</option>
                <option value="Acrylic Flowers">Acrylic Flowers</option>
                <option value="Plants & Foliage">Plants & Foliage</option>
                <option value="Candles & Scent">Candles & Scent</option>
                <option value="Rattan & Woven">Rattan & Woven</option>
                <option value="Holiday Decor">Holiday Decor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Price (USD)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                defaultValue={data.price}
                required
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                placeholder="4.50"
              />
            </div>
          </div>

          {/* Specifications */}
          <h3 className="text-sm font-bold text-[#3a081a] uppercase tracking-wider border-b border-gray-100 pb-2 pt-4 mb-4">
            Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Materials Used (comma separated)
              </label>
              <input
                type="text"
                name="materials"
                defaultValue={data.materials?.join(', ')}
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                placeholder="Premium Silk, Hand-painted Polymer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Colors Available (comma separated)
              </label>
              <input
                type="text"
                name="colors"
                defaultValue={data.colors?.join(', ')}
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                placeholder="Crimson, Pure White, Coral Pink"
              />
            </div>
          </div>

          {/* Banners & Visibility */}
          <h3 className="text-sm font-bold text-[#3a081a] uppercase tracking-wider border-b border-gray-100 pb-2 pt-4 mb-4">
            Banners & Visibility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="is_top_seller" 
                defaultChecked={data.is_top_seller}
                className="accent-[#3a081a] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold text-gray-800">Top Seller</p>
                <p className="text-[10px] text-gray-500">Highlight in main catalog</p>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-gray-50 p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="is_new_collection" 
                defaultChecked={data.is_new_collection}
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
                defaultChecked={data.is_limited_product}
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
            <h3 className="text-sm font-bold text-[#3a081a] uppercase tracking-wider border-b border-gray-100 pb-2">
              Primary Image URL
            </h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Image Source Link
              </label>
              <input
                type="url"
                name="image_url"
                defaultValue={data.image_url}
                required
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] text-black w-full"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="aspect-square bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center relative overflow-hidden">
              {data.image_url ? (
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.image_url}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center p-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-xs text-gray-500">Image preview will show here once URL is loaded</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#3a081a] text-white py-3 rounded font-bold text-sm hover:bg-[#4a0b22] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? 'Saving...' : 'SAVE PRODUCT ✓'}
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
    </div>
  );
}
