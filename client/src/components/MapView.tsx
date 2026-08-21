import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Company } from "../types";
import { companyLetter, pinColor } from "../utils";

interface Props {
  companies: Company[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

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

/* Fit map bounds to all company pins — call once on mount & when set changes */
function FitBounds({ companies }: { companies: Company[] }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || companies.length === 0) return;
    const bounds = L.latLngBounds(companies.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, animate: false });
    done.current = true;
  }, [companies, map]);

  return null;
}

/* District boundary — GeoJSON overlay */
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
        // Attach a tooltip on hover with the district name
        layer.eachLayer((l) => {
          l.bindTooltip("Nashik District", { sticky: true, direction: "top" });
        });
      })
      .catch(() => {
        // Silent — boundary is decorative
      });
    return () => {
      cancelled = true;
    };
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

function CompanyMarkers({
  companies, selectedId, onSelect,
}: Props) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!layerRef.current) {
      layerRef.current = L.layerGroup().addTo(map);
    }
    const layer = layerRef.current!;
    layer.clearLayers();

    companies.forEach((c) => {
      const m = L.marker([c.lat, c.lng], { icon: buildIcon(c, c.id === selectedId) });
      m.on("click", () => onSelect(c.id));
      layer.addLayer(m);
    });
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
      <CompanyMarkers companies={companies} selectedId={selectedId} onSelect={onSelect} />
      <FlyToSelected companies={companies} selectedId={selectedId} />
    </MapContainer>
  );
}