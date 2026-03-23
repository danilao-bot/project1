import Link from 'next/link';

export default function LecturerGrid({ assistants }: { assistants: any[] }) {
  if (assistants.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No lecturers or assistants found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assistants.map((assistant) => (
        <Link
          key={assistant.id}
          href={`/submit?supervisor_id=${assistant.supervisor_id}&assistant_id=${assistant.id}`}
          className="group block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {assistant.supervisor.name}
              </h3>
              <p className="text-sm font-medium text-gray-600 mt-1">
                Assistant: {assistant.name}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                {assistant.supervisor.specialization}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
