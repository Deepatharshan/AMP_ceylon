import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { offerSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from('offers').select('*, offer_regions(regions(*))').order('created_at', { ascending: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = offerSchema.parse(json)
    
    const supabase = await createAdminClient()
    const { data, error } = await supabase.rpc('create_offer_with_regions', {
      p_title: body.title,
      p_description: body.description || null,
      p_image: body.image || null,
      p_discount_percentage: body.discount_percentage || null,
      p_original_price_note: body.original_price_note || null,
      p_valid_from: body.valid_from,
      p_valid_until: body.valid_until,
      p_is_active: body.is_active,
      p_region_ids: body.region_ids.length > 0 ? body.region_ids : null,
    })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}
