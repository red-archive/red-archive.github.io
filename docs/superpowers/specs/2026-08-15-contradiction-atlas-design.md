# Red Archive — Contradiction Atlas Redesign

## Purpose

Redesign the complete Red Archive website around the subject's most distinctive
material: the lines of descent, influence, and schism connecting twenty schools of
communist thought. The finished site should feel like an authored cartographic
reference work rather than a simulated state terminal.

The redesign covers the home page, shared navigation and footer, twenty school
dossiers, timeline, schism ledger, five annexes, gallery, and classification quiz. It
preserves the archive's content, editorial voice, interactions, and existing URLs.

## Goals

- Make relationships between schools the visual and navigational core of the site.
- Replace the dark CRT and holographic aesthetic with a bright, legible atlas system.
- Improve orientation across thirty static pages without introducing a framework.
- Make the header, tree, and long-form pages genuinely usable on mobile devices.
- Preserve keyboard access, reduced-motion support, portrait fallbacks, and the quiz.
- Keep direct deployment from the repository root compatible with GitHub Pages.

## Non-goals

- Rewriting the archive's political arguments or changing its editorial position.
- Changing existing page paths, dossier order, or the quiz's classifications.
- Adding accounts, analytics, server-side behavior, search infrastructure, or a build
  dependency.
- Replacing the archive's locally stored images and videos with generated imagery.

## Design thesis

Red Archive is a map of arguments. Its identity will come from a continuous
"argument line" that changes treatment according to the archive's actual relationship
model:

- solid ochre: descent;
- dashed teal: influence;
- broken vermilion: schism;
- route blue: orientation, links, and active navigation.

This grammar will appear in the lineage tree, section rules, timeline, file index,
lineage boxes, cross-references, and quiz traversal. Red is reserved for rupture,
warning, and contested material instead of coating the entire interface.

## Visual system

### Palette

The atlas grammar is expressed in the Rosé Pine palette, with a light theme
(Rosé Pine Dawn) and a dark theme (Rosé Pine). The reader's saved choice wins,
otherwise the site follows `prefers-color-scheme`. Semantic roles map to swatches
as follows (Dawn / dark):

- Page ground: base `#FAF4ED` / `#191724`; reading sheets: surface `#FFFAF3` /
  `#1F1D2E`; raised panels: overlay `#F2E9E1` / `#26233A`.
- Primary text: text `#575279` / `#E0DEF4`; secondary text: subtle `#797593` /
  `#908CAA`; hairlines: highlight-med.
- Schism and contested material: love `#B4637A` / `#EB6F92`.
- Descent and historical continuity: gold `#EA9D34` / `#F6C177`.
- Influence, evidence, secondary data: foam `#56949F` (Dawn lines) / pine
  `#31748F` (dark lines).
- Route — navigation, links, current location: pine `#286983` / foam `#9CCFD8`.
- Focus rings: iris `#907AA9` / `#C4A7E7`.

Dawn's love, gold and foam do not reach 4.5:1 for small text, so text-role
variants (`--schism-ink`, `--descent-ink`, `--influence-ink`) are derived by
mixing the swatch toward the text colour; lines and fills keep the pure swatch.
No accent family outside Rosé Pine is introduced.

Switching theme animates: a circular wipe from the toggle via the View
Transitions API where available, otherwise a synchronized colour crossfade; the
sun/moon control morphs in step. Reduced-motion users get an instant swap.

### Typography

- `Anybody`: expressive variable-width display face for the brand and page titles.
- `Commissioner`: highly readable body face for long dossiers and annexes.
- `Martian Mono`: restrained utility face for dates, file identifiers, legends, and
  provenance.

Display width and weight may vary by context, but body copy remains calm and uses a
roughly 65–72-character reading measure. Monospace type is metadata, not the default
voice of the interface.

### Shape and surface

The site uses crisp rectangular sheets, thin route lines, small circular junctions,
and occasional clipped corners derived from map keys and conservation labels. Cards
use shallow elevation and restrained borders. CRT scanlines, vignette overlays,
glitches, holographic beams, faux terminal dots, and constant system-clock motion are
removed.

Historical imagery returns to natural color where available. Captions gain a compact
provenance strip that distinguishes portraits, plates, and moving material without
obscuring the image.

## Page architecture

### Shared navigation

Desktop navigation uses a compact two-part header: brand and archive status on the
left, primary destinations on the right. Atlas, Files, Timeline, Schisms, Plates, and
Quiz remain directly visible. An Annexes control contains The Line, The Ledger,
Register, Faith, and Britain, so eleven equal-weight links no longer compete in one
line.

On narrow screens, the header becomes a single-row bar with an explicit menu button.
The expanded menu is a stable panel rather than a wrapping link cloud. It supports
Escape, returns focus to the trigger, exposes `aria-expanded`, and marks the current
page with `aria-current="page"`.

Anchor targets receive scroll margin so `#tree` and `#files` remain visible below the
sticky header.

### Home page

The duplicate full-viewport entrance is removed. The first viewport combines:

- the Red Archive thesis and concise scope statement;
- the key archive totals;
- a route-key introduction to descent, influence, and schism;
- a direct visual transition into the lineage map.

The existing animated holographic star is retired. The historical banner becomes a
quiet route animation that draws the archive's seven labelled junctions once, then
rests. It does not loop, glitch, or run a continuous render cycle after completion.

