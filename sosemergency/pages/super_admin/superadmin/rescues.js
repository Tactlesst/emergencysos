import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import ClickableMap once (for modal)
const DynamicClickableMap = dynamic(() => import('../superadmin/ClickableMap.js'), { ssr: false });

export default function ManageRescuesPage() {
  const [rescues, setRescues] = useState([
    { id: 1, position: [8.7430, 124.7790], name: '2-Car Collision - Brgy. Napaliran', severity: 'high', type: 'accident' },
    { id: 2, position: [8.7415, 124.7752], name: 'Motorcycle Crash - Brgy. San Alonzo', severity: 'medium', type: 'accident' },
    { id: 3, position: [8.7445, 124.7815], name: 'Truck Overturn - National Highway', severity: 'high', type: 'accident' },
    { id: 4, position: [8.7422, 124.7776], name: 'Fender Bender - Near Town Center', severity: 'low', type: 'accident' },
    { id: 5, position: [8.7452, 124.7801], name: 'Hit and Run - Hillside Zone', severity: 'medium', type: 'accident' }
  ]);

  const [activeTab, setActiveTab] = useState('MAP');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inputs and editing state
  const [linkInput, setLinkInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [severityInput, setSeverityInput] = useState('low');
  const [editingId, setEditingId] = useState(null);

  const [center, setCenter] = useState([8.7422, 124.7776]);
  const initialZoom = 15;

  // Modal for picking location on map
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedPosition, setPickedPosition] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');

  // Validation state
  const [linkError, setLinkError] = useState('');

  // Dynamic main RescueMap component
  const DynamicRescueMap = useMemo(() => dynamic(
    () => import('../superadmin/RescueMap.js'),
    {
      loading: () => <p className="text-center w-full">Loading map...</p>,
      ssr: false
    }
  ), []);

  // Filter rescues by severity
  const displayedRescues = useMemo(() => {
    return rescues.filter(rescue =>
      selectedSeverity === 'all' || rescue.severity === selectedSeverity
    );
  }, [selectedSeverity, rescues]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

const extractCoordinatesFromLink = (link) => {
  // Try to extract from '@lat,lng'
  let match = link.match(/@([-.\d]+),([-.\d]+)/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [lat, lng];
    }
  }

  // Try to extract from '?q=lat,lng' or '&q=lat,lng'
  match = link.match(/[?&]q=([-.\d]+),([-.\d]+)/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [lat, lng];
    }
  }

  return null;
};


  // Validate Google Maps link on change
  const handleLinkChange = (e) => {
    const val = e.target.value;
    setLinkInput(val);

    if (!val.trim()) {
      setLinkError('Google Maps link is required.');
      return;
    }

    const coords = extractCoordinatesFromLink(val);
    if (!coords) {
      setLinkError('Invalid Google Maps link format. Must contain valid coordinates.');
    } else {
      setLinkError('');
    }
  };

  // Clear input form
  const clearForm = () => {
    setLinkInput('');
    setNameInput('');
    setSeverityInput('low');
    setEditingId(null);
    setLinkError('');
  };

  // Add or update rescue location
  const handleSaveRescue = () => {
    if (linkError) return;
    const coords = extractCoordinatesFromLink(linkInput);
    if (!coords) {
      alert('Invalid Google Maps link. Please check and try again.');
      return;
    }
    if (!nameInput.trim()) {
      alert('Please enter an accident name.');
      return;
    }

    if (editingId !== null) {
      setRescues(prev => prev.map(r => r.id === editingId ? {
        ...r,
        position: coords,
        name: nameInput,
        severity: severityInput
      } : r));
      clearForm();
    } else {
      const newRescue = {
        id: rescues.length ? Math.max(...rescues.map(r => r.id)) + 1 : 1,
        name: nameInput,
        position: coords,
        severity: severityInput,
        type: 'accident'
      };
      setRescues(prev => [...prev, newRescue]);
      clearForm();
    }
  };

  // Delete rescue with confirmation
  const handleDeleteRescue = (id) => {
    if (confirm('Are you sure you want to delete this accident report?')) {
      setRescues(prev => prev.filter(r => r.id !== id));
      if (editingId === id) clearForm();
    }
  };

  // Click on rescue in sidebar: center map there
  const handleSelectRescue = (rescue) => {
    setCenter(rescue.position);
    setActiveTab('MAP');
  };

  // Edit button in sidebar
  const handleEditRescue = (rescue) => {
    setEditingId(rescue.id);
    setNameInput(rescue.name);
    setSeverityInput(rescue.severity);
  setLinkInput(`https://www.google.com/maps?q=${rescue.position[0]},${rescue.position[1]}`);
    setLinkError('');
    setIsSidebarOpen(true);
    setActiveTab('MAP');
    setCenter(rescue.position);
  };

  // Modal map click handler
  const onModalMapClick = (latlng) => {
    const lat = latlng.lat.toFixed(6);
    const lng = latlng.lng.toFixed(6);
    setPickedPosition([latlng.lat, latlng.lng]);
    const link = `https://www.google.com/maps/place/@${lat},${lng},17z`;
    setGeneratedLink(link);
  };

  // Copy generated link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link.'));
  };

  // Close modal on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [modalOpen, handleKeyDown]);

  // Modal component for map picking
  const MapModal = () => {
    // Close modal on overlay click
    const onOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        setModalOpen(false);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col shadow-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 id="modal-title" className="text-lg font-semibold">Pick Location on Map</h2>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-600 hover:text-gray-900 font-bold text-xl leading-none"
              aria-label="Close modal"
              type="button"
            >
              ✖️
            </button>
          </div>
          <div className="flex-1">
            <DynamicClickableMap
              center={center}
              zoom={initialZoom}
              onMapClick={onModalMapClick}
              markerPosition={pickedPosition}
            />
          </div>
          <div className="p-4 border-t">
            <label htmlFor="generatedLink" className="block mb-1 font-semibold">Generated Google Maps Link:</label>
            <input
              id="generatedLink"
              type="text"
              readOnly
              className="w-full border rounded px-2 py-1 text-sm"
              value={generatedLink}
              placeholder="Click on the map to generate link"
            />
            <button
              className="mt-2 bg-blue-600 text-white rounded px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!generatedLink}
              onClick={copyToClipboard}
              type="button"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <header className="flex items-center justify-between bg-red-600 text-white px-4 py-2 shadow-md">
        <button className="text-xl" aria-label="Menu toggle">☰</button>
        <h1 className="text-lg font-semibold">VEHICLE ACCIDENTS</h1>
        <button className="text-xl" onClick={toggleSidebar} aria-label="Toggle sidebar notifications">🔔</button>
      </header>

      {/* Controls */}
      <div className="bg-gray-100 px-4 py-2 flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="flex space-x-2">
          {['MAP', 'LIVE', 'LIST'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-md font-medium ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-white border text-gray-700'}`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center space-x-2 text-sm">
          <span className="font-medium">Severity:</span>
          {['all', 'high', 'medium', 'low'].map(level => (
            <label key={level} className="flex items-center space-x-1 cursor-pointer">
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

      {/* Add/Edit Location Inputs */}
      <div className="bg-gray-100 px-4 py-2 flex flex-col sm:flex-row gap-2 items-center">
        <div className="flex flex-col w-full sm:w-64">
          <input
            type="text"
            placeholder="Paste Google Maps link..."
            className={`px-2 py-1 border rounded text-sm w-full ${linkError ? 'border-red-600' : ''}`}
            value={linkInput}
            onChange={
              handleLinkChange}
/>
{linkError && <p className="text-xs text-red-600 mt-1">{linkError}</p>}
</div>
<input
type="text"
placeholder="Accident Name"
className="px-2 py-1 border rounded text-sm flex-grow"
value={nameInput}
onChange={e => setNameInput(e.target.value)}
/>
<select
className="px-2 py-1 border rounded text-sm w-32"
value={severityInput}
onChange={e => setSeverityInput(e.target.value)}
>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
<button
className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
disabled={!!linkError || !linkInput.trim() || !nameInput.trim()}
onClick={handleSaveRescue}
type="button"
>
{editingId !== null ? 'Update' : 'Add'}
</button>
<button
className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
onClick={() => {
clearForm();
setModalOpen(true);
}}
type="button"
title="Pick location on map"
aria-label="Pick location on map"
>
🗺️
</button>
</div>  {/* Sidebar */}
  <aside
    className={`fixed top-0 right-0 h-full w-80 bg-white border-l shadow-lg transform transition-transform z-40 ${
      isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
    aria-label="Notification sidebar"
  >
    <div className="p-4 flex justify-between items-center border-b">
      <h2 className="font-semibold text-lg">Vehicle Accident Reports</h2>
      <button onClick={toggleSidebar} aria-label="Close sidebar" type="button">✖️</button>
    </div>
    <ul className="overflow-y-auto max-h-[calc(100vh-64px)]">
      {displayedRescues.map(rescue => (
        <li
          key={rescue.id}
          className="border-b px-4 py-3 cursor-pointer hover:bg-gray-100"
          onClick={() => handleSelectRescue(rescue)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSelectRescue(rescue); }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{rescue.name}</p>
              <p className="text-xs text-gray-600 capitalize">Severity: {rescue.severity}</p>
            </div>
            <div className="space-x-1">
              <button
                onClick={e => { e.stopPropagation(); handleEditRescue(rescue); }}
                className="text-blue-600 hover:text-blue-800"
                aria-label={`Edit ${rescue.name}`}
                type="button"
              >
                ✏️
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleDeleteRescue(rescue.id); }}
                className="text-red-600 hover:text-red-800"
                aria-label={`Delete ${rescue.name}`}
                type="button"
              >
                🗑️
              </button>
            </div>
          </div>
        </li>
      ))}
      {displayedRescues.length === 0 && <li className="p-4 text-gray-500">No accidents to show.</li>}
    </ul>
  </aside>

  {/* Main content */}
  <main className="flex-1 relative min-h-[400px]">
    {activeTab === 'MAP' && (
      <DynamicRescueMap
        rescues={displayedRescues}
        center={center}
        zoom={initialZoom}
        setCenter={setCenter}
      />
    )}
    {activeTab === 'LIVE' && (
      <div className="flex justify-center items-center h-full text-gray-600 font-semibold">
        LIVE data coming soon...
      </div>
    )}
    {activeTab === 'LIST' && (
      <div className="p-4 overflow-auto max-h-[70vh]">
        <h2 className="font-semibold mb-2">Vehicle Accident Reports</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-3 py-1">Name</th>
              <th className="border border-gray-300 px-3 py-1">Severity</th>
              <th className="border border-gray-300 px-3 py-1">Coordinates</th>
              <th className="border border-gray-300 px-3 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRescues.map(rescue => (
              <tr key={rescue.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">{rescue.name}</td>
                <td className="border border-gray-300 px-3 py-1 capitalize">{rescue.severity}</td>
                <td className="border border-gray-300 px-3 py-1">
                  {rescue.position[0].toFixed(6)}, {rescue.position[1].toFixed(6)}
                </td>
                <td className="border border-gray-300 px-3 py-1 space-x-2">
                  <button
                    onClick={() => handleEditRescue(rescue)}
                    className="text-blue-600 hover:text-blue-800"
                    type="button"
                    aria-label={`Edit ${rescue.name}`}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteRescue(rescue.id)}
                    className="text-red-600 hover:text-red-800"
                    type="button"
                    aria-label={`Delete ${rescue.name}`}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {displayedRescues.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No accident reports to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </main>

  {/* Map location picker modal */}
  {modalOpen && <MapModal />}
</div>
);
}