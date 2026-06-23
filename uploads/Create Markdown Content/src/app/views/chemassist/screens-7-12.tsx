import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Bot,
  ShieldCheck,
  MessageSquare,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Activity,
  ArrowRight,
  ListChecks,
  Eye,
} from "lucide-react";
import { useApp } from "../../lib/store";
import {
  CardBlock,
  PrimaryCTA,
  GhostCTA,
  PacChip,
  SupplyBadge,
  TimelineEvent,
  TimelineEventData,
  InternalOnly,
  Warn,
} from "./components";
import { JourneyShell } from "./screens-1-6";

// ─────────────────────────────────────────────────────────────────────────────
// Screen 7 — Policy-gated review before submission
// ─────────────────────────────────────────────────────────────────────────────

const REVIEW_SECTIONS = [
  {
    title: "Recipient",
    rows: [
      ["Name", "Lars Stratvell · Materials Engineer"],
      ["Company", "Lumera Auto Interiors"],
      ["Region", "Germany / EU"],
      ["Email", "lars.k@lumeraauto.eu"],
    ],
  },
  {
    title: "Application",
    rows: [
      ["Market", "Mobility · Automotive"],
      ["Application", "Interior dashboard / instrument panel"],
      ["Performance", "Low-temperature impact · soft-touch · processing efficiency"],
    ],
  },
  {
    title: "Products",
    rows: [
      ["ENGAGE™ 8180", "1 kg · Watch condition"],
      ["ENGAGE™ 8003", "1 kg · Strong availability"],
    ],
  },
  {
    title: "Required documents",
    rows: [
      ["TDS · ENGAGE™ 8180", "Attached"],
      ["TDS · ENGAGE™ 8003", "Attached"],
      ["SDS (EU)", "Attached"],
    ],
  },
];

const POLICY_ITEMS: { label: string; decision: "ok" | "warn" | "info"; why: string }[] = [
  { label: "Sample purpose: qualification trial", decision: "ok", why: "Approved use case per BR-CX-005." },
  { label: "Commercial use", decision: "ok", why: "Allowed at action_level 2." },
  { label: "Region: EU", decision: "ok", why: "All regulatory checks passed." },
  { label: "Product documentation", decision: "ok", why: "TDS available for both grades." },
  { label: "SDS", decision: "ok", why: "Current EU SDS attached." },
  { label: "Trade restriction", decision: "ok", why: "Cleared." },
  { label: "Shipping rule", decision: "ok", why: "Cleared for industrial address." },
  { label: "Supply watch", decision: "warn", why: "One grade has a supply watch — does not block." },
  { label: "Human review", decision: "ok", why: "Not required at this confidence level." },
];

