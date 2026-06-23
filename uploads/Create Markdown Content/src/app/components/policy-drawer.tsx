import { X, ShieldCheck, FileText, User2 } from "lucide-react";
import { Button, KeyValue, Pill } from "./primitives";
import { useApp } from "../lib/store";

export function PolicyDrawer() {
  const { drawerOpen, closeDrawer } = useApp();
  if (!drawerOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 30%, transparent)" }}
      onClick={closeDrawer}
    >
      <div className="flex-1" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="h-full overflow-y-auto"
        style={{
          width: 480,
          backgroundColor: "var(--card)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between sticky top-0"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: "var(--font-weight-medium)" }}>
              Policy evidence
            </span>
          </div>
          <button
            onClick={closeDrawer}
            style={{ color: "var(--muted-foreground)" }}
            aria-label="Close drawer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className="p-4"
            style={{
              backgroundColor: "var(--secondary)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              Decision
            </div>
            <div
              className="flex items-center gap-2 mt-1"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              <span>dec_18f7c1</span>
              <Pill tone="routed">Route to GTM owner</Pill>
            </div>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <KeyValue label="Rule" value="CX.PROMISE.003" mono />
            <KeyValue label="Bundle revision" value="3.4.1" mono />
            <KeyValue label="Policy family" value="Customer" />
            <KeyValue label="Evaluated at" value="2026-06-01 09:43:18" />
          </div>

          <div>
            <SectionLabel>Input</SectionLabel>
            <pre
              className="p-3 overflow-x-auto"
              style={{
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.75rem",
                color: "var(--foreground)",
                fontFamily: "ui-monospace, monospace",
              }}
            >{`{
  "account": "lumera_auto_interiors",
  "sku": "ENGAGE_8842",
  "eta_delta_days": 4,
  "channel": "customer_visible",
  "trace_id": "trc_8842_2026-06-01_eu"
}`}</pre>
          </div>

          <div>
            <SectionLabel>Source policy</SectionLabel>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
              Commercial Charter v1 · §3.2 — customer-facing ETA revisions
              greater than 3 days require a Go-to-Market owner sign-off before
              the customer surface is updated. A disclaimer must be attached if
              the substitution suggestion uses typical-data rather than
              specification.
            </p>
          </div>

          <div>
            <SectionLabel>Next owner</SectionLabel>
            <div
              className="flex items-center gap-3 p-3 border"
              style={{
                borderColor: "var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                }}
              >
                <User2 size={14} />
              </div>
              <div className="leading-tight">
                <div style={{ fontSize: "0.875rem" }}>Jules Park</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                  GTM owner · EU Elastomers
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Evidence chain</SectionLabel>
            <ul className="space-y-2">
              {[
                "evt_naph_eu_q2 · market signal (CloudEvents)",
                "Cost agent run · ar_5519 · margin recompute",
                "Inventory agent run · ar_5520 · sourcing recommendation",
                "SAP write preview · STO-EU-9912 · SO-LUMERA-44219",
              ].map((e) => (
                <li
                  key={e}
                  className="flex items-center gap-2 p-2 border"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <FileText size={12} /> {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button>Approve commitment</Button>
            <Button variant="secondary" onClick={closeDrawer}>
              Close
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-2"
      style={{
        fontSize: "0.6875rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--muted-foreground)",
        fontWeight: "var(--font-weight-medium)",
      }}
    >
      {children}
    </div>
  );
}
