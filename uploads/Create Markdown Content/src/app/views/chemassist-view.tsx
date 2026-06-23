import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Truck,
  FlaskConical,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button, Card, KeyValue, Pill, SectionTitle } from "../components/primitives";
import { useApp } from "../lib/store";

const GRADES = [
  {
    grade: "ENGAGE 8842",
    fit: 0.94,
    density: "0.857 g/cc",
    melt: "1.0 g/10 min",
    lowTemp: "-77 °C",
    plant: "Tarragona (ES)",
    notes:
      "Best balance for automotive TPO dashboards in EU climate. Validated with two tier-1 OEMs.",
    flags: ["Approved for automotive interior", "REACH compliant"],
    recommend: true,
  },
  {
    grade: "ENGAGE 8200",
    fit: 0.86,
    density: "0.870 g/cc",
    melt: "5.0 g/10 min",
    lowTemp: "-56 °C",
    plant: "Freeport (US)",
    notes:
      "Higher flow alternative. Useful for thinner-section parts or backup supply if EU plant is constrained.",
    flags: ["Lead time +5 days from US"],
    recommend: false,
  },
  {
    grade: "ENGAGE 7467",
    fit: 0.71,
    density: "0.862 g/cc",
    melt: "1.2 g/10 min",
    lowTemp: "-67 °C",
    plant: "Tarragona (ES)",
    notes:
      "Lower fit for impact target; consider only if cost-to-serve is the dominant constraint.",
    flags: ["Indicative match only"],
    recommend: false,
  },
];

export function ChemAssistView() {
  const [step, setStep] = useState<"intent" | "compare">("intent");
  const [intent, setIntent] = useState(
    "Need an ENGAGE elastomer for an automotive instrument-panel skin in Europe. Injection-molded TPO blend, low-temp impact down to -40 °C, must be REACH compliant. Looking at production launch Q1 2027 — need samples to qualify within 8 weeks.",
  );
  const { customerEtaDays, customerNote } = useApp();
  const selected = GRADES[0];

  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <SectionTitle
        eyebrow="Customer surface"
        title="ChemAssist"
        subtitle="Natural-language intent → grounded recommendation → governed sample commitment."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="info">Account · Lumera Auto Interiors</Pill>
            <Pill tone="allowed">PAC allow · disclaimers attached</Pill>
          </div>
        }
      />

      <Stepper step={step} onChange={setStep} />

      {step === "intent" ? (
        <IntentWorkspace
          intent={intent}
          setIntent={setIntent}
          onSubmit={() => setStep("compare")}
        />
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 360px" }}>
          <div className="space-y-6 min-w-0">
            <ExtractedRequirements />
            <RankedRecommendations />
            <SampleCommitment
              etaDays={customerEtaDays}
              note={customerNote}
              selected={selected.grade}
            />
          </div>
          <aside className="space-y-6">
            <EvidenceCard />
            <NextStepsCard />
          </aside>
        </div>
      )}
    </div>
  );
}

