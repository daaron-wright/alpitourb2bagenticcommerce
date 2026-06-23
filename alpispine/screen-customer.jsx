/* ============================================================
   Customer FE — the Alpitour front door (slate utility bar,
   brand header, AlpiGPT search) with AlpiGPT as a slide-in
   assist that walks the agency through plain-language
   intent → a decision → a tracked hold. Chat flow unchanged.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Badge, WhyChip, AiSpinner } = UI;
  const check = <Stroke size={11} sw={3.2} children={<polyline points="20 6 9 17 4 12" />} />;

  /* ---------- Alpitour front-door chrome ---------- */
  const NAV = ["DESTINATIONS", "HOLIDAYS", "BRANDS", "SUPPORT"];

  function DowUtilityBar({ setLens, cartCount }) {
    const { RecordPill, LensToggle } = UI;
    const [bump, setBump] = React.useState(false);
    const first = React.useRef(true);
    React.useEffect(() => {
      if (first.current) { first.current = false; return; }
      setBump(true); const t = setTimeout(() => setBump(false), 450);
      return () => clearTimeout(t);
    }, [cartCount]);
    return (
      <div className="dow-util">
        <div className="dow-util-in">
          <div className="dow-util-l">
            <RecordPill dark />
            <span className="dow-util-title">{window.D.event.title}</span>
          </div>
          <div className="dow-util-r">
            <span className="dui"><Icon name="information" size={12} /> English <Stroke size={9} d="M6 9l6 6 6-6" /></span>
            <span className="dui"><Icon name="arrow-up-right" size={12} /> Italy</span>
            <span className="dui"><Icon name="document-chart" size={12} /> Cart <span className="dow-cartn" style={bump ? { animation: "cart-bump .45s ease" } : null}>{cartCount}</span></span>
            <span className="dui"><Icon name="user" size={12} /> My Account <Stroke size={9} d="M6 9l6 6 6-6" /></span>
            <span className="dow-util-sep">|</span>
            <LensToggle lens="cx" setLens={setLens} dark />
          </div>
        </div>
      </div>
    );
  }

  function DowHeader({ onAsk, onHome, query, setQuery, onSearch }) {
    return (
      <header className="dow-head">
        <div className="dow-head-in">
          <img className="dow-logo" src="assets/alpitour-logo.png" alt="Alpitour" onClick={onHome} style={{ cursor: "pointer" }} />
          <nav className="dow-nav">
            {NAV.map(n => <button className="dow-navi" key={n}>{n} <Stroke size={9} d="M6 9l6 6 6-6" /></button>)}
          </nav>
          <div className="dow-search">
            <input placeholder="Where do you want to go?" value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && query.trim()) onSearch(query.trim()); }} />
            <button className="dow-ai-pill" onClick={onAsk}><span className="dow-spark">✦</span> AlpiGPT Beta</button>
            <button className="dow-search-btn" onClick={() => query.trim() ? onSearch(query.trim()) : onAsk()} aria-label="Search"><Stroke size={17} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></button>
          </div>
        </div>
      </header>
    );
  }

  function DowFooter() {
    const cols = [
      { t: "RESOURCES", items: ["Contact Us", "Find an Agency"] },
      { t: "EXPERIENCES", items: ["News", "Catalogues"] },
      { t: "CORPORATE", items: ["About Alpitour World", "Careers", "Investors", "Neos"] },
      { t: "LEGAL", items: ["Privacy Statement", "Terms of Use", "Accessibility Statement", "Package Travel Directive"] },
    ];
    return (
      <footer className="dow-foot">
        <div className="dow-foot-in">
          <div className="dow-foot-brand">
            <img className="dow-logo" src="assets/alpitour-logo.png" alt="Alpitour" />
            <span className="dow-seek">You deserve the World<sup>™</sup></span>
          </div>
          {cols.map(c => (
            <div className="dow-foot-col" key={c.t}>
              <div className="dfc-t">{c.t}</div>
              {c.items.map(i => <div className="dfc-i" key={i}>{i}</div>)}
            </div>
          ))}
        </div>
        <div className="dow-foot-bar">
          <div className="dow-foot-bar-in">
            <span>© 1947–2026, Alpitour S.p.A.</span>
            <span>®™ Trademark of Alpitour World or an affiliated brand</span>
          </div>
        </div>
      </footer>
    );
  }

  /* ---------- Storefront body — Jaz Mirabel package page context ---------- */
  const PRODUCT_TABS = [
    { id: "overview", label: "OVERVIEW", icon: "information" },
    { id: "properties", label: "AMENITIES", icon: "document-chart" },
    { id: "technical", label: "TRAVEL DOCUMENTS", icon: "document-chart" },
    { id: "sample", label: "HOLD OPTIONS", icon: "recommend" },
    { id: "buying", label: "BOOKING OPTIONS", icon: "network" },
  ];

  function PropertiesTab() {
    const rows = [["Baby pool", "Shaded lagoon · 40 cm", "0–4 yrs", "fact sheet"], ["Kids' club", "BravoClub · Italian-speaking staff", "3–12 yrs", "fact sheet"], ["Family rooms", "Pool-side block · cot + high chair", "—", "fact sheet"], ["Beach", "Private sandy bay · gentle slope", "all", "fact sheet"], ["Board", "All inclusive · baby corner", "all", "contract"], ["Entertainment", "Daytime + evening · family shows", "all", "fact sheet"], ["Transfer", "25 min from SSH airport", "—", "contract"]];
    return (
      <table className="dow-proptbl">
        <thead><tr><th>Amenity</th><th>Detail</th><th>Ages</th><th>Source</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><td className="pt-name">{r[0]}</td><td className="pt-val">{r[1]}</td><td>{r[2]}</td><td className="pt-method">{r[3]}</td></tr>)}</tbody>
      </table>
    );
  }

  function TechnicalTab({ onAsk }) {
    const docs = [["Resort Fact Sheet (FCT)", "PDF · 240 KB", "IT / EN"], ["Entry-Rules Bundle — Egypt (ENT)", "PDF · 180 KB", "IT / EN"], ["Package Travel Info Sheet (PTD)", "PDF · 1.2 MB", "IT"], ["Insurance & Cancellation Terms", "PDF · 96 KB", "IT / EN"]];
    return (
      <div className="dow-docs">
        {docs.map((d, i) => (
          <div className="dow-doc" key={i}>
            <span className="dd-ic"><Icon name="document-chart" size={16} /></span>
            <span className="dd-main"><span className="dd-t">{d[0]}</span><span className="dd-m">{d[1]} · {d[2]}</span></span>
            <button className="dd-ask" onClick={onAsk}><span className="dow-spark">✦</span> Summarize</button>
            <button className="dd-dl" aria-label="Download"><Stroke size={15} d="M12 3v12M7 11l5 5 5-5M5 20h14" /></button>
          </div>
        ))}
      </div>
    );
  }

  function SampleTab({ onCart, onAsk }) {
    const packs = [["72-h hold", "Free option · family room", "Guaranteed block · available"], ["7-day option", "Deposit option", "Subject to yield desk"], ["Group block", "9+ travellers", "Quote required"]];
    return (
      <div>
        <div className="dow-packs">
          {packs.map((p, i) => (
            <div className="dow-pack" key={i}>
              <div className="dp-sz">{p[0]}</div>
              <div className="dp-l">{p[1]}</div>
              <div className="dp-avail">{p[2]}</div>
              <button className="dow-btn red sm" onClick={() => onCart(p[0])}>Add to hold cart</button>
            </div>
          ))}
        </div>
        <div className="dow-airow" onClick={onAsk} style={{ marginTop: 18 }}>
          <div className="dow-airow-l">
            <span className="dow-airow-pill"><span className="dow-spark">✦</span> Faster with AI</span>
            <div className="dow-airow-h">Let AlpiGPT hold the right room for you.</div>
            <div className="dow-airow-s">It checks the live allotment, clears entry rules and policy, and sets the rooming list — no cart, no forms.</div>
          </div>
          <button className="dow-btn red" onClick={onAsk}><span className="dow-spark">✦</span> Hold via AlpiGPT</button>
        </div>
      </div>
    );
  }

  function BuyingTab() {
    return (
      <div className="dow-buying">
        <div className="dow-side-card" style={{ maxWidth: 520 }}>
          <div className="dsc-h">Net rates need an agency login.</div>
          <div className="dsc-b">Contact us for information about your agency account, or find a Welcome Travel agency in your region.</div>
          <div className="dow-cta-row" style={{ marginTop: 12 }}>
            <button className="dow-btn red sm">NET RATES</button>
            <button className="dow-btn red sm">HOW TO BOOK</button>
            <button className="dow-btn ghost sm">Find an Agency</button>
          </div>
        </div>
        <div className="dow-learnrow">Learn more about Alpitour's <a>net rates</a> and <a>booking processes</a>.</div>
      </div>
    );
  }

  function Storefront({ onAsk, onCart }) {
    const [tab, setTab] = React.useState("overview");
    return (
      <div className="dow-page">
        <div className="dow-crumbs">Holidays <span>›</span> Egypt · Sharm el-Sheikh <span>›</span> <b>Bravo</b></div>
        <div className="dow-prod-head">
          <h1>Jaz Mirabel Beach · Bravo All-Inclusive <span className="dow-star">☆</span></h1>
          <div className="dow-quick">
            {["Fact sheet / Entry rules", "Find an Agency", "Contact Us", "Package Travel rights"].map(q => (
              <span className="dqi" key={q}><Icon name="document-chart" size={13} /> {q}</span>
            ))}
          </div>
        </div>

        <div className="dow-tabs">
          {PRODUCT_TABS.map(t => (
            <button key={t.id} className={`dow-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={15} /><span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="dow-prod-body">
          <div className="dow-prod-main">
            {tab === "overview" && (
              <React.Fragment>
                <div className="dow-airow" onClick={onAsk}>
                  <div className="dow-airow-l">
                    <span className="dow-airow-pill"><span className="dow-spark">✦</span> AI Ready Beta</span>
                    <div className="dow-airow-h">Not sure this is the right resort? Ask AlpiGPT.</div>
                    <div className="dow-airow-s">Describe the family and AlpiGPT selects, checks allotments &amp; entry rules, and sets up your hold — no forms.</div>
                  </div>
                  <button className="dow-btn red" onClick={onAsk}><span className="dow-spark">✦</span> Ask AlpiGPT</button>
                </div>
                <div className="dow-prose">
                  <p>The Bravo flagship on Nabq Bay — a shallow private lagoon, a shaded baby pool, BravoClub with Italian-speaking staff, and family rooms a step from the water. All inclusive, with Neos direct flights from Bologna, Milan and Verona through the summer programme.</p>
                  <div className="dow-specs">
                    {[["Rating", "4.6 / 5"], ["Board", "All inclusive"], ["Nights", "7 · Sat–Sat"], ["Rooms", "Family · pool-side"]].map(([k, v]) => (
                      <div className="dow-spec" key={k}><span className="dsk">{k}</span><span className="dsv">{v}</span></div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            )}
            {tab === "properties" && <PropertiesTab />}
            {tab === "technical" && <TechnicalTab onAsk={onAsk} />}
            {tab === "sample" && <SampleTab onCart={onCart} onAsk={onAsk} />}
            {tab === "buying" && <BuyingTab />}

            <div className="dow-cta-row">
              <button className="dow-btn red" onClick={() => onCart("72-h hold")}><Icon name="document-chart" size={15} /> Hold &amp; Book</button>
              <button className="dow-btn ghost" onClick={() => setTab("technical")}>Documents</button>
              <button className="dow-btn ghost">☆ Favorite</button>
            </div>
          </div>

          <aside className="dow-prod-side">
            <div className="dow-side-card">
              <div className="dsc-h">Net rates need an agency login.</div>
              <div className="dsc-b">Contact us about your agency account, or find a Welcome Travel agency.</div>
              <div className="dow-cta-row" style={{ marginTop: 12 }}>
                <button className="dow-btn red sm">NET RATES</button>
                <button className="dow-btn red sm">HOW TO BOOK</button>
              </div>
            </div>
            <div className="dow-side-ai" onClick={onAsk}>
              <span className="ai-glyph" style={{ width: 16, height: 16 }} />
              <div>
                <div className="dsa-h">AlpiGPT can book for you</div>
                <div className="dsa-s">It reads your brief, clears policy, and places the hold.</div>
              </div>
              <Stroke size={15} d="M5 12h14M13 6l6 6-6 6" />
            </div>
          </aside>
        </div>

        {/* How AlpiGPT recommends — the recommendation decision graph */}
        <UI.RecommendationGraph />
      </div>
    );
  }

  /* ---------- AI search results (generated answer + filtered list) ---------- */
  function SearchResults({ query, onBack, onAsk, onCart }) {
    const facets = [["Beach & family", 124], ["Just for two", 27], ["Signature journeys", 9], ["Adventure", 9], ["Wellness", 9]];
    const results = [
      { n: "Jaz Mirabel Beach · Bravo", d: "All-inclusive family flagship on Nabq Bay — shaded baby pool, BravoClub kids' club, family rooms by the lagoon." },
      { n: "Coral Bay Family Resort · Bravo", d: "BravoClub resort with a strong kids' club and family rooms — solid availability across the summer programme." },
      { n: "Crete last minute · Eden Viaggi", d: "Flexible departures with soft sloping sand and a gentle seabed — the budget-friendly family alternative." },
    ];
    return (
      <div className="dow-page">
        <div className="dow-srbar">
          <span className="dow-srcount">Results 1–{results.length} of 270</span>
          <button className="dow-srback" onClick={onBack}>← Back to product</button>
        </div>
        <div className="dow-srtabs">{["ALL", "DESTINATIONS", "HOLIDAYS", "BRANDS", "SUPPORT"].map((t, i) => <span key={t} className={`dow-srtab ${i === 0 ? "on" : ""}`}>{t}</span>)}</div>
        <div className="dow-srgrid">
          <aside className="dow-srfacets">
            <div className="dsf-h">Holiday type</div>
            {facets.map((f, i) => <div className="dsf-row" key={i}><span>{f[0]}</span><span className="dsf-n">{f[1]}</span></div>)}
          </aside>
          <div className="dow-srmain">
            <div className="dow-genanswer">
              <div className="dga-top"><span className="dow-airow-pill"><span className="dow-spark">✦</span> Generated answer · Beta</span></div>
              <div className="dga-h">Family resorts · Sharm el-Sheikh</div>
              <div className="dga-b">Bravo all-inclusive resorts in Sharm el-Sheikh are built for families — shallow lagoons, shaded baby pools and Italian-speaking kids' clubs. For a toddler-first brief, <b>Jaz Mirabel Beach</b> leads on the baby-pool setup while staying inside a €3,500 family budget.</div>
              <div className="dga-foot">
                <button className="dow-btn red sm" onClick={onAsk}><span className="dow-spark">✦</span> Refine with AlpiGPT</button>
                <span className="dga-dis">AI-generated · may be incomplete. Review Alpitour's Data Privacy Notice & Terms.</span>
              </div>
            </div>
            {results.map((r, i) => (
              <div className="dow-srcard" key={i}>
                <div className="dsc-row">
                  <span className="dsr-doc"><Icon name="document-chart" size={15} /></span>
                  <div style={{ flex: 1 }}>
                    <div className="dsr-n">{r.n}</div>
                    <div className="dsr-d">{r.d}</div>
                  </div>
                </div>
                <div className="dsr-foot">
                  <button className="dow-btn red sm" onClick={() => onCart("72-h hold")}>Hold &amp; Book</button>
                  <button className="dow-btn ghost sm">Documents</button>
                  <span className="dsr-fav">☆ Favorite</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Hold Cart — 3-step flow ---------- */
  const CART_STEPS = ["Hold Cart", "Hold Request", "Hold Confirmation"];
  function SampleCart({ open, onClose, toast, onAsk }) {
    const [step, setStep] = React.useState(0);
    React.useEffect(() => { if (open) setStep(0); }, [open]);
    if (!open) return null;
    return (
      <div className="dow-cart-scrim" onClick={onClose}>
        <div className="dow-cart" onClick={e => e.stopPropagation()}>
          <div className="dow-cart-head">
            <h2>Hold Cart</h2>
            <button className="ca-x" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
          </div>
          <div className="dow-cart-sub">Hold requests may carry a deposit after 72 hours. Your Alpitour contact will discuss with you if applicable.</div>
          <div className="dow-stepper">
            {CART_STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`dow-stepn ${i <= step ? "on" : ""}`}><span className="dsn-dot">{i < step ? "✓" : i + 1}</span><span className="dsn-l">{s}</span></div>
                {i < CART_STEPS.length - 1 && <span className={`dow-stepline ${i < step ? "on" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="dow-cart-body">
            {step === 0 && (
              <div className="dow-cart-item">
                <div className="dci-top"><Icon name="document-chart" size={14} /> <b>Jaz Mirabel Beach · Bravo</b> <span className="dci-tp">Package No. 000000031881</span></div>
                <div className="dci-grid">
                  {[["Departure", "Bologna · 14 Aug"], ["Party", "2 adults + 1 child (2)"], ["Board", "All inclusive"], ["Room", "Family · 72-h hold"]].map(([k, v]) => (
                    <div className="dci-kv" key={k}><span className="dci-k">{k}</span><span className="dci-v">{v}</span></div>
                  ))}
                </div>
                <div className="dci-note"><Icon name="information" size={12} /> Peak-season holds release automatically at expiry. Holds are available to verified agencies only.</div>
              </div>
            )}
            {step === 1 && (
              <div className="dow-form">
                {[["First Name", "Giulia"], ["Last Name", "Rossi"], ["Phone", "051 123 4567"], ["Agency Name", "Rossi Travel"]].map(([l, v]) => (
                  <label className="dow-field" key={l}><span>{l}*</span><input defaultValue={v} /></label>
                ))}
                <label className="dow-field"><span>Departure airport*</span><select defaultValue="Bologna (BLQ)"><option>Bologna (BLQ)</option><option>Milan (MXP)</option><option>Verona (VRN)</option></select></label>
                <label className="dow-field"><span>Priority*</span><select defaultValue="Standard"><option>Standard</option><option>Rush</option></select></label>
              </div>
            )}
            {step === 2 && (
              <div className="dow-cart-confirm">
                <span className="dccf-ic"><Icon name="checkmark-filled" size={26} /></span>
                <div className="dccf-h">Thank you — your hold request is in.</div>
                <div className="dccf-b">We've received your hold request for Jaz Mirabel Beach. A confirmation has been sent to giulia@rossitravel.it. Request <b>P-2026-20418</b>.</div>
                <div className="dccf-ai" onClick={onAsk}><span className="ai-glyph" style={{ width: 14, height: 14 }} /> Next time, let AlpiGPT do this in one line — and track it live.</div>
              </div>
            )}
          </div>

          <div className="dow-cart-foot">
            {step < 2 ? (
              <React.Fragment>
                <button className="dow-btn ghost" onClick={step === 0 ? onClose : () => setStep(step - 1)}>{step === 0 ? "Cancel" : "Back"}</button>
                <button className="dow-btn red" onClick={() => setStep(step + 1)}>{step === 0 ? "Continue" : "Submit request"}</button>
              </React.Fragment>
            ) : (
              <button className="dow-btn red" onClick={() => { toast("Hold request P-2026-20418 confirmed."); onClose(); }}>Finish</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- AlpiGPT flow (unchanged behavior) ---------- */
  function ParsedChips({ items }) {
    return (
      <div className="cx2-parsed">
        {items.map((p, i) => (
          <span className="cx2-pchip" key={i}><span className="pk">{p.k}</span><span className="pv">{p.v}</span></span>
        ))}
      </div>
    );
  }

  function Thinking({ steps, done }) {
    return (
      <div className="cx2-think fade-in">
        <div className="th-head">
          {done ? <span className="ai-glyph" /> : <AiSpinner size={16} />}
          <span className="tt">{done ? "Worked your brief through the spine" : "Working your brief through the spine…"}</span>
          <span className="tm">KAF · 4 agents</span>
        </div>
        {steps.map((s, i) => {
          const running = !done && i === steps.length - 1;
          return (
            <div className={`cx2-thinkrow ${running ? "run" : ""}`} key={i}>
              <span className="tr-mark" style={running ? { background: "transparent" } : null}>{running ? <AiSpinner size={16} /> : check}</span>
              <span><span className="tr-l">{s.label}</span><div className="tr-s">{s.sub}</div></span>
              <span className="tr-ts">{s.ts}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function DecisionCard({ d, onRequest, toast }) {
    return (
      <div className="cx2-decision fade-in">
        <div className="cx2-dec-top">
          <span className="cx2-dec-tag"><span className="ai-glyph" style={{ width: 12, height: 12 }} /> Recommended for you</span>
          <div className="cx2-dec-name">{d.product}</div>
          <div className="cx2-dec-fam">{d.family}</div>
          <div className="cx2-dec-fitbar">
            <span className="cx2-dec-fit">{d.fit}</span>
            <span className="cx2-dec-conf">
              <span className="cbar"><div style={{ width: `${d.confidence}%` }} /></span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
                <span className="cv">{d.confidence}%</span><span className="cl">confidence</span>
              </span>
            </span>
          </div>
        </div>

        <div className="cx2-dec-reasons">
          {d.reasons.map((r, i) => (
            <div className="cx2-reason" key={i}><span className="rk">{check}</span><span>{r}</span></div>
          ))}
        </div>

        <div className="cx2-dec-grid">
          <div className="cx2-predict">
            <div className="pl"><Icon name="information" size={12} /> Hold</div>
            <div className="pv">{d.sampleReady}</div>
            <div className="pn">{d.sampleReadyNote}</div>
          </div>
          <div className="cx2-predict">
            <div className="pl"><Icon name="arrow-up-right" size={12} /> Departure</div>
            <div className="pv">{d.delivery}</div>
            <div className="pn">{d.deliveryNote}</div>
          </div>
        </div>

        <div className="cx2-dec-pac">
          <span className="pac-ic">{check}</span>
          <span className="pac-tx"><b>Policy cleared inline.</b> {d.pacNote}</span>
          <WhyChip why={{ agent: "inventory", rule: "PROM-covenant-rossi", brd: "Playbook §7.1 — a re-accommodation must preserve the booked room class, board and family amenities for strategic-tier agencies." }} label="How?" />
        </div>

        <div className="cx2-dec-info">
          <div className="cx2-info">
            <div className="il"><Icon name="document-chart" size={12} /> Entry rules · TravelRadar</div>
            <div className="itx">{d.regulatory.summary}</div>
            <div className="ichips">
              {d.regulatory.chips.map((c, i) => <span className="ichip" key={i}>{check}{c}</span>)}
            </div>
            <div className="isrc">{d.regulatory.source}</div>
            <div className="idis">{d.regulatory.disclaimer}</div>
          </div>
          <div className="cx2-info supply">
            <div className="il"><Icon name="network" size={12} /> Availability & allotment</div>
            <div className="itx">{d.availability.line}</div>
            <div className="cx2-risk">
              <span className="rk-dot" />
              <span className="rk-tx">{d.availability.risk}</span>
            </div>
            <div style={{ marginTop: 9 }}>
              <WhyChip why={{ agent: "anomaly", rule: "FIN-margin-floor-IT", brd: "Playbook §2.1 — signal-monitoring mandate: watch every feed and open a ticket when a signal breaks the plan." }} label="What's the alert?" />
            </div>
          </div>
        </div>

        <div className="cx2-cites">
          <span className="cl">Cited from</span>
          {d.citations.map((c, i) => <span className="cx2-cite" key={i}><Icon name="document-chart" size={11} />{c}</span>)}
        </div>

        <div className="cx2-caveat">
          <Icon name="information" size={13} />
          <span className="cv-tx"><strong style={{ color: "var(--fg-1)" }}>Before you commit: </strong>{d.caveat}</span>
        </div>

        <div className="cx2-dec-actions">
          <button className="cx2-big-btn" onClick={onRequest}><Icon name="checkmark-filled" size={17} /> Place the 72-h hold — we'll handle the rest</button>
          <button className="esc" onClick={() => toast("Escalated to the concierge desk · full brief, citations & account context attached")}>Talk to the concierge desk</button>
          <span className="alt">
            {d.alternatives.map((a, i) => (
              <button className="cx2-alt" key={i} title={a.note} onClick={() => toast(`${a.name} — ${a.note}`)}>{a.name}</button>
            ))}
          </span>
        </div>
      </div>
    );
  }

  function Confirm({ r }) {
    return (
      <div className="cx2-confirm fade-in">
        <div className="cf-top">
          <span className="cf-ic"><Icon name="checkmark-filled" size={20} /></span>
          <span>
            <div className="cf-h">{r.headline}</div>
            <div className="cf-id">{r.id} · tracking live below</div>
          </span>
        </div>
        <div className="cf-did">
          {r.did.map((x, i) => <div className="cf-row" key={i}><Icon name="checkmark-filled" size={14} /> {x}</div>)}
        </div>
      </div>
    );
  }

  function TrackCard() {
    const D = window.D;
    return (
      <div className="cx2-track fade-in">
        <div className="tr-h"><span className="ai-glyph" style={{ width: 15, height: 15 }} /><span className="th-t">Live status — the booking tracks itself</span><span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-subtle)" }}>trace {D.event.trace}</span></div>
        <div style={{ fontSize: 12.5, color: "var(--fg-muted)", marginBottom: 14, lineHeight: 1.5 }}>
          A wing closure hit the resort block that holds the family's rooms. The spine caught it and re-secured them — the dates held. Every step explains itself.
        </div>
        <div>
          {D.customerSteps.map((s, i) => {
            const hasWhy = s.why && (s.why.agent || s.why.rule || s.why.brd);
            return (
              <div className={`cx-step ${s.state}`} key={i}>
                <div className="cxs-rail"><span className="cxs-node" /></div>
                <div className="cx-card">
                  <div className="cxc-top">
                    <span className="cxc-phase">{s.phase}</span>
                    {s.state === "active" && <Badge tone="spruce" dot="var(--k-spruce-60)">Now</Badge>}
                    {s.state === "done" && <Icon name="checkmark-filled" size={14} style={{ color: "var(--k-status-success-100)" }} />}
                    <span className="cxc-at">{s.at}</span>
                  </div>
                  <div className="cxc-plain">{s.plain}</div>
                  {hasWhy && (
                    <div className="cxc-foot"><WhyChip why={s.why} /><span className="cf-note">agent · policy · the rule in Alpitour's operating playbook</span></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function ChemAssistFlow({ toast, setLens, initial = "ask", onOpenOrder, setNaphtha }) {
    const D = window.D;
    const cx = D.cx;
    function requestSample(grade, qty) {
      try { window.AgenticBus && window.AgenticBus.set("hold-to-booking"); } catch (e) {}
      setNaphtha && setNaphtha(n => ({ ...n, samples: [...(n.samples || []), { grade, qty: qty || "72-h hold", at: "Just now", id: "P-" + Math.floor(2026020 + Math.random() * 900) }] }));
      toast(`Hold on ${grade} placed — added to BK 88412 and routed for covenant check.`, { label: "View booking →", onClick: onOpenOrder });
    }
    const [mode, setMode] = React.useState(initial === "alert" ? "alert" : "ask");
    const [intent, setIntent] = React.useState("build");
    const [input, setInput] = React.useState("");
    const [userMsg, setUserMsg] = React.useState("");
    const [thinkDone, setThinkDone] = React.useState(false);
    const timers = React.useRef([]);
    const scrollRef = React.useRef(null);

    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
    // Drive the live Agentic Workflow Pipeline from the customer's interaction.
    const setWf = (id) => { try { window.AgenticBus && window.AgenticBus.set(id); } catch (e) {} };
    const INTENT_WF = { build: "search-to-recommend", date: "disruption-to-reaccommodation", switch: "soldout-to-alternative", exposure: "disruption-to-reaccommodation" };
    React.useEffect(() => { if (initial === "alert") setWf("disruption-to-reaccommodation"); }, []);
    React.useEffect(() => {
      if (mode === "ask") return;
      const el = scrollRef.current; if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 120);
    }, [mode, thinkDone]);

    function classify(t) {
      const s = (t || "").toLowerCase();
      if (/safe|still|departure|on track|date|14.?aug|holds?/.test(s)) return "date";
      if (/closest|fastest|switch|in.?stock|baby.?pool|swap|alternative/.test(s)) return "switch";
      if (/portfolio|exposed|exposure|else|other booking|what else|at risk/.test(s)) return "exposure";
      return "build";
    }
    function ask(text) {
      const it = classify(text);
      setWf(INTENT_WF[it] || "search-to-recommend");
      setIntent(it); setUserMsg(text); setInput(""); setMode("thinking"); setThinkDone(false);
      timers.current.push(setTimeout(() => setThinkDone(true), it === "build" ? 2400 : 1500));
      timers.current.push(setTimeout(() => {
        setMode(it === "build" ? "decision" : "answer");
        const toasts = {
          build: ["Jaz Mirabel Beach is the call — the family room is held in the guaranteed block.", { label: "Place the hold →", onClick: request }],
          date: ["The 14-Aug departure on BK 88412 holds — re-pointed to the guaranteed block.", { label: "View booking →", onClick: onOpenOrder }],
          switch: ["2 family resorts can take BK 88412 with no price change.", null],
          exposure: ["3 bookings touched by the Jaz Mirabel alert — 1 at risk.", { label: "View booking →", onClick: onOpenOrder }],
        };
        const [m, a] = toasts[it]; toast(m, a || undefined);
      }, it === "build" ? 3100 : 2000));
    }
    function request() {
      setWf("hold-to-booking");
      setMode("requested");
      toast("Hold placed · P-2026-20418 — we handled entry rules, documents and policy for you.", { label: "Track it live →", onClick: () => setMode("track") });
      timers.current.push(setTimeout(() => setMode("track"), 1800));
    }
    function reset() { timers.current.forEach(clearTimeout); setMode("ask"); setUserMsg(""); setThinkDone(false); }

    return (
      <div className="cx2 cx2-canvas ca-flow" ref={scrollRef}>
        {mode === "alert" ? (
          <div className="cx2-thread fade-in">
            <div className="cx2-agent">
              <span className="ag-av"><span className="ai-glyph" /></span>
              <div className="ag-body">
                <div className="ca-alert">
                  <div className="ca-alert-top"><Icon name="warning-alt" size={14} /> Resort update on your booking</div>
                  <div className="ag-say" style={{ marginTop: 8 }}>
                    Ciao Giulia — a wing closure at Jaz Mirabel hit the room block behind the Bianchi booking. I'm re-pointing it to the BravoClub guaranteed block to protect the dates.
                  </div>
                  {/* the exact order this affects */}
                  <div className="ca-order">
                    <span className="ca-ord-ic"><Icon name="document-chart" size={15} /></span>
                    <div className="ca-ord-main">
                      <div className="ca-ord-n">BK 88412 · Jaz Mirabel Beach</div>
                      <div className="ca-ord-m">2 adults + 1 child · BLQ → SSH · departs 14 Aug</div>
                    </div>
                    <span className="ca-ord-link">West wing → Guaranteed block</span>
                  </div>
                  {/* clear, obvious link to the back-end record */}
                  <button className="ca-be" onClick={() => setLens("ops")}>
                    <span className="ai-glyph" style={{ width: 13, height: 13 }} />
                    <span className="ca-be-tx">Handled by the agentic spine · event <b>{D.event.trace}</b></span>
                    <span className="ca-be-go">Open the operator view →</span>
                  </button>
                  <div className="ca-alert-acts">
                    <button className="dow-btn red sm" onClick={onOpenOrder}>View booking status →</button>
                    <button className="cx2-alt" onClick={() => setMode("alts")}>See alternative resorts</button>
                  </div>
                </div>
                <div className="cx2-parsed-note"><Icon name="information" size={12} /> {D.event.trace} is the same record Alpitour's planners are working from right now — the booking and their decision are one trace.</div>
              </div>
            </div>
          </div>
        ) : mode === "alts" ? (
          <div className="cx2-thread fade-in">
            <div className="cx2-agent">
              <span className="ag-av"><span className="ai-glyph" /></span>
              <div className="ag-body">
                <div className="ag-say">
                  The <strong>Jaz Mirabel family room</strong> is covered by the guaranteed-block re-point — same room class, same amenities, dates held. If the family would rather consider an alternative, here's what's available right now:
                </div>
                <div className="ca-alts">
                  {cx.decision.alternatives.map((a, i) => (
                    <div className="ca-alt-row" key={i}>
                      <span className="ca-alt-ic"><Icon name="network" size={14} /></span>
                      <div className="ca-alt-main">
                        <div className="ca-alt-n">{a.name}</div>
                        <div className="ca-alt-note">{a.note}</div>
                      </div>
                      <span className="ca-alt-stock"><span className="dot" /> In stock</span>
                      <button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={() => requestSample(a.name)}>Hold a room</button>
                    </div>
                  ))}
                </div>
                <div className="ca-alert-acts">
                  <button className="dow-btn red sm" onClick={onOpenOrder} style={{ background: "var(--k-spruce-60)" }}>Keep Jaz Mirabel · view booking →</button>
                  <button className="cx2-alt" onClick={() => setMode("alert")}>Back</button>
                </div>
                <div className="cx2-parsed-note"><Icon name="information" size={12} /> Every alternative is pre-checked against the covenant and the party by the spine — a held room is added to BK 88412 · trace {D.event.trace}.</div>
              </div>
            </div>
          </div>
        ) : mode === "ask" ? (
          <div className="cx2-hello fade-in">
            <span className="eyebrow2"><span className="ai-glyph" style={{ width: 13, height: 13 }} /> AlpiGPT · {cx.account}</span>
            <h1>{cx.greeting}</h1>
            <div className="cx2-suggest">
              {cx.suggestions.map((s, i) => (
                <button className="cx2-sug" key={i} onClick={() => ask(s)}>
                  <span className="sg-ico"><Icon name="lightbulb" size={15} /></span>
                  <span className="sg-txt">{s}</span>
                  <Stroke className="sg-arr" size={16} d="M5 12h14M13 6l6 6-6 6" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="cx2-thread">
            <div className="cx2-user">{userMsg}</div>
            <div className="cx2-agent">
              <span className="ag-av"><span className="ai-glyph" /></span>
              <div className="ag-body">
                {intent === "build" ? (
                  <React.Fragment>
                    <div className="ag-say">
                      Got it — a <strong>family beach week with a two-year-old</strong>, mid-August from Bologna. Here's what I read from your brief, no forms needed:
                    </div>
                    <ParsedChips items={cx.parsed} />
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Destination, party and must-haves inferred — you never had to pick them.</div>
                    {(mode === "thinking") && <Thinking steps={cx.thinking} done={thinkDone} />}
                    {(mode === "decision" || mode === "requested" || mode === "track") && (
                      <React.Fragment>
                        <Thinking steps={cx.thinking} done={true} />
                        <div className="ag-say" style={{ marginTop: 16 }}>
                          One resort leads on exactly the must-haves that decide this trip — the baby pool and kids' club inside the budget. Here's the call:
                        </div>
                        <DecisionCard d={cx.decision} onRequest={request} toast={toast} />
                      </React.Fragment>
                    )}
                    {(mode === "requested" || mode === "track") && <Confirm r={cx.requested} />}
                    {mode === "track" && <TrackCard />}
                  </React.Fragment>
                ) : mode === "thinking" ? (
                  <div className="cx2-think fade-in"><div className="th-head"><AiSpinner size={16} /><span className="tt">Checking your account against the live event…</span><span className="tm">KAF · {D.event.trace}</span></div></div>
                ) : intent === "date" ? (
                  <React.Fragment>
                    <div className="ag-say"><strong>Yes — the 14-Aug departure on BK 88412 holds.</strong> The Jaz Mirabel wing closure hit the block that holds the family's rooms, but the spine already re-pointed them to the guaranteed block. Same room class, same amenities, same dates.</div>
                    <div className="ca-order" style={{ marginTop: 12 }}>
                      <span className="ca-ord-ic"><Icon name="checkmark-filled" size={15} /></span>
                      <div className="ca-ord-main"><div className="ca-ord-n">BK 88412 · Jaz Mirabel Beach · departs 14 Aug</div><div className="ca-ord-m">Re-secured · 3 pax · BLQ → SSH</div></div>
                      <span className="ca-ord-link">Dates held</span>
                    </div>
                    <div className="ca-alert-acts"><button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={onOpenOrder}>View booking status →</button><button className="cx2-alt" onClick={() => setMode("alts")}>See alternative resorts</button></div>
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Same record Alpitour's planners are working from · {D.event.trace}.</div>
                  </React.Fragment>
                ) : intent === "switch" ? (
                  <React.Fragment>
                    <div className="ag-say">The <strong>Jaz Mirabel family room</strong> on BK 88412 is already covered by the guaranteed-block re-point — no switch needed. If the family still wants an option, these keep the baby pool and need <strong>no price change</strong>:</div>
                    <div className="ca-alts">
                      {cx.decision.alternatives.map((a, i) => (
                        <div className="ca-alt-row" key={i}>
                          <span className="ca-alt-ic"><Icon name="network" size={14} /></span>
                          <div className="ca-alt-main"><div className="ca-alt-n">{a.name}</div><div className="ca-alt-note">{a.note}</div></div>
                          <span className="ca-alt-stock"><span className="dot" /> In stock</span>
                          <button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={() => requestSample(a.name)}>Hold a room</button>
                        </div>
                      ))}
                    </div>
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Pre-checked against the covenant + the party · a held room is added to BK 88412.</div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="ag-say">Here's everything in your portfolio touched by the Jaz Mirabel allotment alert. The spine is already acting on each:</div>
                    <div className="ca-exposure">
                      {cx.exposure.map((e, i) => (
                        <div className="ca-exp-row" key={i}>
                          <span className={`ca-exp-bar ${e.tone}`} />
                          <div className="ca-exp-main"><div className="ca-exp-sku">{e.sku}</div><div className="ca-exp-note">{e.order} · {e.note}</div></div>
                          <span className={`ca-exp-st ${e.tone}`}>{e.status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ca-alert-acts"><button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={onOpenOrder}>View booking status →</button><button className="cx2-alt" onClick={() => setLens("ops")}>Open the operator view →</button></div>
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Live from the spine · {D.event.trace}.</div>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="cx2-composer-wrap">
          {mode !== "ask" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <button className="cx2-alt" onClick={reset}><Icon name="arrow-up-right" size={11} style={{ transform: "rotate(180deg)" }} /> New request</button>
            </div>
          )}
          <div className="cx2-composer">
            <span className="ai-glyph" />
            <input value={input} placeholder={mode === "ask" ? "Describe the trip…" : "Ask a follow-up, or refine your brief…"}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && input.trim()) ask(input.trim()); }} />
            <button className="cx2-send" disabled={!input.trim()} onClick={() => input.trim() && ask(input.trim())}>
              <Stroke size={17} d="M5 12h14M13 6l6 6-6 6" />
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 9, fontSize: 11, color: "var(--fg-subtle)" }}>
            Trace <span style={{ fontFamily: "var(--font-mono)" }}>{D.event.trace}</span> — same record Alpitour's planners work from · <span className="spruce-link" onClick={() => setLens("ops")}>see the operator view</span>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- AlpiGPT slide-in panel ---------- */
  function ChemAssistPanel({ open, onClose, toast, setLens, initial, onOpenOrder, setNaphtha }) {
    React.useEffect(() => {
      function onKey(e) { if (e.key === "Escape") onClose(); }
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    return (
      <React.Fragment>
        <div className={`ca-scrim ${open ? "open" : ""}`} onClick={onClose} />
        <aside className={`ca-panel ${open ? "open" : ""}`} aria-hidden={!open}>
          <header className="ca-head">
            <span className="ca-av"><span className="dow-spark">✦</span></span>
            <div className="ca-head-t">
              <span className="ca-h1">AlpiGPT</span>
              <span className="ca-h2">Beta · powered by the agentic spine</span>
            </div>
            <button className="ca-x" onClick={onClose} aria-label="Close AlpiGPT"><Icon name="close" size={16} /></button>
          </header>
          <div className="ca-disclaimer"><Icon name="information" size={12} /> Answers are AI-generated and may not be complete or up to date. By using AlpiGPT you agree to Alpitour's Data Privacy Notice and Terms of Use.</div>
          {open && <ChemAssistFlow key={initial} toast={toast} setLens={setLens} initial={initial} onOpenOrder={onOpenOrder} setNaphtha={setNaphtha} />}
        </aside>
      </React.Fragment>
    );
  }

  /* ---------- Site-wide disruption banner (Rossi Travel) ---------- */
  function DisruptionBanner({ secured, onView }) {
    return (
      <div className="dow-disrupt">
        <div className="dow-disrupt-in">
          <span className="ddx-ic"><Icon name="information" size={15} /></span>
          <div className="ddx-tx">
            <b>Heads up, Rossi Travel —</b> a wing closure affected the room block behind the Bianchi booking. {secured ? "We re-secured the rooms and the 14-Aug dates hold." : "We're re-securing the rooms now to protect the dates."}
          </div>
          <button className="dow-btn red sm" onClick={onView}>View booking status</button>
        </div>
      </div>
    );
  }

  /* ---------- Booking status — the customer end of the allotment event ---------- */
  function OrderStatus({ naphtha, setNaphtha, toast, onAsk, onHome, goLearning }) {
    const secured = naphtha.secured, acked = naphtha.acked;
    const [why, setWhy] = React.useState(false);
    const [pref, setPref] = React.useState(null);
    const PREFS = [
      { id: "auto", t: "Auto-approve covenant-safe re-points", d: "If the room class and amenities are preserved, just do it — don't make the family wait.", delta: "auto-approve branch when room class + amenities preserved" },
      { id: "call", t: "Always call the agency first", d: "Notify Rossi Travel before any re-accommodation.", delta: "mandatory agency-notify gate before commit" },
      { id: "sub", t: "Allow an equivalent resort", d: "If it protects the dates and keeps the must-haves, a validated substitute is fine.", delta: "permit validated resort substitution" },
    ];
    function choosePref(p) {
      setPref(p);
      setNaphtha && setNaphtha(n => ({ ...n, learned: { id: p.id, title: p.t, delta: p.delta, at: "Just now" } }));
      toast("Saved as a policy proposal — routed to your Alpitour policy owner.", { label: "See it in “Learned from you” →", onClick: () => goLearning && goLearning() });
    }
    const steps = [
      { t: "Booking confirmed", d: "Jaz Mirabel Beach · 3 pax · BK 88412", state: "done", at: "21 May" },
      { t: "Resort event detected", d: "A wing closure hit the block that holds the family's rooms.", state: "done", at: "06:14" },
      { t: "Rooms re-secured for you", d: "We moved the booking to the BravoClub guaranteed block so the closure wouldn't move the dates — same room class, same amenities.", state: "done", at: "06:34" },
      { t: secured ? "Departure dates secured" : "Securing the dates…", d: secured ? "The 14-Aug departure holds. No action needed." : "Final confirmation in progress — the duty planner is signing off now.", state: secured ? "active" : "pending", at: secured ? "07:09" : "—" },
    ];
    function accept() {
      setNaphtha(n => ({ ...n, acked: true }));
      toast(secured ? "Thanks — you've accepted the secured plan. The family and the duty planner have been notified."
                    : "Pre-approved — the booking confirms automatically the moment the re-point commits.");
    }
    return (
      <div className="dow-page ord">
        <div className="dow-crumbs"><span className="ord-back" onClick={onHome}>Home</span> <span>›</span> My bookings <span>›</span> <b>BK 88412</b></div>
        <div className="ord-head">
          <div>
            <h1>The booking is on track</h1>
            <div className="ord-sub">Famiglia Bianchi · via Rossi Travel · BK 88412 · Jaz Mirabel Beach</div>
          </div>
          <span className={`ord-pill ${secured ? "secured" : "securing"}`}>
            <span className="op-dot" /> {secured ? "Secured" : "Securing"}
          </span>
        </div>

        <div className="ord-grid">
          <div className="ord-main">
            {/* protected-promise headline */}
            <div className={`ord-promise ${secured ? "secured" : ""}`}>
              <div className="op-l">
                <div className="opl-lbl">Departure date</div>
                <div className="opl-date">14 August 2026</div>
                <div className="opl-note">{secured ? "Held through the disruption — unchanged from the original dates." : "We're protecting these dates right now."}</div>
              </div>
              <div className="op-r">
                <Icon name={secured ? "checkmark-filled" : "information"} size={26} style={{ color: secured ? "var(--k-status-success-100)" : "#B45309" }} />
              </div>
            </div>

            {/* protected-promise timeline */}
            <div className="ord-tl">
              {steps.map((s, i) => (
                <div className={`ord-step ${s.state}`} key={i}>
                  <span className="os-rail"><span className="os-node" /></span>
                  <div className="os-body">
                    <div className="os-top"><span className="os-t">{s.t}</span><span className="os-at">{s.at}</span></div>
                    <div className="os-d">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* outcome-level why */}
            <div className={`ord-why ${why ? "open" : ""}`}>
              <button className="ord-why-btn" onClick={() => setWhy(v => !v)}>
                <Icon name="information" size={13} /> Why did the booking change? <Stroke className="oww-chev" size={13} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />
              </button>
              {why && (
                <div className="ord-why-body">
                  A wing closure affected the room block that holds the family's rooms. Alpitour re-secured the booking from the BravoClub guaranteed block and re-checked it against the agency covenant, so the departure dates didn't move. You don't need to do anything.
                  <div className="oww-ref">Reference · TRC-2026-0810</div>
                </div>
              )}
            </div>

            {/* feedback → PAC: the customer's preference becomes a proposed policy rule */}
            <div className="ord-pac-card">
              <div className="opc-h"><Icon name="recommend" size={14} /> Make this automatic next time</div>
              {!pref ? (
                <React.Fragment>
                  <div className="opc-sub">Tell us how you'd like disruptions like this handled for your bookings. Your choice becomes a policy your Alpitour team reviews — then it just happens.</div>
                  <div className="opc-opts">
                    {PREFS.map(p => (
                      <button className="opc-opt" key={p.id} onClick={() => choosePref(p)}>
                        <span className="opc-radio" />
                        <span><span className="opc-t">{p.t}</span><span className="opc-d">{p.d}</span></span>
                      </button>
                    ))}
                  </div>
                </React.Fragment>
              ) : (
                <div className="opc-proposed">
                  <div className="opc-prop-top"><Icon name="checkmark-filled" size={14} style={{ color: "var(--k-spruce-60)" }} /> Proposed as a policy update</div>
                  <div className="opc-rule"><span className="opc-rule-id">PROM-covenant-rossi</span> <span className="opc-plus">+ {pref.delta}</span></div>
                  <div className="opc-flow">
                    <span className="opc-step done">Your preference</span>
                    <Stroke size={12} sw={2.2} children={<polyline points="9 6 15 12 9 18" />} />
                    <span className="opc-step now">Policy-owner sign-off</span>
                    <Stroke size={12} sw={2.2} children={<polyline points="9 6 15 12 9 18" />} />
                    <span className="opc-step">Live in PAC</span>
                  </div>
                  <div className="opc-note">A test case was generated and it's queued in the operator's “Learned from you” inbox. Once your Alpitour policy owner approves it, the next disruption resolves this way automatically — no waiting.</div>
                  <button className="opc-change" onClick={() => setPref(null)}>Choose differently</button>
                </div>
              )}
            </div>
          </div>

          {/* decision rail */}
          <aside className="ord-side">
            <div className="ord-decide">
              <div className="od-h">{acked ? "You're all set" : secured ? "Confirm the plan" : "Pre-approve the plan"}</div>
              {acked ? (
                <div className="od-acked"><Icon name="checkmark-filled" size={16} style={{ color: "var(--k-status-success-100)" }} /> {secured ? "You accepted the secured plan. The family has been notified." : "Pre-approved — confirms automatically the moment the re-point commits."}</div>
              ) : (
                <React.Fragment>
                  <div className="od-b">{secured ? "The re-secured booking is ready to confirm. Same room class, same 14-Aug dates." : "The re-point is still committing. You can pre-approve now and we'll confirm the moment it lands — no need to wait."}</div>
                  <button className="dow-btn red" onClick={accept} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
                    <Icon name="checkmark-filled" size={15} /> {secured ? "Accept the secured plan" : "Pre-approve the re-point"}
                  </button>
                  <button className="dow-btn ghost sm" onClick={onAsk} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Request a change in AlpiGPT</button>
                </React.Fragment>
              )}
            </div>
            <button className="ord-ask" onClick={onAsk}><span className="ai-glyph" style={{ width: 14, height: 14 }} /> Ask AlpiGPT about this booking</button>
            {(naphtha.samples || []).length > 0 && (
              <div className="ord-samples">
                <div className="os-h"><Icon name="checkmark-filled" size={13} style={{ color: "var(--k-spruce-60)" }} /> Holds added via AlpiGPT</div>
                {naphtha.samples.map((s, i) => (
                  <div className="os-row" key={i}>
                    <span className="os-grade">{s.grade}</span>
                    <span className="os-qty">{s.qty}</span>
                    <span className="os-id">{s.id}</span>
                  </div>
                ))}
                <div className="os-note">Attached to BK 88412 · covenant-checked by the spine.</div>
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  function ScreenCustomer({ toast, setLens, naphtha, setNaphtha, cxLanding, setCxLanding, goLearning }) {
    const [assist, setAssist] = React.useState(false);
    const [caInit, setCaInit] = React.useState("ask");
    const [view, setView] = React.useState("product"); // product | search | order
    const [query, setQuery] = React.useState("");
    const [cartOpen, setCartOpen] = React.useState(false);
    const pushed = React.useRef(false);
    const openAssist = () => { setCaInit("ask"); setAssist(true); };
    const openCart = () => setCartOpen(true);
    const onSearch = (q) => { setQuery(q); setView("search"); const m = document.querySelector(".main, .app-cx"); if (m) m.scrollTop = 0; };
    const onHome = () => { setView("product"); setQuery(""); };
    const openOrder = () => { setAssist(false); setView("order"); };

    // operator hand-off lands here on the order view
    React.useEffect(() => {
      if (cxLanding === "order") { setView("order"); setCxLanding && setCxLanding(null); }
    }, [cxLanding]);

    // entry leads with AlpiGPT surfacing the disruption (once per session, unless handed off to order)
    React.useEffect(() => {
      if (pushed.current || window.__brandtPushed) return;
      if (cxLanding === "order") return;
      pushed.current = true; window.__brandtPushed = true;
      const id = setTimeout(() => { setCaInit("alert"); setAssist(true); }, 700);
      return () => clearTimeout(id);
    }, []);

    return (
      <div className="dowfe">
        <DowUtilityBar setLens={setLens} cartCount={2 + (naphtha.samples || []).length} />
        <DowHeader onAsk={openAssist} onHome={onHome} query={query} setQuery={setQuery} onSearch={onSearch} />
        {view !== "order" && <DisruptionBanner secured={naphtha.secured} onView={() => setView("order")} />}
        {view === "order"
          ? <OrderStatus naphtha={naphtha} setNaphtha={setNaphtha} toast={toast} onAsk={openAssist} onHome={onHome} goLearning={goLearning} />
          : view === "search"
            ? <SearchResults query={query} onBack={onHome} onAsk={openAssist} onCart={openCart} />
            : <Storefront onAsk={openAssist} onCart={openCart} />}
        <DowFooter />

        {!assist && (
          <button className="ca-launch" onClick={openAssist}>
            <span className="dow-spark">✦</span> Ask AlpiGPT <span className="ca-launch-beta">BETA</span>
          </button>
        )}
        <SampleCart open={cartOpen} onClose={() => setCartOpen(false)} toast={toast} onAsk={() => { setCartOpen(false); openAssist(); }} />
        <ChemAssistPanel open={assist} onClose={() => setAssist(false)} toast={toast} setLens={setLens} initial={caInit} onOpenOrder={openOrder} setNaphtha={setNaphtha} />
      </div>
    );
  }
  UI.ScreenCustomer = ScreenCustomer;
})();
