import { Sparkles, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { JOURNEY_LABELS, JOURNEY_ORDER, useApp } from "../lib/store";
import { ChemAssistJourney } from "../views/chemassist/journey";

export function ChemAssistLauncher() {
  const { chemAssistOpen, openChemAssist } = useApp();
  if (chemAssistOpen) return null;
  return (
    <button
      onClick={openChemAssist}
      className="fixed inline-flex items-center gap-2 px-5 h-12 shadow-lg"
      style={{
        bottom: 24,
        right: 24,
        zIndex: 60,
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
        borderRadius: 999,
        fontSize: "0.8125rem",
        fontWeight: "var(--font-weight-medium)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        boxShadow: "0 12px 32px color-mix(in oklab, var(--primary) 40%, transparent)",
      }}
    >
      <Sparkles size={15} />
      Ask ChemAssist
      <span
        className="inline-flex items-center justify-center"
        style={{
          marginLeft: 4,
          padding: "1px 6px",
          borderRadius: 999,
          backgroundColor: "color-mix(in oklab, var(--primary-foreground) 18%, transparent)",
          color: "var(--primary-foreground)",
          fontSize: "0.625rem",
          letterSpacing: "0.06em",
        }}
      >
        BETA
      </span>
    </button>
  );
}

export function ChemAssistPanel() {
  const {
    chemAssistOpen,
    closeChemAssist,
    journeyStep,
    setJourneyStep,
    resetJourney,
  } = useApp();
  const i = JOURNEY_ORDER.indexOf(journeyStep);

  return (
    <>
      {chemAssistOpen && (
        <div
          onClick={closeChemAssist}
          className="fixed inset-0"
          style={{
            zIndex: 70,
            backgroundColor: "color-mix(in oklab, #0f1115 55%, transparent)",
          }}
        />
      )}
      <aside
        aria-hidden={!chemAssistOpen}
        className="fixed top-0 right-0 h-screen flex flex-col"
        style={{
          width: "min(880px, 96vw)",
          zIndex: 80,
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-20px 0 60px rgba(15,17,21,0.25)",
          transform: chemAssistOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 220ms ease",
        }}
      >
        <header
          className="flex items-center justify-between px-6 h-14 shrink-0"
          style={{
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          <div className="inline-flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <Sparkles size={14} />
            </span>
            <div className="flex flex-col">
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: "var(--font-weight-medium)",
                  letterSpacing: "0.02em",
                }}
              >
                Dow ChemAssist
              </span>
              <span
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                AI Ready Beta · Step {String(i + 1).padStart(2, "0")} of {JOURNEY_ORDER.length} ·{" "}
                {JOURNEY_LABELS[journeyStep]}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => i > 0 && setJourneyStep(JOURNEY_ORDER[i - 1])}
              disabled={i <= 0}
              className="inline-flex items-center gap-1 h-8 px-2.5"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 2,
                fontSize: "0.6875rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: i > 0 ? "var(--foreground)" : "var(--muted-foreground)",
                backgroundColor: "var(--card)",
              }}
            >
              <ChevronLeft size={12} /> Prev
            </button>
            <button
              onClick={() =>
                i < JOURNEY_ORDER.length - 1 && setJourneyStep(JOURNEY_ORDER[i + 1])
              }
              disabled={i >= JOURNEY_ORDER.length - 1}
              className="inline-flex items-center gap-1 h-8 px-2.5"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 2,
                fontSize: "0.6875rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:
                  i < JOURNEY_ORDER.length - 1
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                backgroundColor: "var(--card)",
              }}
            >
              Next <ChevronRight size={12} />
            </button>
            <button
              onClick={resetJourney}
              className="inline-flex items-center gap-1 h-8 px-2.5"
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.6875rem",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={closeChemAssist}
              className="inline-flex items-center justify-center"
              aria-label="Close ChemAssist"
              style={{
                width: 32,
                height: 32,
                borderRadius: 2,
                color: "var(--muted-foreground)",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {chemAssistOpen && <ChemAssistJourney />}
        </div>
      </aside>
    </>
  );
}
