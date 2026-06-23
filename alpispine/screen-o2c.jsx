/* ============================================================
   Screen — Booking-to-Travel (reimagined) · KPI scorecards
   The operator-side measurement layer for the customer B2T
   experience: perfect-trip, on-time departure, days-to-cash,
   touchless %, and the three productized platform teams.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Badge } = UI;

  const HERO = [
    { k: "Perfect-trip rate", v: "94.2%", d: "+3.1 pts", up: true, sub: "complete · on-time · accurate · promise kept" },
    { k: "On-time departure", v: "96.8%", d: "+2.4 pts", up: true, sub: "departed as promised · deliver-to-promise" },
    { k: "Touchless booking %", v: "78%", d: "+22 pts", up: true, sub: "no human keying or coordination" },
    { k: "Days to cash", v: "41 days", d: "−6 days", up: true, sub: "event-driven invoicing → faster cash" },
  ];
  const SECONDARY = [
    ["Promise accuracy", "97%", "committed dates vs. actual"],
    ["Exception rate", "4.1%", "bookings needing intervention"],
    ["Quote cycle time", "4.8 min", "inquiry → branded proposal"],
    ["Revenue leakage", "0.6%", "pricing & commission accuracy"],
    ["Self-service utilisation", "71%", "changes made without a ticket"],
    ["AI-assisted decisions", "12.4k/wk", "allocation · re-pointing · risk"],
  ];
  const TEAMS = [
    { name: "Agency Booking Platform", color: "#29707A", tint: "var(--k-ai-spruce-12)", icon: "chat-bot",
      owns: "EasyBook · APIs · self-service · booking experience",
      kpis: [["Digital adoption", "84%"], ["Quote cycle time", "4.8 min"], ["Agency CSAT", "4.6/5"]] },
    { name: "Intelligent Fulfilment Platform", color: "#B45309", tint: "#FEF3E2", icon: "network",
      owns: "Allotments · allocation · orchestration · Neos rotations",
      kpis: [["On-time departure", "96.8%"], ["Fulfilment cost", "−7%"], ["Allotment fill", "86.4%"]] },
    { name: "Revenue Automation Platform", color: "#6B36A8", tint: "#F0E6FA", icon: "document-chart",
      owns: "Invoicing · commissions · disputes · payment",
      kpis: [["Days to cash", "41 d"], ["Invoice accuracy", "99.4%"], ["Collections efficiency", "+11%"]] },
  ];
  const INTEL = [
    ["Predict departure slips", "Customer retention", "Low risk · 8% on open bookings"],
    ["Optimise allotment allocation", "Margin improvement", "Constraint solver by covenant & margin"],
    ["Dynamic pricing", "Revenue optimisation", "Seat-tightness signals on rebooking windows"],
    ["Demand prediction (digital twin)", "Commitment accuracy", "Simulates closures, spikes, sell-outs"],
  ];

  function ScreenO2C({ seeCustomer }) {
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Reimagined booking-to-travel · revenue execution</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Booking-to-Travel scorecard</h1>
            <div className="ph-sub">The customer experience is one booking behaving like a live revenue object. Here is the operator measurement behind it — perfect-trip, promise accuracy, touchless flow and cash, plus the three productized platforms that own the journey end to end.</div>
          </div>
          {seeCustomer && <button className="ab" style={{ alignSelf: "flex-start" }} onClick={seeCustomer}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> See the customer booking ↗</button>}
        </div>

        {/* hero KPIs */}
        <div className="o2c-kpis">
          {HERO.map((k, i) => (
            <div className="o2c-kpi" key={i}>
              <div className="kk">{k.k}</div>
              <div className="kv">{k.v}</div>
              <div className={`kd ${k.up ? "up" : "down"}`}><Icon name="arrow-up-right" size={12} /> {k.d}</div>
              <div className="ks">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* secondary metric strip */}
        <div className="o2c-strip">
          {SECONDARY.map((s, i) => (
            <div className="o2c-sm" key={i}><span className="v">{s[1]}</span><span className="k">{s[0]}</span><span className="d">{s[2]}</span></div>
          ))}
        </div>

        {/* productized teams */}
        <div className="spine-eyebrow" style={{ marginTop: 22 }}><span className="se-l">Productized B2T organization</span><span className="se-r">Not siloed departments — three platform teams owning the value stream, each with the KPIs they're accountable for.</span></div>
        <div className="o2c-teams">
          {TEAMS.map((t, i) => (
            <div className="o2c-team" key={i} style={{ borderTop: `3px solid ${t.color}` }}>
              <div className="tt"><span className="ti" style={{ background: t.tint, color: t.color }}><Icon name={t.icon} size={18} /></span><b>{t.name}</b></div>
              <div className="to">{t.owns}</div>
              <div className="tk">{t.kpis.map((k, j) => <div className="tkr" key={j}><span>{k[0]}</span><b>{k[1]}</b></div>)}</div>
            </div>
          ))}
        </div>

        {/* intelligence layer */}
        <div className="panel" style={{ padding: 18, marginTop: 18 }}>
          <Eyebrow>Intelligence layer · live models</Eyebrow>
          <table className="o2c-itable">
            <thead><tr><th>Model</th><th>Business value</th><th>Status</th></tr></thead>
            <tbody>
              {INTEL.map((r, i) => (
                <tr key={i}><td className="m"><span className="ai-glyph" style={{ width: 12, height: 12 }} /> {r[0]}</td><td>{r[1]}</td><td className="s"><Badge tone="spruce">{r[2]}</Badge></td></tr>
              ))}
            </tbody>
          </table>
          <div className="ev-note">Automation is the enabler, not the goal — these models exist to make better commitments, protect margin and tell agencies before anything slips.</div>
        </div>
      </div>
    );
  }
  UI.ScreenO2C = ScreenO2C;
})();
