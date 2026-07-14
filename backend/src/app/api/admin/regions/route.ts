import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { regionSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from('regions').select('*').order('name', { ascending: true })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = regionSchema.parse(json)
    
    const supabase = await createAdminClient()
    const { data, error } = await supabase.from('regions').insert(body).select().single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.issues || err.message }, { status: 400 })
  }
}
