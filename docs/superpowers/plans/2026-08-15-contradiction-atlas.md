# Contradiction Atlas Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Red Archive's CRT/agitprop presentation with the bright Contradiction Atlas identity across all thirty pages while preserving every route, asset, and interaction on GitHub Pages.

**Architecture:** Keep the dependency-free HTML/CSS/JavaScript architecture and concentrate the redesign in the global stylesheet and injected shared chrome. Give the home page one intentional markup revision, keep dossier content contracts stable, and replace continuous canvas/hologram effects with a finite DOM/CSS route animation. Add a standard-library verification script so the existing static URL contract can be tested before and after every visual task.

**Tech Stack:** HTML5, CSS custom properties/Grid/Flexbox, browser-native JavaScript, Python 3 standard library verification, GitHub Pages root deployment.

**Spec:** `docs/superpowers/specs/2026-08-15-contradiction-atlas-design.md`

## Global Constraints

- The site remains plain HTML, CSS, and JavaScript with no package manager and no build step.
- Preserve all ten root HTML routes, all twenty `schools/*.html` routes, `index.html#tree`, and `index.html#files`.
- Preserve the two-depth relative-path model used by `js/shared.js`.
- Keep `.nojekyll` and continue publishing the repository root through `.github/workflows/pages.yml`.
- Preserve tree hover/focus isolation, Enter/Space dossier activation, quiz outcomes, media controls, portrait fallbacks, and reduced-motion support.
- Do not rewrite substantive historical or political copy.
- Use the specified Contradiction Atlas palette and `Anybody`, `Commissioner`, and `Martian Mono` roles.
- Reserve vermilion for schism/contestation; encode descent with solid ochre and influence with dashed teal.
- Validate at 390 px, 768 px, and desktop widths.

## File Map

- Create `scripts/verify-site.py`: dependency-free route, reference, fragment, and redesign-contract verifier.
- Replace `css/style.css`: all shared tokens, layouts, components, responsive behavior, and page-type treatments.
- Replace `css/banner.css`: finite route-banner presentation.
- Delete `css/entrance.css`: the entrance gate no longer exists.
- Modify `js/shared.js`: page classification, grouped navigation, mobile menu behavior, and structured footer.
- Replace `js/banner.js`: static semantic route markup with one finite CSS reveal.
- Modify `js/tree.js`: replace star nodes with cartographic junction markers without changing relationships.
- Modify `js/quiz.js`: atlas wording/marker only; preserve question graph and results.
- Create `js/motion.js`: one-shot viewport reveals and progressive motion setup.
- Modify `index.html`: map-first hero, route key, era-grouped file index, compact annex collection, metadata, and script cleanup.
- Modify all root and `schools/*.html` documents mechanically: replace the Google Fonts request while preserving paths and content.
- Delete `js/star-logo.js`: the retired holographic entrance has no remaining consumer.
- Create `assets/og.png`: one finished-site social preview card.

---

### Task 1: Static Site Safety Net

**Files:**
- Create: `scripts/verify-site.py`

**Interfaces:**
- Consumes: repository-root paths and existing HTML files.
- Produces: `python3 scripts/verify-site.py`, exiting `0` with a route/reference summary or `1` with actionable failures.

- [ ] **Step 1: Create the verifier with the exact route contract**

Implement `EXPECTED_HTML` with these thirty paths:

```python
EXPECTED_HTML = [
    "index.html", "timeline.html", "conflicts.html", "the-line.html",
    "the-ledger.html", "register.html", "faith.html", "britain.html",
    "gallery.html", "quiz.html",
    *[f"schools/{name}.html" for name in (
        "utopian-socialism", "marxism", "anarcho-communism", "de-leonism",
        "orthodox-marxism", "leninism", "luxemburgism", "left-communism",
        "trotskyism", "marxism-leninism", "western-marxism", "maoism",
        "titoism", "guevarism", "posadism", "juche", "hoxhaism",
        "autonomism", "eurocommunism", "dengism",
    )],
]
```

Use `html.parser.HTMLParser` to collect every `id`, plus `href`, `src`, and `poster` from each document. Resolve references relative to their source document with `urllib.parse.urlsplit`; ignore `http`, `https`, `mailto`, `data`, and protocol-relative URLs. Report missing files and missing fragments. Explicitly verify `.nojekyll`, `.github/workflows/pages.yml`, `index.html#tree`, and `index.html#files`.

