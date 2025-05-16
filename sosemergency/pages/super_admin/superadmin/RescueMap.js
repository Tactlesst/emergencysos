// components/RescueMap.js

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';

import rescuesData from '../data/rescues';  // Adjust path as needed

const highSeverityIcon = L.AwesomeMarkers.icon({
  icon: 'car-crash',
  prefix: 'fa',
  markerColor: 'red',
});

const mediumSeverityIcon = L.AwesomeMarkers.icon({
  icon: 'car-side',
  prefix: 'fa',
  markerColor: 'orange',
});

const lowSeverityIcon = L.AwesomeMarkers.icon({
  icon: 'car',
  prefix: 'fa',
  markerColor: 'blue',
});

const getIconBySeverity = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return highSeverityIcon;
    case 'medium':
      return mediumSeverityIcon;
    case 'low':
      return lowSeverityIcon;
    default:
      return lowSeverityIcon;
  }
};

const RescueMap = () => {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    // Load rescues from imported data
    setRescues(rescuesData);
  }, []);

  const mapCenter = [8.7422, 124.7776];
  const mapZoom = 14;

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {rescues.map(({ id, position, name, severity }) => (
        <Marker key={id} position={position} icon={getIconBySeverity(severity)}>
          <Popup>
            <b>{name}</b>
            <br />
            Severity: {severity}
            <br />
            Type: Vehicle Accident
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RescueMap;
