// work.jsx — Enact + Capture.
// Fishbowl role-play, AI Command Center replay, Agentic Service Blueprint.

const AL = window.AL || {};

/* ============ ROLE-PLAY — FUTURE TRAVEL DESK (fishbowl) ============ */
const AL_ROLES = [
  ["Customer / Traveler", "Plan a family holiday — imprecise, may change mind", "#4F5A63"],
  ["Travel Advisor", "Convert request → proposal fast, without calling support", "#29707A"],
  ["AlpiGPT Orchestrator", "Interpret, clarify, retrieve, coordinate — never book unasked", "#8A4FBF"],
  ["Booking Operator", "Enter only when the system can’t resolve safely", "#E68A00"],
  ["Risk / Governance", "Pause when AI oversteps, lacks proof, or needs approval", "#D62E2E"],
  ["Observer / Scribe", "Capture behaviours, data needs, trust needs, deflection", "#6B7780"],
];
const AL_ROUNDS = [
  ["Round 1 · Inquiry → recommendation", "Request → advisor asks AlpiGPT → clarify & retrieve → confirms sold-out → alternatives ranked.", "Define: what new behaviours did we discover?"],
  ["Round 2 · Proposal, hold & date change", "AlpiGPT shapes the multi-city itinerary → assembles the proposal → advisor approves the hold → customer shifts dates → reprices to v2.", "Define: what should AI prepare, and what must the human approve?"],
  ["Round 3 · Ongoing Customer Support", "Mid-trip in Italy a train strike disrupts the Rome→Florence leg → AlpiGPT flags it → reworks transfers & a hotel night → advisor confirms with the family.", "Define: would this stay self-service, or would support be needed?"],
];
function AlRolePlay({ ex }) {
  return (
    <Board phase="enact" time="00:32–01:00" title="Role-play — the Future Travel Desk" output="Discovered behaviours, gaps & moments"
      script="A fishbowl: a few act in the middle, everyone else captures. Act through the hero scenario. If something feels missing, don’t critique it — invent the missing behaviour.">
      <div className="al-card" style={{ flex: "0 0 auto", borderColor: "rgba(138,79,191,0.32)", background: "rgba(138,79,191,0.05)", flexDirection: "row", gap: 14, alignItems: "center", padding: "13px 18px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A4FBF", border: "1px solid rgba(138,79,191,0.4)", borderRadius: 999, padding: "3px 9px", flex: "0 0 auto" }}>Hero scenario · editable</span>
        <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--fg-1)" }}>
          A family of three from <Edit>Toronto, Canada</Edit> wants a <Edit>10-day</Edit> trip around <Edit>Italy</Edit> in <Edit>August</Edit>, around <Edit>CA$11,000</Edit>. They love <Edit>food, history & slow mornings</Edit>, travel with a <Edit>2-year-old</Edit>, and hoped to take in <Edit>Rome, Florence & the Amalfi Coast</Edit>. Their non-negotiables: <Edit>family rooms, air-con & short transfers</Edit>. A few hotels are unavailable — recover the sale, assemble a proposal, place a hold, handle a date change, then support a <Edit>travel disruption mid-trip</Edit>.
        </span>
      </div>

      <Kicker color="#8A4FBF">Six roles</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: "0 0 auto" }}>
        {AL_ROLES.map(([n, g, c]) => (
          <div key={n} className="al-card" style={{ gap: 4, padding: "11px 13px", borderColor: alHex(c, 0.28) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: c, flex: "0 0 auto" }}></span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.1 }}>{n}</span>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)", lineHeight: 1.35 }}>{g}</div>
          </div>
        ))}
      </div>

      <Kicker color="#8A4FBF">Three rounds — pause and harvest after each</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, flex: 1, minHeight: 0 }}>
        {AL_ROUNDS.map(([t, d, f]) => (
          <div key={t} className="al-card" style={{ gap: 8, justifyContent: "flex-start" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15.5, color: "var(--fg-1)", lineHeight: 1.2 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.45 }}>{d}</div>
            <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "flex-start", borderTop: "1px dashed var(--border-1)", paddingTop: 9 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: "#8A4FBF", border: "1.5px solid #8A4FBF", borderRadius: 5, padding: "0px 6px", letterSpacing: "0.06em", flex: "0 0 auto" }}>DEFINE</span>
              <span style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.4, fontWeight: 500 }}>{f.replace("Define: ", "")}</span>
            </div>
          </div>
        ))}
      </div>
    </Board>
  );
}

