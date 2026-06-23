// frame.jsx — Frame + Provoke.
// Overview (Future Travel Desk), Creative contract, Future success (headline / postcard),
// Demo as future artifact.

const AL = window.AL || {};

const AL_CAST = [
  "Customer / Traveler", "External Travel Advisor", "AlpiGPT Orchestrator", "LyteAI Itinerary Composer",
  "Easybooking Proposal Engine", "Internal Booking Operator", "Risk / Governance Lead",
  "Data / IT Owner", "Commercial Lead", "Observer / Scribe",
];

/* ============ OVERVIEW ============ */
function AlOverview() {
  const arc = [
    { k: "Imagine", d: "Postcard / headline from 2027", c: "#29707A" },
    { k: "Provoke", d: "The demo as one future artifact", c: "#3E8AC2" },
    { k: "Enact", d: "Fishbowl role-play of the journey", c: "#8A4FBF" },
    { k: "Capture", d: "Command center · service blueprint", c: "#E68A00" },
    { k: "Distill", d: "The minimum believable agent", c: "#FF462D" },
  ];
  return (
    <div className="al-board" style={{ "--al-accent": "#29707A" }}>
      <div className="al-body" style={{ padding: "50px 64px", justifyContent: "center", gap: 0 }}>
        <span className="al-eyebrow" style={{ color: "#29707A" }}>
          <span className="al-dot" style={{ background: "#29707A" }}></span>
          Kyndryl AI Innovation Lab · Alpitour · Future Travel Desk
        </span>
        <h1 className="al-title" style={{ fontSize: 49, marginTop: 16, maxWidth: 1340 }}>
          Future Travel Desk — discovering the minimum believable agentic interaction.
        </h1>
        <p className="al-sub" style={{ fontSize: 19, maxWidth: 1140, marginTop: 16 }}>
          We are here to discover what the future travel-selling experience could become — when we leverage
          <b style={{ color: "var(--fg-1)" }}> agentic orchestration</b>, and decide what a travel advisor would need to trust.
        </p>

        <div style={{ marginTop: 36, display: "flex", alignItems: "stretch", gap: 0 }}>
          {arc.map((s, i) => (
            <React.Fragment key={s.k}>
              <div style={{ flex: 1, borderTop: `4px solid ${s.c}`, paddingTop: 15, paddingRight: 18 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: s.c, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 21, color: "var(--fg-1)", marginTop: 4 }}>{s.k}</div>
                <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 5, lineHeight: 1.45 }}>{s.d}</div>
              </div>
              {i < arc.length - 1 ? <div style={{ flex: "0 0 auto", alignSelf: "center", color: "var(--fg-subtle)", fontSize: 20, padding: "0 4px" }}>→</div> : null}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}><b style={{ color: "var(--fg-1)" }}>8–12 participants</b> become characters in the future service</span>
          <span style={{ width: 1, height: 16, background: "var(--border-2)" }}></span>
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>Demo shown ~12 min — a provocation, not a spec</span>
          <span style={{ width: 1, height: 16, background: "var(--border-2)" }}></span>
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>Output: a service blueprint + a minimum believable agent</span>
        </div>
      </div>
    </div>
  );
}

