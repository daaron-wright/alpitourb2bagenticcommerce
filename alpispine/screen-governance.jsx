/* ============================================================
   Screen — Governance · Policy as Code
   Document → code (BRD ingest) · Runtime · Audit-as-query
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Eyebrow, Button, Badge } = UI;

  function CompileCol({ icon, title, count, children }) {
    return (
      <div className="cc-col">
        <div className="cch">
          <Icon name={icon} size={15} style={{ color: "#6B36A8" }} />
          <span className="ct">{title}</span>
          <span className="cn">{count}</span>
        </div>
        {children}
      </div>
    );
  }

  function GlobalCompliance({ bare }) {
    const COUNTRIES = [
      { c: "Germany · EU", s: "ok", note: "Retention permitted; GDPR baseline met.", ctrl: "—", ev: "DPIA on file" },
      { c: "United States", s: "diff", note: "State breach-notice windows differ by state.", ctrl: "State-level notification control", ev: "Notification log" },
      { c: "China · PIPL", s: "gap", note: "Cross-border transfer not covered; must be localised.", ctrl: "Local storage + separate consent gate", ev: "Consent & transfer record" },
      { c: "Brazil · LGPD", s: "diff", note: "Shorter retention unless a legal basis applies.", ctrl: "Auto-delete trigger on expiry", ev: "Deletion audit" },
      { c: "India · DPDP", s: "evid", note: "Compliant as written — extra audit evidence required.", ctrl: "—", ev: "Extended audit trail" },
      { c: "Singapore", s: "conflict", note: "Blanket-access rule not valid; needs local approval.", ctrl: "Local approver gate before access", ev: "Approval record" },
    ];
    const SB = { ok: "Aligned", diff: "Difference", gap: "Gap", conflict: "Conflict", evid: "Evidence" };
    const Collapsible = UI.Collapsible;
    return (
      <div style={{ marginBottom: 8 }}>
        {!bare && <div className="spine-eyebrow"><span className="se-l">One policy, every country</span><span className="se-r">A second example of the same engine: one corporate policy, uploaded once, resolved against each country's law.</span></div>}
        <div className="panel" style={{ padding: 18 }}>
          <div className="gc-head">
            <span className="gc-ic"><Icon name="document-chart" size={19} /></span>
            <div>
              <div className="t">Global data-handling policy</div>
              <div className="s">Uploaded once · applied as written where it fits, varied locally where the law differs.</div>
            </div>
            <span className="cn">{COUNTRIES.length} countries assessed</span>
          </div>
          <div className="gc-strip">
            {COUNTRIES.map((r, i) => (
              <div className="gc-chip" key={i}>
                <div>
                  <div className="c">{r.c}</div>
                  <div className="n">{r.note}</div>
                </div>
                <span className={`pac-badge ${r.s}`}>{SB[r.s]}</span>
              </div>
            ))}
          </div>
          {Collapsible ? (
            <div style={{ marginTop: 14 }}>
              <Collapsible title="Required local control & evidence, per country" subtitle="What must be in place before the policy can operate in each jurisdiction.">
                <table className="pac-table">
                  <thead><tr><th>Country</th><th>Status</th><th>Required local control</th><th>Evidence</th></tr></thead>
                  <tbody>
                    {COUNTRIES.map((r, i) => (
                      <tr key={i}>
                        <td className="pc-c">{r.c}</td>
                        <td><span className={`pac-badge ${r.s}`}>{SB[r.s]}</span></td>
                        <td className="pc-ctrl">{r.ctrl === "—" ? <span className="dash">none — as written</span> : r.ctrl}</td>
                        <td className="pc-ev">{r.ev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapsible>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
     Compliant product purchasing — the concept made into a
     state machine, driven by the real product inventory:
     product → documents → requirements → rules → decision.
     --------------------------------------------------------- */
  function ProductPurchase() {
    const PRODUCTS = window.PAC_PRODUCTS;
    const APPS = window.PAC_APPS;
    const [prodId, setProdId] = React.useState(PRODUCTS[0].id);
    const product = PRODUCTS.find(p => p.id === prodId) || PRODUCTS[0];
    const app = APPS[product.app];
    const DOCS = app.docs, REQS = app.reqs, RULES = app.rules, SCN = app.scns;

    const OUTS = [
      ["allow", "checkmark-filled", "Allowed", "All applicable rules pass — order is released to fulfilment."],
      ["cond", "warning-alt", "Conditional", "Permitted once named evidence or sign-off is on file."],
      ["declined", "error-filled", "Declined", "A rule blocks the sale — the request cannot proceed."],
    ];
    const ST = { pass: "Pass", cond: "Review", block: "Blocked" };
    const [sel, setSel] = React.useState(SCN[0].id);
    React.useEffect(() => { setSel(app.scns[0].id); }, [prodId]);
    const scn = SCN.find(s => s.id === sel) || SCN[0];
    const outIcon = { allow: "checkmark-filled", cond: "warning-alt", declined: "error-filled" }[scn.out];

    // family-grouped selector
    const FAMS = [];
    PRODUCTS.forEach(p => { let f = FAMS.find(x => x.fam === p.fam); if (!f) { f = { fam: p.fam, family: p.family, items: [] }; FAMS.push(f); } f.items.push(p); });

    return (
      <div style={{ marginBottom: 22 }}>
        {/* Product inventory selector */}
        <div className="spine-eyebrow"><span className="se-l">The package inventory</span><span className="se-r">Pick a package. Its documents, requirements, rules and booking decision are all specific to that package.</span></div>
        <div className="panel" style={{ padding: "14px 16px", marginBottom: 14 }}>
          <div className="pp-pick">
            {FAMS.map(f => (
              <div className="pp-fam" key={f.fam}>
                <div className="pp-fam-h">{f.fam} <span>· {f.family.replace(/ \(.*\)/, "")}</span></div>
                <div className="pp-fam-row">
                  {f.items.map(p => (
                    <button key={p.id} className={`pp-chip ${prodId === p.id ? "on" : ""}`} onClick={() => setProdId(p.id)}
                      style={prodId === p.id ? { borderColor: p.accent, boxShadow: `inset 0 0 0 1px ${p.accent}` } : null}>
                      <span className="pp-dot" style={{ background: p.accent }}></span>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The compliance graph — what the platform builds from the documents */}
        <div className="spine-eyebrow"><span className="se-l">The compliance graph</span><span className="se-r">A package's documents become connected, enforceable policy — not static files. Read left to right: product → documents → requirements → rules → decision.</span></div>
        <div className="panel" style={{ padding: "16px 14px" }}>
          <div className="ppc-graph">
            <div className="ppc-stage">
              <div className="ppc-sh">Package</div>
              <div className="ppc-shx">The selected Alpitour package at the centre.</div>
              <div className="ppc-col">
                <div className="ppc-prod" style={{ background: `linear-gradient(150deg, ${product.accent}, #14171C 135%)` }}>
                  <img className="ppc-logo" src={product.logo} alt={product.fam} />
                  <div className="pn">{product.name}</div>
                  <div className="ps">{product.tagline}</div>
                  <div className="ppc-props">
                    {product.props.map((pr, i) => <span key={i} className="ppc-prop"><b>{pr[1]}</b>{pr[0]}</span>)}
                  </div>
                  <div className="pm">{product.meta}</div>
                </div>
              </div>
            </div>
            <div className="ppc-stage">
              <div className="ppc-sh">Governing documents</div>
              <div className="ppc-shx">The sheets that govern its sale &amp; use.</div>
              <div className="ppc-col">
                {DOCS.map((d, i) => (
                  <div className="ppc-doc" key={i}>
                    <span className="dc">{d.c}</span>
                    <div><div className="dn">{d.name}</div><div className="dx">{d.x}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ppc-stage">
              <div className="ppc-sh">Document requirements</div>
              <div className="ppc-shx">Obligations, restrictions &amp; evidence, extracted.</div>
              <div className="ppc-col" style={{ gap: 0 }}>
                {REQS.map((r, i) => (
                  <div className="ppc-req" key={i}><span className="rd">{r[0]}</span><span>{r[1]}</span></div>
                ))}
              </div>
            </div>
            <div className="ppc-stage">
              <div className="ppc-sh">Policy rules</div>
              <div className="ppc-shx">Requirements converted into testable rules.</div>
              <div className="ppc-col">
                {RULES.map((r, i) => (
                  <div className="ppc-rule" key={i}>
                    <span className="rn">{i + 1}</span>
                    <div><div className="rt">{r.t}</div><div className="rx">{r.x}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ppc-stage">
              <div className="ppc-sh">Decision outcome</div>
              <div className="ppc-shx">Evaluated on every booking request.</div>
              <div className="ppc-col">
                {OUTS.map((o, i) => (
                  <div className={`ppc-out ${o[0]}`} key={i}>
                    <div className="ot"><Icon name={o[1]} size={14} /> {o[2]}</div>
                    <div className="ox">{o[3]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The decision state machine — a purchase request, evaluated live */}
        <div className="spine-eyebrow" style={{ marginTop: 22 }}><span className="se-l">The decision · a booking request, evaluated</span><span className="se-r">Pick who is booking <b>{product.name}</b>. The product's rules run against the request and resolve to one terminal state — with the reason and any required step attached.</span></div>
        <div className="panel" style={{ padding: 18 }}>
          <div className="ppc-sm-head">
            <span className="ppc-sm-lbl">Booking request</span>
            {SCN.map(s => (
              <button key={s.id} className={`ppc-scn ${s.out} ${sel === s.id ? "on" : ""}`} onClick={() => setSel(s.id)}>
                <span className="st">{s.title}</span>
                <span className="ss">{s.sub}</span>
              </button>
            ))}
          </div>
          <div className="ppc-sm">
            <div className="ppc-eval">
              {RULES.map((r, i) => {
                const st = scn.ev[i];
                return (
                  <div className="ppc-ev-row" key={i}>
                    <span className={`ppc-ev-n ${st}`}>{i + 1}</span>
                    <div>
                      <div className="ppc-ev-t">{r.t}</div>
                      <div className="ppc-ev-x">{r.x}</div>
                    </div>
                    <span className={`ppc-st ${st}`}>{ST[st]}</span>
                  </div>
                );
              })}
            </div>
            <div className={`ppc-term ${scn.out}`}>
              <div className="tm-state"><Icon name={outIcon} size={20} /> {scn.out === "allow" ? "Allowed" : scn.out === "cond" ? "Conditional" : "Declined"}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-1)", marginTop: 8 }}>{scn.verdict}</div>
              <div className="tm-sub">{scn.body}</div>
              <div className="tm-req">
                <div className="tm-req-h">{scn.out === "cond" ? "Required before release" : scn.out === "declined" ? "Why it is blocked" : "Evidence on file"}</div>
                {scn.req.map((q, i) => (
                  <div className="tm-req-i" key={i}><Icon name={q[0]} size={13} /> <span>{q[1]}</span></div>
                ))}
              </div>
              <div className="tm-rule"><b>Reason chain → source rule</b><br />PKG-{product.id} · {scn.rule}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* The five guardrails, each traced end-to-end. The DEC-/rule/result/chain
     match D.audit exactly; clause + logic + binding are the BRD provenance. */
  const GUARDRAILS = [
    {
      id: "covenant", dec: "DEC-99412", rule: "PROM-covenant-rossi", ref: "§7.1", result: "allow",
      bound: "Travel compliance", agent: "Allotment agent", action: "Evaluate re-point proposal", at: "06:26:02",
      clause: "A re-accommodation must preserve the booked room class, board and family amenities for strategic-tier agencies.",
      logic: "repoint.room_class == covenant.room_class AND repoint.amenities ⊇ covenant.must_haves",
      node: "PAC Controlled Action Check", up: "Tour-Ops Agent Analysis",
      branches: [{ l: "Action Level Determination", tone: "allow", taken: true }, { l: "Planner Evidence Screen", tone: "flag" }, { l: "Closed — Denied by Policy", tone: "deny" }],
      reason: "covenant amenities match → allow", chain: "Playbook §7.1 → covenant amenities match → allow",
      bind: "pac",
      tests: [["Re-point preserves room class + amenities", "allow"], ["Re-point drops a must-have amenity", "deny"], ["Non-strategic-tier agency", "allow — no covenant"]],
    },
    {
      id: "export", dec: "DEC-99411", rule: "TRV-advisory-EG", ref: "§3.4", result: "allow",
      bound: "Travel compliance", agent: "Allotment agent", action: "Evaluate re-point proposal", at: "06:26:01",
      clause: "A re-accommodation inside the same resort corridor needs no new advisory assessment while the advisory level is unchanged.",
      logic: "repoint.corridor == booking.corridor AND advisory.level <= 2",
      node: "PAC Controlled Action Check", up: "Tour-Ops Agent Analysis",
      branches: [{ l: "Action Level Determination", tone: "allow", taken: true }, { l: "Planner Evidence Screen", tone: "flag" }, { l: "Closed — Denied by Policy", tone: "deny" }],
      reason: "advisory unchanged → no PTD trigger", chain: "Playbook §3.4 → advisory unchanged → no PTD trigger",
      bind: "pac",
      tests: [["Same corridor, advisory ≤ 2", "no new assessment"], ["Corridor change on the re-point", "assessment required"], ["Advisory level raised mid-window", "route to trade desk"]],
    },
    {
      id: "working-capital", dec: "DEC-99410", rule: "FIN-refund-exposure-EU", ref: "§4.2", result: "allow",
      bound: "Commercial controls", agent: "Allotment agent", action: "Evaluate re-point proposal", at: "06:26:00",
      clause: "Agents may commit refund exposure up to the approved seasonal headroom without escalation.",
      logic: "commitment.exposure_eur <= refund_exposure.headroom_eur  // €310k",
      node: "PAC Controlled Action Check", up: "Tour-Ops Agent Analysis",
      branches: [{ l: "Action Level Determination", tone: "allow", taken: true }, { l: "Planner Evidence Screen", tone: "flag" }, { l: "Closed — Denied by Policy", tone: "deny" }],
      reason: "€310k headroom → in bounds", chain: "Playbook §4.2 → €310k headroom → in bounds",
      bind: "pac",
      tests: [["Commit ≤ €310k headroom", "allow"], ["Commit exceeds headroom", "escalate to finance"], ["Headroom unknown / stale", "route to planner"]],
    },
    {
      id: "margin-floor", dec: "DEC-99404", rule: "FIN-margin-floor-IT", ref: "§6.3", result: "flag",
      bound: "Commercial controls", agent: "Yield agent", action: "Recompute margin & exposure", at: "06:19:11",
      clause: "Any action pricing one or more departures at or below the margin floor must be routed to a human planner.",
      logic: "count(dep where dep.margin <= margin_floor) > 0 → route_to_human",
      node: "PAC Controlled Action Check", up: "Tour-Ops Agent Analysis",
      branches: [{ l: "Action Level Determination", tone: "allow" }, { l: "Planner Evidence Screen", tone: "flag", taken: true }, { l: "Closed — Denied by Policy", tone: "deny" }],
      reason: "14 departures ≤ floor → route to planner", chain: "Playbook §6.3 → 14 departures ≤ floor → route to planner",
      bind: "pac",
      tests: [["Any departure at or below the floor", "route to planner"], ["All departures above the floor", "auto-allow"], ["Departure exactly at the floor (≤ inclusive)", "route to planner"]],
    },
    {
      id: "sop-turnaround", dec: "DEC-99388", rule: "OPS-SOP-rotation", ref: "§8.1", result: "pass",
      bound: "Ops SOPs", agent: "Disruption agent", action: "Open disruption ticket", at: "06:14:03",
      clause: "Automated actions are blocked while an affected Neos rotation is mid-operation; outside it they may proceed.",
      logic: "now NOT IN rotation_window  →  safe_to_act",
      node: "Ops Signal Assessment", up: "Request Intake & Classification",
      branches: [{ l: "Tour-Ops Agent Analysis", tone: "pass", taken: true }, { l: "Human Escalation Router", tone: "flag" }, { l: "Closed — No Action", tone: "deny" }],
      reason: "no rotation conflict → safe to act", chain: "Playbook §8.1 → no rotation conflict → safe to act",
      bind: "signal",
      tests: [["Action falls inside an active rotation", "block auto-action"], ["Action outside any rotation window", "safe to act"], ["Rotation schedule missing", "block — fail safe"]],
    },
  ];
  const RES_LABEL = { allow: "ALLOW", flag: "FLAG", pass: "PASS", deny: "DENY" };

  // The guardrail-binding decision graph — only the workflow steps that
  // carry guardrails, with the selected guardrail's node + outcome lit.
  function BindingGraph({ g, onJump }) {
    const STEPS = [
      { id: "signal", t: "Signal Assessment", s: "Disruption & rotation check", pins: ["OPS-SOP-rotation"],
        outs: [{ t: "Proceed", s: "→ agent analysis", tone: "pass" }, { t: "Escalate", s: "→ human router", tone: "flag" }, { t: "No action", s: "→ closed", tone: "deny" }] },
      { id: "analysis", t: "Agent Analysis", s: "Yield · allotment · demand", pins: [] },
      { id: "pac", t: "PAC Controlled Action Check", s: "Policy gate before any commit", gate: true,
        pins: ["PROM-covenant-rossi", "TRV-advisory-EG", "FIN-refund-exposure-EU", "FIN-margin-floor-IT"],
        outs: [{ t: "Action Level", s: "→ commit", tone: "allow" }, { t: "Planner Evidence", s: "→ human sign-off", tone: "flag" }, { t: "Closed — Denied", s: "→ blocked", tone: "deny" }] },
    ];
    const active = g.bind; // "signal" | "pac"
    const tone = g.result; // allow | flag | pass
    const activeStep = STEPS.find(s => s.id === active);
    return (
      <div className="bg">
        <div className="bg-cap">The agentic workflow · guardrail enforcement points</div>
        <div className="bg-row">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`bg-node ${s.gate ? "gate" : ""} ${active === s.id ? "on" : "dim"}`}>
                <div className="bg-nt">{s.t}</div>
                <div className="bg-ns">{s.s}</div>
                {s.gate && <span className="bg-gate-tag"><Icon name="document-chart" size={9} /> Policy gate</span>}
                {s.pins.length > 0 && (
                  <div className="bg-pins">
                    {s.pins.map(p => <span key={p} className={`bg-pin ${p === g.rule ? "on " + tone : ""}`}>{p}</span>)}
                  </div>
                )}
              </div>
              {i < STEPS.length - 1 && <div className={`bg-arr ${active === "signal" && s.id === "signal" ? "lit" : ""}`}>›</div>}
            </React.Fragment>
          ))}
        </div>
        {activeStep && activeStep.outs && (
          <div className="bg-fan">
            <div className="bg-fan-l"><b>{activeStep.t}</b> evaluates the rule and resolves to one outcome:</div>
            <div className="bg-outs">
              {activeStep.outs.map((o, i) => (
                <div key={i} className={`bg-out ${o.tone} ${o.tone === tone ? "on" : ""}`}>
                  <div className="bo-t">{o.t}</div>
                  <div className="bo-s">{o.s}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="bg-jump" onClick={onJump}><Icon name="network" size={14} /> Open the full decision graph →</button>
      </div>
    );
  }

  function GuardrailTrace({ sel, setSel, traceRef, setScreen, toast }) {
    const g = GUARDRAILS.find(x => x.id === sel) || GUARDRAILS[0];
    function jump() {
      window.__pacJump = { node: g.node };
      toast && toast(`Opening the decision graph at “${g.node}”.`);
      setScreen && setScreen("brd");
    }
    return (
      <div ref={traceRef} style={{ marginBottom: 24, scrollMarginTop: 90 }}>
        <div className="spine-eyebrow"><span className="se-l">From the document to the guardrail</span><span className="se-r">Pick a guardrail — see the playbook clause it came from, where it is enforced in the workflow, and the decision it produced.</span></div>
        <div className="panel" style={{ padding: 20 }}>
          <div className="gt-lead">Each clause in the signed playbook compiles into a rule, that rule is bound to the exact step in the agentic workflow where it is enforced, and every decision is written back to the audit trail — traced to the article it came from.</div>
          <div className="gt-tabs">
            {GUARDRAILS.map(x => (
              <button key={x.id} className={`gt-tab ${sel === x.id ? "on" : ""}`} onClick={() => setSel(x.id)}>
                <span className={`d gt-d ${x.result}`}></span>
                <span className="r">{x.rule}</span>
                <span className="ref">{x.ref}</span>
                <span className={`res ${x.result}`}>{RES_LABEL[x.result]}</span>
              </button>
            ))}
          </div>

          {/* The decision graph — where this guardrail binds */}
          <BindingGraph g={g} onJump={jump} />

          {/* The 4-stage trace: paper → rule → runtime → audit */}
          <div className="gt-rail4">
            <div className="gt-stage paper">
              <div className="gt-kick"><span className="gt-num">01</span> On paper · the playbook</div>
              <div className="gt-doc"><Icon name="document-chart" size={13} /> Alpitour Tour-Operating Playbook · Summer EU</div>
              <span className="gt-ref-pill">{g.ref} · {g.bound}</span>
              <div className="gt-clause">“{g.clause}”</div>
            </div>
            <div className="gt-stage code">
              <div className="gt-kick"><span className="gt-num">02</span> Compiled · the rule</div>
              <div className="gt-rule">{g.rule}</div>
              <div className="gt-logic"><span className="gk">when</span> {g.logic}</div>
              <div className="gt-ver">policy_version = alp-sop-to-eu-v3.1</div>
            </div>
            <div className="gt-stage run">
              <div className="gt-kick"><span className="gt-num">03</span> At runtime · the decision</div>
              <div className="gt-run-agent"><b>{g.agent}</b> · {g.action}</div>
              <span className={`gt-verdict ${g.result}`}>{RES_LABEL[g.result]}</span>
              <div className="gt-reason">{g.reason}</div>
              <div className="gt-time">{g.at} CET</div>
            </div>
            <div className="gt-stage audit">
              <div className="gt-kick"><span className="gt-num">04</span> On the record · audit</div>
              <div className="gt-dec">{g.dec}</div>
              <div className="gt-chain">{g.chain}</div>
              <span className="gt-ref-pill back">↩ back to {g.ref}</span>
              <div className="gt-seal"><Icon name="checkmark-filled" size={12} /> Sealed · shared with audit</div>
            </div>
          </div>

          <div className="gt-loop">
            <Icon name="information" size={15} />
            <div className="gt-loop-t">The clause on paper (<b>{g.ref}</b>) is the rule enforced at runtime, and the same <b>{g.ref}</b> is what the audit record points back to — <b>same article, both ends of the line</b>.</div>
          </div>
        </div>
      </div>
    );
  }

  // "Tested before it ships" — the selected guardrail's test cases.
  function RuleUnderTest({ g }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div className="spine-eyebrow"><span className="se-l">Tested before it ships</span><span className="se-r">A guardrail is only as trusted as the cases that prove it. Each rule carries tests for the paths that allow, route and block.</span></div>
        <div className="panel" style={{ padding: 20 }}>
          <div className="rt-head">
            <span className="rt-rule">{g.rule}</span>
            <span className="rt-meta"><Icon name="checkmark-filled" size={13} /> {g.tests.length} tests · all passing</span>
          </div>
          {g.tests.map((t, i) => (
            <div className="rt-test" key={i}>
              <div className="rt-given"><span className="lab">Given</span>{t[0]}</div>
              <Icon name="arrow-up-right" size={14} className="rt-arrow" />
              <div className="rt-then"><span className="lab">Decision</span>{t[1]}</div>
              <span className="rt-pass">PASS</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ScreenGovernance({ toast, setScreen }) {
    const D = window.D;
    const b = D.brd;
    const [filter, setFilter] = React.useState("all");
    const rows = D.audit.filter(r => filter === "all" ? true : filter === "brandt" ? r.customer === "Rossi Travel" : r.agent === filter);
    const [traceSel, setTraceSel] = React.useState("covenant");
    const traceRef = React.useRef(null);
    const gsel = GUARDRAILS.find(x => x.id === traceSel) || GUARDRAILS[0];
    const byRule = {}; GUARDRAILS.forEach(x => { byRule[x.rule] = x.id; });
    function traceFromAudit(rule) {
      const id = byRule[rule]; if (!id) return;
      setTraceSel(id);
      const main = document.querySelector(".main"); const el = traceRef.current;
      if (main && el) main.scrollTo({ top: main.scrollTop + el.getBoundingClientRect().top - 90, behavior: "smooth" });
    }

    return (
      <div>
        <div className="page-head">
          <div>
            <Eyebrow tone="ai">Policy as Code · travel compliance, as code</Eyebrow>
            <h1 style={{ marginTop: 6 }}>Package documents become a live booking decision.</h1>
            <div className="ph-sub">Every Alpitour package carries fact-sheet, entry-rule and consumer-protection documentation that defines where it can be sold, who can travel on it, and what must be in place before a booking can proceed. PAC ingests those documents, extracts the rules, conditions and restrictions, and represents them as connected policy nodes — so when an agency attempts to book, the applicable rules are evaluated and the system returns an <strong>allowed</strong>, <strong>declined</strong> or <strong>conditional</strong> decision, with the reason attached.</div>
          </div>
        </div>

        {/* CONCEPT · COMPLIANT PRODUCT PURCHASING — the state machine */}
        <ProductPurchase />

        {/* Everything beneath the graph is the proof — folded away so the graph leads. */}
        <div className="spine-eyebrow"><span className="se-l">Under the graph · the proof</span><span className="se-r">The same rules, traced from the signed playbook to runtime and audit. Expand any layer.</span></div>
        <div className="panel" style={{ padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14, borderLeft: "3px solid #8A4FBF" }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: "var(--k-dark-stone-90)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="document-chart" size={19} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg-1)" }}>{b.name} <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", fontWeight: 400 }}>· {b.version}</span></div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 2 }}>{b.compiled} policies · {b.tests} tests · ontology + decision rights · signed by {b.signed}</div>
          </div>
          <Button variant="ghost" icon="arrow-up-right" onClick={() => setScreen("brd")}>See the compile →</Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* THE GUARDRAIL TRACE + tests — folded */}
          <UI.Collapsible title="The guardrail trace" subtitle="Clause → compiled rule → workflow → runtime → audit, with the tests that prove each.">
            <GuardrailTrace sel={traceSel} setSel={setTraceSel} traceRef={traceRef} setScreen={setScreen} toast={toast} />
            <RuleUnderTest g={gsel} />
          </UI.Collapsible>

          {/* EVERY DECISION, ON THE RECORD — folded */}
          <UI.Collapsible title="Every decision, on the record" subtitle="One row per decision, traced to its playbook clause." badge={`${D.audit.length} records`}>
            <div className="panel" style={{ padding: 16, marginTop: 12 }}>
              <div className="audit-q">
                <span className="aq-lbl">Filter</span>
                {[{ k: "all", l: "all decisions" }, { k: "pac", l: "agent: PAC" }, { k: "cost", l: "agent: yield" }, { k: "anomaly", l: "agent: disruption" }, { k: "brandt", l: "agency: Rossi" }].map(f => (
                  <button key={f.k} className={`aq-f ${filter === f.k ? "on" : ""}`} onClick={() => setFilter(f.k)}>{f.l}</button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{rows.length} record{rows.length === 1 ? "" : "s"}</span>
              </div>
              <table className="audit-tbl">
                <thead>
                  <tr><th>Decision</th><th>Time</th><th>Action</th><th>Rule</th><th>Result</th><th>Reason chain → source rule</th></tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} className={`audit-row ${byRule[r.rule] === traceSel ? "on" : ""}`} onClick={() => traceFromAudit(r.rule)} title="Trace this decision back to its playbook clause">
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
          </UI.Collapsible>

          {/* SECOND EXAMPLE — folded */}
          <UI.Collapsible title="One policy, every country" subtitle="The same engine resolving one corporate policy against each jurisdiction's law.">
            <div style={{ marginTop: 12 }}>
              <GlobalCompliance bare />
            </div>
          </UI.Collapsible>
        </div>
      </div>
    );
  }
  UI.ScreenGovernance = ScreenGovernance;
})();
