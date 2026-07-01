import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Button, Text } from '@mantine/core';
import type { Equipment } from '../../data/types';
import type { Coordinates } from '../../hooks/useGeolocation';

function createDivIcon(color: string, size: number) {
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);border:2px solid white;
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

const equipmentIcon = createDivIcon('#D4A017', 28);
const userIcon = createDivIcon('#2563EB', 20);

interface NearMeMapProps {
  center: Coordinates;
  userLocation: Coordinates | null;
  items: Equipment[];
}

export function NearMeMap({ center, userLocation, items }: NearMeMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      scrollWheelZoom
      style={{ position: 'absolute', inset: 0 }}>

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


      {userLocation &&
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>موقعك الحالي</Popup>
        </Marker>
      }

      {items.map((item) =>
      <Marker key={item.id} position={[item.lat, item.lng]} icon={equipmentIcon}>
          <Popup>
            <Text fw={700} size="sm" mb={4}>{item.title}</Text>
            <Button
            component={Link}
            to={`/equipment/${item.id}`}
            size="xs"
            color="brand.5"
            radius="sm"
            fullWidth>

              عرض التفاصيل
            </Button>
          </Popup>
        </Marker>
      )}
    </MapContainer>);

}
