# Altametrics Growth Design System — project notes

## Header & app-shell are centralized — keep them auto-syncing to all consumers

Any project, template, or prototype built on this design system must automatically
inherit header / side-nav / support-panel updates. The mechanism, do not break it:

- **CSS** (`components.css`, imported by `styles.css`) owns the pinned header
  (`.hw-navbar` → `position: sticky; top: 0`), the fixed-sidebar app shell
  (`.hw-app-shell` / `.hw-app-body` → sticky `.fn-menu-sidebar`, scrolling
  `.hw-app-main`), the support popover (`.hw-support-dd`), and dropdown toggling.
  Consumers load `styles.css` at runtime, so CSS changes flow automatically.
- **`hw-header.js`** is the SINGLE SOURCE OF TRUTH for header markup + behavior
  (My Apps, Site, Weather, Profile + language, and the Support/Help popover).
  The compiler **inlines `hw-header.js` into `_ds_bundle.js`** and runs it on load,
  so any consumer that loads the bundle (via `ds-base.js`) gets the header script
  automatically — do NOT add a separate `<script src="hw-header.js">`. A consumer
  renders the full, current header by dropping ONE line:
  ```html
  <header class="hw-navbar" data-hw-header data-hw-render="standard"
          data-app-name="My Apps" data-site-name="Store 014" data-version="6.9.0"></header>
  ```
  (`data-hw-render="standard"` or an empty `[data-hw-header]` triggers auto-render;
  it also lazy-loads iconify if missing.) Editing `hw-header.js` updates EVERY
  consumer that uses the one-liner — including the `app-page` template, which now
  does. **When changing the header, edit `hw-header.js` (and the React mirror in
  `src/view-hw-header.jsx` for the docs), never hard-code header markup in a template.**

## Why a consumer might not see header updates
The DS sync carries the **compiled bundle + CSS/tokens/fonts/icons** — NOT a
consumer's own page markup or their copied `ds-base.js`. So:
- CSS changes (pinned header/sidebar, support-panel styling) flow on re-sync.
- The header **script** flows too (it's inlined in the bundle).
- A project that **hard-coded an old static header** will NOT auto-change its
  markup — it must swap that header for the one-liner above (and wrap the page in
  `.hw-app-shell` for the pinned layout). That single markup swap is the only
  manual step for upgrading an existing consumer.

## Rules for new templates / prototypes in or on this system
- Wrap pages in `.hw-app-shell` > (`.hw-navbar`) + `.hw-app-body` > (`.fn-menu-sidebar` + `.hw-app-main`)
  so the header and sidebar stay pinned and only content scrolls.
- Use the header one-liner above; do not paste a full static header.
- Load the system via `ds-base.js` (pulls `styles.css`, `_ds_bundle.js`, `hw-header.js`).
