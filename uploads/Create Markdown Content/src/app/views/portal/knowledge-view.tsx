import { BookOpen, FileText, Search, Sparkles, ArrowRight } from "lucide-react";
import { Card, Pill, SectionTitle } from "../../components/primitives";

const COLLECTIONS = [
  {
    title: "Automotive interiors",
    count: 24,
    desc: "TPO, soft-touch, low-temp impact, REACH guidance for EU programs.",
  },
  {
    title: "Wire & cable",
    count: 18,
    desc: "Jacketing, insulation, halogen-free, processing windows by extruder.",
  },
  {
    title: "Flexible packaging",
    count: 31,
    desc: "Seal initiation, hot-tack, downgauging, food-contact compliance.",
  },
  {
    title: "Medical & healthcare",
    count: 12,
    desc: "ISO 10993 paths, sterilization compatibility, change-management.",
  },
];

const ARTICLES = [
  {
    title: "Choosing a POE grade for low-temperature automotive impact",
    family: "ENGAGE",
    tone: "Application guide",
    read: "6 min",
  },
  {
    title: "Designing for REACH compliance in EU launches",
    family: "Regulatory",
    tone: "Compliance",
    read: "8 min",
  },
  {
    title: "Substitution playbook: how to switch grades during a supply shift",
    family: "Cross-product",
    tone: "Playbook",
    read: "5 min",
  },
  {
    title: "Processing window: ENGAGE 8842 vs 8200 in EU injection lines",
    family: "ENGAGE",
    tone: "Technical note",
    read: "4 min",
  },
  {
    title: "Reading typical-data vs specification: what to trust when",
    family: "Trust & evidence",
    tone: "Foundational",
    read: "3 min",
  },
  {
    title: "Carbon intensity comparison across ENGAGE grades",
    family: "Sustainability",
    tone: "Data brief",
    read: "7 min",
  },
];

export function KnowledgeView() {
  return (
    <div className="max-w-[1320px] mx-auto px-8 py-10">
      <SectionTitle
        eyebrow="Resources"
        title="Knowledge hub"
        subtitle="Approved Dow technical content, regulatory guidance, and playbooks — searchable from one place."
        action={
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5"
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8125rem",
              color: "var(--muted-foreground)",
            }}
          >
            <Sparkles size={12} style={{ color: "var(--primary)" }} />
            Ask ChemAssist anything from here
          </span>
        }
      />

      <div
        className="flex items-center gap-3 p-4 mb-10"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <Search size={16} style={{ color: "var(--muted-foreground)" }} />
        <input
          placeholder="Search by application, grade, regulation, or playbook…"
          className="flex-1 outline-none"
          style={{
            backgroundColor: "transparent",
            color: "var(--foreground)",
            fontSize: "0.9375rem",
          }}
        />
        <Pill tone="info">68 sources indexed</Pill>
      </div>

      <h3 className="mb-4">Browse by application</h3>
      <div className="grid gap-4 mb-12" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {COLLECTIONS.map((c) => (
          <button
            key={c.title}
            className="text-left p-5 border transition-colors"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <BookOpen size={18} style={{ color: "var(--primary)" }} />
            <div
              className="mt-3 mb-1"
              style={{ fontWeight: "var(--font-weight-medium)" }}
            >
              {c.title}
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--muted-foreground)",
                lineHeight: 1.5,
              }}
            >
              {c.desc}
            </p>
            <div
              className="mt-3"
              style={{
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
              }}
            >
              {c.count} articles
            </div>
          </button>
        ))}
      </div>

      <h3 className="mb-4">Recommended reads</h3>
      <Card padded={false}>
        <ul>
          {ARTICLES.map((a, i) => (
            <li
              key={a.title}
              className="flex items-center gap-4 px-5 py-4"
              style={{
                borderBottom: i < ARTICLES.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--secondary)",
                  color: "var(--primary)",
                }}
              >
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontWeight: "var(--font-weight-medium)" }}>{a.title}</div>
                <div
                  className="mt-1 flex items-center gap-2"
                  style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
                >
                  <Pill tone="neutral">{a.family}</Pill>
                  <span>· {a.tone}</span>
                  <span>· {a.read} read</span>
                </div>
              </div>
              <ArrowRight size={14} style={{ color: "var(--muted-foreground)" }} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
