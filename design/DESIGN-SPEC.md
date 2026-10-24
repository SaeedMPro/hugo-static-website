# MCTN website — page design brief (for artboard designers)

You are designing page artboards on a Design canvas for **MCTN**, the computer networks research group
of the Department of Computer Engineering, Faculty of Engineering, Bu-Ali Sina University (Hamedan, Iran).
The site is bilingual: **Persian (fa, RTL, default)** and **English (en, LTR)**. Every page is drawn twice:
`<Page>-fa.dc.html` and `<Page>-en.dc.html`. Same layout, mirrored; copy in each language.

Canvas root folder (write your files here, nowhere else):
`design/canvas/`

Already drawn and REQUIRED reading before you write (read the whole files):
- `Main.dc.html` — design foundations sheet (tokens, type, controls, motif). Copy its exact snippets.
- `Header.dc.html`, `Footer.dc.html` — site chrome, imported on every page.
- `PubItem.dc.html`, `PersonCard.dc.html`, `ProjectCard.dc.html`, `EventCard.dc.html`, `NewsItem.dc.html` — content components.
- `Home-fa.dc.html` may appear while you work (the lead designer is drawing it); you do not need it.

Never edit, rename or delete any file you were not assigned. Never touch `canvas.json`.
Do NOT render, screenshot, open a browser, install anything or run validators/linters — write carefully instead.
If you notice a mistake in a file you wrote, fix it with Edit.

---------------------------------------------------------------------------------------------------

## 1. The artboard format — rules that fail silently if broken

Each artboard is ONE self-contained file. Exact skeleton (Persian example):

```html
<!doctype html>
<html lang="fa">
<head>
<meta charset="utf-8">
<title>People — MCTN</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&amp;family=Vazirmatn:wght@100..900&amp;display=swap" rel="stylesheet">
<style>body{margin:0}</style>
</helmet>
<div dir="rtl" lang="fa" style="background: #f4f7f9; color: #14212c; font-family: Vazirmatn, Tahoma, 'Segoe UI', system-ui, sans-serif; font-size: 17px; line-height: 1.9;">
<dc-import name="Header" lang="fa" active="people" page="People" hint-size="100%,130px"></dc-import>
<main>
  ... page content ...
</main>
<dc-import name="Footer" lang="fa" page="People" hint-size="100%,500px"></dc-import>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1440,"height":3200}}'>
class Component extends DCLogic {
renderVals() {
return {
yes: true,
people: [ /* data objects for components */ ]
};
}
}
</script>
</body>
</html>
```

Hard rules:
- Keep `<script src="./support.js"></script>` EXACTLY. `<html lang>` = `fa` or `en`. Give `<title>` a few words.
- `<helmet>` contains ONLY the Google Fonts `<link>` above and `<style>body{margin:0}</style>`. Nothing else (no media
  queries, no hover rules) — every style is inline `style="…"`.
- Close every non-void element (`<path …></path>`, `<circle …></circle>`, `<span></span>` …). Quote every attribute.
  `<input>`, `<img>`, `<br>`, `<meta>`, `<link>` are void.
- `{{hole}}` is a dotted lookup into `renderVals()` ONLY (`{{p.title}}`, `{{yes}}`). Never an expression
  (`{{a + b}}`, `{{!x}}`, `{{fn()}}`) — compute in `renderVals()` and expose by name.
- Always include the `<script type="text/x-dc" data-dc-script data-props='…'>` block with
  `class Component extends DCLogic { renderVals() { return {…}; } }` — classic JS, no imports.
  `data-props` is single-quoted JSON; it holds only `$preview` (= the frame size you were given).
  Inside `data-props` a literal `&` must be `&amp;` and `'` must be `&#39;` (you should not need either).
- All UI is markup. Never build DOM in script (`innerHTML`, `appendChild`, `window.X`).
- Repeats: `<sc-for list="{{items}}" as="item" hint-placeholder-count="3"> … {{item.x}} … </sc-for>`.
  Branches: `<sc-if value="{{flag}}" hint-placeholder-val="{{true}}"> … </sc-if>`. Always set the hint attributes.
- Child components: `<dc-import name="PubItem" lang="fa" pub="{{p}}" hint-size="100%,190px"></dc-import>` —
  never self-close, never capitalised tags, never a prop called `name` other than the component selector.
  Works inside `<sc-for>`.
- Copy that a reviewer would retype stays LITERAL markup in the file (headings, paragraphs, labels, button text).
  Use `renderVals()` data only for repeated records passed to components (people, papers, projects, news, events).
- Links between artboards: `<a href="People-fa.dc.html">`. Style the `<a>` itself as the button; never nest a
  `<button>` inside an `<a>`. External links: `https://…`. In-page anchors: `href="#id"`.
- No `<iframe>`, `<object>`, `<embed>`, no emoji anywhere, no global key handlers, no network except the font link.
- Icons: inline stroke SVG from §6, `aria-hidden="true"`. Decorative illustrations: one `<svg aria-hidden="true">`.
- Accessible as drawn: real `<a href>`, `<button type="button">`, `<input>` + `<label for>`, `<select>`.
  Icon-only buttons/links get `aria-label`. Every hit target ≥ 44px tall (`min-height: 44px` on links in link rows).
  Text contrast ≥ 4.5:1 — use only the token pairs in §3.
