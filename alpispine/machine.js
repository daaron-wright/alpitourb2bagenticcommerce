/* ============================================================
   Alpitour Agentic Intelligence Platform — compiled state machine
   Source of truth: alpitour_agentic_intelligence_platform_state_machine.json
   (journey_id: alpitour_agentic_intelligence_platform_v1 · 37 states)

   This is the BRD compiled to an executable journey. It drives the
   Decision Graph views:
     · Business activities          → the full state graph, by module
     · Decision rights / access     → the gates + authorities subgraph
     · Compliance & regulatory gov  → the TravelRadar↔PAC policy loop
     · Live event path              → the allotment disruption trace
   Every node is a real state; every edge is a real transition
   (label = the control-attribute value that unlocks it).
   ============================================================ */
(function () {
  // Module → palette (Shidoka categorical, order-locked by prominence)
  const MOD = {
    "Platform":                   { c: "#334155", label: "Platform" },
    "AlpiGPT":                 { c: "#475569", label: "AlpiGPT" },
    "TravelRadar":                   { c: "#64748B", label: "TravelRadar" },
    "Tour-Ops Agentic Spine": { c: "#3E4C5E", label: "Tour-Ops Spine" },
    "PAC":                        { c: "#5B6B7B", label: "PAC · policy" },
    "Integration":                { c: "#7E8C9A", label: "Integration" },
    "Concierge Desk":          { c: "#94A3B8", label: "Concierge Desk" },
    "Regulatory/Legal":           { c: "#566273", label: "Regulatory / Legal" },
    "Sales/Customer Service":     { c: "#8995A4", label: "Sales / Cust Service" },
    "Operations/Finance":         { c: "#52606F", label: "Operations / Finance" },
    "Knowledge Governance":       { c: "#A6B0BC", label: "Knowledge Governance" },
    "Audit/Observability":        { c: "#6B7888", label: "Audit / Observability" },
    "Identity":                   { c: "#415062", label: "Identity" },
  };

  // n: name · s: short display label · m: module · t: type · ctrl: control attribute
  // tx: [target, value-label] transitions (value = the control value that unlocks it)
  const S = [
    { n: "Request Intake & Classification", s: "Intake & classify", m: "Platform", t: "initial", ctrl: "request_type",
      tx: [["Identity & Account Scope Gate", "package rec"], ["Identity & Account Scope Gate", "itinerary"], ["Identity & Account Scope Gate", "regulatory Q"], ["Identity & Account Scope Gate", "rebook"], ["Ops Signal Assessment", "ops disruption"], ["TravelRadar Change Detection", "advisory change"], ["Human Escalation Router", "unsupported"]] },
    { n: "Identity & Account Scope Gate", s: "Identity gate", m: "Identity", t: "decision", ctrl: "access_scope",
      tx: [["Approved Source Retrieval", "authorized"], ["Approved Source Retrieval", "limited"], ["Closed - Access Denied", "unauthorized"]] },
    { n: "Approved Source Retrieval", s: "Source retrieval", m: "Platform", t: "process", ctrl: "source_grounding_status",
      tx: [["Customer Intent Branch", "grounded"], ["Human Escalation Router", "insufficient"], ["Human Escalation Router", "obsolete src"]] },
    { n: "Customer Intent Branch", s: "Intent branch", m: "AlpiGPT", t: "decision", ctrl: "customer_workflow",
      tx: [["Package Recommendation Analysis", "package rec"], ["Itinerary Guidance Analysis", "itinerary"], ["TravelRadar Compliance Check", "regulatory"], ["Proactive Rebooking Analysis", "rebook"]] },
    { n: "Package Recommendation Analysis", s: "Package rec", m: "AlpiGPT", t: "process", ctrl: "package_recommendation_status",
      tx: [["TravelRadar Compliance Check", "ranked"], ["Human Escalation Router", "no candidate"], ["Human Escalation Router", "low conf"]] },
    { n: "Itinerary Guidance Analysis", s: "Itinerary", m: "AlpiGPT", t: "process", ctrl: "itinerary_guidance_status",
      tx: [["PAC Answer Policy Check", "documented"], ["Concierge Desk Escalation", "safety"], ["Concierge Desk Escalation", "novel"], ["Human Escalation Router", "low conf"]] },
    { n: "TravelRadar Compliance Check", s: "Reg check", m: "TravelRadar", t: "process", ctrl: "regulatory_check_status",
      tx: [["Availability & Allotment Risk Check", "compliant"], ["PAC Answer Policy Check", "informational"], ["Regulatory or Legal Escalation", "sensitive"], ["Regulatory or Legal Escalation", "certification"], ["PAC Answer Policy Check", "restricted"]] },
    { n: "Availability & Allotment Risk Check", s: "Avail & risk", m: "Tour-Ops Agentic Spine", t: "process", ctrl: "allotment_risk_status",
      tx: [["PAC Answer Policy Check", "low risk"], ["PAC Answer Policy Check", "constrained"], ["Re-accommodation Guidance", "disrupted"], ["PAC Answer Policy Check", "no data"]] },
    { n: "Re-accommodation Guidance", s: "Re-accommodate", m: "Tour-Ops Agentic Spine", t: "process", ctrl: "customer_guidance_status",
      tx: [["PAC Answer Policy Check", "alternatives"], ["Trade Desk or Sales Escalation", "route sales"], ["Human Escalation Router", "no guidance"]] },
    { n: "Proactive Rebooking Analysis", s: "Rebooking", m: "AlpiGPT", t: "process", ctrl: "rebooking_analysis_status",
      tx: [["PAC Controlled Action Check", "prompt ready"], ["Availability & Allotment Risk Check", "alt needed"], ["Closed - No Action", "not allowed"], ["Trade Desk or Sales Escalation", "route sales"]] },
    { n: "PAC Answer Policy Check", s: "PAC answer", m: "PAC", t: "decision", ctrl: "pac_answer_decision",
      tx: [["Cited Response Generation", "allow"], ["Closed - Denied by Policy", "deny"], ["Human Escalation Router", "route human"], ["Human Escalation Router", "simulation"]] },
    { n: "Cited Response Generation", s: "Cited response", m: "AlpiGPT", t: "process", ctrl: "response_status",
      tx: [["Next Action Routing", "ready"], ["Human Escalation Router", "needs review"], ["Human Escalation Router", "citation gap"]] },
    { n: "Next Action Routing", s: "Next action", m: "AlpiGPT", t: "decision", ctrl: "next_action",
      tx: [["System Workflow Trigger", "hold"], ["System Workflow Trigger", "quote"], ["PAC Controlled Action Check", "rebook"], ["Trade Desk or Sales Escalation", "sales"], ["Concierge Desk Escalation", "tech review"], ["Audit Logging & Closure", "no action"]] },
    { n: "PAC Controlled Action Check", s: "PAC action", m: "PAC", t: "decision", ctrl: "pac_action_decision",
      tx: [["Action Level Determination", "allow"], ["Closed - Denied by Policy", "deny"], ["Planner Evidence Screen", "route human"], ["Planner Evidence Screen", "simulation"]] },
    { n: "Action Level Determination", s: "Action level", m: "PAC", t: "decision", ctrl: "action_level",
      tx: [["Cited Response Generation", "L0 answer"], ["Planner Evidence Screen", "L1 recommend"], ["Planner Evidence Screen", "L2 approved"], ["System of Record Write", "L3 bounded-auto"], ["Closed - Denied by Policy", "L4 prohibited"]] },
    { n: "System Workflow Trigger", s: "Workflow trigger", m: "Integration", t: "process", ctrl: "workflow_trigger_status",
      tx: [["Audit Logging & Closure", "CRM/case"], ["Audit Logging & Closure", "hold"], ["Audit Logging & Closure", "quote"], ["Audit Logging & Closure", "rebook"], ["Human Escalation Router", "write failed"]] },
    { n: "Human Escalation Router", s: "Escalation router", m: "Platform", t: "decision", ctrl: "escalation_route",
      tx: [["Concierge Desk Escalation", "tech service"], ["Regulatory or Legal Escalation", "regulatory"], ["Regulatory or Legal Escalation", "legal"], ["Trade Desk or Sales Escalation", "sales/CS"], ["Planner Evidence Screen", "planner/finance"], ["Knowledge Gap Capture", "content owner"]] },
    { n: "Concierge Desk Escalation", s: "Tech service", m: "Concierge Desk", t: "process", ctrl: "technical_service_status",
      tx: [["Cited Response Generation", "approved"], ["Customer Clarification Request", "clarify"], ["Knowledge Gap Capture", "unsupported"]] },
    { n: "Regulatory or Legal Escalation", s: "Reg / Legal", m: "Regulatory/Legal", t: "process", ctrl: "regulatory_review_status",
      tx: [["Cited Response Generation", "approved info"], ["System Workflow Trigger", "formal doc"], ["Closed - Denied by Policy", "denied"], ["Customer Clarification Request", "clarify"]] },
    { n: "Trade Desk or Sales Escalation", s: "Sales / CS", m: "Sales/Customer Service", t: "process", ctrl: "sales_service_status",
      tx: [["Audit Logging & Closure", "case created"], ["System Workflow Trigger", "confirmed"], ["Customer Clarification Request", "clarify"]] },
    { n: "Customer Clarification Request", s: "Clarification", m: "Platform", t: "process", ctrl: "clarification_status",
      tx: [["Request Intake & Classification", "received"], ["Customer Clarification Request", "waiting"], ["Closed - No Action", "abandoned"]] },
    { n: "Knowledge Gap Capture", s: "Knowledge gap", m: "Knowledge Governance", t: "process", ctrl: "knowledge_gap_status",
      tx: [["Audit Logging & Closure", "captured"], ["Audit Logging & Closure", "content update"]] },
    { n: "Ops Signal Assessment", s: "Signal assess", m: "Tour-Ops Agentic Spine", t: "process", ctrl: "disruption_status",
      tx: [["Tour-Ops Agent Analysis", "disruption"], ["Closed - No Action", "no disruption"], ["Human Escalation Router", "low signal"]] },
    { n: "Tour-Ops Agent Analysis", s: "Agent analysis", m: "Tour-Ops Agentic Spine", t: "process", ctrl: "agent_analysis_status",
      tx: [["PAC Controlled Action Check", "options ready"], ["Planner Evidence Screen", "no options"], ["PAC Controlled Action Check", "margin risk"], ["Human Escalation Router", "needs data"]] },
    { n: "Planner Evidence Screen", s: "Evidence screen", m: "Tour-Ops Agentic Spine", t: "process", ctrl: "evidence_screen_status",
      tx: [["Planner Finance or Business Approval", "prepared"], ["Human Escalation Router", "incomplete"]] },
    { n: "Planner Finance or Business Approval", s: "Approval", m: "Operations/Finance", t: "process", ctrl: "approval_decision",
      tx: [["System of Record Write", "approved"], ["Audit Logging & Closure", "rejected"], ["PAC Controlled Action Check", "modified"], ["Planner Finance or Business Approval", "pending"]] },
    { n: "System of Record Write", s: "SoR write", m: "Integration", t: "process", ctrl: "system_write_status",
      tx: [["Downstream Notification", "written"], ["Human Escalation Router", "blocked"], ["Closed - Denied by Policy", "not allowed"]] },
    { n: "Downstream Notification", s: "Notify", m: "Platform", t: "process", ctrl: "notification_status",
      tx: [["Audit Logging & Closure", "sent"], ["Audit Logging & Closure", "not required"], ["Audit Logging & Closure", "failed"]] },
    { n: "TravelRadar Change Detection", s: "Change detect", m: "TravelRadar", t: "process", ctrl: "regulatory_change_status",
      tx: [["Regulatory Change Validation", "change"], ["Closed - No Action", "no change"]] },
    { n: "Regulatory Change Validation", s: "Change validate", m: "TravelRadar", t: "process", ctrl: "interpretation_status",
      tx: [["PAC Policy Update", "validated"], ["Closed - No Action", "rejected"], ["Regulatory or Legal Escalation", "legal review"]] },
    { n: "PAC Policy Update", s: "Policy update", m: "PAC", t: "process", ctrl: "policy_update_status",
      tx: [["Regulatory Impact Propagation", "published"], ["Regulatory Change Validation", "pending"], ["Closed - Denied by Policy", "rejected"]] },
    { n: "Regulatory Impact Propagation", s: "Impact propagate", m: "TravelRadar", t: "process", ctrl: "impact_propagation_status",
      tx: [["Downstream Notification", "answers updated"], ["Downstream Notification", "recs adjusted"], ["Availability & Allotment Risk Check", "ops check"]] },
    { n: "Audit Logging & Closure", s: "Audit & close", m: "Audit/Observability", t: "process", ctrl: "audit_status",
      tx: [["Closed - Completed", "complete"], ["Audit Logging & Closure", "incomplete"], ["Human Escalation Router", "audit exception"]] },
    { n: "Closed - Completed", s: "Completed", m: "Platform", t: "final", ctrl: "case_close_status", tx: [] },
    { n: "Closed - Denied by Policy", s: "Denied", m: "PAC", t: "final", ctrl: "case_close_status", tx: [] },
    { n: "Closed - Access Denied", s: "Access denied", m: "Identity", t: "final", ctrl: "case_close_status", tx: [] },
    { n: "Closed - No Action", s: "No action", m: "Platform", t: "final", ctrl: "case_close_status", tx: [] },
  ];

  const byName = {};
  S.forEach(s => (byName[s.n] = s));

  function node(s) { return { id: s.n, label: s.s, cat: s.m, type: s.t }; }
  function usedCats(states) {
    const c = {};
    states.forEach(s => { if (MOD[s.m]) c[s.m] = MOD[s.m]; });
    return c;
  }
  function buildSub(names) {
    const set = new Set(names);
    const states = S.filter(s => set.has(s.n));
    const links = [];
    states.forEach(s => s.tx.forEach(([tg, val]) => { if (set.has(tg)) links.push({ source: s.n, target: tg, rel: val }); }));
    return { cats: usedCats(states), nodes: states.map(node), links };
  }
  function buildFull() {
    const links = [];
    S.forEach(s => s.tx.forEach(([tg, val]) => { if (byName[tg]) links.push({ source: s.n, target: tg, rel: val }); }));
    return { cats: usedCats(S), nodes: S.map(node), links };
  }

  // Decision rights / access — the gates and the authorities they answer to
  const RIGHTS = [
    "Identity & Account Scope Gate", "Customer Intent Branch", "Next Action Routing",
    "PAC Answer Policy Check", "PAC Controlled Action Check", "Action Level Determination",
    "Human Escalation Router", "Planner Evidence Screen", "Planner Finance or Business Approval",
    "System of Record Write", "Closed - Denied by Policy", "Closed - Access Denied",
  ];
  // Compliance & regulatory governance — the TravelRadar ↔ PAC policy lifecycle
  const GOV = [
    "TravelRadar Change Detection", "Regulatory Change Validation", "PAC Policy Update",
    "Regulatory Impact Propagation", "Downstream Notification", "Regulatory or Legal Escalation",
    "TravelRadar Compliance Check", "PAC Answer Policy Check", "Closed - Denied by Policy", "Closed - No Action",
  ];

  // Live event path — the allotment disruption traced through the machine
  const LIVE = [
    { n: "Request Intake & Classification", decision: "ops_disruption", note: "A West-wing closure at Jaz Mirabel is classified as a tour-ops disruption signal." },
    { n: "Ops Signal Assessment", decision: "disruption_detected", note: "The Disruption agent confirms the allotment cut breaks a planning assumption across 14 departures." },
    { n: "Tour-Ops Agent Analysis", decision: "options_ready", note: "Cost, Inventory and Demand agents recompute impact and assemble a reroute option set." },
    { n: "PAC Controlled Action Check", decision: "route_to_human", note: "PAC permits the controlled action but routes it to a human — covenant + margin floor in scope." },
    { n: "Action Level Determination", decision: "level_2_human_approved_action", note: "Tier-2: a human-approved action. Not answer-only, not bounded-auto — a planner must sign." },
    { n: "Planner Evidence Screen", decision: "prepared", note: "Cause, affected customers, policy checks, expected impact and the proposed booking writes are assembled on one screen." },
    { n: "Planner Finance or Business Approval", decision: "approved", note: "The duty planner signs off after reviewing the staged, reversible writes." },
    { n: "System of Record Write", decision: "written", note: "Three approved writes commit to EasyBook — re-point batch, booking swap, forecast re-point." },
    { n: "Downstream Notification", decision: "sent", note: "The trade desk and the agency are notified; the Bianchi family's 14-Aug date is protected." },
    { n: "Audit Logging & Closure", decision: "complete", note: "The full reason chain — sources, agent decisions, policy checks, approval, writes — is sealed." },
    { n: "Closed - Completed", decision: "completed", note: "Case closed with a complete audit trail. One screen, one decision." },
  ].map(x => ({ ...x, m: byName[x.n].m, ctrl: byName[x.n].ctrl, type: byName[x.n].t }));

  window.MACHINE = {
    mods: MOD,
    states: S,
    byName,
    full: buildFull(),
    decisionRights: buildSub(RIGHTS),
    governance: buildSub(GOV),
    livePath: LIVE,
    counts: { states: S.length, modules: Object.keys(MOD).length, transitions: S.reduce((a, s) => a + s.tx.length, 0) },
  };
})();
