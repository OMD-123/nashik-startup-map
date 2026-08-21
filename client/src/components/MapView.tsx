import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Company } from "../types";
import { companyLetter, pinColor, escapeHtml } from "../utils";

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
    const bounds = L.latLngBounds(companies.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 11, animate: false });
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

/* ---------- Build popup HTML for individual company pin ---------- */
function buildPopupHtml(c: Company): string {
  const name = escapeHtml(c.name);
  const sector = escapeHtml(c.sector);
  const area = escapeHtml(c.area);
  const desc = escapeHtml(c.description?.slice(0, 140) ?? "");
  const truncated = c.description && c.description.length > 140 ? "…" : "";
  const roles = c.roles.map((r) => `<span class="role">${escapeHtml(r)}</span>`).join("");
  const hiringBadge = c.hiring ? `<span class="hiring-badge">HIRING</span>` : "";
  const websiteLink = c.website
    ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noreferrer">Website →</a>`
    : "";
  return `
    <div class="popup">
      <div class="head">
        <div class="name">${name}</div>
        ${hiringBadge}
      </div>
      <div class="meta">${sector} · ${area}</div>
      ${desc ? `<p class="desc">${desc}${truncated}</p>` : ""}
      ${roles ? `<div class="roles">${roles}</div>` : ""}
      <div class="links">
        ${websiteLink}
        <a href="#" class="popup-view-detail" data-id="${escapeHtml(c.id)}">View details →</a>
      </div>
    </div>
  `;
}

/* ---------- Clustered markers with custom icon + popup + company metadata ---------- */
function ClusteredMarkers({
  companies, selectedId, onSelect,
}: Props) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: buildClusterIcon,
      disableClusteringAtZoom: 12,
      spiderfyDistanceMultiplier: 1.8,
    });
    groupRef.current = group;

    companies.forEach((c) => {
      const m = L.marker([c.lat, c.lng], { icon: buildIcon(c, c.id === selectedId) });
      (m.options as { __company?: Company }).__company = c;
      m.bindPopup(buildPopupHtml(c), {
        maxWidth: 300,
        minWidth: 260,
        closeButton: true,
        autoPan: true,
        autoPanPadding: [20, 20],
      });
      m.on("click", () => onSelect(c.id));
      m.on("popupopen", (e) => {
        const el = e.popup.getElement();
        if (!el) return;
        const viewBtn = el.querySelector(".popup-view-detail") as HTMLAnchorElement | null;
        if (viewBtn) {
          viewBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            onSelect(c.id);
            m.closePopup();
          });
        }
      });
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