- PAGE layout is fluid: the root has NO px width; use the 1200px max-width container (§4). Never `vh`, never `%` heights.
  No media queries exist, so responsiveness comes from `flex-wrap` + `flex: 1 1 <basis>` and grids written as
  `grid-template-columns: repeat(auto-fit, minmax(min(<min>px, 100%), 1fr))` where `<min>` ≤ the column width at 1440.
  At phone width everything must stack cleanly; wide tables go in an `overflow-x: auto` box.
- Lay out sibling groups with flex/grid + `gap` (never whitespace or per-item margins).
- Use `text-wrap: pretty` on paragraphs and `text-wrap: balance` on big headings.

## 2. Language rules

- fa artboard root: `dir="rtl" lang="fa"`, body line-height 1.9. en root: `dir="ltr" lang="en"`, line-height 1.65.
- Use logical CSS where a side matters: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`.
- Persian pages use Persian digits everywhere (۰۱۲۳۴۵۶۷۸۹) and Jalali dates — EXCEPT inside English citations,
  BibTeX, code, email addresses and URLs.
- Latin fragments inside Persian text (SDN, P4, MCTN, emails) need no wrapper, but standalone Latin blocks get `dir="ltr"`.
- Forward arrows point LEFT on fa pages (`M19 12H5` + `M11 6l-6 6 6 6`), RIGHT on en pages. Chevrons in breadcrumbs likewise.
- English eyebrow/label text: 13px, weight 700, `letter-spacing: 0.08em; text-transform: uppercase`. Persian labels:
  no transform, no letter-spacing.
- Placeholders for facts we do not have: square brackets in the page language, e.g. fa `[شماره تلفن]`, en `[Phone]`.
  Never invent dates, numbers, rooms, phone numbers, funders, quotes or statistics.

## 3. Tokens (use these exact values, inline)

Neutrals: ground `#f4f7f9` (page bg) · surface `#ffffff` (cards) · sunken `#eaf0f3` (bands, tags, code bg alt) ·
line `#d6dfe5` (borders) · faint line `#e6ecf0` (inner dividers) · line strong `#b8c6d0` (inputs, badges, motif line) ·
muted `#5a6a77` (captions/meta) · ink 2 `#475764` (secondary text) · ink `#14212c` (text, headings).
Primary: `#0b6e8a` (links, buttons, active) · strong `#08566c` (chip text) · soft `#e2f0f4` (chips, avatars).
Signal (amber, "live"): `#c98200` marks only — dots, packets, focus ring; NEVER as text · signal ink `#8a5a00` (amber text) ·
signal soft `#fbf1dc` (upcoming/notice bg) · signal line `#f0d9a8`.
Night (footer + at most ONE call-to-action band per page): bg `#0f1c26` · raised `#162733` · line `#253945` ·
text `#e6eef3` · muted text `#a3b4c0` · link/accent `#7fd0e6` · amber `#f2b33d`.
Completed/neutral status dot: `#8a9aa6`.

Type — Vazirmatn everywhere; JetBrains Mono only for BibTeX, keys, code, DOIs:
`font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace`.

| role | size | fa line-height | en line-height | weight |
|---|---|---|---|---|
| Display (home hero only) | `clamp(36px, 2.2rem + 2.2vw, 60px)` | 1.35 | 1.12 | 800 |
| H1 page title | `clamp(32px, 1.7rem + 1.4vw, 46px)` | 1.4 | 1.15 | 800 (en letter-spacing -0.01em) |
| H2 section | `clamp(24px, 1.25rem + 0.6vw, 30px)` | 1.5 | 1.25 | 750 |
| H3 card/sub | 19–20px | 1.6 | 1.35 | 700–750 |
| Lead | 19px, color #475764 | 1.85 | 1.6 | 400 |
| Body | 17px | 1.9 | 1.65 | 400 |
| Small | 15px | 1.75 | 1.5 | 400 |
| Label/caption | 13px | 1.6 | 1.4 | 600–700 |

Spacing scale 4 8 12 16 20 24 32 40 48 64 96. Radii: 6 controls/badges · 8 inputs/code · 10 date blocks ·
12 cards · 16 panels/bands · 999 pills/avatars. Cards: white surface + `1px solid #d6dfe5`, no shadows.

## 4. Page patterns (copy these)

Container (inside every section):
`<div style="max-width: 1200px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px); box-sizing: border-box;">`

Page header (every page except Home), on the ground, with a bottom line:
```html
<section style="border-bottom: 1px solid #d6dfe5;">
<div style="max-width: 1200px; margin: 0 auto; padding: 56px clamp(16px, 4vw, 40px) 44px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px;">
  <!-- optional breadcrumb nav (detail pages) -->
  <!-- optional eyebrow: 13px/700 #0b6e8a -->
  <h1 style="margin: 0; font-size: clamp(32px, 1.7rem + 1.4vw, 46px); line-height: 1.4; font-weight: 800; text-wrap: balance;">اعضا</h1>
  <p style="margin: 0; max-width: 760px; font-size: 19px; line-height: 1.85; color: #475764; text-wrap: pretty;">…lead…</p>
  <!-- optional actions row: flex, gap 12px, wrap -->
</div>
</section>
```

Section: `<section id="…" style="padding: 64px 0 0;">` + container. Last content section before the footer adds
`padding-bottom: 96px` (or end with the night CTA band, which carries its own 96px).

