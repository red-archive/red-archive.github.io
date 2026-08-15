/* RED ARCHIVE — theme: Rosé Pine Dawn (light) / Rosé Pine (dark)
   Loaded synchronously in <head>, before the stylesheet, so the saved choice
   lands on <html data-theme> before first paint and no flash of the wrong
   theme occurs. Everything else here is inert until shared.js calls
   window.RedArchiveTheme.toggle() from the header button. */
(function () {
  "use strict";

  var STORAGE_KEY = "red-archive-theme";
  var THEME_COLOR = { light: "#faf4ed", dark: "#191724" };
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function systemTheme() {
    return media && media.matches ? "dark" : "light";
  }

  function current() {
    return root.getAttribute("data-theme") || systemTheme();
  }

  function paintMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = THEME_COLOR[theme];
  }

  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    paintMeta(theme);
    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, theme); } catch (_) { /* private mode */ }
    }
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Animated switch. Preferred path: View Transitions API — snapshot the old
     page, swap the theme, then wipe the new snapshot in as a circle growing
     from the point of interaction. Fallback: a class on <html> that turns on
     colour transitions everywhere for one --theme-duration. Reduced motion
     skips both and swaps instantly. */
  function switchTo(theme, origin) {
    if (reduceMotion() || typeof document.startViewTransition !== "function") {
      root.classList.add("theme-transition");
      apply(theme, true);
      window.setTimeout(function () { root.classList.remove("theme-transition"); }, 600);
      return;
    }

    var x = origin && typeof origin.x === "number" ? origin.x : window.innerWidth / 2;
    var y = origin && typeof origin.y === "number" ? origin.y : window.innerHeight / 2;
    var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    var transition = document.startViewTransition(function () { apply(theme, true); });
    transition.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
        { duration: 650, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () { /* transition skipped; theme already applied */ });
  }

  // Boot: honour a saved choice, otherwise follow the system and keep following it.
  var saved = stored();
  if (saved) {
    root.setAttribute("data-theme", saved);
  }
  document.addEventListener("DOMContentLoaded", function () { paintMeta(current()); });

  if (media && media.addEventListener) {
    media.addEventListener("change", function () {
      if (stored()) return; // explicit choice wins over the OS
      root.classList.add("theme-transition");
      root.removeAttribute("data-theme");
      paintMeta(systemTheme());
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: systemTheme() } }));
      window.setTimeout(function () { root.classList.remove("theme-transition"); }, 600);
    });
  }

  window.RedArchiveTheme = {
    current: current,
    toggle: function (origin) {
      switchTo(current() === "dark" ? "light" : "dark", origin);
    }
  };
})();
