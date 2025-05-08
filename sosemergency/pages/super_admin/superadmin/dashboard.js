import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
  });

  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/alerts/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/alerts/recent');
        const data = await res.json();
        setRecentAlerts(data);
      } catch (err) {
        console.error('Failed to fetch recent alerts:', err);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
      <p className="mb-6 text-gray-600">Quick summary of emergency system alerts and activity.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-500">
          <h2 className="text-sm text-gray-500">Total Alerts</h2>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-yellow-500">
          <h2 className="text-sm text-gray-500">Active Alerts</h2>
          <p className="text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-green-500">
          <h2 className="text-sm text-gray-500">Resolved Alerts</h2>
          <p className="text-2xl font-semibold">{stats.resolved}</p>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
        {recentAlerts.length === 0 ? (
          <p className="text-gray-500">No recent alerts available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentAlerts.map((alert) => (
              <li key={alert.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <strong className="text-red-600">{alert.alert_type}</strong> at{' '}
                    <span className="font-medium">{alert.location}</span>
                  </div>
                  <div className="text-sm text-gray-500">{alert.time}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
