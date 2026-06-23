/* ============================================================
   Dow Sample-to-Ship Orchestration — canonical data layer
   One source of truth shared by every screen. Illustrative
   data modelled on the ENGAGE automotive TPO worked example.
   ============================================================ */
(function () {
  const DATA = {};

  /* ---- The order case (single source of truth) ---- */
  DATA.kase = {
    id: "OC-2026-04817",
    sapRef: "SO 0045123887",
    customer: "Meridian Automotive Systems",
    account: "ACT-21188 · Tier-1 · Strategic",
    shipTo: "Plant 7 · Saltillo, Coahuila, MX",
    program: "NA-2027 crossover · front bumper fascia",
    application: "Hard TPO · exterior fascia",
    process: "Injection molding (at-press let-down)",
    priorities: ["Superior impact", "Thinner / stiffer wall", "−40 °C ductility", "Lighter weight"],
    geography: "North America platform",
    quantity: "18,000 kg · initial qualification lot",
    requestedDate: "10-Jul-2026",
    channel: "Sales-assisted (rep brief)",
    incoterm: "DAP · Saltillo",
    marginImpact: "+$214k annualised at platform volume",
    revenueAtRisk: "$1.92M program",
  };

  /* ---- Roles (asymmetric views + accountability) ---- */
  DATA.roles = [
    { id: "sales", name: "Maria Chen", initials: "MC", title: "Account manager", team: "Commercial", color: "var(--k-warm-red-50)" },
    { id: "lab", name: "Dr. Ana Reyes", initials: "AR", title: "Technical service", team: "Lab / TS&D", color: "var(--k-spruce-60)" },
    { id: "compliance", name: "Rume Okafor", initials: "RO", title: "Regulatory & trade", team: "Compliance", color: "#8A4FBF" },
    { id: "ops", name: "Jonah Patel", initials: "JP", title: "Digital Ops steward", team: "Digital Operations", color: "var(--k-blue-60)" },
    { id: "gtm", name: "Sigrid Lindqvist", initials: "SL", title: "GTM process owner", team: "Revenue Operations", color: "#E68A00" },
  ];

  /* ---- Ownership model (hybrid, baked into the UI) ---- */
  DATA.ownership = [
    { layer: "Business outcome", owner: "Revenue Ops · S. Lindqvist", role: "Accountable", note: "Revenue leakage, cycle time, promise accuracy" },
    { layer: "Day-to-day operation", owner: "Digital Ops · J. Patel", role: "Responsible", note: "Queue health, SLAs, exception swarming, runbooks" },
    { layer: "Policy bundles", owner: "Compliance · R. Okafor", role: "Consulted", note: "Rule authoring, approval, override authority" },
    { layer: "Runtime / platform", owner: "Kyndryl Agentic Framework", role: "Informed", note: "Case state, routing, integration health, telemetry" },
  ];

  /* ---- ENGAGE product recommendations (fit packet) ---- */
  DATA.products = [
    {
      id: "xlt8677", name: "ENGAGE XLT 8677", rank: 1, confidence: 94, recommended: true,
      bizRisk: "low", regRisk: "low",
      family: "Polyolefin elastomer · XLT", mfr: "1.0 g/10min", density: "0.870 g/cm³",
      tags: ["Superior impact", "−40 °C ductility", "Thinner / stiffer", "Lighter weight"],
      fit: "Best fit",
      reason: "Highest cold-temperature impact-to-stiffness ratio in the portfolio. XLT chemistry lets the compounder down-gauge the fascia wall while holding −40 °C ductile failure, directly serving the program's lightweighting and impact priorities.",
      signals: [
        { tone: "ok", text: "−40 °C Izod ductile in Dow application data for hard-TPO fascia" },
        { tone: "ok", text: "Enables 8–12% wall down-gauge vs. incumbent at equal stiffness" },
        { tone: "warn", text: "Confirm let-down ratio at-press with customer's PP carrier" },
      ],
      lab: "Qualification lot in stock · Freeport TX",
    },
    {
      id: "e8180", name: "ENGAGE 8180", rank: 2, confidence: 88, recommended: false,
      bizRisk: "low", regRisk: "low",
      family: "Polyolefin elastomer", mfr: "0.5 g/10min", density: "0.863 g/cm³",
      tags: ["Superior impact", "High toughness"],
      fit: "Strong alternative",
      reason: "Proven superior-impact grade for exterior TPO. Lower MFR gives excellent toughness but less flow headroom for thin-wall fascia, so down-gauging potential is more limited than XLT 8677.",
      signals: [
        { tone: "ok", text: "Broad automotive exterior qualification history" },
        { tone: "warn", text: "Lower flow may constrain thin-wall fill on this geometry" },
      ],
      lab: "In stock · Freeport TX",
    },
    {
      id: "hm7387", name: "ENGAGE HM 7387", rank: 3, confidence: 81, recommended: false,
      bizRisk: "medium", regRisk: "low",
      family: "Polyolefin elastomer · HM", mfr: "1.0 g/10min", density: "0.868 g/cm³",
      tags: ["High melt strength", "Low gloss"],
      fit: "Consider if gloss-critical",
      reason: "High-melt-strength grade favouring low-gloss surface aesthetics. Relevant if the fascia spec tightens on gloss or moves to extrusion/thermoforming; less optimal for pure injection-molded impact priority.",
      signals: [
        { tone: "ok", text: "Low-gloss surface without added matting agents" },
        { tone: "warn", text: "Impact priority better served by XLT 8677 for this part" },
      ],
      lab: "Sample only · 5–7 day prep",
    },
    {
      id: "hm7487", name: "ENGAGE HM 7487", rank: 4, confidence: 76, recommended: false,
      bizRisk: "high", regRisk: "low",
      family: "Polyolefin elastomer · HM", mfr: "0.5 g/10min", density: "0.870 g/cm³",
      tags: ["High melt strength", "Low gloss", "Extrusion"],
      fit: "Edge case",
      reason: "Highest melt strength of the shortlist for extrusion / blow-molding and deep-draw low-gloss parts. Out of profile for an injection-molded fascia but kept on the shortlist for traceability.",
      signals: [
        { tone: "warn", text: "Process mismatch — extrusion-oriented grade" },
      ],
      lab: "Sample only · 5–7 day prep",
    },
  ];

  /* ---- Policy as Code (RegRadar) decision ---- */
  DATA.policy = {
    bundle: "dow-trade-hazmat-na-v4.2.1",
    bundleDate: "29-May-2026 09:14",
    engine: "OPA 0.62 · decision log on",
    outcomes: {
      green: {
        state: "green", label: "Clear", headline: "All policy checks passed — order may proceed",
        sub: "4 of 4 rules satisfied · no obligations outstanding",
      },
      amber: {
        state: "amber", label: "Review", headline: "PFAS attestation required before release",
        sub: "3 of 4 rules satisfied · 1 obligation needs human review",
      },
      red: {
        state: "red", label: "Hold", headline: "Restricted-party match on consignee — order blocked",
        sub: "2 of 4 rules satisfied · 1 hard block · review required",
      },
    },
    rules: [
      {
        id: "HAZ-SDS-014", name: "Hazard communication / SDS", domain: "Hazmat", result: "pass",
        detail: "ENGAGE polyolefin elastomer pellets — not classified as hazardous for transport. SDS rev. 7 current and attached.",
        source: "OSHA HazCom 29 CFR 1910.1200 · Dow SDS rev. 7",
      },
      {
        id: "TRD-RPS-002", name: "Restricted-party screening", domain: "Trade", result: "pass",
        detail: "Consignee Meridian Automotive (Saltillo) and ship-to screened against OFAC / BIS lists. No match.",
        source: "BIS Consolidated Screening List · 31-May-2026",
        redDetail: "Consignee alias 'Meridian Auto Holdings' returned a possible match on the BIS Entity List. Confidence 0.71 — requires manual disposition before any document or shipment is created.",
      },
      {
        id: "TRD-ECC-009", name: "Export classification", domain: "Trade", result: "pass",
        detail: "EAR99 · no licence required for MX destination. Classification inherited from product master.",
        source: "Dow product master · ECCN cache 27-May-2026",
      },
      {
        id: "REG-PFAS-021", name: "PFAS reporting attestation", domain: "Regulatory", result: "review",
        detail: "RegRadar detected an updated PFAS reporting trigger on 27-May. For new automotive ship-to records, a supplier PFAS-content attestation must be on file before the qualification lot ships.",
        source: "EPA TSCA 8(a)(7) update · RegRadar signal RR-2026-0413",
        missing: "Supplier PFAS-content attestation (form PFAS-ATT-2)",
        approver: "Compliance · R. Okafor",
      },
    ],
    explain: {
      ruleFired: "REG-PFAS-021",
      input: { product_family: "ENGAGE POE", destination: "MX", ship_to_status: "new", attestation_on_file: false },
      decision: "review",
      because: "ship_to_status == 'new' AND attestation_on_file == false",
      effective: "27-May-2026 · expires on attestation upload",
    },
  };

  /* ---- RegRadar watch feed ---- */
  DATA.regradar = [
    { id: "RR-2026-0413", date: "27-May", sev: "warning", title: "EPA TSCA 8(a)(7) PFAS reporting trigger updated", impact: "12 product families · 38 active ship-to records", routed: "Regulatory + Commercial", state: "Rule drafted" },
    { id: "RR-2026-0408", date: "21-May", sev: "info", title: "MX customs e-invoice (CFDI 4.0) field change", impact: "All MX-destination shipments", routed: "Logistics", state: "Published" },
    { id: "RR-2026-0399", date: "14-May", sev: "warning", title: "EU REACH SVHC candidate list addition", impact: "EU-platform variants only", routed: "Regulatory + R&D", state: "Monitoring" },
  ];

  /* ---- Unified timeline (phases of THIS case) ---- */
  DATA.timeline = [
    { phase: "Intent captured", packet: "Intent", status: "done", owner: "Sales · M. Chen", agent: "Parsed brief, scored completeness", ts: "01-Jun 08:42", detail: "Natural-language brief normalised to 11 structured fields. Completeness 100%." },
    { phase: "Feasibility & fit", packet: "Fit", status: "done", owner: "Tech service · A. Reyes", agent: "Ranked 4 ENGAGE grades with citations", ts: "01-Jun 08:44", detail: "ENGAGE XLT 8677 recommended at 94% confidence; 3 alternatives retained." },
    { phase: "Lab sample", packet: "Sample", status: "active", owner: "Lab · A. Reyes", agent: "Monitoring prep SLA", ts: "01-Jun 09:10", detail: "Qualification lot pulled from Freeport. SLA clock running — 2 days to prep." },
    { phase: "Policy & hazmat", packet: "Policy", status: "review", owner: "Compliance · R. Okafor", agent: "Auto rule check — 1 obligation flagged", ts: "01-Jun 09:12", detail: "PFAS attestation required for new ship-to. Awaiting disposition." },
    { phase: "SAP entry", packet: "Execution", status: "pending", owner: "System", agent: "Auto-sync on policy clear", ts: "—", detail: "Sales order will create / update on green policy state." },
    { phase: "3PL booking", packet: "Booking", status: "pending", owner: "Logistics · agent", agent: "Auto-booking on delivery release", ts: "—", detail: "Carrier rate-shop and booking payload prepared, held for release." },
    { phase: "Shipment", packet: "Delivery", status: "pending", owner: "3PL", agent: "Tracking + ETA", ts: "—", detail: "Customer-safe timeline and document bundle published on dispatch." },
  ];

  /* ---- Live agent run (step timeline for intake) ---- */
  DATA.agentSteps = [
    { label: "Parsed rep brief into structured criteria", sub: "11 fields · application, process, climate, priorities", state: "done", ts: "+0.3s" },
    { label: "Matched ENGAGE portfolio to use case", sub: "tool · catalog.match · 4 candidate grades", state: "done", ts: "+1.1s" },
    { label: "Ran policy precheck", sub: "tool · policy.evaluate · bundle v4.2.1", state: "done", ts: "+1.9s" },
    { label: "Estimated lab prep + delivery date", sub: "tool · sla.predict · 2d prep · DAP transit", state: "active", ts: "running…" },
    { label: "Drafted intent packet for triage", sub: "writes case OC-2026-04817", state: "pending", ts: "queued" },
  ];

  /* ---- Exception workspace (revenue-at-risk command center) ---- */
  DATA.exceptions = [
    {
      id: "EXC-3391", type: "Lab SLA at risk", sev: "high", caseId: "OC-2026-04817", customer: "Meridian Automotive",
      revenue: "$1.92M", sla: "8h to breach", owner: "Digital Ops · J. Patel", primary: true,
      cause: "Freeport lab queue depth grew to 14 jobs overnight; the qualification-lot prep for OC-2026-04817 now projects 2 days late, putting the 10-Jul promise date at risk.",
      impact: "Slips customer qualification window; jeopardises NA-2027 platform award worth $1.92M.",
      recommendation: "Reroute prep to Plaquemine lab (capacity available). +0 net days vs. current slip, preserves compliance scope, protects promise date.",
      options: ["Approve reroute to Plaquemine", "Split lot across both labs", "Hold & notify customer"],
      evidence: ["lab.queue · Freeport depth 14", "sla.predict · −2d on current path", "capacity · Plaquemine 31% free"],
    },
    {
      id: "EXC-3387", type: "Trade screening hold", sev: "critical", caseId: "OC-2026-04790", customer: "Halcyon Polymers",
      revenue: "$640k", sla: "Blocked", owner: "Compliance · R. Okafor", primary: false,
      cause: "Consignee alias returned a possible BIS Entity List match (confidence 0.71).",
      impact: "Order blocked until manual disposition; no documents generated.",
      recommendation: "Route to compliance for restricted-party disposition with evidence packet.",
      options: ["Open policy packet", "Request re-screen", "Escalate to trade counsel"],
      evidence: ["policy.evaluate · TRD-RPS-002 red", "screening · 0.71 match"],
    },
    {
      id: "EXC-3382", type: "3PL on-hold", sev: "medium", caseId: "OC-2026-04771", customer: "Northwind Coatings",
      revenue: "$118k", sla: "26h to breach", owner: "Logistics · agent", primary: false,
      cause: "Carrier returned an on-hold webhook: address validation failed on the consignee dock.",
      impact: "Booking cannot confirm; ETA unknown until corrected.",
      recommendation: "Apply corrected dock address from CRM and re-book with same carrier.",
      options: ["Apply CRM address & rebook", "Switch carrier", "Contact customer"],
      evidence: ["webhook · shipment.on_hold", "crm · validated dock address"],
    },
    {
      id: "EXC-3375", type: "SAP sync mismatch", sev: "low", caseId: "OC-2026-04760", customer: "Veld Industries",
      revenue: "$54k", sla: "On track", owner: "Digital Ops · J. Patel", primary: false,
      cause: "Promise date in the case differs from the SAP delivery block by 1 day.",
      impact: "Minor — customer-facing ETA may show stale date.",
      recommendation: "Re-sync delivery date from SAP as source of record.",
      options: ["Re-sync from SAP", "Override case date", "Ignore"],
      evidence: ["sap.delivery · 12-Jul", "case.promise · 11-Jul"],
    },
  ];

  /* ---- Learning loop / "Learned from you" inbox ---- */
  DATA.learning = [
    {
      id: "LRN-882", action: "Override · PFAS attestation waived (one lot)", by: "R. Okafor", reason: "Pre-existing master attestation on file under parent account",
      derived: "REG-PFAS-021 · ship_to_status=new", blast: "applied to this case only · expiry 30 days", outcome: "Rule exception proposed: inherit attestation from parent account", kind: "rule", ts: "2m ago",
    },
    {
      id: "LRN-879", action: "Reroute approved · Freeport → Plaquemine", by: "J. Patel", reason: "Queue depth > 12 should pre-emptively load-balance",
      derived: "EXC pattern · lab SLA risk", blast: "matched 6 similar cases last 30d · avg +1.4d saved", outcome: "Runbook updated: auto-propose reroute at queue depth ≥ 12", kind: "runbook", ts: "1h ago",
    },
    {
      id: "LRN-871", action: "Recommendation accepted · ENGAGE XLT 8677", by: "M. Chen", reason: "Matched cold-weather fascia pattern exactly",
      derived: "fit · −40 °C + thin-wall priority", blast: "reinforced for 23 similar briefs", outcome: "Confidence weighting +0.03 for XLT on cold-weather fascia", kind: "model", ts: "3h ago",
    },
    {
      id: "LRN-864", action: "False positive flagged · trade hold", by: "R. Okafor", reason: "Alias match was a different legal entity",
      derived: "TRD-RPS-002 · alias confidence 0.71", blast: "tightened alias threshold 0.70 → 0.80", outcome: "Screening rule retuned · −18% false positives projected", kind: "rule", ts: "1d ago",
    },
  ];

  /* ---- KPI spine (control-tower glance, used in headers/strips) ---- */
  DATA.kpis = [
    { label: "Order cycle time", value: "6.2d", delta: "−1.8d", dir: "down", good: true, sub: "intent → ship · 12-wk" },
    { label: "Perfect-order rate", value: "91%", delta: "+4.1", dir: "up", good: true, sub: "OTIF + doc-complete" },
    { label: "Policy auto-clear", value: "84%", delta: "+6.0", dir: "up", good: true, sub: "no human touch" },
    { label: "Revenue at risk", value: "$2.7M", delta: "−$0.9M", dir: "down", good: true, sub: "amber + red state" },
  ];

  window.DATA = DATA;
})();
