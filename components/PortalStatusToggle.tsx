'use client';

import { useState, useEffect } from 'react';

export default function PortalStatusToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal-status')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.portal_open === 'boolean') {
          setIsOpen(data.portal_open);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch portal status', err);
        setLoading(false);
      });
  }, []);

  const toggleStatus = async () => {
    const newStatus = !isOpen;
    if (!confirm(`Are you sure you want to ${newStatus ? 'OPEN' : 'CLOSE'} the portal?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/portal-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal_open: newStatus }),
      });
      if (res.ok) {
        setIsOpen(newStatus);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading status...</div>;

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
      <span className="text-sm font-medium text-gray-700">Portal Status:</span>
      <span className={`px-2 py-1 rounded text-sm font-bold ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isOpen ? 'OPEN' : 'CLOSED'}
      </span>
      <button
        onClick={toggleStatus}
        className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Toggle
      </button>
    </div>
  );
}
