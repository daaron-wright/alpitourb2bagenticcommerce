/* ============================================================
   EasyBook Next — app shell + deterministic state machine
   Route: dashboard → workbench (WP-2231)
   Stages: intake → clarifying → enriching → availability_check →
   sold_out → alternatives_ready → package_selected → proposal_ready
   → hold_pending(approval) → hold_confirmed → modification_requested
   → repricing → v2_ready(approval) → completed
   ============================================================ */
(function () {
  const { useState, useRef } = React;
  const { fmtEUR, dashboard, needs, blockers, STAGE_LABEL } = window.EB;

  let tick = 0;
  const stamp = () => { tick++; const m = 10 + Math.floor(tick / 9); return `${String(m).padStart(2, "0")}:${String(12 + (tick * 7) % 48).padStart(2, "0")}`; };

  const ADDONS = [
    { id: "insurance", name: "Family travel insurance", price: 95, why: "travelling with a 2-year-old" },
    { id: "transfer", name: "Private airport transfer", price: 120, why: "baby seat included" },
  ];

  function App() {
    const [route, setRoute] = useState("dashboard");
    const [stage, setStage] = useState("intake");
    const [tab, setTab] = useState("chat");
    const [msgs, setMsgs] = useState([]);
    const [working, setWorking] = useState(null);
    const [quick, setQuick] = useState([]);
    const [blk, setBlk] = useState(blockers);
    const [signals, setSignals] = useState([]);
    const [selected, setSelected] = useState(null);
    const [versions, setVersions] = useState([]);
    const [activeVer, setActiveVer] = useState(null);
    const [approval, setApproval] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [srcIds, setSrcIds] = useState([]);
    const [toast, setToast] = useState(null);
    const toastT = useRef(null);
    const pendingApprove = useRef(null);

    const showToast = (t) => { setToast(t); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2800); };
    const pushAgent = (html, skill) => setMsgs((m) => [...m, { role: "agent", html, skill }]);
    const pushUser = (html) => setMsgs((m) => [...m, { role: "user", html }]);
    const logEv = (actor, summary, reversible) => setTimeline((t) => [...t, { ts: stamp(), actor, summary, reversible }]);
    const addSrc = (ids) => setSrcIds((s) => [...s, ...ids.filter((i) => !s.includes(i))]);

    function orchestrate({ user, status, delay = 1000, then }) {
      if (user) pushUser(user);
      setQuick([]);
      setWorking(status || "AlpiGPT is working…");
      setTimeout(() => { setWorking(null); then(); }, delay);
    }

    /* ---------- demo script ---------- */
    function openLead() {
      setRoute("workbench"); setStage("clarifying");
      tick = 0;
      setMsgs([{ role: "agent", html: "I've read the Bianchi brief and structured it into requirement chips — see the left rail. <b>Two questions still block the search</b>: departure airport, and date flexibility if their hotel is unavailable. Tap them to resolve, or tell me.", skill: "Requirement Extractor" }]);
      setTimeline([]); setSrcIds([]); setVersions([]); setActiveVer(null); setSelected(null); setSignals([]); setBlk(blockers);
      logEv("user", "Opened seeded work package WP-2231 (Famiglia Bianchi)");
      logEv("agent", "Brief parsed → 6 structured requirements, 2 blocking questions");
      setQuick([]);
    }

    function fixBlocker(b) {
      setBlk((x) => x.filter((i) => i.id !== b.id));
      pushUser(b.fix);
      logEv("user", `Resolved blocker: ${b.label} → ${b.fix}`);
      if (blk.length === 1) {
        // last one — advance
        setStage("enriching");
        orchestrate({
          status: "Pulling hotel facts from the product master…", delay: 1100,
          then: () => {
            setStage("availability_check"); addSrc(["pm1", "cat1"]);
            logEv("api", "Product master returned Jaz Mirabel Beach amenity record · recent (12 May)");
            pushAgent("Blockers resolved. I've pulled the <b>verified facts for Jaz Mirabel Beach</b> — baby pool, kids club, family rooms confirmed from the product master (not the brochure). Since they're travelling with a 2-year-old, <b>I'll rank baby-friendly amenities first</b> in any alternative.", "Product Retriever");
            setSignals(["baby_pool"]);
            setQuick([{ id: "check", label: "Check live availability & pricing", kind: "primary" }]);
          },
        });
      }
    }

    function checkAvailability() {
      orchestrate({
        user: "Check live availability and pricing.", status: "Checking live availability and hotel facts…", delay: 1300,
        then: () => {
          setStage("sold_out"); addSrc(["inv1", "prc1"]);
          logEv("api", "Inventory API: Jaz Mirabel sold out 12–19 Aug · live, 43s ago");
          logEv("agent", "Sold-out branch triggered → recovery planner engaged");
          pushAgent("<b>That preferred option is unavailable for those dates</b> — live inventory, checked 43s ago. I found three close alternatives with similar family amenities and board basis.", "Availability/Pricing Resolver");
          setQuick([{ id: "recover", label: "Compare alternatives", kind: "primary" }, { id: "broaden", label: "Broaden search" }]);
        },
      });
    }

    function recover() {
      orchestrate({
        user: "Compare the alternatives.", status: "Ranking alternatives on family fit, budget and your baby-pool signal…", delay: 1200,
        then: () => {
          setStage("alternatives_ready");
          logEv("agent", "3 alternatives ranked — Coral Bay 94% (best match), Sinai 91%, Red Sea 88%");
          pushAgent("Ranked and ready in the workspace. <b>Coral Bay Family Resort is the closest match</b> — baby pool and kids club, €250 under the cap. Sinai Blue Lagoon is stronger but €80 over budget — flagged.", "Sold-out Recovery Planner");
        },
      });
    }

    function selectOffer(id) {
      setSelected(id);
      orchestrate({
        user: `Select ${window.EB.offers[id].hotelName}.`, status: "Composing the package and drafting proposal V1…", delay: 1250,
        then: () => {
          setStage("proposal_ready");
          const v1 = { versionId: "V1", createdAt: stamp(), status: "draft", offerId: id, dates: "12–19 Aug", total: 3465, delta: null };
          setVersions([v1]); setActiveVer("V1"); addSrc(["pol1"]);
          logEv("agent", "Proposal V1 composed · €3,465 incl. insurance + private transfer · policy validated");
          pushAgent(`Proposal <b>V1 is drafted</b> — ${window.EB.offers[id].hotelName}, insurance and private transfer included: <b>${fmtEUR(3465)}</b>, your commission ${fmtEUR(416)}. Review it in the workspace. Placing a hold is a commercial commit, so <b>it needs your approval</b>.`, "Proposal Composer");
          setApproval({ actionType: "place hold", summary: "Lock Coral Bay + Neos under proposal V1 until tomorrow 18:00. Reversible — you can release the hold anytime." });
          pendingApprove.current = confirmHold;
        },
      });
    }

    function confirmHold() {
      setApproval(null);
      orchestrate({
        user: "Approve — place the hold.", status: "Placing hold via booking platform…", delay: 1100,
        then: () => {
          setStage("hold_confirmed");
          setVersions((v) => v.map((x) => x.versionId === "V1" ? { ...x, status: "held" } : x));
          logEv("api", "Hold AT-88421 confirmed · expires tomorrow 18:00", false);
          logEv("agent", "Hold receipt issued · proposal V1 → status held");
          pushAgent("<b>Hold placed successfully.</b> This option is locked under proposal <b>V1</b> until 18:00 tomorrow — reference <b>AT-88421</b>. Share it, or service changes right here.", "Hold/Servicing Executor");
          setQuick([{ id: "modify", label: "Customer wants the trip one week earlier", kind: "primary" }, { id: "share", label: "Share proposal" }]);
        },
      });
    }

    function requestChange() {
      orchestrate({
        user: "The customer asks: can we move the whole trip one week earlier?", status: "Re-checking availability and repricing 5–12 August…", delay: 1400,
        then: () => {
          setStage("v2_ready");
          const v2 = { versionId: "V2", createdAt: stamp(), status: "draft", offerId: selected, dates: "5–12 Aug", total: 3365, delta: { vs: "V1", amount: -100, reason: "outbound flight fare lower" } };
          setVersions((v) => [...v, v2]); setActiveVer("V2");
          logEv("api", "Inventory + pricing re-checked for 5–12 Aug · available · −€100");
          logEv("agent", "V2 drafted with diff · V1 kept immutable");
          pushAgent("<b>Your change is ready.</b> Version <b>V2</b> is <b>€100 lower</b> because the outbound flight fare changed; hotel and amenities are identical. Review the diff — <b>committing the change updates the hold, so it needs your approval</b>.", "Modification/Reprice");
          setApproval({ actionType: "commit change to V2", summary: "Update hold AT-88421 from V1 (12–19 Aug, €3,465) to V2 (5–12 Aug, €3,365). V1 stays in the version history." });
          pendingApprove.current = approveV2;
        },
      });
    }

    function approveV2() {
      setApproval(null);
      orchestrate({
        user: "Approve V2 and update the hold.", status: "Committing V2 and updating the hold…", delay: 1000,
        then: () => {
          setStage("completed");
          setVersions((v) => v.map((x) => x.versionId === "V2" ? { ...x, status: "held" } : x.versionId === "V1" ? { ...x, status: "superseded" } : x));
          logEv("api", "Hold AT-88421 updated to V2 · V1 superseded (revertible)");
          logEv("system", "Support-deflection signals recorded: sold-out recovered · hold self-served · modification self-served");
          pushAgent("Done — the hold now covers <b>5–12 August at €3,365</b>. End to end: sold-out recovered, proposal drafted, hold placed, change repriced and committed — <b>without a single support contact</b>. Everything is in the timeline if you need to audit or undo.", "Session Orchestrator");
          setQuick([{ id: "share", label: "Share proposal V2", kind: "primary" }, { id: "dash", label: "← Back to dashboard" }]);
        },
      });
    }

    function rejectApproval() {
      setApproval(null);
      pushAgent("Understood — nothing committed. The draft stays in the workspace and you can approve it whenever you're ready.", "Session Orchestrator");
      logEv("user", "Deferred pending approval — no commercial action taken");
      setQuick([{ id: "reapprove", label: "Approve now", kind: "primary" }]);
    }

    /* ---------- routing of quick actions + typed input ---------- */
    function onQuick(q) {
      if (q.id === "check") return checkAvailability();
      if (q.id === "recover") return recover();
      if (q.id === "broaden") { pushUser("Broaden the search."); pushAgent("I'd only broaden after we look at the close matches — they keep every hard constraint. Comparing them first.", "Session Orchestrator"); return setTimeout(recover, 600); }
      if (q.id === "modify") return requestChange();
      if (q.id === "share") { logEv("user", "Shared active proposal with customer (simulated)"); return showToast("Proposal shared with the customer — status updates to shared."); }
      if (q.id === "dash") return setRoute("dashboard");
      if (q.id === "reapprove") { if (pendingApprove.current) { const f = pendingApprove.current; return f(); } }
    }
    function onSend(text) {
      const low = text.toLowerCase();
      if (stage === "clarifying" && blk.length) { const b = blk[0]; return fixBlocker({ ...b, fix: text }); }
      if (low.includes("earlier") || low.includes("change") || low.includes("move")) { if (stage === "hold_confirmed") return requestChange(); }
      if (low.includes("avail") || low.includes("check")) { if (stage === "availability_check") return checkAvailability(); }
      pushUser(text);
      const primary = quick.find((x) => x.kind === "primary");
      if (primary) return setTimeout(() => onQuick(primary), 400);
      pushAgent("In this prototype the journey is guided — use the suggested actions, the blockers on the left, or ask about availability and changes.", "Session Orchestrator");
    }
    function onEscalate(mode) {
      if (mode === "copy") return showToast("Snapshot link copied — packet includes context, timeline and sources.");
      logEv("user", "Escalation packet submitted to support with full snapshot");
      showToast("Escalation sent with full work-package snapshot — support starts with complete context.");
    }

    /* ---------- center workspace router ---------- */
    const planIdx = { intake: [-1, 0], clarifying: [-1, 0], enriching: [0, 1], availability_check: [1, 2], sold_out: [3, 4], alternatives_ready: [4, 5], proposal_ready: [5, 6], hold_confirmed: [6, 7], v2_ready: [6, 7], completed: [7, -1] }[stage] || [-1, 0];
    const confidence = stage === "completed"
      ? { level: "high", rationale: "All commercial facts came from live inventory and pricing APIs; both commits were human-approved." }
      : { level: "high", rationale: "Live inventory and product-master facts agree; no stale sources in use." };

    let center = null;
    if (["intake", "clarifying", "enriching"].includes(stage)) center = <><IntakeCard /></>;
    if (stage === "availability_check") center = <><IntakeCard /><FactsCard /></>;
    if (stage === "sold_out") center = <SoldOutCard />;
    if (stage === "alternatives_ready") center = <><SoldOutCard /><CompareGrid onSelect={selectOffer} busy={!!working} /></>;
    if (["proposal_ready", "hold_pending"].includes(stage)) center = <ProposalCard versions={versions} activeId={activeVer} onSetActive={setActiveVer} addons={ADDONS} />;
    if (stage === "hold_confirmed") center = <><HoldCard version="V1" total={3465} /><ProposalCard versions={versions} activeId={activeVer} onSetActive={setActiveVer} addons={ADDONS} /></>;
    if (stage === "v2_ready") center = <><DiffCard onApprove={approveV2} onRevert={rejectApproval} busy={!!working} /><ProposalCard versions={versions} activeId={activeVer} onSetActive={setActiveVer} addons={ADDONS} /></>;
    if (stage === "completed") center = <>
      <DeflectionBanner items={["Sold-out recovered into a sale", "Proposal self-served (V1 → V2)", "Hold self-served · AT-88421", "Modification repriced & committed", "2 approvals · both human-gated", "Full audit trail · 12+ events"]} />
      <HoldCard version="V2" total={3365} />
      <ProposalCard versions={versions} activeId={activeVer} onSetActive={setActiveVer} addons={ADDONS} />
    </>;

    return (
      <div className="eb-app">
        <header className="eb-top">
          <div className="eb-logo"><span className="mark">E</span><span className="t">EasyBook Next <small>· AlpiGPT embedded</small></span></div>
          <div className="eb-crumb">
            <span style={{ cursor: "pointer", color: route === "workbench" ? "var(--color-accent-primary)" : undefined }} onClick={() => setRoute("dashboard")}>Dashboard</span>
            {route === "workbench" && <><span className="sep">/</span><b>WP-2231 · Famiglia Bianchi</b></>}
          </div>
          <div className="eb-top-r">
            {route === "workbench" && <span className="eb-stage"><span className={`dot ${working ? "busy" : ""}`} /> {STAGE_LABEL[stage]}</span>}
            <div className="eb-agency"><span>Rossi Travel</span><span className="gold">Gold</span></div>
            {route === "workbench" && <button className="eb-btn sm" onClick={() => location.reload()}>↺ Restart</button>}
          </div>
        </header>

        {route === "dashboard" && (
          <main className="eb-dash">
            <div className="eb-dash-in">
              <div className="eb-dash-head">
                <div><h1>Buongiorno, Marco.</h1><div className="sub">3 work packages in flight · 1 hold expiring today · AlpiGPT resolved 2 of your last 3 cases without support.</div></div>
                <button className="eb-btn primary" onClick={openLead}><Ki name="chat-bot" size={14} /> Start new quote</button>
              </div>
              <div className="eb-dash-grid">
                <div className="eb-panel">
                  <div className="eb-panel-h">Resume work packages <span className="count">{dashboard.resume.length}</span></div>
                  {dashboard.resume.map((w) => (
                    <div className={`eb-wp ${w.hot ? "hot" : ""}`} key={w.id} onClick={() => w.hot ? openLead() : showToast("This prototype follows WP-2231 — open the Bianchi lead.")}>
                      <span className="id">{w.id}</span>
                      <div style={{ flex: 1, minWidth: 0 }}><div className="t">{w.title}</div><div className="m">{w.meta}</div></div>
                      <span className="stage">{w.stage}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="eb-panel">
                    <div className="eb-panel-h">Expiring holds</div>
                    {dashboard.holds.map((h) => (
                      <div className={`eb-hold ${h.urgent ? "urgent" : ""}`} key={h.ref}><span className="ref">{h.ref}</span><span>{h.title}</span><span className="exp">{h.urgent ? "⚠ " : ""}expires {h.expires}</span></div>
                    ))}
                  </div>
                  <div className="eb-panel">
                    <div className="eb-panel-h">Self-service signals · this week</div>
                    {dashboard.signals.map((s, i) => (
                      <div className={`eb-sig ${s.kind}`} key={i}><Ki name={s.kind === "success" ? "checkmark-filled" : "warning-alt"} size={13} /><div><div className="t">{s.t}</div><div className="s">{s.s}</div></div></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {route === "workbench" && (
          <div className="eb-bench">
            <SummaryRail stageIdx={planIdx[0]} needs={needs} blockers={blk} signals={signals} selected={selected} onFixBlocker={fixBlocker} />
            <main className="eb-center">{center}</main>
            <OrchestrationRail
              tab={tab} setTab={setTab} msgs={msgs} working={working} quick={quick} onQuick={onQuick} onSend={onSend}
              approval={approval} onApprove={() => pendingApprove.current && pendingApprove.current()} onReject={rejectApproval}
              planDoneIdx={planIdx[0]} planActiveIdx={planIdx[1]} confidence={confidence}
              timeline={timeline} srcIds={srcIds}
              escalation={{ blocked: false, events: timeline.length, version: activeVer || "—", reason: "unsupported servicing action" }}
              onEscalate={onEscalate}
              counts={{ sources: srcIds.length, timeline: timeline.length }}
            />
          </div>
        )}

        {toast && <div className="eb-toast">{toast}</div>}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
