/* ============================================================
   AlpiGPT 2.0 — Guided demo · Demo Director (bottom command bar)
   Reads window.DemoBus (live agent stage) + window.PlatformBus
   (the Bianchi thread). Lights the matching beat, exposes the
   capability footer + policy-as-code, and lets the presenter
   step the narrative. Self-mounts to #demo-director-root.
   ============================================================ */
(function () {
  const { useState, useEffect, useRef } = React;
  const BEATS = window.DEMO_BEATS || [];
  const DemoBus = window.DemoBus;
  const PB = window.PlatformBus;

  // stage (agent flow) -> beat number (1..12)
  const S2B = { browse: 1, parsing: 2, blockers: 3, searching: 5, ranked: 6, drafting: 8, proposal: 9, holding: 10, held: 10, repricing: 11, v2: 11, completed: 12 };
  const liveIdxFor = (stage) => (S2B[stage] || 1) - 1;

  const CAP_ROLE = {
    AlpiGPT: "interpret · orchestrate",
    LyteAI: "compose itinerary",
    Easybooking: "proposal · booking",
  };

  function highlightRego(code) {
    const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc
      .replace(/(#[^\n]*)/g, '<span class="cm">$1</span>')
      .replace(/\b(package|default|import|some|not|in|with|else|true|false)\b/g, '<span class="kw">$1</span>');
  }

  const Ki = ({ name, size }) => (
    <svg className="ki" style={size ? { width: size, height: size } : null} aria-hidden="true"><use href={`#icon-${name}`} /></svg>
  );

  function Director() {
    const [cur, setCur] = useState(0);
    const [live, setLive] = useState(0);
    const [open, setOpen] = useState(false);
    const [handoff, setHandoff] = useState(PB ? !!PB.state.handoff : false);
    const curRef = useRef(0);
    curRef.current = cur;

    // follow the live agent flow — only ever advance forward
    useEffect(() => {
      if (!DemoBus) return;
      return DemoBus.on((s) => {
        const li = liveIdxFor(s.stage);
        setLive(li);
        if (li > curRef.current) setCur(li);
      });
    }, []);

    useEffect(() => {
      if (!PB) return;
      return PB.on((s) => setHandoff(!!s.handoff));
    }, []);

    if (!BEATS.length) return null;
    const b = BEATS[cur];
    const policy = b.policy;
    const atLive = cur === live;

    const go = (i) => { if (i >= 0 && i < BEATS.length) setCur(i); };

    function seedInquiry() {
      if (!PB) return;
      PB.emit("handoff");
      PB.emit("brief", {
        answers: [
          { k: "Destination", v: "Sharm el-Sheikh, Egypt" },
          { k: "When", v: "mid-August · flexible ±1 week" },
          { k: "Who's travelling", v: "2 adults + 1 child (age 2)" },
          { k: "Board", v: "All inclusive" },
          { k: "Budget", v: "≈ €3,500 per family" },
          { k: "Must-haves", v: "Baby pool · kids' club · family room" },
        ],
        cluster: "fam", conf: 96,
      });
      PB.push("feed", { who: "traveler", t: "The Bianchi family sent their inquiry to Rossi Travel." });
      if (window.PlatformView) window.PlatformView.show("b2b");
    }

    const showSeed = b.n === 1 && !handoff && !!PB;

    return (
      <div className={`dd ${open ? "open" : ""}`}>
        {/* expandable narration + policy */}
        <div className="dd-panel">
          <div className="dd-split">
            <div className="net">
              <h5>The AI agent network is handling this</h5>
              <div className="ags">{b.agents.map((a, i) => <span key={i} className="ag"><span className="d" />{a}</span>)}</div>
            </div>
            <div className="hu">
              <h5>You, the travel agent</h5>
              <div className="act"><Ki name="group" size={14} /> {b.you}</div>
              <div className="sub">Right information at the right time — the judgement, the sell and the relationship stay yours.</div>
            </div>
          </div>
          <div className="dd-panel-in">
            <div className="dd-narr">
              <p className="pt">{b.point}</p>
              <div className="dd-cols">
                <div className="dd-col">
                  <h5>What to show</h5>
                  <ul>{b.show.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div className="dd-col">
                  <h5>What to say</h5>
                  <div className="dd-say">“{b.say}”</div>
                </div>
              </div>
            </div>
            {policy ? (
              <div className="dd-policy">
                <div className="dd-pol-h">
                  <span className="kick">Policy-as-code</span>
                  <span className="pkg">{policy.pkg}</span>
                </div>
                <div className="dd-pol-title">{policy.title}</div>
                <div className="dd-pol-plain">{policy.plain}</div>
                <pre className="dd-pol-code" dangerouslySetInnerHTML={{ __html: highlightRego(policy.rego) }} />
                <div className="dd-pol-foot">
                  <span className="eng"><span className="d" /> Evaluated by the policy engine · OPA MCP</span>
                  <a className="dd-kaf" href="Alpitour Operations on KAF.html?lens=ops&screen=governance" target="_blank" rel="noopener">Open in KAF governance ↗</a>
                </div>
              </div>
            ) : (
              <div className="dd-policy empty">No policy gate on this beat — the agent is exploring, nothing is committed.</div>
            )}
          </div>
        </div>

        {/* always-visible bar */}
        <div className="dd-bar">
          <div className="dd-beatno">
            <span className="lab">Beat</span>
            <span className="n">{String(b.n).padStart(2, "0")}<small> / 12</small></span>
          </div>

          <div className="dd-steps">
            {BEATS.map((bb, i) => (
              <button key={i} className={`dd-step ${i < cur ? "done" : ""} ${i === cur ? "cur" : ""} ${i === live ? "live" : ""}`}
                title={`Beat ${bb.n} — ${bb.title}`} onClick={() => go(i)} />
            ))}
          </div>

          <div className="dd-mid" onClick={() => setOpen((o) => !o)}>
            <div className="kick">{b.kicker}</div>
            <div className="ttl">{b.title}</div>
          </div>

          {showSeed && <button className="dd-seed" onClick={seedInquiry}><Ki name="chat-bot" size={13} /> Seed the Bianchi inquiry</button>}

          {atLive ? null : <button className="dd-live show" onClick={() => setCur(live)}><span className="d" /> Live · beat {BEATS[live].n}</button>}

          <div className="dd-sep" />

          <div className="dd-caps">
            <span className="dd-ailabel">AI network</span>
            {["AlpiGPT", "LyteAI", "Easybooking"].map((c) => {
              const on = b.cap.includes(c);
              return (
                <span key={c} className={`dd-cap ${on ? "on" : ""}`} title={on ? `${c} · ${CAP_ROLE[c]}` : `${c} · idle`}>
                  <span className="d" /><span className="t">{c}</span>
                </span>
              );
            })}
            <span className={`dd-cap pol ${policy ? "on" : ""}`} onClick={() => policy && setOpen(true)} title={policy ? "Policy gate active — view the rule" : "No policy gate on this beat"}>
              <span className="d" /><span className="t">Policy</span>
            </span>
          </div>

          <div className="dd-sep" />

          <span className="dd-you" title={`You, the travel agent — ${b.you}`}><Ki name="group" size={12} /> <em>You</em><span className="ytask"> · {b.you}</span></span>

          <div className="dd-sep" />

          <div className="dd-nav">
            <button onClick={() => go(cur - 1)} disabled={cur === 0} title="Previous beat">‹</button>
            <button onClick={() => go(cur + 1)} disabled={cur === BEATS.length - 1} title="Next beat">›</button>
            <button className="dd-exp" onClick={() => setOpen((o) => !o)} title={open ? "Collapse" : "Expand narration"}>{open ? "▾" : "▴"}</button>
          </div>
        </div>
      </div>
    );
  }

  const mount = document.getElementById("demo-director-root");
  if (mount) ReactDOM.createRoot(mount).render(<Director />);
})();
