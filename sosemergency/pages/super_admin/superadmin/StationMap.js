import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';
import 'leaflet-routing-machine'; // Import the routing machine

const StationMap = ({ stations }) => {
  const [vehiclePosition, setVehiclePosition] = useState([8.7422, 124.7776]); // Initial vehicle position
  const [routeControl, setRouteControl] = useState(null); // Store route control for later manipulation
  const [vehicleMarker, setVehicleMarker] = useState(null); // Store vehicle marker
  const mapRef = useRef(null); // Ref to store the map instance

  // 🎯 Color mapping based on station type
  const iconColors = {
    fire: 'red',
    police: 'blue',
    emergency: 'orange',
    mddrmo: 'green',
  };

  // 🧠 Create an AwesomeMarkers icon with type-based color and optional icon
  const createAwesomeIcon = (color, iconName = 'info-sign') => {
    return L.AwesomeMarkers.icon({
      icon: iconName,
      markerColor: color, // red, blue, green, orange, purple, etc.
      prefix: 'fa',
    });
  };

  // Randomly generate coordinates within a specified range for demonstration
  const generateRandomCoordinates = () => {
    const lat = 8.7 + Math.random() * 0.1; // Random latitude between 8.7 and 8.8
    const lng = 124.7 + Math.random() * 0.1; // Random longitude between 124.7 and 124.8
    return [lat, lng];
  };

  // Spawn the vehicle and route it to a random location
  const routeVehicleToRandomLocation = () => {
    const randomDestination = generateRandomCoordinates();
    if (mapRef.current && randomDestination) {
      const map = mapRef.current;

      // If a route already exists, remove it
      if (routeControl) {
        map.removeControl(routeControl);
      }

      // Create a new route from the vehicle's position to the random destination
      const newRouteControl = L.Routing.control({
        waypoints: [
          L.latLng(vehiclePosition), // Vehicle position
          L.latLng(randomDestination), // Random destination
        ],
        routeWhileDragging: true,
        createMarker: () => null, // Don't show markers for route points
        lineOptions: {
          styles: [{ color: '#ff7800', weight: 4, opacity: 0.7 }], // Customize the route line style
        },
      }).addTo(map);

      setRouteControl(newRouteControl);

      // Move the vehicle marker along the route
      const vehicleIcon = createAwesomeIcon('blue', 'car'); // Vehicle icon

      if (vehicleMarker) {
        vehicleMarker.setLatLng(vehiclePosition); // Reset vehicle position before the movement
      } else {
        // Create a new vehicle marker if it doesn't exist yet
        const newVehicleMarker = L.marker(vehiclePosition, { icon: vehicleIcon }).addTo(map);
        setVehicleMarker(newVehicleMarker);
      }

      // Animate the vehicle along the route (simple approach, update the position as the route progresses)
      const route = newRouteControl.getPlan().getRoute(0); // Get the first route from the route control
      let progress = 0;
      const moveVehicleAlongRoute = () => {
        progress += 0.01; // Move the vehicle along the route by 1% every second
        if (progress <= 1) {
          const latLng = route.getLatLngAtDistance(route.getDistance() * progress);
          vehicleMarker.setLatLng(latLng);
        } else {
          clearInterval(vehicleMoveInterval); // Stop the movement when the vehicle reaches the destination
        }
      };

      const vehicleMoveInterval = setInterval(moveVehicleAlongRoute, 1000); // Update every second
    }
  };

  // Automatically route the vehicle every 5 seconds to a new random location
  useEffect(() => {
    const routeInterval = setInterval(() => {
      routeVehicleToRandomLocation();
    }, 5000); // Update the route every 5 seconds

    return () => clearInterval(routeInterval); // Clean up interval on component unmount
  }, [vehiclePosition]);

  return (
    <MapContainer
      whenCreated={(map) => { mapRef.current = map; }} // Ensure the map is initialized
      center={vehiclePosition}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render station markers */}
      {stations.map((station) => {
        const color = iconColors[station.type] || 'gray';
        const icon = createAwesomeIcon(color, 'location-dot'); // FontAwesome icon name

        return (
          <Marker
            key={station.id}
            position={station.position}
            icon={icon}
            eventHandlers={{
              click: () => console.log(`Station clicked: ${station.name}`), // Replace with actual selection logic
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <p>Type: {station.type.toUpperCase()}</p>
              <p>Vehicles: {station.vehicles}</p>
              <p>Respondents: {station.respondents}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default StationMap;
