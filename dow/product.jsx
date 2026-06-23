/* ============================================================
   Product — detail page (overview, properties, docs, samples)
   with an AI side card and related grades.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke } = UI;

  const TABS = [["overview", "Overview", "information"], ["props", "Properties", "document-chart"], ["docs", "Technical content", "document-chart"], ["samples", "Sample & buy", "recommend"]];

  function Product({ id, onNav, onAskAgent, toast }) {
    const D = window.DX;
    const p = D.productById(id) || D.products[0];
    const docs = D.docsFor(p), samples = D.samplesFor(p);
    const related = D.products.filter(x => x.app === p.app && x.id !== p.id).concat(D.products.filter(x => x.app !== p.app)).slice(0, 3);
    const [tab, setTab] = React.useState("overview");
    React.useEffect(() => { setTab("overview"); }, [id]);

    return (
      <div className="dx-scroll fade-in">
        <div className="dx-wrap">
          <div className="dx-crumb"><a onClick={() => onNav({ name: "home" })}>Home</a> <span className="sep">›</span> Products <span className="sep">›</span> Elastomers & Plastomers <span className="sep">›</span> <b>{p.name}</b></div>

          <div className="dx-prod-head">
            <div className="dx-prod-hero" style={{ background: `linear-gradient(135deg, ${p.accent}, #14171C)` }}>{p.logo ? <img className="plogo" src={p.logo} alt={p.name} /> : <span className="glyph">{p.name.split(" ")[0][0]}</span>}</div>
            <div className="dx-prod-info">
              <div className="fam">{p.family}</div>
              <h1>{p.name}</h1>
              <div className="lead">{p.tagline}</div>
              <div className="dx-prod-quick">
                {["SDS / TDS", "Find a distributor", "Product uses policy"].map(q => <span className="dx-qi" key={q}><Icon name="document-chart" size={13} /> {q}</span>)}
              </div>
              <div className="dx-prod-cta">
                <button className="dx-btn red" onClick={() => setTab("samples")}><Stroke size={16} d="M6 6h15l-1.5 9h-12z" /> Sample & Buy</button>
                <button className="dx-btn ghost" onClick={() => setTab("docs")}>Documents</button>
                <button className="dx-btn ai" onClick={() => onAskAgent({ intent: "selector", text: `Is ${p.name} right for my application?`, fresh: true })}><span className="dx-spark">✦</span> Ask ChemAssist</button>
              </div>
            </div>
          </div>

          <div className="dx-prodgrid2">
            <div>
              <div className="dx-tabs">
                {TABS.map(t => <button key={t[0]} className={`dx-tab ${tab === t[0] ? "on" : ""}`} onClick={() => setTab(t[0])}><Icon name={t[2]} size={15} /> {t[1]}</button>)}
              </div>

              {tab === "overview" && (
                <div className="dx-prose fade-in">
                  <p>{p.blurb}</p>
                  <div className="dx-bullets">
                    {p.bullets.map((b, i) => <div className="dx-bullet" key={i}><Icon name="checkmark-filled" size={15} /> {b}</div>)}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
                    {p.tags.map((t, i) => <span className="dx-pchip" key={i}>{t}</span>)}
                  </div>
                </div>
              )}
              {tab === "props" && (
                <table className="dx-proptbl fade-in">
                  <thead><tr><th>Property</th><th>Typical value</th><th>Unit</th><th>Method</th></tr></thead>
                  <tbody>{p.props.map((r, i) => <tr key={i}><td>{r[0]}</td><td className="pv">{r[1]}</td><td>{r[2]}</td><td className="pm">{r[3]}</td></tr>)}</tbody>
                </table>
              )}
              {tab === "docs" && (
                <div className="dx-docs fade-in">
                  {docs.map((d, i) => (
                    <div className="dx-doc" key={i}>
                      <span className="di"><Icon name="document-chart" size={16} /></span>
                      <span className="dmain"><b>{d[0]}</b><span>{d[1]} · {d[2]}</span></span>
                      <div className="dr">
                        <button className="summ" onClick={() => onAskAgent({ intent: "formulation", text: `Summarize the ${d[0]} for ${p.name}`, fresh: true })}><span className="dx-spark">✦</span> Summarize</button>
                        <button className="dl" aria-label="Download"><Stroke size={15} d="M12 3v12M7 11l5 5 5-5M5 20h14" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "samples" && (
                <div className="fade-in">
                  <div className="dx-packs">
                    {samples.map((s, i) => (
                      <div className="dx-pack" key={i}>
                        <div className="sz">{s[0]}</div>
                        <div className="pl">{s[1]}</div>
                        <div className="av">{s[2]}</div>
                        <button className="dx-btn red sm" onClick={() => toast(`Sample of ${p.name} (${s[0]}) added to an experiment — tied to your application, not a cart.`, { label: "Ask ChemAssist →", onClick: () => onAskAgent({ intent: "experiment", text: `Build a sample experiment with ${p.name}`, fresh: true }) })}>Add to experiment</button>
                      </div>
                    ))}
                  </div>
                  <div className="dx-side-ai" style={{ marginTop: 16 }} onClick={() => onAskAgent({ intent: "experiment", fresh: true })}>
                    <div className="h"><span className="ai-glyph" /><b>Let ChemAssist set up the right experiment</b></div>
                    <p>It checks your case, picks the right pack size and lot, clears compliance, and tracks it for you.</p>
                    <button className="dx-btn ai sm"><span className="dx-spark">✦</span> Configure with ChemAssist</button>
                  </div>
                </div>
              )}
            </div>

            <aside className="dx-side">
              <div className="dx-sidecard">
                <h4>Buying & access</h4>
                <p>Your {D.account.company} account has sample access in {D.account.region}. Production volumes are quoted per project.</p>
                <button className="dx-btn ghost sm" style={{ width: "100%" }}>How to buy</button>
              </div>
              <div className="dx-side-ai" onClick={() => onAskAgent({ intent: "selector", text: `Compare ${p.name} with alternatives`, fresh: true })}>
                <div className="h"><span className="ai-glyph" /><b>Is this the right grade?</b></div>
                <p>Describe your application and ChemAssist will confirm the fit, compare alternatives and check compliance.</p>
                <button className="dx-btn ai sm"><span className="dx-spark">✦</span> Ask ChemAssist</button>
              </div>
            </aside>
          </div>
        </div>

        <section className="dx-band">
          <div className="dx-wrap dx-related">
            <h2 className="dx-h2" style={{ fontSize: 22 }}>Related grades</h2>
            <div className="dx-relgrid">
              {related.map(rp => {
                if (!rp) return null;
                return (
                  <div className="dx-pcard" key={rp.id} onClick={() => onNav({ name: "product", id: rp.id })}>
                    <div className="pbody">
                      <div className="dx-picon" style={{ background: `color-mix(in srgb, ${rp.accent} 8%, #fff)`, color: rp.accent }}><Icon name={rp.icon || "recommend"} size={22} /></div>
                      <div className="pn">{rp.name}</div><div className="ptag">{rp.tagline}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.Product = Product;
})();
