import { CustomerShell } from "./components/customer-shell";
import { AppShell } from "./components/app-shell";
import { PolicyDrawer } from "./components/policy-drawer";
import { ChemAssistLauncher, ChemAssistPanel } from "./components/chemassist-overlay";
import { useApp } from "./lib/store";
import { PortalHome } from "./views/portal/home-view";
import { DiscoverView as PortalDiscover } from "./views/portal/discover-view";
import { SamplesView as PortalSamples } from "./views/portal/samples-view";
import { AccountView as PortalAccount } from "./views/portal/account-view";
import { KnowledgeView as PortalKnowledge } from "./views/portal/knowledge-view";
import { ChemAssistView } from "./views/chemassist-view";
import { PlannerView } from "./views/planner-view";
import { ExceptionsView } from "./views/exceptions-view";
import { PolicyView } from "./views/policy-view";
import { BacktestView } from "./views/backtest-view";
import { JourneyView } from "./views/journey-view";

export default function App() {
  const { experience, route, portalRoute } = useApp();

  if (experience === "customer") {
    return (
      <CustomerShell>
        {portalRoute === "home" && <PortalHome />}
        {portalRoute === "discover" && <PortalDiscover />}
        {portalRoute === "samples" && <PortalSamples />}
        {portalRoute === "account" && <PortalAccount />}
        {portalRoute === "knowledge" && <PortalKnowledge />}
        <ChemAssistLauncher />
        <ChemAssistPanel />
      </CustomerShell>
    );
  }

  return (
    <AppShell>
      {route === "chemassist" && <ChemAssistView />}
      {route === "planner" && <PlannerView />}
      {route === "exceptions" && <ExceptionsView />}
      {route === "policy" && <PolicyView />}
      {route === "backtest" && <BacktestView />}
      {route === "journey" && <JourneyView />}
      <PolicyDrawer />
    </AppShell>
  );
}
