'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Assistant, Supervisor } from '@/types';

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', supervisor_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssistants();
    fetchSupervisors();
  }, []);

  const fetchAssistants = async () => {
    setLoading(true);
    const res = await fetch('/api/assistants');
    const data = await res.json();
    if (res.ok) {
      setAssistants(data.data);
    }
    setLoading(false);
  };

  const fetchSupervisors = async () => {
    const res = await fetch('/api/supervisors');
    const data = await res.json();
    if (res.ok) {
      setSupervisors(data.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/assistants/${editingId}` : '/api/assistants';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', supervisor_id: '' });
      setEditingId(null);
      fetchAssistants();
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to save assistant');
    }
  };

  const handleEdit = (assistant: Assistant) => {
    setEditingId(assistant.id);
    setFormData({ name: assistant.name, supervisor_id: assistant.supervisor_id });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deleting this assistant will automatically delete all linked student submissions. Proceed?')) return;

    const res = await fetch(`/api/assistants/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchAssistants();
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to delete assistant');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Assistant Management</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">{editingId ? 'Edit' : 'Add'} Assistant</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Mr Ade"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700">Supervisor</label>
            <select
              required
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.supervisor_id}
              onChange={(e) => setFormData({ ...formData, supervisor_id: e.target.value })}
            >
              <option value="" disabled>Select Supervisor</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.id}>{s.name} - {s.specialization}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', supervisor_id: '' });
                }}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assistant Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : assistants.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">No assistants found.</td></tr>
            ) : (
              assistants.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{a.supervisor?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
