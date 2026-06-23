import {
  Sparkles,
  ArrowRight,
  Package,
  AlertCircle,
  ChevronRight,
  FileText,
  Beaker,
  ShoppingCart,
} from "lucide-react";
import { useApp } from "../../lib/store";

export function PortalHome() {
  const { setPortalRoute, customerEtaDays, customerNote, openChemAssist } = useApp();
  return (
    <div>
      <Hero onAI={openChemAssist} />

      <div className="max-w-[1320px] mx-auto px-8">
        {customerNote && (
          <ProactiveAlert
            etaDays={customerEtaDays}
            note={customerNote}
            onView={() => setPortalRoute("samples")}
          />
        )}

        <ApplicationGrid onSelect={() => setPortalRoute("discover")} />
        <ProductFamilies onSelect={() => setPortalRoute("discover")} />
        <ResourceStrip setPortalRoute={setPortalRoute} onAsk={openChemAssist} />
      </div>
    </div>
  );
}

function Hero({ onAI }: { onAI: () => void }) {
  return (
    <section
      style={{
        backgroundColor: "#0f1115",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 500px at 80% 30%, color-mix(in oklab, var(--primary) 55%, transparent), transparent 60%), radial-gradient(700px 400px at 10% 80%, color-mix(in oklab, var(--chart-3) 35%, transparent), transparent 60%)",
        }}
      />
      <div
        className="max-w-[1320px] mx-auto px-8 py-20 relative"
        style={{ minHeight: 460 }}
      >
        <span
          className="inline-flex items-center gap-2 px-3 py-1 mb-6"
          style={{
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 999,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Seek Together™
        </span>
        <h1
          style={{
            fontSize: "3.25rem",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 760,
            marginBottom: 16,
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Materials science for a better tomorrow.
        </h1>
        <p style={{ fontSize: "1.0625rem", lineHeight: 1.55, maxWidth: 620, opacity: 0.85 }}>
          Discover the Dow products and applications that fit your program — now
          with AI-assisted search to get you from question to qualification, faster.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex items-center gap-2 px-5 h-11"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: 999,
              fontSize: "0.8125rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
            onClick={onAI}
          >
            <Sparkles size={14} />
            Try AI Ready Beta
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 h-11"
            style={{
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              borderRadius: 999,
              fontSize: "0.8125rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Browse products
          </button>
        </div>
      </div>
    </section>
  );
}

function ProactiveAlert({
  etaDays,
  note,
  onView,
}: {
  etaDays: number;
  note: string;
  onView: () => void;
}) {
  return (
    <div
      className="mt-8 mb-2 p-5 flex gap-4 items-start"
      style={{
        border: "1px solid color-mix(in oklab, var(--primary) 35%, var(--border))",
        backgroundColor: "color-mix(in oklab, var(--primary) 6%, var(--card))",
        borderRadius: "var(--radius-md)",
      }}
    >
      <AlertCircle size={20} style={{ color: "var(--primary)", marginTop: 2 }} />
      <div className="min-w-0 flex-1">
        <div style={{ fontWeight: "var(--font-weight-medium)", marginBottom: 4 }}>
          Update on your ENGAGE™ 8842 sample request
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          {note} Revised ETA{" "}
          <strong style={{ color: "var(--foreground)" }}>{etaDays} days</strong>.
          Your Dow contact has already proposed an alternative.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={onView}
            className="inline-flex items-center gap-2 px-4 h-9"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: 2,
              fontSize: "0.75rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            View sample <ArrowRight size={13} />
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 h-9"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 2,
              fontSize: "0.75rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Talk to Dow
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationGrid({ onSelect }: { onSelect: () => void }) {
  const apps = [
    { name: "Automotive", count: "1,240 products" },
    { name: "Building & Construction", count: "980 products" },
    { name: "Consumer Goods & Appliances", count: "1,604 products" },
    { name: "Electrical & Electronics", count: "612 products" },
    { name: "Flexible Packaging", count: "1,810 products" },
    { name: "Healthcare", count: "420 products" },
    { name: "Industrial", count: "1,355 products" },
    { name: "Wire & Cable", count: "770 products" },
  ];
  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              color: "var(--muted-foreground)",
              fontWeight: "var(--font-weight-medium)",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Industries we serve
          </div>
          <h2 style={{ fontSize: "1.75rem", letterSpacing: "-0.01em" }}>
            Find materials by application
          </h2>
        </div>
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1"
          style={{ color: "var(--primary)", fontSize: "0.875rem", fontWeight: "var(--font-weight-medium)" }}
        >
          View all applications <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {apps.map((a) => (
          <button
            key={a.name}
            onClick={onSelect}
            className="text-left p-5 transition-colors"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 2,
              backgroundColor: "var(--card)",
            }}
          >
            <div style={{ fontWeight: "var(--font-weight-medium)" }}>{a.name}</div>
            <div
              className="mt-1"
              style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
            >
              {a.count}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProductFamilies({ onSelect }: { onSelect: () => void }) {
  const families = [
    {
      name: "ENGAGE™",
      sub: "Polyolefin Elastomers",
      desc: "Polyolefin elastomers and recycled materials used in various applications including footwear, hygiene products, and molded goods.",
    },
    {
      name: "INFUSE™",
      sub: "Olefin Block Copolymers",
      desc: "Elastomeric performance with thermoplastic processing for soft-touch, sealing, and overmold applications.",
    },
    {
      name: "AFFINITY™",
      sub: "Polyolefin Plastomers",
      desc: "Low seal-initiation temperatures and tough film performance for flexible packaging and hot-melt adhesives.",
    },
    {
      name: "VERSIFY™",
      sub: "Plastomers & Elastomers",
      desc: "Engineered for sealants, modifiers, and high-clarity flexible packaging with strong impact balance.",
    },
  ];
  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              color: "var(--muted-foreground)",
              fontWeight: "var(--font-weight-medium)",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Featured product families
          </div>
          <h2 style={{ fontSize: "1.75rem", letterSpacing: "-0.01em" }}>
            Polyolefin Elastomers & Plastomers
          </h2>
        </div>
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1"
          style={{ color: "var(--primary)", fontSize: "0.875rem", fontWeight: "var(--font-weight-medium)" }}
        >
          See all products <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {families.map((f) => (
          <div
            key={f.name}
            className="flex flex-col"
            style={{
              border: "1px solid var(--border)",
              borderRadius: 2,
              backgroundColor: "var(--card)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 8,
                backgroundColor: "var(--primary)",
              }}
            />
            <div className="p-5 flex flex-col flex-1">
              <div style={{ fontWeight: "var(--font-weight-medium)", fontSize: "1.0625rem" }}>
                {f.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {f.sub}
              </div>
              <p
                className="mt-3 mb-5 flex-1"
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
              <button
                onClick={onSelect}
                className="inline-flex items-center gap-1.5 self-start"
                style={{
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  fontWeight: "var(--font-weight-medium)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Explore <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResourceStrip({
  setPortalRoute,
  onAsk,
}: {
  setPortalRoute: (r: any) => void;
  onAsk: () => void;
}) {
  const items = [
    {
      icon: <Sparkles size={18} />,
      title: "AI Ready Beta",
      body: "Ask in your own words. Get ranked grades grounded in approved Dow sources.",
      cta: "Try ChemAssist",
      to: "__ask__",
    },
    {
      icon: <Beaker size={18} />,
      title: "Request samples",
      body: "Order samples directly. Track lab through delivery with live updates from Dow planning.",
      cta: "Open Sample Cart",
      to: "samples",
    },
    {
      icon: <FileText size={18} />,
      title: "Technical content",
      body: "Application guides, product data sheets, and regulatory documents — searchable.",
      cta: "Browse knowledge",
      to: "knowledge",
    },
    {
      icon: <ShoppingCart size={18} />,
      title: "Manage your account",
      body: "Your qualifications, your Dow team, and your privacy controls in one place.",
      cta: "Open account",
      to: "account",
    },
  ];
  return (
    <section className="py-16">
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {items.map((it) => (
          <button
            key={it.title}
            onClick={() => (it.to === "__ask__" ? onAsk() : setPortalRoute(it.to))}
            className="text-left p-5"
            style={{
              backgroundColor: "var(--secondary)",
              borderRadius: 2,
            }}
          >
            <div style={{ color: "var(--primary)" }}>{it.icon}</div>
            <div className="mt-3" style={{ fontWeight: "var(--font-weight-medium)" }}>
              {it.title}
            </div>
            <p
              className="mt-2"
              style={{
                fontSize: "0.8125rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.5,
              }}
            >
              {it.body}
            </p>
            <div
              className="mt-4 inline-flex items-center gap-1"
              style={{
                color: "var(--primary)",
                fontSize: "0.75rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {it.cta} <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export { Package };
