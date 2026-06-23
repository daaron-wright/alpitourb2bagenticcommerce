import { ReactNode } from "react";
import {
  MessageSquare,
  Gauge,
  AlertTriangle,
  FlaskConical,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  Search,
  Bell,
} from "lucide-react";
import { RouteKey, useApp } from "../lib/store";
import { Pill } from "./primitives";
import { ExternalLink } from "lucide-react";

function SwitchToCustomer() {
  const setExperience = useApp((s) => s.setExperience);
  return (
    <button
      onClick={() => setExperience("customer")}
      className="inline-flex items-center gap-2 px-3 py-2"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        fontSize: "0.8125rem",
        color: "var(--foreground)",
        backgroundColor: "var(--card)",
      }}
    >
      <ExternalLink size={12} />
      View customer portal
    </button>
  );
}

const NAV: {
  group: string;
  items: { key: RouteKey; label: string; icon: ReactNode; sub: string }[];
}[] = [
  {
    group: "Customer surface",
    items: [
      {
        key: "chemassist",
        label: "ChemAssist",
        icon: <MessageSquare size={16} />,
        sub: "Intent · sample · commitment",
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        key: "planner",
        label: "Planner Control Tower",
        icon: <Gauge size={16} />,
        sub: "Events · agent runs · writes",
      },
      {
        key: "exceptions",
        label: "Exceptions",
        icon: <AlertTriangle size={16} />,
        sub: "Routed cases & approvals",
      },
    ],
  },
  {
    group: "Governance",
    items: [
      {
        key: "policy",
        label: "Policy Console",
        icon: <ShieldCheck size={16} />,
        sub: "PAC bundles & decision log",
      },
      {
        key: "backtest",
        label: "Backtest Lab",
        icon: <FlaskConical size={16} />,
        sub: "Replay & gate criteria",
      },
      {
        key: "journey",
        label: "Journey Dashboard",
        icon: <LayoutDashboard size={16} />,
        sub: "KPIs & learning loop",
      },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { route, setRoute, scenarioStep } = useApp();
  return (
    <div
      className="min-h-screen w-full grid"
      style={{
        gridTemplateColumns: "260px 1fr",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Sidebar route={route} setRoute={setRoute} />
      <div className="flex flex-col min-w-0">
        <TopBar scenarioActive={scenarioStep !== "idle"} />
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({
  route,
  setRoute,
}: {
  route: RouteKey;
  setRoute: (r: RouteKey) => void;
}) {
  return (
    <aside
      className="border-r flex flex-col"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--sidebar)",
        color: "var(--sidebar-foreground)",
      }}
    >
      <div
        className="px-5 py-5 border-b flex items-center gap-3"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 34,
            height: 34,
            backgroundColor: "var(--sidebar-primary)",
            color: "var(--sidebar-primary-foreground)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Activity size={18} />
        </div>
        <div className="leading-tight">
          <div style={{ fontWeight: "var(--font-weight-medium)" }}>
            Dow Spine
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
            }}
          >
            Agentic Orchestration
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map((g) => (
          <div key={g.group} className="mb-4">
            <div
              className="px-5 mb-2"
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {g.group}
            </div>
            {g.items.map((it) => {
              const active = route === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => setRoute(it.key)}
                  className="w-full text-left flex items-start gap-3 px-5 py-2.5 transition-colors"
                  style={{
                    backgroundColor: active
                      ? "var(--sidebar-accent)"
                      : "transparent",
                    color: active
                      ? "var(--sidebar-accent-foreground)"
                      : "var(--sidebar-foreground)",
                    borderLeft: `2px solid ${
                      active ? "var(--sidebar-primary)" : "transparent"
                    }`,
                  }}
                >
                  <span style={{ marginTop: 2, color: active ? "var(--sidebar-primary)" : "var(--muted-foreground)" }}>
                    {it.icon}
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "var(--font-weight-medium)",
                        lineHeight: 1.2,
                      }}
                    >
                      {it.label}
                    </span>
                    <span
                      className="block"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted-foreground)",
                        marginTop: 2,
                      }}
                    >
                      {it.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        className="border-t px-5 py-4 flex items-center gap-3"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            backgroundColor: "var(--accent)",
            color: "var(--accent-foreground)",
            borderRadius: 999,
            fontSize: "0.75rem",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          MK
        </div>
        <div className="min-w-0 leading-tight">
          <div style={{ fontSize: "0.8125rem" }}>Maya Krishnan</div>
          <div
            style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}
          >
            Planner · EU Elastomers
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ scenarioActive }: { scenarioActive: boolean }) {
  return (
    <div
      className="border-b px-8 py-3 flex items-center justify-between gap-6 sticky top-0 z-20"
      style={{
        borderColor: "var(--border)",
        backgroundColor:
          "color-mix(in oklab, var(--background) 88%, transparent)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="flex items-center gap-3 px-3 py-2 max-w-md w-full"
          style={{
            backgroundColor: "var(--input-background)",
            borderRadius: "var(--radius-md)",
            color: "var(--muted-foreground)",
            fontSize: "0.8125rem",
          }}
        >
          <Search size={14} />
          <span>Search SKUs, accounts, events, or policy rules…</span>
        </div>
        <SwitchToCustomer />
      </div>

      <div className="flex items-center gap-3">
        {scenarioActive && (
          <Pill tone="pending">Naphtha scenario live</Pill>
        )}
        <Pill tone="allowed" icon={<ShieldCheck size={12} />}>
          PAC bundle v3.4 · signed
        </Pill>
        <button
          className="relative p-2"
          style={{ color: "var(--muted-foreground)" }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: 999,
              backgroundColor: "var(--destructive)",
            }}
          />
        </button>
      </div>
    </div>
  );
}
