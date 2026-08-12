/* RED ARCHIVE — animated banner v2. Drop into js/banner.js
   CRT power-on → master-timeline draw → looping signal pulse.
   Usage: <div id="banner-hero"></div> + css/banner.css.
   Or: RedBanner.mount(el, {speed, grid, status}) */
(function () {
  "use strict";
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TICKS = [
    ["1516", "UTOPIA"],
    ["1848", "MANIFESTO"],
    ["1871", "COMMUNE"],
    ["1917", "OCTOBER"],
    ["1949", "PEKING"],
    ["1991", "COLLAPSE"],
    ["NOW", "ARCHIVE"]
  ];

  function css(name, fb) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb;
  }
  var easeOut = function (t) { return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3); };
  var easeBack = function (t) { t = Math.min(Math.max(t, 0), 1); var s = 1.7; t -= 1; return t * t * ((s + 1) * t + s) + 1; };
  var clamp01 = function (t) { return Math.min(Math.max(t, 0), 1); };

  function mount(host, opts) {
    opts = opts || {};
    var speed = opts.speed != null ? +opts.speed : 1;
    var showGrid = opts.grid !== false;
    var STATUS = opts.status || "IDEOLOGICAL CARTOGRAPHY // MASTER TIMELINE // SIGNAL LOCKED";

    host.innerHTML = "";
    var root = document.createElement("div");
    root.className = "rb";
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", "Animated banner: the archive's master timeline, 1516 to now, with a traveling signal pulse");
    var cv = document.createElement("canvas");
    root.appendChild(cv);

    var readout = document.createElement("div");
    readout.className = "rb-readout";
    var readSpan = document.createElement("span");
    var cursor = document.createElement("span");
    cursor.className = "rb-cursor";
    readout.appendChild(readSpan);
    readout.appendChild(cursor);
    root.appendChild(readout);

    var tag = document.createElement("div");
    tag.className = "rb-tag";
    tag.textContent = "REC \u25CF 475 YRS / 20 SCHOOLS";
    root.appendChild(tag);
    host.appendChild(root);

    var SIGNAL = css("--signal", "#ff2b3d");
    var BANNER = css("--banner", "#6b0f1a");
    var GOLD = css("--gold", "#f5b70a");
    var COLD = css("--cold", "#3fd8c4");
    var PAPER = css("--paper", "#f2e6d5");
    var PAPERDIM = css("--paper-dim", "#b9a78f");
    var MONO = '"IBM Plex Mono", Menlo, monospace';

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0;
    function resize() {
      var r = root.getBoundingClientRect();
      if (!r.width) return;
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(root);

    var start = performance.now();
    var live = false, tearAt = 7 + Math.random() * 4;

    function frame(now) {
      var t = (now - start) / 1000;
      if (REDUCED) t = 100;
      if (!w) resize();
      var x = cv.getContext("2d");
      x.clearRect(0, 0, w, h);

      var x0 = w * 0.08, x1 = w * 0.92, axisY = h * 0.58;

      // drifting vertical grid, very faint
      if (showGrid) {
        var sp = 96, off = REDUCED ? 0 : (t * 3 * speed) % sp;
        x.strokeStyle = "rgba(255,43,61,0.05)";
        x.lineWidth = 1;
        x.beginPath();
        for (var gx = -off; gx < w; gx += sp) { x.moveTo(gx, 0); x.lineTo(gx, h); }
        x.stroke();
      }

      // CRT power-on: hairline flash across center, then fades
      if (t < 0.9) {
        var on = easeOut(t / 0.35);
        var fade = 1 - clamp01((t - 0.35) / 0.55);
        x.fillStyle = "rgba(242,230,213," + (0.9 * fade) + ")";
        x.fillRect(w * 0.5 * (1 - on), axisY - 1, w * on, 2);
        x.fillStyle = "rgba(255,43,61," + (0.25 * fade) + ")";
        x.fillRect(w * 0.5 * (1 - on), axisY - 6, w * on, 12);
      }

      // axis draws left -> right
      var axisProg = easeOut((t - 0.45) / 1.6);
      if (axisProg > 0) {
        x.strokeStyle = BANNER;
        x.lineWidth = 2;
        x.beginPath(); x.moveTo(x0, axisY); x.lineTo(x0 + (x1 - x0) * axisProg, axisY); x.stroke();
        // leading ember while drawing
        if (axisProg < 1) {
          x.fillStyle = SIGNAL;
          x.beginPath(); x.arc(x0 + (x1 - x0) * axisProg, axisY, 2.5, 0, Math.PI * 2); x.fill();
        }
      }

      // ticks stamp in, staggered
      var n = TICKS.length;
      for (var i = 0; i < n; i++) {
        var tp = easeBack((t - (1.5 + i * 0.28)) / 0.45);
        if (tp <= 0) continue;
        var tx = x0 + (x1 - x0) * (i / (n - 1));
        var last = i === n - 1;
        var col = last ? GOLD : PAPERDIM;
        var th = 9 * Math.min(tp, 1.15);
        x.strokeStyle = col;
        x.globalAlpha = clamp01(tp);
        x.lineWidth = last ? 2 : 1.5;
        x.beginPath(); x.moveTo(tx, axisY - th); x.lineTo(tx, axisY + th); x.stroke();
        x.textAlign = "center";
        x.fillStyle = last ? GOLD : PAPER;
        x.font = "600 12px " + MONO;
        x.fillText(TICKS[i][0], tx, axisY - 18);
        x.fillStyle = "rgba(185,167,143,0.55)";
        x.font = "10px " + MONO;
        x.fillText(TICKS[i][1], tx, axisY + 26);
        x.globalAlpha = 1;
      }

      // looping signal pulse with trail
      var loopT = t - 3.6;
      if (loopT > 0 || REDUCED) {
        var frac = REDUCED ? 0.62 : (loopT * speed / 9) % 1;
        var px = x0 + (x1 - x0) * frac;
        // trail
        var grad = x.createLinearGradient(px - 90, 0, px, 0);
        grad.addColorStop(0, "rgba(255,43,61,0)");
        grad.addColorStop(1, "rgba(255,43,61,0.55)");
        x.strokeStyle = grad;
        x.lineWidth = 2;
        x.beginPath(); x.moveTo(Math.max(x0, px - 90), axisY); x.lineTo(px, axisY); x.stroke();
        // head glow
        x.fillStyle = "rgba(255,43,61,0.18)";
        x.beginPath(); x.arc(px, axisY, 10, 0, Math.PI * 2); x.fill();
        x.fillStyle = SIGNAL;
        x.beginPath(); x.arc(px, axisY, 3, 0, Math.PI * 2); x.fill();
        // brighten the tick being passed + teal blip above it
        for (var j = 0; j < n; j++) {
          var jx = x0 + (x1 - x0) * (j / (n - 1));
          var d = Math.abs(px - jx);
          if (d < 26) {
            var k = 1 - d / 26;
            x.strokeStyle = "rgba(255,43,61," + (0.8 * k) + ")";
            x.lineWidth = 2;
            x.beginPath(); x.moveTo(jx, axisY - 11); x.lineTo(jx, axisY + 11); x.stroke();
            x.fillStyle = "rgba(63,216,196," + (0.9 * k) + ")";
            x.beginPath(); x.arc(jx, axisY - 34, 1.8, 0, Math.PI * 2); x.fill();
          }
        }
      }

      // status line types in
      var chars = REDUCED ? STATUS.length : Math.floor(Math.max(0, t - 0.6) * 24);
      readSpan.textContent = STATUS.slice(0, chars);

      if (!live && t > 3.6) { live = true; root.classList.add("rb-live"); }
      if (!REDUCED && t > tearAt) {
        tearAt = t + 7 + Math.random() * 6;
        root.classList.remove("rb-tear");
        void root.offsetWidth;
        root.classList.add("rb-tear");
      }

      if (!REDUCED) schedule();
    }
    // rAF with a watchdog: some embedded previews never fire rAF — fall back to timers
    var useTimer = false, lastTick = 0;
    function schedule() {
      if (useTimer) { setTimeout(function () { frame(performance.now()); }, 33); return; }
      lastTick = performance.now();
      requestAnimationFrame(function (now) { if (useTimer) return; lastTick = 0; frame(now); });
      setTimeout(function () {
        if (lastTick) { useTimer = true; frame(performance.now()); }
      }, 300);
    }
    schedule();
    return root;
  }

  window.RedBanner = { mount: mount };

  function auto() {
    var el = document.getElementById("banner-hero");
    if (el) mount(el);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
})();
