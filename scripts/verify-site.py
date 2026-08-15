#!/usr/bin/env python3
"""Verify the static site's routes and local HTML references."""

from html.parser import HTMLParser
from pathlib import Path
import posixpath
import re
import sys
from urllib.parse import unquote, urlsplit


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

QUIZ_RESULT_SLUGS = (
    "utopian-socialism", "marxism", "anarcho-communism", "de-leonism",
    "orthodox-marxism", "leninism", "luxemburgism", "left-communism",
    "trotskyism", "marxism-leninism", "western-marxism", "maoism",
    "titoism", "guevarism", "posadism", "juche", "hoxhaism",
    "autonomism", "eurocommunism", "dengism",
)

IGNORED_SCHEMES = {"http", "https", "mailto", "data"}


class DocumentParser(HTMLParser):
    """Collect fragment IDs and local-reference-bearing attributes."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.references = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes and attributes["id"]:
            self.ids.add(attributes["id"])
        for attribute in ("href", "src", "poster"):
            value = attributes.get(attribute)
            if value:
                self.references.append(value)


def resolve_local_reference(source: str, reference: str):
    """Return (relative target path, fragment), or None for external URLs."""
    parsed = urlsplit(reference)
    if parsed.scheme.lower() in IGNORED_SCHEMES or parsed.netloc:
        return None

    path = unquote(parsed.path)
    source_parent = posixpath.dirname(source)
    if path.startswith("/"):
        target = path.lstrip("/")
    elif path:
        target = posixpath.join(source_parent, path)
    else:
        target = source
    target = posixpath.normpath(target)
    return target, unquote(parsed.fragment)


def verify(root: Path):
    failures = []
    missing_references = []
    missing_fragments = []
    documents = {}

    for route in EXPECTED_HTML:
        document = root / route
        if not document.is_file():
            failures.append(f"missing expected HTML route: {route}")
            continue
        parser = DocumentParser()
        try:
            parser.feed(document.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as error:
            failures.append(f"cannot read {route}: {error}")
            continue
        documents[route] = parser

    for source, parser in documents.items():
        for reference in parser.references:
            resolved = resolve_local_reference(source, reference)
            if resolved is None:
                continue
            target, fragment = resolved
            target_file = root / target
            if not target_file.is_file():
                missing_references.append(f"{source}: {reference} (missing {target})")
                continue
            if fragment:
                target_parser = documents.get(target)
                if target_parser is None and target_file.suffix.lower() == ".html":
                    target_parser = DocumentParser()
                    target_parser.feed(target_file.read_text(encoding="utf-8"))
                if target_parser is not None and fragment not in target_parser.ids:
                    missing_fragments.append(
                        f"{source}: {reference} (missing #{fragment} in {target})"
                    )

    required_paths = (".nojekyll", ".github/workflows/pages.yml")
    for path in required_paths:
        if not (root / path).is_file():
            failures.append(f"missing required GitHub Pages input: {path}")
    for fragment in ("tree", "files"):
        if "index.html" in documents and fragment not in documents["index.html"].ids:
            failures.append(f"index.html is missing required fragment: #{fragment}")

    def require(condition, message):
        if not condition:
            failures.append(message)

    css = (root / "css/style.css").read_text(encoding="utf-8")
    for token in (
        # Rosé Pine Dawn (light) swatches on :root
        "--rp-base: #faf4ed", "--rp-surface: #fffaf3", "--rp-text: #575279",
        "--rp-love: #b4637a", "--rp-gold: #ea9d34", "--rp-pine: #286983",
        "--rp-foam: #56949f", "--rp-iris: #907aa9",
        # Rosé Pine (dark) swatches, present in both the media-query and attribute blocks
        "--rp-base: #191724", "--rp-surface: #1f1d2e", "--rp-text: #e0def4",
        "--rp-love: #eb6f92", "--rp-gold: #f6c177", "--rp-foam: #9ccfd8",
        # semantic atlas roles resolve to swatches, never to raw hex
        "--atlas-ground: var(--rp-base)", "--atlas-sheet: var(--rp-surface)",
        "--carbon: var(--rp-text)", "--schism: var(--rp-love)",
        "--descent: var(--rp-gold)", "--influence: var(--rp-foam)",
        "--route: var(--rp-pine)", "--route: var(--rp-foam)",
        '"Anybody"', '"Commissioner"', '"Martian Mono"',
    ):
        require(token in css.lower() if token.startswith("--") else token in css,
                f"missing design token {token}")
    require(len(re.findall(r"^\s+color-scheme: dark;$", css, re.M)) == 2,
            "dark theme must be declared for both prefers-color-scheme and [data-theme=dark]")
    require(':root[data-theme="dark"]' in css and ':root:not([data-theme="light"])' in css,
            "explicit theme attribute must override the system preference")
    require("::view-transition-new(root)" in css and "html.theme-transition" in css,
            "theme change animation layers are missing")
    for forbidden in ("CRT scanlines", ".glitch::before", ".glitch::after",
                      "#e9eef0", "#20282c", "#d44b38", "#335c91"):
        require(forbidden not in css, f"retired effect remains: {forbidden}")

    theme_js = (root / "js/theme.js").read_text(encoding="utf-8")
    require("startViewTransition" in theme_js and "red-archive-theme" in theme_js,
            "theme.js must persist the choice and drive the view transition")
    for route in EXPECTED_HTML:
        html_text = (root / route).read_text(encoding="utf-8")
        prefix = "../" if route.startswith("schools/") else ""
        theme_tag = f'<script src="{prefix}js/theme.js"></script>'
        style_tag = f'<link rel="stylesheet" href="{prefix}css/style.css">'
        require(theme_tag in html_text, f"{route}: missing pre-paint theme script")
        require(html_text.find(theme_tag) < html_text.find(style_tag),
                f"{route}: theme.js must load before the stylesheet to avoid a flash")

    mobile_copy_rule = """.fc-desc,
  .doctrine p,
  .conflict-body p,
  .q-sub,
  .q-opt,
  .q-result .r-desc {
    font-size: 1rem;
  }"""
    require(mobile_copy_rule in css,
            "mobile prose components do not retain the 1rem body-copy floor")
    require(".tree-legend .l-schism i {\n  border-top-color: var(--schism);\n  border-top-style: dashed;\n}"
            in css, "schism legend does not use the broken route encoding")
    tree_era_rule = """.t-era {
  fill: var(--carbon-soft);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 2px;
}"""
    require(tree_era_rule in css,
            "tree era labels do not use the atlas type and palette roles")
    require(".t-hit {\n  fill: transparent;\n}" in css,
            "tree node hit-area style is missing")

    tree_js = (root / "js/tree.js").read_text(encoding="utf-8")
    for forbidden in ("IBM Plex Mono", "rgba(185,167,143"):
        require(forbidden not in tree_js,
                f"legacy tree presentation remains: {forbidden}")
    for token in (
        'class: "t-era"', 'class: "t-hit", "aria-hidden": "true"',
        'width: "44"', 'height: "44"', 'class: "t-junction t-star"',
        'tabindex: "0"', 'ev.key === "Enter"', 'ev.key === " "',
    ):
        require(token in tree_js, f"missing tree renderer contract: {token}")

    quiz_js = (root / "js/quiz.js").read_text(encoding="utf-8")
    require('"★ " + r.name' not in quiz_js,
            "quiz verdict still uses the retired star prefix")
    require('"RESULT // " + r.name' in quiz_js,
            "quiz verdict is missing the route-sheet result marker")
    for slug in QUIZ_RESULT_SLUGS:
        require(f'page: "{slug}"' in quiz_js,
                f"quiz result route is missing: schools/{slug}.html")

    shared = (root / "js/shared.js").read_text(encoding="utf-8")
    for token in ('id="nav-toggle"', 'aria-controls="nav-panel"',
                  'aria-expanded="false"', 'aria-current="page"',
                  'class="footer-grid"'):
        require(token in shared, f"missing shared chrome contract: {token}")

    motion_path = root / "js/motion.js"
    require(motion_path.is_file(), "missing progressive motion script: js/motion.js")
    if motion_path.is_file():
        motion_js = motion_path.read_text(encoding="utf-8")
        for token in (
            "IntersectionObserver", "motion-ready", "data-reveal", "is-visible",
            "unobserve", "prefers-reduced-motion",
        ):
            require(token in motion_js, f"missing motion behavior: {token}")

    for route in EXPECTED_HTML:
        document = root / route
        if not document.is_file():
            continue
        markup = document.read_text(encoding="utf-8")
        prefix = "../" if route.startswith("schools/") else ""
        shared_script = f'<script defer src="{prefix}js/shared.js"></script>'
        motion_script = f'<script defer src="{prefix}js/motion.js"></script>'
        require(motion_script in markup,
                f"{route} is missing the progressive motion script")
        require(markup.find(shared_script) < markup.find(motion_script),
                f"{route} does not load motion after shared chrome")

    home = (root / "index.html").read_text(encoding="utf-8")
    for token in ('class="hero-grid"', 'class="route-key"',
                  'class="file-era"', 'class="annex-grid"',
                  'Hover a junction', '○ = OPEN JUNCTION FILE'):
        require(token in home, f"missing home-page structure: {token}")
    for forbidden in ('class="entrance"', 'js/star-logo.js', 'css/entrance.css',
                      'Hover a star', '★ = OPEN FILE'):
        require(forbidden not in home, f"retired home-page element remains: {forbidden}")

    failures.extend(f"missing local reference: {item}" for item in missing_references)
    failures.extend(f"missing fragment: {item}" for item in missing_fragments)
    return failures, len(missing_references), len(missing_fragments)


def main():
    root = Path(__file__).resolve().parents[1]
    failures, missing_references, missing_fragments = verify(root)
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        print(
            f"SUMMARY: {len(EXPECTED_HTML)} HTML routes; "
            f"{missing_references} missing local references; "
            f"{missing_fragments} missing fragments"
        )
        return 1
    print(
        f"PASS: {len(EXPECTED_HTML)} HTML routes; "
        f"{missing_references} missing local references; "
        f"{missing_fragments} missing fragments"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
