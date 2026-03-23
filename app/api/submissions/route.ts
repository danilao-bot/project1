import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Verify admin session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const supervisorId = searchParams.get('supervisor') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('submissions')
    .select(`
      *,
      supervisor:supervisors(name),
      assistant:assistants(name)
    `, { count: 'exact' });

  if (search) {
    query = query.or(`student_name.ilike.%${search}%,matric_number.ilike.%${search}%`);
  }

  if (supervisorId) {
    query = query.eq('supervisor_id', supervisorId);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // Check if portal is open
  const { data: settings } = await supabase
    .from('system_settings')
    .select('portal_open')
    .single();

  if (!settings?.portal_open) {
    return NextResponse.json(
      { error: 'The supervisor selection portal is currently closed.' },
      { status: 403 }
    );
  }

  const { student_name, matric_number, supervisor_id, assistant_id } = await request.json();

  if (!student_name || !matric_number || !supervisor_id || !assistant_id) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // Check duplicate matric
  const { data: existingUser } = await supabase
    .from('submissions')
    .select('id')
    .eq('matric_number', matric_number)
    .single();

  if (existingUser) {
    return NextResponse.json(
      { error: 'This matric number has already submitted. Please contact your lecturer if there is an issue.' },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert([{ student_name, matric_number, supervisor_id, assistant_id }])
    .select(`
      *,
      supervisor:supervisors(name),
      assistant:assistants(name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
