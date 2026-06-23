/* Shidoka Icon Loader
 * Inline the icon sprite at document start so <use href="#icon-name"/>
 * works across file:// and served contexts without CORS quirks.
 * Usage:
 *   <script src="../../assets/icons/ki.js" defer></script>
 *   <svg class="ki"><use href="#icon-dashboard"/></svg>
 */
(function(){
  // Resolve sprite path relative to THIS script, so it works from any depth.
  var thisScript = document.currentScript || (function(){
    var s = document.getElementsByTagName('script'); return s[s.length-1];
  })();
  var base = thisScript ? thisScript.src.replace(/[^/]+$/, '') : '';
  var url = base + 'sprite.svg';

  function inject(svgText){
    var wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden','true');
    wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    wrap.innerHTML = svgText;
    // Insert at the start of body so <use> refs resolve everywhere.
    if (document.body) {
      document.body.insertBefore(wrap, document.body.firstChild);
    } else {
      document.addEventListener('DOMContentLoaded', function(){
        document.body.insertBefore(wrap, document.body.firstChild);
      });
    }
  }

  fetch(url).then(function(r){ return r.text(); }).then(inject).catch(function(){
    // Graceful fallback — silently ignore; icons simply won't render.
    console.warn('[ki] Failed to load icon sprite at', url);
  });
})();
