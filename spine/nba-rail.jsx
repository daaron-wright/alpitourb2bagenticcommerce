/* ============================================================
   NBA rail — floating "Next best actions" button + collapsible
   right-side drawer. Condenses agent recommendations into one
   place; each item routes to the single screen where you act.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});
  const { Icon, Stroke, SourceAttribution } = UI;

  const SEV = {
    high: { c: "var(--k-warm-red-50)", l: "High" },
    med: { c: "var(--k-status-warning-100)", l: "Medium" },
    info: { c: "var(--k-spruce-60)", l: "Info" },
  };

  function NbaRail({ go, toast, naphtha = {} }) {
    const [open, setOpen] = React.useState(false);
    const [dismissed, setDismissed] = React.useState({});

    // Live recommendations derived from the actual back-end state.
    const items = React.useMemo(() => {
      const D = window.D, list = [];
      const secured = naphtha.secured, acked = naphtha.acked, samples = (naphtha.samples || []);
      if (!secured) {
        list.push({ id: "NBA-1", sev: "high", lens: "ops", screen: "flow", cta: "Review & sign off",
          title: "Sign off the supply reroute", why: "3 ERP writes are staged and reversible. Brandt's 18-Jun date holds only once you release them — the inventory agent is paused on your decision." });
      } else {
        list.push({ id: "NBA-1b", sev: "info", lens: "ops", screen: "flow", cta: "View the sealed flow",
          title: "Supply reroute committed", why: acked ? "Signed off and Brandt accepted the secured plan — audit sealed. Nothing further needed." : "Signed off and committed. Awaiting Brandt's confirmation on the customer side." });
      }
      list.push({ id: "NBA-2", sev: "high", lens: "ops", screen: "backtest", cta: "Open backtest lab",
        title: "Resolve policy conflict CFL-014", why: "Draft bundle v3.2 strands the reroute — covenant vs margin floor. Route to Compliance + Finance before it can promote past gate 3." });
      if (samples.length) {
        list.push({ id: "NBA-S", sev: "med", lens: "ops", screen: "queue", cta: "Open planner queue",
          title: `Qualify ${samples.length} ChemAssist sample${samples.length > 1 ? "s" : ""}`, why: `Brandt requested ${samples.map(s => s.grade).join(", ")} via ChemAssist — added to PO 8841 and waiting on a covenant check.` });
      }
      list.push({ id: "NBA-3", sev: "med", lens: "ops", screen: "learning", cta: "Open inbox",
        title: "Close 2 high-severity knowledge gaps", why: "Unanswered questions are blocking confident customer answers — route them to Technical Service and Regulatory." });
      list.push({ id: "NBA-4", sev: "med", lens: "ops", screen: "backtest", cta: "View deployment gates",
        title: "Gate 4 promotion is blocked", why: "Audit completeness is below 100%. Close it to unlock customer-visible commitments." });
      if (secured && !acked) {
        list.push({ id: "NBA-5", sev: "info", lens: "cx", screen: "customer", cta: "See customer view",
          title: "Brandt hasn't confirmed yet", why: "The reroute is committed and the date holds — nudge Brandt to accept the secured plan from the customer lens." });
      }
      return list.filter(n => !dismissed[n.id]);
    }, [naphtha.secured, naphtha.acked, (naphtha.samples || []).length, dismissed]);

    function act(n) {
      setOpen(false);
      go(n.lens, n.screen);
      toast(`Opened · ${n.title}`);
    }
    function dismiss(id) { setDismissed(d => ({ ...d, [id]: true })); }

    return (
      <React.Fragment>
        <button className={`nba-fab ${open ? "hidden" : ""}`} onClick={() => setOpen(true)} aria-label="Next best actions">
          <span className="nba-fab-ic"><Icon name="recommend" size={19} /></span>
          <span className="nba-fab-lbl">Next best actions</span>
          {items.length > 0 && <span className="nba-fab-count">{items.length}</span>}
        </button>

        <aside className={`nba-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
          <div className="nba-head">
            <span className="ai-glyph" style={{ width: 15, height: 15 }} />
            <span className="nba-title">Next best actions</span>
            {items.length > 0 && <span className="nba-count-pill">{items.length}</span>}
            <button className="nba-close" onClick={() => setOpen(false)}>Collapse <Stroke size={13} sw={2.4} children={<polyline points="9 18 15 12 9 6" />} /></button>
          </div>
          <div className="nba-sub">Agent-ranked. Each routes you to the one screen where you can act on it.</div>

          <div className="nba-list">
            {items.map(n => {
              const s = SEV[n.sev];
              return (
                <div className="nba-card" key={n.id}>
                  <div className="nba-c-top">
                    <span className="nba-sev" style={{ background: s.c }} />
                    <span className="nba-c-title">{n.title}</span>
                    <span className="nba-c-id">{n.id}</span>
                  </div>
                  <div className="nba-c-why">{n.why}</div>
                  <div className="nba-c-foot">
                    <button className="nba-c-cta" onClick={() => act(n)}>{n.cta} <Stroke size={12} sw={2.4} children={<polyline points="9 18 15 12 9 6" />} /></button>
                    <button className="nba-c-dismiss" onClick={() => dismiss(n.id)}>Dismiss</button>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="nba-empty">
                <span className="nba-empty-ic"><Icon name="checkmark-filled" size={26} /></span>
                <div className="nba-empty-t">You're all caught up</div>
                <div className="nba-empty-s">No actions need your attention right now. New recommendations land here as the agents work.</div>
              </div>
            )}
          </div>

          <div className="nba-foot"><SourceAttribution when="updated live">Ranked by the agentic spine</SourceAttribution></div>
        </aside>
      </React.Fragment>
    );
  }
  UI.NbaRail = NbaRail;
})();
