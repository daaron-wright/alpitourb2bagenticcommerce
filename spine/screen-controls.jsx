/* ============================================================
   Screen — Controls & evidence
   The accountability spine (named owners) plus the backend
   contracts the platform is evidenced against: event taxonomy,
   data residency / masking, and security controls — each
   traced to the standard it cites.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Badge, Collapsible } = UI;

  function Cite({ ids }) {
    const C = window.D.citations;
    return (
      <div className="ev-cites">
        <span className="ev-cl">Evidenced against</span>
        {ids.map((id) => {
          const c = C[id];
          return <span className="ev-cite" key={id} title={c.note}>{c.label}</span>;
        })}
      </div>
    );
  }

  function ScreenControls() {
    const D = window.D;
    const c = D.controls;
    const C = D.citations;

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Operating model · who owns it, what governs it</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Controls &amp; evidence</h1>
            <div className="ph-sub">Autonomy is only acceptable when ownership is named and the controls are traceable. One role owns the journey, one the platform, one the guardrails — and every backend contract below is evidenced against a published standard, not asserted.</div>
          </div>
        </div>

        {/* ACCOUNTABILITY SPINE */}
        <div className="spine-eyebrow"><span className="se-l">Accountability spine · named owners</span><span className="se-r">Three accountable owners — the journey as a product, the shared platform, and the decision boundaries.</span></div>
        <div className="acc-grid">
          {D.accountability.map((a, i) => (
            <div className="acc-card" key={i} style={{ borderTop: `3px solid ${a.color}` }}>
              <div className="acc-top">
                <span className="acc-ic" style={{ background: a.tint, color: a.color }}><Icon name={a.icon} size={18} /></span>
                <span className="acc-n">0{i + 1}</span>
              </div>
              <div className="acc-layer">{a.layer}</div>
              <div className="acc-owner" style={{ color: a.color }}>{a.owner}</div>
              <div className="acc-owns">{a.owns}</div>
              <div className="acc-scope"><Icon name="information" size={12} /> {a.scope}</div>
            </div>
          ))}
        </div>

        {/* EVENT TAXONOMY */}
        <div className="spine-eyebrow" style={{ marginTop: 26 }}><span className="se-l">Event taxonomy</span><span className="se-r">One shared event language across SAP and third-party systems — every event carries a trace id and an idempotency key.</span></div>
        <div className="panel" style={{ padding: 18 }}>
          <div className="ev-envelope"><span className="ev-elbl">Envelope</span><span className="mono">{c.taxonomy.envelope}</span></div>
          <table className="ev-tbl">
            <thead>
              <tr><th>Event</th><th>Payload contract</th><th>Trace</th><th>Idempotency key</th></tr>
            </thead>
            <tbody>
              {c.taxonomy.rows.map((r, i) => (
                <tr key={i}>
                  <td className="ev-name">{r.name}</td>
                  <td className="ev-pay">{r.payload}</td>
                  <td><span className="b spruce" style={{ fontSize: 9.5 }}>{r.trace}</span></td>
                  <td className="ev-idem">{r.idem}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Cite ids={c.taxonomy.cite} />
        </div>

        <div className="grid-2" style={{ marginTop: 16, alignItems: "start" }}>
          {/* DATA RESIDENCY & MASKING */}
          <div className="panel" style={{ padding: 18 }}>
            <Eyebrow>Data residency &amp; masking</Eyebrow>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {c.residency.rows.map((r, i) => (
                <div className="res-row" key={i}>
                  <div className="res-head"><Badge tone="spruce">{r.region}</Badge><span className="res-proc">{r.processing}</span></div>
                  <div className="res-kv"><span className="res-k">PII in scope</span><span className="res-v">{r.pii}</span></div>
                  <div className="res-kv"><span className="res-k">Masking</span><span className="res-v">{r.masked}</span></div>
                  <div className="res-kv"><span className="res-k">Retention</span><span className="res-v">{r.retention}</span></div>
                </div>
              ))}
            </div>
            <div className="ev-note">{c.residency.note}</div>
            <Cite ids={c.residency.cite} />
          </div>

          {/* SECURITY CONTROLS */}
          <div className="panel" style={{ padding: 18 }}>
            <Eyebrow>Security &amp; trust controls</Eyebrow>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
              {c.security.rows.map((r, i) => (
                <div className="sec-row" key={i}>
                  <span className="sec-mark"><Icon name="checkmark-filled" size={14} /></span>
                  <span><span className="sec-area">{r.area}</span><span className="sec-impl">{r.impl}</span></span>
                </div>
              ))}
            </div>
            <Cite ids={c.security.cite} />
          </div>
        </div>

        {/* SOURCE REGISTRY */}
        <div style={{ marginTop: 18 }}>
          <Collapsible title="Source registry" subtitle="The published standards and platforms this design is evidenced against.">
            <div className="src-grid">
              {Object.keys(C).map((id) => (
                <div className="src-card" key={id}>
                  <div className="src-label"><span className="ai-glyph" style={{ width: 12, height: 12 }} />{C[id].label}</div>
                  <div className="src-note">{C[id].note}</div>
                </div>
              ))}
            </div>
          </Collapsible>
        </div>
      </div>
    );
  }
  UI.ScreenControls = ScreenControls;
})();
