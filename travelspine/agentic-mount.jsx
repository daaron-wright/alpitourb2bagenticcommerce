/* ============================================================
   Mounts the global Agentic Workflow Pipeline FAB into its own
   React root — used by the customer experience app, which has its
   own component tree. (The operator app mounts it inside main.jsx.)
   ============================================================ */
(function () {
  function mount() {
    if (!window.UI || !window.UI.AgenticPipeline) { setTimeout(mount, 60); return; }
    const el = document.createElement("div");
    el.id = "agentic-pipeline-root";
    document.body.appendChild(el);
    ReactDOM.createRoot(el).render(React.createElement(window.UI.AgenticPipeline));
  }
  mount();
})();
