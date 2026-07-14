import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { productSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit
  
  const supabase = await createAdminClient()
  let query = supabase.from('products').select('*, product_variants(*), product_badges(badges(*)), seasons(*)', { count: 'exact' })
  
  if (searchParams.get('category')) query = query.eq('category_id', searchParams.get('category'))
  if (searchParams.get('season')) query = query.eq('season_id', searchParams.get('season'))
  if (searchParams.get('status')) query = query.eq('is_active', searchParams.get('status') === 'true')
  
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = productSchema.parse(json)
    
    const supabase = await createAdminClient()
    const { data, error } = await supabase.rpc('create_product_with_relations', {
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
    return NextResponse.json({ id: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}
