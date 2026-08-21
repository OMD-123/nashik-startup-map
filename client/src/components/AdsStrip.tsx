/**
 * Subtle bottom ad strip — sponsor-style cards (placeholders for the
 * Bangalore map look). Each "AD" label makes it clear these are not
 * search results.
 */
export function AdsStrip() {
  const ads = [
    { label: "AD", name: "Winjit", bg: "#0a2540", text: "#ff6a1a" },
    { label: "AD", name: "Sula", bg: "#6a1b9a", text: "#fff" },
    { label: "AD", name: "CIIE", bg: "#0d9488", text: "#fff" },
  ];
  return (
    <div className="ads-strip">
      {ads.map((a) => (
        <div
          key={a.name}
          className="ads-card"
          style={{ background: a.bg, color: a.text, borderColor: "transparent" }}
        >
          <span
            className="label"
            style={{
              position: "absolute",
              top: 4,
              left: 6,
              fontSize: 9,
              background: "rgba(0,0,0,0.4)",
              color: "#fff",
              padding: "1px 5px",
              borderRadius: 4,
            }}
          >
            {a.label}
          </span>
          <strong style={{ fontSize: 13, fontWeight: 800 }}>{a.name}</strong>
          <span style={{ fontSize: 9, opacity: 0.7 }}>Boost</span>
        </div>
      ))}
    </div>
  );
}