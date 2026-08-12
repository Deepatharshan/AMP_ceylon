'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProduct } from './actions';
import { createClient } from '@/utils/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  image_url?: string;
  description?: string;
  size?: string;
  market?: string;
  stock_count?: number;
  active_count?: number;
  materials?: string[];
  colors?: string[];
  is_featured_home?: boolean;
}

const getColorHex = (colorName: string): string => {
  const name = colorName.trim().toLowerCase();
  const colorsMap: Record<string, string> = {
    crimson: '#dc143c',
    'pure white': '#ffffff',
    white: '#ffffff',
    'coral pink': '#f88379',
    coral: '#ff7f50',
    ivory: '#fffff0',
    'classic ivory': '#fffff0',
    gold: '#ffd700',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
    black: '#000000',
    red: '#ff0000',
    rose: '#ff007f',
    pink: '#ffc0cb',
    yellow: '#ffff00',
    green: '#008000',
    blue: '#0000ff',
    orange: '#ffa500',
    purple: '#800080',
    brown: '#a52a2a',
    gray: '#808080',
    grey: '#808080',
  };
  return colorsMap[name] || name;
};

const parseDbArray = (field: any): string[] => {
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

export default function CatalogTable({ initialProducts, businessLine = 'FLORAL' }: { initialProducts: Product[], businessLine?: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  
  // View Details Modal States
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [modalActiveImage, setModalActiveImage] = useState('');
  
  // Custom Confirm & Toast States
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Category Modal & List States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryGroupCode, setNewCategoryGroupCode] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryGroupCode, setEditingCategoryGroupCode] = useState('');

  const supabase = createClient();

  // Load all categories on mount
  useEffect(() => {
    async function loadCategories() {
      let query = supabase
        .from('categories')
        .select('id, name, slug');

      if (businessLine === 'FLORAL') {
        query = query.or('business_line.eq.FLORAL,business_line.is.null');
      } else {
        query = query.eq('business_line', businessLine);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (data) {
        setDbCategories(data);
      }
    }
    loadCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name is required.');
      return;
    }
    if (!newCategoryGroupCode.trim()) {
      setCategoryError('Group Code is required.');
      return;
    }

    const slug = newCategoryGroupCode.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName.trim(), slug, business_line: businessLine }])
      .select();

    if (error) {
      console.error('Failed to create category:', error);
      setCategoryError(error.message || 'Failed to create category.');
    } else {
      showToast('Category created successfully.', 'success');
      setIsCategoryModalOpen(false);
      setNewCategoryName('');
      setNewCategoryGroupCode('');
      setCategoryError(null);
      // Refresh local categories list
      if (data) {
        setDbCategories(prev => [...prev, ...data].sort((a, b) => a.name.localeCompare(b.name)));
      }
    }
  };

  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
    setEditingCategoryGroupCode(cat.slug.toUpperCase());
    setCategoryError(null);
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCategoryName.trim()) {
      setCategoryError('Category name is required.');
      return;
    }
    if (!editingCategoryGroupCode.trim()) {
      setCategoryError('Group Code is required.');
      return;
    }

    const slug = editingCategoryGroupCode.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const { data, error } = await supabase
      .from('categories')
      .update({ name: editingCategoryName.trim(), slug })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Failed to update category:', error);
      setCategoryError(error.message || 'Failed to update category.');
    } else {
      showToast('Category updated successfully.', 'success');
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setEditingCategoryGroupCode('');
      setCategoryError(null);
      
      if (data) {
        setDbCategories(prev => prev.map(c => c.id === id ? data[0] : c).sort((a, b) => a.name.localeCompare(b.name)));
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        setCategoryError(error.message);
      } else {
        showToast('Category deleted successfully.', 'success');
        setDbCategories(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenViewModal = (product: Product) => {
    setViewProduct(product);
    const urls = (product as any).image_urls || (product.image_url ? [product.image_url] : []);
    setModalActiveImage(urls[0] || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop');
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteProduct(deleteConfirmId);
    if (res.success) {
      setProducts(products.filter(p => p.id !== deleteConfirmId));
      showToast('Product successfully deleted.', 'success');
    } else {
      showToast('Failed to delete product: ' + res.message, 'error');
    }
    setDeleteConfirmId(null);
  };

  const handleToggleFeaturedHome = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    
    if (newVal) {
      const currentFeaturedCount = products.filter(p => p.is_featured_home).length;
      if (currentFeaturedCount >= 4) {
        showToast('You can only feature up to 4 items on the home page.', 'error');
        return;
      }
    }

    // Optimistic update
    setProducts(products.map(p => p.id === id ? { ...p, is_featured_home: newVal } : p));
    
    const { error } = await supabase
      .from('products')
      .update({ is_featured_home: newVal })
      .eq('id', id);

    if (error) {
      // Revert on error
      setProducts(products.map(p => p.id === id ? { ...p, is_featured_home: currentVal } : p));
      showToast('Failed to update featured status: ' + error.message, 'error');
    } else {
      showToast(`Product ${newVal ? 'added to' : 'removed from'} home page featured list.`, 'success');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = Array.from(new Set([
    ...products.map(p => p.category),
    ...dbCategories.map(c => c.name)
  ])).sort();

  return (
    <div className="bg-white border border-[#ececec] rounded shadow-sm flex flex-col">
      {/* Search & Filter Toolbar */}
      <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#ececec] bg-gray-50/50">
        <div className="relative w-full md:w-80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search by product name or Item Code..." 
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
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-200 text-gray-600 bg-white rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-[#ececec]">
            <tr>
              <th className="px-6 py-4 font-semibold w-24">Image</th>
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">Item Code</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price (USD)</th>
              <th className="px-6 py-4 font-semibold text-center w-24">Featured</th>
              <th className="px-6 py-4 font-semibold text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
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
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-400 max-w-sm line-clamp-1 mt-0.5" title={product.description}>
                        {product.description}
                      </div>
                    )}
                    {/* Size, market, and stock levels */}
                    <div className="text-[10px] text-gray-400 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                      {product.size && <span>Size: {product.size}</span>}
                      {(product.size || product.market) && <span>•</span>}
                      {product.market && <span>Market: {product.market}</span>}
                      {(product.market || product.stock_count !== undefined) && <span>•</span>}
                      {product.stock_count !== undefined && (
                        <span>Stock: {product.stock_count} (Active: {product.active_count || 0})</span>
                      )}
                    </div>
                    {/* Color circles */}
                    {(() => {
                      const colorsArray = parseDbArray(product.colors);
                      if (colorsArray.length === 0) return null;
                      return (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-gray-400 font-medium">Colors:</span>
                          {colorsArray.map((color, idx) => {
                            const bgHex = getColorHex(color);
                            return (
                              <span 
                                key={idx}
                                className="w-3 h-3 rounded-full border border-gray-300 block shadow-xs shrink-0"
                                style={{ backgroundColor: bgHex }}
                                title={color}
                              />
                            );
                          })}
                        </div>
                      );
                    })()}
                    {/* Materials */}
                    {(() => {
                      const materialsArray = parseDbArray(product.materials);
                      if (materialsArray.length === 0) return null;
                      return (
                        <div className="text-[10px] text-gray-400 mt-1">
                          <span className="font-medium text-gray-500">Materials:</span> {materialsArray.join(', ')}
                        </div>
                      );
                    })()}
                  </td>
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
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleToggleFeaturedHome(product.id, !!product.is_featured_home)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${product.is_featured_home ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        title={product.is_featured_home ? 'Remove from Home Page' : 'Feature on Home Page'}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.is_featured_home ? 'translate-x-4' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      {/* View details button */}
                      <button 
                        onClick={() => handleOpenViewModal(product)}
                        className="p-1 hover:text-[#3a081a] transition-colors cursor-pointer text-gray-400"
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <Link 
                        href={`/admin/dashboard/${businessLine === 'CARTON' ? 'cartons' : 'catalog'}/edit/${product.id}`}
                        className="p-1 hover:text-[#3a081a] transition-colors text-gray-400"
                        title="Edit Product"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </Link>
                      <button 
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1 hover:text-red-600 transition-colors text-gray-400"
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
      <div className="p-4 border-t border-[#ececec] bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 rounded-b gap-4">
        <span>Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Product Details Preview Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#3a081a] text-white p-6 relative">
              <button 
                onClick={() => setViewProduct(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f5ebd3] block mb-1">
                {viewProduct.category} • Inventory Catalog Detail
              </span>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                {viewProduct.name}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8 text-left">
              {/* Left Side: Images Gallery Preview */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="aspect-square bg-gray-50 rounded border border-gray-200 overflow-hidden relative shadow-sm">
                  <img src={modalActiveImage} alt={viewProduct.name} className="object-cover w-full h-full" />
                </div>
                
                {/* Thumbnails list */}
                {(() => {
                  const urls = (viewProduct as any).image_urls || (viewProduct.image_url ? [viewProduct.image_url] : []);
                  if (urls.length <= 1) return null;
                  return (
                    <div className="flex gap-2.5 overflow-x-auto py-1">
                      {urls.map((url: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setModalActiveImage(url)}
                          className={`w-14 h-14 bg-white border rounded overflow-hidden relative cursor-pointer flex-shrink-0 ${
                            modalActiveImage === url ? 'border-[#3a081a] ring-1 ring-[#3a081a]' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img src={url} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Right Side: Specification Details Grid */}
              <div className="w-full md:w-1/2 space-y-5 text-sm text-gray-700">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product Description</h4>
                  <p className="text-xs leading-relaxed text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                    {viewProduct.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Item Code (SKU)</h4>
                    <p className="font-mono font-medium text-gray-900">{viewProduct.sku}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price (USD)</h4>
                    <p className="font-bold text-[#3a081a]">${Number(viewProduct.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Target Market</h4>
                    <p className="font-medium text-gray-900">{viewProduct.market || 'Both'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Size (Dimensions)</h4>
                    <p className="font-medium text-gray-900">{viewProduct.size || 'Standard Size'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Stock</h4>
                    <p className="font-semibold text-gray-900">{viewProduct.stock_count ?? 0} Units</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Active Stock</h4>
                    <p className="font-semibold text-gray-900">{viewProduct.active_count ?? 0} Units</p>
                  </div>
                </div>

                {/* Color swatches */}
                {(() => {
                  const colorsArray = parseDbArray(viewProduct.colors);
                  if (colorsArray.length === 0) return null;
                  return (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Color Base Finishes</h4>
                      <div className="flex flex-wrap gap-2 items-center">
                        {colorsArray.map((color, idx) => {
                          const bgHex = getColorHex(color);
                          return (
                            <div key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-semibold text-gray-600">
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-gray-300 block shadow-xs shrink-0" 
                                style={{ backgroundColor: bgHex }}
                              />
                              {color}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Materials list */}
                {(() => {
                  const materialsArray = parseDbArray(viewProduct.materials);
                  if (materialsArray.length === 0) return null;
                  return (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Materials Handcrafted</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{materialsArray.join(', ')}</p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
              <Link
                href={`/product/${viewProduct.id}`}
                target="_blank"
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors text-center block"
                style={{ color: '#4b5563' }}
              >
                Preview Public Page
              </Link>
              <Link 
                href={`/admin/dashboard/catalog/edit/${viewProduct.id}`}
                onClick={() => setViewProduct(null)}
                className="bg-[#3a081a] hover:bg-[#4a0b22] px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors text-center block"
                style={{ color: '#ffffff' }}
              >
                Edit Product
              </Link>
              <button 
                onClick={() => setViewProduct(null)}
                className="border border-gray-300 hover:bg-gray-100 px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                style={{ color: '#4b5563' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-6 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200 text-xl font-bold">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                Confirm Delete
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to delete this product? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                style={{ color: '#4b5563' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                style={{ color: '#ffffff' }}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-gray-100 rounded-lg shadow-2xl p-4 flex items-center gap-3">
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

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-6 text-left max-h-[90vh] flex flex-col">
            <div>
              <h3 className="text-base font-bold text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Manage Categories
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Add, edit, or delete categories and their unique group codes.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-2 border-t border-b border-gray-100 py-4">
              {dbCategories.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">No custom categories found.</p>
              ) : (
                dbCategories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                    <div>
                      <div className="text-sm font-bold text-gray-800">{cat.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">{cat.slug}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditCategory(cat)}
                        className="text-gray-500 hover:text-[#3a081a] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Category Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acrylic Flowers"
                    value={editingCategoryId ? editingCategoryName : newCategoryName}
                    onChange={(e) => editingCategoryId ? setEditingCategoryName(e.target.value) : setNewCategoryName(e.target.value)}
                    className="border border-gray-200 rounded p-2 text-xs text-black bg-white focus:outline-none focus:border-[#3a081a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Group Code
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. ACRYLIC"
                    value={editingCategoryId ? editingCategoryGroupCode : newCategoryGroupCode}
                    onChange={(e) => editingCategoryId ? setEditingCategoryGroupCode(e.target.value) : setNewCategoryGroupCode(e.target.value)}
                    className="border border-gray-200 rounded p-2 text-xs text-black bg-white focus:outline-none focus:border-[#3a081a]"
                  />
                </div>
              </div>

              {categoryError && (
                <p className="text-xs text-red-500 font-semibold">{categoryError}</p>
              )}

              <div className="flex gap-3 justify-end mt-2">
                 {editingCategoryId && (
                   <button
                     onClick={() => {
                       setEditingCategoryId(null);
                       setEditingCategoryName('');
                       setEditingCategoryGroupCode('');
                       setCategoryError(null);
                     }}
                     className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-gray-600"
                   >
                     Cancel Edit
                   </button>
                 )}
                 <button
                   onClick={() => editingCategoryId ? handleUpdateCategory(editingCategoryId) : handleCreateCategory()}
                   className="bg-[#3a081a] hover:bg-[#4a0b22] text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                   style={{ color: '#ffffff' }}
                 >
                   {editingCategoryId ? 'Update' : 'Create'}
                 </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryError(null);
                  setEditingCategoryId(null);
                }}
                className="border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer text-gray-600"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
