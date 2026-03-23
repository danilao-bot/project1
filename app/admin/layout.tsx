import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="text-lg font-semibold text-white">
                Admin Portal
              </Link>
              <nav className="ml-8 flex space-x-2">
                <Link
                  href="/admin/dashboard"
                  className="text-white/70 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/supervisors"
                  className="text-white/70 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition"
                >
                  Supervisors
                </Link>
                <Link
                  href="/admin/assistants"
                  className="text-white/70 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition"
                >
                  Assistants
                </Link>
              </nav>
            </div>
            <div>
              <Link
                href="/admin/login"
                className="text-white/70 hover:text-white px-3 py-2 rounded-full text-sm font-medium transition"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
