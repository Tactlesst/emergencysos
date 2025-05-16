import React, { useState } from 'react';
import ClickableMap from './ClickableMap';

export default function MapModal() {
  const [pickedPosition, setPickedPosition] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');

  // Default center (example: New York City)
  const center = { lat: 40.7128, lng: -74.006 };
  const initialZoom = 13;

  const onModalMapClick = (latlng) => {
    console.log('Map clicked at:', latlng);
    const lat = latlng.lat.toFixed(6);
    const lng = latlng.lng.toFixed(6);
    setPickedPosition([latlng.lat, latlng.lng]);
    const link = `https://www.google.com/maps/place/@${lat},${lng},17z`;
    setGeneratedLink(link);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '500px', margin: 'auto' }}>
      <h3>Click on the map to pick a location</h3>
      <ClickableMap
        center={center}
        zoom={initialZoom}
        onMapClick={onModalMapClick}
        markerPosition={pickedPosition}
      />

      {generatedLink && (
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="generated-link" style={{ display: 'block', marginBottom: 4 }}>
            Generated Google Maps Link:
          </label>
          <input
            id="generated-link"
            type="text"
            readOnly
            value={generatedLink}
            style={{ width: '100%', padding: '8px' }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}
    </div>
  );
}