Section head — the link-and-node motif (H2 + hairline ending in a node + optional "see all" link):
```html
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
  <h2 style="margin: 0; font-size: clamp(24px, 1.25rem + 0.6vw, 30px); line-height: 1.5; font-weight: 750; white-space: nowrap;">حوزه‌های پژوهشی</h2>
  <span aria-hidden="true" style="flex: 1 1 auto; display: flex; align-items: center; min-width: 24px;"><span style="flex: 1 1 auto; height: 1px; background: #b8c6d0;"></span><span style="width: 9px; height: 9px; border-radius: 999px; border: 2px solid #0b6e8a; background: #f4f7f9; box-sizing: border-box;"></span></span>
  <a href="Research-fa.dc.html" style="display: inline-flex; align-items: center; gap: 6px; min-height: 44px; color: #0b6e8a; font-size: 15px; font-weight: 650; text-decoration: none; white-space: nowrap;">همهٔ حوزه‌ها<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="M11 6l-6 6 6 6"></path></svg></a>
</div>
```
(en: line-height 1.25 and the right-pointing arrow `M5 12h14` + `M13 6l6 6-6 6`.)

Breadcrumb (detail pages), inside the page header above the H1:
```html
<nav aria-label="مسیر صفحه"><ol style="list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; color: #5a6a77;">
<li><a href="People-fa.dc.html" style="display: inline-flex; align-items: center; min-height: 44px; color: #0b6e8a; text-decoration: none;">اعضا</a></li>
<li aria-hidden="true" style="display: flex;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg></li>
<li aria-current="page" style="color: #14212c;">دکتر مریم کاویانی</li>
</ol></nav>
```
(en: `aria-label="Breadcrumb"`, chevron path `M9 6l6 6-6 6`.)

Buttons: primary `display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 20px; border-radius: 6px; background: #0b6e8a; color: #ffffff; font-size: 15px; font-weight: 650; text-decoration: none;` ·
secondary = same with `border: 1px solid #0b6e8a; background: #ffffff; color: #0b6e8a; box-sizing: border-box;` ·
quiet = text link 15px/650 #0b6e8a + arrow icon, `min-height: 44px`.
Filter pills (`role="group"` + `aria-label` on the wrapper): `<button type="button" aria-pressed="true|false">`
height 44, padding 0 18px, radius 999; on = bg #0b6e8a, border #0b6e8a, white text, 650; off = bg #ffffff, border #b8c6d0, ink.
Area chip: pill h 26–28, bg #e2f0f4, text #08566c 12–13px/600, leading 6px #0b6e8a dot. Neutral tag: bg #eaf0f3, ink, 13px.
Type badge: h 24, radius 6, border 1px #b8c6d0, #475764, 12px/650. Status: see ProjectCard (amber dot = active).
Inputs: label above (14px/650), field h 48, radius 8, border 1px #b8c6d0, white, 16px, search icon inset 14px at the start.
Night CTA band (max one per page, usually just before the footer):
```html
<section style="padding: 96px 0;">
<div style="max-width: 1200px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px); box-sizing: border-box;">
<div style="position: relative; overflow: hidden; background: #0f1c26; color: #e6eef3; border-radius: 16px; padding: clamp(32px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px 40px;">
  <svg aria-hidden="true" width="360" height="220" viewBox="0 0 360 220" style="position: absolute; inset-inline-end: -40px; top: -20px; opacity: 0.9;"><path d="M40 60L150 110L290 50M150 110L120 190M150 110L250 170M290 50L330 140" fill="none" stroke="#253945" stroke-width="2"></path><circle cx="40" cy="60" r="7" fill="#0f1c26" stroke="#253945" stroke-width="2"></circle><circle cx="290" cy="50" r="9" fill="#0f1c26" stroke="#253945" stroke-width="2"></circle><circle cx="120" cy="190" r="6" fill="#0f1c26" stroke="#253945" stroke-width="2"></circle><circle cx="250" cy="170" r="7" fill="#0f1c26" stroke="#253945" stroke-width="2"></circle><circle cx="330" cy="140" r="6" fill="#0f1c26" stroke="#253945" stroke-width="2"></circle><circle cx="150" cy="110" r="11" fill="#162733" stroke="#7fd0e6" stroke-width="2"></circle><circle cx="220" cy="80" r="5" fill="#f2b33d"></circle></svg>
  <div style="position: relative; flex: 1 1 480px; display: flex; flex-direction: column; gap: 12px; min-width: 0;"> eyebrow #7fd0e6 · h2 #ffffff · p #a3b4c0 </div>
  <div style="position: relative; display: flex; flex-wrap: wrap; gap: 12px;"> button on night: bg #7fd0e6 color #0f1c26 700 · outline: border 1px #a3b4c0 color #e6eef3 </div>
</div>
</div>
</section>
```
Main + aside layout (detail pages): `<div style="display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start;">`
main `flex: 999 1 640px; min-width: 0;` aside `flex: 1 1 300px; min-width: 0;` (aside stacks under main on phones;
never sticky). Aside boxes: white card, radius 12, padding 24, `dl` facts with `dt` 13px/650 #5a6a77 and `dd` 15px.
Tables (alumni etc.): inside `<div style="overflow-x: auto; background: #ffffff; border: 1px solid #d6dfe5; border-radius: 12px;">`,
`<table style="width: 100%; min-width: 720px; border-collapse: collapse; font-size: 15px;">`, th 13px/700 #5a6a77
`text-align: start; padding: 14px 18px; border-bottom: 1px solid #d6dfe5;`, td `padding: 14px 18px; border-bottom: 1px solid #e6ecf0; vertical-align: top;`.
Image placeholders (we have no photos or figures): a box with `background: #eaf0f3; border: 1px dashed #b8c6d0; border-radius: 12px;`
and a centred 13px #5a6a77 label like `[Figure: system architecture]` / `[تصویر: معماری سامانه]`.
Empty states: a white card with a small icon tile, one sentence, and one action link.

