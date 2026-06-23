import { useMemo } from "react";
import {
  Play,
  RotateCcw,
  Zap,
  Activity,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Factory,
  TrendingDown,
  Send,
} from "lucide-react";
import {
  Button,
  Card,
  KeyValue,
  Pill,
  SectionTitle,
} from "../components/primitives";
import { EventState, useApp } from "../lib/store";

const EVENT_FEED = [
  {
    id: "ev_2026_06_01_naphtha",
    time: "09:42",
    source: "Market feed · ICE",
    title: "Naphtha price spike +10.4% (Rotterdam)",
    severity: "high",
  },
  {
    id: "ev_2026_06_01_lims_qa",
    time: "08:18",
    source: "LIMS · Tarragona",
    title: "Batch QA-2026-1184 cleared for release",
    severity: "info",
  },
  {
    id: "ev_2026_05_31_tms",
    time: "Yesterday",
    source: "TMS · DHL",
    title: "Lane FR-DE-1 reopened after closure",
    severity: "info",
  },
];

const AGENT_ORDER: EventState[] = [
  "detected",
  "cost",
  "inventory",
  "policy",
  "preview",
  "approved",
  "customer",
];

const AGENTS: {
  step: EventState;
  name: string;
  role: string;
  output: string;
}[] = [
  {
    step: "detected",
    name: "Anomaly agent",
    role: "Detect & scope",
    output:
      "Opened traceable event evt_naph_eu_q2. Mapped 14 SKUs · 3 plants · 27 open customer commitments affected.",
  },
  {
    step: "cost",
    name: "Cost-to-serve agent",
    role: "Recompute economics",
    output:
      "Margin compression on ENGAGE 8842 (Tarragona): −6.2%. Working-capital exposure ↑ €2.1M if no action in 72h.",
  },
  {
    step: "inventory",
    name: "Inventory & sourcing agent",
    role: "Propose action",
    output:
      "Recommended: shift 220 MT to ENGAGE 8200 (Freeport) for 4 EU accounts + 1 transfer order Freeport→Tarragona.",
  },
  {
    step: "policy",
    name: "PAC runtime",
    role: "Check guardrails",
    output:
      "FIN.WC.001 allow · TRADE.EU.014 allow · PROD.HAZMAT.006 allow · CX.PROMISE.003 route to GTM owner.",
  },
  {
    step: "preview",
    name: "SAP write-preview adapter",
    role: "Stage ERP delta",
    output:
      "Stock transfer order STO-EU-9912 staged. Sales-order ETA delta computed for 4 accounts. No live writes.",
  },
  {
    step: "approved",
    name: "Planner sign-off",
    role: "Human in the loop",
    output:
      "M. Krishnan approved transfer; revised ETA for Lumera Auto routed to GTM owner per CX.PROMISE.003.",
  },
  {
    step: "customer",
    name: "Customer surface update",
    role: "Transparent commitment",
    output:
      "Sample commitment for Lumera Auto updated with new ETA and alternative grade option. Audit trail linked.",
  },
];

const POLICIES = [
  { id: "FIN.WC.001", family: "Finance", status: "allowed", reason: "Working-capital impact within €5M ceiling" },
  { id: "TRADE.EU.014", family: "Trade", status: "allowed", reason: "No dual-use or export restriction triggered" },
  { id: "PROD.HAZMAT.006", family: "Product", status: "allowed", reason: "Lane FR-DE-1 cleared for packaging class" },
  { id: "CX.PROMISE.003", family: "Customer", status: "routed", reason: "ETA shift > 3 days · requires GTM sign-off" },
];

export function PlannerView() {
  const { scenarioStep, runScenario, resetScenario, openDrawer } = useApp();
  const activeIdx = AGENT_ORDER.indexOf(scenarioStep as EventState);
  const naphthaActive = scenarioStep !== "idle";

  return (
    <div className="px-8 py-8">
      <SectionTitle
        eyebrow="Operational platform"
        title="Planner Control Tower"
        subtitle="One pane. Signals → agent recommendations → PAC outcome → write preview → human sign-off."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={resetScenario}
              icon={<RotateCcw size={14} />}
            >
              Reset
            </Button>
            <Button
              onClick={runScenario}
              icon={<Play size={14} />}
              disabled={scenarioStep === "customer"}
            >
              {scenarioStep === "idle"
                ? "Replay naphtha shock"
                : scenarioStep === "customer"
                  ? "Scenario complete"
                  : "Scenario running…"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "320px 1fr 320px" }}>
        <EventFeed naphthaActive={naphthaActive} />
        <div className="space-y-6 min-w-0">
          <ScenarioBanner step={scenarioStep} />
          <AgentRuns activeIdx={activeIdx} />
          <WritePreview step={scenarioStep} />
        </div>
        <div className="space-y-6">
          <PolicyPanel openDrawer={openDrawer} step={scenarioStep} />
          <ImpactCard step={scenarioStep} />
        </div>
      </div>
    </div>
  );
}

