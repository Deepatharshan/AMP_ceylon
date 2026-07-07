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
  const imageUrl = formData.get('image_url') as string
  
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
