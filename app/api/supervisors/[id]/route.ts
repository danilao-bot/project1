import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, specialization } = await request.json();
  const { id } = await params;

  const { data, error } = await supabase
    .from('supervisors')
    .update({ name, specialization })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // First, explicitly delete all submissions linked to this supervisor
  await supabase.from('submissions').delete().eq('supervisor_id', id);

  // Then, delete associated assistants
  await supabase.from('assistants').delete().eq('supervisor_id', id);

  // Finally, delete the supervisor
  const { error } = await supabase
    .from('supervisors')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
