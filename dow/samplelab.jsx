/* ============================================================
   Sample Experiment Plan — build → test → iterate workspace.
   Samples are experiments tied to an application & test objective.
   Case-aware: reads the case's experiment rounds.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke, AiSpinner } = UI;

  function Round({ r }) {
    return (
      <div className={`dx-round ${r.done ? "" : "active"}`}>
        <div className="rh">
          <span className="rn">{r.n}</span>
          <span className="rt">Round {r.n}{r.done ? "" : " · in test"}</span>
          {r.done ? <span className={`dx-comply ${r.tone === "warn" ? "review" : "ok"}`} style={{ marginLeft: "auto" }}><Icon name={r.tone === "warn" ? "warning-alt" : "checkmark-filled"} size={13} /> {r.verdict}</span>
                  : <span className="b spruce" style={{ marginLeft: "auto" }}><span className="dot" style={{ background: "var(--k-spruce-60)" }} /> Awaiting data</span>}
        </div>
        <div className="rkv"><span className="rk">Recipe</span><span className="rv">{r.config}</span></div>
        <div className="rkv"><span className="rk">Result</span><span className="rv">{r.result}</span></div>
      </div>
    );
  }

  function SampleLab({ code, onNav, onAskAgent, toast }) {
    const D = window.DX;
    const c = D.caseByCode(code) || D.cases.find(x => x.experiment && x.experiment.rounds) || D.cases[1];
    const exp = c.experiment || { objective: "Qualify the candidate grade", rounds: [] };
    const live = window.DXLive.use();
    const evidence = (live.evidence && live.evidence[c.code]) || [];
    const addedSamples = (live.samples || []).filter(s => s.caseCode === c.code);
    const [phase, setPhase] = React.useState("await");
    const timers = React.useRef([]);
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
    React.useEffect(() => { setPhase("await"); }, [code]);

    function submitTest() { setPhase("analyzing"); timers.current.push(setTimeout(() => { setPhase("done"); window.DXLive && window.DXLive.dispatch("sample.evidence", { caseCode: c.code, round: 2, result: "Rebound 60% · density 0.176 g/cm³ — meets target" }); toast("Test data analysed — R&D agent suggests a next-round recipe."); }, 2000)); }

    const loop = [["Build", "recommend"], ["Test", "anomaly"], ["Iterate", "lightbulb"]];
    const done = phase === "done" || evidence.length > 0;
    const loopOn = done ? 2 : 1;

    return (
      <div className="dx-scroll fade-in">
        <div className="dx-wrap">
          <div className="dx-crumb"><a onClick={() => onNav({ name: "cases" })}>Cases</a> <span className="sep">›</span> <a onClick={() => onNav({ name: "case", code: c.code })}>{c.code}</a> <span className="sep">›</span> <b>Sample experiment</b></div>

          <div className="dx-lab-head">
            <span className="li"><Icon name="lightbulb" size={22} /></span>
            <div><h1>{c.title}</h1><div className="gl">Objective — {exp.objective}. Samples here are <strong>experiments tied to this application</strong>, not transactions.</div></div>
          </div>

          <div className="dx-loop">
            {loop.map((l, i) => (
              <React.Fragment key={i}>
                <span className={`dx-loopstep ${i <= loopOn ? "on" : ""}`}><span className="n">{i + 1}</span> {l[0]}</span>
                {i < 2 && <Stroke className="arr" size={16} d="M5 12h14M13 6l6 6-6 6" />}
              </React.Fragment>
            ))}
          </div>

          <div className="dx-labgrid">
            <div>
              {(exp.rounds || []).map(r => <Round key={r.n} r={r} />)}

              {(evidence.length > 0 || addedSamples.length > 0) && (
                <div className="dx-card">
                  <div className="ch"><Icon name="document-chart" size={16} style={{ color: "var(--dow-red)" }} /><h3>Updated from ChemAssist</h3><span className="b spruce" style={{ marginLeft: "auto" }}>live</span></div>
                  {evidence.map((e, i) => (
                    <div key={"e" + i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", fontSize: 12.5, color: "#2A2E34", borderBottom: "1px solid var(--dx-line)" }}>
                      <Icon name="checkmark-filled" size={13} style={{ color: "var(--k-status-success-100)", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>Evidence · Round {e.round} — {e.result}</span>
                      <span style={{ fontSize: 11, color: "var(--dx-muted)" }}>{e.ts}</span>
                    </div>
                  ))}
                  {addedSamples.map((s, i) => (
                    <div key={"s" + i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", fontSize: 12.5, color: "#2A2E34", borderBottom: "1px solid var(--dx-line)" }}>
                      <Icon name="lightbulb" size={13} style={{ color: "var(--k-spruce-70)", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>Sample ordered · {s.grade} · <span style={{ fontFamily: "var(--font-mono)" }}>{s.code}</span></span>
                      <span style={{ fontSize: 11, color: "var(--dx-muted)" }}>{s.status}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="dx-card">
                <div className="ch"><Icon name="anomaly" size={17} style={{ color: "var(--k-spruce-70)" }} /><h3>Feed back your test results</h3></div>
                {!done ? (
                  <React.Fragment>
                    <p style={{ fontSize: 13, color: "var(--dx-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>Drop your test chart or a photo of the sample. ChemAssist reads it and recommends the next refinement.</p>
                    <div className="dx-testbox">
                      <image-slot id="dx-test-data" shape="rounded" radius="10" placeholder="Drop your test chart or sample photo"></image-slot>
                      {phase === "analyzing"
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--k-spruce-80)", fontWeight: 600 }}><AiSpinner size={15} /> R&D agent analysing your data…</span>
                        : <button className="dx-btn ai" onClick={submitTest}><span className="dx-spark">✦</span> Submit test results</button>}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className="dx-action fade-in" style={{ marginBottom: 0 }}>
                    <div className="ah"><span className="ai-glyph" style={{ width: 16, height: 16 }} /><b>Next round — suggested refinement</b></div>
                    <div className="arow"><Icon name="checkmark-filled" size={13} /> Hold the 80:20 blend, raise nucleator 0.5%</div>
                    <div className="arow"><Icon name="checkmark-filled" size={13} /> Lower blow-agent 3% to tighten cell size</div>
                    <div className="arow"><Icon name="checkmark-filled" size={13} /> Predicted: rebound 60%, density 0.175 g/cm³</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <button className="dx-btn red sm" onClick={() => { window.DXLive && window.DXLive.dispatch("sample.order", { grade: "INFUSE™ 9107 (next round)", caseCode: c.code }); toast("Next-round sample ordered — added to the experiment."); }}>Order next sample</button>
                      <button className="dx-btn ghost sm" onClick={() => onAskAgent({ intent: "order", text: "The trial qualified — move to a quote and PO", code: c.code, fresh: true })}>Move to quote / PO</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside>
              <div className="dx-side-ai" onClick={() => onAskAgent({ intent: "experiment", text: c.prompt, code: c.code, fresh: true })}>
                <div className="h"><span className="ai-glyph" /><b>R&D agent</b></div>
                <p>I track this experiment against its objective and suggest the next round to converge fastest. Continue in the conversation any time.</p>
                <button className="dx-btn ai sm"><span className="dx-spark">✦</span> Discuss in ChemAssist</button>
              </div>
              <div className="dx-card">
                <div className="ch"><h3>Experiment</h3></div>
                {[["Case", c.code], ["Objective", exp.objective], ["Rounds", `${(exp.rounds || []).length} planned`], ["Owner", D.account.name]].map(([k, v]) => (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", fontSize: 13, borderBottom: "1px solid var(--dx-line)" }} key={k}><span style={{ color: "var(--dx-muted)", flexShrink: 0 }}>{k}</span><span style={{ color: "var(--dow-ink)", fontWeight: 500, textAlign: "right" }}>{v}</span></div>
                ))}
                <div className="dx-comply ok" style={{ marginTop: 12 }}><Icon name="checkmark-filled" size={13} /> Compliance checked for all rounds</div>
              </div>
            </aside>
          </div>
        </div>
        <UI.Footer onNav={onNav} />
      </div>
    );
  }
  UI.SampleLab = SampleLab;
})();
