'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProduct(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const sku = formData.get('sku') as string
  const category = formData.get('category') as string
  const price = parseFloat(formData.get('price') as string || '0')
  
  const stockCount = parseInt(formData.get('stock_count') as string || '0', 10)
  const activeCount = parseInt(formData.get('active_count') as string || '0', 10)
  const size = formData.get('size') as string || ''
  const market = formData.get('market') as string || 'Both'

  const imageUrlsRaw = formData.get('image_urls') as string || ''
  const imageUrls = imageUrlsRaw ? imageUrlsRaw.split(',').map(u => u.trim()).filter(Boolean) : []
  const imageUrl = imageUrls[0] || ''

  // Materials and colors might be submitted as arrays or lists
  const materialsRaw = formData.get('materials') as string
  const materials = materialsRaw ? materialsRaw.split(',').map(m => m.trim()).filter(Boolean) : []

  const colorsRaw = formData.get('colors') as string
  const colors = colorsRaw ? colorsRaw.split(',').map(c => c.trim()).filter(Boolean) : []

  const isTopSeller = formData.get('is_top_seller') === 'on'
  const isNewCollection = formData.get('is_new_collection') === 'on'
  const isLimitedProduct = formData.get('is_limited_product') === 'on'

  const productData = {
    name,
    description,
    sku,
    category,
    price,
    materials,
    colors,
    is_top_seller: isTopSeller,
    is_new_collection: isNewCollection,
    is_limited_product: isLimitedProduct,
    image_url: imageUrl,
    image_urls: imageUrls,
    stock_count: stockCount,
    active_count: activeCount,
    size,
    market,
  }

  let error;
  if (id) {
    const res = await supabase.from('products').update(productData).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('products').insert([productData])
    error = res.error
  }

  if (error) {
    console.error('Database error:', error)
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/dashboard/catalog')
  revalidatePath('/collections')
  
  // Return redirect details to be handled on client side or simply redirect
  redirect('/admin/dashboard/catalog')
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', productId)

  if (error) {
    console.error('Delete error:', error)
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/dashboard/catalog')
  revalidatePath('/collections')
  return { success: true }
}

export async function lookupBarcode(code: string) {
  // 1. Try to fetch from company LAN API if configured
  const lanApiUrl = process.env.COMPANY_API_URL; // e.g. http://192.168.1.15:5000
  if (lanApiUrl) {
    try {
      // Set a 3 second timeout for the LAN connection so it doesn't hang if offline
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const normalizedCode = code.trim();
      // Prevent path traversal and enforce valid barcode characters (including slash and space)
      if (normalizedCode.includes('..') || !/^[A-Za-z0-9._/ -]{1,128}$/.test(normalizedCode)) {
        return { success: false, message: 'Invalid barcode format' };
      }
      
      const requestUrl = new URL(`/products/${encodeURIComponent(normalizedCode)}`, lanApiUrl);
      const res = await fetch(requestUrl.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          source: 'company_system',
          data: {
            name: data.name || '',
            description: data.description || '',
            sku: data.sku || code,
            size: data.size || '',
            materials: Array.isArray(data.materials) ? data.materials : (data.materials ? data.materials.split(',') : []),
            colors: Array.isArray(data.colors) ? data.colors : (data.colors ? data.colors.split(',') : []),
            price: data.price || 0,
            category: data.category || 'Floral Arrangements',
            market: data.market || 'Both',
            image_urls: data.image_urls || []
          }
        };
      }
    } catch (err) {
      console.warn('LAN API fetch failed, falling back:', err);
    }
  }

  // 2. Try to fetch from your own Supabase database (in case it was imported)
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('products').select('*').eq('sku', code).single();
    if (data && !error) {
      return {
        success: true,
        source: 'supabase',
        data
      };
    }
  } catch (err) {
    console.warn('Supabase lookup failed:', err);
  }

  // 3. Fallback to mock data for testing
  if (code === 'Y01AZAU01/SP E40025G') {
    return {
      success: true,
      source: 'mock',
      data: {
        name: 'Autumn Arr in Half Moon Handle Basket',
        description: 'Autumn Arrangement in Half Moon Handle Basket (HM/WRK/HB/07) 27X15X16.5CM H. Made in Sri Lanka. 6 pc/box, 18 pcs/ctn. 4.68 CFT. MOQ 288 PCS/COLOR. PLAYSMART.',
        sku: 'Y01AZAU01/SP E40025G',
        size: '27X15X16.5CM H',
        materials: ['Premium Silk', 'Rattan Woven', 'Hand-painted Polymer'],
        colors: ['Autumn GR/91+RO/171+RO/172'],
        price: 12.50,
        category: 'Rattan & Woven',
        market: 'Export Market',
        image_urls: [
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop'
        ]
      }
    };
  }

  return { success: false, message: 'Barcode not found in database or local LAN server.' };
}
