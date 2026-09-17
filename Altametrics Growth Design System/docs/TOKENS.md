# Tokens — the only values you may use

> Consume every color, space, radius, and font through these `var(--token)` names. **Never** write a
> raw hex code, a magic pixel value, or a font name in your markup. The exact definitions live in
> `tokens.css` (light on `:root`, dark under `.dark-theme`); this is the quick reference.

---

## Color — semantic names (not a numbered scale)

| Token | Light | Role |
|---|---|---|
| `--blue` | `#005bc4` | **Primary / brand.** Dark mode `#4c9fff`. |
| `--theme` | = `--blue` | Brand alias — components reference this so apps can retint. |
| `--orange` | `#bf5700` | `hw-foundation` accent (header, app market). |
| `--green` | `#1e7e34` | Success |
| `--yellow` | `#fdc91e` | Warning |
| `--red` | `#c62828` | Danger |
| `--cyan` | `#0078a8` | Info |
| `--iron` | `#4b5563` | Muted / secondary text |
| `--purple` | `#7b42ff` | Accent / categorical |

Each semantic color also has **`*Dark`** and **`*Light`** variants (e.g. `--primaryDark`,
`--successLight`) for hover states and soft tints. Use them — don't compute your own.

### Surfaces & structure

| Token | Role |
|---|---|
| `--body-bg` | Page background (`#f6f7ff` light) |
| `--bg-primary` | Card / panel surface (`#fff` light) |
| `--bg-primary-dark` | Slightly recessed surface (header bands, table head) |
| `--side-nav-bg` | App header + sidebar (`#25262e`) |
| `--hover-bg-color` | Row / item hover |
| `--table-dark-cell` | Table header cell |
| `--table-border-color` / `--border-default-color` / `--box-border-color` | Borders & gridlines |
| `--body-textColor` | Default text |
| `--input-border-color` / `--input-bg` / `--input-placeholder-color` | Form fields |
| `--focus-ring` | The universal 2px focus ring (already on focusable classes) |

> **Rule:** background = a surface token; text = `--body-textColor` or a semantic color; borders = a
> border token. If you're reaching for a hex, you're doing it wrong.

---

## Typography

- **UI family:** `Inter` (300–700), loaded by the stylesheet. Body **14px**, line-height **1.5**.
- **Mono:** `var(--ds-mono)` (system monospace stack) for IDs, codes, and tabular numerics.
- **Headings:** weight **600**, tight tracking — page **28px**, section **20px**, card **15px**.
- Sentence case everywhere except table headers and small eyebrow labels (UPPERCASE, tracked +.04–.08em).

```html
<h1 style="font-size:28px;font-weight:600;letter-spacing:-.02em">Schedule overview</h1>
<span style="font-family:var(--ds-mono)">EMP-04821 · 38.5 hrs</span>
```

---

## Spacing — 4-based scale

| Token | px |
|---|---|
| `--space-1` | 4 |
| `--space-2` | 8 |
| `--space-3` | 12 |
| `--space-4` | 16 |
| `--space-5` | 24 |
| `--space-6` | 32 |
| `--space-7` | 48 |

Use these for padding, margin, and `gap`. Prefer flex/grid + `gap: var(--space-n)` over per-element margins.

---

## Radii

| Token / value | Use |
|---|---|
| `4px` | Buttons, inputs, controls (the foundation default) |
| `--radius-sm` (6px) | Small cards, pagers, tags-area |
| `--radius-md` (9px) | Panels, `.hw-content` corners |
| `999px` | Pills, switches, avatars, chips |

---

## Elevation & motion

- **One shadow token:** `--shadow` (`0 7px 22px rgba(0,0,0,.15)`; heavier in dark) — for popovers,
  dialogs, drawers, floating menus. **Dense surfaces are separated by borders, not shadows.**
- **Motion:** short **linear** transitions, `.12s–.25s`, on background / border / color. Caret
  rotations & switch thumbs `.15s`. **No bounces, no spring physics.** Respect `prefers-reduced-motion`.

---

## Dark mode

`class="dark-theme"` on `<html>` overrides the token values — nothing else. Never write a dark-mode
rule yourself; if a color looks wrong in dark, you used a raw hex instead of a token.
