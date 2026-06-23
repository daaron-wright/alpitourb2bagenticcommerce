import React from 'react';
import { Icon, Stroke } from './Primitives';
import { DX } from './data';

const NAV = ["Industries & Markets", "Products", "Sustainability", "Innovation", "Support"];

export function UtilityBar({ onNav, onGoOperator, onOpenAlert }: any) {
  return (
    <div className="dx-util">
      <div className="dx-util-in">
        <a onClick={() => onNav({ name: "cases" })}>My cases</a>
        <a onClick={() => onNav({ name: "history", code: "CASE-02111" })}>Case history</a>
        <a onClick={() => onNav({ name: "samplelab", code: "CASE-02111" })}>Sample experiments</a>
        <a onClick={() => onNav({ name: "o2c" })}>Orders</a>
        <div className="dx-util-right">
          <button className="dx-regbell" onClick={onOpenAlert} title="RegRadar regulatory alert">
            <Icon name="anomaly" size={13} /> RegRadar<span className="dot" />
          </button>
          <span className="div" />
          <button onClick={() => onNav({ name: "account" })}><Icon name="group" size={12} /> Mara Lin · Brandt Industries</button>
          <span className="div" />
          <div className="lens-toggle" role="tablist" aria-label="Lens">
            <button className="lens-opt ops" onClick={() => onGoOperator("spine")}><Icon name="dashboard" size={15} /> Operator <small>· back end</small></button>
            <button className="lens-opt cx on"><Icon name="group" size={15} /> Customer <small>· front end</small></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Masthead({ onNav, onSearch, onAskAgent, cartCount }: any) {
  const [q, setQ] = React.useState("");
  const [mega, setMega] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setMega(null); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  function submit() { if (q.trim()) { onSearch(q.trim()); setQ(""); } else onAskAgent({ intent: null, fresh: true }); }
  return (
    <header className="dx-head" ref={ref}>
      <div className="dx-head-in">
        <img className="dx-logo" src="assets/dow-logo.png" alt="Dow" onClick={() => onNav({ name: "home" })} />
        <nav className="dx-nav">
          {NAV.map(n => {
            const hasMega = n === "Products" || n === "Industries & Markets";
            return (
              <button key={n} className="dx-navi" onClick={() => hasMega ? setMega(mega === n ? null : n) : onNav({ name: "home" })}>
                {n} {hasMega && <Stroke size={9} d="M6 9l6 6 6-6" />}
              </button>
            );
          })}
        </nav>
        <div className="dx-head-sp" />
        <div className="dx-search">
          <input placeholder="Search products, applications…" value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }} />
          <button className="dx-search-go" onClick={submit} aria-label="Search"><Stroke size={16} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></button>
        </div>
        <div className="dx-head-actions">
          <button className="dx-iconbtn" title="Sample experiments" onClick={() => onNav({ name: "samplelab", code: "CASE-02111" })}>
            <Icon name="lightbulb" size={20} />
            {cartCount > 0 && <span className="dx-cartn">{cartCount}</span>}
          </button>
          <button className="dx-iconbtn" title="My cases" onClick={() => onNav({ name: "cases" })}>
            <Icon name="document-chart" size={20} />
          </button>
        </div>
      </div>

      {mega && (
        <div className="dx-mega fade-in">
          <div className="dx-mega-in">
            {mega === "Products" ? (
              <React.Fragment>
                <div className="dx-mega-col">
                  <h4>Elastomers & Plastomers</h4>
                  {DX.products.map(p => <a key={p.id} onClick={() => { onNav({ name: "product", id: p.id }); setMega(null); }}>{p.name}</a>)}
                </div>
                <div className="dx-mega-col">
                  <h4>By application</h4>
                  <a onClick={() => { onSearch("foam for high-impact basketball use"); setMega(null); }}>Footwear foams</a>
                  <a>Automotive TPO</a>
                  <a>Food-contact packaging</a>
                  <a>Adhesives & sealants</a>
                </div>
                <div className="dx-mega-col">
                  <h4>Resources</h4>
                  <a>Technical data sheets</a>
                  <a>Safety data sheets (SDS)</a>
                  <a>Application guides</a>
                  <a onClick={() => { onNav({ name: "samplelab", code: "CASE-02111" }); setMega(null); }}>Sample lab</a>
                  <a onClick={() => { onNav({ name: "cases" }); setMega(null); }}>My application cases</a>
                </div>
              </React.Fragment>
            ) : (
              DX.industries.slice(0, 3).map((ind) => (
                <div className="dx-mega-col" key={ind.id}>
                  <h4>{ind.name}</h4>
                  <a onClick={() => { onSearch("foam for high-impact basketball use"); setMega(null); }}>Explore materials</a>
                  <a>Case studies</a>
                  <a>Talk to an expert</a>
                </div>
              ))
            )}
            <div className="dx-mega-feat">
              <span className="ai-glyph" />
              <h5>Not sure where to start?</h5>
              <p>Describe what you're building and ChemAssist finds the right material, checks compliance and sets up a sample.</p>
              <button className="dx-btn ai sm" onClick={() => { onAskAgent({ intent: null, fresh: true }); setMega(null); }}><span className="dx-spark">✦</span> Ask ChemAssist</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer({ onNav }: any) {
  const cols = [
    { t: "Products", items: ["Product Finder", "Elastomers", "Packaging", "Silicones"] },
    { t: "Industries", items: ["Footwear", "Mobility", "Construction", "Electronics"] },
    { t: "Resources", items: ["Technical Library", "SDS Search", "Sample & Buy", "Distributors"] },
    { t: "Company", items: ["About Dow", "Sustainability", "Investors", "Careers"] },
  ];
  return (
    <footer className="dx-foot">
      <div className="dx-foot-in">
        <div className="dx-foot-brand">
          <img className="dx-logo" src="assets/dow-logo.png" alt="Dow" />
          <div className="seek">Seek Together™</div>
        </div>
        {cols.map(c => (
          <div className="dx-foot-col" key={c.t}>
            <h4>{c.t}</h4>
            {c.items.map(i => <a key={i}>{i}</a>)}
          </div>
        ))}
      </div>
      <div className="dx-foot-bar">
        <div className="dx-foot-bar-in">
          <span>© 1995–2026 The Dow Chemical Company</span>
          <span className="sp" />
          <span>®™ Trademark of Dow or an affiliated company of Dow</span>
          <span>Privacy</span><span>Terms of Use</span><span>Accessibility</span>
        </div>
      </div>
    </footer>
  );
}

export function Launcher({ onClick }: any) {
  return (
    <button className="dx-launcher" onClick={onClick}>
      <span className="ai-glyph" /> Ask ChemAssist <span className="pulse" />
    </button>
  );
}
