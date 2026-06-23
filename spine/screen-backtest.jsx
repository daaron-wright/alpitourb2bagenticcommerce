/* ============================================================
   Screen — Backtest / Replay lab
   Replay the supply-disruption event under different PAC bundle versions.
   Shows decision diffs, policy conflicts, and inventory impact.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Eyebrow, Button, Badge, AiSpinner, Collapsible } = UI;

  const RES = {
    allow: { c: "var(--k-status-success-110)", bg: "var(--k-status-success-10)", bd: "var(--k-status-success-20)", l: "Allow" },
    flag: { c: "var(--k-status-warning-110)", bg: "var(--k-status-warning-10)", bd: "var(--k-status-warning-20)", l: "Flag" },
    route: { c: "var(--k-status-warning-110)", bg: "var(--k-status-warning-10)", bd: "var(--k-status-warning-20)", l: "Route" },
    deny: { c: "var(--k-status-error-110)", bg: "var(--k-status-error-10)", bd: "var(--k-status-error-20)", l: "Deny" },
  };
  function pill(res) {
    const r = RES[res] || RES.allow;
    return <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, color: r.c, background: r.bg, border: `1px solid ${r.bd}` }}>{r.l}</span>;
  }
  const verdictDot = { allow: "var(--k-status-success-100)", route: "var(--k-status-warning-100)", deny: "var(--k-status-error-100)" };

  // DOI bar — lower is better; baseline 48
  function doiColor(v) { return v.verdict === "allow" ? "var(--k-spruce-60)" : v.verdict === "deny" ? "var(--k-status-error-100)" : "var(--k-status-warning-100)"; }
  // hex equivalents for canvas (Chart.js can't read CSS vars)
  function doiHex(v) { return v.verdict === "allow" ? "#29707A" : v.verdict === "deny" ? "#DC2626" : "#F59E0B"; }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }

  function ScreenBacktest({ toast }) {
    const D = window.D;
    const bt = D.backtest;
    const bc = D.backtestCharts;
    const [selId, setSelId] = React.useState("v3.2");
    const [ran, setRan] = React.useState(true);
    const sel = bt.versions.find(v => v.id === selId);
    const live = bt.versions.find(v => v.live);
    const baseline = 48;

    function run(v) {
      setRan(false);
      window.setTimeout(() => {
        setRan(true);
        if (v.conflicts.length) {
          toast(`Policy conflict ${v.conflicts[0].id} detected in ${v.id} — ${v.conflicts[0].a} vs ${v.conflicts[0].b}.`, { label: "Route to Compliance →", onClick: () => toast("Routed to Compliance + Finance · covenant override / margin-floor exception requested") });
        }
      }, 650);
    }
    function select(v) { setSelId(v.id); run(v); }

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Governance · simulate before you ship</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Backtest the policy</h1>
            <div className="ph-sub">Replay the same supply-disruption event under different PAC bundle versions before any of them reach production. See exactly how each version decides, where policies conflict, and what it does to inventory and the customer promise — a release gate, not a guess.</div>
          </div>
          <div className="ph-spacer" />
          <Button variant="dark" icon="anomaly" onClick={() => select(sel)}>Replay event</Button>
        </div>

        <div className="panel" style={{ padding: "11px 15px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Badge tone="red" dot="var(--k-status-error-100)">Scenario</Badge>
          <span style={{ fontSize: 12.5, color: "var(--fg-1)", fontFamily: "var(--font-mono)" }}>{bt.scenario}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-muted)" }}>same synthetic fixture · replayable</span>
        </div>

        {/* version selector */}
        <div className="bt-vers">
          {bt.versions.map(v => (
            <button key={v.id} className={`bt-ver ${selId === v.id ? "sel" : ""}`} onClick={() => select(v)}>
              <div className="bv-top">
                <span className="bv-id">{v.id}</span>
                <span className={`bv-tag ${v.tag}`}>{v.tag}</span>
              </div>
              <div className="bv-verdict" style={{ color: verdictDot[v.verdict] }}>
                <span className="bv-dot" style={{ background: verdictDot[v.verdict] }} />{v.verdictLabel}
              </div>
            </button>
          ))}
        </div>

        {!ran ? (
          <div className="panel" style={{ padding: 40, marginTop: 16, textAlign: "center", color: "var(--fg-muted)" }}>
            <AiSpinner size={32} />
            <div style={{ marginTop: 10, fontSize: 13 }}>Replaying EVT-2026-0617 against {sel.id}…</div>
          </div>
        ) : (
          <div className="bt-grid">
            {/* LEFT — decisions + conflicts */}
            <div>
              <div className="panel" style={{ padding: 16 }}>
                <Eyebrow>Policy decisions · {sel.id}</Eyebrow>
                <div style={{ marginTop: 10 }}>
                  {bt.rules.map(r => (
                    <div className="bt-rule" key={r}>
                      <span className="br-id">{r}</span>
                      {pill(sel.decisions[r])}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.5, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--k-cool-gray-10)" }}>{sel.action}</div>
              </div>

              {sel.conflicts.length > 0 && sel.conflicts.map(c => (
                <div className="bt-conflict" key={c.id}>
                  <div className="bc-h"><Icon name="warning-alt" size={14} /> Policy conflict · {c.id}</div>
                  <div className="bc-pair">
                    <span className="bc-rule">{c.a}</span>
                    <span className="bc-vs">CONFLICTS WITH</span>
                    <span className="bc-rule">{c.b}</span>
                  </div>
                  <div className="bc-text">{c.text}</div>
                  <div className="bc-resolve"><Icon name="group" size={13} style={{ color: "var(--k-status-error-110)", flexShrink: 0, marginTop: 1 }} /><span>{c.resolve}</span></div>
                </div>
              ))}

              {sel.conflicts.length === 0 && (
                <div className="panel" style={{ padding: "12px 16px", marginTop: 14, display: "flex", gap: 9, alignItems: "center", background: "var(--k-status-success-10)", border: "1px solid var(--k-status-success-20)" }}>
                  <Icon name="checkmark-filled" size={15} style={{ color: "var(--k-status-success-100)" }} />
                  <span style={{ fontSize: 12.5, color: "var(--k-status-success-110)" }}>No policy conflicts — every rule resolves cleanly under {sel.id}.</span>
                </div>
              )}
            </div>

            {/* RIGHT — inventory + promise impact */}
            <div>
              <div className="bt-impact">
                <Eyebrow>Impact on inventory & promise</Eyebrow>
                <div className="bt-doi">
                  <div className="bt-doibar">
                    <div className="db-track">
                      <div className="db-fill" style={{ width: `${(sel.doi / baseline) * 100}%`, background: doiColor(sel) }}>{sel.doi}d</div>
                    </div>
                    <div className="db-lbl">Days of inventory · {sel.doiDelta} vs baseline {baseline}d</div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="bt-inv"><Icon name="network" size={14} style={{ color: "var(--k-spruce-60)" }} /><span style={{ fontSize: 12.5, color: "var(--fg-1)" }}>Stock transfer</span><span style={{ fontSize: 11.5, color: "var(--fg-2)", textAlign: "right" }}>{sel.transfer}</span></div>
                  <div className="bt-inv"><Icon name={sel.verdict === "allow" ? "checkmark-filled" : "warning-alt"} size={14} style={{ color: sel.verdict === "allow" ? "var(--k-status-success-100)" : "var(--k-status-warning-100)" }} /><span style={{ fontSize: 12.5, color: "var(--fg-1)" }}>Customer promise</span><span style={{ fontSize: 11.5, color: "var(--fg-2)", textAlign: "right" }}>{sel.promise}</span></div>
                  <div className="bt-inv"><Icon name={sel.risk.startsWith("$0") ? "checkmark-filled" : "error-filled"} size={14} style={{ color: sel.risk.startsWith("$0") ? "var(--k-status-success-100)" : "var(--k-warm-red-60)" }} /><span style={{ fontSize: 12.5, color: "var(--fg-1)" }}>Revenue at risk</span><span style={{ fontSize: 11.5, color: "var(--fg-2)", textAlign: "right" }}>{sel.risk}</span></div>
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--k-cool-gray-10)" }}>{sel.summary}</div>
                {!sel.live && (
                  <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--fg-muted)", display: "flex", gap: 7, alignItems: "center" }}>
                    <Icon name="arrow-up-right" size={12} /> vs live {live.id}: inventory {sel.doi > live.doi ? `+${(sel.doi - live.doi).toFixed(1)}d worse` : "same"} · promise {sel.promise === live.promise ? "same" : "changes"}
                  </div>
                )}
              </div>

              {/* cross-version DOI comparison */}
              <div style={{ marginTop: 14 }}>
                <Collapsible title="Inventory outcome by policy version" subtitle="All three bundle versions, compared.">
                  <UI.ChartCanvas type="bar" height={150} sig="bt-doi"
                    data={{ labels: bt.versions.map(v => v.id), datasets: [{ label: "Days of inventory", data: bt.versions.map(v => v.doi), backgroundColor: bt.versions.map(v => doiHex(v)), borderRadius: 3, barThickness: 22 }] }}
                    options={{ indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => c.raw + "d of inventory" } } },
                      scales: { x: { ...UI.chartTokens.GRID, beginAtZero: true, suggestedMax: baseline + 4 }, y: { ...UI.chartTokens.GRID, grid: { display: false } } } }} />
                  <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 6, lineHeight: 1.45 }}>Lower is better. The live v3.1 bundle frees the most working capital while holding the promise; the stricter v3.2 draft strands it behind an unresolved conflict.</div>
                </Collapsible>
              </div>
            </div>
          </div>
        )}

        {/* VERSION TRADEOFFS — radar + decision matrix (Shidoka charts) */}
        {bt && (
          <React.Fragment>
            <div className="spine-eyebrow" style={{ marginTop: 28 }}>
              <span className="se-l">Version tradeoffs · what each bundle optimises</span>
              <span className="se-r">The same supply-disruption event, scored across six outcomes — and every rule's decision, version by version.</span>
            </div>
            <div className="grid-2" style={{ alignItems: "stretch" }}>
              <UI.ChartCard title="Outcome profile by bundle version" sub="0–100 across six outcomes. v3.1 (live) holds the widest balance; v3.0 is slow, v3.2 over-protects margin."
                legend={bt.versions.map((v, i) => ({ c: UI.chartTokens.CAT[i], t: v.id }))}>
                <UI.ChartCanvas type="radar" height={300} sig="bt-radar"
                  data={{ labels: bc.radarDims, datasets: bt.versions.map((v, i) => ({
                    label: v.id, data: bc.radar[v.id],
                    borderColor: UI.chartTokens.CAT[i], backgroundColor: hexA(UI.chartTokens.CAT[i], v.live ? 0.22 : 0.08),
                    pointBackgroundColor: UI.chartTokens.CAT[i], borderWidth: v.live ? 2.5 : 1.5, pointRadius: v.live ? 3 : 2 })) }}
                  options={{ maintainAspectRatio: false, plugins: { legend: { display: false } },
                    scales: { r: { suggestedMin: 0, suggestedMax: 100, angleLines: { color: "#E2E8F0" }, grid: { color: "#F1F5F9" }, pointLabels: { color: "#334155", font: { size: 10.5 } }, ticks: { display: false, stepSize: 25 } } } }} />
              </UI.ChartCard>

              <UI.ChartCard title="Policy decision matrix" sub="How each rule resolves under each bundle version. v3.2 turns the margin floor to deny — the conflict that strands the reroute.">
                <table className="dmx">
                  <thead>
                    <tr><th className="rule">Rule</th>{bt.versions.map(v => <th key={v.id}>{v.id}</th>)}</tr>
                  </thead>
                  <tbody>
                    {bt.rules.map(r => (
                      <tr key={r}>
                        <th className="rule">{r}</th>
                        {bt.versions.map(v => { const d = v.decisions[r] || "—"; return <td key={v.id}><div className={`cell ${d}`}>{d}</div></td>; })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap", fontSize: 10.5, color: "var(--fg-2)" }}>
                  <span><span className="dmx-key allow" /> allow</span>
                  <span><span className="dmx-key flag" /> flag</span>
                  <span><span className="dmx-key route" /> route</span>
                  <span><span className="dmx-key deny" /> deny</span>
                </div>
              </UI.ChartCard>
            </div>
          </React.Fragment>
        )}

        {/* DEPLOYMENT-GATE LADDER — promotion path the lab governs */}
        <div className="spine-eyebrow" style={{ marginTop: 28 }}>
          <span className="se-l">Deployment gates · shadow → bounded autonomy</span>
          <span className="se-r">A passing backtest promotes a bundle one gate at a time. Customer-visibility and write-back widen only when the gate's exit criteria hold.</span>
        </div>
        <GateLadder gates={D.gates} toast={toast} />
      </div>
    );
  }
  UI.ScreenBacktest = ScreenBacktest;

  function GateLadder({ gates, toast }) {
    const stateMeta = {
      passed: { b: "green", dot: "var(--k-status-success-100)", lbl: "Passed" },
      current: { b: "spruce", dot: "var(--k-spruce-60)", lbl: "Current gate" },
      locked: { b: "gray", dot: "var(--k-cool-gray-40)", lbl: "Locked" },
    };
    const curIdx = gates.stages.findIndex(s => s.state === "current");
    return (
      <div className="panel" style={{ padding: 18 }}>
        <div className="gl-rail">
          {gates.stages.map((g, i) => {
            const m = stateMeta[g.state];
            return (
              <div className={`gl-stage ${g.state}`} key={g.id}>
                <div className="gl-conn" style={i === 0 ? { visibility: "hidden" } : (i <= curIdx ? { background: "var(--k-spruce-40)" } : {})} />
                <div className="gl-card">
                  <div className="gl-top">
                    <span className="gl-n" style={{ background: m.dot }}>{g.state === "passed" ? "✓" : g.n}</span>
                    <span className={`b ${m.b}`} style={{ fontSize: 9.5 }}>{m.lbl}</span>
                  </div>
                  <div className="gl-name">{g.name}</div>
                  <div className="gl-scope">{g.scope}</div>
                  <div className="gl-kv"><span className="gl-k">Customer-visible</span><span className="gl-v">{g.visible}</span></div>
                  <div className="gl-kv"><span className="gl-k">Write-back</span><span className="gl-v">{g.writes}</span></div>
                  <div className="gl-exit">
                    {g.exit.map((e, j) => (
                      <div className={`gl-crit ${e.ok ? "ok" : "wait"}`} key={j}>
                        <Icon name={e.ok ? "checkmark-filled" : "information"} size={12} /> {e.t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="gl-foot">
          <div className="gl-summary"><Icon name="information" size={13} style={{ color: "var(--fg-muted)", flexShrink: 0, marginTop: 1 }} /><span>{gates.summary}</span></div>
          <div className="gl-controls">
            <Button variant="prim" icon="arrow-up-right" onClick={() => toast("Promotion to gate 4 blocked — Audit completeness at 100% and Legal + Compliance sign-off still required.")}>Promote to gate 4</Button>
            <Button variant="ghost" icon="warning-alt" onClick={() => toast("Pilot held at gate 3 · write-previews only, no customer-visible writes.")}>Hold stage</Button>
            <Button variant="ghost" icon="error-filled" onClick={() => toast("Kill switch armed · Digital Ops can revert all staged writes in one action.")}>Roll back</Button>
          </div>
        </div>
      </div>
    );
  }
})();
