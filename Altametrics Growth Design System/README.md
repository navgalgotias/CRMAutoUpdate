# AG Design System (Altametrics)

> The reference for building Angular apps on top of **`foundation`** and **`hw-foundation`**. One system, two libraries, every screen. Every component is keyboard-accessible, screen-reader-labeled, theme-aware (light/dark), and i18n-ready.

## What this is

This project is a faithful, high-fidelity recreation of the live Altametrics design system, ported from the source gallery the team maintains. The tokens stay **1:1 with `projects/foundation/src/lib/theme/_variable.scss`**, and every component is a cosmetic facsimile of the real `fn-*` / `hw-*` Angular components.

- **`AG Design System.html`** — the interactive gallery (open this first). Sidebar nav, light/dark + density toggles, search, and live component demos for ~45 components and 9 page patterns.
- **`Variations.html`** — a side-by-side variations canvas (3 themed directions on a pan/zoom canvas).
- **`tokens.css`** — the design tokens (mirrors `_variable.scss`). Light on `:root`, dark under `.dark-theme`.
- **`ds-styles.css`** — component CSS facsimiles (buttons, inputs, select, prime-table, date/time pickers, tabs, accordion, etc.).
- **`src/*.jsx`** — React primitives + view code that power the gallery.
- **`preview/`** — small spec cards that populate the Design System tab.

### The two libraries

| Library | Prefix | What it is |
|---|---|---|
| **`foundation`** | `Fn*` / `fn-*` | Generic UI kit — buttons, inputs, select, table, grid, date/time pickers, drawer, dialog, toast, charts. Imported per-feature module. |
| **`hw-foundation`** | `Hw*` / `hw-*` | HW-branded shell — app header (main/site/profile/apps/weather/time-clock/franchise), auth, app market, employee, release notes. |

The primary consumer shown in the **Showcase → Restaurant scheduling** is the Hubworks/Altametrics restaurant workforce platform.

---

## Content fundamentals

- **Every user-visible string goes through i18n** — keys fed to the `fnTranslate` pipe / `FnI18nService`. No hardcoded copy.
- **Voice:** plain, operational, task-first. This is enterprise workforce software (scheduling, timecards, inventory), not consumer marketing — copy is direct and unembellished.
- **Casing:** sentence case for labels, buttons, menu items; UPPERCASE only for table headers and tiny eyebrow labels (tracked +0.04–0.08em).
- **Numbers & dates:** tabular numerics in mono; dates always via the global `date.formatter(FN_DATE_FORMAT.XYZ)` prototype, never ad-hoc formatting.
- **Empty / error states** use the No-Data box and the danger-tinted message row (see `fn-no-data`).
- **Emoji:** not used in the product UI.

---

## Visual foundations

### Color
Tokens are **named, not scaled** (`--blue`, `--orange`, `--green`…), and consumed only via `var(--token)` — never raw hex.

- **Primary / theme:** `--blue` `#005bc4` (dark mode `#4c9fff`). `--theme` aliases the brand color so consumer apps can retint without touching component CSS.
- **Accent:** `--orange` `#bf5700` — the `hw-foundation` brand accent (header, app market).
- **Semantic:** green `#1e7e34` (success), yellow `#fdc91e` (warning), red `#c62828` (danger), cyan `#0078a8` (info), iron `#4b5563` (muted/dark), purple `#7b42ff`.
- **Tints:** every semantic color has `*Dark` / `*Light` variants for hover and soft `.bubble-*` chips.
- **Surfaces:** `--body-bg` `#f6f7ff`, `--bg-primary` `#fff`, `--side-nav-bg` `#25262e`, `--hover-bg-color`, `--table-dark-cell`.
- **Dark mode** is a `.dark-theme` class on `<html>` — token overrides only, **no media queries**.

### Typography
- **Single UI family: Inter** (300–700). Body 14px, line-height 1.5.
- **Mono:** JetBrains Mono / Geist Mono for IDs, code, and tabular numerics.
- Headings are weight 600 with tight tracking: 28 (page), 20 (section), 15 (card).

### Spacing, radii, elevation
- **Spacing:** 4-based — `--space-1` (4) → `--space-7` (48).
- **Radii:** controls 4px, `--radius-sm` 6px, `--radius-md` 9px, pills 999px.
- **Shadow:** one elevation token `--shadow` for popovers/dialogs (`0 7px 22px rgba(0,0,0,.15)`; heavier in dark). Borders, not shadows, separate dense surfaces.

