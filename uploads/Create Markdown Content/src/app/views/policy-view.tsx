import { useState } from "react";
import { ShieldCheck, FileText, GitBranch, History } from "lucide-react";
import { Button, Card, KeyValue, Pill, SectionTitle } from "../components/primitives";

const RULES = [
  {
    id: "FIN.WC.001",
    family: "Finance",
    summary: "Working-capital ceiling per planning region",
    source: "Finance Guardrails v3 · §2.1",
    coverage: "100%",
  },
  {
    id: "TRADE.EU.014",
    family: "Trade",
    summary: "EU dual-use & export controls",
    source: "EU Trade Manual v5 · §4",
    coverage: "100%",
  },
  {
    id: "PROD.HAZMAT.006",
    family: "Product",
    summary: "Hazmat lane and packaging eligibility",
    source: "Product Shipping Rules v2 · §6",
    coverage: "100%",
  },
  {
    id: "CX.PROMISE.003",
    family: "Customer",
    summary: "Customer-facing ETA / claim revision authority",
    source: "Commercial Charter v1 · §3.2",
    coverage: "98%",
  },
  {
    id: "TECH.SUB.011",
    family: "Technical",
    summary: "Substitution recommendation requires tech sign-off above MI Δ",
    source: "Technical Service SOP · §11",
    coverage: "92%",
  },
];

const DECISIONS = [
  {
    id: "dec_18f7c1",
    rule: "CX.PROMISE.003",
    result: "Route to GTM owner",
    input: "ETA delta = +4d · account = Lumera Auto",
    actor: "Inventory agent",
    time: "09:43:18",
  },
  {
    id: "dec_18f7b9",
    rule: "FIN.WC.001",
    result: "Allow",
    input: "Working-capital impact = €2.1M (ceiling €5M)",
    actor: "Cost agent",
    time: "09:42:51",
  },
  {
    id: "dec_18f7a4",
    rule: "PROD.HAZMAT.006",
    result: "Deny",
    input: "Lane DE-IT-3 · packaging class III",
    actor: "Inventory agent",
    time: "09:14:02",
  },
];

export function PolicyView() {
  const [tab, setTab] = useState<"bundles" | "log">("bundles");
  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <SectionTitle
        eyebrow="Governance"
        title="Policy Console"
        subtitle="PAC bundles are signed, tested, and versioned before they touch runtime."
        action={
          <div className="flex gap-2 items-center">
            <Pill tone="allowed" icon={<ShieldCheck size={12} />}>
              Bundle v3.4 · signed
            </Pill>
            <Button variant="secondary" icon={<GitBranch size={14} />}>
              Promote draft v3.5
            </Button>
          </div>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div>
          <Tabs tab={tab} onChange={setTab} />
          {tab === "bundles" ? <BundleTable /> : <DecisionLog />}
        </div>
        <aside className="space-y-6">
          <Card>
            <SectionTitle title="Bundle health" />
            <div className="space-y-3">
              <KeyValue label="Rules in production" value="68" />
              <KeyValue label="Last build" value="2026-05-30 · CI green" />
              <KeyValue label="Policy tests passing" value="217 / 217" />
              <KeyValue label="Signature" value="ed25519 · verified" mono />
              <KeyValue label="Decision log retention" value="365 days" />
            </div>
          </Card>
          <Card>
            <SectionTitle title="Promotion pipeline" />
            <ol className="space-y-2" style={{ fontSize: "0.8125rem" }}>
              {[
                ["Draft authored", "Compliance"],
                ["opa test (217 cases)", "CI"],
                ["Shadow mode 24h", "Digital Ops"],
                ["Domain sign-off", "Finance · Legal"],
                ["Signed bundle release", "Platform owner"],
              ].map(([s, who], i) => (
                <li
                  key={s}
                  className="flex items-center justify-between gap-2 p-2 border"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <span>
                    <span style={{ color: "var(--muted-foreground)", marginRight: 6 }}>
                      {i + 1}.
                    </span>
                    {s}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {who}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Tabs({
  tab,
  onChange,
}: {
  tab: "bundles" | "log";
  onChange: (t: "bundles" | "log") => void;
}) {
  const opts = [
    { key: "bundles", label: "Rule bundles", icon: <FileText size={14} /> },
    { key: "log", label: "Decision log", icon: <History size={14} /> },
  ] as const;
  return (
    <div className="flex gap-1 mb-4 p-1 inline-flex" style={{ backgroundColor: "var(--muted)", borderRadius: "var(--radius-md)" }}>
      {opts.map((o) => {
        const active = tab === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className="flex items-center gap-2 px-3 py-1.5"
            style={{
              backgroundColor: active ? "var(--card)" : "transparent",
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            {o.icon} {o.label}
          </button>
        );
      })}
    </div>
  );
}

function BundleTable() {
  return (
    <Card padded={false}>
      <table className="w-full">
        <thead>
          <tr
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Th>Rule</Th>
            <Th>Family</Th>
            <Th>Summary</Th>
            <Th>Source</Th>
            <Th>Tests</Th>
          </tr>
        </thead>
        <tbody>
          {RULES.map((r) => (
            <tr
              key={r.id}
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <Td mono>{r.id}</Td>
              <Td>
                <Pill tone="info">{r.family}</Pill>
              </Td>
              <Td>{r.summary}</Td>
              <Td muted>{r.source}</Td>
              <Td>
                <Pill tone={r.coverage === "100%" ? "allowed" : "pending"}>
                  {r.coverage}
                </Pill>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function DecisionLog() {
  return (
    <Card padded={false}>
      <table className="w-full">
        <thead>
          <tr
            style={{
              backgroundColor: "var(--secondary)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Th>Decision ID</Th>
            <Th>Rule</Th>
            <Th>Result</Th>
            <Th>Input</Th>
            <Th>Actor</Th>
            <Th>Time</Th>
          </tr>
        </thead>
        <tbody>
          {DECISIONS.map((d) => (
            <tr key={d.id} style={{ borderTop: "1px solid var(--border)" }}>
              <Td mono>{d.id}</Td>
              <Td mono>{d.rule}</Td>
              <Td>
                <Pill
                  tone={
                    d.result === "Allow"
                      ? "allowed"
                      : d.result === "Deny"
                        ? "denied"
                        : "routed"
                  }
                >
                  {d.result}
                </Pill>
              </Td>
              <Td muted>{d.input}</Td>
              <Td>{d.actor}</Td>
              <Td mono>{d.time}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3"
      style={{
        fontWeight: "var(--font-weight-medium)",
        fontSize: "0.75rem",
      }}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  mono,
  muted,
}: {
  children: React.ReactNode;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className="px-4 py-3 align-top"
      style={{
        fontSize: "0.8125rem",
        color: muted ? "var(--muted-foreground)" : "var(--foreground)",
        fontFamily: mono
          ? "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          : undefined,
      }}
    >
      {children}
    </td>
  );
}
