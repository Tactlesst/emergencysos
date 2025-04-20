import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const sampleRescues = [
  { id: 1, position: [8.7430, 124.7790], name: 'Fire Emergency - Brgy. Napaliran', severity: 'high', type: 'fire' },
  { id: 2, position: [8.7415, 124.7752], name: 'Crime Scene - Brgy. San Alonzo', severity: 'medium', type: 'crime' },
  { id: 3, position: [8.7445, 124.7815], name: 'Rescue Mission - National Highway', severity: 'low', type: 'rescue' },
  { id: 4, position: [8.7422, 124.7776], name: 'Fire Emergency - Near Town Center', severity: 'medium', type: 'fire' },
  { id: 5, position: [8.7452, 124.7801], name: 'Rescue Mission - Hillside Zone', severity: 'high', type: 'rescue' }
];


export default function ManageRescuesPage() {
  const [activeTab, setActiveTab] = useState('MAP');
  const [selectedSeverity, setSelectedSeverity] = useState('medium');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const DynamicRescueMap = useMemo(() => dynamic(
    () => import('../superadmin/RescueMap.js'),
    {
      loading: () => <p className="text-center w-full">Loading map...</p>,
      ssr: false
    }
  ), []);

  const initialPosition = [8.7422, 124.7776];
  const initialZoom = 15;

  const displayedRescues = useMemo(() => {
    return sampleRescues.filter(rescue =>
      selectedSeverity === 'all' || rescue.severity === selectedSeverity
    );
  }, [selectedSeverity]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <header className="flex items-center justify-between bg-red-600 text-white px-4 py-2 shadow-md">
        <button className="text-xl">☰</button>
        <h1 className="text-lg font-semibold">REPORT ISSUE</h1>
        <button className="text-xl" onClick={toggleSidebar}>🔔</button>
      </header>

      {/* Controls */}
      <div className="bg-gray-100 px-4 py-2 flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="flex space-x-2">
          {['MAP', 'LIVE', 'LIST'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-md font-medium ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-white border text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center space-x-2 text-sm">
          <span className="font-medium">Severity:</span>
          {['all', 'high', 'medium', 'low'].map(level => (
            <label key={level} className="flex items-center space-x-1">
              <input
                type="radio"
                name="severity"
                value={level}
                checked={selectedSeverity === level}
                onChange={() => setSelectedSeverity(level)}
              />
              <span className="capitalize">{level}</span>
            </label>
          ))}
        </div>

        <div className="text-sm text-gray-600 self-center sm:self-auto">RADIUS: 100m</div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="bg-gray-800 text-white w-64 p-4 fixed top-0 left-0 h-full overflow-y-auto z-10">
            <h2 className="text-lg font-semibold">Rescue List</h2>
            <ul className="mt-4 space-y-2">
              {displayedRescues.map(rescue => (
                <li key={rescue.id} className="border-b pb-2">
                  <h3 className="font-medium">{rescue.name}</h3>
                  <p className="text-sm">Severity: {rescue.severity}</p>
                  <p className="text-sm">Location: {rescue.position.join(', ')}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Map Area */}
        <div className="flex-1 overflow-hidden">
          <DynamicRescueMap
            rescues={displayedRescues}
            center={initialPosition}
            zoom={initialZoom}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-center text-sm py-2">
        <p>ℹ️ {displayedRescues.length} issue(s) displayed matching severity '{selectedSeverity}'.</p>
      </footer>
    </div>
  );
}
