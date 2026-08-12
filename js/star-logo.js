/* RED ARCHIVE — holo-star logo.
   Cyberpunk hologram of the red star: extruded 3D star spinning over a
   projection dais, gold core, teal HUD rings, scanline sweep, glitch ticks.
   Pure CSS 3D — no render loop.
   Usage: <div id="logo-star" style="width:280px;height:280px"></div>
   or any element with [data-red-star]
   Or: RedStar.mount(el, {speed}) */
(function () {
  "use strict";
  var STAR = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

  var HOSTN = 0;
  function mount(host, opts) {
    opts = opts || {};
    var speed = opts.speed != null ? +opts.speed : 1;
    var key = "k" + (++HOSTN) + "x" + Math.floor(Math.random() * 1e5);
    host.setAttribute("data-hs", key);
    host.setAttribute("role", "img");
    host.setAttribute("aria-label", "Red Archive logo: a holographic red star rotating over a projection dais");
    var builtSize = 0;

    function build() {
      var rect = host.getBoundingClientRect();
      var size = Math.min(rect.width, rect.height);
      if (!size) return;
      builtSize = size;
      host.innerHTML = "";
      var small = size < 90;
      var S = size * 0.58;              // star bounding box
      var spinDur = (10 / speed).toFixed(2) + "s";
      var SEL = '[data-hs="' + key + '"]';

      var css = "" +
        SEL + "{position:relative;width:100%;height:100%;perspective:" + (size * 3) + "px;overflow:visible}" +
        SEL + " .hs-glow{position:absolute;inset:-6%;background:radial-gradient(circle at 50% 45%,rgba(255,43,61,.16),rgba(107,15,26,.08) 52%,rgba(107,15,26,0) 70%)}" +
        SEL + " .hs-beam{position:absolute;left:50%;width:" + (S * 0.9) + "px;margin-left:" + (-S * 0.45) + "px;top:" + (size * 0.12) + "px;height:" + (size * 0.62) + "px;" +
          "background:linear-gradient(to bottom,rgba(255,43,61,0),rgba(255,43,61,.10) 55%,rgba(255,43,61,.20));" +
          "clip-path:polygon(18% 0%,82% 0%,62% 100%,38% 100%);animation:hs-flick-" + key + " " + (3.4 / speed).toFixed(2) + "s steps(1) infinite}" +
        SEL + " .hs-glitch{position:absolute;inset:0;animation:hs-glitch-" + key + " " + (4.7 / speed).toFixed(2) + "s steps(1) infinite}" +
        SEL + " .hs-float{position:absolute;inset:0;animation:hs-bob-" + key + " " + (4.2 / speed).toFixed(2) + "s ease-in-out infinite alternate}" +
        SEL + " .hs-spin{position:absolute;left:50%;top:" + (size * 0.10) + "px;width:" + S + "px;height:" + S + "px;margin-left:" + (-S / 2) + "px;" +
          "transform-style:preserve-3d;animation:hs-spin-" + key + " " + spinDur + " linear infinite}" +
        SEL + " .hs-star{position:absolute;inset:0;clip-path:" + STAR + "}" +
        SEL + " .hs-scanlines{position:absolute;inset:0;clip-path:" + STAR + ";" +
          "background:repeating-linear-gradient(0deg,rgba(10,5,8,.5) 0 1px,transparent 1px 3px);transform:translateZ(" + (S * 0.055 + 1) + "px)}" +
        SEL + " .hs-plat{position:absolute;left:50%;top:" + (size * 0.80) + "px;width:0;height:0;transform-style:preserve-3d}" +
        SEL + " .hs-ring{position:absolute;border-radius:50%}" +
        SEL + " .hs-scan{position:absolute;left:8%;right:8%;height:2px;background:linear-gradient(90deg,rgba(63,216,196,0),rgba(63,216,196,.5),rgba(63,216,196,0));" +
          "animation:hs-scanmove-" + key + " " + (5.6 / speed).toFixed(2) + "s ease-in-out infinite alternate}" +
        "@keyframes hs-spin-" + key + "{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}" +
        "@keyframes hs-bob-" + key + "{from{transform:translateY(" + (-size * 0.015) + "px)}to{transform:translateY(" + (size * 0.02) + "px)}}" +
        "@keyframes hs-flick-" + key + "{0%,100%{opacity:.55}12%{opacity:.8}13%{opacity:.5}47%{opacity:.75}48%{opacity:.55}80%{opacity:.9}82%{opacity:.6}}" +
        "@keyframes hs-glitch-" + key + "{0%,94%,100%{transform:translateX(0);filter:none}95%{transform:translateX(" + (-size * 0.012) + "px);filter:hue-rotate(38deg)}96%{transform:translateX(" + (size * 0.010) + "px)}97%{transform:translateX(0)}}" +
        "@keyframes hs-ringspin-" + key + "{from{transform:rotateX(78deg) rotateZ(0)}to{transform:rotateX(78deg) rotateZ(360deg)}}" +
        "@keyframes hs-ringspin2-" + key + "{from{transform:rotateX(78deg) rotateZ(360deg)}to{transform:rotateX(78deg) rotateZ(0)}}" +
        "@keyframes hs-pulse-" + key + "{0%,100%{opacity:.35}50%{opacity:.85}}" +
        "@keyframes hs-scanmove-" + key + "{from{top:6%}to{top:88%}}" +
        "@media (prefers-reduced-motion: reduce){" + SEL + " *{animation:none !important}}";

      var style = document.createElement("style");
      style.textContent = css;
      host.appendChild(style);

      var glow = document.createElement("div");
      glow.className = "hs-glow";
      host.appendChild(glow);

      var beam = document.createElement("div");
      beam.className = "hs-beam";
      host.appendChild(beam);

      var glitch = document.createElement("div");
      glitch.className = "hs-glitch";
      var float_ = document.createElement("div");
      float_.className = "hs-float";
      var spin = document.createElement("div");
      spin.className = "hs-spin";
      float_.appendChild(spin);
      glitch.appendChild(float_);
      host.appendChild(glitch);

      // extruded star: stacked clip-path layers along Z
      var depth = S * 0.055;
      var N = small ? 4 : 9;
      for (var i = 0; i < N; i++) {
        var z = -depth + (2 * depth) * (i / (N - 1));
        var lyr = document.createElement("div");
        lyr.className = "hs-star";
        var face = i === 0 || i === N - 1;
        var bg = face ?
          "linear-gradient(165deg,#ff4d5c 0%,#ff2b3d 38%,#8f1522 78%,#6b0f1a 100%)" :
          "#40080f";
        lyr.style.cssText = "background:" + bg + ";transform:translateZ(" + z.toFixed(1) + "px)" +
          (i === N - 1 ? ";filter:drop-shadow(0 0 " + (size * 0.05) + "px rgba(255,43,61,.55))" : "");
        spin.appendChild(lyr);
      }
      // gold core star on both faces
      [depth + 0.5, -depth - 0.5].forEach(function (z) {
        var g = document.createElement("div");
        g.className = "hs-star";
        g.style.cssText = "background:linear-gradient(160deg,#ffd75e,#f5b70a 55%,#a87d0a);transform:translateZ(" + z + "px) scale(0.42);" +
          "filter:drop-shadow(0 0 " + (size * 0.02) + "px rgba(245,183,10,.7))";
        spin.appendChild(g);
      });
      // hologram scanlines on the front face
      if (!small) {
        var sl = document.createElement("div");
        sl.className = "hs-scanlines";
        spin.appendChild(sl);
      }

      // projection dais: solid ring + counter-rotating dashed HUD rings
      var plat = document.createElement("div");
      plat.className = "hs-plat";
      function pring(d, border, anim, extra) {
        var el = document.createElement("div");
        el.className = "hs-ring";
        el.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (-d / 2) + "px;top:" + (-d / 2) + "px;" +
          "border:" + border + ";transform:rotateX(78deg);" + (anim ? "animation:" + anim + ";" : "") + (extra || "");
        return el;
      }
      plat.appendChild(pring(size * 0.66, "1.5px solid rgba(107,15,26,0.9)", null, "box-shadow:0 0 18px rgba(255,43,61,.25)"));
      plat.appendChild(pring(size * 0.78, "1px dashed rgba(63,216,196,0.55)", "hs-ringspin-" + key + " " + (14 / speed).toFixed(2) + "s linear infinite"));
      if (!small) {
        plat.appendChild(pring(size * 0.52, "1px dashed rgba(245,183,10,0.5)", "hs-ringspin2-" + key + " " + (9 / speed).toFixed(2) + "s linear infinite"));
        plat.appendChild(pring(size * 0.30, "1px solid rgba(255,43,61,0.6)", "hs-pulse-" + key + " " + (2.2 / speed).toFixed(2) + "s ease-in-out infinite"));
      }
      host.appendChild(plat);

      // teal scan sweep
      if (!small) {
        var scan = document.createElement("div");
        scan.className = "hs-scan";
        host.appendChild(scan);
      }
    }

    build();
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var rect = host.getBoundingClientRect();
        var size = Math.min(rect.width, rect.height);
        if (size && Math.abs(size - builtSize) > 2) build();
      }).observe(host);
    }
    return host;
  }

  window.RedStar = { mount: mount };

  function auto() {
    var el = document.getElementById("logo-star");
    if (el) mount(el);
    document.querySelectorAll("[data-red-star]").forEach(function (n) {
      if (n !== el) mount(n, { speed: +n.getAttribute("data-red-star") || 1 });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
})();
