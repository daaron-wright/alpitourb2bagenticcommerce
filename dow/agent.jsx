/* ============================================================
   ChemAssist agent — docked / fullscreen. Auto-detects the
   customer's JOB (1 of 7), adapts to the ENVIRONMENT
   (desk / lab / plant-floor), attaches every turn to an
   Application Case, and emits AG-UI events.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke, AiSpinner } = UI;

  // Calm, collapsible "how this was handled" — replaces the always-on colored agent row.
  function AgentTrace({ agents, lead }) {
    const [open, setOpen] = React.useState(false);
    if (!agents || !agents.length) return null;
    return (
      <div className={`dx-agtrace ${open ? "open" : ""}`}>
        <button className="dx-agtrace-h" onClick={() => setOpen(o => !o)}>
          <span className="ai-glyph" style={{ width: 12, height: 12 }} />
          Handled by {agents.length} Dow agent{agents.length > 1 ? "s" : ""}
          <Stroke className="chev" size={12} sw={2.4} children={<polyline points="6 9 12 15 18 9" />} />
        </button>
        {open && (
          <div className="dx-agtrace-b">
            {agents.map(a => (
              <div className="dx-agtrace-row" key={a.id}>
                <span className="dot" />
                <span className="nm">{a.name}{a.id === lead && <span className="lead">leads</span>}</span>
                <span className="tk">{a.task}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function Turn({ turn, env, onNav, onAsk, onAction, toast, pushAgui }) {
    const D = window.DX;
    const meta = window.DXA.INTENTS[turn.intent] || { agents: [] };
    const agentObjs = meta.agents.map(id => D.agents.find(a => a.id === id));
    const type = meta.type ? D.typeById(meta.type) : null;
    const c = turn.code ? D.caseByCode(turn.code) : null;
    return (
      <React.Fragment>
        {turn.user ? <div className="dx-msg-user">{turn.user}</div> : null}
        <div className="dx-msg-agent fade-in">
          <span className="av"><span className="ai-glyph" /></span>
          <div className="mbody">
            {turn.phase === "thinking" ? (
              <div className="dx-think"><div className="tr run"><AiSpinner size={14} /> {agentObjs[turn.cur] ? agentObjs[turn.cur].task[0].toUpperCase() + agentObjs[turn.cur].task.slice(1) + "…" : "Working…"}</div></div>
            ) : (
              <React.Fragment>
                {c && (
                  <div className="dx-jobline calm">
                    Linked to <span className="dx-casechip" onClick={() => onNav({ name: "case", code: c.code })}>{c.code}</span>
                  </div>
                )}
                <div className="dx-say">{window.DXA.sayFor(turn.intent, c)}</div>
                <window.DXA.IntentResult intent={turn.intent} c={c} env={env} onNav={onNav} onAsk={onAsk} onAction={onAction} toast={toast} pushAgui={pushAgui} />
                {meta.comply && (
                  <div style={{ marginTop: 8 }}>
                    <span className={`dx-comply ${meta.comply}`}>
                      <Icon name={meta.comply === "ok" ? "checkmark-filled" : "warning-alt"} size={13} />
                      {meta.comply === "ok" ? "Compliance checked · approved for your region" : "Flagged · a Dow expert should review before production"}
                    </span>
                  </div>
                )}
                <AgentTrace agents={agentObjs} lead={meta.lead} />
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  function Welcome({ persona, env, onAsk, onSug }) {
    const D = window.DX;
    const sugs = D.suggestions[persona] || D.suggestions.explorer;
    const type = D.typeById(persona);
    return (
      <div className="dx-agi-hello fade-in">
        <span className="dx-agi-eyb"><span className="ai-glyph" /> ChemAssist · your Dow agent</span>
        <h2>Welcome back, {D.account.first}.</h2>
        <div className="sb">You run materials for Brandt's footwear, packaging and mobility lines — all on the same Dow polyolefin elastomers, so what you prove on one application carries to the next. I'm across all of it: find a grade, run a sample, troubleshoot a line, or move a proven grade to an order.</div>
        <div className="dx-agcards">
          {sugs.map(s => (
            <button className="dx-agcard" key={s.id} onClick={() => onSug(s)}>
              <span className="ci"><Icon name={s.icon} size={16} /></span>
              <span style={{ flex: 1 }}><span className="ctt">{s.title}</span><div className="cbb">{s.body}</div><span className="cgo">{s.title.length ? "Start" : "Go"} <Stroke size={13} d="M5 12h14M13 6l6 6-6 6" /></span></span>
            </button>
          ))}
        </div>
        <div className="dx-starters">
          {D.starters.map((s, i) => <button className="dx-starter" key={i} onClick={() => i === 0 ? onSug({ compose: true, placeholder: "Describe the application you're building for…" }) : onAsk(s)}><Icon name="lightbulb" size={15} /> {s}</button>)}
        </div>
      </div>
    );
  }

  function Agent(props) {
    const { open, full, onClose, onToggleFull, onNav, toast, intentSeed, seedKey, env, setEnv, persona, autonomy, pushAgui } = props;
    const D = window.DX;
    const [turns, setTurns] = React.useState([]);
    const turnsRef = React.useRef(turns); turnsRef.current = turns;
    const [input, setInput] = React.useState("");
    const [voiceLive, setVoiceLive] = React.useState(false);
    const [composeHint, setComposeHint] = React.useState(null);
    const [composeMode, setComposeMode] = React.useState(false);
    const composerRef = React.useRef(null);
    const bodyRef = React.useRef(null);
    const timers = React.useRef([]);
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
    const scrollDown = () => { const el = bodyRef.current; if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 80); };

    const respond = React.useCallback((text, forcedIntent, code) => {
      const intent = forcedIntent || window.DXA.classify(text);
      const meta = window.DXA.INTENTS[intent] || { agents: [] };
      const caseCode = code || window.DXA.defaultCase[intent] || null;
      // Drive the live Agentic Workflow Pipeline from what ChemAssist is doing,
      // so the floating panel tracks each interaction (recommend → sample →
      // quote → compliance → incident) instead of a single static workflow.
      const wfId = window.DXA.workflowFor[intent];
      if (wfId && window.AgenticBus) { try { window.AgenticBus.set(wfId); } catch (e) {} }
      // Adapt the environment surface ONLY when starting a fresh conversation.
      // On a follow-up the chat window must stay exactly as it is — same header,
      // same composer, same dialogue — so a photo → “diagnose & open an incident”
      // turn appends the incident card without reskinning into plant mode.
      if (turnsRef.current.length === 0) {
        if (intent === "production") setEnv && setEnv("plant");
        else if (intent === "experiment" || intent === "video") setEnv && setEnv("lab");
      }
      // ripple chat actions into the live store (orders / samples / case history)
      if (window.DXLive) {
        if (intent === "po_placed") window.DXLive.dispatch("po.approve", { po: "PO-48261", caseCode: caseCode });
      }
      const id = Date.now() + Math.random();
      const instant = meta.instant;
      setTurns(t => [...t, { id, user: text, intent, code: caseCode, phase: instant ? "done" : "thinking", cur: 0 }]);
      const lead = meta.lead && D.agentById(meta.lead);
      pushAgui && pushAgui("RUN_STARTED", `${(D.typeById(meta.type) || {}).name || intent} · ${caseCode || "—"}`);
      if (lead) pushAgui && pushAgui("HANDOFF", `Sales lead → ${lead.name}`);
      scrollDown();
      function emitGates() {
        const deal = caseCode && D.dealFor(caseCode);
        (meta.gates || []).forEach(gid => {
          const g = D.gates[gid]; const st = (deal && deal.gates[gid]) || "progress";
          pushAgui && pushAgui("GATE_CHECK", `${D.agentById(g.owner).name}: ${g.name}`);
          pushAgui && pushAgui(st === "cleared" ? "GATE_CLEARED" : st === "review" ? "GATE_EXCEPTION" : st === "pending" ? "GATE_HOLD" : "GATE_PENDING", `${g.name} · ${D.gateState[st].label}`);
        });
      }
      if (!instant && meta.agents.length) {
        meta.agents.forEach((aid, i) => timers.current.push(setTimeout(() => { setTurns(t => t.map(x => x.id === id ? { ...x, cur: i } : x)); const ag = D.agentById(aid); pushAgui && pushAgui("AGENT", `${ag.name}: ${ag.task}`); scrollDown(); }, 460 * (i + 1))));
        timers.current.push(setTimeout(() => { setTurns(t => t.map(x => x.id === id ? { ...x, phase: "done" } : x)); emitGates(); pushAgui && pushAgui("RUN_FINISHED", caseCode || intent); scrollDown(); }, 460 * (meta.agents.length + 1)));
      } else { emitGates(); pushAgui && pushAgui("RUN_FINISHED", caseCode || intent); }
    }, [setEnv, pushAgui]);

    React.useEffect(() => {
      if (open && intentSeed) {
        if (intentSeed.fresh) setTurns([]);
        if (intentSeed.compose) { setComposeMode(true); setComposeHint(intentSeed.placeholder || null); setInput(""); setTimeout(() => composerRef.current && composerRef.current.focus(), 80); }
        else if (intentSeed.intent || intentSeed.text) timers.current.push(setTimeout(() => respond(intentSeed.text || "", intentSeed.intent, intentSeed.code), 60));
      }
      // eslint-disable-next-line
    }, [seedKey]);

    function onAsk(text, forced, code) { const fi = forced || (composeMode ? "selector" : undefined); setInput(""); setComposeHint(null); setComposeMode(false); respond(text, fi, code); }
    function onSug(s) {
      if (s.compose) { setComposeMode(true); setComposeHint(s.placeholder || null); setInput(""); setTimeout(() => composerRef.current && composerRef.current.focus(), 60); return; }
      respond(s.text || s.title, s.intent, s.code);
    }
    function onAction(kind, p) {
      if (kind === "add-experiment") toast(`${p.name} added to a sample experiment — tied to your application, not a cart.`, { label: "Open sample lab →", onClick: () => onNav({ name: "samplelab", code: "CASE-02111" }) });
      else if (kind === "order-sample") { window.DXLive && window.DXLive.dispatch("sample.order", { grade: "INFUSE™ 9107", caseCode: "CASE-02111" }); pushAgui && pushAgui("TOOL_CALL", "sample.order → SR-20602"); toast("Next-round sample ordered — added to the experiment & tracked.", { label: "Open sample lab →", onClick: () => onNav({ name: "samplelab", code: "CASE-02111" }) }); }
      else if (kind === "expedite") { pushAgui && pushAgui("TOOL_CALL", "supply.expedite.check"); toast("Checking spec-compatible alternates & expedite options in inventory…"); }
    }
    function startVoice() { setVoiceLive(true); timers.current.push(setTimeout(() => { setVoiceLive(false); respond("Line 4 barrier layer is delaminating after the cooling jaw at 135 °C", "production"); }, 1800)); }
    function newChat() { timers.current.forEach(clearTimeout); setTurns([]); setComposeMode(false); setComposeHint(null); }

    const envObj = D.environments[env] || D.environments.desk;
    const plant = env === "plant";

    return (
      <React.Fragment>
        <div className={`dx-scrim ${open && full ? "on" : ""}`} onClick={onClose} />
        <aside className={`dx-agent env-${env} ${open ? "on" : ""} ${full ? "full" : ""}`} aria-hidden={!open}>
          <header className="dx-agent-head">
            <span className="av"><span className="ai-glyph" /></span>
            <div className="ht"><b>ChemAssist</b><span>Your Dow agent</span></div>
            <div className="hbtns">
              {turns.length > 0 && <button className="hb" title="New chat" onClick={newChat}><Stroke size={16} d="M12 5v14M5 12h14" /></button>}
              <button className="hb" title={full ? "Dock" : "Expand"} onClick={onToggleFull}>{full ? <Stroke size={16} d="M9 9H5V5M15 9h4V5M9 15H5v4M15 15h4v4" /> : <Stroke size={16} d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}</button>
              <button className="hb" title="Close" onClick={onClose}><Icon name="close" size={16} /></button>
            </div>
          </header>
          <div className="dx-agent-body" ref={bodyRef}>
            {turns.length === 0
              ? (composeMode
                  ? <div className="dx-agi-hello fade-in"><span className="dx-agi-eyb"><span className="ai-glyph" /> ChemAssist · new application</span><h2>What are you building?</h2><div className="sb">Describe your application in the box below — material, performance, regulatory needs, region — and I'll turn it into a brief and rank the right Dow grades. No forms.</div></div>
                  : <Welcome persona={persona} env={env} onAsk={onAsk} onSug={onSug} />)
              : turns.map(t => <Turn key={t.id} turn={t} env={env} onNav={onNav} onAsk={onAsk} onAction={onAction} toast={toast} pushAgui={pushAgui} />)}
          </div>

          <div className="dx-agent-foot">
            <div className="inner">
              {voiceLive && (
                <div className="dx-voice live"><span className="mic"><Stroke size={17} d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" /></span><span className="wave">{Array.from({ length: 14 }).map((_, i) => <i key={i} />)}</span><span className="vt">Listening…</span></div>
              )}
              <div className={`dx-mmrow ${plant ? "plant" : ""}`}>
                <button className={`dx-mmbtn ${plant ? "big" : ""}`} title="Photo / image" onClick={() => respond("Here's a photo I'd like you to look at.", "image")}><Stroke size={plant ? 20 : 16} d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />{plant && <span>Camera</span>}</button>
                <button className={`dx-mmbtn ${plant ? "big" : ""} ${voiceLive ? "on" : ""}`} title="Voice" onClick={startVoice}><Stroke size={plant ? 20 : 16} d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />{plant && <span>Speak</span>}</button>
                <button className={`dx-mmbtn ${plant ? "big" : ""}`} title="Label / spec" onClick={() => respond("Here's the label off the material we're running.", "sketch")}><Icon name="document-chart" size={plant ? 20 : 16} />{plant && <span>Spec</span>}</button>
                <button className={`dx-mmbtn ${plant ? "big" : ""}`} title="Video" onClick={() => respond("Here's a video of how it needs to perform.", "video")}><Icon name="play" size={plant ? 20 : 16} />{plant && <span>Video</span>}</button>
                {turns.length > 0 && !plant && <button className="dx-agent-newchat" style={{ marginLeft: "auto" }} onClick={newChat}><Stroke size={12} d="M5 12h14M13 6l6 6-6 6" style={{ transform: "rotate(180deg)" }} /> New chat</button>}
              </div>
              {!plant && (
                <div className="dx-composer">
                  <span className="ai-glyph" />
                  <input ref={composerRef} value={input} placeholder={composeHint || "Describe what you're building, ask, or troubleshoot…"} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && input.trim()) onAsk(input.trim()); }} />
                  <button className="send" disabled={!input.trim()} onClick={() => input.trim() && onAsk(input.trim())}><Stroke size={17} d="M5 12h14M13 6l6 6-6 6" /></button>
                </div>
              )}
              <div className="dx-trace-foot">
                {autonomy && <span className="dx-auto"><Icon name="information" size={11} /> Autonomy: {autonomy === "prepare" ? "Prepare-only" : autonomy === "bounds" ? "In-bounds" : "Auto-act"}</span>}
                <span className="sp" />
                <span>Shared trace · <a onClick={() => { const c = turns.length ? (window.DXA.INTENTS[turns[turns.length-1].intent]||{}) : {}; window.DX.toOperator(window.DX.spineScreenFor(turns.length ? turns[turns.length-1].intent : "spine"), turns.length ? (window.DX.caseByCode(turns[turns.length-1].code)||{}).trace : null); }}>trace into the agentic spine ↗</a></span>
              </div>
            </div>
          </div>
        </aside>
      </React.Fragment>
    );
  }
  UI.Agent = Agent;
})();
