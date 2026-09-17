# Components — copy-paste recipes

> Copy a recipe, change only the **text and data**. Do not add classes that restyle these, and do not
> rebuild a lookalike by hand. Every class here is defined in the design system stylesheet. Colors come
> from tokens automatically — never add a hex. Icons are always `<iconify-icon icon="ph:…">`.
>
> To see any of these rendered, open `AG Design System.html` (the gallery).

---

## Buttons — `.btn`

Base class `.btn` + one intent. Intents: `primary` `secondary` `success` `danger` `warning` `info`
`orange` `dark`. Outline form: `.btn.btn-outline-{intent}`. Modifiers: `.btn-sm` / `.btn-lg`,
`.btn-round`, `.btn-square`. Disabled: add `disabled` attribute.

```html
<button class="btn btn-primary">Publish</button>
<button class="btn btn-orange">Branded action</button>
<button class="btn btn-success">Approve</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-outline-primary">Outline</button>
<button class="btn btn-outline-secondary">Cancel</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-round">Round</button>
<button class="btn btn-primary" disabled>Disabled</button>

<!-- with leading icon -->
<button class="btn btn-primary"><iconify-icon icon="ph:plus"></iconify-icon> Add shift</button>

<!-- segmented group -->
<div class="btn-group">
  <button class="btn btn-outline-secondary">Day</button>
  <button class="btn btn-outline-secondary">Week</button>
  <button class="btn btn-outline-secondary">Month</button>
</div>
```

Floating action button (custom shell, token-styled):
```html
<button class="btn btn-primary btn-round" style="width:52px;height:52px;padding:0">
  <iconify-icon icon="ph:plus" style="font-size:22px"></iconify-icon>
</button>
```

---

## Text input — `.form-control`

```html
<label for="loc">Location</label>
<input id="loc" class="form-control" value="Downtown — Store 014" />

<textarea class="form-control" rows="3">Shift notes…</textarea>

<!-- input group (prefix/suffix) -->
<div class="input-group">
  <span class="input-group-text">$</span>
  <input class="form-control" value="18.50" />
</div>
<div class="input-group">
  <span class="input-group-text">🇺🇸 +1</span>   <!-- flag is content, not an icon -->
  <input class="form-control" value="(415) 555-0142" />
</div>
```

Always pair an input with a `<label for>`. The focus ring is built in — don't override it.

---

## Select — `.fn-select`

```html
<!-- single -->
<div class="fn-select" role="button" tabindex="0">
  <span class="value">Shift lead</span>
  <span class="caret caret-main"><iconify-icon icon="ph:caret-down"></iconify-icon></span>
</div>

<!-- placeholder -->
<div class="fn-select" role="button" tabindex="0">
  <span class="placeholder">Select role…</span>
  <span class="caret caret-main"><iconify-icon icon="ph:caret-down"></iconify-icon></span>
</div>

<!-- multi (chips) -->
<div class="fn-select is-multi">
  <span class="chip">Server <span class="x">×</span></span>
  <span class="chip">Host <span class="x">×</span></span>
  <span class="caret caret-main"><iconify-icon icon="ph:caret-down"></iconify-icon></span>
</div>
```

Open menu (when needed): a sibling `.fn-select-menu` with `.option` / `.option.selected` rows.

---

## Switch — `.fn-switch`

```html
<span class="fn-switch on"  role="switch" aria-checked="true"  tabindex="0"></span>
<span class="fn-switch"     role="switch" aria-checked="false" tabindex="0"></span>
<span class="fn-switch size-lg on"></span>   <!-- size-sm | size-lg -->
```

## Checkbox & radio — `.fn-checkbox` / `.fn-radio`

```html
<span class="fn-checkbox on" role="checkbox" aria-checked="true" tabindex="0">
  <span class="box"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  Notify manager
</span>

<span class="fn-radio on" role="radio" aria-checked="true" tabindex="0"><span class="dot"></span> Repeat weekly</span>
<span class="fn-radio"    role="radio" aria-checked="false" tabindex="0"><span class="dot"></span> One-time</span>
```

---

## Tags, status pills, avatars