export function ScreenReview() {
  const { advanceJourney } = useApp();
  const [openWhy, setOpenWhy] = useState<string | null>(null);
  return (
    <JourneyShell
      eyebrow="Step 7 of 8 · Policy-gated review"
      title="Review sample request"
      subtitle="ChemAssist isn't just collecting a form. PAC checks each part of the request and explains why it's allowed."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="space-y-4">
          {REVIEW_SECTIONS.map((s) => (
            <CardBlock key={s.title} title={s.title}>
              <div className="grid gap-2">
                {s.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 py-2"
                    style={{ borderBottom: "1px solid var(--border)", fontSize: "0.875rem" }}
                  >
                    <span style={{ color: "var(--muted-foreground)" }}>{k}</span>
                    <span style={{ fontWeight: "var(--font-weight-medium)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </CardBlock>
          ))}
        </div>

        <div className="space-y-4">
          <CardBlock title="Policy check" subtitle="PAC bundle v3.4 · signed">
            <ul className="space-y-2">
              {POLICY_ITEMS.map((p) => (
                <li
                  key={p.label}
                  className="p-3"
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                    backgroundColor: "var(--card)",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {p.decision === "ok" ? (
                        <CheckCircle2 size={14} style={{ color: "var(--chart-2)" }} />
                      ) : p.decision === "warn" ? (
                        <AlertTriangle size={14} style={{ color: "var(--chart-3)" }} />
                      ) : null}
                      <span style={{ fontSize: "0.875rem" }}>{p.label}</span>
                    </div>
                    <button
                      onClick={() => setOpenWhy(openWhy === p.label ? null : p.label)}
                      style={{ color: "var(--primary)", fontSize: "0.6875rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      Why?
                    </button>
                  </div>
                  {openWhy === p.label && (
                    <div
                      className="mt-2 p-2"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted-foreground)",
                        backgroundColor: "var(--secondary)",
                        borderRadius: 2,
                      }}
                    >
                      {p.why}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </CardBlock>

          <Warn>
            One requested sample has a current fulfillment watch due to supply
            conditions. This does not block your request. ChemAssist included an
            alternate grade to help avoid evaluation delay.
          </Warn>

          <div className="flex items-center justify-end gap-3">
            <GhostCTA>Edit plan</GhostCTA>
            <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
              Submit sample request
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </JourneyShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 8 — Confirmation with living timeline
// ─────────────────────────────────────────────────────────────────────────────

function baseTimeline(): TimelineEventData[] {
  return [
    {
      title: "Intent captured",
      actor: "ChemAssist",
      timestamp: "today · 10:42",
      status: "done",
      customerMessage: "We understood your application requirements.",
      internalMessage: "Intent parsed; ontology matched dashboard → automotive interior / TPO.",
      evidence: [{ label: "Intent log" }],
    },
    {
      title: "Products recommended",
      actor: "ChemAssist",
      timestamp: "today · 10:43",
      status: "done",
      customerMessage: "Two ENGAGE™ grades were recommended for comparison.",
      internalMessage: "Tech-fit ranking + supply weight applied.",
      evidence: [{ label: "Recommendation rationale" }],
    },
    {
      title: "Compliance checked",
      actor: "RegRadar",
      timestamp: "today · 10:43",
      status: "done",
      customerMessage: "EU documentation is available.",
      internalMessage: "REACH + RoHS checks passed; SDS pulled from approved repo.",
      evidence: [{ label: "REACH check" }, { label: "SDS · EU" }],
    },
    {
      title: "Sample eligibility cleared",
      actor: "PAC",
      timestamp: "today · 10:44",
      status: "done",
      customerMessage: "Both grades are eligible at 1 kg for your region.",
      internalMessage: "PAC decision · allow · L2.",
      evidence: [{ label: "PAC decision log" }],
    },
    {
      title: "Supply condition reviewed",
      actor: "Supply Chain Spine",
      timestamp: "today · 10:45",
      status: "done",
      customerMessage:
        "One product has a supply watch condition; an alternate remains available.",
      internalMessage:
        "Naphtha event detected; cost-to-serve recomputed; alternate routing pre-staged.",
      evidence: [{ label: "Supply trace" }],
    },
    {
      title: "Request submitted",
      actor: "Customer",
      timestamp: "today · 10:46",
      status: "done",
      customerMessage: "Your sample request is now active.",
      evidence: [{ label: "Case CX-2026-ENGAGE-00482" }],
    },
    {
      title: "Fulfillment routing in progress",
      actor: "Planner",
      timestamp: "in progress",
      status: "active",
      customerMessage: "Dow Planning is confirming the best fulfillment path.",
      internalMessage:
        "Planner reviewing two routing options; ENGAGE 8003 prioritized for parallel ship.",
      next: "Customer update when routing confirmed",
    },
    {
      title: "Customer update pending",
      actor: "ChemAssist",
      timestamp: "scheduled",
      status: "pending",
      customerMessage: "You'll see an update here as soon as routing is finalized.",
    },
  ];
}

export function ScreenTimeline() {
  const { advanceJourney, triggerSupplyUpdate } = useApp();
  const events = baseTimeline();
  return (
    <JourneyShell
      eyebrow="Step 8 of 8 · Living timeline"
      title="Sample request submitted"
      subtitle="Case CX-2026-ENGAGE-00482 · Your request is being orchestrated across product, compliance, supply, and fulfillment checks."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <CardBlock title="Timeline">
          <div>
            {events.map((e, i) => (
              <TimelineEvent key={e.title} event={e} isLast={i === events.length - 1} />
            ))}
          </div>
        </CardBlock>

        <div className="space-y-4">
          <CardBlock title="What happens next">
            <ul className="space-y-2" style={{ fontSize: "0.875rem" }}>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={14} style={{ color: "var(--chart-2)", marginTop: 3 }} />
                Dow validates sample routing
              </li>
              <li className="flex items-start gap-3">
                <Sparkles size={14} style={{ color: "var(--primary)", marginTop: 3 }} />
                If anything changes, you'll see it here — not in an email
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare size={14} style={{ color: "var(--primary)", marginTop: 3 }} />
                Technical Service may contact you if expert review is needed
              </li>
            </ul>
          </CardBlock>

          <CardBlock title="Was this easier than your usual sample request process?">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={advanceJourney}
                className="inline-flex items-center gap-1 px-3 py-1.5"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  fontSize: "0.8125rem",
                }}
              >
                <ThumbsUp size={12} /> Yes
              </button>
              <button
                onClick={advanceJourney}
                className="inline-flex items-center gap-1 px-3 py-1.5"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  fontSize: "0.8125rem",
                }}
              >
                Somewhat
              </button>
              <button
                onClick={advanceJourney}
                className="inline-flex items-center gap-1 px-3 py-1.5"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  fontSize: "0.8125rem",
                }}
              >
                <ThumbsDown size={12} /> No
              </button>
              <button
                onClick={advanceJourney}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  textDecoration: "underline",
                  marginLeft: 6,
                }}
              >
                Tell us what was missing
              </button>
            </div>
          </CardBlock>

          <CardBlock title="Trigger the naphtha event (demo)">
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginBottom: 10 }}>
              Simulate the back-office event so the customer view updates without
              exposing internal details.
            </p>
            <PrimaryCTA
              onClick={() => {
                triggerSupplyUpdate();
                advanceJourney();
              }}
              icon={<ChevronRight size={14} />}
            >
              Run supply-aware update
            </PrimaryCTA>
          </CardBlock>
        </div>
      </div>
    </JourneyShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 9 — Supply-aware customer update
// ─────────────────────────────────────────────────────────────────────────────

export function ScreenSupplyUpdate() {
  const { advanceJourney } = useApp();
  return (
    <JourneyShell
      eyebrow="Update · Case CX-2026-ENGAGE-00482"
      title="Update to your sample plan"
      subtitle="Supply conditions changed. Your request remains active — here is what Dow already did about it."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="space-y-4">
          <div
            className="p-5 flex gap-4"
            style={{
              backgroundColor: "color-mix(in oklab, var(--primary) 6%, var(--card))",
              border: "1px solid color-mix(in oklab, var(--primary) 32%, var(--border))",
              borderRadius: 2,
            }}
          >
            <Sparkles size={20} style={{ color: "var(--primary)", marginTop: 2 }} />
            <div className="min-w-0">
              <div style={{ fontWeight: "var(--font-weight-medium)", marginBottom: 6 }}>
                Supply conditions changed for one requested grade
              </div>
              <p style={{ fontSize: "0.9375rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
                Your sample request remains active. Dow has identified an alternate
                fulfillment path and kept ENGAGE™ 8003 in your plan to reduce
                qualification delay. No action is required from you right now.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
                  View updated sample plan
                </PrimaryCTA>
                <GhostCTA>Ask Technical Service</GhostCTA>
                <GhostCTA>Confirm priority</GhostCTA>
              </div>
            </div>
          </div>

          <CardBlock title="Customer-safe timeline update">
            <TimelineEvent
              event={{
                title: "Supply-aware routing updated",
                actor: "Supply Chain Spine",
                timestamp: "today · 10:51",
                status: "done",
                customerMessage:
                  "An alternate fulfillment path was identified. Estimated sample window unchanged for ENGAGE™ 8003 and held within 4 days for ENGAGE™ 8180.",
                internalMessage:
                  "Naphtha spike +10% → cracker constraint at Tarragona → alternate route from Terneuzen pre-allocated. Margin floor maintained.",
                evidence: [{ label: "Supply trace" }, { label: "PAC decision" }],
              }}
              isLast
            />
            <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              <Fact label="Action required" value="None" />
              <Fact label="Estimated sample window" value="Unchanged · adjusted on watch grade" />
              <Fact label="Alternate grade" value="ENGAGE™ 8003 · available" />
              <Fact label="Expert support" value="Available on request" />
            </div>
          </CardBlock>
        </div>

        <div className="space-y-4">
          <CardBlock title="What you do not need to see">
            <ul
              className="space-y-1.5"
              style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
            >
              <li>· Naphtha price movement</li>
              <li>· Margin exposure or cost-to-serve detail</li>
              <li>· Cracker / plant identity</li>
              <li>· Internal working-capital rules</li>
              <li>· Customer allocation logic</li>
              <li>· Finance policy thresholds</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <PacChip decision="redacted">Internal cost · redacted</PacChip>
              <PacChip decision="customerSafe">Disclosure is customer-safe</PacChip>
            </div>
          </CardBlock>

          <InternalOnly title="Spine trace · naphtha event">
            <ol className="space-y-1.5" style={{ lineHeight: 1.6 }}>
              <li>Anomaly: naphtha +10% in 2 hours.</li>
              <li>Cost: recomputed cost-to-serve; margin floor near threshold for ENGAGE 8180 route.</li>
              <li>Inventory: alternate routing from Terneuzen modeled.</li>
              <li>PAC: customer-facing disclosure approved with redaction.</li>
              <li>Planner: approved alternate sample routing.</li>
              <li>Customer-facing CX: sanitized update sent.</li>
            </ol>
          </InternalOnly>
        </div>
      </div>
    </JourneyShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-3"
      style={{ border: "1px solid var(--border)", borderRadius: 2, backgroundColor: "var(--card)" }}
    >
      <div
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.08em",
          color: "var(--muted-foreground)",
          fontWeight: "var(--font-weight-medium)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.875rem" }}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 10 — Expert handoff
// ─────────────────────────────────────────────────────────────────────────────

export function ScreenExpert() {
  const { advanceJourney } = useApp();
  return (
    <JourneyShell
      eyebrow="Escalation · Technical Service"
      title="Technical Service review started"
      subtitle="This question needs a Dow technical expert because it involves application-specific qualification guidance."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="space-y-4">
          <CardBlock title="Your question">
            <div
              className="p-3 mb-3"
              style={{
                backgroundColor: "var(--secondary)",
                borderRadius: 2,
                fontSize: "0.9375rem",
                lineHeight: 1.5,
              }}
            >
              Can I use ENGAGE™ 8180 for a colder climate vehicle platform, and how
              should I compare it with ENGAGE™ 8003 for that program?
            </div>
            <div className="flex flex-wrap gap-2">
              <PacChip decision="human">Routed to human review</PacChip>
              <SupplyBadge tone="expert" />
            </div>
          </CardBlock>

          <CardBlock title="Escalation packet (visible to you)">
            <div className="grid gap-2">
              {[
                ["Application", "Automotive interior · cold-climate platform"],
                ["Products", "ENGAGE™ 8180 · ENGAGE™ 8003"],
                ["Region", "Germany / EU"],
                ["Documents used", "ENGAGE selection guide · EU REACH memo · application note"],
                ["Expected response", "Within 1 business day"],
                ["Assigned team", "Dow Technical Service · Polyolefin Elastomers (EU)"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-3 py-2"
                  style={{ borderBottom: "1px solid var(--border)", fontSize: "0.875rem" }}
                >
                  <span style={{ color: "var(--muted-foreground)" }}>{k}</span>
                  <span style={{ fontWeight: "var(--font-weight-medium)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
                Add more details
              </PrimaryCTA>
              <GhostCTA>Upload test requirements</GhostCTA>
              <GhostCTA>Continue sample request</GhostCTA>
            </div>
          </CardBlock>
        </div>

        <div className="space-y-4">
          <CardBlock title="Assigned expert">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                CR
              </div>
              <div>
                <div style={{ fontWeight: "var(--font-weight-medium)" }}>Claire Roussel</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  Technical Service · Auto Interiors · Lyon, FR
                </div>
              </div>
            </div>
          </CardBlock>

          <InternalOnly title="Internal packet (not visible to customer)">
            <ul className="space-y-1.5" style={{ lineHeight: 1.6 }}>
              <li>Retrieved documents · 6 (confidence 0.82)</li>
              <li>Policy decision · route_to_human (action_level 2)</li>
              <li>Supply context · ENGAGE 8180 watch (Tarragona)</li>
              <li>Customer tier · Strategic · Lumera Auto</li>
              <li>Prior interactions · 4 sample requests · 1 escalation</li>
              <li>Suggested response draft attached</li>
              <li>Knowledge gap class · "Cold-climate ENGAGE comparison copy"</li>
            </ul>
          </InternalOnly>
        </div>
      </div>
    </JourneyShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 11 — Feedback-to-BRD loop
// ─────────────────────────────────────────────────────────────────────────────

const FEEDBACK_OPTIONS = [
  "Recommendation was helpful",
  "I need clearer sample timing",
  "I need more comparison detail",
  "I need regulatory documents earlier",
  "I need expert support sooner",
  "Other",
];

const CANDIDATES = [
  {
    type: "Ontology update",
    body: '"Dashboard" should map to "automotive interior / instrument panel / TPO".',
    owner: "Product · Materials Ontology",
  },
  {
    type: "BRD candidate",
    body: "Customer sample flows must show customer-safe supply confidence before submission.",
    owner: "Product · CX",
  },
  {
    type: "PAC candidate",
    body: "Rush sample requests for supply-watch grades should route to human approval.",
    owner: "Governance · Policy",
  },
  {
    type: "Content gap",
    body: "Need clearer customer-facing comparison copy for ENGAGE™ grades.",
    owner: "Technical content",
  },
  {
    type: "Experiment",
    body: "Test sample-plan timeline vs static confirmation email (A/B).",
    owner: "Lab · Backtest",
  },
];

export function ScreenFeedback() {
  const { advanceJourney } = useApp();
  const [picked, setPicked] = useState<string | null>("I need clearer sample timing");
  return (
    <JourneyShell
      eyebrow="Feedback → BRD loop"
      title="Your feedback improves Dow's product experience"
      subtitle="You told us that sample timing and product comparison were the hardest parts of this workflow. Dow uses this feedback to improve product guidance, sample routing, and digital support."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.2fr 1.6fr" }}>
        <CardBlock title="What was hardest about this workflow?">
          <div className="space-y-2">
            {FEEDBACK_OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => setPicked(o)}
                className="w-full text-left flex items-center justify-between gap-3 p-3"
                style={{
                  border: `1px solid ${
                    picked === o
                      ? "color-mix(in oklab, var(--primary) 38%, var(--border))"
                      : "var(--border)"
                  }`,
                  backgroundColor: picked === o
                    ? "color-mix(in oklab, var(--primary) 6%, var(--card))"
                    : "var(--card)",
                  borderRadius: 2,
                  fontSize: "0.875rem",
                }}
              >
                <span>{o}</span>
                {picked === o && <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
              Send feedback
            </PrimaryCTA>
          </div>
        </CardBlock>

        <CardBlock
          title="Candidate improvements generated from this signal"
          subtitle="Demo view · normally hidden from customers."
        >
          <div className="space-y-3">
            {CANDIDATES.map((c) => (
              <div
                key={c.type}
                className="p-3"
                style={{ border: "1px solid var(--border)", borderRadius: 2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5"
                    style={{
                      backgroundColor: "var(--secondary)",
                      fontSize: "0.625rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--primary)",
                      fontWeight: "var(--font-weight-medium)",
                      borderRadius: 2,
                    }}
                  >
                    {c.type}
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>
                    → owner · {c.owner}
                  </span>
                </div>
                <div style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{c.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <PacChip decision="simulation">Backtest required</PacChip>
            <PacChip decision="human">Governance board review</PacChip>
          </div>
        </CardBlock>
      </div>
    </JourneyShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 12 — Internal demo overlay
// ─────────────────────────────────────────────────────────────────────────────

const PAC_DECISIONS: { action: string; decision: string; level: number; reason: string; tone: "ok" | "warn" | "deny" | "human" }[] = [
  { action: "General product recommendation", decision: "Allow", level: 1, reason: "Grounded in approved sources", tone: "ok" },
  { action: "Sample request submission", decision: "Allow", level: 2, reason: "Human-approved process", tone: "ok" },
  { action: "Supply-risk customer message", decision: "Allow with redaction", level: 1, reason: "Customer-safe disclosure", tone: "warn" },
  { action: "Internal cost exposure disclosure", decision: "Deny", level: 4, reason: "Internal-only financial data", tone: "deny" },
  { action: "Rush sample for watched grade", decision: "Route to human", level: 2, reason: "Supply condition requires review", tone: "human" },
];

const TRACE = [
  { actor: "ChemAssist", note: "Parsed customer intent and mapped to TPO application." },
  { actor: "Ontology", note: "Resolved dashboard → automotive interior / instrument panel." },
  { actor: "RegRadar", note: "Checked EU REACH compliance and pulled SDS." },
  { actor: "Supply Chain Spine", note: "Detected supply watch for ENGAGE 8180 (naphtha event)." },
  { actor: "PAC", note: "Approved customer-safe disclosure; denied internal cost exposure." },
  { actor: "ChemAssist", note: "Generated multi-grade sample plan with alternate routing." },
  { actor: "Planner", note: "Approved sample routing after watch flag." },
  { actor: "ChemAssist", note: "Sent customer-safe update to living timeline." },
];

type Tab = "customer" | "trace" | "pac" | "evidence" | "feedback" | "brd";

export function ScreenInternal() {
  const [tab, setTab] = useState<Tab>("trace");
  return (
    <JourneyShell
      eyebrow="Internal overlay · Case CX-2026-ENGAGE-00482"
      title="Same case · more detail"
      subtitle="Switch tabs to see the agent trace, policy decisions, retrieved evidence, customer feedback, and the BRD impact."
    >
      <div
        className="flex items-center gap-1 mb-5 p-1"
        style={{
          backgroundColor: "var(--secondary)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          width: "fit-content",
        }}
      >
        {([
          ["customer", "Customer view", <Eye size={13} key="e" />],
          ["trace", "Agent trace", <Bot size={13} key="b" />],
          ["pac", "PAC decisions", <ShieldCheck size={13} key="s" />],
          ["evidence", "Evidence", <FileText size={13} key="f" />],
          ["feedback", "Feedback", <MessageSquare size={13} key="m" />],
          ["brd", "BRD impact", <ListChecks size={13} key="l" />],
        ] as [Tab, string, React.ReactNode][]).map(([k, label, icon]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="inline-flex items-center gap-1.5 px-3 h-9"
            style={{
              backgroundColor: tab === k ? "var(--card)" : "transparent",
              color: tab === k ? "var(--foreground)" : "var(--muted-foreground)",
              border: tab === k ? "1px solid var(--border)" : "1px solid transparent",
              borderRadius: 2,
              fontSize: "0.8125rem",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === "customer" && <CustomerSnapshot />}
      {tab === "trace" && <AgentTrace />}
      {tab === "pac" && <PacTable />}
      {tab === "evidence" && <EvidencePanel />}
      {tab === "feedback" && <FeedbackPanel />}
      {tab === "brd" && <BrdPanel />}
    </JourneyShell>
  );
}

function CustomerSnapshot() {
  return (
    <CardBlock title="What the customer sees">
      <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
        Sample request CX-2026-ENGAGE-00482 is active. ENGAGE™ 8180 and ENGAGE™ 8003
        are in the plan; the customer sees a customer-safe supply badge and a
        living timeline. The naphtha event is invisible to them.
      </p>
    </CardBlock>
  );
}

function AgentTrace() {
  return (
    <CardBlock title="Agent trace">
      <ol className="space-y-3">
        {TRACE.map((t, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                backgroundColor: "color-mix(in oklab, var(--primary) 10%, var(--card))",
                color: "var(--primary)",
                fontSize: "0.6875rem",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {i + 1}
            </span>
            <div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted-foreground)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {t.actor}
              </div>
              <div style={{ fontSize: "0.875rem" }}>{t.note}</div>
            </div>
          </li>
        ))}
      </ol>
    </CardBlock>
  );
}

function PacTable() {
  return (
    <CardBlock title="PAC decisions" pad={false}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--secondary)" }}>
            <th style={th}>Action</th>
            <th style={th}>Decision</th>
            <th style={th}>Level</th>
            <th style={th}>Reason</th>
          </tr>
        </thead>
        <tbody>
          {PAC_DECISIONS.map((p, i) => (
            <tr
              key={p.action}
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <td style={td}>{p.action}</td>
              <td style={td}>
                {p.tone === "ok" && <PacChip decision="allowed">{p.decision}</PacChip>}
                {p.tone === "warn" && <PacChip decision="redacted">{p.decision}</PacChip>}
                {p.tone === "deny" && <PacChip decision="denied">{p.decision}</PacChip>}
                {p.tone === "human" && <PacChip decision="human">{p.decision}</PacChip>}
              </td>
              <td style={td}>L{p.level}</td>
              <td style={{ ...td, color: "var(--muted-foreground)" }}>{p.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardBlock>
  );
}

function EvidencePanel() {
  const items = [
    "ENGAGE selection guide · v2026.03 · §4 cold-temperature impact",
    "EU REACH compliance memo · 2026-04",
    "ENGAGE 8180 technical data sheet · v12",
    "ENGAGE 8003 technical data sheet · v9",
    "Application note · TPO compounding for automotive interiors",
    "Customer history · Lumera Auto · prior 4 sample requests",
  ];
  return (
    <CardBlock title="Retrieved evidence">
      <ul className="space-y-2">
        {items.map((e) => (
          <li
            key={e}
            className="flex items-center gap-3 p-3"
            style={{ border: "1px solid var(--border)", borderRadius: 2, fontSize: "0.875rem" }}
          >
            <FileText size={14} style={{ color: "var(--primary)" }} />
            <span className="flex-1 min-w-0">{e}</span>
            <ArrowRight size={13} style={{ color: "var(--muted-foreground)" }} />
          </li>
        ))}
      </ul>
    </CardBlock>
  );
}

function FeedbackPanel() {
  return (
    <CardBlock title="Captured feedback">
      <div className="space-y-3">
        <div
          className="p-3"
          style={{ border: "1px solid var(--border)", borderRadius: 2 }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            Rating · somewhat helpful
          </div>
          <div style={{ fontSize: "0.875rem", marginTop: 4 }}>
            "I need clearer delivery timing before submitting."
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <PacChip decision="simulation">Queued for backtest</PacChip>
          <PacChip decision="human">Owner · Product CX</PacChip>
        </div>
      </div>
    </CardBlock>
  );
}

function BrdPanel() {
  const reqs = [
    { id: "BR-CX-001", t: "Customer-safe supply awareness" },
    { id: "BR-CX-002", t: "Unified customer timeline" },
    { id: "BR-CX-003", t: "Customer-facing redaction policy" },
    { id: "BR-CX-004", t: "Feedback-to-BRD governance" },
    { id: "BR-CX-005", t: "Progressive trust and authentication" },
    { id: "BR-CX-006", t: "Customer explainability standard" },
    { id: "BR-CX-007", t: "Experimental lab promotion" },
  ];
  return (
    <CardBlock title="Requirements touched by this case">
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {reqs.map((r) => (
          <div
            key={r.id}
            className="p-3"
            style={{ border: "1px solid var(--border)", borderRadius: 2 }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.6875rem",
                color: "var(--muted-foreground)",
              }}
            >
              {r.id}
            </div>
            <div style={{ fontSize: "0.875rem", marginTop: 2 }}>{r.t}</div>
            <div className="mt-2 flex gap-2">
              <PacChip decision="allowed">Active</PacChip>
            </div>
          </div>
        ))}
      </div>
    </CardBlock>
  );
}

export const __unused = Activity;
