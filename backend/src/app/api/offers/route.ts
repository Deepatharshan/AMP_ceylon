import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get('region')

  const selectStr = region 
    ? '*, offer_regions!inner(regions(*))'
    : '*, offer_regions(regions(*))'

  const supabase = await createClient()
  let query = supabase.from('offers')
    .select(selectStr)
    .eq('is_active', true)
    .lte('valid_from', new Date().toISOString().split('T')[0])
    .gte('valid_until', new Date().toISOString().split('T')[0])
  
  if (region) {
    query = query.eq('offer_regions.region_id', region)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