```html
<!-- soft chip -->
<span class="fn-tag">Scheduled</span>
<span class="fn-tag bubble-success">Active</span>   <!-- bubble-{primary|success|warning|danger|info|orange|secondary} -->

<!-- table status pill -->
<span class="pt-pill solid-success">Approved</span>   <!-- solid-{primary|success|warning|danger} -->
<span class="pt-pill solid-warning">Pending</span>
<span class="pt-pill outline-danger">Overtime</span>  <!-- outline-{danger|muted} -->

<!-- avatar (initials) -->
<span class="fn-avtar size-sm">JD</span>   <!-- size-sm | (default) | size-lg | size-xl -->
<span class="fn-avtar-stack">
  <span class="fn-avtar">A</span><span class="fn-avtar">B</span><span class="fn-avtar">C</span>
</span>
```

---

## Tabs — `.fn-tabs`

```html
<div class="fn-tabs is-horizontal">
  <span class="tab active">Day</span>
  <span class="tab">Week</span>
  <span class="tab">Month <span class="count-num">4</span></span>
</div>
```

## Breadcrumb — `.fn-breadcrumb`

```html
<nav class="fn-breadcrumb" aria-label="Breadcrumb">
  <a>Scheduling</a><span class="sep">/</span>
  <a>Week 23</a><span class="sep">/</span>
  <span class="current" aria-current="page">Friday</span>
</nav>
```

## Pagination — `.fn-pager`

```html
<div class="fn-pager">
  <span class="page" disabled>‹</span>
  <span class="page active">1</span>
  <span class="page">2</span>
  <span class="page">3</span>
  <span class="page">›</span>
</div>
```

---

## Prime table — `.pt-wrap` / `.pt-table`

The product's primary data surface. Header cells take `.center` / `.right`; so do body cells.

```html
<div class="pt-wrap">
  <table class="pt-table">
    <thead>
      <tr>
        <th>Employee</th><th>Role</th>
        <th class="right">Hours</th><th class="center">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Jordan Diaz</td><td>Shift lead</td>
        <td class="right" style="font-family:var(--ds-mono)">38.5</td>
        <td class="center"><span class="pt-pill solid-success">Approved</span></td>
      </tr>
      <tr>
        <td>Mia Chen</td><td>Server</td>
        <td class="right" style="font-family:var(--ds-mono)">27.0</td>
        <td class="center"><span class="pt-pill solid-warning">Pending</span></td>
      </tr>
    </tbody>
  </table>
  <div class="pt-footer">
    <div class="pt-pager">
      <span class="pp" disabled>‹</span><span class="pp active">1</span>
      <span class="pp">2</span><span class="pp">›</span>
    </div>
  </div>
</div>
```

---

## Accordion — `.fn-accordian`  *(note the spelling — matches the real component)*

```html
<div class="fn-accordian">
  <div class="fn-panel fn-panel-expend">
    <div class="fn-panel-header" aria-expanded="true">
      <span>Shift details</span>
      <span class="fn-panel_icon"><iconify-icon icon="ph:caret-down"></iconify-icon></span>
    </div>
  </div>
  <div class="fn-panel" style="margin-top:10px">
    <div class="fn-panel-header" aria-expanded="false">
      <span>Break rules</span>
      <span class="fn-panel_icon"><iconify-icon icon="ph:caret-down"></iconify-icon></span>
    </div>
  </div>
</div>
```

---

## Feedback — toast, progress, spinner, skeleton, empty

```html
<!-- toast: success | danger | warning | info -->
<div class="fn-toast success">
  <span class="icon"><iconify-icon icon="ph:check-circle-fill"></iconify-icon></span>
  <div><div class="title">Saved</div>Schedule published</div>
  <span class="x">×</span>
</div>

<!-- progress: (default blue) | success | warning | danger -->
<div class="fn-progress"><div class="bar" style="width:72%"></div></div>

<!-- spinner -->
<span class="fn-spinner"></span>

<!-- skeleton lines -->
<span class="fn-skeleton" style="height:12px;width:90%"></span>

<!-- empty state -->
<div style="text-align:center;color:var(--iron)">
  <iconify-icon icon="ph:tray" style="font-size:48px;color:var(--iron)"></iconify-icon>
  <h4 style="font-size:16px;font-weight:600;margin:8px 0 0;color:var(--body-textColor)">No data to display</h4>
  <p style="font-size:13px;margin:4px 0 0">No shifts scheduled yet.</p>
</div>
```

