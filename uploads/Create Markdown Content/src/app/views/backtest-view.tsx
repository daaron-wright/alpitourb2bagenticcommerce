import { Play, FlaskConical, CheckCircle2, CircleAlert } from "lucide-react";
import { Button, Card, Pill, SectionTitle } from "../components/primitives";

const REPLAYS = [
  {
    name: "naphtha_spike_eu_q1",
    status: "passed",
    runs: 8,
    citation: "100%",
    unauth: 0,
    policy: "217 / 217",
  },
  {
    name: "delayed_shipment_emergency",
    status: "passed",
    runs: 4,
    citation: "99.6%",
    unauth: 0,
    policy: "217 / 217",
  },
  {
    name: "substitution_recommend_low_confidence",
    status: "investigating",
    runs: 3,
    citation: "94%",
    unauth: 0,
    policy: "215 / 217",
  },
];

const GATES = [
  { stage: "Shadow mode", criteria: "Planner acceptance ≥ 80% · 0 critical failures", state: "cleared" },
  { stage: "Human-approved internal", criteria: "Approved-action accuracy ≥ 92% · audit completeness 100%", state: "current" },
  { stage: "Customer-visible pilot", criteria: "Legal & compliance sign-off · CX error ≤ 1%", state: "pending" },
  { stage: "Expanded bounded autonomy", criteria: "Threshold stability ≥ 4 weeks", state: "pending" },
];

export function BacktestView() {
  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <SectionTitle
        eyebrow="Governance"
        title="Backtest Lab"
        subtitle="Replay shocks against draft bundles and skills before they touch customers or live writes."
        action={<Button icon={<Play size={14} />}>New scenario run</Button>}
      />

      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <Card>
          <SectionTitle title="Replay datasets" />
          <div className="space-y-3">
            {REPLAYS.map((r) => (
              <div
                key={r.name}
                className="border p-4"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical size={14} style={{ color: "var(--primary)" }} />
                    <span
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "0.875rem",
                      }}
                    >
                      {r.name}
                    </span>
                  </div>
                  <Pill tone={r.status === "passed" ? "allowed" : "pending"}>
                    {r.status === "passed" ? "Gate passing" : "Investigating"}
                  </Pill>
                </div>
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                >
                  <Metric label="Runs" value={String(r.runs)} />
                  <Metric label="Citation coverage" value={r.citation} />
                  <Metric label="Unauthorized actions" value={String(r.unauth)} good={r.unauth === 0} />
                  <Metric label="Policy tests" value={r.policy} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Acceptance thresholds" />
          <ul className="space-y-3">
            {[
              ["Citation coverage", "≥ 99%", "good"],
              ["Unauthorized actions", "0", "good"],
              ["Policy tests", "100% on must-have", "good"],
              ["Planner override rate", "≤ 15%", "warn"],
              ["Audit completeness", "100%", "good"],
            ].map(([k, v, tone]) => (
              <li
                key={k}
                className="flex items-center justify-between p-3 border"
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8125rem" }}>{k}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Threshold {v}
                  </div>
                </div>
                {tone === "good" ? (
                  <CheckCircle2 size={16} style={{ color: "var(--chart-2)" }} />
                ) : (
                  <CircleAlert size={16} style={{ color: "var(--chart-4)" }} />
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Deployment gates" subtitle="No customer-visible flow without explicit passage." />
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {GATES.map((g, i) => (
            <div
              key={g.stage}
              className="border p-4"
              style={{
                borderColor:
                  g.state === "current"
                    ? "color-mix(in oklab, var(--chart-3) 55%, var(--border))"
                    : g.state === "cleared"
                      ? "color-mix(in oklab, var(--chart-2) 50%, var(--border))"
                      : "var(--border)",
                backgroundColor:
                  g.state === "current"
                    ? "color-mix(in oklab, var(--chart-3) 10%, var(--card))"
                    : g.state === "cleared"
                      ? "color-mix(in oklab, var(--chart-2) 8%, var(--card))"
                      : "var(--card)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Gate {i + 1}
              </div>
              <div
                style={{
                  fontWeight: "var(--font-weight-medium)",
                  marginTop: 4,
                  marginBottom: 6,
                }}
              >
                {g.stage}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                {g.criteria}
              </p>
              <div className="mt-3">
                <Pill
                  tone={
                    g.state === "cleared"
                      ? "allowed"
                      : g.state === "current"
                        ? "pending"
                        : "neutral"
                  }
                >
                  {g.state === "cleared"
                    ? "Cleared"
                    : g.state === "current"
                      ? "In progress"
                      : "Not started"}
                </Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.6875rem",
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "var(--font-weight-medium)",
          color: good ? "var(--chart-2)" : "var(--foreground)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
