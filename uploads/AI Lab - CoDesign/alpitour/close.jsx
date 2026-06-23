// close.jsx — Distill phase: Minimum Believable Agent, Opportunity harvest.

const AL = window.AL || {};

/* ============ MINIMUM BELIEVABLE AGENT ============ */
const AL_MBA_MENU = ["Interpret", "Clarify", "Retrieve", "Check", "Recommend", "Generate", "Assemble", "Price", "Hold", "Modify", "Version", "Escalate", "Upsell", "Send", "Learn / remember"];
const AL_MBA_CAPS = ["Interpret the customer request", "Ask guided clarifying questions", "Retrieve hotel / policy facts with source confidence", "Check availability & recover sold-out", "Assemble a proposal with versioning"];
const AL_MBA_TRUST = ["Source & freshness shown on every fact", "Recommendation rationale visible in plain language", "Human can edit, undo, or compare versions"];
const AL_MBA_TRUST_DESC = [
  "The advisor can see where every fact came from and how current it is — no unsourced claims to double-check by calling support.",
  "When AI ranks an option, it says why — so the advisor can defend the choice to the customer, not blindly forward it.",
  "The advisor is never trapped by the output — they can change it, roll it back, or compare versions. Control stays human.",
];
const AL_MBA_GATES = ["Advisor approves before a hold is placed", "Advisor approves before a proposal is sent or replaced"];
const AL_MBA_METRIC = "% of sold-out preferred-hotel requests recovered without a support ticket";
function AlMBA({ ex }) {
  return (
    <Board phase="distill" time="01:53–02:00" title="The minimum believable agent" output="5 capabilities · 3 trust · 2 gates · 1 metric"
      script="Now cut through the ambition. What is the smallest agentic experience a real travel advisor would trust enough to use? Choose deliberately — defend every card.">
      <div style={{ flex: "0 0 auto" }}>
        <Kicker color="var(--k-warm-red-60)">Capability menu — draw from these or add your own</Kicker>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 9 }}>
          {AL_MBA_MENU.map((m) => <span key={m} style={{ fontSize: 12, color: "var(--fg-2)", border: "1px solid var(--border-1)", borderRadius: 6, padding: "4px 10px", background: "#fff" }}>{m}</span>)}
        </div>
      </div>
      <div className="al-row" style={{ flex: 1, alignItems: "stretch" }}>
        {/* 5 capabilities */}
        <div style={{ flex: "1.25", display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>
          <Kicker color="var(--k-warm-red-60)">Five must-have capabilities</Kicker>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 11, border: ex ? "1px solid var(--k-spruce-20)" : "1.5px dashed var(--border-2)", background: ex ? "var(--k-ai-spruce-06)" : "var(--bg-2)", borderRadius: 9, padding: "8px 13px" }}>
              <span style={{ flex: "0 0 auto", width: 22, height: 22, borderRadius: 999, background: ex ? "var(--k-spruce-60)" : "var(--border-2)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
              <span style={{ fontSize: 13.5, color: ex ? "var(--fg-1)" : "var(--fg-subtle)", fontWeight: ex ? 500 : 400 }}>{ex ? AL_MBA_CAPS[i] : "capability"}</span>
            </div>
          ))}
        </div>
        {/* trust + gates + metric */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>
          <Kicker color="var(--k-warm-red-60)">Three trust requirements</Kicker>
          {[0, 1, 2].map((i) => (
            <Slot key={i} label={`Trust ${i + 1}`} example={ex ? AL_MBA_TRUST[i] : null} desc={ex ? AL_MBA_TRUST_DESC[i] : null} ex={ex} minH={34} style={{ flex: 1 }} />
          ))}
          <Kicker color="var(--k-warm-red-60)">Two approval gates</Kicker>
          {[0, 1].map((i) => (
            <Slot key={i} label={`Gate ${i + 1}`} example={ex ? AL_MBA_GATES[i] : null} ex={ex} minH={34} style={{ flex: 1 }} />
          ))}
        </div>
        {/* metric */}
        <div style={{ flex: "0.85", display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>
          <Kicker color="var(--k-warm-red-60)">What's the impact?</Kicker>
          <div className="al-card" style={{ flex: 1, background: "#fff", borderColor: "var(--k-warm-red-50)", justifyContent: "center", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 40, color: "var(--k-warm-red-50)", lineHeight: 1 }}>1</span>
            <div style={{ fontSize: 14.5, color: "var(--fg-1)", lineHeight: 1.4, fontWeight: 500 }}>{ex ? AL_MBA_METRIC : "The one measurable outcome that ties this to impact."}</div>
            {ex ? <div style={{ fontSize: 11.5, color: "var(--fg-muted)", lineHeight: 1.4 }}>Ties the AI experience directly to support deflection and recovered revenue.</div> : null}
          </div>
        </div>
      </div>
    </Board>
  );
}

/* ============ OPPORTUNITY HARVEST ============ */
const AL_TERRITORIES = [
  ["Guided Request Intelligence", "Turning incomplete customer needs into structured work packages.", "#29707A"],
  ["Contextual Recommendation & Recovery", "Recovering unavailable options with explainable alternatives.", "#3E8AC2"],
  ["Itinerary & Proposal Co-Creation", "Generating differentiated options and customer-ready proposals.", "#8A4FBF"],
  ["Trust, Proof & Control", "Showing evidence, freshness, confidence and approval boundaries.", "#E68A00"],
  ["Self-Service Modification & Versioning", "Managing post-proposal changes without starting over.", "#1F8F4A"],
  ["Operator Deflection & Smart Escalation", "Fewer unnecessary calls; cleaner unavoidable escalations.", "#FF462D"],
];
function AlHarvest({ ex }) {
  return (
    <Board phase="distill" time="01:45–01:53" title="Opportunity territories" output="Clustered & dot-voted territories"
      script="What did we discover today that was not in the demo? Cluster it into opportunity territories — then dot-vote the ones that would make Alpitour’s agentic future feel most differentiated.">
      <Kicker color="var(--k-warm-red-60)">Six territories — dot-vote the most differentiating</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "1fr 1fr", gap: 14, flex: 1, minHeight: 0 }}>
        {AL_TERRITORIES.map(([n, d, c]) => (
          <div key={n} className="al-card" style={{ borderColor: alHex(c, 0.3), gap: 8, position: "relative" }}>
            <span style={{ position: "absolute", top: 14, right: 14, width: 16, height: 16, borderRadius: 999, border: "1.5px dashed var(--border-2)" }}></span>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: c }}></span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, color: "var(--fg-1)", lineHeight: 1.15, paddingRight: 22 }}>{n}</div>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.45 }}>{d}</div>
          </div>
        ))}
      </div>
    </Board>
  );
}

Object.assign(AL, { MBA: AlMBA, Harvest: AlHarvest });
window.AL = AL;
