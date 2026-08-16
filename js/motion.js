/* RED ARCHIVE — progressive, one-shot motion layer */
(function () {
  "use strict";

  /* Reveal targets. Grids reveal per child so siblings stagger; single
     surfaces reveal as a block. Order matters only for --reveal-index. */
  var SELECTORS = [
    ".dossier-head", ".sec", ".lineage > *", ".doctrine > article",
    ".figures > figure", ".conflict", ".epoch", ".timeline > li",
    ".file-era", ".annex-grid > *", ".cta-band", ".schism-list > *",
    ".pull", ".plate", ".clip", ".dossier > .table-wrap", ".dossier > table"
  ];

  function reveal(target) {
    target.classList.add("is-visible");
  }

  function armReveals() {
    var targets = document.querySelectorAll(SELECTORS.join(", "));
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    targets.forEach(function (target, index) {
      target.setAttribute("data-reveal", "");
      target.style.setProperty("--reveal-index", index % 6);
    });
    document.documentElement.classList.add("motion-ready");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  /* Page heads: stagger the eyebrow / title / subtitle / meta rows once on
     load. Pure CSS keyframes keyed off this class so a page without JS still
     paints the head at full opacity. */
  function armHead() {
    var head = document.querySelector(".hero, .dossier-head");
    if (!head) return;
    var rows = head.querySelectorAll(
      ".eyebrow, .file-no, h1, .tagline, .subtitle, .hero-meta, .stamp-row, .hero-route-panel"
    );
    rows.forEach(function (row, index) {
      row.style.setProperty("--head-index", index);
    });
    head.classList.add("head-armed");
  }

  armHead();
  armReveals();
})();
