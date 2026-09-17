# Usage — how to start a new artifact

> Read this once before building. It tells you exactly what to load and how to scaffold so your
> output follows the AG Design System strictly. Class names live in `COMPONENTS.md`; tokens in
> `TOKENS.md`; page structure in `LAYOUTS.md`.

---

## 1. The fastest correct start: copy the template

For a product screen, **copy the `templates/app-page/` folder** and edit its `index.html`. It already:

- loads the design system (`ds-base.js` → `styles.css` = tokens + components),
- renders the `hw-navbar` app header and `fn-menu-sidebar`,
- wraps content in the `.hw-box-content` page boilerplate with a filter bar and a `.pt-table`.

Delete what you don't need and swap in your content using recipes from `COMPONENTS.md`. **Do not
restyle the copied markup** — change text and data only.

---

## 2. Building from scratch: the required `<head>`

If you're not copying the template, every standalone HTML artifact must start with this head. It
loads the **one** stylesheet that carries tokens + every component class, plus the icon set and Inter.

```html
<!doctype html>
<html lang="en">  <!-- add class="dark-theme" here for dark mode -->
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />

  <!-- THE design system: tokens + components in one file -->
  <link rel="stylesheet" href="styles.css" />

  <!-- Phosphor icons (the only icon system) -->
  <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>

  <title>…</title>
  <style>
    /* Page-LAYOUT only — never component styling. Use tokens for every value. */
    html, body { margin: 0; background: var(--body-bg); color: var(--body-textColor);
                 font-family: "Inter", sans-serif; }
  </style>
</head>
<body>
  …
</body>
</html>
```

What may go in your own `<style>`: page grid/flex, gaps, and one-off positioning — **always using
`var(--space-*)` / `var(--radius-*)` / color tokens**. What may **not**: any restyle of a `.fn-*` /
`.btn` / `.pt-*` class, any raw hex, any new "button"/"input"/"card" look.

---

## 3. Pathing (so the stylesheet actually resolves)

`styles.css` lives at the **design-system root**. Reference it relative to where your file sits:

| Your file location | href |
|---|---|
| Design-system root | `styles.css` |
| One folder deep (e.g. `templates/app-page/`) | `../styles.css` (the template uses `ds-base.js` with `base = '../..'`) |
| A consuming project that bound this system | point at the bound `_ds/<folder>/styles.css` — edit the one `base` line in `ds-base.js` |

If components render unstyled, the path to `styles.css` is wrong — fix that first. (`styles.css`
itself `@import`s `tokens.css` + `components.css`; you only ever link `styles.css`.)

---

## 4. Light & dark

Dark mode is a single class on the root element — **no media queries, no overrides**:

```html
<html class="dark-theme"> … </html>
```

Every token flips automatically. Always sanity-check both before delivering.

---

## 5. React facsimiles (optional)

The gallery's `src/primitives.jsx` exports React versions of these components (`<Button>`, `<Input>`,
`<Select>`, `<FnTag>`, `<PrimeTable>`, …). If you're building a React prototype you may import them
instead of hand-writing markup — same classes under the hood. Otherwise use the HTML recipes.

---

## 6. Production Angular

Not a mock? Then it's real code:

- Import from `'foundation'` / `'hw-foundation'` aliases (never source paths), **per-feature module**
  (`FnButtonModule`, not all of `FoundationModule`).
- Components `Fn*` / `Hw*`; selectors `fn-*` / `hw-*`.
- Colors via tokens (extend `_variable.scss` + `_color.scss` to add one). Strings via the i18n pipe;
  dates via the global formatter. HTTP via `FnHttpService` / `HwHttpService`. Forms reactive
  (`FormGroup` + `formControlName`).
- Every routed page uses the `.hw-box-content` boilerplate.
