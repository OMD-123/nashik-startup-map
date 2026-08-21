import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Company } from "../types";
import { companyLetter } from "../utils";

interface Props {
  companies: Company[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

const NASHIK_CENTER: [number, number] = [19.9975, 73.7898];

function buildIcon(c: Company, isSelected: boolean): L.DivIcon {
  const letter = companyLetter(c);
  const sel = isSelected ? " selected" : "";
  const html = `
    <div class="nashik-pin ${c.type}${c.hiring ? " hiring" : ""}${sel}" title="${c.name}">${letter}</div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
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

export function MapView({ companies, selectedId, onSelect }: Props) {
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
      <CompanyMarkers companies={companies} selectedId={selectedId} onSelect={onSelect} />
      <FlyToSelected companies={companies} selectedId={selectedId} />
    </MapContainer>
  );
}