'use client';

import { useState, useEffect } from 'react';
import { Supervisor } from '@/types';

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', specialization: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    setLoading(true);
    const res = await fetch('/api/supervisors');
    const data = await res.json();
    if (res.ok) {
      setSupervisors(data.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/supervisors/${editingId}` : '/api/supervisors';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', specialization: '' });
      setEditingId(null);
      fetchSupervisors();
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to save supervisor');
    }
  };

  const handleEdit = (supervisor: Supervisor) => {
    setEditingId(supervisor.id);
    setFormData({ name: supervisor.name, specialization: supervisor.specialization });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deleting this supervisor will automatically delete all linked assistants and student submissions. Proceed?')) return;

    const res = await fetch(`/api/supervisors/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchSupervisors();
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to delete supervisor');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Supervisor Management</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">{editingId ? 'Edit' : 'Add'} Supervisor</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Dr Musa"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              required
              placeholder="e.g., Artificial Intelligence"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
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
                  setFormData({ name: '', specialization: '' });
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : supervisors.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center">No supervisors found.</td></tr>
            ) : (
              supervisors.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
