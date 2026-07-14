/* ============================================================
   NodeModal — the application-journey node-details review modal.
   Left: BRD content + state-control summary + automation.
   Right: Policy Rules (Rego) generated from the control attribute,
   with test input / expected output and run / approve / reject.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});

  function humanize(s) { return String(s).replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }
  function slug(s) { return String(s).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, ""); }

  function regoFor(ctrl, vals, journeyId) {
    const decision = vals[0] || "allow";
    return `package dow.${journeyId}.${ctrl}\n\n` +
      `default decision_${ctrl} = "route_to_human"\n\n` +
      `decision_${ctrl} = "${decision}" {\n    input.${ctrl} == "${decision}"\n}`;
  }

  function NodeModal({ name, journey, onClose, toast }) {
    const M = window.MACHINE, J = window.JOURNEYS;
    const s = M.byName[name];
    const meta = J.META[name] || {};
    const ctrl = s.ctrl || "decision";
    const vals = meta.vals || (s.tx || []).map(t => t[1]);
    const tx = s.tx || [];
    const [showPolicy, setShowPolicy] = React.useState(true);
    const [ran, setRan] = React.useState(false);
    const approved = J.APPROVED.has(name);

    const journeysFor = J.JOURNEYS.filter(j => j.ids.includes(name));
    const typeLabel = s.t === "initial" ? "Initial" : s.t === "final" ? "Final" : s.t;

    React.useEffect(() => {
      function onKey(e) { if (e.key === "Escape") onClose(); }
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
      <div className="nm-scrim" onClick={onClose}>
        <div className="nm" onClick={e => e.stopPropagation()}>
          {/* header */}
          <div className="nm-head">
            <div className="nm-eyebrow">Application journey · node details</div>
            <button className="nm-x" onClick={onClose} aria-label="Close"><UI.Icon name="close" size={18} /></button>
            <h2 className="nm-title">{name}</h2>
            <div className="nm-meta">
              <span className={`jm-badge ${s.t === "final" ? "rose" : "teal"}`} style={{ textTransform: "capitalize" }}>{typeLabel}</span>
              <span className="nm-actor-pill">{J.ACTOR[s.m] || s.m}</span>
              {journeysFor.map(j => <span className="nm-jchip" key={j.id}><UI.Icon name="checkmark-filled" size={10} />{j.label}</span>)}
              <span className="nm-id">ID&nbsp;&nbsp;<b>{slug(name)}</b></span>
            </div>
          </div>

          <div className="nm-body">
            {/* LEFT — overview */}
            <div className="nm-left">
              {meta.brd && (
                <div className="nm-content">
                  <div className="nm-content-ref">{meta.brd.sec} · {meta.brd.id}</div>
                  <p className="nm-quote">“{meta.brd.text}”</p>
                </div>
              )}

              <div className="nm-card">
                <div className="nm-card-h"><span>State control summary</span><span className="nm-pill">{tx.length} touchpoints</span></div>
                <div className="nm-sub">Control attribute <b className="mono">{ctrl}</b> · transition outcomes</div>
                <div className="nm-outcomes">
                  {tx.map((t, i) => (
                    <div className="nm-outcome" key={i}>
                      <div className="nm-oc-top"><span className="nm-oc-l">Outcome</span><span className="nm-oc-v">{t[1]}</span></div>
                      <div className="nm-oc-bot"><span>{name}</span><span className="nm-oc-arrow">→</span><span className="nm-oc-t">{t[0]}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {meta.fn && (
                <div className="nm-card">
                  <div className="nm-card-h"><span>Automation</span><span className="nm-pill">1 function</span></div>
                  <div className="nm-sub">Functions and services powering this node</div>
                  <div className="nm-fn"><span className="dot" />{humanize(meta.fn)} <span className="mono nm-fn-raw">{meta.fn}()</span></div>
                </div>
              )}

              <div className="nm-card">
                <div className="nm-card-h"><span>Rego rules</span><span className="nm-pill">{vals.length} values</span></div>
                <div className="nm-sub">Policy validation values for this node</div>
                <div className="nm-rrules">
                  {vals.map((v, i) => (
                    <div className="nm-rrule" key={i}><span>{humanize(v)}</span><span className="nm-rrule-t mono">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — policy rules */}
            <div className="nm-right">
              <div className="nm-right-head">
                <div>
                  <div className="nm-eyebrow2">Policy rules</div>
                  <div className="nm-sub">Review enforcement rules and run validations</div>
                </div>
                <button className="nm-livebtn" onClick={() => setShowPolicy(p => !p)}>{showPolicy ? "Hide" : "Show"} policy rules</button>
              </div>

              {showPolicy && (
                <React.Fragment>
                  <div className="nm-rego-intro"><UI.Icon name="shield-check" size={14} style={{ color: "#29707a" }} /><div><b>Policy enforcement rules (Rego)</b><div className="nm-sub">Run a rule's test case and sync with the BRD reference.</div></div></div>

                  <div className="nm-rulecard active">
                    <div className="nm-rule-top">
                      <span className="mono nm-rule-name">decision_{ctrl}</span>
                      <span className="nm-rule-state">Active</span>
                    </div>
                    <div className="nm-rule-accepts">Accepts {vals.length} values for {humanize(ctrl)}.</div>
                    <div className="nm-codehead"><span>Policy rule</span><button className="nm-copy" onClick={() => toast && toast("Rego copied to clipboard")}>Copy</button></div>
                    <pre className="nm-code">{regoFor(ctrl, vals, journey.id)}</pre>
                    <div className="nm-io">
                      <div><div className="nm-io-l">Test input</div><pre className="nm-io-box">{`{\n  "${ctrl}": "${vals[0] || ""}"\n}`}</pre></div>
                      <div><div className="nm-io-l">Expected output</div><pre className="nm-io-box">{`{\n  "decision_${ctrl}": "${vals[0] || ""}"\n}`}</pre></div>
                    </div>
                    <div className="nm-rbtns">
                      <button className="nm-rbtn solid" onClick={() => { setRan(true); toast && toast("Test case passed · decision matches expected output"); }}><UI.Icon name="play" size={12} />Run test case</button>
                      <button className="nm-rbtn ok" onClick={() => toast && toast("Rule approved")}><UI.Icon name="checkmark-filled" size={12} />Approve rule</button>
                      <button className="nm-rbtn warn" onClick={() => toast && toast("Sent for rework")}>Rework</button>
                    </div>
                    <div className={`nm-wf ${ran ? "pass" : ""}`}><UI.Icon name="renew" size={13} />Workflow status: {ran ? "Tested · passing" : "Ready to test"}</div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="nm-foot">
            <span className="nm-foot-q">{approved ? "This node has been approved." : "Have you completed reviewing this node?"}</span>
            <div className="nm-foot-btns">
              <button className="nm-foot-reject" onClick={() => { toast && toast(`${slug(name)} · marked needs updates`); onClose(); }}><UI.Icon name="close" size={13} />Reject node</button>
              <button className="nm-foot-approve" onClick={() => { toast && toast(`${slug(name)} · approved`); onClose(); }}><UI.Icon name="checkmark-filled" size={13} />Approve node</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  UI.NodeModal = NodeModal;
})();
