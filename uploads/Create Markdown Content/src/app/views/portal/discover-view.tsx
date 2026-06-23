import { useState } from "react";
import { Search, Sparkles, X, ChevronDown, Heart, Scale, Star, ArrowRight } from "lucide-react";
import { useApp } from "../../lib/store";

const FACETS: { group: string; items: { label: string; count: number }[] }[] = [
  {
    group: "Market",
    items: [
      { label: "Automotive", count: 240 },
      { label: "Consumer Goods and Appliances", count: 182 },
      { label: "Power, Water and Telecommunications", count: 158 },
      { label: "Building, Construction and Infrastructure", count: 120 },
      { label: "Packaging", count: 96 },
      { label: "Footwear", count: 68 },
      { label: "Healthcare, Pharmaceutical and Medical", count: 41 },
      { label: "Industrial", count: 75 },
      { label: "Agricultural, Foods and Animal Care", count: 32 },
      { label: "Electronics", count: 19 },
    ],
  },
  {
    group: "Product Technology",
    items: [
      { label: "Polyolefin Elastomers", count: 47 },
      { label: "Olefin Block Copolymers", count: 22 },
      { label: "Plastomers", count: 28 },
      { label: "Polyolefin Plastomers", count: 31 },
    ],
  },
];

const RESULTS = [
  {
    name: "ENGAGE™ 8842 Polyolefin Elastomer",
    family: "ENGAGE",
    blurb:
      "Polyolefin elastomer used in automotive interior soft-touch and TPO modification. Excellent low-temperature impact down to −40 °C. REACH compliant; validated with EU tier-1 OEMs.",
    pin: true,
    aiTag: "Top match · grounded in 6 sources",
  },
  {
    name: "ENGAGE™ 8200 Polyolefin Elastomer",
    family: "ENGAGE",
    blurb:
      "Polyolefin elastomer offering a strong balance of stiffness and impact for impact-modified polypropylene compounds. Common backup for ENGAGE 8842.",
  },
  {
    name: "ENGAGE™ 7467 Polyolefin Elastomer",
    family: "ENGAGE",
    blurb:
      "ENGAGE 7467 polyolefin elastomer provides a balance of low-temperature impact and tensile strength for wire jacketing and modified-PP compounds.",
  },
  {
    name: "ENGAGE™ 8003 Polyolefin Elastomer",
    family: "ENGAGE",
    blurb:
      "Polyolefin elastomer designed for impact modification of polypropylene in injection-molded automotive, consumer goods, and appliance parts.",
  },
  {
    name: "ENGAGE™ 7447 Polyolefin Elastomer",
    family: "ENGAGE",
    blurb:
      "Polyolefin elastomer engineered for wire-and-cable jacketing and flexible compounding with a soft-touch surface and good extrusion behaviour.",
  },
];