## 5. Shared components — how to import them

All take `lang="fa"|"en"`. Pass objects from `renderVals()`. Shapes:

- `<dc-import name="Header" lang="fa" active="people" page="People" hint-size="100%,130px"></dc-import>`
  `active` ∈ none about research people projects publications news events teaching resources join contact.
  `page` = this artboard's base name (People, Profile, ResearchArea, NotFound …) — used for the language switch link.
- `<dc-import name="Footer" lang="fa" page="People" hint-size="100%,500px"></dc-import>`
- PersonCard: `<dc-import name="PersonCard" lang="fa" variant="feature" person="{{p}}" hint-size="100%,200px"></dc-import>`
  (`variant="compact"` → hint `100%,150px`). person = `{ name, initials, role, meta, tags: [..], href, email, scholar }`
  (feature shows email/scholar icon links; compact shows `meta` line and 2 tags).
- ProjectCard: `<dc-import name="ProjectCard" lang="fa" project="{{x}}" hint-size="100%,300px"></dc-import>`
  project = `{ title, summary, status: 'active'|'done', areas: [labels], members: [{ initials, name }], href, code }`.
- PubItem (a list row with a bottom rule — put several inside a white card with `padding: 8px 28px; border-radius: 12px`):
  `<dc-import name="PubItem" lang="fa" pub="{{x}}" hint-size="100%,190px"></dc-import>`; add `show-bib="{{yes}}"` (hint 330px)
  to open its BibTeX. pub = `{ type: 'journal'|'conference'|'thesis', title, authors: [{ n, m: true|false, href }], venue, year, links: [{ kind: 'code'|'pdf'|'doi', href }], bibtex, href }`.
  Citations stay English/LTR inside Persian pages — that is intended.
- EventCard: `<dc-import name="EventCard" lang="fa" event="{{x}}" hint-size="100%,180px"></dc-import>`
  event = `{ month, day, year, type: 'seminar'|'defense'|'workshop'|'talk', title, href, time, place, speaker, upcoming: true|false }`.
- NewsItem (list row with bottom rule): `<dc-import name="NewsItem" lang="fa" item="{{x}}" hint-size="100%,130px"></dc-import>`;
  `show-summary="{{no}}"` hides the summary (then return `no: false` from renderVals). item = `{ date, iso, title, summary, href }`.

Prototype link targets (fa/en suffix matches the page): person → `Profile-xx`, project → `Project-xx`,
news → `Article-xx`, event → `Event-xx`, area → `ResearchArea-xx`, paper title → `Publications-xx`.
Other artboards: Home, About, Research, ResearchArea, People, Profile, Projects, Project, Publications, News, Article,
Events, Event, Teaching, Resources, Join, Contact, Search, NotFound (each `-fa` and `-en`).

## 6. Icons (24 grid; wrap each in
`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>`)

