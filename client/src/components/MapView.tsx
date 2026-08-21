import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Company } from "../types";
import { escapeHtml, companyLetter } from "../utils";

interface Props {
  companies: Company[];
}

const NASHIK_CENTER: [number, number] = [19.9975, 73.7898];

function buildIcon(c: Company): L.DivIcon {
  const letter = companyLetter(c);
  return L.divIcon({
    html: `<div class="nashik-pin ${c.type}${c.hiring ? " hiring" : ""}" title="${escapeHtml(c.name)}">${letter}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function popupHtml(c: Company): string {
  const hiring = c.hiring
    ? `<span class="hiring-badge">HIRING</span>`
    : "";
  const web = c.website
    ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noreferrer">Website</a>`
    : "";
  const map = `<a href="https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=15/${c.lat}/${c.lng}" target="_blank" rel="noreferrer">Map</a>`;
  const roles = c.roles
    .slice(0, 6)
    .map((r) => `<span class="role">${escapeHtml(r)}</span>`)
    .join("");
  return `
    <div class="popup">
      <div class="head">
        <div class="name">${escapeHtml(c.name)}</div>
        ${hiring}
      </div>
      <div class="meta">${escapeHtml(c.sector)} · ${escapeHtml(c.area)} · ${escapeHtml(c.size)}</div>
      <p class="desc">${escapeHtml(c.description)}</p>
      <div class="roles">${roles}</div>
      <div class="links">
        ${web}
        ${map}
      </div>
    </div>
  `;
}

function ClusteredMarkers({ companies }: Props) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 55,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    groupRef.current = group;

    companies.forEach((c) => {
      const m = L.marker([c.lat, c.lng], { icon: buildIcon(c) });
      m.bindPopup(popupHtml(c), { maxWidth: 300, minWidth: 260 });
      group.addLayer(m);
    });

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [companies, map]);

  return null;
}

export function MapView({ companies }: Props) {
  return (
    <MapContainer
      center={NASHIK_CENTER}
      zoom={12}
      scrollWheelZoom
      zoomControl
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ClusteredMarkers companies={companies} />
    </MapContainer>
  );
}