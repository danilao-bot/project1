import AdminTable from '@/components/AdminTable';
import PortalStatusToggle from '@/components/PortalStatusToggle';
import ExportExcelButton from '@/components/ExportExcelButton';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <PortalStatusToggle />
          <ExportExcelButton />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Student Submissions</h2>
        <AdminTable />
      </div>
    </div>
  );
}