search `<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path>` ·
globe `<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z"></path>` ·
mail `<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3.5 6.5L12 13l8.5-6.5"></path>` ·
phone `<path d="M6.6 3.5h2.8l1.4 4.2-2 1.3a12 12 0 0 0 6.2 6.2l1.3-2 4.2 1.4v2.8a2.1 2.1 0 0 1-2.1 2.1A15.4 15.4 0 0 1 4.5 5.6a2.1 2.1 0 0 1 2.1-2.1z"></path>` ·
scholar `<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"></path><path d="M6.5 11.6V16c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.4"></path>` ·
code `<path d="M8.5 8L4.5 12l4 4"></path><path d="M15.5 8l4 4-4 4"></path><path d="M13.5 5.5l-3 13"></path>` ·
document `<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 3v5h5"></path>` ·
link `<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"></path><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"></path>` ·
download `<path d="M12 4v11"></path><path d="M7 10l5 5 5-5"></path><path d="M5 20h14"></path>` ·
copy `<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"></rect><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"></path>` ·
calendar `<rect x="3.5" y="5" width="17" height="15.5" rx="2"></rect><path d="M3.5 10h17"></path><path d="M8 3v4"></path><path d="M16 3v4"></path>` ·
clock `<circle cx="12" cy="12" r="9"></circle><path d="M12 7.5V12l3 2"></path>` ·
pin `<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path><circle cx="12" cy="10" r="2.5"></circle>` ·
person `<circle cx="12" cy="8" r="4"></circle><path d="M4.5 20.5c1.4-3.7 4.2-5.5 7.5-5.5s6.1 1.8 7.5 5.5"></path>` ·
people `<circle cx="9" cy="8.5" r="3.5"></circle><path d="M2.5 20c1.2-3.3 3.6-5 6.5-5s5.3 1.7 6.5 5"></path><path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6"></path><path d="M18 15.3c1.6.7 2.8 2.2 3.5 4.7"></path>` ·
course `<path d="M3 5.5h6a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H3z"></path><path d="M21 5.5h-6a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H21z"></path>` ·
dataset `<ellipse cx="12" cy="6" rx="7" ry="3"></ellipse><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"></path><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"></path>` ·
slides `<rect x="3" y="4" width="18" height="12" rx="1.5"></rect><path d="M12 16v4"></path><path d="M8 20h8"></path>` ·
feed `<path d="M5 5a14 14 0 0 1 14 14"></path><path d="M5 11a8 8 0 0 1 8 8"></path><circle cx="6" cy="18" r="1.5"></circle>` ·
external `<path d="M14 4h6v6"></path><path d="M20 4l-9 9"></path><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"></path>` ·
check `<path d="M5 12.5l4.5 4.5L19 7.5"></path>` · chevron-down `<path d="M6 9l6 6 6-6"></path>` ·
arrow-fwd-en `<path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path>` · arrow-fwd-fa `<path d="M19 12H5"></path><path d="M11 6l-6 6 6 6"></path>` ·
chevron-en `<path d="M9 6l6 6-6 6"></path>` · chevron-fa `<path d="M15 6l-6 6 6 6"></path>` ·
area-sdn `<rect x="8" y="3" width="8" height="5" rx="1.5"></rect><path d="M12 8v3.5"></path><path d="M5 11.5h14"></path><path d="M5 11.5V15"></path><path d="M12 11.5V15"></path><path d="M19 11.5V15"></path><rect x="3" y="15" width="4" height="4" rx="1"></rect><rect x="10" y="15" width="4" height="4" rx="1"></rect><rect x="17" y="15" width="4" height="4" rx="1"></rect>` ·
area-iot `<circle cx="12" cy="15.5" r="2.5"></circle><path d="M8.2 11.8a5.4 5.4 0 0 1 7.6 0"></path><path d="M5.3 8.9a9.5 9.5 0 0 1 13.4 0"></path><path d="M12 18v3"></path>` ·
area-sec `<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"></path><path d="M8.8 12.2l2.2 2.2 4.2-4.4"></path>` ·
area-te `<path d="M3 16.5c2.4 0 3.4-7.5 6.2-7.5s3.2 5.5 5.6 5.5 2.8-3.5 6.2-3.5"></path><path d="M3 20.5h18"></path>`
Area icon tile: `<span style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #e2f0f4; color: #0b6e8a;">` + 26px icon.

## 7. Content — use exactly this (from the lab's repo; names are the repo's demo data)

Group: MCTN — fa «گروه پژوهشی شبکه‌های کامپیوتری»، en "Computer Networks Research Group"; part of the Department of
Computer Engineering (گروه مهندسی کامپیوتر), Faculty of Engineering (دانشکده فنی و مهندسی), Bu-Ali Sina University
(دانشگاه بوعلی سینا), Hamedan (همدان). Department active since 1378 / 1999; MSc admissions in computer networks since 1390 / 2011.
Tagline fa: «ما روی شبکه‌هایی کار می‌کنیم که خودشان را مدیریت می‌کنند، از خودشان محافظت می‌کنند و انرژی کمتری مصرف می‌کنند.»
en: "We study networks that manage themselves, defend themselves and use less energy."
Address fa: «همدان، دانشگاه بوعلی سینا، دانشکده فنی و مهندسی، گروه مهندسی کامپیوتر» · en: "Department of Computer Engineering,
Faculty of Engineering, Bu-Ali Sina University, Hamedan, Iran" · email `netlab@example.com` · GitHub `https://github.com/`.
Labs (from the About page): fa «آزمایشگاه پژوهشی شبکه (کارشناسی ارشد)» en "Network research laboratory (graduate)";
fa «آزمایشگاه شبکه و امنیت (آموزشی)» en "Network and security laboratory (teaching)". Software in use (from project/news text):
Mininet, ONOS controller, BMv2 P4 software switch; an IoT testbed of sample devices.

### Research areas (id · icon · fa title — fa summary · en title — en summary · short label fa/en)
- sdn · area-sdn · «شبکه‌های نرم‌افزارمحور» — «کنترل متمرکز، توازن بار و سوییچ‌های برنامه‌پذیر.» · "Software-defined networking" — "Centralised control, load balancing and programmable switches." · SDN / SDN
- iot · area-iot · «اینترنت اشیا و شبکه‌های حسگر» — «مسیریابی کم‌مصرف و پروتکل‌های سبک برای دستگاه‌های کوچک.» · "IoT and sensor networks" — "Low-energy routing and lightweight protocols for small devices." · اینترنت اشیا / IoT
- sec · area-sec · «امنیت شبکه» — «تشخیص نفوذ و مقابله با حملات منع سرویس.» · "Network security" — "Intrusion detection and DDoS mitigation." · امنیت شبکه / Security
- te · area-te · «مهندسی ترافیک» — «پایش، اندازه‌گیری و بهینه‌سازی جریان‌های شبکه.» · "Traffic engineering" — "Telemetry, measurement and flow optimisation." · مهندسی ترافیک / Traffic
About-page wording of the areas: SDN «کنترل متمرکز، توازن بار و شبکه‌های برنامه‌پذیر» / "centralised control, load balancing and
programmable networks"; IoT «مسیریابی کم‌مصرف و پروتکل‌های سبک» / "energy-efficient routing and lightweight protocols";
Security «تشخیص نفوذ و مقابله با حملات منع سرویس» / "intrusion detection and DDoS mitigation"; TE «پایش، اندازه‌گیری و بهینه‌سازی جریان‌ها» /
"telemetry, measurement and flow optimisation". Kaviani's bio adds "flow scheduling in data centres" and "telemetry with programmable switches".
Area links (derived from the data): sdn → people kaviani, tavakoli (+ alumna jahani) · project sdn-lb · papers tavakoli2024lb, jahani2022ddos.
iot → rastegar, nouri (+ alumnus moghadam) · iot-ids, wsn-energy · nouri2025iot, moghadam2023wsn.
sec → rastegar, nouri (+ jahani) · iot-ids · nouri2025iot, jahani2022ddos. te → kaviani, sadri · sdn-lb · sadri2025telemetry.

