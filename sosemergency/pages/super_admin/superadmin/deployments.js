import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@headlessui/react';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newDeployment, setNewDeployment] = useState({
    name: 'Fire Rescue Operation',
    status: 'Active',
    location: 'Building 3, Floor 4',
    start_time: new Date().toISOString().slice(0, 16), // default to current date and time
  });

  const headers = ['Deployment Name', 'Status', 'Location', 'Start Time'];

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await fetch('/api/deployments'); // 👈 This is the fetch
        const data = await response.json();
        setDeployments(Array.isArray(data) ? data : []); // Safe check to avoid `.map` error
      } catch (error) {
        console.error('Error fetching deployments:', error);
      }
    };
    fetchDeployments();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDeployment.name || !newDeployment.location || !newDeployment.start_time) return;

    try {
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeployment),
      });

      const data = await response.json();

      if (response.ok) {
        setDeployments((prev) => [...prev, data]);
        setNewDeployment({ name: '', status: 'Active', location: '', start_time: '' });
        setIsOpen(false);
      } else {
        alert(data.error || 'Failed to add deployment');
      }
    } catch (error) {
      console.error('Error adding deployment:', error);
      alert('Failed to add deployment');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Deployments</h1>
      <p className="mb-6">Manage active and past rescue deployments from this panel.</p>

      <Button onClick={() => setIsOpen(true)}>Add Deployment</Button>

      <div className="mt-6 overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-2 text-left font-medium text-sm text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deployments.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">{item.location}</td>
                <td className="px-4 py-2">{item.start_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Add New Deployment</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Deployment Name"
                value={newDeployment.name}
                onChange={(e) => setNewDeployment({ ...newDeployment, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <select
                value={newDeployment.status}
                onChange={(e) => setNewDeployment({ ...newDeployment, status: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={newDeployment.location}
                onChange={(e) => setNewDeployment({ ...newDeployment, location: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="datetime-local"
                value={newDeployment.start_time}
                onChange={(e) => setNewDeployment({ ...newDeployment, start_time: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">Add Deployment</Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
