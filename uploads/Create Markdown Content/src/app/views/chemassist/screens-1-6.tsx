import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Beaker,
  FileText,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { useApp } from "../../lib/store";
import {
  ChemAssistBar,
  PacChip,
  SupplyBadge,
  CardBlock,
  PrimaryCTA,
  GhostCTA,
  InternalOnly,
  ToggleInternal,
  SupplyTone,
} from "./components";

// ─────────────────────────────────────────────────────────────────────────────
// Shared layout for journey screens
// ─────────────────────────────────────────────────────────────────────────────

export function JourneyShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-[1320px] mx-auto px-8 pt-10 pb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                color: "var(--muted-foreground)",
                fontWeight: "var(--font-weight-medium)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {eyebrow}
            </div>
            <h1 style={{ fontSize: "1.875rem", letterSpacing: "-0.01em" }}>{title}</h1>
            {subtitle && (
              <p
                className="mt-2"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--muted-foreground)",
                  maxWidth: 760,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <ToggleInternal />
        </div>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Dow home / Intent entry
// ─────────────────────────────────────────────────────────────────────────────

const SUGGESTED = [
  "Automotive interior",
  "TPO compound",
  "Cold-weather impact",
  "Request sample",
  "Compare grades",
  "Check compliance",
];

const HELP = [
  "Product selection",
  "Application fit",
  "Regulatory checks",
  "Sample request",
  "Availability guidance",
  "Expert escalation",
];

export function ScreenIntent() {
  const [v, setV] = useState(
    "I need a material for an automotive dashboard that performs in cold weather."
  );
  const { advanceJourney } = useApp();
  return (
    <div>
      <section
        style={{
          background:
            "linear-gradient(180deg, var(--background), color-mix(in oklab, var(--primary) 5%, var(--background)))",
        }}
      >
        <div className="max-w-[1320px] mx-auto px-8 pt-16 pb-12 grid gap-10" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                color: "var(--muted-foreground)",
                fontWeight: "var(--font-weight-medium)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Dow ChemAssist · Supply-aware customer experience
            </div>
            <h1
              style={{
                fontSize: "3rem",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                marginBottom: 14,
              }}
            >
              What are you trying to make?
            </h1>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.55,
                maxWidth: 620,
                marginBottom: 28,
              }}
            >
              Describe your application. ChemAssist will recommend products, check
              compliance, and guide next steps — grounded in approved Dow content
              and aware of supply conditions.
            </p>
            <ChemAssistBar
              value={v}
              onChange={setV}
              onSubmit={advanceJourney}
              state="understanding"
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={advanceJourney}
                  className="inline-flex items-center gap-1 px-3 py-1.5"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card)",
                    borderRadius: 999,
                    fontSize: "0.8125rem",
                  }}
                >
                  <Sparkles size={11} style={{ color: "var(--primary)" }} /> {s}
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <PacChip decision="customerSafe">Customer-safe answer</PacChip>
              <PacChip decision="allowed">Grounded in approved sources</PacChip>
              <PacChip decision="redacted">Internal operating details redacted</PacChip>
            </div>
          </div>
          <aside
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 2,
              padding: 24,
              alignSelf: "start",
            }}
          >
            <div
              className="inline-flex items-center gap-2 mb-4"
              style={{
                color: "var(--primary)",
                fontSize: "0.6875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              <Sparkles size={12} /> ChemAssist can help with
            </div>
            <ul className="space-y-3">
              {HELP.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 2,
                      backgroundColor: "var(--secondary)",
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "var(--font-weight-medium)", fontSize: "0.875rem" }}>
                      {h}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                      {
                        {
                          "Product selection": "Find Dow grades that fit your application.",
                          "Application fit": "Map your use case to validated materials.",
                          "Regulatory checks": "REACH, RoHS, FDA, regional documentation.",
                          "Sample request": "Build a governed sample plan with status.",
                          "Availability guidance": "Customer-safe supply confidence.",
                          "Expert escalation": "Hand off to Dow Technical Service in context.",
                        }[h]
                      }
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — Guided application profile
// ─────────────────────────────────────────────────────────────────────────────

export function ScreenProfile() {
  const { advanceJourney } = useApp();
  const [why, setWhy] = useState<string | null>("Region");

  return (
    <JourneyShell
      eyebrow="Step 2 of 8 · Guided application profile"
      title="Let's make sure ChemAssist understood you"
      subtitle="We've turned your intent into a structured profile. Review and adjust — no long form."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "320px 1fr 280px" }}>
        <ConversationPane />
        <div className="space-y-4">
          <ProfileCard
            title="Application"
            picks={[
              { v: "Automotive interior", on: true },
              { v: "Instrument panel / dashboard", on: true },
              { v: "TPO compound", on: true },
              { v: "Exterior trim", on: false },
            ]}
          />
          <ProfileCard
            title="Performance needs"
            picks={[
              { v: "Low-temperature impact (to −40 °C)", on: true },
              { v: "Soft-touch / appearance", on: true },
              { v: "Processing efficiency", on: true },
              { v: "Lightweighting", on: false },
            ]}
          />
          <ProfileCard
            title="Region"
            picks={[
              { v: "Germany / EU", on: true },
              { v: "Other EU", on: false },
            ]}
            onWhy={() => setWhy("Region")}
          />
          <ProfileCard
            title="Next step"
            picks={[
              { v: "Compare products", on: true },
              { v: "Request sample", on: false },
              { v: "Ask a technical expert", on: false },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <PacChip decision="customerSafe">Customer-facing answer allowed</PacChip>
            <PacChip decision="allowed">EU region detected</PacChip>
            <PacChip decision="allowed">Formal certification not requested</PacChip>
            <PacChip decision="human">Account-specific data locked until sign-in</PacChip>
          </div>
          <div className="flex items-center justify-end gap-3 mt-2">
            <GhostCTA>Adjust</GhostCTA>
            <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
              Confirm profile
            </PrimaryCTA>
          </div>
        </div>
        <WhyDrawer topic={why} />
      </div>
    </JourneyShell>
  );
}

function ConversationPane() {
  return (
    <aside
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 2,
        padding: 16,
        height: "fit-content",
      }}
    >
      <div
        className="flex items-center gap-2 mb-3 pb-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Sparkles size={13} style={{ color: "var(--primary)" }} />
        <span style={{ fontWeight: "var(--font-weight-medium)", fontSize: "0.875rem" }}>
          ChemAssist
        </span>
        <span
          className="ml-auto"
          style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}
        >
          Grounded · v3.4
        </span>
      </div>
      <Bubble who="cust">
        I need a material for an automotive dashboard that performs in cold weather.
      </Bubble>
      <Bubble who="ai">
        Got it. To recommend the right Dow elastomer, I need to confirm the
        application, region, performance needs, and your sample goal. I've
        pre-filled a profile — adjust anything that looks off.
      </Bubble>
      <Bubble who="ai">
        I've mapped <strong>dashboard</strong> to automotive interior · instrument
        panel · TPO compound. Cold weather usually means low-temperature impact
        down to −40 °C.
      </Bubble>
    </aside>
  );
}

