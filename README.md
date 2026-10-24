# Example Hugo static site

A bilingual static site built with [Hugo](https://gohugo.io) Extended 0.139. Persian is the default language and is served at `/`. English is served at `/en/`.

The pages are a sample research-group site (MCTN). Names, papers, and contact details in `data/` and `content/` are fictional. While `demo = true` in `hugo.toml`, a banner on every page says so.

## Develop locally

Install [Hugo Extended](https://gohugo.io/installation/) 0.139.0 or newer, then from this directory:

```bash
hugo server --baseURL http://localhost:1313/
```

- Persian: http://localhost:1313/
- English: http://localhost:1313/en/

Hugo rebuilds when you save a file. Stop the server with Ctrl+C.

`hugo server` with no flags uses `baseURL` from `hugo.toml`, so the site is served under that path (today `/netlab-demo/`). Pass `--baseURL` when you want the site at the root.

To write the finished site into `public/` without a server:

```bash
hugo
```

`public/`, `resources/_gen/`, and `.hugo_build.lock` are gitignored. Do not commit them.

## How this project is built

Hugo reads configuration, content, and templates, then writes HTML (and a few extra files) into `public/`.

| Path | Role |
| --- | --- |
| `hugo.toml` | Languages, menu, site-wide params, and which extra outputs exist |
| `content/fa/`, `content/en/` | Markdown pages. A shared `translationKey` pairs the same page in both languages |
| `data/` | Records. Some become their own pages; others are lists on an existing page |
| `layouts/` | HTML templates. Shared pieces live in `layouts/partials/` |
| `assets/css/`, `assets/js/` | Styles and scripts, bundled by Hugo |
| `i18n/fa.toml`, `i18n/en.toml` | Button labels, headings, and empty-state text |
| `static/` | Files copied as-is: font, favicon, photos, CVs, PDFs |
| `.github/workflows/hugo.yml` | Build and deploy on GitHub Pages |

These adapters build one page per data file. Do not add Markdown pages beside them:

- `content/*/people/_content.gotmpl` reads `data/people/<id>.yaml` and creates `/people/<id>/`
- `content/*/projects/_content.gotmpl` reads `data/projects/<id>.yaml` and creates `/projects/<id>/`
- `content/*/research/_content.gotmpl` reads `data/areas/<id>.yaml` and creates `/research/<id>/`
- `content/*/events/_content.gotmpl` reads `data/events/<id>.yaml` and creates `/events/<id>/`

Publications, courses, and resources stay as lists. They do not get their own page. A paper appears at `/publications/#<id>`.

Generated files, besides HTML:

- `/publications/publications.bib` from `data/publications.yaml` (the section keeps `outputs: ["HTML", "BibTeX"]`)
- `/events/index.ics`, plus one `.ics` file per upcoming event (the section keeps `outputs: ["HTML", "Calendar"]`)
- `/news/index.xml` (the section keeps `outputs: ["HTML", "RSS"]`)
- `/index.json` and `/en/index.json`, the search index

Leave `_index.md` and `_content.gotmpl` in each section. Search is `content/fa/search.md` and `content/en/search.md`. The 404 page is `layouts/404.html`, not a content file.

Every public string has a Persian field (`_fa`) and an English field (`_en`). An empty optional field is hidden. Do not type placeholders such as `[Phone]`.

Ids connect records. A person's id is the YAML filename (`kaviani`). A paper's id is its `id` field. Use those ids in `authors`, `members`, `advisors`, `areas`, `publications`, and `speaker`. Before deleting a record, search the repo for its id.

### Dates

| Field | Write |
| --- | --- |
| `start_year`, `end_year` on a person | Jalali year as text, for example `"1403"`. English pages show that year plus 621. If that is wrong, set `start_year_en` or `end_year_en`. |
| `year` on a paper | Gregorian number, for example `2025` |
| `date` on an event | Gregorian `YYYY-MM-DD`. Persian pages convert it to the Jalali calendar |
| `time` on an event | Tehran local time, for example `"14:00–15:30"` (en dash). Omit it for an all-day event |

An event is upcoming from its calendar day onward, in Tehran time.

## Publish

Push the `main` branch. GitHub Actions installs Hugo 0.139.0 extended, runs `hugo --minify`, and deploys to GitHub Pages. The workflow sets `baseURL` from the Pages address, so the value in `hugo.toml` is only for local preview.

In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. The site is published at:

`https://<user>.github.io/hugo-static-website/`

English is at `/en/`. The same workflow also runs every night at 20:30 UTC (midnight in Tehran) so yesterday's events leave the upcoming list without a new commit.

Set `demo = false` in `hugo.toml` when the sample data has been replaced.

## Change content

Edit the same facts in both languages. After a change, refresh the local server and open the Persian and English URLs.

### People

Copy `data/people/kaviani.yaml` to `data/people/<id>.yaml`. The filename is the URL: `karimi.yaml` becomes `/people/karimi/`.

```yaml
name_fa: "…"
name_en: "…"
role: faculty          # faculty | postdoc | phd | msc | bsc | staff
status: current        # current | alumni
weight: 1              # smaller numbers appear first inside that role
areas: ["sdn"]         # ids from data/areas/
advisors: ["kaviani"]  # person ids; faculty usually use []
title_fa: ""           # optional. If set, this line replaces the automatic role
title_en: ""
interests_fa: []
interests_en: []
email: ""
phone: ""
office_fa: ""
office_en: ""
scholar: ""
orcid: ""              # full URL or the bare id
github: ""
website: ""
photo: ""              # "people/karimi.jpg" in static/people/
cv: ""                 # "cv/karimi.pdf" in static/cv/
start_year: "1403"
end_year: ""
position_fa: ""        # alumni: where they are now
position_en: ""
thesis_fa: ""
thesis_en: ""
bio_fa: |
bio_en: |
```

To mark someone as graduated, set `status: alumni`, `end_year`, and `position_fa` / `position_en`. With no photo, the page shows initials.

Delete `data/people/<id>.yaml`, then remove that id from papers, projects, events, courses, and other people's `advisors`.

### Publications

Add an item to the list in `data/publications.yaml`. You do not write BibTeX; Hugo builds `publications.bib` from this file.

```yaml
- id: karimi2026p4       # unique; the page anchor is /publications/#karimi2026p4
  year: 2026
  type: conference       # journal | conference | thesis | preprint
  areas: ["sdn"]
  title: "…"             # citations stay in their own language on both sites
  authors: [karimi, kaviani, "A. External"]
  venue: "…"
  pdf: ""                # "papers/karimi2026.pdf" under static/, no leading slash
  doi: ""                # the DOI only, not the https://doi.org/ prefix
  code: ""
  slides: ""
```

An `authors` entry that matches a file in `data/people/` becomes a link. Any other string is printed as a name. A thesis may also set `degree: phd` or `degree: msc`, and `school`. Without `degree`, the BibTeX entry is a master's thesis.

Delete the list item to remove the paper, and remove its id from project `publications` lists and from news or event front matter.

### Projects

Add `data/projects/<id>.yaml`:

```yaml
title_fa: "…"
title_en: "…"
status: active           # active | done
weight: 1
areas: ["sdn", "te"]
members: [kaviani, tavakoli]
publications: [tavakoli2024lb]
code: ""
tools: ["Mininet", "ONOS"]
summary_fa: "…"
summary_en: "…"
body_fa: |
body_en: |
start_year: "1402"       # optional Jalali year
end_year: ""
funding_fa: ""
funding_en: ""
```

`status: active` puts the project on the home page. Delete the file, then remove its id from events, resources, and Join topics.

### Research areas

Add `data/areas/<id>.yaml`. Current ids are `sdn`, `iot`, `sec`, and `te`.

```yaml
weight: 1
icon: "sdn"              # sdn | iot | sec | te
short_fa: "SDN"
short_en: "SDN"
title_fa: "…"
title_en: "…"
summary_fa: "…"
summary_en: "…"
topics_fa: ["…"]
topics_en: ["…"]
body_fa: |               # extra sentence after the summary; leave empty if you have nothing to add
body_en: |
tools:
  - name: "Mininet"
    url: "https://mininet.org/"
```

People, projects, and papers attach themselves through their own `areas` lists. Counts on the research page come from those lists. A new icon name has to be added in `layouts/partials/icon.html`.

Delete the area file only after nothing still lists its id.

### Events

Add `data/events/<id>.yaml`:

```yaml
type: "seminar"          # seminar | defense | workshop | talk
date: "2026-11-11"
time: "14:00–15:30"
title_fa: "…"
title_en: "…"
speaker: "sadri"         # person id
speaker_fa: ""           # use these when the speaker is not a member
speaker_en: ""
supervisor: "kaviani"
location_fa: "…"
location_en: "…"
summary_fa: "…"
summary_en: "…"
body_fa: |
body_en: |
slides: ""
video: ""
online: ""               # shown only while the event is upcoming
news: ""                 # translationKey of a news story, if there is one
publications: []
projects: []
```

The weekly seminar line on the events page is not an event file. It is `seminar` under `[languages.fa.params]` and `[languages.en.params]` in `hugo.toml`. Split the time and the place with ` · `.

Delete the YAML file to remove the event.

### News

Create the same filename in both languages, with the same `translationKey`:

`content/fa/news/<id>.md` and `content/en/news/<id>.md`

```yaml
---
title: "…"
date: 2026-03-01
translationKey: "new-paper"
summary: "…"
people: ["sadri", "kaviani"]
publications: ["sadri2025telemetry"]
---
```

The Markdown under the front matter is the article. `summary` is the card text. `people` and `publications` are optional related blocks. News is paginated at 10 items (`pagerSize` in `hugo.toml`).

Delete both language files together.

### Home, About, Join, and Contact

These pages already exist. Change both `content/fa/` and `content/en/`, and keep `translationKey` and `layout`.

- Home, `_index.md`: `description` (footer and default meta description), `hero_title`, `hero_lead`. Areas, active projects, the three newest news items, two events, and three newest papers are filled from data.
- About, `layout: about`: `lead`, `facts` (`value`, `label`, `href`), `labs` (`title`, `text`, optional `image` and `alt`). `href: "research"` links to a section. `href: ""` is plain text. An image path is relative to `static/`.
- Join, `layout: join`: `eyebrow`, `lead`, `requirements` (list of strings), `topics` (`title`, `areas`, `project`; the section anchor is `#topics`), `steps` (`title`, `text`), `faq` (`q`, `a`).
- Contact, `layout: contact`: `lead`, `office_hours`, `directions` (Markdown). Address, email, and the map link come from `hugo.toml`.

Section list pages only need `title` and `lead` in `content/fa/<section>/_index.md` and the English copy: `people`, `research`, `projects`, `publications`, `news`, `events`, `resources`. Teaching also has `supervision_title` and `supervision_text`. Keep the `outputs` line on news, events, and publications.

### Courses and resources

In `data/courses.yaml`, `level` is `msc`, `phd`, or `bsc`. `msc` and `phd` are shown as graduate courses. `instructors` are person ids. `url`, `term_fa`, `term_en`, `location_fa`, and `location_en` are optional.

In `data/resources.yaml`, `category` is `code`, `data`, `guide`, or `software`. Other categories are not shown. `project` and `publication` are optional ids. `access_fa` and `access_en` are the note for a file that is not public.

### Site-wide settings

In `hugo.toml`:

| Setting | Effect |
| --- | --- |
| `demo` | `true` shows the sample-data banner |
| `email`, `phone`, `github`, `map` | Contact page, footer, and join buttons. An empty `phone` is hidden |
| `nav` | Header order. Each name is an existing section |
| `languages.*.params` | Group name, department, faculty, university, address, and the weekly seminar line |

Labels for buttons, roles, and empty states are in `i18n/fa.toml` and `i18n/en.toml`. Add a new key to both files.

Paths for `photo`, `cv`, `pdf`, and `slides` have no leading slash. `photo: "people/karimi.jpg"` means the file `static/people/karimi.jpg`.
