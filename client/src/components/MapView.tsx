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

/* ---------- Cluster icon — shows TOTAL job count across the cluster ---------- */
function buildClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  // Sum the open roles of every marker inside this cluster
  const markers = cluster.getAllChildMarkers();
  let totalJobs = 0;
  let hiringCount = 0;
  for (const m of markers) {
    const c = (m.options as { __company?: Company }).__company;
    if (c) {
      totalJobs += c.roles.length;
      if (c.hiring) hiringCount++;
    }
  }
  const count = markers.length;
  // Size by total jobs
  const size = totalJobs >= 30 ? 60 : totalJobs >= 15 ? 52 : 44;
  return L.divIcon({
    html: `
      <div class="nashik-cluster" style="width:${size}px;height:${size}px;">
        <div class="cluster-num">${totalJobs}</div>
        <div class="cluster-sub">${count} ${count === 1 ? "co" : "cos"} · ${totalJobs} jobs${hiringCount ? " · " + hiringCount + " hiring" : ""}</div>
      </div>`,
    className: "",
    iconSize: [size, size + 14],
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

/* ---------- Clustered markers with custom icon + company metadata ---------- */
function ClusteredMarkers({
  companies, selectedId, onSelect,
}: Props) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: buildClusterIcon,
      // Disable clustering at zoom 13+ so individual pins are always visible when zoomed in
      disableClusteringAtZoom: 13,
    });
    groupRef.current = group;

    companies.forEach((c) => {
      const m = L.marker([c.lat, c.lng], { icon: buildIcon(c, c.id === selectedId) });
      // Stash company reference on the marker for cluster counting
      (m.options as { __company?: Company }).__company = c;
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