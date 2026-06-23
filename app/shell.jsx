/* ============================================================
   AppShell — sidebar nav, co-brand header, role switcher
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Avatar } = UI;

  const NAV = [
    { group: "Customer experience" },
    { id: "intake", label: "Intent capture", icon: "chat-bot" },
    { id: "recommend", label: "Recommendation", icon: "recommend" },
    { id: "timeline", label: "Order case", icon: "network" },
    { group: "Governance & operations" },
    { id: "policy", label: "Policy as Code", icon: "document-chart", badge: "1", badgeTone: "amber" },
    { id: "exceptions", label: "Exceptions", icon: "warning-alt", badge: "4" },
    { id: "learning", label: "Learned from you", icon: "lightbulb" },
  ];

  function AppShell({ screen, setScreen, role, setRole, collapsed, setCollapsed, children }) {
    const DATA = window.DATA;
    const [roleOpen, setRoleOpen] = React.useState(false);
    const roleRef = React.useRef(null);
    React.useEffect(() => {
      function onDoc(e) { if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false); }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);
    const cur = DATA.roles.find(r => r.id === role) || DATA.roles[0];

    return (
      <div className={`app ${collapsed ? "nav-collapsed" : ""}`}>
        {/* Brand */}
        <div className="brandcell">
          <span className="brand-dow">Dow</span>
          {!collapsed && <span className="brand-div" />}
          {!collapsed && (
            <span className="brand-sub">
              <span className="b1">Sample-to-Ship</span>
              <span className="b2">Orchestration · Kyndryl AF</span>
            </span>
          )}
        </div>

        {/* Topbar */}
        <div className="topbar">
          <button className="collapse-btn" onClick={() => setCollapsed(c => !c)} title="Toggle navigation">
            <UI.Stroke size={16} d="M3 6h18M3 12h18M3 18h18" />
          </button>
          <div className="case-chip">
            <Icon name="network" size={14} style={{ color: "var(--k-spruce-60)" }} />
            <span className="cc-id">{DATA.kase.id}</span>
            <span className="cc-cust">{DATA.kase.customer}</span>
            <span className="cc-sap">{DATA.kase.sapRef}</span>
          </div>
          <div className="topbar-spacer" />
          <div className="kpi-mini">
            {DATA.kpis.map((k, i) => (
              <div className="km" key={i}>
                <span className="v tnum">{k.value}</span>
                <span className="l">{k.label}</span>
              </div>
            ))}
          </div>
          <div className="role-switch" ref={roleRef}>
            <button className="role-btn" onClick={() => setRoleOpen(o => !o)}>
              <Avatar initials={cur.initials} color={cur.color} />
              <span className="rb-meta">
                <span className="rb-name">{cur.name}</span>
                <span className="rb-title">{cur.title}</span>
              </span>
              <UI.Stroke size={13} d="M6 9l6 6 6-6" style={{ color: "var(--fg-muted)" }} />
            </button>
            {roleOpen && (
              <div className="role-menu">
                <div className="rm-head">View as role · asymmetric access</div>
                {DATA.roles.map(r => (
                  <button key={r.id} className={`role-opt ${r.id === role ? "sel" : ""}`}
                    onClick={() => { setRole(r.id); setRoleOpen(false); }}>
                    <Avatar initials={r.initials} color={r.color} size={32} />
                    <span style={{ flex: 1 }}>
                      <div className="ro-name">{r.name}</div>
                      <div className="ro-title">{r.title} · {r.team}</div>
                    </span>
                    {r.id === role && <Icon name="checkmark-filled" size={16} style={{ color: "var(--k-spruce-60)" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {NAV.map((n, i) =>
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
                <span style={{ fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.3 }}>Kyndryl Agentic Framework <br /><span style={{ color: "var(--fg-muted)", fontSize: 10 }}>orchestration runtime</span></span>
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