### People (PersonCard objects; fa then en)
kaviani — faculty. fa `{ name: 'دکتر مریم کاویانی', initials: 'م ک', role: 'دانشیار، سرپرست گروه', meta: '', tags: ['شبکه‌های نرم‌افزارمحور', 'مهندسی ترافیک', 'شبکه‌های برنامه‌پذیر P4'], href: 'Profile-fa.dc.html', email: 'm.kaviani@example.com', scholar: 'https://scholar.google.com/' }`
en `{ name: 'Dr. Maryam Kaviani', initials: 'MK', role: 'Associate Professor, Group Lead', meta: '', tags: ['Software-defined networking', 'Traffic engineering', 'P4 programmable networks'], href: 'Profile-en.dc.html', email: 'm.kaviani@example.com', scholar: 'https://scholar.google.com/' }`
bio fa «سرپرست گروه پژوهشی شبکه. پژوهش‌های او روی کنترل متمرکز شبکه، زمان‌بندی جریان در مراکز داده و پایش شبکه با سوییچ‌های برنامه‌پذیر متمرکز است.»
bio en "Leads the networks research group. Her work focuses on centralised network control, flow scheduling in data centres and telemetry with programmable switches."
rastegar — faculty. fa `{ name: 'دکتر حمید رستگار', initials: 'ح ر', role: 'استادیار', tags: ['امنیت شبکه', 'تشخیص نفوذ', 'اینترنت اشیا'], email: 'h.rastegar@example.com', scholar: 'https://scholar.google.com/' }`
en `{ name: 'Dr. Hamid Rastegar', initials: 'HR', role: 'Assistant Professor', tags: ['Network security', 'Intrusion detection', 'Internet of Things'], … }`
bio fa «روی امنیت شبکه‌های اینترنت اشیا و روش‌های سبک تشخیص نفوذ برای دستگاه‌های کم‌توان کار می‌کند.» en "Works on IoT network security and lightweight intrusion detection for constrained devices."
sadri — PhD, current, entered 1401 / 2022, advisor kaviani. fa `{ name: 'نگار صدری', initials: 'ن ص', role: 'دانشجوی دکتری · ورودی ۱۴۰۱', meta: 'پایش درون‌باندی شبکه با سوییچ‌های P4', tags: ['پایش شبکه', 'P4'], email: 'n.sadri@example.com' }`
en `{ name: 'Negar Sadri', initials: 'NS', role: 'PhD student · since 2022', meta: 'In-band network telemetry with P4 switches', tags: ['Network telemetry', 'P4'] }`; bio fa «دانشجوی دکتری. پیش از این کارشناسی ارشد را در همین گروه گذرانده است.» en "PhD student. Completed her MSc in the same group."; has GitHub.
tavakoli — MSc, current, entered 1403 / 2024, advisor kaviani. fa `{ name: 'امیر توکلی', initials: 'ا ت', role: 'دانشجوی کارشناسی ارشد · ورودی ۱۴۰۳', meta: 'توازن بار تطبیقی در شبکه‌های نرم‌افزارمحور', tags: ['SDN', 'یادگیری تقویتی'], email: 'a.tavakoli@example.com' }`
en `{ name: 'Amir Tavakoli', initials: 'AT', role: 'MSc student · since 2024', meta: 'Adaptive load balancing in SDN', tags: ['SDN', 'Reinforcement learning'] }`
nouri — MSc, current, entered 1403 / 2024, advisor rastegar. fa `{ name: 'الهام نوری', initials: 'ا ن', role: 'دانشجوی کارشناسی ارشد · ورودی ۱۴۰۳', meta: 'تشخیص نفوذ سبک برای دستگاه‌های اینترنت اشیا', tags: ['امنیت IoT', 'یادگیری ماشین'], email: 'e.nouri@example.com' }`
en `{ name: 'Elham Nouri', initials: 'EN', role: 'MSc student · since 2024', meta: 'Lightweight intrusion detection for IoT devices', tags: ['IoT security', 'Machine learning'] }`
Alumni (table rows: name · degree · graduated · thesis · now):
moghadam — fa «رضا مقدم · کارشناسی ارشد · ۱۴۰۴ · مسیریابی آگاه از انرژی در شبکه‌های حسگر بی‌سیم · مهندس شبکه، صنعت»; en "Reza Moghadam · MSc · 2025 · Energy-aware routing in wireless sensor networks · Network engineer, industry". Supervised by kaviani.
jahani — fa «سمیرا جهانی · کارشناسی ارشد · ۱۴۰۰ · تشخیص حملات منع سرویس در کنترلر SDN · دانشجوی دکتری»; en "Samira Jahani · MSc · 2022 · DDoS detection at the SDN controller · PhD student".
Alumni as PersonCards: role fa «دانش‌آموختهٔ کارشناسی ارشد · ۱۴۰۴» / en "MSc alumnus · 2025" (jahani: «دانش‌آموختهٔ کارشناسی ارشد · ۱۴۰۰» / "MSc alumna · 2022").

