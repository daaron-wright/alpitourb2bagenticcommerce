/* ============================================================
   Root app — state, routing, tweaks
   ============================================================ */
(function () {
  const UI = window.UI;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakButton } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroLayout": "A",
    "policyOutcome": "amber"
  }/*EDITMODE-END*/;

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [screen, setScreen] = React.useState("intake");
    const [role, setRole] = React.useState("sales");
    const [collapsed, setCollapsed] = React.useState(false);
    const [policyState, setPolicyState] = React.useState(t.policyOutcome);
    const [selected, setSelected] = React.useState("xlt8677");
    const [toastNode, toast] = UI.useToast();

    // keep policyState synced with the tweak control
    React.useEffect(() => { setPolicyState(t.policyOutcome); }, [t.policyOutcome]);

    const common = { setScreen, role, toast };

    return (
      <React.Fragment>
        <UI.AppShell screen={screen} setScreen={setScreen} role={role} setRole={setRole} collapsed={collapsed} setCollapsed={setCollapsed}>
          {screen === "intake" && <UI.ScreenIntake layout={t.heroLayout} {...common} />}
          {screen === "recommend" && <UI.ScreenRecommend {...common} selected={selected} setSelected={setSelected} />}
          {screen === "policy" && <UI.ScreenPolicy {...common} policyState={policyState}
            setPolicyState={(s) => { setPolicyState(s); setTweak("policyOutcome", s); }} />}
          {screen === "timeline" && <UI.ScreenTimeline {...common} policyState={policyState} />}
          {screen === "exceptions" && <UI.ScreenExceptions {...common} />}
          {screen === "learning" && <UI.ScreenLearning {...common} />}
        </UI.AppShell>

        {toastNode}

        <TweaksPanel>
          <TweakSection label="Hero screen layout" />
          <TweakRadio label="Intent capture" value={t.heroLayout}
            options={[{ value: "A", label: "Split" }, { value: "B", label: "Chat" }, { value: "C", label: "Cockpit" }]}
            onChange={(v) => { setTweak("heroLayout", v); setScreen("intake"); }} />
          <TweakSection label="Policy demo state" />
          <TweakRadio label="Gate outcome" value={t.policyOutcome}
            options={[{ value: "green", label: "Clear" }, { value: "amber", label: "Review" }, { value: "red", label: "Hold" }]}
            onChange={(v) => setTweak("policyOutcome", v)} />
          <TweakSection label="Demo" />
          <TweakButton label="Reset walkthrough" onClick={() => { setScreen("intake"); setRole("sales"); setSelected("xlt8677"); setTweak("policyOutcome", "amber"); setTweak("heroLayout", "A"); }} />
        </TweaksPanel>
      </React.Fragment>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
