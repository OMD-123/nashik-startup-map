import type { Company } from "./types";

/**
 * Per-company brand colors. Inspired by real-world brand palettes — each
 * company has its own visual identity, similar to how the Bangalore map
 * shows every pin in a unique vibrant color.
 *
 * Fallback to sector color for companies not listed.
 */
const BRAND_COLORS: Record<string, string> = {
  // Software / IT
  "winjit-technologies":    "#ff6a1a",  // saffron — Winjit's signature
  "winjit-ai":              "#ff8c3a",
  "thinkitive-technologies":"#1e88e5",  // blue
  "shrinika-technologies":  "#5e35b1",  // purple
  "sagenext-infotech":      "#00897b",  // teal
  "myboutique-technologies":"#e91e63",  // pink
  "zenfri-technologies":    "#43a047",  // green
  "codetribe-software":     "#fb8c00",  // orange

  // Manufacturing
  "siemens-nashik":         "#009999",  // Siemens teal
  "schneider-electric":     "#3dcd58",  // Schneider green
  "abb-nashik":             "#ff002a",  // ABB red
  "bosch-nashik":           "#ed0007",  // Bosch red
  "mahindra-nashik":        "#cc0033",  // Mahindra red
  "ceat-nashik":            "#0d47a1",  // CEAT blue

  // Pharma / Health
  "glide-labs":             "#7cb342",  // pharma green
  "kashibio":               "#26a69a",  // bio teal

  // Food & Beverage
  "sula-vineyards":         "#6a1b9a",  // Sula purple
  "york-wineries":          "#8e24aa",  // purple
  "grover-zampa":           "#5e35b1",  // purple

  // Agri
  "krushikaka-agri":        "#2e7d32",  // green

  // Logistics
  "shakti-logistics":       "#f57c00",  // orange

  // Media / Agency
  "pixelloid-creations":    "#d81b60",  // pink
  "studio-ninetyone":       "#3949ab",  // indigo

  // Fintech / Edtech / Community
  "nashik-finserv":         "#1565c0",  // finance blue
  "vidyarambh-edutech":     "#ef6c00",  // edtech orange
  "ciie-iccs-nashik":       "#00695c",  // incubator teal
  "startup-nashik":         "#558b2f",  // community green
};

/**
 * Returns a vibrant brand color for a company. Falls back to a
 * per-sector palette, then a hash-based fallback.
 */
export function pinColor(c: Company): string {
  if (BRAND_COLORS[c.id]) return BRAND_COLORS[c.id];

  const SECTOR_COLOR: Record<string, string> = {
    "Software / IT":   "#1e88e5",
    "AI / ML":         "#7c3aed",
    "SaaS":            "#0891b2",
    "Edtech":          "#db2777",
    "Manufacturing":   "#475569",
    "Automotive":      "#b91c1c",
    "Pharma":          "#0d9488",
    "Food & Beverage": "#6a1b9a",
    "AgriTech":        "#16a34a",
    "Healthtech":      "#059669",
    "Logistics":       "#ca8a04",
    "Media / VFX":     "#9333ea",
    "Creative Agency": "#ec4899",
    "Fintech":         "#1e40af",
    "Incubator":       "#0e7490",
    "Community":       "#65a30d",
  };
  if (SECTOR_COLOR[c.sector]) return SECTOR_COLOR[c.sector];

  // last-resort hash color
  let h = 0;
  for (const ch of c.id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const palette = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
  return palette[Math.abs(h) % palette.length];
}

/**
 * The Bangalore map shows a single big letter per company on its pin.
 */
export function companyLetter(c: Company): string {
  const name = c.name.trim();
  if (/^[A-Z&]{2,5}/.test(name)) {
    const m = name.match(/[A-Z&]/);
    if (m) return m[0];
  }
  return name.charAt(0).toUpperCase();
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}