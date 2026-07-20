import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NEIGHBORHOODS } from '@/data/market';

/**
 * Interactive Newport News neighborhood map (Leaflet + OpenStreetMap).
 * Custom div-based pins avoid Leaflet's default icon asset issues under Vite.
 */
const pinIcon = divIcon({
  className: '',
  html: `<div style="
      width:34px;height:34px;border-radius:50% 50% 50% 0;
      background:#0A8F7E;transform:rotate(-45deg);
      border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;">
      <div style="width:10px;height:10px;border-radius:50%;background:#fff;"></div>
    </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

export function NeighborhoodMap({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <div className="w-full h-[440px] rounded-2xl overflow-hidden border border-border shadow-md relative z-0">
      <MapContainer
        center={[37.065, -76.473]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {NEIGHBORHOODS.map((n) => (
          <Marker key={n.id} position={[n.lat, n.lng]} icon={pinIcon}>
            <Popup>
              <div style={{ minWidth: 190 }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{n.name}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.45, marginBottom: 6 }}>
                  Typical home: <b>{n.medianHome}</b>
                  <br />
                  Typical rent: <b>{n.medianRent}/mo</b>
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12.5 }}>
                  {onSelect && (
                    <button
                      onClick={() => onSelect(n.id)}
                      style={{
                        color: '#0A8F7E',
                        fontWeight: 700,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Details
                    </button>
                  )}
                  <a
                    href={n.zillowBuyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0A8F7E', fontWeight: 700 }}
                  >
                    Zillow →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
