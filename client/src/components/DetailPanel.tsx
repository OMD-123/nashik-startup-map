import { useEffect } from "react";
import type { Company } from "../types";
import { companyLetter, pinColor } from "../utils";

interface Props {
  company: Company | null;
  onClose: () => void;
}

export function DetailPanel({ company, onClose }: Props) {
  useEffect(() => {
    if (!company) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [company, onClose]);

  if (!company) return null;
  const c = company;
  const color = pinColor(c);

  return (
    <>
      <div className="detail-scrim open" onClick={onClose} />
      <aside className="detail-panel open" role="dialog" aria-label={`Details for ${c.name}`}>
        <button className="detail-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>

        <div className="detail-hero" style={{ background: color }}>
          <div className="detail-letter">{companyLetter(c)}</div>
          <div className="detail-hero-meta">
            <div className="detail-type">{c.type === "startup" ? "Startup" : "Company"}</div>
            {c.hiring && <span className="detail-hiring">Hiring</span>}
          </div>
        </div>

        <div className="detail-body">
          <h2 className="detail-name">{c.name}</h2>
          <p className="detail-meta">{c.sector} · {c.area}</p>

          <p className="detail-desc">{c.description}</p>

          <div className="detail-stats">
            <Stat label="Founded" value={c.founded} />
            <Stat label="Size" value={c.size} />
            <Stat label="Stage" value={c.stage} />
          </div>

          {c.roles.length > 0 && (
            <div className="detail-section">
              <h3>Open roles</h3>
              <div className="detail-roles">
                {c.roles.map((r) => (
                  <span key={r} className="detail-role-chip">{r}</span>
                ))}
              </div>
            </div>
          )}

          {c.address && (
            <div className="detail-section">
              <h3>Address</h3>
              <p>{c.address}</p>
            </div>
          )}

          <div className="detail-actions">
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="detail-btn primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7M21 3l-9 9M10 14l-7 7m17-7v7H13" />
                </svg>
                Visit Website
              </a>
            )}
            <a
              href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=15/${c.lat}/${c.lng}`}
              target="_blank"
              rel="noreferrer"
              className="detail-btn secondary"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.4-2.7A2 2 0 013 15.5V6a2 2 0 012-2h14a2 2 0 012 2v9.5a2 2 0 01-1 1.8L15 20l-3-2-3 2z" />
              </svg>
              Open in Maps
            </a>
          </div>
        </div>
      </aside>

      <style>{`
        .detail-scrim {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.0);
          z-index: 1100;
          pointer-events: none;
          transition: background 0.25s;
        }
        .detail-scrim.open {
          background: rgba(15, 23, 42, 0.35);
          pointer-events: auto;
        }
        .detail-panel {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 380px;
          max-width: 90vw;
          background: #ffffff;
          z-index: 1200;
          box-shadow: 4px 0 24px rgba(15, 23, 42, 0.2);
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(.4, 0, .2, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .detail-panel.open { transform: translateX(0); }
        .detail-close {
          position: absolute;
          top: 14px; right: 14px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.92);
          border: none;
          width: 32px; height: 32px;
          border-radius: 50%;
          display: grid; place-items: center;
          color: #475569;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .detail-close:hover { color: #0f172a; }
        .detail-hero {
          height: 120px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          color: #ffffff;
          flex-shrink: 0;
        }
        .detail-letter {
          font-size: 56px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          opacity: 0.95;
        }
        .detail-hero-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }
        .detail-type {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(255,255,255,0.2);
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .detail-hiring {
          background: #16a34a;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          border-radius: 9999px;
          color: #ffffff;
        }
        .detail-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px 24px;
        }
        .detail-name {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
        }
        .detail-meta {
          margin: 4px 0 14px;
          font-size: 13px;
          color: #64748b;
        }
        .detail-desc {
          font-size: 14px;
          line-height: 1.55;
          color: #334155;
          margin: 0 0 18px;
        }
        .detail-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 22px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 10px;
        }
        .detail-stats .label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .detail-stats .value {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .detail-section {
          margin-bottom: 20px;
        }
        .detail-section h3 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748b;
          margin: 0 0 10px;
        }
        .detail-section p {
          font-size: 13px;
          color: #334155;
          margin: 0;
        }
        .detail-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .detail-role-chip {
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 9999px;
        }
        .detail-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .detail-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
        }
        .detail-btn.primary {
          background: #ff6a1a;
          color: #ffffff;
          border: none;
          box-shadow: 0 2px 8px rgba(255, 106, 26, 0.3);
        }
        .detail-btn.primary:hover {
          background: #e85a0f;
        }
        .detail-btn.secondary {
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }
        .detail-btn.secondary:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }
      `}</style>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}