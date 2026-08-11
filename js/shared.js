/* RED ARCHIVE — shared chrome: nav, footer, portrait fallbacks */
(function () {
  "use strict";

  // pages under /schools/ need a ../ prefix for root links
  var inSchools = window.location.pathname.indexOf("/schools/") !== -1;
  var R = inSchools ? "../" : "";

  var links = [
    { href: "index.html", label: "Tree" },
    { href: "index.html#files", label: "Files" },
    { href: "timeline.html", label: "Timeline" },
    { href: "conflicts.html", label: "Schisms" },
    { href: "the-line.html", label: "The Line" },
    { href: "the-ledger.html", label: "The Ledger" },
    { href: "register.html", label: "Register" },
    { href: "quiz.html", label: "Classify Me" }
  ];

  var here = window.location.pathname.split("/").pop() || "index.html";

  function buildNav() {
    var el = document.getElementById("nav");
    if (!el) return;
    var html = '<nav class="nav" aria-label="Main">';
    html += '<a class="nav-brand" href="' + R + 'index.html"><span class="star">★</span> RED_ARCHIVE <span style="opacity:.55">v19.17</span></a>';
    html += '<div class="nav-links">';
    links.forEach(function (l) {
      var active = !inSchools && here === l.href.split("#")[0] && l.href.indexOf("#") === -1;
      html += '<a href="' + R + l.href + '"' + (active ? ' class="active"' : "") + ">" + l.label + "</a>";
    });
    html += "</div>";
    html += '<span class="nav-clock" id="nav-clock" aria-hidden="true"></span>';
    html += "</nav>";
    el.outerHTML = html;
  }

  function buildFooter() {
    var el = document.getElementById("footer");
    if (!el) return;
    el.outerHTML =
      '<footer class="footer">' +
      '<span class="star">★</span> RED_ARCHIVE — a historical &amp; educational atlas of communist thought. ' +
      "Not propaganda for any tendency; every school documented with its crimes, schisms and critics intact.<br>" +
      'Portraits hotlinked from <a href="https://commons.wikimedia.org" rel="noopener">Wikimedia Commons</a> ' +
      "(public domain / CC licenses); offline or missing images degrade to archive placeholders. " +
      "Text written for this archive.<br>" +
      'FILE INDEX: <a href="' + R + 'index.html#files">20 dossiers</a> · ' +
      '<a href="' + R + 'timeline.html">master timeline</a> · ' +
      '<a href="' + R + 'conflicts.html">the great schisms</a> · ' +
      '<a href="' + R + 'the-line.html">annex a: the line</a> · ' +
      '<a href="' + R + 'the-ledger.html">annex b: the ledger</a> · ' +
      '<a href="' + R + 'register.html">annex c: the register</a> · ' +
      '<a href="' + R + 'quiz.html">classification protocol</a>' +
      "</footer>";
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

  function clock() {
    var el = document.getElementById("nav-clock");
    if (!el) return;
    function tick() {
      var d = new Date();
      var p = function (n) { return (n < 10 ? "0" : "") + n; };
      el.textContent = "SYS " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildNav();
    buildFooter();
    armPortraits();
    clock();
  });
})();
