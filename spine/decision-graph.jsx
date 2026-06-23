/* ============================================================
   DecisionGraph — the compliance-graph concept, generalised.
   One calm, big-node, left-to-right reading that ends in a
   single decision: pick an input at the top and the whole
   chain + the terminal decision resolve.

   Reused for:
   • Supply chain   — Signal → Affected scope → Constraints → Policy rules → Action
   • Recommendation — Need   → Matching products → Evidence → Rules → Recommendation

   Mirrors the governance graph (product → documents → requirements
   → rules → decision) so all three read as one family.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon } = UI;

  // tone → decision styling + icon
  const TONE = {
    allow: { cls: "allow", ic: "checkmark-filled", word: "Allowed" },
    act:   { cls: "allow", ic: "checkmark-filled", word: "Action committed" },
    cond:  { cls: "cond",  ic: "warning-alt",      word: "Conditional" },
    route: { cls: "cond",  ic: "group",            word: "Routed to a human" },
    hold:  { cls: "cond",  ic: "warning-alt",      word: "Held" },
    deny:  { cls: "deny",  ic: "error-filled",     word: "Declined" },
  };

  /* ---- generic renderer ----
     model = {
       inputLabel, inputs:[{id,title,sub,tone}],
       firstHead, firstHint, heads:[h1,h2,h3], hints:[..], decisionHead, decisionHint,
       build(id) => { signal:{title,sub,tag,accent}, stages:[ [ {t,x,tag} ... ] x3 ],
                      decision:{tone,label,verdict,body,points:[{icon,text}],rule} }
     } */
  function DecisionGraph({ model }) {
    const [sel, setSel] = React.useState(model.inputs[0].id);
    const r = model.build(sel);
    const dt = TONE[r.decision.tone] || TONE.allow;

    return (
      <div className="dg">
        {/* input picker */}
        <div className="dcg-pick">
          <span className="dcg-pick-l">{model.inputLabel}</span>
          <div className="dcg-pick-row">
            {model.inputs.map(inp => (
              <button key={inp.id} className={`dcg-chip ${sel === inp.id ? "on" : ""} ${inp.tone}`} onClick={() => setSel(inp.id)}>
                <span className={`dcg-chip-dot ${inp.tone}`} />
                <span className="dcg-chip-tx"><span className="t">{inp.title}</span><span className="s">{inp.sub}</span></span>
              </button>
            ))}
          </div>
        </div>

        {/* the graph — read left to right; the selected chip above is the input */}
        <div className="dcg-flow" key={sel}>
          {/* cols 1–3 · the middle stages */}
          {r.stages.map((nodes, si) => (
            <div className="dcg-stage" key={si}>
              <div className="dcg-sh">{model.heads[si]}</div>
              <div className="dcg-shx">{model.hints[si]}</div>
              <div className="dcg-col">
                {nodes.map((n, i) => (
                  <div className="dcg-node" key={i} style={{ animationDelay: `${0.05 + (si * 0.06) + i * 0.04}s` }}>
                    {n.tag && <span className="dcg-tag">{n.tag}</span>}
                    <div className="dcg-nt">{n.t}</div>
                    {n.x && <div className="dcg-nx">{n.x}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* col 5 · the single decision */}
          <div className="dcg-stage dcg-stage-dec">
            <div className="dcg-sh">{model.decisionHead}</div>
            <div className="dcg-shx">{model.decisionHint}</div>
            <div className={`dcg-decision ${dt.cls}`}>
              <div className="dcg-dec-state"><Icon name={dt.ic} size={18} /> {r.decision.label || dt.word}</div>
              <div className="dcg-dec-verdict">{r.decision.verdict}</div>
              <div className="dcg-dec-body">{r.decision.body}</div>
              {r.decision.points && r.decision.points.length > 0 && (
                <div className="dcg-dec-points">
                  {r.decision.points.map((p, i) => (
                    <div className="dcg-dec-pt" key={i}><Icon name={p.icon} size={13} /> <span>{p.text}</span></div>
                  ))}
                </div>
              )}
              {r.decision.rule && <div className="dcg-dec-rule"><b>Reason → source rule</b><br />{r.decision.rule}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
  UI.DecisionGraph = DecisionGraph;

  /* =========================================================
     DATASET A · Supply chain
     Signal → Affected scope → Constraints → Policy rules → Action
     ========================================================= */
  const SUPPLY = {
    inputLabel: "Pick a signal",
    firstHead: "Signal", firstHint: "What the spine caught.",
    heads: ["Affected scope", "Constraints", "Policy rules"],
    hints: ["Orders, inventory & customers it touches.", "The bounds the action must hold.", "The PAC rules it asks before acting."],
    decisionHead: "Action decision", decisionHint: "One terminal state, with the reason attached.",
    inputs: [
      { id: "outage", title: "Feedstock outage · Terneuzen", sub: "The plant that makes ENGAGE™ XLT 8677 is down", tone: "act" },
      { id: "margin", title: "Margin-floor breach · 14 SKUs", sub: "Cost-to-serve recompute drops SKUs at/below floor", tone: "route" },
      { id: "reg", title: "Regulatory change · EU 10/2011", sub: "RegRadar detects an Annex I migration-limit update", tone: "hold" },
    ],
    build(id) {
      if (id === "margin") {
        return {
          signal: { tag: "Cost agent · 06:19", title: "Margin-floor breach", sub: "Recompute prices 14 SKUs at or below the EU margin floor." },
          stages: [
            [{ tag: "ORDERS", t: "14 SKUs across 3 accounts", x: "EU distribution lanes" }, { tag: "MARGIN", t: "€180k exposure this period", x: "vs. plan" }],
            [{ t: "Margin floor", x: "No SKU may price ≤ the floor without a human." }, { t: "Capital headroom", x: "€2.1M — not the binding limit here." }],
            [{ tag: "FIN", t: "FIN-margin-floor-EU", x: "Any SKU ≤ floor → route to planner." }],
          ],
          decision: { tone: "route", label: "Routed to a human", verdict: "Sent to a Finance planner — the agent does not move price on its own.", body: "14 SKUs sit at or below the floor, so the proposal is held for sign-off with the full evidence screen attached.", points: [{ icon: "group", text: "Finance planner sign-off required" }, { icon: "document-chart", text: "Evidence screen: cause · impact · options" }], rule: "FIN-margin-floor-EU · BRD §6.3" },
        };
      }
      if (id === "reg") {
        return {
          signal: { tag: "RegRadar · 31 May", title: "EU 10/2011 update", sub: "Annex I specific-migration limit change on a food-contact grade." },
          stages: [
            [{ tag: "PRODUCT", t: "AFFINITY™ PL 1881G", x: "Food-contact packaging" }, { tag: "ACCOUNTS", t: "2 EU converters on this grade", x: "active contracts" }],
            [{ t: "Certification boundary", x: "No new claim without Regulatory review." }, { t: "Source currency", x: "Use only approved, current documents." }],
            [{ tag: "REG", t: "REG-certification-boundary", x: "Customer-facing claim → Regulatory issues it." }],
          ],
          decision: { tone: "hold", label: "Held · propagated", verdict: "Answers and product rules update; any customer-facing certification is held for Regulatory.", body: "ChemAssist answers and Product Selector adjust immediately; a declaration refresh is queued and impact briefs go to the affected accounts.", points: [{ icon: "checkmark-filled", text: "ChemAssist + Selector updated" }, { icon: "warning-alt", text: "Formal certification → Regulatory" }], rule: "REG-certification-boundary · UC6" },
        };
      }
      // outage (hero)
      return {
        signal: { tag: "Anomaly agent · 06:14", title: "Terneuzen feedstock outage", sub: "The plant that normally makes ENGAGE™ XLT 8677 is offline." },
        stages: [
          [{ tag: "ORDER", t: "PO 8841 · Brandt", x: "42 t · ENGAGE™ XLT 8677 · due 18 Jun" }, { tag: "INVENTORY", t: "Freeport qualified lot", x: "in stock · same grade & spec" }],
          [{ t: "Contract covenant", x: "Preserve grade + spec for strategic tier." }, { t: "Capital headroom", x: "€2.1M — re-source is within bounds." }],
          [{ tag: "PROD", t: "PROD-covenant-brandt", x: "Sourcing change must hold grade + spec." }, { tag: "TRADE", t: "TRADE-export-EU-US", x: "Intra-Dow EU↔US transfer — no licence." }],
        ],
        decision: { tone: "act", label: "Action committed", verdict: "Re-sourced to Freeport — Brandt's 18 Jun date holds, same grade and spec.", body: "Covenant is preserved and the transfer is in bounds, so the spine commits the reroute and the planner confirms the covenant-affecting step.", points: [{ icon: "checkmark-filled", text: "Grade + spec preserved · date held" }, { icon: "group", text: "Planner confirmed the covenant step" }], rule: "PROD-covenant-brandt · BRD §7.1" },
      };
    },
  };

  function SupplyChainGraph() {
    return (
      <div style={{ marginBottom: 22 }}>
        <div className="spine-eyebrow">
          <span className="se-l">How the spine turns a signal into a governed action</span>
          <span className="se-r">Pick a signal. Its scope, the bounds it must hold and the policy it asks are all specific to that event — read left to right to one decision.</span>
        </div>
        <div className="panel" style={{ padding: "18px 16px" }}>
          <UI.DecisionGraph model={SUPPLY} />
        </div>
      </div>
    );
  }
  UI.SupplyChainGraph = SupplyChainGraph;

  /* =========================================================
     DATASET B · Customer recommendation
     Need → Matching products → Evidence → Rules → Recommendation
     ========================================================= */
  const RECO = {
    inputLabel: "Pick a customer need",
    firstHead: "Customer need", firstHint: "What the customer described, in plain words.",
    heads: ["Matching products", "Evidence", "Rules"],
    hints: ["Grades that could fit the brief.", "The data behind the choice — cited.", "Compliance, availability & policy checks."],
    decisionHead: "Recommendation", decisionHint: "One grade, with confidence and the next action.",
    inputs: [
      { id: "fascia", title: "Cold-weather TPO fascia", sub: "Injection-molded · ships to Germany", tone: "allow" },
      { id: "pack", title: "Food-contact seal layer", sub: "Flexible packaging · Brazil", tone: "cond" },
      { id: "foam", title: "High-rebound midsole", sub: "Footwear foam · new compounder, US", tone: "cond" },
    ],
    build(id) {
      if (id === "pack") {
        return {
          signal: { title: "Food-contact seal layer", sub: "Low-temperature heat-seal film for flexible food packaging, sold into Brazil." },
          stages: [
            [{ tag: "AFFINITY", t: "PL 1881G", x: "Seal init. 88 °C · best fit" }, { t: "PF 1140G", x: "Seal init. 96 °C · broad EU stock" }],
            [{ tag: "FCS", t: "EU 10/2011 + FDA compliant", x: "Food-contact statement on file" }, { tag: "TDS", t: "Seal below converter line max", x: "documented" }],
            [{ t: "Regulatory", x: "Brazil needs local ANVISA documentation." }, { t: "Availability", x: "In stock · EU lanes." }, { t: "Policy", x: "New region → product-steward review." }],
          ],
          decision: { tone: "cond", label: "Conditional", verdict: "AFFINITY™ PL 1881G — recommended, pending local food-contact docs.", body: "It leads on seal temperature, but Brazil needs ANVISA documentation and a product-steward sign-off. It clears the moment both are on file.", points: [{ icon: "document-chart", text: "Add ANVISA food-contact documentation" }, { icon: "group", text: "Product-steward sign-off (new region)" }], rule: "region.docs.missing → require(evidence)" },
        };
      }
      if (id === "foam") {
        return {
          signal: { title: "High-rebound midsole", sub: "Performance footwear foam for a first-time compounder in the US." },
          stages: [
            [{ tag: "INFUSE", t: "9107", x: "Rebound 62% · best fit" }, { t: "9007", x: "Softer · Shore A 60" }],
            [{ tag: "SCD", t: "Skin-contact safe", x: "REACH SVHC screen clear" }, { tag: "TDS", t: "Density & compression set", x: "spec maintained" }],
            [{ t: "Regulatory", x: "Consumer-goods RSL clear." }, { t: "Availability", x: "In stock · US." }, { t: "Policy", x: "New account → verify + declaration." }],
          ],
          decision: { tone: "cond", label: "Conditional", verdict: "INFUSE™ 9107 — recommended, pending a first-order declaration.", body: "Market and application fit, but a first-time compounder needs verification and a signed skin-contact declaration. The sample parks until both clear.", points: [{ icon: "document-chart", text: "Signed skin-contact declaration" }, { icon: "group", text: "Compounder verification" }], rule: "¬buyer.verified → route(steward)" },
        };
      }
      // fascia (hero)
      return {
        signal: { title: "Cold-weather TPO fascia", sub: "Injection-molded automotive fascia that must take a cold-temperature impact and let the part down-gauge, shipping to Germany." },
        stages: [
          [{ tag: "ENGAGE", t: "XLT 8677", x: "Tg −63 °C · best fit" }, { t: "7467", x: "Tg −58 °C · proven" }, { t: "8842", x: "soft-touch POE" }],
          [{ tag: "TDS", t: "Low-temp impact (Tg)", x: "leads the field at −63 °C" }, { tag: "RDS", t: "REACH + IMDS", x: "registered · declarable filed" }],
          [{ t: "Regulatory", x: "REACH/IMDS clear for automotive." }, { t: "Availability", x: "Freeport lot in stock now." }, { t: "Policy", x: "Covenant grade + spec preserved." }],
        ],
        decision: { tone: "allow", label: "Recommended · 94%", verdict: "ENGAGE™ XLT 8677 — it leads on the property that decides this part.", body: "Best low-temperature impact while letting you down-gauge, regulatory clear, and the qualification lot is in stock. A tracked sample is ready with no forms.", points: [{ icon: "checkmark-filled", text: "Cold-temp impact + down-gauge" }, { icon: "arrow-up-right", text: "Next action: reserve a sample" }], rule: "rank.fit ∧ reg.clear ∧ supply.ok → recommend" },
      };
    },
  };

  function RecommendationGraph() {
    return (
      <div className="dcg-reco-band">
        <div className="dcg-reco-eyebrow">
          <span className="dcg-reco-pill"><span className="dow-spark">✦</span> AI Ready Beta · how ChemAssist recommends</span>
          <h2>One grade, chosen for you — and the reason it won.</h2>
          <p>Describe what you're building and ChemAssist reads it into a brief, matches grades, weighs the evidence, clears the rules, and returns one recommendation. Pick a need to see it resolve.</p>
        </div>
        <div className="dcg-reco-panel">
          <UI.DecisionGraph model={RECO} />
        </div>
      </div>
    );
  }
  UI.RecommendationGraph = RecommendationGraph;
})();
