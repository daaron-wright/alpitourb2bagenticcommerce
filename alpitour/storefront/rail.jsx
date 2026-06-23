/* ============================================================
   EasyBook Next — B2B Storefront · AlpiConcierge orchestration rail
   Tabs: Chat · Plan · Sources · Timeline. Approval gates live here.
   ============================================================ */
(function () {
  const { receipts, tredi } = window.SF;

  /* collapsible wrapper for non-chat outputs (tool calls, detected signals, handoffs) */
  function ChatFold({ icon, label, meta, defaultOpen, children }) {
    const [open, setOpen] = React.useState(!!defaultOpen);
    return (
      <div className={`sf-fold ${open ? "open" : ""}`} data-screen-label="Agent output (collapsible)">
        <button className="sf-fold-h" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <Ki name={icon} size={12} />
          <span className="fl">{label}</span>
          {meta && <span className="fm">{meta}</span>}
          <span className="chev"><Ki name="arrow-down-right" size={12} /></span>
        </button>
        {open && <div className="sf-fold-b">{children}</div>}
      </div>
    );
  }

  function ChatInquiry({ done, onAccept }) {
    return (
      <div className={`sf-chatinq ${done ? "done" : ""}`} data-screen-label="Incoming brief">
        <div className="ci-top"><span className="ci-pill">Italy · Bravo</span><span className="ci-hold">24h hold</span></div>
        <div className="ci-row">
          <span className="ci-av" aria-hidden="true">C</span>
          <div className="ci-id"><b>The Carter family</b><i>Rome · Florence · Amalfi · from Toronto</i></div>
        </div>
        <div className="ci-facts"><span>12–22 Aug</span><span>≤ CA$11,000</span></div>
        <div className="ci-foot">
          <span className="ci-src"><SfInf size={11} /> via AlpiConcierge · Alpitour.it</span>
          {done
            ? <span className="ci-done"><Ki name="checkmark-filled" size={13} /> Accepted</span>
            : <button className="ci-accept" onClick={onAccept}>Accept →</button>}
        </div>
      </div>
    );
  }

  function Rail({ open, setOpen, tab, setTab, msgs, working, quick, onQuick, onSend, approval, onApprove, onReject, planDone, planActive, confidence, srcIds, timeline, asb, onToast, brand, onPickBrand, live, liveSticky, request, onPickRequest, choices, jstep, onAcceptInquiry, inquiryDone }) {
    const agent = brand === "turisanda" ? "Super TREDI" : "AlpiConcierge";
    const [draft, setDraft] = React.useState("");
    const endRef = React.useRef(null);
    React.useEffect(() => {
      if (endRef.current && tab === "chat") {
        const sc = endRef.current.parentElement && endRef.current.parentElement.closest(".sf-rail-body");
        if (sc) sc.scrollTop = sc.scrollHeight;
      }
    }, [msgs, working, approval, tab]);

    if (!open) return (
      <div className="sf-rail-collapsed">
        <button onClick={() => setOpen(true)} aria-label={`Open ${agent}`} title={`Open ${agent}`}><SfInf size={17} /></button>
      </div>
    );

    const send = () => { if (!draft.trim()) return; onSend(draft.trim()); setDraft(""); };

    return (
      <aside className="sf-rail" data-screen-label={`${agent} rail`} aria-label={`${agent} orchestration panel`}>
        <div className="sf-rail-head">
          <span className="ic tredi"><SfInf size={15} /></span>
          <div><div className="t">{agent}</div></div>
          <button className="min" onClick={() => setOpen(false)} aria-label="Collapse panel">→</button>
        </div>
        <div className="sf-tabs" role="tablist">
          {[["chat", "Chat"], ["live", "Live"], ["plan", "Journey"], ["sources", "Sources"], ["timeline", "Choices"]].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
              {label}{id === "live" && live.length > 0 && <span className="n">{live.length}</span>}{id === "sources" && srcIds.length > 0 && <span className="n">{srcIds.length}</span>}{id === "timeline" && choices.length > 0 && <span className="n">{choices.length}</span>}
            </button>
          ))}
        </div>

        <div className="sf-rail-body">
          {tab === "chat" && (
            <>
              <div className="sf-msgs">
                {msgs.length === 0 && (
                  <div className="sf-empty"><b style={{ color: "var(--fg-1)" }}>Start from the customer's words.</b><br />Pick a brand experience or paste their message below — {agent} curates the shelf, answers from live inventory and pricing, and always shows its sources.</div>
                )}
                {msgs.map((m, i) => (
                  m.role === "user"
                    ? <div className="sf-msg user" key={i} dangerouslySetInnerHTML={{ __html: m.html }} />
                    : m.role === "tool"
                    ? <ChatFold key={i} icon={m.t.status === "err" ? "error-filled" : "recommend"} label={m.t.title || "Tool call"} meta={m.t.tool}><SfToolCallCard t={m.t} /></ChatFold>
                    : m.role === "attachment"
                    ? <div className="sf-attach" key={i} data-screen-label="Attached transcript"><span className="ic"><Ki name="document-chart" size={15} /></span><span className="tx"><b>{m.file}</b><i>{m.meta}</i></span><span className="ok"><Ki name="checkmark-filled" size={13} /> Attached</span></div>
                    : m.role === "handoff"
                    ? <ChatFold key={i} icon="chat-bot" label={m.h.dir === "in" ? "Handoff received" : "Handoff sent"} meta={m.h.meta}><SfHandoffCard h={m.h} /></ChatFold>
                    : m.role === "inquiry"
                    ? <ChatInquiry key={i} done={inquiryDone} onAccept={onAcceptInquiry} />
                    : m.role === "brandpick"
                    ? <SfBrandPick key={i} chosen={brand} onPick={onPickBrand} />
                    : m.role === "requests"
                    ? <SfRequestPick key={i} chosen={request} onPick={onPickRequest} />
                    : m.role === "cluster"
                    ? <ChatFold key={i} icon="group" label="Persona signal detected" meta={`cluster · ${m.c.conf}% match`}><SfClusterMatch c={m.c} /></ChatFold>
                    : m.role === "nba"
                    ? <SfNextBestAction key={i} n={m.n} onCta={onQuick} />
                    : <div className="sf-msg agent" key={i}>
                        <div className="who"><SfInf size={11} /> {m.skill && /^Tredi/.test(m.skill) ? m.skill : `${agent} · ${m.skill || "Tredi · supervisor"}`}</div>
                        <div dangerouslySetInnerHTML={{ __html: m.html }} />
                        {m.sticky && <SfSticky text={m.sticky} />}
                      </div>
                ))}
                {approval && approval.tool && (
                  <SfToolCallCard t={{ ...approval.tool, status: "pending" }} onApprove={onApprove} onReject={onReject} />
                )}
                <div ref={endRef} />
              </div>
              {working && <div className="sf-busy"><span className="dots"><i></i><i></i><i></i></span> {working}</div>}
              {approval && !approval.tool && (
                <div className="sf-approval" data-screen-label="Approval gate">
                  <div className="t"><Ki name="warning-alt" size={12} /> Approval required · {approval.actionType}</div>
                  <div className="s">{approval.summary}</div>
                  <div className="row">
                    <button className="sf-btn sm primary" onClick={onApprove}>Approve</button>
                    <button className="sf-btn sm" onClick={onReject}>Not now</button>
                  </div>
                </div>
              )}
              {!working && quick.length > 0 && (
                <div className="sf-quick">
                  {quick.map((q) => <button key={q.id} className={`sf-qchip ${q.kind === "primary" ? "primary" : ""}`} onClick={() => onQuick(q)}>{q.label}</button>)}
                </div>
              )}
              <div style={{ flex: 1 }} />
            </>
          )}

          {tab === "live" && (
            <div className="sf-livetab" data-screen-label="Live updates tab">
              {asb && <SfAgentStatusBar state={asb.state} label={asb.label} meta={asb.meta} onToast={onToast} />}
              {live && live.length > 0
                ? <SfLiveFeed items={live} sticky={liveSticky} />
                : <div className="sf-empty">No live updates yet. Price, allotment and catalogue events stream here as AlpiConcierge watches the trip — they never clutter the conversation.</div>}
            </div>
          )}

          {tab === "plan" && (
            <div className="sf-plan">
              <div className="sf-jtab">
                <div className="uc"><b>{tredi.useCase.title}</b><span>One seamless touchpoint — the agent works, the customer experiences.</span></div>
                {tredi.useCase.steps.map((s) => (
                  <div key={s.n} className={`js ${s.n < jstep ? "done" : s.n === jstep ? "on" : ""}`}>
                    <span className="ci">{s.n < jstep ? "✓" : s.n}</span>
                    <div className="bd">
                      <div className="l">{s.label}</div>
                      <div className="a"><i>Agent</i> {s.agent}</div>
                      <div className="a"><i>Customer</i> {s.customer}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sf-conf">
                <b>Confidence: {confidence.level}.</b> {confidence.rationale}
              </div>
            </div>
          )}

          {tab === "sources" && (
            <div className="sf-srcs">
              {srcIds.length === 0 && <div className="sf-empty">No sources in play yet. Receipts appear here the moment {agent} touches inventory, pricing, the product master or a policy document.</div>}
              {srcIds.map((id) => <SfSourceCard key={id} r={receipts[id]} />)}
              {srcIds.length > 0 && (
                <p style={{ fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.5, padding: "0 2px" }}>Priority order: live inventory and pricing are the system of record; the product master supplies structured facts; catalogues enrich, never override.</p>
              )}
            </div>
          )}

          {tab === "timeline" && (
            <SfChoicesTimeline choices={choices} timeline={timeline} />
          )}
        </div>

        {tab === "chat" && (
          <div className="sf-composer">
            <input
              value={draft}
              placeholder={`Paste a customer brief — or ask ${agent}…`}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              aria-label={`Message ${agent}`}
            />
            <button onClick={send} aria-label="Send"><svg className="sf-inf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" /></svg></button>
          </div>
        )}
      </aside>
    );
  }

  Object.assign(window, { SfRail: Rail });
})();
