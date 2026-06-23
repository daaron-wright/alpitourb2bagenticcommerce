import { FileText, Calendar, BookOpen } from "lucide-react";

export function ReportHeader() {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "color-mix(in oklab, var(--background) 85%, transparent)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <div
              style={{
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: 1.2,
              }}
            >
              Deep Research Report
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
              }}
            >
              Dow Agentic Orchestration Platform
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5">
          <Meta icon={<FileText size={14} />} label="Briefing" />
          <Meta icon={<Calendar size={14} />} label="June 9 rehearsal" />
          <span
            className="px-3 py-1"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.75rem",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Draft v1
          </span>
        </div>
      </div>
    </header>
  );
}

function Meta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        color: "var(--muted-foreground)",
        fontSize: "0.8125rem",
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
