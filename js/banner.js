(function () {
  "use strict";

  var TICKS = [
    ["1516", "Utopia"], ["1848", "Manifesto"], ["1871", "Commune"],
    ["1917", "October"], ["1949", "Beijing"], ["1991", "Dissolution"],
    ["Now", "Archive"]
  ];

  function mount(host) {
    host.innerHTML = "";

    var root = document.createElement("figure");
    root.className = "rb";

    var route = document.createElement("ol");
    route.className = "rb-route";
    route.setAttribute("aria-label", "Archive route from 1516 to now");

    TICKS.forEach(function (tick) {
      var stop = document.createElement("li");
      stop.className = "rb-stop";

      var year = document.createElement("span");
      year.className = "rb-year";
      year.textContent = tick[0];

      var event = document.createElement("span");
      event.className = "rb-event";
      event.textContent = tick[1];

      stop.appendChild(year);
      stop.appendChild(event);
      route.appendChild(stop);
    });

    var label = document.createElement("figcaption");
    label.className = "rb-label";
    label.textContent = "Five centuries · twenty schools · thirteen recorded schisms";

    root.appendChild(route);
    root.appendChild(label);
    host.appendChild(root);
    return root;
  }

  window.RedBanner = { mount: mount };

  function auto() {
    var host = document.getElementById("banner-hero");
    if (host) mount(host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", auto);
  } else {
    auto();
  }
})();