function Stepper({
  step,
  onChange,
}: {
  step: "intent" | "compare";
  onChange: (s: "intent" | "compare") => void;
}) {
  const steps = [
    { key: "intent", label: "1. Describe intent" },
    { key: "compare", label: "2. Recommendation & sample" },
  ] as const;
  return (
    <div
      className="flex items-center gap-2 mb-6 p-1 inline-flex"
      style={{
        backgroundColor: "var(--muted)",
        borderRadius: "var(--radius-md)",
      }}
    >
      {steps.map((s) => {
        const active = step === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className="px-4 py-1.5 transition-colors"
            style={{
              backgroundColor: active ? "var(--card)" : "transparent",
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
              fontWeight: "var(--font-weight-medium)",
              boxShadow: active
                ? "0 1px 2px color-mix(in oklab, var(--foreground) 10%, transparent)"
                : undefined,
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function IntentWorkspace({
  intent,
  setIntent,
  onSubmit,
}: {
  intent: string;
  setIntent: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: "var(--primary)" }} />
          <span
            style={{
              fontWeight: "var(--font-weight-medium)",
              color: "var(--foreground)",
            }}
          >
            Describe your application
          </span>
        </div>
        <p
          className="mb-4"
          style={{
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
          }}
        >
          Tell us about the part, environment, process, and timeline. The
          agent will extract structured requirements and ground recommendations
          in approved Dow technical content.
        </p>
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          rows={7}
          className="w-full p-4 outline-none transition-shadow"
          style={{
            backgroundColor: "var(--input-background)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            resize: "vertical",
          }}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {["Automotive", "Wire & cable", "Packaging", "Medical"].map((c) => (
              <button
                key={c}
                className="px-3 py-1.5"
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 999,
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  backgroundColor: "transparent",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <Button onClick={onSubmit} icon={<ArrowRight size={14} />}>
            Find grades & start sample
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} style={{ color: "var(--primary)" }} />
          <span style={{ fontWeight: "var(--font-weight-medium)" }}>
            What you can expect
          </span>
        </div>
        <ul className="space-y-3">
          {[
            "Ranked ENGAGE grades with rationale and caveats",
            "Compliance and regulatory status surfaced inline",
            "A governed sample commitment with ETA and owner",
            "Proactive updates if supply or pricing shifts",
          ].map((t) => (
            <li
              key={t}
              className="flex items-start gap-2"
              style={{ fontSize: "0.8125rem", color: "var(--foreground)" }}
            >
              <CheckCircle2
                size={14}
                style={{ marginTop: 2, color: "var(--chart-2)" }}
              />
              {t}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ExtractedRequirements() {
  const items = [
    ["Application", "Automotive TPO instrument-panel skin"],
    ["Region", "Europe"],
    ["Process", "Injection molding"],
    ["Performance", "Low-temp impact to −40 °C"],
    ["Compliance", "REACH"],
    ["Timeline", "Q1 2027 launch · 8-week qualification window"],
  ];
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
            }}
          >
            Extracted requirements
          </div>
          <div
            style={{
              fontWeight: "var(--font-weight-medium)",
              marginTop: 2,
            }}
          >
            ChemAssist parsed your brief
          </div>
        </div>
        <Pill tone="info">Editable</Pill>
      </div>
      <div
        className="grid gap-x-6 gap-y-4"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {items.map(([k, v]) => (
          <KeyValue key={k} label={k} value={v} />
        ))}
      </div>
    </Card>
  );
}

function RankedRecommendations() {
  return (
    <Card>
      <SectionTitle
        title="Ranked candidates"
        subtitle="Fit scores weight technical match, regional availability, and prior automotive qualifications."
      />
      <div className="space-y-3">
        {GRADES.map((g) => (
          <GradeRow key={g.grade} g={g} />
        ))}
      </div>
    </Card>
  );
}

function GradeRow({ g }: { g: typeof GRADES[number] }) {
  return (
    <div
      className="border p-4 grid gap-4 items-center"
      style={{
        borderColor: g.recommend
          ? "color-mix(in oklab, var(--chart-2) 50%, var(--border))"
          : "var(--border)",
        borderRadius: "var(--radius-md)",
        gridTemplateColumns: "1fr 2fr auto",
        backgroundColor: g.recommend
          ? "color-mix(in oklab, var(--chart-2) 6%, var(--card))"
          : "var(--card)",
      }}
    >
      <div>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontWeight: "var(--font-weight-medium)",
              color: "var(--foreground)",
            }}
          >
            {g.grade}
          </span>
          {g.recommend && <Pill tone="allowed">Top match</Pill>}
        </div>
        <div className="mt-1 flex items-center gap-3" style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          <span>{g.plant}</span>
          <span>·</span>
          <span>Fit {Math.round(g.fit * 100)}%</span>
        </div>
        <FitBar value={g.fit} />
      </div>
      <div>
        <div
          className="grid gap-x-4 gap-y-1"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <Tiny label="Density" value={g.density} />
          <Tiny label="Melt index" value={g.melt} />
          <Tiny label="Low-temp brittleness" value={g.lowTemp} />
        </div>
        <p
          className="mt-2"
          style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
        >
          {g.notes}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {g.flags.map((f) => (
            <span
              key={f}
              className="px-2 py-0.5"
              style={{
                fontSize: "0.6875rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--muted-foreground)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button size="sm" variant={g.recommend ? "primary" : "secondary"}>
          Request sample
        </Button>
        <Button size="sm" variant="ghost">
          Compare
        </Button>
      </div>
    </div>
  );
}

function FitBar({ value }: { value: number }) {
  return (
    <div
      className="mt-2"
      style={{
        height: 4,
        backgroundColor: "var(--muted)",
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value * 100}%`,
          backgroundColor: "var(--chart-2)",
        }}
      />
    </div>
  );
}

function Tiny({ label, value }: { label: string; value: string }) {
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
      <div style={{ fontSize: "0.8125rem", color: "var(--foreground)" }}>
        {value}
      </div>
    </div>
  );
}

function SampleCommitment({
  etaDays,
  note,
  selected,
}: {
  etaDays: number;
  note: string | null;
  selected: string;
}) {
  const stages = [
    { key: "requested", label: "Requested", icon: <FileText size={14} />, done: true },
    { key: "qualified", label: "Lab qualification", icon: <FlaskConical size={14} />, done: true },
    { key: "scheduled", label: "Plant scheduled", icon: <CheckCircle2 size={14} />, done: note ? false : true, current: note ? true : false },
    { key: "shipped", label: "In transit", icon: <Truck size={14} />, done: false },
  ];
  return (
    <Card>
      <SectionTitle
        eyebrow="Sample commitment"
        title={`${selected} · 5 kg sample to Lumera Auto`}
        subtitle="A governed commercial object — owner, ETA, qualification state, and policy bundle all linked."
        action={
          note ? (
            <Pill tone="pending">ETA revised</Pill>
          ) : (
            <Pill tone="allowed">On track</Pill>
          )
        }
      />
      <div className="flex items-stretch gap-3 mb-5">
        {stages.map((s, i) => (
          <div key={s.key} className="flex-1">
            <div
              className="flex items-center gap-2 px-3 py-2 border"
              style={{
                borderColor: s.current
                  ? "color-mix(in oklab, var(--chart-3) 60%, var(--border))"
                  : s.done
                    ? "color-mix(in oklab, var(--chart-2) 50%, var(--border))"
                    : "var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: s.current
                  ? "color-mix(in oklab, var(--chart-3) 14%, var(--card))"
                  : s.done
                    ? "color-mix(in oklab, var(--chart-2) 8%, var(--card))"
                    : "var(--card)",
                color: "var(--foreground)",
              }}
            >
              <span
                style={{
                  color: s.done
                    ? "var(--chart-2)"
                    : s.current
                      ? "var(--chart-3)"
                      : "var(--muted-foreground)",
                }}
              >
                {s.icon}
              </span>
              <div className="leading-tight">
                <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  Step {i + 1}
                </div>
                <div style={{ fontSize: "0.8125rem", fontWeight: "var(--font-weight-medium)" }}>
                  {s.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="grid gap-6 p-4 border"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          borderColor: "var(--border)",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--secondary)",
        }}
      >
        <KeyValue label="ETA" value={`${etaDays} days`} />
        <KeyValue label="Source plant" value="Tarragona (ES)" />
        <KeyValue label="Owner" value="C. Roussel · Technical Service" />
        <KeyValue label="Trace ID" value="trc_8842_2026-06-01_eu" mono />
      </div>

      {note && (
        <div
          className="mt-4 p-4 flex gap-3 items-start"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--chart-3) 12%, var(--card))",
            border: "1px solid color-mix(in oklab, var(--chart-3) 40%, var(--border))",
            borderRadius: "var(--radius-md)",
          }}
        >
          <AlertCircle
            size={18}
            style={{ color: "var(--chart-3)", marginTop: 2 }}
          />
          <div className="min-w-0">
            <div
              style={{
                fontWeight: "var(--font-weight-medium)",
                marginBottom: 4,
              }}
            >
              Proactive update from planning
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
              {note}
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="primary">Accept revised ETA</Button>
              <Button size="sm" variant="secondary">Switch to ENGAGE 8200</Button>
              <Button size="sm" variant="ghost">View rationale</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function EvidenceCard() {
  const docs = [
    { title: "ENGAGE Automotive Selection Guide", section: "Section 4.3 — TPO interior", role: "Typical data" },
    { title: "TDS · ENGAGE 8842", section: "Rev 2024-11", role: "Specification" },
    { title: "REACH Compliance Statement", section: "EU SVHC list", role: "Regulatory" },
    { title: "Lumera Auto · prior qualification", section: "QF-2023-118", role: "Account history" },
  ];
  return (
    <Card>
      <SectionTitle title="Evidence" subtitle="Every claim links back to source." />
      <ul className="space-y-3">
        {docs.map((d) => (
          <li
            key={d.title}
            className="border p-3"
            style={{
              borderColor: "var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div className="flex items-center gap-2">
              <FileText size={14} style={{ color: "var(--muted-foreground)" }} />
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {d.title}
              </span>
            </div>
            <div
              className="mt-1 flex items-center gap-2"
              style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
            >
              <span>{d.section}</span>
              <span>·</span>
              <Pill tone="neutral">{d.role}</Pill>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function NextStepsCard() {
  return (
    <Card>
      <SectionTitle title="Next best actions" />
      <ul className="space-y-2">
        {[
          "Confirm part thickness for melt-index check",
          "Upload prior tier-1 test protocol",
          "Schedule technical-service consult",
        ].map((s) => (
          <li
            key={s}
            className="flex items-center justify-between gap-2 p-2"
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
            }}
          >
            <span>{s}</span>
            <ArrowRight size={14} style={{ color: "var(--muted-foreground)" }} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