- [ ] **Step 2: Run the verifier against the untouched runtime site**

Run: `python3 scripts/verify-site.py`

Expected: `PASS: 30 HTML routes; 0 missing local references; 0 missing fragments`.

- [ ] **Step 3: Confirm the verifier itself has no syntax errors**

Run: `python3 -m py_compile scripts/verify-site.py`

Expected: exit `0`.

- [ ] **Step 4: Commit the safety net**

```bash
git add scripts/verify-site.py
git commit -m "test: add static site contract verifier"
```

---

### Task 2: Contradiction Atlas Design System

**Files:**
- Modify: `scripts/verify-site.py`
- Replace: `css/style.css`
- Modify mechanically: `*.html`, `schools/*.html`

**Interfaces:**
- Consumes: every existing runtime class name used in the HTML and JavaScript.
- Produces: global CSS tokens and component styles used by all later tasks.

- [ ] **Step 1: Add failing design-contract checks**

Append checks that require the new font roles and semantic color variables and reject the old ambient effects:

```python
css = (ROOT / "css/style.css").read_text(encoding="utf-8")
for token in (
    "--atlas-ground: #e9eef0", "--atlas-sheet: #f8faf8",
    "--carbon: #20282c", "--schism: #d44b38", "--descent: #c7982d",
    "--influence: #2a7772", "--route: #335c91",
    '"Anybody"', '"Commissioner"', '"Martian Mono"',
):
    require(token in css.lower() if token.startswith("--") else token in css,
            f"missing design token {token}")
for forbidden in ("CRT scanlines", ".glitch::before", ".glitch::after"):
    require(forbidden not in css, f"retired effect remains: {forbidden}")
```

Run: `python3 scripts/verify-site.py`

Expected: FAIL on the first missing Contradiction Atlas token.

- [ ] **Step 2: Replace the token and foundation layers**

Start `css/style.css` with the specified tokens and roles:

```css
:root {
  --atlas-ground: #e9eef0;
  --atlas-sheet: #f8faf8;
  --carbon: #20282c;
  --carbon-soft: #566267;
  --schism: #d44b38;
  --descent: #c7982d;
  --influence: #2a7772;
  --route: #335c91;
  --hairline: rgba(32, 40, 44, 0.18);
  --font-display: "Anybody", "Arial Narrow", sans-serif;
  --font-body: "Commissioner", system-ui, sans-serif;
  --font-mono: "Martian Mono", ui-monospace, monospace;
  --header-height: 4.25rem;
}
```

Rebuild the reset, body, links, focus, `.shell`, headings, `.eyebrow`, `.hero`, `.hero-meta`, `.sec`, `.btn`, and `.footer` rules. Remove fixed body overlays, glitch pseudo-elements, dark panels, and constant animations. Give `#tree` and `#files` `scroll-margin-top: calc(var(--header-height) + 1rem)`.

- [ ] **Step 3: Rebuild every existing shared component class**

Retain and restyle the complete class contract already used by the site:

```text
.tree-wrap .tree-legend .t-edge .t-node
.file-grid .file-card .fc-no .fc-name .fc-desc
.dossier-head .file-no .subtitle .stamp-row .stamp
.lineage .doctrine .figures .portrait .fallback
.mini-timeline .timeline .epoch .tl-tag
.schism-list .pull .file-nav
.conflict .conflict-head .conflict-body .stakes
.quiz-shell .terminal .term-bar .term-body .q-depth .q-text .q-opts
.q-opt .q-path .q-result .q-actions
.cta-band .clip .plate .gallery-grid
```

Use atlas sheets for reading surfaces, route-line borders for structure, natural-color media, and a 68ch maximum measure for dossier prose. Preserve existing selectors required by `tree.js`, `quiz.js`, and portrait fallbacks.

- [ ] **Step 4: Add responsive and reduced-motion foundations**

At `max-width: 760px`, collapse multi-column content grids, keep body text at least `1rem`, make interactive controls at least 44px high, and ensure `.shell` uses `1rem` side padding. At `prefers-reduced-motion: reduce`, remove all animation and transition durations.

- [ ] **Step 5: Replace the Google Fonts request mechanically**

Across the thirty HTML files, replace the existing `family=IBM+Plex+Mono...Stalinist+One` request with:

```html
<link href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..125,400..800&amp;family=Commissioner:wght@400;500;600;700&amp;family=Martian+Mono:wght@400;600;700&amp;display=swap" rel="stylesheet">
```

