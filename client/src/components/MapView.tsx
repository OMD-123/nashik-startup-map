import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Company } from "../types";
import { sectorColor, companyInitials } from "../utils";

interface Props {
  companies: Company[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const NASHIK_CENTER: [number, number] = [19.9975, 73.7898];

function buildIcon(c: Company, isSelected: boolean): L.DivIcon {
  const color = sectorColor(c.sector);
  const size = isSelected ? 38 : 30;
  const html = `
    <div class="nashik-pin ${c.type}${c.hiring ? " hiring" : ""}"
         style="background:${color};width:${size}px;height:${size}px;${
           isSelected
             ? "transform:rotate(-45deg) scale(1.05);box-shadow:0 0 0 4px rgba(255,140,26,.35),0 4px 14px rgba(10,37,64,.35);z-index:9999;"
             : ""
         }">
      <span style="font-size:${isSelected ? 14 : 11}px">${companyInitials(c)}</span>
    </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function popupHtml(c: Company): string {
  const hiringBadge = c.hiring
    ? `<span style="background:#16a34a;color:#fff;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;letter-spacing:.05em;">HIRING</span>`
    : "";
  const web = c.website
    ? `<a href="${c.website}" target="_blank" rel="noreferrer" style="color:#0a2540;font-weight:600;text-decoration:underline;">Website →</a>`
    : "";
  const roles = c.roles
    .slice(0, 4)
    .map(
      (r) =>
        `<span style="background:#f1f5f9;color:#334155;padding:2px 6px;border-radius:4px;font-size:10px;margin:2px 2px 2px 0;display:inline-block;">${escapeHtml(
          r
        )}</span>`
    )
    .join("");
  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
        <strong style="font-size:14px;color:#0a2540;">${escapeHtml(c.name)}</strong>
        ${hiringBadge}
      </div>
      <div style="font-size:11px;color:#64748b;margin-bottom:4px;">
        ${escapeHtml(c.sector)} · ${escapeHtml(c.area)} · ${escapeHtml(c.size)}
      </div>
      <p style="font-size:12px;color:#334155;margin:4px 0 8px;line-height:1.4;">${escapeHtml(
        c.description
      )}</p>
      <div style="margin-bottom:6px;">${roles}</div>
      ${web}
    </div>
  `;
}

function FlyToSelected({
  companies,
  selectedId,
}: {
  companies: Company[];
  selectedId?: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const c = companies.find((x) => x.id === selectedId);
    if (c) map.flyTo([c.lat, c.lng], 13, { duration: 0.8 });
  }, [selectedId, companies, map]);
  return null;
}

function ClusteredMarkers({
  companies,
  selectedId,
  onSelect,
}: Props) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    groupRef.current = group;

    companies.forEach((c) => {
      const m = L.marker([c.lat, c.lng], { icon: buildIcon(c, c.id === selectedId) });
      m.bindPopup(popupHtml(c));
      m.on("click", () => onSelect(c.id));
      group.addLayer(m);
    });

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, companies, selectedId]);

  return null;
}

export function MapView({ companies, selectedId, onSelect }: Props) {
  // stable callback for marker click
  const handler = useMemo(() => onSelect, [onSelect]);
  return (
    <MapContainer
      center={NASHIK_CENTER}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ minHeight: 480 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected companies={companies} selectedId={selectedId} />
      <ClusteredMarkers
        companies={companies}
        selectedId={selectedId}
        onSelect={handler}
      />
    </MapContainer>
  );
}