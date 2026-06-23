/* ============================================================
   Journeys — named paths through the compiled state machine,
   plus per-state metadata (primary actor, automation function,
   BRD reference, Rego control values) used by the Journey Map
   and the node-details modal.
   Source of truth: alpitour_agentic_intelligence_platform_state_machine.json
   ============================================================ */
(function () {
  // Module → primary actor label shown on node cards
  const ACTOR = {
    "Platform": "Platform orchestrator",
    "AlpiGPT": "AlpiGPT agent",
    "TravelRadar": "TravelRadar agent",
    "Tour-Ops Agentic Spine": "Tour-ops agents",
    "PAC": "Policy engine (PAC)",
    "Integration": "Integration services",
    "Concierge Desk": "Concierge Desk",
    "Regulatory/Legal": "Regulatory / Legal",
    "Sales/Customer Service": "Sales / Customer Service",
    "Operations/Finance": "Planner · Finance",
    "Knowledge Governance": "Content owner",
    "Audit/Observability": "Audit & observability",
    "Identity": "Identity & access",
  };

  // Lane (human / review / agent) — for the actor tag on each card
  const HUMAN = new Set(["Request Intake & Classification", "Customer Clarification Request", "Concierge Desk Escalation", "Regulatory or Legal Escalation", "Trade Desk or Sales Escalation", "Planner Evidence Screen", "Planner Finance or Business Approval"]);
  const REVIEW = new Set(["Identity & Account Scope Gate", "Customer Intent Branch", "TravelRadar Compliance Check", "PAC Answer Policy Check", "Next Action Routing", "PAC Controlled Action Check", "Action Level Determination", "Human Escalation Router", "Regulatory Change Validation", "PAC Policy Update", "Audit Logging & Closure", "Closed - Denied by Policy", "Closed - Access Denied"]);
  function laneOf(name) { return HUMAN.has(name) ? "human" : REVIEW.has(name) ? "review" : "agent"; }

  // Named journeys — ordered paths (real transitions are drawn between members)
  const JOURNEYS = [
    {
      id: "disruption", label: "Ops disruption",
      ids: ["Request Intake & Classification", "Ops Signal Assessment", "Tour-Ops Agent Analysis", "PAC Controlled Action Check", "Action Level Determination", "Planner Evidence Screen", "Planner Finance or Business Approval", "System of Record Write", "Downstream Notification", "Audit Logging & Closure", "Closed - Completed", "Closed - Denied by Policy"],
    },
    {
      id: "recommendation", label: "Customer recommendation",
      ids: ["Request Intake & Classification", "Identity & Account Scope Gate", "Approved Source Retrieval", "Customer Intent Branch", "Package Recommendation Analysis", "TravelRadar Compliance Check", "Availability & Allotment Risk Check", "PAC Answer Policy Check", "Cited Response Generation", "Next Action Routing", "System Workflow Trigger", "Audit Logging & Closure", "Closed - Completed", "Closed - Access Denied", "Closed - Denied by Policy"],
    },
    {
      id: "regchange", label: "Regulatory change",
      ids: ["TravelRadar Change Detection", "Regulatory Change Validation", "PAC Policy Update", "Regulatory Impact Propagation", "Downstream Notification", "Regulatory or Legal Escalation", "Audit Logging & Closure", "Closed - Completed", "Closed - No Action"],
    },
    {
      id: "escalation", label: "Escalation & denial",
      ids: ["Human Escalation Router", "Concierge Desk Escalation", "Regulatory or Legal Escalation", "Trade Desk or Sales Escalation", "Knowledge Gap Capture", "Customer Clarification Request", "Audit Logging & Closure", "Closed - Completed"],
    },
  ];

  // Per-state metadata: automation fn, BRD reference, raw control values (for Rego)
  const META = {
    "Request Intake & Classification": { fn: "create_case_context", vals: ["package_recommendation", "itinerary_guidance", "regulatory_question", "proactive_rebooking", "ops_disruption", "regulatory_change", "unsupported"], brd: { sec: "1 Executive Summary / 3 Product Vision", id: "BRD-1", text: "The platform combines AlpiGPT, TravelRadar, and the Tour-Ops Agentic Spine into a governed intelligence layer for agency and internal workflows." } },
    "Identity & Account Scope Gate": { fn: "evaluate_account_permissions", vals: ["authorized", "limited", "unauthorized"], brd: { sec: "10.2 AlpiGPT Requirements", id: "BRD-BR015", text: "AlpiGPT must support account-specific answers only after authentication and authorization." } },
    "Approved Source Retrieval": { fn: "validate_source_currency_and_approval", vals: ["grounded", "insufficient_sources", "obsolete_or_unapproved_sources"], brd: { sec: "13.2 Data Quality Requirements", id: "BRD-DQ001", text: "Customer-facing documents must be approved, current, and version-controlled; obsolete or superseded documents must not be used unless marked historical." } },
    "Customer Intent Branch": { fn: "validate_customer_workflow_scope", vals: ["package_recommendation", "itinerary_guidance", "regulatory_question", "proactive_rebooking"], brd: { sec: "8.1 AlpiGPT", id: "BRD-8.1", text: "AlpiGPT covers product selection, itinerary guidance, regulatory answers, order intelligence, multilingual support, and escalation." } },
    "Package Recommendation Analysis": { fn: "generate_recommendation_rationale", vals: ["candidates_ranked", "no_candidate_found", "low_confidence"], brd: { sec: "11.1 Intelligent Package Selector", id: "BRD-11.1", text: "Package Selector must extract trip requirements, match structured attributes, rank by fit, provide rationale and citations, and escalate where confidence is low." } },
    "TravelRadar Compliance Check": { fn: "attach_regulatory_source_metadata", vals: ["compliant_answer_ready", "informational_only_with_disclaimer", "uncertain_or_legal_sensitive", "formal_certification_requested", "non_compliant_or_restricted"], brd: { sec: "10.3 TravelRadar Requirements", id: "BRD-10.3", text: "TravelRadar maintains regulatory intelligence by destination, jurisdiction, brand, and regulation type, provides source date/version/status, and routes uncertain or legal-sensitive questions." } },
    "Availability & Allotment Risk Check": { fn: "summarize_allotment_risk", vals: ["available_low_risk", "constrained_with_alternatives", "disrupted_or_unavailable", "allotment_data_unavailable"], brd: { sec: "2.3 Enterprise-Level Problem", id: "BRD-2.3", text: "Customer recommendations are incomplete unless availability, disruption risk, compliance, alternatives, rebooking patterns, and policy constraints are understood." } },
    "Proactive Rebooking Analysis": { fn: "prepare_rebooking_or_alternative_prompt", vals: ["prompt_ready", "alternative_needed", "not_due_or_not_allowed", "route_sales"], brd: { sec: "12.5 Proactive Rebooking Workflow", id: "BRD-12.5", text: "AlpiGPT validates account permissions, checks availability/risk, PAC checks commercial and customer-specific rules, and routes quote, rebooking, or Sales workflow." } },
    "PAC Answer Policy Check": { fn: "generate_policy_reason_chain", vals: ["allow", "deny", "route_to_human", "simulation_only"], brd: { sec: "10.5 Policy-as-Code Requirements", id: "BRD-10.5", text: "PAC returns allow, deny, or route-to-human decisions and records policy version, inputs, result, timestamp, and requesting agent." } },
    "Cited Response Generation": { fn: "validate_no_unsupported_claims", vals: ["response_ready", "needs_human_review", "citation_gap"], brd: { sec: "10.2 AlpiGPT Requirements", id: "BRD-BR011", text: "AlpiGPT must explain rationale using approved sources, provide citations, and not invent specifications, regulatory claims, availability, pricing, or commitments." } },
    "Next Action Routing": { fn: "resolve_target_workflow", vals: ["request_hold", "request_quote", "rebooking_request", "sales_contact", "technical_review", "no_action"], brd: { sec: "12.1 Customer Product Recommendation Workflow", id: "BRD-12.1", text: "After AlpiGPT generates a cited response, the customer selects a next action and CRM, hold, quote, or case workflow is triggered." } },
    "PAC Controlled Action Check": { fn: "generate_policy_reason_chain", vals: ["allow", "deny", "route_to_human", "simulation_only"], brd: { sec: "10.4 Tour-Ops Agentic Spine Requirements", id: "BRD-BR033", text: "Tour-ops agents must call PAC before committing or recommending controlled actions and write only when authorization, policy, and human approval are satisfied." } },
    "Action Level Determination": { fn: "apply_autonomy_thresholds", vals: ["level_0_answer_only", "level_1_recommend", "level_2_human_approved_action", "level_3_bounded_auto_action", "level_4_prohibited"], brd: { sec: "17 Policy and Control Model", id: "BRD-17", text: "The platform must use a tiered action model from Level 0 answer-only through Level 3 bounded auto-action, with Level 4 prohibited actions escalated or stopped." } },
    "System Workflow Trigger": { fn: "create_crm_or_case_record", vals: ["crm_case_created", "hold_request_created", "quote_request_created", "rebooking_request_created", "system_write_failed"], brd: { sec: "14 Integration Requirements", id: "BRD-14", text: "CRM, case management, booking platform, order management, and notification integrations route escalations, bookings, holds, quotes, and approved actions." } },
    "Human Escalation Router": { fn: "create_escalation_task", vals: ["technical_service", "regulatory", "legal", "sales_or_customer_service", "planner_finance_ops", "content_owner"], brd: { sec: "10.1 Platform-Level Requirements", id: "BRD-BR006", text: "The platform supports human review, approval, override, and escalation to the correct expert owner with full context and evidence." } },
    "Concierge Desk Escalation": { fn: "update_reusable_knowledge_if_approved", vals: ["approved_answer", "need_customer_clarification", "rejected_or_unsupported"], brd: { sec: "12.2 Technical Escalation Workflow", id: "BRD-12.2", text: "Technical escalations attach full context; Concierge Desk reviews and approved answers can be captured for knowledge-base improvement." } },
    "Regulatory or Legal Escalation": { fn: "issue_formal_document_if_required", vals: ["approved_informational_answer", "formal_document_required", "denied", "need_customer_clarification"], brd: { sec: "12.3 Regulatory Escalation Workflow", id: "BRD-12.3", text: "PAC determines whether direct response is permitted; if not, Regulatory reviews source, jurisdiction, package, and agency context and issues final answer or formal document." } },
    "Trade Desk or Sales Escalation": { fn: "capture_service_next_action", vals: ["case_created", "next_action_confirmed", "need_customer_clarification"], brd: { sec: "11.4 Order and Relationship Intelligence", id: "BRD-11.4", text: "Order and relationship workflows support quote, hold, rebooking, Sales-contact routing, cross-sell, and account-specific history where permitted." } },
    "Customer Clarification Request": { fn: "capture_clarification_response", vals: ["received", "not_received", "abandoned"], brd: { sec: "12 Workflows", id: "BRD-12", text: "Ask the customer or internal user for missing trip, destination, package, account, or action information required to continue safely." } },
    "Knowledge Gap Capture": { fn: "link_gap_to_source_and_case", vals: ["captured", "content_update_required"], brd: { sec: "13.2 Data Quality Requirements", id: "BRD-DQ008", text: "Knowledge-base gaps must be captured and routed to content owners; human overrides should improve rules, prompts, content, and knowledge gaps." } },
    "Ops Signal Assessment": { fn: "create_disruption_ticket", vals: ["disruption_detected", "no_disruption", "insufficient_signal_quality"], brd: { sec: "10.4 Tour-Ops Agentic Spine Requirements", id: "BRD-BR028", text: "The Disruption Agent must monitor booking, aviation, hotelier, advisory and market feeds and create an alert when a signal breaks a planning assumption." } },
    "Tour-Ops Agent Analysis": { fn: "assemble_agent_options", vals: ["options_ready", "no_viable_options", "margin_or_service_risk", "needs_more_data"], brd: { sec: "8.3 Tour-Ops Agentic Spine", id: "BRD-8.3", text: "Initial agents include Disruption, Allotment, Demand, and Yield agents, with Disruption monitoring feeds, Allotment rebalancing, Demand scoring risk, and Yield recomputing margin-to-serve." } },
    "Planner Evidence Screen": { fn: "prepare_approval_task", vals: ["prepared", "incomplete"], brd: { sec: "10.4 Tour-Ops Agentic Spine Requirements", id: "BRD-BR035", text: "Tour-ops agents must provide planners an evidence screen showing cause, recommendation, policy checks, expected impact, and approval path." } },
    "Planner Finance or Business Approval": { fn: "capture_override_reason", vals: ["approved", "rejected", "modified", "pending"], brd: { sec: "12.4 Disruption Workflow", id: "BRD-12.4", text: "Planner approves, rejects, or modifies recommended tour-ops action before approved action writes to system of record." } },
    "System of Record Write": { fn: "capture_system_write_receipt", vals: ["written", "blocked", "write_not_allowed"], brd: { sec: "7.2 KAF and PAC Operating Model", id: "BRD-7.2", text: "System-of-record writes ensure approved actions are committed back to the booking platform, CRM, case management, or planning systems only when policy and human approval allow." } },
    "Downstream Notification": { fn: "capture_notification_status", vals: ["sent", "not_required", "failed"], brd: { sec: "14 Integration Requirements", id: "BRD-14", text: "Notification systems notify users of escalations, approvals, disruptions, and proactive prompts." } },
    "TravelRadar Change Detection": { fn: "open_regulatory_change_record", vals: ["change_detected", "no_relevant_change"], brd: { sec: "8.2 TravelRadar", id: "BRD-8.2", text: "TravelRadar tracks regulatory changes by jurisdiction, destination, brand, and travel-rule type." } },
    "Regulatory Change Validation": { fn: "determine_policy_update_need", vals: ["validated", "rejected", "needs_legal_review"], brd: { sec: "9 Use Case 6", id: "BRD-9-UC6", text: "Regulatory team validates interpretation before PAC updates rules and AlpiGPT updates answers." } },
    "PAC Policy Update": { fn: "publish_policy_version", vals: ["approved_and_published", "pending_approval", "rejected"], brd: { sec: "10.5 Policy-as-Code Requirements", id: "BRD-BR040", text: "PAC versions policies, maintains approval status, and supports policy testing, simulation, and approval workflows before production deployment." } },
    "Regulatory Impact Propagation": { fn: "prepare_account_impact_briefs", vals: ["alpigpt_updated", "package_recommendations_adjusted", "tour_ops_check_required"], brd: { sec: "9 Use Case 6", id: "BRD-9-UC6", text: "After PAC updates compliance rules, AlpiGPT answers are updated, the Package Selector adjusts recommendations, Tour Ops checks affected allotments, and Sales/Concierge Desk receive impact briefs." } },
    "Audit Logging & Closure": { fn: "validate_audit_completeness", vals: ["complete", "incomplete", "policy_audit_exception"], brd: { sec: "10.1 Platform-Level Requirements", id: "BRD-BR007", text: "The platform must log interactions, citations, agent decisions, policy checks, approvals, and system writes." } },
    "Itinerary Guidance Analysis": { fn: "draft_itinerary_guidance_with_caveats", vals: ["supported_documented", "safety_sensitive", "undocumented_or_novel", "low_confidence"], brd: { sec: "11.2 Itinerary Advisor", id: "BRD-11.2", text: "Itinerary Advisor must provide guidance only when grounded in approved content and escalate novel or undocumented scenarios." } },
    "Re-accommodation Guidance": { fn: "determine_service_routing", vals: ["alternatives_ready", "route_sales_or_customer_service", "no_safe_guidance"], brd: { sec: "12.4 Disruption Workflow", id: "BRD-12.4", text: "Customer-facing teams should receive proactive risk or alternative recommendations where appropriate after tour-ops disruptions." } },
    "Closed - Completed": { fn: "close_case_completed", vals: ["completed"], brd: { sec: "10.1 Platform-Level Requirements", id: "BRD-BR004", text: "All answers and agentic actions require traceability and logging." } },
    "Closed - Denied by Policy": { fn: "close_case_denied_by_policy", vals: ["denied_by_policy"], brd: { sec: "10.5 Policy-as-Code Requirements", id: "BRD-10.5", text: "PAC must return allow, deny, or route-to-human decisions and reason chains." } },
    "Closed - Access Denied": { fn: "close_case_access_denied", vals: ["access_denied"], brd: { sec: "13.2 Data Quality Requirements", id: "BRD-DQ005", text: "Customer data must be permissioned by account, user role, geography, and contractual rules." } },
    "Closed - No Action": { fn: "close_case_no_action", vals: ["no_action"], brd: { sec: "23 Acceptance Criteria", id: "BRD-23", text: "All recommendations, decisions, and approvals must be logged, including cases where no action is taken." } },
  };

  // a few nodes are pre-approved for realism in the review UI
  const APPROVED = new Set(["Request Intake & Classification", "Identity & Account Scope Gate", "PAC Controlled Action Check", "Action Level Determination", "Planner Finance or Business Approval", "Audit Logging & Closure"]);

  // Concise node descriptions (what the state does)
  const DESC = {
    "Request Intake & Classification": "Classify the incoming interaction into AlpiGPT, TravelRadar, tour-ops, rebooking, regulatory-change, or unsupported flow.",
    "Identity & Account Scope Gate": "Authenticate the user, resolve account context, and decide whether account-specific data may be used.",
    "Approved Source Retrieval": "Retrieve only approved, current Alpitour product, destination, regulatory and account sources for the classified request.",
    "Customer Intent Branch": "Route customer-facing interactions to package, itinerary, destination-rule, or proactive-rebooking processing.",
    "Package Recommendation Analysis": "Extract trip requirements and rank candidate Alpitour packages with rationale and citations.",
    "TravelRadar Compliance Check": "Retrieve current regulatory intelligence and classify the answer as allowed, informational, sensitive, or restricted.",
    "Availability & Allotment Risk Check": "Query availability, allotment risk, disruption status and commitments to make guidance allotment-aware.",
    "Proactive Rebooking Analysis": "Analyse booking history, permissions, timing and allotment risk before prompting an agency or Sales.",
    "PAC Answer Policy Check": "Call PAC before a customer-facing answer to verify grounding, approval, disclaimers, authorization and answer level.",
    "Cited Response Generation": "Generate a grounded answer with citations, assumptions, caveats, confidence and next actions.",
    "Next Action Routing": "Route the selected next action to hold, quote, rebooking, Sales, Concierge Desk, or closure.",
    "PAC Controlled Action Check": "Call PAC before any controlled recommendation, rebooking, room re-point, block swap or system write.",
    "Action Level Determination": "Determine whether the output is answer-only, recommend, human-approved, bounded auto-action, or prohibited.",
    "System Workflow Trigger": "Create the downstream CRM, case, hold, quote or rebooking workflow for the chosen action.",
    "Human Escalation Router": "Route low-confidence, high-risk, or out-of-policy cases to the correct expert owner with full evidence.",
    "Concierge Desk Escalation": "Open a Concierge Desk case with full context; approved answers feed the knowledge base.",
    "Regulatory or Legal Escalation": "Route uncertain, legally-sensitive or certification requests to Regulatory or Legal with full context.",
    "Trade Desk or Sales Escalation": "Route commercial, order, quote or service issues to Sales or Customer Service with account context.",
    "Customer Clarification Request": "Ask the user for missing trip, destination, package or account information required to continue safely.",
    "Knowledge Gap Capture": "Capture unanswered questions and route them to content owners as a reusable knowledge backlog.",
    "Ops Signal Assessment": "Detect whether a booking/aviation/hotelier/advisory signal breaks a planning assumption and open a disruption ticket.",
    "Tour-Ops Agent Analysis": "Coordinate Disruption, Yield, Allotment and Demand agents to recompute impact and prepare options.",
    "Planner Evidence Screen": "Assemble one evidence screen — cause, impact, policy checks, expected impact, approval path and proposed writes.",
    "Planner Finance or Business Approval": "Capture planner, Finance or business approval, rejection or modification for the recommended action.",
    "System of Record Write": "Commit approved actions to booking, CRM, planning or order systems only when policy and approval allow.",
    "Downstream Notification": "Notify Sales, the trade desk, planners or agencies where approved after writes or changes.",
    "TravelRadar Change Detection": "Detect regulatory changes affecting a destination, brand, package, answer or commitment.",
    "Regulatory Change Validation": "Regulatory team validates the change interpretation and whether PAC rules must be updated.",
    "PAC Policy Update": "Version, test, simulate, approve and publish updated PAC policy after validated interpretation.",
    "Regulatory Impact Propagation": "Propagate approved changes to answers, package rules, allotment checks and account impact briefs.",
    "Audit Logging & Closure": "Store the full audit trail — interaction, sources, policy checks, approvals, agent actions and writes.",
    "Itinerary Guidance Analysis": "Answer itinerary questions only when grounded; route novel or safety-sensitive cases to Concierge Desk.",
    "Re-accommodation Guidance": "Prepare agency-facing re-accommodation guidance, alternatives, or internal service routing on disruption.",
    "Closed - Completed": "Final state — request, answer, action or escalation completed with the audit trail stored.",
    "Closed - Denied by Policy": "Final state — PAC, Regulatory, Legal or governance denied the response; reason chain stored.",
    "Closed - Access Denied": "Final state — the user or account was not authorized for the requested information.",
    "Closed - No Action": "Final state — no relevant disruption, rebooking, change or next action was found; audit retained.",
  };
  Object.keys(DESC).forEach(k => { if (META[k]) META[k].desc = DESC[k]; });

  window.JOURNEYS = { ACTOR, JOURNEYS, META, laneOf, APPROVED };
})();
