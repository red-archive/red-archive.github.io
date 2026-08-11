/* RED ARCHIVE — lineage tree: red-star circuit diagram (index page) */
(function () {
  "use strict";

  var W = 1400, H = 880;

  // chronological columns, hand-placed like a subway map
  var NODES = [
    { id: "utopian",       label: "UTOPIAN SOCIALISM", year: "1516–1840s", x: 110,  y: 430 },
    { id: "marxism",       label: "MARXISM",           year: "1848",       x: 315,  y: 430 },
    { id: "anarcho",       label: "ANARCHO-COMMUNISM", year: "1876",       x: 430,  y: 710 },
    { id: "orthodox",      label: "ORTHODOX MARXISM",  year: "1889",       x: 530,  y: 290 },
    { id: "deleonism",     label: "DE LEONISM",        year: "1895",       x: 530,  y: 565 },
    { id: "leninism",      label: "LENINISM",          year: "1902",       x: 672,  y: 430 },
    { id: "luxemburgism",  label: "LUXEMBURGISM",      year: "1906",       x: 700,  y: 170 },
    { id: "westernmarxism",label: "WESTERN MARXISM",   year: "1923",       x: 762,  y: 62  },
    { id: "leftcom",       label: "LEFT COMMUNISM",    year: "1918",       x: 905,  y: 235 },
    { id: "trotskyism",    label: "TROTSKYISM",        year: "1923",       x: 885,  y: 375 },
    { id: "ml",            label: "MARXISM–LENINISM",  year: "1924",       x: 885,  y: 530 },
    { id: "maoism",        label: "MAOISM",            year: "1949",       x: 1015, y: 655 },
    { id: "titoism",       label: "TITOISM",           year: "1948",       x: 1045, y: 480 },
    { id: "guevarism",     label: "GUEVARISM",         year: "1959",       x: 1055, y: 340 },
    { id: "posadism",      label: "POSADISM",          year: "1962",       x: 1040, y: 195 },
    { id: "autonomism",    label: "AUTONOMISM",        year: "1961",       x: 1010, y: 72  },
    { id: "juche",         label: "JUCHE",             year: "1955",       x: 1245, y: 545 },
    { id: "hoxhaism",      label: "HOXHAISM",          year: "1961",       x: 1195, y: 705 },
    { id: "eurocom",       label: "EUROCOMMUNISM",     year: "1975",       x: 1245, y: 400 },
    { id: "dengism",       label: "DENGISM",           year: "1978",       x: 1270, y: 800 }
  ];

  var PAGES = {
    utopian: "utopian-socialism", marxism: "marxism", anarcho: "anarcho-communism",
    orthodox: "orthodox-marxism", deleonism: "de-leonism", leninism: "leninism",
    luxemburgism: "luxemburgism", westernmarxism: "western-marxism", leftcom: "left-communism",
    trotskyism: "trotskyism", ml: "marxism-leninism", maoism: "maoism", titoism: "titoism",
    guevarism: "guevarism", posadism: "posadism", autonomism: "autonomism",
    juche: "juche", hoxhaism: "hoxhaism", eurocom: "eurocommunism", dengism: "dengism"
  };

  // descent = solid gold / influence = dashed teal / schism = red
  var EDGES = [
    ["utopian", "marxism", "descent"],
    ["marxism", "orthodox", "descent"],
    ["marxism", "deleonism", "descent"],
    ["marxism", "leninism", "descent"],
    ["marxism", "westernmarxism", "descent"],
    ["orthodox", "luxemburgism", "descent"],
    ["luxemburgism", "leftcom", "descent"],
    ["leninism", "trotskyism", "descent"],
    ["leninism", "ml", "descent"],
    ["ml", "titoism", "descent"],
    ["ml", "maoism", "descent"],
    ["ml", "juche", "descent"],
    ["ml", "hoxhaism", "descent"],
    ["ml", "guevarism", "descent"],
    ["ml", "eurocom", "descent"],
    ["trotskyism", "posadism", "descent"],
    ["maoism", "dengism", "descent"],
    ["westernmarxism", "autonomism", "descent"],

    ["utopian", "anarcho", "influence"],
    ["leninism", "westernmarxism", "influence"],
    ["maoism", "guevarism", "influence"],
    ["maoism", "hoxhaism", "influence"],
    ["leftcom", "autonomism", "influence"],
    ["westernmarxism", "eurocom", "influence"],

    ["marxism", "anarcho", "schism"],
    ["orthodox", "leninism", "schism"],
    ["leninism", "leftcom", "schism"],
    ["trotskyism", "ml", "schism"],
    ["ml", "titoism", "schism"],
    ["ml", "maoism", "schism"],
    ["maoism", "hoxhaism", "schism"],
    ["ml", "eurocom", "schism"],
    ["maoism", "dengism", "schism"]
  ];

  var ERAS = [
    { x: 40,   t: "PROPHETS 1516–1847" },
    { x: 340,  t: "FOUNDATION 1848–88" },
    { x: 600,  t: "INTERNATIONALS 1889–1917" },
    { x: 900,  t: "SPLIT DECADES 1918–45" },
    { x: 1150, t: "COLD WAR HERESIES 1946–NOW" }
  ];

  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function starPoints(cx, cy, rOut, rIn) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var r = i % 2 === 0 ? rOut : rIn;
      var a = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(" ");
  }

  function byId(id) {
    for (var i = 0; i < NODES.length; i++) if (NODES[i].id === id) return NODES[i];
    return null;
  }

  function edgePath(a, b, type) {
    var x1 = a.x + 16, y1 = a.y, x2 = b.x - 16, y2 = b.y;
    if (x2 < x1) { x1 = a.x - 16; x2 = b.x + 16; }
    var mx = (x1 + x2) / 2;
    var bend = type === "schism" ? 26 : 0; // schisms arc away from the descent line
    return "M " + x1 + " " + y1 +
      " C " + mx + " " + (y1 + bend) + ", " + mx + " " + (y2 + bend) + ", " + x2 + " " + y2;
  }

  function render() {
    var host = document.getElementById("tree-canvas");
    if (!host) return;

    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Lineage tree of communist schools of thought, 1516 to present" });

    // era labels + faint column rules
    ERAS.forEach(function (e) {
      var t = el("text", { x: e.x, y: 28, fill: "rgba(185,167,143,0.5)",
        "font-family": "IBM Plex Mono, monospace", "font-size": "10.5",
        "letter-spacing": "2" });
      t.textContent = e.t;
      svg.appendChild(t);
    });

    var edgeEls = [];
    EDGES.forEach(function (E) {
      var a = byId(E[0]), b = byId(E[1]);
      var p = el("path", { d: edgePath(a, b, E[2]), class: "t-edge " + E[2] });
      p.dataset.from = E[0];
      p.dataset.to = E[1];
      svg.appendChild(p);
      edgeEls.push(p);
    });

    var nodeEls = {};
    NODES.forEach(function (n) {
      var g = el("g", { class: "t-node", tabindex: "0", role: "link",
        "aria-label": n.label + ", " + n.year });
      g.appendChild(el("polygon", { points: starPoints(n.x, n.y, 13, 5.5), class: "t-star" }));
      var labelAbove = n.y > H - 90; // bottom row: keep label on-canvas
      var t1 = el("text", { x: n.x, y: labelAbove ? n.y - 34 : n.y + 30, "text-anchor": "middle" });
      t1.textContent = n.label;
      var t2 = el("text", { x: n.x, y: labelAbove ? n.y - 21 : n.y + 44, "text-anchor": "middle", class: "t-year" });
      t2.textContent = n.year;
      g.appendChild(t1);
      g.appendChild(t2);

      function go() { window.location.href = "schools/" + PAGES[n.id] + ".html"; }
      g.addEventListener("click", go);
      g.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); }
      });

      g.addEventListener("mouseenter", function () { light(n.id); });
      g.addEventListener("mouseleave", clearLight);
      g.addEventListener("focus", function () { light(n.id); });
      g.addEventListener("blur", clearLight);

      svg.appendChild(g);
      nodeEls[n.id] = g;
    });

    function light(id) {
      var neighbors = {};
      neighbors[id] = true;
      edgeEls.forEach(function (p) {
        var hit = p.dataset.from === id || p.dataset.to === id;
        p.classList.toggle("lit", hit);
        p.classList.toggle("dim", !hit);
        if (hit) { neighbors[p.dataset.from] = true; neighbors[p.dataset.to] = true; }
      });
      NODES.forEach(function (n) {
        nodeEls[n.id].classList.toggle("lit", n.id === id);
        nodeEls[n.id].classList.toggle("dim", !neighbors[n.id]);
      });
    }
    function clearLight() {
      edgeEls.forEach(function (p) { p.classList.remove("lit", "dim"); });
      NODES.forEach(function (n) { nodeEls[n.id].classList.remove("lit", "dim"); });
    }

    host.appendChild(svg);
  }

  document.addEventListener("DOMContentLoaded", render);
})();
