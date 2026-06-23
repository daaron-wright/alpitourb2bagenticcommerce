import { JOURNEY_LABELS, JOURNEY_ORDER, useApp } from "../../lib/store";
import { ChevronLeft, RefreshCw } from "lucide-react";
import {
  ScreenIntent,
  ScreenProfile,
  ScreenRecommend,
  ScreenCompare,
  ScreenPlan,
  ScreenAccount,
} from "./screens-1-6";
import {
  ScreenReview,
  ScreenTimeline,
  ScreenSupplyUpdate,
  ScreenExpert,
  ScreenFeedback,
  ScreenInternal,
} from "./screens-7-12";

export function ChemAssistJourney() {
  const { journeyStep } = useApp();
  return (
    <div>
      <JourneyNavigator />
      {journeyStep === "intent" && <ScreenIntent />}
      {journeyStep === "profile" && <ScreenProfile />}
      {journeyStep === "recommend" && <ScreenRecommend />}
      {journeyStep === "compare" && <ScreenCompare />}
      {journeyStep === "plan" && <ScreenPlan />}
      {journeyStep === "account" && <ScreenAccount />}
      {journeyStep === "review" && <ScreenReview />}
      {journeyStep === "timeline" && <ScreenTimeline />}
      {journeyStep === "supplyUpdate" && <ScreenSupplyUpdate />}
      {journeyStep === "expert" && <ScreenExpert />}
      {journeyStep === "feedback" && <ScreenFeedback />}
      {journeyStep === "internal" && <ScreenInternal />}
    </div>
  );
}

function JourneyNavigator() {
  const { journeyStep, setJourneyStep, resetJourney } = useApp();
  const i = JOURNEY_ORDER.indexOf(journeyStep);
  return (
    <div
      style={{
        backgroundColor: "var(--secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-8 h-12 flex items-center gap-3 overflow-x-auto">
        <button
          onClick={() => i > 0 && setJourneyStep(JOURNEY_ORDER[i - 1])}
          className="inline-flex items-center gap-1 h-8 px-2"
          style={{
            color: i > 0 ? "var(--foreground)" : "var(--muted-foreground)",
            fontSize: "0.75rem",
            fontWeight: "var(--font-weight-medium)",
          }}
          disabled={i <= 0}
        >
          <ChevronLeft size={13} /> Prev
        </button>
        <div
          className="flex items-center gap-1 flex-1 overflow-x-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {JOURNEY_ORDER.map((k, idx) => {
            const active = k === journeyStep;
            const done = idx < i;
            return (
              <button
                key={k}
                onClick={() => setJourneyStep(k)}
                className="inline-flex items-center gap-1.5 px-2.5 h-7 whitespace-nowrap"
                style={{
                  backgroundColor: active
                    ? "var(--primary)"
                    : done
                    ? "var(--card)"
                    : "transparent",
                  color: active
                    ? "var(--primary-foreground)"
                    : done
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  border: active
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border)",
                  borderRadius: 2,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                <span style={{ opacity: 0.7 }}>{String(idx + 1).padStart(2, "0")}</span>
                {JOURNEY_LABELS[k]}
              </button>
            );
          })}
        </div>
        <button
          onClick={resetJourney}
          className="inline-flex items-center gap-1 h-8 px-2"
          style={{
            color: "var(--muted-foreground)",
            fontSize: "0.75rem",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          <RefreshCw size={12} /> Reset demo
        </button>
      </div>
    </div>
  );
}
