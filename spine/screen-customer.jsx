/* ============================================================
   Customer FE — the real Dow.com storefront (slate utility bar,
   red diamond header, AI Ready Beta search) with ChemAssist as a
   slide-in assist that walks the customer through plain-language
   intent → a decision → a tracked sample. Chat flow unchanged.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, Badge, WhyChip, AiSpinner } = UI;
  const check = <Stroke size={11} sw={3.2} children={<polyline points="20 6 9 17 4 12" />} />;

  /* ---------- Dow.com storefront chrome ---------- */
  const NAV = ["APPLICATIONS", "PRODUCTS", "SUSTAINABILITY", "SUPPORT"];

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
            <span className="dui"><Icon name="arrow-up-right" size={12} /> Germany</span>
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
          <img className="dow-logo" src="assets/dow-logo.png" alt="Dow" onClick={onHome} style={{ cursor: "pointer" }} />
          <nav className="dow-nav">
            {NAV.map(n => <button className="dow-navi" key={n}>{n} <Stroke size={9} d="M6 9l6 6 6-6" /></button>)}
          </nav>
          <div className="dow-search">
            <input placeholder="What are you looking for?" value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && query.trim()) onSearch(query.trim()); }} />
            <button className="dow-ai-pill" onClick={onAsk}><span className="dow-spark">✦</span> AI Ready Beta</button>
            <button className="dow-search-btn" onClick={() => query.trim() ? onSearch(query.trim()) : onAsk()} aria-label="Search"><Stroke size={17} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></button>
          </div>
        </div>
      </header>
    );
  }

  function DowFooter() {
    const cols = [
      { t: "RESOURCES", items: ["Contact Us", "Global Locations"] },
      { t: "EDUCATION", items: ["News", "Events"] },
      { t: "CORPORATE", items: ["About", "Careers", "Investors", "Seek Together Blog"] },
      { t: "LEGAL", items: ["Privacy Statement", "Terms of Use", "Accessibility Statement", "California Supply Chain Act"] },
    ];
    return (
      <footer className="dow-foot">
        <div className="dow-foot-in">
          <div className="dow-foot-brand">
            <img className="dow-logo" src="assets/dow-logo.png" alt="Dow" />
            <span className="dow-seek">Seek Together<sup>™</sup></span>
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
            <span>© 1995–2026, The Dow Chemical Company</span>
            <span>®™ Trademark of Dow or an affiliated company of Dow</span>
          </div>
        </div>
      </footer>
    );
  }

  /* ---------- Storefront body — ENGAGE product page context ---------- */
  const PRODUCT_TABS = [
    { id: "overview", label: "OVERVIEW", icon: "information" },
    { id: "properties", label: "PROPERTIES", icon: "document-chart" },
    { id: "technical", label: "TECHNICAL CONTENT", icon: "document-chart" },
    { id: "sample", label: "SAMPLE OPTIONS", icon: "recommend" },
    { id: "buying", label: "BUYING OPTIONS", icon: "network" },
  ];

  function PropertiesTab() {
    const rows = [["Density", "0.875", "g/cm³", "ISO 1183"], ["Melt index (190 °C / 2.16 kg)", "1.0", "g/10 min", "ISO 1133"], ["Shore A hardness", "75", "—", "ASTM D2240"], ["Flexural modulus", "12", "MPa", "ISO 178"], ["DSC melting point", "60", "°C", "internal"], ["Tensile strength", "6.5", "MPa", "ISO 527"], ["Elongation at break", "> 800", "%", "ISO 527"]];
    return (
      <table className="dow-proptbl">
        <thead><tr><th>Property</th><th>Typical value</th><th>Unit</th><th>Test method</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><td className="pt-name">{r[0]}</td><td className="pt-val">{r[1]}</td><td>{r[2]}</td><td className="pt-method">{r[3]}</td></tr>)}</tbody>
      </table>
    );
  }

  function TechnicalTab({ onAsk }) {
    const docs = [["Technical Data Sheet (TDS)", "PDF · 240 KB", "EN"], ["Safety Data Sheet (SDS)", "PDF · 180 KB", "EN / DE"], ["Application Guide — TPO compounding", "PDF · 1.2 MB", "EN"], ["Regulatory Data Sheet (RDS)", "PDF · 96 KB", "EN"]];
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
    const packs = [["1 kg", "Free sample · qualification", "In stock · Freeport"], ["5 kg", "Pilot quantity", "Lead time 5–7 days"], ["25 kg", "Pre-production trial", "Quote required"]];
    return (
      <div>
        <div className="dow-packs">
          {packs.map((p, i) => (
            <div className="dow-pack" key={i}>
              <div className="dp-sz">{p[0]}</div>
              <div className="dp-l">{p[1]}</div>
              <div className="dp-avail">{p[2]}</div>
              <button className="dow-btn red sm" onClick={() => onCart(p[0])}>Add to sample cart</button>
            </div>
          ))}
        </div>
        <div className="dow-airow" onClick={onAsk} style={{ marginTop: 18 }}>
          <div className="dow-airow-l">
            <span className="dow-airow-pill"><span className="dow-spark">✦</span> Faster with AI</span>
            <div className="dow-airow-h">Let ChemAssist reserve the right lot for you.</div>
            <div className="dow-airow-s">It checks the live qualification stock, clears policy, and sets shipping — no cart, no forms.</div>
          </div>
          <button className="dow-btn red" onClick={onAsk}><span className="dow-spark">✦</span> Reserve via ChemAssist</button>
        </div>
      </div>
    );
  }

  function BuyingTab() {
    return (
      <div className="dow-buying">
        <div className="dow-side-card" style={{ maxWidth: 520 }}>
          <div className="dsc-h">Your account currently does not have buying access.</div>
          <div className="dsc-b">Contact us for information about your account, or find a distributor in your region.</div>
          <div className="dow-cta-row" style={{ marginTop: 12 }}>
            <button className="dow-btn red sm">PRICING</button>
            <button className="dow-btn red sm">HOW TO BUY</button>
            <button className="dow-btn ghost sm">Find a Distributor</button>
          </div>
        </div>
        <div className="dow-learnrow">Learn more about Dow's <a>pricing</a> and <a>buying processes</a>.</div>
      </div>
    );
  }

  function Storefront({ onAsk, onCart }) {
    const [tab, setTab] = React.useState("overview");
    return (
      <div className="dow-page">
        <div className="dow-crumbs">Products <span>›</span> Elastomers &amp; Plastomers <span>›</span> <b>ENGAGE™</b></div>
        <div className="dow-prod-head">
          <h1>ENGAGE™ 8003 Polyolefin Elastomer <span className="dow-star">☆</span></h1>
          <div className="dow-quick">
            {["SDS / TDS / RDS", "Find a Distributor", "Contact Us", "Product Uses Policies"].map(q => (
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
                    <div className="dow-airow-h">Not sure this is the right grade? Ask ChemAssist.</div>
                    <div className="dow-airow-s">Describe what you're building and Dow's AI selects, checks supply &amp; regulatory, and sets up your sample — no forms.</div>
                  </div>
                  <button className="dow-btn red" onClick={onAsk}><span className="dow-spark">✦</span> Ask ChemAssist</button>
                </div>
                <div className="dow-prose">
                  <p>Ethylene-octene (EO) polyolefin elastomer (POE) useful in many applications to increase toughness of polymer compounds, increase flex-crack resistance, and impart excellent compression set in crosslinked foams. This product is delivered in free-flowing pellet form.</p>
                  <div className="dow-specs">
                    {[["Density", "0.875 g/cm³"], ["Melt index", "1.0 g/10 min"], ["Form", "Pellet"], ["Shore A hardness", "75"]].map(([k, v]) => (
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
              <button className="dow-btn red" onClick={() => onCart("1 kg")}><Icon name="document-chart" size={15} /> Sample &amp; Buy</button>
              <button className="dow-btn ghost" onClick={() => setTab("technical")}>Documents</button>
              <button className="dow-btn ghost">☆ Favorite</button>
            </div>
          </div>

          <aside className="dow-prod-side">
            <div className="dow-side-card">
              <div className="dsc-h">Your account currently does not have buying access.</div>
              <div className="dsc-b">Contact us for information about your account, or find a distributor.</div>
              <div className="dow-cta-row" style={{ marginTop: 12 }}>
                <button className="dow-btn red sm">PRICING</button>
                <button className="dow-btn red sm">HOW TO BUY</button>
              </div>
            </div>
            <div className="dow-side-ai" onClick={onAsk}>
              <span className="ai-glyph" style={{ width: 16, height: 16 }} />
              <div>
                <div className="dsa-h">ChemAssist can buy for you</div>
                <div className="dsa-s">It reads your brief, clears policy, and reserves the sample.</div>
              </div>
              <Stroke size={15} d="M5 12h14M13 6l6 6-6 6" />
            </div>
          </aside>
        </div>

        {/* How ChemAssist recommends — the recommendation decision graph */}
        <UI.RecommendationGraph />
      </div>
    );
  }

  /* ---------- AI search results (generated answer + filtered list) ---------- */
  function SearchResults({ query, onBack, onAsk, onCart }) {
    const facets = [["Elastomers and Plastomers", 124], ["Adhesives and Sealants", 27], ["Polyethylene", 9], ["Silicones", 9], ["Specialty Polymers", 9]];
    const results = [
      { n: "ENGAGE™ 8180 Polyolefin Elastomer", d: "High-performance EO polyolefin elastomer (POE) designed for TPO formulations. Delivered in free-flowing pellet form." },
      { n: "ENGAGE™ 8003 Polyolefin Elastomer", d: "EO polyolefin elastomer useful to increase toughness of polymer compounds and impart excellent compression set." },
      { n: "ENGAGE™ 7447 Polyolefin Elastomer", d: "High-flow, low-density EB polyolefin elastomer for TPO impact modification and soft-touch compounds." },
    ];
    return (
      <div className="dow-page">
        <div className="dow-srbar">
          <span className="dow-srcount">Results 1–{results.length} of 270</span>
          <button className="dow-srback" onClick={onBack}>← Back to product</button>
        </div>
        <div className="dow-srtabs">{["ALL", "APPLICATIONS", "PRODUCTS", "SUSTAINABILITY", "SUPPORT"].map((t, i) => <span key={t} className={`dow-srtab ${i === 0 ? "on" : ""}`}>{t}</span>)}</div>
        <div className="dow-srgrid">
          <aside className="dow-srfacets">
            <div className="dsf-h">Market</div>
            {facets.map((f, i) => <div className="dsf-row" key={i}><span>{f[0]}</span><span className="dsf-n">{f[1]}</span></div>)}
          </aside>
          <div className="dow-srmain">
            <div className="dow-genanswer">
              <div className="dga-top"><span className="dow-airow-pill"><span className="dow-spark">✦</span> Generated answer · Beta</span></div>
              <div className="dga-h">ENGAGE™ Polyolefin Elastomers</div>
              <div className="dga-b">ENGAGE™ polyolefin elastomers are versatile materials used in footwear, hygiene, and molded goods — providing flexibility, durability and efficient processing. For a cold-weather automotive fascia, the <b>XLT</b> series leads on low-temperature impact while letting you down-gauge.</div>
              <div className="dga-foot">
                <button className="dow-btn red sm" onClick={onAsk}><span className="dow-spark">✦</span> Refine with ChemAssist</button>
                <span className="dga-dis">AI-generated · may be incomplete. Review Dow's Data Privacy Notice & Terms.</span>
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
                  <button className="dow-btn red sm" onClick={() => onCart("1 kg")}>Sample &amp; Buy</button>
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

  /* ---------- Sample Cart — 3-step flow ---------- */
  const CART_STEPS = ["Sample Cart", "Sample Request", "Sample Confirmation"];
  function SampleCart({ open, onClose, toast, onAsk }) {
    const [step, setStep] = React.useState(0);
    React.useEffect(() => { if (open) setStep(0); }, [open]);
    if (!open) return null;
    return (
      <div className="dow-cart-scrim" onClick={onClose}>
        <div className="dow-cart" onClick={e => e.stopPropagation()}>
          <div className="dow-cart-head">
            <h2>Sample Cart</h2>
            <button className="ca-x" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
          </div>
          <div className="dow-cart-sub">Your sample cart requests may include a fee. Your Dow contact will discuss with you if applicable.</div>
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
                <div className="dci-top"><Icon name="document-chart" size={14} /> <b>ENGAGE™ 8003 Polyolefin Elastomer</b> <span className="dci-tp">Trade Product No. 000000234647</span></div>
                <div className="dci-grid">
                  {[["Market", "Consumer Goods and Appliances"], ["Submarket", "Footwear"], ["Application", "Casual Shoes"], ["Quantity", "1 kg"]].map(([k, v]) => (
                    <div className="dci-kv" key={k}><span className="dci-k">{k}</span><span className="dci-v">{v}</span></div>
                  ))}
                </div>
                <div className="dci-note"><Icon name="information" size={12} /> Some applications are high-risk. Samples are available for commercial purposes only.</div>
              </div>
            )}
            {step === 1 && (
              <div className="dow-form">
                {[["First Name", "Lars"], ["Last Name", "Stratveit"], ["Phone", "07345 487063"], ["Company Name", "Kyndryl"]].map(([l, v]) => (
                  <label className="dow-field" key={l}><span>{l}*</span><input defaultValue={v} /></label>
                ))}
                <label className="dow-field"><span>Shipping country*</span><select defaultValue="United Kingdom"><option>United Kingdom</option><option>Germany</option><option>United States</option></select></label>
                <label className="dow-field"><span>Priority*</span><select defaultValue="Standard"><option>Standard</option><option>Rush</option></select></label>
              </div>
            )}
            {step === 2 && (
              <div className="dow-cart-confirm">
                <span className="dccf-ic"><Icon name="checkmark-filled" size={26} /></span>
                <div className="dccf-h">Thank you — your sample request is in.</div>
                <div className="dccf-b">We've received your sample request for ENGAGE™ 8003. A confirmation has been sent to larskristian.stratveit@kyndryl.com. Request <b>DR-2026-20418</b>.</div>
                <div className="dccf-ai" onClick={onAsk}><span className="ai-glyph" style={{ width: 14, height: 14 }} /> Next time, let ChemAssist do this in one line — and track it live.</div>
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
              <button className="dow-btn red" onClick={() => { toast("Sample request DR-2026-20418 confirmed."); onClose(); }}>Finish</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- ChemAssist flow (unchanged behavior) ---------- */
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
            <div className="pl"><Icon name="information" size={12} /> Sample ready</div>
            <div className="pv">{d.sampleReady}</div>
            <div className="pn">{d.sampleReadyNote}</div>
          </div>
          <div className="cx2-predict">
            <div className="pl"><Icon name="arrow-up-right" size={12} /> Predicted delivery</div>
            <div className="pv">{d.delivery}</div>
            <div className="pn">{d.deliveryNote}</div>
          </div>
        </div>

        <div className="cx2-dec-pac">
          <span className="pac-ic">{check}</span>
          <span className="pac-tx"><b>Policy cleared inline.</b> {d.pacNote}</span>
          <WhyChip why={{ agent: "inventory", rule: "PROD-covenant-brandt", brd: "BRD §7.1 — a sourcing change must preserve the contracted grade and specification for strategic-tier customers." }} label="How?" />
        </div>

        <div className="cx2-dec-info">
          <div className="cx2-info">
            <div className="il"><Icon name="document-chart" size={12} /> Regulatory · RegRadar</div>
            <div className="itx">{d.regulatory.summary}</div>
            <div className="ichips">
              {d.regulatory.chips.map((c, i) => <span className="ichip" key={i}>{check}{c}</span>)}
            </div>
            <div className="isrc">{d.regulatory.source}</div>
            <div className="idis">{d.regulatory.disclaimer}</div>
          </div>
          <div className="cx2-info supply">
            <div className="il"><Icon name="network" size={12} /> Availability & supply</div>
            <div className="itx">{d.availability.line}</div>
            <div className="cx2-risk">
              <span className="rk-dot" />
              <span className="rk-tx">{d.availability.risk}</span>
            </div>
            <div style={{ marginTop: 9 }}>
              <WhyChip why={{ agent: "anomaly", rule: "FIN-margin-floor-EU", brd: "BRD §2.1 — signal-monitoring mandate: watch every feed and open a ticket when a signal breaks the plan." }} label="What's the alert?" />
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
          <button className="cx2-big-btn" onClick={onRequest}><Icon name="checkmark-filled" size={17} /> Request sample — we'll handle the rest</button>
          <button className="esc" onClick={() => toast("Escalated to Technical Service · full brief, citations & account context attached")}>Talk to Technical Service</button>
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
        <div className="tr-h"><span className="ai-glyph" style={{ width: 15, height: 15 }} /><span className="th-t">Live status — your order tracks itself</span><span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-subtle)" }}>trace {D.event.trace}</span></div>
        <div style={{ fontSize: 12.5, color: "var(--fg-muted)", marginBottom: 14, lineHeight: 1.5 }}>
          A feedstock disruption hit the plant that normally makes your material. The spine caught it and re-sourced you — your date held. Every step explains itself.
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
                    <div className="cxc-foot"><WhyChip why={s.why} /><span className="cf-note">agent · policy · the rule in Dow's operating document</span></div>
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
      try { window.AgenticBus && window.AgenticBus.set("sample-to-qualification"); } catch (e) {}
      setNaphtha && setNaphtha(n => ({ ...n, samples: [...(n.samples || []), { grade, qty: qty || "1 kg", at: "Just now", id: "DR-" + Math.floor(2026020 + Math.random() * 900) }] }));
      toast(`Sample of ${grade} requested — added to PO 8841 and routed for covenant check.`, { label: "View order →", onClick: onOpenOrder });
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
    const INTENT_WF = { build: "need-to-recommend", date: "deliver-to-promise", switch: "allocation-under-constraint", exposure: "allocation-under-constraint" };
    React.useEffect(() => { if (initial === "alert") setWf("allocation-under-constraint"); }, []);
    React.useEffect(() => {
      if (mode === "ask") return;
      const el = scrollRef.current; if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 120);
    }, [mode, thinkDone]);

    function classify(t) {
      const s = (t || "").toLowerCase();
      if (/safe|still|delivery|on track|date|18.?jun|holds?/.test(s)) return "date";
      if (/fastest|switch|in.?stock|re.?qualif|swap|alternative/.test(s)) return "switch";
      if (/contract|exposed|exposure|else|other order|what else|at risk/.test(s)) return "exposure";
      return "build";
    }
    function ask(text) {
      const it = classify(text);
      setWf(INTENT_WF[it] || "need-to-recommend");
      setIntent(it); setUserMsg(text); setInput(""); setMode("thinking"); setThinkDone(false);
      timers.current.push(setTimeout(() => setThinkDone(true), it === "build" ? 2400 : 1500));
      timers.current.push(setTimeout(() => {
        setMode(it === "build" ? "decision" : "answer");
        const toasts = {
          build: ["ENGAGE XLT 8677 is the call — the Freeport qualification lot is in stock now.", { label: "Request sample →", onClick: request }],
          date: ["Your 18-Jun date on PO 8841 holds — re-sourced to Freeport.", { label: "View order →", onClick: onOpenOrder }],
          switch: ["2 in-stock grades can take PO 8841 with no re-qualification.", null],
          exposure: ["3 contract lines touched by the Terneuzen alert — 1 at risk.", { label: "View order →", onClick: onOpenOrder }],
        };
        const [m, a] = toasts[it]; toast(m, a || undefined);
      }, it === "build" ? 3100 : 2000));
    }
    function request() {
      setWf("sample-to-qualification");
      setMode("requested");
      toast("Sample reserved · DR-2026-20418 — we handled market, docs and policy for you.", { label: "Track it live →", onClick: () => setMode("track") });
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
                  <div className="ca-alert-top"><Icon name="warning-alt" size={14} /> Supply update on your order</div>
                  <div className="ag-say" style={{ marginTop: 8 }}>
                    Heads up, Brandt — a supply disruption hit Terneuzen, the plant that makes the grade on your open order. I'm re-sourcing it from Freeport to protect your date.
                  </div>
                  {/* the exact order this affects */}
                  <div className="ca-order">
                    <span className="ca-ord-ic"><Icon name="document-chart" size={15} /></span>
                    <div className="ca-ord-main">
                      <div className="ca-ord-n">PO 8841 · ENGAGE™ XLT 8677</div>
                      <div className="ca-ord-m">42 t · ship-to Ingolstadt, DE · due 18 Jun</div>
                    </div>
                    <span className="ca-ord-link">Terneuzen → Freeport</span>
                  </div>
                  {/* clear, obvious link to the back-end record */}
                  <button className="ca-be" onClick={() => setLens("ops")}>
                    <span className="ai-glyph" style={{ width: 13, height: 13 }} />
                    <span className="ca-be-tx">Handled by the agentic spine · event <b>{D.event.trace}</b></span>
                    <span className="ca-be-go">Open the operator view →</span>
                  </button>
                  <div className="ca-alert-acts">
                    <button className="dow-btn red sm" onClick={onOpenOrder}>View order status →</button>
                    <button className="cx2-alt" onClick={() => setMode("alts")}>See alternative grades</button>
                  </div>
                </div>
                <div className="cx2-parsed-note"><Icon name="information" size={12} /> {D.event.trace} is the same record Dow's planners are working from right now — your order and their decision are one trace.</div>
              </div>
            </div>
          </div>
        ) : mode === "alts" ? (
          <div className="cx2-thread fade-in">
            <div className="cx2-agent">
              <span className="ag-av"><span className="ai-glyph" /></span>
              <div className="ag-body">
                <div className="ag-say">
                  Your <strong>ENGAGE™ XLT 8677</strong> is covered by the Freeport reroute — same grade, same spec, date held. If you'd rather consider an in-stock alternative, here's what's available in inventory right now:
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
                      <button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={() => requestSample(a.name)}>Request sample</button>
                    </div>
                  ))}
                </div>
                <div className="ca-alert-acts">
                  <button className="dow-btn red sm" onClick={onOpenOrder} style={{ background: "var(--k-spruce-60)" }}>Keep XLT 8677 · view order →</button>
                  <button className="cx2-alt" onClick={() => setMode("alert")}>Back</button>
                </div>
                <div className="cx2-parsed-note"><Icon name="information" size={12} /> Every alternative is pre-checked against your covenant and ship-to by the spine — a requested sample is added to PO 8841 · trace {D.event.trace}.</div>
              </div>
            </div>
          </div>
        ) : mode === "ask" ? (
          <div className="cx2-hello fade-in">
            <span className="eyebrow2"><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Dow ChemAssist · {cx.account}</span>
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
                      Got it — a <strong>cold-weather injection-molded TPO fascia</strong> shipping to Germany. Here's what I read from your brief, no forms needed:
                    </div>
                    <ParsedChips items={cx.parsed} />
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Market, submarket and application inferred — you never had to pick them.</div>
                    {(mode === "thinking") && <Thinking steps={cx.thinking} done={thinkDone} />}
                    {(mode === "decision" || mode === "requested" || mode === "track") && (
                      <React.Fragment>
                        <Thinking steps={cx.thinking} done={true} />
                        <div className="ag-say" style={{ marginTop: 16 }}>
                          One grade leads on exactly the property that decides this part — cold-temperature impact while you down-gauge. Here's the call:
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
                    <div className="ag-say"><strong>Yes — your 18-Jun delivery on PO 8841 holds.</strong> The Terneuzen feedstock disruption hit the plant that normally makes your grade, but the spine already re-sourced you to Freeport. Same grade, same spec, same date.</div>
                    <div className="ca-order" style={{ marginTop: 12 }}>
                      <span className="ca-ord-ic"><Icon name="checkmark-filled" size={15} /></span>
                      <div className="ca-ord-main"><div className="ca-ord-n">PO 8841 · ENGAGE™ XLT 8677 · due 18 Jun</div><div className="ca-ord-m">Re-sourced · 42 t · DAP Ingolstadt</div></div>
                      <span className="ca-ord-link">Date held</span>
                    </div>
                    <div className="ca-alert-acts"><button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={onOpenOrder}>View order status →</button><button className="cx2-alt" onClick={() => setMode("alts")}>See alternative grades</button></div>
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Same record Dow's planners are working from · {D.event.trace}.</div>
                  </React.Fragment>
                ) : intent === "switch" ? (
                  <React.Fragment>
                    <div className="ag-say">Your <strong>ENGAGE™ XLT 8677</strong> on PO 8841 is already covered by the Freeport reroute — no switch needed. If you still want a faster in-stock option, these are spec-compatible and need <strong>no re-qualification</strong>:</div>
                    <div className="ca-alts">
                      {cx.decision.alternatives.map((a, i) => (
                        <div className="ca-alt-row" key={i}>
                          <span className="ca-alt-ic"><Icon name="network" size={14} /></span>
                          <div className="ca-alt-main"><div className="ca-alt-n">{a.name}</div><div className="ca-alt-note">{a.note}</div></div>
                          <span className="ca-alt-stock"><span className="dot" /> In stock</span>
                          <button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={() => requestSample(a.name)}>Request sample</button>
                        </div>
                      ))}
                    </div>
                    <div className="cx2-parsed-note"><Icon name="information" size={12} /> Pre-checked against your covenant + ship-to · a requested sample is added to PO 8841.</div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="ag-say">Here's everything in your contract touched by the Terneuzen feedstock alert. The spine is already acting on each:</div>
                    <div className="ca-exposure">
                      {cx.exposure.map((e, i) => (
                        <div className="ca-exp-row" key={i}>
                          <span className={`ca-exp-bar ${e.tone}`} />
                          <div className="ca-exp-main"><div className="ca-exp-sku">{e.sku}</div><div className="ca-exp-note">{e.order} · {e.note}</div></div>
                          <span className={`ca-exp-st ${e.tone}`}>{e.status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ca-alert-acts"><button className="dow-btn red sm" style={{ background: "var(--k-spruce-60)" }} onClick={onOpenOrder}>View order status →</button><button className="cx2-alt" onClick={() => setLens("ops")}>Open the operator view →</button></div>
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
            <input value={input} placeholder={mode === "ask" ? "Describe what you're building…" : "Ask a follow-up, or refine your brief…"}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && input.trim()) ask(input.trim()); }} />
            <button className="cx2-send" disabled={!input.trim()} onClick={() => input.trim() && ask(input.trim())}>
              <Stroke size={17} d="M5 12h14M13 6l6 6-6 6" />
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 9, fontSize: 11, color: "var(--fg-subtle)" }}>
            Trace <span style={{ fontFamily: "var(--font-mono)" }}>{D.event.trace}</span> — same record Dow's planners work from · <span className="spruce-link" onClick={() => setLens("ops")}>see the operator view</span>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- ChemAssist slide-in panel ---------- */
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
              <span className="ca-h1">Dow ChemAssist</span>
              <span className="ca-h2">AI Ready Beta · powered by the agentic spine</span>
            </div>
            <button className="ca-x" onClick={onClose} aria-label="Close ChemAssist"><Icon name="close" size={16} /></button>
          </header>
          <div className="ca-disclaimer"><Icon name="information" size={12} /> Answers are AI-generated and may not be complete or up to date. By using ChemAssist you agree to Dow's Data Privacy Notice and Terms of Use.</div>
          {open && <ChemAssistFlow key={initial} toast={toast} setLens={setLens} initial={initial} onOpenOrder={onOpenOrder} setNaphtha={setNaphtha} />}
        </aside>
      </React.Fragment>
    );
  }

  /* ---------- Site-wide disruption banner (Brandt) ---------- */
  function DisruptionBanner({ secured, onView }) {
    return (
      <div className="dow-disrupt">
        <div className="dow-disrupt-in">
          <span className="ddx-ic"><Icon name="information" size={15} /></span>
          <div className="ddx-tx">
            <b>Heads up, Brandt Automotive —</b> a supply disruption affected the plant that makes your ENGAGE™ grade. {secured ? "We re-sourced your order and your 18-Jun date holds." : "We're re-sourcing your order now to protect your date."}
          </div>
          <button className="dow-btn red sm" onClick={onView}>View order status</button>
        </div>
      </div>
    );
  }

  /* ---------- Order status — the customer end of the supply event ---------- */
  function OrderStatus({ naphtha, setNaphtha, toast, onAsk, onHome, goLearning }) {
    const secured = naphtha.secured, acked = naphtha.acked;
    const [why, setWhy] = React.useState(false);
    const [pref, setPref] = React.useState(null);
    const PREFS = [
      { id: "auto", t: "Auto-approve covenant-safe reroutes", d: "If my grade and spec are preserved, just do it — don't make me wait.", delta: "auto-approve branch when grade + spec preserved" },
      { id: "call", t: "Always call me first", d: "Notify my account team before any sourcing change.", delta: "mandatory human-notify gate before commit" },
      { id: "sub", t: "Allow an equivalent grade", d: "If it protects my date and meets spec, a validated substitute is fine.", delta: "permit validated grade substitution" },
    ];
    function choosePref(p) {
      setPref(p);
      setNaphtha && setNaphtha(n => ({ ...n, learned: { id: p.id, title: p.t, delta: p.delta, at: "Just now" } }));
      toast("Saved as a policy proposal — routed to your Dow policy owner.", { label: "See it in “Learned from you” →", onClick: () => goLearning && goLearning() });
    }
    const steps = [
      { t: "Order confirmed", d: "ENGAGE™ XLT 8677 · 42 t · PO 8841", state: "done", at: "02 Jun" },
      { t: "Supply event detected", d: "A feedstock disruption hit the plant that normally makes your grade.", state: "done", at: "06:14" },
      { t: "Re-sourced for you", d: "We moved your order to another Dow plant so the disruption wouldn't move your date — same grade, same spec.", state: "done", at: "06:34" },
      { t: secured ? "Delivery date secured" : "Securing your date…", d: secured ? "Your 18-Jun delivery holds. No action needed." : "Final confirmation in progress — your account team is signing off now.", state: secured ? "active" : "pending", at: secured ? "07:09" : "—" },
    ];
    function accept() {
      setNaphtha(n => ({ ...n, acked: true }));
      toast(secured ? "Thanks — you've accepted the secured plan. Your account team has been notified."
                    : "Pre-approved — your order confirms automatically the moment sourcing commits.");
    }
    return (
      <div className="dow-page ord">
        <div className="dow-crumbs"><span className="ord-back" onClick={onHome}>Home</span> <span>›</span> My orders <span>›</span> <b>PO 8841</b></div>
        <div className="ord-head">
          <div>
            <h1>Your order is on track</h1>
            <div className="ord-sub">Brandt Automotive · PO 8841 · ENGAGE™ XLT 8677</div>
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
                <div className="opl-lbl">Your delivery date</div>
                <div className="opl-date">18 June 2026</div>
                <div className="opl-note">{secured ? "Held through the disruption — unchanged from your original date." : "We're protecting this date right now."}</div>
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
                <Icon name="information" size={13} /> Why did my order change? <Stroke className="oww-chev" size={13} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />
              </button>
              {why && (
                <div className="ord-why-body">
                  A supply disruption affected the plant that normally makes your grade. Dow re-sourced your order to another plant and re-checked it against your contract terms, so your delivery date didn't move. You don't need to do anything.
                  <div className="oww-ref">Reference · TRC-2026-0617</div>
                </div>
              )}
            </div>

            {/* feedback → PAC: the customer's preference becomes a proposed policy rule */}
            <div className="ord-pac-card">
              <div className="opc-h"><Icon name="recommend" size={14} /> Make this automatic next time</div>
              {!pref ? (
                <React.Fragment>
                  <div className="opc-sub">Tell us how you'd like disruptions like this handled for your account. Your choice becomes a policy your Dow team reviews — then it just happens.</div>
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
                  <div className="opc-rule"><span className="opc-rule-id">PROD-covenant-brandt</span> <span className="opc-plus">+ {pref.delta}</span></div>
                  <div className="opc-flow">
                    <span className="opc-step done">Your preference</span>
                    <Stroke size={12} sw={2.2} children={<polyline points="9 6 15 12 9 18" />} />
                    <span className="opc-step now">Policy-owner sign-off</span>
                    <Stroke size={12} sw={2.2} children={<polyline points="9 6 15 12 9 18" />} />
                    <span className="opc-step">Live in PAC</span>
                  </div>
                  <div className="opc-note">A test case was generated and it's queued in the operator's “Learned from you” inbox. Once your Dow policy owner approves it, your next disruption resolves this way automatically — no waiting.</div>
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
                <div className="od-acked"><Icon name="checkmark-filled" size={16} style={{ color: "var(--k-status-success-100)" }} /> {secured ? "You accepted the secured plan. Your account team has been notified." : "Pre-approved — confirms automatically the moment sourcing commits."}</div>
              ) : (
                <React.Fragment>
                  <div className="od-b">{secured ? "Your re-sourced order is ready to confirm. Same grade, same 18-Jun date." : "Sourcing is still committing. You can pre-approve now and we'll confirm the moment it lands — no need to wait."}</div>
                  <button className="dow-btn red" onClick={accept} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
                    <Icon name="checkmark-filled" size={15} /> {secured ? "Accept the secured plan" : "Pre-approve the reroute"}
                  </button>
                  <button className="dow-btn ghost sm" onClick={onAsk} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Request a change in ChemAssist</button>
                </React.Fragment>
              )}
            </div>
            <button className="ord-ask" onClick={onAsk}><span className="ai-glyph" style={{ width: 14, height: 14 }} /> Ask ChemAssist about this order</button>
            {(naphtha.samples || []).length > 0 && (
              <div className="ord-samples">
                <div className="os-h"><Icon name="checkmark-filled" size={13} style={{ color: "var(--k-spruce-60)" }} /> Samples added via ChemAssist</div>
                {naphtha.samples.map((s, i) => (
                  <div className="os-row" key={i}>
                    <span className="os-grade">{s.grade}</span>
                    <span className="os-qty">{s.qty}</span>
                    <span className="os-id">{s.id}</span>
                  </div>
                ))}
                <div className="os-note">Ships with PO 8841 · covenant-checked by the spine.</div>
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

    // entry leads with ChemAssist surfacing the disruption (once per session, unless handed off to order)
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
            <span className="dow-spark">✦</span> Ask ChemAssist <span className="ca-launch-beta">BETA</span>
          </button>
        )}
        <SampleCart open={cartOpen} onClose={() => setCartOpen(false)} toast={toast} onAsk={() => { setCartOpen(false); openAssist(); }} />
        <ChemAssistPanel open={assist} onClose={() => setAssist(false)} toast={toast} setLens={setLens} initial={caInit} onOpenOrder={openOrder} setNaphtha={setNaphtha} />
      </div>
    );
  }
  UI.ScreenCustomer = ScreenCustomer;
})();