The file index is grouped visually by era while preserving the current twenty links
and descriptions. Annex calls to action become a compact indexed collection instead
of seven repeated full-width bands.

### Lineage tree

Desktop retains the complete interactive SVG and its hover/focus isolation behavior.
Colors and edge patterns adopt the new semantic route grammar.

Mobile retains horizontal pan for the full map and adds clear pan guidance plus a
compact relationship key. The container uses scroll snapping and a visible overview
treatment so the map no longer appears as an unexplained cropped diagram. Keyboard
activation and dossier links remain unchanged.

### Dossiers and annexes

Each school dossier keeps its existing content contract: metadata, lineage, origin,
doctrine, figures, practice, schisms, timeline, legacy, and previous/next navigation.

The redesign gives this contract a consistent atlas layout:

- a compact folio header with title, subtitle, and status labels;
- a relationship rail for parent, descendants, and schisms;
- a centered long-form reading column;
- doctrine and figure grids that expand without flattening text hierarchy;
- clear continuation navigation at the end of each file.

Annexes and special pages reuse the same typography and route grammar. The conflict
ledger emphasizes the broken schism line; the timeline emphasizes the descent line;
the gallery emphasizes provenance; and the register emphasizes test and verdict
states. The layout will not force symmetrical treatment where the text does not claim
equal evidentiary weight.

### Quiz

The branching logic, result set, and traversal log stay intact. The faux terminal
becomes a route-planning sheet: each answer adds a visible junction to the argument
line, current depth remains explicit, and answer buttons retain clear hover, focus,
and touch states.

### Footer

The footer becomes an atlas colophon with grouped route links, source/licensing
information, and the archive's stated editorial position. Existing content is kept,
but the dense single paragraph is reorganized for scanning.

## Motion

Motion reveals the archive's structure without competing with long-form reading:

- the home-page argument line draws through selected historical junctions once;
- page headers, section headings, relationship panels, cards, and media enter once as
  they approach the viewport;
- file cards and tree junctions respond to hover and keyboard focus with short route
  and elevation transitions;
- each quiz answer draws the next branch before the new question settles;
- the mobile navigation panel opens and closes with one compact transition.

Section reveals are progressive enhancement. Content is visible by default, and a
`motion-ready` class is applied only after the motion script has marked its targets,
so script failure cannot leave pages blank. Viewport reveals unobserve themselves
after their first completion. No ambient animation loops while a reader is stationary.
The interface respects `prefers-reduced-motion` by showing final states immediately.

## Content corrections

The redesign will correct objective interface metadata discovered during the audit:

- the home-page schism total changes from 12 to 13 to match the conflict ledger;
- the banner's stale fixed year-span label becomes wording that does not drift;
- active navigation and accessibility labels are corrected.

No substantive historical or political claims are rewritten as part of this work.

## Technical approach

The site remains plain HTML, CSS, and JavaScript with no package manager and no build
step. Existing page paths, relative assets, `.nojekyll`, and the two-depth path model
for root pages and `schools/` pages are preserved.

Implementation is concentrated in the shared surfaces:

- rebuild the global design system in `css/style.css`;
- replace the entrance and banner presentation in their existing CSS/JS modules;
- improve the injected navigation/footer in `js/shared.js`;
- add the progressive animation layer in `js/motion.js`;
- adjust `index.html` only where the new information hierarchy requires markup;
- make minimal class-level changes to other HTML files only when CSS cannot express
  the required semantic layout;
- keep `js/tree.js` and `js/quiz.js` data and navigation contracts stable.

The GitHub Actions workflow continues publishing the repository root. Because the
repository's Pages setting currently also performs legacy branch publication, the
implementation avoids a generated output directory that could race with that second
publisher. Both mechanisms will therefore serve the same static files. The duplicate
publisher should be disabled separately in repository settings when convenient, but
it does not block this redesign.

## Accessibility and responsive behavior

- All interactive elements expose visible focus styles with sufficient contrast.
- Navigation menu state is announced and fully keyboard operable.
- Tree nodes keep Enter and Space activation.
- Touch targets are at least 44 CSS pixels where practical.
- The layout is validated at 390 px, 768 px, and desktop widths.
- Long text remains readable without horizontal overflow.
- Media keeps captions, alt text, native controls, and conservative preloading.
- Portrait failure states remain named and understandable.
- Reduced-motion users see no route drawing, glitching, or looping ambient effects.

## Validation

- Parse all thirty HTML documents and resolve every local `href`, `src`, and `poster`.
- Check all local fragment targets, including `index.html#tree` and `index.html#files`.
- Syntax-check all JavaScript files.
- Serve the repository over HTTP and verify representative root, annex, dossier,
  gallery, and quiz routes.
- Exercise the mobile navigation, quiz traversal, and tree keyboard interaction.
- Inspect desktop, tablet, and mobile renders for overlap, clipping, overflow, and
  readable hierarchy.
- Confirm `.nojekyll`, the Pages workflow, relative URLs, and all thirty production
  paths remain present.

## Acceptance criteria

- The new Contradiction Atlas identity is visible and coherent on every page type.
- The home page reaches the archive and lineage map without a redundant entrance.
- Descent, influence, and schism have consistent visual encodings throughout.
- Mobile navigation no longer overlaps content or occupies most of the viewport.
- The lineage tree and quiz retain their existing functional outcomes.
- All thirty current URLs and local assets resolve through a static HTTP server.
- The site remains deployable to GitHub Pages directly from the repository root.
