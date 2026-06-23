/* ============================================================
   Screen — Agent recommendation (Fit packet)
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Badge, Packet, Button, SourceAttribution, Eyebrow, AgenticBadge } = UI;

  const RISK = {
    low: { fg: "var(--k-status-success-110)", bg: "var(--k-status-success-10)", bd: "var(--k-status-success-20)", label: "Low" },
    medium: { fg: "var(--k-status-warning-110)", bg: "var(--k-status-warning-10)", bd: "var(--k-status-warning-20)", label: "Medium" },
    high: { fg: "var(--k-status-error-110)", bg: "var(--k-status-error-10)", bd: "var(--k-status-error-20)", label: "High" },
  };

  function Band({ label, children }) {
    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9.5, letterSpacing: ".09em", textTransform: "uppercase", fontWeight: 700, color: "var(--fg-subtle)", marginBottom: 4 }}>{label}</div>
        {children}
      </div>
    );
  }

  function RiskBands({ p }) {
    const br = RISK[p.bizRisk] || RISK.low;
    const rr = RISK[p.regRisk] || RISK.low;
    const pill = (r) => (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: r.fg, background: r.bg, border: `1px solid ${r.bd}`, borderRadius: "var(--radius-pill)", padding: "2px 9px" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: r.fg }} />{r.label}
      </span>
    );
    return (
      <div style={{ display: "flex", gap: 18, alignItems: "flex-end", padding: "11px 13px", background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 8, margin: "2px 0 12px" }}>
        <Band label="Fit confidence">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--k-cool-gray-20)", overflow: "hidden", minWidth: 70 }}>
              <div style={{ width: `${p.confidence}%`, height: "100%", background: p.confidence >= 90 ? "var(--k-status-success-100)" : "var(--k-spruce-60)" }} />
            </div>
            <span className="tnum" style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-1)" }}>{p.confidence}%</span>
          </div>
        </Band>
        <div style={{ width: 1, alignSelf: "stretch", background: "var(--border-1)" }} />
        <Band label="Business risk">{pill(br)}</Band>
        <Band label="Regulatory risk">{pill(rr)}</Band>
      </div>
    );
  }

  function RecCard({ p, selected, onSelect, toast }) {
    return (
      <div className={`rec ${p.recommended ? "recommended" : ""} ${selected ? "selected" : ""}`}>
        <div className="rec-head">
          <div className="rec-rank">{p.rank}</div>
          <div style={{ flex: 1 }}>
            <h3 className="rec-title">{p.name}</h3>
            <div className="rec-fam">{p.family}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <AgenticBadge tone={p.confidence >= 90 ? "green" : "spruce"} label={`${p.confidence}% confidence`}
              title="Confidence" meta={`fit · rank ${p.rank}`}
              actions={[
                { label: "Ask for more evidence", sub: "show the source rows behind this" },
                { label: "Override ranking", sub: "promote / demote this grade" },
                { label: "Teach the agent", sub: "this fit is wrong for…", destructive: true },
              ]}
              onAct={(a) => toast(`Logged: “${a.label}” on ${p.name} → Learned from you`)} />
            <Badge tone={p.recommended ? "spruce" : "gray"}>{p.fit}</Badge>
          </div>
        </div>

        <div className="rec-reason"><strong>Agent reason · </strong>{p.reason}</div>

        <RiskBands p={p} />

        <div className="rec-specs">
          <span>MFR <b>{p.mfr}</b></span>
          <span>Density <b>{p.density}</b></span>
          <span style={{ color: "var(--k-spruce-70)" }}><Icon name="information" size={13} style={{ verticalAlign: "-2px" }} /> {p.lab}</span>
        </div>

        <div className="rec-tags">
          {p.tags.map((t, i) => <Badge key={i} tone="gray">{t}</Badge>)}
        </div>

        <div className="rec-sigs">
          {p.signals.map((s, i) => (
            <div className="rec-sig" key={i}>
              <span className={`sd ${s.tone}`} />{s.text}
            </div>
          ))}
        </div>

        <div className="rec-actions">
          <Button variant={p.recommended ? "dark" : undefined} size="sm" onClick={() => { onSelect(p.id); toast(`${p.name} selected → sample & policy packets created`); }}>
            {selected ? "Selected" : "Select & start sample"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast("Sent for technical review")}>Send for review</Button>
          <Button size="sm" variant="ghost" onClick={() => toast("Dismissed")}>Dismiss</Button>
          <SourceAttribution when="2m ago">ENGAGE TPO selection guide</SourceAttribution>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 11, paddingTop: 10, borderTop: "1px solid var(--k-cool-gray-10)", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-subtle)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="information" size={11} />Non-editable audit</span>
          <span>bundle engage-fit v3.1</span>
          <span>·</span>
          <span>01-Jun-2026 08:44</span>
          <span>·</span>
          <span>agent chemassist-fit-01</span>
        </div>
      </div>
    );
  }

  function ScreenRecommend({ setScreen, toast, selected, setSelected }) {
    const products = window.DATA.products;
    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Customer experience · fit packet</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Recommendation</h1>
            <div className="ph-sub">ChemAssist reasons over the ENGAGE portfolio for this exact use case — a cold-weather, injection-molded hard-TPO fascia — and ranks grades with cited rationale and tradeoffs. Every recommendation is a control point: confidence is editable, evidence is one click away.</div>
          </div>
          <div className="ph-spacer" />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Use case</div>
            <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 600, marginTop: 3 }}>Hard TPO · −40 °C · thin-wall</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)" }}>Injection molded · NA platform</div>
          </div>
        </div>

        <div className="panel ai-edge tint" style={{ padding: "13px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <span className="ai-glyph" style={{ width: 18, height: 18 }} />
          <div style={{ flex: 1, fontSize: 13, color: "var(--fg-1)", lineHeight: 1.5 }}>
            For a part that must stay ductile at <strong>−40 °C</strong> while down-gauging the wall, cold-temperature impact-to-stiffness is the deciding property. <strong>ENGAGE XLT 8677</strong> leads on exactly that axis.
          </div>
          <Badge tone="green" dot="var(--k-status-success-100)">Top pick · 94%</Badge>
        </div>

        <div className="stack">
          {products.map(p => (
            <RecCard key={p.id} p={p} selected={selected === p.id} onSelect={setSelected} toast={toast} />
          ))}
        </div>

        <div className="row" style={{ marginTop: 20, justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setScreen("intake")}>← Back to intent</Button>
          <Button variant="prim" icon="document-chart" onClick={() => setScreen("policy")} disabled={!selected}>
            Continue to policy gate →
          </Button>
        </div>
      </div>
    );
  }
  UI.ScreenRecommend = ScreenRecommend;
})();
