/* RED ARCHIVE — shared chrome: nav, footer, portrait fallbacks */
(function () {
  "use strict";

  // pages under /schools/ need a ../ prefix for root links
  var inSchools = window.location.pathname.indexOf("/schools/") !== -1;
  var R = inSchools ? "../" : "";

  var primaryLinks = [
    { href: "index.html", label: "Atlas", page: "index.html" },
    { href: "index.html#files", label: "Files", page: "files" },
    { href: "timeline.html", label: "Timeline" },
    { href: "conflicts.html", label: "Schisms" },
    { href: "gallery.html", label: "Plates" },
    { href: "quiz.html", label: "Quiz" }
  ];

  var annexLinks = [
    { href: "the-line.html", label: "The Line" },
    { href: "the-ledger.html", label: "The Ledger" },
    { href: "register.html", label: "Register" },
    { href: "faith.html", label: "Faith" },
    { href: "britain.html", label: "Britain" },
    { href: "redbook.html", label: "Red Book" }
  ];

  var here = window.location.pathname.split("/").pop() || "index.html";

  // favicon for every page without editing 20 heads
  (function () {
    var ic = document.createElement("link");
    ic.rel = "icon";
    ic.type = "image/png";
    ic.href = R + "assets/favicon.png";
    document.head.appendChild(ic);
  })();

  function pageIs(link) {
    if (inSchools) return link.page === "files";
    if (link.page === "files") return here === "index.html" && window.location.hash === "#files";
    return here === (link.page || link.href);
  }

  function navLink(link) {
    var active = pageIs(link);
    return '<a href="' + R + link.href + '"' + (active ? ' aria-current="page"' : "") + ">" + link.label + "</a>";
  }

  // Sun/moon in one SVG; css/style.css morphs it between states via r/cx/cy.
  var THEME_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<mask id="theme-icon-cut"><rect width="24" height="24" fill="#fff"/><circle class="theme-icon-mask" r="7" fill="#000"/></mask>' +
    '<circle class="theme-icon-core" cx="12" cy="12" mask="url(#theme-icon-cut)"/>' +
    '<g class="theme-icon-rays" fill="none" stroke-width="2" stroke-linecap="round">' +
    '<line x1="12" y1="1.5" x2="12" y2="3.5"/><line x1="12" y1="20.5" x2="12" y2="22.5"/>' +
    '<line x1="1.5" y1="12" x2="3.5" y2="12"/><line x1="20.5" y1="12" x2="22.5" y2="12"/>' +
    '<line x1="4.6" y1="4.6" x2="6" y2="6"/><line x1="18" y1="18" x2="19.4" y2="19.4"/>' +
    '<line x1="4.6" y1="19.4" x2="6" y2="18"/><line x1="18" y1="6" x2="19.4" y2="4.6"/>' +
    "</g></svg>";

  function themeLabel(theme) {
    return theme === "dark" ? "Night" : "Dawn";
  }

  function buildNav() {
    var el = document.getElementById("nav");
    if (!el) return;
    var html = '<nav class="nav" aria-label="Main navigation">';
    html += '<a class="nav-brand" href="' + R + 'index.html"><span class="nav-seal logo-fx"><img src="' + R + 'assets/red-archive-logo.png" width="28" height="28" alt=""></span>RED_ARCHIVE <span style="opacity:.55">v19.17</span></a>';
    html += '<div id="nav-panel" class="nav-panel"><div class="nav-primary">';
    primaryLinks.forEach(function (link) { html += navLink(link); });
    html += "</div>";
    html += '<details class="nav-annexes"><summary>Annexes <span aria-hidden="true">＋</span></summary><div class="nav-annexes-links">';
    annexLinks.forEach(function (link) { html += navLink(link); });
    html += "</div></details></div>";
    html += '<button id="theme-toggle" class="theme-toggle" type="button">' + THEME_ICON + '<span class="theme-toggle-label" aria-hidden="true"></span></button>';
    html += '<button id="nav-toggle" class="nav-toggle" type="button" aria-controls="nav-panel" aria-expanded="false"><span>Explore</span><span aria-hidden="true">＋</span></button>';
    html += "</nav>";
    el.outerHTML = html;
  }

  function armThemeToggle() {
    var button = document.getElementById("theme-toggle");
    var api = window.RedArchiveTheme;
    if (!button) return;
    if (!api) { button.hidden = true; return; } // theme.js missing: no dead control

    var label = button.querySelector(".theme-toggle-label");

    function paint(theme) {
      var next = theme === "dark" ? "light" : "dark";
      label.textContent = themeLabel(theme);
      button.setAttribute("aria-label", "Switch to " + themeLabel(next).toLowerCase() + " theme");
      button.title = "Theme: " + themeLabel(theme) + " (Rosé Pine)";
    }

    paint(api.current());
    document.addEventListener("themechange", function (event) { paint(event.detail.theme); });

    button.addEventListener("click", function () {
      var box = button.getBoundingClientRect();
      api.toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
    });
  }

  function armNavigation() {
    var toggle = document.getElementById("nav-toggle");
    var panel = document.getElementById("nav-panel");
    if (!toggle || !panel) return;

    function closePanel(returnFocus) {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        closePanel(true);
      }
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 760px)").matches) closePanel(false);
      });
    });
  }

  function buildFooter() {
    var el = document.getElementById("footer");
    if (!el) return;
    el.outerHTML =
      '<footer class="footer"><div class="footer-grid">' +
      '<section><h2>About</h2><p><span class="star">★</span> RED_ARCHIVE — a historical &amp; educational atlas of communist thought. ' +
      "The archive holds a line \u2014 Marxist\u2013Leninist, and stated openly rather than smuggled. Every school is " +
      "documented with its crimes, schisms and critics intact, and every verdict shows the test that produced it.</p>" +
      '<p>Portraits hotlinked from <a href="https://commons.wikimedia.org" rel="noopener">Wikimedia Commons</a> ' +
      "(public domain / CC licenses); offline or missing images degrade to archive placeholders. Text written for this archive.</p>" +
      '<p>Open source, no build step and no analytics: <a href="https://github.com/red-archive/red-archive.github.io" rel="noopener">source on GitHub</a>. Corrections and sourced additions welcome.</p></section>' +
      '<section><h2>Explore</h2><ul><li><a href="' + R + 'index.html#files">20 dossiers</a></li><li><a href="' + R + 'timeline.html">master timeline</a></li><li><a href="' + R + 'conflicts.html">the great schisms</a></li><li><a href="' + R + 'gallery.html">the plate room</a></li><li><a href="' + R + 'quiz.html">classification protocol</a></li></ul></section>' +
      '<section><h2>Annexes</h2><ul><li><a href="' + R + 'the-line.html">the line</a></li><li><a href="' + R + 'the-ledger.html">the ledger</a></li><li><a href="' + R + 'register.html">the register</a></li><li><a href="' + R + 'faith.html">the faith files</a></li><li><a href="' + R + 'britain.html">the British file</a></li></ul></section>' +
      "</div></footer>";
  }

  // Broken/blocked portraits degrade to a red-star placeholder
  function armPortraits() {
    document.querySelectorAll(".portrait img").forEach(function (img) {
      img.addEventListener("error", function () {
        var ph = img.closest(".ph");
        if (!ph) return;
        img.remove();
        var name = ph.getAttribute("data-name") || "ARCHIVE";
        var fb = document.createElement("div");
        fb.className = "fallback";
        [["star-glyph", "★"], ["", name], ["", "IMG LOST"]].forEach(function (s) {
          var span = document.createElement("span");
          if (s[0]) span.className = s[0];
          span.textContent = s[1];
          fb.appendChild(span);
        });
        ph.appendChild(fb);
      });
      // cached-error case
      if (img.complete && img.naturalWidth === 0) {
        img.dispatchEvent(new Event("error"));
      }
    });
  }

  function classifyPage() {
    var className = inSchools ? "page-school" :
      here === "index.html" ? "page-home" :
      here === "quiz.html" ? "page-quiz" : "page-reference";
    document.body.classList.add(className);
    if (document.querySelector(".lineage")) document.body.classList.add("has-lineage");
  }

  document.addEventListener("DOMContentLoaded", function () {
    classifyPage();
    buildNav();
    armNavigation();
    armThemeToggle();
    buildFooter();
    armPortraits();
  });
})();
