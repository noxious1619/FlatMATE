"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

function DraggableMarker({ lat, lng, onChange }: Props) {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);

  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const p = e.target.getLatLng();
          onChange(p.lat, p.lng);
        },
      }}
    />
  );
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), {
      animate: true,
    });
  }, [lat, lng, map]);

  return null;
}

export default function LocationMap({ lat, lng, onChange }: Props) {
    const [position, setPosition] = useState<[number, number]>([lat, lng]);
    // Keep marker position in sync
  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={18}
      scrollWheelZoom
      className="h-[320px] w-full border-2 border-black"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Recenter map when props change */}
      <RecenterMap lat={lat} lng={lng} />

      <Marker
        position={position}
        draggable
        icon={markerIcon}
        eventHandlers={{
          dragend: (e) => {
            const p = e.target.getLatLng();
            setPosition([p.lat, p.lng]);
            onChange(p.lat, p.lng);
          },
        }}
      />
    </MapContainer>
  );
}
