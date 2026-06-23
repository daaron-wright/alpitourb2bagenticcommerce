/* ============================================================
   ImageFlow — the image-input pipeline inside ChemAssist.
   upload → step-based analysis → editable Image Interpretation
   Card (classification + intent chooser + attribute mapping +
   "what I still need" + PAC) → Confirm routes to the chosen
   downstream intent (find material / spec match / troubleshoot /
   sample / compliance / expert). Image becomes case evidence.
   ============================================================ */
(function () {
  const UI = window.UI;
  const { Icon, Stroke, AiSpinner } = UI;
  const DXA = window.DXA;

  function Confidence({ pct, label }) {
    const tone = pct >= 80 ? "ok" : pct >= 65 ? "spruce" : "amber";
    return (
      <span className={`dx-conf-pill ${tone}`} title="Model confidence in this interpretation">
        <span className="cdot" /> {pct}% · {label || (pct >= 80 ? "High" : pct >= 65 ? "Medium-high" : "Medium")} confidence
      </span>
    );
  }

  function ImageFlow({ bias, onAsk, toast, pushAgui }) {
    const D = window.DX;
    const inputs = D.imageInputs;
    const [stage, setStage] = React.useState("upload");
    const [pickedId, setPickedId] = React.useState(bias && inputs[bias] ? bias : null);
    const [dropped, setDropped] = React.useState(false);
    const [stepIdx, setStepIdx] = React.useState(0);
    const [chosenIntent, setChosenIntent] = React.useState(null);
    const [edit, setEdit] = React.useState(false);
    const [interp, setInterp] = React.useState(null);
    const [addVal, setAddVal] = React.useState("");
    const [needs, setNeeds] = React.useState([]);
    const [needVal, setNeedVal] = React.useState("");
    const timers = React.useRef([]);
    React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

    function addNeed(say) {
      const t = D.translateNeed(say, ex || inputs.dashboard);
      const id = Date.now() + Math.random();
      setNeeds(n => [...n, { id, say, ...t, status: "translating" }]);
      timers.current.push(setTimeout(() => setNeeds(n => n.map(x => x.id === id ? { ...x, status: "done" } : x)), 720));
      setNeedVal("");
    }
    function removeNeed(id) { setNeeds(n => n.filter(x => x.id !== id)); }
    const doneNeeds = needs.filter(n => n.status === "done").length;

    const ex = pickedId ? inputs[pickedId] : null;

    function runAnalysis(example) {
      setStage("analyzing"); setStepIdx(0);
      pushAgui && pushAgui("RUN_STARTED", `image · ${example.id}`);
      D.imageSteps.forEach((s, i) => timers.current.push(setTimeout(() => {
        setStepIdx(i); pushAgui && pushAgui("STEP", s[0]);
      }, 560 * i)));
      timers.current.push(setTimeout(() => {
        setInterp(JSON.parse(JSON.stringify(example.interp)));
        setChosenIntent(example.proposedIntent);
        setStage("interpret");
        pushAgui && pushAgui("RUN_FINISHED", `interpretation · ${example.id}`);
      }, 560 * D.imageSteps.length + 200));
    }

    function pick(id) { setPickedId(id); setDropped(false); }
    function interpret() {
      const example = ex || inputs[bias || "dashboard"];
      if (!pickedId) setPickedId(example.id);
      runAnalysis(example);
    }
    function confirm() {
      const example = ex || inputs.dashboard;
      const intent = chosenIntent || example.resultIntent;
      const verb = { selector: "Find Dow grades that match this", specmatch: "Look up the specs & documents for this", production: "Diagnose this and open an incident", experiment: "Build a sample experiment for this", compliance: "Check compliance for this", expert: "Route this to a Dow expert" }[intent];
      onAsk(verb, intent, example.caseCode);
    }
    function removeReq(i) { setInterp(p => ({ ...p, performance: p.performance.filter((_, j) => j !== i) })); }
    function addReq() { if (addVal.trim()) { setInterp(p => ({ ...p, performance: [...p.performance, addVal.trim()] })); setAddVal(""); } }

    /* ---------- UPLOAD ---------- */
    if (stage === "upload") {
      return (
        <div className="dx-imgflow fade-in">
          <div className="dx-imgupload">
            <image-slot id="dx-img-userdrop" shape="rounded" radius="12" placeholder="Drop your own image — photo, defect, label or line"></image-slot>
          </div>
          <div className="dx-imgor">or pick a sample to try</div>
          <div className="dx-imglist">
            {Object.values(inputs).map(s => (
              <button key={s.id} className={`dx-imgrow ${pickedId === s.id ? "on" : ""}`} onClick={() => pick(s.id)}>
                <span className="thumb"><img src={s.img} alt="" /></span>
                <span className="rmeta"><span className="tt"><Icon name={s.tile.icon} size={13} /> {s.tile.label}</span><span className="ts">{s.tile.sub}</span></span>
                <span className="rsel">{pickedId === s.id ? <Icon name="checkmark-filled" size={16} /> : <span className="dot" />}</span>
              </button>
            ))}
          </div>
          <button className="dx-abtn primary" disabled={!pickedId} onClick={interpret}>
            <span className="ai-glyph" style={{ width: 13, height: 13 }} /> {pickedId ? `Read this image` : "Pick an image first"}
          </button>
          <div className="dx-imgnote"><Icon name="information" size={12} /> I read the image to understand what you need, then line it up with Dow grades for you to confirm.</div>
        </div>
      );
    }

    /* ---------- ANALYZING ---------- */
    if (stage === "analyzing") {
      const cur = Math.min(stepIdx, D.imageSteps.length - 1);
      const step = D.imageSteps[cur];
      return (
        <div className="dx-imgflow fade-in">
          <div className="dx-imgload panel-load">
            <div className="pl-label" key={cur}>{step[0]}<span className="pl-sub">{step[1]}</span></div>
            <div className="pl-grid"></div>
            <div className="pl-grid tint"></div>
            <div className="pl-grid spruce"></div>
            <div className="pl-count">{cur + 1} / {D.imageSteps.length}</div>
          </div>
        </div>
      );
    }

    /* ---------- INTERPRET (the Image Interpretation Card) ---------- */
    const offer = D.imageIntents.filter(it => ex.offer.includes(it.id));
    return (
      <div className="dx-imgflow fade-in">
        <div className="dx-interp">
          {/* header: classification */}
          <div className="dx-interp-head">
            <span className="thumb"><img src={ex.img} alt="" /></span>
            <div className="hmeta">
              <div className="fn"><Icon name="document-chart" size={12} /> {ex.file}</div>
              <div className="dt">Detected: <strong>{ex.detectedType}</strong> <span className="tc">{ex.typeConfidence}%</span></div>
            </div>
            <span className="objtag">Image Interpretation</span>
          </div>

          {/* OCR block for labels */}
          {ex.ocr && (
            <div className="dx-ocr">
              <div className="oh"><Icon name="document-chart" size={12} /> Extracted from the label</div>
              <div className="og">{ex.ocr.map((r, i) => <div className="orow" key={i}><span className="ok2">{r[0]}</span><span className="ov">{r[1]}</span></div>)}</div>
            </div>
          )}

          {/* intent chooser — always shown as confirmation */}
          <div className="dx-interp-sec">
            <div className="lbl">What should I do with this? <span className="auto">auto-suggested — change if needed</span></div>
            <div className="dx-intentchips">
              {offer.map(it => (
                <button key={it.id} className={`dx-intentchip ${chosenIntent === it.id ? "on" : ""}`} onClick={() => setChosenIntent(it.id)} title={it.hint}>
                  <Icon name={it.icon} size={13} /> {it.label}
                  {ex.proposedIntent === it.id && <span className="sug">suggested</span>}
                </button>
              ))}
            </div>
          </div>

          {/* interpretation fields (editable) */}
          <div className="dx-interp-sec">
            <div className="lbl">What I understand <Confidence pct={interp.confidence} /></div>
            <div className="dx-ifield">
              <span className="k">Application</span>
              {edit ? <input value={interp.application} onChange={e => setInterp(p => ({ ...p, application: e.target.value }))} /> : <span className="v">{interp.application}</span>}
            </div>
            <div className="dx-ifield">
              <span className="k">Likely material system</span>
              {edit ? <input value={interp.materialSystem} onChange={e => setInterp(p => ({ ...p, materialSystem: e.target.value }))} /> : <span className="v">{interp.materialSystem}</span>}
            </div>
            <div className="dx-ifield col">
              <span className="k">Performance needs</span>
              <div className="reqs">
                {interp.performance.map((r, i) => (
                  <span className="req" key={i}>{r}{edit && <button className="x" onClick={() => removeReq(i)}>×</button>}</span>
                ))}
              </div>
              {edit && (
                <div className="addreq">
                  <input value={addVal} placeholder="Add a requirement…" onChange={e => setAddVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addReq(); }} />
                  <button onClick={addReq}><Stroke size={13} d="M12 5v14M5 12h14" /></button>
                </div>
              )}
            </div>
          </div>

          {/* novice "in your words" → material attributes */}
          <div className="dx-interp-sec">
            <div className="lbl">Tell me what matters — in your words <span className="auto">I translate plain language into material attributes</span></div>
            {needs.length > 0 && (
              <div className="dx-needs">
                {needs.map(n => (
                  <div className={`dx-need ${n.status}`} key={n.id}>
                    <span className="say"><Icon name="chat-bot" size={12} /> “{n.say}”</span>
                    <Stroke className="ar" size={12} d="M5 12h14M13 6l6 6-6 6" />
                    {n.status === "translating"
                      ? <span className="tr"><AiSpinner size={12} /> translating…</span>
                      : <span className="attr"><Icon name="checkmark-filled" size={12} /> {n.attr}<span className="spec">queries: {n.spec}</span></span>}
                    <button className="x" onClick={() => removeNeed(n.id)}>×</button>
                  </div>
                ))}
              </div>
            )}
            {ex.noviceSuggest && ex.noviceSuggest.filter(s => !needs.some(n => n.say === s.say)).length > 0 && (
              <div className="dx-needsug">
                {ex.noviceSuggest.filter(s => !needs.some(n => n.say === s.say)).map((s, i) => (
                  <button className="ns" key={i} onClick={() => addNeed(s.say)}>+ “{s.say}”</button>
                ))}
              </div>
            )}
            <div className="dx-needinput">
              <Icon name="chat-bot" size={14} />
              <input value={needVal} placeholder="Describe what matters in plain words…" onChange={e => setNeedVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && needVal.trim()) addNeed(needVal.trim()); }} />
              <button disabled={!needVal.trim()} onClick={() => needVal.trim() && addNeed(needVal.trim())}><Stroke size={14} d="M5 12h14M13 6l6 6-6 6" /></button>
            </div>
            {doneNeeds > 0 && <div className="dx-needfoot"><Icon name="recommend" size={12} /> {doneNeeds} need{doneNeeds > 1 ? "s" : ""} translated → cross-referenced against the Dow product library</div>}
          </div>

          {/* attribute mapping — visible reasoning */}
          <div className="dx-interp-sec">
            <div className="lbl">How I align it to Dow material attributes</div>
            <div className="dx-map">
              <div className="maph"><span>Visible in image</span><span>Material attribute</span><span>Points to</span></div>
              {ex.mapping.map((m, i) => (
                <div className="maprow" key={i}>
                  <span className="mv">{m[0]}</span>
                  <Stroke className="ar" size={13} d="M5 12h14M13 6l6 6-6 6" />
                  <span className="ma">{m[1]}</span>
                  <Stroke className="ar" size={13} d="M5 12h14M13 6l6 6-6 6" />
                  <span className="mg">{m[2]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* what I still need */}
          {interp.stillNeed && interp.stillNeed.length > 0 && (
            <div className="dx-stillneed">
              <div className="snh"><Icon name="information" size={13} /> To tighten this, I still need</div>
              {interp.stillNeed.map((s, i) => <span className="sn" key={i}>{s}</span>)}
            </div>
          )}

          {/* PAC + boundary */}
          <div className="dx-pac"><span className="ai-glyph" style={{ width: 13, height: 13 }} /> <strong>PAC reviewed</strong> — interpretation may be shown; recommendations stay governed by your region & account.</div>

          {/* footer actions */}
          <div className="dx-interp-acts">
            <button className="dx-abtn primary" onClick={confirm}><Icon name="checkmark-filled" size={14} /> Confirm & continue</button>
            <button className={`dx-abtn ghost ${edit ? "on" : ""}`} onClick={() => setEdit(e => !e)}><Icon name="document-chart" size={14} /> {edit ? "Done editing" : "Edit"}</button>
            <button className="dx-abtn ghost" onClick={() => { setStage("upload"); }}>Use a different image</button>
          </div>
        </div>
      </div>
    );
  }
  DXA.ImageFlow = ImageFlow;
})();
