import { Building2, Mail, Phone, MessageSquare, ShieldCheck, Users, MapPin } from "lucide-react";
import { Button, Card, KeyValue, Pill, SectionTitle } from "../../components/primitives";

const TEAM = [
  { name: "Claire Roussel", role: "Technical Service · Auto Interiors", region: "Lyon, FR", focus: "ENGAGE · INFUSE" },
  { name: "Jules Park", role: "Account Manager", region: "Munich, DE", focus: "Commercial · GTM" },
  { name: "Sofia Nair", role: "Regulatory Specialist", region: "Madrid, ES", focus: "REACH · CLP" },
];

const QUALIFICATIONS = [
  { id: "QF-2023-118", grade: "ENGAGE 8842", program: "VW MQB platform · dashboard", state: "Approved for production", year: "2024" },
  { id: "QF-2024-204", grade: "ENGAGE 7467", program: "Tier-1 wire jacketing", state: "Approved for production", year: "2025" },
  { id: "QF-2026-018", grade: "INFUSE 9100", program: "Console armrest overmold", state: "In qualification", year: "2026" },
];

export function AccountView() {
  return (
    <div className="max-w-[1320px] mx-auto px-8 py-10">
      <SectionTitle
        eyebrow="Account"
        title="Lumera Auto Interiors"
        subtitle="Manage your Dow relationship, qualifications, and trusted contacts."
        action={
          <div className="flex items-center gap-2">
            <Pill tone="allowed" icon={<ShieldCheck size={12} />}>Verified tier-1 customer</Pill>
          </div>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                LA
              </div>
              <div>
                <div style={{ fontWeight: "var(--font-weight-medium)" }}>Lumera Auto Interiors</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
                  Account · ACC-EU-00219
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <KeyValue label="Headquarters" value={<><MapPin size={11} style={{ display: "inline", marginRight: 4 }} /> Toulouse, France</>} />
              <KeyValue label="Region" value="Europe" />
              <KeyValue label="Industry" value="Automotive · Interior trim" />
              <KeyValue label="Account tier" value="Strategic" />
              <KeyValue label="Active programs" value="4 · across 3 OEMs" />
            </div>
          </Card>

          <Card>
            <SectionTitle title="Get in touch" />
            <div className="space-y-2">
              <ContactRow icon={<Mail size={14} />} label="account-eu@dow.com" />
              <ContactRow icon={<Phone size={14} />} label="+33 1 87 21 44 00" />
              <ContactRow icon={<MessageSquare size={14} />} label="Open a technical case" highlight />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionTitle
              title="Your Dow team"
              subtitle="Routed automatically based on your active applications and region."
              action={<Pill tone="info" icon={<Users size={12} />}>3 active</Pill>}
            />
            <div className="space-y-3">
              {TEAM.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-4 p-4 border"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 999,
                      backgroundColor: "var(--secondary)",
                      color: "var(--secondary-foreground)",
                      fontSize: "0.875rem",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: "var(--font-weight-medium)" }}>{t.name}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
                      {t.role}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: 2 }}>
                      {t.region} · {t.focus}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" icon={<Mail size={12} />}>Email</Button>
                    <Button size="sm" icon={<MessageSquare size={12} />}>Message</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Qualifications" subtitle="Programs and grade approvals tracked against your account." />
            <div className="space-y-2">
              {QUALIFICATIONS.map((q) => (
                <div
                  key={q.id}
                  className="grid items-center gap-3 p-3 border"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-md)",
                    gridTemplateColumns: "100px 1fr 1.4fr auto",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {q.id}
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "var(--font-weight-medium)" }}>
                    {q.grade}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
                    {q.program}
                  </span>
                  <Pill tone={q.state.startsWith("Approved") ? "allowed" : "pending"}>{q.state}</Pill>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Data & privacy" subtitle="What Dow stores about your account and how it's used." />
            <ul className="space-y-2" style={{ fontSize: "0.875rem" }}>
              {[
                ["Region", "Data processed in EU · GDPR-aligned"],
                ["Sensitive fields", "Pricing and program names masked in logs"],
                ["Retention", "Audit records kept for 365 days"],
                ["Access", "Only your team and your routed Dow contacts"],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between p-3 border"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <span style={{ color: "var(--muted-foreground)" }}>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 border"
      style={{
        borderColor: "var(--border)",
        borderRadius: "var(--radius-md)",
        backgroundColor: highlight ? "var(--secondary)" : "transparent",
        cursor: "pointer",
      }}
    >
      <span style={{ color: highlight ? "var(--primary)" : "var(--muted-foreground)" }}>
        {icon}
      </span>
      <span style={{ fontSize: "0.875rem" }}>{label}</span>
    </div>
  );
}