/* ============ AI COMMAND CENTER replay ============ */
const AL_CC_LANES = [
  { k: "What the advisor sees", c: "#3E8AC2", tag: "Advisor experience" },
  { k: "What AI is doing", c: "#8A4FBF", tag: "AI orchestration" },
  { k: "What the business cares about", c: "#1F8F4A", tag: "Impact" },
];
const AL_CC_STAGES = [
  { t: "Inquiry → recommendation", steps: "clarify · retrieve · recover sold-out" },
  { t: "Proposal, hold & date change", steps: "compose · assemble · hold · reprice" },
  { t: "Ongoing Customer Support", steps: "detect disruption · rework · confirm" },
];
// example fills: stageIndex → [agent sees, AI doing, business cares]
const AL_CC_EX = {
  0: ["Clarifying questions · sold-out status · ranked Italy alternatives", "Applies family / toddler signal · retrieves amenities · ranks family-fit options", "Sold-out request recovered · no support call"],
  1: ["Multi-city proposal · hold confirmation · date-change v2", "LyteAI shapes the itinerary · Easybooking assembles, holds & reprices to v2", "Faster time to offer · higher conversion chance"],
  2: ["Disruption alert · reworked transfers · added hotel night", "Detects the train strike · reworks the Rome→Florence leg · proposes a fix", "Traveler kept whole · cleaner escalation · operator load reduced"],
};
function AlCommandCenter({ ex }) {
  return (
    <Board phase="capture" time="01:00–01:20" title="AI Command Center replay" output="A three-layer map of the experience"
      script="Replay what just happened, stage by stage — decode every moment three ways: what the advisor sees, what AI is doing behind the scenes, and what the business cares about.">
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "168px repeat(3, 1fr)", gridTemplateRows: "auto repeat(3, 1fr)", gap: 6 }}>
        {/* header row */}
        <div></div>
        {AL_CC_LANES.map((l) => (
          <div key={l.k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 4px" }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: l.c, flex: "0 0 auto" }}></span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 16, color: "var(--fg-1)", lineHeight: 1.1 }}>{l.k}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: l.c }}>{l.tag}</div>
            </div>
          </div>
        ))}
        {/* stage rows */}
        {AL_CC_STAGES.map((s, r) => (
          <React.Fragment key={s.t}>
            <div className="al-card" style={{ justifyContent: "center", gap: 4, padding: "12px 15px", background: "var(--bg-2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--k-spruce-50)", fontWeight: 600 }}>{r + 1}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15.5, color: "var(--fg-1)", lineHeight: 1.15 }}>{s.t}</span>
              </div>
              <span style={{ fontSize: 10.5, color: "var(--fg-subtle)", lineHeight: 1.3, paddingLeft: 20 }}>{s.steps}</span>
            </div>
            {AL_CC_LANES.map((l, c) => {
              const fill = ex ? AL_CC_EX[r][c] : null;
              return (
                <div key={c} style={{ display: "flex", alignItems: "center", padding: "10px 13px", borderRadius: 8, minHeight: 0, overflow: "hidden", background: fill ? alHex(l.c, 0.05) : "#fff", border: fill ? `1px solid ${alHex(l.c, 0.3)}` : "1.5px dashed var(--border-2)" }}>
                  {fill ? <span style={{ fontSize: 12, color: "var(--fg-1)", lineHeight: 1.4 }}>{fill}</span> : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="al-card" style={{ flexDirection: "row", alignItems: "center", gap: 14, background: "var(--k-status-error-10)", borderColor: "var(--k-status-error-20)", padding: "10px 16px", flex: "0 0 auto" }}>
        <span style={{ width: 11, height: 11, borderRadius: 3, background: "#D62E2E", flex: "0 0 auto" }}></span>
        <span style={{ fontSize: 13, color: "var(--k-warm-red-70)", lineHeight: 1.4 }}>Flag in <b>red</b> across any lane: anything that needs proof, human approval, or escalation. <span style={{ color: "var(--fg-muted)" }}>Sticky key — agent · AI · business · risk.</span></span>
      </div>
    </Board>
  );
}

/* ============ AGENTIC SERVICE BLUEPRINT ============ */
const AL_BP_ROUNDS = [
  { t: "Inquiry → recommendation", steps: "Inquiry · Needs Capture · Context & Signals · Search & Recommend" },
  { t: "Proposal, hold & date change", steps: "Itinerary Creation · Proposal Prep · Hold · Reprice" },
  { t: "Ongoing Customer Support", steps: "Mid-trip disruption · Rework · Confirm" },
];
const AL_BP_LAYERS = ["Customer", "Travel advisor", "AI-stage", "Backstage", "Governance", "Impact"];
// example fills per round column: { layerIndex: text }
const AL_BP_EX = {
  0: ["Hoped for Rome, Florence & Amalfi", "Needs a credible alternative", "AlpiGPT clarifies & retrieves; detects sold-out; ranks family-fit options", "Inventory · product facts · pricing", "Advisor selects — no auto-switch", "Quote saved · ticket avoided"],
  1: ["Reviews proposal; shifts the dates", "Approves the hold & the v2", "LyteAI shapes the itinerary; Easybooking assembles, holds & reprices to v2", "Pricing · commission · hold status", "Advisor approves before hold & before v2", "Faster time to offer · less rework"],
  2: ["Train strike hits the Rome→Florence leg", "Gets the fix to confirm with the family", "Detects the disruption; reworks transfers & adds a hotel night", "Live disruption · availability · rebooking", "Advisor approves the reworked plan", "Traveler kept whole · no ticket · traceable"],
};
function AlBlueprint({ ex }) {
  const layerColors = ["#4F5A63", "#29707A", "#8A4FBF", "#6B7780", "#D62E2E", "#1F8F4A"];
  return (
    <Board phase="capture" time="01:20–01:45" title="Agentic service blueprint" output="Frontstage / AI-stage / backstage map"
      script="Turn the role-play into a system model: the three rounds across six layers. The hero scenario is worked through each round as an example — fill in your own live.">
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "130px repeat(3, 1fr)", gridTemplateRows: "auto repeat(6, 1fr)", gap: 5, border: "1px solid var(--border-1)", borderRadius: 10, padding: 6, background: "var(--bg-2)" }}>
        {/* header row */}
        <div></div>
        {AL_BP_ROUNDS.map((r, i) => (
          <div key={r.t} style={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", padding: "9px 12px", background: "#fff", borderRadius: 6, border: "1px solid var(--border-1)" }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.15 }}><span style={{ fontFamily: "var(--font-mono)", color: "var(--k-spruce-50)", marginRight: 6 }}>{i + 1}</span>{r.t}</span>
            <span style={{ fontSize: 10.5, color: "var(--fg-subtle)", lineHeight: 1.3 }}>{r.steps}</span>
          </div>
        ))}
        {/* layer rows */}
        {AL_BP_LAYERS.map((layer, r) => (
          <React.Fragment key={layer}>
            <div style={{ display: "flex", alignItems: "center", padding: "4px 10px", background: "#fff", borderRadius: 6, border: "1px solid var(--border-1)" }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: layerColors[r], lineHeight: 1.1 }}>{layer}</span>
            </div>
            {AL_BP_ROUNDS.map((rd, c) => {
              const fill = ex && AL_BP_EX[c] ? AL_BP_EX[c][r] : null;
              const isEx = !!fill;
              return (
                <div key={c} style={{ padding: "6px 11px", background: isEx ? alHex(layerColors[r], 0.06) : "#fff", borderRadius: 6, border: isEx ? `1px solid ${alHex(layerColors[r], 0.3)}` : "1px dashed var(--border-2)", display: "flex", alignItems: "center", minHeight: 0, overflow: "hidden" }}>
                  {fill ? <span style={{ fontSize: 11.5, color: "var(--fg-1)", lineHeight: 1.35 }}>{fill}</span> : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ flex: "0 0 auto", fontSize: 12, color: "var(--fg-muted)" }}>
        Worked example (Example mode): the hero family scenario traced across all three rounds.
      </div>
    </Board>
  );
}

Object.assign(AL, { RolePlay: AlRolePlay, CommandCenter: AlCommandCenter, Blueprint: AlBlueprint });
window.AL = AL;
