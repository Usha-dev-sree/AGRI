import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon paths in React bundle
const createCustomIcon = (color = '#10b981', label = '🌾') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 0 12px ${color};
      font-size: 14px;
      font-weight: bold;
    ">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const farmIcon = createCustomIcon('#10b981', '🌾');
const processorIcon = createCustomIcon('#06b6d4', '🏭');
const activePickupIcon = createCustomIcon('#f59e0b', '🚚');

export const AgriMap = ({ locations = [], center = [17.2, 78.8], zoom = 8, height = '320px' }) => {
  const defaultLocations = [
    { id: 1, name: 'Green Valley Farm (Ramesh K.)', lat: 17.0577, lng: 79.2684, type: 'farm', desc: '2.5T Rice Straw Available' },
    { id: 2, name: 'Sunrise Agro Fields', lat: 16.8722, lng: 79.5647, type: 'farm', desc: '800kg Tomato Residue' },
    { id: 3, name: 'BioEnergy Renewable Fuels Ltd', lat: 17.4589, lng: 78.5992, type: 'processor', desc: 'Biomass Briquetting Hub' },
    { id: 4, name: 'GreenSoil Organics & Composting', lat: 17.5925, lng: 78.5714, type: 'processor', desc: 'Commercial Composting Unit' }
  ];

  const markersToRender = locations.length > 0 ? locations : defaultLocations;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg relative z-10">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markersToRender.map((loc) => {
          const icon = loc.type === 'processor' ? processorIcon : loc.type === 'pickup' ? activePickupIcon : farmIcon;
          return (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icon}>
              <Popup>
                <div className="p-1 text-slate-900">
                  <h4 className="font-bold text-xs">{loc.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{loc.desc || loc.address}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {loc.type || 'Agri-Point'}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
