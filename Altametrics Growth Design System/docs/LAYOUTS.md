# Layouts — page structure & patterns

> Product screens are not free-form. They sit inside the **app shell** and use the **`.hw-box-content`
> page boilerplate**. Build every screen from these scaffolds, then fill regions with recipes from
> `COMPONENTS.md`. The ready-made starting point is `templates/app-page/`.

---

## The app shell

Header on top (`hw-navbar`, 50px), sidebar on the left (`fn-menu-sidebar`), content fills the rest.

```html
<header class="hw-navbar">
  <ul class="navbar-left">
    <li class="brand"><span class="logo-box"><iconify-icon icon="ph:fork-knife" style="color:#fff;font-size:22px"></iconify-icon></span></li>
    <li class="header-list-item"><span><span class="lead-icon"><iconify-icon icon="ph:squares-four"></iconify-icon></span> My Apps <span class="caret-ico"><iconify-icon icon="ph:caret-down"></iconify-icon></span></span></li>
    <li class="header-list-item"><span><span class="lead-icon"><iconify-icon icon="ph:map-pin"></iconify-icon></span> Downtown — Store 014 <span class="caret-ico"><iconify-icon icon="ph:caret-down"></iconify-icon></span></span></li>
  </ul>
  <ul class="navbar-center">
    <li><span class="weather-trigger"><span class="w-ico"><iconify-icon icon="ph:cloud-sun"></iconify-icon></span> 72°</span></li>
    <li><span class="clock">9:41 <sup>AM</sup> <span class="tz">PST</span></span></li>
  </ul>
  <ul class="navbar-right">
    <li><span class="gear-btn"><iconify-icon icon="ph:clock"></iconify-icon></span></li>
    <li><span class="gear-btn"><iconify-icon icon="ph:bell"></iconify-icon></span></li>
    <li><span class="gear-btn"><iconify-icon icon="ph:gear"></iconify-icon></span></li>
    <li><span class="fn-avtar" style="width:36px;height:36px">JD</span></li>
  </ul>
</header>

<div style="display:flex;min-height:calc(100vh - 50px)">
  <nav class="fn-menu-sidebar is-static-expanded">
    <ul class="menu-nav">
      <li class="menu-item active"><span class="menu-icon"><iconify-icon icon="ph:calendar-blank"></iconify-icon></span><span class="menu-label">Schedule</span></li>
      <li class="menu-item"><span class="menu-icon"><iconify-icon icon="ph:clock"></iconify-icon></span><span class="menu-label">Timecards</span></li>
      <li class="menu-item"><span class="menu-icon"><iconify-icon icon="ph:package"></iconify-icon></span><span class="menu-label">Inventory</span></li>
    </ul>
  </nav>

  <main style="flex:1;padding:var(--space-5);min-width:0">
    <!-- .hw-box-content boilerplate goes here -->
  </main>
</div>
```

The sidebar is `50px` collapsed, `240px` expanded (`is-static-expanded` keeps it open); the active
item has the left-border accent.

---

## The page boilerplate — `.hw-box-content`  (REQUIRED on every routed page)

This is the non-negotiable wrapper for page content: a header band, a title/action bar, then the body.

```html
<div class="hw-box-content">
  <!-- header band: page title (left) + context (right) -->
  <div class="hw-header-wrap">
    <div class="row">
      <div class="lhs"><i><iconify-icon icon="ph:calendar-blank"></iconify-icon></i> Schedule overview</div>
      <div class="rhs">Week 23 · Jun 1 – Jun 7</div>
    </div>
  </div>

  <!-- title bar: filters + primary actions (use .split to push them apart) -->
  <div class="hw-title split">
    <div style="display:flex;gap:var(--space-3);align-items:flex-end">
      <div><label>Role</label>
        <div class="fn-select"><span class="value">All roles</span><span class="caret caret-main"><iconify-icon icon="ph:caret-down"></iconify-icon></span></div>
      </div>
      <div><label>Search</label><input class="form-control" placeholder="Employee name" /></div>
    </div>
    <div style="display:flex;gap:var(--space-2)">
      <button class="btn btn-outline-secondary btn-sm">Export</button>
      <button class="btn btn-primary btn-sm">Publish</button>
    </div>
  </div>

  <!-- content body: the actual data / form / cards -->
  <div class="hw-content">
    <!-- e.g. a .pt-wrap prime table from COMPONENTS.md -->
  </div>
</div>
```

Regions: **`.hw-header-wrap`** (title + context) → **`.hw-title`** (filters/actions; `.split` =
space-between) → **`.hw-content`** (body). Corners and borders are handled by the classes — don't add
your own card chrome around it.

---

## The 9 page patterns

Compose the shell + boilerplate into these. Each is a layout, not a new component.

| Pattern | Structure |
|---|---|
| **App shell** | Header + collapsing sidebar + content region (above). The frame for everything. |
| **Page boilerplate** | Any routed page: `.hw-box-content` → header / title / content. |
| **Dashboard** | Grid of KPI tiles (`.hw-box-content` cards) + charts. 2–4 columns with `gap: var(--space-5)`. |
| **List page** | Filter bar in `.hw-title` over a `.pt-table` in `.hw-content` + `.pt-footer` pager. |
| **Form page** | `.hw-content` holding sectioned reactive form rows (`<label>` + `.form-control` / `.fn-select`), actions in `.hw-title`. |
| **Detail + drawer** | Record view in `.hw-content`; edit opens a right-hand drawer (surface + `--shadow`, `width:420px`). |
| **Auth** | Centered card on `--body-bg`: title, `.form-control` fields, full-width `.btn.btn-primary`. The `hw-auth` chrome. |
| **Settings** | Left sub-nav (vertical tabs) + grouped preference panels in `.hw-content`. |
| **Empty & loading** | Empty-state block (see `COMPONENTS.md`) and `.fn-skeleton` / `.fn-spinner` placeholders while loading. |

---

## Layout rules

- **Spacing:** flex/grid with `gap: var(--space-n)` — not per-element margins, not bare inline siblings.
- **Cards/panels:** `.hw-box-content` (or a surface with `background:var(--bg-primary)`,
  `border:1px solid var(--box-border-color)`, `border-radius:var(--radius-md)`). Separate dense
  regions with **borders, not shadows**; reserve `--shadow` for overlays.
- **Density:** body text 14px; never below 12px. Hit targets ≥ the component defaults (don't shrink buttons/inputs below `.btn-sm` / 30px).
- **Page padding:** `var(--space-5)` around the content region.
- **One header, one sidebar, one content region** per screen — don't nest shells.
