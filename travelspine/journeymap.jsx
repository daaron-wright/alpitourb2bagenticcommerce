/* ============================================================
   Journey Map — dagre-laid ReactFlow graph of the compiled
   state machine, one named journey at a time. Repo-faithful
   node cards (type badge · actors · transition values ·
   automation), true/false transition edges, minimap + controls,
   and a node-details modal with BRD content + Rego policy + tests.
   ============================================================ */
(function () {
  const UI = (window.UI = window.UI || {});

  function humanize(s) {
    return String(s).replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
  function shortVal(v) {
    return String(v).replace("level_0_answer_only", "L0 · answer only").replace("level_1_recommend", "L1 · recommend")
      .replace("level_2_human_approved_action", "L2 · human-approved").replace("level_3_bounded_auto_action", "L3 · bounded auto")
      .replace("level_4_prohibited", "L4 · prohibited").replace(/_/g, " ");
  }
  const DENY_TARGETS = new Set(["Closed - Denied by Policy", "Closed - Access Denied", "Closed - No Action"]);

  // type badge palette (repo-faithful)
  function badgeClass(t, isFinal, isInitial) {
    if (isInitial) return "jm-badge teal";
    if (isFinal) return "jm-badge rose";
    if (t === "decision" || t === "process") return "jm-badge teal";
    return "jm-badge slate";
  }
  function badgeLabel(s) {
    if (s.t === "initial") return "Initial state";
    if (s.t === "final") return "Final state";
    return s.t;
  }

  // ---- dagre layout ----
  function layout(nodeIds, edges, sizeOf) {
    const dagre = window.dagre;
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: "TB", ranksep: 64, nodesep: 48, marginx: 30, marginy: 30 });
    nodeIds.forEach(id => { const s = sizeOf(id); g.setNode(id, { width: s.w, height: s.h }); });
    edges.forEach(e => g.setEdge(e.source, e.target));
    dagre.layout(g);
    const pos = {};
    nodeIds.forEach(id => { const n = g.node(id); pos[id] = { x: n.x - n.width / 2, y: n.y - n.height / 2 }; });
    return pos;
  }

  // ---- ReactFlow custom node — compact: badge · title · one actor line.
  //      Full detail (description, transitions, automation, policy) lives
  //      in the click-through node modal. ----
  function JourneyNodeCard({ data }) {
    const RF = window.ReactFlow;
    const { Handle, Position } = RF;
    const s = data.state;
    const approved = data.approved;
    return (
      <React.Fragment>
        <Handle type="target" position={Position.Top} className="jm-handle" />
        <div className={`jm-card ${data.selected ? "is-selected" : ""} ${approved ? "is-approved" : ""} ${data.highlight ? "is-trace" : ""}`} onClick={() => data.onOpen(s.n)}>
          <div className="jm-card-top">
            <span className={badgeClass(s.t, s.t === "final", s.t === "initial")}>{badgeLabel(s)}</span>
            {approved && <span className="jm-status ok"><UI.Icon name="checkmark-filled" size={11} /></span>}
          </div>
          <div className="jm-card-title">{s.n}</div>
          <div className="jm-card-meta">
            <span className={`jm-actor ${data.lane}`}><UI.Icon name="user" size={10} />{data.actor}</span>
            {data.meta && data.meta.fn && <span className="jm-auto"><span className="dot" />Automated</span>}
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="jm-handle" />
      </React.Fragment>
    );
  }

  function JourneyMap({ toast }) {
    const RF = window.ReactFlow || {};
    const Flow = RF.default || RF.ReactFlow;
    const J = window.JOURNEYS, M = window.MACHINE;
    const initHi = (typeof window !== "undefined" && window.__jmHighlight) || null;
    const initJid = (() => {
      if (initHi) { const jj = J.JOURNEYS.find(j => j.ids.includes(initHi)); if (jj) return jj.id; }
      return J.JOURNEYS[0].id;
    })();
    const [jid, setJid] = React.useState(initJid);
    const [hi, setHi] = React.useState(initHi);
    React.useEffect(() => { if (window.__jmHighlight) window.__jmHighlight = null; }, []);
    const [openId, setOpenId] = React.useState(null);
    const [rf, setRf] = React.useState(null);
    const [appr, setAppr] = React.useState(new Set());

    const journey = J.JOURNEYS.find(j => j.id === jid);

    const { rfNodes, rfEdges } = React.useMemo(() => {
      const inSet = new Set(journey.ids.filter(id => M.byName[id]));
      const ids = Array.from(inSet);
      // edges = real transitions within the journey set
      const edges = [];
      ids.forEach(src => {
        (M.byName[src].tx || []).forEach(([tgt, val]) => {
          if (inSet.has(tgt)) edges.push({ source: src, target: tgt, val });
        });
      });
      // size estimate per node for dagre — compact card
      const sizeOf = (id) => {
        return { w: 212, h: 96 };
      };
      const pos = layout(ids, edges, sizeOf);
      const nodes = ids.map(id => {
        const s = M.byName[id];
        const txAll = (s.tx || []).filter(([t]) => inSet.has(t)).map(([target, val]) => ({ target, val }));
        return {
          id, type: "journey", position: pos[id],
          data: { state: s, meta: J.META[id] || {}, tx: txAll, actor: J.ACTOR[s.m] || s.m, lane: J.laneOf(id), approved: appr.has(id) || J.APPROVED.has(id), selected: false, highlight: hi === id, onOpen: setOpenId },
          draggable: true,
        };
      });
      const edgeList = edges.map((e, i) => {
        const deny = DENY_TARGETS.has(e.target);
        return {
          id: "e" + i, source: e.source, target: e.target, label: shortVal(e.val), type: "smoothstep",
          animated: !deny,
          style: { stroke: deny ? "#e11d48" : "#94a3b8", strokeWidth: deny ? 1.6 : 2, opacity: deny ? 0.7 : 1 },
          labelStyle: { fontSize: 9, fontWeight: 600, fill: deny ? "#9f1239" : "#475569", fontFamily: "var(--font-mono)" },
          labelBgStyle: { fill: "#fff", fillOpacity: 0.92 }, labelBgPadding: [3, 1], labelBgBorderRadius: 3,
          markerEnd: RF.MarkerType ? { type: RF.MarkerType.ArrowClosed, color: deny ? "#e11d48" : "#94a3b8", width: 14, height: 14 } : undefined,
        };
      });
      return { rfNodes: nodes, rfEdges: edgeList };
    }, [jid, appr, hi]);

    const nodeTypes = React.useMemo(() => ({ journey: JourneyNodeCard }), []);

    React.useEffect(() => { if (rf) setTimeout(() => rf.fitView({ padding: 0.18, duration: 500 }), 60); }, [jid, rf]);
    // focus the highlighted (trace-jumped) node
    React.useEffect(() => {
      if (rf && hi) setTimeout(() => { try { rf.fitView({ nodes: [{ id: hi }], padding: 0.55, duration: 600, maxZoom: 1.2 }); } catch (e) {} }, 220);
    }, [hi, rf, jid]);

    if (!Flow) return <div style={{ padding: 24, color: "var(--fg-muted)" }}>Journey map requires React Flow.</div>;

    return (
      <div className="jm">
        <div className="jm-head">
          <div>
            <div className="jm-eyebrow">Journey map · compiled from the BRD</div>
            <div className="jm-title">{journey.label}</div>
          </div>
          <div className="jm-actions">
            <button className="jm-btn ghost" onClick={() => rf && rf.fitView({ padding: 0.18, duration: 500 })}><UI.Icon name="renew" size={13} />Reset view</button>
            <button className="jm-btn solid" onClick={() => toast && toast("Walkthrough mode · step through each node to review its policy.")}><UI.Icon name="play" size={13} />Start walkthrough</button>
            {(() => {
              const total = journey.ids.filter(id => M.byName[id]).length;
              const done = journey.ids.filter(id => M.byName[id] && appr.has(id)).length;
              const all = done >= total;
              return (
                <button className={`jm-btn ${all ? "approved" : "approve"}`} onClick={() => {
                  if (all) { setAppr(new Set()); toast && toast("Approvals cleared for this journey."); }
                  else { setAppr(new Set(journey.ids)); toast && toast(`All ${total} nodes approved · ${journey.label} ready to deploy.`); }
                }}>
                  <UI.Icon name="checkmark-filled" size={13} />{all ? `All ${total} approved` : `Approve all nodes${done ? ` (${done}/${total})` : ""}`}
                </button>
              );
            })()}
          </div>
        </div>

        <div className="jm-tabs">
          <span className="jm-tabs-l">Journeys</span>
          {J.JOURNEYS.map(j => (
            <button key={j.id} className={`jm-tab ${jid === j.id ? "on" : ""}`} onClick={() => { setJid(j.id); setOpenId(null); setHi(null); }}>{j.label}</button>
          ))}
        </div>

        <div className="jm-canvas">
          <Flow nodes={rfNodes} edges={rfEdges} nodeTypes={nodeTypes} onInit={setRf} fitView fitViewOptions={{ padding: 0.18 }}
            nodesConnectable={false} edgesFocusable={false} nodesDraggable proOptions={{ hideAttribution: true }}
            minZoom={0.25} maxZoom={1.5} defaultEdgeOptions={{ type: "smoothstep" }}>
            {RF.Background && <RF.Background gap={24} size={1} color="#e2e8f0" />}
            {RF.Controls && <RF.Controls showInteractive={false} />}
            {RF.MiniMap && <RF.MiniMap pannable zoomable nodeColor={(n) => {
              const s = n.data && n.data.state; if (!s) return "#cbd5e1";
              if (s.t === "final") return DENY_TARGETS.has(s.n) ? "#fda4af" : "#86efac";
              if (s.t === "decision") return "#5eead4"; return "#cbd5e1";
            }} style={{ background: "#f8fafc" }} maskColor="rgba(241,245,249,.7)" />}
          </Flow>
        </div>

        {openId && <UI.NodeModal name={openId} journey={journey} onClose={() => setOpenId(null)} toast={toast} />}
      </div>
    );
  }
  UI.JourneyMap = JourneyMap;
})();
