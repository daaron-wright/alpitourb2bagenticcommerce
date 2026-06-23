/* ============================================================
   Alpitour.it — Customer front door · simple Q&A
   One question at a time → one result → one handoff to the agency.
   Deterministic demo around the Bianchi family scenario.
   ============================================================ */
(function () {
  const { useState, useRef, useEffect } = React;
  const Ki = ({ name, size }) => <svg className="ki" style={size ? { width: size, height: size } : null}><use href={`#icon-${name}`} /></svg>;

  const QA = [
    { id: "where", q: "Let's keep it simple — three quick questions. <b>Where are you dreaming of?</b>", opts: ["Egypt — sea and sun", "Greek islands", "Not sure — surprise me"] },
    { id: "when", q: "<b>When would you go, and for how long?</b>", opts: ["August · one week", "September · a long weekend", "We're flexible"] },
    { id: "who", q: "<b>Who's travelling?</b>", opts: ["2 adults + our little one (2)", "Just the two of us", "A group of friends"] },
    { id: "budget", q: "Last one — <b>roughly what budget, all-in?</b>", opts: ["Around €3,500 for everyone", "Up to €2,000", "Whatever it takes"] },
  ];

  const SUGG = [
    "Family of 3 to Sharm in August, all inclusive, around €3,500",
    "Somewhere warm in October — relaxed, good food, short flight",
    "I don't know where — just somewhere with a great beach",
  ];

  const BRIEF = ["Egypt · Sharm el-Sheikh", "August · 7 nights", "2 adults + 1 child (2)", "All inclusive", "≤ €3,500 all-in"];
  const STATUS = ["Checking live availability with Alpitour…", "The most-loved family hotel is full for your week — finding better…", "Putting your trip together…"];

  function App() {
    const [items, setItems] = useState([]); // {kind: 'user'|'ai'|'answers'|'status-done'|'result'|'follow'|'agency'}
    const [step, setStep] = useState(-1);   // index into QA
    const [working, setWorking] = useState(false);
    const [statusTxt, setStatusTxt] = useState("");
    const [query, setQuery] = useState("");
    const [toast, setToast] = useState(null);
    const timers = useRef([]); const toastT = useRef(null);
    const endRef = useRef(null);

    const started = items.length > 0;
    useEffect(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }, [items, statusTxt]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    const later = (ms, f) => timers.current.push(setTimeout(f, ms));
    const showToast = (t) => { setToast(t); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2600); };
    const push = (x) => setItems((m) => [...m.filter((i) => i.kind !== "answers" && i.kind !== "follow"), ...(Array.isArray(x) ? x : [x])]);

    /* ---------- flow ---------- */
    function start(text) {
      push({ kind: "user", html: text });
      setQuery("");
      const low = text.toLowerCase();
      const rich = (low.includes("sharm") || low.includes("egypt")) && (low.includes("famil") || low.includes("3"));
      if (rich) {
        later(600, () => {
          push({ kind: "ai", html: "Perfect — you've already told me everything I need:", brief: BRIEF });
          later(900, search);
        });
      } else {
        later(600, () => askQuestion(0));
      }
    }

    function askQuestion(i) {
      setStep(i);
      push([{ kind: "ai", html: QA[i].q }, { kind: "answers", i }]);
    }

    function answer(text) {
      push({ kind: "user", html: text });
      setQuery("");
      const next = step + 1;
      if (next < QA.length) {
        later(550, () => askQuestion(next));
      } else {
        setStep(QA.length);
        later(600, () => {
          push({ kind: "ai", html: "Got it. Here's what I'm looking for:", brief: BRIEF });
          later(900, search);
        });
      }
    }

    function search() {
      setWorking(true);
      STATUS.forEach((l, i) => later(i * 900, () => setStatusTxt(l)));
      later(STATUS.length * 900 + 500, () => {
        setWorking(false); setStatusTxt("");
        push([
          { kind: "ai", note: "Jaz Mirabel Beach — full for your week", html: "One thing to know: the hotel families ask for most is <b>fully booked in August</b>. That's fine — I checked live availability and found the closest match, with the baby pool and kids club you'll want:" },
          { kind: "result" },
          { kind: "follow" },
        ]);
      });
    }

    function follow(kind) {
      if (kind === "hold") {
        push([{ kind: "user", html: "Hold it for me." },
        ]);
        later(600, () => push([
          { kind: "ai", html: "Done — <b>held free for 24 hours</b>, nothing to pay. The price is locked while you decide. When you're ready, the easiest next step is your travel agency — they confirm, take payment and look after you." },
          { kind: "follow", held: true },
        ]));
      }
      if (kind === "agency") {
        push({ kind: "user", html: "Send it to my travel agency." });
        later(700, () => push([
          { kind: "handoff" },
          { kind: "ai", html: "Sent. <b>Marco at Rossi Travel has everything</b> — your answers, the trip, the held price. You won't repeat a thing. He'll check the details and send you a full proposal, usually within the day." },
          { kind: "agency" },
        ]));
      }
    }

    function onSend() {
      const text = query.trim();
      if (!text || working) return;
      if (!started) return start(text);
      if (step >= 0 && step < QA.length) return answer(text);
      const low = text.toLowerCase();
      if (low.includes("hold")) return follow("hold");
      if (low.includes("agen") || low.includes("send")) return follow("agency");
      push({ kind: "user", html: text });
      setQuery("");
      later(550, () => push([{ kind: "ai", html: "Happy to help with that when we're booking — for now you can <b>hold the trip free for 24 hours</b> or <b>send it to your travel agency</b>, and Marco takes it from there." }, { kind: "follow" }]));
    }

    /* ---------- render ---------- */
    const dock = (
      <div className="q-dock">
        <div className="q-dock-in">
          <div className="q-inputrow">
            <input className="q-input" placeholder={started ? "Type your answer — or ask anything…" : "Describe the holiday you're imagining…"}
              value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()} disabled={working} aria-label="Message AlpiGPT" />
            <button className="q-send" disabled={working || !query.trim()} onClick={onSend} aria-label="Send"><Ki name="arrow-up-right" size={16} /></button>
          </div>
          <div className="q-dock-note">AlpiGPT answers only from Alpitour's own catalogues and live availability · hand to a human anytime.</div>
        </div>
      </div>
    );

    return (
      <div className="q-app">
        <header className="q-head">
          <div className="q-logo" onClick={() => location.reload()}>alpitour <span>· AlpiGPT</span></div>
          <div className="r">
            {started && <button onClick={() => location.reload()}>↺ Start over</button>}
            <button onClick={() => showToast("Sign in to keep your trips and preferences.")}>Accedi</button>
          </div>
        </header>

        {!started && (
          <div className="q-start" data-screen-label="Front door start">
            <div className="q-start-in">
              <div className="q-mark">✦</div>
              <h1>Raccontaci il viaggio.</h1>
              <p className="sub">Tell me the holiday you're imagining — or answer three quick questions and I'll find it for you.</p>
              <div style={{ marginTop: 22 }}>
                <div className="q-inputrow">
                  <input className="q-input" placeholder="Describe the holiday you're imagining…" value={query}
                    onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} aria-label="Describe your holiday" />
                  <button className="q-send" disabled={!query.trim()} onClick={onSend} aria-label="Send"><Ki name="arrow-up-right" size={16} /></button>
                </div>
              </div>
              <div className="q-sugg">
                {SUGG.map((s) => <button key={s} onClick={() => start(s)}>{s}</button>)}
              </div>
              <p className="q-foot-note">Answers grounded in Alpitour's own catalogues · your travel agency stays your agency.</p>
            </div>
          </div>
        )}

        {started && (
          <main className="q-chat" data-screen-label="Q&A conversation">
            {items.map((it, i) => {
              if (it.kind === "user") return <div className="q-msg user" key={i}><div className="body" dangerouslySetInnerHTML={{ __html: it.html }} /></div>;
              if (it.kind === "ai") return (
                <div className="q-msg" key={i}>
                  <span className="av">✦</span>
                  <div className="body">
                    {it.note && <div><span className="q-note"><Ki name="warning-alt" size={12} /> {it.note}</span></div>}
                    <span dangerouslySetInnerHTML={{ __html: it.html }} />
                    {it.brief && <div className="q-brief">{it.brief.map((b) => <span key={b}>{b}</span>)}</div>}
                  </div>
                </div>
              );
              if (it.kind === "answers") return (
                <div className="q-answers" key={i}>
                  {QA[it.i].opts.map((o) => <button key={o} onClick={() => answer(o)}>{o}</button>)}
                  <span className="hint">Tap one, or type your own answer below.</span>
                </div>
              );
              if (it.kind === "result") return (
                <div className="q-msg" key={i}>
                  <span className="av" style={{ visibility: "hidden" }}>✦</span>
                  <div className="body" style={{ width: "100%" }}>
                    <div className="q-card" data-screen-label="Result card">
                      <image-slot id="hotel-hero-coral" shape="rect" placeholder="Coral Bay Family Resort — photo"></image-slot>
                      <div className="b">
                        <div className="top"><h3>Coral Bay Family Resort</h3><span className="stars">★★★★</span></div>
                        <div className="sub">Sharm el-Sheikh, Egypt · all inclusive · 7 nights in August · direct flight from Rome</div>
                        <div className="why">
                          <div className="w"><Ki name="checkmark-filled" /> <span><b>Baby pool and all-day kids club</b> — made for travelling with a 2-year-old.</span></div>
                          <div className="w"><Ki name="checkmark-filled" /> <span><b>Everything included</b> — flights, meals, private transfer with baby seat, insurance.</span></div>
                          <div className="w"><Ki name="checkmark-filled" /> <span><b>Inside your budget</b> — €35 under your €3,500, nothing to add later.</span></div>
                        </div>
                        <div className="foot">
                          <span className="price">€3,465 <small>total · family of 3 · flights included</small></span>
                          <span className="verify" style={{ marginLeft: "auto" }}><span className="d"></span> Checked live with Alpitour just now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              if (it.kind === "follow") return (
                <div className="q-follow" key={i}>
                  <button className="q-btn red" onClick={() => follow("agency")}>Send to my travel agency</button>
                  {!it.held && <button className="q-btn" onClick={() => follow("hold")}>Hold it free for 24 hours</button>}
                </div>
              );
              if (it.kind === "handoff") return (
                <div className="q-msg" key={i}>
                  <span className="av" style={{ visibility: "hidden" }}>✦</span>
                  <div className="body" style={{ width: "100%" }}>
                    <div className="q-handoff" data-screen-label="Agent handoff">
                      <div className="hh"><span className="glyph">✦</span> Your concierge handed your trip to the agency's agent</div>
                      <div className="route"><span>AlpiGPT · with you</span><svg className="ki" style={{ width: 12, height: 12 }}><use href="#icon-arrow-up-right" /></svg><span className="to">EasyBook agent · Rossi Travel</span></div>
                      <div className="chips">
                        <span>Your answers</span><span>The trip you liked</span><span>Held price · 24h</span><span>Nothing re-typed</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
              if (it.kind === "agency") return (
                <div className="q-msg" key={i}>
                  <span className="av" style={{ visibility: "hidden" }}>✦</span>
                  <div className="body" style={{ width: "100%" }}>
                    <div className="q-agency" data-screen-label="Agency handoff">
                      <span className="am">R</span>
                      <div>
                        <div className="t">Rossi Travel · Marco Rossi — your travel agency</div>
                        <div className="s">Via Roma 12, Bologna · 051 123 4567. Your booking, payment and any changes stay with Marco — AlpiGPT just did the legwork.</div>
                        <div style={{ marginTop: 10 }}>
                          <a className="q-btn" style={{ fontSize: 13, padding: "9px 16px", minHeight: 0 }} href="Bianchi Proposal - Customer View.html">See the proposal Marco sends back →</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              return null;
            })}
            {working && statusTxt && <div className="q-status"><span className="av">✦</span><span className="txt">{statusTxt}</span></div>}
            <div ref={endRef} />
          </main>
        )}

        {started && dock}
        {toast && <div className="q-toast">{toast}</div>}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