function EventFeed({ naphthaActive }: { naphthaActive: boolean }) {
  return (
    <Card>
      <SectionTitle title="Event spine" subtitle="CloudEvents · last 24h" />
      <div className="space-y-3">
        {EVENT_FEED.map((e, i) => {
          const isNaphtha = i === 0;
          const highlighted = isNaphtha && naphthaActive;
          return (
            <div
              key={e.id}
              className="border p-3"
              style={{
                borderColor: highlighted
                  ? "color-mix(in oklab, var(--destructive) 50%, var(--border))"
                  : "var(--border)",
                backgroundColor: highlighted
                  ? "color-mix(in oklab, var(--destructive) 8%, var(--card))"
                  : "var(--card)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                className="flex items-center justify-between"
                style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}
              >
                <span>{e.source}</span>
                <span>{e.time}</span>
              </div>
              <div
                className="mt-1 flex items-start gap-2"
                style={{ color: "var(--foreground)" }}
              >
                {e.severity === "high" ? (
                  <Zap size={14} style={{ color: "var(--destructive)", marginTop: 3 }} />
                ) : (
                  <Activity size={14} style={{ color: "var(--muted-foreground)", marginTop: 3 }} />
                )}
                <span style={{ fontSize: "0.875rem" }}>{e.title}</span>
              </div>
              <div
                className="mt-2"
                style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)", fontFamily: "ui-monospace, monospace" }}
              >
                {e.id}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ScenarioBanner({ step }: { step: EventState }) {
  if (step === "idle") {
    return (
      <Card>
        <div className="flex items-start gap-4">
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            <Zap size={20} />
          </div>
          <div className="min-w-0">
            <div style={{ fontWeight: "var(--font-weight-medium)" }}>
              Naphtha-shock scenario
            </div>
            <p
              className="mt-1"
              style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}
            >
              Replay a 10% naphtha price spike at a European cracker. Watch the
              spine detect, recompute, check policy, stage ERP changes, route a
              planner sign-off, and update the customer-facing commitment —
              with full audit.
            </p>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: "var(--destructive)",
            animation: "pulse 1.6s ease-in-out infinite",
          }}
        />
        <span style={{ fontWeight: "var(--font-weight-medium)" }}>
          evt_naph_eu_q2 · naphtha +10.4% · Tarragona cracker
        </span>
        <Pill tone={step === "customer" ? "allowed" : "pending"}>
          {step === "customer" ? "Resolved · committed" : "Orchestrating"}
        </Pill>
      </div>
    </Card>
  );
}

function AgentRuns({ activeIdx }: { activeIdx: number }) {
  return (
    <Card>
      <SectionTitle title="Agent runs" subtitle="Each step logs evidence, policy outcome, and next owner." />
      <ol className="space-y-3">
        {AGENTS.map((a, i) => {
          const done = activeIdx >= i;
          const current = activeIdx === i;
          return (
            <li
              key={a.step}
              className="flex gap-3 p-3 border"
              style={{
                borderColor: current
                  ? "color-mix(in oklab, var(--chart-3) 50%, var(--border))"
                  : "var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: current
                  ? "color-mix(in oklab, var(--chart-3) 8%, var(--card))"
                  : "var(--card)",
                opacity: done || current ? 1 : 0.55,
                transition: "all 200ms",
              }}
            >
              <StepDot active={done} current={current} index={i + 1} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div
                    style={{
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {a.name}
                  </div>
                  <span
                    style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}
                  >
                    {a.role}
                  </span>
                </div>
                <p
                  className="mt-1"
                  style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
                >
                  {done || current ? a.output : "Waiting for upstream step…"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function StepDot({
  active,
  current,
  index,
}: {
  active: boolean;
  current: boolean;
  index: number;
}) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 26,
        height: 26,
        borderRadius: 999,
        backgroundColor: current
          ? "var(--chart-3)"
          : active
            ? "var(--chart-2)"
            : "var(--muted)",
        color: current || active ? "var(--primary-foreground)" : "var(--muted-foreground)",
        fontSize: "0.75rem",
        fontWeight: "var(--font-weight-medium)",
      }}
    >
      {active && !current ? <CheckCircle2 size={14} /> : index}
    </div>
  );
}

function WritePreview({ step }: { step: EventState }) {
  const visible = useMemo(
    () => ["preview", "approved", "customer"].includes(step),
    [step],
  );
  return (
    <Card>
      <SectionTitle
        title="SAP write preview"
        subtitle="Pilot mode — staged deltas only. ERP remains the system of record; no live writes without sign-off."
        action={
          visible ? (
            <Pill tone={step === "preview" ? "pending" : "allowed"}>
              {step === "preview" ? "Awaiting approval" : "Committed (sandbox)"}
            </Pill>
          ) : (
            <Pill tone="neutral">No staged writes</Pill>
          )
        }
      />
      {!visible ? (
        <EmptyState
          icon={<Send size={18} />}
          text="Run the scenario to see proposed SAP deltas and approval surface."
        />
      ) : (
        <div className="space-y-3">
          <PreviewRow
            doc="STO-EU-9912"
            kind="Stock transfer order"
            detail="Freeport → Tarragona · 220 MT · ENGAGE 8200"
            impact="Restores EU coverage in 12 days"
          />
          <PreviewRow
            doc="SO-LUMERA-44219"
            kind="Sales order ETA update"
            detail="Lumera Auto · ENGAGE 8842 · ETA 14 → 18 days"
            impact="Requires GTM owner sign-off (CX.PROMISE.003)"
          />
          <PreviewRow
            doc="SO-VECTRIM-13099"
            kind="Substitution recommendation"
            detail="Vectrim Plastics · suggest ENGAGE 8200 · original ETA preserved"
            impact="Disclaimer attached (typical-data only)"
          />
          <div
            className="flex items-center justify-between p-3 border"
            style={{
              borderColor: "var(--border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--secondary)",
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
            >
              <Clock size={14} /> Decision SLA · 47 min remaining
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Modify constraints
              </Button>
              <Button size="sm" variant="destructive">
                Reject
              </Button>
              <Button size="sm" icon={<CheckCircle2 size={14} />}>
                Approve & commit
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function PreviewRow({
  doc,
  kind,
  detail,
  impact,
}: {
  doc: string;
  kind: string;
  detail: string;
  impact: string;
}) {
  return (
    <div
      className="grid gap-3 p-3 border items-center"
      style={{
        borderColor: "var(--border)",
        borderRadius: "var(--radius-md)",
        gridTemplateColumns: "150px 1fr auto",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
          }}
        >
          {doc}
        </div>
        <div style={{ fontSize: "0.8125rem", fontWeight: "var(--font-weight-medium)" }}>
          {kind}
        </div>
      </div>
      <div style={{ fontSize: "0.8125rem", color: "var(--foreground)" }}>
        {detail}
        <div
          className="mt-1"
          style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
        >
          {impact}
        </div>
      </div>
      <Pill tone="info">Preview</Pill>
    </div>
  );
}

function PolicyPanel({
  openDrawer,
  step,
}: {
  openDrawer: () => void;
  step: EventState;
}) {
  const checked = ["policy", "preview", "approved", "customer"].includes(step);
  return (
    <Card>
      <SectionTitle
        title="PAC outcome"
        subtitle="OPA bundle v3.4 · evaluated against staged actions."
        action={<Pill tone="allowed" icon={<ShieldCheck size={12} />}>Signed</Pill>}
      />
      {!checked ? (
        <EmptyState
          icon={<ShieldCheck size={18} />}
          text="Policy evaluation runs after the sourcing recommendation is staged."
        />
      ) : (
        <ul className="space-y-2">
          {POLICIES.map((p) => (
            <li
              key={p.id}
              className="flex items-start gap-3 p-3 border"
              style={{
                borderColor: "var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Pill tone={p.status === "allowed" ? "allowed" : "routed"}>
                {p.status === "allowed" ? "Allow" : "Route"}
              </Pill>
              <div className="min-w-0 flex-1">
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {p.id} · {p.family}
                </div>
                <div style={{ fontSize: "0.8125rem" }}>{p.reason}</div>
              </div>
            </li>
          ))}
          <li>
            <Button
              variant="ghost"
              size="sm"
              onClick={openDrawer}
              icon={<ArrowRight size={14} />}
            >
              Open evidence drawer
            </Button>
          </li>
        </ul>
      )}
    </Card>
  );
}

function ImpactCard({ step }: { step: EventState }) {
  const visible = ["cost", "inventory", "policy", "preview", "approved", "customer"].includes(step);
  return (
    <Card>
      <SectionTitle title="Impact" subtitle="Margin, supply, and customer commitments." />
      {!visible ? (
        <EmptyState
          icon={<TrendingDown size={18} />}
          text="Cost-to-serve recompute will populate this card."
        />
      ) : (
        <div className="space-y-3">
          <ImpactRow label="Margin Δ" value="−6.2%" tone="bad" sub="ENGAGE 8842 · EU" />
          <ImpactRow label="Working capital at risk" value="€2.1M" tone="bad" sub="If no action in 72h" />
          <ImpactRow label="Customer commitments affected" value="27" tone="warn" sub="4 require GTM sign-off" />
          <ImpactRow label="Revenue preserved (post-action)" value="€8.4M" tone="good" sub="Modeled" />
          <div
            className="mt-2 p-3 flex items-center gap-2"
            style={{
              backgroundColor: "var(--secondary)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
            }}
          >
            <Factory size={14} /> Tarragona capacity: 78% · Freeport capacity: 64%
          </div>
        </div>
      )}
    </Card>
  );
}

function ImpactRow({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "good" | "warn" | "bad";
}) {
  const color =
    tone === "good"
      ? "var(--chart-2)"
      : tone === "warn"
        ? "var(--chart-3)"
        : "var(--destructive)";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{label}</div>
        <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>{sub}</div>
      </div>
      <div style={{ fontSize: "1.125rem", fontWeight: "var(--font-weight-medium)", color }}>
        {value}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="flex items-center gap-3 p-4 border-dashed"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-md)",
        color: "var(--muted-foreground)",
        fontSize: "0.8125rem",
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
