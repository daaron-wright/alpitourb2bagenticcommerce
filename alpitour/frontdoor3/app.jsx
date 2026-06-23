/* ============================================================
   AlpiGPT — Alpitour's travel concierge (clean conversational UI)
   Empty state: centered greeting + input. Conversation: one column,
   inline result card, follow-up chips, pinned input. No demo chrome.
   ============================================================ */
(function () {
  const { useState, useRef, useEffect } = React;
  const { SCENARIOS } = window.FD;
  const Ki = ({ name, size }) => <svg className="ki" style={size ? { width: size, height: size } : null}><use href={`#icon-${name}`} /></svg>;

  const SUGG = [
    { id: "puglia", t: "Somewhere warm in October — relaxed, good food, short flight" },
    { id: "sharm", t: "Family of 3 to Sharm in August, all inclusive, around €3,500" },
    { id: "maldives", t: "Maldives over New Year, overwater villa, about €4,000 each" },
  ];

  const STATUS_LINES = {
    puglia: ["Reading your request…", "Searching Alpitour, Bravo and Francorosso…", "Putting your trip together…", "Final checks…"],
    sharm: ["Reading your request…", "Checking Jaz Mirabel Beach for your dates…", "Finding family villages with a baby pool…", "Putting your trip together…"],
    maldives: ["Reading your request…", "Checking New Year availability…", "Putting your trip together…", "Final checks…"],
  };

  function detectScenario(q) {
    const s = (q || "").toLowerCase();
    if (s.includes("sharm") || s.includes("family") || s.includes("egypt") || s.includes("jaz")) return "sharm";
    if (s.includes("maldiv") || s.includes("overwater") || s.includes("honeymoon")) return "maldives";
    return "puglia";
  }

  function App() {
    const [view, setView] = useState("chat"); // chat | agencies
    const [items, setItems] = useState([]);      // {kind:'user'|'ai'|'status'|'result'|'follow', ...}
    const [working, setWorking] = useState(false);
    const [statusTxt, setStatusTxt] = useState("");
    const [query, setQuery] = useState("");
    const [agency, setAgency] = useState(null);   // scenario for modal
    const [toast, setToast] = useState(null);
    const timers = useRef([]); const toastT = useRef(null);
    const endRef = useRef(null);

    const started = items.length > 0;
    useEffect(() => { if (endRef.current) endRef.current.scrollIntoView === undefined; window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }, [items, statusTxt]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    function showToast(t) { setToast(t); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2600); }

    function ask(text, forcedId) {
      const id = forcedId || detectScenario(text);
      const sc = SCENARIOS[id];
      setItems((m) => [...m.filter((x) => x.kind !== "follow"), { kind: "user", html: text }]);
      setQuery("");
      setWorking(true);
      const lines = STATUS_LINES[id];
      lines.forEach((l, i) => timers.current.push(setTimeout(() => setStatusTxt(l), i * 850)));
      // understanding message
      timers.current.push(setTimeout(() => {
        setItems((m) => [...m, { kind: "ai", html: understandingHtml(sc), brief: [...sc.twc.details, ...sc.twc.persona] }]);
      }, 1100));
      // sold-out note
      if (sc.soldOut) {
        timers.current.push(setTimeout(() => {
          setItems((m) => [...m, { kind: "ai", note: `${sc.soldOut.hotel} — sold out for your dates`, html: "Don't worry — that's not a dead end. I'm finding family villages with the baby pool you wanted, same dates, same budget." }]);
        }, 2200));
      }
      // result
      timers.current.push(setTimeout(() => {
        setWorking(false); setStatusTxt("");
        setItems((m) => [...m,
          { kind: "ai", html: resultIntro(sc) },
          { kind: "result", sc },
          { kind: "follow", sc },
        ]);
      }, lines.length * 850 + 1250));
    }

    function understandingHtml(sc) {
      return `Here's what I'm working with — <b>${sc.twc.request.toLowerCase()}</b>. I also remember what you've loved before, so I'll lean that way:`;
    }
    function resultIntro(sc) {
      if (sc.id === "sharm") return "Found it. The closest family match to what you wanted — <b>baby pool, kids club, and your dates held</b>:";
      return "Here's the one I'd book — and exactly why it fits you:";
    }

    function followUp(kind, sc) {
      setItems((m) => m.filter((x) => x.kind !== "follow"));
      if (kind === "book") {
        setItems((m) => [...m, { kind: "user", html: "Book it." },
          { kind: "ai", html: `Wonderful. You're going — <b>${sc.result.name}</b>. Your documents arrive by email, and your booking is protected by our flexible-change policy. <br/><br/>And I don't stop here: <b>I watch your trip while you travel</b>. If a flight changes, I re-book around your whole itinerary and tell you — before you have to ask.` }]);
      }
      if (kind === "hold") {
        setItems((m) => [...m, { kind: "user", html: "Hold it for me." },
          { kind: "ai", html: `Done — held for <b>24 hours</b>, reference <b>AT-88421</b>. The price is locked while you decide. Want me to send the full proposal to your email, or to your travel agency?` },
          { kind: "follow", sc, alt: true }]);
      }
      if (kind === "agency") setAgency(sc);
    }

    function confirmAgency(sc) {
      setAgency(null);
      setItems((m) => [...m.filter((x) => x.kind !== "follow"),
        { kind: "user", html: "Send it to my travel agency." },
        { kind: "ai", html: `Done — <b>your agency has it</b>. Everything we discussed travels with it: your dates, your preferences, the trip you liked. They'll pick up exactly where we stopped — you won't repeat a thing.` }]);
    }

    /* ---------- input ---------- */
    const input = (dock) => (
      <div className={dock ? "g-dock" : "g-inputwrap"}>
        <div className={dock ? "g-dock-in" : ""} style={dock ? null : {}}>
          <div style={{ position: "relative" }}>
            <input className="g-input" placeholder={started ? "Ask anything about your trip…" : "Describe the holiday you're imagining…"}
              value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && query.trim() && !working) ask(query.trim()); }} disabled={working} />
            <button className="g-send" disabled={working || !query.trim()} onClick={() => ask(query.trim())} title="Send">
              <Ki name="arrow-up-right" size={16} />
            </button>
          </div>
          {dock && <div className="g-dock-note">AlpiGPT answers from Alpitour's own catalogues — Alpitour, Bravo and Francorosso.</div>}
        </div>
      </div>
    );

    return (
      <div className="g-app">
        <header className="g-head">
          <div className="g-head-in">
            <div className="g-logo" onClick={() => location.reload()}>alpitour<span> · AlpiGPT</span></div>
            <nav className="g-nav">
              <button className={view === "chat" ? "on" : ""} onClick={() => setView("chat")}>For travelers</button>
              <button className={view === "agencies" ? "on" : ""} onClick={() => setView("agencies")}>For agencies</button>
            </nav>
            <div className="g-head-r">
              <button className="g-signin" onClick={() => showToast("Sign in to keep your trips and preferences.")}>Accedi</button>
            </div>
          </div>
        </header>

        {view === "agencies" && <AgencyFlow showToast={showToast} />}

        {view === "chat" && !started && (
          <div className="g-center">
            <div className="g-center-in">
              <div className="g-mark">✦</div>
              <h1>Raccontaci il viaggio.</h1>
              <p className="sub">Describe the holiday you're imagining — I'll put it together for you.</p>
              {input(false)}
              <div className="g-sugg">
                {SUGG.map((s) => <button key={s.id} onClick={() => ask(s.t, s.id)}>{s.t}</button>)}
              </div>
              <p className="g-foot-note">Answers grounded in Alpitour's own catalogues · hand to a human anytime</p>
            </div>
          </div>
        )}

        {view === "chat" && started && (
          <main className="g-chat">
            {items.map((it, i) => {
              if (it.kind === "user") return (
                <div className="g-msg user" key={i}><div className="body" dangerouslySetInnerHTML={{ __html: it.html }} /></div>
              );
              if (it.kind === "ai") return (
                <div className="g-msg" key={i}>
                  <span className="av">✦</span>
                  <div className="body">
                    {it.note && <div><span className="g-note"><Ki name="warning-alt" size={12} /> {it.note}</span></div>}
                    <span dangerouslySetInnerHTML={{ __html: it.html }} />
                    {it.brief && <div className="g-brief">{it.brief.map((b, j) => <span key={b} className={`g-bchip ${j >= it.brief.length - 3 ? "warm" : ""}`}>{b}</span>)}</div>}
                  </div>
                </div>
              );
              if (it.kind === "result") {
                const r = it.sc.result;
                return (
                  <div className="g-msg" key={i}>
                    <span className="av" style={{ visibility: "hidden" }}>✦</span>
                    <div className="body">
                      <div className="g-card">
                        <div className="g-card-img">
                          <span className={`g-brand ${r.brand}`}>{r.brandName}</span>
                          <image-slot id={`g-${it.sc.id}`} shape="rect" placeholder="Destination photo" style={{ width: "100%", height: 180 }}></image-slot>
                        </div>
                        <div className="g-card-b">
                          <div className="g-card-top"><h3>{r.name}</h3><span className="g-match">{r.match}% match</span></div>
                          <div className="g-card-sub">{r.sub}</div>
                          <div className="g-why">
                            {r.why.map(([a, b]) => <div className="w" key={a}><Ki name="checkmark-filled" size={13} /><span><b>{a}</b> · {b}</span></div>)}
                          </div>
                          <div className="g-segs">
                            {r.segs.map(([ic, t]) => <span className="g-seg" key={t}><Ki name={ic} size={12} /> {t}</span>)}
                          </div>
                          <div className="g-card-foot">
                            <span className="g-price">€{r.price.toLocaleString()} <small>{it.sc.id === "sharm" ? "family of 3" : "per person"}</small></span>
                            <div className="g-card-acts">
                              <button className="g-btn" onClick={() => followUp("hold", it.sc)}>Hold 24h</button>
                              <button className="g-btn red" onClick={() => followUp("book", it.sc)}>Book</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              if (it.kind === "follow") return (
                <div className="g-follow" key={i}>
                  {!it.alt && <button onClick={() => followUp("book", it.sc)}>Book it</button>}
                  {!it.alt && <button onClick={() => followUp("hold", it.sc)}>Hold it for 24 hours</button>}
                  {it.alt && <button onClick={() => { setItems((m) => m.filter((x) => x.kind !== "follow")); showToast("Proposal sent to your email."); }}>Email me the proposal</button>}
                  <button onClick={() => followUp("agency", it.sc)}>Send to my travel agency</button>
                </div>
              );
              return null;
            })}
            {working && statusTxt && (
              <div className="g-status"><span className="av">✦</span><span className="txt">{statusTxt}</span></div>
            )}
            <div ref={endRef} />
          </main>
        )}

        {view === "chat" && started && input(true)}

        {agency && (
          <div className="g-scrim" onClick={(e) => { if (e.target === e.currentTarget) setAgency(null); }}>
            <div className="g-modal">
              <h3>Send to your travel agency</h3>
              <p className="sub">Everything we discussed goes with it — your agent picks up exactly where we stopped. You won't repeat a thing.</p>
              <div className="box">
                <div className="r"><span>Your trip</span><span>{agency.result.brandName} · {agency.result.name}</span></div>
                <div className="r"><span>Price</span><span>€{agency.result.price.toLocaleString()}</span></div>
                <div className="r"><span>Your agency</span><span>Rossi Travel · Torino</span></div>
              </div>
              <div className="g-modal-foot">
                <button className="g-btn" onClick={() => setAgency(null)}>Cancel</button>
                <button className="g-btn red" onClick={() => confirmAgency(agency)}>Send</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="g-toast">{toast}</div>}
      </div>
    );
  }

  /* ============ For agencies · a dedicated working flow ============
     The blueprint journey from the agent's seat: request arrives with
     context → sold-out recovery → priced proposal with commission →
     hold & send → next best actions. Connected systems shown per step. */
  function AgencyFlow({ showToast }) {
    const [open, setOpen] = useState(null);    // worklist item id
    const [step, setStep] = useState("context"); // context | alts | proposal | done
    const [adds, setAdds] = useState(["transfer"]);

    const WL = [
      { id: "bianchi", t: "Famiglia Bianchi · Sharm el-Sheikh", m: "2 adults + 1 child (2y) · 12–19 Aug · ≤ €3,500 · all inclusive", src: "From Alpitour.it — full trip context attached", badge: "handoff", bl: "Handoff" },
      { id: "conti", t: "Sig.ra Conti · Greek islands", m: "1 adult · September · boutique", src: "Email · this morning", badge: "new", bl: "New" },
      { id: "greco", t: "Gruppo Greco · ski week", m: "12 pax · hotel price changed", src: "Price alert · needs review", badge: "update", bl: "Update" },
    ];
    const OPTS = [
      { id: "coral", n: "Coral Bay Family Resort", why: "Baby pool + kids club — the customer's detected preference · closest match", p: 3250, best: true },
      { id: "redsea", n: "Red Sea Palm Village", why: "Best value · strong family facilities · €400 under budget", p: 3100 },
      { id: "sinai", n: "Sinai Blue Lagoon Resort", why: "Premium · water park nearby · family suite", p: 3580 },
    ];
    const ADDS = [
      { id: "transfer", t: "Private airport transfer — baby seat included", p: 120 },
      { id: "insurance", t: "Family travel insurance", p: 95 },
    ];
    const addSum = ADDS.filter((a) => adds.includes(a.id)).reduce((x, a) => x + a.p, 0);
    const total = 3250 + addSum;
    const commission = Math.round(total * 0.12);

    function pick(id) {
      if (id !== "bianchi") { showToast("Open Famiglia Bianchi to follow the guided flow."); return; }
      setOpen(id); setStep("context");
    }

    const Conn = ({ items }) => (
      <div className="a-conn"><span className="lbl">Connected</span>{items.map((i) => <span key={i}>{i}</span>)}</div>
    );

    return (
      <div className="a-wrap">
        <div className="a-intro">
          <h1>Your worklist, already understood.</h1>
          <p className="sub">Requests arrive with the customer's full context — whether they spoke to AlpiGPT on Alpitour.it, emailed, or called. You pick up where they stopped: search, price, propose, hold and change, all in one place.</p>
        </div>
        <div className="a-grid">
          {/* worklist rail */}
          <div className="a-rail">
            <div className="a-rail-h">Incoming · today</div>
            {WL.map((w) => (
              <button key={w.id} className={"a-item " + (open === w.id ? "on" : "")} onClick={() => pick(w.id)}>
                <div className="top"><span className="t">{w.t}</span><span className={"a-badge " + w.badge}>{w.bl}</span></div>
                <div className="m">{w.m}</div>
                <div className="src"><Ki name={w.badge === "handoff" ? "chat-bot" : w.badge === "update" ? "warning-alt" : "document-chart"} size={12} /> {w.src}</div>
              </button>
            ))}
            <div className="a-foot">
              <Conn items={["EasyBook", "CRM", "Live inventory", "Pricing & commissions", "Booking & PNR", "Notifications"]} />
            </div>
          </div>

          {/* work area */}
          <div className="a-work">
            {!open && (
              <div className="a-card" style={{ textAlign: "center", padding: "44px 24px", color: "var(--fg-muted)", fontSize: 13.5 }}>
                Open a request to start — <b style={{ color: "var(--fg-1)" }}>Famiglia Bianchi</b> just arrived from Alpitour.it with their trip context attached.
              </div>
            )}

            {open && step === "context" && (
              <>
                <div className="a-step"><b>1 · The request</b> arrived with full context — nothing to re-ask</div>
                <div className="a-card">
                  <dl className="a-kv">
                    <dt>Party</dt><dd>2 adults + 1 child (age 2)</dd>
                    <dt>Dates</dt><dd>12–19 August · 7 nights</dd>
                    <dt>Board</dt><dd>All inclusive · from Rome</dd>
                    <dt>Budget</dt><dd>≤ €3,500</dd>
                    <dt>Preferred hotel</dt><dd>Jaz Mirabel Beach</dd>
                    <dt>What matters</dt><dd><div className="g-brief" style={{ marginTop: 0 }}><span className="g-bchip warm">baby pool</span><span className="g-bchip warm">kids club</span><span className="g-bchip warm">family-friendly</span></div></dd>
                  </dl>
                  <div className="a-comm"><span>Your terms — applied automatically</span><b>Gold partner · 12% commission</b></div>
                </div>
                <div className="a-alert">
                  <Ki name="warning-alt" size={17} />
                  <div><div className="t">Jaz Mirabel Beach — sold out for these dates</div><div className="s">Alternatives are already ranked on the family's needs, availability and budget.</div></div>
                  <button className="g-btn red" onClick={() => setStep("alts")}>See alternatives</button>
                </div>
                <Conn items={["Live inventory", "Neos allotments", "Customer context"]} />
              </>
            )}

            {open && step === "alts" && (
              <>
                <div className="a-step"><b>2 · Recovery</b> — ranked on the customer's needs, with your commission visible</div>
                {OPTS.map((o, i) => (
                  <div key={o.id} className={"a-opt " + (o.best ? "best" : "")} style={{ animationDelay: (i * 0.07) + "s" }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="nm">{o.n} {o.best && <span className="g-match" style={{ marginLeft: 6 }}>Best match</span>}</div>
                      <div className="why">{o.why}</div>
                    </div>
                    <div className="pr"><div className="p">€{o.p.toLocaleString()}</div><div className="c">your commission €{Math.round(o.p * 0.12)}</div></div>
                    <button className={"g-btn " + (o.best ? "red" : "")} onClick={() => { if (o.id === "coral") setStep("proposal"); else showToast("For the guided flow, select the best match."); }}>Select</button>
                  </div>
                ))}
                <Conn items={["Live inventory", "Brand catalogues", "Pricing & commissions"]} />
              </>
            )}

            {open && step === "proposal" && (
              <>
                <div className="a-step"><b>3 · The proposal</b> — assembled and priced, ready for your client</div>
                <div className="a-card">
                  <div className="a-seg"><Ki name="arrow-up-right" size={15} /> <span>Flight · Neos — Rome → Sharm, direct</span><span className="p" style={{ fontWeight: 400, color: "var(--fg-muted)" }}>included</span></div>
                  <div className="a-seg"><Ki name="dashboard" size={15} /> <span>Coral Bay Family Resort · 7 nights · all inclusive</span><span className="p">€3,250</span></div>
                  {ADDS.map((a) => {
                    const sel = adds.includes(a.id);
                    return (
                      <div key={a.id} className={"a-add " + (sel ? "sel" : "")} onClick={() => setAdds((x) => sel ? x.filter((i) => i !== a.id) : [...x, a.id])}>
                        <span className="ck">{sel ? "✓" : ""}</span> {a.t} <span className="p">+€{a.p}</span>
                      </div>
                    );
                  })}
                  <div className="a-totals">
                    <div className="r"><span>Client price</span><span>€{total.toLocaleString()}</span></div>
                    <div className="r"><span>Your commission · 12%</span><span style={{ color: "var(--k-spruce-70)", fontWeight: 600 }}>€{commission.toLocaleString()}</span></div>
                    <div className="r grand"><span>Total</span><b>€{total.toLocaleString()}</b></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                    <button className="g-btn" onClick={() => setStep("alts")}>Back</button>
                    <button className="g-btn red" onClick={() => setStep("done")}>Hold 24h & send to client</button>
                  </div>
                </div>
                <Conn items={["Pricing & commissions", "Booking platform", "Brand templates"]} />
              </>
            )}

            {open && step === "done" && (
              <>
                <div className="a-step"><b>4 · On hold</b> — sent to your client, price locked, every change self-service</div>
                <div className="a-card">
                  <div className="a-hold"><span className="ref">AT-88421</span><span className="a-badge update" style={{ alignSelf: "center" }}>On hold · 24h</span><span style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontSize: 19 }}>€{total.toLocaleString()}</span></div>
                  <p style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 10, lineHeight: 1.5 }}>Proposal sent to Famiglia Bianchi. If they change their mind — dates, hotel, services — you change it here: re-priced instantly, every version kept, <b>no support ticket</b>.</p>
                </div>
                <div className="a-step" style={{ marginTop: 6 }}>While it's on hold</div>
                <div className="a-nba">
                  <button onClick={() => showToast("Reminder set — 48 hours before the hold expires.")}><Ki name="information" size={15} /><div className="t">Set a follow-up reminder</div><div className="s">Nudge before the 24h hold expires</div></button>
                  <button onClick={() => showToast("Water park day pass added to the proposal · +€160.")}><Ki name="lightbulb" size={15} /><div className="t">Suggest the water park pass</div><div className="s">Fits the family · +€160 · adds €19 commission</div></button>
                  <button onClick={() => showToast("Preference saved — future proposals start from it.")}><Ki name="group" size={15} /><div className="t">Save the family's preferences</div><div className="s">Baby pool · kids club — for next time</div></button>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="g-btn" onClick={() => { setOpen(null); setStep("context"); }}>← Back to worklist</button>
                </div>
                <Conn items={["Booking & PNR", "Notifications", "CRM"]} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
