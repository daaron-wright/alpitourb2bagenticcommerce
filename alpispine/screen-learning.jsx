/* ============================================================
   Screen — Learned from you
   Every override, deny and unsupported answer is a teaching
   signal: routed to an owner, shown with the blast radius the
   agent applied. Plus the knowledge-gap queue for cases the
   platform could not answer with confidence.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Button, Badge, Stroke } = UI;

  const KIND = {
    skill: { lbl: "Reusable skill", icon: "recommend", color: "var(--k-spruce-70)", tint: "var(--k-spruce-10)", bd: "var(--k-spruce-20)" },
    policy: { lbl: "Policy backlog", icon: "document-chart", color: "#6B36A8", tint: "#F3ECFB", bd: "#E0CDF2" },
    content: { lbl: "Content backlog", icon: "lightbulb", color: "#9A6500", tint: "#FCEFD7", bd: "#F0DBA8" },
  };
  const STATE = {
    live: { b: "green", dot: "var(--k-status-success-100)" },
    "in review": { b: "amber", dot: "var(--k-status-warning-100)" },
    drafting: { b: "gray", dot: "var(--k-cool-gray-40)" },
  };
  const SEV = { high: "var(--k-warm-red-50)", medium: "var(--k-status-warning-100)" };

  function ScreenLearning({ toast, naphtha = {} }) {
    const D = window.D;
    const L = D.learning;
    const learned = naphtha.learned;
    const [lfc, setLfc] = React.useState(null); // null | "review" | "approved"

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">The loop · corrections compound</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Learned from you</h1>
            <div className="ph-sub">Overrides, denies and unsupported answers don't disappear into an opaque model update. Each becomes a teaching signal — routed to a named owner, turned into a reusable skill, a policy change, or a knowledge article, and shown with the blast radius the agent applied.</div>
          </div>
        </div>

        {/* Customer-driven signal — the front-end → PAC feedback loop, made obvious */}
        {learned && (
          <div className="lrn-fromcx">
            <div className="lfc-head">
              <span className="lfc-badge"><Icon name="group" size={13} /> New · from your customer</span>
              <span className="lfc-trace">Rossi Travel · {D.event.trace}</span>
            </div>
            <div className="lfc-body">
              <div className="lfc-flow">
                <span className="lfc-step done"><Icon name="chat-bot" size={12} /> Rossi Travel set a preference in AlpiGPT</span>
                <Stroke size={13} sw={2.4} children={<polyline points="9 6 15 12 9 18" />} />
                <span className={`lfc-step ${lfc === "approved" ? "done" : "now"}`}><Icon name="document-chart" size={12} /> Proposed PAC rule</span>
                <Stroke size={13} sw={2.4} children={<polyline points="9 6 15 12 9 18" />} />
                <span className={`lfc-step ${lfc === "approved" ? "done" : ""}`}><Icon name="checkmark-filled" size={12} /> {lfc === "approved" ? "Live in PAC" : "Your sign-off → live"}</span>
              </div>
              <div className="lfc-title">“{learned.title}” {lfc === "approved" && <span className="lfc-live">Live</span>}</div>
              <div className="lfc-rule"><span className="lfc-rule-id">PROD-covenant-brandt</span> <span className="lfc-plus">+ {learned.delta}</span></div>
              {lfc === "approved" ? (
                <div className="lfc-done">
                  <div className="lfc-done-h"><Icon name="checkmark-filled" size={15} style={{ color: "var(--k-status-success-100)" }} /> Policy retrained — rule is live</div>
                  <div className="lfc-done-b">PROD-covenant-brandt updated · bundle re-tested (412 / 412 pass) · 1 new test case added. The next covenant-safe re-point for Rossi Travel auto-approves — no walkthrough, no agent retraining.</div>
                  <div className="lfc-done-row"><span className="lfc-mini">198 → 199 policies</span><span className="lfc-mini">v3.1 → v3.2-draft</span><span className="lfc-mini">applies to 1 account</span></div>
                </div>
              ) : lfc === "review" ? (
                <div className="lfc-note"><Icon name="information" size={12} /> Routed to Compliance + Finance for review — you'll be notified when they sign off.</div>
              ) : (
                <div className="lfc-note">The customer's choice became a policy proposal automatically. Approve it and the next disruption for Rossi Travel resolves this way — no agent retraining, just a ratified rule.</div>
              )}
              {!lfc && (
                <div className="lfc-acts">
                  <Button variant="prim" icon="checkmark-filled" onClick={() => { setLfc("approved"); toast("Policy proposal approved · PROD-covenant-brandt is live · bundle re-tested (412 pass)."); }}>Approve &amp; retrain policy</Button>
                  <Button variant="ghost" onClick={() => { setLfc("review"); toast("Routed to Compliance + Finance for review."); }}>Send for review</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bubble — every correction by confidence × blast radius */}
        <UI.ChartCard title="Every correction, mapped" sub="Each bubble is a teaching signal — agent confidence at the moment of correction (x) against blast radius (y, items the change touched). Size scales with reach."
          legend={D.learningChart.series.map(s => ({ c: s.border, t: s.kind }))}>
          <UI.ChartCanvas type="bubble" height={230} sig="lrn-bubble"
            data={{ datasets: D.learningChart.series.map(s => ({ label: s.kind, backgroundColor: s.color, borderColor: s.border, borderWidth: 1,
              data: s.points.map(p => ({ x: p.x, y: p.y, r: p.r, label: p.label })) })) }}
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false },
              tooltip: { callbacks: { label: (c) => `${c.raw.label} · ${c.raw.x}% conf · ${c.raw.y} items` } } },
              scales: { x: { ...UI.chartTokens.GRID, title: { display: true, text: "Agent confidence %", color: "#64748B" }, min: 50, max: 100 },
                y: { ...UI.chartTokens.GRID, title: { display: true, text: "Blast radius · items", color: "#64748B" }, beginAtZero: true } } }} />
        </UI.ChartCard>

        <div className="lrn-grid" style={{ marginTop: 18 }}>
          {/* INBOX */}
          <div>
            <div className="spine-eyebrow"><span className="se-l">Inbox · what your corrections changed</span><span className="se-r">{L.inbox.length} signals</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {L.inbox.map((it) => {
                const k = KIND[it.kind], st = STATE[it.state];
                return (
                  <div className="lrn-card" key={it.id}>
                    <div className="lrn-head">
                      <span className="lrn-kind" style={{ background: k.tint, color: k.color, borderColor: k.bd }}><Icon name={k.icon} size={12} /> {k.lbl}</span>
                      <span className="lrn-id">{it.id}</span>
                      <span className={`b ${st.b}`} style={{ marginLeft: "auto", fontSize: 9.5 }}><span className="dot" style={{ background: st.dot }} />{it.state}</span>
                    </div>
                    <div className="lrn-signal"><Icon name="anomaly" size={13} style={{ color: "var(--fg-muted)" }} /> {it.signal}</div>
                    <div className="lrn-from">derived from <span className="mono">{it.from}</span></div>
                    <div className="lrn-change">{it.change}</div>
                    <div className="lrn-foot">
                      <span className="lrn-blast"><Icon name="network" size={12} style={{ color: k.color }} /> {it.blast}</span>
                      <span className="lrn-routed"><Icon name="group" size={12} /> {it.routed}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KNOWLEDGE-GAP QUEUE */}
          <div>
            <div className="spine-eyebrow"><span className="se-l">Knowledge-gap queue</span><span className="se-r">{L.gaps.length} open</span></div>
            <div className="panel" style={{ padding: 14 }}>
              <div style={{ fontSize: 11.5, color: "var(--fg-muted)", lineHeight: 1.5, marginBottom: 12 }}>Questions the platform could not answer with confidence. Each is routed to the owner who can close it — and feeds the content backlog.</div>
              {L.gaps.map((g) => (
                <div className="gap-row" key={g.id}>
                  <span className="gap-sev" style={{ background: SEV[g.sev] }} />
                  <div className="gap-body">
                    <div className="gap-q">{g.q}</div>
                    <div className="gap-reason">{g.reason}</div>
                    <div className="gap-meta">
                      <span className="gap-id">{g.id}</span>
                      <span className="gap-owner"><Icon name="group" size={11} /> {g.owner}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" icon="arrow-up-right" onClick={() => toast("Gap queue routed · owners notified, items added to the content backlog.")}>Route all to owners</Button>
            </div>

            <div className="panel" style={{ padding: "14px 16px", marginTop: 14, background: "var(--k-ai-spruce-06)", border: "1px solid var(--k-ai-spruce-12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className="ai-glyph" style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-1)" }}>The loop is closed by design</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.55 }}>Live signals are ephemeral; this inbox is permanent. You see your corrections become systemic change — reusable skills, tested policy branches and published articles — instead of vanishing into a black-box update.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  UI.ScreenLearning = ScreenLearning;
})();
