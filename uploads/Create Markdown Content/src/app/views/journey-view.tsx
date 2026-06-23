import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Pill, SectionTitle } from "../components/primitives";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const SELF_SERVE = [
  { week: "W1", rate: 38 },
  { week: "W2", rate: 41 },
  { week: "W3", rate: 47 },
  { week: "W4", rate: 52 },
  { week: "W5", rate: 56 },
  { week: "W6", rate: 61 },
  { week: "W7", rate: 64 },
  { week: "W8", rate: 68 },
];

const TIME_TO_ACTION = [
  { week: "W1", detect: 38, recommend: 96, approve: 220 },
  { week: "W2", detect: 28, recommend: 72, approve: 180 },
  { week: "W3", detect: 19, recommend: 54, approve: 145 },
  { week: "W4", detect: 12, recommend: 41, approve: 110 },
  { week: "W5", detect: 9, recommend: 32, approve: 92 },
  { week: "W6", detect: 7, recommend: 26, approve: 78 },
];

export function JourneyView() {
  return (
    <div className="px-8 py-8 max-w-[1320px] mx-auto">
      <SectionTitle
        eyebrow="Governance"
        title="Journey Dashboard"
        subtitle="CX, operations, and governance health for the sample-to-ship pilot."
        action={<Pill tone="info">EU Elastomers · Pilot week 8</Pill>}
      />

      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <KpiTile label="Self-service resolution" value="68%" delta="+11 pts" good />
        <KpiTile label="Sample → opportunity" value="34%" delta="+6 pts" good />
        <KpiTile label="Time to approved action" value="78 min" delta="−64%" good />
        <KpiTile label="Planner override rate" value="9.2%" delta="−2.1 pts" good />
        <KpiTile label="Citation coverage" value="99.4%" delta="+0.6 pts" good />
        <KpiTile label="Policy deny rate" value="3.1%" delta="+0.4 pts" warn />
        <KpiTile label="Audit completeness" value="100%" delta="—" good />
        <KpiTile label="Unauthorized actions" value="0" delta="—" good />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <Card>
          <SectionTitle
            title="Time to action"
            subtitle="Median minutes — detect → recommend → approve"
          />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={TIME_TO_ACTION}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Area dataKey="detect" stroke="var(--chart-1)" fill="url(#g1)" />
                <Area dataKey="recommend" stroke="var(--chart-3)" fill="url(#g2)" />
                <Area dataKey="approve" stroke="var(--chart-2)" fill="url(#g3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle
            title="Self-service rate"
            subtitle="ChemAssist answers without human escalation"
          />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={SELF_SERVE}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Bar dataKey="rate" fill="var(--chart-2)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <SectionTitle title="Learning loop" subtitle="What the platform turned into new operating capacity this week." />
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            {
              signal: "Planner overrides on lane DE-IT-3",
              change: "Policy PROD.HAZMAT.006 tightened with new packaging class",
              owner: "Compliance",
            },
            {
              signal: "ChemAssist low-confidence on -50 °C use cases",
              change: "New knowledge article QA-LT-50 · validated by Tech Service",
              owner: "Content owner",
            },
            {
              signal: "Repeat seller workaround for sample status lookup",
              change: "New reusable skill: sample.status.by_account()",
              owner: "Platform owner",
            },
          ].map((l) => (
            <div
              key={l.signal}
              className="p-4 border"
              style={{
                borderColor: "var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--muted-foreground)",
                }}
              >
                Signal
              </div>
              <div style={{ fontSize: "0.875rem", marginTop: 2 }}>{l.signal}</div>
              <div
                style={{
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--muted-foreground)",
                  marginTop: 12,
                }}
              >
                Resulting change
              </div>
              <div style={{ fontSize: "0.875rem", marginTop: 2 }}>{l.change}</div>
              <div className="mt-3">
                <Pill tone="info">{l.owner}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  good,
  warn,
}: {
  label: string;
  value: string;
  delta: string;
  good?: boolean;
  warn?: boolean;
}) {
  const tone = warn ? "var(--chart-4)" : good ? "var(--chart-2)" : "var(--muted-foreground)";
  return (
    <div
      className="p-4 border"
      style={{
        borderColor: "var(--border)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--card)",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: "1.5rem",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--foreground)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        className="mt-2 inline-flex items-center gap-1"
        style={{
          fontSize: "0.75rem",
          color: tone,
        }}
      >
        {good ? <ArrowUpRight size={12} /> : warn ? <ArrowDownRight size={12} /> : null}
        {delta}
      </div>
    </div>
  );
}