---

## Event filter — `fn-event-filter` / `fn-event-check-box-filter`

Ported 1:1 from `component/event-filter/`. A funnel **fn-button** opens a dropdown (`.fn-event-filter`)
of grouped columns (`.event-filter-data`), each with an underlined header (`.event-filter-header > h3`,
the 50px `var(--theme)` underline is automatic) and a scrolling list (`.event-filter-list >
.event-filter-item`). Two variants share the same shell:

- **`fn-event-filter`** (base) — each column is a **single-select `fn-radio`** group.
- **`fn-event-check-box-filter`** — **multi-select `fn-checkbox`**, with a **"Show All" parent** as the
  first item.

A red `fn-global-times-o` **×** (`.filter-close`) sits at the top-right. Footer (`.event-filter-footer`)
has **Clear** (`btn-danger btn-round btn-xs`) + **Apply** (`btn-info btn-round btn-xs`), each
`min-width:60px`; add `.disable` when there's nothing to clear/apply.

```html
<div class="fn-event-filter-container">
  <button class="btn btn-outline-secondary btn-round">Filter <iconify-icon icon="ph:funnel" style="color:var(--blue)"></iconify-icon></button>

  <ul class="fn-event-filter">
    <li>
      <span class="filter-close"><i class="fn-global-times-o"></i></span>

      <div class="event-filter-data">
        <div class="event-filter-header"><h3>Highlight Punch For</h3></div>
        <ul class="event-filter-list">
          <!-- checkbox variant: first row = "Show All" parent -->
          <li class="event-filter-item"><label class="fn-checkbox on"><span class="box"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5"
            stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>Show All</span></label></li>
          <li class="event-filter-item"><label class="fn-checkbox on">…<span>Authorized Punches</span></label></li>
        </ul>
      </div>
      <!-- repeat .event-filter-data per group (Violations, Job Codes, …) -->
    </li>

    <li class="event-filter-footer">
      <div class="row">
        <div class="col"><button class="btn btn-danger btn-round btn-xs">Clear</button></div>
        <div class="col text-right"><button class="btn btn-info btn-round btn-xs">Apply</button></div>
      </div>
    </li>
  </ul>
</div>
```

> Base variant: swap each `.fn-checkbox` for an `.fn-radio` (single-select, no "Show All" parent).
> Rendered card: `preview/components-eventfilter.html`. Don't restyle the checkboxes/buttons.

---

## Dialog & drawer (overlays)

```html
<!-- confirm dialog -->
<div style="border-radius:var(--radius-sm);overflow:hidden;box-shadow:var(--shadow);
            border:1px solid var(--box-border-color);background:var(--bg-primary);max-width:380px">
  <div style="background:var(--dangerDark);color:#fff;padding:12px 16px;font-weight:600;
              display:flex;justify-content:space-between">Delete shift? <span>×</span></div>
  <div style="padding:18px 16px;font-size:14px;line-height:1.5">This can't be undone.</div>
  <div style="padding:12px 16px;border-top:1px solid var(--border-default-color);
              display:flex;gap:10px;justify-content:flex-end">
    <button class="btn btn-outline-secondary btn-sm">Cancel</button>
    <button class="btn btn-danger btn-sm">Delete</button>
  </div>
</div>
```

A right-hand drawer is the same surface tokens at `width:420px` pinned to the edge with `--shadow`.

---

## Icons — Phosphor via Iconify (the only icon system)

```html
<iconify-icon icon="ph:calendar-blank"></iconify-icon>
<iconify-icon icon="ph:clock"></iconify-icon>
<iconify-icon icon="ph:bell"></iconify-icon>
<iconify-icon icon="ph:caret-down"></iconify-icon>
```

Weights map to Phosphor variants (`ph:bell` regular, `ph:bell-bold`, `ph:bell-fill`, `ph:bell-duotone`).
Size/color with `style="font-size:20px;color:var(--iron)"`. **No emoji. No hand-drawn icon SVGs.**
(The exception above — the checkbox tick and arrow glyphs — are part of the component recipe, not icons.)
