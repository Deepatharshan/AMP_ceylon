import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { offerSchema } from '@/lib/validations'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json()
    const body = offerSchema.parse(json)
    
    const supabase = await createAdminClient()
    const { error } = await supabase.rpc('update_offer_with_regions', {
      p_offer_id: params.id,
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
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('offers')
    .update({ is_active: false })
    .eq('id', params.id)
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