### Motion
- Short linear transitions (`.12s–.25s`) on background/border/color. Caret rotations and switch thumbs `.15s`. No bounces or spring physics. Calendar day-hover lifts with a soft shadow.

### Focus & accessibility
- **VPAT / WCAG 2.1 AA.** Universal `:focus-visible` shows a 2px high-contrast `--blue` ring (`--focus-ring`). Clickable non-buttons get role/tabindex via the `a11yClickable` / `a11yIconBtn` directives. Labels are always associated; `aria-*` on every control.

---

## Iconography

- **UI icons: Phosphor**, rendered via the Iconify web component (`<iconify-icon icon="ph:…">`). Weights map to Phosphor variants (regular / bold / fill / duotone).
- **Brand glyphs: a custom `fn-global-*` icon font** loaded from `agcdn.altametrics.com` (e.g. `fn-global-dropdownArrow`). Used inside foundation components (time-picker caret, etc.).
- No emoji, no unicode glyphs as icons. `<fn-icon>` (`FnIcon`) wraps both systems: `lib="ph"` for Phosphor, `lib="global"` for the icon font.

---

## How to use (rules for engineers & AI agents)

1. **Never import from source paths** — import from `'foundation'` / `'hw-foundation'` (tsconfig alias → `dist/`).
2. **Import the per-feature module**, not the whole library (`FnButtonModule`, not all of `FoundationModule`).
3. **Prefix discipline:** components `Fn*` / `Hw*`; selectors `fn-*` / `hw-*`.
4. **Colors from tokens only** — `var(--blue)`, never `#005bc4`. To add a color, extend `_variable.scss` + `_color.scss` first.
5. **Text through i18n.** Dates through the global formatter. HTTP via `FnHttpService` / `HwHttpService`.
6. **Forms are reactive** (`FormGroup` + `formControlName`).
7. **Dark mode = class on `<html>`** — token overrides only.
8. **Every routed page uses the `.hw-box-content` boilerplate** (header / title-bar / content).

---

## Using this system to build (read these first)

If you're creating a mock, prototype, slide, or screen, the **`docs/`** folder is prescriptive — follow it strictly so output matches the product:

```
SKILL.md                ← START HERE — workflow, hard rules, pre-delivery checklist
docs/GOVERNANCE.md      ← the binding contract: mandatory rules, conflict protocol, compliance review
docs/USAGE.md           ← how to scaffold a new artifact (the <head>, paths, light/dark)
docs/TOKENS.md          ← every color/type/spacing/radius/shadow token (use these, never raw hex)
docs/COMPONENTS.md      ← copy-paste markup recipes for every fn-*/hw-* component
docs/LAYOUTS.md         ← app shell, .hw-box-content boilerplate, and the 9 page patterns
templates/app-page/     ← ready-to-copy product-page starting point
```

## Index

```
AG Design System.html   ← interactive gallery — open first
Variations.html         ← 3 themed directions on a pan/zoom canvas
styles.css              ← THE entry stylesheet consumers load (tokens + components)
tokens.css              ← design tokens (mirror of _variable.scss)
components.css          ← fn-*/hw-* component classes
ds-styles.css           ← gallery chrome (.ds-* classes) + imports components.css
design-canvas.jsx       ← canvas component used by Variations
src/                    ← React primitives + gallery views
  primitives.jsx        ← Fn*/Hw* facsimile components + helpers
  app.jsx               ← shell: sidebar, top bar, router
  view-foundations.jsx  ← color / type / spacing / shadows / icons / motion
  view-components.jsx    view-patterns.jsx   view-restaurant.jsx
  view-hw-header.jsx     view-app-market.jsx view-connect.jsx
  view-how-to-use.jsx    view-a11y.jsx       view-tour.jsx
preview/                ← spec cards for the Design System tab
SKILL.md                ← agent skill manifest (Claude Code compatible)
docs/                   ← prescriptive usage docs (GOVERNANCE / USAGE / TOKENS / COMPONENTS / LAYOUTS)
```

### Provenance
Ported from the team's AG Design System project. This is a **design/prototyping reference** — the source of truth remains the `foundation` + `hw-foundation` Angular repos and `_variable.scss`. When those change, re-sync `tokens.css`.