/* ============ CREATIVE CONTRACT ============ */
const AL_SHIFT = [
  ["“Does this work?”", "“What future does this point toward?”"],
  ["“What is missing?”", "“What else could this unlock?”"],
  ["“Would agents use this?”", "“What would make this irresistible?”"],
  ["“Is this feasible?”", "“What would need to be true for this?”"],
  ["“What are the risks?”", "“Where would it need proof or escalation?”"],
  ["“Let’s validate the flow.”", "“Let’s discover the future behaviours.”"],
];
const AL_RULES = [
  ["Build, AND critique", "But replace “this won’t work” with “this would become stronger if…”."],
  ["Think in behaviours, not features", "Not “what screens do we need?” but “what should the co-pilot do at this moment?”."],
  ["Every idea needs an implication", "Name the data, control, or operating change that would make it real."],
];
function AlContract() {
  return (
    <Board phase="frame" time="00:00–00:08" title="The creative contract" output="A shared discovery mindset"
      script="We are not here to validate a demo. We are here to discover what the future travel-selling experience could become — act through the work, expose what AI should do, decide where humans need control, and find the smallest version a real agent would trust.">
      <div className="al-row" style={{ flex: "1 1 auto", alignItems: "stretch", minHeight: 0 }}>
        <div style={{ flex: "1.25", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <Kicker>The language shift — say this, not that</Kicker>
          <div style={{ border: "1px solid var(--border-1)", borderRadius: 12, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
            {AL_SHIFT.map(([a, b], i) => (
              <div key={i} style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 24px 1.15fr", alignItems: "center", gap: 8, padding: "8px 16px", borderBottom: i < AL_SHIFT.length - 1 ? "1px solid var(--border-1)" : "none" }}>
                <span style={{ fontSize: 13, color: "var(--fg-muted)", textDecoration: "line-through", textDecorationColor: "var(--border-2)" }}>{a}</span>
                <span style={{ color: "var(--k-spruce-50)", fontSize: 15, textAlign: "center" }}>→</span>
                <span style={{ fontSize: 13.5, color: "var(--fg-1)", fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <Kicker color="var(--k-warm-red-60)">Three rules for the room</Kicker>
          {AL_RULES.map(([k, d], i) => (
            <div key={k} className="al-card" style={{ gap: 5, flex: 1, justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ flex: "0 0 auto", width: 24, height: 24, borderRadius: 999, background: "var(--k-warm-red-50)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 16.5, color: "var(--fg-1)" }}>{k}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.45, paddingLeft: 33 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: "0 0 auto" }}>
        <Kicker>You become a character in the future service</Kicker>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
          {AL_CAST.map((c) => <span key={c} style={{ fontSize: 12, color: "var(--fg-1)", border: "1px solid var(--border-1)", borderRadius: 999, padding: "5px 11px", background: "#fff" }}>{c}</span>)}
        </div>
      </div>
    </Board>
  );
}

/* ============ FUTURE SUCCESS — headline / postcard ============ */
function AlFutureSuccess({ ex }) {
  const must = [
    ["Product", "Versioned proposals"], ["Data", "Source + freshness"], ["Operations", "Advisor self-serves changes"],
    ["Training", "Trust calibration"], ["Governance", "Approval before hold"], ["Metrics", "Sold-out recovery rate"],
  ];
  return (
    <Board phase="frame" time="00:08–00:20" title="Future headline / postcard from 2027" output="Future success statements + what must be true"
      script="It is 2027. Write the success story — a future headline, or a postcard from a travel advisor. Then: what has to be true for it to be believable?">
      <div className="al-row" style={{ flex: 1, alignItems: "stretch" }}>
        {/* Option A — headline */}
        <div className="al-card" style={{ flex: 1, gap: 10, borderColor: "var(--k-spruce-20)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--k-spruce-60)", border: "1px solid var(--k-spruce-20)", borderRadius: 999, padding: "3px 9px" }}>Option A</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, color: "var(--fg-1)" }}>Future headline</span>
          </div>
          {[["In 2027, Alpitour…", "cut agency support calls 35% with an AI proposal workbench"], ["Because…", "agents recover sold-out requests in minutes, not hours"], ["This became possible when…", "the work package followed the request end-to-end"]].map(([l, e]) => (
            <Slot key={l} label={l} example={ex ? e : null} ex={ex} minH={52} style={{ flex: 1 }} />
          ))}
        </div>
        {/* Option B — postcard */}
        <div className="al-card" style={{ flex: 1, gap: 10, borderColor: "rgba(62,138,194,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3E8AC2", border: "1px solid rgba(62,138,194,0.35)", borderRadius: 999, padding: "3px 9px" }}>Option B</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, color: "var(--fg-1)" }}>Postcard from a travel advisor</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--k-warm-red-50)", border: "1.5px solid var(--k-warm-red-20)", borderRadius: 6, padding: "1px 8px", transform: "rotate(4deg)" }}>2027</span>
          </div>
          {[["I used to…", "call support whenever a customer changed dates"], ["Now I…", "see the price delta and compare proposal versions"], ["I trust it because…", "every fact shows its source and freshness"], ["I still need control when…", "a hold is placed or a proposal is sent"]].map(([l, e]) => (
            <Slot key={l} label={l} example={ex ? e : null} ex={ex} minH={40} style={{ flex: 1 }} />
          ))}
        </div>
      </div>
      <div style={{ flex: "0 0 auto" }}>
        <Kicker color="var(--k-warm-red-60)">What has to be true for it to be believable?</Kicker>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 10 }}>
          {must.map(([l, e]) => <Slot key={l} label={l} example={ex ? e : null} ex={ex} minH={52} />)}
        </div>
      </div>
    </Board>
  );
}

/* ============ DEMO AS FUTURE ARTIFACT (Provoke) ============ */
function AlDemoArtifact({ ex }) {
  const lenses = [
    { k: "This unlocks…", c: "#1F8F4A", e: "Every retrieved fact could carry its own proof" },
    { k: "This makes me wonder…", c: "#3E8AC2", e: "What else should it infer from a vague request?" },
    { k: "What if it also…", c: "#8A4FBF", e: "…offered two itinerary styles, not one list?" },
    { k: "The future version should…", c: "#E68A00", e: "…recover the sale, not just report ‘sold out’" },
  ];
  const beats = ["Messy request → work package", "Baby-pool → recommendation signal", "Preferred hotel sold out", "Alternatives ranked", "Proposal generated", "Hold placed", "Date change → proposal v2"];
  return (
    <Board phase="provoke" time="00:20–00:32" title="The demo as a future artifact" output="Ideas sparked by the prototype"
      script="Do not judge this as the final answer. Watch it as a future artifact. Look for what it unlocks, what it suggests, and what future moments are missing — behaviours, not UI polish.">
      <div style={{ flex: "0 0 auto" }}>
        <Kicker color="#3E8AC2">The beats you’ll see — jumping-off points, not acceptance criteria</Kicker>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 10, flexWrap: "wrap" }}>
          {beats.map((b, i) => (
            <React.Fragment key={b}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid var(--border-1)", borderRadius: 999, padding: "6px 13px", background: "#fff" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "#3E8AC2" }}>{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>{b}</span>
              </span>
              {i < beats.length - 1 ? <span style={{ color: "var(--fg-subtle)", padding: "0 6px" }}>→</span> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
      <Kicker color="#3E8AC2">Capture in four lenses — not likes, dislikes, bugs or gaps</Kicker>
      <div className="al-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", flex: 1 }}>
        {lenses.map((l) => (
          <div key={l.k} className="al-slot" style={{ justifyContent: "flex-start", borderColor: alHex(l.c, 0.32), background: alHex(l.c, 0.05) }}>
            <span className="al-slot-l" style={{ color: l.c }}>{l.k}</span>
            {ex ? <span className="al-slot-e" style={{ color: l.c, marginTop: 6 }}><span className="al-eg" style={{ color: alHex(l.c, 0.7) }}>e.g.</span>{l.e}</span> : null}
          </div>
        ))}
      </div>
    </Board>
  );
}

/* ============ SHARE YOUR SYSTEM (ask before the demo) ============ */
function AlShareSystem() {
  return (
    <Board phase="provoke" time="00:18–00:20" title="One ask before we begin"
      script="Quick check with the room — the more we can ground today in your real system, the sharper the ideas will be.">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 26, padding: "0 80px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 44, color: "var(--fg-1)", lineHeight: 1.18, maxWidth: 1180 }}>
          Are you willing — and able — to share your current version of the <span style={{ color: "var(--k-spruce-60)" }}>AlpiGPT booking system</span>?
        </span>
      </div>
    </Board>
  );
}

/* ============ THE PROBLEM TODAY (set up the demo) ============ */
function AlProblem() {
  const pains = [
    ["Fragmented tools", "The advisor hops between AlpiGPT, LyteAI, Easybooking and more to move a single request forward."],
    ["Slow, manual proposals", "Going from brief to a sent proposal is slow — and every change means rebuilding it from scratch."],
    ["Support dependency", "Sold-out hotels, date changes and unclear policies keep pushing the advisor to call support."],
  ];
  return (
    <Board phase="provoke" time="00:20–00:23" title="What are we trying to solve?"
      script="Before the demo — the pain in a travel advisor’s day today. Whatever future we imagine has to beat this.">
      <div className="al-row" style={{ flex: 1, alignItems: "center", gap: 18 }}>
        {pains.map(([t, d], i) => (
          <div key={t} className="al-card" style={{ flex: 1, alignSelf: "stretch", justifyContent: "flex-start", gap: 16, padding: "34px 28px", maxHeight: 340 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 46, color: "var(--k-warm-red-50)", lineHeight: 1 }}>{i + 1}</span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, color: "var(--fg-1)", lineHeight: 1.15 }}>{t}</div>
            <div style={{ fontSize: 16, color: "var(--fg-muted)", lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>
    </Board>
  );
}

Object.assign(AL, { Overview: AlOverview, Contract: AlContract, FutureSuccess: AlFutureSuccess, ShareSystem: AlShareSystem, Problem: AlProblem, DemoArtifact: AlDemoArtifact });
window.AL = AL;
