import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const mockStations = [
  {
    id: 1,
    name: 'Fire Station Alpha',
    type: 'fire',
    position: [8.7400, 124.7750],
    vehicles: 3,
    respondents: 10,
    deployedVehicles: 1,
    deployedRespondents: 2,
  },
  {
    id: 2,
    name: 'Police Station Beta',
    type: 'police',
    position: [8.7450, 124.7800],
    vehicles: 2,
    respondents: 8,
    deployedVehicles: 0,
    deployedRespondents: 0,
  },
  {
    id: 3,
    name: 'Emergency Station Gamma',
    type: 'emergency',
    position: [8.7420, 124.7780],
    vehicles: 4,
    respondents: 12,
    deployedVehicles: 2,
    deployedRespondents: 5,
  },
  {
    id: 4,
    name: 'MDDRMO Station Delta',
    type: 'mddrmo',
    position: [8.7430, 124.7790],
    vehicles: 5,
    respondents: 15,
    deployedVehicles: 3,
    deployedRespondents: 6,
  },
];

// Dynamic import for StationMap (make sure to implement this correctly in `superadmin/StationMap`)
const DynamicStationMap = dynamic(() => import('../superadmin/StationMap'), {
  ssr: false,
  loading: () => <p className="text-center w-full">Loading map...</p>,
});

export default function ManageStationsPage() {
  const [activeTab, setActiveTab] = useState('MAP');
  const [selectedStation, setSelectedStation] = useState(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications] = useState(3); // Static notification count
  const [notificationList] = useState([
    'New vehicle deployed at Fire Station Alpha',
    'Police Station Beta: 2 respondents dispatched',
    'Emergency Station Gamma: Request for backup',
  ]);

  const initialPosition = useMemo(() => [8.7422, 124.7776], []);
  const initialZoom = 14;
  const vehiclePosition = [8.7410, 124.7760]; // Example vehicle position

  const toggleNotifications = () => setNotificationsVisible(prev => !prev);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 🔴 Header */}
      <header className="flex items-center justify-between bg-red-600 text-white px-4 py-2 shadow-md">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">MANAGE STATIONS</h1>
        <div className="relative">
          <button onClick={toggleNotifications} className="text-xl">
            🔔
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {notifications}
            </span>
          )}
          {notificationsVisible && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-2 w-48 max-h-60 overflow-y-auto z-10">
              <h3 className="font-medium mb-2">Notifications</h3>
              <ul className="text-sm text-gray-700">
                {notificationList.map((notification, index) => (
                  <li key={index} className="py-1 px-2 border-b">
                    {notification}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Controls */}
      <div className="bg-gray-100 px-4 py-2 flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="flex space-x-2">
          {['MAP', 'LIST', 'DEPLOYMENT', 'TASKS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-md font-medium ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-white border text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'MAP' && (
          <div className="text-sm text-gray-600 self-center sm:self-auto">
            {mockStations.length} Station(s) on Map
          </div>
        )}
      </div>

      {/* Main area with optional side panel */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Main tab content */}
        <main className={`flex-1 overflow-y-auto p-4 ${selectedStation ? 'w-2/3' : 'w-full'}`}>
          {activeTab === 'MAP' && (
            <div className="h-[500px] w-full rounded overflow-hidden">
              <DynamicStationMap
                stations={mockStations}
                center={selectedStation ? selectedStation.position : initialPosition}
                zoom={initialZoom}
                onStationSelect={setSelectedStation}
                vehiclePosition={vehiclePosition} // Passing vehicle position
              />
            </div>
          )}

          {activeTab === 'LIST' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Station List</h2>
              <ul className="bg-white rounded border divide-y">
                {mockStations.map(station => (
                  <li key={station.id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-600">Vehicles: {station.vehicles}, Respondents: {station.respondents}</p>
                    </div>
                    <button
                      onClick={() => setSelectedStation(station)}
                      className="text-red-600 hover:underline"
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'DEPLOYMENT' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Deployment Overview</h2>
              <p>Total Deployed Vehicles: {mockStations.reduce((sum, s) => sum + s.deployedVehicles, 0)}</p>
              <p>Total Deployed Respondents: {mockStations.reduce((sum, s) => sum + s.deployedRespondents, 0)}</p>
              <h3 className="mt-4 font-medium">Deployment by Station:</h3>
              <ul className="mt-2 space-y-1">
                {mockStations.map(station => (
                  <li key={station.id}>
                    {station.name}: Vehicles - {station.deployedVehicles}/{station.vehicles}, Respondents - {station.deployedRespondents}/{station.respondents}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'TASKS' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Station Tasks</h2>
              <p>Task management for stations...</p>
            </div>
          )}
        </main>

        {/* Right: Station Details */}
        {selectedStation && (
          <aside className="w-1/3 bg-gray-100 border-l overflow-y-auto p-4">
            <h2 className="text-lg font-semibold">Station Details</h2>
            <h3 className="font-medium mt-2">{selectedStation.name}</h3>
            <p>Vehicles: {selectedStation.vehicles} (Deployed: {selectedStation.deployedVehicles})</p>
            <p>Respondents: {selectedStation.respondents} (Deployed: {selectedStation.deployedRespondents})</p>

            <h3 className="mt-4 font-medium">Send Message</h3>
            <textarea className="w-full border rounded p-2 mb-2" placeholder="Enter message..." />
            <button className="bg-red-600 text-white px-4 py-2 rounded">Send Message</button>
            <button onClick={() => setSelectedStation(null)} className="mt-2 text-gray-600 block">Close Details</button>
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-center text-sm py-2">
        <p>©</p>
      </footer>
    </div>
  );
}
