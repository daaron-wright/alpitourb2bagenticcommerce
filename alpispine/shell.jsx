/* ============================================================
   AppShell — Alpitour chrome, Operator↔Customer lens
   toggle, single-record indicator, per-lens nav, KPI strip
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon } = UI;

  const NAV = {
    ops: [
      { group: "The agentic spine" },
      { id: "brd", label: "Operating Playbook · Upload", icon: "document-chart" },
      { id: "spine", label: "The spine", icon: "network" },
      { id: "ontology", label: "Group ontology", icon: "network" },
      { id: "flow", label: "TravelRadar", icon: "anomaly", badge: "live", badgeTone: "spruce" },
      { group: "Governance" },
      { id: "governance", label: "Policy as Code", icon: "document-chart" },
      { id: "backtest", label: "Backtest lab", icon: "anomaly" },
      { id: "queue", label: "Planner queue", icon: "group", badge: "1", badgeTone: "amber" },
      { id: "learning", label: "Learned from you", icon: "recommend", badge: "4", badgeTone: "spruce" },
      { group: "Operating model" },
      { id: "udp", label: "Unified data platform", icon: "analytics", badge: "live", badgeTone: "spruce" },
      { id: "o2c", label: "Booking-to-Travel scorecard", icon: "analytics", badge: "live", badgeTone: "spruce" },
      { id: "controls", label: "Controls & evidence", icon: "document-chart" },
    ],
    cx: [
      { group: "Your trip" },
      { id: "customer", label: "Trip status", icon: "group" },
    ],
  };

  function LensToggle({ lens, setLens, dark }) {
    return (
      <div className={`lens-toggle ${dark ? "on-dark" : ""}`} role="tablist" aria-label="Lens">
        <button className={`lens-opt ops ${lens === "ops" ? "on" : ""}`} onClick={() => setLens("ops")}>
          <Icon name="dashboard" size={15} /> Operator <small>· back end</small>
        </button>
        <button className={`lens-opt cx ${lens === "cx" ? "on" : ""}`} onClick={() => setLens("cx")}>
          <Icon name="group" size={15} /> Customer <small>· front end</small>
        </button>
      </div>
    );
  }
  UI.LensToggle = LensToggle;

  // Shared single-orchestration-record indicator — identical in both lenses.
  function RecordPill({ dark }) {
    const D = window.D;
    return (
      <div className={`rec-pill ${dark ? "on-dark" : ""}`} title="One orchestration record — both lenses read this trace">
        <span className="pulse" />
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span className="rp-id">{D.event.trace}</span>
        </span>
      </div>
    );
  }
  UI.RecordPill = RecordPill;

  function AppShell({ lens, setLens, screen, setScreen, collapsed, setCollapsed, children }) {
    const D = window.D;
    const nav = NAV[lens];
    // Customer lens renders the full-bleed Alpitour front end — no operator chrome.
    if (lens === "cx") return <div className="app-cx">{children}</div>;
    return (
      <div className={`app ${collapsed ? "nav-collapsed" : ""}`}>
        {/* Brand */}
        <div className="brandcell">
          <img className="brand-dow-logo" src="assets/alpitour-logo.png" alt="Alpitour" />
        </div>

        {/* Topbar */}
        <div className="topbar">
          <button className="collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand navigation" : "Collapse navigation"}>
            <UI.Stroke size={16} sw={2.2} children={collapsed ? <polyline points="9 6 15 12 9 18" /> : <polyline points="15 6 9 12 15 18" />} />
          </button>

          {/* Orchestration record — only on the use-case screens (spine + reference flow) */}
          {(screen === "spine" || screen === "flow") && <RecordPill />}

          <div className="topbar-spacer" />

          <LensToggle lens={lens} setLens={setLens} />
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {nav.map((n, i) =>
            n.group ? (
              <div className="nav-eyebrow" key={i}>{n.group}</div>
            ) : (
              <button key={n.id} className={`nav-item ${screen === n.id ? "active" : ""}`}
                onClick={() => setScreen(n.id)} title={n.label}>
                <Icon name={n.icon} size={18} />
                <span className="nav-label">{n.label}</span>
                {n.badge && <span className={`nav-badge ${n.badgeTone || ""}`}>{n.badge}</span>}
              </button>
            )
          )}
          <div className="nav-spacer" />
          {!collapsed && (
            <div style={{ padding: "10px", borderTop: "1px solid var(--k-cool-gray-20)", marginTop: 8 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, color: "var(--fg-subtle)", marginBottom: 6 }}>Powered by</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="ai-glyph" />
                <span style={{ fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.3 }}>Kyndryl Agentic Framework <br /><span style={{ color: "var(--fg-muted)", fontSize: 10 }}>KAF agents · PAC policy</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="main">
          <div className="main-wrap">{children}</div>
        </div>
      </div>
    );
  }
  UI.AppShell = AppShell;
})();