### Publications (PubItem objects; hrefs follow the page language)
sadri2025telemetry — conference, 2025, "Lightweight In-band Telemetry for Congestion Detection with P4", authors Negar Sadri (m), Maryam Kaviani (m), venue "International Conference on Network Systems", links code https://github.com/,
bibtex `'@inproceedings{sadri2025telemetry,\n  title     = {Lightweight In-band Telemetry for Congestion Detection with P4},\n  author    = {Sadri, Negar and Kaviani, Maryam},\n  booktitle = {International Conference on Network Systems},\n  year      = {2025}\n}'`
nouri2025iot — journal, 2025, "A Resource-Aware Intrusion Detector for Constrained IoT Gateways", Elham Nouri (m), Hamid Rastegar (m), "Journal of Networked Systems", no links,
bibtex `'@article{nouri2025iot,\n  title   = {A Resource-Aware Intrusion Detector for Constrained IoT Gateways},\n  author  = {Nouri, Elham and Rastegar, Hamid},\n  journal = {Journal of Networked Systems},\n  year    = {2025}\n}'`
tavakoli2024lb — conference, 2024, "Reinforcement-Learning Load Balancing for SDN Data Centres", Amir Tavakoli (m), B. Example (external), Maryam Kaviani (m), "Iranian Conference on Computer Engineering", code https://github.com/,
bibtex `'@inproceedings{tavakoli2024lb,\n  title     = {Reinforcement-Learning Load Balancing for SDN Data Centres},\n  author    = {Tavakoli, Amir and Example, B. and Kaviani, Maryam},\n  booktitle = {Iranian Conference on Computer Engineering},\n  year      = {2024}\n}'`
moghadam2023wsn — journal, 2023, "Energy-Aware Cluster Routing for Wireless Sensor Networks", Reza Moghadam (m), Maryam Kaviani (m), "Wireless Networks Letters", no links,
bibtex `'@article{moghadam2023wsn,\n  title   = {Energy-Aware Cluster Routing for Wireless Sensor Networks},\n  author  = {Moghadam, Reza and Kaviani, Maryam},\n  journal = {Wireless Networks Letters},\n  year    = {2023}\n}'`
jahani2022ddos — thesis, 2022, "DDoS Detection at the SDN Controller using Entropy Features", Samira Jahani (m), "MSc thesis, Bu-Ali Sina University", no links,
bibtex `'@mastersthesis{jahani2022ddos,\n  title  = {DDoS Detection at the SDN Controller using Entropy Features},\n  author = {Jahani, Samira},\n  school = {Bu-Ali Sina University},\n  year   = {2022}\n}'`
Counts: 5 total — journal 2, conference 2, thesis 1. Years 2025 (2), 2024, 2023, 2022. Persian year headings use Persian
digits of the Gregorian year (۲۰۲۵ …) because publication years are Gregorian.

### Projects (ProjectCard objects)
sdn-lb — active — fa «توازن بار هوشمند در SDN» / «یک کنترلر SDN که با یادگیری تقویتی جریان‌ها را بین مسیرهای مرکز داده پخش می‌کند.» ·
en "Smart load balancing in SDN" / "An SDN controller that spreads flows across data-centre paths with reinforcement learning." ·
areas SDN + Traffic engineering · members kaviani, tavakoli · code https://github.com/ · paper tavakoli2024lb ·
body fa «این پروژه روی شبیه‌ساز Mininet و کنترلر ONOS پیاده‌سازی شده است. هدف کاهش تأخیر جریان‌های کوتاه در کنار حفظ گذردهی جریان‌های بزرگ است.»
en "Implemented on Mininet with the ONOS controller. The goal is lower latency for short flows while keeping throughput for large flows."
iot-ids — active — fa «تشخیص نفوذ برای دروازه‌های اینترنت اشیا» / «مدل‌های سبک تشخیص حمله که روی سخت‌افزار کم‌توان دروازه اجرا می‌شوند.» ·
en "Intrusion detection for IoT gateways" / "Lightweight attack detection models that run on low-power gateway hardware." ·
areas Network security + IoT · members rastegar, nouri · paper nouri2025iot · no code · body fa «داده‌ها از یک بستر آزمایشی با ده‌ها دستگاه نمونه جمع‌آوری می‌شود.» en "Data is collected from a testbed of sample devices."
wsn-energy — done — fa «مسیریابی کم‌مصرف در شبکه‌های حسگر» / «پروتکل خوشه‌بندی برای افزایش طول عمر شبکه‌های حسگر بی‌سیم.» ·
en "Energy-efficient routing in sensor networks" / "A clustering protocol that extends the lifetime of wireless sensor networks." ·
area IoT · members kaviani, moghadam · paper moghadam2023wsn · no code, no body.
Unknown for all projects: start/end years, funding, partners → placeholders only if the layout shows those fields.

