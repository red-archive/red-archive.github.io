#!/usr/bin/env node
/* Verify the classification protocol in js/quiz.js.
   - every tree edge resolves to a node or a result
   - every result is reachable (tree leaf, or screening verdict)
   - every screening question has at least one clean "line" option
   - the four honest personas land where the design says they should
   Run: node scripts/verify-quiz.js */

"use strict";

var fs = require("fs");
var path = require("path");

var src = fs.readFileSync(path.join(__dirname, "..", "js", "quiz.js"), "utf8");
var win = {};
var doc = { addEventListener: function () {} };
new Function("window", "document", src)(win, doc);
var Q = win.RedQuiz;

var errors = [];
function fail(msg) { errors.push(msg); }

/* ---- structural ------------------------------------------------------ */

Object.keys(Q.QUESTIONS).forEach(function (k) {
  var node = Q.QUESTIONS[k];
  var keys = node.opts.map(function (o) { return o.k; });
  if (new Set(keys).size !== keys.length) fail("duplicate option key in " + k);
  if (!node.gloss) fail("no gloss on tree node " + k);
  node.opts.forEach(function (o) {
    if (!(o.next in Q.QUESTIONS) && !(o.next in Q.RESULTS)) fail("dangling edge " + k + " -> " + o.next);
  });
});

Q.SCREEN.forEach(function (s) {
  var keys = s.opts.map(function (o) { return o.k; });
  if (new Set(keys).size !== keys.length) fail("duplicate option key in " + s.id);
  if (!s.gloss) fail("no gloss on screening question " + s.id);
  var clean = s.opts.filter(function (o) { return !o.fail && !o.larp && !o.flag; });
  if (!clean.length) fail(s.id + " has no clean line option");
  s.opts.forEach(function (o) {
    if (o.fail && !(o.fail in Q.TESTS)) fail(s.id + " " + o.k + " fails unknown test " + o.fail);
    if (o.larp && !(o.larp in Q.LARP)) fail(s.id + " " + o.k + " points at unknown formation " + o.larp);
  });
});

/* ---- reachability ----------------------------------------------------- */

var reachable = new Set();
Object.values(Q.QUESTIONS).forEach(function (n) {
  n.opts.forEach(function (o) { if (o.next in Q.RESULTS) reachable.add(o.next); });
});

// simulate screening exhaustively; record which larp verdicts appear
function simulate(picks) {
  Q.reset();
  var st = Q.state();
  Q.SCREEN.forEach(function (s, i) {
    var o = s.opts[picks[i]];
    if (o.fail) {
      st.failAnswers += 1;
      if (!st.fails[o.fail]) st.fails[o.fail] = { q: s.q, tag: o.tag, id: s.id };
    }
    if (o.larp) st.larp[o.larp] = (st.larp[o.larp] || 0) + 1;
    if (o.flag) st.flags[o.flag] = (st.flags[o.flag] || 0) + 1;
  });
  return { verdict: Q.screeningVerdict(), st: st };
}

var counts = {};
var total = 1;
var sizes = Q.SCREEN.map(function (s) { return s.opts.length; });
sizes.forEach(function (n) { total *= n; });
var picks = sizes.map(function () { return 0; });
for (var i = 0; i < total; i++) {
  var r = simulate(picks);
  var key = r.verdict || "TREE";
  counts[key] = (counts[key] || 0) + 1;
  if (r.verdict) reachable.add(r.verdict);
  // increment mixed radix
  for (var d = picks.length - 1; d >= 0; d--) {
    picks[d] += 1;
    if (picks[d] < sizes[d]) break;
    picks[d] = 0;
  }
}

Object.keys(Q.RESULTS).forEach(function (k) {
  if (!reachable.has(k)) fail("unreachable result " + k);
});

/* ---- personas --------------------------------------------------------- */

function byTag(tags) {
  return Q.SCREEN.map(function (s, i) {
    var idx = s.opts.findIndex(function (o) { return o.tag === tags[i]; });
    if (idx < 0) throw new Error("no option tagged " + tags[i] + " on " + s.id);
    return idx;
  });
}

