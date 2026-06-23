/* ============================================================
   Screen — Exception workspace (revenue-at-risk command center)
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Badge, Sev, Packet, Button, Eyebrow } = UI;

  function ExcItem({ e, sel, onClick }) {
    return (
      <div className={`exc-item ${sel ? "sel" : ""}`} onClick={onClick}>
        <div className={`exc-bar ${e.sev}`} />
        <div>
          <div className="exc-type">{e.type} <Sev level={e.sev} /></div>
          <div className="exc-sub">{e.id} · {e.customer} · {e.caseId}</div>
        </div>
        <div className="exc-rev">
          <div className="rv tnum">{e.revenue}</div>
          <div className="sl">{e.sla}</div>
        </div>
      </div>
    );
  }

  function Detail({ e, resolved, onResolve, toast }) {
    return (
      <div className="exc-detail">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: 0 }}>{e.type}</h3>
              <Sev level={e.sev} />
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 3, fontFamily: "var(--font-mono)" }}>{e.id} · {e.caseId} · {e.customer}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--fg-1)" }}>{e.revenue}</div>
            <div style={{ fontSize: 11, color: "var(--k-warm-red-60)", fontWeight: 600 }}>{e.sla}</div>
          </div>
        </div>

        <div className="exc-block"><div className="lbl">Root cause</div><p>{e.cause}</p></div>
        <div className="exc-block"><div className="lbl">Impact</div><p>{e.impact}</p></div>

        <div className="exc-block">
          <div className="lbl">Evidence</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {e.evidence.map((ev, i) => <span className="evchip" key={i}><Icon name="document-chart" size={12} />{ev}</span>)}
          </div>
        </div>

        {/* Agent recommendation — amber HumanInputRequest pattern */}
        {!resolved ? (
          <div style={{ borderRadius: 10, padding: "14px 16px", border: "1px solid #F8DC8E", background: "linear-gradient(180deg,#FEF7E6,#FEFCF3)", marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FEF3C7", color: "#7A4800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="ai-glyph" style={{ width: 12, height: 12 }} />
              </span>
              <span style={{ fontSize: 11, color: "#7A4800", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Agent recommends · needs your call</span>
              <span style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{e.owner}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--fg-1)", margin: "0 0 10px", fontWeight: 500 }}>{e.recommendation}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {e.options.map((o, i) => (
                <button key={i} className={`btn sm ${i === 0 ? "prim" : ""}`}
                  onClick={() => { if (i === 0) { onResolve(); toast(`Resolved ${e.id} · ${o} → logged to Learned from you`); } else toast(`${o} · routed`); }}>
                  {o}
                </button>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#7A4800", fontFamily: "var(--font-mono)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B45309" }} />blocking · agent paused
              </span>
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: 10, padding: "14px 16px", border: "1px solid var(--k-status-success-20)", background: "var(--k-status-success-10)", marginTop: 4 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="checkmark-filled" size={18} style={{ color: "var(--k-status-success-100)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--k-status-success-110)" }}>Resolved · reroute approved to Plaquemine</div>
                <div style={{ fontSize: 11.5, color: "var(--k-status-success-110)", marginTop: 2 }}>Promise date protected · revised ETA pushed to the customer-safe timeline · reason code logged.</div>
              </div>
            </div>
          </div>
        )}

        <div className="row" style={{ marginTop: 14 }}>
          <Button variant="ghost" size="sm" icon="group" onClick={() => toast("Swarm opened · 3 owners invited")}>Swarm</Button>
          <Button variant="ghost" size="sm" onClick={() => toast("Reassigned")}>Reassign</Button>
          <Button variant="ghost" size="sm" onClick={() => toast("Customer notified with revised ETA")}>Notify customer</Button>
        </div>
      </div>
    );
  }

  function ScreenExceptions({ toast }) {
    const list = window.DATA.exceptions;
    const [selId, setSelId] = React.useState(list[0].id);
    const [resolved, setResolved] = React.useState({});
    const sel = list.find(e => e.id === selId);
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Operations · revenue-at-risk command center</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Exceptions</h1>
            <div className="ph-sub">Most leakage happens in the edge cases. This is a command center, not a ticket queue — sorted by revenue at risk and SLA breach, with a fused timeline and the agent's recommended recovery already drafted.</div>
          </div>
          <div className="ph-spacer" />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--k-warm-red-60)" }}>$2.7M</div>
            <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>total revenue at risk · 4 open</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 18, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Eyebrow>Open exceptions · by revenue at risk</Eyebrow>
              <span className="b gray"><Icon name="filter" size={12} /> SLA</span>
            </div>
            <div className="exc-list">
              {list.map(e => <ExcItem key={e.id} e={e} sel={e.id === selId} onClick={() => setSelId(e.id)} />)}
            </div>
          </div>
          <Detail e={sel} resolved={!!resolved[sel.id]} onResolve={() => setResolved(r => ({ ...r, [sel.id]: true }))} toast={toast} />
        </div>
      </div>
    );
  }
  UI.ScreenExceptions = ScreenExceptions;
})();
