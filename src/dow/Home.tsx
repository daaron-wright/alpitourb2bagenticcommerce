import React from 'react';
import { Icon, Stroke, RecommendationGraph } from './Primitives';
import { Footer } from './Chrome';
import { DX } from './data';

function otherJobTiles(persona: string) {
  const order = ["explorer", "builder", "buyer", "operator", "evaluator", "approver", "sponsor"].filter(p => p !== persona);
  return order.map(p => (DX.suggestions[p] || [])[0]).filter(Boolean);
}

export function Home({ onNav, onSearch, onAskAgent, persona }: any) {
  const t = DX.typeById(persona) || DX.customerTypes[0];
  const sugs = DX.suggestions[persona] || DX.suggestions.explorer;
  return (
    <div className="dx-scroll fade-in">
      {/* hero */}
      <section className="dx-hero">
        <image-slot id="dx-hero-bg" shape="rect" placeholder="Drop a hero image (optional)" />
        <div className="dx-hero-in">
          <div className="eyb">Seek Together™</div>
          <h1>The science behind what moves you forward.</h1>
          <p>From footwear to packaging and mobility, Dow's materials science helps you build lighter, tougher, more sustainable products — now with an AI agent that works the way you do.</p>
          <div className="dx-hero-cta">
            <button className="dx-btn ai lg" onClick={() => onAskAgent({ fresh: true })}><span className="dx-spark">✦</span> Ask ChemAssist</button>
            <button className="dx-btn ghost lg" style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.5)", color: "#fff" }} onClick={() => onSearch("seal resin for flexible food packaging below 120°C")}>Find a material</button>
          </div>
        </div>
      </section>

      {/* persona-aware welcome-back */}
      <div className="dx-wrap">
        <div className="dx-welcome">
          <div className="dx-welcome-in">
            <div className="dx-welcome-head">
              <span className="dx-welcome-av"><span className="ai-glyph" /></span>
              <div>
                <div className="wt">Welcome back, {DX.account.first}.</div>
                <div className="ws">{DX.account.role} · {DX.account.company} — one Dow polyolefin-elastomer platform across your footwear, packaging and mobility lines. I follow every application and adapt — discover, sample, troubleshoot, scale.</div>
              </div>
              <button className="dx-btn ai sm open" onClick={() => onAskAgent({ fresh: true })}><span className="dx-spark">✦</span> Open ChemAssist</button>
            </div>
            <div className="dx-sugs">
              {sugs.concat(otherJobTiles(persona)).slice(0, 3).map((s: any) =>
                <button className="dx-sug" key={s.id} onClick={() => onAskAgent({ intent: s.intent, text: s.text, code: s.code, compose: s.compose, placeholder: s.placeholder, fresh: true })}>
                  <span className="si"><Icon name={s.icon} size={16} /></span>
                  <span className="st">{s.title}</span>
                  <span className="sb">{s.body}</span>
                  <span className="sc">Start <Stroke size={12} d="M5 12h14M13 6l6 6-6 6" /></span>
                </button>
              )}
            </div>
            <div className="dx-jobsrow">
              <span className="jl">Jobs ChemAssist handles:</span>
              {DX.customerTypes.map(ct =>
                <button key={ct.id} className={`dx-jobpill ${persona === ct.id ? "on" : ""}`} onClick={() => { const sg = (DX.suggestions[ct.id] || [{}])[0]; onAskAgent({ intent: ct.mode, text: sg.text, code: sg.code, compose: sg.compose, placeholder: sg.placeholder, fresh: true }); }} title={ct.job}>
                  <Icon name={ct.icon} size={12} /> {ct.name.replace(" / PO Buyer", "").replace("Plant-Floor ", "")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* industries */}
      <section className="dx-wrap dx-section">
        <div className="dx-eyebrow">Industries & markets</div>
        <h2 className="dx-h2">Materials for what you make</h2>
        <div className="dx-indgrid">
          {DX.industries.map(ind =>
            <div className="dx-ind" key={ind.id} style={{ "--ind-a": ind.accent } as any} onClick={() => onSearch("seal resin for flexible food packaging below 120°C")}>
              <span className="ic"><Icon name={ind.icon} size={18} /></span>
              <span className="nm" style={{ color: "rgb(0, 0, 0)" }}>{ind.name}</span>
              <span className="bl">{ind.blurb}</span>
              <span className="go">Explore <Stroke size={13} d="M5 12h14M13 6l6 6-6 6" /></span>
            </div>
          )}
        </div>
      </section>

      {/* value band */}
      <section className="dx-band">
        <div className="dx-wrap dx-section">
          <div className="dx-eyebrow">A new way to work with Dow</div>
          <h2 className="dx-h2">From "search & call us" to an agent that acts</h2>
          <div className="dx-valgrid">
            {[
              { i: "recommend", h: "Describe, don't decode", p: "Tell ChemAssist what you're building — or show a photo, sketch or video. It turns intent into a material brief." },
              { i: "lightbulb", h: "Samples as experiments", p: "Each sample is tied to a business application and test objective. Feed back results; the agent suggests the next round." },
              { i: "network", h: "Conversation to action", p: "Quote, PO, reorder, escalate to a Dow expert, troubleshoot a line — one flow, compliance checked along the way." }].
              map((v, i) =>
                <div className="dx-val" key={i}><span className="vi"><Icon name={v.i} size={20} /></span><h3>{v.h}</h3><p>{v.p}</p></div>
              )}
          </div>
        </div>
      </section>

      {/* recommendation graph */}
      <section className="dx-wrap dx-section">
        <RecommendationGraph />
      </section>

      {/* seek together */}
      <section className="dx-seek">
        <div className="dx-seek-in">
          <h2>Seek Together™</h2>
          <p>The biggest challenges are solved in partnership. Bring your hardest material problem — ChemAssist and Dow's experts will help you solve it.</p>
          <button className="dx-btn ghost lg" onClick={() => onAskAgent({ fresh: true })}><span className="dx-spark">✦</span> Start with ChemAssist</button>
        </div>
      </section>

      <Footer onNav={onNav} />
    </div>
  );
}
