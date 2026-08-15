/* RED ARCHIVE — progressive, one-shot motion layer */
(function () {
  "use strict";

  var SELECTORS = [
    ".dossier-head", ".sec", ".lineage", ".doctrine", ".figures",
    ".conflict", ".epoch", ".file-era", ".annex-grid > *", ".cta-band",
    ".plate", ".clip"
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
    }, { threshold: 0.12 });

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  armReveals();
})();
