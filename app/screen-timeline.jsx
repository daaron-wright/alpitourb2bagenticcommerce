/* ============================================================
   Screen — Unified order case (single source of truth)
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Badge, Packet, Button, Eyebrow } = UI;

  function OwnerStrip() {
    return (
      <div className="owner-strip">
        {window.DATA.ownership.map((o, i) => (
          <div className="owner-cell" key={i}>
            <span className={`oc-role ${o.role}`}>{o.role}</span>
            <div className="oc-layer">{o.layer}</div>
            <div className="oc-owner">{o.owner}</div>
            <div className="oc-note">{o.note}</div>
          </div>
        ))}
      </div>
    );
  }

  function PhaseRow({ p, last, policyState }) {
    let status = p.status;
    let detail = p.detail;
    let owner = p.owner;
    let agent = p.agent;
    if (p.packet === "Policy") {
      if (policyState === "green") { status = "done"; detail = "All policy checks passed. Cleared for SAP release."; agent = "Auto rule check — cleared"; }
      else if (policyState === "red") { status = "review"; detail = "Restricted-party match on consignee. Order blocked pending disposition."; }
    }
    if (p.packet === "Execution" && policyState === "green") { status = "active"; detail = "Sales order syncing to SAP — delivery block release in progress."; }
    return (
      <div className={`tl-row ${status}`}>
        <div className="tl-time">{p.ts}</div>
        <div className="tl-rail">
          <div className="ln top" />
          <div className="node" />
          {!last && <div className="ln" />}
        </div>
        <div className="tl-card">
          <div className="tl-phase">
            <Packet>{p.packet}</Packet>
            <h4>{p.phase}</h4>
            <span style={{ marginLeft: "auto" }}>
              <Badge tone={status === "done" ? "green" : status === "active" ? "spruce" : status === "review" ? "amber" : "gray"}>
                {status === "done" ? "Complete" : status === "active" ? "In progress" : status === "review" ? "Needs review" : "Pending"}
              </Badge>
            </span>
          </div>
          <div className="tl-detail">{detail}</div>
          <div className="tl-meta">
            <span className="m-owner"><Icon name="group" size={12} style={{ verticalAlign: "-2px", color: "var(--fg-subtle)" }} /> {owner}</span>
            <span className="m-agent"><span className="ai-glyph" style={{ width: 11, height: 11 }} /> {agent}</span>
          </div>
        </div>
      </div>
    );
  }

  function ScreenTimeline({ policyState, toast, setScreen }) {
    const k = window.DATA.kase;
    const tl = window.DATA.timeline;
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">One case · every actor · every event</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Order case · {k.id}</h1>
            <div className="ph-sub">The relay becomes orchestration. Commercial, technical, compliance, and logistics actors all read and write the same canonical case. SAP stays the system of record for transactions; this timeline is the operational source of truth.</div>
          </div>
          <div className="ph-spacer" />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--fg-1)" }}>{k.revenueAtRisk}</div>
            <div style={{ fontSize: 11, color: "var(--fg-muted)" }}>program value · {k.marginImpact}</div>
          </div>
        </div>

        {/* Case header facts */}
        <div className="grid-3" style={{ marginBottom: 18 }}>
          <div className="kpi-tile"><div className="kl">Customer</div><div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)", fontFamily: "var(--font-display)", margin: "4px 0 2px" }}>{k.customer}</div><div className="ks">{k.account}</div></div>
          <div className="kpi-tile"><div className="kl">Program</div><div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)", fontFamily: "var(--font-display)", margin: "4px 0 2px" }}>{k.program}</div><div className="ks">{k.shipTo}</div></div>
          <div className="kpi-tile"><div className="kl">Selected grade</div><div style={{ fontSize: 16, fontWeight: 600, color: "var(--k-spruce-70)", fontFamily: "var(--font-display)", margin: "4px 0 2px" }}>ENGAGE XLT 8677</div><div className="ks">{k.quantity}</div></div>
        </div>

        {/* Owner model */}
        <div style={{ marginBottom: 8 }}><Eyebrow>Accountability · who owns the orchestration</Eyebrow></div>
        <div style={{ marginBottom: 22 }}><OwnerStrip /></div>

        {/* Timeline */}
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <Eyebrow>Case timeline</Eyebrow>
          <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>· packets travel with facts and evidence, not just status labels</span>
        </div>
        <div>
          {tl.map((p, i) => <PhaseRow key={i} p={p} last={i === tl.length - 1} policyState={policyState} />)}
        </div>

        <div className="row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setScreen("policy")}>Open policy gate</Button>
          <Button variant="ghost" onClick={() => setScreen("exceptions")} icon="warning-alt">Exceptions on this case</Button>
        </div>
      </div>
    );
  }
  UI.ScreenTimeline = ScreenTimeline;
})();
