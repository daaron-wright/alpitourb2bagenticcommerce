/* ============================================================
   Search — semantic product-finder with an AI answer. Maps a
   free-text query to the relevant Dow grades.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke } = UI;

  function resolve(query) {
    const D = window.DX;
    const s = (query || "").toLowerCase();
    if (/foam|footwear|midsole|rebound|basketball|cushion/.test(s))
      return { answer: "For a high-rebound footwear midsole you want high energy return at low foamed density. Dow's INFUSE™ Olefin Block Copolymers lead — INFUSE™ 9107 returns up to 62% of impact energy at low density, and pairs with a softer grade for a dual-density stack.", ids: ["infuse-9107", "infuse-9007", "engage-7467"], match: ["Best match — leads on energy return at low foamed density", "Strong match — softer co-blow partner for dual-density", "Related — toughening elastomer"] };
    if (/auto|tpo|dashboard|cold|mobility|interior/.test(s))
      return { answer: "For a cold-weather automotive TPO you need an impact modifier that stays ductile at low temperature. ENGAGE™ 7467 has a very low glass-transition for cold-impact, and pairs with a softer grade for premium feel.", ids: ["engage-7467", "engage-8842", "infuse-9007"], match: ["Best match — cold-temperature impact modifier", "Strong match — soft-touch flexibiliser", "Related — flexible OBC"] };
    return { answer: "For a flexible food-packaging seal layer you want a low seal-initiation temperature with documented food-contact status. AFFINITY™ PL 1881G seals at ≈88 °C with high hot-tack and has EU 10/2011 documentation; AFFINITY™ PF 1140G is the broad-availability companion.", ids: ["affinity-1881", "affinity-1140", "engage-7467"], match: ["Best match — seals below 120 °C, EU food contact", "Strong match — broad EU stock", "Related — elastomer modifier"] };
  }

  const FACETS = [["Market", [["Packaging", 18], ["Footwear", 12], ["Automotive", 9]]], ["Performance", [["Low-temp seal", 7], ["High rebound", 11], ["Cold impact", 6]]], ["Family", [["Plastomer (POP)", 4], ["Block copolymer (OBC)", 5], ["Elastomer (POE)", 12]]]];

  function Search({ query, onNav, onSearch, onAskAgent }) {
    const D = window.DX;
    const r = resolve(query);
    const results = r.ids.map(D.productById);
    return (
      <div className="dx-scroll fade-in">
        <div className="dx-wrap">
          <div className="dx-crumb"><a onClick={() => onNav({ name: "home" })}>Home</a> <span className="sep">›</span> Product finder <span className="sep">›</span> <b>Results</b></div>
          <div className="dx-srhead"><div className="dx-srbar"><h2 className="dx-h2" style={{ fontSize: 24, margin: 0 }}>"{query || "seal resin for flexible food packaging"}"</h2><span className="dx-srcount">· {results.length} strong matches of 270 products</span></div></div>
          <div className="dx-srgrid">
            <aside className="dx-facets">
              {FACETS.map((f, i) => (
                <div key={i}><div className="fh">{f[0]}</div>{f[1].map((row, j) => <div className="dx-facet" key={j}><span className="cb" />{row[0]}<span className="fn">{row[1]}</span></div>)}</div>
              ))}
            </aside>
            <div className="dx-srmain">
              <div className="dx-answer">
                <span className="at"><span className="ai-glyph" style={{ width: 13, height: 13 }} /> ChemAssist answer</span>
                <div className="ab">{r.answer}</div>
                <div className="af"><button className="dx-btn ai sm" onClick={() => onAskAgent({ intent: "selector", text: query || "Find a seal resin for flexible food packaging below 120 °C", fresh: true })}><span className="dx-spark">✦</span> Turn this into a brief</button><span className="adis">AI-generated · semantic match across the Dow catalog. Review TDS before specifying.</span></div>
              </div>
              {results.map((p, i) => (
                <div className="dx-srcard" key={p.id}>
                  <div className="dx-picon" style={{ background: `color-mix(in srgb, ${p.accent} 8%, #fff)`, color: p.accent }}><Icon name={p.icon || "recommend"} size={30} /></div>
                  <div className="srmain">
                    <div className="srfam">{p.family}</div>
                    <div className="srn" onClick={() => onNav({ name: "product", id: p.id })}>{p.name}</div>
                    <div className="srd">{p.blurb}</div>
                    <div className="dx-srmatch"><Icon name="recommend" size={13} /> {r.match[i]}</div>
                    <div className="srfoot"><button className="dx-btn red sm" onClick={() => onNav({ name: "product", id: p.id })}>Sample & Buy</button><button className="dx-btn ghost sm" onClick={() => onNav({ name: "product", id: p.id })}>Documents</button></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.Search = Search;
})();
