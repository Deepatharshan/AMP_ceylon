import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { productSchema } from '@/lib/validations'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json()
    const body = productSchema.parse(json)
    
    const supabase = await createAdminClient()
    const { error } = await supabase.rpc('update_product_with_relations', {
      p_product_id: params.id,
      p_category_id: body.category_id,
      p_season_id: body.season_id || null,
      p_name: body.name,
      p_product_code: body.product_code,
      p_description: body.description || null,
      p_materials: body.materials || null,
      p_images: body.images,
      p_is_active: body.is_active,
      p_variants: body.variants.length > 0 ? body.variants : null,
      p_badge_ids: body.badge_ids.length > 0 ? body.badge_ids : null,
    })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', params.id)
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
