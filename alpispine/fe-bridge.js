/* ============================================================
   FE bridge — live two-way link with "Alpitour Platform.html"
   (traveler ⇄ agent front end). Listens for the platform thread
   via localStorage storage events; announces spine actions back.
   ============================================================ */
(function () {
  var THREAD_KEY = "alpitour.platform.thread";
  var SPINE_KEY = "alpitour.spine.event";
  function read() { try { return JSON.parse(localStorage.getItem(THREAD_KEY) || "null"); } catch (e) { return null; } }
  var subs = [];
  window.SpineSync = {
    getThread: read,
    onThread: function (f) { subs.push(f); return function () { subs = subs.filter(function (x) { return x !== f; }); }; },
    announce: function (evt) { try { localStorage.setItem(SPINE_KEY, JSON.stringify(Object.assign({}, evt, { at: Date.now() }))); } catch (e) {} },
  };
  try {
    window.addEventListener("storage", function (e) {
      if (e.key !== THREAD_KEY || !e.newValue) return;
      var s = null; try { s = JSON.parse(e.newValue); } catch (err) {}
      if (s) subs.forEach(function (f) { try { f(s); } catch (err) {} });
    });
  } catch (e) {}
})();
