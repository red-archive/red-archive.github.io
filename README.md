# RED ARCHIVE

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
| `quiz.html` | Classification protocol |
| `schools/*.html` | One dossier per school |
| `css/style.css` | Single stylesheet |
| `js/shared.js` | Nav, footer, portrait fallbacks (injected on every page) |
| `js/tree.js` | Lineage tree rendering + navigation |
| `js/quiz.js` | Quiz logic |

No build step, no dependencies, no framework. Plain HTML/CSS/JS.

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

## Portraits

Portraits are hotlinked from [Wikimedia Commons](https://commons.wikimedia.org)
(public domain / CC-licensed) via `Special:FilePath`. If an image is blocked or
offline it degrades to a red-star placeholder — nothing is vendored into the repo.

## License

Text and site content: [CC BY-SA 4.0](LICENSE).
Linked portraits keep their own Wikimedia Commons licenses.
