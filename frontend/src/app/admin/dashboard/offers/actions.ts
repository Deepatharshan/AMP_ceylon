'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createOffer(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const discountType = formData.get('discountType') as string | null;
  const discountValueStr = formData.get('discountValue') as string | null;
  const discountValue = discountValueStr ? parseFloat(discountValueStr) : 0;
  const validFrom = formData.get('validFrom') as string;
  const validTo = formData.get('validTo') as string;
  const targetRegions = formData.getAll('targetRegions') as string[];
  const isActive = formData.get('isActive') === 'true';
  const displayOrderStr = formData.get('displayOrder') as string | null;
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr) : 99;

  // Determine the post type (Offer vs Campaign)
  const code = 'NEW-' + Math.floor(Math.random() * 10000);
  const type = (formData.get('postType') as string) || 'SEASONAL';
  
  let status = 'Active';
  if (!isActive) status = 'Scheduled';
  const now = new Date();
  if (validTo && new Date(validTo) < now) status = 'Expired';

  let imageUrl = 'https://images.unsplash.com/photo-1563241598-646bc5683794?q=80&w=800&auto=format&fit=crop'; // fallback
  const imageFile = formData.get('image') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('offer-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw new Error('Image upload failed: ' + uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('offer-images')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  const { data, error } = await supabase.from('offers').insert([
    {
      title,
      description,
      code,
      type,
      status,
      discount_type: discountType,
      discount_value: discountValue,
      valid_from: validFrom || null,
      valid_to: validTo || null,
      valid_until: validTo || new Date(Date.now() + 31536000000).toISOString(),
      target_regions: targetRegions,
      is_active: isActive,
      image_url: imageUrl
    }
  ]);

  if (error) {
    console.error('Error creating offer:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard/offers');
  revalidatePath('/', 'layout');
  revalidatePath('/');
}

export async function deleteOffer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('offers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting offer:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard/offers');
  revalidatePath('/', 'layout');
  revalidatePath('/');
}

export async function updateOffer(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const discountType = formData.get('discountType') as string | null;
  const discountValueStr = formData.get('discountValue') as string | null;
  const discountValue = discountValueStr ? Number(discountValueStr) : 0;
  const validFrom = formData.get('validFrom') as string;
  const validTo = formData.get('validTo') as string;
  const targetRegions = formData.getAll('targetRegions') as string[];
  const isActive = formData.get('isActive') === 'true';
  const type = (formData.get('postType') as string) || 'SEASONAL';
  const displayOrderStr = formData.get('displayOrder') as string | null;
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr) : 99;

  let status = 'Active';
  if (!isActive) status = 'Scheduled';
  const now = new Date();
  if (validTo && new Date(validTo) < now) status = 'Expired';

  const imageFile = formData.get('image') as File | null;
  let imageUrl: string | undefined = undefined; // Don't update image unless new one is provided

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('offer-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw new Error('Image upload failed: ' + uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('offer-images')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  const updateData: any = {
    title,
    description,
    status,
    discount_type: discountType,
    discount_value: discountValue,
    valid_from: validFrom || null,
    valid_to: validTo || null,
    valid_until: validTo || new Date(Date.now() + 31536000000).toISOString(),
    target_regions: targetRegions,
    is_active: isActive,
    type
  };

  if (imageUrl) {
    updateData.image_url = imageUrl;
  }

  const { error } = await supabase.from('offers').update(updateData).eq('id', id);

  if (error) {
    console.error('Error updating offer:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/dashboard/offers');
  revalidatePath('/', 'layout');
  revalidatePath('/');
}

export async function getOffer(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('offers').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}