function Bubble({ who, children }: { who: "ai" | "cust"; children: React.ReactNode }) {
  return (
    <div
      className="mb-2 p-3"
      style={{
        backgroundColor:
          who === "ai" ? "color-mix(in oklab, var(--primary) 6%, var(--card))" : "var(--secondary)",
        border: "1px solid var(--border)",
        borderRadius: 2,
        fontSize: "0.8125rem",
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          fontSize: "0.6875rem",
          color: "var(--muted-foreground)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {who === "ai" ? "ChemAssist" : "You"}
      </div>
      {children}
    </div>
  );
}

function ProfileCard({
  title,
  picks,
  onWhy,
}: {
  title: string;
  picks: { v: string; on: boolean }[];
  onWhy?: () => void;
}) {
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 2,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div style={{ fontWeight: "var(--font-weight-medium)" }}>{title}</div>
        <button
          onClick={onWhy}
          className="inline-flex items-center gap-1"
          style={{
            fontSize: "0.6875rem",
            color: "var(--primary)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <HelpCircle size={11} /> Why this matters
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {picks.map((p) => (
          <span
            key={p.v}
            className="inline-flex items-center gap-1.5 px-2.5 py-1"
            style={{
              backgroundColor: p.on
                ? "color-mix(in oklab, var(--primary) 8%, var(--card))"
                : "var(--secondary)",
              border: p.on
                ? "1px solid color-mix(in oklab, var(--primary) 35%, var(--border))"
                : "1px solid var(--border)",
              borderRadius: 999,
              fontSize: "0.8125rem",
              color: p.on ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            {p.on && <CheckCircle2 size={11} />} {p.v}
          </span>
        ))}
      </div>
    </div>
  );
}

function WhyDrawer({ topic }: { topic: string | null }) {
  const content: Record<string, { title: string; body: string }> = {
    Region: {
      title: "Why region matters",
      body: "Region affects regulatory documentation (REACH/RoHS), sample routing, and supply availability for your selected grade.",
    },
  };
  const c = topic ? content[topic] : null;
  return (
    <aside
      style={{
        backgroundColor: "var(--secondary)",
        border: "1px solid var(--border)",
        borderRadius: 2,
        padding: 16,
        height: "fit-content",
      }}
    >
      <div
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.08em",
          color: "var(--muted-foreground)",
          fontWeight: "var(--font-weight-medium)",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Why this matters
      </div>
      <div style={{ fontWeight: "var(--font-weight-medium)", marginBottom: 6 }}>
        {c?.title ?? "Pick any tag for context"}
      </div>
      <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
        {c?.body ?? "Each card affects how ChemAssist scores recommendations and what documents we surface."}
      </p>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Ranked product recommendations
// ─────────────────────────────────────────────────────────────────────────────

type Recommendation = {
  name: string;
  fit: "High" | "Medium-high" | "High technical performance";
  bestFor: string;
  sample: string;
  supply: SupplyTone;
  supplyLabel?: string;
  compliance: string;
  evidence: string;
  next: string;
  pin?: boolean;
  internal?: string;
};

const RECS: Recommendation[] = [
  {
    name: "ENGAGE™ 8180 Polyolefin Elastomer",
    fit: "High",
    bestFor: "Low-temperature impact and TPO compound modification",
    sample: "Eligible · 1 kg",
    supply: "watch",
    compliance: "EU documents available",
    evidence: "Cited in 4 approved technical guides",
    next: "Add to sample plan",
    pin: true,
    internal: "Feedstock economics shifted on dependent European supply path (Tarragona). Cost-to-serve recomputed; margin floor maintained.",
  },
  {
    name: "ENGAGE™ 8003 Polyolefin Elastomer",
    fit: "Medium-high",
    bestFor: "General TPO compound performance",
    sample: "Eligible · 1 kg",
    supply: "strong",
    compliance: "EU documents available",
    evidence: "Cited in 3 approved technical guides",
    next: "Compare",
    internal: "No fulfillment constraint for selected route; stocked at Terneuzen.",
  },
  {
    name: "ENGAGE™ XLT 8677 Polyolefin Elastomer",
    fit: "High technical performance",
    bestFor: "Specialized cold-temperature performance profile",
    sample: "Expert review suggested",
    supply: "expert",
    compliance: "EU documents available · application-specific",
    evidence: "Limited cross-reference for this exact application",
    next: "Ask Technical Service",
    internal: "Specialized grade — Tech Service recommendation policy applies (action_level 2).",
  },
];

export function ScreenRecommend() {
  const { advanceJourney } = useApp();
  return (
    <JourneyShell
      eyebrow="Step 3 of 8 · Recommendations"
      title="Recommended Dow Elastomers for your application"
      subtitle="Ranked by technical fit, documented application relevance, compliance readiness, and sample pathway."
    >
      <div className="space-y-4">
        {RECS.map((r) => (
          <RecommendationCard key={r.name} rec={r} onCompare={advanceJourney} />
        ))}
      </div>
      <InternalOnly title="Why ranked this way">
        <ul style={{ lineHeight: 1.6 }}>
          <li>Ontology match: dashboard → automotive interior / instrument panel / TPO.</li>
          <li>Tech-fit score weighted on low-temp impact + TPO relevance from product guides.</li>
          <li>Supply Chain Spine returned watch condition for ENGAGE 8180 (Tarragona naphtha event).</li>
          <li>PAC approved customer-safe supply badge (allow_with_redaction).</li>
        </ul>
      </InternalOnly>
    </JourneyShell>
  );
}

function RecommendationCard({
  rec,
  onCompare,
}: {
  rec: Recommendation;
  onCompare: () => void;
}) {
  const { advanceJourney } = useApp();
  return (
    <article
      style={{
        backgroundColor: "var(--card)",
        border: rec.pin
          ? "1px solid color-mix(in oklab, var(--primary) 38%, var(--border))"
          : "1px solid var(--border)",
        borderRadius: 2,
        padding: 20,
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 style={{ color: "var(--primary)", fontSize: "1.0625rem" }}>{rec.name}</h3>
            {rec.pin && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontWeight: "var(--font-weight-medium)",
                  borderRadius: 2,
                }}
              >
                Top match
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              fontWeight: "var(--font-weight-medium)",
              marginBottom: 10,
            }}
          >
            Fit score · {rec.fit}
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--foreground)" }}>Best for:</strong> {rec.bestFor}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SupplyBadge tone={rec.supply} label={rec.supplyLabel} />
            <PacChip decision="customerSafe">{rec.compliance}</PacChip>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
              }}
            >
              {rec.sample}
            </span>
          </div>
          <InternalOnly title={`Internal context · ${rec.name.split(" ")[1]}`}>
            {rec.internal}
          </InternalOnly>
        </div>
        <div className="flex flex-col items-end gap-2" style={{ width: 220 }}>
          <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
            {rec.next}
          </PrimaryCTA>
          <button
            onClick={onCompare}
            className="inline-flex items-center gap-1"
            style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "var(--font-weight-medium)" }}
          >
            <FileText size={12} /> Evidence
          </button>
          <button
            onClick={onCompare}
            className="inline-flex items-center gap-1"
            style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "var(--font-weight-medium)" }}
          >
            Compare
          </button>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 4 — Product comparison with explainability
// ─────────────────────────────────────────────────────────────────────────────

const COMPARE_ROWS: { attr: string; a: string; b: string }[] = [
  { attr: "Application fit", a: "High", b: "Medium-high" },
  { attr: "TPO relevance", a: "Strong", b: "Strong" },
  { attr: "Low-temp performance evidence", a: "Stronger", b: "Moderate" },
  { attr: "Sample eligibility", a: "Yes", b: "Yes" },
  { attr: "Regional documentation", a: "Available (EU)", b: "Available (EU)" },
  { attr: "Supply confidence", a: "Watch", b: "Strong" },
  { attr: "Expert review needed", a: "Optional", b: "No" },
];

const REASON_STEPS = [
  "Product ontology matched your application (dashboard → automotive interior / TPO).",
  "Technical guide checked: ENGAGE elastomer selection criteria.",
  "EU region applied: REACH documentation available.",
  "Sample eligibility checked: both grades eligible at 1 kg.",
  "Supply signal checked: ENGAGE 8180 watch condition flagged.",
  "PAC reviewed customer-facing response (allow_with_redaction).",
];

export function ScreenCompare() {
  const { advanceJourney } = useApp();
  return (
    <JourneyShell
      eyebrow="Step 4 of 8 · Compare"
      title="ENGAGE™ 8180 vs ENGAGE™ 8003"
      subtitle="A side-by-side view, plus the reasoning ChemAssist used to recommend them."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
        <CardBlock title="Comparison" pad={false}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--secondary)" }}>
                <th style={th}>Attribute</th>
                <th style={th}>ENGAGE™ 8180</th>
                <th style={th}>ENGAGE™ 8003</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r, i) => (
                <tr
                  key={r.attr}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <td style={td}>{r.attr}</td>
                  <td style={td}>{r.a}</td>
                  <td style={td}>{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="p-5"
            style={{
              borderTop: "1px solid var(--border)",
              backgroundColor: "color-mix(in oklab, var(--primary) 5%, var(--card))",
            }}
          >
            <div
              className="inline-flex items-center gap-2 mb-2"
              style={{
                color: "var(--primary)",
                fontSize: "0.6875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              <Sparkles size={12} /> ChemAssist recommendation
            </div>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.55 }}>
              For cold-weather automotive interior TPO evaluation, start with{" "}
              <strong>ENGAGE™ 8180</strong>. Add <strong>ENGAGE™ 8003</strong> as a
              comparison sample because it has stronger current sample availability
              for your region.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
                Build sample plan
              </PrimaryCTA>
              <GhostCTA>Add another grade</GhostCTA>
            </div>
          </div>
        </CardBlock>
        <CardBlock title="How this recommendation was made">
          <ol className="space-y-3">
            {REASON_STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    backgroundColor: "color-mix(in oklab, var(--primary) 10%, var(--card))",
                    color: "var(--primary)",
                    fontSize: "0.6875rem",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <PacChip decision="allowed">Allow · L1</PacChip>
            <PacChip decision="redacted">Redact internal cost</PacChip>
          </div>
        </CardBlock>
      </div>
    </JourneyShell>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted-foreground)",
  fontWeight: "var(--font-weight-medium)",
};
const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: "0.875rem",
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 5 — Smart sample plan
// ─────────────────────────────────────────────────────────────────────────────

export function ScreenPlan() {
  const { advanceJourney } = useApp();
  const readiness = [
    { label: "Product documentation", state: "ok", note: "Ready" },
    { label: "SDS", state: "ok", note: "Ready" },
    { label: "EU shipping", state: "warn", note: "Needs address confirmation" },
    { label: "Sample eligibility", state: "ok", note: "Allowed" },
    { label: "Supply signal", state: "watch", note: "One grade under watch" },
    { label: "Expert review", state: "ok", note: "Optional" },
  ];
  return (
    <JourneyShell
      eyebrow="Step 5 of 8 · Sample plan"
      title="Sample Plan: Automotive Interior TPO Evaluation"
      subtitle="A governed sample plan — not a cart. ChemAssist checks documentation, compliance, eligibility, and supply signals before you submit."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="space-y-4">
          <CardBlock title="Products selected">
            {[
              { name: "ENGAGE™ 8180 Polyolefin Elastomer", qty: "1 kg", tone: "watch" as SupplyTone },
              { name: "ENGAGE™ 8003 Polyolefin Elastomer", qty: "1 kg", tone: "strong" as SupplyTone },
            ].map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between gap-4 py-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex-1">
                  <div style={{ fontWeight: "var(--font-weight-medium)" }}>{p.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                    Sample quantity {p.qty}
                  </div>
                </div>
                <SupplyBadge tone={p.tone} />
                <button
                  style={{ color: "var(--muted-foreground)" }}
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </CardBlock>

          <CardBlock title="Sample purpose">
            <div className="flex flex-wrap gap-2">
              {[
                { v: "Qualification trial", on: true },
                { v: "Comparative evaluation", on: true },
                { v: "Pilot production", on: false },
                { v: "Internal R&D", on: false },
              ].map((t) => (
                <span
                  key={t.v}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5"
                  style={{
                    backgroundColor: t.on
                      ? "color-mix(in oklab, var(--primary) 8%, var(--card))"
                      : "var(--secondary)",
                    border: t.on
                      ? "1px solid color-mix(in oklab, var(--primary) 32%, var(--border))"
                      : "1px solid var(--border)",
                    color: t.on ? "var(--primary)" : "var(--muted-foreground)",
                    borderRadius: 999,
                    fontSize: "0.8125rem",
                  }}
                >
                  {t.on && <CheckCircle2 size={11} />} {t.v}
                </span>
              ))}
            </div>
            <p
              className="mt-4"
              style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
            >
              <strong style={{ color: "var(--foreground)" }}>Application:</strong>{" "}
              Automotive dashboard / interior TPO · Germany / EU
            </p>
          </CardBlock>

          <PACChecking onContinue={advanceJourney} />
        </div>

        <div className="space-y-4">
          <CardBlock title="Readiness">
            <ul className="space-y-2">
              {readiness.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between gap-3 py-2"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span style={{ fontSize: "0.875rem" }}>{r.label}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color:
                        r.state === "ok"
                          ? "var(--chart-2)"
                          : r.state === "watch"
                          ? "var(--chart-3)"
                          : "var(--chart-4)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {r.note}
                  </span>
                </li>
              ))}
            </ul>
          </CardBlock>
          <InternalOnly title="Sample plan trace">
            ChemAssist composed a multi-grade plan; PAC ran sample-eligibility +
            shipping + customer permissions; Supply Chain Spine attached watch
            label to ENGAGE 8180 with alternate hint to ENGAGE 8003.
          </InternalOnly>
        </div>
      </div>
    </JourneyShell>
  );
}

function PACChecking({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="p-5"
      style={{
        backgroundColor: "color-mix(in oklab, var(--primary) 5%, var(--card))",
        border: "1px solid color-mix(in oklab, var(--primary) 28%, var(--border))",
        borderRadius: 2,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={14} style={{ color: "var(--primary)" }} />
        <span style={{ fontWeight: "var(--font-weight-medium)", fontSize: "0.875rem" }}>
          ChemAssist is checking
        </span>
      </div>
      <ul
        className="space-y-1.5 mb-4"
        style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
      >
        <li>Sample eligibility</li>
        <li>Shipping rules · EU</li>
        <li>Customer permissions</li>
        <li>Documentation requirements</li>
      </ul>
      <div
        className="p-3 mb-4"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          fontSize: "0.875rem",
        }}
      >
        <strong style={{ color: "var(--chart-2)" }}>Result:</strong> Your sample
        request can proceed. One item has a supply watch condition, but an
        alternate grade is available.
      </div>
      <div className="flex justify-end">
        <PrimaryCTA onClick={onContinue} icon={<ChevronRight size={14} />}>
          Continue
        </PrimaryCTA>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 6 — Progressive account step
// ─────────────────────────────────────────────────────────────────────────────

export function ScreenAccount() {
  const { advanceJourney } = useApp();
  return (
    <JourneyShell
      eyebrow="Step 6 of 8 · Account"
      title="Save and submit your sample plan"
      subtitle="We need a verified business email and shipping region to submit this request. This lets Dow apply the correct product, compliance, and sample policies."
    >
      <div className="grid gap-6" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <CardBlock>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button
              className="inline-flex items-center gap-2 h-10 px-4"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Continue with business email
            </button>
            <button
              className="inline-flex items-center gap-2 h-10 px-4"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Sign in
            </button>
            <button
              className="inline-flex items-center gap-2 h-10 px-4"
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.75rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Continue as guest (limited status visibility)
            </button>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Input label="Business email *" v="lars.k@lumeraauto.eu" />
            <Input label="Company *" v="Lumera Auto Interiors" />
            <Input label="Country *" v="Germany" />
            <Input label="Role" v="Materials Engineer" />
            <div style={{ gridColumn: "1 / -1" }}>
              <Input
                label="Application purpose"
                v="Cold-weather TPO dashboard evaluation for VW MQB platform"
              />
            </div>
          </div>

          <div
            className="mt-5 p-3"
            style={{
              backgroundColor: "var(--secondary)",
              borderRadius: 2,
              fontSize: "0.8125rem",
              color: "var(--muted-foreground)",
              lineHeight: 1.5,
            }}
          >
            Account details are used to verify sample eligibility, route expert
            support, and apply regional documentation rules. Dow never shows
            other customers your account-specific data.
          </div>

          <div className="flex justify-end mt-6">
            <PrimaryCTA onClick={advanceJourney} icon={<ChevronRight size={14} />}>
              Save & continue
            </PrimaryCTA>
          </div>
        </CardBlock>

        <CardBlock title="What unlocks after sign-in">
          <ul className="space-y-3" style={{ fontSize: "0.875rem" }}>
            {[
              { i: <ShieldCheck size={14} />, t: "Account-specific availability and routing" },
              { i: <Beaker size={14} />, t: "Live sample status with Dow planning ETA" },
              { i: <MapPin size={14} />, t: "Region-specific regulatory documents" },
              { i: <FileText size={14} />, t: "Your past qualifications and saved plans" },
              { i: <AlertCircle size={14} />, t: "Proactive supply-aware updates on your active grades" },
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-3">
                <span style={{ color: "var(--primary)", marginTop: 2 }}>{x.i}</span>
                <span>{x.t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <PacChip decision="human">Authenticated · L2 capabilities</PacChip>
            <PacChip decision="denied">Internal pricing remains hidden</PacChip>
          </div>
        </CardBlock>
      </div>
    </JourneyShell>
  );
}

function Input({ label, v }: { label: string; v: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{label}</span>
      <input
        defaultValue={v}
        className="h-10 px-3 outline-none"
        style={{
          border: "1px solid #d0d3d6",
          borderRadius: 2,
          fontSize: "0.875rem",
          backgroundColor: "var(--input-background)",
        }}
      />
    </label>
  );
}

export const __unused = ArrowRight;
