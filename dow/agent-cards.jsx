/* ============================================================
   ChemAssist — job detection + mode result cards (window.DXA).
   Each mode renders its JOB-TO-BE-DONE object: Application Brief,
   Sample Experiment Plan, Quote/PO, Formulation Guidance,
   Compliance Check, Production Incident, Opportunity Summary.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke } = UI;
  const DXA = (window.DXA = {});

  /* which sales agents work the request, the lead, gates touched, governance */
  DXA.INTENTS = {
    selector:     { agents: ["concierge", "application", "compliance"], lead: "application", gates: ["compliance"],            comply: "ok",     mode: "selector",   type: "explorer" },
    experiment:   { agents: ["concierge", "sample", "supply"],          lead: "sample",      gates: ["eligibility", "export"], comply: "ok",     mode: "experiment", type: "builder" },
    order:        { agents: ["concierge", "deal", "credit", "supply"],  lead: "deal",        gates: ["qualification", "compliance", "export"], comply: "ok", mode: "order", type: "buyer" },
    order_done:   { agents: [], comply: "ok", instant: true,            lead: "deal",        mode: "order",      type: "buyer" },
    quote:        { agents: ["deal", "credit"],                          lead: "deal",        gates: [],                       comply: "ok",     mode: "order",      type: "buyer" },
    po_draft:     { agents: ["deal", "supply"],                          lead: "deal",        gates: ["export"],               comply: "ok",     mode: "order",      type: "buyer" },
    po_approval:  { agents: ["credit"],                                  lead: "credit",      gates: [],                       comply: "ok",     mode: "order",      type: "buyer" },
    po_placed:    { agents: [], instant: true,                           lead: "deal",        mode: "order",      type: "buyer" },
    gate_resolve: { agents: ["compliance"],                              lead: "compliance",  gates: [],                       comply: "ok",     mode: "compliance", type: "approver" },
    formulation:  { agents: ["concierge", "application", "sample"],     lead: "application", gates: [],                       comply: "ok",     mode: "formulation",type: "evaluator" },
    compliance:   { agents: ["concierge", "compliance"],                lead: "compliance",  gates: ["compliance"],           comply: "ok",     mode: "compliance", type: "approver" },
    conversion:   { agents: ["concierge", "deal", "credit"],            lead: "deal",        gates: ["qualification", "compliance", "export"], comply: "ok", mode: "conversion", type: "sponsor" },
    production:   { agents: ["concierge", "sample", "compliance"],      lead: "sample",      gates: [],                       comply: "review", mode: "production", type: "operator" },
    expert:       { agents: ["concierge", "sample"], comply: "ok", instant: true, lead: "sample", mode: "production", type: "operator" },
    photo:        { agents: ["concierge"], image: true, instant: true, lead: "concierge", mode: "image" },
    sketch:       { agents: ["concierge"], image: "label", instant: true, lead: "concierge", mode: "image" },
    image:        { agents: ["concierge"], image: true, instant: true, lead: "concierge", mode: "image" },
    specmatch:    { agents: ["concierge", "application", "compliance"], lead: "application", gates: ["compliance"], comply: "ok", mode: "specmatch", type: "approver" },
    video:        { agents: ["concierge"], multimodal: "video",  instant: true, lead: "sample", mode: "experiment" },
  };

  /* default case a fresh intent attaches to */
  DXA.defaultCase = {
    selector: "CASE-01927", experiment: "CASE-02111", order: "CASE-02111", order_done: "CASE-02111",
    quote: "CASE-02111", po_draft: "CASE-02111", po_approval: "CASE-02111", po_placed: "CASE-02111", gate_resolve: "CASE-01927",
    formulation: "CASE-00482", compliance: "CASE-01927", conversion: "CASE-02111",
    production: "CASE-03815", expert: "CASE-03815", photo: "CASE-03815", sketch: "CASE-01927", video: "CASE-02111",
    image: null, specmatch: "CASE-01927",
  };

  /* Each chat intent maps to the live agentic workflow it drives, so the
     floating Agentic Workflow Pipeline reflects what ChemAssist is actually
     doing right now — not a single static workflow. Ids match D.agenticWorkflows. */
  DXA.workflowFor = {
    selector: "need-to-recommend", specmatch: "need-to-recommend", sketch: "need-to-recommend",
    formulation: "need-to-recommend", photo: "need-to-recommend", image: "need-to-recommend",
    experiment: "sample-to-qualification", video: "sample-to-qualification",
    order: "quote-to-order", order_done: "quote-to-order", quote: "quote-to-order",
    po_draft: "quote-to-order", po_approval: "quote-to-order", po_placed: "quote-to-order",
    conversion: "quote-to-order",
    compliance: "regulatory-change-to-action", gate_resolve: "regulatory-change-to-action",
    production: "incident-to-recovery", expert: "incident-to-recovery",
  };

  DXA.classify = function (text) {
    const s = (text || "").toLowerCase();
    if (/photo|failure|crack|tear|delamin|peel|broke|defect/.test(s)) return "photo";
    if (/sketch|drawing|cad/.test(s)) return "sketch";
    if (/video|footage/.test(s)) return "video";
    if (/line 4|cooling jaw|plant|floor|running at|production issue|why is it|troubleshoot|incident|diagnos|root cause|open a case/.test(s)) return "production";
    if (/quote|\bpo\b|purchase order|reorder|order again|buy|procure/.test(s)) return "order";
    if (/scale|qualification|opportunity|programme|program|commercial|ready to scale|where.*stand/.test(s)) return "conversion";
    if (/loading|formulat|phr|processing temp|compound|how (do|should) i use|let-down/.test(s)) return "formulation";
    // material-finding intent wins over a bare regulatory keyword like "food contact"
    if (/\b(need|want|find|recommend|looking for|suggest|select|which|what)\b[^.]*\b(resin|grade|material|polymer|elastomer|plastomer|copolymer|compound|product)\b/.test(s)
      || /\b(resin|grade|material|polymer|elastomer|plastomer)\b[^.]*\bfor\b[^.]*\b(packaging|film|seal|footwear|midsole|foam|automotive|dashboard|tpo|interior|application|coating|molding|moulding)\b/.test(s)) return "selector";
    if (/comply|compliance|reach|food contact|fda|sds|ghs|regulat|legal/.test(s)) return "compliance";
    if (/iterate|improve|better|tune|optimi[sz]e|round|refine|test result|sample plan|experiment/.test(s)) return "experiment";
    return "selector";
  };

  /* spoken intro per intent — short, plain, human */
  DXA.sayFor = function (intent, c) {
    switch (intent) {
      case "selector": return <span>Here are the grades that fit best, ranked for what you described:</span>;
      case "experiment": return <span>Your first sample looks promising. Here's the plan and the next round I'd try:</span>;
      case "order": return <span>The grade's proven, so I've prepared the order — ready for your approval. Nothing's placed yet:</span>;
      case "order_done": return <span>Done — quote requested and a PO draft is ready for your buyer to approve.</span>;
      case "quote": return <span>Here's your quote, with pricing at each volume:</span>;
      case "po_draft": return <span>Here's the PO draft — lot and lead time confirmed:</span>;
      case "po_approval": return <span>You can approve this; placing it goes to your Dow rep to finalise:</span>;
      case "po_placed": return <span>Approved and sent to your Dow rep. I'll track it from here.</span>;
      case "gate_resolve": return <span>Here's the live status of the certification review — I'll tell you the moment it clears:</span>;
      case "formulation": return <span>Here's the documented guidance, with the limits called out:</span>;
      case "compliance": return <span>Here's the compliance picture for your region:</span>;
      case "conversion": return <span>Here's where the programme stands and the next step to scale:</span>;
      case "production": return <span>I've opened an incident and read your photo and line. Here's what I'm seeing, and the expert to bring in:</span>;
      case "expert": return <span>Sent to a Dow specialist with everything attached — they'll take it from here.</span>;
      case "photo": case "image": return <span>Show me — drop the photo and I'll read it. Then add the performance you need in your own words, and I'll fold it into the brief.</span>;
      case "sketch": return <span>Upload the label or spec and I'll identify the grade and pull the right documents.</span>;
      case "specmatch": return <span>I read the label and found the grade. Here are its documents and whether it fits:</span>;
      case "video": return <span>Share the video and I'll read how it performs into your experiment.</span>;
      default: return <span>Here's what I found:</span>;
    }
  };

  /* ---- object wrapper: makes the JTBD object explicit ---- */
  function ObjectCard({ object, mode, children, tone }) {
    const md = window.DX.modes[mode];
    return (
      <div className="dx-obj fade-in">
        <div className="dx-obj-head">
          <span className="dx-obj-name">{object}</span>
          {md && <span className={`dx-mode-chip ${md.tone}`}><Icon name={md.icon} size={12} /> {md.label}</span>}
        </div>
        {children}
      </div>
    );
  }
  DXA.ObjectCard = ObjectCard;

  /* ---- deal-team handoff line ---- */
  function Handoff({ lead }) {
    // Calmed: the deal-team handoff now lives in the single "Handled by Dow agents"
    // disclosure under each turn, so it no longer adds a colored line per result.
    return null;
  }
  DXA.Handoff = Handoff;

  /* ---- gate clearance block (who owns it, who clears it) ---- */
  function GateList({ c, ids, onAsk, title }) {
    const D = window.DX;
    const deal = (c && D.dealFor(c.code)) || { gates: {} };
    const rows = ids.filter(id => D.gates[id]);
    if (!rows.length) return null;
    return (
      <div className="dx-gates">
        <div className="dx-gates-h"><Icon name="checkmark-filled" size={13} /> {title || "Gates — checked by your sales team"}</div>
        {rows.map(id => {
          const g = D.gates[id]; const st = (deal.gates[id]) || "progress"; const meta = D.gateState[st]; const owner = D.agentById(g.owner);
          const note = st === "cleared" ? `Auto-cleared by ${owner.name} within policy`
            : st === "review" ? `Exception — routed to ${owner.reach}`
            : st === "pending" ? `Owned by you — ${owner.name} will advance on your sign-off`
            : st === "progress" ? `${owner.name} is working it`
            : `Reached after the previous step`;
          return (
            <div className={`dx-gate ${meta.tone}`} key={id}>
              <span className="gi"><Icon name={st === "cleared" ? "checkmark-filled" : st === "review" ? "warning-alt" : st === "pending" ? "information" : "filter"} size={14} /></span>
              <div className="gmain">
                <div className="gt">{g.name} <span className="gtr">· {g.transition}</span></div>
                <div className="gn">{note}</div>
              </div>
              <span className={`gstate ${meta.tone}`}>{meta.label}</span>
              {st === "pending" && onAsk && <button className="dx-abtn primary sm gbtn" onClick={() => onAsk("Sign off the technical qualification — the sample passed", "quote")}>Sign off</button>}
              {st === "review" && onAsk && <button className="dx-abtn ghost sm gbtn" onClick={() => onAsk("Track the compliance review", "gate_resolve")}>Track</button>}
            </div>
          );
        })}
      </div>
    );
  }
  DXA.GateList = GateList;

  /* ---- inventory → sample → PO mini tracker ---- */
  function DealTrackerMini({ c }) {
    const D = window.DX;
    const deal = (c && D.dealFor(c.code)) || { phase: "inventory", gates: {} };
    const phaseIdx = { inventory: 0, sample: 1, po: 2, reorder: 2, support: 1 }[deal.phase] || 0;
    const between = [["eligibility", "export"], ["qualification", "compliance"]];
    return (
      <div className="dx-dealmini">
        {D.dealFunnel.map((p, i) => (
          <React.Fragment key={p}>
            <span className={`dn ${i < phaseIdx ? "done" : i === phaseIdx ? "now" : ""}`}>{p}</span>
            {i < 2 && (
              <span className="dgts">
                {between[i].map(gid => { const st = deal.gates[gid] || "na"; const tone = D.gateState[st].tone; return <span className={`dgt ${tone}`} key={gid} title={D.gates[gid].name}>{st === "cleared" ? "✓" : st === "review" ? "!" : st === "pending" ? "•" : "·"}</span>; })}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
  DXA.DealTrackerMini = DealTrackerMini;

  /* ---- product recommendation row ---- */
  function Rec({ p, top, onNav, onAction }) {
    return (
      <div className={`dx-rec ${top ? "top" : ""}`}>
        <div className="rtop">
          <span className="dx-picon" style={{ background: `color-mix(in srgb, ${p.accent} 8%, #fff)`, color: p.accent }}><Icon name={p.icon || "recommend"} size={20} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="rn">{p.name}</div>
            <div className="rfam">{p.family}</div>
          </div>
          <div className="rfit"><div className="fv">{p.fit}%</div><div className="fl">fit</div></div>
        </div>
        <div className="rbul">{p.bullets.slice(0, top ? 3 : 2).map((b, i) => <div className="rli" key={i}><Icon name="checkmark-filled" size={13} /> {b}</div>)}</div>
        <div className="racts">
          <button className="dx-abtn primary" onClick={() => onAction("add-experiment", p)}><Icon name="lightbulb" size={14} /> Add to sample experiment</button>
          <button className="dx-abtn ghost" onClick={() => onNav({ name: "product", id: p.id })}>View product</button>
        </div>
      </div>
    );
  }
  DXA.Rec = Rec;

  function Confidence({ pct, label, tone }) {
    return (
      <div className={`dx-confline ${tone || "spruce"}`}>
        <span className="cb"><div style={{ width: pct + "%" }} /></span>
        <span className="ct"><b>{pct}%</b> · {label} confidence</span>
      </div>
    );
  }

  /* ============================================================
     IntentResult — renders the object for each mode
     ============================================================ */
  const CASE_DOCS = {
    "CASE-01927": ["tds-1881", "sds-1881", "decl-eu1881"],
    "CASE-02111": ["tds-9107", "guide-foam", "reg-reach"],
    "CASE-00482": ["tds-7467", "guide-tpo"],
    "CASE-03815": ["tds-1881", "sds-1881", "coa-4471a"],
  };
  function GroundedRow({ c }) {
    const ids = (c && CASE_DOCS[c.code]) || [];
    if (!ids.length) return null;
    return (
      <div className="dx-grounded">
        <span className="gl"><Icon name="checkmark-filled" size={12} /> Grounded in internal sources · public copies shown</span>
        <span className="gc">{ids.map((id, i) => <UI.DocCite key={i} id={id} small />)}</span>
      </div>
    );
  }
  function IntentResult({ intent, c, env, onNav, onAsk, onAction, toast, pushAgui }) {
    const D = window.DX;
    const meta = window.DXA.INTENTS[intent] || {};
    switch (intent) {

      case "selector": case "sketch_result": {
        const ps = (c && c.products ? c.products : ["affinity-1881", "affinity-1140"]).map(D.productById);
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Application Brief" mode="selector">
              <div className="dx-brief">{(c ? c.brief : []).map((b, i) => <span className="dx-bchip" key={i}><span className="bk">{b[0]}</span><span className="bv">{b[1]}</span></span>)}</div>
              <div className="dx-say" style={{ margin: "6px 0 10px" }}>Ranked candidates:</div>
              {ps.map((p, i) => <Rec key={p.id} p={p} top={i === 0} onNav={onNav} onAction={onAction} />)}
              <GroundedRow c={c} />
              <GateList c={c} ids={["compliance"]} title="Pre-checked before we sample" />
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                <button className="dx-abtn ghost" onClick={() => onAsk("Build a sample experiment plan for these", "experiment")}><Icon name="lightbulb" size={13} /> Build sample experiment</button>
                <button className="dx-abtn ghost" onClick={() => onAsk("Check compliance for the top grade", "compliance")}>Check compliance</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );
      }

      case "experiment": case "video_result": {
        const exp = c && c.experiment ? c.experiment : { objective: "Maximise performance at target", packs: [] };
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Sample Experiment Plan" mode="experiment">
              <DealTrackerMini c={c} />
              <div className="dx-exp-obj"><Icon name="lightbulb" size={13} /> {exp.objective}</div>
            {exp.rounds && exp.rounds.map(r => (
              <div className={`dx-exprow ${r.done ? "" : "active"}`} key={r.n}>
                <span className="rn">{r.n}</span>
                <div style={{ flex: 1 }}><b>Round {r.n}</b><span>{r.config}</span><span style={{ color: "var(--dx-muted)" }}>{r.result}</span></div>
                <span className={`dx-comply ${r.tone === "warn" ? "review" : "ok"}`}>{r.verdict}</span>
              </div>
            ))}
            <div className="dx-action" style={{ marginTop: 10 }}>
              <div className="ah"><span className="ai-glyph" style={{ width: 15, height: 15 }} /><b>Suggested next round</b></div>
              <div className="arow"><Icon name="checkmark-filled" size={13} /> INFUSE™ 9107 / 9007 — 80:20 blend</div>
              <div className="arow"><Icon name="checkmark-filled" size={13} /> Finer nucleator for smaller cell size</div>
              <div className="arow"><Icon name="checkmark-filled" size={13} /> Target: rebound ≥ 58% at ≤ 0.18 g/cm³</div>
            </div>
            <GateList c={c} ids={["eligibility", "export"]} title="Gates to ship your sample" onAsk={onAsk} />
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
              <button className="dx-abtn primary" onClick={() => onAction("order-sample")}><Icon name="recommend" size={14} /> Order next sample</button>
              <button className="dx-abtn ghost" onClick={() => onNav({ name: "samplelab", code: c ? c.code : "CASE-02111" })}>Open sample lab</button>
              <button className="dx-abtn ghost" onClick={() => onAsk("Move the proven grade to a quote and PO", "order")}>Move to quote / PO</button>
            </div>
            </ObjectCard>
          </React.Fragment>
        );
      }

      case "order": {
        const com = c && c.commercial ? c.commercial : {};
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Quote / PO Action" mode="order">
              <DealTrackerMini c={c} />
              <GateList c={c} ids={["qualification", "compliance", "export"]} title="Gates to reach PO" onAsk={onAsk} />
              <div className="dx-action" style={{ marginBottom: 8, marginTop: 10 }}>
                <div className="ah"><Icon name="network" size={15} style={{ color: "var(--k-spruce-70)" }} /><b>Account & Deal Manager — prepared, awaiting approval</b></div>
                <div className="arow"><Icon name="checkmark-filled" size={13} /> Grade & spec match your qualified trial</div>
                <div className="arow"><Icon name="checkmark-filled" size={13} /> Credit & account standing checked by Credit & Authorization</div>
                <div className="arow"><Icon name="checkmark-filled" size={13} /> Availability confirmed by Supply & Fulfillment</div>
                <div className="arow" style={{ color: "var(--k-status-warning-110)" }}><Icon name="warning-alt" size={13} style={{ color: "var(--k-status-warning-110)" }} /> The PO won't be placed until you sign off qualification — I never commit silently</div>
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <button className="dx-abtn primary" onClick={() => onAsk("Request the quote and stage the PO", "quote")}><Icon name="checkmark-filled" size={14} /> Request quote & stage PO</button>
                <button className="dx-abtn ghost" onClick={() => toast("Your Dow account manager has been notified.")}>Loop in Sales</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );
      }
      case "order_done":
        return (
          <ObjectCard object="Quote / PO Action" mode="order">
            <div className="dx-action" style={{ background: "var(--k-status-success-10)", borderColor: "var(--k-status-success-20)", marginBottom: 0 }}>
              <div className="ah"><Icon name="checkmark-filled" size={15} /><b>Quote QR-2026-0488 requested · PO draft PO-48261 staged</b></div>
              <div className="arow" style={{ color: "var(--k-status-success-110)" }}><Icon name="checkmark-filled" size={13} /> Buyer approval routed to Procurement</div>
              <div className="arow" style={{ color: "var(--k-status-success-110)" }}><Icon name="checkmark-filled" size={13} /> Reorder cycle will prompt automatically</div>
            </div>
          </ObjectCard>
        );

      case "quote":
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Quote Request · QR-2026-0488" mode="order">
              <table className="dx-qtbl">
                <thead><tr><th>Volume</th><th>Price / kg</th><th>Lead time</th></tr></thead>
                <tbody>
                  <tr><td>25 kg (pre-production)</td><td className="pv">€8.40</td><td>In stock</td></tr>
                  <tr className="best"><td>250 kg <span className="bestlbl">your trial volume</span></td><td className="pv">€7.20</td><td>3 days</td></tr>
                  <tr><td>1,000 kg+ (scale)</td><td className="pv">€6.40</td><td>5–7 days</td></tr>
                </tbody>
              </table>
              <div className="dx-terms">
                <span><b>Incoterms</b> DAP — Brandt Footwear, US</span>
                <span><b>Payment</b> Net 45 · account terms</span>
                <span><b>Validity</b> 30 days</span>
              </div>
              <div className="dx-gate ok" style={{ borderTop: "1px solid var(--dx-line)", paddingTop: 10 }}>
                <span className="gi"><Icon name="checkmark-filled" size={14} /></span>
                <div className="gmain"><div className="gt">Account pre-cleared</div><div className="gn">Credit & Authorization confirmed standing for this volume</div></div>
                <span className="gstate ok">Cleared</span>
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                <button className="dx-abtn primary" onClick={() => onAsk("Stage the PO draft at my trial volume", "po_draft")}><Icon name="network" size={14} /> Stage PO draft</button>
                <button className="dx-abtn ghost" onClick={() => toast("Quote QR-2026-0488 downloaded as PDF.")}>Download quote</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );

      case "po_draft":
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="PO Draft · PO-48261" mode="order">
              <div className="dx-poline"><span className="pn">INFUSE™ 9107</span><span className="pq">250 kg</span><span className="pp">€7.20 / kg</span><span className="pt">€1,800.00</span></div>
              <div className="dx-potot"><span>Subtotal</span><span>€1,800.00</span></div>
              <div className="dx-terms">
                <span><b>Ship-to</b> Brandt Footwear, US · lot 4471-A</span>
                <span><b>Lead time</b> 3 days · confirmed by Supply</span>
                <span><b>Terms</b> Net 45 · DAP</span>
              </div>
              <GateList c={c} ids={["export"]} title="Last gate before approval" />
              <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                <button className="dx-abtn primary" onClick={() => onAsk("Submit the PO for buyer approval", "po_approval")}><Icon name="checkmark-filled" size={14} /> Submit for approval</button>
                <button className="dx-abtn ghost" onClick={() => toast("PO draft saved to the case.")}>Save draft</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );

      case "po_approval":
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Buyer Approval" mode="order">
              <div className="dx-authbar">
                <div className="ar"><span className="al">PO value</span><span className="av">€1,800</span></div>
                <div className="ar"><span className="al">Your role</span><span className="av">{window.DX.account.entitlements.role}</span></div>
                <div className="ar warn"><Stroke size={14} d="M2 12s3.5-7 10-7c2 0 3.7.6 5.2 1.5M22 12s-3.5 7-10 7c-2 0-3.7-.6-5.2-1.5M3 3l18 18M9.9 9.9a3 3 0 004.2 4.2" /> Online ordering isn't enabled for your role</div>
              </div>
              <div className="dx-gate ok"><span className="gi"><Icon name="checkmark-filled" size={14} /></span><div className="gmain"><div className="gt">Account standing</div><div className="gn">Credit & Authorization cleared this account & volume</div></div><span className="gstate ok">Cleared</span></div>
              <div className="dx-gate review"><span className="gi"><Icon name="warning-alt" size={14} /></span><div className="gmain"><div className="gt">PO placement entitlement</div><div className="gn">Least-privilege: placement routes to your Dow sales rep — you approve, they place</div></div><span className="gstate review">Routed</span></div>
              <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                <button className="dx-abtn red" onClick={() => onAsk("Approve and send to my Dow sales rep to place", "po_placed")}><Icon name="checkmark-filled" size={14} /> Approve & send to Dow sales</button>
                <button className="dx-abtn ghost" onClick={() => toast("Your procurement lead has been added as co-approver.")}>Add Procurement</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );

      case "po_placed":
        return (
          <ObjectCard object="Sent to Dow sales · PO-48261" mode="order">
            <div className="dx-action" style={{ background: "var(--k-status-success-10)", borderColor: "var(--k-status-success-20)", marginBottom: 8 }}>
              <div className="ah"><Icon name="checkmark-filled" size={15} /><b>Approved · routed to Dow sales to place · 250 kg INFUSE™ 9107</b></div>
              <div className="arow" style={{ color: "var(--k-status-success-110)" }}><Icon name="checkmark-filled" size={13} /> Your approval + full case context sent to your Dow rep</div>
              <div className="arow" style={{ color: "var(--k-status-success-110)" }}><Icon name="checkmark-filled" size={13} /> Confirmation will reach {window.DX.account.email} once placed</div>
              <div className="arow" style={{ color: "var(--k-status-success-110)" }}><Icon name="checkmark-filled" size={13} /> I'll track fulfilment & set your reorder cadence</div>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <button className="dx-abtn primary" onClick={() => onNav({ name: "o2c" })}><Icon name="network" size={14} /> Track order live</button>
              <button className="dx-abtn ghost" onClick={() => onNav({ name: "account" })}>Track in your account</button>
              <button className="dx-abtn ghost" onClick={() => onAsk("Where does the Apex Pro programme stand now?", "conversion")}>Programme status</button>
            </div>
          </ObjectCard>
        );

      case "gate_resolve":
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Compliance review · CASE-01927" mode="compliance">
              <div className="dx-restl">
                <div className="rs done"><span className="rd" /><div><b>Escalated by Compliance Officer</b><span>Formal food-contact certification request · EU 10/2011</span></div></div>
                <div className="rs done"><span className="rd" /><div><b>Received by Dow Regulatory Affairs</b><span>Assigned · reviewer K. Brandt</span></div></div>
                <div className="rs active"><span className="rd" /><div><b>Under review</b><span>Verifying application-specific declaration · ETA 1 business day</span></div></div>
                <div className="rs pending"><span className="rd" /><div><b>Certification issued</b><span>You'll be notified — sampling can proceed in parallel</span></div></div>
              </div>
              <div className="dx-boundary"><Icon name="information" size={14} /><span>Sampling isn't blocked — the exception only gates formal certification, which only the approved Dow process can issue.</span></div>
              <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                <button className="dx-abtn primary" onClick={() => toast("You'll be notified the moment certification is issued.")}><Icon name="checkmark-filled" size={14} /> Notify me when cleared</button>
                <button className="dx-abtn ghost" onClick={() => onAsk("Build a sample experiment while review runs", "experiment")}>Sample in parallel</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );

      case "formulation": {
        const g = c && c.guidance ? c.guidance : null;
        if (!g) return <ObjectCard object="Formulation Guidance" mode="formulation"><div className="dx-say">I can answer documented formulation guidance for this grade, and escalate anything application-specific.</div></ObjectCard>;
        return (
          <ObjectCard object="Formulation Guidance" mode="formulation">
            <div className="dx-say" style={{ fontWeight: 600, marginBottom: 6 }}>{g.headline}</div>
            <Confidence pct={g.confidence} label={g.confidenceLabel} tone="spruce" />
            {g.ranges.map((r, i) => <div className="dx-range" key={i}><span className="rk">{r[0]}</span><span className="rv">{r[1]}</span><span className="rn">{r[2]}</span></div>)}
            <div style={{ marginTop: 10 }}>{g.caveats.map((cv, i) => <div className="dx-caveat" key={i}><Icon name="information" size={13} /> {cv}</div>)}</div>
            <div className="dx-boundary"><Icon name="information" size={14} /><span>{g.boundary}</span></div>
            <GroundedRow c={c} />
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <button className="dx-abtn primary" onClick={() => onAsk("Send my exact formulation to Technical Service", "expert")}><Icon name="group" size={14} /> Send to Technical Service</button>
              <button className="dx-abtn ghost" onClick={() => onAsk("Build a sample experiment to validate", "experiment")}>Add to experiment</button>
            </div>
          </ObjectCard>
        );
      }

      case "compliance": {
        const comp = c && c.compliance ? c.compliance : null;
        if (!comp) return <ObjectCard object="Compliance Check" mode="compliance"><div className="dx-say">Tell me the product, application and jurisdiction and I'll run a RegRadar check.</div></ObjectCard>;
        return (
          <ObjectCard object="Compliance Check" mode="compliance">
            <div className="dx-say" style={{ marginBottom: 6 }}>Jurisdiction: <strong>{comp.jurisdiction}</strong></div>
            {comp.domains.map((d, i) => (
              <div className="dx-comprow" key={i}>
                <Icon name={d[2] ? "checkmark-filled" : "warning-alt"} size={15} style={{ color: d[2] ? "var(--k-status-success-100)" : "var(--k-status-warning-110)", flexShrink: 0 }} />
                <span className="ck">{d[0]}</span><span className="cv">{d[1]}</span>
              </div>
            ))}
            <div className="dx-source">{comp.source}</div>
            <div className="dx-regprov"><span className="rl"><Icon name="anomaly" size={12} /> RegRadar</span> <span>Live · {comp.jurisdiction} · KB v2026.06</span> <a onClick={() => window.DX.toOperator("flow", c ? c.trace : null)}>Open in RegRadar ↗</a></div>
            <GroundedRow c={c} />
            <div className="dx-boundary"><Icon name="information" size={14} /><span>{comp.boundary}</span></div>
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <button className="dx-abtn ghost" onClick={() => toast("SDS / declaration queued for download.")}><Icon name="document-chart" size={14} /> Download docs</button>
              <button className="dx-abtn ghost" onClick={() => onAsk("Request a formal regulatory review", "expert")}>Request formal review</button>
            </div>
          </ObjectCard>
        );
      }

      case "conversion": {
        const com = c && c.commercial ? c.commercial : { qualification: 70, blockers: [], next: "" };
        return (
          <ObjectCard object="Opportunity Summary" mode="conversion">
            <div className="dx-spine-mini">
              {D.spine.map((s, i) => <span className={`sp ${i < (c ? c.stage : 5) ? "done" : i === (c ? c.stage : 5) ? "now" : ""}`} key={i}>{s}</span>)}
            </div>
            <div className="dx-qual"><span className="ql">Qualification</span><span className="qb"><div style={{ width: com.qualification + "%" }} /></span><span className="qv">{com.qualification}%</span></div>
            <GateList c={c} ids={["qualification", "compliance", "export"]} title="Gates between here and scale" onAsk={onAsk} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--dx-subtle)", textTransform: "uppercase", letterSpacing: ".06em", margin: "12px 0 6px" }}>Open blockers</div>
            {(com.blockers || []).map((b, i) => <div className="dx-caveat" key={i}><Icon name="warning-alt" size={13} style={{ color: "var(--k-status-warning-110)" }} /> {b}</div>)}
            <div className="dx-action" style={{ marginTop: 10 }}>
              <div className="ah"><Icon name="analytics" size={15} style={{ color: "var(--k-spruce-70)" }} /><b>Commercial next action</b></div>
              <div className="arow"><Icon name="arrow-up-right" size={13} style={{ color: "var(--k-spruce-70)" }} /> {com.next}</div>
            </div>
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <button className="dx-abtn primary" onClick={() => onAsk("Prepare the quote to move toward scale", "order")}>Advance to quote</button>
              <button className="dx-abtn ghost" onClick={() => toast("Dow account team & program manager notified.")}>Loop in account team</button>
            </div>
          </ObjectCard>
        );
      }

      case "production": case "photo_result": {
        const inc = c && c.incident ? c.incident : null;
        if (!inc) return <ObjectCard object="Production Incident" mode="production"><div className="dx-say">Incident opened. Capturing context…</div></ObjectCard>;
        return (
          <ObjectCard object="Production Incident" mode="production">
            <div className="dx-say" style={{ fontWeight: 600, marginBottom: 6 }}>{inc.headline}</div>
            <Confidence pct={inc.confidence} label={inc.confidenceLabel} tone="amber" />
            <div className="dx-diaggrid">
              {inc.contributors.map((co, i) => <div className="dx-contrib" key={i}><span className={`bar ${co[2]}`} /><span className="ck">{co[0]}</span><span className="cw">{co[1]}</span></div>)}
            </div>
            <div className="dx-safety">
              <div className="sh"><Icon name="error-filled" size={14} /> Safety boundaries — locked from Dow safety data <span className="lock">Unalterable</span></div>
              {inc.safety.map((s, i) => <div className="sr" key={i}><Icon name="checkmark-filled" size={13} /> {s}</div>)}
            </div>
            <div className="dx-boundary"><Icon name="information" size={14} /><span>{inc.boundary}</span></div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
              <button className="dx-abtn red" onClick={() => onAsk("Get Dow Technical Service on this now", "expert")}><Icon name="group" size={14} /> Get Technical Service</button>
              <button className="dx-abtn ghost" onClick={() => onAction("expedite")}><Icon name="network" size={14} /> Check alternate / expedite</button>
            </div>
          </ObjectCard>
        );
      }

      case "expert":
        return (
          <ObjectCard object="Technical Service Handoff" mode="production">
            <div className="dx-action" style={{ marginBottom: 0 }}>
              <div className="ah"><Icon name="group" size={15} style={{ color: "var(--k-spruce-70)" }} /><b>Routed with full context · {c ? c.trace : ""}</b></div>
              {["Your conversation & request", "Application / incident context", "Line state, lot & diagnosis", "Candidate grades & evidence", "PAC decision & timeline"].map((t, i) => <div className="arow" key={i}><Icon name="checkmark-filled" size={13} /> {t}</div>)}
              <div className="arow" style={{ color: "var(--dx-muted)" }}><Icon name="information" size={13} style={{ color: "var(--dx-subtle)" }} /> A specialist is reviewing — nothing you shared is lost.</div>
            </div>
          </ObjectCard>
        );

      case "specmatch": {
        const D2 = window.DX;
        const ex = D2.imageInputs.label;
        const p = D2.productById("affinity-1881");
        const docs = D2.docsFor(p);
        return (
          <React.Fragment>
            <Handoff lead={meta.lead} />
            <ObjectCard object="Spec & Document Lookup" mode="specmatch">
              <div className="dx-specid">
                <span className="dx-picon" style={{ background: `color-mix(in srgb, ${p.accent} 8%, #fff)`, color: p.accent }}><Icon name={p.icon || "document-chart"} size={22} /></span>
                <div style={{ flex: 1 }}>
                  <div className="pn">{p.name}</div>
                  <div className="pf">{p.family} · matched from label "{ex.ocr[0][1]}"</div>
                </div>
                <span className="dx-conf-pill ok"><span className="cdot" /> {ex.interp.confidence}% match</span>
              </div>
              <div className="dx-doclist">
                {docs.map((d, i) => (
                  <div className="dx-docrow" key={i}>
                    <span className="di"><Icon name="document-chart" size={14} /></span>
                    <span className="dn"><b>{d[0]}</b><span>{d[1]} · {d[2]}</span></span>
                    <button className="dx-abtn ghost sm" onClick={() => toast(`${d[0]} opened.`)}>View</button>
                  </div>
                ))}
                <div className="dx-docrow"><span className="di"><Icon name="checkmark-filled" size={14} /></span><span className="dn"><b>Certificate of Analysis — lot {ex.ocr[2][1]}</b><span>lot-specific · on file</span></span><button className="dx-abtn ghost sm" onClick={() => toast("CoA for lot 4471-A opened.")}>View</button></div>
              </div>
              <div className="dx-applic">
                <div className="ah"><Icon name="information" size={13} style={{ color: "var(--k-spruce-70)" }} /> <b>Applicability — does it fit your use?</b></div>
                <p>This grade is documented for low-temperature heat-seal layers in flexible food packaging. Tell me your application and region and I'll confirm fit and pull the regional regulatory status.</p>
              </div>
              <GateList c={c} ids={["compliance"]} title="Checked while looking this up" onAsk={onAsk} />
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                <button className="dx-abtn primary" onClick={() => onAsk("Confirm this fits my packaging application", "selector", "CASE-01927")}><Icon name="recommend" size={14} /> Confirm fit & alternatives</button>
                <button className="dx-abtn ghost" onClick={() => onAsk("Check compliance for this grade in the EU", "compliance", "CASE-01927")}>Check compliance</button>
                <button className="dx-abtn ghost" onClick={() => onAsk("Build a sample experiment with this", "experiment", "CASE-01927")}>Sample it</button>
              </div>
            </ObjectCard>
          </React.Fragment>
        );
      }

      case "photo": case "image":
        return <DXA.ImageFlow bias={typeof meta.image === "string" ? meta.image : null} onAsk={onAsk} toast={toast} pushAgui={pushAgui} />;
      case "sketch":
        return <DXA.ImageFlow bias="label" onAsk={onAsk} toast={toast} pushAgui={pushAgui} />;
      case "video":
        return <MultimodalIntake kind="video" onAsk={onAsk} />;

      default: return null;
    }
  }
  DXA.IntentResult = IntentResult;

  /* ---- multimodal intake ---- */
  function MultimodalIntake({ kind, onAsk }) {
    if (kind === "video") {
      return (
        <React.Fragment>
          <div className="dx-video">
            <span className="play"><Stroke size={22} children={<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />} /></span>
            <span className="vlbl"><Icon name="play" size={12} /> midsole_compression_test.mp4 · 0:14</span>
          </div>
          <button className="dx-abtn primary" onClick={() => onAsk("Here's the performance video.", "video_result")}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Read this video</button>
        </React.Fragment>
      );
    }
    const isPhoto = kind === "photo";
    return (
      <React.Fragment>
        <div className="dx-slot">
          <image-slot id={isPhoto ? "dx-failure-photo" : "dx-design-sketch"} shape="rounded" radius="12"
            placeholder={isPhoto ? "Drop a photo of the failure" : "Drop your design sketch or spec sheet"}></image-slot>
        </div>
        <button className="dx-abtn primary" onClick={() => onAsk(isPhoto ? "Here's the photo." : "Here's the spec.", isPhoto ? "photo_result" : "sketch_result")}>
          <span className="ai-glyph" style={{ width: 13, height: 13 }} /> {isPhoto ? "Read this photo" : "Read this spec"}
        </button>
      </React.Fragment>
    );
  }
  DXA.MultimodalIntake = MultimodalIntake;
})();
