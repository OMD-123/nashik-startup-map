import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Company } from "../types";
import { companyLetter, pinColor } from "../utils";

interface Props {
  companies: Company[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

/* ---------- Individual pin (with job-count badge below) ---------- */
function buildIcon(c: Company, isSelected: boolean): L.DivIcon {
  const letter = companyLetter(c);
  const color = pinColor(c);
  const sel = isSelected ? " selected" : "";
  const html = `
    <div class="nashik-pin-wrap${sel}">
      <div class="nashik-pin ${c.type}${c.hiring ? " hiring" : ""}${sel}"
           style="background:${color};color:#ffffff;"
           title="${c.name}">${letter}</div>
      <div class="nashik-jobs-count" title="${c.roles.length} open roles">${c.roles.length}</div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [44, 50],
    iconAnchor: [17, 17],
  });
}


function escapeHtml(value: string): string {
  return value.replace(/[&<>"\']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === "\"") return "&quot;";
    return "&#39;";
  });
}

function buildPopupHtml(c: Company): string {
  const roles = c.roles.slice(0, 3).map((role) => `<span class="popup-role">${escapeHtml(role)}</span>`).join("");
  const moreRoles = c.roles.length > 3 ? `<span class="popup-role popup-role-more">+${c.roles.length - 3} more</span>` : "";
  const website = /^https?:\/\//i.test(c.website) ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noreferrer">Website <span aria-hidden="true">↗</span></a>` : "";
  return `<div class="nashik-map-popup"><div class="popup-title-row"><div><div class="popup-kicker">${escapeHtml(c.type)} · ${escapeHtml(c.area)}</div><div class="popup-company-name">${escapeHtml(c.name)}</div></div>${c.hiring ? `<span class="popup-hiring">Hiring</span>` : ""}</div><div class="popup-sector">${escapeHtml(c.sector)} · ${escapeHtml(c.stage)}</div><p class="popup-description">${escapeHtml(c.description)}</p>${c.roles.length ? `<div class="popup-role-list">${roles}${moreRoles}</div>` : ""}<div class="popup-actions">${website}<a href="https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=15/${c.lat}/${c.lng}" target="_blank" rel="noreferrer">Directions <span aria-hidden="true">↗</span></a></div></div>`;
}

/* ---------- Cluster icon — single number = company count ---------- */
function buildClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const markers = cluster.getAllChildMarkers();
  const count = markers.length;
  // Size scales with count
  const size = count >= 10 ? 56 : count >= 5 ? 48 : 40;
  return L.divIcon({
    html: `
      <div class="nashik-cluster" style="width:${size}px;height:${size}px;">
        <div class="cluster-num">${count}</div>
      </div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/* ---------- Helpers ---------- */
function FitBounds({ companies }: { companies: Company[] }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || companies.length === 0) return;
    // Fit to bounds at zoom 10 so clusters are visible & spiderfy gives a nice spread
    const bounds = L.latLngBounds(companies.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10, animate: false });
    done.current = true;
  }, [companies, map]);
  return null;
}

function DistrictBoundary() {
  const map = useMap();
  useEffect(() => {
    let cancelled = false;
    fetch("/nashik-district.geojson")
      .then((r) => r.json())
      .then((geo) => {
        if (cancelled) return;
        const layer = L.geoJSON(geo as GeoJSON.GeoJsonObject, {
          style: () => ({
            color: "#ff6a1a",
            weight: 3,
            opacity: 0.85,
            fillColor: "#ff6a1a",
            fillOpacity: 0.06,
            dashArray: "8 6",
          }),
        }).addTo(map);
        layer.eachLayer((l) => {
          l.bindTooltip("Nashik District", { sticky: true, direction: "top" });
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [map]);
  return null;
}

function FlyToSelected({
  companies, selectedId,
}: { companies: Company[]; selectedId?: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const c = companies.find((x) => x.id === selectedId);
    if (c) map.flyTo([c.lat, c.lng], 13, { duration: 0.7 });
  }, [selectedId, companies, map]);
  return null;
}

/* ---------- Clustered markers — spiderfy on click ---------- */
function ClusteredMarkers({
  companies, selectedId, onSelect,
}: Props) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 60,
      // Click cluster -> spiderfy (spread pins outward like petals) at any zoom.
      // We also disable zoomToBoundsOnClick so the map doesn't zoom in too far
      // before spiderfy fires.
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: false,
      showCoverageOnHover: false,
      iconCreateFunction: buildClusterIcon,
      // Don't disable clustering at any zoom — let spiderfy handle split
      // (set to 20 = effectively disabled since we don't expect to zoom that far)
      disableClusteringAtZoom: 20,
      // Spread the spider legs a bit wider so 13 pins are clearly visible
      spiderfyDistanceMultiplier: 1.6,
    });
    groupRef.current = group;

    companies.forEach((c) => {
      const m = L.marker([c.lat, c.lng], { icon: buildIcon(c, c.id === selectedId) });
      (m.options as { __company?: Company }).__company = c;
      m.bindPopup(buildPopupHtml(c), { className: "nashik-popup", maxWidth: 300, minWidth: 240, autoPanPadding: [28, 28], closeButton: true, closeOnClick: true });
      m.on("click", () => onSelect(c.id));
      group.addLayer(m);
    });

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [companies, selectedId, onSelect, map]);

  return null;
}

export function MapView({ companies, selectedId, onSelect }: Props) {
  return (
    <MapContainer
      center={[19.9975, 73.7898]}
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
      <DistrictBoundary />
      <FitBounds companies={companies} />
      <ClusteredMarkers companies={companies} selectedId={selectedId} onSelect={onSelect} />
      <FlyToSelected companies={companies} selectedId={selectedId} />
    </MapContainer>
  );
}