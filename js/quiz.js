/* RED ARCHIVE — ideological classification protocol
   A branching decision tree: every answer is a fork in the lineage tree. */
(function () {
  "use strict";

  var QUESTIONS = {
    root: {
      depth: "ROOT NODE",
      q: "How does capitalism actually end?",
      sub: "The first fork in every communist argument since 1848.",
      opts: [
        { k: "A", t: "It is overthrown — a revolutionary rupture led by the organized working class.", next: "rev", tag: "RUPTURE" },
        { k: "B", t: "It is transformed gradually, through elections, unions and existing institutions.", next: "reform", tag: "TRANSFORMATION" },
        { k: "C", t: "People walk out of it and build the new world directly — communes, mutual aid, free federation.", next: "commune", tag: "EXODUS" },
        { k: "D", t: "Wrong question — first explain why it hasn't ended. The revolution failed for a reason.", next: "theory", tag: "DIAGNOSIS" }
      ]
    },
    rev: {
      depth: "BRANCH 1 // RUPTURE",
      q: "Who leads the rupture?",
      sub: "Every revolutionary school answers this differently — and shoots over the difference.",
      opts: [
        { k: "A", t: "A vanguard party of professional revolutionaries, organized like an army.", next: "vanguard", tag: "VANGUARD" },
        { k: "B", t: "The class itself — mass strikes and workers' councils. Parties can only assist or betray.", next: "council", tag: "COUNCILS" },
        { k: "C", t: "A guerrilla army rooted in the peasantry and the countryside.", next: "guerrilla", tag: "GUERRILLA" }
      ]
    },
    vanguard: {
      depth: "BRANCH 2 // VANGUARD",
      q: "The vanguard has taken power. The world revolution hasn't come. Now what?",
      sub: "Petrograd, 1921. The telegrams from Berlin have stopped. Choose.",
      opts: [
        { k: "A", t: "Build socialism in one country — fortress, plan, discipline. Hold what we have.", next: "fortress", tag: "ONE COUNTRY" },
        { k: "B", t: "Spread the revolution or die. There is no national socialism — permanent revolution.", next: "R_trotskyism", tag: "PERMANENT REV" },
        { k: "C", t: "Return to the party's original discipline and program — the instrument, kept clean, before and above whoever later wielded it.", next: "R_leninism", tag: "THE INSTRUMENT" }
      ]
    },
    fortress: {
      depth: "BRANCH 3 // FORTRESS",
      q: "The fortress holds. Then Moscow drifts after 1953. Your line?",
      sub: "The Secret Speech has leaked. Every party on earth must answer it.",
      opts: [
        { k: "A", t: "Defend the orthodox party-state — the Soviet line, through every zig and zag.", next: "R_ml", tag: "ORTHODOXY" },
        { k: "B", t: "Moscow betrayed the revolution in 1956. Only the pure line remains — hold it alone if needed.", next: "R_hoxhaism", tag: "ANTI-REVISIONISM" },
        { k: "C", t: "National roads: self-managed factories, non-alignment, no diktat from any capital.", next: "R_titoism", tag: "SELF-MANAGEMENT" },
        { k: "D", t: "The nation relies on itself alone; the Leader embodies its will, and the line is inherited.", next: "R_juche", tag: "SELF-RELIANCE" }
      ]
    },
    council: {
      depth: "BRANCH 2 // COUNCILS",
      q: "Councils it is. And parliaments, and the official trade unions?",
      sub: "The question Lenin called an infantile disorder — and the left called the whole point.",
      opts: [
        { k: "A", t: "Use them — as tribunes, as schools of struggle — while the mass strike ripens.", next: "R_luxemburgism", tag: "MASS STRIKE" },
        { k: "B", t: "Abandon them. They domesticate the class. All power to the workers' councils alone.", next: "R_leftcom", tag: "COUNCILS ONLY" }
      ]
    },
    guerrilla: {
      depth: "BRANCH 2 // GUERRILLA",
      q: "The countryside rises. What's the strategy?",
      sub: "Yan'an or the Sierra Maestra — two mountains, two doctrines.",
      opts: [
        { k: "A", t: "Protracted people's war: build base areas, win the masses, encircle the cities over decades.", next: "R_maoism", tag: "PEOPLE'S WAR" },
        { k: "B", t: "Don't wait for conditions — a small armed foco creates them by fighting now.", next: "R_guevarism", tag: "THE FOCO" }
      ]
    },
    reform: {
      depth: "BRANCH 1 // TRANSFORMATION",
      q: "You'll work within the system. Which instrument?",
      sub: "Reform is a strategy, not a mood. Pick your machine.",
      opts: [
        { k: "A", t: "A disciplined workers' party that wins elections while capitalism's contradictions mature.", next: "R_orthodox", tag: "THE PARTY" },
        { k: "B", t: "Mass democratic parties — free of Moscow, committed to pluralism permanently.", next: "R_eurocom", tag: "PLURALISM" },
        { k: "C", t: "The ballot for legitimacy, one big industrial union to actually take over production.", next: "R_deleonism", tag: "INDUSTRIAL UNION" },
        { k: "D", t: "A ruling communist party that lets markets grow the productive forces — under its control.", next: "R_dengism", tag: "MARKET LEVER" }
      ]
    },
    commune: {
      depth: "BRANCH 1 // EXODUS",
      q: "The new world, built directly. Who coordinates it?",
      sub: "No permission asked. But somebody still has to run the granary.",
      opts: [
        { k: "A", t: "Nobody above the communes: free federation, mutual aid, take from the common storehouse.", next: "R_anarcho", tag: "FREE FEDERATION" },
        { k: "B", t: "Enlightened founders design model communities that prove the case by example.", next: "R_utopian", tag: "MODEL COLONY" }
      ]
    },
    theory: {
      depth: "BRANCH 1 // DIAGNOSIS",
      q: "Where did the revolution stall?",
      sub: "The West had the factories, the unions, the crises — and no October. Why?",
      opts: [
        { k: "A", t: "In culture and consciousness — hegemony, ideology, the administered mind.", next: "R_western", tag: "HEGEMONY" },
        { k: "B", t: "It didn't stall — it lives in the workers' daily refusal. Watch the factory, not the party.", next: "R_autonomism", tag: "REFUSAL" },
        { k: "C", t: "It arrives by catastrophe. Even nuclear fire clears the ground — and any civilization that crosses the stars is already communist.", next: "R_posadism", tag: "CATASTROPHE" },
        { k: "D", t: "The diagnosis is the contribution: class struggle, surplus value, history as material process.", next: "R_marxism", tag: "SOURCE CODE" }
      ]
    }
  };

  var RESULTS = {
    R_marxism: { name: "MARXISM", file: "02", page: "marxism",
      desc: "You are the source code. Everyone else in this archive is a fork of you — and each of them claims to be the faithful one. You'd rather get the analysis right than pick a faction, which is exactly what Marx said before adding: the point, however, is to change it.",
      comrades: "Marx, Engels", enemies: "Every misreading — so, arguably, everyone below",
      read: "The Communist Manifesto (1848); Capital I (1867)" },
    R_leninism: { name: "LENINISM", file: "06", page: "leninism",
      desc: "Discipline, organization, and the conviction that revolutions are made, not awaited. You believe in the vanguard as an instrument — and you notice, with some discomfort, how many hands later claimed that instrument.",
      comrades: "Lenin, the Bolsheviks of 1917", enemies: "Kautskyists, spontaneists, and everyone who came after claiming the brand",
      read: "What Is To Be Done? (1902); State and Revolution (1917)" },
    R_trotskyism: { name: "TROTSKYISM", file: "09", page: "trotskyism",
      desc: "Permanent revolution, world revolution, and a lifetime of being right in exile. You keep the October flame while insisting the USSR betrayed it — and you have already mentally split from at least two organizations you haven't joined yet.",
      comrades: "Trotsky, the Left Opposition, the Fourth International(s)", enemies: "Stalinism above all; the feeling is mutual and armed",
      read: "The Revolution Betrayed (1936); The Permanent Revolution (1930)" },
    R_ml: { name: "MARXISM–LENINISM", file: "10", page: "marxism-leninism",
      desc: "The orthodoxy. Party, plan, and socialism in one country — you defend the actually-existing record, warts, purges and all, as the price of holding power in a hostile world. The other schools call you the apparatus; you call them the luxury of never having governed.",
      comrades: "Stalin's Comintern, the Soviet bloc parties", enemies: "Trotskyists, revisionists, imperialists — the list is maintained centrally",
      read: "Foundations of Leninism (1924); History of the CPSU(B): Short Course (1938) — critically" },
    R_maoism: { name: "MAOISM", file: "12", page: "maoism",
      desc: "The countryside surrounds the cities. You trust the masses over the apparatus, believe contradictions continue under socialism, and are prepared to bombard your own headquarters to prove it. Protracted: yes. Patient: no.",
      comrades: "Mao, the Long Marchers, three continents of people's wars", enemies: "Soviet revisionism, then Deng's restoration",
      read: "On Contradiction (1937); Quotations (1964)" },
    R_titoism: { name: "TITOISM", file: "13", page: "titoism",
      desc: "You said no to Stalin and lived. Factories to the workers' councils, foreign policy to nobody's bloc. You'd rather improvise your own socialism than obey anyone else's — and you look better in a marshal's uniform than ideology strictly requires.",
      comrades: "Tito, the Partisans, the Non-Aligned Movement", enemies: "The Cominform, 1948–55; dogmatists of every capital",
      read: "Djilas' The New Class (1957) — the in-house critique" },
    R_hoxhaism: { name: "HOXHAISM", file: "17", page: "hoxhaism",
      desc: "Everyone else is a revisionist. Moscow fell in '56, Belgrade never stood, Beijing fell in '72 — the line is pure and you will hold it alone, in a bunker, forever. There are 170,000 bunkers. You have plans for all of them.",
      comrades: "Hoxha, the Party of Labour of Albania, a small worldwide communion of the pure",
      enemies: "Khrushchevites, Titoites, Maoists — in chronological order of their fall",
      read: "Imperialism and the Revolution (1978)" },
    R_juche: { name: "JUCHE", file: "16", page: "juche",
      desc: "Self-reliance above all: the masses are the master of the revolution, but the Leader is the master of the masses. You have quietly stopped citing Marx altogether. The revolution, conveniently, is hereditary.",
      comrades: "Kim Il-sung, and by constitutional arrangement his descendants",
      enemies: "Flunkeyism (sadae) — dependence on any foreign power",
      read: "On the Juche Idea (1982)" },
    R_luxemburgism: { name: "LUXEMBURGISM", file: "07", page: "luxemburgism",
      desc: "The mass strike is the school of the revolution, and freedom is always the freedom of the one who thinks differently. You are the conscience of this archive: revolutionary against the reformists, democratic against the vanguard — and murdered for both.",
      comrades: "Luxemburg, Liebknecht, the Spartacists", enemies: "Bernstein's revisionism and Lenin's substitutionism, evenhandedly",
      read: "Reform or Revolution (1899); The Mass Strike (1906)" },
    R_leftcom: { name: "LEFT COMMUNISM", file: "08", page: "left-communism",
      desc: "All power to the councils — and none to the party, the unions, or the parliament that will digest them. Lenin called you infantile; you call Kronstadt his confession. You are correct, principled, and magnificently few.",
      comrades: "Pannekoek, Gorter, Bordiga (who would object to being grouped)",
      enemies: "Bolshevism from 1918 onward; social democracy always",
      read: "Lenin's 'Left-Wing' Communism (1920) — as the prosecution's exhibit" },
    R_guevarism: { name: "GUEVARISM", file: "14", page: "guevarism",
      desc: "Conditions are never ready — the foco makes them ready. A dozen rifles in the mountains, revolutionary will over revolutionary patience, and if you die at it, the poster alone will recruit for fifty years.",
      comrades: "Che, Fidel's column of '56, three continents of imitators", enemies: "Waiting. Also the CIA.",
      read: "Guerrilla Warfare (1960); Socialism and Man in Cuba (1965)" },
    R_orthodox: { name: "ORTHODOX MARXISM", file: "05", page: "orthodox-marxism",
      desc: "History is on your side, scientifically; there is no need to rush it with adventures. Build the party, win the vote, educate the class, and wait for capitalism to complete its own gravedigging. You have been waiting since 1889.",
      comrades: "Kautsky, Bebel, the golden-age SPD", enemies: "Revisionists to your right, Bolsheviks to your left",
      read: "The Erfurt Program (1892); The Road to Power (1909)" },
    R_eurocom: { name: "EUROCOMMUNISM", file: "19", page: "eurocommunism",
      desc: "Communism with elections, pluralism and no phone line to Moscow. You watched the tanks in Prague and the coup in Chile and concluded democracy is not a tactic but the road itself. Moscow anathematized you, which you count as a reference.",
      comrades: "Berlinguer, Carrillo, the PCI at a third of the vote", enemies: "Soviet orthodoxy; also, eventually, electoral arithmetic",
      read: "'Eurocommunism' and the State (1977)" },
    R_deleonism: { name: "DE LEONISM", file: "04", page: "de-leonism",
      desc: "The ballot to make it legal, the industrial union to make it real. Civilized, incorruptible, and organized to the last shop floor — the revolution as a general lockout of the capitalist class. Lenin admired the blueprint; America shelved it.",
      comrades: "De Leon, the SLP, the early IWW", enemies: "'Labor fakers' — his term — and pure-and-simple unionism",
      read: "Socialist Reconstruction of Society (1905)" },
    R_dengism: { name: "DENGISM", file: "20", page: "dengism",
      desc: "It doesn't matter if the cat is black or white, so long as it catches mice. You kept the party and hired the market; forty years later yours is the only school in this archive running a superpower. The others call it capitalism. You call it the primary stage of socialism, and you are not asking.",
      comrades: "Deng, the reformers of '78, the CPC since", enemies: "The Gang of Four's ghost; anyone who says the quiet part loud",
      read: "Build Socialism with Chinese Characteristics (1984)" },
    R_anarcho: { name: "ANARCHO-COMMUNISM", file: "03", page: "anarcho-communism",
      desc: "From each according to ability, to each according to need — and no state left standing to keep the ledger. You expect the red bureaucrat to become a tyrant exactly as fast as the capitalist did, and history keeps handing you receipts: 1872, 1921, 1937.",
      comrades: "Kropotkin, Malatesta, Goldman, the CNT-FAI", enemies: "The state — including, emphatically, the workers' one",
      read: "The Conquest of Bread (1892); Mutual Aid (1902)" },
    R_utopian: { name: "UTOPIAN SOCIALISM", file: "01", page: "utopian-socialism",
      desc: "Why seize the old world when you can build a better one and let it argue for itself? You are the archive's oldest file and gentlest heresy — the dream before the doctrine. Marx mocked you at length, which is how you know he read you carefully.",
      comrades: "More, Owen, Fourier, Saint-Simon", enemies: "None declared; that was arguably the problem",
      read: "Utopia (1516); Engels' Socialism: Utopian and Scientific (1880) — the hostile obituary" },
    R_western: { name: "WESTERN MARXISM", file: "11", page: "western-marxism",
      desc: "The revolution failed in the West because capital had already conquered the mind. So you took Marxism into the superstructure — hegemony, reification, the culture industry — and into the seminar room, from which, your critics note, it has yet to emerge.",
      comrades: "Gramsci, Lukács, the Frankfurt School", enemies: "The administered world; vulgar materialism; occasionally optimism",
      read: "Prison Notebooks (1929–35); Dialectic of Enlightenment (1944)" },
    R_autonomism: { name: "AUTONOMISM", file: "18", page: "autonomism",
      desc: "The workers don't need the party's permission to fight — refusal, absenteeism and exodus are already the revolution in progress. You read strikes the way others read scripture, and you left the factory before the factory left you.",
      comrades: "Tronti, Negri, the operaisti of the Hot Autumn", enemies: "Work. Also the official labour movement that administers it.",
      read: "Workers and Capital (1966); Empire (2000)" },
    R_posadism: { name: "POSADISM", file: "15", page: "posadism",
      desc: "Nuclear war is regrettable but clarifying; dolphins deserve solidarity; and any civilization advanced enough for interstellar travel has certainly abolished private property. The archive files you under Trotskyism, curiosity, with honors. The saucers, comrade, are on our side.",
      comrades: "J. Posadas and the Fourth International (Posadist)",
      enemies: "Capitalism, on every planet on which it may occur",
      read: "Flying Saucers… and the Socialist Future of Mankind (1968)" }
  };

  var state = { node: "root", path: [] };
  var body = null;

  function animateBranch() {
    body.classList.remove("is-entering");
    void body.offsetWidth;
    body.classList.add("is-entering");
    body.addEventListener("animationend", function () {
      body.classList.remove("is-entering");
    }, { once: true });
  }

  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function renderPath(container) {
    if (!state.path.length) return;
    var box = h("div", "q-path");
    box.appendChild(h("div", "node", "TRAVERSAL LOG:"));
    state.path.forEach(function (step, i) {
      var line = h("div", null, "");
      line.appendChild(document.createTextNode("  ".repeat(i) + "└─ "));
      var b = h("span", "branch", step.tag);
      line.appendChild(b);
      line.appendChild(document.createTextNode(" · " + step.q));
      box.appendChild(line);
    });
    container.appendChild(box);
  }

  function renderQuestion() {
    var node = QUESTIONS[state.node];
    body.textContent = "";
    body.appendChild(h("p", "q-depth", node.depth + " // FORK " + (state.path.length + 1)));
    body.appendChild(h("p", "q-text", node.q));
    body.appendChild(h("p", "q-sub", node.sub));
    var opts = h("div", "q-opts");
    node.opts.forEach(function (o) {
      var btn = h("button", "q-opt");
      btn.appendChild(h("span", "k", "[" + o.k + "]"));
      btn.appendChild(document.createTextNode(o.t));
      btn.addEventListener("click", function () {
        state.path.push({ q: node.q, tag: o.tag });
        if (o.next.indexOf("R_") === 0) {
          state.node = o.next;
          renderResult(o.next);
        } else {
          state.node = o.next;
          renderQuestion();
        }
        body.closest(".terminal").scrollIntoView({ block: "nearest" });
      });
      opts.appendChild(btn);
    });
    body.appendChild(opts);
    renderPath(body);
    animateBranch();
  }

  function metaRow(label, value) {
    var p = h("p", "r-meta");
    var b = h("b", null, label + " ");
    p.appendChild(b);
    p.appendChild(document.createTextNode(value));
    return p;
  }

  function renderResult(key) {
    var r = RESULTS[key];
    body.textContent = "";
    var wrap = h("div", "q-result");
    wrap.appendChild(h("p", "q-depth", "CLASSIFICATION COMPLETE // " + state.path.length + " FORKS TRAVERSED"));
    wrap.appendChild(h("p", "verdict", "RESULT // " + r.name));
    wrap.appendChild(h("p", "r-desc", r.desc));
    wrap.appendChild(metaRow("FILE:", "№ " + r.file + " — open the full dossier below"));
    wrap.appendChild(metaRow("COMRADES:", r.comrades));
    wrap.appendChild(metaRow("SWORN ENEMIES:", r.enemies));
    wrap.appendChild(metaRow("READ FIRST:", r.read));

    var actions = h("div", "q-actions");
    var open = h("a", "btn", "Open dossier № " + r.file);
    open.href = "schools/" + r.page + ".html";
    var again = h("button", "btn ghost", "Re-run protocol");
    again.addEventListener("click", function () {
      state.node = "root";
      state.path = [];
      renderQuestion();
    });
    var tree = h("a", "btn ghost", "View the tree");
    tree.href = "index.html#tree";
    actions.appendChild(open);
    actions.appendChild(again);
    actions.appendChild(tree);
    wrap.appendChild(actions);

    body.appendChild(wrap);
    renderPath(body);
    animateBranch();
  }

  document.addEventListener("DOMContentLoaded", function () {
    body = document.getElementById("quiz-body");
    if (body) renderQuestion();
  });
})();