Do not alter any other head content in this mechanical pass.

- [ ] **Step 6: Run contract and diff checks**

Run: `python3 scripts/verify-site.py && git diff --check`

Expected: both pass.

- [ ] **Step 7: Commit the global design system**

```bash
git add css/style.css scripts/verify-site.py *.html schools/*.html
git commit -m "feat: establish Contradiction Atlas design system"
```

---

### Task 3: Shared Navigation and Atlas Colophon

**Files:**
- Modify: `scripts/verify-site.py`
- Modify: `js/shared.js`
- Modify: `css/style.css`

**Interfaces:**
- Consumes: the current two-depth `R` prefix and existing page filenames.
- Produces: `#nav-toggle`, `#nav-panel`, grouped `.nav-primary`, `.nav-annexes`, body page classes, and `.footer-grid`.

- [ ] **Step 1: Add failing shared-chrome checks**

Require these exact accessibility contracts in `js/shared.js`:

```python
shared = (ROOT / "js/shared.js").read_text(encoding="utf-8")
for token in ('id="nav-toggle"', 'aria-controls="nav-panel"',
              'aria-expanded="false"', 'aria-current="page"',
              'class="footer-grid"'):
    require(token in shared, f"missing shared chrome contract: {token}")
```

Run: `python3 scripts/verify-site.py`

Expected: FAIL on `nav-toggle`.

- [ ] **Step 2: Add page classification without changing paths**

On DOM ready, add `page-home`, `page-school`, `page-quiz`, or `page-reference` to `body`, plus `has-lineage` when `.lineage` is present. Keep `R = "../"` only for paths containing `/schools/`.

- [ ] **Step 3: Rebuild the navigation markup**

Keep direct destinations Atlas, Files, Timeline, Schisms, Plates, and Quiz. Put The Line, The Ledger, Register, Faith, and Britain inside a native `<details class="nav-annexes">`. Add:

```html
<button id="nav-toggle" class="nav-toggle" type="button"
  aria-controls="nav-panel" aria-expanded="false">
  <span>Explore</span><span aria-hidden="true">＋</span>
</button>
```

Set `aria-current="page"` on the matching direct link or annex link. Treat school pages as part of Files. Do not restore the live system clock.

- [ ] **Step 4: Implement mobile menu behavior**

Toggle `.is-open` on `#nav-panel`, synchronize `aria-expanded`, close on Escape, and return focus to `#nav-toggle`. On a mobile navigation link click, close the panel. Do not trap focus because the panel is non-modal.

- [ ] **Step 5: Rebuild the footer as a grouped colophon**

Generate `.footer-grid` with three labelled groups: About, Explore, and Annexes. Preserve licensing, source-repository, portrait provenance, and editorial-position copy. Keep every current footer destination.

- [ ] **Step 6: Style and browser-check the shared chrome**

Add desktop dropdown styles and the mobile single-row header/panel. Verify `nav` remains one row at 390px while closed and the open panel does not clip links.

Run: `node --check js/shared.js && python3 scripts/verify-site.py`

Expected: both pass.

- [ ] **Step 7: Commit shared chrome**

```bash
git add js/shared.js css/style.css scripts/verify-site.py
git commit -m "feat: add responsive atlas navigation"
```

---

### Task 4: Map-First Home Page and Finite Route Banner

**Files:**
- Modify: `scripts/verify-site.py`
- Modify: `index.html`
- Replace: `css/banner.css`
- Replace: `js/banner.js`
- Delete: `css/entrance.css`
- Delete: `js/star-logo.js`
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `#banner-hero`, `#tree`, `#tree-canvas`, `#files`, and existing file/CTA URLs.
- Produces: `.hero-grid`, `.route-key`, `.rb-route`, `.file-era`, `.annex-grid`, and a map-first first viewport.

- [ ] **Step 1: Add failing home-page checks**

Require `.hero-grid`, `.route-key`, `.file-era`, and `.annex-grid` in `index.html`; reject `class="entrance"`, `js/star-logo.js`, and `css/entrance.css`.

Run: `python3 scripts/verify-site.py`

Expected: FAIL because `.hero-grid` is absent.

- [ ] **Step 2: Replace the duplicate entrance and hero**

