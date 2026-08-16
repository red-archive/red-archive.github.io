/* RED ARCHIVE — ideological classification protocol
   Two phases. Phase one runs the four tests from Annex A on you and listens
   for the answers a social democrat, a progressive, a streamer or an avatar
   gives while believing they are a communist. Phase two is the lineage tree
   run in reverse: every answer is a fork some faction once took.
   The result says which school you belong to — and whether, on the
   archive's own instrument, you are a communist at all. A taker who fails
   the screening still gets a school: the one they were claiming. */
(function () {
  "use strict";

  /* ---- The instrument -------------------------------------------------- */

  var TESTS = {
    property:      { n: 1, name: "PROPERTY",
      line: "The abolition of private property in the means of production." },
    klass:         { n: 2, name: "CLASS",
      line: "Class: who owns the means of production and who sells labour to them." },
    rupture:       { n: 3, name: "RUPTURE",
      line: "No. Each reform is ground the class takes the next step from — until the property question is put and answered." },
    international: { n: 4, name: "INTERNATIONALISM",
      line: "The main enemy is at home. Oppose the war. The workers have no country." }
  };
  var TEST_ORDER = ["property", "klass", "rupture", "international"];

  /* Formations a wrong answer points toward. Declared in priority order:
     formations that fail on program outrank the ones that fail on category
     when the points tie. Two points in one formation, or two failing
     answers, is a verdict — the tree still runs afterwards, so the file can
     record which school the taker was claiming. */
  var LARP = {
    dsa:         "R_dsa",
    progressive: "R_progressive",
    avatar:      "R_avatar",
    streamer:    "R_streamer",
    blackflag:   "R_blackflag"
  };

  /* ---- Phase one: screening ---------------------------------------------
     Each option may carry:
       fail  — the test this answer fails (see TESTS)
       larp  — a formation this answer is characteristic of (one point)
       flag  — a lineage marker that fails nothing ("anarchist", "ultra",
               "campist", "populist")
     Options with none of these are the line. Trap answers are written the
     way their formation actually talks; the line is written plainly. */

  var SCREEN = [
    {
      id: "s_property",
      depth: "TEST 1 · PROPERTY",
      q: "Amazon. What is the demand?",
      sub: "The property question, asked about a company instead of a principle.",
      gloss: "\"Means of production\" = the warehouses, servers and trucks — what you need to make and move goods. The test asks whether the demand ends private ownership of them or only regulates it.",
      opts: [
        { k: "A", t: "Break it up under antitrust, tax it properly, and unionize the warehouses.", tag: "ANTITRUST", fail: "property", larp: "dsa" },
        { k: "B", t: "Expropriate it. A continental logistics network is already social property; the workers run it and the title changes hands.", tag: "EXPROPRIATE" },
        { k: "C", t: "Workers on the board with real votes, a wealth tax on the founder, a $25 floor inside.", tag: "CODETERMINATION", fail: "property", larp: "dsa" },
        { k: "D", t: "Expropriate it — and no state takes the title. The warehouse crews and the neighbourhoods federate it directly; the wage goes out with the boss.", tag: "FREE FEDERATION", flag: "anarchist" }
      ]
    },
    {
      id: "s_class",
      depth: "TEST 2 · CLASS",
      q: "The primary division in society is —",
      sub: "Not the only one. The one everything else is read through.",
      gloss: "\"Class\" here is not an income bracket. It is which side of the wage you are on — owner or worker. The test asks whether that is the split you read everything else through.",
      opts: [
        { k: "A", t: "Interlocking systems of oppression — race, gender, class, ability — none prior to the others.", tag: "INTERSECTING", fail: "klass", larp: "progressive" },
        { k: "B", t: "Class: who owns the means of production and who sells labour to them.", tag: "CLASS" },
        { k: "C", t: "The 99% against the 1%.", tag: "THE 99%", fail: "klass", flag: "populist" },
        { k: "D", t: "The people against the elites.", tag: "THE PEOPLE", fail: "klass", flag: "populist" }
      ]
    },
    {
      id: "s_rupture",
      depth: "TEST 3 · RUPTURE",
      q: "Medicare for All passes. A $25 minimum wage. Sectoral bargaining. Are we done?",
      sub: "The reform question. Every reformist and every revolutionary has said yes to reforms; the difference is what they think a reform is for.",
      gloss: "\"Rupture\" = a break with capitalism, not a kinder version of it. A reform can be a stopping point or a step; the test asks which you think it is.",
      opts: [
        { k: "A", t: "That is the destination — a decent, regulated capitalism with strong safety nets and a real welfare state.", tag: "DESTINATION", fail: "rupture", larp: "dsa" },
        { k: "B", t: "No — the goal is democratic socialism: co-ops, public banks, worker-ownership funds, a democratic economy, won at the ballot box inside the constitution we have.", tag: "DEMOCRATIC SOCIALISM", fail: "rupture", larp: "dsa" },
        { k: "C", t: "No. Each reform is ground the class takes the next step from — until the property question is put and answered.", tag: "TRANSITIONAL" },
        { k: "D", t: "Reforms are the enemy's maintenance department. Refuse them; they postpone the rupture.", tag: "REFUSE REFORM", flag: "ultra" }
      ]
    },
    {
      id: "s_international",
      depth: "TEST 4 · INTERNATIONALISM",
      q: "Your country goes to war. The unions back it and the flags come out. You —",
      sub: "August 1914. The SPD called it a war against Tsarist despotism; the SFIO, a defence of the Republic. The test that split the Second International and created the word \"communist\" as a separate identity. Answer as if you were in the room.",
      gloss: "In 1914 most socialist parties backed their own governments' war. The communist movement was born from the minority who refused. The test asks which side of that room you would have been in.",
      opts: [
        { k: "A", t: "Stand with the union. Its members build the ships and fill the ranks, and you do not split the class over foreign policy.", tag: "STAND WITH THE UNION", fail: "international", larp: "dsa" },
        { k: "B", t: "It depends. A war for democracy against a despotism is different, and the left should back that one.", tag: "FOR DEMOCRACY", fail: "international" },
        { k: "C", t: "The main enemy is at home. Oppose the war. The workers have no country.", tag: "MAIN ENEMY AT HOME" },
        { k: "D", t: "Oppose it if my country is the imperialist; back the other side if it is fighting empire.", tag: "ANTI-IMPERIALIST", flag: "campist" }
      ]
    },
    {
      id: "s_org",
      depth: "CATEGORY",
      q: "Where does your politics actually happen?",
      sub: "Commentary is not organization; an audience is not a class. Answer for the last twelve months, not the plan.",
      gloss: "Talking about politics is not the same as being organized in a party or a union. The archive files commentary as media, whichever flag it flies.",
      opts: [
        { k: "A", t: "In chat and on the timeline. Political education at a scale no branch meeting has ever reached.", tag: "THE TIMELINE", larp: "streamer" },
        { k: "B", t: "A party branch: dues, a paper, discipline, and candidates on our own ballot line or none. It is boring, which is how you can tell.", tag: "THE BRANCH" },
        { k: "C", t: "The chapter. General meetings, dues, working groups — and when it's time, canvassing for our endorsed candidate in the Democratic primary.", tag: "THE CHAPTER", fail: "rupture", larp: "dsa" },
        { k: "D", t: "Nonprofit organizing: grants, coalitions, campaigns, a program officer who gets it.", tag: "THE NGO", fail: "property", larp: "progressive" },
        { k: "E", t: "Mutual aid, direct action, the affinity group. No permission asked.", tag: "DIRECT ACTION", flag: "anarchist" },
        { k: "F", t: "Nowhere yet. I read, I post, I argue in the replies. The organization comes later.", tag: "NOWHERE YET", larp: "avatar" }
      ]
    },
    {
      id: "s_ballot",
      depth: "STRATEGY",
      q: "Elections. What are they for?",
      sub: "Every school upstairs has run candidates, including the ones that swore it would not. The question is what the seat is.",
      gloss: "Every school has run candidates. The difference is whether the election is the road to power or a platform used along the way — and whose ballot line you stand on.",
      opts: [
        { k: "A", t: "Winning. A socialist in office is a socialist in office, whichever ballot line got them there.", tag: "ANY BALLOT LINE", fail: "rupture", larp: "dsa" },
        { k: "B", t: "Harm reduction. Vote for the Democrat, push them left, primary them next cycle.", tag: "VOTE BLUE, PUSH LEFT", fail: "rupture", larp: "progressive" },
        { k: "C", t: "A tribune. The seat is a platform for the class, the ballot line is the party's own, and the vote measures readiness — it is not the road.", tag: "THE TRIBUNE" },
        { k: "D", t: "A parliamentary majority that legislates the transition — slowly, legally, and to the end.", tag: "THE LEGAL ROAD" },
        { k: "E", t: "Nothing. Direct action gets the goods; the ballot is where movements go to be digested.", tag: "NOTHING", flag: "anarchist" }
      ]
    },
    {
      id: "s_vibe",
      depth: "THE LINE",
      q: "Choose the line closest to your politics.",
      sub: "One of these is a program. The others are moods, some of them good ones.",
      gloss: "A program says what happens to property. A slogan says how you feel about it. Both can be sincere; only one is an answer to the test.",
      opts: [
        { k: "A", t: "Tax the rich, fund the schools, protect trans kids, abolish ICE.", tag: "THE PLATFORM", fail: "property", larp: "progressive" },
        { k: "B", t: "Every billionaire is a policy failure.", tag: "POLICY FAILURE", fail: "property", larp: "dsa" },
        { k: "C", t: "The abolition of private property in the means of production.", tag: "THE PROGRAM" },
        { k: "D", t: "☭ marxist-leninist of the pre-1956 type · anti-revisionist · anti-imperialist · a row of flags ☭", tag: "THE BIO", larp: "avatar" },
        { k: "E", t: "The abolition of private property in the means of production — and of the state that would inherit it.", tag: "NO MASTERS", flag: "anarchist" },
        { k: "F", t: "communal anarchist · libertarian socialist · makhnovite · especifist · democratic confederalist · bookchin · chomsky — read the pinned", tag: "THE STACK", larp: "blackflag", flag: "anarchist" }
      ]
    },
    {
      id: "s_dsa",
      depth: "KNOWLEDGE",
      q: "The DSA. File it.",
      sub: "A classification, not an insult. But it is a classification.",
      gloss: "The Democratic Socialists of America — the largest US left group — was founded to work inside the Democratic Party. Whether that makes it communist is exactly what the four tests decide.",
      opts: [
        { k: "A", t: "A communist organization — that is what its enemies say, and it is the largest thing on the American left.", tag: "COMMUNIST?", larp: "dsa" },
        { k: "B", t: "A big tent — communists, socialists, progressives. The label matters less than the numbers.", tag: "BIG TENT", larp: "dsa" },
        { k: "C", t: "Social democracy: founded 1982 by an anti-communist, on a strategy of realignment inside the Democratic Party.", tag: "SOCIAL DEMOCRACY" },
        { k: "D", t: "Not worth filing. Nothing that runs in a Democratic primary is a party.", tag: "NOT A PARTY", flag: "ultra" }
      ]
    },
    {
      id: "s_1956",
      depth: "KNOWLEDGE",
      q: "1956. The Secret Speech leaks. Your line —",
      sub: "Schism №9. Every communist on earth had to answer it, and the answers cannot be held together.",
      gloss: "In 1956 Khrushchev denounced Stalin in a closed-session speech. Every communist party had to pick a side, and the sides never rejoined. Holding all of them at once is not a position.",
      opts: [
        { k: "A", t: "Revisionism. The restoration began there; the line is the pre-1956 line, held alone if necessary.", tag: "ANTI-REVISIONIST" },
        { k: "B", t: "Necessary. The party corrected itself, the party-state continued, and the Soviet line is the line.", tag: "THE SOVIET LINE" },
        { k: "C", t: "Confirmation. The bureaucracy admitted in 1956 what the Left Opposition said in 1927; the political revolution is still owed.", tag: "CONFIRMATION" },
        { k: "D", t: "Marxism-Leninism-Stalinism-Maoism-Khrushchevism-Hoxhaism. All of it. It's in the bio.", tag: "ALL OF IT", larp: "avatar" },
        { k: "E", t: "Doesn't matter. Stalin did nothing wrong and the rest of the century is discourse.", tag: "NOTHING WRONG", larp: "avatar" }
      ]
    },
    {
      id: "s_avatar",
      depth: "THE MIRROR",
      q: "Your profile picture is —",
      sub: "The archive pleads guilty to the fonts. It is asking about the avatar.",
      gloss: "The archive uses Soviet fonts too. It is asking whether the symbols stand for a program or stand in for one.",
      opts: [
        { k: "A", t: "A photograph of me, or nothing.", tag: "A FACE" },
        { k: "B", t: "An anime character with a hammer and sickle behind her.", tag: "ANIME + SICKLE", larp: "avatar" },
        { k: "C", t: "A red flag next to a black one — hammer-and-sickle and circle-A, same header.", tag: "RED + BLACK", larp: "blackflag", flag: "anarchist" },
        { k: "D", t: "The party's emblem, because I am in one.", tag: "THE EMBLEM" },
        { k: "E", t: "The streamer's emote, or the sub badge.", tag: "THE SUB BADGE", larp: "streamer" },
        { k: "F", t: "The red-and-black diagonal. One flag, and it is the CNT's.", tag: "RED-AND-BLACK", flag: "anarchist" }
      ]
    }
  ];

  /* ---- Phase two: the tree ------------------------------------------- */

  var QUESTIONS = {
    root: {
      depth: "ROOT",
      q: "How does capitalism actually end?",
      sub: "The first fork in every communist argument since 1848.",
      gloss: "Revolution, reform, walk out, or explain the failure first — the four doors every school in the archive went through.",
      opts: [
        { k: "A", t: "It is overthrown — a revolutionary rupture led by the organized working class.", next: "rev", tag: "RUPTURE" },
        { k: "B", t: "It is transformed gradually, through elections, unions and existing institutions.", next: "reform", tag: "TRANSFORMATION" },
        { k: "C", t: "People walk out of it and build the new world directly — communes, mutual aid, free federation.", next: "commune", tag: "EXODUS" },
        { k: "D", t: "Wrong question — first explain why it hasn't ended. The revolution failed for a reason.", next: "theory", tag: "DIAGNOSIS" }
      ]
    },
    rev: {
      depth: "RUPTURE",
      q: "Who leads the rupture?",
      sub: "Every revolutionary school answers this differently — and shoots over the difference.",
      gloss: "A party of professionals, the workers themselves through councils, or an army in the hills: three answers, three lineages.",
      opts: [
        { k: "A", t: "A vanguard party of professional revolutionaries, organized like an army.", next: "vanguard", tag: "VANGUARD" },
        { k: "B", t: "The class itself — mass strikes and workers' councils. Parties can only assist or betray.", next: "council", tag: "COUNCILS" },
        { k: "C", t: "A guerrilla army rooted in the peasantry and the countryside.", next: "guerrilla", tag: "GUERRILLA" }
      ]
    },
    vanguard: {
      depth: "VANGUARD",
      q: "The vanguard has taken power. The world revolution hasn't come. Now what?",
      sub: "Petrograd, 1921. The telegrams from Berlin have stopped. Choose.",
      gloss: "The Bolsheviks won in Russia; the revolutions in Germany and elsewhere failed. What do you do with one country?",
      opts: [
        { k: "A", t: "Build socialism in one country — fortress, plan, discipline. Hold what we have.", next: "fortress", tag: "ONE COUNTRY" },
        { k: "B", t: "Spread the revolution or die. There is no national socialism — permanent revolution.", next: "R_trotskyism", tag: "PERMANENT REV" },
        { k: "C", t: "Return to the party's original discipline and program — the instrument, kept clean, before and above whoever later wielded it.", next: "R_leninism", tag: "THE INSTRUMENT" }
      ]
    },
    fortress: {
      depth: "FORTRESS",
      q: "The fortress holds. Then Moscow drifts after 1953. Your line?",
      sub: "The Secret Speech has leaked. Every party on earth must answer it.",
      gloss: "Stalin died in 1953; in 1956 Khrushchev denounced him. Every party had to decide whether Moscow was still the line.",
      opts: [
        { k: "A", t: "Defend the orthodox party-state — the Soviet line, through every zig and zag.", next: "R_ml", tag: "ORTHODOXY" },
        { k: "B", t: "Moscow betrayed the revolution in 1956. Only the pure line remains — hold it alone if needed.", next: "R_hoxhaism", tag: "ANTI-REVISIONISM" },
        { k: "C", t: "National roads: self-managed factories, non-alignment, no diktat from any capital.", next: "R_titoism", tag: "SELF-MANAGEMENT" },
        { k: "D", t: "The nation relies on itself alone; the Leader embodies its will, and the line is inherited.", next: "R_juche", tag: "SELF-RELIANCE" },
        { k: "E", t: "The line is wherever the working class actually is — and right now it is patriotic. Go there, flag and all.", next: "R_maga", tag: "GO TO THE BASE" },
        { k: "F", t: "The nation is the revolutionary subject. Red flag, black eagle, and stop apologizing for either.", next: "R_nazbol", tag: "NATION FIRST" }
      ]
    },
    council: {
      depth: "COUNCILS",
      q: "Councils it is. And parliaments, and the official trade unions?",
      sub: "The question Lenin called an infantile disorder — and the left called the whole point.",
      gloss: "If workers' councils are the real thing, do you still use elections and unions as tools, or refuse them as traps?",
      opts: [
        { k: "A", t: "Use them — as tribunes, as schools of struggle — while the mass strike ripens.", next: "R_luxemburgism", tag: "MASS STRIKE" },
        { k: "B", t: "Abandon them. They domesticate the class. All power to the workers' councils alone.", next: "R_leftcom", tag: "COUNCILS ONLY" }
      ]
    },
    guerrilla: {
      depth: "GUERRILLA",
      q: "The countryside rises. What's the strategy?",
      sub: "Yan'an or the Sierra Maestra — two mountains, two doctrines.",
      gloss: "Mao built base areas for decades; Che said a small armed group could start the fire itself.",
      opts: [
        { k: "A", t: "Protracted people's war: build base areas, win the masses, encircle the cities over decades.", next: "R_maoism", tag: "PEOPLE'S WAR" },
        { k: "B", t: "Don't wait for conditions — a small armed foco creates them by fighting now.", next: "R_guevarism", tag: "THE FOCO" }
      ]
    },
    reform: {
      depth: "TRANSFORMATION",
      q: "You'll work within the system. Which instrument?",
      sub: "Reform is a strategy, not a mood. Pick your machine.",
      gloss: "Change through elections — but with which vehicle: a workers' party, a pluralist mass party, one big union, or a ruling party that uses markets?",
      opts: [
        { k: "A", t: "A disciplined workers' party that wins elections while capitalism's contradictions mature.", next: "R_orthodox", tag: "THE PARTY" },
        { k: "B", t: "Mass democratic parties — free of Moscow, committed to pluralism permanently.", next: "R_eurocom", tag: "PLURALISM" },
        { k: "C", t: "The ballot for legitimacy, one big industrial union to actually take over production.", next: "R_deleonism", tag: "INDUSTRIAL UNION" },
        { k: "D", t: "A ruling communist party that lets markets grow the productive forces — under its control.", next: "R_dengism", tag: "MARKET LEVER" }
      ]
    },
    commune: {
      depth: "EXODUS",
      q: "The new world, built directly. Who coordinates it?",
      sub: "No permission asked. But somebody still has to run the granary.",
      gloss: "Build the new world now — with nobody above the communes, with designed model colonies, or as a congregation.",
      opts: [
        { k: "A", t: "Nobody above the communes: free federation, mutual aid, take from the common storehouse.", next: "R_anarcho", tag: "FREE FEDERATION" },
        { k: "B", t: "Enlightened founders design model communities that prove the case by example.", next: "R_utopian", tag: "MODEL COLONY" },
        { k: "C", t: "The congregation. The early church held all things in common, and that was an instruction.", next: "R_christian", tag: "ALL THINGS COMMON" },
        { k: "D", t: "All of them at once — Makhnovite, especifist, democratic confederalist, Bookchin, Chomsky. The bio has room; the granary can wait.", next: "R_blackflag", tag: "THE BIO" }
      ]
    },
    theory: {
      depth: "DIAGNOSIS",
      q: "Where did the revolution stall?",
      sub: "The West had the factories, the unions, the crises — and no October. Why?",
      gloss: "The West had everything Marx said was needed and produced no revolution. Each answer here is a diagnosis of why.",
      opts: [
        { k: "A", t: "In culture and consciousness — hegemony, ideology, the administered mind.", next: "R_western", tag: "HEGEMONY" },
        { k: "B", t: "It didn't stall — it lives in the workers' daily refusal. Watch the factory, not the party.", next: "R_autonomism", tag: "REFUSAL" },
        { k: "C", t: "It arrives by catastrophe. Even nuclear fire clears the ground — and any civilization that crosses the stars is already communist.", next: "R_posadism", tag: "CATASTROPHE" },
        { k: "D", t: "The diagnosis is the contribution: class struggle, surplus value, history as material process.", next: "R_marxism", tag: "SOURCE CODE" },
        { k: "E", t: "It hasn't stalled, it's early. Automate everything, end scarcity, and the property question answers itself.", next: "R_falgsc", tag: "AUTOMATE" },
        { k: "F", t: "It's over. There is no alternative and there never was — I'm here for the aesthetics and the dunks.", next: "R_doomer", tag: "NO ALTERNATIVE" }
      ]
    }
  };

  /* ---- Results ---------------------------------------------------------
     verdict:  "communist" — a school; final wording depends on screening
               "adjacent"  — a real lineage the register does not score
               "contested" — communist on program, one test open
               "meme"      — filed with affection
               "heresy"    — filed in a locked drawer
               "larp"      — fails the instrument
     category: larp results whose failure is on category before program
     href:     where "open the file" goes; schools use page. */

  var RESULTS = {
    /* the twenty files */
    R_marxism: { name: "MARXISM", file: "02", page: "marxism", verdict: "communist",
      desc: "You are the source code. Everyone else in this archive is a fork of you — and each of them claims to be the faithful one. You'd rather get the analysis right than pick a faction, which is exactly what Marx said before adding: the point, however, is to change it.",
      comrades: "Marx, Engels", enemies: "Every misreading — so, arguably, everyone below",
      read: "The Communist Manifesto (1848); Capital I (1867)" },
    R_leninism: { name: "LENINISM", file: "06", page: "leninism", verdict: "communist",
      desc: "Discipline, organization, and the conviction that revolutions are made, not awaited. You believe in the vanguard as an instrument — and you notice, with some discomfort, how many hands later claimed that instrument.",
      comrades: "Lenin, the Bolsheviks of 1917", enemies: "Kautskyists, spontaneists, and everyone who came after claiming the brand",
      read: "What Is To Be Done? (1902); State and Revolution (1917)" },
    R_trotskyism: { name: "TROTSKYISM", file: "09", page: "trotskyism", verdict: "communist",
      desc: "Permanent revolution, world revolution, and a lifetime of being right in exile. You keep the October flame while insisting the USSR betrayed it — and you have already mentally split from at least two organizations you haven't joined yet.",
      comrades: "Trotsky, the Left Opposition, the Fourth International(s)", enemies: "Stalinism above all; the feeling is mutual and armed",
      read: "The Revolution Betrayed (1936); The Permanent Revolution (1930)" },
    R_ml: { name: "MARXISM–LENINISM", file: "10", page: "marxism-leninism", verdict: "communist",
      desc: "The orthodoxy. Party, plan, and socialism in one country — you defend the actually-existing record, warts, purges and all, as the price of holding power in a hostile world. The other schools call you the apparatus; you call them the luxury of never having governed.",
      comrades: "Stalin's Comintern, the Soviet bloc parties", enemies: "Trotskyists, revisionists, imperialists — the list is maintained centrally",
      read: "Foundations of Leninism (1924); History of the CPSU(B): Short Course (1938) — critically" },
    R_maoism: { name: "MAOISM", file: "12", page: "maoism", verdict: "communist",
      desc: "The countryside surrounds the cities. You trust the masses over the apparatus, believe contradictions continue under socialism, and are prepared to bombard your own headquarters to prove it. Protracted: yes. Patient: no.",
      comrades: "Mao, the Long Marchers, three continents of people's wars", enemies: "Soviet revisionism, then Deng's restoration",
      read: "On Contradiction (1937); Quotations (1964)" },
    R_titoism: { name: "TITOISM", file: "13", page: "titoism", verdict: "communist",
      desc: "You said no to Stalin and lived. Factories to the workers' councils, foreign policy to nobody's bloc. You'd rather improvise your own socialism than obey anyone else's — and you look better in a marshal's uniform than ideology strictly requires.",
      comrades: "Tito, the Partisans, the Non-Aligned Movement", enemies: "The Cominform, 1948–55; dogmatists of every capital",
      read: "Djilas' The New Class (1957) — the in-house critique" },
    R_hoxhaism: { name: "HOXHAISM", file: "17", page: "hoxhaism", verdict: "communist",
      desc: "Everyone else is a revisionist. Moscow fell in '56, Belgrade never stood, Beijing fell in '72 — the line is pure and you will hold it alone, in a bunker, forever. There are 170,000 bunkers. You have plans for all of them.",
      comrades: "Hoxha, the Party of Labour of Albania, a small worldwide communion of the pure",
      enemies: "Khrushchevites, Titoites, Maoists — in chronological order of their fall",
      read: "Imperialism and the Revolution (1978)" },
    R_juche: { name: "JUCHE", file: "16", page: "juche", verdict: "communist",
      desc: "Self-reliance above all: the masses are the master of the revolution, but the Leader is the master of the masses. You have quietly stopped citing Marx altogether. The revolution, conveniently, is hereditary.",
      comrades: "Kim Il-sung, and by constitutional arrangement his descendants",
      enemies: "Flunkeyism (sadae) — dependence on any foreign power",
      read: "On the Juche Idea (1982)" },
    R_luxemburgism: { name: "LUXEMBURGISM", file: "07", page: "luxemburgism", verdict: "communist",
      desc: "The mass strike is the school of the revolution, and freedom is always the freedom of the one who thinks differently. You are the conscience of this archive: revolutionary against the reformists, democratic against the vanguard — and murdered for both.",
      comrades: "Luxemburg, Liebknecht, the Spartacists", enemies: "Bernstein's revisionism and Lenin's substitutionism, evenhandedly",
      read: "Reform or Revolution (1899); The Mass Strike (1906)" },
    R_leftcom: { name: "LEFT COMMUNISM", file: "08", page: "left-communism", verdict: "communist",
      desc: "All power to the councils — and none to the party, the unions, or the parliament that will digest them. Lenin called you infantile; you call Kronstadt his confession. You are correct, principled, and magnificently few.",
      comrades: "Pannekoek, Gorter, Bordiga (who would object to being grouped)",
      enemies: "Bolshevism from 1918 onward; social democracy always",
      read: "Lenin's 'Left-Wing' Communism (1920) — as the prosecution's exhibit" },
    R_guevarism: { name: "GUEVARISM", file: "14", page: "guevarism", verdict: "communist",
      desc: "Conditions are never ready — the foco makes them ready. A dozen rifles in the mountains, revolutionary will over revolutionary patience, and if you die at it, the poster alone will recruit for fifty years.",
      comrades: "Che, Fidel's column of '56, three continents of imitators", enemies: "Waiting. Also the CIA.",
      read: "Guerrilla Warfare (1960); Socialism and Man in Cuba (1965)" },
    R_orthodox: { name: "ORTHODOX MARXISM", file: "05", page: "orthodox-marxism", verdict: "communist",
      desc: "History is on your side, scientifically; there is no need to rush it with adventures. Build the party, win the vote, educate the class, and wait for capitalism to complete its own gravedigging. You have been waiting since 1889.",
      comrades: "Kautsky, Bebel, the golden-age SPD", enemies: "Revisionists to your right, Bolsheviks to your left",
      read: "The Erfurt Program (1891); The Road to Power (1909)" },
    R_eurocom: { name: "EUROCOMMUNISM", file: "19", page: "eurocommunism", verdict: "communist",
      desc: "Communism with elections, pluralism and no phone line to Moscow. You watched the tanks in Prague and the coup in Chile and concluded democracy is not a tactic but the road itself. Moscow anathematized you, which you count as a reference.",
      comrades: "Berlinguer, Carrillo, the PCI at a third of the vote", enemies: "Soviet orthodoxy; also, eventually, electoral arithmetic",
      read: "'Eurocommunism' and the State (1977)" },
    R_deleonism: { name: "DE LEONISM", file: "04", page: "de-leonism", verdict: "communist",
      desc: "The ballot to make it legal, the industrial union to make it real. Civilized, incorruptible, and organized to the last shop floor — the revolution as a general lockout of the capitalist class. Lenin admired the blueprint; America shelved it.",
      comrades: "De Leon, the SLP, the early IWW", enemies: "'Labor fakers' — his term — and pure-and-simple unionism",
      read: "Socialist Reconstruction of Society (1905)" },
    R_dengism: { name: "DENGISM", file: "20", page: "dengism", verdict: "communist",
      desc: "It doesn't matter if the cat is black or white, so long as it catches mice. You kept the party and hired the market; forty years later yours is the only school in this archive running a superpower. The others call it capitalism. You call it the primary stage of socialism, and you are not asking.",
      comrades: "Deng, the reformers of '78, the CPC since", enemies: "The Gang of Four's ghost; anyone who says the quiet part loud",
      read: "Build Socialism with Chinese Characteristics (1984)" },
    R_anarcho: { name: "ANARCHO-COMMUNISM", file: "03", page: "anarcho-communism", verdict: "adjacent",
      desc: "From each according to ability, to each according to need — and no state left standing to keep the ledger. You expect the red bureaucrat to become a tyrant exactly as fast as the capitalist did, and history keeps handing you receipts: 1872, 1921, 1937. The register does not score you, and says why: a different lineage, not a low mark.",
      comrades: "Kropotkin, Malatesta, Goldman, the CNT-FAI", enemies: "The state — including, emphatically, the workers' one",
      read: "The Conquest of Bread (1892); Mutual Aid (1902); Annex C §04 for why you are filed here and not there" },
    R_utopian: { name: "UTOPIAN SOCIALISM", file: "01", page: "utopian-socialism", verdict: "communist",
      desc: "Why seize the old world when you can build a better one and let it argue for itself? You are the archive's oldest file and gentlest heresy — the dream before the doctrine. Marx mocked you at length, which is how you know he read you carefully.",
      comrades: "More, Owen, Fourier, Saint-Simon", enemies: "None declared; that was arguably the problem",
      read: "Utopia (1516); Engels' Socialism: Utopian and Scientific (1880) — the hostile obituary" },
    R_western: { name: "WESTERN MARXISM", file: "11", page: "western-marxism", verdict: "communist",
      desc: "The revolution failed in the West because capital had already conquered the mind. So you took Marxism into the superstructure — hegemony, reification, the culture industry — and into the seminar room, from which, your critics note, it has yet to emerge.",
      comrades: "Gramsci, Lukács, the Frankfurt School", enemies: "The administered world; vulgar materialism; occasionally optimism",
      read: "Prison Notebooks (1929–35); Dialectic of Enlightenment (1944)" },
    R_autonomism: { name: "AUTONOMISM", file: "18", page: "autonomism", verdict: "communist",
      desc: "The workers don't need the party's permission to fight — refusal, absenteeism and exodus are already the revolution in progress. You read strikes the way others read scripture, and you left the factory before the factory left you.",
      comrades: "Tronti, Negri, the operaisti of the Hot Autumn", enemies: "Work. Also the official labour movement that administers it.",
      read: "Workers and Capital (1966); Empire (2000)" },
    R_posadism: { name: "POSADISM", file: "15", page: "posadism", verdict: "communist",
      desc: "Nuclear war is regrettable but clarifying; dolphins deserve solidarity; and any civilization advanced enough for interstellar travel has certainly abolished private property. The archive files you under Trotskyism, curiosity, with honors. The saucers, comrade, are on our side.",
      comrades: "J. Posadas and the Fourth International (Posadist)",
      enemies: "Capitalism, on every planet on which it may occur",
      read: "Flying Saucers… and the Socialist Future of Mankind (1968)" },

    /* the drawer marked "for fun", and the one marked "no" */
    R_falgsc: { name: "FULLY AUTOMATED LUXURY GAY SPACE COMMUNISM", file: "—", href: "schools/marxism.html", verdict: "meme",
      label: "MEME // COMMUNIST ON PAPER — PENDING THE ROBOTS",
      desc: "Scarcity is an engineering problem and the robots are almost done. You skipped the transition period because the replicator makes it moot, and your model society is a starship with no money on it. Marx said the productive forces would burst their capitalist integument; you have simply booked the date. Nearest file: FILE 02, the bit about the forces of production.",
      comrades: "Aaron Bastani, the United Federation of Planets, everyone who has ever said \"post-scarcity\" in a group chat",
      enemies: "Scarcity, and the people who currently own the robots",
      read: "Fully Automated Luxury Communism (2019); Grundrisse, the Fragment on Machines (1857–58); Star Trek: TNG, any episode with a replicator" },
    R_christian: { name: "CHRISTIAN COMMUNISM", file: "D", href: "faith.html", verdict: "communist",
      label: "ANNEX D // FOUR TESTS PASSED — DIFFERENT SCRIPTURE",
      desc: "\"And all that believed were together, and had all things common.\" You read Acts 2 as an instruction, not a description, and you have Müntzer, Winstanley, Dorothy Day and a bench of liberation theologians for company. The archive files you in Annex D — where the four tests are passed, and where the schools upstairs argued with you and sometimes shot you.",
      comrades: "Müntzer, the Diggers, the Catholic Worker, Gutiérrez",
      enemies: "Mammon; also, historically, the Party's religious policy",
      read: "Acts 2:44–45; Winstanley, The True Levellers Standard Advanced (1649); Gutiérrez, A Theology of Liberation (1971)" },
    R_maga: { name: "MAGA COMMUNISM", file: "C", href: "register.html", verdict: "contested",
      label: "CONTESTED // THREE TESTS PASS, ONE OPEN",
      desc: "Property, class, rupture — pass. Internationalism — contested, and you know it. The defence is Lenin on the national question and the united front: go where the class actually is, even where it is currently reactionary. The prosecution is the Twenty-One Conditions, written to expel the socialists who found a national interest in 1914. Annex C files the test as open and declines to close it for you.",
      comrades: "The ACP's founding declaration; Lenin on the national question; Stalin's Marxism and the National Question, the defence's canonical text",
      enemies: "Fifty years of purity at zero members — or, on the other reading, August 1914",
      read: "Annex C §02, the ACP entry, both the defence and the prosecution" },
    R_nazbol: { name: "NATIONAL BOLSHEVISM", file: "—", href: "conflicts.html", verdict: "heresy",
      label: "HERESY // NOT A COMMUNIST — LOCKED DRAWER",
      desc: "Niekisch, Limonov, a flag that borrows its layout from one side of the Eastern Front and its emblem from the other, and a fusion the Comintern's Twenty-One Conditions would have stopped at condition 6. Test 4 does not exist for you, and test 2 has been swapped for the nation. The archive keeps this drawer locked and files the key under Schism №4, 1914, so you can see exactly where the tradition said no.",
      comrades: "Not on this site",
      enemies: "Every school upstairs, for once unanimously",
      read: "Schism №4, the social-patriots; the Twenty-One Conditions (1920), condition 6" },

    /* the register: fails the instrument */
    R_dsa: { name: "SOCIAL DEMOCRAT — THE DSA TYPE", short: "SOCIAL DEMOCRAT, DSA TYPE", file: "C", href: "register.html", verdict: "larp",
      desc: "You may have walked in thinking you were a Marxist-Leninist. Your answers are the DSA's 1982 charter: property managed rather than abolished, reforms as the destination, the Democratic primary as the arena of choice. That is social democracy — the tendency the Comintern was founded to expel, with its own file, its own martyrs and its own dead. The Twenty-One Conditions would have returned the application on page one.",
      comrades: "Harrington, Bernstein, the realignment caucus",
      enemies: "The Twenty-One Conditions, condition 7; every school upstairs, on the record since 1919",
      read: "Annex A §02, \"A social democrat\"; Annex C §04, the DSA entry; Luxemburg, Reform or Revolution (1899) — for what the argument sounded like the first time" },
    R_progressive: { name: "PROGRESSIVE — THE NGO LAYER", short: "PROGRESSIVE, NGO LAYER", file: "A", href: "the-line.html", verdict: "larp",
      desc: "You hold every currently progressive position and, on the instrument, you are a bourgeois liberal — Annex A's word, and the orthodox files' before it. Class is one axis among several; the property question never came up; the vehicle is a nonprofit or a platform. Adolph Reed Jr. has spent decades calling this the left wing of neoliberalism, and the archive files his brief in full.",
      comrades: "The foundation, the coalition, the grant cycle",
      enemies: "Adolph Reed Jr.; the Ehrenreichs; anyone who asks who owns the building",
      read: "Annex A §04, the capture argument; Reed, Class Notes (2000); B. & J. Ehrenreich, The Professional-Managerial Class (1977)" },
    R_streamer: { name: "THE STREAMER LEFT — SUBSCRIBER TIER", short: "STREAMER LEFT, SUBSCRIBER TIER", file: "C", href: "register.html", verdict: "larp", category: true,
      desc: "An audience is not a class, and the subscribe button is not a membership card. Statistically you are not the broadcaster but the chat, which is the part of the arrangement that owns nothing — the broadcaster owns his own means of production, which is a real answer to test 1 and not the one on the shirt. The defence — political education at a scale no party paper reached — is entered. So is the counter: FILE 02 asks about your relation to the means of production, not your watch history.",
      comrades: "The chat",
      enemies: "The branch meeting you did not go to",
      read: "Annex C §04, the streamer entry; Debord, The Society of the Spectacle (1967), thesis 1 onward" },
    R_avatar: { name: "THE AESTHETIC — ANIME AVATAR DIVISION", short: "THE AESTHETIC, AVATAR DIVISION", file: "C", href: "register.html", verdict: "larp", category: true,
      cleanLabel: "LARPER // THE ANSWERS WERE FREE TOO",
      desc: "Red star, Soviet font, a character with a hammer and sickle behind her, and a bio holding lines that expelled one another. The archive pleads guilty to the fonts too; the difference is that it also filed a program, and yours has not made a property claim. Annex C runs the instrument on the formation, for method rather than mockery, and finds a mood with a follower count.",
      comrades: "Specimens 01–05, Annex C §04",
      enemies: "Any single file upstairs, read start to finish",
      read: "Annex C §04, the aesthetic; then FILE 10, since that is what the bio claims" },
    R_blackflag: { name: "THE BLACK-FLAG FORMATION — BOTH FLAGS, ONE HEADER", short: "BLACK-FLAG FORMATION", file: "A", href: "the-line.html", verdict: "larp", category: true,
      cleanLabel: "LARPER // NOT FILE 03 EITHER",
      desc: "Red flag and black flag in the same header — the arrangement 1872 ruled out by vote and 1921 and 1937 by rifle — and a bio holding five incompatible answers to the one question the current has always had to answer: what organization, if not the party. Kropotkin earned FILE 03. A bio does not. Annex A §05 files the formation beside the streamer left and scores it the same way.",
      comrades: "The pinned post",
      enemies: "Makhno, Durruti and Kropotkin, who would each want a word",
      read: "Annex A §05, the black-flag formation; then FILE 03, which is what you were pointing at" },
    R_doomer: { name: "TIMELINE DOOMER", short: "TIMELINE DOOMER", file: "A", href: "the-line.html", verdict: "larp", category: true,
      cleanLabel: "LARPER // FUKUYAMA WITH A RED FLAG",
      desc: "There is no alternative, and you have the aesthetics of the alternative anyway. That is not a school; it is the spectacle wearing the opposition as a costume — recuperation with the labour done voluntarily. Every file upstairs was written by people who thought it was over too, and organized regardless. Start with the smallest one.",
      comrades: "The dunk, the quote-post, the group chat",
      enemies: "Anyone with a membership card",
      read: "Annex A §04; then FILE 08, Left Communism — the file for being right, few, and still organized" }
  };

  /* ---- State ----------------------------------------------------------- */

  var state = null;
  var body = null;

  function reset() {
    state = {
      phase: "screen",     // "screen" | "tree" | "result"
      screenIndex: 0,
      node: "root",
      path: [],
      fails: {},           // test -> {q, tag, id} — first failing answer per test
      failAnswers: 0,      // every failing answer, including repeats on one test
      larp: {},            // formation -> points
      flags: {},           // flag -> count
      larpKey: null        // RESULTS key if screening failed the instrument
    };
  }

  function failCount() { return Object.keys(state.fails).length; }
  function flagCount(f) { return state.flags[f] || 0; }
  function failedKeys() { return TEST_ORDER.filter(function (k) { return state.fails[k]; }); }

  /* Highest-scoring formation. Ties go to the earlier key in LARP, so a
     formation that fails on program outranks one that fails on category. */
  function topLarp() {
    var best = null, pts = 0;
    Object.keys(LARP).forEach(function (k) {
      var p = state.larp[k] || 0;
      if (p > pts) { best = k; pts = p; }
    });
    return { key: best, pts: pts };
  }

  /* Decide, after screening, whether the protocol can continue. Two failing
     answers, or two answers characteristic of one formation, is a verdict. */
  function screeningVerdict() {
    var top = topLarp();
    if (state.failAnswers >= 2 || top.pts >= 2) {
      // any formation the answers actually pointed at decides
      if (top.key) return LARP[top.key];
      // two fails, no formation named: the populist register reads as
      // social democracy; a class fail without it reads as the NGO layer
      if (flagCount("populist")) return LARP.dsa;
      return state.fails.klass ? LARP.progressive : LARP.dsa;
    }
    return null;
  }

  /* ---- Rendering ------------------------------------------------------ */

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

  /* After every interaction: keep the terminal in view under the sticky
     nav, and move focus to the new question or verdict so assistive tech
     announces the change. */
  function settle() {
    var term = body.closest(".terminal");
    var nav = document.querySelector(".nav");
    var navH = nav ? nav.getBoundingClientRect().height : 0;
    var top = term.getBoundingClientRect().top;
    if (top < navH || top > window.innerHeight * 0.6) term.scrollIntoView({ block: "start" });
    var target = body.querySelector(".q-text, .q-result .q-verdict");
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }

  function renderPath(container, collapsed) {
    if (!state.path.length) return;
    var box = h("details", "q-path");
    box.open = !collapsed;
    box.appendChild(h("summary", "node", "TRAVERSAL LOG · " + state.path.length + " STEPS"));
    var ol = h("ol");
    state.path.forEach(function (step, i) {
      var li = h("li", null, "");
      li.appendChild(h("span", "branch", (i < 9 ? "0" : "") + (i + 1) + " " + step.tag));
      li.appendChild(document.createTextNode(" · " + step.q));
      ol.appendChild(li);
    });
    box.appendChild(ol);
    container.appendChild(box);
  }

  /* Plain-terms note under a question: what the jargon means, in one line. */
  function glossRow(text) {
    var p = h("p", "q-gloss");
    p.appendChild(h("b", null, "PLAIN TERMS // "));
    p.appendChild(document.createTextNode(text));
    return p;
  }

  function renderOptions(node, onPick) {
    var opts = h("div", "q-opts");
    node.opts.forEach(function (o) {
      var btn = h("button", "q-opt");
      btn.type = "button";
      btn.dataset.key = o.k;
      var k = h("span", "k", "[" + o.k + "]");
      k.setAttribute("aria-hidden", "true");
      btn.appendChild(k);
      btn.appendChild(document.createTextNode(o.t));
      btn.addEventListener("click", function () {
        onPick(o);
        settle();
      });
      opts.appendChild(btn);
    });
    return opts;
  }

  function renderScreen() {
    var node = SCREEN[state.screenIndex];
    body.textContent = "";
    body.appendChild(h("p", "q-depth", "SCREENING " + (state.screenIndex + 1) + " OF " + SCREEN.length + " // " + node.depth));
    body.appendChild(h("h2", "q-text", node.q));
    body.appendChild(h("p", "q-sub", node.sub));
    if (node.gloss) body.appendChild(glossRow(node.gloss));
    body.appendChild(renderOptions(node, function (o) {
      state.path.push({ q: node.q, tag: o.tag });
      if (o.fail) {
        state.failAnswers += 1;
        if (!state.fails[o.fail]) state.fails[o.fail] = { q: node.q, tag: o.tag, id: node.id };
      }
      if (o.larp) state.larp[o.larp] = (state.larp[o.larp] || 0) + 1;
      if (o.flag) state.flags[o.flag] = (state.flags[o.flag] || 0) + 1;
      state.screenIndex += 1;
      if (state.screenIndex < SCREEN.length) {
        renderScreen();
        return;
      }
      state.larpKey = screeningVerdict();
      state.phase = "tree";
      // three anarchist answers with a clean sheet: the party question is
      // already answered, route straight to the exodus branch
      state.node = flagCount("anarchist") >= 3 ? "commune" : "root";
      renderInterstitial();
    }));
    renderPath(body);
    animateBranch();
  }

  /* Between phases: tell the subject what the screening found. */
  function renderInterstitial() {
    body.textContent = "";
    var fails = failCount();
    var larp = state.larpKey ? RESULTS[state.larpKey] : null;
    var depth, text;
    if (larp) {
      depth = "SCREENING COMPLETE // FAILS THE INSTRUMENT — FILED AS " + larp.short;
      text = "Not a communist, on the archive's instrument. The protocol continues anyway, so the file can record which school you were claiming.";
    } else if (fails) {
      depth = "SCREENING COMPLETE // 1 TEST FAILED — PROVISIONALLY ADMITTED";
      text = "One test failed. The protocol continues; the verdict will say which.";
    } else {
      depth = "SCREENING COMPLETE // FOUR TESTS PASSED";
      text = "The instrument is satisfied. Now the archive finds out which file you belong in.";
    }
    body.appendChild(h("p", "q-depth", depth));
    body.appendChild(h("h2", "q-text", text));
    body.appendChild(h("p", "q-sub", state.node === "commune"
      ? "Three answers already put you outside the party question. Routing to the exodus branch."
      : "Every fork from here is one some faction actually took, schism by schism."));
    body.appendChild(renderTests({ verbal: !!larp && !fails }));
    var go = h("button", "btn", "Continue to the tree");
    go.type = "button";
    go.addEventListener("click", function () {
      renderQuestion();
      settle();
    });
    var actions = h("div", "q-actions");
    actions.appendChild(go);
    body.appendChild(actions);
    renderPath(body);
    animateBranch();
  }

  function renderQuestion() {
    var node = QUESTIONS[state.node];
    var fork = state.path.length - SCREEN.length + 1;
    body.textContent = "";
    body.appendChild(h("p", "q-depth", "FORK " + fork + " // " + node.depth));
    body.appendChild(h("h2", "q-text", node.q));
    body.appendChild(h("p", "q-sub", node.sub));
    if (node.gloss) body.appendChild(glossRow(node.gloss));
    body.appendChild(renderOptions(node, function (o) {
      state.path.push({ q: node.q, tag: o.tag });
      state.node = o.next;
      if (o.next.indexOf("R_") === 0) {
        state.phase = "result";
        renderResult(o.next);
      } else {
        renderQuestion();
      }
    }));
    renderPath(body);
    animateBranch();
  }

  /* The four-test scoreboard.
     opts.verbal  — the verdict is a larp with a clean sheet: the answers
                    were the line, and self-description is not evidence
     opts.open    — a test the register leaves contested for this result
     opts.line    — print the line under each failed test */
  function renderTests(opts) {
    var ul = h("ul", "q-tests");
    var campist = flagCount("campist") > 0;
    TEST_ORDER.forEach(function (key) {
      var t = TESTS[key];
      var f = state.fails[key];
      var isOpen = !f && (key === opts.open || (key === "international" && campist));
      var cls = f ? "fail" : isOpen ? "open" : opts.verbal ? "unevidenced" : "pass";
      var mark = f ? "✗ " : isOpen ? "○ " : opts.verbal ? "— " : "✓ ";
      var li = h("li", cls);
      li.appendChild(document.createTextNode(mark + t.n + " · " + t.name));
      var note = f ? "Failed on: " + f.tag
        : isOpen ? (key === opts.open ? "Contested — Annex C leaves it open" : "Contested — the campist answer; Annex C §02")
        : opts.verbal ? "Not failed on the sheet. Self-description is not evidence."
        : "Passed";
      li.appendChild(h("span", null, note));
      if (f && opts.line) li.appendChild(h("span", "line", "The line: " + t.line));
      ul.appendChild(li);
    });
    return ul;
  }

  function verdictLine(r, larp) {
    var failed = failedKeys();
    var first = failed[0];
    // screening already filed the taker outside the tradition: the school
    // result is what they were claiming, the stamp says what they are
    if (larp) {
      var nums = failed.map(function (k) { return TESTS[k].n; }).join(", ");
      return { cls: "v-fail", text: "LARPER // FILED AS " + larp.short + (failed.length ? " — FAILS TEST" + (failed.length > 1 ? "S " : " ") + nums : " — ON CATEGORY") + " // CLAIMING " + r.name };
    }
    switch (r.verdict) {
      case "larp": {
        if (!failed.length) {
          return { cls: "v-fail", text: r.cleanLabel || "LARPER // THE SHEET PASSES; THE PROFILE DOES NOT — FAILS ON CATEGORY" };
        }
        var nums = failed.map(function (k) { return TESTS[k].n; }).join(", ");
        return { cls: "v-fail", text: "LARPER // FAILS TEST" + (failed.length > 1 ? "S " : " ") + nums + (r.category ? " — AND ON CATEGORY" : "") };
      }
      case "heresy":
        return { cls: "v-fail", text: r.label };
      case "meme":
        return { cls: "v-adj", text: r.label };
      case "adjacent":
        return { cls: "v-adj", text: r.label || "ADJACENT // A DIFFERENT LINEAGE — NOT SCORED" };
      case "contested": {
        if (!failed.length) return { cls: "v-adj", text: r.label };
        return { cls: "v-adj", text: first === "international"
          ? "CONTESTED // INTERNATIONALISM — OPEN ON THE FILE, FAILED ON THE SCREEN"
          : "CONTESTED // PROVISIONAL — FAILED TEST " + TESTS[first].n + ", " + TESTS[first].name + "; INTERNATIONALISM OPEN" };
      }
      default:
        return failed.length
          ? { cls: "v-adj",  text: "COMMUNIST // PROVISIONAL — FAILED TEST " + TESTS[first].n + ", " + TESTS[first].name }
          : { cls: "v-pass", text: r.label || "COMMUNIST // PASSES THE INSTRUMENT" };
    }
  }

  function metaRow(label, value) {
    var p = h("p", "r-meta");
    p.appendChild(h("b", null, label + " "));
    p.appendChild(document.createTextNode(value));
    return p;
  }

  function renderResult(key) {
    var r = RESULTS[key];
    // a larp verdict from screening overrides everything but another larp
    // leaf (the doomer, the bio): those already say what they are
    var larp = state.larpKey && r.verdict !== "larp" ? RESULTS[state.larpKey] : null;
    var v = verdictLine(r, larp);
    var forks = Math.max(0, state.path.length - SCREEN.length);
    body.textContent = "";
    var wrap = h("div", "q-result");
    wrap.appendChild(h("p", "q-depth", "CLASSIFICATION COMPLETE // " + SCREEN.length + " SCREENS · " + forks + (forks === 1 ? " FORK" : " FORKS")));
    wrap.appendChild(h("p", "q-verdict " + v.cls, v.text));

    if (larp) {
      wrap.appendChild(h("h2", "verdict", "FILED AS // " + larp.name));
      wrap.appendChild(h("p", "r-desc", larp.desc));
      wrap.appendChild(h("p", "q-depth", "CLAIMING // " + r.name));
      wrap.appendChild(h("p", "r-desc r-claim", "Your tree answers are " + r.name.toLowerCase().replace(/–/g, "-") + "'s — this is the file you were pointing at when you said the word. " + r.desc));
    } else {
      wrap.appendChild(h("h2", "verdict", "RESULT // " + r.name));
      wrap.appendChild(h("p", "r-desc", r.desc));
    }

    wrap.appendChild(renderTests({
      verbal: (r.verdict === "larp" || !!larp) && !failCount(),
      open: r.verdict === "contested" ? "international" : null,
      line: true
    }));

    var meta = larp || r;
    if (larp) wrap.appendChild(metaRow("FILE CLAIMED:", r.page ? "№ " + r.file + " — the dossier is linked below, so you can see what the word costs" : r.name));
    else if (r.page) wrap.appendChild(metaRow("FILE:", "№ " + r.file + " — open the full dossier below"));
    else wrap.appendChild(metaRow("FILED UNDER:", r.file === "—" ? "no file — see the nearest one below" : "Annex " + r.file));
    wrap.appendChild(metaRow("COMRADES:", meta.comrades));
    wrap.appendChild(metaRow("SWORN ENEMIES:", meta.enemies));
    wrap.appendChild(metaRow("READ FIRST:", meta.read));

    var actions = h("div", "q-actions");
    var open = h("a", "btn", larp ? "Open the register" : r.page ? "Open dossier № " + r.file : "Open the file");
    open.href = larp ? larp.href : r.page ? "schools/" + r.page + ".html" : r.href;
    if (larp && r.page) {
      var claimed = h("a", "btn ghost", "Dossier № " + r.file + " — as claimed");
      claimed.href = "schools/" + r.page + ".html";
      actions.appendChild(claimed);
    }
    var again = h("button", "btn ghost", "Re-run protocol");
    again.type = "button";
    again.addEventListener("click", function () {
      reset();
      renderScreen();
      settle();
    });
    var line = h("a", "btn ghost", "Read the instrument");
    line.href = "the-line.html";
    actions.appendChild(open);
    actions.appendChild(again);
    actions.appendChild(line);
    wrap.appendChild(actions);

    body.appendChild(wrap);
    renderPath(body, true);
    animateBranch();
  }

  /* Terminal-style shortcuts: the bracketed letter on each option is live. */
  function armKeys() {
    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      var btn = body.querySelector('.q-opt[data-key="' + e.key.toUpperCase() + '"]');
      if (btn) { e.preventDefault(); btn.click(); }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    body = document.getElementById("quiz-body");
    if (!body) return;
    reset();
    armKeys();
    renderScreen();
  });

  // exposed for scripts/verify-quiz.js
  window.RedQuiz = {
    SCREEN: SCREEN, QUESTIONS: QUESTIONS, RESULTS: RESULTS, TESTS: TESTS, LARP: LARP,
    reset: reset, state: function () { return state; },
    screeningVerdict: screeningVerdict, verdictLine: verdictLine
  };
})();
