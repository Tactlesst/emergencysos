import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Dialog } from '@headlessui/react';

export default function LiveAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTestAlertOpen, setIsTestAlertOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    alert_type: '',
    location: '',
    status: 'Active',
    time: '',
  });

  const headers = ['Alert Type', 'Location', 'Status', 'Time'];

  useEffect(() => {
    fetchAlerts();
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (res.ok) setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  const playAlertSound = () => {
    const audio = new Audio('/sounds/alert.mp3');
    audio.play();
  };

  const showBrowserNotification = (alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Emergency Alert', {
        body: `${alert.alert_type} reported at ${alert.location}`,
      });
    }
  };

  const handleAddTestAlert = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const testAlert = {
      alert_type: 'Medical',
      location: 'Hall B',
      status: 'Active',
      time: formattedTime,
    };

    setAlerts((prev) => [...prev, testAlert]);
    playAlertSound();
    showBrowserNotification(testAlert);
    setIsTestAlertOpen(true);
  };

  const handleOpenAddAlert = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setNewAlert({
      alert_type: 'Fire',
      location: 'Building A',
      status: 'Active',
      time: formattedTime,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAlert.alert_type || !newAlert.location || !newAlert.time) return;

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert),
      });

      const data = await response.json();

      if (response.ok) {
        setAlerts((prev) => [...prev, newAlert]);
        playAlertSound();
        showBrowserNotification(newAlert);
        setNewAlert({ alert_type: '', location: '', status: 'Active', time: '' });
        setIsOpen(false);
        setIsTestAlertOpen(true);
      } else {
        alert(data.error || 'Failed to add alert');
      }
    } catch (error) {
      console.error('Error adding alert:', error);
      alert('Failed to add alert');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Live Alerts</h1>
        <div className="space-x-2">
          <Button onClick={handleAddTestAlert}>Add Test Alert</Button>
          <Button onClick={handleOpenAddAlert}>Add Alert</Button>
        </div>
      </div>

      <p className="mb-6">Monitor real-time emergency alerts and field activity.</p>
      <Table headers={headers} data={alerts} />

      {/* Add Alert Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Add New Alert</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Alert Type"
                value={newAlert.alert_type}
                onChange={(e) => setNewAlert({ ...newAlert, alert_type: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Time (e.g. 10:45 AM)"
                value={newAlert.time}
                onChange={(e) => setNewAlert({ ...newAlert, time: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Test Alert Modal */}
      <Dialog open={isTestAlertOpen} onClose={() => setIsTestAlertOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-red-600 mb-4">🚨 Test Emergency Alert</Dialog.Title>
            <Dialog.Description className="text-gray-700">
              A test alert has been triggered. This is just a simulation to test the functionality of real-time alerts.
            </Dialog.Description>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsTestAlertOpen(false)}>Close</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
