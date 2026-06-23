/* ============================================================
   Journeys — named paths through the compiled state machine,
   plus per-state metadata (primary actor, automation function,
   BRD reference, Rego control values) used by the Journey Map
   and the node-details modal.
   Source of truth: dow_agentic_intelligence_platform_state_machine.json
   ============================================================ */
(function () {
  // Module → primary actor label shown on node cards
  const ACTOR = {
    "Platform": "Platform orchestrator",
    "ChemAssist": "ChemAssist agent",
    "RegRadar": "RegRadar agent",
    "Supply Chain Agentic Spine": "Supply-chain agents",
    "PAC": "Policy engine (PAC)",
    "Integration": "Integration services",
    "Technical Service": "Technical Service",
    "Regulatory/Legal": "Regulatory / Legal",
    "Sales/Customer Service": "Sales / Customer Service",
    "Operations/Finance": "Planner · Finance",
    "Knowledge Governance": "Content owner",
    "Audit/Observability": "Audit & observability",
    "Identity": "Identity & access",
  };

  // Lane (human / review / agent) — for the actor tag on each card
  const HUMAN = new Set(["Request Intake & Classification", "Customer Clarification Request", "Technical Service Escalation", "Regulatory or Legal Escalation", "Customer Service or Sales Escalation", "Planner Evidence Screen", "Planner Finance or Business Approval"]);
  const REVIEW = new Set(["Identity & Account Scope Gate", "Customer Intent Branch", "RegRadar Compliance Check", "PAC Answer Policy Check", "Next Action Routing", "PAC Controlled Action Check", "Action Level Determination", "Human Escalation Router", "Regulatory Change Validation", "PAC Policy Update", "Audit Logging & Closure", "Closed - Denied by Policy", "Closed - Access Denied"]);
  function laneOf(name) { return HUMAN.has(name) ? "human" : REVIEW.has(name) ? "review" : "agent"; }

  // Named journeys — ordered paths (real transitions are drawn between members)
  const JOURNEYS = [
    {
      id: "disruption", label: "Supply-chain distribution",
      ids: ["Request Intake & Classification", "Supply Chain Signal Assessment", "Supply Chain Agent Analysis", "PAC Controlled Action Check", "Action Level Determination", "Planner Evidence Screen", "Planner Finance or Business Approval", "System of Record Write", "Downstream Notification", "Audit Logging & Closure", "Closed - Completed", "Closed - Denied by Policy"],
    },
    {
      id: "recommendation", label: "Customer recommendation",
      ids: ["Request Intake & Classification", "Identity & Account Scope Gate", "Approved Source Retrieval", "Customer Intent Branch", "Product Recommendation Analysis", "RegRadar Compliance Check", "Supply Chain Availability & Risk Check", "PAC Answer Policy Check", "Cited Response Generation", "Next Action Routing", "System Workflow Trigger", "Audit Logging & Closure", "Closed - Completed", "Closed - Access Denied", "Closed - Denied by Policy"],
    },
    {
      id: "regchange", label: "Regulatory change",
      ids: ["RegRadar Change Detection", "Regulatory Change Validation", "PAC Policy Update", "Regulatory Impact Propagation", "Downstream Notification", "Regulatory or Legal Escalation", "Audit Logging & Closure", "Closed - Completed", "Closed - No Action"],
    },
    {
      id: "escalation", label: "Escalation & denial",
      ids: ["Human Escalation Router", "Technical Service Escalation", "Regulatory or Legal Escalation", "Customer Service or Sales Escalation", "Knowledge Gap Capture", "Customer Clarification Request", "Audit Logging & Closure", "Closed - Completed"],
    },
  ];

  // Per-state metadata: automation fn, BRD reference, raw control values (for Rego)
  const META = {
    "Request Intake & Classification": { fn: "create_case_context", vals: ["product_recommendation", "formulation_guidance", "regulatory_question", "proactive_reorder", "supply_chain_disruption", "regulatory_change", "unsupported"], brd: { sec: "1 Executive Summary / 3 Product Vision", id: "BRD-1", text: "The platform combines ChemAssist, RegRadar, and the Supply Chain Agentic Spine into a governed intelligence layer for customer and internal workflows." } },
    "Identity & Account Scope Gate": { fn: "evaluate_account_permissions", vals: ["authorized", "limited", "unauthorized"], brd: { sec: "10.2 ChemAssist Requirements", id: "BRD-BR015", text: "ChemAssist must support account-specific answers only after authentication and authorization." } },
    "Approved Source Retrieval": { fn: "validate_source_currency_and_approval", vals: ["grounded", "insufficient_sources", "obsolete_or_unapproved_sources"], brd: { sec: "13.2 Data Quality Requirements", id: "BRD-DQ001", text: "Customer-facing documents must be approved, current, and version-controlled; obsolete or superseded documents must not be used unless marked historical." } },
    "Customer Intent Branch": { fn: "validate_customer_workflow_scope", vals: ["product_recommendation", "formulation_guidance", "regulatory_question", "proactive_reorder"], brd: { sec: "8.1 ChemAssist", id: "BRD-8.1", text: "ChemAssist covers product selection, formulation guidance, regulatory answers, order intelligence, multilingual support, and escalation." } },
    "Product Recommendation Analysis": { fn: "generate_recommendation_rationale", vals: ["candidates_ranked", "no_candidate_found", "low_confidence"], brd: { sec: "11.1 Intelligent Product Selector", id: "BRD-11.1", text: "Product Selector must extract application requirements, match structured attributes, rank by fit, provide rationale and citations, and escalate where confidence is low." } },
    "RegRadar Compliance Check": { fn: "attach_regulatory_source_metadata", vals: ["compliant_answer_ready", "informational_only_with_disclaimer", "uncertain_or_legal_sensitive", "formal_certification_requested", "non_compliant_or_restricted"], brd: { sec: "10.3 RegRadar Requirements", id: "BRD-10.3", text: "RegRadar maintains regulatory intelligence by product, jurisdiction, application, and regulation type, provides source date/version/status, and routes uncertain or legal-sensitive questions." } },
    "Supply Chain Availability & Risk Check": { fn: "summarize_supply_risk", vals: ["available_low_risk", "constrained_with_alternatives", "disrupted_or_unavailable", "supply_data_unavailable"], brd: { sec: "2.3 Enterprise-Level Problem", id: "BRD-2.3", text: "Customer recommendations are incomplete unless availability, disruption risk, compliance, substitutes, reorder patterns, and policy constraints are understood." } },
    "Proactive Reorder Analysis": { fn: "prepare_reorder_or_alternative_prompt", vals: ["prompt_ready", "alternative_needed", "not_due_or_not_allowed", "route_sales"], brd: { sec: "12.5 Proactive Reorder Workflow", id: "BRD-12.5", text: "ChemAssist validates account permissions, checks availability/risk, PAC checks commercial and customer-specific rules, and routes quote, reorder, or Sales workflow." } },
    "PAC Answer Policy Check": { fn: "generate_policy_reason_chain", vals: ["allow", "deny", "route_to_human", "simulation_only"], brd: { sec: "10.5 Policy-as-Code Requirements", id: "BRD-10.5", text: "PAC returns allow, deny, or route-to-human decisions and records policy version, inputs, result, timestamp, and requesting agent." } },
    "Cited Response Generation": { fn: "validate_no_unsupported_claims", vals: ["response_ready", "needs_human_review", "citation_gap"], brd: { sec: "10.2 ChemAssist Requirements", id: "BRD-BR011", text: "ChemAssist must explain rationale using approved sources, provide citations, and not invent specifications, regulatory claims, availability, pricing, or commitments." } },
    "Next Action Routing": { fn: "resolve_target_workflow", vals: ["request_sample", "request_quote", "reorder_request", "sales_contact", "technical_review", "no_action"], brd: { sec: "12.1 Customer Product Recommendation Workflow", id: "BRD-12.1", text: "After ChemAssist generates a cited response, the customer selects a next action and CRM, sample, quote, or case workflow is triggered." } },
    "PAC Controlled Action Check": { fn: "generate_policy_reason_chain", vals: ["allow", "deny", "route_to_human", "simulation_only"], brd: { sec: "10.4 Supply Chain Agentic Spine Requirements", id: "BRD-BR033", text: "Supply-chain agents must call PAC before committing or recommending controlled actions and write only when authorization, policy, and human approval are satisfied." } },
    "Action Level Determination": { fn: "apply_autonomy_thresholds", vals: ["level_0_answer_only", "level_1_recommend", "level_2_human_approved_action", "level_3_bounded_auto_action", "level_4_prohibited"], brd: { sec: "17 Policy and Control Model", id: "BRD-17", text: "The platform must use a tiered action model from Level 0 answer-only through Level 3 bounded auto-action, with Level 4 prohibited actions escalated or stopped." } },
    "System Workflow Trigger": { fn: "create_crm_or_case_record", vals: ["crm_case_created", "sample_request_created", "quote_request_created", "reorder_request_created", "system_write_failed"], brd: { sec: "14 Integration Requirements", id: "BRD-14", text: "CRM, case management, ERP, order management, and notification integrations route escalations, orders, samples, quotes, and approved actions." } },
    "Human Escalation Router": { fn: "create_escalation_task", vals: ["technical_service", "regulatory", "legal", "sales_or_customer_service", "planner_finance_ops", "content_owner"], brd: { sec: "10.1 Platform-Level Requirements", id: "BRD-BR006", text: "The platform supports human review, approval, override, and escalation to the correct expert owner with full context and evidence." } },
    "Technical Service Escalation": { fn: "update_reusable_knowledge_if_approved", vals: ["approved_answer", "need_customer_clarification", "rejected_or_unsupported"], brd: { sec: "12.2 Technical Escalation Workflow", id: "BRD-12.2", text: "Technical escalations attach full context; Technical Service reviews and approved answers can be captured for knowledge-base improvement." } },
    "Regulatory or Legal Escalation": { fn: "issue_formal_document_if_required", vals: ["approved_informational_answer", "formal_document_required", "denied", "need_customer_clarification"], brd: { sec: "12.3 Regulatory Escalation Workflow", id: "BRD-12.3", text: "PAC determines whether direct response is permitted; if not, Regulatory reviews source, jurisdiction, product, and customer context and issues final answer or formal document." } },
    "Customer Service or Sales Escalation": { fn: "capture_service_next_action", vals: ["case_created", "next_action_confirmed", "need_customer_clarification"], brd: { sec: "11.4 Order and Relationship Intelligence", id: "BRD-11.4", text: "Order and relationship workflows support quote, sample, reorder, Sales-contact routing, cross-sell, and account-specific history where permitted." } },
    "Customer Clarification Request": { fn: "capture_clarification_response", vals: ["received", "not_received", "abandoned"], brd: { sec: "12 Workflows", id: "BRD-12", text: "Ask the customer or internal user for missing application, jurisdiction, product, account, or action information required to continue safely." } },
    "Knowledge Gap Capture": { fn: "link_gap_to_source_and_case", vals: ["captured", "content_update_required"], brd: { sec: "13.2 Data Quality Requirements", id: "BRD-DQ008", text: "Knowledge-base gaps must be captured and routed to content owners; human overrides should improve rules, prompts, content, and knowledge gaps." } },
    "Supply Chain Signal Assessment": { fn: "create_anomaly_ticket", vals: ["anomaly_detected", "no_anomaly", "insufficient_signal_quality"], brd: { sec: "10.4 Supply Chain Agentic Spine Requirements", id: "BRD-BR028", text: "The Anomaly Agent must monitor ERP, MES, TMS, logistics, and market feeds and create an alert when a signal breaks a planning assumption." } },
    "Supply Chain Agent Analysis": { fn: "assemble_agent_options", vals: ["options_ready", "no_viable_options", "margin_or_service_risk", "needs_more_data"], brd: { sec: "8.3 Supply Chain Agentic Spine", id: "BRD-8.3", text: "Initial agents include Anomaly, Inventory, Demand, and Cost agents, with Anomaly monitoring feeds, Inventory rebalancing, Demand scoring risk, and Cost recomputing cost-to-serve." } },
    "Planner Evidence Screen": { fn: "prepare_approval_task", vals: ["prepared", "incomplete"], brd: { sec: "10.4 Supply Chain Agentic Spine Requirements", id: "BRD-BR035", text: "Supply-chain agents must provide planners an evidence screen showing cause, recommendation, policy checks, expected impact, and approval path." } },
    "Planner Finance or Business Approval": { fn: "capture_override_reason", vals: ["approved", "rejected", "modified", "pending"], brd: { sec: "12.4 Supply-Chain Disruption Workflow", id: "BRD-12.4", text: "Planner approves, rejects, or modifies recommended supply-chain action before approved action writes to system of record." } },
    "System of Record Write": { fn: "capture_system_write_receipt", vals: ["written", "blocked", "write_not_allowed"], brd: { sec: "7.2 KAF and PAC Operating Model", id: "BRD-7.2", text: "System-of-record writes ensure approved actions are committed back to ERP, CRM, case management, order management, or planning systems only when policy and human approval allow." } },
    "Downstream Notification": { fn: "capture_notification_status", vals: ["sent", "not_required", "failed"], brd: { sec: "14 Integration Requirements", id: "BRD-14", text: "Notification systems notify users of escalations, approvals, disruptions, and proactive prompts." } },
    "RegRadar Change Detection": { fn: "open_regulatory_change_record", vals: ["change_detected", "no_relevant_change"], brd: { sec: "8.2 RegRadar", id: "BRD-8.2", text: "RegRadar tracks regulatory changes by jurisdiction, product, chemical family, and application." } },
    "Regulatory Change Validation": { fn: "determine_policy_update_need", vals: ["validated", "rejected", "needs_legal_review"], brd: { sec: "9 Use Case 6", id: "BRD-9-UC6", text: "Regulatory team validates interpretation before PAC updates rules and ChemAssist updates answers." } },
    "PAC Policy Update": { fn: "publish_policy_version", vals: ["approved_and_published", "pending_approval", "rejected"], brd: { sec: "10.5 Policy-as-Code Requirements", id: "BRD-BR040", text: "PAC versions policies, maintains approval status, and supports policy testing, simulation, and approval workflows before production deployment." } },
    "Regulatory Impact Propagation": { fn: "prepare_account_impact_briefs", vals: ["chemassist_updated", "product_recommendations_adjusted", "supply_chain_check_required"], brd: { sec: "9 Use Case 6", id: "BRD-9-UC6", text: "After PAC updates compliance rules, ChemAssist answers are updated, Product Selector adjusts recommendations, Supply Chain checks affected inventory, and Sales/Technical Service receive impact briefs." } },
    "Audit Logging & Closure": { fn: "validate_audit_completeness", vals: ["complete", "incomplete", "policy_audit_exception"], brd: { sec: "10.1 Platform-Level Requirements", id: "BRD-BR007", text: "The platform must log interactions, citations, agent decisions, policy checks, approvals, and system writes." } },
    "Formulation Guidance Analysis": { fn: "draft_formulation_guidance_with_caveats", vals: ["supported_documented", "safety_sensitive", "undocumented_or_novel", "low_confidence"], brd: { sec: "11.2 Formulation Advisor", id: "BRD-11.2", text: "Formulation Advisor must provide guidance only when grounded in approved content and escalate novel or undocumented scenarios." } },
    "Supply Chain Customer Guidance": { fn: "determine_service_routing", vals: ["alternatives_ready", "route_sales_or_customer_service", "no_safe_guidance"], brd: { sec: "12.4 Supply-Chain Disruption Workflow", id: "BRD-12.4", text: "Customer-facing teams should receive proactive risk or alternative recommendations where appropriate after supply-chain disruptions." } },
    "Closed - Completed": { fn: "close_case_completed", vals: ["completed"], brd: { sec: "10.1 Platform-Level Requirements", id: "BRD-BR004", text: "All answers and agentic actions require traceability and logging." } },
    "Closed - Denied by Policy": { fn: "close_case_denied_by_policy", vals: ["denied_by_policy"], brd: { sec: "10.5 Policy-as-Code Requirements", id: "BRD-10.5", text: "PAC must return allow, deny, or route-to-human decisions and reason chains." } },
    "Closed - Access Denied": { fn: "close_case_access_denied", vals: ["access_denied"], brd: { sec: "13.2 Data Quality Requirements", id: "BRD-DQ005", text: "Customer data must be permissioned by account, user role, geography, and contractual rules." } },
    "Closed - No Action": { fn: "close_case_no_action", vals: ["no_action"], brd: { sec: "23 Acceptance Criteria", id: "BRD-23", text: "All recommendations, decisions, and approvals must be logged, including cases where no action is taken." } },
  };

  // a few nodes are pre-approved for realism in the review UI
  const APPROVED = new Set(["Request Intake & Classification", "Identity & Account Scope Gate", "PAC Controlled Action Check", "Action Level Determination", "Planner Finance or Business Approval", "Audit Logging & Closure"]);

  // Concise node descriptions (what the state does)
  const DESC = {
    "Request Intake & Classification": "Classify the incoming interaction into ChemAssist, RegRadar, supply-chain, reorder, regulatory-change, or unsupported flow.",
    "Identity & Account Scope Gate": "Authenticate the user, resolve account context, and decide whether account-specific data may be used.",
    "Approved Source Retrieval": "Retrieve only approved, current Dow product, technical, regulatory and account sources for the classified request.",
    "Customer Intent Branch": "Route customer-facing interactions to product, formulation, regulatory, or proactive-reorder processing.",
    "Product Recommendation Analysis": "Extract application requirements and rank candidate Dow products with rationale and citations.",
    "RegRadar Compliance Check": "Retrieve current regulatory intelligence and classify the answer as allowed, informational, sensitive, or restricted.",
    "Supply Chain Availability & Risk Check": "Query availability, regional supply risk, disruption status and commitments to make guidance supply-aware.",
    "Proactive Reorder Analysis": "Analyse order history, permissions, timing and supply risk before prompting a customer or Sales.",
    "PAC Answer Policy Check": "Call PAC before a customer-facing answer to verify grounding, approval, disclaimers, authorization and answer level.",
    "Cited Response Generation": "Generate a grounded answer with citations, assumptions, caveats, confidence and next actions.",
    "Next Action Routing": "Route the selected next action to sample, quote, reorder, Sales, Technical Service, or closure.",
    "PAC Controlled Action Check": "Call PAC before any controlled recommendation, reorder, stock transfer, sourcing swap or system write.",
    "Action Level Determination": "Determine whether the output is answer-only, recommend, human-approved, bounded auto-action, or prohibited.",
    "System Workflow Trigger": "Create the downstream CRM, case, sample, quote or reorder workflow for the chosen action.",
    "Human Escalation Router": "Route low-confidence, high-risk, or out-of-policy cases to the correct expert owner with full evidence.",
    "Technical Service Escalation": "Open a Technical Service case with full context; approved answers feed the knowledge base.",
    "Regulatory or Legal Escalation": "Route uncertain, legally-sensitive or certification requests to Regulatory or Legal with full context.",
    "Customer Service or Sales Escalation": "Route commercial, order, quote or service issues to Sales or Customer Service with account context.",
    "Customer Clarification Request": "Ask the user for missing application, jurisdiction, product or account information required to continue safely.",
    "Knowledge Gap Capture": "Capture unanswered questions and route them to content owners as a reusable knowledge backlog.",
    "Supply Chain Signal Assessment": "Detect whether an ERP/MES/TMS/market signal breaks a planning assumption and open an anomaly ticket.",
    "Supply Chain Agent Analysis": "Coordinate Anomaly, Cost, Inventory and Demand agents to recompute impact and prepare options.",
    "Planner Evidence Screen": "Assemble one evidence screen — cause, impact, policy checks, expected impact, approval path and proposed writes.",
    "Planner Finance or Business Approval": "Capture planner, Finance or business approval, rejection or modification for the recommended action.",
    "System of Record Write": "Commit approved actions to ERP, CRM, planning or order systems only when policy and approval allow.",
    "Downstream Notification": "Notify Sales, Customer Service, planners or customers where approved after writes or changes.",
    "RegRadar Change Detection": "Detect regulatory changes affecting a product, region, application, answer or commitment.",
    "Regulatory Change Validation": "Regulatory team validates the change interpretation and whether PAC rules must be updated.",
    "PAC Policy Update": "Version, test, simulate, approve and publish updated PAC policy after validated interpretation.",
    "Regulatory Impact Propagation": "Propagate approved changes to answers, product rules, supply checks and account impact briefs.",
    "Audit Logging & Closure": "Store the full audit trail — interaction, sources, policy checks, approvals, agent actions and writes.",
    "Formulation Guidance Analysis": "Answer formulation questions only when grounded; route novel or safety-sensitive cases to Technical Service.",
    "Supply Chain Customer Guidance": "Prepare customer-facing supply guidance, alternatives, or internal service routing on disruption.",
    "Closed - Completed": "Final state — request, answer, action or escalation completed with the audit trail stored.",
    "Closed - Denied by Policy": "Final state — PAC, Regulatory, Legal or governance denied the response; reason chain stored.",
    "Closed - Access Denied": "Final state — the user or account was not authorized for the requested information.",
    "Closed - No Action": "Final state — no relevant anomaly, reorder, change or next action was found; audit retained.",
  };
  Object.keys(DESC).forEach(k => { if (META[k]) META[k].desc = DESC[k]; });

  window.JOURNEYS = { ACTOR, JOURNEYS, META, laneOf, APPROVED };
})();
