import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`border ${padded ? "p-5" : ""} ${className}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        borderRadius: "var(--radius-lg)",
        color: "var(--card-foreground)",
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        {eyebrow && (
          <div
            className="uppercase mb-1"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              color: "var(--muted-foreground)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2 style={{ color: "var(--foreground)", lineHeight: 1.2 }}>{title}</h2>
        {subtitle && (
          <p
            className="mt-1"
            style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Pill({
  children,
  tone = "info",
  icon,
}: {
  children: ReactNode;
  tone?: "info" | "allowed" | "denied" | "routed" | "pending" | "neutral";
  icon?: ReactNode;
}) {
  const map = {
    info: { bg: "var(--secondary)", fg: "var(--secondary-foreground)", dot: "var(--primary)" },
    allowed: {
      bg: "color-mix(in oklab, var(--chart-2) 18%, var(--background))",
      fg: "var(--foreground)",
      dot: "var(--chart-2)",
    },
    denied: {
      bg: "color-mix(in oklab, var(--destructive) 16%, var(--background))",
      fg: "var(--destructive)",
      dot: "var(--destructive)",
    },
    routed: {
      bg: "color-mix(in oklab, var(--chart-4) 22%, var(--background))",
      fg: "var(--foreground)",
      dot: "var(--chart-4)",
    },
    pending: {
      bg: "color-mix(in oklab, var(--chart-3) 18%, var(--background))",
      fg: "var(--foreground)",
      dot: "var(--chart-3)",
    },
    neutral: { bg: "var(--muted)", fg: "var(--muted-foreground)", dot: "var(--muted-foreground)" },
  }[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1"
      style={{
        backgroundColor: map.bg,
        color: map.fg,
        borderRadius: "var(--radius-sm)",
        fontSize: "0.75rem",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: 1.2,
      }}
    >
      {icon ? (
        icon
      ) : (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: 999,
            backgroundColor: map.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  icon,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md";
  disabled?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "1px solid var(--primary)",
    },
    secondary: {
      backgroundColor: "var(--secondary)",
      color: "var(--secondary-foreground)",
      border: "1px solid var(--border)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--foreground)",
      border: "1px solid transparent",
    },
    destructive: {
      backgroundColor: "var(--destructive)",
      color: "var(--destructive-foreground)",
      border: "1px solid var(--destructive)",
    },
  };
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 10px", fontSize: "0.8125rem" },
    md: { padding: "9px 14px", fontSize: "0.875rem" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 transition-opacity disabled:opacity-50 hover:opacity-90"
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: "var(--radius-md)",
        fontWeight: "var(--font-weight-medium)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function KeyValue({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "0.6875rem",
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "var(--foreground)",
          fontSize: "0.875rem",
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function Divider({ label }: { label?: string }) {
  if (!label)
    return (
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border)",
          margin: "16px 0",
        }}
      />
    );
  return (
    <div className="flex items-center gap-3 my-4">
      <div style={{ height: 1, flex: 1, backgroundColor: "var(--border)" }} />
      <span
        style={{
          fontSize: "0.6875rem",
          color: "var(--muted-foreground)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <div style={{ height: 1, flex: 1, backgroundColor: "var(--border)" }} />
    </div>
  );
}
