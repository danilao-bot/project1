import PortalLanding from '@/components/PortalLanding';
import { createClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  
  const { data: settings } = await supabase
    .from('system_settings')
    .select('portal_open')
    .single();

  if (!settings?.portal_open) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
        <div className="max-w-md w-full sm:mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Portal Closed</h2>
          <p className="text-gray-600">
            The supervisor selection portal is currently closed. Please contact your lecturer for more information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PortalLanding facultyName="Computer Science" />
    </div>
  );
}
