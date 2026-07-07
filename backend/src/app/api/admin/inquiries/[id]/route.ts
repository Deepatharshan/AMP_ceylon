import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { z } from 'zod'

const inquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed'])
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json()
    const { status } = inquiryStatusSchema.parse(json)
    
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', params.id)
      
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}
