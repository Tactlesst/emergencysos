import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mapCenter = [8.7422, 124.7776];

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  // When position changes, recenter the map
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    } else {
      map.setView(mapCenter, 12);
    }
  }, [position, map]);

  // Click to update marker position
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function LeafletMapWithLink({ initialLink }) {
  const [link, setLink] = useState(initialLink || '');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');

  function parseCoordinatesFromLink(link) {
    try {
      const url = new URL(link);
      let q = url.searchParams.get('q');
      if (q) {
        const [lat, lng] = q.split(',');
        if (!isNaN(lat) && !isNaN(lng)) {
          return [parseFloat(lat), parseFloat(lng)];
        }
      }
      const pathParts = url.pathname.split('/');
      for (const part of pathParts) {
        if (part.match(/^(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)$/)) {
          const [lat, lng] = part.split(',');
          return [parseFloat(lat), parseFloat(lng)];
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const coords = parseCoordinatesFromLink(link);
    if (coords) {
      setError('');
      setPosition(coords);
    } else {
      setError('Invalid Google Maps link or no coordinates found.');
      setPosition(null);
    }
  }, [link]);

  function generateLinkFromPosition(pos) {
    if (!pos) return '';
    return `https://www.google.com/maps?q=${pos[0]},${pos[1]}`;
  }

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="mapLink" className="font-semibold">
        Google Maps Link
      </label>
      <input
        id="mapLink"
        type="text"
        value={link}
        onChange={e => setLink(e.target.value)}
        className="border px-2 py-1 rounded w-full"
        placeholder="Paste Google Maps link here"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div style={{ height: 400, width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={pos => {
              setPosition(pos);
              setLink(generateLinkFromPosition(pos));
              setError('');
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