Delete the entrance section and its CSS/JS references. Rebuild the existing `.hero` as a two-column `.hero-grid`: title/thesis/meta on the left, route key and the finite banner on the right. Use these exact route-key labels: `Descent`, `Influence`, `Schism`. Correct `SCHISMS LOGGED` from `12` to `13`.

- [ ] **Step 3: Replace the banner renderer**

In `js/banner.js`, keep the seven historical labels but render semantic DOM rather than a canvas:

```javascript
var TICKS = [
  ["1516", "Utopia"], ["1848", "Manifesto"], ["1871", "Commune"],
  ["1917", "October"], ["1949", "Beijing"], ["1991", "Dissolution"],
  ["Now", "Archive"]
];
```

`RedBanner.mount(host)` creates one `.rb-route`, an ordered list of `.rb-stop` items, and the label `Five centuries · twenty schools · thirteen recorded schisms`. No `requestAnimationFrame`, timer, canvas, or loop remains.

- [ ] **Step 4: Implement the finite route reveal**

Use a scale-X line animation and staggered stop opacity in `css/banner.css`. Run once on load and retain the completed state. Under reduced motion, show the complete route immediately.

- [ ] **Step 5: Group files and annexes structurally**

Wrap the existing twenty file cards into four `.file-era` groups without changing card copy or URLs:

```text
Foundations: files 01–05
Revolutionary century: files 06–10
Global roads: files 11–16
Late currents: files 17–20
```

Wrap Annex A–E cards in `.annex-grid`; place quiz and source actions in `.home-actions`. Preserve all seven actions and their destination URLs.

- [ ] **Step 6: Add tree pan guidance**

Add `<p class="tree-pan-hint">Drag to travel across the full map. Select any junction to open its dossier.</p>` immediately before `.tree-wrap`. Hide the guidance on wide screens and expose it on touch-width screens.

- [ ] **Step 7: Validate and commit the home page**

Run: `node --check js/banner.js && python3 scripts/verify-site.py && git diff --check`

Expected: all pass.

```bash
git add index.html css/style.css css/banner.css js/banner.js scripts/verify-site.py
git add -u css/entrance.css js/star-logo.js
git commit -m "feat: rebuild home page around the lineage map"
```

---

### Task 5: Cartographic Tree, Dossier Rail, and Quiz

**Files:**
- Modify: `js/tree.js`
- Modify: `js/quiz.js`
- Modify: `css/style.css`
- Modify: `scripts/verify-site.py`

**Interfaces:**
- Consumes: existing tree node/edge arrays, quiz `QUESTIONS`/`RESULTS`, `.lineage`, and shared body classes.
- Produces: circular `.t-junction` markers, responsive `.has-lineage` layout, and route-sheet quiz presentation.

- [ ] **Step 1: Add failing interaction-contract checks**

Require `t-junction` in `js/tree.js`, reject the verdict prefix `★`, and require the existing keyboard keys and all twenty result page slugs to remain present.

Run: `python3 scripts/verify-site.py`

Expected: FAIL because `t-junction` is absent.

- [ ] **Step 2: Replace tree stars with junction markers**

Replace the star path with an SVG circle carrying classes `t-junction t-star`; preserve node coordinates, labels, edge classes, click navigation, `tabindex="0"`, and Enter/Space handlers. Style the junction as an atlas node with a route-blue focus ring; connected edges keep semantic colors/patterns.

- [ ] **Step 3: Add mobile tree overview behavior**

Keep the full SVG dimensions so relationships remain accurate. On narrow screens, give `.tree-wrap` horizontal scroll, snap the canvas start predictably, add an inset overview shadow, and keep the legend sticky within the scroll container. Do not shrink labels below their existing SVG size.

- [ ] **Step 4: Turn school shells into dossier-plus-rail layouts**

For `body.has-lineage .shell`, use desktop grid areas:

```css
body.has-lineage .shell {
  grid-template-columns: minmax(15rem, 0.34fr) minmax(0, 1fr);
  grid-template-areas: "head head" "lineage dossier";
}
```

Place `.dossier-head`, `.lineage`, and `.dossier` in those areas. Make `.lineage` sticky below the header on desktop and return to one column below 900px. Preserve reading measure and previous/next navigation.

- [ ] **Step 5: Restyle the quiz as a route-planning sheet**

Keep the question graph and result data byte-for-byte except for the result marker. Replace `"★ " + r.name` with `"RESULT // " + r.name`. Style answer buttons as route branches with a visible junction and give `.q-path` semantic connector lines.

