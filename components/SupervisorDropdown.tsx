'use client';

import { Supervisor } from '@/types';

interface Props {
  supervisors: Supervisor[];
  selectedSupervisor: string;
  onChange: (supervisorId: string) => void;
  disabled?: boolean;
}

export default function SupervisorDropdown({ supervisors, selectedSupervisor, onChange, disabled }: Props) {
  return (
    <div>
      <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
        Main Supervisor
      </label>
      <select
        id="supervisor"
        name="supervisor"
        required
        disabled={disabled}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border bg-white disabled:bg-gray-100 disabled:text-gray-500"
        value={selectedSupervisor}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>Select a Supervisor</option>
        {supervisors.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.specialization}
          </option>
        ))}
      </select>
    </div>
  );
}
