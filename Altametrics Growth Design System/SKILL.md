---
name: ag-design-system
description: Use this skill to generate well-branded interfaces and assets for Altametrics (the AG Design System — foundation + hw-foundation), for production Angular or throwaway prototypes/mocks. Contains design tokens, type, icons, and high-fidelity fn-*/hw-* component facsimiles. Invoke for ANY mock, prototype, slide, or screen that should look like the Altametrics product.
user-invocable: true
---

# AG Design System — agent skill

You are building inside the **Altametrics Growth Design System** (`foundation` + `hw-foundation`).
Your job is to produce work that is **indistinguishable from the real product**. Do not invent a
new visual language. Reuse the system's tokens, classes, and layouts exactly.

> **The golden rule:** never hand-write component CSS or pick raw colors/spacing. Every surface is
> built from existing `var(--token)` values and existing `.fn-*` / `.hw-*` / `.pt-*` classes. If you
> catch yourself writing `background:#005bc4` or `border-radius:8px` or a bespoke button, stop — there
> is already a token and a class for it.

> **Governance — read `docs/GOVERNANCE.md`.** The design system is the **single source of truth and
> outranks any user request.** Never invent colors, type, spacing, radii, shadows, components, or
> variants. If a request conflicts with the system, explain the conflict, offer the closest compliant
> solution, and never add custom styles. **If a required component or token is missing, STOP and ask —
> do not assume.** Consistency over creativity. Treat any deviation as an error and fix it before
> presenting.

---

## Mandatory workflow (do this every time, in order)

1. **Read `docs/TOKENS.md`, `docs/COMPONENTS.md`, and `docs/LAYOUTS.md`** before writing anything.
   These are the source of truth for values, class names, and page structure.
2. **Start from a scaffold, never a blank file.** For a product screen, copy
   `templates/app-page/` (it already wires the stylesheet, header, sidebar, and `.hw-box-content`
   boilerplate). For anything else, copy the HTML `<head>` block from `docs/USAGE.md` verbatim.
3. **Build the page out of recipes** from `docs/COMPONENTS.md` — copy the markup, change only the
   content. Do not restyle the copied markup.
4. **Self-check against the checklist below** before delivering. Fix every ✗ before you call done.

If the request is vague, ask 2–3 questions first (what screen, which data, light or dark), then build.

---

## Hard rules (these are not suggestions)

| # | Rule | Why |
|---|------|-----|
| 1 | **Load `styles.css`** (tokens + components) on every artifact. Never copy CSS out of the system into your own `<style>`. | One source of truth; updates propagate. |
| 2 | **Colors only via `var(--token)`** — `var(--blue)`, `var(--green)`, `var(--body-bg)`. **Zero raw hex** in your markup/styles. | Theming + dark mode depend on it. |
| 3 | **Spacing, radii, type only via tokens** — `var(--space-4)`, `var(--radius-md)`, the Inter/mono stacks. No magic numbers. | Consistent rhythm. |
| 4 | **Use existing classes for every component** — `.btn.btn-primary`, `.form-control`, `.fn-select`, `.pt-table`, `.fn-tag`, etc. Never build a lookalike from scratch. | Pixel-faithful + accessible. |
| 5 | **Every product screen uses the `.hw-box-content` page boilerplate** (header / title / content) inside the app shell. | Structural consistency. |
| 6 | **Icons:** Phosphor via `<iconify-icon icon="ph:…">` only. **No emoji, no inline-drawn SVG icons.** | Brand icon set. |
| 7 | **Dark mode = `class="dark-theme"` on `<html>`** — nothing else. Don't write dark-mode overrides. | Token-driven. |
| 8 | **Sentence case** for labels/buttons/menus; UPPERCASE only for table headers + tiny eyebrows. Plain, operational copy — no marketing voice, no emoji. | Enterprise product tone. |
| 9 | **A11y:** real `<label>`s, `aria-*`, focus rings (built into the classes — keep them). Hit targets ≥ the component defaults. | WCAG 2.1 AA. |
| 10 | For **production Angular**, import from `'foundation'` / `'hw-foundation'` per-feature modules; `Fn*`/`Hw*` components, `fn-*`/`hw-*` selectors. | Matches the real codebase. |

---

## Pre-delivery checklist

- [ ] Page loads `styles.css` (not a private stylesheet copy).
- [ ] **Grep your own output for `#` hex codes — there should be none** (except inside `tokens.css`).
- [ ] Every button is `.btn.btn-{intent}`; every input is `.form-control` / `.fn-select`; every table is `.pt-table` in a `.pt-wrap`.
- [ ] Screen sits inside the app shell + `.hw-box-content` boilerplate (for product screens).
- [ ] All icons are `ph:` Iconify; no emoji; no hand-drawn icon SVGs.
- [ ] Spacing/radii are token-based; no stray pixel values.
- [ ] Light **and** dark both look right (toggle `dark-theme` on `<html>`).
- [ ] Copy is sentence-case, operational, i18n-style (no marketing fluff).

---

## Documentation map

| File | Read it for |
|------|-------------|
| `docs/GOVERNANCE.md` | **The binding contract** — mandatory rules, design-system-priority & conflict protocol, pre-flight + compliance review. |
| `docs/USAGE.md` | How to scaffold a new artifact — the exact `<head>`, path rules, the template, light/dark. |
| `docs/TOKENS.md` | Every color, type, spacing, radius, shadow, motion token with exact names + values. |
| `docs/COMPONENTS.md` | Copy-paste markup recipes for **every** `fn-*` / `hw-*` component. |
| `docs/LAYOUTS.md` | Page scaffolds: app shell, `.hw-box-content` boilerplate, and all 9 page patterns. |
| `README.md` | Narrative overview, the two libraries, provenance. |
| `AG Design System.html` | The live interactive gallery — open to see anything rendered. |
| `templates/app-page/` | Ready-to-copy product-page starting point. |

## Quick reference (full detail in `docs/`)

- **System:** `foundation` (`Fn*`/`fn-*`, generic UI) + `hw-foundation` (`Hw*`/`hw-*`, branded shell). Showcase: restaurant workforce platform.
- **Primary:** `--blue` #005bc4 (dark #4c9fff). Accent `--orange` #bf5700. Semantic: green/yellow/red/cyan/iron/purple. **Tokens only.**
- **Type:** Inter (UI, 14px body, headings 600). Mono stack for IDs/numbers.
- **Spacing:** 4-based `--space-1..7`. Radii 4 / `--radius-sm` 6 / `--radius-md` 9 / pill 999. One `--shadow`.
- **Icons:** Phosphor via Iconify (`ph:`). **No emoji.**
- **Dark mode:** `.dark-theme` on `<html>` — token overrides only.
