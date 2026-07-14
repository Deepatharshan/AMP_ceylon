'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProduct } from './actions';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  image_url?: string;
}

export default function CatalogTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Failed to delete product: ' + res.message);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="bg-white border border-[#ececec] rounded shadow-sm flex flex-col">
      {/* Search & Filter Toolbar */}
      <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#ececec] bg-gray-50/50">
        <div className="relative w-full md:w-80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search by product name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-sm w-full bg-white focus:outline-none focus:border-[#3a081a] transition-colors text-black"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 text-xs border border-gray-200 rounded-sm bg-white focus:outline-none focus:border-[#3a081a] text-black w-full md:w-40 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-[#ececec]">
            <tr>
              <th className="px-6 py-4 font-semibold w-24">Image</th>
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price (USD)</th>
              <th className="px-6 py-4 font-semibold text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#ececec] hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <Image 
                          src={product.image_url} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-xs font-mono">{product.sku}</td>
                  <td className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#3a081a]">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Link 
                        href={`/admin/dashboard/catalog/edit/${product.id}`}
                        className="p-1 hover:text-[#3a081a] transition-colors"
                        title="Edit Product"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1 hover:text-red-600 transition-colors"
                        title="Delete Product"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No products found. Add a product to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-[#ececec] bg-gray-50/50 flex justify-between items-center text-xs text-gray-500 rounded-b">
        <span>Showing {filteredProducts.length} of {products.length} results</span>
      </div>
    </div>
  );
}
