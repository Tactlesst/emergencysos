import { useState, useEffect } from 'react';

const Header = ({ user, onLogout, onHamburgerClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (showNotifications) {
      fetch('/api/alerts/notifications')
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch((err) => console.error('Error loading alerts:', err));
    }
  }, [showNotifications]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white relative shadow-md">
      <button onClick={onHamburgerClick} className="text-2xl font-bold">
        ☰
      </button>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative focus:outline-none text-xl"
          >
            🔔
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50">
              <div className="p-3 border-b font-semibold bg-gray-100">Recent Alerts</div>
              <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <li className="p-3 text-sm text-gray-500">No alerts available.</li>
                ) : (
                  notifications.map((alert) => (
                    <li key={alert.id} className="p-3 text-sm">
                      <strong className="text-red-600">{alert.alert_type}</strong> at{' '}
                      <span className="font-medium">{alert.location}</span>
                      <div className="text-xs text-gray-500">{alert.time}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <span>Welcome, {user.firstName}</span>
        <button onClick={onLogout} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
