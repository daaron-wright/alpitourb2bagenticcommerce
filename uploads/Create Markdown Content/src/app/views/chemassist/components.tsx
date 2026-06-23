import { ReactNode } from "react";
import {
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Activity,
  CircleDot,
  Check,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../lib/store";

// ─────────────────────────────────────────────────────────────────────────────
// ChemAssist Intent Bar
// ─────────────────────────────────────────────────────────────────────────────

export function ChemAssistBar({
  value,
  onChange,
  onSubmit,
  state = "empty",
  placeholder = "Describe what you're trying to make.",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  state?: "empty" | "typing" | "understanding" | "clarifying" | "ready" | "blocked";
  placeholder?: string;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-3 p-2"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          boxShadow:
            "0 12px 32px color-mix(in oklab, var(--foreground) 10%, transparent)",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: "color-mix(in oklab, var(--primary) 10%, var(--card))",
            color: "var(--primary)",
          }}
        >
          <Sparkles size={16} />
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none"
          style={{
            fontSize: "0.9375rem",
            backgroundColor: "transparent",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) onSubmit();
          }}
        />
        <button
          onClick={onSubmit}
          className="h-10 px-5 inline-flex items-center gap-1"
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
          Ask ChemAssist <ChevronRight size={13} />
        </button>
      </div>
      <ChemAssistState state={state} />
    </div>
  );
}

