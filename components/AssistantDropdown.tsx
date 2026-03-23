'use client';

import { Assistant } from '@/types';

interface Props {
  assistants: Assistant[];
  selectedAssistant: string;
  onChange: (assistantId: string) => void;
  disabled?: boolean;
}

export default function AssistantDropdown({ assistants, selectedAssistant, onChange, disabled }: Props) {
  return (
    <div>
      <label htmlFor="assistant" className="block text-sm font-medium text-gray-700">
        Assistant
      </label>
      <select
        id="assistant"
        name="assistant"
        required
        disabled={disabled || assistants.length === 0}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border bg-white disabled:bg-gray-100 disabled:text-gray-500"
        value={selectedAssistant}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {assistants.length === 0 ? 'Select a supervisor first' : 'Select an Assistant'}
        </option>
        {assistants.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  );
}
