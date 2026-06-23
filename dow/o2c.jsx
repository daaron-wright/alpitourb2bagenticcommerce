/* ============================================================
   Reimagined Order-to-Cash — customer layer (UI.O2C).
   The order is no longer a back-office transaction: it's a live,
   event-driven, promise-accurate, self-serviceable revenue object.
   Anchored on PO-48261. Customer Intent → Orchestration → Dynamic
   Commitment → Autonomous Fulfilment → Visibility → Predictive
   Revenue → Continuous Engagement.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke, AiSpinner } = UI;

  const CHAN = {
    system: { label: "Orchestration", color: "#6B36A8", tint: "#F0E6FA", icon: "document-chart" },
    plant: { label: "Plant", color: "#B42318", tint: "#FEE9E7", icon: "warning-alt" },
    logistics: { label: "Logistics", color: "#0E7490", tint: "#E0F2F4", icon: "network" },
    portal: { label: "You", color: "#29707A", tint: "var(--k-ai-spruce-12)", icon: "chat-bot" },
  };

  function FlowSpine({ stages, nowStage }) {
    return (
      <div className="dx-o2cflow">
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`o2cnode ${s.done ? "done" : s.now ? "now" : ""}`}>
              <span className="dot">{s.done ? <Stroke size={11} sw={3} children={<polyline points="20 6 9 17 4 12" />} /> : s.now ? <span className="pulse" /> : i + 1}</span>
              <span className="lb">{s.k}</span>
              <span className="sb">{s.sub}</span>
              <span className="dt">{s.date}</span>
            </div>
            {i < stages.length - 1 && <span className={`o2cbar ${i < nowStage ? "done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  function EventRow({ ev }) {
    const D = window.DX;
    const ch = CHAN[ev.chan] || CHAN.system;
    const chain = (ev.chain || []).map(id => D.agentById(id)).filter(Boolean);
    return (
      <div className="dx-o2cev fade-in">
        <span className="ei" style={{ background: ch.tint, color: ch.color }}><Icon name={ev.icon} size={14} /></span>
        <div className="eb">
          <div className="et">{ev.title}<span className={`echip ${ev.tone}`}>{ch.label}</span></div>
          <div className="ed">{ev.detail}</div>
          {chain.length > 0 && (
            <div className="dx-evchain">
              {ev.evt && <span className="evid" title="Same event id in the operator spine">{ev.evt}</span>}
              <span className="cl">agents</span>
              {chain.map((a, i) => (
                <React.Fragment key={a.id}>
                  <span className="ca" style={{ background: a.tint, color: a.color }} title={`${a.name} · spine node: ${a.node}`}><Icon name={a.icon} size={10} /> {a.name}</span>
                  {i < chain.length - 1 && <span className="car">→</span>}
                </React.Fragment>
              ))}
              <a className="evspine" onClick={() => window.DX.toOperator("spine", "KAF-5B70-1180")}>in the spine ↗</a>
            </div>
          )}
        </div>
        <span className="ets">{ev.ts}</span>
      </div>
    );
  }

  function O2C({ onNav, onAskAgent, toast }) {
    const D = window.DX;
    const o = D.o2c;
    const p = D.productById(o.productId);
    const live = window.DXLive.use();
    const nowStage = live.orderStage != null ? live.orderStage : o.nowStage;
    const stages = live.orderStage != null ? o.stages.map((s, i) => ({ ...s, done: i < nowStage, now: i === nowStage })) : o.stages;

    // live event stream — events reveal over time
    const [shown, setShown] = React.useState(o.events.length);
    const [extra, setExtra] = React.useState([]);        // simulated events appended
    const [promise, setPromise] = React.useState(o.promise);
    const timers = React.useRef([]);
    React.useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

    function streamReplay() {
      setShown(0); setExtra([]);
      o.events.forEach((ev, i) => timers.current.push(setTimeout(() => { setShown(i + 1); }, 900 * (i + 1))));
    }

    function simulate(s) {
      const ev = { ts: "now", icon: s.icon, chan: s.id === "outage" ? "plant" : s.id === "late" ? "logistics" : "portal", title: s.title, detail: s.detail, tone: s.tone, evt: s.evt, chain: s.chain };
      setExtra(e => [...e, ev]);
      setPromise(pr => ({ ...pr, predicted: s.promise, accuracy: s.acc, status: s.promise === pr.committed ? "on-track" : "shifted" }));
      toast(s.title);
    }

    // self-service change → ATP recalculation
    const [qty, setQty] = React.useState(o.atp.baseQty);
    const recalc = React.useMemo(() => {
      const over = Math.max(0, qty - o.atp.inStock);
      const extraDays = Math.ceil(over / 150);
      const base = 15; // 15 May
      const day = base + (qty > o.atp.baseQty ? Math.max(0, extraDays) : 0) + (qty > o.atp.baseQty && over === 0 ? 1 : 0);
      const acc = qty <= o.atp.inStock ? (qty === o.atp.baseQty ? 97 : 94) : 88;
      return { date: `${day} May`, acc, changed: qty !== o.atp.baseQty, inStock: qty <= o.atp.inStock };
    }, [qty]);

    const allEvents = [...o.events.slice(0, shown), ...extra, ...live.extraOrderEvents];

    return (
      <div className="dx-scroll fade-in">
        {/* header */}
        <div className="dx-o2c-head">
          <div className="dx-wrap">
            <div className="dx-crumb" style={{ paddingBottom: 12 }}><a onClick={() => onNav({ name: "account" })}>Orders</a> <span className="sep">›</span> <b>{o.po}</b></div>
            <div className="dx-o2c-top">
              <span className="oi" style={{ background: `linear-gradient(to bottom right, ${p.accent}, #14171C)` }}>{p.logo ? <img className="plogo" src={p.logo} alt={p.product} /> : <b>{o.product[0]}</b>}</span>
              <div style={{ flex: 1 }}>
                <div className="cid">{o.po} · {o.account} · placed {o.placed}</div>
                <h1>{o.product} · {o.qty}</h1>
                <div className="meta">{o.value} · {o.incoterms} · {o.terms} · lot {o.lot} · <a onClick={() => onNav({ name: "history", code: o.case })}>case {o.case}</a></div>
              </div>
              <div className="dx-o2c-promise">
                <div className="pl">Deliver-to-promise</div>
                <div className={`pv ${promise.status}`}>{promise.predicted}</div>
                <div className="pa"><span className="bar"><span style={{ width: promise.accuracy + "%" }} /></span>{promise.accuracy}% confidence</div>
                <div className="pn">{promise.status === "on-track" ? "On track" : "Re-committed — you were notified"}</div>
              </div>
            </div>
            <FlowSpine stages={stages} nowStage={nowStage} />
            <div className="dx-o2c-reframe">
              <span><Icon name="information" size={12} /> Customer Intent → AI Orchestration → Dynamic Commitment → Autonomous Fulfilment → Real-Time Visibility → Predictive Revenue → Continuous Engagement</span>
              <button className="dx-btn ghost sm" onClick={() => { window.location.href = "Dow Supply Chain on KAF.html"; }}><span className="ai-glyph" style={{ width: 13, height: 13 }} /> Operator orchestration ↗</button>
            </div>
          </div>
        </div>

        <div className="dx-wrap">
          <div className="dx-o2c-grid">
            <div>
              {/* live event stream */}
              <div className="dx-card">
                <div className="ch"><Icon name="network" size={16} style={{ color: "var(--dow-red)" }} /><h3>Live fulfilment — event-driven</h3>
                  <button className="more" onClick={streamReplay}>Replay</button></div>
                <p style={{ fontSize: 12.5, color: "var(--dx-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>No batch updates. Every supply, plant and logistics event re-checks your promise in real time — and tells you before anything slips.</p>
                <div className="dx-o2cstream">
                  {allEvents.map((ev, i) => <EventRow key={i} ev={ev} />)}
                  {shown < o.events.length && <div className="dx-o2cev pending"><span className="ei"><AiSpinner size={14} /></span><div className="eb"><div className="et">Orchestrating…</div></div></div>}
                </div>
                <div className="dx-o2csim">
                  <span className="sl">Simulate an event:</span>
                  {o.sim.map(s => <button key={s.id} className="simbtn" onClick={() => simulate(s)}><Icon name={s.icon} size={13} /> {s.label}</button>)}
                </div>
              </div>

              {/* self-service change → ATP */}
              <div className="dx-card">
                <div className="ch"><Icon name="recommend" size={16} style={{ color: "var(--dow-red)" }} /><h3>Change your order — instant re-commitment</h3></div>
                <p style={{ fontSize: 12.5, color: "var(--dx-muted)", margin: "0 0 14px", lineHeight: 1.5 }}>Adjust quantity and the supply digital twin re-checks available-to-promise live — no call, no ticket.</p>
                <div className="dx-atp">
                  <div className="aq">
                    <label>Quantity (kg)</label>
                    <input type="range" min="50" max="900" step="50" value={qty} onChange={e => setQty(+e.target.value)} />
                    <div className="aqv">{qty} kg <span>{recalc.inStock ? "in stock" : "exceeds on-hand — made to order"}</span></div>
                  </div>
                  <div className={`ar ${recalc.changed ? "changed" : ""}`}>
                    <div className="arl">Re-committed delivery</div>
                    <div className="arv">{recalc.date}</div>
                    <div className="arc"><span className="bar"><span style={{ width: recalc.acc + "%" }} /></span>{recalc.acc}% confidence</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="dx-btn red sm" disabled={!recalc.changed} onClick={() => { toast(`Order updated to ${qty} kg — re-committed for ${recalc.date}.`); }}>Apply change</button>
                  <button className="dx-btn ghost sm" onClick={() => onAskAgent({ intent: "order", text: "Change my INFUSE 9107 order", code: o.case, fresh: true })}><span className="dx-spark">✦</span> Ask ChemAssist</button>
                </div>
              </div>

              {/* invoice-to-pay */}
              <div className="dx-card">
                <div className="ch"><Icon name="document-chart" size={16} style={{ color: "var(--dow-red)" }} /><h3>Invoice & payment</h3><span className="b spruce" style={{ marginLeft: "auto" }}>{(live.invoiceStatus || o.invoice.status) === "scheduled" ? "Scheduled" : "Issued"}</span></div>
                <div className="dx-inv">
                  <div className="ir"><span className="k">Invoice</span><span className="v">{o.invoice.id}</span></div>
                  <div className="ir"><span className="k">Amount</span><span className="v">{o.invoice.amount}</span></div>
                  <div className="ir"><span className="k">Terms</span><span className="v">{o.invoice.terms}</span></div>
                </div>
                <div className="dx-o2cnote"><Icon name="information" size={13} /> {o.invoice.issue}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="dx-btn ghost sm" onClick={() => toast("Payment scheduled — Net 45.")}>Schedule payment</button>
                  <button className="dx-btn ghost sm" onClick={() => toast("Discrepancy flagged — AI pre-classified it; a resolution owner is assigned.")}>Flag a discrepancy</button>
                </div>
              </div>
            </div>

            {/* intelligence rail (predictive revenue + continuous engagement) */}
            <aside>
              <div className="dx-card">
                <div className="ch"><span className="ai-glyph" style={{ width: 15, height: 15 }} /><h3 style={{ marginLeft: 2 }}>Predictive intelligence</h3></div>
                {o.intelligence.map((it, i) => (
                  <div className={`dx-intel ${it.tone}`} key={i}>
                    <div className="ih"><Icon name={it.icon} size={14} /> <b>{it.title}</b><span className="iv">{it.value}</span></div>
                    <div className="idt">{it.detail}</div>
                  </div>
                ))}
              </div>
              <div className="dx-side-ai" onClick={() => onAskAgent({ intent: "order", text: "Reorder INFUSE™ 9107 before the price window closes", code: o.case, fresh: true })}>
                <div className="h"><span className="ai-glyph" /><b>Continuous engagement</b></div>
                <p>I watch your consumption and the price window, and prompt the reorder before you run low — turning this order into the next one.</p>
                <button className="dx-btn ai sm"><span className="dx-spark">✦</span> Prepare next reorder</button>
              </div>
            </aside>
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.O2C = O2C;
})();