var personas = [
  { name: "disciplined ML", expect: null,
    tags: ["EXPROPRIATE", "CLASS", "TRANSITIONAL", "MAIN ENEMY AT HOME", "THE BRANCH", "THE TRIBUNE", "THE PROGRAM", "SOCIAL DEMOCRACY", "THE SOVIET LINE", "THE EMBLEM"] },
  { name: "Trotskyist", expect: null,
    tags: ["EXPROPRIATE", "CLASS", "TRANSITIONAL", "MAIN ENEMY AT HOME", "THE BRANCH", "THE TRIBUNE", "THE PROGRAM", "SOCIAL DEMOCRACY", "CONFIRMATION", "A FACE"] },
  { name: "anarcho-communist", expect: null,
    tags: ["FREE FEDERATION", "CLASS", "TRANSITIONAL", "MAIN ENEMY AT HOME", "DIRECT ACTION", "NOTHING", "NO MASTERS", "SOCIAL DEMOCRACY", "ANTI-REVISIONIST", "RED-AND-BLACK"] },
  { name: "DSA member who says communist", expect: "R_dsa",
    tags: ["ANTITRUST", "CLASS", "DEMOCRATIC SOCIALISM", "MAIN ENEMY AT HOME", "THE CHAPTER", "ANY BALLOT LINE", "THE PROGRAM", "BIG TENT", "THE SOVIET LINE", "A FACE"] },
  { name: "progressive NGO", expect: "R_progressive",
    tags: ["ANTITRUST", "INTERSECTING", "TRANSITIONAL", "MAIN ENEMY AT HOME", "THE NGO", "VOTE BLUE, PUSH LEFT", "THE PLATFORM", "SOCIAL DEMOCRACY", "THE SOVIET LINE", "A FACE"] },
  { name: "anime avatar tankie", expect: "R_avatar",
    tags: ["EXPROPRIATE", "CLASS", "REFUSE REFORM", "ANTI-IMPERIALIST", "NOWHERE YET", "THE TRIBUNE", "THE PROGRAM", "NOT A PARTY", "ALL OF IT", "ANIME + SICKLE"] },
  { name: "chat subscriber", expect: "R_streamer",
    tags: ["EXPROPRIATE", "CLASS", "TRANSITIONAL", "MAIN ENEMY AT HOME", "THE TIMELINE", "THE TRIBUNE", "THE PROGRAM", "SOCIAL DEMOCRACY", "THE SOVIET LINE", "THE SUB BADGE"] },
  { name: "black-flag poser", expect: "R_blackflag",
    tags: ["FREE FEDERATION", "CLASS", "TRANSITIONAL", "MAIN ENEMY AT HOME", "DIRECT ACTION", "NOTHING", "THE STACK", "SOCIAL DEMOCRACY", "ANTI-REVISIONIST", "RED + BLACK"] }
];

personas.forEach(function (p) {
  var r = simulate(byTag(p.tags));
  if (r.verdict !== p.expect) {
    fail("persona '" + p.name + "' expected " + (p.expect || "clean") + " got " + (r.verdict || "clean") +
      " (fails " + Object.keys(r.st.fails).join(",") + "; larp " + JSON.stringify(r.st.larp) + ")");
  }
});

/* ---- report ----------------------------------------------------------- */

var summary = Object.keys(counts).sort().map(function (k) { return k + "=" + counts[k]; }).join(" ");
if (errors.length) {
  console.error("FAIL: " + errors.length + " problem(s)");
  errors.forEach(function (e) { console.error("  - " + e); });
  console.error("screening outcomes over " + total + " paths: " + summary);
  process.exit(1);
}
console.log("PASS: " + Object.keys(Q.RESULTS).length + " results reachable; " + Q.SCREEN.length + " screens, " +
  Object.keys(Q.QUESTIONS).length + " tree nodes; " + personas.length + " personas as designed");
console.log("screening outcomes over " + total + " paths: " + summary);