export function DiscoverView() {
  const [query, setQuery] = useState("I need rubber to make running shoes");
  const { customerNote, setPortalRoute } = useApp();

  return (
    <div style={{ backgroundColor: "var(--secondary)" }}>
      <SearchBar query={query} setQuery={setQuery} />

      <div
        className="max-w-[1320px] mx-auto px-8 py-8 grid gap-8"
        style={{ gridTemplateColumns: "260px 1fr" }}
      >
        <FacetSidebar />
        <div>
          <ResultsHeader total={278} query={query} />
          <AIReadyCard query={query} />
          {customerNote && (
            <SpineHint note={customerNote} onSamples={() => setPortalRoute("samples")} />
          )}
          <div className="space-y-4 mt-6">
            {RESULTS.map((r) => (
              <ResultRow key={r.name} {...r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-[1320px] mx-auto px-8 py-5 flex items-center gap-3">
        <div
          className="flex-1 flex items-center gap-2 h-12 px-4"
          style={{ border: "1px solid #d0d3d6", borderRadius: 2 }}
        >
          <Search size={16} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none"
            style={{ fontSize: "0.9375rem", backgroundColor: "transparent" }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} style={{ color: "var(--muted-foreground)" }} />
            </button>
          )}
        </div>
        <button
          className="inline-flex items-center gap-2 h-12 px-5"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: 999,
            fontSize: "0.75rem",
            fontWeight: "var(--font-weight-medium)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <Sparkles size={13} /> AI Ready Beta
        </button>
      </div>
    </div>
  );
}

function FacetSidebar() {
  return (
    <aside>
      {FACETS.map((f) => (
        <div key={f.group} className="mb-6">
          <div
            className="flex items-center justify-between mb-3 pb-2"
            style={{
              borderBottom: "1px solid var(--border)",
              fontWeight: "var(--font-weight-medium)",
              fontSize: "0.875rem",
            }}
          >
            <span>{f.group}</span>
            <ChevronDown size={14} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <ul className="space-y-1.5">
            {f.items.map((it) => (
              <li
                key={it.label}
                className="flex items-center justify-between gap-2"
                style={{ fontSize: "0.8125rem" }}
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                  <input type="checkbox" />
                  <span className="truncate">{it.label}</span>
                </label>
                <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>
                  ({it.count})
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

function ResultsHeader({ total, query }: { total: number; query: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          Results 1–15 of {total} for{" "}
          <span style={{ color: "var(--foreground)", fontWeight: "var(--font-weight-medium)" }}>
            "{query || "all products"}"
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2" style={{ fontSize: "0.8125rem" }}>
        <span style={{ color: "var(--muted-foreground)" }}>Sort by:</span>
        <button
          className="inline-flex items-center gap-1 px-3 h-9"
          style={{ border: "1px solid var(--border)", borderRadius: 2 }}
        >
          Relevance · First <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}

function AIReadyCard({ query }: { query: string }) {
  return (
    <div
      className="p-5"
      style={{
        border: "1px solid color-mix(in oklab, var(--primary) 30%, var(--border))",
        backgroundColor: "color-mix(in oklab, var(--primary) 5%, var(--card))",
        borderRadius: 2,
        marginBottom: 24,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            fontSize: "0.6875rem",
            fontWeight: "var(--font-weight-medium)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderRadius: 2,
          }}
        >
          <Sparkles size={11} /> AI Ready Beta
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          Generated answer · grounded in approved Dow content
        </span>
      </div>
      <p
        className="mb-3"
        style={{ fontSize: "0.9375rem", lineHeight: 1.55 }}
      >
        For "{query}", Dow most often recommends polyolefin elastomers from the{" "}
        <strong>ENGAGE™</strong> family. <strong>ENGAGE™ 8842</strong> is the
        strongest match for performance footwear midsoles: it offers excellent
        low-temperature flexibility, good rebound, and is REACH compliant for EU
        markets. <strong>ENGAGE™ 8200</strong> is a common backup with broader
        feedstock availability today.
      </p>
      <div
        className="flex flex-wrap items-center gap-2"
        style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
      >
        Sources:
        <a style={{ color: "var(--primary)" }}>ENGAGE Selection Guide (PDF)</a>
        <span>·</span>
        <a style={{ color: "var(--primary)" }}>REACH compliance memo · 2026-04</a>
        <span>·</span>
        <a style={{ color: "var(--primary)" }}>EU footwear application note</a>
      </div>
      <div
        className="mt-4 pt-3"
        style={{
          borderTop: "1px solid var(--border)",
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
          lineHeight: 1.5,
        }}
      >
        This AI Search Tool (beta) provides AI-generated answers, product
        comparisons, and suggestions to support your search. Results are
        generated by AI and may not always be complete, accurate, or up to
        date. Always rely on professional advice. By using this feature,
        you agree to the processing of your interactions as described in our{" "}
        <a style={{ color: "var(--primary)" }}>Data Privacy Notice</a> and{" "}
        <a style={{ color: "var(--primary)" }}>Terms of Use</a>.
      </div>
    </div>
  );
}

function SpineHint({ note, onSamples }: { note: string; onSamples: () => void }) {
  return (
    <div
      className="p-4 flex items-start gap-3"
      style={{
        backgroundColor: "color-mix(in oklab, var(--chart-3) 12%, var(--card))",
        border: "1px solid color-mix(in oklab, var(--chart-3) 35%, var(--border))",
        borderRadius: 2,
      }}
    >
      <Sparkles size={16} style={{ color: "var(--chart-3)", marginTop: 2 }} />
      <div className="flex-1 min-w-0">
        <div style={{ fontWeight: "var(--font-weight-medium)", fontSize: "0.875rem" }}>
          ChemAssist noticed something
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
          {note} Your top match below already reflects this — ETA, alternatives,
          and rationale are kept current in your sample cart.
        </p>
      </div>
      <button
        onClick={onSamples}
        className="inline-flex items-center gap-1 px-3 h-8"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          borderRadius: 2,
          fontSize: "0.75rem",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        View sample <ArrowRight size={12} />
      </button>
    </div>
  );
}

function ResultRow({
  name,
  family,
  blurb,
  pin,
  aiTag,
}: {
  name: string;
  family: string;
  blurb: string;
  pin?: boolean;
  aiTag?: string;
}) {
  return (
    <div
      className="p-5"
      style={{
        backgroundColor: "var(--card)",
        border: pin
          ? "1px solid color-mix(in oklab, var(--primary) 35%, var(--border))"
          : "1px solid var(--border)",
        borderRadius: 2,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 style={{ fontSize: "1.0625rem", color: "var(--primary)" }}>{name}</h3>
            {pin && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  fontSize: "0.625rem",
                  fontWeight: "var(--font-weight-medium)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderRadius: 2,
                }}
              >
                <Star size={10} /> Top pick
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              fontWeight: "var(--font-weight-medium)",
              marginBottom: 8,
            }}
          >
            {family} · Polyolefin Elastomer
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
            {blurb}
          </p>
          {aiTag && (
            <div
              className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5"
              style={{
                backgroundColor: "color-mix(in oklab, var(--primary) 10%, var(--card))",
                color: "var(--primary)",
                border: "1px solid color-mix(in oklab, var(--primary) 25%, var(--border))",
                fontSize: "0.6875rem",
                fontWeight: "var(--font-weight-medium)",
                borderRadius: 2,
              }}
            >
              <Sparkles size={10} /> {aiTag}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            className="inline-flex items-center gap-2 h-9 px-4"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              fontSize: "0.6875rem",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: 999,
            }}
          >
            Add to Sample Cart
          </button>
          <div className="flex items-center gap-3" style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            <button className="inline-flex items-center gap-1">
              <Heart size={12} /> Favorite
            </button>
            <button className="inline-flex items-center gap-1">
              <Scale size={12} /> Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
