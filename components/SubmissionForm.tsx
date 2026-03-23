'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Supervisor, Assistant } from '@/types';
import SupervisorDropdown from './SupervisorDropdown';
import AssistantDropdown from './AssistantDropdown';

export default function SubmissionForm() {
  const searchParams = useSearchParams();
  const querySupervisorId = searchParams.get('supervisor_id') || '';
  const queryAssistantId = searchParams.get('assistant_id') || '';

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(querySupervisorId);
  const [selectedAssistant, setSelectedAssistant] = useState(queryAssistantId);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  // Keep fields read-only if they were passed via query params
  const isSupervisorFixed = !!querySupervisorId;
  const isAssistantFixed = !!queryAssistantId;

  useEffect(() => {
    // Fetch supervisors on load
    fetch('/api/supervisors')
      .then((res) => res.json())
      .then((data) => setSupervisors(data.data || []))
      .catch((err) => console.error('Failed to load supervisors', err));
  }, []);

  useEffect(() => {
    // Fetch assistants when supervisor changes
    if (selectedSupervisor) {
      // Only reset assistant if it wasn't pre-filled by the URL
      if (!isAssistantFixed || (isAssistantFixed && selectedAssistant !== queryAssistantId)) {
        setSelectedAssistant('');
      }
      fetch(`/api/assistants?supervisor_id=${selectedSupervisor}`)
        .then((res) => res.json())
        .then((data) => setAssistants(data.data || []))
        .catch((err) => console.error('Failed to load assistants', err));
    } else {
      setAssistants([]);
    }
  }, [selectedSupervisor, isAssistantFixed, queryAssistantId, selectedAssistant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!fullName || !matricNumber || !selectedSupervisor || !selectedAssistant) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // Check duplicate
      const checkRes = await fetch('/api/check-matric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matric_number: matricNumber }),
      });
      const checkData = await checkRes.json();
      
      if (checkData.exists) {
        setError('This matric number has already submitted. Please contact your lecturer if there is an issue.');
        setLoading(false);
        return;
      }

      // Submit form
      const submitRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: fullName,
          matric_number: matricNumber,
          supervisor_id: selectedSupervisor,
          assistant_id: selectedAssistant,
        }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        setError(submitData.error || 'Failed to submit the form.');
        setLoading(false);
        return;
      }

      // Success!
      setSuccessData(submitData.data);
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 max-w-lg w-full mx-auto shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Submission Successful</h2>
        <p className="mb-4 text-center">Your selection has been safely saved in the system.</p>
        
        <div className="bg-white p-4 rounded-md shadow-sm space-y-2">
          <p><span className="font-semibold">Name:</span> {successData.student_name}</p>
          <p><span className="font-semibold">Matric Number:</span> {successData.matric_number}</p>
          <p><span className="font-semibold">Supervisor:</span> {successData.supervisor?.name}</p>
          <p><span className="font-semibold">Assistant:</span> {successData.assistant?.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Final Year Project Supervisor Selection Portal
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Select your supervisor and assistant carefully. Each matric number can submit only once.
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SupervisorDropdown
          supervisors={supervisors}
          selectedSupervisor={selectedSupervisor}
          onChange={setSelectedSupervisor}
          disabled={loading || isSupervisorFixed}
        />

        <AssistantDropdown
          assistants={assistants}
          selectedAssistant={selectedAssistant}
          onChange={setSelectedAssistant}
          disabled={loading || !selectedSupervisor || isAssistantFixed}
        />

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            required
            disabled={loading}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700">
            Matric Number
          </label>
          <input
            type="text"
            id="matricNumber"
            required
            disabled={loading}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            placeholder="e.g. 19/0001"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
          />
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Warning:</strong> You can only submit once. Ensure your details and selections are correct before submitting.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Selection'}
        </button>
      </form>
    </div>
  );
}