- [ ] **Step 6: Syntax- and contract-check**

Run:

```bash
node --check js/tree.js
node --check js/quiz.js
python3 scripts/verify-site.py
```

Expected: all pass and all twenty result slugs remain verified.

- [ ] **Step 7: Commit interactive surfaces**

```bash
git add js/tree.js js/quiz.js css/style.css scripts/verify-site.py
git commit -m "feat: map interactions into the atlas system"
```

---

### Task 6: Complete Page-Type Polish and Social Card

**Files:**
- Modify: `css/style.css`
- Create: `assets/og.png`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing special-page class names and final visual system.
- Produces: coherent timeline, conflict, annex, gallery, media, and social-preview treatments.

- [ ] **Step 1: Review every page type against the spec**

Serve the site and inspect one representative of each structure: `timeline.html`, `conflicts.html`, `the-line.html`, `register.html`, `gallery.html`, `quiz.html`, and `schools/marxism.html`. Record only concrete clipping, hierarchy, contrast, or overflow issues.

- [ ] **Step 2: Apply page-specific semantic accents**

Use solid ochre for `.timeline`, broken vermilion for `.conflict`, teal/route states for register verdicts, and provenance strips for `.plate`, `.clip`, and `.portrait`. Keep natural image color and captions. Avoid new decoration unrelated to each page's content.

- [ ] **Step 3: Generate exactly one finished-site social card**

Use one image-generation request with this brief:

```text
Create a complete 1200x630 landscape social preview card for RED ARCHIVE.
Exact visible text: "RED ARCHIVE" and "A MAP OF ARGUMENTS".
Bright cartographic reference-atlas aesthetic: polar mist field, carbon typography,
solid ochre descent route, dashed teal influence route, broken vermilion schism route,
small cobalt junctions, crisp modern museum-map composition. No flags, leaders,
hammer-and-sickle, holograms, CRT effects, black-neon background, or extra text.
Typography should feel like a bold variable-width grotesk paired with tiny map labels.
High legibility in Slack, X, iMessage, and link unfurls.
```

Inspect the result once. Retry once only if either exact text string is incorrect or illegible. Save the accepted asset as `assets/og.png`.

- [ ] **Step 4: Wire social metadata**

Keep the existing absolute production host and set:

```html
<meta property="og:image" content="https://red-archive.github.io/assets/og.png">
<meta name="twitter:image" content="https://red-archive.github.io/assets/og.png">
```

Do not change the existing canonical host or route.

- [ ] **Step 5: Validate and commit page-type polish**

Run: `python3 scripts/verify-site.py && git diff --check`

Expected: pass with `assets/og.png` resolved.

```bash
git add css/style.css index.html assets/og.png
git commit -m "feat: finish atlas page types and social preview"
```

---

### Task 7: Progressive Animation Layer

**Files:**
- Create: `js/motion.js`
- Modify: `css/style.css`
- Modify: `js/quiz.js`
- Modify mechanically: `*.html`, `schools/*.html`
- Modify: `scripts/verify-site.py`

**Interfaces:**
- Consumes: finished atlas components, `.rb-route`, `.q-opt`, `.t-junction`, the mobile navigation panel, and `prefers-reduced-motion`.
- Produces: `html.motion-ready`, `[data-reveal]`, `.is-visible`, one-shot viewport reveals, and finite interaction animations.

- [ ] **Step 1: Add failing progressive-motion checks**

Require `js/motion.js` to exist and contain `IntersectionObserver`, `motion-ready`, `data-reveal`, `is-visible`, `unobserve`, and `prefers-reduced-motion`. Require every HTML document to reference the script with the correct root-relative prefix.

Run: `python3 scripts/verify-site.py`

Expected: FAIL because `js/motion.js` does not exist.

- [ ] **Step 2: Implement safe one-shot viewport reveals**

In `js/motion.js`, select these existing surfaces:

```javascript
var SELECTORS = [
  ".dossier-head", ".sec", ".lineage", ".doctrine", ".figures",
  ".conflict", ".epoch", ".file-era", ".annex-grid > *", ".cta-band",
  ".plate", ".clip"
];
```

Set `data-reveal` and a bounded `--reveal-index` from `0` through `5`, then add `motion-ready` to `document.documentElement`. If reduced motion is requested or `IntersectionObserver` is unavailable, add `is-visible` immediately. Otherwise observe each target, add `is-visible` at threshold `0.12`, and immediately `unobserve(target)`.

