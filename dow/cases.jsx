/* ============================================================
   Cases — the central object. A hub of Application Cases and a
   detail view that gathers brief, products, sample experiment,
   compliance, incident, tests, commercial status, timeline and
   the internal Dow team for one case.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke } = UI;

  /* commercial spine ribbon */
  function Spine({ stage }) {
    const D = window.DX;
    return (
      <div className="dx-spine">
        {D.spine.map((s, i) => (
          <React.Fragment key={i}>
            <span className={`dx-spine-node ${i < stage ? "done" : i === stage ? "now" : ""}`}>
              <span className="dot">{i < stage ? <Stroke size={10} sw={3} children={<polyline points="20 6 9 17 4 12" />} /> : i + 1}</span>
              <span className="lb">{s}</span>
            </span>
            {i < D.spine.length - 1 && <span className={`dx-spine-bar ${i < stage ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  function typeChip(type) {
    const D = window.DX; const t = D.typeById(type);
    return <span className="dx-typechip"><Icon name={t.icon} size={12} /> {t.name}</span>;
  }

  /* ---------------- Cases hub ---------------- */
  function CasesHub({ onNav, onAskAgent }) {
    const D = window.DX;
    return (
      <div className="dx-scroll fade-in">
        <div className="dx-wrap">
          <div className="dx-crumb"><a onClick={() => onNav({ name: "home" })}>Home</a> <span className="sep">›</span> <b>Cases</b></div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, margin: "6px 0 8px" }}>
            <div>
              <div className="dx-eyebrow">Application cases</div>
              <h2 className="dx-h2" style={{ marginTop: 6 }}>Every interaction becomes a case</h2>
            </div>
            <div style={{ marginLeft: "auto" }}><button className="dx-btn ai" onClick={() => onAskAgent({ fresh: true })}><span className="dx-spark">✦</span> New with ChemAssist</button></div>
          </div>
          <p className="dx-lead" style={{ marginBottom: 22 }}>One materials lead, one Dow elastomer platform, three divisions. Mara's footwear, packaging and mobility lines all run on the same polyolefin elastomers — so a grade proven in one application, and the low-temperature know-how behind it, transfers to the next. Each case ties together the brief, samples, tests, compliance, orders and incidents, and ChemAssist works every one.</p>

          <div className="dx-caselist">
            {D.cases.map(c => {
              const t = D.typeById(c.type);
              return (
                <div className="dx-caserow" key={c.code} onClick={() => onNav({ name: "case", code: c.code })}>
                  <span className={`ci ${c.env === "plant" ? "red" : ""}`}><Icon name={c.icon} size={19} /></span>
                  <div className="cmain">
                    <div className="cid">{c.code} · {c.appLabel}</div>
                    <div className="ctt">{c.title}</div>
                    <div className="csm">{c.summary}</div>
                    <div className="crow">{typeChip(c.type)} <span className="dx-envchip"><Icon name={D.environments[c.env].icon} size={11} /> {D.environments[c.env].label}</span></div>
                  </div>
                  <div className="cmeta">
                    <span className={`b ${c.env === "plant" ? "red" : "spruce"}`} style={c.env === "plant" ? { background: "var(--k-warm-red-10)", color: "var(--k-warm-red-70)", borderColor: "var(--k-warm-red-20)" } : null}>{c.status}</span>
                    <span className="cstage">{D.spine[c.stage]} · stage {c.stage + 1}/{D.spine.length}</span>
                    <span className="cat">{c.opened}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.CasesHub = CasesHub;

  /* deal progression (inventory → sample → PO) + gate clearances */
  function DealGates({ c }) {
    const D = window.DX;
    const deal = D.dealFor(c.code);
    if (!deal || deal.phase === "support") return null;
    const phaseIdx = { inventory: 0, sample: 1, po: 2, reorder: 2 }[deal.phase];
    return (
      <Sec icon="network" title="Deal progression & gates">
        <div className="dx-funnel">
          {D.dealFunnel.map((p, i) => (
            <React.Fragment key={p}>
              <span className={`fn ${i < phaseIdx ? "done" : i === phaseIdx ? "now" : ""}`}>{p}</span>
              {i < 2 && <span className="farr"><Stroke size={15} d="M5 12h14M13 6l6 6-6 6" /></span>}
            </React.Fragment>
          ))}
        </div>
        <window.DXA.GateList c={c} ids={Object.keys(deal.gates)} title="Gate clearances · agent auto-clears within policy, exceptions route to Dow" />
      </Sec>
    );
  }

  /* the sales team working this case */
  function DealTeam({ c }) {
    const D = window.DX;
    const deal = D.dealFor(c.code) || { team: [], lead: null };
    const team = (deal.team || []).map(D.agentById).filter(Boolean);
    return (
      <Sec icon="group" title="Your deal team">
        <p style={{ fontSize: 12.5, color: "var(--dx-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>The ChemAssist sales agents working {c.code} — each owns a step and routes to a Dow human when a gate needs review.</p>
        {team.map(a => (
          <div className="dx-teamrow" key={a.id}>
            <span className="ta" style={{ background: a.tint, color: a.color }}><Icon name={a.icon} size={15} /></span>
            <div className="tm">
              <b>{a.name}{deal.lead === a.id && <span className="lead">Lead</span>}</b>
              <span>{a.role}</span>
              <span className="reach"><Icon name="arrow-up-right" size={10} /> {a.reach}</span>
            </div>
          </div>
        ))}
        <button className="dx-btn ghost sm" style={{ width: "100%", marginTop: 10 }} onClick={() => { window.location.href = "Dow Supply Chain on KAF.html"; }}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Open operator view</button>
      </Sec>
    );
  }

  /* ---------------- section helper ---------------- */
  function Sec({ icon, title, children, right }) {
    return (
      <div className="dx-card">
        <div className="ch"><Icon name={icon} size={17} style={{ color: "var(--dow-red)" }} /><h3>{title}</h3>{right}</div>
        {children}
      </div>
    );
  }

  /* ---------------- Case detail ---------------- */
  function CaseDetail({ code, onNav, onAskAgent, toast }) {
    const D = window.DX;
    const c = D.caseByCode(code) || D.cases[0];
    const t = D.typeById(c.type);
    const products = (c.products || []).map(D.productById);

    function continueAgent(intent) { onAskAgent({ intent: intent || t.mode, text: c.prompt, code: c.code, env: c.env, fresh: true }); }

    return (
      <div className="dx-scroll fade-in">
        {/* case header */}
        <div className="dx-case-head">
          <div className="dx-wrap">
            <div className="dx-crumb" style={{ paddingBottom: 12 }}><a onClick={() => onNav({ name: "home" })}>Home</a> <span className="sep">›</span> <a onClick={() => onNav({ name: "cases" })}>Cases</a> <span className="sep">›</span> <b>{c.code}</b></div>
            <div className="dx-case-top">
              <span className={`ci ${c.env === "plant" ? "red" : ""}`}><Icon name={c.icon} size={24} /></span>
              <div style={{ flex: 1 }}>
                <div className="cid">{c.code} · {c.trace} · {c.appLabel}</div>
                <h1>{c.title}</h1>
                <div className="crow">{typeChip(c.type)} <span className="dx-envchip"><Icon name={D.environments[c.env].icon} size={11} /> {D.environments[c.env].label}</span> <span className={`b ${c.env === "plant" ? "red" : "spruce"}`} style={c.env === "plant" ? { background: "var(--k-warm-red-10)", color: "var(--k-warm-red-70)", borderColor: "var(--k-warm-red-20)" } : null}>{c.status}</span></div>
              </div>
              <button className={`dx-btn ${c.env === "plant" ? "red" : "ai"}`} onClick={() => continueAgent()}>{c.env === "plant" ? <Icon name="warning-alt" size={16} /> : <span className="dx-spark">✦</span>} Continue in ChemAssist</button>
            </div>
            <Spine stage={c.stage} />
          </div>
        </div>

        <div className="dx-wrap">
          <div className="dx-case-grid">
            <div>
              {D.regAlert.affects.case === c.code && (
                <div className="dx-caseRR">
                  <span className="ri"><Icon name="anomaly" size={16} /></span>
                  <div className="rb">
                    <div className="rt">RegRadar · proactive regulatory alert <span className="rsev">{D.regAlert.severity} impact</span></div>
                    <div className="rd"><b>{D.regAlert.rule}</b> — {D.regAlert.change} Effective {D.regAlert.effective}.</div>
                    <div className="ra"><span className="ai-glyph" style={{ width: 13, height: 13 }} /> {D.regAlert.action}</div>
                  </div>
                  <div className="rax">
                    <button className="dx-btn red sm" onClick={() => onAskAgent({ intent: "compliance", text: "Refresh the EU 10/2011 declaration flagged by RegRadar", code: c.code, fresh: true })}>Prepare declaration</button>
                    <button className="dx-btn ghost sm" onClick={() => window.DX.toOperator(D.regAlert.spineScreen, c.trace)}><span className="ai-glyph" style={{ width: 12, height: 12 }} /> Open in RegRadar ↗</button>
                  </div>
                </div>
              )}
              {/* brief */}
              <Sec icon="chat-bot" title="Application brief">
                <div className="dx-kvgrid">{c.brief.map((b, i) => <div className="dx-kv" key={i}><span className="k">{b[0]}</span><span className="v">{b[1]}</span></div>)}</div>
              </Sec>

              <DealGates c={c} />

              {/* products */}
              {products.length > 0 && (
                <Sec icon="recommend" title="Recommended products" right={<span className="more" onClick={() => continueAgent("selector")}>Open in agent</span>}>
                  {products.map((p, i) => (
                    <div className="dx-orow" key={p.id}>
                      <span className="oi" style={{ background: `linear-gradient(135deg, ${p.accent}, #14171C)`, color: "#fff" }}>{p.logo ? <img className="plogo" src={p.logo} alt={p.name} /> : <b style={{ fontFamily: "var(--font-display)" }}>{p.name.split(" ")[0][0]}</b>}</span>
                      <div className="om"><b>{p.name}</b><span>{p.family} · {p.tagline}</span></div>
                      <div className="ostat"><span className="b spruce">{p.fit}% fit</span><button className="dx-btn ghost sm" onClick={() => onNav({ name: "product", id: p.id })}>View</button></div>
                    </div>
                  ))}
                </Sec>
              )}

              {/* sample experiment */}
              {c.experiment && (
                <Sec icon="lightbulb" title="Sample experiment plan" right={<span className="more" onClick={() => onNav({ name: "samplelab", code: c.code })}>Open sample lab</span>}>
                  <div className="dx-exp-obj" style={{ marginBottom: 10 }}><Icon name="lightbulb" size={13} /> {c.experiment.objective}</div>
                  {c.experiment.rounds ? c.experiment.rounds.map(r => (
                    <div className={`dx-exprow ${r.done ? "" : "active"}`} key={r.n}>
                      <span className="rn">{r.n}</span>
                      <div style={{ flex: 1 }}><b>Round {r.n}</b><span>{r.config}</span><span style={{ color: "var(--dx-muted)" }}>{r.result}</span></div>
                      <span className={`dx-comply ${r.tone === "warn" ? "review" : "ok"}`}>{r.verdict}</span>
                    </div>
                  )) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{c.experiment.packs.map((p, i) => <span className="dx-pchip" key={i}><Icon name="recommend" size={12} /> {p[0]} · {p[1]}</span>)}</div>
                  )}
                  <div className="dx-comply ok" style={{ marginTop: 12 }}><Icon name="checkmark-filled" size={13} /> Samples treated as experiments — tied to this application & test objective</div>
                </Sec>
              )}

              {/* incident */}
              {c.incident && (
                <Sec icon="warning-alt" title="Production incident">
                  <div className="dx-say" style={{ fontWeight: 600, marginBottom: 6 }}>{c.incident.headline}</div>
                  <div className="dx-diaggrid">{c.incident.contributors.map((co, i) => <div className="dx-contrib" key={i}><span className={`bar ${co[2]}`} /><span className="ck">{co[0]}</span><span className="cw">{co[1]}</span></div>)}</div>
                  <div className="dx-safety"><div className="sh"><Icon name="error-filled" size={14} /> Safety boundaries — locked <span className="lock">Unalterable</span></div>{c.incident.safety.map((s, i) => <div className="sr" key={i}><Icon name="checkmark-filled" size={13} /> {s}</div>)}</div>
                </Sec>
              )}

              {/* formulation guidance */}
              {c.guidance && (
                <Sec icon="document-chart" title="Formulation guidance">
                  <div className="dx-say" style={{ fontWeight: 600, marginBottom: 4 }}>{c.guidance.headline}</div>
                  {c.guidance.ranges.map((r, i) => <div className="dx-range" key={i}><span className="rk">{r[0]}</span><span className="rv">{r[1]}</span><span className="rn">{r[2]}</span></div>)}
                  <div className="dx-boundary" style={{ marginTop: 10 }}><Icon name="information" size={14} /><span>{c.guidance.boundary}</span></div>
                </Sec>
              )}

              {/* compliance */}
              {c.compliance && (
                <Sec icon="anomaly" title={`Compliance · ${c.compliance.jurisdiction}`} right={<span className="more" onClick={() => continueAgent("compliance")}>Open in agent</span>}>
                  {c.compliance.domains.map((d, i) => (
                    <div className="dx-comprow" key={i}><Icon name={d[2] ? "checkmark-filled" : "warning-alt"} size={15} style={{ color: d[2] ? "var(--k-status-success-100)" : "var(--k-status-warning-110)", flexShrink: 0 }} /><span className="ck">{d[0]}</span><span className="cv">{d[1]}</span></div>
                  ))}
                  <div className="dx-source">{c.compliance.source}</div>
                </Sec>
              )}

              {/* commercial */}
              {c.commercial && (
                <Sec icon="analytics" title="Commercial status" right={<span className="more" onClick={() => continueAgent("conversion")}>Opportunity view</span>}>
                  <div className="dx-qual"><span className="ql">Qualification</span><span className="qb"><div style={{ width: c.commercial.qualification + "%" }} /></span><span className="qv">{c.commercial.qualification}%</span></div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dx-subtle)", textTransform: "uppercase", letterSpacing: ".06em", margin: "12px 0 6px" }}>Blockers</div>
                  {c.commercial.blockers.map((b, i) => <div className="dx-caveat" key={i}><Icon name="warning-alt" size={13} style={{ color: "var(--k-status-warning-110)" }} /> {b}</div>)}
                  <div className="dx-action" style={{ marginTop: 10, marginBottom: 0 }}><div className="ah"><Icon name="arrow-up-right" size={14} style={{ color: "var(--k-spruce-70)" }} /><b>Next action</b></div><div className="arow">{c.commercial.next}</div></div>
                </Sec>
              )}
            </div>

            {/* sidebar: timeline + Dow team (internal overlay) */}
            <aside>
              <Sec icon="network" title="Case timeline">
                <div className="dx-tl">
                  {D.spine.slice(0, c.stage + 2).map((s, i) => (
                    <div className={`dx-tlstep ${i < c.stage ? "done" : i === c.stage ? "active" : "pending"}`} key={i}>
                      <div className="rail"><span className="node" /></div>
                      <div><div className="tlt">{s}</div><div className="tld">{i < c.stage ? "complete" : i === c.stage ? "in progress" : "next"}</div></div>
                    </div>
                  ))}
                </div>
                <button className="dx-btn ghost sm" style={{ width: "100%", marginTop: 10 }} onClick={() => onNav({ name: "history", code: c.code })}><Stroke size={13} children={<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />} /> Replay full history</button>
              </Sec>
              <DealTeam c={c} />
            </aside>
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.CaseDetail = CaseDetail;
})();
