'use client';

import { useState } from 'react';
import { exportToExcel } from '@/utils/excelExport';

export default function ExportExcelButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/export-excel');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const { data } = await response.json();
      exportToExcel(data, 'students_submissions.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
    >
      {loading ? 'Exporting...' : 'Download Excel'}
    </button>
  );
}
