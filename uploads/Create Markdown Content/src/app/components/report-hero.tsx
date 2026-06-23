export function ReportHero() {
  const stats = [
    { label: "Personas", value: "6" },
    { label: "Screens", value: "8" },
    { label: "Policy families", value: "6" },
    { label: "Deployment gates", value: "5" },
  ];
  return (
    <section
      className="mb-12 p-8 border"
      style={{
        borderColor: "var(--border)",
        borderRadius: "var(--radius-xl)",
        backgroundColor: "var(--card)",
      }}
    >
      <div
        className="inline-block px-3 py-1 mb-4"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.75rem",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Research synthesis
      </div>
      <p
        className="max-w-3xl leading-relaxed"
        style={{
          color: "var(--muted-foreground)",
          fontSize: "1.0625rem",
        }}
      >
        A connected platform thesis for Dow — uniting ChemAssist, Policy as
        Code, and the supply chain agentic spine into a single governed
        operating model around the sample-to-ship value stream.
      </p>
      <div
        className="mt-8 grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-4 border"
            style={{
              borderColor: "var(--border)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--background)",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
                lineHeight: 1.1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: "0.8125rem",
                color: "var(--muted-foreground)",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
