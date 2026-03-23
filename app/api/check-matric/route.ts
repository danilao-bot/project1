import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { matric_number } = await request.json();

  if (!matric_number) {
    return NextResponse.json({ error: 'Matric number is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('id')
    .eq('matric_number', matric_number)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exists: !!data });
}