- [ ] **Step 3: Add reveal and interaction CSS**

Only hide marked elements under `.motion-ready`:

```css
.motion-ready [data-reveal] {
  opacity: 0;
  transform: translateY(1rem);
}
.motion-ready [data-reveal].is-visible {
  opacity: 1;
  transform: none;
  transition: opacity 480ms ease, transform 560ms cubic-bezier(.2,.7,.2,1);
  transition-delay: calc(var(--reveal-index, 0) * 45ms);
}
```

Add finite hover/focus motion for `.file-card`, `.t-junction`, `.q-opt`, `.btn`, and `.nav-toggle`; add a compact open/close transition for `#nav-panel`. No selector receives an infinite animation.

- [ ] **Step 4: Animate quiz branch changes once**

When `renderQuestion()` or `renderResult()` replaces the body, add `.is-entering` to `.term-body`, remove it on `animationend`, and provide a 360ms branch-draw/settle animation. Keep the state graph, result copy, and destination URLs unchanged.

- [ ] **Step 5: Wire the script into all thirty documents**

Add `<script defer src="js/motion.js"></script>` after `js/shared.js` on root pages and `<script defer src="../js/motion.js"></script>` after `../js/shared.js` on school pages. Preserve all existing script ordering.

- [ ] **Step 6: Prove reduced-motion and no-loop behavior**

Under `@media (prefers-reduced-motion: reduce)`, force all reveal targets visible with no transform, delay, animation, or transition. Verify `rg -n 'infinite' css js` finds no newly introduced continuous animations; the finite route banner remains allowed.

Run:

```bash
node --check js/motion.js
node --check js/quiz.js
python3 scripts/verify-site.py
git diff --check
```

Expected: all pass.

- [ ] **Step 7: Commit the motion layer**

```bash
git add js/motion.js js/quiz.js css/style.css scripts/verify-site.py *.html schools/*.html
git commit -m "feat: add progressive atlas animations"
```

---

### Task 8: Browser QA and GitHub Pages Proof

**Files:**
- Modify only if verification reveals a concrete defect.

**Interfaces:**
- Consumes: complete static site.
- Produces: verified desktop/mobile experience and Pages-compatible runtime tree.

- [ ] **Step 1: Run the full static verification suite**

```bash
python3 scripts/verify-site.py
python3 -m py_compile scripts/verify-site.py
for file in js/*.js; do node --check "$file"; done
git diff --check
```

Expected: all commands pass.

- [ ] **Step 2: Start the exact static hosting model**

Run: `python3 -m http.server 8471 --bind 127.0.0.1`

Verify `200` for:

```text
/
/timeline.html
/conflicts.html
/schools/marxism.html
/gallery.html
/quiz.html
/assets/og.png
/.nojekyll
```

- [ ] **Step 3: Perform desktop browser QA at 1440×1000**

Open `/`, verify the map-first hero and complete banner state, follow a tree node to a dossier, complete one quiz path, open and close Annexes, and inspect timeline/conflict/gallery pages. Require zero console errors from local code.

- [ ] **Step 4: Perform mobile browser QA at 390×844**

Verify the closed header remains one row, menu links are not clipped, Escape closes the menu and returns focus, `#tree`/`#files` anchors remain visible, the tree can pan, dossier content has no horizontal overflow, and quiz choices are comfortably tappable.

- [ ] **Step 5: Check the tablet breakpoint at 768×1024**

Verify content grids, dossier rail collapse, and media sizing. Confirm no intermediate-width navigation overlap.

- [ ] **Step 6: Confirm GitHub Pages inputs**

```bash
test -f .nojekyll
test -f .github/workflows/pages.yml
rg -n 'path: \.' .github/workflows/pages.yml
git status --short --branch
```

Expected: compatibility files present, artifact remains repository root, and only intentional commits are ahead of `origin/main`.

- [ ] **Step 7: Fix only observed defects and rerun the relevant checks**

For every fix, reproduce the defect before editing, make the smallest CSS/JS/HTML change, rerun the failing check, then rerun `python3 scripts/verify-site.py`.

- [ ] **Step 8: Commit verified fixes if any**

```bash
git add -u
git commit -m "fix: resolve redesign QA findings"
```

Skip the commit when QA requires no changes.
