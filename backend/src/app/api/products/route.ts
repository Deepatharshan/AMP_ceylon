import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit
  
  const category = searchParams.get('category')
  const season = searchParams.get('season')
  const search = searchParams.get('search')
  const badge = searchParams.get('badge')

  const selectStr = badge 
    ? '*, product_variants(*), product_badges!inner(badge_id, badges(*)), seasons(*)'
    : '*, product_variants(*), product_badges(badges(*)), seasons(*)'
    
  const supabase = await createClient()
  let query = supabase.from('products')
    .select(selectStr, { count: 'exact' })
    .eq('is_active', true)
  
  if (category) query = query.eq('category_id', category)
  if (season) query = query.eq('season_id', season)
  if (search) query = query.ilike('name', `%${search}%`)
  if (badge) query = query.eq('product_badges.badge_id', badge)
  
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ data, count, page, limit })
}
