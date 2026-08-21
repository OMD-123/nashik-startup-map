import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: "starter",
    name: "Starter Boost",
    price: 499,
    days: 7,
    perks: [
      "Orange ring + label 'Boosted' on your pin",
      "Shown at the top of search for 7 days",
      "Up to 5 'Hiring' highlights",
    ],
  },
  {
    id: "growth",
    name: "Growth Boost",
    price: 1499,
    days: 30,
    popular: true,
    perks: [
      "Everything in Starter",
      "Featured in weekly newsletter",
      "Priority in /jobs page (top 3)",
      "Custom pin color",
      "30-day visibility",
    ],
  },
  {
    id: "premium",
    name: "Premium Boost",
    price: 4999,
    days: 90,
    perks: [
      "Everything in Growth",
      "Logo on home page footer",
      "Push notification to job-alert subscribers",
      "90-day visibility",
      "Dedicated account manager",
    ],
  },
];

export function BoostModal({ open, onClose }: Props) {
  const [step, setStep] = useState<"select" | "pay" | "success">("select");
  const [chosen, setChosen] = useState<typeof PLANS[number] | null>(null);
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [boostedIds, setBoostedIds] = useState<string[]>([]);

  if (!open) return null;

  const onChoose = (plan: typeof PLANS[number]) => {
    setChosen(plan);
    setStep("pay");
  };

  const onPay = async () => {
    if (!chosen || !company.trim()) return;
    setProcessing(true);
    // Simulated Razorpay / Stripe payment flow.
    // In production: POST /api/boost/checkout -> returns order id ->
    // open Razorpay/Stripe checkout -> on success webhook -> mark company as boosted.
    await new Promise((r) => setTimeout(r, 1500));
    setBoostedIds((ids) => [...ids, company]);
    setProcessing(false);
    setStep("success");
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep("select");
      setChosen(null);
      setCompany("");
      setPhone("");
      setProcessing(false);
    }, 250);
  };

  return (
    <div className="boost-scrim" onClick={close}>
      <div className="boost-panel" onClick={(e) => e.stopPropagation()}>
        <button className="boost-close" onClick={close} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>

        {step === "select" && (
          <>
            <header>
              <h2>Boost your Nashik company</h2>
              <p>Get discovered by students and job-seekers. Pay once, get listed at the top.</p>
            </header>

            <div className="plans">
              {PLANS.map((p) => (
                <article
                  key={p.id}
                  className={`plan ${p.popular ? "popular" : ""}`}
                  onClick={() => onChoose(p)}
                >
                  {p.popular && <span className="ribbon">Most popular</span>}
                  <h3>{p.name}</h3>
                  <div className="price">₹ {p.price.toLocaleString("en-IN")}</div>
                  <div className="duration">{p.days} days</div>
                  <ul>
                    {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
                  </ul>
                  <button className="plan-cta">Choose</button>
                </article>
              ))}
            </div>
          </>
        )}

        {step === "pay" && chosen && (
          <>
            <header>
              <h2>Complete payment</h2>
              <p>{chosen.name} — ₹ {chosen.price.toLocaleString("en-IN")} for {chosen.days} days</p>
            </header>

            <form
              onSubmit={(e) => { e.preventDefault(); onPay(); }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <Field label="Company name *">
                <input
                  className="boost-input"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. My Nashik Startup"
                />
              </Field>

              <Field label="Phone">
                <input
                  className="boost-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </Field>

              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 12,
                  color: "#7c2d12",
                }}
              >
                <strong>Test mode:</strong> this is a demo. Clicking Pay will simulate a successful Razorpay/Stripe charge — no real money moves.
              </div>

              <button
                type="submit"
                disabled={processing || !company.trim()}
                className="boost-pay"
              >
                {processing
                  ? "Processing payment…"
                  : `Pay ₹ ${chosen.price.toLocaleString("en-IN")} & activate`}
              </button>

              <button
                type="button"
                onClick={() => setStep("select")}
                disabled={processing}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: 13,
                  cursor: processing ? "not-allowed" : "pointer",
                }}
              >
                ← Back to plans
              </button>
            </form>
          </>
        )}

        {step === "success" && chosen && (
          <div className="boost-success">
            <div className="check">✓</div>
            <h2>You're boosted!</h2>
            <p>
              <strong>{chosen.name}</strong> is now active for <strong>{company}</strong>.<br/>
              Your pin is highlighted on the map. {chosen.days}-day countdown starts now.
            </p>
            <button className="boost-pay" onClick={close}>Done</button>
          </div>
        )}
      </div>

      <style>{`
        .boost-scrim {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          z-index: 1500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .boost-panel {
          background: #ffffff;
          border-radius: 18px;
          width: 100%;
          max-width: 720px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          padding: 32px;
          position: relative;
          box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        }
        .boost-close {
          position: absolute;
          top: 14px; right: 14px;
          background: #f1f5f9;
          border: none;
          width: 32px; height: 32px;
          border-radius: 50%;
          display: grid; place-items: center;
          color: #475569;
          cursor: pointer;
        }
        .boost-close:hover { background: #e2e8f0; }
        .boost-panel header { margin-bottom: 24px; }
        .boost-panel header h2 {
          margin: 0 0 6px;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .boost-panel header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .plans {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }
        .plan {
          position: relative;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px 16px;
          cursor: pointer;
          transition: all 0.15s;
          background: #ffffff;
        }
        .plan:hover {
          border-color: #ff6a1a;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 106, 26, 0.15);
        }
        .plan.popular {
          border-color: #ff6a1a;
          background: linear-gradient(180deg, #fff7ed 0%, #ffffff 50%);
        }
        .plan .ribbon {
          position: absolute;
          top: -10px; right: 12px;
          background: #ff6a1a;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }
        .plan h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }
        .plan .price {
          font-size: 28px;
          font-weight: 800;
          color: #ff6a1a;
        }
        .plan .duration {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 14px;
        }
        .plan ul {
          list-style: none;
          padding: 0;
          margin: 0 0 14px;
          font-size: 12px;
          color: #475569;
        }
        .plan ul li {
          padding: 4px 0;
          padding-left: 18px;
          position: relative;
          line-height: 1.4;
        }
        .plan ul li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #16a34a;
          font-weight: 800;
        }
        .plan-cta {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 9999px;
          background: #0f172a;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }
        .plan.popular .plan-cta { background: #ff6a1a; }
        .boost-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          margin-top: 4px;
        }
        .boost-input:focus { border-color: #ff6a1a; box-shadow: 0 0 0 3px rgba(255, 106, 26, 0.18); }
        .boost-pay {
          padding: 14px;
          border: none;
          border-radius: 9999px;
          background: #ff6a1a;
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 106, 26, 0.3);
        }
        .boost-pay:disabled { opacity: 0.5; cursor: not-allowed; }
        .boost-success { text-align: center; padding: 20px 0; }
        .boost-success .check {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #16a34a;
          color: #ffffff;
          font-size: 32px;
          font-weight: 800;
          display: grid; place-items: center;
          margin: 0 auto 20px;
        }
        .boost-success h2 {
          margin: 0 0 12px;
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
        }
        .boost-success p {
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 24px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
        {label}
      </span>
      {children}
    </label>
  );
}