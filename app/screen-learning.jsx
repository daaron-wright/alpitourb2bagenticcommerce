/* ============================================================
   Screen — Learned from you (learning loop) + RegRadar feed
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Badge, Button, Eyebrow } = UI;

  const KIND_ICON = { rule: "document-chart", runbook: "network", model: "lightbulb" };
  const KIND_LABEL = { rule: "Rule change", runbook: "Runbook change", model: "Model signal" };

  function LrnRow({ l, toast }) {
    return (
      <div className="lrn-row">
        <div className={`lrn-ico ${l.kind}`}><Icon name={KIND_ICON[l.kind]} size={15} /></div>
        <div>
          <div className="lrn-action">{l.action}</div>
          <div className="lrn-reason">“{l.reason}”</div>
          <div className="lrn-derived">derived from · {l.derived}</div>
          <div className="lrn-blast"><Icon name="arrow-up-right" size={12} /> {l.blast}</div>
          <div className="lrn-outcome"><b>Outcome:</b> {l.outcome}</div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <Badge tone={l.kind === "rule" ? "violet" : l.kind === "runbook" ? "spruce" : "amber"}>{KIND_LABEL[l.kind]}</Badge>
          <span style={{ fontSize: 10.5, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{l.by} · {l.ts}</span>
          <Button size="sm" variant="ghost" onClick={() => toast(`Promoted ${l.id} to review`)}>Review change</Button>
        </div>
      </div>
    );
  }

  function ScreenLearning({ toast }) {
    const learning = window.DATA.learning;
    const feed = window.DATA.regradar;
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Feedback becomes system memory</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Learned from you</h1>
            <div className="ph-sub">Every override, reroute, and acceptance is a teaching signal — captured with its reason, blast radius, and outcome. Corrections compound into rule, runbook, and model changes instead of disappearing into private email.</div>
          </div>
          <div className="ph-spacer" />
          <Badge tone="green" dot="var(--k-status-success-100)">Loop instrumented from day one</Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, alignItems: "start" }}>
          <UI.Panel head={<><Icon name="lightbulb" size={16} style={{ color: "var(--k-spruce-70)" }} /><span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8 }}>Override & decision inbox</span></>} meta={`${learning.length} signals`} pad={false}>
            {learning.map(l => <LrnRow key={l.id} l={l} toast={toast} />)}
          </UI.Panel>

          <div className="stack">
            <UI.Panel head={<><Icon name="anomaly" size={16} style={{ color: "#8A4FBF" }} /><span style={{ fontSize: 13, fontWeight: 600, marginLeft: 8 }}>RegRadar watch feed</span></>}>
              <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginBottom: 12, lineHeight: 1.5 }}>Watch → decide → prove. Regulatory change is sensed, mapped to products and transactions, and routed to the right owner.</div>
              {feed.map(f => (
                <div key={f.id} style={{ padding: "11px 0", borderBottom: "1px solid var(--k-cool-gray-20)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge tone={f.sev === "warning" ? "amber" : "spruce"}>{f.id}</Badge>
                    <span style={{ fontSize: 10.5, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{f.date}</span>
                    <span style={{ marginLeft: "auto" }}><Badge tone={f.state === "Published" ? "green" : "gray"}>{f.state}</Badge></span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-1)", marginTop: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 3 }}>{f.impact}</div>
                  <div style={{ fontSize: 10.5, color: "var(--k-spruce-70)", marginTop: 4 }}>→ routed to {f.routed}</div>
                </div>
              ))}
            </UI.Panel>

            <div className="panel" style={{ padding: 16, background: "var(--k-ai-spruce-06)", border: "1px solid var(--k-ai-spruce-12)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <span className="ai-glyph" style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-1)" }}>This week's compounding</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.55 }}>
                <b>−18%</b> projected false-positive trade holds · <b>+1.4d</b> avg saved on lab reroutes · <b>23</b> briefs reinforced on cold-weather fascia fit.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  UI.ScreenLearning = ScreenLearning;
})();
