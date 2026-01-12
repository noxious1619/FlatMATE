"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { IndianRupee } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Default Icon
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

type FeedMapProps = {
    listings: any[];
};

export default function FeedMap({ listings }: FeedMapProps) {
    // Center map on Delhi or average of listings
    const centerLat = listings.length > 0 ? listings[0].location?.latitude || 28.6139 : 28.6139;
    const centerLng = listings.length > 0 ? listings[0].location?.longitude || 77.2090 : 77.2090;

    return (
        <div className="h-[calc(100vh-140px)] w-full sticky top-24 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={11}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {listings.map((l) => {
                    if (!l.location) return null;
                    return (
                        <Marker
                            key={l.id}
                            position={[l.location.latitude, l.location.longitude]}
                            icon={markerIcon}
                        >
                            <Popup>
                                <div className="font-mono text-xs w-40">
                                    <img src={l.images[0] || "/placeholder.png"} className="w-full h-20 object-cover mb-2 border border-black" />
                                    <h3 className="font-bold mb-1 truncate">{l.title}</h3>
                                    <p className="flex items-center font-bold text-sm">
                                        <IndianRupee size={12} /> {l.price.toLocaleString("en-IN")}
                                    </p>
                                    <Link href={`/listing/${l.id}`} className="block mt-2 text-blue-600 underline">View Details</Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    );
}
