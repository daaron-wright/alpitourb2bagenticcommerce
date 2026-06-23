import { AlertTriangle, ArrowRight, MessageSquare, ShieldOff } from "lucide-react";
import { Button, Card, KeyValue, Pill, SectionTitle } from "../components/primitives";

const CASES = [
  {
    id: "exc_2026_06_01_lumera",
    title: "Customer-facing ETA shift > 3 days",
    account: "Lumera Auto Interiors",
    sku: "ENGAGE 8842",
    rule: "CX.PROMISE.003",
    owner: "GTM owner · J. Park",
    age: "12 min",
    severity: "routed",
    recommendation:
      "Approve revised ETA (18d) and surface alternative ENGAGE 8200 to customer with disclaimer.",
  },
  {
    id: "exc_2026_06_01_vectrim",
    title: "Substitution recommendation needs technical sign-off",
    account: "Vectrim Plastics",
    sku: "ENGAGE 8200 (sub for 8842)",
    rule: "TECH.SUB.011",
    owner: "Technical Service · C. Roussel",
    age: "18 min",
    severity: "routed",
    recommendation:
      "Confirm process compatibility (melt index 5.0 vs 1.0). Append validated guidance note.",
  },
  {
    id: "exc_2026_06_01_arval",
    title: "Hazmat lane constraint on proposed reroute",
    account: "Arval Composites",
    sku: "ENGAGE 7467",
    rule: "PROD.HAZMAT.006",
    owner: "Logistics · S. Nair",
    age: "35 min",
    severity: "denied",
    recommendation:
      "Denied: lane DE-IT-3 not approved for packaging class. Suggest lane DE-IT-7 (5 day delta).",
  },
  {
    id: "exc_2026_05_31_qcc",
    title: "Unsupported claim flagged in ChemAssist answer",
    account: "Northwind QC",
    sku: "ENGAGE 8480",
    rule: "ANSWER.UNSUPPORTED",
    owner: "Content owner · L. Hassan",
    age: "Yesterday",
    severity: "denied",
    recommendation:
      "Add disclaimer; route to Technical Service for validated low-temp performance statement.",
  },
];

export function ExceptionsView() {
  return (
    <div className="px-8 py-8 max-w-[1200px] mx-auto">
      <SectionTitle
        eyebrow="Operational platform"
        title="Exception workspace"
        subtitle="Cases routed by PAC or agent confidence. Each carries recommendation, evidence, and owner."
        action={
          <div className="flex gap-2">
            <Pill tone="routed">3 routed</Pill>
            <Pill tone="denied">1 denied</Pill>
          </div>
        }
      />

      <div className="space-y-4">
        {CASES.map((c) => (
          <Card key={c.id}>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "1fr 300px" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {c.severity === "denied" ? (
                    <ShieldOff size={14} style={{ color: "var(--destructive)" }} />
                  ) : (
                    <AlertTriangle size={14} style={{ color: "var(--chart-4)" }} />
                  )}
                  <Pill tone={c.severity === "denied" ? "denied" : "routed"}>
                    {c.severity === "denied" ? "Denied by PAC" : "Routed for approval"}
                  </Pill>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Open {c.age}
                  </span>
                </div>
                <h3 style={{ color: "var(--foreground)", marginTop: 4 }}>
                  {c.title}
                </h3>
                <div
                  className="mt-3 grid gap-4"
                  style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
                >
                  <KeyValue label="Account" value={c.account} />
                  <KeyValue label="SKU" value={c.sku} />
                  <KeyValue label="Rule" value={c.rule} mono />
                  <KeyValue label="Owner" value={c.owner} />
                </div>
                <div
                  className="mt-4 p-3 flex items-start gap-2"
                  style={{
                    backgroundColor: "var(--secondary)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <MessageSquare
                    size={14}
                    style={{ marginTop: 3, color: "var(--primary)" }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted-foreground)",
                        marginBottom: 2,
                      }}
                    >
                      Recommended action
                    </div>
                    <div style={{ fontSize: "0.875rem" }}>{c.recommendation}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Button>Approve recommendation</Button>
                <Button variant="secondary">Modify & rerun</Button>
                <Button variant="ghost" icon={<ArrowRight size={14} />}>
                  Open evidence
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
