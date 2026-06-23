/* ============================================================
   Account — the customer's home: active application cases,
   order/sample history, reorder prompt, agent suggestions.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke } = UI;

  const HISTORY = [
    { id: "SR-20418", product: "INFUSE™ 9107", qty: "2 kg sample", kind: "Footwear · Round 2", date: "28 May", status: "In transit", tone: "info" },
    { id: "PO-47002", product: "ENGAGE™ 7467", qty: "25 kg", kind: "Mobility · production", date: "06 Mar", status: "Delivered", tone: "ok" },
    { id: "SR-19980", product: "AFFINITY™ PL 1881G", qty: "1 kg sample", kind: "Packaging · qualification", date: "14 Feb", status: "Delivered", tone: "ok" },
  ];

  function statusBadge(s, tone) {
    const map = { ok: "green", info: "spruce", warn: "amber" };
    return <span className={`b ${map[tone] || "gray"}`}><span className="dot" style={{ background: tone === "ok" ? "var(--k-status-success-110)" : tone === "info" ? "var(--k-spruce-60)" : "var(--k-status-warning-110)" }} />{s}</span>;
  }

  function Account({ onNav, onAskAgent, toast }) {
    const D = window.DX;
    const a = D.account;
    return (
      <div className="dx-scroll fade-in">
        <div className="dx-acct-head">
          <div className="dx-acct-head-in">
            <span className="dx-acct-av">{a.initials}</span>
            <div className="at"><h1>{a.name}</h1><span>{a.role} · {a.company} · {a.since}</span></div>
            <div style={{ marginLeft: "auto" }}><button className="dx-btn ai" onClick={() => onAskAgent({ fresh: true })}><span className="dx-spark">✦</span> Open ChemAssist</button></div>
          </div>
        </div>

        <div className="dx-wrap">
          <div className="dx-acct-grid">
            <div>
              <div className="dx-card">
                <div className="ch"><Icon name="document-chart" size={17} style={{ color: "var(--dow-red)" }} /><h3>Active application cases</h3><span className="more" onClick={() => onNav({ name: "cases" })}>View all cases</span></div>
                {D.cases.map(c => (
                  <div className="dx-orow" key={c.code} onClick={() => onNav({ name: "case", code: c.code })} style={{ cursor: "pointer" }}>
                    <span className={`oi ${c.env === "plant" ? "" : ""}`} style={c.env === "plant" ? { background: "var(--k-warm-red-10)", color: "var(--k-warm-red-60)" } : null}><Icon name={c.icon} size={16} /></span>
                    <div className="om"><b>{c.title}</b><span>{c.code} · {D.typeById(c.type).name} · {D.spine[c.stage]}</span></div>
                    <div className="ostat">{statusBadge(c.status, c.env === "plant" ? "warn" : "info")}<Stroke size={15} d="M5 12h14M13 6l6 6-6 6" style={{ color: "var(--dx-subtle)" }} /></div>
                  </div>
                ))}
              </div>

              <div className="dx-card">
                <div className="ch"><Icon name="network" size={17} style={{ color: "var(--dow-red)" }} /><h3>Orders & samples</h3><span className="more">View all</span></div>
                {HISTORY.map(o => (
                  <div className="dx-orow" key={o.id}>
                    <span className="oi"><Icon name={o.id.startsWith("SR") ? "lightbulb" : "network"} size={16} /></span>
                    <div className="om"><b>{o.product}</b><span>{o.id} · {o.qty} · {o.kind}</span></div>
                    <div className="ostat">{statusBadge(o.status, o.tone)}<span className="odate">{o.date}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <aside>
              <div className="dx-side-ai" style={{ marginBottom: 16 }} onClick={() => onNav({ name: "o2c" })}>
                <div className="h"><span className="ai-glyph" /><b>Track an order live</b></div>
                <p>PO-48261 (INFUSE™ 9107) is in autonomous fulfilment — real-time promise, proactive alerts, self-service changes.</p>
                <button className="dx-btn ai sm"><span className="dx-spark">✦</span> Open order-to-cash</button>
              </div>
              <div className="dx-card">
                <div className="ch"><h3>Account</h3></div>
                <p style={{ fontSize: 12.5, color: "var(--dx-muted)", lineHeight: 1.55, margin: "0 0 12px" }}>{a.mandate}</p>
                {[["Company", a.company], ["Division", a.division], ["Region", a.region], ["Email", a.email], ["Tier", "Strategic account"]].map(([k, v]) => (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", fontSize: 13, borderBottom: "1px solid var(--dx-line)" }} key={k}><span style={{ color: "var(--dx-muted)" }}>{k}</span><span style={{ color: "var(--dow-ink)", fontWeight: 500, textAlign: "right" }}>{v}</span></div>
                ))}
                <button className="dx-btn ghost sm" style={{ width: "100%", marginTop: 12 }} onClick={() => { window.location.href = "Dow Supply Chain on KAF.html"; }}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Open operator view</button>
              </div>
            </aside>
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.Account = Account;
})();
