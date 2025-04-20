// components/RescueMap.js

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Import Leaflet and AwesomeMarkers styles
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';

// --- Define your AwesomeMarkers-based icons ---
const highSeverityIcon = L.AwesomeMarkers.icon({
    icon: 'exclamation-triangle',
    prefix: 'fa',
    markerColor: 'red'
});

const mediumSeverityIcon = L.AwesomeMarkers.icon({
    icon: 'exclamation-circle',
    prefix: 'fa',
    markerColor: 'orange'
});

const lowSeverityIcon = L.AwesomeMarkers.icon({
    icon: 'info-circle',
    prefix: 'fa',
    markerColor: 'blue'
});

const defaultIcon = L.AwesomeMarkers.icon({
    icon: 'question-circle',
    prefix: 'fa',
    markerColor: 'gray'
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
            return defaultIcon;
    }
};

// ✅ Sample rescues near Balingasag
const sampleRescues = [
    {
        id: 1,
        name: 'Flooded Area - Brgy. Napaliran',
        severity: 'high',
        position: [8.7430, 124.7790]
    },
    {
        id: 2,
        name: 'Evacuation Needed - Brgy. San Alonzo',
        severity: 'medium',
        position: [8.7415, 124.7752]
    },
    {
        id: 3,
        name: 'Road Blocked - National Highway',
        severity: 'low',
        position: [8.7445, 124.7815]
    }
];

const RescueMap = ({ rescues = sampleRescues, center, zoom }) => {
    const mapCenter = center || [8.7422, 124.7776]; // 📍 Balingasag
    const mapZoom = zoom || 14;

    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {rescues.map(rescue => (
                <Marker
                    key={rescue.id}
                    position={rescue.position}
                    icon={getIconBySeverity(rescue.severity)}
                >
                    <Popup>
                        <b>{rescue.name}</b><br />
                        Severity: {rescue.severity}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default RescueMap;
