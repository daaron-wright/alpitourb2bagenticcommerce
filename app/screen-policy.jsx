/* ============================================================
   Screen — Policy as Code gate (RegRadar / OPA)
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Badge, Packet, Button, Eyebrow, AgenticBadge } = UI;

  function GateBanner({ outcome }) {
    const cls = outcome.state === "green" ? "gate-green" : outcome.state === "amber" ? "gate-amber" : "gate-red";
    const icon = outcome.state === "green"
      ? <Icon name="checkmark-filled" size={24} />
      : outcome.state === "amber"
        ? <Icon name="warning-alt" size={24} />
        : <Icon name="error-filled" size={24} />;
    return (
      <div className={`gate-banner ${cls}`}>
        <div className="gicon">{icon}</div>
        <div>
          <h3 className="ghead">{outcome.headline}</h3>
          <div className="gsub">{outcome.sub}</div>
        </div>
        <span className="gstate">{outcome.label}</span>
      </div>
    );
  }

  function RuleRow({ r, state, toast }) {
    // In red state, restricted-party rule fails
    let result = r.result;
    let detail = r.detail;
    if (state === "red" && r.id === "TRD-RPS-002") { result = "fail"; detail = r.redDetail; }
    if (state === "green" && r.id === "REG-PFAS-021") { result = "pass"; detail = "Supplier PFAS-content attestation on file (PFAS-ATT-2). Obligation cleared."; }
    const mark = result === "pass"
      ? <Stroke size={13} sw={3} children={<polyline points="20 6 9 17 4 12" />} />
      : result === "review"
        ? <Stroke size={13} sw={2.4} children={<><path d="M12 9v4" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" /></>} />
        : <Stroke size={13} sw={2.4} children={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />;
    return (
      <div className="rule-row">
        <div className={`rule-ico ${result}`}>{mark}</div>
        <div>
          <div className="rule-name">{r.name} <span className="mono" style={{ fontSize: 10.5, color: "var(--fg-muted)", fontWeight: 400 }}>· {r.id}</span></div>
          <div className="rule-detail">{detail}</div>
          {result === "review" && r.missing && (
            <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Badge tone="amber" dot="var(--k-status-warning-100)">Missing: {r.missing}</Badge>
              <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>Approver: <b style={{ color: "var(--fg-1)" }}>{r.approver}</b></span>
            </div>
          )}
          <div className="rule-src"><Icon name="document-chart" size={12} />{r.source}</div>
        </div>
        <div>
          <Badge tone={result === "pass" ? "green" : result === "review" ? "amber" : "red"}>
            {result === "pass" ? "Pass" : result === "review" ? "Review" : "Block"}
          </Badge>
        </div>
      </div>
    );
  }

  function ExplainBox({ ex }) {
    return (
      <div className="explain-box">
        <div><span className="ek">rule_fired</span> = <span className="ec">"{ex.ruleFired}"</span></div>
        <div><span className="ek">input</span> = {"{"}</div>
        <div style={{ paddingLeft: 16 }}>
          <span className="ek">ship_to_status</span>: <span className="ec">"{ex.input.ship_to_status}"</span>,&nbsp;
          <span className="ek">attestation_on_file</span>: <span className="ev">{String(ex.input.attestation_on_file)}</span>
        </div>
        <div>{"}"}</div>
        <div><span className="ek">decision</span> = <span className="ec">"{ex.decision}"</span></div>
        <div><span className="ek">because</span> = <span className="ev">{ex.because}</span></div>
        <div><span className="ek">effective</span> = <span className="ev">{ex.effective}</span></div>
      </div>
    );
  }

  function OverridePanel({ onApprove, onClear, canAct, toast }) {
    const [open, setOpen] = React.useState(null); // 'override' | 'attach'
    const [reason, setReason] = React.useState("Parent-account attestation on file");
    if (!canAct) {
      return (
        <div className="panel" style={{ padding: 14, background: "var(--bg-2)", display: "flex", gap: 10, alignItems: "center" }}>
          <Icon name="information" size={16} style={{ color: "var(--fg-muted)" }} />
          <span style={{ fontSize: 12.5, color: "var(--fg-2)" }}>This disposition is owned by <b>Compliance · R. Okafor</b>. Switch to the Compliance role to approve, attach evidence, or override.</span>
        </div>
      );
    }
    return (
      <div className="panel" style={{ padding: 16 }}>
        <Eyebrow>Human-in-the-loop · disposition</Eyebrow>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Button variant="prim" icon="checkmark-filled" onClick={() => setOpen(open === "attach" ? null : "attach")}>Attach attestation</Button>
          <Button variant="warn" onClick={() => setOpen(open === "override" ? null : "override")}>Override with reason</Button>
          <Button variant="ghost" onClick={() => toast("Sent back to sales for missing data")}>Send back</Button>
        </div>

        {open === "attach" && (
          <div className="fade-in" style={{ marginTop: 14, padding: 14, background: "var(--k-status-success-10)", borderRadius: 8, border: "1px solid var(--k-status-success-20)" }}>
            <div style={{ fontSize: 12.5, color: "var(--k-status-success-110)", marginBottom: 10 }}>Upload <b>PFAS-ATT-2</b> for Meridian Saltillo. This satisfies REG-PFAS-021 and flips the gate to green.</div>
            <div className="evchip" style={{ marginBottom: 10 }}><Icon name="document-chart" size={12} /> PFAS-ATT-2_Meridian_Saltillo.pdf</div>
            <Button variant="prim" size="sm" onClick={() => { onClear(); }}>Attach & clear to green</Button>
          </div>
        )}

        {open === "override" && (
          <div className="fade-in" style={{ marginTop: 14, padding: 14, background: "var(--k-status-warning-10)", borderRadius: 8, border: "1px solid var(--k-status-warning-20)" }}>
            <div className="field-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="field"><span className="fl">Approver</span><span className="fv">Rume Okafor · Compliance</span></div>
              <div className="field"><span className="fl">Reason code</span><span className="fv">ATTESTATION-INHERITED</span></div>
              <div className="field span2"><span className="fl">Rationale</span>
                <input className="brief-input" style={{ fontSize: 13, padding: "8px 10px" }} value={reason} onChange={e => setReason(e.target.value)} />
              </div>
              <div className="field"><span className="fl">Expiry</span><span className="fv">30 days · then re-check</span></div>
              <div className="field"><span className="fl">Bundle revision</span><span className="fv mono" style={{ fontSize: 12 }}>v4.2.1</span></div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
              <Button variant="warn" size="sm" onClick={() => onApprove(reason)}>Record override & release</Button>
              <span style={{ fontSize: 11, color: "var(--k-status-warning-110)" }}>Writes approver, reason, expiry & blast radius to the audit trail + Learned from you.</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  function ScreenPolicy({ policyState, setPolicyState, role, toast, setScreen }) {
    const P = window.DATA.policy;
    const outcome = P.outcomes[policyState];
    const canAct = role === "compliance";

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Governance · Policy as Code · {P.engine}</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Policy gate</h1>
            <div className="ph-sub">Compliance runs inline, during the action — not after. Every decision returns the rule that fired, the evidence, the missing condition, and the approved path. The system never strands anyone in a red state.</div>
          </div>
          <div className="ph-spacer" />
          <div style={{ textAlign: "right" }}>
            <Badge tone="violet" dot="#8A4FBF">Bundle {P.bundle}</Badge>
            <div style={{ fontSize: 10.5, color: "var(--fg-muted)", marginTop: 5, fontFamily: "var(--font-mono)" }}>published {P.bundleDate}</div>
          </div>
        </div>

        <GateBanner outcome={outcome} />

        {/* RegRadar signal that drove the amber */}
        {policyState !== "green" && (
          <div className="panel" style={{ marginTop: 16, padding: "12px 16px", display: "flex", gap: 12, alignItems: "center", borderLeft: "3px solid #8A4FBF" }}>
            <div className="lrn-ico rule" style={{ width: 30, height: 30 }}><Icon name="anomaly" size={15} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-1)" }}>RegRadar signal RR-2026-0413 · 27-May</div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>EPA TSCA 8(a)(7) PFAS reporting trigger updated → mapped to ENGAGE POE + new MX ship-to → this obligation.</div>
            </div>
            <span className="spruce-link" style={{ fontSize: 12 }} onClick={() => setScreen("learning")}>Watch feed →</span>
          </div>
        )}

        <div className="grid-2" style={{ marginTop: 16, gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
          <UI.Panel head={<><Packet>Policy packet</Packet><span style={{ fontSize: 12.5, fontWeight: 600, marginLeft: 8 }}>Rule evaluation</span></>} meta={`${P.rules.length} rules`}>
            {P.rules.map(r => <RuleRow key={r.id} r={r} state={policyState} toast={toast} />)}
          </UI.Panel>

          <div className="stack">
            <UI.Panel title="Explain" meta="decision log">
              <ExplainBox ex={P.explain} />
              <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 10, lineHeight: 1.5 }}>
                The decision object is structured, not a binary allow/deny — it returns the rule, the missing condition, the approved remediation, and the owner.
              </div>
            </UI.Panel>
            {policyState !== "green" ? (
              <OverridePanel canAct={canAct} toast={toast}
                onApprove={(reason) => { setPolicyState("green"); toast(`Override recorded by R. Okafor · released → Learned from you`); }}
                onClear={() => { setPolicyState("green"); toast("Attestation attached · gate cleared to green"); }} />
            ) : (
              <div className="panel" style={{ padding: 16, background: "var(--k-status-success-10)", border: "1px solid var(--k-status-success-20)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Icon name="checkmark-filled" size={18} style={{ color: "var(--k-status-success-100)" }} />
                  <div style={{ fontSize: 13, color: "var(--k-status-success-110)", fontWeight: 600 }}>Cleared — order may proceed to SAP</div>
                </div>
                <div style={{ marginTop: 12 }}><Button variant="prim" icon="arrow-up-right" onClick={() => setScreen("timeline")}>Release to SAP & book →</Button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  UI.ScreenPolicy = ScreenPolicy;
})();
