# RED ARCHIVE

![Red Archive — a map of arguments](assets/og.jpg)

A static, hand-written atlas of communist thought: 20 school dossiers, a lineage tree,
a master timeline, the great schisms, an ideology axis ("The Line"), and a
classification quiz.

**Live site:** https://red-archive.github.io/

Historical and educational. Not advocacy for any tendency — every school is
documented alongside its schisms, critics, and crimes.

## Contents

| Path | What it is |
|------|------------|
| `index.html` | Lineage tree + file index of all 20 dossiers |
| `timeline.html` | Master timeline |
| `conflicts.html` | The great schisms |
| `the-line.html` | Annex A: the ideology axis |
| `the-ledger.html` | Annex B: the ledger |
| `register.html` | Annex C: the register of living parties |
| `faith.html` | Annex D: the faith files |
| `britain.html` | Annex E: the British file |
| `redbook.html` | Annex F: the Red Book object file (index only, text not hosted) |
| `gallery.html` | The Plate Room: art, posters and moving agitprop |
| `quiz.html` | Classification protocol |
| `schools/*.html` | One dossier per school |
| `css/style.css` | Design system: Rosé Pine tokens, layout, components |
| `css/banner.css` | Home-page route banner |
| `js/theme.js` | Light/dark theme; runs before first paint on every page |
| `js/shared.js` | Nav, footer, theme toggle, portrait fallbacks (injected on every page) |
| `js/motion.js` | One-shot section reveals |
| `js/banner.js` | Route banner drawing |
| `js/tree.js` | Lineage tree rendering + navigation |
| `js/quiz.js` | Quiz logic |
| `assets/media/` | Vendored plates, posters and clips for the Plate Room |
| `scripts/verify-site.py` | Static checks: routes, local links, fragments, design contract |

No build step, no dependencies, no framework. Plain HTML/CSS/JS.

## Theme

Light is [Rosé Pine Dawn](https://rosepinetheme.com/), dark is Rosé Pine. With no
saved choice the site follows the OS and keeps following it; the header toggle
overrides that and persists to `localStorage`. `js/theme.js` loads ahead of the
stylesheet so no page paints in the wrong theme. Switching animates as a circular
wipe from the toggle where the View Transitions API exists, a colour crossfade
elsewhere, and instantly under `prefers-reduced-motion`.

## Cache busting

Every page links the stylesheet as `css/style.css?v=<rev>`. **Bump that revision
whenever `css/style.css` changes**, or returning visitors keep the old file — the
symptom is new markup rendering unstyled. `scripts/verify-site.py` matches the
link by pattern, so any `?v=` value passes; it does not check that the value was
bumped.

## Verifying

```sh
python3 scripts/verify-site.py
```

Checks that all 30 routes exist, every local `href`/`src`/`poster` and fragment
resolves, the Pages inputs are present, and the design system still holds
(palette tokens, both theme blocks, pre-paint theme script on every page).

## Running locally

```sh
python3 -m http.server 8471 --bind 127.0.0.1
```

Then open http://127.0.0.1:8471/ — serve over HTTP rather than opening
`index.html` from disk, since `js/shared.js` keys off `location.pathname` to
resolve root-relative links from `schools/`.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which uploads the repo
root as-is and deploys it to GitHub Pages. Requires **Settings → Pages → Source =
GitHub Actions** on the repository.

`.nojekyll` is present so Pages serves files verbatim instead of running them
through Jekyll.

## Images

Portraits are hotlinked from [Wikimedia Commons](https://commons.wikimedia.org)
(public domain / CC-licensed) via `Special:FilePath`. If an image is blocked or
offline it degrades to a red-star placeholder.

The Plate Room's plates and clips are vendored under `assets/media/` (re-encoded
down from source) because they are the page's subject rather than illustration;
provenance is stated on `gallery.html`.

| Directory | What it holds |
|-----------|---------------|
| `assets/media/posters-ussr/` | 10 Soviet posters, 1919–1930 (public domain / CC BY-SA) |
| `assets/media/posters-china/` | 10 Cultural Revolution plates and dazibao (public domain / CC BY) |
| `assets/media/logos/` | 6 party and union marks (public domain / CC0 / CC BY / CC BY-SA) |
| `assets/media/schools/` | 57 per-dossier plates — 1–3 per school file, shown in each file's Plates section |

All four sets come from Wikimedia Commons, capped at 1200px and re-encoded. The
CC BY and CC BY-SA files carry an attribution requirement, so every title, author
and licence is printed in `gallery.html` §05 and links to its Commons file page.

Most PRC poster art of the 1950s–70s is still in copyright (life + 50, and many of
those artists died after 1976), so the Chinese set is limited to press photographs
and documents under the PRC's copyright exemptions plus CC-licensed scans.

Org marks are reproduced nominatively, to identify the organization an entry is
about. The Workers Party of Britain and RTSG have no freely-licensed mark and are
deliberately left without one.

## License

Text and site content: [CC BY-SA 4.0](LICENSE).
Linked portraits keep their own Wikimedia Commons licenses.
