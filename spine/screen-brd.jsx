/* ============================================================
   Screen — BRD as executable constitution (opening act)
   Upload → compile → ontology + policy + decision rights + agents.
   Plus the Decision Graph (ontology made visible) & LIMS lineage.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Eyebrow, Button, Badge, AiSpinner, Collapsible } = UI;
  const tick = <Stroke size={15} sw={3.2} children={<polyline points="20 6 9 17 4 12" />} />;

  function Col({ icon, title, count, children, onNav, active }) {
    return (
      <div className={`cc-col ${onNav ? "is-nav" : ""} ${active ? "is-active" : ""}`}>
        <button className="cch" onClick={onNav} disabled={!onNav}>
          <Icon name={icon} size={15} style={{ color: "#6B36A8" }} />
          <span className="ct">{title}</span>
          <span className="cn">{count}</span>
          {onNav && <span className="cc-nav"><Icon name="arrow-up-right" size={13} /></span>}
        </button>
        {children}
      </div>
    );
  }

  function DecisionGraphSVG() {
    const g = window.D.graph;
    const nm = {}; g.nodes.forEach(n => nm[n.id] = n);
    const hotIds = { feed: 1, crack: 1, plantT: 1 };
    const isHot = (e) => (hotIds[e.from] && hotIds[e.to]) || (e.from === "sku" && e.to === "plantF");
    return (
      <div>
        <div className="dg-wrap" style={{ height: 460 }}>
          <svg className="dg-svg" viewBox="0 0 520 460" preserveAspectRatio="xMidYMid meet">
            {g.edges.map((e, i) => {
              const a = nm[e.from], b = nm[e.to];
              return (
                <g key={i}>
                  <line className={`dg-edge ${isHot(e) ? "hot" : ""}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  <text className="dg-elabel" x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 3} textAnchor="middle">{e.label}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ position: "absolute", inset: 0 }}>
            {g.nodes.map(n => (
              <div key={n.id} className={`dg-node ${n.kind}`} style={{ left: `${n.x / 520 * 100}%`, top: `${n.y / 460 * 100}%` }}>
                <div className="dn-type">{n.type}</div>
                <div className="dn-label">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="dg-legend">
          {[["customer", "Customer", "var(--k-spruce-40)"], ["sku", "Grade / SKU", "#E0CDF2"], ["plant", "Plant", "var(--k-blue-50)"], ["cracker", "Cracker / feedstock", "var(--k-warm-red-30)"], ["lims", "LIMS sample / test", "var(--k-status-success-20)"], ["policy", "Covenant / policy", "#F0C674"]].map((l, i) => (
            <span className="dg-leg" key={i}><span className="sw" style={{ borderColor: l[2], background: l[2] }} />{l[1]}</span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--k-warm-red-60)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 2, background: "var(--k-warm-red-50)", display: "inline-block" }} /> live disruption path
          </span>
        </div>
      </div>
    );
  }

  // React Flow version (interactive) with SVG fallback
  const RF_KIND = {
    customer: { bg: "#fff", bd: "var(--k-spruce-40)" },
    sku: { bg: "#fff", bd: "#E0CDF2" },
    plant: { bg: "#fff", bd: "var(--k-blue-50)" },
    cracker: { bg: "var(--k-warm-red-10)", bd: "var(--k-warm-red-30)" },
    signal: { bg: "var(--k-warm-red-10)", bd: "var(--k-warm-red-30)" },
    lims: { bg: "var(--k-status-success-10)", bd: "var(--k-status-success-20)" },
    policy: { bg: "#FEF7E6", bd: "#F0C674" },
  };

  function DecisionGraphRF() {
    const RF = window.ReactFlow || {};
    const Flow = RF.default || RF.ReactFlow || (typeof RF === "function" ? RF : null);
    if (!Flow) return <DecisionGraphSVG />;
    const Background = RF.Background, Controls = RF.Controls;
    const g = window.D.graph;
    const hotIds = { feed: 1, crack: 1, plantT: 1 };
    const isHot = (e) => (hotIds[e.from] && hotIds[e.to]) || (e.from === "sku" && e.to === "plantF");

    const nodes = g.nodes.map(n => {
      const ks = RF_KIND[n.kind] || RF_KIND.customer;
      return {
        id: n.id,
        position: { x: n.x * 1.55, y: n.y * 1.15 },
        data: { label: (<div style={{ textAlign: "left" }}><div className="rf-type">{n.type}</div><div className="rf-name">{n.label}</div></div>) },
        style: { background: ks.bg, border: `1px solid ${ks.bd}`, borderRadius: 10, padding: "8px 11px", width: "auto", minWidth: 96, boxShadow: "var(--shadow-sm)" },
      };
    });
    const edges = g.edges.map((e, i) => ({
      id: "e" + i, source: e.from, target: e.to, label: e.label, type: "smoothstep",
      animated: isHot(e),
      style: { stroke: isHot(e) ? "var(--k-warm-red-50)" : "#94A3B8", strokeWidth: isHot(e) ? 2 : 1.5 },
      labelStyle: { fontSize: 9, fill: "var(--fg-subtle)", fontFamily: "var(--font-mono)" },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.85 },
    }));

    return (
      <div>
        <div className="dg-rf" style={{ height: 480 }}>
          <Flow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.18 }}
            nodesConnectable={false} edgesFocusable={false} proOptions={{ hideAttribution: true }}
            minZoom={0.4} maxZoom={1.6} defaultEdgeOptions={{ type: "smoothstep" }}>
            {Background && <Background gap={22} size={1} color="#E2E8F0" />}
            {Controls && <Controls showInteractive={false} />}
          </Flow>
        </div>
        <div className="dg-legend">
          {[["customer", "Customer", "var(--k-spruce-40)"], ["sku", "Grade / SKU", "#E0CDF2"], ["plant", "Plant", "var(--k-blue-50)"], ["cracker", "Cracker / feedstock", "var(--k-warm-red-30)"], ["lims", "LIMS sample / test", "var(--k-status-success-20)"], ["policy", "Covenant / policy", "#F0C674"]].map((l, i) => (
            <span className="dg-leg" key={i}><span className="sw" style={{ borderColor: l[2], background: l[2] }} />{l[1]}</span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-muted)" }}>drag nodes · scroll to zoom · the live disruption path is animated</span>
        </div>
      </div>
    );
  }

  // The supply event traced through the compiled state machine
  function LivePathTrace() {
    const { Icon, Badge } = UI;
    const M = window.MACHINE;
    const mods = M.mods;
    const path = M.livePath;
    return (
      <div className="lpt">
        <div className="lpt-head">
          <Eyebrow>Live event path · EVT-2026-0617</Eyebrow>
          <div className="dash-chart-sub">The supply disruption, traced state-by-state through the compiled journey. Each step shows the control value that unlocked the next transition.</div>
        </div>
        <div className="lpt-body">
          {path.map((p, i) => {
            const mod = mods[p.m];
            const last = i === path.length - 1;
            return (
              <div className={`lpt-step ${p.type}`} key={i}>
                <div className="lpt-rail">
                  <span className="lpt-dot" style={{ background: mod.c }}>{last ? <Icon name="checkmark-filled" size={13} /> : i + 1}</span>
                  {!last && <span className="lpt-line" />}
                </div>
                <div className="lpt-card">
                  <div className="lpt-top">
                    <span className="lpt-mod" style={{ background: mod.c }}>{mod.label}</span>
                    <span className="lpt-name">{p.n}</span>
                    <span className={`lpt-type ${p.type}`}>{p.type}</span>
                  </div>
                  <div className="lpt-note">{p.note}</div>
                  <div className="lpt-ctrl"><span className="lpt-k">{p.ctrl}</span><Icon name="arrow-up-right" size={11} /><span className="lpt-v">{p.decision}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function GraphViews({ toast, view, setView, mapRef }) {
    const D = window.D;
    const M = window.MACHINE;
    const { ForceGraph, GraphLegend } = UI;
    const TABS = [
      { id: "journey", label: "Journey map", icon: "network" },
      { id: "ontology", label: "Group ontology", icon: "network" },
      { id: "rights", label: "Decision rights / access", icon: "group" },
      { id: "governance", label: "Compliance & regulatory gov.", icon: "document-chart" },
    ];
    const CFG = {
      ontology: { data: D.ontologyGraph, radius: 35, dense: false, src: `d3-force · ${D.ontologyGraph.nodes.length} entities · ${D.ontologyGraph.links.length} relationships` },
      rights: { data: M.decisionRights, radius: 40, dense: false, src: "gates + authorities · dashed ring = decision state" },
      governance: { data: M.governance, radius: 40, dense: false, src: "RegRadar ↔ PAC policy lifecycle" },
    };
    const cfg = CFG[view];
    return (
      <div className="panel" style={{ padding: 0, overflow: "hidden" }} ref={mapRef}>
        <div className="gv-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`gv-tab ${view === t.id ? "on" : ""}`} onClick={() => setView(t.id)}>
              <Icon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>
        {view === "journey" ? (
          <UI.JourneyMap toast={toast} />
        ) : (
          <React.Fragment>
            <ForceGraph key={view} data={cfg.data} height={520} radius={cfg.radius} dense={cfg.dense} />
            <GraphLegend cats={cfg.data.cats} src={cfg.src} />
          </React.Fragment>
        )}
      </div>
    );
  }

  function UploadGate({ onApply, toast }) {
    const D = window.D;
    const inputRef = React.useRef(null);
    const SEED = [
      { name: D.brd.file, size: "555 KB", kind: "PDF Document", at: "Signed 12 May 2026", status: "Signed off", tone: "green", current: true },
      { name: "DOW-BRD-SC-EU-v3.0.pdf", size: "540 KB", kind: "PDF Document", at: "Superseded · 3 Mar 2026", status: "Superseded", tone: "gray" },
      { name: "DOW-BRD-NA-SC-v1.2.pdf", size: "612 KB", kind: "PDF Document", at: "Signed 28 Jan 2026", status: "Signed off", tone: "green" },
      { name: "BRD Dow V2.docx", size: "103 KB", kind: "Word document", at: "Draft · 11 May 2026", status: "Draft", tone: "violet" },
    ];
    const [files, setFiles] = React.useState(SEED);
    const [applyingName, setApplyingName] = React.useState(null);
    function pick() { inputRef.current && inputRef.current.click(); }
    function onFile(e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const kb = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(f.size / 1024)) + " KB";
      addFile(f.name, kb);
      e.target.value = "";
    }
    function addFile(name, size) {
      setFiles(fs => [{ name, size: size || "—", kind: /\.pdf$/i.test(name) ? "PDF Document" : /\.docx?$/i.test(name) ? "Word document" : "Document", at: "Just now", status: "Draft", tone: "violet" }, ...fs]);
      toast(`Added ${name} to the BRD library — review or apply it.`);
    }
    function apply(name) {
      const n = name || (files[0] && files[0].name) || D.brd.file;
      setApplyingName(n);
      setTimeout(() => onApply(n), 650);
    }
    return (
      <div className="disc">
        <input ref={inputRef} type="file" accept=".pdf,.docx,.doc" style={{ display: "none" }} onChange={onFile} />
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Agentic Workflow Orchestrator</Eyebrow>
            <h1 style={{ marginTop: 6 }}>From manual business process to agentic workflow execution</h1>
            <div className="ph-sub">A unified workflow to ingest legacy artifacts, compile the target operating model, and govern executable policy logic.</div>
          </div>
        </div>

        <div className="disc-cards">
          <div className="disc-card">
            <div className="disc-c-eye">01 · Uploading material</div>
            <div className="disc-c-b">Upload your signed BRD / policy PDFs to generate the target operating model and executable rules.</div>
            <button className="dow-btn red" onClick={pick} style={{ background: "var(--k-spruce-60)" }}><Icon name="arrow-up-right" size={15} /> Upload Business Requirements</button>
          </div>
          <div className="disc-card">
            <div className="disc-c-eye">02 · Execute policy</div>
            <div className="disc-c-b">Apply a Business Requirements Document to compile Policy as Code and bind the agents to their decision rights.</div>
            <button className="dow-btn ghost" onClick={() => apply()}>{applyingName ? "Applying…" : "Apply current BRD →"}</button>
          </div>
        </div>

        <div className="disc-lib">
          <div className="disc-lib-top">
            <div>
              <div className="disc-c-eye">Business Requirements library</div>
              <div className="disc-lib-h">{files.length} document{files.length === 1 ? "" : "s"} · apply one to compile</div>
              <div className="disc-lib-s">Previously uploaded BRDs. Apply the signed current version, or upload a new one to add it to the library.</div>
            </div>
            <button className="dow-btn ghost sm" onClick={pick} style={{ flexShrink: 0 }}>Upload file</button>
          </div>
          <div className="disc-lib-body">
            <div className="disc-files">
              {files.map((f, i) => (
                <div className={`disc-file ${f.current ? "current" : ""}`} key={i}>
                  <span className="df-ic"><Icon name="document-chart" size={16} /></span>
                  <span className="df-main">
                    <span className="df-n">{f.name} {f.current && <span className="df-cur">Current</span>}</span>
                    <span className="df-m">{f.kind} · {f.size} · {f.at}</span>
                  </span>
                  <Badge tone={f.tone} dot={f.tone === "green" ? "var(--k-status-success-100)" : f.tone === "gray" ? "var(--k-cool-gray-40)" : "#8A4FBF"}>{f.status}</Badge>
                  <button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={() => apply(f.name)}>{applyingName === f.name ? "Applying…" : "Apply →"}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function BrdParse({ runId }) {
    const D = window.D;
    const b = D.brd, fr = D.firedRule, audit = D.audit;
    const LEGEND = [
      ["Fully aligned", "ok"], ["Country-specific difference", "diff"], ["Compliance gap", "gap"],
      ["Required local control", "ctrl"], ["Conflict area", "conflict"], ["Evidence required", "evid"],
    ];
    const COUNTRIES = [
      { c: "Germany · EU", s: "ok", note: "Retention period permitted; GDPR baseline met.", ctrl: "—", ev: "DPIA on file" },
      { c: "United States", s: "diff", note: "State breach-notice windows differ by state.", ctrl: "State-level notification control", ev: "Notification log" },
      { c: "China · PIPL", s: "gap", note: "Cross-border transfer not covered; data must be localised.", ctrl: "Local storage + separate consent gate", ev: "Consent & transfer record" },
      { c: "Brazil · LGPD", s: "diff", note: "Shorter retention unless a legal basis applies.", ctrl: "Auto-delete trigger on expiry", ev: "Deletion audit" },
      { c: "India · DPDP", s: "evid", note: "Compliant as written — additional audit evidence required.", ctrl: "—", ev: "Extended audit trail" },
      { c: "Singapore", s: "conflict", note: "Global blanket-access rule not valid; needs local approval.", ctrl: "Local approver gate before access", ev: "Approval record" },
    ];
    const SB = { ok: "Aligned", diff: "Difference", gap: "Gap", ctrl: "Control", conflict: "Conflict", evid: "Evidence" };

    // Staged reveal: 1 = exceptions, 2 = runtime, 3 = audit, 4 = done
    const [stage, setStage] = React.useState(0);
    const timers = React.useRef([]);
    React.useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setStage(0);
      [[1, 550], [2, 1850], [3, 2900], [4, 3850]].forEach(([s, ms]) => timers.current.push(setTimeout(() => setStage(s), ms)));
      return () => timers.current.forEach(clearTimeout);
    }, [runId]);
    const scanning = stage < 4;
    const done = <Icon name="checkmark-filled" size={13} style={{ color: "var(--k-status-success-100)" }} />;
    const Parsing = () => <span className="bx-parsing"><AiSpinner size={13} /> parsing…</span>;
    const waiting = <span style={{ color: "var(--fg-subtle)" }}>waiting</span>;

    return (
      <div className="bx">
        <div className="spine-eyebrow" style={{ marginTop: 26 }}><span className="se-l">One document → every consequence</span><span className="se-r">The same signed BRD drives the per-country policy exceptions, the runtime decision, and the audit trail. <strong style={{ color: "var(--k-spruce-70)" }}>Watch it parse from a single artefact.</strong></span></div>
        <div className="panel" style={{ padding: 18 }}>
          <div className="bx-flow">
            <div className={`bx-src ${scanning ? "scanning" : ""}`}>
              <span className="bx-ic"><Icon name="document-chart" size={21} /></span>
              <div style={{ flex: 1 }}>
                <div className="bx-nm">{b.name} <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", fontWeight: 400 }}>· {b.version}</span></div>
                <div className="bx-meta">{b.compiled} policies · {b.tests} tests · signed by {b.signed}</div>
              </div>
              <span className="bx-pill"><span className="ai-glyph" /> {scanning ? "Extracting…" : "1 signed artefact"}</span>
            </div>

            <div className="bx-lanes">
              {/* Lane 1 — per-country policy exceptions */}
              <div className={`bx-lane ${stage >= 1 ? "" : "pending"}`}>
                <div className="bx-lane-head">
                  <span className="bx-eye">Layer 00 · Global reach</span>
                  <span className="bx-h">Per-country policy exceptions</span>
                  <span className="bx-c">{stage >= 1 ? <React.Fragment>{done} {COUNTRIES.length} countries assessed</React.Fragment> : <Parsing />}</span>
                </div>
                {stage >= 1 && (
                  <div className="bx-stream">
                    <div className="pac-legend">{LEGEND.map((l, i) => <span className={`pac-lz ${l[1]}`} key={i}><span className="dot" /> {l[0]}</span>)}</div>
                    <table className="pac-table">
                      <thead><tr><th>Country</th><th>Status</th><th>Local difference</th><th>Required local control</th><th>Evidence</th></tr></thead>
                      <tbody>
                        {COUNTRIES.map((r, i) => (
                          <tr key={i} className="bx-tr" style={{ animationDelay: `${i * 85}ms` }}>
                            <td className="pc-c">{r.c}</td>
                            <td><span className={`pac-badge ${r.s}`}>{SB[r.s]}</span></td>
                            <td className="pc-n">{r.note}</td>
                            <td className="pc-ctrl">{r.ctrl === "—" ? <span className="dash">none — as written</span> : r.ctrl}</td>
                            <td className="pc-ev">{r.ev}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lane 2 — the runtime decision */}
              <div className={`bx-lane ${stage >= 2 ? "" : "pending"}`}>
                <div className="bx-lane-head">
                  <span className="bx-eye">Layer 02 · Runtime</span>
                  <span className="bx-h">The rule fires — with the BRD line attached</span>
                  <span className="bx-c">{stage >= 2 ? <React.Fragment>{done} {fr.id}</React.Fragment> : stage >= 1 ? <Parsing /> : waiting}</span>
                </div>
                {stage >= 2 && (
                  <div className="bx-stream grid-2" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
                    <div className="panel" style={{ padding: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span className="a-res allow" style={{ fontSize: 11 }}>ALLOW</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 600, color: "#6B36A8" }}>{fr.id}</span>
                        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-muted)" }}>{fr.at}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{fr.name}</div>
                      <div className="explain-box" style={{ marginTop: 11 }}>
                        <div><span className="ek">rule</span> = <span className="ec">"{fr.id}"</span></div>
                        <div><span className="ek">decision</span> = <span className="ec">"{fr.decision}"</span></div>
                        <div><span className="ek">because</span> = <span className="ev">{fr.because}</span></div>
                        <div><span className="ek">policy_version</span> = <span className="ev">{fr.version}</span></div>
                      </div>
                    </div>
                    <div className="panel" style={{ padding: 14, background: "#FBF9FE", border: "1px solid #E8DCF5" }}>
                      <span className="bx-eye" style={{ color: "#8A4FBF" }}>The source rule · in the BRD</span>
                      <div style={{ fontSize: 13.5, color: "var(--fg-1)", lineHeight: 1.6, margin: "11px 0", fontStyle: "italic", paddingLeft: 12, borderLeft: "3px solid #8A4FBF" }}>{fr.source}</div>
                      <div style={{ fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.5 }}>The rule on paper becomes the rule in production — same artefact, both sides of the line.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lane 3 — the audit trail */}
              <div className={`bx-lane ${stage >= 3 ? "" : "pending"}`}>
                <div className="bx-lane-head">
                  <span className="bx-eye">Layer 03 · Audit</span>
                  <span className="bx-h">Every decision, traced to its BRD section</span>
                  <span className="bx-c">{stage >= 3 ? <React.Fragment>{done} {audit.length} records</React.Fragment> : stage >= 2 ? <Parsing /> : waiting}</span>
                </div>
                {stage >= 3 && (
                  <div className="bx-stream panel" style={{ padding: 14 }}>
                    <table className="audit-tbl">
                      <thead><tr><th>Decision</th><th>Time</th><th>Action</th><th>Rule</th><th>Result</th><th>Reason chain → source rule</th></tr></thead>
                      <tbody>
                        {audit.map((r, i) => (
                          <tr key={r.id} className="bx-tr" style={{ animationDelay: `${i * 85}ms` }}>
                            <td className="a-id">{r.id}</td>
                            <td className="a-id">{r.at}</td>
                            <td style={{ fontSize: 11.5, color: "var(--fg-1)" }}>{r.action}<div style={{ fontSize: 10, color: "var(--fg-muted)" }}>{r.actor}</div></td>
                            <td className="a-rule">{r.rule}</td>
                            <td><span className={`a-res ${r.result}`}>{r.result}</span></td>
                            <td className="a-chain">{r.chain}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ScreenBrd({ setScreen, toast }) {
    const D = window.D;
    const b = D.brd;
    const lims = D.lims;
    const [uploaded, setUploaded] = React.useState(false);
    const [docName, setDocName] = React.useState(b.file);
    const [runIdx, setRunIdx] = React.useState(b.compile.length); // all done by default
    const [compiled, setCompiled] = React.useState(true);
    const [graphView, setGraphView] = React.useState("journey");
    const [parseRun, setParseRun] = React.useState(0);
    React.useEffect(() => { if (compiled) setParseRun(r => r + 1); }, [compiled]);
    const graphRef = React.useRef(null);
    const navToGraph = React.useCallback((v) => {
      setGraphView(v);
      const main = document.querySelector(".main");
      const el = graphRef.current;
      if (main && el) main.scrollTo({ top: main.scrollTop + el.getBoundingClientRect().top - 90, behavior: "smooth" });
    }, []);
    const timers = React.useRef([]);
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

    // Honor a cross-screen jump from the Policy-as-Code guardrail trace:
    // open the journey map at the bound workflow node and highlight it.
    React.useEffect(() => {
      const j = window.__pacJump;
      if (!j) return;
      window.__pacJump = null;
      window.__jmHighlight = j.node || null;
      setUploaded(true);
      setGraphView("journey");
      const t = setTimeout(() => {
        const main = document.querySelector(".main");
        const el = graphRef.current;
        if (main && el) main.scrollTo({ top: main.scrollTop + el.getBoundingClientRect().top - 90, behavior: "smooth" });
      }, 360);
      return () => clearTimeout(t);
    }, []);

    function runCompile() {
      timers.current.forEach(clearTimeout); timers.current = [];
      setCompiled(false); setRunIdx(0);
      for (let i = 1; i <= b.compile.length; i++) {
        timers.current.push(setTimeout(() => setRunIdx(i), i * 850));
      }
      timers.current.push(setTimeout(() => setCompiled(true), b.compile.length * 850 + 400));
    }
    function applyUpload(name) { setDocName(name); setUploaded(true); runCompile(); }
    const replay = runCompile;

    if (!uploaded) return <UploadGate onApply={applyUpload} toast={toast} />;

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Business Requirements Document → Policy as Code</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Policy as Code</h1>
            <div className="ph-sub">Nothing in the spine is hand-wired. Dow's signed Business Requirements Document is ingested and compiled into the ontology the agents reason over, the policies PAC enforces, the decision rights that bound every actor, and the agents themselves. The artefact the reviewer signs is the artefact the runtime executes.</div>
          </div>
          <div className="ph-spacer" />
          <Button variant="dark" icon="document-chart" onClick={replay}>Replay the compile</Button>
        </div>

        <div className="brd2-hero">
          {/* The document */}
          <div className={`brd2-doc ${!compiled ? "compiling" : ""}`}>
            <span className="bd-ic"><Icon name="document-chart" size={22} /></span>
            <div className="bd-nm">{b.name}</div>
            <div className="bd-fl">{docName}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 7, flexWrap: "wrap" }}>
              <Badge tone="violet" dot="#8A4FBF">{b.version}</Badge>
              <Badge tone="green" dot="var(--k-status-success-100)">Signed off</Badge>
            </div>
            {compiled ? (
              <React.Fragment>
                <div className="bd-pages">
                  <div className="bd-sec">§2 Signal monitoring</div>
                  <div className="bd-line l" /><div className="bd-line m" />
                  <div className="bd-sec">§4 Stock positioning</div>
                  <div className="bd-line l" /><div className="bd-line s" />
                  <div className="bd-sec">§6 Margin governance · §7 Covenants</div>
                  <div className="bd-line m" /><div className="bd-line l" />
                </div>
                <div style={{ fontSize: 10.5, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.5 }}>{b.signed} · {b.pages} pages</div>
              </React.Fragment>
            ) : (
              <div className="panel-load">
                <span className="pl-label">Reading Dow's operating rules</span>
                <div className="pl-grid" />
                <div className="pl-grid tint" />
                <div className="pl-grid spruce" />
              </div>
            )}
          </div>

          {/* The compile */}
          <div>
            <div className="brd2-compile">
              {b.compile.map((s, i) => {
                const state = !compiled && runIdx === i ? "run" : (compiled || runIdx > i) ? "on" : "pending";
                return (
                  <div className={`brd2-step ${state}`} key={i}>
                    <span className="bs-num" style={state === "run" ? { background: "transparent", animation: "none" } : null}>{state === "on" ? tick : state === "run" ? <AiSpinner size={20} /> : i + 1}</span>
                    <span><span className="bs-l">{s.label}</span><div className="bs-s">{s.sub}</div></span>
                    {state === "on"
                      ? <span className="bs-out">{s.out}</span>
                      : <span className="bs-out"><span className={`kyn-skel ${state === "run" ? "ai" : ""}`} style={{ display: "inline-block", height: 10, width: 118, verticalAlign: "middle", opacity: state === "pending" ? 0.5 : 1 }} /></span>}
                  </div>
                );
              })}
            </div>

            <div className="brd2-cta">
              <span className="ai-glyph" style={{ width: 18, height: 18 }} />
              <div style={{ flex: 1, fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.5 }}>
                {compiled
                  ? <span><strong>Spine configured from the BRD.</strong> 198 policies live · 9 entity types resolved · 4 agents bound within their decision rights.</span>
                  : <span>Compiling the document into runtime configuration…</span>}
              </div>
              {compiled && <Button variant="prim" icon="arrow-up-right" onClick={() => setScreen("spine")}>Enter the running spine →</Button>}
            </div>
          </div>
        </div>

        {/* Output: what the BRD produced */}
        <div className={`brd2-out ${compiled ? "" : "hidden"}`}>
          <div className="spine-eyebrow" style={{ marginTop: 26 }}><span className="se-l">What the BRD compiled into</span><span className="se-r">Business activities, the group ontology, and decision rights — straight from the document. <strong style={{ color: "var(--k-spruce-70)" }}>Open any one in the graph below.</strong></span></div>
          <div className="compile-cols">
            <Col icon="anomaly" title="Business activities" count={`${b.activities.length}`} onNav={() => navToGraph("journey")} active={graphView === "journey"}>
              {b.activities.map((a, i) => {
                const ag = D.agents.find(x => x.id === a.agent);
                return (
                  <div className="cc-item" key={i}>
                    <div className="ci-main">{a.name}</div>
                    <div className="ci-from"><Icon name="document-chart" size={11} /> {a.from}</div>
                    <div className="ci-rel" style={{ color: ag.color }}>→ {ag.name}</div>
                  </div>
                );
              })}
            </Col>
            <Col icon="network" title="Group ontology" count={`${b.ontology.length}`} onNav={() => navToGraph("ontology")} active={graphView === "ontology"}>
              {b.ontology.map((o, i) => (
                <div className="cc-item" key={i}>
                  <div className="ci-main">{o.entity}</div>
                  <div className="ci-rel">{o.rel}</div>
                  <div className="ci-from" style={{ textTransform: "none" }}><Icon name="information" size={11} /> {o.note}</div>
                </div>
              ))}
            </Col>
            <Col icon="group" title="Decision rights / access" count={`${b.rights.length}`} onNav={() => navToGraph("rights")} active={graphView === "rights"}>
              {b.rights.map((r, i) => (
                <div className="cc-item" key={i}>
                  <div className="ci-main">{r.actor}</div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginTop: 3, lineHeight: 1.4 }}>{r.can}</div>
                  <div className="ci-gate"><Icon name="document-chart" size={10} style={{ verticalAlign: "-1px" }} /> {r.gate}</div>
                </div>
              ))}
            </Col>
          </div>

          {/* Everything from one BRD — animated extraction of exceptions, runtime & audit */}
          {compiled && <BrdParse runId={parseRun} />}

          {/* Decision graph — toggle through the compiled artifacts */}
          <div className="spine-eyebrow" style={{ marginTop: 26 }}><span className="se-l">The Decision Graph</span><span className="se-r">Toggle through what the BRD compiled — the group ontology, the business activities, who may decide what, and the live event path.</span></div>
          <GraphViews toast={toast} view={graphView} setView={setGraphView} mapRef={graphRef} />

          {/* LIMS lineage */}
          <div style={{ marginTop: 26 }}>
            <Collapsible title="LIMS · sample lineage" subtitle="Samples, lots and test results are first-class entities — the qualification journey, not a portal dead-end.">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Badge tone="green" dot="var(--k-status-success-100)">{lims.status}</Badge>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--fg-1)" }}>{lims.sample}</span>
                <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{lims.grade} · {lims.lot}</span>
              </div>
              {lims.lineage.map((s, i) => (
                <div className={`lims-row ${s.state}`} key={i}>
                  <span className="lm-node" />
                  <span><span className="lm-stage">{s.stage}</span><div className="lm-note">{s.note}</div></span>
                  <span className="lm-at">{s.at}</span>
                </div>
              ))}
            </Collapsible>
          </div>
        </div>
      </div>
    );
  }
  UI.ScreenBrd = ScreenBrd;
})();
