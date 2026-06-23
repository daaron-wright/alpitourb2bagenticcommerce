/* ============================================================
   DecisionGraph — the compliance-graph concept, generalised.
   One calm, big-node, left-to-right reading that ends in a
   single decision: pick an input at the top and the whole
   chain + the terminal decision resolve.

   Reused for:
   • Tour operations — Signal → Affected scope → Constraints → Policy rules → Action
   • Recommendation — Need   → Matching packages → Evidence → Rules → Recommendation

   Mirrors the governance graph (package → documents → requirements
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
     DATASET A · Tour operations
     Signal → Affected scope → Constraints → Policy rules → Action
     ========================================================= */
  const SUPPLY = {
    inputLabel: "Pick a signal",
    firstHead: "Signal", firstHint: "What the spine caught.",
    heads: ["Affected scope", "Constraints", "Policy rules"],
    hints: ["Bookings, allotments & agencies it touches.", "The bounds the action must hold.", "The PAC rules it asks before acting."],
    decisionHead: "Action decision", decisionHint: "One terminal state, with the reason attached.",
    inputs: [
      { id: "outage", title: "Allotment cut · Jaz Mirabel", sub: "The wing that holds the August block is closing", tone: "act" },
      { id: "margin", title: "Margin-floor breach · 14 departures", sub: "Yield recompute drops departures at/below floor", tone: "route" },
      { id: "reg", title: "Entry-rule change · EG e-visa", sub: "TravelRadar detects an e-visa processing update", tone: "hold" },
    ],
    build(id) {
      if (id === "margin") {
        return {
          signal: { tag: "Yield agent · 06:19", title: "Margin-floor breach", sub: "Recompute prices 14 departures at or below the summer margin floor." },
          stages: [
            [{ tag: "BOOKINGS", t: "14 departures across 3 agencies", x: "EG Red Sea programme" }, { tag: "MARGIN", t: "€180k exposure this period", x: "vs. plan" }],
            [{ t: "Margin floor", x: "No departure may price ≤ the floor without a human." }, { t: "Refund-exposure headroom", x: "€310k — not the binding limit here." }],
            [{ tag: "FIN", t: "FIN-margin-floor-IT", x: "Any departure ≤ floor → route to planner." }],
          ],
          decision: { tone: "route", label: "Routed to a human", verdict: "Sent to the yield desk — the agent does not move price on its own.", body: "14 departures sit at or below the floor, so the proposal is held for sign-off with the full evidence screen attached.", points: [{ icon: "group", text: "Yield-desk sign-off required" }, { icon: "document-chart", text: "Evidence screen: cause · impact · options" }], rule: "FIN-margin-floor-IT · Playbook §6.3" },
        };
      }
      if (id === "reg") {
        return {
          signal: { tag: "TravelRadar · 31 May", title: "EG e-visa update", sub: "Processing-time change for Egypt e-visas issued on the traveller's behalf." },
          stages: [
            [{ tag: "PACKAGES", t: "Sharm el-Sheikh programme", x: "All EG Red Sea departures" }, { tag: "AGENCIES", t: "2 agencies with August departures", x: "active bookings" }],
            [{ t: "Consular boundary", x: "No formal entry confirmation without the trade desk." }, { t: "Source currency", x: "Use only approved, current entry bundles." }],
            [{ tag: "TRV", t: "TRV-consular-boundary", x: "Formal entry document → trade desk issues it." }],
          ],
          decision: { tone: "hold", label: "Held · propagated", verdict: "Answers and entry rules update; any formal entry confirmation is held for the trade desk.", body: "AlpiGPT answers and the package selector adjust immediately; an entry-bundle refresh is queued and impact briefs go to the affected agencies.", points: [{ icon: "checkmark-filled", text: "AlpiGPT + selector updated" }, { icon: "warning-alt", text: "Formal entry document → trade desk" }], rule: "TRV-consular-boundary · UC6" },
        };
      }
      // outage (hero)
      return {
        signal: { tag: "Disruption agent · 06:14", title: "Jaz Mirabel allotment cut", sub: "The wing that normally holds the August family block is closing." },
        stages: [
          [{ tag: "BOOKING", t: "BK 88412 · Bianchi", x: "3 pax · Jaz Mirabel · departs 14 Aug" }, { tag: "ALLOTMENT", t: "BravoClub guaranteed block", x: "rooms held · same class & amenities" }],
          [{ t: "Agency covenant", x: "Preserve room class + amenities for strategic tier." }, { t: "Exposure headroom", x: "€310k — re-point is within bounds." }],
          [{ tag: "PROM", t: "PROM-covenant-rossi", x: "Re-accommodation must hold class + amenities." }, { tag: "TRV", t: "TRV-advisory-EG", x: "Same corridor, advisory ≤ 2 — no new assessment." }],
        ],
        decision: { tone: "act", label: "Action committed", verdict: "Re-pointed to the guaranteed block — the Bianchi 14 Aug dates hold, same room class and amenities.", body: "The covenant is preserved and the re-point is in bounds, so the spine commits it and the planner confirms the covenant-affecting step.", points: [{ icon: "checkmark-filled", text: "Room class + amenities preserved · dates held" }, { icon: "group", text: "Planner confirmed the covenant step" }], rule: "PROM-covenant-rossi · Playbook §7.1" },
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
     DATASET B · Agency recommendation
     Need → Matching packages → Evidence → Rules → Recommendation
     ========================================================= */
  const RECO = {
    inputLabel: "Pick a client need",
    firstHead: "Client need", firstHint: "What the family described, in plain words.",
    heads: ["Matching packages", "Evidence", "Rules"],
    hints: ["Packages that could fit the brief.", "The data behind the choice — cited.", "Entry, availability & policy checks."],
    decisionHead: "Recommendation", decisionHint: "One package, with confidence and the next action.",
    inputs: [
      { id: "fascia", title: "Family beach week · toddler", sub: "Baby pool + kids' club · mid-August · ≈€3,500", tone: "allow" },
      { id: "pack", title: "Honeymoon · Santorini, October", sub: "Adults only · clients with non-EU passports", tone: "cond" },
      { id: "foam", title: "Guided Japan journey", sub: "Signature tour · first booking from a new agency", tone: "cond" },
    ],
    build(id) {
      if (id === "pack") {
        return {
          signal: { title: "Honeymoon · Santorini, October", sub: "Adults-only caldera suite for two — the couple hold non-EU passports." },
          stages: [
            [{ tag: "FRANCOROSSO", t: "Santorini for two", x: "Caldera suite · best fit" }, { t: "Bali wellness retreat", x: "Long-haul alternative" }],
            [{ tag: "PRM", t: "Adults-only covenant", x: "Party of 2 — matches" }, { tag: "FCT", t: "Sea-view suite category", x: "documented" }],
            [{ t: "Entry rules", x: "Non-EU passports need consulate visas for GR." }, { t: "Availability", x: "October departures open." }, { t: "Policy", x: "New entry path → trade-desk review." }],
          ],
          decision: { tone: "cond", label: "Conditional", verdict: "Santorini for two — recommended, pending consulate visas.", body: "It leads on the brief, but non-EU passport holders need consulate-issued Schengen visas and a trade-desk check. It clears the moment the evidence is on file.", points: [{ icon: "document-chart", text: "Consulate visa evidence per traveller" }, { icon: "group", text: "Trade-desk sign-off (entry path)" }], rule: "entry.docs.missing → require(evidence)" },
        };
      }
      if (id === "foam") {
        return {
          signal: { title: "Guided Japan journey", sub: "Tokyo → Osaka signature tour for two, requested by a first-time agency." },
          stages: [
            [{ tag: "TURISANDA", t: "Giappone d'Autore", x: "10 nights · best fit" }, { t: "Andalusia at ease", x: "Closer-to-home alternative" }],
            [{ tag: "GTE", t: "October departure guaranteed", x: "group at 12 of 16" }, { tag: "FCT", t: "Pace grade · easy-moderate", x: "documented" }],
            [{ t: "Entry rules", x: "JP entry clear for EU passports." }, { t: "Availability", x: "Seats open on the departure." }, { t: "Policy", x: "New agency → verify + tour qualification." }],
          ],
          decision: { tone: "cond", label: "Conditional", verdict: "Giappone d'Autore — recommended, pending agency verification.", body: "Departure and entry checks clear, but a first-time agency needs verification and tour qualification before the hold can commit. The request parks until both clear.", points: [{ icon: "document-chart", text: "Agency verification + tour qualification" }, { icon: "group", text: "Trade-desk sign-off (new agency)" }], rule: "¬agency.verified → route(tradedesk)" },
        };
      }
      // fascia (hero)
      return {
        signal: { title: "Family beach week · toddler", sub: "Two adults and a two-year-old, mid-August, all-inclusive around €3,500 — a proper baby pool, kids' club and family room are non-negotiable." },
        stages: [
          [{ tag: "BRAVO", t: "Jaz Mirabel Beach", x: "Shaded baby pool · best fit" }, { t: "Coral Bay", x: "Strong kids' club · smaller pool" }, { t: "Crete last minute", x: "budget alternative" }],
          [{ tag: "FCT", t: "Baby pool + kids' club", x: "leads the Sharm programme" }, { tag: "ENT", t: "EG e-visa + passports", x: "handled · ≥ 6 months valid" }],
          [{ t: "Entry rules", x: "EG entry clear for the party." }, { t: "Availability", x: "BravoClub guaranteed block holds the rooms." }, { t: "Policy", x: "Covenant room class + amenities preserved." }],
        ],
        decision: { tone: "allow", label: "Recommended · 94%", verdict: "Jaz Mirabel Beach — it leads on the must-haves that decide this trip.", body: "Best toddler setup in the programme, entry rules clear, and the family room is held in the guaranteed block. A 72-hour hold is ready with no forms.", points: [{ icon: "checkmark-filled", text: "Baby pool + kids' club + family room" }, { icon: "arrow-up-right", text: "Next action: place the 72-h hold" }], rule: "rank.fit ∧ entry.clear ∧ allotment.ok → recommend" },
      };
    },
  };

  function RecommendationGraph() {
    return (
      <div className="dcg-reco-band">
        <div className="dcg-reco-eyebrow">
          <span className="dcg-reco-pill"><span className="dow-spark">✦</span> AlpiGPT · how it recommends</span>
          <h2>One package, chosen for you — and the reason it won.</h2>
          <p>Describe the trip and AlpiGPT reads it into a brief, matches packages, weighs the evidence, clears the rules, and returns one recommendation. Pick a need to see it resolve.</p>
        </div>
        <div className="dcg-reco-panel">
          <UI.DecisionGraph model={RECO} />
        </div>
      </div>
    );
  }
  UI.RecommendationGraph = RecommendationGraph;
})();
