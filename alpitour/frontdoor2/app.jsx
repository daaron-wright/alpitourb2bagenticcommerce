/* ============================================================
   Alpitour.it — AlpiGPT Front Door v2 (app)
   Conversational hero → live seven-stage assembly (journey spine +
   agent cast + Travel Work Context) → personalized itinerary with
   multi-brand routing, sold-out recovery, booking/hold/NBA, in-trip
   teaser, and the governed handoff bridge into the B2B console.
   ============================================================ */
(function () {
  const { useState, useRef, useEffect } = React;
  const { STAGES, ALL_AGENTS, AGENT_ICON, twcFor, SCENARIOS } = window.FD;
  const Ki = ({ name, size }) => <svg className="ki" style={size ? { width: size, height: size } : null}><use href={`#icon-${name}`} /></svg>;

  const SUGG = [
    { id: "puglia", t: "Somewhere warm in October, relaxed, good food, short flight" },
    { id: "sharm", t: "Family of 3 to Sharm in August, all inclusive, ~€3,500" },
    { id: "maldives", t: "Maldives over New Year, overwater villa, ~€4,000pp" },
  ];

  function App() {
    const [view, setView] = useState("home");        // home (hero) | run
    const [phase, setPhase] = useState("intro");     // intro | running | done
    const [scId, setScId] = useState("puglia");
    const [query, setQuery] = useState("");
    const [stageIdx, setStageIdx] = useState(-1);     // current active stage
    const [doneStages, setDoneStages] = useState(-1); // highest completed
    const [msgs, setMsgs] = useState([]);
    const [showOrch, setShowOrch] = useState(false);  // demo toggle, clean by default
    const [handoff, setHandoff] = useState(false);
    const [recovery, setRecovery] = useState(false);
    const [toast, setToast] = useState(null);
    const timers = useRef([]);
    const toastT = useRef(null);

    const sc = SCENARIOS[scId];

    function showToast(t) { setToast(t); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2800); }
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    function run(id, typed) {
      const scenario = SCENARIOS[id] || SCENARIOS.puglia;
      setScId(scenario.id);
      setQuery(typed || scenario.query);
      setView("run"); setPhase("running");
      setStageIdx(-1); setDoneStages(-1); setRecovery(false);
      setMsgs([{ role: "user", html: typed || scenario.query },
               { role: "ai", agent: STAGES[0].warm, html: "Lovely — let me take this from here. I'll read your request, find the right trip across our brands, and put it together for you." }]);
      timers.current.forEach(clearTimeout); timers.current = [];
      const STEP = 920;
      STAGES.forEach((st, i) => {
        timers.current.push(setTimeout(() => {
          setStageIdx(i);
          if (scenario.soldOut && scenario.soldOut.at === i) setRecovery(true);
          // narrate select stages
          const narr = stageNarration(scenario, i);
          if (narr) setMsgs((m) => [...m, { role: "ai", agent: STAGES[i].warm, html: narr }]);
        }, i * STEP + 300));
        timers.current.push(setTimeout(() => setDoneStages(i), i * STEP + STEP + 150));
      });
      timers.current.push(setTimeout(() => { setPhase("done"); }, STAGES.length * STEP + 500));
    }

    function stageNarration(scenario, i) {
      if (i === 2) return "I'm weighting for what you've loved before — <b>" + scenario.twc.persona.join(", ") + "</b>.";
      if (i === 3 && scenario.soldOut) return "Heads up — <b>" + scenario.soldOut.hotel + "</b> is " + scenario.soldOut.line;
      if (i === 3) return "Searching across <b>Alpitour, Bravo and Francorosso</b> — ranked on fit, not just price.";
      if (i === STAGES.length - 1) return "Done. Here's the one I'd book — with the reasons it fits you. <b>Book it, hold it 24h, or hand it to your agency.</b>";
      return null;
    }

    function reset() { setView("home"); setPhase("intro"); setStageIdx(-1); setDoneStages(-1); setMsgs([]); window.scrollTo({ top: 0, behavior: "smooth" }); }

    /* ---------- header ---------- */
    const header = (
      <header className="v-head">
        <div className="v-head-in">
          <div className="v-logo" onClick={reset}>alpitour<small>WORLD · MOCK</small></div>
          <div className="v-brands">
            {["Alpitour", "Bravo", "Francorosso"].map((b, i) => <span key={b} className={`v-brandtab ${i === 0 ? "on" : ""}`}>{b}</span>)}
          </div>
          <div className="v-head-r">
            <span className={`v-toggle ${showOrch ? "on" : ""}`} onClick={() => setShowOrch(!showOrch)} title="Reveal the agents & KAF orchestration (for demos)">
              <span className="sw" /> Show orchestration
            </span>
            <span className="lk" onClick={() => showToast("WhatsApp stays — AlpiGPT is the line above it.")}><Ki name="chat-bot" size={13} /> WhatsApp</span>
            <span className="v-poc">AI Lab PoC</span>
          </div>
        </div>
      </header>
    );

    /* ---------- hero ---------- */
    const hero = (
      <section className="v-hero">
        <div className="v-hero-in">
          <div className="v-evo">
            <span className="from">Cerca: destinazione · date · ospiti</span>
            <span className="arr">→</span>
            <span className="to"><span className="spark">✦</span> Dillo con parole tue</span>
          </div>
          <h1>Raccontaci il viaggio.<br /><em>Al resto pensiamo noi.</em></h1>
          <p className="sub">Describe the holiday you're imagining. AlpiGPT understands it, searches every Alpitour brand, and puts together a trip made for you — then you book it, hold it, or hand it to your agency.</p>

          <div className="v-spine">
            {STAGES.map((st, i) => (
              <div className="v-stage" key={st.key}>
                <span className="v-snum">{String(i + 1).padStart(2, "0")}</span>
                <span className="v-dot"><Ki name={i < 3 ? "chat-bot" : i < 6 ? "network" : "checkmark-filled"} size={13} /></span>
                <span className="v-slabel">{st.label}</span>
              </div>
            ))}
          </div>

          <div className="v-ask">
            <div className="v-askbar">
              <span className="v-askbadge"><span className="spark">✦</span> AlpiGPT</span>
              <input className="v-askinput" placeholder="Somewhere warm in October, relaxed, good food…" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") run(detectScenario(query), query); }} />
              <button className="v-askbtn" onClick={() => run(detectScenario(query), query || undefined)}>Plan my trip</button>
            </div>
            <div className="v-sugg">{SUGG.map((s) => <button key={s.id} onClick={() => run(s.id, s.t)}>{s.t}</button>)}</div>
            <p className="v-classic">Prefer the classic search? <a onClick={() => showToast("The structured search stays — same engine, two doors.")}>Destinazione · Tipologia · Ospiti · Periodo</a></p>
          </div>

          <div className="v-trust">
            <span className="it"><Ki name="recommend" size={15} /> <b>One conversation</b>, every brand</span>
            <span className="it"><Ki name="document-chart" size={15} /> Answers <b>grounded</b> in our own catalogues</span>
            <span className="it"><Ki name="group" size={15} /> Hand to a <b>human agency</b> anytime — context intact</span>
          </div>
        </div>
      </section>
    );

    function detectScenario(q) {
      const s = (q || "").toLowerCase();
      if (s.includes("sharm") || s.includes("family") || s.includes("egypt") || s.includes("jaz")) return "sharm";
      if (s.includes("maldiv") || s.includes("overwater") || s.includes("honeymoon")) return "maldives";
      return "puglia";
    }

    /* ---------- run / done experience ---------- */
    const res = sc.result;
    const experience = (
      <div className="v-exp">
        <div className="v-exp-grid">
          {/* conversation */}
          <div className="v-chat">
            <div className="v-chat-h">
              <span className="spark">✦</span>
              <div style={{ flex: 1 }}><div className="t">AlpiGPT</div><div className="s">Your concierge · every Alpitour brand</div></div>
              <button className="v-chip" style={{ padding: "5px 11px" }} onClick={reset}>↺ New</button>
            </div>
            <div className="v-chat-b">
              {msgs.map((m, i) => (
                <div key={i} className={`v-msg ${m.role}`}>
                  {m.role === "ai" && m.agent && <div className="agentline"><Ki name="recommend" size={11} /> {m.agent}</div>}
                  <span dangerouslySetInnerHTML={{ __html: m.html }} />
                </div>
              ))}
            </div>
            {phase === "done" && (
              <div className="v-chips">
                <button className="v-chip red" onClick={() => showToast("Booking online — payment & fraud guardrails apply (simulated).")}>Book online</button>
                <button className="v-chip" onClick={() => showToast("Held for 24 hours · ref AT-88421 (simulated).")}>Hold 24h</button>
                <button className="v-chip" onClick={() => setHandoff(true)}>Hand to my agency</button>
              </div>
            )}
          </div>

          {/* workspace */}
          <div className="v-ws">
            {/* compact journey spine */}
            <div className="v-wspine">
              {STAGES.map((st, i) => {
                const state = i < doneStages + 1 && i !== stageIdx ? "passed" : i === stageIdx && phase !== "done" ? "active" : i <= doneStages ? "passed" : "";
                const cls = phase === "done" ? "passed" : state;
                return (
                  <div className={`v-wstage ${cls}`} key={st.key} title={st.warm}>
                    <span className="v-wdot">{cls === "passed" ? <Ki name="checkmark-filled" size={10} /> : null}</span>
                    <span className="l">{st.label}</span>
                  </div>
                );
              })}
            </div>

            {/* current status (running) */}
            {phase === "running" && stageIdx >= 0 && (
              <div className="v-card" style={{ padding: "14px 18px" }}>
                <div className="v-statusline"><span className="sp" /> <span><b style={{ color: "var(--fg-1)", fontWeight: 600 }}>{STAGES[stageIdx].warm}</b>{showOrch ? <span style={{ color: "var(--fg-muted)" }}> · {STAGES[stageIdx].agents.join(" · ")} · KAF {STAGES[stageIdx].kaf}</span> : ""}…</span></div>
              </div>
            )}

            {/* sold-out recovery */}
            {recovery && phase !== "done" && (
              <div className="v-recovery">
                <span className="ic"><Ki name="warning-alt" size={16} /></span>
                <div><div className="t">{sc.soldOut.hotel} — sold out for your dates</div><div className="s">Not a dead end. I'm ranking comparable family villages with the baby pool you wanted.</div></div>
              </div>
            )}

            {/* Travel Work Context — living object */}
            {stageIdx >= 0 && (
              <div className="v-card v-twc">
                <div className="v-twc-h"><Ki name="network" size={15} /> <span className="t">Your trip, taking shape</span><span className="id">{showOrch ? "Travel Work Context · wpkg_001" : ""}</span></div>
                <div className="v-twc-sub">Everything I learn lands here — and travels with you to whatever you choose next.</div>
                <div className="v-twc-rows">
                  {twcFor(sc, Math.min(stageIdx, 5)).map((r) => (
                    <div className="v-twc-row" key={r.k}>
                      <dt>{r.k}</dt>
                      <dd>
                        {r.kind === "text" && r.v}
                        {(r.kind === "tags" || r.kind === "tags-warm") && (
                          <div className="v-twc-vals">{r.v.map((t) => <span key={t} className={`v-tv ${r.kind === "tags-warm" ? "warm" : ""}`}>{t}</span>)}</div>
                        )}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* orchestration panel (toggle-gated) */}
            {showOrch && stageIdx >= 0 && (
              <div className="v-card v-orch">
                <div className="v-card-h"><span className="ic"><Ki name="recommend" size={16} /></span><div><h3>Orchestration</h3><div className="sub">Ten specialised agents, coordinated by KAF</div></div></div>
                <div className="v-orch-cast">
                  {ALL_AGENTS.map((a) => {
                    const liveAgents = stageIdx >= 0 && phase !== "done" ? STAGES[stageIdx].agents : [];
                    const passedAgents = STAGES.slice(0, doneStages + 1).flatMap((s) => s.agents);
                    const isLive = liveAgents.includes(a);
                    const isOn = phase === "done" || passedAgents.includes(a) || isLive;
                    return (
                      <span key={a} className={`v-agent ${isLive ? "live" : isOn ? "on" : ""}`}>
                        <span className="av"><Ki name={AGENT_ICON[a]} size={11} /></span>{a.replace(" Agent", "")}
                      </span>
                    );
                  })}
                </div>
                <div className="v-kaf">
                  <span className="lbl">KAF lifecycle</span>
                  {["Discover", "Plan", "Validate", "Commit"].map((p, i) => {
                    const order = { Discover: 0, Plan: 1, Validate: 2, Commit: 3 };
                    const cur = phase === "done" ? 3 : (stageIdx >= 0 ? order[STAGES[stageIdx].kaf] : -1);
                    return (
                      <React.Fragment key={p}>
                        {i > 0 && <span className="arr">›</span>}
                        <span className={`v-kafphase ${cur >= i ? "on" : ""}`}><span className="d" /> {p}</span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RESULT */}
            {phase === "done" && (
              <>
                <div className="v-card v-result">
                  <div className="v-card-h" style={{ marginBottom: 14 }}>
                    <span className={`v-brandbadge ${res.brand}`}>{res.brandName}</span>
                    <span className="v-match" style={{ marginLeft: "auto" }}><Ki name="recommend" size={12} /> {res.match}% match for you</span>
                  </div>
                  <div className="v-res-hero">
                    <image-slot id={`fd2-${sc.id}`} shape="rounded" radius="12" placeholder="Destination photo" style={{ width: "100%", height: 150 }}></image-slot>
                    <div className="v-res-body">
                      <h3>{res.name}</h3>
                      <div style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>{res.sub}</div>
                      <div className="v-why">
                        {res.why.map(([a, b]) => <div className="w" key={a}><Ki name="checkmark-filled" size={13} /><span><b>{a}</b> · {b}</span></div>)}
                      </div>
                    </div>
                  </div>
                  <div className="v-segs">
                    {res.segs.map(([ic, t, s]) => (
                      <div className="v-seg" key={t}><span className="ic"><Ki name={ic} size={15} /></span><div><div className="t">{t}</div><div className="s">{s}</div></div><span className="p">included</span></div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--k-cool-gray-10)" }}>
                    <div><span className="v-price">€{res.price.toLocaleString()}</span> <small style={{ color: "var(--fg-muted)" }}>{sc.id === "sharm" ? "· family of 3" : "· per person"}</small></div>
                    {showOrch && <span style={{ fontSize: 11, color: "var(--fg-subtle)" }}>policy-checked · OPA · proposal v1</span>}
                  </div>
                  {/* 7th stage — booking support + NBA */}
                  <div className="v-actions">
                    <button className="v-act primary" onClick={() => showToast("Booking online — guardrails apply (simulated).")}><Ki name="checkmark-filled" size={16} /><div className="t">Book online</div><div className="s">Secure · free cancellation window</div></button>
                    <button className="v-act" onClick={() => showToast("Held for 24 hours · ref AT-88421 (simulated).")}><Ki name="warning-alt" size={16} /><div className="t">Hold for 24 hours</div><div className="s">Lock it in while you decide</div></button>
                    <button className="v-act" onClick={() => setHandoff(true)}><Ki name="group" size={16} /><div className="t">Continue with an agency</div><div className="s">Your context travels with you</div></button>
                  </div>
                </div>

                {/* in-trip care teaser */}
                <div className="v-teaser">
                  <span className="ic"><Ki name="anomaly" size={18} /></span>
                  <div><div className="t">I'll stay with you on the trip, too</div><div className="s">If a flight changes, I re-book around your whole itinerary and tell you — before you have to ask.</div></div>
                  <span className="badge">In-trip care</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {header}
        {view === "home" ? hero : experience}

        {/* value proof band */}
        <section className="v-value">
          <div className="v-value-in">
            <span className="v-eyebrow">Why a concierge, not a search box</span>
            <h2 style={{ fontSize: 24, marginTop: 6 }}>The same journey, an order of magnitude faster.</h2>
            <div className="v-value-grid">
              {[["−50%", "Time to a trip", "From describe to a ready-to-book proposal — minutes, not an afternoon of tabs."],
                ["3 → 1", "Brands, one answer", "Alpitour, Bravo and Francorosso searched together and ranked on fit."],
                ["0", "Forms to repeat", "Your context follows you to booking, to hold, to a human agency."],
                ["24/7", "Always the first line", "Answers grounded in our own catalogues — humans one click away when you want them."]].map(([n, t, s]) => (
                <div className="v-vcard" key={t}><div className="n">{n}</div><div className="t">{t}</div><div className="s">{s}</div></div>
              ))}
            </div>
          </div>
        </section>

        <footer className="v-foot">
          <div className="v-foot-in">
            <b>AlpiGPT customer front door</b> · AI Lab mock — original layout inspired by alpitour.it's structure & the KAF orchestration blueprint
            <span style={{ marginLeft: "auto" }}>Seven-stage journey · ten agents · one Travel Work Context</span>
          </div>
        </footer>

        {handoff && <HandoffModal sc={sc} onClose={() => setHandoff(false)} />}
        {toast && <div className="v-toast">{toast}</div>}
      </div>
    );
  }

  function HandoffModal({ sc, onClose }) {
    const Ki2 = ({ name, size }) => <svg className="ki" style={size ? { width: size, height: size } : null}><use href={`#icon-${name}`} /></svg>;
    return (
      <div className="v-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="v-modal">
          <div className="v-modal-h">
            <h3>Continue with your agency — nothing gets lost</h3>
            <p>Your whole conversation becomes a <b>Travel Work Context</b> and lands in your agent's EasyBook console. They pick up exactly where you stopped — same brief, same preferences, the trip you liked.</p>
          </div>
          <div className="v-modal-b">
            <div className="v-card v-twc" style={{ animation: "none" }}>
              <div className="v-twc-h"><Ki2 name="network" size={15} /> <span className="t">Travel Work Context</span><span className="id">wpkg_alpitour_001 · KAF</span></div>
              <div className="v-twc-rows">
                <div className="v-twc-row"><dt>Request</dt><dd>{sc.twc.request}</dd></div>
                <div className="v-twc-row"><dt>Best match</dt><dd>{sc.result.brandName} · {sc.result.name} · €{sc.result.price.toLocaleString()}</dd></div>
                <div className="v-twc-row"><dt>About you</dt><dd><div className="v-twc-vals">{sc.twc.persona.map((t) => <span key={t} className="v-tv warm">{t}</span>)}</div></dd></div>
                <div className="v-twc-row"><dt>Handoff to</dt><dd>Rossi Travel · Welcome Travel Group · Gold</dd></div>
              </div>
            </div>
            <div style={{ marginTop: 6 }}>
              {[["group", "Your agent sees your brief, not a blank form", "The console opens with your context pre-loaded."],
                ["warning-alt", "Governed on both sides", "Pricing, commission and policy rules apply automatically — OPA guardrails."],
                ["document-chart", "Traceable end to end", "One work package follows the trip from this chat to the booking."]].map(([ic, t, s]) => (
                <div className="v-handrow" key={t}><span className="ic"><Ki2 name={ic} size={16} /></span><div><div className="t">{t}</div><div className="s">{s}</div></div></div>
              ))}
            </div>
          </div>
          <div className="v-modal-foot">
            <button className="v-btn" onClick={onClose}>Stay self-serve</button>
            <a className="v-btn teal" href="AlpiGPT B2B Concierge PoC.html"><Ki2 name="arrow-up-right" size={14} /> Open the agent's console →</a>
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
