// toolkit.jsx — optional divergence exercises & references.
// Superpower Marketplace, Scenario remix, Concept studio, Concept theatre, AI imagination layer.

const AL = window.AL || {};
const TK_TIME = "optional exercise";

/* ============ AI SUPERPOWER MARKETPLACE ============ */
const AL_SUPERPOWERS = [
  "Interpret messy requests", "Ask better questions", "Remember preferences", "Detect missing info",
  "Retrieve trusted knowledge", "Explain recommendations", "Compare alternatives", "Recover from sold-out",
  "Compose itinerary options", "Assemble proposal", "Generate customer-ready language", "Detect policy risk",
  "Negotiate trade-offs", "Suggest upsells", "Prepare hold", "Version changes", "Escalate with context",
  "Coach junior agents", "Warn about stale data", "Predict conversion", "Recommend next-best-action",
];
const AL_MOMENTS = ["Inquiry", "Needs Capture", "Context & Signals", "Search & Recommend", "Itinerary Creation", "Proposal Prep", "Booking & Next Best"];
function AlSuperpowers({ ex }) {
  const seeded = { 0: "Interpret messy requests", 1: "Detect missing info", 3: "Recover from sold-out", 5: "Generate customer-ready language" };
  return (
    <Board phase="toolkit" time={TK_TIME} title="AI Superpower Marketplace" output="AI capability map by journey moment"
      script="Each person gets five tokens. Place AI superpowers onto the journey moments where they’d create the most differentiated experience.">
      <Kicker color="#4F5A63">The marketplace — five tokens each, choose what differentiates</Kicker>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", flex: "0 0 auto" }}>
        {AL_SUPERPOWERS.map((s) => (
          <span key={s} style={{ fontSize: 12, fontWeight: 500, color: "#7A3FB0", border: "1px solid rgba(138,79,191,0.3)", background: "rgba(138,79,191,0.06)", borderRadius: 7, padding: "5px 10px" }}>{s}</span>
        ))}
      </div>
      <Kicker color="#4F5A63">Place onto the seven future-journey moments</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 9, flex: 1, minHeight: 0 }}>
        {AL_MOMENTS.map((m, i) => (
          <div key={m} style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A4FBF" }}>{i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.2 }}>{m}</span>
            </div>
            <div className="al-slot" style={{ flex: 1, minHeight: 0, padding: "10px 10px", justifyContent: "flex-start", borderColor: ex && seeded[i] ? "rgba(138,79,191,0.35)" : "var(--border-2)", background: ex && seeded[i] ? "rgba(138,79,191,0.05)" : "var(--bg-2)" }}>
              {ex && seeded[i] ? <span style={{ fontSize: 11.5, fontWeight: 500, color: "#7A3FB0", lineHeight: 1.35 }}>{seeded[i]}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </Board>
  );
}

/* ============ SCENARIO REMIX ============ */
const AL_SCENARIOS = [
  { n: "01", t: "The anxious parent", c: "#3E8AC2", q: "What should the co-pilot do beyond finding hotels?", e: "Reassurance script · family-proof points · transfer duration · low-stress itinerary" },
  { n: "02", t: "The premium switch", c: "#8A4FBF", q: "How to help the advisor upgrade without being pushy?", e: "Good / better / best ladder · upgrade story · private margin impact" },
  { n: "03", t: "The support-heavy advisor", c: "#E68A00", q: "How could AlpiGPT coach toward self-service?", e: "Confidence prompts · “why it’s safe to proceed” · escalation thresholds" },
  { n: "04", t: "The returning customer", c: "#1F8F4A", q: "How should memory & preferences change the journey?", e: "Preference memory · transfer warnings · personalised proposal language" },
  { n: "05", t: "The contradiction", c: "#D62E2E", q: "What should it do when the truth is messy?", e: "Trust receipt · source hierarchy · “I can’t safely confirm this” · escalate with conflict" },
];
function AlRemix({ ex }) {
  return (
    <Board phase="toolkit" time={TK_TIME} title="Scenario remix — escape the happy path" output="Edge-case opportunities · trust & control needs"
      script="Introduce a curveball. How should the co-pilot behave when the customer, the data, or the journey gets messy?">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, flex: 1, minHeight: 0 }}>
        {AL_SCENARIOS.map((s) => (
          <div key={s.n} className="al-card" style={{ gap: 9, borderColor: alHex(s.c, 0.3), padding: "16px 15px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: s.c }}>{s.n}</span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 16.5, color: "var(--fg-1)", lineHeight: 1.15 }}>{s.t}</div>
            <div style={{ fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.4 }}>{s.q}</div>
            <Slot label="Ideas" example={ex ? s.e : null} ex={ex} minH={92} style={{ flex: 1, marginTop: 2 }} />
          </div>
        ))}
      </div>
    </Board>
  );
}

/* ============ CONCEPT STUDIO ============ */
const AL_CONCEPT_FIELDS = [
  ["Name", "“Sold-Out Recovery Coach”"], ["Moment", "Where in the journey?"], ["User pain", "What does the advisor struggle with today?"],
  ["AI behaviour", "What does the co-pilot do?"], ["Magic moment", "What feels new or surprising?"], ["Human control", "What does the advisor approve or edit?"],
  ["Tools", "AlpiGPT / LyteAI / Easybooking"], ["Data needed", "What sources or context?"], ["Impact", "Speed · quality · conversion · fewer tickets"],
  ["Future screen", "What would the advisor see?"],
];
const AL_CONCEPTS = [
  ["Sold-Out Recovery Coach", "Three recovery strategies — closest match, lower-cost family, premium upgrade — each with customer-ready language."],
  ["Proposal Version Navigator", "Date / hotel / budget changes spin new proposal versions and explain the trade-offs in plain language."],
  ["Confidence-to-Act Meter", "Every recommendation shows whether to proceed, get approval, or escalate."],
  ["Customer Preference Memory", "Remembers travel style, prior objections and family needs to shape future proposals."],
  ["Operator-in-a-Box", "Answers the questions a booking operator usually gets — and escalates past a set threshold."],
];
function AlConceptStudio({ ex }) {
  return (
    <Board phase="toolkit" time={TK_TIME} title="Concept studio" output="A concept portfolio"
      script="Each team creates one concept card for a future agentic experience. Make the magic moment explicit — and say what the human still controls.">
      <div className="al-row" style={{ flex: 1, alignItems: "stretch" }}>
        <div style={{ flex: "1.25", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <Kicker color="#4F5A63">The concept card — fill one per team</Kicker>
          <div className="al-card" style={{ flex: 1, padding: 16, gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>
              {AL_CONCEPT_FIELDS.map(([k, hint], i) => (
                <div key={k} style={{ border: "1px dashed var(--border-2)", borderRadius: 8, padding: "8px 11px", background: "var(--bg-2)", display: "flex", flexDirection: "column", gap: 2, gridColumn: i < 2 ? "auto" : (i === 9 ? "1 / -1" : "auto") }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--fg-subtle)" }}>{k}</span>
                  <span style={{ fontSize: 12, color: ex ? "#7A3FB0" : "var(--fg-subtle)", lineHeight: 1.35, fontStyle: ex ? "normal" : "italic" }}>{hint}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <Kicker color="#4F5A63">Seed concepts — start here or invent your own</Kicker>
          {AL_CONCEPTS.map(([n, d]) => (
            <div key={n} className="al-card" style={{ gap: 4, padding: "12px 15px", flex: 1, justifyContent: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15.5, color: "var(--fg-1)" }}>{n}</div>
              <div style={{ fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.4 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </Board>
  );
}

/* ============ CONCEPT THEATRE ============ */
function AlTheatre({ ex }) {
  const beats = [["Customer says", "the opening ask"], ["Advisor does", "the human move"], ["AI does", "the co-pilot behaviour"], ["Interface shows", "what appears on screen"], ["Business outcome", "what changes"]];
  const responses = [["“I’d build on this by…”", "#1F8F4A"], ["“This could be even stronger if…”", "#3E8AC2"], ["“This inspires another idea…”", "#8A4FBF"]];
  return (
    <Board phase="toolkit" time={TK_TIME} title="Concept theatre" output="Memorable future moments"
      script="Each team performs their concept in two minutes — cards, sketched screens, or pure improv. Show the moment; don’t pitch the slide.">
      <Kicker color="#4F5A63">Perform five beats — two minutes</Kicker>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, flex: "0 0 auto" }}>
        {beats.map(([k, d], i) => (
          <React.Fragment key={k}>
            <div className="al-card" style={{ flex: 1, gap: 4, alignItems: "center", textAlign: "center", padding: "16px 12px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#4F5A63", fontWeight: 600 }}>{i + 1}</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 16, color: "var(--fg-1)" }}>{k}</span>
              <span style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.35 }}>{d}</span>
            </div>
            {i < beats.length - 1 ? <div style={{ flex: "0 0 auto", alignSelf: "center", color: "var(--fg-subtle)", padding: "0 8px" }}>→</div> : null}
          </React.Fragment>
        ))}
      </div>
      <Kicker color="#4F5A63">The audience responds only with — no critique yet</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, flex: 1, minHeight: 0 }}>
        {responses.map(([t, c]) => (
          <div key={t} className="al-card" style={{ borderColor: alHex(c, 0.3), background: alHex(c, 0.05), justifyContent: "center", alignItems: "flex-start", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: c }}></span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20, color: "var(--fg-1)", lineHeight: 1.25 }}>{t}</span>
          </div>
        ))}
      </div>
    </Board>
  );
}

/* ============ AI IMAGINATION LAYER (reference) ============ */
const AL_AI_ROLES = [
  ["AI as provocateur", "Generate five more radical versions of these ideas.", "After the room generates ideas"],
  ["AI as customer simulator", "Behave like this customer type — anxious parent, luxury upgrader, budget family, indecisive couple, last-minute, loyal returner, complaint-prone.", "During role-play & remix"],
  ["AI as booking operator", "Which of these future moments would reduce support work, and which might create new support problems?", "Pressure-testing concepts"],
  ["AI as concept synthesiser", "Cluster these notes into opportunity territories, name each, and suggest one prototype moment for each.", "At the harvest"],
  ["AI as screen generator", "Describe the interface state for this concept in one screen: what the advisor sees, what the AI says, what actions are available, what proof is shown.", "Making concepts tangible"],
];
function AlAILayer() {
  return (
    <Board phase="toolkit" eyebrow="06 · Toolkit · reference" title="The AI imagination layer"
      sub="Make AI a participant, not just the subject. Five ways to bring a live model into the room — keep it grounded in the scenario cards and the room’s own notes.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "1fr", gap: 14, flex: 1, minHeight: 0 }}>
        {AL_AI_ROLES.map(([r, p, w]) => (
          <div key={r} className="al-card" style={{ gap: 9 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 17, color: "var(--fg-1)" }}>{r}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--k-spruce-60)", whiteSpace: "nowrap" }}>{w}</span>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--fg-1)", fontFamily: "var(--font-mono)", background: "var(--bg-2)", border: "1px solid var(--border-1)", borderRadius: 8, padding: "10px 12px", flex: 1 }}>{p}</div>
          </div>
        ))}
        <div className="al-card" style={{ gridColumn: "span 1", background: "var(--k-ai-spruce-06)", borderColor: "var(--k-spruce-20)", gap: 8, justifyContent: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--k-spruce-60)" }}>Leave with — the Agentic Opportunity Atlas</div>
          <div style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.5 }}>Future experience principles · opportunity territories · concept cards · new demo moments · AI behaviours · open questions · MVP seeds.</div>
        </div>
      </div>
    </Board>
  );
}

Object.assign(AL, { Superpowers: AlSuperpowers, Remix: AlRemix, ConceptStudio: AlConceptStudio, Theatre: AlTheatre, AILayer: AlAILayer });
window.AL = AL;