function ChemAssistState({ state }: { state: string }) {
  const map: Record<string, { label: string; tone: string }> = {
    empty: { label: "Ready", tone: "var(--muted-foreground)" },
    typing: { label: "Listening", tone: "var(--muted-foreground)" },
    understanding: { label: "Understanding intent…", tone: "var(--primary)" },
    clarifying: { label: "Asking a quick clarification", tone: "var(--chart-3)" },
    ready: { label: "Recommendation ready", tone: "var(--chart-2)" },
    blocked: { label: "Policy review required", tone: "var(--destructive)" },
  };
  const s = map[state] ?? map.empty;
  return (
    <div
      className="mt-2 inline-flex items-center gap-1.5"
      style={{ fontSize: "0.75rem", color: s.tone }}
    >
      <CircleDot size={11} /> {s.label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAC decision chip
// ─────────────────────────────────────────────────────────────────────────────

type PacDecision =
  | "allowed"
  | "redacted"
  | "human"
  | "denied"
  | "simulation"
  | "customerSafe";

export function PacChip({
  decision,
  children,
}: {
  decision: PacDecision;
  children: ReactNode;
}) {
  const style: Record<PacDecision, { bg: string; fg: string; bd: string }> = {
    allowed: {
      bg: "color-mix(in oklab, var(--chart-2) 14%, var(--card))",
      fg: "var(--chart-2)",
      bd: "color-mix(in oklab, var(--chart-2) 35%, var(--border))",
    },
    redacted: {
      bg: "color-mix(in oklab, var(--chart-4) 14%, var(--card))",
      fg: "var(--chart-4)",
      bd: "color-mix(in oklab, var(--chart-4) 35%, var(--border))",
    },
    human: {
      bg: "color-mix(in oklab, var(--chart-3) 14%, var(--card))",
      fg: "var(--chart-3)",
      bd: "color-mix(in oklab, var(--chart-3) 35%, var(--border))",
    },
    denied: {
      bg: "color-mix(in oklab, var(--destructive) 12%, var(--card))",
      fg: "var(--destructive)",
      bd: "color-mix(in oklab, var(--destructive) 35%, var(--border))",
    },
    simulation: {
      bg: "var(--secondary)",
      fg: "var(--muted-foreground)",
      bd: "var(--border)",
    },
    customerSafe: {
      bg: "color-mix(in oklab, var(--primary) 8%, var(--card))",
      fg: "var(--primary)",
      bd: "color-mix(in oklab, var(--primary) 28%, var(--border))",
    },
  };
  const s = style[decision];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        borderRadius: 2,
        fontSize: "0.6875rem",
        fontWeight: "var(--font-weight-medium)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <ShieldCheck size={10} />
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Supply confidence badge
// ─────────────────────────────────────────────────────────────────────────────

export type SupplyTone = "strong" | "watch" | "alternate" | "expert" | "blocked";

export function SupplyBadge({ tone, label }: { tone: SupplyTone; label?: string }) {
  const map: Record<SupplyTone, { label: string; bg: string; fg: string }> = {
    strong: {
      label: label ?? "Strong availability",
      bg: "color-mix(in oklab, var(--chart-2) 14%, var(--card))",
      fg: "var(--chart-2)",
    },
    watch: {
      label: label ?? "Watch condition",
      bg: "color-mix(in oklab, var(--chart-3) 16%, var(--card))",
      fg: "var(--chart-3)",
    },
    alternate: {
      label: label ?? "Alternate available",
      bg: "color-mix(in oklab, var(--primary) 8%, var(--card))",
      fg: "var(--primary)",
    },
    expert: {
      label: label ?? "Expert review suggested",
      bg: "color-mix(in oklab, var(--chart-4) 16%, var(--card))",
      fg: "var(--chart-4)",
    },
    blocked: {
      label: label ?? "Not available for this region",
      bg: "color-mix(in oklab, var(--destructive) 12%, var(--card))",
      fg: "var(--destructive)",
    },
  };
  const s = map[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        borderRadius: 2,
        fontSize: "0.6875rem",
        fontWeight: "var(--font-weight-medium)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <Activity size={10} /> {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal-only block — hidden unless presenter toggles internal view
// ─────────────────────────────────────────────────────────────────────────────

export function InternalOnly({ title, children }: { title: string; children: ReactNode }) {
  const { showInternal } = useApp();
  if (!showInternal) return null;
  return (
    <div
      className="mt-4 p-4"
      style={{
        border: "1px dashed color-mix(in oklab, var(--chart-4) 50%, var(--border))",
        backgroundColor: "color-mix(in oklab, var(--chart-4) 6%, var(--card))",
        borderRadius: 2,
      }}
    >
      <div
        className="flex items-center gap-2 mb-2"
        style={{ fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--chart-4)", fontWeight: "var(--font-weight-medium)" }}
      >
        <EyeOff size={11} /> Internal only · {title}
      </div>
      <div style={{ fontSize: "0.8125rem", color: "var(--foreground)" }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Living timeline event
// ─────────────────────────────────────────────────────────────────────────────

export type TimelineActor =
  | "Customer"
  | "ChemAssist"
  | "RegRadar"
  | "PAC"
  | "Supply Chain Spine"
  | "Planner"
  | "Technical Service";

export type TimelineEventData = {
  title: string;
  actor: TimelineActor;
  timestamp: string;
  customerMessage: string;
  internalMessage?: string;
  status: "done" | "active" | "pending";
  evidence?: { label: string }[];
  next?: string;
};

export function TimelineEvent({ event, isLast }: { event: TimelineEventData; isLast?: boolean }) {
  const { showInternal } = useApp();
  const dotColor =
    event.status === "done"
      ? "var(--chart-2)"
      : event.status === "active"
      ? "var(--primary)"
      : "var(--muted-foreground)";
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center" style={{ width: 24 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            backgroundColor:
              event.status === "pending"
                ? "var(--card)"
                : "color-mix(in oklab, var(--chart-2) 14%, var(--card))",
            border: `1px solid ${dotColor}`,
            color: dotColor,
          }}
        >
          {event.status === "done" ? (
            <Check size={12} />
          ) : event.status === "active" ? (
            <CircleDot size={12} />
          ) : null}
        </div>
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: 1,
              minHeight: 24,
              backgroundColor: "var(--border)",
              marginTop: 4,
            }}
          />
        )}
      </div>
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontWeight: "var(--font-weight-medium)" }}>{event.title}</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {event.actor}
          </span>
          <span style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>
            · {event.timestamp}
          </span>
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: 4 }}>
          {event.customerMessage}
        </p>
        {event.evidence && event.evidence.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {event.evidence.map((e) => (
              <span
                key={e.label}
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--primary)",
                  border: "1px solid var(--border)",
                  borderRadius: 2,
                  padding: "2px 6px",
                }}
              >
                {e.label}
              </span>
            ))}
          </div>
        )}
        {showInternal && event.internalMessage && (
          <div
            className="mt-2 p-2"
            style={{
              fontSize: "0.75rem",
              color: "var(--chart-4)",
              border: "1px dashed color-mix(in oklab, var(--chart-4) 40%, var(--border))",
              borderRadius: 2,
              backgroundColor: "color-mix(in oklab, var(--chart-4) 5%, var(--card))",
            }}
          >
            <strong style={{ fontWeight: "var(--font-weight-medium)" }}>Internal:</strong>{" "}
            {event.internalMessage}
          </div>
        )}
        {event.next && (
          <div
            className="mt-2 inline-flex items-center gap-1"
            style={{ fontSize: "0.75rem", color: "var(--primary)" }}
          >
            Next: {event.next}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section block & helpers
// ─────────────────────────────────────────────────────────────────────────────

export function CardBlock({
  title,
  subtitle,
  action,
  children,
  pad = true,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  pad?: boolean;
}) {
  return (
    <section
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 2,
      }}
    >
      {(title || action) && (
        <header
          className="flex items-end justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            {title && <h3 style={{ fontSize: "1rem" }}>{title}</h3>}
            {subtitle && (
              <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginTop: 2 }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function PrimaryCTA({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-11 px-6"
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
      {children} {icon}
    </button>
  );
}

export function GhostCTA({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-11 px-6"
      style={{
        backgroundColor: "var(--card)",
        color: "var(--foreground)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        fontSize: "0.75rem",
        fontWeight: "var(--font-weight-medium)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children} {icon}
    </button>
  );
}

export function ToggleInternal() {
  const { showInternal, toggleInternal } = useApp();
  return (
    <button
      onClick={toggleInternal}
      className="inline-flex items-center gap-2 h-9 px-3"
      style={{
        border: `1px solid ${
          showInternal
            ? "color-mix(in oklab, var(--chart-4) 50%, var(--border))"
            : "var(--border)"
        }`,
        backgroundColor: showInternal
          ? "color-mix(in oklab, var(--chart-4) 10%, var(--card))"
          : "var(--card)",
        color: showInternal ? "var(--chart-4)" : "var(--muted-foreground)",
        borderRadius: 2,
        fontSize: "0.75rem",
        fontWeight: "var(--font-weight-medium)",
      }}
    >
      {showInternal ? <Eye size={13} /> : <EyeOff size={13} />}
      {showInternal ? "Internal view ON" : "Internal view"}
    </button>
  );
}

export function Warn({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-start gap-2 p-3"
      style={{
        backgroundColor: "color-mix(in oklab, var(--chart-3) 12%, var(--card))",
        border: "1px solid color-mix(in oklab, var(--chart-3) 35%, var(--border))",
        borderRadius: 2,
      }}
    >
      <AlertTriangle size={14} style={{ color: "var(--chart-3)", marginTop: 2 }} />
      <div style={{ fontSize: "0.8125rem" }}>{children}</div>
    </div>
  );
}
