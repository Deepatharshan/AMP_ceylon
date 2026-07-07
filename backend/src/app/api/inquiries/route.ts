import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { inquirySchema } from '@/lib/validations'
import { sendInquiryNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = inquirySchema.parse(json)
    
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('submit_inquiry', {
      p_customer_name: body.customer_name,
      p_company_name: body.company_name || null,
      p_email: body.email,
      p_phone: body.phone || null,
      p_country: body.country || null,
      p_message: body.message || null,
      p_items: body.items.length > 0 ? body.items : null,
    })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    
    try {
      await sendInquiryNotification(body, body.items)
    } catch (emailError) {
      console.error('Failed to send notification email', emailError)
    }

    return NextResponse.json({ id: data, success: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}
