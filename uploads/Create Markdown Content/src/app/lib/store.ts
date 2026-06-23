import { create } from "zustand";

export type RouteKey =
  | "chemassist"
  | "planner"
  | "exceptions"
  | "backtest"
  | "journey"
  | "policy";

export type Experience = "customer" | "console";
export type PortalRoute = "home" | "discover" | "samples" | "account" | "knowledge";

export type JourneyStep =
  | "intent"
  | "profile"
  | "recommend"
  | "compare"
  | "plan"
  | "account"
  | "review"
  | "timeline"
  | "supplyUpdate"
  | "expert"
  | "feedback"
  | "internal";

export const JOURNEY_ORDER: JourneyStep[] = [
  "intent",
  "profile",
  "recommend",
  "compare",
  "plan",
  "account",
  "review",
  "timeline",
  "supplyUpdate",
  "expert",
  "feedback",
  "internal",
];

export const JOURNEY_LABELS: Record<JourneyStep, string> = {
  intent: "Intent",
  profile: "Application profile",
  recommend: "Recommendations",
  compare: "Compare",
  plan: "Sample plan",
  account: "Account",
  review: "Policy review",
  timeline: "Living timeline",
  supplyUpdate: "Supply update",
  expert: "Expert handoff",
  feedback: "Feedback → BRD",
  internal: "Internal overlay",
};

export type EventState =
  | "idle"
  | "detected"
  | "cost"
  | "inventory"
  | "policy"
  | "preview"
  | "approved"
  | "customer";

type Store = {
  experience: Experience;
  setExperience: (e: Experience) => void;

  portalRoute: PortalRoute;
  setPortalRoute: (r: PortalRoute) => void;

  journeyStep: JourneyStep;
  setJourneyStep: (s: JourneyStep) => void;
  advanceJourney: () => void;
  resetJourney: () => void;

  showInternal: boolean;
  setShowInternal: (v: boolean) => void;
  toggleInternal: () => void;

  supplyUpdateTriggered: boolean;
  triggerSupplyUpdate: () => void;

  chemAssistOpen: boolean;
  openChemAssist: () => void;
  closeChemAssist: () => void;
  toggleChemAssist: () => void;

  route: RouteKey;
  setRoute: (r: RouteKey) => void;

  scenarioStep: EventState;
  setScenarioStep: (s: EventState) => void;
  runScenario: () => void;
  resetScenario: () => void;

  customerEtaDays: number;
  customerNote: string | null;
  setCustomerUpdate: (days: number, note: string) => void;

  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const ORDER: EventState[] = [
  "idle",
  "detected",
  "cost",
  "inventory",
  "policy",
  "preview",
  "approved",
  "customer",
];

export const useApp = create<Store>((set, get) => ({
  experience: "customer",
  setExperience: (e) => set({ experience: e }),
  portalRoute: "home",
  setPortalRoute: (r) => set({ portalRoute: r }),

  journeyStep: "intent",
  setJourneyStep: (s) => set({ journeyStep: s }),
  advanceJourney: () => {
    const cur = get().journeyStep;
    const i = JOURNEY_ORDER.indexOf(cur);
    if (i < 0 || i >= JOURNEY_ORDER.length - 1) return;
    set({ journeyStep: JOURNEY_ORDER[i + 1] });
  },
  resetJourney: () => set({ journeyStep: "intent", supplyUpdateTriggered: false }),

  showInternal: false,
  setShowInternal: (v) => set({ showInternal: v }),
  toggleInternal: () => set({ showInternal: !get().showInternal }),

  supplyUpdateTriggered: false,
  triggerSupplyUpdate: () => set({ supplyUpdateTriggered: true }),

  chemAssistOpen: false,
  openChemAssist: () => set({ chemAssistOpen: true }),
  closeChemAssist: () => set({ chemAssistOpen: false }),
  toggleChemAssist: () => set({ chemAssistOpen: !get().chemAssistOpen }),

  route: "chemassist",
  setRoute: (r) => set({ route: r }),

  scenarioStep: "idle",
  setScenarioStep: (s) => set({ scenarioStep: s }),
  runScenario: () => {
    const step = get().scenarioStep;
    const idx = ORDER.indexOf(step);
    let i = idx < 0 ? 0 : idx;
    const advance = () => {
      i += 1;
      if (i >= ORDER.length) return;
      const next = ORDER[i];
      set({ scenarioStep: next });
      if (next === "customer") {
        set({
          customerEtaDays: 18,
          customerNote:
            "ETA shifted +4 days due to naphtha price event at Tarragona. Alternative grade ENGAGE 8200 available with original ETA.",
        });
      }
      if (next !== "customer") setTimeout(advance, 1100);
    };
    setTimeout(advance, 400);
  },
  resetScenario: () =>
    set({
      scenarioStep: "idle",
      customerEtaDays: 14,
      customerNote: null,
    }),

  customerEtaDays: 14,
  customerNote: null,
  setCustomerUpdate: (days, note) => set({ customerEtaDays: days, customerNote: note }),

  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));
