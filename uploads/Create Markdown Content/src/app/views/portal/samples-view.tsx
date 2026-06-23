import { useState } from "react";
import { AlertCircle, Sparkles, Plus, Trash2, ChevronDown, Check } from "lucide-react";
import { useApp } from "../../lib/store";

type Step = 0 | 1 | 2;

const STEPS = ["Sample Cart", "Sample Request", "Sample Confirmation"];

const LINE_ITEMS = [
  {
    name: "ENGAGE™ 8842 Polyolefin Elastomer",
    code: "0000033467",
    market: "Automotive",
    submarket: "Interior trim",
    application: "TPO dashboard",
    qty: "1 kg",
  },
  {
    name: "ENGAGE™ 8180 Polyolefin Elastomer",
    code: "0000022104",
    market: "Consumer Goods and Appliances",
    submarket: "Footwear",
    application: "Midsole compounding",
    qty: "1 kg",
  },
];

export function SamplesView() {
  const [step, setStep] = useState<Step>(0);
  const { customerEtaDays, customerNote } = useApp();

  return (
    <div style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-[1320px] mx-auto px-8 py-10">
        <div className="flex items-end justify-between mb-2">
          <h1 style={{ fontSize: "1.875rem", letterSpacing: "-0.01em" }}>Sample Cart</h1>
          <button
            className="inline-flex items-center gap-1"
            style={{
              color: "var(--primary)",
              fontSize: "0.75rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <Plus size={12} /> Add another sample
          </button>
        </div>
        <p
          className="mb-8"
          style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", maxWidth: 720 }}
        >
          Your sample request may include a fee. Your Dow contact will discuss
          with you if applicable. We do not ship to residential or home
          addresses.
        </p>

        <Stepper step={step} />

        {customerNote && step !== 2 && (
          <SpineBanner note={customerNote} etaDays={customerEtaDays} />
        )}

        <div className="grid gap-8 mt-8" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div>
            {step === 0 && <CartStep onContinue={() => setStep(1)} />}
            {step === 1 && (
              <RequestStep onBack={() => setStep(0)} onContinue={() => setStep(2)} />
            )}
            {step === 2 && <ConfirmStep />}
          </div>
          <SideRail step={step} etaDays={customerEtaDays} hasNote={!!customerNote} />
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="relative my-6">
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: "var(--border)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          width: step === 0 ? "0%" : step === 1 ? "50%" : "100%",
          height: 2,
          backgroundColor: "var(--primary)",
          transition: "width 300ms ease",
        }}
      />
      <div className="relative flex items-start justify-between">
        {STEPS.map((label, i) => {
          const active = i <= step;
          return (
            <div key={label} className="flex flex-col items-center" style={{ width: "33%" }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  backgroundColor: active ? "var(--primary)" : "var(--card)",
                  border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                  color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  fontSize: "0.75rem",
                }}
              >
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <div
                className="mt-2"
                style={{
                  fontSize: "0.8125rem",
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpineBanner({ note, etaDays }: { note: string; etaDays: number }) {
  return (
    <div
      className="mt-2 p-4 flex items-start gap-3"
      style={{
        backgroundColor: "color-mix(in oklab, var(--chart-3) 12%, var(--card))",
        border: "1px solid color-mix(in oklab, var(--chart-3) 35%, var(--border))",
        borderRadius: 2,
      }}
    >
      <Sparkles size={16} style={{ color: "var(--chart-3)", marginTop: 2 }} />
      <div className="flex-1">
        <div style={{ fontWeight: "var(--font-weight-medium)", fontSize: "0.875rem" }}>
          ETA updated by Dow planning · {etaDays} days
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          {note} A backup grade (ENGAGE™ 8200) is pre-staged in case you'd prefer to keep your original timeline.
        </p>
      </div>
    </div>
  );
}

function CartStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      {LINE_ITEMS.map((it) => (
        <div
          key={it.code}
          className="p-5 mb-3"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 2,
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div style={{ fontWeight: "var(--font-weight-medium)", color: "var(--primary)" }}>
                {it.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                Trade Product No. {it.code}
              </div>
            </div>
            <button style={{ color: "var(--muted-foreground)" }} aria-label="Remove">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr 120px" }}>
            <Select label="Market" value={it.market} />
            <Select label="Submarket" value={it.submarket} />
            <Select label="Application" value={it.application} />
            <Field label="Quantity" value={it.qty} />
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-6">
        <button
          onClick={onContinue}
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
          Continue
        </button>
      </div>
    </div>
  );
}

function RequestStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <div
      className="p-6"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 2,
      }}
    >
      <h3 className="mb-1">Recipient Details</h3>
      <p
        className="mb-5"
        style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}
      >
        Who is this request for? <span style={{ color: "var(--primary)" }}>*</span>
      </p>
      <div className="flex items-center gap-6 mb-6" style={{ fontSize: "0.875rem" }}>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="who" defaultChecked /> I'm requesting samples for myself
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="who" /> I'm requesting samples for another person/party
        </label>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Field label="First Name *" value="Lars" />
        <Field label="Last Name *" value="Stratvell" />
        <Field label="Phone *" value="" placeholder="" />
        <Field label="Company Name *" value="Lumera Auto Interiors" />
        <div style={{ gridColumn: "1 / -1" }}>
          <Field
            label="Additional email addresses that should receive fulfillment communication (Limit of 3)"
            value=""
          />
        </div>
        <Field label="Country *" value="United Kingdom" />
        <Field label="State/County/Province" value="" />
        <Field label="City *" value="" />
        <Field label="ZIP *" value="" />
      </div>

      <div className="flex items-center justify-end gap-3 mt-8">
        <button
          onClick={onBack}
          className="h-11 px-6"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 999,
            fontSize: "0.75rem",
            fontWeight: "var(--font-weight-medium)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className="h-11 px-6"
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
          Finish
        </button>
      </div>
    </div>
  );
}

function ConfirmStep() {
  return (
    <div
      className="p-8"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <div
        className="inline-flex items-center justify-center mb-4"
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: "color-mix(in oklab, var(--primary) 10%, var(--card))",
          color: "var(--primary)",
        }}
      >
        <Check size={28} />
      </div>
      <h2 className="mb-2">Thank you</h2>
      <p
        className="mx-auto mb-4"
        style={{
          fontSize: "0.9375rem",
          color: "var(--muted-foreground)",
          maxWidth: 520,
          lineHeight: 1.55,
        }}
      >
        We have received your sample request for ENGAGE™ 8842 Polyolefin
        Elastomer and ENGAGE™ 8180 Polyolefin Elastomer. A confirmation email
        has been sent to <strong style={{ color: "var(--foreground)" }}>lars.k@lumeraauto.eu</strong>.
      </p>
      <p
        className="mx-auto"
        style={{
          fontSize: "0.8125rem",
          color: "var(--muted-foreground)",
          maxWidth: 520,
        }}
      >
        Case No: <strong style={{ color: "var(--foreground)" }}>REQ-2126-0418</strong>
      </p>
    </div>
  );
}

function SideRail({ step, etaDays, hasNote }: { step: Step; etaDays: number; hasNote: boolean }) {
  return (
    <aside
      className="p-5 h-fit"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 2,
      }}
    >
      <div
        className="pb-3 mb-3"
        style={{
          borderBottom: "1px solid var(--border)",
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        Update Request
      </div>
      <div className="space-y-3" style={{ fontSize: "0.8125rem" }}>
        <Row label="Account">Lumera Auto Interiors</Row>
        <Row label="Region">United Kingdom · EU</Row>
        <Row label="Items in cart">{LINE_ITEMS.length}</Row>
        <Row label="Stage">{STEPS[step]}</Row>
        {hasNote && (
          <Row label="Live ETA">
            <span style={{ color: "var(--primary)", fontWeight: "var(--font-weight-medium)" }}>
              {etaDays} days · adjusted by Dow
            </span>
          </Row>
        )}
      </div>
      {hasNote && (
        <div
          className="mt-4 p-3 flex items-start gap-2"
          style={{
            backgroundColor: "color-mix(in oklab, var(--primary) 6%, var(--card))",
            border: "1px solid color-mix(in oklab, var(--primary) 25%, var(--border))",
            borderRadius: 2,
          }}
        >
          <AlertCircle size={14} style={{ color: "var(--primary)", marginTop: 2 }} />
          <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            Your Dow contact will reach out to confirm the revised plan within
            the next business day.
          </div>
        </div>
      )}
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
      <span style={{ textAlign: "right" }}>{children}</span>
    </div>
  );
}

function Select({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{label}</span>
      <div
        className="flex items-center justify-between h-10 px-3"
        style={{ border: "1px solid #d0d3d6", borderRadius: 2, fontSize: "0.875rem" }}
      >
        <span>{value}</span>
        <ChevronDown size={13} style={{ color: "var(--muted-foreground)" }} />
      </div>
    </label>
  );
}

function Field({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{label}</span>
      <input
        defaultValue={value}
        placeholder={placeholder}
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
