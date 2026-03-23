import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const supervisorId = searchParams.get('supervisor_id')

    let query = supabase
      .from('assistants')
      .select(`
        id,
        name,
        supervisor_id,
        supervisors (
          name,
          specialization
        )
      `)

    if (supervisorId) {
      query = query.eq('supervisor_id', supervisorId)
    }

    const { data, error } = await query.order('name', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ data })

  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'Unknown server error' },
      { status: 500 }
    )
  }
}


export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, supervisor_id } = await request.json()

    const { data, error } = await supabase
      .from('assistants')
      .insert([{ name, supervisor_id }])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ data })

  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'Unknown server error' },
      { status: 500 }
    )
  }
}