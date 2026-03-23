import * as XLSX from 'xlsx';
import { Submission } from '@/types';

export const exportToExcel = (submissions: Submission[], filename = 'submissions.xlsx') => {
  const data = submissions.map((sub) => ({
    Name: sub.student_name,
    'Matric Number': sub.matric_number,
    Supervisor: sub.supervisor?.name || 'Unknown',
    Assistant: sub.assistant?.name || 'Unknown',
    'Submission Time': new Date(sub.created_at).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

  XLSX.writeFile(workbook, filename);
};
