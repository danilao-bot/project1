import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

// 🟢 Get an assistant by ID (with optional supervisor fields)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Nested select for supervisor if you want the related record too
    const { data, error } = await supabase
      .from('assistants')
      .select('id, name, supervisor_id, supervisors (name, specialization)')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// 🔄 Update an assistant by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, supervisor_id } = body;
    const id = params.id;

    const { data, error } = await supabase
      .from('assistants')
      .update({ name, supervisor_id })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// ❌ Delete an assistant by ID (and related submissions)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // First delete linked student submissions
    const { error: subError } = await supabase
      .from('submissions')
      .delete()
      .eq('assistant_id', id);

    if (subError) throw new Error(subError.message);

    // Then delete the assistant itself
    const { error: assistError } = await supabase
      .from('assistants')
      .delete()
      .eq('id', id);

    if (assistError) throw new Error(assistError.message);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}