### News (NewsItem objects, newest first)
defense-moghadam — fa date «۲۳ شهریور ۱۴۰۴» / en "14 September 2025" / iso 2025-09-14 · fa «دفاع از پایان‌نامهٔ کارشناسی ارشد رضا مقدم» — «رضا مقدم از پایان‌نامهٔ خود با عنوان «مسیریابی آگاه از انرژی در شبکه‌های حسگر بی‌سیم» دفاع کرد.» · en "Reza Moghadam defends his MSc thesis" — "Reza Moghadam defended his thesis on energy-aware routing in wireless sensor networks."
paper-accepted — «۱۱ تیر ۱۴۰۴» / "2 July 2025" / 2025-07-02 · fa «پذیرش مقالهٔ گروه در کنفرانس بین‌المللی» — «مقالهٔ نگار صدری و دکتر کاویانی دربارهٔ پایش درون‌باندی شبکه با P4 پذیرفته شد.» · en "Paper accepted at an international conference" — "The paper by Negar Sadri and Dr. Kaviani on in-band telemetry with P4 has been accepted."
seminar — «۳۰ آبان ۱۴۰۳» / "20 November 2024" / 2024-11-20 · fa «سمینار هفتگی: مقدمه‌ای بر زبان P4» — «جلسهٔ این هفته به معرفی زبان P4 و اجرای یک مثال ساده روی سوییچ نرم‌افزاری BMv2 اختصاص داشت. اسلایدها در مخزن گروه قرار گرفته است.» · en "Weekly seminar: an introduction to P4" — "This week's session introduced the P4 language and ran a simple example on the BMv2 software switch. The slides are in the group repository."
new-members — «۱۰ مهر ۱۴۰۳» / "1 October 2024" / 2024-10-01 · fa «خوشامد به دانشجویان ارشد ورودی ۱۴۰۳» — «امیر توکلی و الهام نوری به گروه پیوستند.» · en "Welcome to our 2024 MSc intake" — "Amir Tavakoli and Elham Nouri have joined the group."

### Events (EventCard objects)
next-seminar (UPCOMING, details unknown → placeholders) — fa `{ month: '[ماه]', day: '[روز]', year: '۱۴۰۵', type: 'seminar', title: 'سمینار هفتگی گروه: [موضوع جلسه]', time: '[ساعت]', place: '[کلاس]، دانشکده فنی و مهندسی', speaker: '[ارائه‌دهنده]', upcoming: true, href: 'Event-fa.dc.html' }`
en `{ month: '[Mon]', day: '[DD]', year: '2026', type: 'seminar', title: 'Weekly group seminar: [Session topic]', time: '[Time]', place: '[Room], Faculty of Engineering', speaker: '[Speaker]', upcoming: true, href: 'Event-en.dc.html' }`
defense-moghadam (past) — fa `{ month: 'شهریور', day: '۲۳', year: '۱۴۰۴', type: 'defense', title: 'دفاع کارشناسی ارشد: مسیریابی آگاه از انرژی در شبکه‌های حسگر بی‌سیم', speaker: 'رضا مقدم', time: '', place: '', upcoming: false }`
en `{ month: 'Sep', day: '14', year: '2025', type: 'defense', title: 'MSc defense: Energy-aware routing in wireless sensor networks', speaker: 'Reza Moghadam', time: '', place: '', upcoming: false }` — supervisor Dr. Maryam Kaviani.
p4-seminar (past) — fa `{ month: 'آبان', day: '۳۰', year: '۱۴۰۳', type: 'seminar', title: 'سمینار هفتگی: مقدمه‌ای بر زبان P4', speaker: '', … }` en `{ month: 'Nov', day: '20', year: '2024', type: 'seminar', title: 'Weekly seminar: an introduction to P4', … }` — slides in the group repository.
The weekly seminar's day, time and room are unknown → `[روز و ساعت]` / `[Day and time]`, `[کلاس]` / `[Room]`.

### Courses (Teaching page — SAMPLE list the lab must confirm; keep instructor links)
Graduate: «شبکه‌های کامپیوتری پیشرفته» "Advanced Computer Networks" (Dr. Maryam Kaviani) · «شبکه‌های نرم‌افزارمحور» "Software-Defined Networking" (Kaviani) ·
«امنیت شبکه» "Network Security" (Dr. Hamid Rastegar) · «اینترنت اشیا» "Internet of Things" (Rastegar).
Undergraduate: «شبکه‌های کامپیوتری» "Computer Networks" ([مدرس] / [Instructor]) · «آزمایشگاه شبکه‌های کامپیوتری» "Computer Networks Lab"
([مدرس] / [Instructor]; held in the Network and security laboratory). Term → `[نیم‌سال]` / `[Term]`. Course codes unknown → omit.
One-line descriptions may describe standard syllabus scope (e.g. SDN: centralised control, OpenFlow and P4 data planes) — no claims about the lab.

### Resources
Code: sdn-lb controller (https://github.com/), P4 telemetry code for sadri2025telemetry (https://github.com/), RL load balancing code for tavakoli2024lb (https://github.com/).
Data: IoT gateway testbed traffic (from iot-ids; access terms `[شرایط دسترسی]` / `[Access terms]`).
Member guides: seminar slides archive (in the group repository — real); `[Thesis template]`, `[New member guide]`, `[Lab server access]` as placeholders.
Software we use: Mininet (https://mininet.org/), ONOS (https://opennetworking.org/onos/), BMv2 (https://github.com/p4lang/behavioral-model).

## 8. Quality bar

- One clear primary action per page; at most one night band; generous whitespace; no filler sections, no invented stats.
- Every page reads well at 1440 AND stacks at 390. Long Persian headings must not break badly (use balance).
- Both languages of a page share the same structure and section order.
- Keep each artboard to the content in its brief. If you believe a section is missing, mention it in your notes instead of adding it.
