/* @ds-bundle: {"format":3,"namespace":"AltametricsGrowthDesignSystem_f9983f","components":[],"sourceHashes":{"deck-stage.js":"eac2199dccb4","design-canvas.jsx":"e4b74f9f9e7f","hw-header.js":"98c6a97dc591","src/app.jsx":"26d361da842a","src/primitives.jsx":"bcb4c00c97ec","src/view-a11y.jsx":"d66c17b8a1f1","src/view-app-market.jsx":"6bc5e35622f9","src/view-components.jsx":"058b8155486a","src/view-connect.jsx":"3bc9d17d1a1e","src/view-foundations.jsx":"c05625fbca11","src/view-how-to-use.jsx":"39f2c470173e","src/view-hw-header.jsx":"3c3db210c7aa","src/view-patterns.jsx":"c387e54f00e4","src/view-restaurant.jsx":"86040d16a045","src/view-tour.jsx":"e1c9b50cfd5e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AltametricsGrowthDesignSystem_f9983f = window.AltametricsGrowthDesignSystem_f9983f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// deck-stage.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *      On touch devices, tapping the left/right half of the stage goes
 *      prev/next — taps on links, buttons and other interactive slide
 *      content are left alone.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Delete (opens a Cancel/Delete confirm
 *      dialog). Drag the rail's right edge to resize; width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, on narrow viewports
 *      (≤640px), and via the `no-rail` attribute. Rail mutations dispatch
 *      a `deckchange`
 *      CustomEvent on the element: detail = {action, from, to, slide}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 *
 * Speaker notes stay in sync because the component posts {slideIndexChanged: N}
 * to the parent — just include the #speaker-notes script tag if asked for notes.
 *
 * Authoring guidance:
 *   - Write slide bodies as static HTML inside <deck-stage>, with sizing via
 *     CSS custom properties in a <style> block rather than JS constants.
 *     Static slide markup is what lets the user click a heading in edit mode
 *     and retype it directly; a slide rendered through <script type="text/babel">,
 *     React, or a loop over a JS array has to round-trip every tweak through a
 *     chat message instead. Reach for script-generated slides only when the
 *     content genuinely needs interactive behaviour static HTML can't express.
 *   - Do NOT set position/inset/width/height on the slide <section> elements —
 *     the component absolutely positions every slotted child for you.
 *   - Entrance animations: make the visible end-state the base style and
 *     animate *from* hidden, so print and reduced-motion show content.
 *     Gate the animation on [data-deck-active] and the motion query, e.g.
 *     `@media (prefers-reduced-motion:no-preference){ [data-deck-active] .x{animation:fade-in .5s both} }`.
 *     Avoid infinite decorative loops on slide content.
 */
/* END USAGE */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const FINE_POINTER_MQ = matchMedia('(hover: hover) and (pointer: fine)');
  const NARROW_MQ = matchMedia('(max-width: 640px)');
  // Slide-authored controls that should keep a tap instead of it navigating.
  const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, summary, label, video[controls], audio[controls], [role="button"], [onclick], [tabindex]:not([tabindex^="-"]), [contenteditable]:not([contenteditable="false" i])';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    @media (max-width: 640px) {
      .rail, .rail-resize { display: none; }
    }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTap = this._onTap.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      this.addEventListener('click', this._onTap);
      // Print lays every slide out as its own page, so [data-deck-active]-
      // gated entrance styles need the attribute on every slide (not just
      // the current one) or their content prints at the hidden base style.
      // The transient freeze style lands BEFORE the attributes so any
      // attribute-keyed transition fires at 0s (changing transition-
      // duration after a transition has started doesn't affect it).
      this._onBeforePrint = () => {
        if (this._freezeStyle) this._freezeStyle.remove();
        this._freezeStyle = document.createElement('style');
        this._freezeStyle.textContent = '*,*::before,*::after{transition-duration:0s !important}';
        document.head.appendChild(this._freezeStyle);
        this._slides.forEach(s => s.setAttribute('data-deck-active', ''));
      };
      this._onAfterPrint = () => {
        this._applyIndex({
          showOverlay: false,
          broadcast: false
        });
        if (this._freezeStyle) {
          this._freezeStyle.remove();
          this._freezeStyle = null;
        }
      };
      window.addEventListener('beforeprint', this._onBeforePrint);
      window.addEventListener('afterprint', this._onAfterPrint);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav and skip don't trigger
      // spurious refreshes.
      const OWN_ATTRS = /^data-(deck-|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          if (n && this._slideSet && this._slideSet.has(n)) this._liveDirty.add(n);
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      window.removeEventListener('beforeprint', this._onBeforePrint);
      window.removeEventListener('afterprint', this._onAfterPrint);
      if (this._freezeStyle) {
        this._freezeStyle.remove();
        this._freezeStyle = null;
      }
      this.removeEventListener('click', this._onTap);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-omelette-chrome', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-omelette-chrome', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-omelette-chrome', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-omelette-chrome', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-omelette-chrome', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, overlay, menu, confirm);
      this._canvas = canvas;
      this._stage = stage;
      this._slot = slot;
      this._overlay = overlay;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ' +
      // Jump authored animations/transitions to their end state so print
      // never captures mid-entrance — pairs with the beforeprint handler
      // in connectedCallback that sets data-deck-active on every slide.
      '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }
    _onSlotChange() {
      // Rail mutations (delete/move) already reconcile synchronously and
      // emit slidechange with reason 'api'; skip the async slotchange that
      // would otherwise re-broadcast with reason 'init'.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode || NARROW_MQ.matches) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
      // Crossing the narrow-viewport breakpoint reveals the rail — rerun the
      // thumbnail scale the same way _setRailWidth does.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTap(e) {
      // Touch-only — keyboard + the overlay toolbar cover nav on desktop.
      if (FINE_POINTER_MQ.matches) return;
      // Only taps that land on the stage (slide content or letterbox); the
      // overlay / rail / menus are siblings with their own click handlers.
      const path = e.composedPath();
      if (!this._stage || !path.includes(this._stage)) return;
      // Let interactive slide content keep the tap. composedPath (not
      // e.target.closest) so we see through open shadow roots — a <button>
      // inside a slide-authored custom element retargets e.target to the
      // host but still appears in the composed path.
      if (e.defaultPrevented) return;
      for (const n of path) {
        if (n === this._stage) break;
        if (n.matches && n.matches(INTERACTIVE_SEL)) return;
      }
      e.preventDefault();
      const rw = this._railWidth();
      const mid = rw + (window.innerWidth - rw) / 2;
      this._advance(e.clientX < mid ? -1 : 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }
    _emitDeckChange(detail) {
      this.dispatchEvent(new CustomEvent('deckchange', {
        detail,
        bubbles: true,
        composed: true
      }));
    }
    _deleteSlide(i) {
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const wasCurrent = i === this._index;
      if (i < this._index || wasCurrent && i === this._slides.length - 1) this._index--;
      this._squelchSlotChange = true;
      slide.remove();
      this._emitDeckChange({
        action: 'delete',
        from: i,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
      if (this._thumbs && this._thumbs[i]) {
        if (on) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
      }
      this._markLastVisible();
      this._emitDeckChange({
        action: on ? 'skip' : 'unskip',
        from: i,
        slide
      });
      // Re-broadcast so the presenter popup's prev/next thumbnails re-pick
      // the nearest non-skipped slide without waiting for a nav event.
      try {
        window.postMessage({
          slideIndexChanged: this._index,
          deckTotal: this._slides.length,
          deckSkipped: this._skippedIndices()
        }, '*');
      } catch (e) {}
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (j < 0 || j >= this._slides.length || j === i) return;
      const slide = this._slides[i];
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      // Track the active slide across the reorder so the same content
      // stays on screen.
      const cur = this._index;
      if (cur === i) this._index = j;else if (i < cur && j >= cur) this._index = cur - 1;else if (i > cur && j <= cur) this._index = cur + 1;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._emitDeckChange({
        action: 'move',
        from: i,
        to: j,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "deck-stage.js", error: String((e && e.message) || e) }); }

// design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. a remote Google Fonts stylesheet) — in that
  // case fetch the CSS text directly (those endpoints send ACAO:*) and
  // regex-extract the blocks. @import and @media/@supports are walked so
  // nested @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-canvas.jsx", error: String((e && e.message) || e) }); }

// hw-header.js
try { (() => {
/* ============================================================================
   AG Design System — hw-header.js
   Makes the hw-navbar header (and its dropdowns) interactive in plain-HTML
   consumers — the markup the design-system docs render with React.

   Wiring (no config needed, auto-inits on load):
     <header class="hw-navbar" data-hw-header>
       <li data-hw-trigger="apps" aria-haspopup="menu" aria-expanded="false">…</li>
       <div class="hw-dd hw-app-list" data-hw-panel="apps">…</div>
     </header>

   • Click a [data-hw-trigger] → toggles the sibling [data-hw-panel] of the
     same id (closes any other open panel first).
   • Click outside / Escape → closes all.
   • An element inside a panel with [data-hw-close] closes the panel when clicked
     (e.g. picking a menu item). [data-hw-stop] keeps a click from closing
     (e.g. a nested sub-dropdown toggle).
   • [data-hw-subtrigger="id"] toggles a nested [data-hw-subpanel="id"] (language
     picker, settings sub-menu) without closing the parent panel.
   • [data-hw-theme-toggle] (the profile "Light Theme" switch) flips dark mode:
     toggles `.dark-theme` on <html> and persists localStorage['ds-theme'].
   ============================================================================ */
(function () {
  /* ---- theme ---- (matches the docs: .dark-theme on <html>, key 'ds-theme') */
  function isDark() {
    return document.documentElement.classList.contains('dark-theme');
  }
  function setDark(dark) {
    document.documentElement.classList.toggle('dark-theme', dark);
    try {
      localStorage.setItem('ds-theme', dark ? 'dark' : 'light');
    } catch (e) {}
    // reflect on every rendered Light-Theme switch (on = light)
    document.querySelectorAll('[data-hw-theme-toggle]').forEach(function (sw) {
      sw.classList.toggle('on', !dark);
      sw.setAttribute('aria-checked', String(!dark));
    });
  }
  // apply any saved preference as early as possible
  try {
    if (localStorage.getItem('ds-theme') === 'dark') document.documentElement.classList.add('dark-theme');
  } catch (e) {}
  function initHeader(nav) {
    if (nav.__hwHeaderInit) return;
    nav.__hwHeaderInit = true;
    function panels() {
      return nav.querySelectorAll('[data-hw-panel]');
    }
    function triggers() {
      return nav.querySelectorAll('[data-hw-trigger]');
    }
    function subpanels() {
      return nav.querySelectorAll('[data-hw-subpanel]');
    }
    function closeSubs() {
      subpanels().forEach(function (p) {
        p.classList.remove('open');
      });
      nav.querySelectorAll('[data-hw-subtrigger]').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    }
    function closeAll() {
      panels().forEach(function (p) {
        p.classList.remove('open');
      });
      triggers().forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
      closeSubs();
    }
    function openPanel(id, trig) {
      var panel = nav.querySelector('[data-hw-panel="' + id + '"]');
      if (!panel) return;
      var wasOpen = panel.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        panel.classList.add('open');
        if (trig) trig.setAttribute('aria-expanded', 'true');
      }
    }
    nav.addEventListener('click', function (e) {
      // theme toggle (profile "Light Theme" switch) — flips dark mode, panel stays open
      var themeBtn = e.target.closest('[data-hw-theme-toggle]');
      if (themeBtn && nav.contains(themeBtn)) {
        e.stopPropagation();
        setDark(!isDark());
        return;
      }
      // nested sub-dropdown toggle (stays inside its parent panel)
      var sub = e.target.closest('[data-hw-subtrigger]');
      if (sub && nav.contains(sub)) {
        e.stopPropagation();
        var sid = sub.getAttribute('data-hw-subtrigger');
        var spanel = nav.querySelector('[data-hw-subpanel="' + sid + '"]');
        var open = spanel && spanel.classList.contains('open');
        closeSubs();
        if (spanel && !open) {
          spanel.classList.add('open');
          sub.setAttribute('aria-expanded', 'true');
        }
        return;
      }
      var trig = e.target.closest('[data-hw-trigger]');
      if (trig && nav.contains(trig)) {
        e.stopPropagation();
        openPanel(trig.getAttribute('data-hw-trigger'), trig);
        return;
      }

      // click landed inside an open panel
      var insidePanel = e.target.closest('[data-hw-panel]');
      if (insidePanel) {
        if (e.target.closest('[data-hw-stop]')) {
          return;
        }
        if (e.target.closest('[data-hw-close]')) {
          closeAll();
          return;
        }
        // clicks on plain rows just close subs, keep the panel open
        closeSubs();
        return;
      }

      // click elsewhere in the header → close
      closeAll();
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    // keyboard activation on focusable triggers
    nav.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var themeBtn = e.target.closest('[data-hw-theme-toggle]');
      if (themeBtn && nav.contains(themeBtn)) {
        e.preventDefault();
        setDark(!isDark());
        return;
      }
      var trig = e.target.closest('[data-hw-trigger]');
      if (trig && nav.contains(trig)) {
        e.preventDefault();
        openPanel(trig.getAttribute('data-hw-trigger'), trig);
      }
    });
  }

  /* ----------------------------------------------------------------------------
     Standard header markup — the single source of truth for the app chrome.
     Rendered into any [data-hw-header] that opts in. Config via data- attrs:
       data-logo-icon   leading brand icon (iconify name)   default ph:fork-knife
       data-app-name    "My Apps" label                     default My Apps
       data-site-name   site switcher label                 default Site 1
       data-time        clock time                          default 9:41
       data-meridiem    superscript meridiem (A/P, blank=24h)default A
       data-tz          timezone label                      default America/Los Angeles
       data-version     support-panel version header        default 6.9.0
       data-billing     billing marquee message (omit=hide) default (none)
  ---------------------------------------------------------------------------- */
  function ensureIconify() {
    if (window.customElements && customElements.get('iconify-icon')) return;
    if (document.querySelector('script[data-hw-iconify]')) return;
    var sc = document.createElement('script');
    sc.src = 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js';
    sc.setAttribute('data-hw-iconify', '');
    document.head.appendChild(sc);
  }
  function renderStandard(nav) {
    ensureIconify();
    var a = function (n, d) {
      var v = nav.getAttribute(n);
      return v == null ? d : v;
    };
    var esc = function (s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    var logo = esc(a('data-logo-icon', 'ph:fork-knife'));
    var appName = esc(a('data-app-name', 'My Apps'));
    var siteName = esc(a('data-site-name', 'Site 1'));
    var time = esc(a('data-time', '9:41'));
    var mer = a('data-meridiem', 'A');
    var tz = esc(a('data-tz', 'America/Los Angeles'));
    var version = esc(a('data-version', '6.9.0'));
    var billing = nav.getAttribute('data-billing');
    var billingHtml = billing ? '<li class="header-list-item"><div class="alert-msg-header">' + '<div class="text-anim-marquee"><div class="msg-wrap"><p>' + esc(billing) + '</p></div></div>' + '<button class="take-action">Take Action</button>' + '</div></li>' : '';
    var clockHtml = '<span class="clock"><span>' + time + (mer ? '<sup>' + esc(mer) + '</sup>' : '') + '</span><span class="tz">' + tz + '</span></span>';
    nav.innerHTML = '<ul class="navbar-left">' + '<li class="brand"><span class="logo-box"><iconify-icon icon="' + logo + '" style="color:#fff;font-size:22px;"></iconify-icon></span></li>' + '<li class="header-list-item" data-hw-trigger="apps" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><span><span class="lead-icon"><iconify-icon icon="ph:squares-four"></iconify-icon></span> ' + appName + ' <span class="caret-ico"><iconify-icon icon="ph:caret-down"></iconify-icon></span></span></li>' + '<li class="header-list-item" data-hw-trigger="site" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><span><span class="lead-icon"><iconify-icon icon="ph:map-pin"></iconify-icon></span> ' + siteName + ' <span class="caret-ico"><iconify-icon icon="ph:caret-down"></iconify-icon></span></span></li>' + '</ul>' + '<ul class="navbar-center">' + '<li data-hw-trigger="weather" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false"><span class="weather-trigger"><span class="w-ico"><iconify-icon icon="ph:cloud-sun"></iconify-icon></span> <iconify-icon icon="ph:caret-down" style="font-size:11px;"></iconify-icon></span></li>' + '<li class="cursor-default" style="cursor:default;">' + clockHtml + '</li>' + '</ul>' + '<ul class="navbar-right">' + billingHtml + '<li class="help-btn" data-hw-trigger="support" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false" aria-label="Help and support" title="Help &amp; support"><iconify-icon icon="ph:question"></iconify-icon></li>' + '<li class="gear-btn" role="button" tabindex="0" aria-label="Settings" title="Settings"><iconify-icon icon="ph:gear"></iconify-icon></li>' + '<li data-hw-trigger="profile" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><span class="user-icon" style="display:inline-flex;align-items:center;justify-content:center;background:#cfe0ff;"><iconify-icon icon="ph:user-fill" style="color:#fff;font-size:20px;"></iconify-icon></span></li>' + '</ul>' +
    // --- dropdowns ---
    '<div class="hw-dd hw-app-list" data-hw-panel="apps" role="menu"><ul>' + '<li role="menuitem"><span class="app-ico" style="background:#e8a13c;"><iconify-icon icon="ph:storefront-fill"></iconify-icon></span>Plum POS</li>' + '<li role="menuitem"><span class="app-ico" style="background:#7b42ff;"><iconify-icon icon="ph:chart-pie-slice-fill"></iconify-icon></span>Plum POS DashBoard</li>' + '<li role="menuitem"><span class="app-ico" style="background:#e23744;"><iconify-icon icon="ph:clock-fill"></iconify-icon></span>Plum Timekeeping</li>' + '<li role="menuitem"><span class="app-ico" style="background:var(--iron);"><iconify-icon icon="ph:gear-fill"></iconify-icon></span>Settings</li>' + '<li role="menuitem"><span class="app-ico" style="background:var(--theme);"><iconify-icon icon="ph:shopping-bag-fill"></iconify-icon></span>App Store</li>' + '</ul></div>' + '<div class="hw-dd hw-site-list" data-hw-panel="site" role="menu"><div class="choose-site"><h2>Choose Site(s)</h2></div><ul>' + '<li role="menuitem"><span class="site-icon"><iconify-icon icon="ph:map-pin-fill"></iconify-icon></span><span class="site-name">Red Panda Peppers</span></li>' + '<li role="menuitem"><span class="site-icon"><iconify-icon icon="ph:map-pin-fill"></iconify-icon></span><span class="site-name">' + siteName + '</span><span class="site-address">Plum Restaurant</span></li>' + '</ul></div>' + '<div class="hw-dd hw-weather-dd configured" data-hw-panel="weather" role="dialog" aria-label="Weather forecast">' + '<div class="weather-today"><h2>Fri, May 29</h2><div class="w-ico"><iconify-icon icon="ph:cloud-sun-fill"></iconify-icon></div><div class="w-status">Partly cloudy</div><div class="w-high">68°F</div><div class="w-low">54°F</div></div>' + '<div class="weather-weekly">' + '<div class="day"><div class="dname">Mon</div><div class="w-ico"><iconify-icon icon="ph:sun-fill"></iconify-icon></div><div style="font-size:15px;font-weight:700;">72°</div><div style="font-size:13px;opacity:.7;">58°</div></div>' + '<div class="day"><div class="dname">Tue</div><div class="w-ico"><iconify-icon icon="ph:cloud-sun-fill"></iconify-icon></div><div style="font-size:15px;font-weight:700;">70°</div><div style="font-size:13px;opacity:.7;">56°</div></div>' + '<div class="day"><div class="dname">Wed</div><div class="w-ico"><iconify-icon icon="ph:cloud-rain-fill"></iconify-icon></div><div style="font-size:15px;font-weight:700;">65°</div><div style="font-size:13px;opacity:.7;">54°</div></div>' + '</div>' + '</div>' + '<div class="hw-dd hw-profile-dd" data-hw-panel="profile" role="menu">' + '<div class="profile-section"><span class="profile-img" style="display:inline-flex;align-items:center;justify-content:center;"><iconify-icon icon="ph:user-fill" style="color:var(--primaryDark);font-size:30px;"></iconify-icon></span>' + '<ul class="profile-setting"><li class="hw-lang-wrap" data-hw-stop>' + '<span data-hw-subtrigger="lang" aria-expanded="false" style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;"><img class="flag" src="https://flagcdn.com/us.svg" alt="" /> English <iconify-icon icon="ph:caret-down" style="font-size:10px;"></iconify-icon></span>' + '<ul class="hw-lang-dd" data-hw-subpanel="lang" role="menu" aria-label="Select language">' + '<li class="lang-head" style="cursor:default;" aria-hidden="true">Select Language</li>' + '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/us.svg" alt="" /> English</li>' + '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/es.svg" alt="" /> Spanish</li>' + '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/fr.svg" alt="" /> French</li>' + '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/cn.svg" alt="" /> Chinese</li>' + '</ul>' + '</li><li>Edit</li></ul>' + '</div>' + '<ul class="profile-data">' + '<li style="cursor:default;"><span><i class="pi"><iconify-icon icon="ph:user"></iconify-icon></i> R Dixit</span></li>' + '<li style="cursor:default;"><span><i class="pi"><iconify-icon icon="ph:envelope-simple"></iconify-icon></i> plum@22.com</span></li>' + '<li><span><i class="pi"><iconify-icon icon="ph:key"></iconify-icon></i> Change Password</span></li>' + '<li style="cursor:default;" data-hw-stop><span><i class="pi"><iconify-icon icon="ph:sun"></iconify-icon></i> Light Theme</span><span class="fn-switch' + (isDark() ? '' : ' on') + '" data-hw-theme-toggle role="switch" tabindex="0" aria-checked="' + (isDark() ? 'false' : 'true') + '" aria-label="Light theme"></span></li>' + '<li class="red" data-hw-close><span><i class="pi"><iconify-icon icon="ph:power"></iconify-icon></i> Logout</span></li>' + '</ul>' + '</div>' + '<div class="hw-dd hw-support-dd" data-hw-panel="support" role="menu"><div class="support-head">Version ' + version + '</div><ul>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:gear-six"></iconify-icon></span>Settings<span class="chev"><iconify-icon icon="ph:caret-right"></iconify-icon></span></li>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:question"></iconify-icon></span>FAQ</li>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:device-mobile"></iconify-icon></span>Get Mobile App</li>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:play-circle"></iconify-icon></span>Help Center</li>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:chat-dots"></iconify-icon></span>Feedback</li>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:lifebuoy"></iconify-icon></span>Support</li>' + '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:scroll"></iconify-icon></span>Release Notes</li>' + '</ul></div>';
  }
  function boot() {
    document.querySelectorAll('[data-hw-header]').forEach(function (nav) {
      // Auto-render the standard header markup when asked (data-hw-render="standard")
      // or when the element is left empty. This keeps the canonical header in ONE
      // place (this file): consumers drop a one-liner and get the full chrome +
      // every dropdown + the support panel, and future updates flow automatically.
      var wantsRender = nav.getAttribute('data-hw-render') === 'standard' || nav.children.length === 0;
      if (wantsRender) renderStandard(nav);
      initHeader(nav);
    });
  }
  if (document.readyState !== 'loading') boot();else document.addEventListener('DOMContentLoaded', boot);
  window.HwHeader = {
    init: initHeader,
    boot: boot,
    render: renderStandard
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "hw-header.js", error: String((e && e.message) || e) }); }

// src/app.jsx
try { (() => {
/* ============================================================================
   AG Design System — app.jsx
   App shell: sidebar nav, top bar with theme/density toggle, view router.
   ============================================================================ */
const NAV = [{
  label: "Get started",
  items: [{
    id: "overview",
    title: "Overview",
    icon: "house"
  }, {
    id: "how-to-use",
    title: "How to use this system",
    icon: "compass"
  }, {
    id: "connect",
    title: "Connect to a project",
    icon: "plug"
  }, {
    id: "principles",
    title: "Principles & rules",
    icon: "gavel"
  }]
}, {
  label: "Foundations",
  items: [{
    id: "colors",
    title: "Color",
    icon: "palette"
  }, {
    id: "typography",
    title: "Typography",
    icon: "text-aa"
  }, {
    id: "spacing",
    title: "Spacing & radii",
    icon: "ruler"
  }, {
    id: "shadows",
    title: "Shadows & elevation",
    icon: "stack"
  }, {
    id: "icons",
    title: "Iconography",
    icon: "smiley"
  }, {
    id: "motion",
    title: "Motion",
    icon: "lightning"
  }]
}, {
  label: "Components — Forms",
  items: [{
    id: "fn-button",
    title: "Button",
    icon: "cursor-click"
  }, {
    id: "fn-input",
    title: "Text input",
    icon: "text-t"
  }, {
    id: "fn-select",
    title: "Select",
    icon: "caret-circle-down"
  }, {
    id: "fn-switch",
    title: "Switch",
    icon: "toggle-right"
  }, {
    id: "fn-checkbox",
    title: "Checkbox & Radio",
    icon: "check-square"
  }, {
    id: "fn-date",
    title: "Date & date-range",
    icon: "calendar"
  }, {
    id: "fn-time",
    title: "Time picker",
    icon: "clock"
  }, {
    id: "fn-tel",
    title: "Phone input",
    icon: "phone"
  }, {
    id: "fn-color-picker",
    title: "Color picker",
    icon: "drop"
  }, {
    id: "fn-files",
    title: "File upload",
    icon: "upload-simple"
  }, {
    id: "fn-text-editor",
    title: "Rich text editor",
    icon: "text-h"
  }, {
    id: "fn-rating",
    title: "Rating",
    icon: "star"
  }]
}, {
  label: "Components — Data",
  items: [{
    id: "fn-table",
    title: "Table",
    icon: "table"
  }, {
    id: "fn-grid",
    title: "Editable grid",
    icon: "grid-four"
  }, {
    id: "fn-pagination",
    title: "Pagination",
    icon: "dots-three-outline"
  }, {
    id: "fn-chart",
    title: "Charts",
    icon: "chart-line"
  }]
}, {
  label: "Components — Navigation",
  items: [{
    id: "fn-breadcrumb",
    title: "Breadcrumb",
    icon: "list-bullets"
  }, {
    id: "fn-tabs",
    title: "Tabs",
    icon: "browsers"
  }, {
    id: "fn-menu",
    title: "Sidebar menu",
    icon: "list"
  }, {
    id: "fn-accordion",
    title: "Accordion",
    icon: "list-plus"
  }]
}, {
  label: "Components — Feedback",
  items: [{
    id: "fn-dialog",
    title: "Dialog & confirm",
    icon: "warning"
  }, {
    id: "fn-drawer",
    title: "Drawer",
    icon: "sidebar"
  }, {
    id: "fn-toast",
    title: "Toaster",
    icon: "bell"
  }, {
    id: "fn-loader",
    title: "Loaders",
    icon: "spinner"
  }, {
    id: "fn-no-data",
    title: "No Data box",
    icon: "tray"
  }, {
    id: "fn-tag",
    title: "Tag / Badge",
    icon: "tag"
  }, {
    id: "fn-avatar",
    title: "Avatar",
    icon: "user-circle"
  }, {
    id: "fn-float-btn",
    title: "Float button",
    icon: "plus-circle"
  }]
}, {
  label: "HW-Foundation",
  items: [{
    id: "hw-header",
    title: "App header",
    icon: "browser"
  }, {
    id: "hw-auth",
    title: "Auth shell",
    icon: "lock-key"
  }, {
    id: "hw-app-market",
    title: "App market",
    icon: "squares-four"
  }]
}, {
  label: "Patterns",
  items: [{
    id: "p-shell",
    title: "App shell",
    icon: "layout"
  }, {
    id: "p-boilerplate",
    title: "Page boilerplate",
    icon: "frame-corners"
  }, {
    id: "p-dashboard",
    title: "Dashboard",
    icon: "chart-pie"
  }, {
    id: "p-list",
    title: "List page",
    icon: "rows"
  }, {
    id: "p-form",
    title: "Form page",
    icon: "note-pencil"
  }, {
    id: "p-detail",
    title: "Detail + drawer",
    icon: "file-text"
  }, {
    id: "p-auth",
    title: "Auth",
    icon: "sign-in"
  }, {
    id: "p-settings",
    title: "Settings",
    icon: "gear"
  }, {
    id: "p-empty",
    title: "Empty & loading",
    icon: "circle-dashed"
  }]
}, {
  label: "Showcase",
  items: [{
    id: "restaurant",
    title: "Restaurant scheduling",
    icon: "fork-knife"
  }, {
    id: "variations",
    title: "Visual variations →",
    icon: "swap"
  }]
}, {
  label: "Compliance",
  items: [{
    id: "a11y",
    title: "VPAT & WCAG 2.1 AA",
    icon: "wheelchair"
  }]
}];
function findItem(id) {
  for (const sec of NAV) for (const it of sec.items) if (it.id === id) return {
    item: it,
    section: sec.label
  };
  return {
    item: null,
    section: null
  };
}

/* ----------------------------- Sidebar ------------------------------------ */
function Sidebar({
  active,
  onPick,
  search,
  onSearch
}) {
  const filterFn = it => !search || it.title.toLowerCase().includes(search.toLowerCase()) || it.id.includes(search.toLowerCase());
  return /*#__PURE__*/React.createElement("aside", {
    className: "ds-sidebar",
    "aria-label": "Primary navigation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo",
    "aria-hidden": "true"
  }, "AG"), /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, "AG Design System"), /*#__PURE__*/React.createElement("div", {
    className: "ver"
  }, "v1.0")), NAV.map(sec => {
    const items = sec.items.filter(filterFn);
    if (items.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: sec.label,
      className: "nav-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, sec.label), items.map(it => /*#__PURE__*/React.createElement("div", {
      key: it.id,
      role: "link",
      tabIndex: 0,
      className: `nav-item ${active === it.id ? "active" : ""}`,
      onClick: () => onPick(it.id),
      onKeyDown: e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick(it.id);
        }
      },
      "aria-current": active === it.id ? "page" : undefined
    }, /*#__PURE__*/React.createElement(Ph, {
      name: it.icon,
      size: "16px"
    }), /*#__PURE__*/React.createElement("span", null, it.title))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      fontSize: 11,
      color: "var(--iron)",
      borderTop: "1px solid var(--border-default-color)"
    }
  }, "Mirrors ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "projects/foundation"), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-foundation"), ". Tokens stay 1:1 with ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "_variable.scss"), "."));
}

/* ----------------------------- Top bar ------------------------------------ */
function TopBar({
  section,
  current,
  theme,
  onToggleTheme,
  density,
  onDensity,
  search,
  onSearch
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "ds-topbar",
    role: "banner"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "fn-breadcrumb",
    "aria-label": "Breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    tabIndex: 0,
    role: "link",
    onClick: () => window.navigate?.("overview"),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "house",
    size: "13px"
  }), "AG DS"), /*#__PURE__*/React.createElement("span", {
    className: "sep",
    "aria-hidden": "true"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    tabIndex: 0,
    role: "link",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "folder-simple",
    size: "13px"
  }), section || "Foundations"), /*#__PURE__*/React.createElement("span", {
    className: "sep",
    "aria-hidden": "true"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "current",
    "aria-current": "page",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, current?.icon && /*#__PURE__*/React.createElement(Ph, {
    name: current.icon,
    size: "13px"
  }), current?.title || "")), /*#__PURE__*/React.createElement("div", {
    className: "right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-search",
    role: "search"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "magnifying-glass",
    size: "14px"
  }), /*#__PURE__*/React.createElement("input", {
    type: "search",
    placeholder: "Search components & tokens",
    value: search,
    onChange: e => onSearch(e.target.value),
    "aria-label": "Search"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2318K")), /*#__PURE__*/React.createElement("div", {
    className: "ds-toggle-group",
    role: "group",
    "aria-label": "Density"
  }, /*#__PURE__*/React.createElement("button", {
    className: density === "comfortable" ? "on" : "",
    onClick: () => onDensity("comfortable")
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "rows",
    size: "13px"
  }), " Comfortable"), /*#__PURE__*/React.createElement("button", {
    className: density === "default" ? "on" : "",
    onClick: () => onDensity("default")
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "list",
    size: "13px"
  }), " Default"), /*#__PURE__*/React.createElement("button", {
    className: density === "compact" ? "on" : "",
    onClick: () => onDensity("compact")
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "list-dashes",
    size: "13px"
  }), " Compact")), /*#__PURE__*/React.createElement("button", {
    className: "ds-iconbtn",
    onClick: onToggleTheme,
    "aria-label": "Toggle theme",
    title: "Toggle light / dark"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: theme === "dark" ? "sun" : "moon"
  })), /*#__PURE__*/React.createElement("a", {
    className: "ds-iconbtn",
    href: "Variations.html",
    "aria-label": "Open visual variations"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "layout"
  }), " Variations")));
}

/* ----------------------------- View router -------------------------------- */
function ViewRouter({
  id
}) {
  // Foundations
  if (id === "overview" || id === "principles") return /*#__PURE__*/React.createElement(ViewOverview, {
    id: id
  });
  if (id === "how-to-use") return /*#__PURE__*/React.createElement(ViewHowToUse, null);
  if (id === "connect") return /*#__PURE__*/React.createElement(ViewConnect, null);
  if (id === "colors") return /*#__PURE__*/React.createElement(ViewColors, null);
  if (id === "typography") return /*#__PURE__*/React.createElement(ViewTypography, null);
  if (id === "spacing") return /*#__PURE__*/React.createElement(ViewSpacing, null);
  if (id === "shadows") return /*#__PURE__*/React.createElement(ViewShadows, null);
  if (id === "icons") return /*#__PURE__*/React.createElement(ViewIcons, null);
  if (id === "motion") return /*#__PURE__*/React.createElement(ViewMotion, null);

  // Components — Forms
  if (id === "fn-button") return /*#__PURE__*/React.createElement(ViewButton, null);
  if (id === "fn-input") return /*#__PURE__*/React.createElement(ViewInput, null);
  if (id === "fn-select") return /*#__PURE__*/React.createElement(ViewSelect, null);
  if (id === "fn-switch") return /*#__PURE__*/React.createElement(ViewSwitch, null);
  if (id === "fn-checkbox") return /*#__PURE__*/React.createElement(ViewCheckbox, null);
  if (id === "fn-date") return /*#__PURE__*/React.createElement(ViewDate, null);
  if (id === "fn-time") return /*#__PURE__*/React.createElement(ViewTime, null);
  if (id === "fn-tel") return /*#__PURE__*/React.createElement(ViewTel, null);
  if (id === "fn-color-picker") return /*#__PURE__*/React.createElement(ViewColorPicker, null);
  if (id === "fn-files") return /*#__PURE__*/React.createElement(ViewFiles, null);
  if (id === "fn-text-editor") return /*#__PURE__*/React.createElement(ViewEditor, null);
  if (id === "fn-rating") return /*#__PURE__*/React.createElement(ViewRatingPage, null);

  // Components — Data
  if (id === "fn-table") return /*#__PURE__*/React.createElement(ViewTable, null);
  if (id === "fn-grid") return /*#__PURE__*/React.createElement(ViewGrid, null);
  if (id === "fn-pagination") return /*#__PURE__*/React.createElement(ViewPagination, null);
  if (id === "fn-chart") return /*#__PURE__*/React.createElement(ViewChart, null);

  // Components — Navigation
  if (id === "fn-breadcrumb") return /*#__PURE__*/React.createElement(ViewBreadcrumb, null);
  if (id === "fn-tabs") return /*#__PURE__*/React.createElement(ViewTabsPage, null);
  if (id === "fn-menu") return /*#__PURE__*/React.createElement(ViewMenu, null);
  if (id === "fn-accordion") return /*#__PURE__*/React.createElement(ViewAccordionPage, null);

  // Components — Feedback
  if (id === "fn-dialog") return /*#__PURE__*/React.createElement(ViewDialog, null);
  if (id === "fn-drawer") return /*#__PURE__*/React.createElement(ViewDrawerPage, null);
  if (id === "fn-toast") return /*#__PURE__*/React.createElement(ViewToastPage, null);
  if (id === "fn-loader") return /*#__PURE__*/React.createElement(ViewLoader, null);
  if (id === "fn-no-data") return /*#__PURE__*/React.createElement(ViewNoData, null);
  if (id === "fn-tag") return /*#__PURE__*/React.createElement(ViewTagPage, null);
  if (id === "fn-avatar") return /*#__PURE__*/React.createElement(ViewAvatarPage, null);
  if (id === "fn-float-btn") return /*#__PURE__*/React.createElement(ViewFloat, null);

  // HW
  if (id === "hw-header") return /*#__PURE__*/React.createElement(ViewHwHeader, null);
  if (id === "hw-auth") return /*#__PURE__*/React.createElement(ViewHwAuth, null);
  if (id === "hw-app-market") return /*#__PURE__*/React.createElement(ViewHwAppMarket, null);

  // Patterns
  if (id === "p-shell") return /*#__PURE__*/React.createElement(ViewPatternShell, null);
  if (id === "p-boilerplate") return /*#__PURE__*/React.createElement(ViewPatternBoilerplate, null);
  if (id === "p-dashboard") return /*#__PURE__*/React.createElement(ViewPatternDashboard, null);
  if (id === "p-list") return /*#__PURE__*/React.createElement(ViewPatternList, null);
  if (id === "p-form") return /*#__PURE__*/React.createElement(ViewPatternForm, null);
  if (id === "p-detail") return /*#__PURE__*/React.createElement(ViewPatternDetail, null);
  if (id === "p-auth") return /*#__PURE__*/React.createElement(ViewPatternAuth, null);
  if (id === "p-settings") return /*#__PURE__*/React.createElement(ViewPatternSettings, null);
  if (id === "p-empty") return /*#__PURE__*/React.createElement(ViewPatternEmpty, null);

  // Showcase
  if (id === "restaurant") return /*#__PURE__*/React.createElement(ViewRestaurant, null);
  if (id === "variations") return /*#__PURE__*/React.createElement(ViewVariationsCTA, null);

  // A11y
  if (id === "a11y") return /*#__PURE__*/React.createElement(ViewA11y, null);
  return /*#__PURE__*/React.createElement(ViewOverview, {
    id: "overview"
  });
}
function ViewVariationsCTA() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Showcase",
    title: "Visual variations",
    lead: "Open the side-by-side variations canvas \u2014 three directions exploring how the gallery itself could be themed without changing tokens."
  }), /*#__PURE__*/React.createElement("a", {
    href: "Variations.html",
    className: "ds-card",
    style: {
      display: "block",
      textDecoration: "none",
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Open variations canvas"), /*#__PURE__*/React.createElement("div", {
    className: "muted"
  }, "3 directions on an infinite canvas \xB7 drag-reorder \xB7 fullscreen focus")), /*#__PURE__*/React.createElement(Ph, {
    name: "arrow-square-out",
    size: "24px",
    style: {
      color: "var(--blue)"
    }
  }))));
}

/* ----------------------------- Overview ----------------------------------- */
function ViewOverview({
  id
}) {
  if (id === "principles") {
    return /*#__PURE__*/React.createElement("main", {
      className: "ds-main"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      eyebrow: "Get started",
      title: "Principles & rules",
      lead: "Hard constraints copied from your foundation reference doc. AI agents and engineers must follow these when generating pages."
    }), /*#__PURE__*/React.createElement("div", {
      className: "ds-card"
    }, /*#__PURE__*/React.createElement("ol", {
      style: {
        lineHeight: 1.8,
        paddingLeft: 18
      }
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Never import from source paths."), " Always import from ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "'foundation'"), " or ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "'hw-foundation'"), ". The tsconfig alias resolves these to ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "dist/"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Import the per-feature module"), ", not the whole library. Need a button \u2192 ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "FnButtonModule"), ". ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "FoundationModule"), " only provides cross-cutting services."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Prefix discipline."), " Components: ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "Fn*"), " / ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "Hw*"), ". Selectors: ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "fn-*"), " / ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "hw-*"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Colors come from tokens."), " ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "var(--blue)"), ", never ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "#005bc4"), ". To add a color, extend ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "_variable.scss"), " and ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "_color.scss"), " first."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Text goes through i18n."), " Every user-visible string is a key fed to the ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "fnTranslate"), " pipe or ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "FnI18nService"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Dates use the global prototype."), " ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "date.formatter(FN_DATE_FORMAT.XYZ)"), " from ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "fn-date-format.constant.ts"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "HTTP via ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "FnHttpService")), " (foundation) or ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "HwHttpService"), " (hw-foundation). The interceptor + error handler are wired on these."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Forms are reactive."), " ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "FormGroup"), " + ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "formControlName"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Tailwind is styling-only."), " ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "preflight"), " is disabled \u2014 base resets come from Bootstrap/Material."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Dark mode is a class on ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "<html>"), "."), " Token overrides only \u2014 no media queries."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Every routed page uses the ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, ".hw-box-content"), " boilerplate"), " \u2014 three regions: header / title-bar / content."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "VPAT/WCAG 2.1 AA."), " Labels associated; focus visible; ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "role"), "/", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "tabindex"), " only via ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "a11yClickable"), "/", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "a11yIconBtn"), "."))));
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "AG Design System",
    title: "One system. Two libraries. Every screen.",
    lead: "The reference for building Angular apps on top of foundation and hw-foundation. Every component below is keyboard-accessible, screen-reader-labeled, theme-aware, and i18n-ready."
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--blue)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "foundation"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Generic UI kit"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "Fn*"), " components and platform services. Selector prefix ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fn-*"), ". Imported per feature module."), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(FnTag, {
    color: "primary"
  }, "Buttons"), /*#__PURE__*/React.createElement(FnTag, {
    color: "primary"
  }, "Inputs"), /*#__PURE__*/React.createElement(FnTag, {
    color: "primary"
  }, "Table"), /*#__PURE__*/React.createElement(FnTag, {
    color: "primary"
  }, "Grid"), /*#__PURE__*/React.createElement(FnTag, {
    color: "primary"
  }, "Drawer"))), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "hw-foundation"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Branded shell"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, "HW-branded headers, auth, app market, chit-chat, employee, release notes. Selector prefix ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-*"), "."), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(FnTag, {
    color: "orange"
  }, "Header"), /*#__PURE__*/React.createElement(FnTag, {
    color: "orange"
  }, "Auth"), /*#__PURE__*/React.createElement(FnTag, {
    color: "orange"
  }, "Employee"))), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--green)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "VPAT-ready"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "WCAG 2.1 AA"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, "Every component ships with keyboard support, ARIA roles, focus rings, and the directives that resolved your existing axe findings."), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(FnTag, {
    color: "success"
  }, "a11yClickable"), /*#__PURE__*/React.createElement(FnTag, {
    color: "success"
  }, "a11yIconBtn")))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Tokens at a glance"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-6",
    style: {
      marginBottom: 16
    }
  }, ["blue", "cyan", "green", "orange", "yellow", "red"].map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    className: "swatch-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "color",
    style: {
      background: `var(--${c})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, c), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "var(--", c, ")"))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Build a page in 4 steps"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      lineHeight: 1.8,
      paddingLeft: 18,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("li", null, "Pick the ", /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate("p-boilerplate"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "page boilerplate"), " (header / title-bar / content)."), /*#__PURE__*/React.createElement("li", null, "Compose the body from ", /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate("fn-button"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "buttons"), ", ", /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate("fn-input"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "inputs"), ", ", /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate("fn-table"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "tables"), ", etc."), /*#__PURE__*/React.createElement("li", null, "Use only ", /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate("colors"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "tokens"), " \u2014 never raw hex."), /*#__PURE__*/React.createElement("li", null, "Import the per-feature ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "NgModule"), " shown on each component card."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Component coverage"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Count"), /*#__PURE__*/React.createElement("th", null, "Components"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Forms"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "11")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Button, Input, Select, Switch, Checkbox/Radio, Date pickers (4), Tel, Color, File upload, Editor, Rating")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Data"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "4")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Table, Editable grid, Pagination, Charts")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Navigation"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "4")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Breadcrumb, Tabs, Sidebar menu, Accordion")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Feedback"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "8")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Dialog, Drawer, Toast, Loader, No-data, Tag, Avatar, Float button")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "HW shell"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "9")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Header (main/site/profile/apps/weather/time-clock/franchise/unauth), Auth, App market")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Patterns"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "9")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "App shell, Boilerplate, Dashboard, List, Form, Detail, Auth, Settings, Empty/Loading"))))));
}

/* ----------------------------- App root ----------------------------------- */
function App() {
  const [active, setActive] = useState(() => location.hash.replace("#", "") || "overview");
  const [theme, setTheme] = useState(() => localStorage.getItem("ds-theme") || "light");
  const [density, setDensity] = useState(() => localStorage.getItem("ds-density") || "default");
  const [search, setSearch] = useState("");
  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("ds-theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("ds-density", density);
  }, [density]);
  useEffect(() => {
    function onHash() {
      setActive(location.hash.replace("#", "") || "overview");
      window.scrollTo({
        top: 0
      });
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  function navigate(id) {
    location.hash = id;
    setActive(id);
    window.scrollTo({
      top: 0
    });
  }
  // Expose for cross-component navigation links
  window.navigate = navigate;
  const {
    item,
    section
  } = findItem(active);

  // Cmd+K to focus search
  useEffect(() => {
    function key(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.querySelector('.ds-search input')?.focus();
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return /*#__PURE__*/React.createElement(ToastProvider, null, /*#__PURE__*/React.createElement("div", {
    className: `ds-shell density-${density}`
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: active,
    onPick: navigate,
    search: search,
    onSearch: setSearch
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    section: section,
    current: item,
    theme: theme,
    onToggleTheme: () => setTheme(t => t === "light" ? "dark" : "light"),
    density: density,
    onDensity: setDensity,
    search: search,
    onSearch: setSearch
  }), /*#__PURE__*/React.createElement(ViewRouter, {
    id: active
  }))), /*#__PURE__*/React.createElement(AgBot, null));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/app.jsx", error: String((e && e.message) || e) }); }

// src/primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================================
   AG Design System — primitives.jsx
   Reusable building blocks: hi-fi facsimiles of fn-* / hw-* Angular components,
   plus gallery helpers (Demo, A11yNote, PropTable, Code, SectionHead).
   ============================================================================ */
const {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  createContext,
  useContext,
  Fragment
} = React;

/* ----------------------------------------------------------------------------
   Ph — Phosphor icon via Iconify web component (ph: collection).
   weight maps to Phosphor variants: regular | bold | fill | duotone | light | thin.
---------------------------------------------------------------------------- */
function Ph({
  name,
  weight = "regular",
  size,
  style,
  className = "",
  ariaHidden = true,
  ...rest
}) {
  const base = name.replace(/^ph-/, "");
  const icon = `ph:${base}${weight && weight !== "regular" ? `-${weight}` : ""}`;
  return /*#__PURE__*/React.createElement("iconify-icon", _extends({
    icon: icon,
    class: className,
    style: {
      fontSize: size,
      lineHeight: 0,
      ...style
    },
    "aria-hidden": ariaHidden ? "true" : undefined
  }, rest));
}

/* ----------------------------------------------------------------------------
   FnIcon — wrap any icon (Phosphor or fn-global-*) — replicates <fn-icon>
---------------------------------------------------------------------------- */
function FnIcon({
  icon,
  lib = "ph",
  size = "16px",
  color,
  animation,
  className = "",
  style,
  ...rest
}) {
  // fn-global-* custom font glyphs stay as <i>; everything else uses Iconify Phosphor
  if (lib === "global" || icon.startsWith("fn-global-")) {
    return /*#__PURE__*/React.createElement("i", _extends({
      className: `${icon} ${className}`,
      style: {
        fontSize: size,
        color,
        ...style
      },
      "aria-hidden": "true"
    }, rest));
  }
  const base = icon.replace(/^ph-/, "");
  return /*#__PURE__*/React.createElement("iconify-icon", _extends({
    icon: `ph:${base}`,
    class: className,
    style: {
      fontSize: size,
      color,
      lineHeight: 0,
      ...style
    },
    "aria-hidden": "true"
  }, rest));
}

/* ----------------------------------------------------------------------------
   FnButton — facsimile of <fn-button> with type/shape/size/loading
---------------------------------------------------------------------------- */
function FnButton({
  type = "primary",
  text,
  children,
  shape,
  size,
  iconAddonBefore,
  iconAddonAfter,
  isLoading = false,
  textLoading = "Loading…",
  disabled = false,
  btnType = "button",
  ariaLabel,
  onClick,
  className = "",
  ...rest
}) {
  // The Angular component interpolates `btn-{type}` so the `type` prop can pack extra classes.
  // We support both forms here.
  const typeParts = type.trim().split(/\s+/);
  const colorOrVariant = typeParts[0];
  const extras = typeParts.slice(1).join(" ");
  const classes = ["btn", `btn-${colorOrVariant}`, extras, shape && `btn-${shape}`, size && `btn-${size}`, disabled && "disabled", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: btnType,
    className: classes,
    disabled: disabled || isLoading,
    onClick: onClick,
    "aria-label": ariaLabel || (typeof text === "string" ? text : undefined),
    "aria-busy": isLoading || undefined
  }, rest), isLoading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dot-spinner",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", null, textLoading)) : /*#__PURE__*/React.createElement(React.Fragment, null, iconAddonBefore && /*#__PURE__*/React.createElement(Ph, {
    name: iconAddonBefore.replace(/^ph-/, "")
  }), text || children, iconAddonAfter && /*#__PURE__*/React.createElement(Ph, {
    name: iconAddonAfter.replace(/^ph-/, "")
  })));
}

/* ----------------------------------------------------------------------------
   FnInput — facsimile of <fn-base-input>
---------------------------------------------------------------------------- */
function FnInput({
  id,
  name,
  type = "text",
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  isRequired = false,
  isInvalid = false,
  isValid = false,
  rounded = false,
  prefix,
  suffix,
  ariaDescribedBy,
  readOnly,
  className = "",
  ...rest
}) {
  const cls = ["fn-input", "form-control", rounded && "input-round", isInvalid && "is-invalid", isValid && "is-valid", className].filter(Boolean).join(" ");

  // A controlled value without onChange becomes read-only (silences React warning).
  const ro = readOnly ?? (value !== undefined && !onChange);
  if (prefix || suffix) {
    return /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, prefix && /*#__PURE__*/React.createElement("span", {
      className: "input-group-text"
    }, prefix), /*#__PURE__*/React.createElement("input", _extends({
      id: id,
      name: name,
      type: type,
      value: value,
      defaultValue: defaultValue,
      onChange: onChange,
      placeholder: placeholder,
      disabled: disabled,
      readOnly: ro,
      required: isRequired,
      "aria-invalid": isInvalid || undefined,
      "aria-required": isRequired || undefined,
      "aria-describedby": ariaDescribedBy,
      className: cls
    }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
      className: "input-group-text"
    }, suffix));
  }
  return /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    name: name,
    type: type,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    readOnly: ro,
    required: isRequired,
    "aria-invalid": isInvalid || undefined,
    "aria-required": isRequired || undefined,
    "aria-describedby": ariaDescribedBy,
    className: cls
  }, rest));
}

/* ----------------------------------------------------------------------------
   FnTextarea
---------------------------------------------------------------------------- */
function FnTextarea({
  rows = 4,
  isRequired,
  isInvalid,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    className: `form-control ${isInvalid ? "is-invalid" : ""}`,
    "aria-required": isRequired || undefined
  }, rest));
}

/* ----------------------------------------------------------------------------
   FormGroup — label + input + help/error (replicates .form-group)
---------------------------------------------------------------------------- */
function FormGroup({
  label,
  required,
  error,
  help,
  children,
  id
}) {
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    className: "fn-label"
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "fn-required",
    "aria-hidden": "true"
  }, "*")), React.Children.map(children, c => {
    if (!React.isValidElement(c)) return c;
    // Host (DOM) elements only accept valid attributes — don't leak isRequired/isInvalid.
    const isHost = typeof c.type === "string";
    return React.cloneElement(c, isHost ? {
      id,
      "aria-describedby": [helpId, errId].filter(Boolean).join(" ") || undefined
    } : {
      id,
      isRequired: required,
      isInvalid: !!error,
      "aria-describedby": [helpId, errId].filter(Boolean).join(" ") || undefined
    });
  }), help && !error && /*#__PURE__*/React.createElement("div", {
    id: helpId,
    className: "fn-help"
  }, help), error && /*#__PURE__*/React.createElement("div", {
    id: errId,
    className: "fn-error",
    role: "alert"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "warning-circle",
    size: "12px"
  }), error));
}

/* ----------------------------------------------------------------------------
   FnSelect — single + multi
---------------------------------------------------------------------------- */
function FnSelect({
  items = [],
  bindLabel = "name",
  bindValue = "id",
  value,
  onChange,
  placeholder = "Select…",
  multi = false,
  disabled = false,
  searchable = false,
  clearable = false,
  ariaLabel
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const selectedItems = multi ? items.filter(it => (value || []).includes(it[bindValue])) : items.find(it => it[bindValue] === value);
  const filtered = q ? items.filter(it => String(it[bindLabel]).toLowerCase().includes(q.toLowerCase())) : items;
  function pick(it) {
    if (multi) {
      const v = value || [];
      const next = v.includes(it[bindValue]) ? v.filter(x => x !== it[bindValue]) : [...v, it[bindValue]];
      onChange && onChange(next);
    } else {
      onChange && onChange(it[bindValue]);
      setOpen(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `fn-select ${multi ? "is-multi" : ""} ${open ? "is-open" : ""}`,
    ref: ref,
    role: "combobox",
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    "aria-disabled": disabled || undefined,
    "aria-label": ariaLabel,
    tabIndex: disabled ? -1 : 0,
    onClick: () => !disabled && setOpen(v => !v),
    onKeyDown: e => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
  }, !multi && (selectedItems ? /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, selectedItems[bindLabel]) : /*#__PURE__*/React.createElement("span", {
    className: "placeholder"
  }, placeholder)), multi && (selectedItems.length === 0 ? /*#__PURE__*/React.createElement("span", {
    className: "placeholder"
  }, placeholder) : /*#__PURE__*/React.createElement(React.Fragment, null, selectedItems.map(it => /*#__PURE__*/React.createElement("span", {
    key: it[bindValue],
    className: "chip"
  }, it[bindLabel], /*#__PURE__*/React.createElement("span", {
    className: "x",
    onClick: e => {
      e.stopPropagation();
      pick(it);
    },
    "aria-label": "Remove"
  }, "\xD7"))))), clearable && !multi && selectedItems && /*#__PURE__*/React.createElement("span", {
    className: "caret",
    onClick: e => {
      e.stopPropagation();
      onChange && onChange(null);
    },
    "aria-label": "Clear",
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "x",
    size: "12px"
  })), /*#__PURE__*/React.createElement("span", {
    className: "caret caret-main",
    style: {
      marginLeft: clearable && selectedItems ? 0 : "auto"
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 4.5L6 7.5L9 4.5",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), open && !disabled && /*#__PURE__*/React.createElement("div", {
    className: "fn-select-menu",
    role: "listbox"
  }, searchable && /*#__PURE__*/React.createElement("div", {
    className: "menu-search"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    autoFocus: true,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search\u2026",
    onClick: e => e.stopPropagation(),
    style: {
      height: 28
    },
    "aria-label": "Filter options"
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    role: "option",
    "aria-disabled": "true",
    className: "menu-empty"
  }, "No_Items_Found") : filtered.map(it => {
    const isSel = multi ? (value || []).includes(it[bindValue]) : value === it[bindValue];
    return /*#__PURE__*/React.createElement("div", {
      key: it[bindValue],
      role: "option",
      "aria-selected": isSel,
      className: `option ${isSel ? "selected" : ""}`,
      onClick: e => {
        e.stopPropagation();
        pick(it);
      }
    }, multi && /*#__PURE__*/React.createElement(FnCheckbox, {
      checked: isSel,
      readOnly: true
    }), /*#__PURE__*/React.createElement("span", null, it[bindLabel]));
  })));
}

/* ----------------------------------------------------------------------------
   FnTime — faithful port of foundation/src/lib/component/time/*
   - mode="single":   <fn-time-picker>           — 12-hour (default) or 24-hour, single value
   - mode="duration": <fn-duration-time-picker>  — 24-hour, no meridiem (durations like 00:15)
   - mode="range":    <fn-multi-time-picker>     — two-time string like "12:00a-2:00P"
---------------------------------------------------------------------------- */
function FnTime({
  mode = "single",
  value,
  onChange,
  step = 15,
  isMilitary = false,
  isNextDay = false,
  disabled,
  ariaLabel,
  placeholder
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value || "");
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef();
  const listRef = useRef();
  useEffect(() => setText(value || ""), [value]);
  const items = useMemo(() => {
    if (mode === "duration" || isMilitary) return buildTimeOptions("duration", step);
    if (mode === "range") return buildTimeOptions("single", step);
    return buildTimeOptions("single", step);
  }, [mode, step, isMilitary]);

  // Filter as user types (matches foundation's filterTime / filterValue)
  const filtered = useMemo(() => {
    if (!text || text === value) return items;
    const q = text.toLowerCase().replace(/\s/g, "");
    const match = items.filter(it => it.toLowerCase().startsWith(q));
    return match.length ? match : items;
  }, [text, items, value]);
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  useEffect(() => {
    if (!open || !listRef.current) return;
    const sel = listRef.current.querySelector(".active");
    if (sel) sel.scrollIntoView({
      block: "nearest"
    });
  }, [open]);
  function pick(v) {
    onChange && onChange(v);
    setText(v);
    setOpen(false);
  }
  function onKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
      setOpen(true);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
      setOpen(true);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIdx]) pick(filtered[activeIdx]);
    }
    if (e.key === "Tab") {
      setOpen(false);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `fn-time-picker-search ${mode === "range" ? "is-multi" : ""}`,
    ref: ref
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    value: text,
    onChange: e => {
      setText(e.target.value);
      setActiveIdx(0);
      if (!open) setOpen(true);
    },
    onClick: () => !disabled && setOpen(true),
    onKeyDown: onKey,
    disabled: disabled,
    maxLength: 17,
    "aria-label": ariaLabel,
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    placeholder: placeholder || (mode === "duration" ? "00:00" : mode === "range" ? "12:00a-2:00p" : "12:00a")
  }), isNextDay && /*#__PURE__*/React.createElement("span", {
    className: "mextDay",
    "aria-label": "Next day"
  }, /*#__PURE__*/React.createElement("span", null, "+1"), /*#__PURE__*/React.createElement("span", null, "Day")), mode !== "range" && /*#__PURE__*/React.createElement("i", {
    className: `fn-global-dropdownArrow ${open ? "fn-open-dropdown" : ""}`,
    onClick: () => !disabled && setOpen(v => !v),
    role: "button",
    "aria-label": open ? "Close" : "Open"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "6",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  }))), open && !disabled && filtered.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "fn-time-picker-ul",
    role: "listbox",
    ref: listRef
  }, filtered.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: it,
    role: "option",
    "aria-selected": it === value,
    className: i === activeIdx ? "active" : "",
    onMouseEnter: () => setActiveIdx(i),
    onMouseDown: e => {
      e.preventDefault();
      pick(it);
    }
  }, it))));
}
function buildTimeOptions(mode, step) {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      if (mode === "duration") {
        out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      } else {
        const mer = h < 12 ? "a" : "p";
        const hh = (h + 11) % 12 + 1;
        out.push(`${hh}:${String(m).padStart(2, "0")}${mer}`);
      }
    }
  }
  return out;
}

/* ----------------------------------------------------------------------------
   FnDatePicker — single-date picker. Faithful port of <fn-date-picker>.
   btn-group with prev / center (calendar + date + drop caret) / next buttons,
   plus a popup calendar replica of the Material datepicker.
---------------------------------------------------------------------------- */
function FnDatePicker({
  value,
  onChange,
  hideNextPrev = false,
  disabled = false,
  format = "D/M/YYYY",
  ariaLabel
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value || new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date((value || new Date()).getFullYear(), (value || new Date()).getMonth(), 1));
  const ref = useRef();
  useEffect(() => {
    if (value) {
      setDate(value);
      setViewMonth(new Date(value.getFullYear(), value.getMonth(), 1));
    }
  }, [value]);
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  function step(delta) {
    if (disabled) return;
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    onChange && onChange(d);
  }
  function pick(d) {
    setDate(d);
    onChange && onChange(d);
    setOpen(false);
  }
  function fmt(d) {
    const dd = d.getDate(),
      mm = d.getMonth() + 1,
      yyyy = d.getFullYear();
    if (format === "YYYY/MM/DD") return `${yyyy}/${String(mm).padStart(2, '0')}/${String(dd).padStart(2, '0')}`;
    return `${dd}/${mm}/${yyyy}`;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "single-date-picker",
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-group btn-group-round",
    role: "group",
    "aria-label": ariaLabel || "Date picker"
  }, !hideNextPrev && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary dp-prev",
    onClick: () => step(-1),
    disabled: disabled,
    "aria-label": "Previous date"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 4L6 8L10 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary dp-center",
    onClick: () => !disabled && setOpen(v => !v),
    disabled: disabled,
    "aria-haspopup": "dialog",
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 16 16",
    fill: "none",
    className: "dp-cal-icon"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "3",
    width: "12",
    height: "11",
    rx: "1.5",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 1.5V4M11 1.5V4M2 7H14",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dp-date"
  }, fmt(date)), /*#__PURE__*/React.createElement("span", {
    className: "dp-drop",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "5",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  })))), !hideNextPrev && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary dp-next",
    onClick: () => step(1),
    disabled: disabled,
    "aria-label": "Next date"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 4L10 8L6 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), open && !disabled && /*#__PURE__*/React.createElement(CalendarPopup, {
    viewMonth: viewMonth,
    setViewMonth: setViewMonth,
    selected: date,
    onPick: pick
  }));
}
function CalendarPopup({
  viewMonth,
  setViewMonth,
  selected,
  onPick
}) {
  const y = viewMonth.getFullYear(),
    m = viewMonth.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const weeks = [];
  let cur = 1 - firstDay;
  for (let r = 0; r < 6; r++) {
    const w = [];
    for (let c = 0; c < 7; c++) {
      const dnum = cur++;
      w.push(dnum >= 1 && dnum <= lastDate ? dnum : null);
    }
    weeks.push(w);
  }
  const monthName = viewMonth.toLocaleString("en-US", {
    month: "long"
  }).toUpperCase();
  const today = new Date();
  return /*#__PURE__*/React.createElement("div", {
    className: "dp-popup",
    role: "dialog",
    "aria-label": "Choose date"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dp-controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dp-period"
  }, monthName, " ", y, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "6",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dp-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Previous month",
    onClick: () => setViewMonth(new Date(y, m - 1, 1))
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 4L6 8L10 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Next month",
    onClick: () => setViewMonth(new Date(y, m + 1, 1))
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 4L10 8L6 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))))), /*#__PURE__*/React.createElement("table", {
    role: "grid"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["S", "M", "T", "W", "T", "F", "S"].map((d, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    scope: "col"
  }, d)))), /*#__PURE__*/React.createElement("tbody", null, weeks.map((w, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, w.map((d, j) => {
    if (!d) return /*#__PURE__*/React.createElement("td", {
      key: j
    });
    const isSel = selected && d === selected.getDate() && m === selected.getMonth() && y === selected.getFullYear();
    const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    return /*#__PURE__*/React.createElement("td", {
      key: j
    }, /*#__PURE__*/React.createElement("span", {
      className: `dp-day ${isSel ? "selected" : ""} ${isToday && !isSel ? "today" : ""}`,
      role: "gridcell",
      "aria-selected": isSel || undefined,
      onClick: () => onPick(new Date(y, m, d))
    }, d));
  }))))));
}

/* ----------------------------------------------------------------------------
   FnDateRangePicker — pill input + dual-month inline calendar + Cancel/Apply
---------------------------------------------------------------------------- */
function FnDateRangePicker({
  value,
  onChange,
  disabled = false,
  ariaLabel
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(value?.from || null);
  const [to, setTo] = useState(value?.to || null);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [leftMonth, setLeftMonth] = useState(() => {
    const base = from || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const ref = useRef();
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  function fmt(d) {
    if (!d) return "";
    const yyyy = d.getFullYear(),
      mm = String(d.getMonth() + 1).padStart(2, "0"),
      dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  }
  const valueStr = from && to ? `${fmt(from)} - ${fmt(to)}` : "";
  function pickDay(d) {
    if (!draftFrom || draftFrom && draftTo) {
      setDraftFrom(d);
      setDraftTo(null);
    } else if (d < draftFrom) {
      setDraftFrom(d);
      setDraftTo(draftFrom);
    } else {
      setDraftTo(d);
    }
  }
  function apply() {
    if (draftFrom && draftTo) {
      setFrom(draftFrom);
      setTo(draftTo);
      onChange && onChange({
        from: draftFrom,
        to: draftTo
      });
    }
    setOpen(false);
  }
  function cancel() {
    setDraftFrom(from);
    setDraftTo(to);
    setOpen(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `date-range-picker-input ${open ? "is-open" : ""}`,
    ref: ref
  }, /*#__PURE__*/React.createElement("span", {
    className: "drp-cal-prefix",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "3",
    width: "12",
    height: "11",
    rx: "1.5",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 1.5V4M11 1.5V4M2 7H14",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("input", {
    className: "form-control input-round",
    value: valueStr,
    readOnly: true,
    onClick: () => !disabled && setOpen(true),
    disabled: disabled,
    "aria-label": ariaLabel || "Date range",
    placeholder: "YYYY/MM/DD - YYYY/MM/DD"
  }), /*#__PURE__*/React.createElement("span", {
    className: "drp-drop",
    "aria-hidden": "true",
    onClick: () => !disabled && setOpen(v => !v)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "5",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "drp-popup",
    role: "dialog",
    "aria-label": "Choose date range"
  }, /*#__PURE__*/React.createElement("div", {
    className: "drp-months"
  }, /*#__PURE__*/React.createElement(DRMonth, {
    which: "left",
    month: leftMonth,
    setMonth: setLeftMonth,
    from: draftFrom,
    to: draftTo,
    pick: pickDay
  }), /*#__PURE__*/React.createElement(DRMonth, {
    which: "right",
    month: new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1),
    setMonth: d => setLeftMonth(new Date(d.getFullYear(), d.getMonth() - 1, 1)),
    from: draftFrom,
    to: draftTo,
    pick: pickDay
  })), /*#__PURE__*/React.createElement("div", {
    className: "drp-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger btn-xs btn-round",
    style: {
      width: 96
    },
    onClick: cancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-success btn-xs btn-round",
    style: {
      width: 96
    },
    onClick: apply
  }, "Apply"))));
}
function DRMonth({
  which,
  month,
  setMonth,
  from,
  to,
  pick
}) {
  const y = month.getFullYear(),
    m = month.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const offset = (firstDay + 6) % 7; // Monday-start
  const lastDate = new Date(y, m + 1, 0).getDate();
  const weeks = [];
  let cur = 1 - offset;
  for (let r = 0; r < 6; r++) {
    const w = [];
    for (let c = 0; c < 7; c++) {
      const dnum = cur++;
      w.push(dnum >= 1 && dnum <= lastDate ? dnum : null);
    }
    weeks.push(w);
  }
  const monthName = month.toLocaleString("en-US", {
    month: "long"
  }).toUpperCase();
  function classFor(d) {
    if (!d) return "";
    const date = new Date(y, m, d);
    const eqFrom = from && date.getTime() === from.getTime();
    const eqTo = to && date.getTime() === to.getTime();
    if (eqFrom) return "range-start";
    if (eqTo) return "range-end";
    return "";
  }
  function inRange(d) {
    if (!d || !from || !to) return false;
    const date = new Date(y, m, d);
    return date > from && date < to;
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "drp-month-name",
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, which === "left" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Previous month",
    style: {
      background: "transparent",
      border: 0,
      cursor: "pointer",
      color: "var(--theme)"
    },
    onClick: () => setMonth(new Date(y, m - 1, 1))
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 4L6 8L10 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center"
    }
  }, monthName, " ", y), which === "right" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Next month",
    style: {
      background: "transparent",
      border: 0,
      cursor: "pointer",
      color: "var(--theme)"
    },
    onClick: () => setMonth(new Date(y, m + 1, 1))
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 4L10 8L6 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("table", {
    role: "grid"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    scope: "col"
  }, d)))), /*#__PURE__*/React.createElement("tbody", null, weeks.map((w, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, w.map((d, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    className: inRange(d) ? "in-range" : ""
  }, d && /*#__PURE__*/React.createElement("span", {
    className: `drp-day ${classFor(d)}`,
    role: "gridcell",
    "aria-selected": !!classFor(d) || undefined,
    onClick: () => pick(new Date(y, m, d))
  }, d))))))));
}

/* ----------------------------------------------------------------------------
   FnPrimeTable — port of <ag-prime-table>. Supports:
   - per-column: frozen (left/right), sortable, filterable, custom cell renderer
   - sticky header + sticky pagination footer
   - scrollable body via the `scrollable` prop (matches pTableScrollable)
   - per-column 3-dot menu (Sort ASC/DESC · Filter · Hide · Manage · Clear)
---------------------------------------------------------------------------- */
function FnPrimeTable({
  columns = [],
  data = [],
  uniqueKey = "id",
  scrollable = false,
  scrollHeight = 480,
  pageSize: pageSizeProp = 15,
  pageSizeOptions = [10, 15, 20, 30],
  showPaginator = true,
  empty = "No data to display.",
  caption,
  // ReactNode rendered above the table — title + filter + add row
  search = false,
  // true to show a built-in search input above the table
  onSearch
}) {
  const [sort, setSort] = useState({
    field: null,
    dir: 0
  });
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeProp);
  const [globalQ, setGlobalQ] = useState("");
  const [menuFor, setMenuFor] = useState(null); // { field, x, y }
  const [filterFor, setFilterFor] = useState(null);
  const wrapRef = useRef();
  useEffect(() => {
    function onDown(e) {
      if (!wrapRef.current?.contains(e.target)) {
        setMenuFor(null);
        setFilterFor(null);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Apply filters + sort + global search
  const filtered = useMemo(() => {
    let rows = data;
    for (const [field, q] of Object.entries(filters)) {
      if (!q) continue;
      rows = rows.filter(r => String(r[field] ?? "").toLowerCase().includes(String(q).toLowerCase()));
    }
    if (globalQ) {
      const q = globalQ.toLowerCase();
      rows = rows.filter(r => Object.values(r).some(v => String(v ?? "").toLowerCase().includes(q)));
    }
    if (sort.field && sort.dir !== 0) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.field],
          bv = b[sort.field];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number") return sort.dir * (av - bv);
        return sort.dir * String(av).localeCompare(String(bv));
      });
    }
    return rows;
  }, [data, filters, sort, globalQ]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = showPaginator ? filtered.slice(start, start + pageSize) : filtered;
  function toggleSort(field) {
    setSort(s => {
      if (s.field !== field) return {
        field,
        dir: 1
      };
      if (s.dir === 1) return {
        field,
        dir: -1
      };
      return {
        field: null,
        dir: 0
      };
    });
  }
  function openMenu(e, field) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    setFilterFor(null);
    setMenuFor({
      field,
      x: rect.right - wrapRect.left - 180,
      y: rect.bottom - wrapRect.top + 4
    });
  }
  function openFilter(field) {
    const headerEl = wrapRef.current?.querySelector(`[data-col-field="${field}"]`);
    const rect = headerEl.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    setFilterFor({
      field,
      x: rect.left - wrapRect.left,
      y: rect.bottom - wrapRect.top + 4
    });
    setMenuFor(null);
  }
  function paginate(p) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `pt-wrap ${scrollable ? "is-scrollable" : ""}`,
    ref: wrapRef
  }, caption, search && /*#__PURE__*/React.createElement("div", {
    className: "pt-search-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-search"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "7",
    r: "5",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 11l3 3",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    type: "search",
    placeholder: "Search keyword",
    value: globalQ,
    onChange: e => {
      setGlobalQ(e.target.value);
      onSearch?.(e.target.value);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-scroll",
    style: scrollable ? {
      maxHeight: scrollHeight
    } : undefined
  }, /*#__PURE__*/React.createElement("table", {
    className: "pt-table",
    role: "grid"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => {
    const sorted = sort.field === c.field;
    const alignClass = c.align === "center" ? "center" : c.align === "right" ? "right" : "";
    const frozenClass = c.frozen === "left" ? "frozen-left" : c.frozen === "right" ? "frozen-right" : "";
    return /*#__PURE__*/React.createElement("th", {
      key: c.field,
      "data-col-field": c.field,
      className: `${alignClass} ${frozenClass} ${sorted ? "sorted" : ""} ${menuFor?.field === c.field ? "col-menu-active" : ""}`,
      style: {
        minWidth: c.minWidth || 150,
        width: c.width
      },
      scope: "col",
      "aria-sort": sorted ? sort.dir === 1 ? "ascending" : "descending" : "none"
    }, /*#__PURE__*/React.createElement("span", {
      className: "th-inner",
      onClick: () => c.sortable !== false && toggleSort(c.field),
      role: c.sortable !== false ? "button" : undefined,
      tabIndex: c.sortable !== false ? 0 : -1,
      style: {
        cursor: c.sortable !== false ? "pointer" : "default"
      }
    }, c.header, c.sortable !== false && /*#__PURE__*/React.createElement("span", {
      className: "sort-icon",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "6",
      viewBox: "0 0 10 6",
      fill: "currentColor",
      style: {
        opacity: sorted && sort.dir === 1 ? 1 : .55
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 0L0 6H10L5 0Z"
    })), /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "6",
      viewBox: "0 0 10 6",
      fill: "currentColor",
      style: {
        opacity: sorted && sort.dir === -1 ? 1 : .55
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 6L0 0H10L5 6Z"
    })))), (c.sortable !== false || c.filterable !== false) && /*#__PURE__*/React.createElement("button", {
      className: "col-menu-btn",
      onClick: e => openMenu(e, c.field),
      "aria-label": `Column options for ${c.header}`
    }, /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "3",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "8",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "13",
      r: "1.5"
    }))));
  }))), /*#__PURE__*/React.createElement("tbody", null, paged.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    className: "pt-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "msg"
  }, empty))) : paged.map(row => /*#__PURE__*/React.createElement("tr", {
    key: row[uniqueKey]
  }, columns.map(c => {
    const alignClass = c.align === "center" ? "center" : c.align === "right" ? "right" : "";
    const frozenClass = c.frozen === "left" ? "frozen-left" : c.frozen === "right" ? "frozen-right" : "";
    return /*#__PURE__*/React.createElement("td", {
      key: c.field,
      className: `${alignClass} ${frozenClass}`
    }, c.render ? c.render(row) : c.type === "boolean" ? row[c.field] ? "Yes" : "No" : c.type === "currency" ? `$${Number(row[c.field] || 0).toLocaleString()}` : row[c.field]);
  })))))), menuFor && /*#__PURE__*/React.createElement("div", {
    className: "pt-colmenu",
    style: {
      left: menuFor.x,
      top: menuFor.y
    },
    role: "menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-item",
    role: "menuitem",
    onClick: () => {
      setSort({
        field: menuFor.field,
        dir: 1
      });
      setMenuFor(null);
    }
  }, /*#__PURE__*/React.createElement(PtIcon, {
    name: "sort-asc"
  }), /*#__PURE__*/React.createElement("span", null, "Sort by ASC")), /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-item",
    role: "menuitem",
    onClick: () => {
      setSort({
        field: menuFor.field,
        dir: -1
      });
      setMenuFor(null);
    }
  }, /*#__PURE__*/React.createElement(PtIcon, {
    name: "sort-desc"
  }), /*#__PURE__*/React.createElement("span", null, "Sort by DESC")), /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-separator"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-item",
    role: "menuitem",
    onClick: () => openFilter(menuFor.field)
  }, /*#__PURE__*/React.createElement(PtIcon, {
    name: "filter"
  }), /*#__PURE__*/React.createElement("span", null, "Filter")), /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-separator"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-item",
    role: "menuitem"
  }, /*#__PURE__*/React.createElement(PtIcon, {
    name: "eye-slash"
  }), /*#__PURE__*/React.createElement("span", null, "Hide column")), /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-item",
    role: "menuitem"
  }, /*#__PURE__*/React.createElement(PtIcon, {
    name: "table"
  }), /*#__PURE__*/React.createElement("span", null, "Manage columns")), filters[menuFor.field] && /*#__PURE__*/React.createElement("div", {
    className: "ag-col-menu-item",
    role: "menuitem",
    style: {
      color: "var(--red)"
    },
    onClick: () => {
      setFilters(f => ({
        ...f,
        [menuFor.field]: ""
      }));
      setMenuFor(null);
    }
  }, /*#__PURE__*/React.createElement(PtIcon, {
    name: "x-circle"
  }), /*#__PURE__*/React.createElement("span", null, "Clear filter"))), filterFor && /*#__PURE__*/React.createElement("div", {
    className: "pt-filter-overlay",
    style: {
      left: filterFor.x,
      top: filterFor.y
    }
  }, /*#__PURE__*/React.createElement("select", {
    defaultValue: "contains"
  }, /*#__PURE__*/React.createElement("option", {
    value: "contains"
  }, "Contains"), /*#__PURE__*/React.createElement("option", {
    value: "startsWith"
  }, "Starts with"), /*#__PURE__*/React.createElement("option", {
    value: "endsWith"
  }, "Ends with"), /*#__PURE__*/React.createElement("option", {
    value: "equals"
  }, "Equals")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search",
    autoFocus: true,
    value: filters[filterFor.field] || "",
    onChange: e => setFilters(f => ({
      ...f,
      [filterFor.field]: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary btn-xs",
    style: {
      flex: 1
    },
    onClick: () => {
      setFilters(f => ({
        ...f,
        [filterFor.field]: ""
      }));
      setFilterFor(null);
    }
  }, "Clear"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-xs",
    style: {
      flex: 1
    },
    onClick: () => setFilterFor(null)
  }, "Apply"))), showPaginator && /*#__PURE__*/React.createElement("div", {
    className: "pt-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-pager",
    role: "group",
    "aria-label": "Pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => paginate(1),
    disabled: safePage <= 1,
    "aria-label": "First page"
  }, "\xAB"), /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => paginate(safePage - 1),
    disabled: safePage <= 1,
    "aria-label": "Previous page"
  }, "\u2039"), pagerNumbers(safePage, totalPages).map((p, i) => p === "…" ? /*#__PURE__*/React.createElement("span", {
    key: `e-${i}`,
    className: "pp",
    "aria-hidden": "true"
  }, "\u2026") : /*#__PURE__*/React.createElement("button", {
    key: p,
    className: `pp ${p === safePage ? "active" : ""}`,
    onClick: () => paginate(p),
    "aria-current": p === safePage ? "page" : undefined
  }, p)), /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => paginate(safePage + 1),
    disabled: safePage >= totalPages,
    "aria-label": "Next page"
  }, "\u203A"), /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => paginate(totalPages),
    disabled: safePage >= totalPages,
    "aria-label": "Last page"
  }, "\xBB")), /*#__PURE__*/React.createElement("div", {
    className: "pt-pagesize"
  }, /*#__PURE__*/React.createElement("select", {
    value: pageSize,
    onChange: e => {
      setPageSize(+e.target.value);
      setPage(1);
    },
    "aria-label": "Rows per page"
  }, pageSizeOptions.map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n))), /*#__PURE__*/React.createElement("span", {
    className: "ps-caret",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "6",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  }))))));
}
function pagerNumbers(cur, total) {
  if (total <= 7) return Array.from({
    length: total
  }, (_, i) => i + 1);
  if (cur <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (cur >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", cur - 1, cur, cur + 1, "…", total];
}
function PtIcon({
  name
}) {
  const map = {
    "sort-asc": /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12V4M4 4L7 7M4 4L1 7M9 5h6M9 9h4M9 13h2",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })),
    "sort-desc": /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 4V12M4 12L7 9M4 12L1 9M9 5h2M9 9h4M9 13h6",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })),
    "filter": /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 3h12l-4.5 6v4l-3 1.5V9L2 3z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    })),
    "eye-slash": /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 8s2-5 6-5 6 5 6 5-2 5-6 5-6-5-6-5z M2 2l12 12",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round"
    })),
    "table": /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "3",
      width: "12",
      height: "10",
      rx: "1",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 7H14M6 3v10",
      stroke: "currentColor",
      strokeWidth: "1.5"
    })),
    "x-circle": /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "8",
      r: "6",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 5l6 6M11 5l-6 6",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }))
  };
  return map[name] || null;
}

/* Square-pencil edit icon used inside .pt-edit-btn */
function PtEditIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "12",
    height: "12",
    rx: "1.5",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 5.5L12 7M9 6.5L6 9.5L5.5 11.5L7.5 11L10.5 8L9 6.5Z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }));
}

/* ----------------------------------------------------------------------------
   FnSwitch
---------------------------------------------------------------------------- */
function FnSwitch({
  checked = false,
  onChange,
  size = "md",
  disabled = false,
  ariaLabel,
  ariaLabelledBy
}) {
  return /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": checked,
    "aria-disabled": disabled || undefined,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    tabIndex: disabled ? -1 : 0,
    className: `fn-switch ${checked ? "on" : ""} size-${size}`,
    onClick: () => !disabled && onChange && onChange(!checked),
    onKeyDown: e => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        onChange && onChange(!checked);
      }
    }
  });
}

/* ----------------------------------------------------------------------------
   FnMenuSidebar — port of <fn-menu-sidebar>
   Two display modes (controlled by `mode`):
     - 'auto' (default): 50px collapsed; expands to 240px on hover
     - 'expanded': always 240px
     - 'collapsed': always 50px
   Each item: { id, label, icon, badge, children? }
   The icon prop accepts either a Phosphor name OR a CSS class string starting
   with 'fn-global-' / 'ag-icon-' (mirrors the foundation behavior).
---------------------------------------------------------------------------- */
function FnMenuSidebar({
  items = [],
  active,
  onPick,
  mode = "auto"
}) {
  const [expandedIds, setExpandedIds] = useState([]);
  function isExpanded(id) {
    return expandedIds.includes(id);
  }
  function toggle(id) {
    setExpandedIds(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);
  }
  const cls = ["fn-menu-sidebar", mode === "expanded" ? "is-static-expanded" : "", mode === "collapsed" ? "" : ""].filter(Boolean).join(" ");
  function renderItem(it, depth = 0) {
    const has = it.children && it.children.length > 0;
    const open = isExpanded(it.id);
    const isActive = active === it.id;
    return /*#__PURE__*/React.createElement(Fragment, {
      key: it.id
    }, /*#__PURE__*/React.createElement("li", {
      className: `menu-item ${isActive ? "active" : ""} ${has ? "has-children" : ""} ${open ? "expanded" : ""}`,
      role: "link",
      tabIndex: 0,
      onClick: () => {
        if (has) toggle(it.id);else onPick?.(it.id);
      },
      onKeyDown: e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (has) toggle(it.id);else onPick?.(it.id);
        }
      },
      "aria-current": isActive ? "page" : undefined,
      "aria-expanded": has ? open : undefined
    }, /*#__PURE__*/React.createElement("span", {
      className: "menu-icon",
      "aria-hidden": "true"
    }, it.icon?.startsWith?.("fn-global-") || it.icon?.startsWith?.("ag-icon-") ? /*#__PURE__*/React.createElement("i", {
      className: it.icon
    }) : /*#__PURE__*/React.createElement(Ph, {
      name: it.icon || "circle",
      size: "20px"
    })), /*#__PURE__*/React.createElement("span", {
      className: "menu-label"
    }, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
      className: "badge"
    }, it.badge)), has && /*#__PURE__*/React.createElement("ul", {
      className: "menu-sub"
    }, it.children.map(c => renderItem(c, depth + 1))));
  }
  return /*#__PURE__*/React.createElement("aside", {
    className: cls,
    role: "navigation",
    "aria-label": "Sidebar menu"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "menu-nav"
  }, items.map(it => renderItem(it))));
}

/* ----------------------------------------------------------------------------
   FnCheckbox / FnRadio
---------------------------------------------------------------------------- */
function FnCheckbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  readOnly,
  id
}) {
  function toggle() {
    if (!disabled && !readOnly) onChange && onChange(!checked);
  }
  return /*#__PURE__*/React.createElement("label", {
    className: `fn-checkbox ${checked ? "on" : ""}`,
    style: {
      opacity: disabled ? .5 : 1,
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: id,
    checked: checked,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "box",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 8l3.5 3.5L13 5",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
function FnRadio({
  checked = false,
  onChange,
  label,
  disabled = false,
  name,
  value
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: `fn-radio ${checked ? "on" : ""}`,
    style: {
      opacity: disabled ? .5 : 1,
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    style: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    "aria-hidden": "true"
  }), label && /*#__PURE__*/React.createElement("span", null, label));
}
function FnRadioGroup({
  options,
  value,
  onChange,
  name,
  vertical = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      gap: vertical ? 10 : 16,
      flexWrap: "wrap"
    }
  }, options.map(o => /*#__PURE__*/React.createElement(FnRadio, {
    key: o.id,
    name: name,
    value: o.id,
    label: o.label,
    checked: value === o.id,
    onChange: onChange,
    disabled: o.disabled
  })));
}

/* ----------------------------------------------------------------------------
   FnTag — pill chip
---------------------------------------------------------------------------- */
function FnTag({
  children,
  color = "primary",
  removable,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `fn-tag bubble-${color}`
  }, children, removable && /*#__PURE__*/React.createElement("span", {
    className: "x",
    onClick: onRemove,
    role: "button",
    "aria-label": "Remove",
    tabIndex: 0
  }, "\xD7"));
}

/* ----------------------------------------------------------------------------
   FnAvatar — initials avatar
---------------------------------------------------------------------------- */
function FnAvatar({
  name = "",
  size = "md",
  color,
  alt
}) {
  const initials = name.split(/\s+/).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  // deterministic color from name
  const palette = ["var(--blue)", "var(--orange)", "var(--green)", "var(--cyan)", "var(--purple)", "var(--iron)"];
  let h = 0;
  for (const c of name) h = h * 31 + c.charCodeAt(0) >>> 0;
  const bg = color || palette[h % palette.length];
  return /*#__PURE__*/React.createElement("span", {
    className: `fn-avtar size-${size}`,
    style: {
      background: bg
    },
    role: "img",
    "aria-label": alt || name
  }, initials || "?");
}
function FnAvatarStack({
  names = [],
  max = 4,
  size = "md"
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return /*#__PURE__*/React.createElement("span", {
    className: "fn-avtar-stack"
  }, shown.map((n, i) => /*#__PURE__*/React.createElement(FnAvatar, {
    key: n + i,
    name: n,
    size: size
  })), extra > 0 && /*#__PURE__*/React.createElement("span", {
    className: `fn-avtar size-${size}`,
    style: {
      background: "var(--secondaryDark)"
    }
  }, "+", extra));
}

/* ----------------------------------------------------------------------------
   FnPagination — standalone, identical to the prime-table footer pager
---------------------------------------------------------------------------- */
function FnPagination({
  currentPage = 1,
  totalPage = 1,
  onChange,
  pageSize,
  pageSizeOptions = [10, 15, 20, 30],
  onPageSizeChange,
  showPageSize = true
}) {
  function go(p) {
    onChange?.(Math.max(1, Math.min(p, totalPage)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-footer",
    style: {
      position: "relative",
      borderTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-pager",
    role: "group",
    "aria-label": "Pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => go(1),
    disabled: currentPage <= 1,
    "aria-label": "First page"
  }, "\xAB"), /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => go(currentPage - 1),
    disabled: currentPage <= 1,
    "aria-label": "Previous page"
  }, "\u2039"), pagerNumbers(currentPage, totalPage).map((p, i) => p === "…" ? /*#__PURE__*/React.createElement("span", {
    key: `e-${i}`,
    className: "pp",
    "aria-hidden": "true"
  }, "\u2026") : /*#__PURE__*/React.createElement("button", {
    key: p,
    className: `pp ${p === currentPage ? "active" : ""}`,
    onClick: () => go(p),
    "aria-current": p === currentPage ? "page" : undefined
  }, p)), /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => go(currentPage + 1),
    disabled: currentPage >= totalPage,
    "aria-label": "Next page"
  }, "\u203A"), /*#__PURE__*/React.createElement("button", {
    className: "pp",
    onClick: () => go(totalPage),
    disabled: currentPage >= totalPage,
    "aria-label": "Last page"
  }, "\xBB")), showPageSize && pageSize != null && /*#__PURE__*/React.createElement("div", {
    className: "pt-pagesize"
  }, /*#__PURE__*/React.createElement("select", {
    value: pageSize,
    onChange: e => onPageSizeChange?.(+e.target.value),
    "aria-label": "Rows per page"
  }, pageSizeOptions.map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n))), /*#__PURE__*/React.createElement("span", {
    className: "ps-caret",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "6",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  })))));
}

/* ----------------------------------------------------------------------------
   FnBreadcrumb
---------------------------------------------------------------------------- */
function FnBreadcrumb({
  items = []
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "fn-breadcrumb",
    "aria-label": "Breadcrumb"
  }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(Fragment, {
      key: i
    }, last ? /*#__PURE__*/React.createElement("span", {
      className: "current",
      "aria-current": "page"
    }, it.label) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      tabIndex: 0,
      role: "link",
      onClick: it.onClick
    }, it.label), /*#__PURE__*/React.createElement("span", {
      className: "sep",
      "aria-hidden": "true"
    }, "/")));
  }));
}

/* ----------------------------------------------------------------------------
   FnTabs — port of <fn-tab>. Two layouts:
     - horizontal: pill-shaped tab row above the content panel
     - vertical:   left-column tab list with a right-pointing arrow on the
                   active tab + content panel to the right
   Pass `panels={{ id: ReactNode }}` to render content as a real panel below /
   beside the tabs. Without panels, this works as a controlled tab strip.
---------------------------------------------------------------------------- */
function FnTabs({
  tabs = [],
  active,
  onChange,
  vertical = false,
  panels
}) {
  function onKey(e, i) {
    if (e.key === (vertical ? "ArrowDown" : "ArrowRight")) {
      e.preventDefault();
      onChange(tabs[(i + 1) % tabs.length].id);
    }
    if (e.key === (vertical ? "ArrowUp" : "ArrowLeft")) {
      e.preventDefault();
      onChange(tabs[(i - 1 + tabs.length) % tabs.length].id);
    }
    if (e.key === "Home") {
      e.preventDefault();
      onChange(tabs[0].id);
    }
    if (e.key === "End") {
      e.preventDefault();
      onChange(tabs[tabs.length - 1].id);
    }
  }
  if (vertical) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fn-tabs-vertical"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fn-tab-list",
      role: "tablist",
      "aria-orientation": "vertical"
    }, tabs.map((t, i) => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": active === t.id,
      tabIndex: active === t.id ? 0 : -1,
      className: `tab ${active === t.id ? "active" : ""}`,
      onClick: () => onChange(t.id),
      onKeyDown: e => onKey(e, i)
    }, t.icon && /*#__PURE__*/React.createElement(Ph, {
      name: t.icon
    }), t.count != null && /*#__PURE__*/React.createElement("span", {
      className: "count-num"
    }, t.count), t.label))), panels && /*#__PURE__*/React.createElement("div", {
      className: "fn-tab-panel",
      role: "tabpanel"
    }, panels[active]));
  }

  // horizontal
  return /*#__PURE__*/React.createElement("div", {
    className: panels ? "fn-tabs-horizontal" : ""
  }, /*#__PURE__*/React.createElement("div", {
    className: panels ? "fn-tab-row" : ""
  }, /*#__PURE__*/React.createElement("div", {
    className: "fn-tabs is-horizontal",
    role: "tablist",
    "aria-orientation": "horizontal"
  }, tabs.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    role: "tab",
    "aria-selected": active === t.id,
    tabIndex: active === t.id ? 0 : -1,
    className: `tab ${active === t.id ? "active" : ""}`,
    onClick: () => onChange(t.id),
    onKeyDown: e => onKey(e, i)
  }, t.icon && /*#__PURE__*/React.createElement(Ph, {
    name: t.icon
  }), t.count != null && /*#__PURE__*/React.createElement("span", {
    className: "count-num"
  }, t.count), t.label)))), panels && /*#__PURE__*/React.createElement("div", {
    className: "fn-tab-panel",
    role: "tabpanel"
  }, panels[active]));
}

/* ----------------------------------------------------------------------------
   FnAccordion — port of <fn-accordian>
   Each panel: closed = white header with gray text + small blue-tinted caret;
   open = dark navy header with white text + white circle (caret rotated 180°).
---------------------------------------------------------------------------- */
function FnAccordion({
  items = [],
  allowMulti = false,
  defaultOpenIds
}) {
  const [open, setOpen] = useState(defaultOpenIds || (items[0] ? [items[0].id] : []));
  function toggle(id) {
    setOpen(o => {
      if (o.includes(id)) return o.filter(x => x !== id);
      return allowMulti ? [...o, id] : [id];
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fn-accordian"
  }, items.map(it => {
    const expanded = open.includes(it.id);
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      className: "accordian-panel-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: `fn-panel ${expanded ? "fn-panel-expend" : ""}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "fn-panel-header",
      role: "button",
      tabIndex: 0,
      "aria-expanded": expanded,
      "aria-controls": `acc-body-${it.id}`,
      onClick: () => toggle(it.id),
      onKeyDown: e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(it.id);
        }
      }
    }, /*#__PURE__*/React.createElement("span", null, it.title), /*#__PURE__*/React.createElement("span", {
      className: "fn-panel_icon",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "7",
      viewBox: "0 0 12 8",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 2.5L6 6L10 2.5",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "fn-panel-body",
      id: `acc-body-${it.id}`,
      role: "region",
      "aria-labelledby": `acc-head-${it.id}`
    }, it.content)));
  }));
}

/* ----------------------------------------------------------------------------
   FnDialog — port of <fn-confirm-modal> / <fn-modal>
   header (gray strip + red-circle X) · content · actions (right-aligned).
   Colored variants via `type`: primary | success | danger | warning | info | orange.
---------------------------------------------------------------------------- */
function FnDialog({
  open,
  title = "Modal Header",
  type,
  // undefined = neutral; "primary"|"success"|"danger"|"warning"|"info"|"orange"
  children,
  onClose,
  actions,
  // ReactNode — buttons row; defaults below
  defaultActions = "close",
  // "close" | "yes-no"
  confirmText = "Yes",
  cancelText = "No",
  closeText = "Close",
  onConfirm,
  ariaLabel
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function key(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", key);
    };
  }, [open, onClose]);
  if (!open) return null;

  // Default action buttons mirror foundation's confirm-modal template
  let actionsNode = actions;
  if (!actionsNode) {
    if (defaultActions === "yes-no") {
      actionsNode = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary btn-round",
        onClick: () => {
          onConfirm?.(true);
          onClose?.();
        }
      }, confirmText), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-danger btn-round",
        onClick: () => {
          onConfirm?.(false);
          onClose?.();
        }
      }, cancelText));
    } else {
      actionsNode = /*#__PURE__*/React.createElement("button", {
        className: "btn btn-danger btn-round",
        onClick: onClose
      }, closeText);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fn-modal-overlay",
    onClick: onClose,
    role: "presentation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fn-modal",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "fn-modal-title",
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement("div", {
    className: `fn-modal-header ${type ? `modal-header-${type}` : ""}`
  }, /*#__PURE__*/React.createElement("h5", {
    id: "fn-modal-title",
    className: "modal-title"
  }, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 2L10 10M10 2L2 10",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    className: `fn-modal-content ${type ? `alert-msg-${type}` : ""}`
  }, children), /*#__PURE__*/React.createElement("div", {
    className: "fn-modal-actions"
  }, actionsNode)));
}

/* ----------------------------------------------------------------------------
   FnDrawer (ag-drawer-host)
---------------------------------------------------------------------------- */
function FnDrawer({
  open,
  title,
  children,
  onClose,
  width = 420,
  position = "right",
  footer
}) {
  useEffect(() => {
    if (!open) return;
    function key(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);
  if (!open) return null;
  const isRight = position === "right";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "var(--cdk-overlay-backdrop)",
      zIndex: 180,
      display: "flex",
      justifyContent: isRight ? "flex-end" : "flex-start"
    },
    onClick: onClose,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("div", {
    className: "fn-drawer",
    style: {
      width
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "drw-head"
  }, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement("button", {
    className: "ds-iconbtn",
    onClick: onClose,
    "aria-label": "Close drawer"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "drw-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "drw-foot"
  }, footer)));
}

/* ----------------------------------------------------------------------------
   FnToast + ToastHost
---------------------------------------------------------------------------- */
function FnToast({
  type = "info",
  title,
  message,
  onClose
}) {
  const iconMap = {
    success: "check-circle",
    danger: "x-circle",
    warning: "warning",
    info: "info"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `fn-toast ${type}`,
    role: type === "danger" ? "alert" : "status",
    "aria-live": type === "danger" ? "assertive" : "polite"
  }, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: iconMap[type],
    weight: "bold"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, title), message && /*#__PURE__*/React.createElement("div", null, message)), onClose && /*#__PURE__*/React.createElement("span", {
    className: "x",
    onClick: onClose,
    role: "button",
    "aria-label": "Dismiss",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "x",
    size: "14px"
  })));
}

/* ----------------------------------------------------------------------------
   FnNoData — port of <fn-no-data-box>
   Two variants driven by `showImg`:
     - false: just the centered headerTitle on the gray bar
     - true:  vertical illustration above the title; optional onHoverAdd CTA
---------------------------------------------------------------------------- */
function FnNoData({
  headerTitle = "No Data to display",
  description = "It's look like you have nothing to display. You can add some valuable data just by clicking on Add/Update button.",
  showImg = false,
  showDesc = false,
  showAddBtn = false,
  imgContainerheight,
  imgPath = "https://agcdn.altametrics.com/hubworks_resources/pre_dev/images/common/no_data_display_icon.svg",
  onAdd
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fn-no-data-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "no_data_component",
    style: imgContainerheight ? {
      height: imgContainerheight
    } : undefined
  }, showImg && /*#__PURE__*/React.createElement("div", {
    className: "vertical_img",
    style: imgContainerheight ? {
      height: imgContainerheight
    } : undefined
  }, /*#__PURE__*/React.createElement("img", {
    src: imgPath,
    alt: "",
    onError: e => {
      e.currentTarget.style.display = "none";
    }
  }), showAddBtn && /*#__PURE__*/React.createElement("div", {
    className: "onHoverAdd",
    onClick: onAdd,
    role: "button",
    tabIndex: 0,
    "aria-label": "Add new"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "no_data_text"
  }, /*#__PURE__*/React.createElement("h1", null, headerTitle), showDesc && /*#__PURE__*/React.createElement("div", {
    className: "mt-5"
  }, description))));
}

/* ----------------------------------------------------------------------------
   FnSkeleton
---------------------------------------------------------------------------- */
function FnSkeleton({
  shape = "line",
  width = "100%",
  height,
  count = 1
}) {
  const h = height || (shape === "circle" ? width : shape === "card" ? 120 : 14);
  const w = width;
  const radius = shape === "circle" ? "50%" : shape === "card" ? "var(--radius-md)" : "4px";
  return /*#__PURE__*/React.createElement(React.Fragment, null, Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "fn-skeleton",
    style: {
      width: w,
      height: h,
      borderRadius: radius,
      marginBottom: 8
    }
  })));
}

/* ----------------------------------------------------------------------------
   FnRating
---------------------------------------------------------------------------- */
function FnRating({
  value = 0,
  onChange,
  readOnly = false,
  max = 5
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "fn-rating",
    role: "radiogroup",
    "aria-label": "Rating"
  }, Array.from({
    length: max
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    role: readOnly ? undefined : "radio",
    "aria-checked": i + 1 === value,
    tabIndex: readOnly ? -1 : 0,
    className: `star ${i < value ? "on" : ""}`,
    onClick: () => !readOnly && onChange && onChange(i + 1),
    onKeyDown: e => {
      if (!readOnly && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onChange && onChange(i + 1);
      }
    },
    "aria-label": `${i + 1} star${i ? "s" : ""}`
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "star",
    weight: i < value ? "fill" : "regular"
  }))));
}

/* ----------------------------------------------------------------------------
   FnProgress
---------------------------------------------------------------------------- */
function FnProgress({
  value = 0,
  max = 100,
  color = "primary",
  label
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": Math.round(pct),
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-label": label
  }, /*#__PURE__*/React.createElement("div", {
    className: `fn-progress ${color !== "primary" ? color : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar",
    style: {
      width: `${pct}%`
    }
  })));
}

/* ============================================================================
   GALLERY HELPERS
   ============================================================================ */

/* ----------------------------------------------------------------------------
   Demo — preview frame + code block side-by-side or stacked
---------------------------------------------------------------------------- */
function Demo({
  children,
  code,
  label,
  surface = false,
  hideCode = false
}) {
  const [show, setShow] = useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `ds-preview ${surface ? "surface" : ""}`
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, label), children), code && !hideCode && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "ds-iconbtn",
    onClick: () => setShow(s => !s),
    style: {
      position: "absolute",
      top: 6,
      right: 6,
      zIndex: 1,
      height: 24,
      padding: "0 8px",
      fontSize: 11
    },
    "aria-label": show ? "Hide code" : "Show code"
  }, show ? "Hide code" : "Show code"), show && /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(code)
    }
  }))));
}

/* Very small Angular/HTML syntax tinter */
function highlightAngular(src) {
  return src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(\[?\(?[a-zA-Z_][a-zA-Z0-9_-]*\)?\]?)=&quot;([^&]*?)&quot;/g, '<span class="k">$1</span>=<span class="s">"$2"</span>').replace(/(\{\{[^}]+\}\})/g, '<span class="s">$1</span>').replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span class="t">$2</span>').replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>');
}

/* ----------------------------------------------------------------------------
   A11yNote — VPAT compliance callout
---------------------------------------------------------------------------- */
function A11yNote({
  children,
  items,
  label = "VPAT"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-a11y",
    role: "note"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, children, items && /*#__PURE__*/React.createElement("ul", null, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, it)))));
}

/* ----------------------------------------------------------------------------
   PropTable
---------------------------------------------------------------------------- */
function PropTable({
  rows = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Prop"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Default"), /*#__PURE__*/React.createElement("th", null, "Description"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: r.required ? "required" : ""
  }, /*#__PURE__*/React.createElement("span", {
    className: "pn"
  }, r.name)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "pt"
  }, r.type)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "pt"
  }, r.def || "—")), /*#__PURE__*/React.createElement("td", null, r.desc))))));
}

/* ----------------------------------------------------------------------------
   SectionHead — H2 with eyebrow + lead
---------------------------------------------------------------------------- */
function SectionHead({
  eyebrow,
  title,
  lead,
  children
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 24
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "ds-h1"
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    className: "ds-lead"
  }, lead), children);
}
function ComponentHead({
  name,
  selector,
  ngModule,
  summary
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Component"), /*#__PURE__*/React.createElement("h1", {
    className: "ds-h1"
  }, name), /*#__PURE__*/React.createElement("p", {
    className: "ds-lead",
    style: {
      marginBottom: 12
    }
  }, summary), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 8,
      fontSize: 12
    }
  }, selector && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "Selector"), " ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, selector)), ngModule && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "Module"), " ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ngModule))));
}

/* ----------------------------------------------------------------------------
   Toast manager — singleton hook
---------------------------------------------------------------------------- */
const ToastCtx = createContext(null);
function ToastProvider({
  children
}) {
  const [toasts, setToasts] = useState([]);
  const api = {
    success: (msg, title) => push("success", msg, title),
    error: (msg, title) => push("danger", msg, title),
    warning: (msg, title) => push("warning", msg, title),
    info: (msg, title) => push("info", msg, title)
  };
  function push(type, message, title) {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, {
      id,
      type,
      message,
      title
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  }
  return /*#__PURE__*/React.createElement(ToastCtx.Provider, {
    value: api
  }, children, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 300,
      display: "flex",
      flexDirection: "column",
      gap: 10
    },
    role: "region",
    "aria-label": "Notifications"
  }, toasts.map(t => /*#__PURE__*/React.createElement(FnToast, {
    key: t.id,
    type: t.type,
    title: t.title,
    message: t.message,
    onClose: () => setToasts(s => s.filter(x => x.id !== t.id))
  }))));
}
function useToast() {
  return useContext(ToastCtx) || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
}

/* ============================================================================
   Export to window
   ============================================================================ */
Object.assign(window, {
  Ph,
  FnIcon,
  FnButton,
  FnInput,
  FnTextarea,
  FormGroup,
  FnSelect,
  FnTime,
  FnDatePicker,
  FnDateRangePicker,
  CalendarPopup,
  DRMonth,
  FnPrimeTable,
  PtEditIcon,
  FnSwitch,
  FnCheckbox,
  FnRadio,
  FnRadioGroup,
  FnTag,
  FnAvatar,
  FnAvatarStack,
  FnPagination,
  FnBreadcrumb,
  FnTabs,
  FnAccordion,
  FnMenuSidebar,
  FnDialog,
  FnDrawer,
  FnToast,
  FnNoData,
  FnSkeleton,
  FnRating,
  FnProgress,
  Demo,
  A11yNote,
  PropTable,
  SectionHead,
  ComponentHead,
  ToastProvider,
  useToast
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/primitives.jsx", error: String((e && e.message) || e) }); }

// src/view-a11y.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-a11y.jsx
   VPAT / WCAG 2.1 AA compliance reference — mirrors A11Y.md.
   ============================================================================ */

function ViewA11y() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Compliance",
    title: "VPAT & WCAG 2.1 AA",
    lead: "Every component in this system ships keyboard-accessible, screen-reader-labeled, and theme-contrast-checked. This page is the canonical reference for the directives and patterns that resolved your existing axe findings."
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--green)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 16,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "shield-check",
    size: "28px",
    style: {
      color: "var(--green)"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Baseline: VPAT 2.4 \xB7 WCAG 2.1 AA \xB7 Section 508"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: 0
    }
  }, "The directives and services below are wired into ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FoundationModule"), " by default. Apps that import it inherit the full a11y surface \u2014 no per-component opt-in required.")))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "A11y building blocks"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "These directives + services come bundled with ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FoundationModule"), ". Use the directives when generating new templates; the services run automatically."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush"
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Purpose"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "a11yClickable")), /*#__PURE__*/React.createElement("td", null, "Directive"), /*#__PURE__*/React.createElement("td", null, "Adds button semantics + keyboard activation (Enter/Space) to non-button clickables (e.g. clickable ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<li>"), "). No-op on real ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<button>"), "/", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<a href>"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "a11yIconBtn")), /*#__PURE__*/React.createElement("td", null, "Directive"), /*#__PURE__*/React.createElement("td", null, "Icon-only button: stamps ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-label"), " on host + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-hidden=\"true\""), " on every inner ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<i>"), "/", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<svg>"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "A11yFormFieldDirective")), /*#__PURE__*/React.createElement("td", null, "Directive"), /*#__PURE__*/React.createElement("td", null, "Auto-associates ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<label>"), " with the form control inside ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".form-group"), " via ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-labelledby"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "A11yLabelService")), /*#__PURE__*/React.createElement("td", null, "Service"), /*#__PURE__*/React.createElement("td", null, "Runtime fallback: sets ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "for="), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-labelledby"), " for labels outside ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".form-group"), " (Bootstrap rows, etc.).")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "A11yImageService")), /*#__PURE__*/React.createElement("td", null, "Service"), /*#__PURE__*/React.createElement("td", null, "Defensive: adds ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "alt=\"\""), " to any ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<img>"), " shipped without it. Meaningful images must still set their own alt.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "A11yScrollableRegionService")), /*#__PURE__*/React.createElement("td", null, "Service"), /*#__PURE__*/React.createElement("td", null, "Adds ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "tabindex=\"0\""), " to every genuinely-scrollable ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "overflow:auto/scroll"), " element after each DOM mutation. Fixes Safari keyboard access (2.1.1).")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "A11yListboxService")), /*#__PURE__*/React.createElement("td", null, "Service"), /*#__PURE__*/React.createElement("td", null, "Safety net for ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-required-children"), ": ensures every ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "role=\"listbox\""), " has visible ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "role=\"option\""), " children, marks empty listboxes ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-busy"), "."))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Hard rules (do \xB7 don't)"), /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3"
  }, "Images"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "Decorative icon next to text"
  }, `<button a11yIconBtn [label]="'DOWNLOAD' | fnTranslate">
  <i class="fn-global-pdf"></i>
</button>`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "dont",
    title: "Missing alt on <img>"
  }, `<img src="logo.png">
<!-- axe critical: image-alt -->`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "Meaningful image"
  }, `<img [src]="emp.photoUrl"
     [alt]="'EMP.AVATAR_OF' | fnTranslate:emp.name">`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "dont",
    title: "Raw English in alt"
  }, `<img src="..." alt="employee avatar">
<!-- fails i18n review -->`)), /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3"
  }, "Form controls"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "Label inside .form-group (auto-associated)"
  }, `<div class="form-group">
  <label class="fn-label">{{ 'EMP.EMAIL' | fnTranslate }}</label>
  <fn-base-input formControlName="email" type="EMAIL"
                 [isRequired]="true"></fn-base-input>
</div>`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "Pass labelForId to ng-select"
  }, `<!-- foundation's fn-select does this for you -->
<fn-select [labelForId]="'roleId'" ...></fn-select>`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "dont",
    title: "Hand-rolled clickable div"
  }, `<div (click)="doIt()" class="card">…</div>
<!-- no keyboard, no role -->`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "\u2026use a11yClickable on the actual element"
  }, `<li a11yClickable
    [attr.aria-label]="'OPEN_DETAIL' | fnTranslate"
    (click)="open(item)">…</li>`)), /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3"
  }, "Color contrast"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow",
    style: {
      color: "var(--green)"
    }
  }, "DO"), /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: 13,
      lineHeight: 1.7,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, "Use ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--body-textColor)"), " for any text on a theme background \u2014 the variable flips for dark mode automatically."), /*#__PURE__*/React.createElement("li", null, "Minimum contrast: ", /*#__PURE__*/React.createElement("b", null, "4.5:1"), " for normal text, ", /*#__PURE__*/React.createElement("b", null, "3:1"), " for large text (\u226518pt or \u226514pt bold) and UI components / focus indicators."), /*#__PURE__*/React.createElement("li", null, "When introducing a new color in SCSS, add a token to ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "_variable.scss"), " (in both ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ":root"), " and ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".dark-theme"), ") ", /*#__PURE__*/React.createElement("i", null, "before"), " reaching for a hex."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow",
    style: {
      color: "var(--red)"
    }
  }, "DON'T"), /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: 13,
      lineHeight: 1.7,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, "Hardcode ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "#ccc"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "#aaa"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "$gray"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "$lightGray"), " \u2014 at least one theme will fail WCAG AA."), /*#__PURE__*/React.createElement("li", null, "Communicate status via color alone \u2014 always pair with text and/or icon."), /*#__PURE__*/React.createElement("li", null, "Use Tailwind text-gray-400 etc. \u2014 bypasses the theme system."))))), /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3"
  }, "Focus & keyboard"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: 13,
      lineHeight: 1.8,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, "Every interactive element gets a 2px focus ring via the global ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ":focus-visible"), " rule. Don't disable it."), /*#__PURE__*/React.createElement("li", null, "Tab order follows DOM order \u2014 never use ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "tabindex"), " values greater than 0. Only ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "0"), " (focusable in order) or ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "-1"), " (programmatic) are acceptable."), /*#__PURE__*/React.createElement("li", null, "Modals trap focus while open; on close, focus returns to the trigger element."), /*#__PURE__*/React.createElement("li", null, "Keyboard map: ", /*#__PURE__*/React.createElement(FnTag, null, "Tab"), " next / ", /*#__PURE__*/React.createElement(FnTag, null, "Shift+Tab"), " previous / ", /*#__PURE__*/React.createElement(FnTag, null, "Enter"), "/", /*#__PURE__*/React.createElement(FnTag, null, "Space"), " activate / ", /*#__PURE__*/React.createElement(FnTag, null, "Esc"), " dismiss / ", /*#__PURE__*/React.createElement(FnTag, null, "\u2191\u2193\u2190\u2192"), " within composite widgets (tabs, radio groups, menus)."))), /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3"
  }, "ARIA"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "Prefer native semantics"
  }, `<button type="button" (click)="…">Save</button>
<a href="/route/...">Open detail</a>`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "dont",
    title: "Don't add roles to ad-hoc divs"
  }, `<div role="button" tabindex="0" (click)="…">Save</div>
<!-- breaks keyboard, screen reader -->`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "do",
    title: "Empty-state listbox option"
  }, `<!-- fn-select includes this template by default -->
<ng-template ng-notfound-tmp>
  <li role="option" aria-disabled="true">No items found</li>
</ng-template>`), /*#__PURE__*/React.createElement(RuleCard, {
    tone: "dont",
    title: "Hidden focusable elements"
  }, `<button aria-hidden="true">…</button>
<!-- focusable + hidden = trap for screen readers -->`)), /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3"
  }, "Internationalization"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: 13,
      lineHeight: 1.8,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, "Every user-visible string goes through the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fnTranslate"), " pipe or ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FnI18nService"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "alt"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-label"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "title"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "placeholder"), " must all use translation keys."), /*#__PURE__*/React.createElement("li", null, "RTL is handled by the foundation SCSS mixins (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "@include padding-direction(...)"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "@include margin-direction(...)"), "). Don't write raw ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "padding-left"), " \u2014 use the mixin."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Per-component a11y matrix"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Component"), /*#__PURE__*/React.createElement("th", null, "Key roles"), /*#__PURE__*/React.createElement("th", null, "Keyboard"), /*#__PURE__*/React.createElement("th", null, "Common findings"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Button"), /*#__PURE__*/React.createElement("td", null, "\u2014"), /*#__PURE__*/React.createElement("td", null, "Tab + Enter/Space"), /*#__PURE__*/React.createElement("td", null, "Icon-only needs ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "a11yIconBtn"), " for aria-label.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Input"), /*#__PURE__*/React.createElement("td", null, "\u2014"), /*#__PURE__*/React.createElement("td", null, "Tab"), /*#__PURE__*/React.createElement("td", null, "aria-required + aria-describedby for error/help text.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Select"), /*#__PURE__*/React.createElement("td", null, "combobox + listbox + option"), /*#__PURE__*/React.createElement("td", null, "Tab to open; \u2191\u2193 navigate; Enter commits; Esc closes"), /*#__PURE__*/React.createElement("td", null, "Empty state needs role=option aria-disabled (auto in fn-select).")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Switch / Checkbox"), /*#__PURE__*/React.createElement("td", null, "switch / checkbox"), /*#__PURE__*/React.createElement("td", null, "Space toggles"), /*#__PURE__*/React.createElement("td", null, "Visible label + association.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Radio group"), /*#__PURE__*/React.createElement("td", null, "radiogroup + radio"), /*#__PURE__*/React.createElement("td", null, "Arrows navigate within group"), /*#__PURE__*/React.createElement("td", null, "First radio is tabstop; others tabindex=-1.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Tabs"), /*#__PURE__*/React.createElement("td", null, "tablist + tab + tabpanel"), /*#__PURE__*/React.createElement("td", null, "\u2190 \u2192 navigate; Home/End ends"), /*#__PURE__*/React.createElement("td", null, "Selected tab gets tabindex=0; others -1.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Dialog"), /*#__PURE__*/React.createElement("td", null, "dialog + aria-modal"), /*#__PURE__*/React.createElement("td", null, "Esc closes; focus trap"), /*#__PURE__*/React.createElement("td", null, "Must have aria-labelledby pointing at title.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Drawer"), /*#__PURE__*/React.createElement("td", null, "dialog + aria-label"), /*#__PURE__*/React.createElement("td", null, "Esc closes"), /*#__PURE__*/React.createElement("td", null, "Focus returns to trigger on close.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Toast"), /*#__PURE__*/React.createElement("td", null, "status (info/success) / alert (error)"), /*#__PURE__*/React.createElement("td", null, "Manual dismiss via X"), /*#__PURE__*/React.createElement("td", null, "aria-live=polite/assertive paired with role.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Table"), /*#__PURE__*/React.createElement("td", null, "table + columnheader + cell"), /*#__PURE__*/React.createElement("td", null, "Native"), /*#__PURE__*/React.createElement("td", null, "Sortable headers need aria-sort; scrollable table gets tabindex=0 (auto).")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Date picker"), /*#__PURE__*/React.createElement("td", null, "dialog + grid + gridcell"), /*#__PURE__*/React.createElement("td", null, "Arrows / PgUp+Dn / Home+End"), /*#__PURE__*/React.createElement("td", null, "Today gets aria-current=date."))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Anti-patterns (do not generate)"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--red)"
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: 13,
      lineHeight: 1.9,
      paddingLeft: 18,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<div (click)>"), " / ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<li (click)>"), " without ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "a11yClickable"), ". Fails keyboard."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "tabindex > 0"), " \u2014 disrupts natural tab order."), /*#__PURE__*/React.createElement("li", null, "Raw English in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "alt"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-label"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "title"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "placeholder"), "."), /*#__PURE__*/React.createElement("li", null, "Skipping heading levels (h1 \u2192 h3). Keep monotonic."), /*#__PURE__*/React.createElement("li", null, "Color-only status indicators (\"the red row is bad\")."), /*#__PURE__*/React.createElement("li", null, "Hardcoded gray (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "#ccc"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "#aaa"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "$gray"), ") outside the token system."), /*#__PURE__*/React.createElement("li", null, "Custom ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "overflow:auto"), " regions without keyboard access (now auto-patched, but don't rely on it for new code)."), /*#__PURE__*/React.createElement("li", null, "Unicode glyphs (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "\u2713"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "\u2192"), ") as icons."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-hidden=\"true\""), " on focusable elements."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Testing"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      fontSize: 13,
      lineHeight: 1.8,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Manual smoke test:"), " Tab through every interactive element. Every focus state should be visible."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Screen reader:"), " NVDA (Win) or VoiceOver (Mac). Headings should announce in order; form labels should read."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Automated:"), " ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "axe-core"), " via ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "@axe-core/playwright"), " in your e2e pipeline."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Contrast:"), " Toggle theme \u2014 every text/bg pair must pass AA in both modes. Use the topbar toggle to test."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Reduced motion:"), " macOS \u2192 Accessibility \u2192 Display \u2192 Reduce motion. Transforms collapse to opacity-only."))), /*#__PURE__*/React.createElement(A11yNote, {
    label: "Resources"
  }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "projects/foundation/A11Y.md"), " \u2014 your canonical reference (origin of these rules)."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "lib/a11y/*"), " \u2014 directive + service implementations."), /*#__PURE__*/React.createElement("li", null, "WCAG 2.1 quick ref \xB7 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "w3.org/WAI/WCAG21/quickref/")), /*#__PURE__*/React.createElement("li", null, "axe rules \xB7 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "dequeuniversity.com/rules/axe/")))));
}
function RuleCard({
  tone,
  title,
  children
}) {
  const isDo = tone === "do";
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      padding: 0,
      borderLeft: `3px solid var(--${isDo ? "green" : "red"})`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 16px",
      borderBottom: "1px solid var(--border-default-color)",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: isDo ? "var(--green)" : "var(--red)"
    }
  }, isDo ? "DO" : "DON'T"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, title)), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code",
    style: {
      borderRadius: 0,
      margin: 0,
      border: 0
    }
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(children)
    }
  })));
}
Object.assign(window, {
  ViewA11y
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-a11y.jsx", error: String((e && e.message) || e) }); }

// src/view-app-market.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-app-market.jsx
   <hw-app-landing> — two layouts: (1) plain grid/list, (2) with promo banner.
   ============================================================================ */

const AMK_APPS = [{
  id: "store",
  name: "App Store",
  color: "#ffffff",
  icon: "shopping-cart",
  store: true
}, {
  id: "pos",
  name: "Plum POS",
  color: "#ad2d75",
  icon: "orange-slice"
}, {
  id: "tk",
  name: "Zip Timekeeping",
  color: "#21a8bd",
  icon: "alarm"
}, {
  id: "dash",
  name: "Zip POS DashBoard",
  color: "#54a2f2",
  icon: "chart-line-up"
}, {
  id: "cater",
  name: "Plum Catering",
  color: "#5b5bd6",
  icon: "fork-knife"
}];
const AMK_APPS_FULL = [{
  id: "store",
  name: "App Store",
  color: "#ffffff",
  icon: "shopping-cart",
  store: true
}, {
  id: "tunes",
  name: "Zip Tunes",
  color: "#21a8bd",
  icon: "music-notes",
  ribbon: "coming",
  dim: true
}, {
  id: "tip",
  name: "Tip Pool & Share",
  color: "#c1466b",
  icon: "hand-coins",
  ribbon: "coming",
  dim: true
}, {
  id: "sign",
  name: "Zip Digital Signage",
  color: "#801452",
  icon: "monitor",
  ribbon: "newly",
  dim: true
}, {
  id: "sched",
  name: "Zip Schedules",
  color: "#54a2f2",
  icon: "calendar-check"
}, {
  id: "clock",
  name: "Zip Clock",
  color: "#54a2f2",
  icon: "clock"
}, {
  id: "inv",
  name: "Zip Inventory",
  color: "#8e88ff",
  icon: "clipboard-text"
}, {
  id: "order",
  name: "Zip Ordering",
  color: "#6d177c",
  icon: "shopping-cart-simple"
}, {
  id: "report",
  name: "Zip Reporting",
  color: "#fe7b1b",
  icon: "chart-pie-slice"
}, {
  id: "shift",
  name: "Zip ShiftBook",
  color: "#ed1c24",
  icon: "book-open"
}, {
  id: "check",
  name: "Zip Checklist",
  color: "#ed1c24",
  icon: "check-circle"
}, {
  id: "haccp",
  name: "Zip HACCP",
  color: "#ff6600",
  icon: "shield-check"
}, {
  id: "tip2",
  name: "Tip Pool & Share",
  color: "#ad2d75",
  icon: "users-three",
  ribbon: "free"
}, {
  id: "loyal",
  name: "Plum Loyalty",
  color: "#5b5bd6",
  icon: "star"
}, {
  id: "ai",
  name: "AI Insights",
  color: "#54a2f2",
  icon: "shield"
}];
const AMK_PROMOS = [{
  id: "tunes",
  name: "Zip Tunes",
  color: "linear-gradient(135deg,#1c8a9b,#24c1ad)",
  ribbon: "coming",
  ribbonLabel: "Coming Soon",
  desc: "Intuitive and efficient way to control the music being played within your establishment.",
  feats: ["Craft the perfect playlist", "Schedule playlists", "Auto-recovery", "Enhanced Customer Experience"]
}, {
  id: "sign",
  name: "Zip Digital Signage",
  color: "linear-gradient(135deg,#5b2a86,#801452)",
  ribbon: "newly",
  ribbonLabel: "Newly Launched",
  desc: "User-friendly technology for displaying and updating multimedia content, including restaurant menus, with real-time updates, offline mode, and AI integration.",
  feats: ["Dynamic Content Display", "Remote Content Management", "Scheduling & Automation", "High-Resolution Displays"]
}, {
  id: "bi",
  name: "BI Reporting",
  color: "linear-gradient(135deg,#2b8a9b,#3a6ea5)",
  ribbon: "free",
  ribbonLabel: "Free till Aug'26",
  desc: "Stay ahead with real-time insights, track performance effortlessly, and make smarter decisions with powerful BI reporting.",
  feats: ["AI Analytics", "Auto Scheduled Reports", "Machine Learning", "Sales Tracking"]
}];
function AmkToolbar({
  view,
  setView,
  tab,
  setTab
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "amk-toolbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: `amk-tab ${tab === "apps" ? "active" : ""}`,
    onClick: () => setTab("apps"),
    role: "tab",
    tabIndex: 0,
    "aria-selected": tab === "apps"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "squares-four",
    weight: "fill",
    size: "18px"
  })), " My Apps"), /*#__PURE__*/React.createElement("span", {
    className: `amk-tab ${tab === "settings" ? "active" : ""}`,
    onClick: () => setTab("settings"),
    role: "tab",
    tabIndex: 0,
    "aria-selected": tab === "settings"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    size: "18px"
  })), " Settings"), /*#__PURE__*/React.createElement("div", {
    className: "amk-search",
    role: "search"
  }, /*#__PURE__*/React.createElement("span", {
    className: "si"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "magnifying-glass",
    size: "16px"
  })), /*#__PURE__*/React.createElement("input", {
    type: "search",
    placeholder: "Search Apps...",
    "aria-label": "Search apps"
  })), /*#__PURE__*/React.createElement("div", {
    className: "amk-viewtoggle",
    role: "group",
    "aria-label": "View"
  }, /*#__PURE__*/React.createElement("button", {
    className: view === "grid" ? "on" : "",
    onClick: () => setView("grid"),
    "aria-label": "Grid view"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "squares-four",
    weight: "bold",
    size: "16px"
  })), /*#__PURE__*/React.createElement("button", {
    className: view === "list" ? "on" : "",
    onClick: () => setView("list"),
    "aria-label": "List view"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "list-dashes",
    weight: "bold",
    size: "16px"
  }))));
}
function AmkGrid({
  apps
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "amk-grid"
  }, apps.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: `amk-tile ${a.store ? "is-store" : ""} ${a.dim ? "dim" : ""} ${a.ribbon ? "has-ribbon" : ""}`,
    style: a.store ? undefined : {
      background: a.color
    },
    role: "button",
    tabIndex: 0
  }, a.ribbon && /*#__PURE__*/React.createElement("span", {
    className: `amk-ribbon ${a.ribbon}`
  }, a.ribbon === "coming" ? "Coming Soon" : a.ribbon === "newly" ? "Newly Launched" : "Free till Aug 26"), /*#__PURE__*/React.createElement("span", {
    className: "tile-ico",
    style: a.store ? {
      color: "var(--theme)"
    } : undefined
  }, /*#__PURE__*/React.createElement(Ph, {
    name: a.icon,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tile-name"
  }, a.name), a.dim && /*#__PURE__*/React.createElement("button", {
    className: "amk-knowmore"
  }, "Know More"))));
}
function AmkList({
  apps
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "amk-list"
  }, apps.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: `amk-listitem ${a.store ? "is-store" : ""}`,
    style: a.store ? undefined : {
      background: a.color
    },
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("span", {
    className: "li-ico",
    style: a.store ? {
      color: "var(--theme)"
    } : undefined
  }, /*#__PURE__*/React.createElement(Ph, {
    name: a.icon,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("span", {
    className: "li-name"
  }, a.name))));
}
function AmkHeader({
  user = "R Dixit"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "amk-head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "amk-welcome"
  }, "Welcome, ", /*#__PURE__*/React.createElement("span", {
    className: "uname"
  }, user)), /*#__PURE__*/React.createElement("div", {
    className: "amk-billing"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pin"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "warning",
    weight: "fill",
    size: "14px"
  })), " Your payment detail is not updated. To keep using your account, please update your billing information.")), /*#__PURE__*/React.createElement("div", {
    className: "amk-date"
  }, /*#__PURE__*/React.createElement("b", null, "Friday"), " ", /*#__PURE__*/React.createElement("span", {
    className: "d"
  }, "May 29, 2026"))));
}

/* Variant 1 — plain app market (no promo, no sidenav) */
function AppMarketPlain() {
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("apps");
  return /*#__PURE__*/React.createElement("div", {
    className: "amk"
  }, /*#__PURE__*/React.createElement(AmkHeader, {
    user: "R Dixit"
  }), /*#__PURE__*/React.createElement(AmkToolbar, {
    view: view,
    setView: setView,
    tab: tab,
    setTab: setTab
  }), view === "grid" ? /*#__PURE__*/React.createElement(AmkGrid, {
    apps: AMK_APPS
  }) : /*#__PURE__*/React.createElement(AmkList, {
    apps: AMK_APPS
  }));
}

/* Variant 2 — with collapsible promo banner */
function AppMarketPromo() {
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("apps");
  const [promoOpen, setPromoOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "amk-shell"
  }, promoOpen ? /*#__PURE__*/React.createElement("div", {
    className: "amk-promo-panel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "amk-promo-toggle",
    style: {
      width: "auto",
      background: "transparent",
      padding: 0
    },
    onClick: () => setPromoOpen(false),
    "aria-label": "Collapse promotions"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 6,
      background: "var(--orange)",
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "caret-left",
    weight: "bold",
    size: "14px"
  })))), AMK_PROMOS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "amk-promo-card",
    style: {
      background: p.color
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `amk-promo-ribbon ${p.ribbon}`
  }, p.ribbonLabel), /*#__PURE__*/React.createElement("h3", null, p.name), /*#__PURE__*/React.createElement("p", null, p.desc), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, p.feats.map(f => /*#__PURE__*/React.createElement("span", {
    key: f
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "check-circle",
    weight: "fill",
    size: "14px"
  }), " ", f))), /*#__PURE__*/React.createElement("button", {
    className: "km"
  }, "Know More")))) : /*#__PURE__*/React.createElement("div", {
    className: "amk-promo-toggle"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPromoOpen(true),
    "aria-label": "Expand promotions"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "caret-right",
    weight: "bold",
    size: "14px"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "amk",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(AmkHeader, {
    user: "Andrew"
  }), /*#__PURE__*/React.createElement(AmkToolbar, {
    view: view,
    setView: setView,
    tab: tab,
    setTab: setTab
  }), view === "grid" ? /*#__PURE__*/React.createElement(AmkGrid, {
    apps: AMK_APPS_FULL
  }) : /*#__PURE__*/React.createElement(AmkList, {
    apps: AMK_APPS_FULL
  })));
}
function ViewHwAppMarket() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "App market / landing",
    selector: "<hw-app-landing>",
    ngModule: "HwAppMarketModule",
    summary: "The post-login launchpad. Welcome header + billing banner, My Apps / Settings tabs, app search, and a grid \u21C4 list view toggle. App tiles are color-coded per product with optional ribbons (Coming Soon / Newly Launched / Free till). A second variant adds a collapsible promotions rail on the left that expands to show promotional product cards."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Variant 1 \u2014 Apps only (grid + list)"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "No side rail. Toggle the grid/list control (top-right) to switch layouts. App Store tile is white; product tiles use their brand color."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default-color)",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(AppMarketPlain, null)), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Variant 2 \u2014 With promotions rail"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "The promo rail starts collapsed (thin orange tab on the left). Click it to expand the promotional product cards; collapse again with the caret. The app grid includes ribboned \"Coming Soon / Newly Launched / Free\" tiles with a Know More button."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default-color)",
      borderRadius: 10,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(AppMarketPromo, null)), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Tile color tokens"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Class"), /*#__PURE__*/React.createElement("th", null, "Color"), /*#__PURE__*/React.createElement("th", null, "Used by"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "plumpos_purple")), /*#__PURE__*/React.createElement("td", null, "#ad2d75"), /*#__PURE__*/React.createElement("td", null, "Plum POS")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipTimeKeeping_blue")), /*#__PURE__*/React.createElement("td", null, "#21a8bd"), /*#__PURE__*/React.createElement("td", null, "Zip Timekeeping")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipschudels_blue / zipclock_blue")), /*#__PURE__*/React.createElement("td", null, "#54a2f2"), /*#__PURE__*/React.createElement("td", null, "Schedules, Clock, POS Dashboard")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipInventory_voilet")), /*#__PURE__*/React.createElement("td", null, "#8e88ff"), /*#__PURE__*/React.createElement("td", null, "Zip Inventory")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipordering_voilet")), /*#__PURE__*/React.createElement("td", null, "#6d177c"), /*#__PURE__*/React.createElement("td", null, "Zip Ordering")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipreporting_orange")), /*#__PURE__*/React.createElement("td", null, "#fe7b1b"), /*#__PURE__*/React.createElement("td", null, "Zip Reporting")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipchecklist_red / zipshiftbook_red")), /*#__PURE__*/React.createElement("td", null, "#ed1c24"), /*#__PURE__*/React.createElement("td", null, "Checklist, ShiftBook")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "zipHaccp_red")), /*#__PURE__*/React.createElement("td", null, "#ff6600"), /*#__PURE__*/React.createElement("td", null, "Zip HACCP")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "plumCatering_purple")), /*#__PURE__*/React.createElement("td", null, "#801452"), /*#__PURE__*/React.createElement("td", null, "Plum Catering, Digital Signage"))))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Tabs use role='tab' with aria-selected; the grid/list toggle is a role='group' of labeled buttons.", "Each app tile is a keyboard-activatable button with the app name as its accessible label.", "Ribbon text ('Coming Soon' etc.) is real text, not an image — it's announced by screen readers.", "The promo rail toggle has aria-label='Expand/Collapse promotions'; collapsed state keeps it reachable by keyboard.", "Dimmed 'coming soon' tiles keep ≥3:1 contrast on their label via the Know More button + ribbon, not color alone."]
  }));
}
Object.assign(window, {
  ViewHwAppMarket,
  AppMarketPlain,
  AppMarketPromo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-app-market.jsx", error: String((e && e.message) || e) }); }

// src/view-components.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-components.jsx
   Live demos for every fn-* / hw-* component in foundation + hw-foundation.
   ============================================================================ */

/* =============================== BUTTON =================================== */
function ViewButton() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  function fire() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Saved successfully");
    }, 1400);
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Button",
    selector: "<fn-button>",
    ngModule: "FnButtonModule",
    summary: "Action triggers. One primary per page/form. Destructive confirmations use danger. Secondary actions use outline-secondary."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Types"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-button type="primary"   text="Save"></fn-button>
<fn-button type="success"   text="Approve"></fn-button>
<fn-button type="danger"    text="Delete"></fn-button>
<fn-button type="warning"   text="Pending"></fn-button>
<fn-button type="orange"    text="Boost"></fn-button>
<fn-button type="info"      text="Details"></fn-button>
<fn-button type="dark"      text="Dark"></fn-button>
<fn-button type="secondary" text="Cancel"></fn-button>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Save"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "success",
    text: "Approve"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "danger",
    text: "Delete"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "warning",
    text: "Pending"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "orange",
    text: "Boost"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "info",
    text: "Details"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "dark",
    text: "Dark"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "secondary",
    text: "Cancel"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Outline variants"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-button type="outline-primary"   text="Primary"></fn-button>
<fn-button type="outline-success"   text="Success"></fn-button>
<fn-button type="outline-danger"    text="Danger"></fn-button>
<fn-button type="outline-secondary" text="Cancel"></fn-button>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-primary",
    text: "Primary"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-success",
    text: "Success"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-danger",
    text: "Danger"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-warning",
    text: "Warning"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-info",
    text: "Info"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary",
    text: "Cancel"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Sizes & shape"), /*#__PURE__*/React.createElement(Demo, {
    code: `<!-- packed class style (idiomatic) -->
<fn-button [type]="'primary btn-xs btn-round'" text="Add"></fn-button>

<!-- explicit -->
<fn-button type="primary" shape="round" btnClass="btn-xs" text="Add"></fn-button>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-xs",
    text: "xs"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-sm",
    text: "sm"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "default"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-lg",
    text: "lg"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-round",
    text: "round",
    iconAddonBefore: "plus"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "square",
    className: "btn-square"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "disabled",
    disabled: true
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "With icons"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-button type="outline-primary" iconAddonBefore="ph-arrows-clockwise" text="Refresh"></fn-button>
<fn-button type="primary"          iconAddonBefore="ph-plus" [type]="'primary btn-round'" text="Add shift"></fn-button>
<fn-button type="outline-secondary" iconAddonAfter="ph-arrow-right" text="Continue"></fn-button>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-primary",
    iconAddonBefore: "arrows-clockwise",
    text: "Refresh"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-round",
    iconAddonBefore: "plus",
    text: "Add shift"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary",
    iconAddonAfter: "arrow-right",
    text: "Continue"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "danger btn-sm",
    iconAddonBefore: "trash",
    text: "Delete"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Loading state"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-button type="primary" text="Save" [isLoading]="saving" textLoading="COMMON.SAVING"></fn-button>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Save",
    isLoading: loading,
    textLoading: "Saving\u2026",
    onClick: fire
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Click \u2192 1.4s loading \u2192 success toast (top-right)"))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Button group"), /*#__PURE__*/React.createElement(Demo, {
    code: `<div class="btn-group btn-group-round">
  <button class="btn btn-outline-primary active">Day</button>
  <button class="btn btn-outline-primary">Week</button>
  <button class="btn btn-outline-primary">Month</button>
</div>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-group btn-group-round"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    style: {
      background: "var(--blue)",
      color: "#fff"
    }
  }, "Day"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary"
  }, "Week"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary"
  }, "Month"))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "type",
      type: "string",
      def: "'primary'",
      desc: "Color variant. Can pack extra classes (e.g. 'primary btn-xs btn-round'). One of primary, success, danger, warning, info, orange, dark, secondary, plus outline-* variants."
    }, {
      name: "shape",
      type: "'circle' | 'round' | null",
      def: "null",
      desc: "Pill shape modifier."
    }, {
      name: "text",
      type: "string",
      desc: "Label (passed through fnTranslate)."
    }, {
      name: "iconAddonBefore",
      type: "string",
      desc: "Phosphor class name before the label."
    }, {
      name: "iconAddonAfter",
      type: "string",
      desc: "Phosphor class name after the label."
    }, {
      name: "isLoading",
      type: "boolean",
      def: "false",
      desc: "Replaces label with spinner + textLoading."
    }, {
      name: "textLoading",
      type: "string",
      def: "'Loading…'",
      desc: "Label shown while isLoading is true."
    }, {
      name: "btnType",
      type: "'submit'|'button'|'reset'",
      def: "'submit'",
      desc: "Native button type."
    }, {
      name: "disabled",
      type: "boolean",
      def: "false",
      desc: "Disables click and lowers opacity to .6."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Always native <button>. Never <div role='button'>. Foundation's a11yClickable directive is the escape hatch when a real button isn't viable (e.g. clickable <li> in a list).", "Icon-only buttons: use the a11yIconBtn directive which stamps aria-label on host + aria-hidden on inner glyphs.", "Loading button gets aria-busy='true' so screen readers announce the state change.", "Disabled buttons keep their tooltip + label so context isn't lost."]
  }));
}

/* =============================== INPUT ==================================== */
function ViewInput() {
  const [val, setVal] = useState("");
  const [pwd, setPwd] = useState("");
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Text input",
    selector: "<fn-base-input> / <fn-input>",
    ngModule: "FnInputModule",
    summary: "The text input primitive. Height is fixed at 30px. Labels sit above at 12px / 500. Errors render below in red. Wraps a ControlValueAccessor so formControlName works directly."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Sizes & states"), /*#__PURE__*/React.createElement(Demo, {
    code: `<label class="fn-label">Email</label>
<fn-base-input
  [(ngModel)]="model.email"
  id="email" name="email" type="EMAIL"
  placeholder="name@co.com"
  [isRequired]="true" [maxLength]="255">
</fn-base-input>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "email",
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "email",
    placeholder: "name@co.com",
    value: val,
    onChange: e => setVal(e.target.value)
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "pwd",
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: pwd,
    onChange: e => setPwd(e.target.value)
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "ro",
    label: "Disabled"
  }, /*#__PURE__*/React.createElement(FnInput, {
    value: "Read only",
    disabled: true
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "err",
    label: "With error",
    error: "Minimum 5 characters required"
  }, /*#__PURE__*/React.createElement(FnInput, {
    value: "abc"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "ok",
    label: "Valid"
  }, /*#__PURE__*/React.createElement(FnInput, {
    value: "sana@altametrics.com",
    isValid: true
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "round",
    label: "Rounded"
  }, /*#__PURE__*/React.createElement(FnInput, {
    rounded: true,
    placeholder: "Search\u2026"
  })))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Input groups"), /*#__PURE__*/React.createElement(Demo, {
    code: `<div class="input-group">
  <span class="input-group-text"><fn-icon icon="ph-magnifying-glass"></fn-icon></span>
  <input class="form-control" placeholder="Search shifts">
</div>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3"
  }, /*#__PURE__*/React.createElement(FnInput, {
    prefix: /*#__PURE__*/React.createElement(Ph, {
      name: "magnifying-glass"
    }),
    placeholder: "Search shifts"
  }), /*#__PURE__*/React.createElement(FnInput, {
    prefix: "$",
    suffix: "USD",
    placeholder: "0.00"
  }), /*#__PURE__*/React.createElement(FnInput, {
    prefix: /*#__PURE__*/React.createElement(Ph, {
      name: "user"
    }),
    placeholder: "Employee name"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Textarea"), /*#__PURE__*/React.createElement(Demo, {
    code: `<textarea class="form-control" rows="4" placeholder="Notes"></textarea>`
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "notes",
    label: "Shift notes",
    help: "Visible to the assigned employee and managers."
  }, /*#__PURE__*/React.createElement(FnTextarea, {
    placeholder: "Add notes, special instructions, or context\u2026",
    rows: 3
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Supported types (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FN_INPUT_TYPES"), ")"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, ["TEXT", "PASSWORD", "STRING", "PHONENUMBER", "NUMBER", "CURRENCY", "FLOAT", "DOUBLE", "EMAIL", "BOOL", "TEXTAREA", "LOOKUP", "MULTILOOKUP", "COLOR", "TEMPERATURE"].map(t => /*#__PURE__*/React.createElement(FnTag, {
    key: t,
    color: "secondary"
  }, t)))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Validation directives"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      lineHeight: 1.8,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FnInputValidator"), " \u2014 attach for inline error rendering."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fnNumberDirective"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fnCurrencyDirective"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fnTemperatureDirective"), " \u2014 restrict input types (in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FnCoreModule"), ")."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fnAutoFocus"), " \u2014 focus on init."), /*#__PURE__*/React.createElement("li", null, "Regex constants in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fn-form.constant.ts"), ": ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "EMAIL_REGEX"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FLOAT_NUM_REGEX"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "INT_NUM_REGEX"), ". Reuse \u2014 never write new regex."))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Every input inside .form-group is auto-associated by A11yFormFieldDirective via aria-labelledby. Keep the <label> as a sibling inside .form-group.", "Required fields announce 'required' to screen readers via aria-required='true'.", "Errors render with role='alert' and are referenced by aria-describedby on the input.", "Disabled state never communicates information via color alone — it pairs with reduced opacity + the not-allowed cursor."]
  }));
}

/* =============================== SELECT =================================== */
function ViewSelect() {
  const employeeTypes = [{
    id: 1,
    name: "Assistant Manager"
  }, {
    id: 2,
    name: "Crew"
  }, {
    id: 3,
    name: "Manager"
  }, {
    id: 4,
    name: "Shift Manager"
  }];
  const sites = [{
    id: 1,
    name: "Riverside Bistro"
  }, {
    id: 2,
    name: "Downtown Grill"
  }, {
    id: 3,
    name: "Lakeside Café"
  }, {
    id: 4,
    name: "Summit Tap Room"
  }, {
    id: 5,
    name: "Eastside Pizzeria"
  }];
  const [empType, setEmpType] = useState(2);
  const [siteIds, setSiteIds] = useState([]);
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Select",
    selector: "<fn-select> / <fn-multi-select>",
    ngModule: "FnSelectModule",
    summary: "Single + multi select backed by @ng-select/ng-select. 38px trigger height, 6px radius, brand maroon caret. Selected option in the menu is bold (no background tint)."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "States"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Resting \xB7 Opened \xB7 Multi (with empty) \xB7 Disabled."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2",
    style: {
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 130
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "resting"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "emp-type-1",
    label: "Employee Type"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: employeeTypes,
    value: empType,
    onChange: setEmpType,
    placeholder: "Select\u2026"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 330
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "opened"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "emp-type-2",
    label: "Employee Type"
  }, /*#__PURE__*/React.createElement(SelectAlwaysOpen, {
    items: employeeTypes,
    value: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 160
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "multi \xB7 no items"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "sites",
    label: "Assign Site(s)"
  }, /*#__PURE__*/React.createElement(SelectAlwaysOpen, {
    items: [],
    multi: true,
    placeholder: "Select Site(s)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 130
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "disabled"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "order-type",
    label: "Order Type"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Pickup"
    }, {
      id: 2,
      name: "Delivery"
    }],
    value: 1,
    disabled: true,
    placeholder: "Select\u2026"
  })))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Live multi-select"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-multi-select
  [items]="sites"
  bindLabel="name" bindValue="id"
  [(ngModel)]="selectedSiteIds"
  placeholder="Select Site(s)">
</fn-multi-select>`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "sites-live",
    label: "Assign Site(s)",
    help: "Click to open. Pick multiple \u2014 they appear as chips inside the trigger."
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: sites,
    value: siteIds,
    onChange: setSiteIds,
    multi: true,
    placeholder: "Select Site(s)"
  })))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<fn-select
  [items]="employeeTypes"
  bindLabel="name" bindValue="id"
  [(ngModel)]="form.empType"
  placeholder="Select…">
</fn-select>

<fn-multi-select
  [items]="sites"
  bindLabel="name" bindValue="id"
  [(ngModel)]="form.siteIds"
  placeholder="Select Site(s)">
</fn-multi-select>`)
    }
  })), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["fn-select passes [labelForId] to ng-select so the internal search input gets autocomplete='off' (fixes axe autocomplete-valid).", "Empty state ('No_Items_Found') has role='option' aria-disabled='true' — required for aria-required-children on role='listbox'.", "Keyboard: Enter/Space to open, Esc to close, arrow keys to navigate options, Tab to commit & move.", "Selected option is communicated to AT via aria-selected='true' (not just bold styling) — meets WCAG 1.4.1 (color not sole means)."]
  }));
}

/* Helper — shows the select with its menu permanently visible, for the spec sheet */
function SelectAlwaysOpen({
  items,
  value,
  multi,
  placeholder = "Select…"
}) {
  const selected = !multi && items.find(it => it.id === value);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fn-select is-open",
    "aria-expanded": "true",
    role: "combobox",
    tabIndex: -1
  }, multi ? /*#__PURE__*/React.createElement("span", {
    className: "placeholder"
  }, placeholder) : selected ? /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, selected.name) : /*#__PURE__*/React.createElement("span", {
    className: "placeholder"
  }, placeholder), /*#__PURE__*/React.createElement("span", {
    className: "caret caret-main",
    style: {
      marginLeft: "auto",
      transform: "rotate(180deg)"
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 4.5L6 7.5L9 4.5",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "fn-select-menu",
    role: "listbox",
    style: {
      position: "static",
      marginTop: 4
    }
  }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    role: "option",
    "aria-disabled": "true",
    className: "menu-empty"
  }, "No_Items_Found") : items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    role: "option",
    "aria-selected": it.id === value,
    className: `option ${it.id === value ? "selected" : ""}`
  }, /*#__PURE__*/React.createElement("span", null, it.name)))));
}

/* =============================== SWITCH =================================== */
function ViewSwitch() {
  const [on, setOn] = useState(true);
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Switch",
    selector: "<fn-switch>",
    ngModule: "FnSwitchModule",
    summary: "Two-state toggle with keyboard support (\u2190/\u2192/Space/Enter). Supports lg/md/sm sizes and custom on/off templates."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "States & sizes"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-switch [(ngModel)]="prefs.notify" fnSize="lg"></fn-switch>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(FnSwitch, {
    size: "sm",
    checked: on,
    onChange: setOn,
    ariaLabel: "Notifications"
  }), /*#__PURE__*/React.createElement(FnSwitch, {
    size: "md",
    checked: on,
    onChange: setOn,
    ariaLabel: "Notifications"
  }), /*#__PURE__*/React.createElement(FnSwitch, {
    size: "lg",
    checked: on,
    onChange: setOn,
    ariaLabel: "Notifications"
  }), /*#__PURE__*/React.createElement(FnSwitch, {
    size: "md",
    checked: false,
    disabled: true,
    ariaLabel: "Disabled off"
  }), /*#__PURE__*/React.createElement(FnSwitch, {
    size: "md",
    checked: true,
    disabled: true,
    ariaLabel: "Disabled on"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Inline with label"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      gap: 14,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Shift reminders",
    desc: "Push notification 30min before your shift"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Manager approvals",
    desc: "Email me when shift swaps need review"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Late-clock-in alert",
    desc: "Page me if anyone is >15min late",
    defaultOn: true
  }))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["role='switch' + aria-checked. Foundation's component does this for you.", "Always associate with a visible label — either as <label> sibling or via ariaLabel.", "Disabled switches keep tab-stop removed but maintain visual contrast."]
  }));
}
function SwitchRow({
  label,
  desc,
  defaultOn = false
}) {
  const [on, setOn] = useState(defaultOn);
  const id = useMemo(() => "sw-" + Math.random().toString(36).slice(2, 7), []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "10px 14px",
      border: "1px solid var(--border-default-color)",
      borderRadius: 6,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    id: id,
    style: {
      fontWeight: 500,
      fontSize: 13,
      display: "block",
      marginBottom: 2
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11.5
    }
  }, desc)), /*#__PURE__*/React.createElement(FnSwitch, {
    checked: on,
    onChange: setOn,
    ariaLabelledBy: id
  }));
}

/* =============================== CHECKBOX / RADIO ========================= */
function ViewCheckbox() {
  const [opts, setOpts] = useState({
    a: true,
    b: false,
    c: true
  });
  const [pick, setPick] = useState("week");
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Checkbox & Radio",
    selector: "<fn-checkbox>, <fn-input-radio>, <fn-checkbox-filter>",
    ngModule: "FnInputModule",
    summary: "Standard checkbox + grouped radio + checkbox-filter (multi-select filter list)."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Checkbox"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-checkbox id="agree" name="agree" label="I accept the terms" [(ngModel)]="form.agree"></fn-checkbox>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(FnCheckbox, {
    checked: opts.a,
    onChange: v => setOpts({
      ...opts,
      a: v
    }),
    label: "Allow weekend shifts"
  }), /*#__PURE__*/React.createElement(FnCheckbox, {
    checked: opts.b,
    onChange: v => setOpts({
      ...opts,
      b: v
    }),
    label: "Receive SMS notifications"
  }), /*#__PURE__*/React.createElement(FnCheckbox, {
    checked: opts.c,
    onChange: v => setOpts({
      ...opts,
      c: v
    }),
    label: "Auto-clock-out at end of shift"
  }), /*#__PURE__*/React.createElement(FnCheckbox, {
    checked: false,
    disabled: true,
    label: "Disabled option"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Radio group"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-input-radio name="tier" [options]="[{id:'day',label:'Day'},{id:'week',label:'Week'},{id:'month',label:'Month'}]" [(ngModel)]="form.range"></fn-input-radio>`
  }, /*#__PURE__*/React.createElement(FnRadioGroup, {
    name: "range",
    value: pick,
    onChange: setPick,
    options: [{
      id: "day",
      label: "Day"
    }, {
      id: "week",
      label: "Week"
    }, {
      id: "month",
      label: "Month"
    }, {
      id: "quarter",
      label: "Quarter",
      disabled: true
    }]
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Checkbox filter (list)"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-checkbox-filter [config]="filterCfg" (selectionChange)="onFilter($event)"></fn-checkbox-filter>`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280,
      padding: 12,
      border: "1px solid var(--border-default-color)",
      borderRadius: 6,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600
    }
  }, "Filter by role"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 11,
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "Clear")), /*#__PURE__*/React.createElement(FnInput, {
    rounded: true,
    placeholder: "Search",
    prefix: /*#__PURE__*/React.createElement(Ph, {
      name: "magnifying-glass",
      size: "12px"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      gap: 8,
      marginTop: 10
    }
  }, ["Server", "Bartender", "Line cook", "Host", "Dishwasher"].map((r, i) => /*#__PURE__*/React.createElement(FnCheckbox, {
    key: r,
    checked: i < 2,
    onChange: () => {},
    label: /*#__PURE__*/React.createElement("span", null, r, " ", /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, "(", [12, 8, 7, 5, 4][i], ")"))
  }))))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Checkbox + radio inside .form-group get auto-associated labels via A11yFormFieldDirective.", "Radio group uses role='radiogroup' with arrow-key navigation; first radio is the focus target.", "Hit target is at least 16×16px for the indicator + 8px gap to the label — total target ≥36px."]
  }));
}

/* =============================== DATE ===================================== */
function ViewDate() {
  const [single, setSingle] = useState(new Date(2026, 4, 27));
  const [range, setRange] = useState({
    from: new Date(2019, 11, 10),
    to: new Date(2019, 11, 17)
  });
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Date pickers",
    selector: "<fn-date-picker>, <fn-date-range-picker>",
    ngModule: "FnDatePickerModule \xB7 FnDateRangeModule",
    summary: "Two flavors. Single = pill-shaped btn-group with prev/next chevrons either side of the date trigger; opens a single-month calendar. Range = pill input with calendar prefix + drop caret; opens a dual-month calendar with Cancel/Apply pill buttons in the footer."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Single date picker \u2014 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<fn-date-picker>")), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Three-button pill: prev day, calendar trigger (with date + drop caret), next day. The two chevron buttons step the date by one day. The center button opens the calendar."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2",
    style: {
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 100
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "resting"), /*#__PURE__*/React.createElement(FnDatePicker, {
    value: single,
    onChange: setSingle
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 100
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "hide prev/next"), /*#__PURE__*/React.createElement(FnDatePicker, {
    value: single,
    onChange: setSingle,
    hideNextPrev: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      marginTop: 16,
      padding: 20,
      minHeight: 440,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--iron)",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Opened"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 420
    }
  }, /*#__PURE__*/React.createElement(FnDatePickerOpen, {
    value: single,
    onChange: setSingle
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<!-- Default — with prev/next chevrons -->
<fn-date-picker
  [(ngModel)]="form.shiftDate"
  [hideNextPrev]="false">
</fn-date-picker>

<!-- Trigger only (no prev/next) -->
<fn-date-picker
  [(ngModel)]="form.shiftDate"
  [hideNextPrev]="true">
</fn-date-picker>`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2",
    style: {
      marginTop: 48
    }
  }, "Date range picker \u2014 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<fn-date-range-picker>")), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Single pill input shows the range as ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "YYYY/MM/DD - YYYY/MM/DD"), ". Opening reveals two months side-by-side. Day headers use ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--theme)"), "; the range fill is ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--theme-fade)"), "; start/end days are solid theme circles. Footer has a red Cancel + green Apply pill."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2",
    style: {
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 100
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "resting"), /*#__PURE__*/React.createElement(FnDateRangePicker, {
    value: range,
    onChange: setRange
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 100
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "disabled"), /*#__PURE__*/React.createElement(FnDateRangePicker, {
    value: range,
    disabled: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      marginTop: 16,
      padding: 20,
      minHeight: 460,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--iron)",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      fontWeight: 600,
      marginBottom: 12
    }
  }, "Opened \u2014 dual-month with range"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 440
    }
  }, /*#__PURE__*/React.createElement(FnDateRangeOpen, {
    from: new Date(2019, 11, 10),
    to: new Date(2019, 11, 17)
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<fn-date-range-picker
  [(ngModel)]="range"
  [fnMinDate]="minDate" [fnMaxDate]="maxDate"
  [markDisabled]="isDisabled">
</fn-date-range-picker>`)
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("b", null, "Format tokens"), " live in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fn-date-format.constant.ts"), ". Always use ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "date.formatter(FN_DATE_FORMAT.MM_DD_YYYY)"), " \u2014 never hand-formatted strings."), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Trigger has aria-haspopup='dialog' and aria-expanded; the popup uses role='dialog' with aria-label.", "Calendar grid is role='grid' with each day cell role='gridcell' and aria-selected on the chosen day.", "Keyboard: arrow keys navigate days, PgUp/PgDn month, Shift+PgUp/PgDn year, Home/End to week edges, Enter selects.", "Range picker: first click sets the start; second click sets the end. Apply commits; Cancel reverts."]
  }));
}

/* Always-open helpers for the spec sheet */
function FnDatePickerOpen({
  value,
  onChange
}) {
  const [date, setDate] = useState(value);
  const [vm, setVm] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  return /*#__PURE__*/React.createElement("div", {
    className: "single-date-picker",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-group btn-group-round",
    role: "group"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary dp-prev",
    "aria-label": "Previous date"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 4L6 8L10 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary dp-center"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 16 16",
    fill: "none",
    className: "dp-cal-icon"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "3",
    width: "12",
    height: "11",
    rx: "1.5",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 1.5V4M11 1.5V4M2 7H14",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dp-date"
  }, date.getDate(), "/", date.getMonth() + 1, "/", date.getFullYear()), /*#__PURE__*/React.createElement("span", {
    className: "dp-drop",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "5",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary dp-next",
    "aria-label": "Next date"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 4L10 8L6 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement(CalendarPopup, {
    viewMonth: vm,
    setViewMonth: setVm,
    selected: date,
    onPick: d => {
      setDate(d);
      onChange && onChange(d);
    }
  }));
}
function FnDateRangeOpen({
  from,
  to
}) {
  const [leftMonth, setLeftMonth] = useState(new Date(from.getFullYear(), from.getMonth(), 1));
  return /*#__PURE__*/React.createElement("div", {
    className: "date-range-picker-input is-open",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "drp-cal-prefix",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "3",
    width: "12",
    height: "11",
    rx: "1.5",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 1.5V4M11 1.5V4M2 7H14",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("input", {
    className: "form-control input-round",
    value: `${from.getFullYear()}/${String(from.getMonth() + 1).padStart(2, "0")}/${String(from.getDate()).padStart(2, "0")} - ${to.getFullYear()}/${String(to.getMonth() + 1).padStart(2, "0")}/${String(to.getDate()).padStart(2, "0")}`,
    readOnly: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "drp-drop",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "5",
    viewBox: "0 0 10 6",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 6L0 0H10L5 6Z"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "drp-popup",
    style: {
      top: "calc(100% + 8px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "drp-months"
  }, /*#__PURE__*/React.createElement(DRMonth, {
    which: "left",
    month: leftMonth,
    setMonth: setLeftMonth,
    from: from,
    to: to,
    pick: () => {}
  }), /*#__PURE__*/React.createElement(DRMonth, {
    which: "right",
    month: new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1),
    setMonth: d => setLeftMonth(new Date(d.getFullYear(), d.getMonth() - 1, 1)),
    from: from,
    to: to,
    pick: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    className: "drp-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger btn-xs btn-round",
    style: {
      width: 96
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-success btn-xs btn-round",
    style: {
      width: 96
    }
  }, "Apply"))));
}

/* =============================== TIME ===================================== */
function ViewTime() {
  const [single, setSingle] = useState("12:00a");
  const [duration, setDuration] = useState("00:00");
  const [range, setRange] = useState("12:00a-2:00p");
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Time picker",
    selector: "<fn-time-picker> / <fn-multi-time-picker> / <fn-duration-time-picker>",
    ngModule: "FnTimePickerModule",
    summary: "Three sibling components in the time/ folder. All share the .fn-time-picker-search markup: <input class='form-control'> + <i class='fn-global-dropdownArrow'> + <ul class='fn-time-picker-ul'>. Active dropdown item paints var(--theme) with white text. Single picker can show a '+1 Day' badge when the shift crosses midnight."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Three variants"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3",
    style: {
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "single \xB7 12:00a"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "t-single",
    label: "Start time"
  }, /*#__PURE__*/React.createElement(FnTime, {
    mode: "single",
    value: single,
    onChange: setSingle,
    ariaLabel: "Start time"
  })), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11,
      marginTop: 6,
      fontFamily: "var(--ds-mono)"
    }
  }, "value: ", single)), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "duration \xB7 00:00"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "t-duration",
    label: "Break duration",
    help: "Type '00:2' to filter the dropdown."
  }, /*#__PURE__*/React.createElement(FnTime, {
    mode: "duration",
    value: duration,
    onChange: setDuration,
    ariaLabel: "Break duration"
  })), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11,
      marginTop: 6,
      fontFamily: "var(--ds-mono)"
    }
  }, "value: ", duration)), /*#__PURE__*/React.createElement("div", {
    className: "ds-preview surface",
    style: {
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "preview-label"
  }, "range \xB7 12:00a-2:00P"), /*#__PURE__*/React.createElement(FormGroup, {
    id: "t-range",
    label: "Shift window"
  }, /*#__PURE__*/React.createElement(FnTime, {
    mode: "range",
    value: range,
    onChange: setRange,
    ariaLabel: "Shift window"
  })), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11,
      marginTop: 6,
      fontFamily: "var(--ds-mono)"
    }
  }, "value: ", range))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Spanning midnight \u2014 single picker"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "When the parent shift form computes that an end-time crosses midnight, the picker shows a ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "+1 Day"), " badge at the right edge \u2014 driven by the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "isNextDay"), " input."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 240
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "t-next",
    label: "End time"
  }, /*#__PURE__*/React.createElement(FnTime, {
    mode: "single",
    value: "2:00a",
    isNextDay: true,
    onChange: () => {}
  })))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<!-- Single time (12h or 24h via isMilitaryTime) -->
<fn-time-picker
  [(ngModel)]="shift.start"
  [isMilitaryTime]="false"
  [isNextDay]="endsTomorrow"
  placeholder="12:00a">
</fn-time-picker>

<!-- Duration (24h, no meridiem) -->
<fn-duration-time-picker
  [(ngModel)]="shift.break"
  placeholder="00:00">
</fn-duration-time-picker>

<!-- Range (one input, "start-end" string) -->
<fn-multi-time-picker
  [(ngModel)]="shift.window"
  placeholder="12:00a-2:00p">
</fn-multi-time-picker>`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props (common to all three)"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "value / ngModel",
      type: "string",
      desc: "Time string. Format depends on mode: '12:00a' (single), '00:00' (duration), '12:00a-2:00p' (range)."
    }, {
      name: "isMilitaryTime",
      type: "boolean",
      def: "false",
      desc: "fn-time-picker only — switches the value format and dropdown to 24-hour."
    }, {
      name: "isNextDay",
      type: "boolean",
      def: "false",
      desc: "fn-time-picker only — renders the '+1 Day' badge inside the trigger."
    }, {
      name: "isDisabled",
      type: "boolean",
      def: "false",
      desc: "Disables typing and the dropdown."
    }, {
      name: "placeholder",
      type: "string",
      desc: "Shown when no value."
    }, {
      name: "appendTo",
      type: "string (CSS selector)",
      desc: "Where to append the dropdown <ul> — for use inside scrollable containers."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Trigger is a real <input class='form-control'> — supports direct typing, screen-reader announcement of value, and the global focus ring.", "Caret icon is the custom-font glyph fn-global-dropdownArrow — auto-rotates 180° when the dropdown is open via the .fn-open-dropdown modifier class.", "Keyboard: type to filter, ArrowUp/Down to move the active option, Enter to commit, Tab/Escape to close.", "The dropdown <ul> has role='listbox' and each <li> is role='option' with aria-selected on the current value.", "Active highlight uses both color (var(--theme) bg + white text) AND aria-selected — meets WCAG 1.4.1."]
  }));
}

/* =============================== TEL / COLOR / FILES / EDITOR / RATING ==== */
const TEL_COUNTRIES = [{
  c: "af",
  name: "Afghanistan",
  dial: "+93"
}, {
  c: "ax",
  name: "Åland Islands",
  dial: "+358"
}, {
  c: "al",
  name: "Albania",
  dial: "+355"
}, {
  c: "dz",
  name: "Algeria",
  dial: "+213"
}, {
  c: "as",
  name: "American Samoa",
  dial: "+1"
}, {
  c: "ad",
  name: "Andorra",
  dial: "+376"
}, {
  c: "in",
  name: "India",
  dial: "+91"
}, {
  c: "gb",
  name: "United Kingdom",
  dial: "+44"
}, {
  c: "us",
  name: "United States",
  dial: "+1"
}, {
  c: "ca",
  name: "Canada",
  dial: "+1"
}, {
  c: "au",
  name: "Australia",
  dial: "+61"
}, {
  c: "de",
  name: "Germany",
  dial: "+49"
}, {
  c: "fr",
  name: "France",
  dial: "+33"
}, {
  c: "es",
  name: "Spain",
  dial: "+34"
}, {
  c: "it",
  name: "Italy",
  dial: "+39"
}, {
  c: "jp",
  name: "Japan",
  dial: "+81"
}, {
  c: "cn",
  name: "China",
  dial: "+86"
}, {
  c: "br",
  name: "Brazil",
  dial: "+55"
}, {
  c: "mx",
  name: "Mexico",
  dial: "+52"
}, {
  c: "ae",
  name: "United Arab Emirates",
  dial: "+971"
}];
function ViewTel() {
  const [country, setCountry] = useState(TEL_COUNTRIES.find(x => x.c === "us"));
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const filtered = q ? TEL_COUNTRIES.filter(x => x.name.toLowerCase().includes(q.toLowerCase()) || x.dial.includes(q)) : TEL_COUNTRIES;
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Phone input",
    selector: "<fn-tel-input>",
    ngModule: "FnTelInputModule",
    summary: "Phone input with a searchable country-code dropdown. Wraps intl-tel-input \u2014 clicking the flag opens a filterable list of countries with flag + name + dial code."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-tel-input [(ngModel)]="form.phone" [defaultCountry]="'us'" [enableSearch]="true"></fn-tel-input>`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "tel",
    label: "Phone"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      position: "relative"
    },
    ref: ref
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    onClick: () => setOpen(v => !v),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 30,
      padding: "0 10px",
      border: "1px solid var(--input-border-color)",
      borderRight: 0,
      borderRadius: "4px 0 0 4px",
      background: "var(--input-bg)",
      color: "var(--body-textColor)",
      fontSize: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://flagcdn.com/${country.c}.svg`,
    alt: "",
    style: {
      width: 20,
      height: 14,
      borderRadius: 2,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--ds-mono)"
    }
  }, country.dial), /*#__PURE__*/React.createElement(Ph, {
    name: "caret-down",
    size: "10px",
    style: {
      color: "var(--iron)"
    }
  })), /*#__PURE__*/React.createElement(FnInput, {
    placeholder: "Phone Number",
    style: {
      borderRadius: "0 4px 4px 0"
    }
  }), open && /*#__PURE__*/React.createElement("div", {
    className: "fn-select-menu",
    role: "listbox",
    style: {
      position: "absolute",
      top: 36,
      left: 0,
      right: 0,
      padding: 0,
      maxHeight: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "menu-search",
    style: {
      position: "sticky",
      top: 0,
      background: "var(--bg-primary)",
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(FnInput, {
    rounded: true,
    prefix: /*#__PURE__*/React.createElement(Ph, {
      name: "magnifying-glass",
      size: "12px"
    }),
    placeholder: "Search",
    value: q,
    onChange: e => setQ(e.target.value),
    autoFocus: true
  })), filtered.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.c + x.name,
    role: "option",
    "aria-selected": country.c === x.c,
    className: `option ${country.c === x.c ? "selected" : ""}`,
    onClick: () => {
      setCountry(x);
      setOpen(false);
      setQ("");
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://flagcdn.com/${x.c}.svg`,
    alt: "",
    style: {
      width: 22,
      height: 15,
      borderRadius: 2,
      objectFit: "cover",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, x.name), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--ds-mono)",
      fontSize: 12
    }
  }, x.dial))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "menu-empty"
  }, "No countries found")))))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Country trigger is a real <button> with aria-haspopup='listbox' + aria-expanded.", "The list is role='listbox' with role='option' rows; the selected country gets aria-selected='true'.", "Search input is auto-focused on open; Esc / outside-click closes the dropdown.", "Flags are decorative (alt='') — the country name + dial code carry the meaning."]
  }));
}
function ViewColorPicker() {
  const [color, setColor] = useState("#005bc4");
  const swatches = ["#005bc4", "#1e7e34", "#bf5700", "#fdc91e", "#c62828", "#0078a8", "#7b42ff", "#4b5563"];
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Color picker",
    selector: "<fn-color-picker>",
    ngModule: "FnColorPickerModule",
    summary: "Wraps ngx-color-picker. Clicking the swatch opens a popover with a saturation/value box, a hue slider, the current-color preview, and Cancel / OK. Use for theming, tag colors, calendar event colors."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-color-picker [id]="'color-picker'" [(ngModel)]="favColor" name="color"></fn-color-picker>`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "cp",
    label: "Event color"
  }, /*#__PURE__*/React.createElement(FnColorPicker, {
    value: color,
    onChange: setColor
  })))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Preset swatches"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, swatches.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setColor(c),
    style: {
      width: 26,
      height: 26,
      borderRadius: 6,
      background: c,
      border: c === color ? "2px solid var(--body-textColor)" : "1px solid var(--border-default-color)",
      cursor: "pointer"
    },
    "aria-label": `Pick ${c}`
  })), /*#__PURE__*/React.createElement("code", {
    className: "ds-inline",
    style: {
      marginLeft: 8
    }
  }, color))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Trigger swatch is a <button> with aria-label exposing the current hex; aria-haspopup='dialog'.", "Saturation box + hue slider are keyboard-operable (arrow keys nudge); Esc closes, OK commits.", "Selected color value is always shown as text (hex) — never communicated by the swatch alone."]
  }));
}

/* HSV ↔ HEX helpers */
function hsvToHex(h, s, v) {
  s /= 100;
  v /= 100;
  const k = n => (n + h / 60) % 6;
  const f = n => v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));
  const to = x => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${to(f(5))}${to(f(3))}${to(f(1))}`;
}
function hexToHsv(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255,
    g = parseInt(hex.slice(3, 5), 16) / 255,
    b = parseInt(hex.slice(5, 7), 16) / 255;
  if ([r, g, b].some(Number.isNaN)) return {
    h: 210,
    s: 100,
    v: 77
  };
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = (g - b) / d % 6;else if (max === g) h = (b - r) / d + 2;else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return {
    h,
    s: max ? d / max * 100 : 0,
    v: max * 100
  };
}
function FnColorPicker({
  value = "#005bc4",
  onChange
}) {
  const [open, setOpen] = useState(false);
  const init = hexToHsv(value);
  const [hsv, setHsv] = useState(init);
  const [draft, setDraft] = useState(value);
  const ref = useRef();
  const satRef = useRef();
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function key(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    setDraft(hsvToHex(hsv.h, hsv.s, hsv.v));
  }, [hsv]);
  function pickSat(e) {
    const rect = satRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setHsv(p => ({
      ...p,
      s: x * 100,
      v: (1 - y) * 100
    }));
  }
  function dragSat(e) {
    e.preventDefault();
    pickSat(e);
    const move = ev => pickSat(ev);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "block"
    },
    ref: ref
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-label": `Color ${value}`,
    onClick: () => {
      setHsv(hexToHsv(value));
      setOpen(v => !v);
    },
    style: {
      width: 84,
      height: 36,
      borderRadius: 6,
      background: value,
      border: "1px solid var(--input-border-color)",
      cursor: "pointer"
    }
  }), open && /*#__PURE__*/React.createElement("div", {
    className: "cp-popover",
    role: "dialog",
    "aria-label": "Choose color",
    style: {
      position: "absolute",
      top: 44,
      left: 0,
      zIndex: 60,
      width: 320,
      background: "var(--bg-primary)",
      border: "1px solid var(--border-default-color)",
      borderRadius: 12,
      boxShadow: "var(--shadow)",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: satRef,
    onMouseDown: dragSat,
    style: {
      position: "relative",
      height: 170,
      borderRadius: 8,
      cursor: "crosshair",
      background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `${hsv.s}%`,
      top: `${100 - hsv.v}%`,
      width: 16,
      height: 16,
      marginLeft: -8,
      marginTop: -8,
      borderRadius: "50%",
      border: "2px solid #fff",
      boxShadow: "0 0 0 1px rgba(0,0,0,.3)",
      background: draft
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: draft,
      border: "1px solid var(--border-default-color)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      height: 14,
      borderRadius: 999,
      background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "360",
    value: hsv.h,
    onChange: e => setHsv(p => ({
      ...p,
      h: +e.target.value
    })),
    "aria-label": "Hue",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      margin: 0,
      opacity: 0,
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `${hsv.h / 360 * 100}%`,
      top: "50%",
      width: 16,
      height: 16,
      marginLeft: -8,
      marginTop: -8,
      borderRadius: "50%",
      border: "2px solid #fff",
      boxShadow: "0 0 0 1px rgba(0,0,0,.3)",
      background: `hsl(${hsv.h} 100% 50%)`,
      pointerEvents: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(FnInput, {
    value: draft,
    onChange: e => {
      setDraft(e.target.value);
      if (/^#[0-9a-f]{6}$/i.test(e.target.value)) setHsv(hexToHsv(e.target.value));
    },
    style: {
      width: 110,
      fontFamily: "var(--ds-mono)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "danger btn-sm btn-round",
    text: "Cancel",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-sm btn-round",
    text: "OK",
    onClick: () => {
      onChange?.(draft);
      setOpen(false);
    }
  }))));
}
function ViewFiles() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "File upload",
    selector: "<fn-img-upload>, <fn-files-upload>",
    ngModule: "FnImgUploadModule, FnFilesUploadModule",
    summary: "Image and multi-file upload with preview, drag-and-drop, and progress."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Image upload"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-img-upload [(ngModel)]="employee.avatar" [maxSize]="2 * 1024 * 1024"></fn-img-upload>`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      padding: 24,
      border: "2px dashed var(--input-border-color)",
      borderRadius: 8,
      textAlign: "center",
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "image-square",
    weight: "duotone",
    size: "32px",
    style: {
      color: "var(--iron)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      marginTop: 8
    }
  }, "Drop image or click to browse"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11,
      marginTop: 2
    }
  }, "PNG or JPG up to 2MB"))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Multi-file with progress"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      marginBottom: 0
    }
  }, [{
    name: "Shift-schedule-week-12.pdf",
    size: "382 KB",
    progress: 100,
    done: true
  }, {
    name: "Employee-onboarding.docx",
    size: "1.4 MB",
    progress: 64
  }, {
    name: "Photos-staff-meeting.zip",
    size: "12.8 MB",
    progress: 28
  }].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "10px 14px",
      borderBottom: "1px solid var(--border-default-color)",
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: f.done ? "file-text" : "file",
    size: "20px",
    style: {
      color: f.done ? "var(--green)" : "var(--blue)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 8,
      fontSize: 11,
      color: "var(--iron)"
    }
  }, /*#__PURE__*/React.createElement("span", null, f.size), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, f.done ? "Uploaded" : `${f.progress}%`)), !f.done && /*#__PURE__*/React.createElement(FnProgress, {
    value: f.progress
  })), /*#__PURE__*/React.createElement("button", {
    className: "ds-iconbtn",
    "aria-label": "Remove"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "x"
  })))))));
}
function ViewEditor() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Rich text editor",
    selector: "<fn-text-editor>",
    ngModule: "FnTextEditorModule",
    summary: "Wraps suneditor. Used for shift notes, employee bios, release notes, FAQ content."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-text-editor [(ngModel)]="note.body" [config]="editorCfg"></fn-text-editor>`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default-color)",
      borderRadius: 6,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      padding: 6,
      borderBottom: "1px solid var(--border-default-color)",
      background: "var(--body-bg)",
      borderRadius: "6px 6px 0 0"
    }
  }, [["text-b", "Bold"], ["text-italic", "Italic"], ["text-underline", "Underline"]].map(([i, l]) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "ds-iconbtn",
    style: {
      height: 26,
      width: 26,
      padding: 0
    },
    "aria-label": l
  }, /*#__PURE__*/React.createElement(Ph, {
    name: i,
    size: "14px"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      background: "var(--border-default-color)",
      margin: "0 4px"
    }
  }), [["list-bullets", "Bullets"], ["list-numbers", "Numbered"]].map(([i, l]) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "ds-iconbtn",
    style: {
      height: 26,
      width: 26,
      padding: 0
    },
    "aria-label": l
  }, /*#__PURE__*/React.createElement(Ph, {
    name: i,
    size: "14px"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      background: "var(--border-default-color)",
      margin: "0 4px"
    }
  }), [["link", "Link"], ["image-square", "Image"], ["code", "Code"]].map(([i, l]) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "ds-iconbtn",
    style: {
      height: 26,
      width: 26,
      padding: 0
    },
    "aria-label": l
  }, /*#__PURE__*/React.createElement(Ph, {
    name: i,
    size: "14px"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      minHeight: 140,
      fontSize: 13,
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("b", null, "Weekend coverage"), " needs an extra server Fri/Sat 5\u201310pm."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Reach out to Priya or Marco \u2014 both opted in for extra shifts.")))));
}
function ViewRatingPage() {
  const [val, setVal] = useState(4);
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Rating",
    selector: "<fn-rating>",
    ngModule: "FnRatingModule",
    summary: "Star rating control. 1\u20135 (configurable). Read-only and interactive modes."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-rating [(ngModel)]="review.score" [max]="5"></fn-rating>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack"
  }, /*#__PURE__*/React.createElement(FnRating, {
    value: val,
    onChange: setVal
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Selected: ", val, " / 5"), /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, "Customer review:"), /*#__PURE__*/React.createElement(FnRating, {
    value: 5,
    readOnly: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "\"Fast service, super friendly host.\"")))));
}

/* =============================== TABLE ==================================== */
function ViewTable() {
  /* ============ DEMO 1 — Templates (matches the user's screenshot) ============ */
  const templates = useMemo(() => {
    const names = ["Summer Promo Banner", "Happy Hour Video", "Breakfast Menu Board", "Drive-Thru Special", "Weekend Deals Reel", "Kids Meal Spotlight", "Combo Offer Slide", "New Arrivals Showcase", "Loyalty Program Ad", "Grand Opening Banner", "Flash Sale Countdown", "Anniversary Promo", "Catering Highlight", "Pickup Special", "Family Pack Promo"];
    const sources = ["PCM", "EzCater", "PlumCater"];
    const dely = ["Pickup", "Delivery"];
    const pushed = ["Pushed", "No"];
    const paid = ["Paid", "Unpaid", "Refunded"];
    const thumbs = ["forest", "ocean", "flag", "road", "barn", "field", "tree", "beach"];
    return names.map((n, i) => ({
      id: `TPL-${String(i + 1).padStart(3, "0")}`,
      thumbnail: thumbs[i % thumbs.length],
      name: n,
      source: sources[i % sources.length],
      eventDate: `0${i % 5 + 3}/${10 + i * 2 % 18 || 10}/2025`,
      delivery: dely[i % 2],
      total: 120 + i * 73 % 500,
      pushed: pushed[i % 2],
      status: "Accepted",
      paid: paid[i % 3],
      enabled: i % 4 === 0
    }));
  }, []);

  // Tiny gradient SVG thumbnails (placeholders)
  function ThumbBox({
    kind
  }) {
    const palettes = {
      forest: ["#a3c5a8", "#5d8c63"],
      ocean: ["#5da3d4", "#2c5e8a"],
      flag: ["#c44e4e", "#dde2e9"],
      road: ["#d6a86b", "#7d553b"],
      barn: ["#8a6f50", "#c4ad88"],
      field: ["#b6c970", "#5e7a3a"],
      tree: ["#6b8a5b", "#3d5c30"],
      beach: ["#e7c895", "#8db2c4"]
    };
    const [c1, c2] = palettes[kind] || ["#9ca3af", "#4b5563"];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 22,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        display: "inline-block"
      },
      "aria-hidden": "true"
    });
  }
  const tplColumns = [{
    field: "id",
    header: "ID",
    minWidth: 110
  }, {
    field: "thumbnail",
    header: "Thumbnail",
    minWidth: 110,
    sortable: false,
    filterable: false,
    render: r => /*#__PURE__*/React.createElement(ThumbBox, {
      kind: r.thumbnail
    })
  }, {
    field: "name",
    header: "Template Name",
    minWidth: 200
  }, {
    field: "source",
    header: "Source",
    minWidth: 130
  }, {
    field: "eventDate",
    header: "Event Date",
    minWidth: 130
  }, {
    field: "delivery",
    header: "Delivery Method",
    minWidth: 150,
    render: r => /*#__PURE__*/React.createElement("span", {
      className: `pt-pill ${r.delivery === "Pickup" ? "solid-primary" : "solid-danger"}`
    }, r.delivery)
  }, {
    field: "total",
    header: "Total",
    align: "right",
    minWidth: 90,
    render: r => `$${r.total}`
  }, {
    field: "pushed",
    header: "Pushed",
    minWidth: 110,
    render: r => /*#__PURE__*/React.createElement("span", {
      className: `pt-pill ${r.pushed === "Pushed" ? "solid-success" : "outline-danger"}`
    }, r.pushed)
  }, {
    field: "status",
    header: "Status",
    minWidth: 110
  }, {
    field: "paid",
    header: "Paid",
    minWidth: 120,
    render: r => /*#__PURE__*/React.createElement("span", {
      className: `pt-pill ${r.paid === "Paid" ? "solid-success" : r.paid === "Refunded" ? "solid-warning" : "outline-muted"}`
    }, r.paid)
  }, {
    field: "actions",
    header: "Actions",
    minWidth: 140,
    sortable: false,
    filterable: false,
    render: r => /*#__PURE__*/React.createElement("div", {
      className: "ds-row",
      style: {
        gap: 6,
        justifyContent: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "pt-edit-btn",
      "aria-label": `Edit ${r.name}`
    }, /*#__PURE__*/React.createElement(PtEditIcon, null)), /*#__PURE__*/React.createElement("button", {
      className: "pt-edit-btn",
      "aria-label": `View ${r.name}`,
      style: {
        color: "var(--iron)"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "3",
      width: "12",
      height: "10",
      rx: "1.5",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }))), /*#__PURE__*/React.createElement(FnSwitch, {
      size: "md",
      checked: false,
      onChange: () => {},
      ariaLabel: `Toggle ${r.name}`
    }))
  }];

  /* ============ DEMO 2 — Dashboard (simpler, frozen left/right) ============ */
  const dashboards = [{
    id: 1,
    name: "Store Health"
  }, {
    id: 2,
    name: "Compliance"
  }, {
    id: 3,
    name: "Risk Analysis"
  }, {
    id: 4,
    name: "Time Loss"
  }, {
    id: 5,
    name: "DAR Dashboard"
  }];
  const dashColumns = [{
    field: "id",
    header: "Dashboard ID",
    frozen: "left",
    minWidth: 200,
    render: row => /*#__PURE__*/React.createElement("div", {
      className: "ds-row",
      style: {
        gap: 12,
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", null, row.id), /*#__PURE__*/React.createElement("button", {
      className: "pt-edit-btn",
      "aria-label": `Inline edit row ${row.id}`
    }, /*#__PURE__*/React.createElement(PtEditIcon, null)))
  }, {
    field: "name",
    header: "Friendly Name",
    align: "center",
    minWidth: 280
  }, {
    field: "actions",
    header: "Actions",
    align: "center",
    frozen: "right",
    minWidth: 140,
    sortable: false,
    filterable: false,
    render: row => /*#__PURE__*/React.createElement("button", {
      className: "pt-edit-btn",
      "aria-label": `Edit ${row.name}`
    }, /*#__PURE__*/React.createElement(PtEditIcon, null))
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Prime Table",
    selector: "<ag-prime-table>",
    ngModule: "FnPrimeTableModule",
    summary: "Workhorse table primitive built on PrimeNG p-table. Caption row with title + filters + actions + global search; sticky header with sortable & filterable columns + 3-dot menu; gridline-bordered cells; sticky paginator centered horizontally with rows-per-page selector at the right; optional vertical scroll. Frozen columns (left/right) stay pinned during horizontal + vertical scroll."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Full toolbar \u2014 templates list"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Matches the production templates listing: caption row with title (left) + Filter pill (center) + Add pill (right), a search input above the table, gridline-bordered cells with rich pill renderers (Delivery / Pushed / Paid), edit / view / toggle action cell, and the centered paginator."), /*#__PURE__*/React.createElement(FnPrimeTable, {
    columns: tplColumns,
    data: templates,
    uniqueKey: "id",
    pageSize: 11,
    search: true,
    caption: /*#__PURE__*/React.createElement("div", {
      className: "pt-caption"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pt-title"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pt-title-icon",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "2",
      width: "10",
      height: "12",
      rx: "1.5",
      stroke: "currentColor",
      strokeWidth: "1.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5.5 5h5M5.5 8h5M5.5 11h3",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinecap: "round"
    }))), "Templates Hello"), /*#__PURE__*/React.createElement("div", {
      className: "pt-center"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-outline-secondary btn-round"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none",
      style: {
        marginRight: 6
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 3h12l-4.5 6v4l-3 1.5V9L2 3z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    })), "Filter")), /*#__PURE__*/React.createElement("div", {
      className: "pt-right"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary btn-round"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      style: {
        marginRight: 6
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 3v10M3 8h10",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      fill: "none"
    })), "Add")))
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2",
    style: {
      marginTop: 40
    }
  }, "Three columns \xB7 frozen-left + frozen-right"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Dashboard ID frozen-left with an inline edit button. Actions frozen-right. Friendly Name unfrozen and centered. Hover a header to reveal the 3-dot menu."), /*#__PURE__*/React.createElement(FnPrimeTable, {
    columns: dashColumns,
    data: dashboards,
    uniqueKey: "id",
    pageSize: 15
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2",
    style: {
      marginTop: 40
    }
  }, "Column model"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "field",
      type: "string",
      required: true,
      desc: "Row property to render in this column."
    }, {
      name: "header",
      type: "string",
      required: true,
      desc: "Column header label (passed through fnTranslate)."
    }, {
      name: "frozen",
      type: "'left' | 'right' | undefined",
      desc: "Pins the column to the left or right edge with a 1px shadow seam."
    }, {
      name: "align",
      type: "'left' | 'center' | 'right'",
      def: "'left'",
      desc: "Body & header text alignment."
    }, {
      name: "sortable",
      type: "boolean",
      def: "true",
      desc: "When false, header skips the sort icon and click-to-sort."
    }, {
      name: "filterable",
      type: "boolean",
      def: "true",
      desc: "When false, the 3-dot menu hides Filter / Clear filter items."
    }, {
      name: "type",
      type: "'text' | 'numeric' | 'date' | 'boolean' | 'image' | 'currency'",
      def: "'text'",
      desc: "Pre-built renderers from foundation; override via render."
    }, {
      name: "render",
      type: "(row) => ReactNode",
      desc: "Custom cell template — use for avatars, status pills, action buttons."
    }, {
      name: "minWidth",
      type: "number",
      def: "150",
      desc: "Pixel minimum width."
    }, {
      name: "excludeFromSorting / Filtering / ColMenu",
      type: "boolean",
      desc: "Foundation flags to hide individual menu items."
    }]
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<ag-prime-table
  [data]="rows"
  [columns]="columns"
  [isPagginator]="true"
  [pTableScrollable]="false"
  [globalFilterFields]="['name','source']"
  [showDynamicColHandler]="false">

  <ng-template #headerLeftTemplate>
    <div class="pt-title"><i class="fn-global-template"></i> Templates Hello</div>
  </ng-template>
  <ng-template #headerRightTemplate>
    <fn-button [type]="'outline-secondary btn-round'" iconAddonBefore="ph-funnel" text="Filter"></fn-button>
    <fn-button [type]="'primary btn-round'" iconAddonBefore="ph-plus" text="Add" (click)="openCreate()"></fn-button>
  </ng-template>
</ag-prime-table>

// columns:
columns: AgPrimeTableColumn[] = [
  { field: 'id',        header: 'ID' },
  { field: 'thumbnail', header: 'Thumbnail', excludeFromSorting: true, excludeFromFiltering: true },
  { field: 'name',      header: 'Template Name' },
  { field: 'delivery',  header: 'Delivery Method', isTag: true, type: 'text' },
  { field: 'pushed',    header: 'Pushed',   isTag: true },
  { field: 'paid',      header: 'Paid',     isTag: true },
  { field: 'actions',   header: 'Actions',  excludeFromSorting: true, excludeFromFiltering: true,
                        isCustomTpl: true },
];`)
    }
  })), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Headers use <th scope='col'>; sortable ones expose aria-sort='ascending|descending|none'.", "3-dot menu is a <button> with aria-label='Column options for {header}'; the menu uses role='menu' + role='menuitem'.", "Action buttons inside cells use a11yIconBtn so they get aria-label='Edit {row.name}'.", "Scrollable bodies get tabindex='0' from A11yScrollableRegionService so keyboard users can scroll the region.", "Pagination is real <button>s inside role='group' aria-label='Pagination'; the current page gets aria-current='page'."]
  }));
}
function ViewGrid() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Editable grid",
    selector: "<fn-grid>",
    ngModule: "FnGridModule",
    summary: "Inline-edit grid for spreadsheet-like data entry. Supports per-cell types, validation, add/remove rows, column resize."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-grid [config]="gridCfg" [rows]="lines" (rowsChange)="onChange($event)"></fn-grid>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      border: 0,
      borderRadius: 0
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 32
    }
  }, "#"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Day"), /*#__PURE__*/React.createElement("th", null, "Start"), /*#__PURE__*/React.createElement("th", null, "End"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Hours"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Pay rate"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 32
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, [{
    i: 1,
    role: "Bartender",
    day: "Mon",
    s: "16:00",
    e: "23:00",
    h: 7,
    p: "$24.00"
  }, {
    i: 2,
    role: "Server",
    day: "Mon",
    s: "17:00",
    e: "23:00",
    h: 6,
    p: "$18.50"
  }, {
    i: 3,
    role: "Line cook",
    day: "Mon",
    s: "15:00",
    e: "22:00",
    h: 7,
    p: "$22.00"
  }].map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.i
  }, /*#__PURE__*/React.createElement("td", {
    className: "id"
  }, r.i), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: r.role,
    style: {
      height: 26,
      border: 0,
      padding: "0 6px"
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: r.day,
    style: {
      height: 26,
      border: 0,
      padding: "0 6px"
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: r.s,
    style: {
      height: 26,
      border: 0,
      padding: "0 6px",
      fontFamily: "var(--ds-mono)"
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: r.e,
    style: {
      height: 26,
      border: 0,
      padding: "0 6px",
      fontFamily: "var(--ds-mono)"
    }
  })), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.h), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, r.p), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "ds-iconbtn",
    "aria-label": `Remove row ${r.i}`,
    style: {
      height: 24,
      width: 24,
      padding: 0,
      color: "var(--red)"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "trash",
    size: "13px"
  }))))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-sm",
    iconAddonBefore: "plus",
    text: "Add row"
  }))))))));
}
function ViewPagination() {
  const [p, setP] = useState(3);
  const [size, setSize] = useState(15);
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Pagination",
    selector: "<fn-pagination>",
    ngModule: "FnPaginationModule",
    summary: "Standalone paginator. Identical UI to the prime-table footer \u2014 centered controls (\xAB \u2039 pages \u203A \xBB) with a circular active page in a light-theme wash, plus the page-size dropdown to the right. Use this on non-table screens (card grids, schedule weeks, custom lists)."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Default"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-pagination
  [currentPage]="page"
  [totalPage]="totalPages"
  [pageSize]="15"
  (changePage)="onPageChange($event)"
  (changePageSize)="onPageSizeChange($event)">
</fn-pagination>`
  }, /*#__PURE__*/React.createElement(FnPagination, {
    currentPage: p,
    totalPage: 12,
    onChange: setP,
    pageSize: size,
    onPageSizeChange: setSize
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Without page-size selector"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnPagination, {
    currentPage: p,
    totalPage: 12,
    onChange: setP,
    showPageSize: false
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Edge \u2014 single page (all disabled)"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnPagination, {
    currentPage: 1,
    totalPage: 1,
    onChange: () => {},
    pageSize: 15
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "currentPage",
      type: "number",
      required: true,
      desc: "1-indexed current page."
    }, {
      name: "totalPage",
      type: "number",
      required: true,
      desc: "Total page count."
    }, {
      name: "onChange",
      type: "(page: number) => void",
      desc: "Page navigation callback."
    }, {
      name: "pageSize",
      type: "number",
      desc: "Current rows-per-page. Omit to hide the selector."
    }, {
      name: "pageSizeOptions",
      type: "number[]",
      def: "[10, 15, 20, 30]",
      desc: "Choices in the rows-per-page selector."
    }, {
      name: "onPageSizeChange",
      type: "(size: number) => void",
      desc: "Rows-per-page change callback."
    }, {
      name: "showPageSize",
      type: "boolean",
      def: "true",
      desc: "Force-hide the page-size selector even when pageSize is provided."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["All buttons are real <button>s inside role='group' aria-label='Pagination'.", "Active page gets aria-current='page'; first/prev/next/last are aria-labeled.", "Disabled prev/first when on page 1; disabled next/last when on the last page — both via the native disabled attribute (not just opacity).", "Page-size <select> has aria-label='Rows per page' for screen-reader context."]
  }));
}
function ViewChart() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Charts",
    selector: "<fn-chart>",
    ngModule: "FnChartModule",
    summary: "amCharts 5 wrapper. Supported types: line, bar, column, pie, donut, gauge, sankey."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-chart [type]="'column'" [data]="weeklyHours" [config]="chartCfg"></fn-chart>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, "Hours by day \xB7 this week", /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontWeight: 400
    }
  }, "\u2014")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 320 140",
    style: {
      width: "100%",
      height: 140
    }
  }, [42, 58, 71, 64, 86, 92, 78].map((h, i) => /*#__PURE__*/React.createElement(Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("rect", {
    x: 20 + i * 42,
    y: 130 - h,
    width: 28,
    height: h,
    rx: 4,
    fill: "var(--blue)",
    opacity: i === 5 ? 1 : 0.7
  }), /*#__PURE__*/React.createElement("text", {
    x: 34 + i * 42,
    y: 130 - h - 6,
    fontSize: "9",
    textAnchor: "middle",
    fill: "var(--iron)",
    fontFamily: "var(--ds-mono)"
  }, h), /*#__PURE__*/React.createElement("text", {
    x: 34 + i * 42,
    y: 148,
    fontSize: "10",
    textAnchor: "middle",
    fill: "var(--iron)"
  }, ["M", "T", "W", "T", "F", "S", "S"][i]))))), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, "Roles distribution", /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontWeight: 400
    }
  }, "\u2014")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 140",
    style: {
      width: "100%",
      height: 140
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "70",
    r: "55",
    fill: "none",
    stroke: "var(--blue)",
    strokeWidth: "16",
    strokeDasharray: "120 346"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "70",
    r: "55",
    fill: "none",
    stroke: "var(--green)",
    strokeWidth: "16",
    strokeDasharray: "90 346",
    strokeDashoffset: "-120"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "70",
    r: "55",
    fill: "none",
    stroke: "var(--orange)",
    strokeWidth: "16",
    strokeDasharray: "70 346",
    strokeDashoffset: "-210"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "70",
    r: "55",
    fill: "none",
    stroke: "var(--cyan)",
    strokeWidth: "16",
    strokeDasharray: "66 346",
    strokeDashoffset: "-280"
  }), [["Server", "var(--blue)", "34%"], ["Cook", "var(--green)", "26%"], ["Bartender", "var(--orange)", "20%"], ["Other", "var(--cyan)", "20%"]].map(([n, c, p], i) => /*#__PURE__*/React.createElement(Fragment, {
    key: n
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "150",
    cy: 36 + i * 22,
    r: "5",
    fill: c
  }), /*#__PURE__*/React.createElement("text", {
    x: "162",
    y: 40 + i * 22,
    fontSize: "11",
    fill: "var(--body-textColor)"
  }, n, " ", /*#__PURE__*/React.createElement("tspan", {
    fill: "var(--iron)"
  }, p)))))))));
}

/* =============================== NAVIGATION =============================== */
function ViewBreadcrumb() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Breadcrumb",
    selector: "<fn-breadcrumb>",
    ngModule: "FnBreadcrumbModule",
    summary: "Page-level breadcrumb. Items ending in _Global / _Site are auto-filtered. The last item is unclickable."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-breadcrumb [menuItemArray]="crumbs" (menuClickEvent)="onCrumb($event)"></fn-breadcrumb>`
  }, /*#__PURE__*/React.createElement(FnBreadcrumb, {
    items: [{
      label: "Home"
    }, {
      label: "Schedules"
    }, {
      label: "Riverside Bistro"
    }, {
      label: "Week of Mar 11"
    }]
  })));
}
function ViewTabsPage() {
  const tabs = [{
    id: "one",
    label: "Tab One"
  }, {
    id: "two",
    label: "Tab Two"
  }, {
    id: "three",
    label: "Tab Three"
  }, {
    id: "four",
    label: "Tab Four"
  }];
  const panels = {
    one: /*#__PURE__*/React.createElement(React.Fragment, null, "Tab One Data"),
    two: /*#__PURE__*/React.createElement(React.Fragment, null, "Tab Two Data"),
    three: /*#__PURE__*/React.createElement(React.Fragment, null, "Tab Three Data"),
    four: /*#__PURE__*/React.createElement(React.Fragment, null, "Tab Four Data")
  };
  const [vt, setVt] = useState("one");
  const [ht, setHt] = useState("one");
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Tabs",
    selector: "<fn-tab>",
    ngModule: "FnTabModule",
    summary: "Two layouts driven by isVertical. Horizontal renders a pill-shaped row above the content; vertical renders a left-column list \u2014 the active tab gets a right-pointing arrow that snaps into the content panel. Both use var(--theme) for the active state with white text."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Vertical"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Tab labels stack on the left, content panel on the right. The active tab shows a small triangle pointing at the content."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      padding: 0,
      overflow: "hidden",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(FnTabs, {
    vertical: true,
    tabs: tabs,
    active: vt,
    onChange: setVt,
    panels: panels
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Horizontal"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Pill-shaped tabs sit in a row above the content panel. Hover shows a thin theme-color border; active fills with the theme color."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      padding: 0,
      overflow: "hidden",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(FnTabs, {
    tabs: tabs,
    active: ht,
    onChange: setHt,
    panels: panels
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Optional icon + count badge"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnTabs, {
    tabs: [{
      id: "all",
      label: "All",
      icon: "list"
    }, {
      id: "open",
      label: "Open",
      icon: "circle-dashed",
      count: 12
    }, {
      id: "review",
      label: "In review",
      icon: "eye",
      count: 4
    }, {
      id: "done",
      label: "Done",
      icon: "check-circle"
    }],
    active: ht,
    onChange: setHt
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<fn-tab
  [tabArray]="tabs"
  [selectIndex]="0"
  [isVertical]="false"
  [isMatStretchTabs]="false"
  [dataTemplate]="tabBody"
  (callback)="onTab($event)">
</fn-tab>

<ng-template #tabBody let-cfg>
  <!-- per-tab body, cfg is the FnTabConfig for the active tab -->
</ng-template>

// tabs:
tabs: FnTabConfig[] = [
  { titile: 'Tab One',   showIcon: false, iconClass: '', showNum: false, countNum: 0 },
  { titile: 'Tab Two',   showIcon: false },
  { titile: 'Tab Three', showIcon: false },
  { titile: 'Tab Four',  showIcon: false },
];`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "tabArray",
      type: "FnTabConfig[]",
      required: true,
      desc: "Tab list. Each entry: { titile, showIcon, iconClass, showNum, countNum, showRightIcon, rightIconClass }."
    }, {
      name: "selectIndex",
      type: "number",
      def: "0",
      desc: "1-indexed initial active tab."
    }, {
      name: "isVertical",
      type: "boolean",
      def: "false",
      desc: "Switches between horizontalTab and verticalTab themes."
    }, {
      name: "isMatStretchTabs",
      type: "boolean",
      def: "false",
      desc: "Passes through to mat-tab-group [mat-stretch-tabs]."
    }, {
      name: "dataTemplate",
      type: "TemplateRef",
      required: true,
      desc: "Per-tab body template — receives the active FnTabConfig as $implicit."
    }, {
      name: "callback",
      type: "EventEmitter<MatTabChangeEvent>",
      desc: "Fires on tab change."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["role='tablist' on the strip, role='tab' on each button, role='tabpanel' on the content region.", "Horizontal: ←/→ arrows move the active tab. Vertical: ↑/↓ arrows. Home / End jump to first / last.", "Selected tab gets tabindex='0'; the rest get tabindex='-1' so Tab moves out of the strip — matches APG.", "Active state is communicated by aria-selected='true' (not just color) — meets WCAG 1.4.1."]
  }));
}
function ViewMenu() {
  const [active, setActive] = useState("employees");
  const items = [{
    id: "dashboard",
    label: "Dashboard",
    icon: "house"
  }, {
    id: "ongoing",
    label: "Ongoing Checklist",
    icon: "leaf"
  }, {
    id: "historical",
    label: "Historical Checklist",
    icon: "clipboard-text"
  }, {
    id: "employees",
    label: "Employees",
    icon: "user"
  }, {
    id: "tasks",
    label: "Task Assignment",
    icon: "check-square"
  }, {
    id: "cloud",
    label: "Cloud Library",
    icon: "t-shirt"
  }, {
    id: "reports",
    label: "Reports",
    icon: "chart-pie-slice"
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Sidebar menu",
    selector: "<fn-menu-sidebar>",
    ngModule: "FnMenuModule",
    summary: "Dark navy left rail. 50px wide collapsed; expands to 240px on hover. Each item is icon + label with a 2px left-border + translucent theme wash on the active row. Sub-menus expand inline with a 300ms max-height transition. Icons accept Phosphor names or the foundation custom-font classes (fn-global-*)."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Expanded"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Hover to expand by default. Pass ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "mode=\"expanded\""), " to lock it open."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24,
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement(FnMenuSidebar, {
    mode: "expanded",
    items: items,
    active: active,
    onPick: setActive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      border: "1px solid var(--border-default-color)",
      borderRadius: 8,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Active item: ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, active)), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 10
    }
  }, items.find(i => i.id === active)?.label), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--iron)"
    }
  }, "The page body sits to the right of the sidebar. The active row's 2px left border in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--theme)"), " visually anchors the selection."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Collapsed (icon-only rail)"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Pass ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "mode=\"collapsed\""), " for an icon-only rail. Labels are kept in the DOM for screen readers but hidden visually via the 50px width + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "overflow: hidden"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24,
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement(FnMenuSidebar, {
    mode: "collapsed",
    items: items,
    active: active,
    onPick: setActive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      border: "1px solid var(--border-default-color)",
      borderRadius: 8,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Click an icon to navigate."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Hover-expand (auto)"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Default behavior \u2014 sits at 50px until the user hovers, then animates to 240px."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24,
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement(FnMenuSidebar, {
    items: items,
    active: active,
    onPick: setActive
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      border: "1px solid var(--border-default-color)",
      borderRadius: 8,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Hover the rail on the left to expand."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "With sub-menu"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(FnMenuSidebar, {
    mode: "expanded",
    items: [{
      id: "dashboard",
      label: "Dashboard",
      icon: "house"
    }, {
      id: "reports",
      label: "Reports",
      icon: "chart-pie-slice",
      children: [{
        id: "labor",
        label: "Labor",
        icon: "users-three"
      }, {
        id: "sales",
        label: "Sales",
        icon: "currency-dollar"
      }, {
        id: "checklist",
        label: "Checklists",
        icon: "clipboard-text"
      }]
    }, {
      id: "settings",
      label: "Settings",
      icon: "gear"
    }],
    active: "dashboard",
    onPick: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      fontSize: 12,
      color: "var(--iron)"
    }
  }, "Click ", /*#__PURE__*/React.createElement("b", null, "Reports"), " to expand its children."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<fn-menu-sidebar [menuData]="menuItems" [sidebarHeight]="'100vh'"></fn-menu-sidebar>

// menuItems:
[
  { title: 'Dashboard',          icon: 'fn-global-dashboard', route: '/dashboard' },
  { title: 'Ongoing Checklist',  icon: 'fn-global-checklist', route: '/checklist' },
  { title: 'Reports', icon: 'fn-global-report', children: [
    { title: 'Labor', route: '/reports/labor' },
    { title: 'Sales', route: '/reports/sales' },
  ]},
]`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "menuData",
      type: "FnMenuItem[]",
      required: true,
      desc: "Tree of items. Each: { title, icon, route, children, badge }."
    }, {
      name: "sidebarHeight",
      type: "string",
      def: "'calc(100vh - 50px)'",
      desc: "CSS height. Defaults to viewport minus the top bar."
    }, {
      name: "mode (gallery only)",
      type: "'auto' | 'expanded' | 'collapsed'",
      def: "'auto'",
      desc: "Override hover-expand behavior in the gallery — in production the rail is always hover-expand."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Root is <aside role='navigation'> aria-label='Sidebar menu'.", "Each item is keyboard-activatable with Enter / Space; tabindex='0' on every item.", "Active item gets aria-current='page'. Sub-menu parents get aria-expanded='true|false'.", "Labels stay in the DOM when collapsed — overflow hides them visually but screen readers still announce them.", "Don't rely on color alone for the active state — the 2px left border + translucent wash double-encode it."]
  }));
}
function ViewAccordionPage() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Accordion",
    selector: "<fn-accordian> + <fn-accordian-panel>",
    ngModule: "FnAccordianModule",
    summary: "Expandable panels with two clearly distinct states: collapsed = white surface with muted header text and a small blue-tinted circle on the right; expanded = dark navy header with white text and a white circle (caret rotated 180\xB0). Body sits flush below the header with a hover-bg fill. By default only one panel can be open; pass allowMulti to keep multiple open."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Default (single-open)"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnAccordion, {
    defaultOpenIds: ["1"],
    items: [{
      id: "1",
      title: "Accordion Header",
      content: "Accordion Body"
    }, {
      id: "2",
      title: "Accordion Header",
      content: "Accordion Body"
    }, {
      id: "3",
      title: "Accordion Header",
      content: "Accordion Body"
    }]
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Collapsed only"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnAccordion, {
    defaultOpenIds: [],
    items: [{
      id: "1",
      title: "Accordion Header",
      content: "Accordion Body"
    }]
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Allow multiple open"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnAccordion, {
    allowMulti: true,
    defaultOpenIds: ["1", "3"],
    items: [{
      id: "1",
      title: "How do shift swaps work?",
      content: /*#__PURE__*/React.createElement(React.Fragment, null, "An employee submits a swap request; eligible matches are surfaced based on role + availability; a manager approves before the swap commits.")
    }, {
      id: "2",
      title: "What counts as a 'late' clock-in?",
      content: /*#__PURE__*/React.createElement(React.Fragment, null, "15 minutes past the scheduled start. Configurable per-site in ", /*#__PURE__*/React.createElement("code", {
        className: "ds-inline"
      }, "Settings \u2192 Time clock"), ".")
    }, {
      id: "3",
      title: "Can employees view each other's schedules?",
      content: /*#__PURE__*/React.createElement(React.Fragment, null, "Yes by default. Disable under ", /*#__PURE__*/React.createElement("code", {
        className: "ds-inline"
      }, "Settings \u2192 Privacy"), " if your franchise requires it.")
    }]
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<fn-accordian>
  <fn-accordian-panel *ngFor="let p of panels" [opendFnPanelValue]="p.id">
    <fn-accordian-panel-header>{{ p.title | fnTranslate }}</fn-accordian-panel-header>
    <ng-template fnPanelContent>
      {{ p.body | fnTranslate }}
    </ng-template>
  </fn-accordian-panel>
</fn-accordian>`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "opendFnPanelValue",
      type: "string",
      desc: "Unique key emitted on (opened); use to track active panel from the parent."
    }, {
      name: "isPanelopen",
      type: "boolean",
      def: "false",
      desc: "Two-way binding for open state."
    }, {
      name: "isDisabled",
      type: "boolean",
      def: "false",
      desc: "Disables header click. Header stays collapsed."
    }, {
      name: "fnPanelClass",
      type: "string",
      desc: "Extra class on the host. Add 'fn-accordian-dark' on the parent for the dark-on-light header look."
    }, {
      name: "opened",
      type: "EventEmitter<string>",
      desc: "Fires when this panel opens. Emits opendFnPanelValue."
    }, {
      name: "closed",
      type: "EventEmitter<boolean>",
      desc: "Fires when this panel closes."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Header is role='button' with aria-expanded='true|false' and aria-controls pointing at the body.", "Enter / Space toggles the panel.", "Body has role='region' so screen readers announce it as a landmark when expanded.", "Open / closed is double-encoded by both color AND the caret rotation — meets WCAG 1.4.1 (color is not sole indicator).", "Only one panel open by default (matches accordion APG); allowMulti opts into a disclosure-group pattern."]
  }));
}

/* =============================== FEEDBACK ================================= */
function ViewDialog() {
  const [neutral, setNeutral] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "primary"|"success"|"danger"|"warning"|"info"|"orange"

  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Dialog & confirm",
    selector: "<fn-confirm-modal> \xB7 FnCnfModalService",
    ngModule: "FnDialogModule",
    summary: "Modal with three regions \u2014 gray header strip (16px bold black title + red-bordered circular X), white content area, divider + right-aligned pill actions in the footer. Backdrop is rgba(0,0,0,0.5) with a 3px blur. Use the neutral variant (no type) for content modals like the screenshot; pass type for semantic confirmations."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Neutral modal"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Matches the screenshot. Header bg is ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--modal-header-bg)"), ", title is 16px / 700, and the close button is a 22px red-bordered circle."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Open modal",
    onClick: () => setNeutral(true)
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Semantic variants (color-coded header)"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Pass ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "type"), " to color the header strip with the semantic color and switch the close button to a white outline."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, ["primary", "success", "warning", "danger", "info", "orange"].map(t => /*#__PURE__*/React.createElement(FnButton, {
    key: t,
    type: t === "primary" ? "outline-primary" : t === "success" ? "success" : t === "warning" ? "warning" : t === "info" ? "info" : t === "orange" ? "orange" : "danger",
    text: `Open ${t}`,
    onClick: () => setConfirmType(t)
  })))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`// Imperative open
this.cnf.open({
  title: 'Modal Header',
  content: 'Modal Content......',
  type: 'danger',
  isConformationMdl: false   // hides Yes/No, shows single Close
}).subscribe(confirmed => { /* … */ });

// Template
<fn-confirm-modal>
  <fn-modal-header class="modal-header-{{ type }}">
    <h5 class="modal-title">{{ dialogData.title | fnTranslate }}</h5>
    <button class="close" (click)="close(false)">
      <i class="fn-global-times"></i>
    </button>
  </fn-modal-header>
  <mat-dialog-content>
    <h3 [innerHTML]="dialogData.content | fnTranslate"
        class="alert-msg-{{ type }}"></h3>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="btn btn-primary btn-round">Yes</button>
    <button class="btn btn-danger btn-round">No</button>
  </mat-dialog-actions>
</fn-confirm-modal>`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "DialogData"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "title",
      type: "string",
      required: true,
      desc: "Header text. i18n key — runs through fnTranslate."
    }, {
      name: "content",
      type: "string",
      required: true,
      desc: "Body HTML. Also translated."
    }, {
      name: "type",
      type: "'primary'|'success'|'warning'|'danger'|'info'|'orange'",
      desc: "Color-codes the header strip. Omit for the neutral gray header from the screenshot."
    }, {
      name: "isConformationMdl",
      type: "boolean",
      def: "false",
      desc: "When true, footer shows Yes / No. Otherwise shows a single Close button."
    }, {
      name: "isCustomBtn",
      type: "boolean",
      def: "false",
      desc: "Foundation flag to swap to an OK-only footer."
    }, {
      name: "titleClass",
      type: "string",
      desc: "Optional leading icon class (e.g. fn-global-warning) before the title text."
    }]
  }), /*#__PURE__*/React.createElement(FnDialog, {
    open: neutral,
    title: "Modal Header",
    onClose: () => setNeutral(false)
  }, "Modal Content......"), /*#__PURE__*/React.createElement(FnDialog, {
    open: !!confirmType,
    type: confirmType,
    title: `Modal Header — ${confirmType || ""}`,
    onClose: () => setConfirmType(null),
    defaultActions: "yes-no",
    onConfirm: () => {}
  }, "Modal Content...... This header is colored using ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "modal-header-", confirmType), "."), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["role='dialog' + aria-modal='true' + aria-labelledby pointing at the title (id='fn-modal-title').", "Esc closes the modal; focus is trapped inside while open and returns to the trigger on close.", "Close button has aria-label='Close' so the icon-only control is announced.", "Backdrop click closes by default — for destructive flows, set closeOnBackdrop={false} and force user to use Cancel / X."]
  }));
}
function ViewDrawerPage() {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Drawer",
    selector: "<ag-drawer-host> + AgDrawerService",
    ngModule: "DrawerModule",
    summary: "Imperative right-side drawer. Use for detail/edit instead of routing, unless the URL needs to be shareable."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `this.drawer.open({
  component: EmployeeEditComponent,
  inputs: { employeeId: 42 },
  outputs: { save: v => this.refresh() },
  headerTitle: 'Edit employee',
  position: 'right', width: '480px',
  closeOnEscape: true, showCloseIcon: true
});`
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Open drawer",
    iconAddonBefore: "sidebar",
    onClick: () => setOpen(true)
  })), /*#__PURE__*/React.createElement(FnDrawer, {
    open: open,
    onClose: () => setOpen(false),
    title: "Edit employee \xB7 Sana Ahmed",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FnButton, {
      type: "outline-secondary btn-sm",
      text: "Cancel",
      onClick: () => setOpen(false)
    }), /*#__PURE__*/React.createElement(FnButton, {
      type: "primary btn-sm",
      text: "Save changes",
      onClick: () => setOpen(false)
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-name",
    label: "Name",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "Sana Ahmed"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-role",
    label: "Role"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Manager"
    }, {
      id: 2,
      name: "Bartender"
    }],
    value: 1,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-mail",
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "sana@altametrics.com"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-pay",
    label: "Hourly rate"
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "32.00",
    prefix: "$",
    suffix: "USD"
  })), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Active employee",
    desc: "Inactive employees are hidden from scheduling",
    defaultOn: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Receive notifications",
    desc: "Schedule changes + shift reminders",
    defaultOn: true
  }))));
}
function ViewToastPage() {
  const t = useToast();
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Toaster",
    selector: "FnToasterService",
    ngModule: "FnToasterModule",
    summary: "Bottom-of-stack notifications. Wraps ngx-toastr. Messages are i18n keys."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `this.toast.success('Saved successfully');
this.toast.error('Could not save');
this.toast.warning('Unsaved changes');
this.toast.info('Sync scheduled');`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "success",
    text: "Success",
    onClick: () => t.success("Shift assigned to Marco Silva", "Saved")
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "danger",
    text: "Error",
    onClick: () => t.error("Couldn't reach the server. Retry?", "Save failed")
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "warning",
    text: "Warning",
    onClick: () => t.warning("3 unsaved changes will be lost", "Heads up")
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "info",
    text: "Info",
    onClick: () => t.info("Schedule will publish in 5 minutes", "Heads up")
  }))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Success/info toasts use role='status' + aria-live='polite'.", "Error toasts use role='alert' + aria-live='assertive' so they interrupt screen-readers.", "Auto-dismiss is 4.2s; user can dismiss manually with the X."]
  }));
}
function ViewLoader() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Loaders & skeletons",
    selector: "<fn-loader>, <fn-skeleton-loader>",
    ngModule: "FnLoaderModule",
    summary: "Global blocking loader (auto-toggled by HTTP interceptor) + inline skeleton placeholders for content."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Global loader"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fn-spinner"
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "FnLoaderService is toggled by loader.interceptor for in-flight HTTP requests."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Skeleton \u2014 card grid"), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-skeleton-loader shape="card" count="3"></fn-skeleton-loader>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3"
  }, [1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "tile"
  }, /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "60%",
    height: 11
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "40%",
    height: 24
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "100%",
    height: 32
  }))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Skeleton \u2014 table rows"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      border: 0,
      borderRadius: 0
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Employee"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Shifts"))), /*#__PURE__*/React.createElement("tbody", null, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FnSkeleton, {
    shape: "circle",
    width: 26,
    height: 26
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 120,
    height: 12
  }))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 80,
    height: 12
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 60,
    height: 18
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 30,
    height: 12
  })))))))));
}
function ViewNoData() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "No Data box",
    selector: "<fn-no-data-box>",
    ngModule: "FnNoDataBoxModule",
    summary: "Standard empty / zero-results state with two variants. Just-message: a single-line gray bar with the title centered. With-illustration: vertical box illustration above the title, optional description below, and an optional hover-to-add overlay (showAddBtn) \u2014 used by fn-table, fn-grid, ag-prime-table when there's no data."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Variant 1 \u2014 Just the message"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Compact inline empty state. Used inside tables and grids \u2014 sits where the data rows would be."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnNoData, {
    headerTitle: "No Data to display"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Variant 2 \u2014 Illustration + message"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Full empty state. Renders the foundation box illustration above the title. Hover the icon to reveal the round add CTA (when ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "showAddBtn"), " is true)."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnNoData, {
    headerTitle: "No Data To Display",
    showImg: true,
    imgContainerheight: 420
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "With description + add button"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnNoData, {
    headerTitle: "No Data To Display",
    description: "It's look like you have nothing to display. You can add some valuable data just by clicking on Add/Update button.",
    showImg: true,
    showDesc: true,
    showAddBtn: true,
    imgContainerheight: 300,
    onAdd: () => {}
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Markup"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`<!-- Just the message -->
<fn-no-data-box [headerTitle]="'No_Data_to_display' | fnTranslate"></fn-no-data-box>

<!-- With illustration -->
<fn-no-data-box
  [showImg]="true"
  [isVerticalImg]="true"
  [showDesc]="true"
  [showAddBtn]="true"
  [imgContainerheight]="600"
  [headerTitle]="'No_Data_to_display' | fnTranslate"
  [description]="'NO_DATA_DESC' | fnTranslate"
  (addActionCB)="openCreate()">
</fn-no-data-box>`)
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Props"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "headerTitle",
      type: "string",
      def: "'No Data to Display'",
      desc: "Title text. Pass through fnTranslate."
    }, {
      name: "showImg",
      type: "boolean",
      def: "false",
      desc: "Show the box illustration."
    }, {
      name: "showDesc",
      type: "boolean",
      def: "false",
      desc: "Show the secondary description line under the title."
    }, {
      name: "description",
      type: "string",
      desc: "Description copy (when showDesc is true)."
    }, {
      name: "showAddBtn",
      type: "boolean",
      def: "false",
      desc: "Reveal a round add CTA on hover over the illustration."
    }, {
      name: "imgContainerheight",
      type: "string | number",
      desc: "Pixel height of the illustration container. Use to fit the empty state inside fixed-height regions (table body, drawer)."
    }, {
      name: "isVerticalImg",
      type: "boolean",
      def: "true",
      desc: "Stacks illustration above text. False = horizontal layout (deprecated layout — kept for legacy)."
    }, {
      name: "imgPath",
      type: "string",
      desc: "Custom illustration URL. Defaults to the foundation CDN no_data_display_icon.svg."
    }, {
      name: "addActionCB",
      type: "EventEmitter<void>",
      desc: "Fires when the hover-add CTA is clicked."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Image gets alt='' (decorative) — the headerTitle carries the semantic meaning.", "When showAddBtn is true, the round CTA is keyboard-activatable: tabindex='0' + role='button' + aria-label='Add new'.", "Title uses <h1> per foundation's component template — make sure the parent route already places this inside a heading hierarchy.", "Don't lower the contrast on the gray bar below WCAG AA — var(--body-bg) on var(--body-textColor) passes 4.5:1."]
  }));
}
function ViewTagPage() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Tag / Badge",
    selector: "<fn-tag>",
    ngModule: "FnTagModule",
    summary: "Chips input for tag collections (returns FnTagData[]). Use bubble-* classes for static status pills."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Static status pills"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, ["primary", "success", "warning", "danger", "info", "orange", "secondary"].map(c => /*#__PURE__*/React.createElement(FnTag, {
    key: c,
    color: c
  }, c)))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Chips input"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480,
      padding: 8,
      border: "1px solid var(--input-border-color)",
      borderRadius: 4,
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      background: "var(--input-bg)"
    }
  }, /*#__PURE__*/React.createElement(FnTag, {
    color: "primary",
    removable: true
  }, "Bartender"), /*#__PURE__*/React.createElement(FnTag, {
    color: "primary",
    removable: true
  }, "Weekend"), /*#__PURE__*/React.createElement(FnTag, {
    color: "primary",
    removable: true
  }, "Site lead"), /*#__PURE__*/React.createElement("input", {
    className: "fn-input",
    style: {
      border: 0,
      height: 22,
      flex: 1,
      minWidth: 100
    },
    placeholder: "Add tag\u2026"
  }))));
}
function ViewAvatarPage() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Avatar",
    selector: "<fn-avtar-text>",
    ngModule: "FnAvtarTextModule",
    summary: "Initials avatar with deterministic auto-color from the name. Use the stack variant in tables to show shift assignees."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Sizes"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: "Sana Ahmed",
    size: "sm"
  }), /*#__PURE__*/React.createElement(FnAvatar, {
    name: "Sana Ahmed",
    size: "md"
  }), /*#__PURE__*/React.createElement(FnAvatar, {
    name: "Sana Ahmed",
    size: "lg"
  }), /*#__PURE__*/React.createElement(FnAvatar, {
    name: "Sana Ahmed",
    size: "xl"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Stack"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(FnAvatarStack, {
    names: ["Sana Ahmed", "Rahul Yadav", "Ipshita Ghosh", "Marco Silva", "Priya Nair", "Diego Park"],
    max: 4
  })));
}
function ViewFloat() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Float button",
    selector: "<fn-float-btn>",
    ngModule: "FnFloatBtnModule",
    summary: "Bottom-right floating action button. One per screen \u2014 typically primary 'add' action on touch-heavy screens."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 220,
      background: "var(--body-bg)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "fn-float-btn",
    style: {
      position: "absolute",
      bottom: 16,
      right: 16
    },
    "aria-label": "Add shift"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "plus",
    weight: "bold"
  })))));
}

/* =============================== HW-FOUNDATION ============================ */
/* ViewHwHeader now lives in src/view-hw-header.jsx */
function ViewHwAuth() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "Auth shell (HW)",
    selector: "<hw-auth>",
    ngModule: "HwAuthModule",
    summary: "Login / signup / forgot-password shell. Built-in OAuth handoff via HwAuthService."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      border: "1px solid var(--border-default-color)",
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%)",
      padding: 32,
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 9,
      background: "rgba(255,255,255,.18)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700
    }
  }, "AG"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 24,
      fontWeight: 600,
      letterSpacing: "-.02em"
    }
  }, "Schedule less.", /*#__PURE__*/React.createElement("br", null), "Run more."), /*#__PURE__*/React.createElement("p", {
    style: {
      opacity: .88,
      fontSize: 13
    }
  }, "Restaurant operators ship 30% faster schedules with HubWorks.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: .8
    }
  }, "\xA9 Altametrics \xB7 v1.0")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg-primary)",
      padding: 36
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontWeight: 600
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginBottom: 24
    }
  }, "Welcome back. Pick up where you left off."), /*#__PURE__*/React.createElement(FormGroup, {
    id: "a-mail",
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "email",
    placeholder: "you@restaurant.com"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "a-pwd",
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(FnCheckbox, {
    label: "Remember me",
    checked: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12,
      color: "var(--blue)"
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Sign in",
    style: {
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      margin: "16px 0",
      fontSize: 11,
      color: "var(--iron)"
    }
  }, "or continue with"), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary",
    text: "Continue with SSO",
    iconAddonBefore: "shield-check",
    style: {
      width: "100%"
    }
  })))));
}

/* ViewHwAppMarket now lives in src/view-app-market.jsx */

/* ============================================================================
   Export
   ============================================================================ */
Object.assign(window, {
  ViewButton,
  ViewInput,
  ViewSelect,
  ViewSwitch,
  ViewCheckbox,
  ViewDate,
  ViewTime,
  ViewTel,
  ViewColorPicker,
  ViewFiles,
  ViewEditor,
  ViewRatingPage,
  ViewTable,
  ViewGrid,
  ViewPagination,
  ViewChart,
  ViewBreadcrumb,
  ViewTabsPage,
  ViewMenu,
  ViewAccordionPage,
  ViewDialog,
  ViewDrawerPage,
  ViewToastPage,
  ViewLoader,
  ViewNoData,
  ViewTagPage,
  ViewAvatarPage,
  ViewFloat,
  ViewHwAuth
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-components.jsx", error: String((e && e.message) || e) }); }

// src/view-connect.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-connect.jsx
   How to wire this design system into an ongoing Angular project.
   ============================================================================ */

function CodeBlock({
  children
}) {
  const src = Array.isArray(children) ? children.join("") : String(children ?? "");
  const html = typeof highlightAngular === "function" ? highlightAngular(src) : src;
  return /*#__PURE__*/React.createElement("pre", {
    className: "ds-code",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  }));
}
function StepCard({
  n,
  title,
  color,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: color,
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      flexShrink: 0
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    className: "flex-1",
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0,
      marginBottom: 8
    }
  }, title), children)));
}
function ViewConnect() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Get started",
    title: "Connect to a project",
    lead: "The step-by-step method to bring the foundation + hw-foundation design system into an existing Angular application."
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      borderLeft: "3px solid var(--blue)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Prerequisite"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Angular 18+"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5,
      margin: 0
    }
  }, "The libraries are built with Angular 18. Match your host app's major version before installing.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      borderLeft: "3px solid var(--green)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Two libraries"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "foundation \xB7 hw-foundation"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5,
      margin: 0
    }
  }, "Generic UI kit + branded HW shell. Install both, or just ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "foundation"), " if you don't need HW chrome.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      borderLeft: "3px solid var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Styling"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Tokens + theme"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5,
      margin: 0
    }
  }, "One SCSS theme entry pulls in every token. Tailwind preflight stays OFF."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Method"), /*#__PURE__*/React.createElement(StepCard, {
    n: "1",
    color: "var(--blue)",
    title: "Install the libraries"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "Add both packages (or build them locally and link the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "dist/"), " output)."), /*#__PURE__*/React.createElement(CodeBlock, null, `# from your project root
npm install foundation hw-foundation

# …or, building from this monorepo:
ng build foundation && ng build hw-foundation
# then reference them via the tsconfig path alias (step 4)`)), /*#__PURE__*/React.createElement(StepCard, {
    n: "2",
    color: "var(--blue)",
    title: "Pull in peer dependencies"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "The components wrap a few well-known libs. Install the ones your screens use."), /*#__PURE__*/React.createElement(CodeBlock, null, `npm install @ng-select/ng-select @ng-bootstrap/ng-bootstrap \\
  ngx-toastr @angular/cdk primeng ngx-color-picker \\
  intl-tel-input suneditor @amcharts/amcharts5`)), /*#__PURE__*/React.createElement(StepCard, {
    n: "3",
    color: "var(--green)",
    title: "Wire the theme (tokens + global font)"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "Import the foundation theme entry in your global ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "styles.scss"), ". This is what defines every ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--token"), " on ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ":root"), " and ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".dark-theme"), "."), /*#__PURE__*/React.createElement(CodeBlock, null, `/* styles.scss */
@import "foundation/theme/variable";   /* --blue, --body-bg, radii, … */
@import "foundation/theme/index";      /* component theme partials   */
@import "foundation/theme/globalFont"; /* fn-global-* icon font       */

/* Phosphor icons (used by fn-icon) */
@import "@phosphor-icons/web/src/regular/style.css";`), /*#__PURE__*/React.createElement("div", {
    className: "ds-a11y",
    role: "note",
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, "Rule"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, "Keep Tailwind's ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "preflight"), " disabled \u2014 base resets come from Bootstrap/Material. See ", /*#__PURE__*/React.createElement("a", {
    onClick: () => window.navigate?.("principles"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "Principles & rules"), "."))), /*#__PURE__*/React.createElement(StepCard, {
    n: "4",
    color: "var(--green)",
    title: "Set the import aliases"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "So you always import from ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "'foundation'"), " / ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "'hw-foundation'"), " \u2014 never from a deep source path."), /*#__PURE__*/React.createElement(CodeBlock, null, `// tsconfig.json → compilerOptions.paths
{
  "paths": {
    "foundation":    ["dist/foundation"],
    "hw-foundation": ["dist/hw-foundation"]
  }
}`)), /*#__PURE__*/React.createElement(StepCard, {
    n: "5",
    color: "var(--orange)",
    title: "Register the root providers"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "Add the cross-cutting services once at app bootstrap. ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "FoundationModule"), " wires the a11y directives, HTTP, i18n + loader; ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "HwFoundationModule.forRoot()"), " adds the branded shell."), /*#__PURE__*/React.createElement(CodeBlock, null, `// app.config.ts (standalone) or AppModule imports
import { FoundationModule } from 'foundation';
import { HwFoundationModule } from 'hw-foundation';

imports: [
  FoundationModule,
  HwFoundationModule.forRoot({ appId: 'your-app' }),
]`)), /*#__PURE__*/React.createElement(StepCard, {
    n: "6",
    color: "var(--orange)",
    title: "Import per-feature modules where you use them"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "Don't import the whole library into a feature. Pull only the component module you need \u2014 every component card here lists its module name."), /*#__PURE__*/React.createElement(CodeBlock, null, `// employees.module.ts
import { FnButtonModule } from 'foundation';
import { FnInputModule } from 'foundation';
import { FnPrimeTableModule } from 'foundation';

@NgModule({ imports: [FnButtonModule, FnInputModule, FnPrimeTableModule] })
export class EmployeesModule {}`)), /*#__PURE__*/React.createElement(StepCard, {
    n: "7",
    color: "var(--purple)",
    title: "Build the page from the boilerplate"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "Every routed page uses the ", /*#__PURE__*/React.createElement("a", {
    onClick: () => window.navigate?.("p-boilerplate"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, ".hw-box-content boilerplate"), ", then drops components into the body and binds data."), /*#__PURE__*/React.createElement(CodeBlock, null, `<div class="hw-box-content">
  <div class="hw-header-wrap"><div class="row">
    <div class="col"><i class="fn-global-employee"></i>
      {{ 'EMP.TITLE' | fnTranslate }}</div>
  </div></div>
  <div class="hw-content">
    <ag-prime-table [data]="rows" [columns]="cols"
                    [isPagginator]="true"></ag-prime-table>
  </div>
</div>`)), /*#__PURE__*/React.createElement(StepCard, {
    n: "8",
    color: "var(--purple)",
    title: "Verify compliance"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "Run the a11y checks before merging. The directives from step 5 resolve most findings automatically; confirm the rest against the ", /*#__PURE__*/React.createElement("a", {
    onClick: () => window.navigate?.("a11y"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "VPAT / WCAG 2.1 AA"), " page."), /*#__PURE__*/React.createElement(CodeBlock, null, `# axe in your e2e pipeline
npm install -D @axe-core/playwright
# then toggle light/dark and re-run contrast checks`)), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Checklist"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Step"), /*#__PURE__*/React.createElement("th", null, "Done when\u2026"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Libraries installed"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "foundation"), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-foundation"), " resolve in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "node_modules"), " / ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "dist"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Peer deps installed"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "ng-select, ng-bootstrap, primeng, toastr, cdk, etc. present.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Theme imported"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "A token like ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--blue)"), " resolves; dark mode flips with ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".dark-theme"), " on ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<html>"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Aliases set"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Imports come from ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "'foundation'"), ", not ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "'../../dist/...'"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Root providers"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "A bare ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fn-button"), " renders styled + keyboard-focusable.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "First page"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "A real screen built from the boilerplate + bound data renders.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Compliance"), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "axe passes in light + dark; keyboard nav works end-to-end."))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Common pitfalls"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--red)"
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      lineHeight: 1.9,
      paddingLeft: 18,
      margin: 0,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Tailwind preflight on"), " \u2192 resets fight Bootstrap/Material. Disable it in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "tailwind.config.js"), " (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "corePlugins.preflight: false"), ")."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Importing from source paths"), " \u2192 breaks builds. Always import from the package alias."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Hardcoded hex"), " instead of tokens \u2192 dark mode breaks + fails contrast. Use ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--token)"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Missing peer dep"), " \u2192 component throws at runtime. Install the lib the component wraps."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Whole-library import"), " in a feature module \u2192 bloats the bundle. Import the per-feature module only."))), /*#__PURE__*/React.createElement(A11yNote, {
    label: "Note"
  }, "This gallery documents the contract; the components ship from the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "foundation"), " / ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-foundation"), " packages. Once connected, use each component card here as the reference for selector, module, props, and markup."));
}
Object.assign(window, {
  ViewConnect
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-connect.jsx", error: String((e && e.message) || e) }); }

// src/view-foundations.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-foundations.jsx
   Token explorers: Color, Type, Spacing, Shadows, Icons, Motion.
   ============================================================================ */

/* ----------------------------- Helpers ------------------------------------ */
function Swatch({
  name,
  value,
  big = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "swatch-card",
    style: {
      minHeight: big ? 120 : "auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "color",
    style: {
      background: `var(--${name})`,
      height: big ? 80 : 64
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "var(--", name, ")"), value && /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: "var(--iron)"
    }
  }, value)));
}
function TokenRow({
  name,
  value,
  swatch
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "token-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "swatch-cell"
  }, swatch && /*#__PURE__*/React.createElement("span", {
    className: "swatch-mini",
    style: swatch
  }), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "--", name)), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, value), /*#__PURE__*/React.createElement("code", {
    className: "ds-inline",
    onClick: () => navigator.clipboard?.writeText(`var(--${name})`),
    style: {
      cursor: "pointer"
    },
    title: "Click to copy"
  }, "var(--", name, ")"));
}

/* ----------------------------- Color -------------------------------------- */
function ViewColors() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Foundation",
    title: "Color",
    lead: "The palette mirrors projects/foundation/src/lib/theme/_variable.scss 1:1. Light tokens live on :root; dark overrides under .dark-theme. Toggle theme from the topbar to preview both."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Brand palette"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "The eleven named colors. All other UI colors derive from these through the semantic map."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-4",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Swatch, {
    name: "blue",
    value: "primary \xB7 #005bc4",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "cyan",
    value: "info",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "green",
    value: "success \xB7 #1e7e34",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "orange",
    value: "#bf5700",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "yellow",
    value: "warning \xB7 #fdc91e",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "red",
    value: "danger \xB7 #c62828",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "iron",
    value: "dark \xB7 #4b5563",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "purple",
    value: "#7b42ff",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "gray",
    value: "secondary",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "black",
    big: true
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "white",
    big: true
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Semantic mapping"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Defined in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "_color.scss"), " via ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "$colorMapLight"), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "$colorMapDark"), ". For each semantic name, foundation auto-generates ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".bg-", "{", "name", "}"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".f-", "{", "name", "}"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".bubble-", "{", "name", "}"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".progress-bar-", "{", "name", "}"), "."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Semantic"), /*#__PURE__*/React.createElement("th", null, "Light"), /*#__PURE__*/React.createElement("th", null, "Dark"), /*#__PURE__*/React.createElement("th", null, "Usage"))), /*#__PURE__*/React.createElement("tbody", null, [["primary", "blue", "Action buttons, links, focus rings"], ["success", "green", "Saved confirmations, complete shifts, active status"], ["warning", "yellow", "Pending shifts, swap requests"], ["danger", "red", "Destructive actions, late shifts, errors"], ["info", "cyan", "Informational toasts, badge hints"], ["orange", "orange", "Highlights — needs attention but not blocking"], ["secondary", "gray", "Cancel, dismiss, neutral chips"], ["dark", "iron", "Muted text, secondary headings"]].map(([sem, base, use]) => /*#__PURE__*/React.createElement("tr", {
    key: sem
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "pn"
  }, sem)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "swatch-mini",
    style: {
      background: `var(--${base})`,
      display: "inline-block",
      verticalAlign: "middle",
      marginRight: 6
    }
  }), /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "var(--", base, ")")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "dark variant")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, use)))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Dark variants"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Used for hover/active/pressed states on top of base colors."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-4"
  }, /*#__PURE__*/React.createElement(Swatch, {
    name: "primaryDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "successDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "dangerDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "orangeDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "infoDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "ironDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "warningDark"
  }), /*#__PURE__*/React.createElement(Swatch, {
    name: "secondaryDark"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Surfaces & structure"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement(TokenRow, {
    name: "body-bg",
    value: "page background",
    swatch: {
      background: "var(--body-bg)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "bg-primary",
    value: "cards, dialogs, panels",
    swatch: {
      background: "var(--bg-primary)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "bg-primary-dark",
    value: "elevated surfaces under dark mode",
    swatch: {
      background: "var(--bg-primary-dark)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "hover-bg-color",
    value: "row/card hover wash",
    swatch: {
      background: "var(--hover-bg-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "side-nav-bg",
    value: "sidebar nav background",
    swatch: {
      background: "var(--side-nav-bg)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "border-default-color",
    value: "default 1px border",
    swatch: {
      background: "var(--border-default-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "box-border-color",
    value: "card borders",
    swatch: {
      background: "var(--box-border-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "cdk-overlay-backdrop",
    value: "modal scrim",
    swatch: {
      background: "var(--cdk-overlay-backdrop)"
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Inputs"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement(TokenRow, {
    name: "input-bg",
    value: "field background",
    swatch: {
      background: "var(--input-bg)",
      border: "1px solid var(--input-border-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "input-border-color",
    value: "resting border",
    swatch: {
      background: "var(--input-border-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "input-focus-border-color",
    value: "focused border",
    swatch: {
      background: "var(--input-focus-border-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "input-placeholder-color",
    value: "placeholder text",
    swatch: {
      background: "var(--input-placeholder-color)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "input-disable-color",
    value: "disabled field",
    swatch: {
      background: "var(--input-disable-color)"
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Tables"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement(TokenRow, {
    name: "table-dark-cell",
    value: "header cell bg",
    swatch: {
      background: "var(--table-dark-cell)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "table-hover-bg",
    value: "row hover",
    swatch: {
      background: "var(--table-hover-bg)"
    }
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "table-border-color",
    value: "row border",
    swatch: {
      background: "var(--table-border-color)"
    }
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Bubbles & utility classes"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Auto-generated from the semantic map. Use these \u2014 don't write your own chip CSS."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, ["primary", "success", "warning", "danger", "info", "orange", "secondary"].map(c => /*#__PURE__*/React.createElement(FnTag, {
    key: c,
    color: c
  }, c))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, ["success", "warning", "danger", "info", "primary", "orange"].map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      width: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11,
      marginBottom: 4
    }
  }, ".progress-bar-", c), /*#__PURE__*/React.createElement(FnProgress, {
    value: [80, 55, 30, 70, 90, 40][["success", "warning", "danger", "info", "primary", "orange"].indexOf(c)],
    color: c,
    label: c
  }))))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Every text/background pair in this page meets WCAG 2.1 AA contrast (≥4.5:1 for normal text, ≥3:1 for large text & UI components).", "Don't use raw hex codes in component SCSS — always var(--token) so dark mode swaps for free.", "Status is never communicated by color alone. Pair with an icon and/or text label."]
  }));
}

/* ----------------------------- Typography --------------------------------- */
function ViewTypography() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Foundation",
    title: "Typography",
    lead: "UI uses Inter (loaded via Google Fonts in _font.scss). Body baseline is 8.7pt / 400. The mono family (used for IDs, code, tabular data) is JetBrains Mono."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Scale"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: "-.02em"
    }
  }, "Page title \xB7 28 / 600 \xB7 -2% tracking"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: "-.01em"
    }
  }, "Section \xB7 22 / 600"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500
    }
  }, "Subsection \xB7 16 / 500"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14
    }
  }, "Body \xB7 14 / 400 \u2014 used for paragraphs, table cells, drawer body."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Body small \xB7 13 / 400 \u2014 used inside buttons (default size)."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--iron)"
    }
  }, "Label / caption \xB7 12 / 400 iron \u2014 form labels, table headers, breadcrumb."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--red)"
    }
  }, "Error \xB7 11 / 400 red \u2014 inline form errors."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Mono"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      fontFamily: "var(--ds-mono)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "SHIFT-2027"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--iron)"
    }
  }, "EMP-00482"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontVariantNumeric: "tabular-nums"
    }
  }, "$1,284.50"))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Weights & cases"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Element"), /*#__PURE__*/React.createElement("th", null, "Size"), /*#__PURE__*/React.createElement("th", null, "Weight"), /*#__PURE__*/React.createElement("th", null, "Notes"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Form labels"), /*#__PURE__*/React.createElement("td", null, "12px"), /*#__PURE__*/React.createElement("td", null, "500"), /*#__PURE__*/React.createElement("td", null, "Sentence case. Sit above the input with 5px margin.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Inputs"), /*#__PURE__*/React.createElement("td", null, "12px"), /*#__PURE__*/React.createElement("td", null, "400"), /*#__PURE__*/React.createElement("td", null, "Fixed height 30px \u2014 don't override.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Buttons (default)"), /*#__PURE__*/React.createElement("td", null, "13px"), /*#__PURE__*/React.createElement("td", null, "400"), /*#__PURE__*/React.createElement("td", null, "Use 12px for ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "btn-sm"), "/", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "btn-xs"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Table headers"), /*#__PURE__*/React.createElement("td", null, "11.5px"), /*#__PURE__*/React.createElement("td", null, "600"), /*#__PURE__*/React.createElement("td", null, "UPPERCASE with 4% tracking.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "UPPERCASE eyebrows"), /*#__PURE__*/React.createElement("td", null, "10.5\u201311px"), /*#__PURE__*/React.createElement("td", null, "600"), /*#__PURE__*/React.createElement("td", null, "Used for section labels, tags. Track +6%."))))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Minimum size for body text is 12px — never smaller.", "Don't use ultra-light weights (<400) — fails contrast on thin strokes.", "Line-height is 1.45 for body, 1.15 for display sizes 22+."]
  }));
}

/* ----------------------------- Spacing ------------------------------------ */
function ViewSpacing() {
  const scale = [4, 8, 12, 16, 24, 32, 48];
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Foundation",
    title: "Spacing & radii",
    lead: "4px base unit. Component padding leans dense (16px inside cards, not 24px). Radii are tight: 4px for chips/buttons, 6px for forms, 9px for cards/dialogs, 30px for pill buttons."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Spacing scale"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, scale.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline",
    style: {
      width: 90
    }
  }, "--space-", i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 60,
      fontFamily: "var(--ds-mono)",
      fontSize: 12,
      color: "var(--iron)"
    }
  }, n, "px"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      height: 18,
      width: n,
      background: "var(--blue)",
      borderRadius: 3
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "In component SCSS prefer the foundation mixins (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "@include padding(...)"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "@include radius(...)"), ") \u2014 they handle RTL automatically.")), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Radii"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-4"
  }, [{
    name: "4px",
    v: "4px",
    use: "Chips, buttons (default), inputs"
  }, {
    name: "var(--radius-sm)",
    v: "6px",
    use: "Cards (compact), tag groups"
  }, {
    name: "var(--radius-md)",
    v: "9px",
    use: "Dialogs, drawers, big surfaces"
  }, {
    name: "30px",
    v: "30px",
    use: ".btn-round, pill chips"
  }, {
    name: "50%",
    v: "circle",
    use: "Avatars, fn-float-btn, dots"
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    className: "ds-card",
    style: {
      marginBottom: 0,
      padding: 16,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      background: "var(--blue)",
      margin: "0 auto 10px",
      borderRadius: r.v === "circle" ? "50%" : r.v
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--ds-mono)",
      fontSize: 11.5
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11,
      marginTop: 4
    }
  }, r.use)))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Padding presets in code"), /*#__PURE__*/React.createElement("pre", {
    className: "ds-code"
  }, /*#__PURE__*/React.createElement("code", {
    dangerouslySetInnerHTML: {
      __html: highlightAngular(`// _mixins.scss exposes:
@include padding(12px 16px);     // shorthand
@include padding-direction(top, 12px);
@include radius(var(--radius-md));
@include shadow-reset;

// Card pattern:
.tile {
  @include radius(var(--radius-md));
  @include padding(16px);
  background: var(--bg-primary);
  border: 1px solid var(--border-default-color);
}`)
    }
  })));
}

/* ----------------------------- Shadows ------------------------------------ */
function ViewShadows() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Foundation",
    title: "Shadows & elevation",
    lead: "Foundation prefers borders over shadows in dense views. Shadows are reserved for floating chrome: dropdowns, modals, drawers, toasts, the float button."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Levels"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      background: "var(--bg-primary)",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-default-color)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Resting"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "1px border, no shadow"), /*#__PURE__*/React.createElement("code", {
    className: "ds-inline",
    style: {
      marginTop: 12,
      display: "inline-block"
    }
  }, "border-default-color")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      background: "var(--bg-primary)",
      borderRadius: "var(--radius-md)",
      boxShadow: "0 4px 12px rgba(15,18,40,0.06), 0 1px 2px rgba(15,18,40,0.04)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Menu / dropdown"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "used for ng-select menu, popovers"), /*#__PURE__*/React.createElement("code", {
    className: "ds-inline",
    style: {
      marginTop: 12,
      display: "inline-block"
    }
  }, "shadow-md")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      background: "var(--bg-primary)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Modal / drawer"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "fn-dialog, ag-drawer-host, toast"), /*#__PURE__*/React.createElement("code", {
    className: "ds-inline",
    style: {
      marginTop: 12,
      display: "inline-block"
    }
  }, "var(--shadow)"))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Tokens"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement(TokenRow, {
    name: "shadow",
    value: "0 7px 22px rgba(0,0,0,.15) \u2014 light  \xB7  0 15px 35px rgba(0,0,0,.6) \u2014 dark"
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "table-shadow",
    value: "rgba(0,0,0,.05) \u2014 used by fn-grid resize handle"
  }), /*#__PURE__*/React.createElement(TokenRow, {
    name: "cdk-overlay-backdrop",
    value: "rgba(0,0,0,.68) light  \xB7  rgba(0,0,0,.32) dark \u2014 modal scrim"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Focus ring"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Every interactive element gets ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ":focus-visible"), " outline via the global rule \u2014 a 2px blue ring with 4px radius. Keyboard-first is non-negotiable per VPAT."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Tab here \u2192"
  }), /*#__PURE__*/React.createElement(FnInput, {
    placeholder: "Tab to me",
    style: {
      width: 200
    }
  }), /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Option A"
    }, {
      id: 2,
      name: "Option B"
    }],
    placeholder: "Select\u2026"
  })));
}

/* ----------------------------- Icons -------------------------------------- */
function ViewIcons() {
  const phosphorSamples = ["house", "user-circle", "gear", "bell", "calendar", "clock", "check-circle", "x-circle", "warning", "info", "plus", "minus", "pencil", "trash", "magnifying-glass", "caret-down", "caret-right", "arrow-right", "arrow-left", "download-simple", "upload-simple", "share-network", "chat-circle", "heart", "star", "kanban", "table", "chart-pie", "fork-knife", "users-three", "hand-coins", "clipboard-text", "note-pencil"];
  const fnGlobalSamples = ["fn-global-site", "fn-global-employee", "fn-global-schedule", "fn-global-report", "fn-global-setting", "fn-global-cloud", "fn-global-pdf", "fn-global-csv", "fn-global-edit", "fn-global-delete", "fn-global-eye", "fn-global-export"];
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Foundation",
    title: "Iconography",
    lead: "Foundation uses Phosphor (regular / bold / duotone / fill / light / thin) plus a custom AG global font (fn-global-*). All icons render through <fn-icon> for consistent sizing, color, and a11y."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Phosphor"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Reference by class name. Weights: ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "ph"), " (regular), ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "ph-bold"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "ph-duotone"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "ph-fill"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "ph-light"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "ph-thin"), "."), /*#__PURE__*/React.createElement(Demo, {
    code: `<fn-icon icon="ph-gear" lib="ph" size="20px"></fn-icon>
<fn-icon icon="ph-bell" lib="ph" size="18px" color="var(--orange)"></fn-icon>`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 16
    }
  }, ["regular", "bold", "duotone", "fill"].map(w => /*#__PURE__*/React.createElement("div", {
    key: w,
    className: "ds-stack",
    style: {
      gap: 4,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    weight: w,
    size: "28px"
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, w))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Phosphor \u2014 common set"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-6",
    style: {
      gap: 8
    }
  }, phosphorSamples.map(name => /*#__PURE__*/React.createElement("div", {
    key: name,
    className: "ds-stack",
    style: {
      gap: 4,
      alignItems: "center",
      padding: 10,
      borderRadius: 6,
      border: "1px solid var(--border-default-color)",
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: name,
    size: "20px"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--iron)",
      fontFamily: "var(--ds-mono)",
      textAlign: "center"
    }
  }, name))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "AG custom font (fn-global-*)"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Loaded from ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "_globalFont.scss"), " via the altametrics CDN. Use these for product-specific glyphs that Phosphor doesn't cover (sites, employees, schedules, exports)."), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-6",
    style: {
      gap: 8
    }
  }, fnGlobalSamples.map(name => /*#__PURE__*/React.createElement("div", {
    key: name,
    className: "ds-stack",
    style: {
      gap: 4,
      alignItems: "center",
      padding: 10,
      borderRadius: 6,
      border: "1px solid var(--border-default-color)",
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: name,
    style: {
      fontSize: 22
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--iron)",
      fontFamily: "var(--ds-mono)",
      textAlign: "center",
      wordBreak: "break-all"
    }
  }, name.replace("fn-global-", "")))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Sizes"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card ds-row",
    style: {
      alignItems: "baseline",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    size: "14px"
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "14 \xB7 dense")), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    size: "16px"
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "16 \xB7 default")), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    size: "20px"
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "20 \xB7 button")), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    size: "24px"
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "24 \xB7 empty state"))), /*#__PURE__*/React.createElement(A11yNote, {
    label: "VPAT \u2014 icons"
  }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Decorative icons in buttons next to a visible label: ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-hidden=\"true\""), ". Don't double-announce."), /*#__PURE__*/React.createElement("li", null, "Icon-only buttons: use the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "a11yIconBtn"), " directive \u2014 it stamps ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-label"), " on the host and ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "aria-hidden=\"true\""), " on every inner glyph."), /*#__PURE__*/React.createElement("li", null, "Never use Unicode glyphs (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "\u2192"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "\u2713"), ") or emoji as icons \u2014 they don't translate and don't have consistent line-height. Always SVG / icon font."))));
}

/* ----------------------------- Motion ------------------------------------- */
function ViewMotion() {
  const [bounce, setBounce] = useState(0);
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Foundation",
    title: "Motion",
    lead: "Motion is functional \u2014 never decorative. Linear easing for state changes, 120\u2013240ms durations. No bounces, no springs, no confetti."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Durations"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Token"), /*#__PURE__*/React.createElement("th", null, "Value"), /*#__PURE__*/React.createElement("th", null, "Used for"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--dur-instant")), /*#__PURE__*/React.createElement("td", null, "80ms"), /*#__PURE__*/React.createElement("td", null, "Press feedback (button scale down)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--dur-fast")), /*#__PURE__*/React.createElement("td", null, "120ms"), /*#__PURE__*/React.createElement("td", null, "Hover, focus ring, switch toggle")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--dur-base")), /*#__PURE__*/React.createElement("td", null, "180ms"), /*#__PURE__*/React.createElement("td", null, "Tab switch, state changes, accordion")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--dur-slow")), /*#__PURE__*/React.createElement("td", null, "240ms"), /*#__PURE__*/React.createElement("td", null, "Drawer slide, dialog open")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--dur-slower")), /*#__PURE__*/React.createElement("td", null, "320ms"), /*#__PURE__*/React.createElement("td", null, "Modal in/out, complex panel transitions"))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Easing"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Token"), /*#__PURE__*/React.createElement("th", null, "Value"), /*#__PURE__*/React.createElement("th", null, "Feel"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "linear")), /*#__PURE__*/React.createElement("td", null, "0.2s linear"), /*#__PURE__*/React.createElement("td", null, "Default for fades and color transitions in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "_input.scss"), ".")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--ease-out")), /*#__PURE__*/React.createElement("td", null, "cubic-bezier(0.16, 1, 0.3, 1)"), /*#__PURE__*/React.createElement("td", null, "Micro-interactions \u2014 switch knob, focus ring expansion.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--ease-soft")), /*#__PURE__*/React.createElement("td", null, "cubic-bezier(0.32, 0.72, 0, 1)"), /*#__PURE__*/React.createElement("td", null, "Panel/drawer slides \u2014 gentle exit.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "--ease-in-out")), /*#__PURE__*/React.createElement("td", null, "cubic-bezier(0.65, 0, 0.35, 1)"), /*#__PURE__*/React.createElement("td", null, "Two-way state (tab indicator move)."))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Live preview"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnSwitch, {
    checked: bounce > 0,
    onChange: v => setBounce(v ? 1 : 0),
    ariaLabel: "Demo switch"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Hover & press me"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fn-spinner"
  }))), /*#__PURE__*/React.createElement(A11yNote, null, "Every transform/translate in foundation respects ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "prefers-reduced-motion"), " \u2014 animations collapse to opacity-only. No exceptions: spinners use opacity pulse, not rotation, under reduced-motion."));
}

/* ----------------------------- Export ------------------------------------- */
Object.assign(window, {
  ViewColors,
  ViewTypography,
  ViewSpacing,
  ViewShadows,
  ViewIcons,
  ViewMotion
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-foundations.jsx", error: String((e && e.message) || e) }); }

// src/view-how-to-use.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-how-to-use.jsx
   Onboarding: the PS → UI Dev workflow + objectives this system fulfills.
   ============================================================================ */

function ViewHowToUse() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Get started",
    title: "How to use this system",
    lead: "This page spells out the workflow this design system is built to support \u2014 from a rough prototype to a data-bound page \u2014 and who does what at each step."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Why this system exists"), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--blue)",
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Objective 1"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "One centralized system"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: 0
    }
  }, "Every token, component, and rule lives in one place and is followed across the whole application \u2014 no per-team reinvention.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--green)",
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Objective 2"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Fast page structure"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: 0
    }
  }, "PS / UI Dev assemble a page's structure from a rough or prototype in minutes by composing documented patterns + components.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--orange)",
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Objective 3"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "Render + bind only"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: 0
    }
  }, "The UI Dev's remaining job is to drop the documented component and bind real data \u2014 not to design or hand-build UI.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      borderLeft: "3px solid var(--purple)",
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Objective 4"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "VPAT / WCAG 2.1 AA"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: 0
    }
  }, "Accessibility + color-contrast compliance is baked into every component, with the rules documented and verifiable."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "The workflow"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      gap: 0
    }
  }, [{
    n: "1",
    who: "Designer / PS",
    color: "var(--blue)",
    title: "Start from a rough or prototype",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Sketch the page intent. Identify which ", /*#__PURE__*/React.createElement("a", {
      onClick: () => window.navigate?.("p-boilerplate"),
      style: {
        color: "var(--blue)",
        cursor: "pointer"
      }
    }, "page pattern"), " it maps to (list, form, detail+drawer, settings) and which components fill the body.")
  }, {
    n: "2",
    who: "PS / UI Dev",
    color: "var(--green)",
    title: "Compose the structure",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Drop the ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, ".hw-box-content"), " boilerplate, then place the documented components (", /*#__PURE__*/React.createElement("a", {
      onClick: () => window.navigate?.("fn-table"),
      style: {
        color: "var(--blue)",
        cursor: "pointer"
      }
    }, "prime-table"), ", ", /*#__PURE__*/React.createElement("a", {
      onClick: () => window.navigate?.("fn-select"),
      style: {
        color: "var(--blue)",
        cursor: "pointer"
      }
    }, "select"), ", ", /*#__PURE__*/React.createElement("a", {
      onClick: () => window.navigate?.("fn-date"),
      style: {
        color: "var(--blue)",
        cursor: "pointer"
      }
    }, "date pickers"), "\u2026). Copy the Markup block from each component card.")
  }, {
    n: "3",
    who: "UI Dev",
    color: "var(--orange)",
    title: "Bind data + wire events",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Read the component's selector + NgModule + props table. Import the per-feature module, then bind ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "[data]"), " / ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "[(ngModel)]"), " / ", /*#__PURE__*/React.createElement("code", {
      className: "ds-inline"
    }, "[config]"), " and handle output events. No new CSS \u2014 styling comes from the tokens.")
  }, {
    n: "4",
    who: "Everyone",
    color: "var(--purple)",
    title: "Verify compliance",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Confirm the page follows the ", /*#__PURE__*/React.createElement("a", {
      onClick: () => window.navigate?.("a11y"),
      style: {
        color: "var(--blue)",
        cursor: "pointer"
      }
    }, "VPAT / WCAG 2.1 AA"), " rules \u2014 keyboard, labels, focus, contrast \u2014 using the directives the foundation already provides.")
  }].map((s, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      display: "flex",
      gap: 16,
      padding: "14px 0",
      borderBottom: i < arr.length - 1 ? "1px solid var(--border-default-color)" : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      background: s.color,
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      flexShrink: 0
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, s.title), /*#__PURE__*/React.createElement("span", {
    className: "fn-tag bubble-secondary",
    style: {
      fontSize: 10.5
    }
  }, s.who)), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: "4px 0 0"
    }
  }, s.body)))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "What each role can rely on"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Uses this system for"), /*#__PURE__*/React.createElement("th", null, "Does NOT need to"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "Designer / PS")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Pick patterns + components that already exist; design within the token palette + type scale."), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Invent new colors, spacing, or one-off components.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "UI Dev")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Copy markup, import the feature module, bind data, handle events."), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Write component CSS, re-implement tables/pickers, or hand-roll a11y.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "Reviewer / QA")), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Check the page against the documented VPAT rules + visual patterns."), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, "Guess at intended behavior \u2014 it's specified per component."))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Ground rules (non-negotiable)"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      lineHeight: 1.9,
      paddingLeft: 18,
      margin: 0,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("li", null, "Colors come from ", /*#__PURE__*/React.createElement("a", {
    onClick: () => window.navigate?.("colors"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "tokens"), " \u2014 never raw hex."), /*#__PURE__*/React.createElement("li", null, "Every page uses the ", /*#__PURE__*/React.createElement("a", {
    onClick: () => window.navigate?.("p-boilerplate"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, ".hw-box-content boilerplate"), "."), /*#__PURE__*/React.createElement("li", null, "Reuse components \u2014 if one doesn't exist, extend the library, don't fork in a page."), /*#__PURE__*/React.createElement("li", null, "All user-visible text goes through i18n; all interactive elements meet ", /*#__PURE__*/React.createElement("a", {
    onClick: () => window.navigate?.("a11y"),
    style: {
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "WCAG 2.1 AA"), "."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Keeping this in sync"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 0
    }
  }, "This gallery is a ", /*#__PURE__*/React.createElement("b", null, "faithful mirror"), " of the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "foundation"), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-foundation"), " Angular libraries \u2014 it does not read them at runtime. When you change the real library, re-sync the gallery so it stays trustworthy."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-3",
    style: {
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      borderLeft: "3px solid var(--blue)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0,
      fontSize: 14
    }
  }, "Changed a component"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5,
      margin: 0
    }
  }, "Restyled or restructured an ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fn-*"), " / ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-*"), " component? Flag that one component \u2014 its SCSS/HTML is re-read and the matching card here is updated.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      borderLeft: "3px solid var(--green)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0,
      fontSize: 14
    }
  }, "Added a component"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5,
      margin: 0
    }
  }, "New selector (e.g. ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "fn-stepper"), ")? It gets a facsimile, props table, a11y notes, and a sidebar entry.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      borderLeft: "3px solid var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-h3",
    style: {
      marginTop: 0,
      fontSize: 14
    }
  }, "Changed tokens"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12.5,
      margin: 0
    }
  }, "Edited ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "_variable.scss"), " (colors, radii, spacing)? This is the highest-impact change \u2014 it propagates to every component. ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "tokens.css"), " is kept 1:1 with it."))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      lineHeight: 1.9,
      paddingLeft: 18,
      margin: 0,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Source of truth is the library, never the gallery."), " Change the real component first, then sync here \u2014 edits here don't flow back to Angular."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Re-sync per change, not in bulk."), " When a PR touches a component, sync that one \u2014 fast and accurate."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Tokens first."), " If a token changed, sync ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "tokens.css"), " before component visuals \u2014 everything inherits from it."))), /*#__PURE__*/React.createElement(A11yNote, {
    label: "Note"
  }, "This gallery is a faithful reference mirror of the ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "foundation"), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "hw-foundation"), " Angular libraries. It documents what to use and how it should look + behave; the components themselves ship from those libraries."));
}
Object.assign(window, {
  ViewHowToUse
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-how-to-use.jsx", error: String((e && e.message) || e) }); }

// src/view-hw-header.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-hw-header.jsx
   <hw-header-main> — full interactive port with all dropdowns.
   ============================================================================ */

/* ----- The header itself, reusable inside the gallery + patterns ----- */
function HwHeaderMain({
  logoMark = "plum"
}) {
  const [open, setOpen] = useState(null); // 'apps' | 'site' | 'weather' | 'profile' | 'support' | null
  const [lightTheme, setLightTheme] = useState(true);
  const ref = useRef();
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  function toggle(id) {
    setOpen(o => o === id ? null : id);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-navbar",
    ref: ref
  }, /*#__PURE__*/React.createElement("ul", {
    className: "navbar-left"
  }, /*#__PURE__*/React.createElement("li", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-box",
    "aria-label": "Plum logo"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 32 32",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "18",
    r: "10",
    fill: "#e23744"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 8C16 8 13 4 9 4C9 9 13 10 16 10",
    fill: "#3d8b40"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 8C16 8 19 4 23 4C23 9 19 10 16 10",
    fill: "#4caf50"
  })))), /*#__PURE__*/React.createElement("li", {
    className: "header-list-item",
    onClick: () => toggle("apps"),
    style: {
      position: "relative"
    },
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "menu",
    "aria-expanded": open === "apps"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "lead-icon"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "squares-four",
    weight: "bold"
  })), "My App", /*#__PURE__*/React.createElement("span", {
    className: "caret-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "caret-down",
    size: "11px",
    weight: "bold"
  })))), /*#__PURE__*/React.createElement("li", {
    className: "header-list-item",
    onClick: () => toggle("site"),
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "menu",
    "aria-expanded": open === "site"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "lead-icon"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "map-pin",
    weight: "bold"
  })), "Site 1", /*#__PURE__*/React.createElement("span", {
    className: "caret-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "caret-down",
    size: "11px",
    weight: "bold"
  }))))), /*#__PURE__*/React.createElement("ul", {
    className: "navbar-center"
  }, /*#__PURE__*/React.createElement("li", {
    onClick: () => toggle("weather"),
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "dialog",
    "aria-expanded": open === "weather"
  }, /*#__PURE__*/React.createElement("span", {
    className: "weather-trigger"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "cloud-sun",
    weight: "fill"
  })), /*#__PURE__*/React.createElement(Ph, {
    name: "caret-down",
    size: "11px",
    weight: "bold",
    style: {
      color: "var(--blue)"
    }
  }))), /*#__PURE__*/React.createElement("li", {
    className: "cursor-default",
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "clock"
  }, /*#__PURE__*/React.createElement("span", null, "05:22", /*#__PURE__*/React.createElement("sup", null, "A")), /*#__PURE__*/React.createElement("span", {
    className: "tz"
  }, "America/New York")))), /*#__PURE__*/React.createElement("ul", {
    className: "navbar-right"
  }, /*#__PURE__*/React.createElement("li", {
    className: "header-list-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert-msg-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-anim-marquee"
  }, /*#__PURE__*/React.createElement("div", {
    className: "msg-wrap"
  }, /*#__PURE__*/React.createElement("p", null, "Your trial is not updated. To keep using your account, please update your billing."))), /*#__PURE__*/React.createElement("button", {
    className: "take-action"
  }, "Take Action"))), /*#__PURE__*/React.createElement("li", {
    className: "help-btn",
    title: "Help & support",
    onClick: () => toggle("support"),
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "menu",
    "aria-expanded": open === "support",
    "aria-label": "Help and support"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "question",
    weight: "bold"
  })), /*#__PURE__*/React.createElement("li", {
    className: "gear-btn",
    title: "Settings",
    role: "button",
    tabIndex: 0,
    "aria-label": "Settings"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "gear",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("li", {
    onClick: () => toggle("profile"),
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "menu",
    "aria-expanded": open === "profile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "user-icon",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#cfe0ff"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "user",
    weight: "fill",
    style: {
      color: "#fff",
      fontSize: 20
    }
  })))), open === "apps" && /*#__PURE__*/React.createElement(HwAppsDropdown, null), open === "site" && /*#__PURE__*/React.createElement(HwSiteDropdown, null), open === "weather" && /*#__PURE__*/React.createElement(HwWeatherDropdown, null), open === "profile" && /*#__PURE__*/React.createElement(HwProfileDropdown, {
    lightTheme: lightTheme,
    setLightTheme: setLightTheme
  }), open === "support" && /*#__PURE__*/React.createElement(HwSupportDropdown, null));
}
const HW_SUPPORT = [{
  name: "Settings",
  icon: "gear-six",
  chev: true
}, {
  name: "FAQ",
  icon: "question"
}, {
  name: "Get Mobile App",
  icon: "device-mobile"
}, {
  name: "Help Center",
  icon: "play-circle"
}, {
  name: "Feedback",
  icon: "chat-dots"
}, {
  name: "Support",
  icon: "lifebuoy"
}, {
  name: "Release Notes",
  icon: "scroll"
}];
function HwSupportDropdown() {
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-support-dd",
    role: "menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "support-head"
  }, "Version 6.9.0"), /*#__PURE__*/React.createElement("ul", null, HW_SUPPORT.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.name,
    role: "menuitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "si"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: s.icon
  })), s.name, s.chev && /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "caret-right"
  }))))));
}
function HwAppsDropdown() {
  const apps = [{
    name: "Plum POS",
    color: "#e8a13c",
    icon: "storefront"
  }, {
    name: "Plum POS DashBoard",
    color: "#7b42ff",
    icon: "chart-pie-slice"
  }, {
    name: "Plum Timekeeping",
    color: "#e23744",
    icon: "clock"
  }, {
    name: "Settings",
    color: "var(--iron)",
    icon: "gear",
    isSetting: true
  }, {
    name: "App Store",
    color: "var(--theme)",
    icon: "shopping-bag",
    isStore: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-app-list",
    role: "menu"
  }, /*#__PURE__*/React.createElement("ul", null, apps.map(a => /*#__PURE__*/React.createElement("li", {
    key: a.name,
    role: "menuitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "app-ico",
    style: {
      background: a.color
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: a.icon,
    weight: "fill",
    size: "13px"
  })), a.name))));
}
function HwSiteDropdown() {
  const sites = [{
    name: "Red Panda Pappers",
    addr: ""
  }, {
    name: "Site 1",
    addr: "Plum Restaurant"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-site-list",
    role: "menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "choose-site"
  }, /*#__PURE__*/React.createElement("h2", null, "Choose Site(s)")), /*#__PURE__*/React.createElement("ul", null, sites.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.name,
    role: "menuitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "site-icon"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "map-pin",
    weight: "fill",
    size: "14px"
  })), /*#__PURE__*/React.createElement("span", {
    className: "site-name"
  }, s.name), s.addr && /*#__PURE__*/React.createElement("span", {
    className: "site-address"
  }, s.addr)))));
}
function HwWeatherDropdown({
  configured = false
}) {
  if (!configured) {
    return /*#__PURE__*/React.createElement("div", {
      className: "hw-dd hw-weather-dd",
      role: "dialog",
      "aria-label": "Weather forecast"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "update-location-title"
    }, "Weather Forecast"), /*#__PURE__*/React.createElement("p", {
      className: "update-location-smry"
    }, "Site Location/Adress is not yet configured.", /*#__PURE__*/React.createElement("br", null), "Please provide the Site Location to view weather forecast."), /*#__PURE__*/React.createElement("div", {
      className: "update-location"
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "Please Enter Location name",
      "aria-label": "Location name"
    })));
  }
  const week = [{
    d: "Mon",
    ico: "sun",
    hi: "72",
    lo: "58"
  }, {
    d: "Tue",
    ico: "cloud-sun",
    hi: "70",
    lo: "56"
  }, {
    d: "Wed",
    ico: "cloud-rain",
    hi: "65",
    lo: "54"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-weather-dd configured",
    role: "dialog",
    "aria-label": "Weather forecast"
  }, /*#__PURE__*/React.createElement("div", {
    className: "weather-today"
  }, /*#__PURE__*/React.createElement("h2", null, "Fri, May 29"), /*#__PURE__*/React.createElement("div", {
    className: "w-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "cloud-sun",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-status"
  }, "Partly cloudy"), /*#__PURE__*/React.createElement("div", {
    className: "w-high"
  }, "68\xB0F"), /*#__PURE__*/React.createElement("div", {
    className: "w-low"
  }, "54\xB0F")), /*#__PURE__*/React.createElement("div", {
    className: "weather-weekly"
  }, week.map(w => /*#__PURE__*/React.createElement("div", {
    key: w.d,
    className: "day"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dname"
  }, w.d), /*#__PURE__*/React.createElement("div", {
    className: "w-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: w.ico,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, w.hi, "\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: .7
    }
  }, w.lo, "\xB0")))));
}
function HwProfileDropdown({
  lightTheme,
  setLightTheme
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("English");
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-profile-dd",
    role: "menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-section"
  }, /*#__PURE__*/React.createElement("span", {
    className: "profile-img",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "user",
    weight: "fill",
    style: {
      color: "var(--primaryDark)",
      fontSize: 30
    }
  })), /*#__PURE__*/React.createElement("ul", {
    className: "profile-setting"
  }, /*#__PURE__*/React.createElement("li", {
    className: "hw-lang-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      setLangOpen(v => !v);
    },
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "flag",
    src: "https://flagcdn.com/us.svg",
    alt: ""
  }), " ", lang, " ", /*#__PURE__*/React.createElement(Ph, {
    name: "caret-down",
    size: "10px"
  })), langOpen && /*#__PURE__*/React.createElement(HwLangDropdown, {
    active: lang,
    onPick: l => {
      setLang(l);
      setLangOpen(false);
    }
  })), /*#__PURE__*/React.createElement("li", null, "Edit"))), /*#__PURE__*/React.createElement("ul", {
    className: "profile-data"
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "user"
  })), " R Dixit")), /*#__PURE__*/React.createElement("li", {
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "envelope-simple"
  })), " plum@22.com")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "key"
  })), " Change Password")), /*#__PURE__*/React.createElement("li", {
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "sun"
  })), " Light Theme"), /*#__PURE__*/React.createElement(FnSwitch, {
    size: "md",
    checked: lightTheme,
    onChange: setLightTheme,
    ariaLabel: "Light theme"
  })), /*#__PURE__*/React.createElement("li", {
    className: "red"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "power"
  })), " Logout"))));
}
const HW_LANGS = [{
  name: "English",
  flag: "us"
}, {
  name: "Spanish",
  flag: "es"
}, {
  name: "French",
  flag: "fr"
}, {
  name: "Chinese",
  flag: "cn"
}, {
  name: "Italian",
  flag: "it"
}, {
  name: "German",
  flag: "de"
}];
function HwLangDropdown({
  active,
  onPick
}) {
  return /*#__PURE__*/React.createElement("ul", {
    className: "hw-lang-dd",
    role: "menu",
    "aria-label": "Select language"
  }, /*#__PURE__*/React.createElement("li", {
    className: "lang-head",
    style: {
      cursor: "default"
    },
    "aria-hidden": "true"
  }, "Select Language"), HW_LANGS.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.name,
    role: "menuitemradio",
    "aria-checked": active === l.name,
    onClick: e => {
      e.stopPropagation();
      onPick(l.name);
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "flag",
    src: `https://flagcdn.com/${l.flag}.svg`,
    alt: ""
  }), l.name)));
}

/* ----- The doc page ----- */
function ViewHwHeader() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(ComponentHead, {
    name: "App header",
    selector: "<hw-header-main>",
    ngModule: "HwFoundationModule.forRoot()",
    summary: "The top app chrome \u2014 50px tall on var(--side-nav-bg), pinned to the top of its scroll context (position: sticky; top: 0) so it stays put while the page body scrolls. Three zones: left (logo \xB7 My App dropdown \xB7 Site dropdown), center (absolutely-centered weather trigger + clock/timezone), right (billing marquee with hover Take-Action button \xB7 help/support popover \xB7 settings gear \xB7 profile dropdown). Composes the hw-header-apps, hw-header-site, hw-header-weather, hw-header-support, hw-header-profile, and hw-time-clock sub-components."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Full header"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Click ", /*#__PURE__*/React.createElement("b", null, "My App"), ", ", /*#__PURE__*/React.createElement("b", null, "Site 1"), ", the ", /*#__PURE__*/React.createElement("b", null, "weather"), " icon, the ", /*#__PURE__*/React.createElement("b", null, "?"), " help/support button, or the ", /*#__PURE__*/React.createElement("b", null, "profile"), " avatar to open each dropdown. Hover the red billing message to reveal the green Take Action button. The header is pinned (", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "position: sticky; top: 0"), ") so it stays in place as the page scrolls."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default-color)",
      borderRadius: 8,
      overflow: "visible",
      position: "relative",
      minHeight: 460
    }
  }, /*#__PURE__*/React.createElement(HwHeaderMain, null), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--body-bg)",
      padding: 24,
      minHeight: 350,
      borderRadius: "0 0 8px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Page content sits below the header. Dropdowns overlay this area."))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Anatomy"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "Logo (brand)",
      type: "img.logo",
      desc: "App mark — full-bleed 50×50 cell, no padding. Per-app icon (Plum POS, Timekeeping, etc.)."
    }, {
      name: "My App",
      type: "hw-header-apps",
      desc: "App-switcher dropdown — lists the org's apps + Settings + App Store with per-app icons."
    }, {
      name: "Site 1",
      type: "hw-header-site",
      desc: "Site switcher — 'Choose Site(s)' heading + zebra-striped list with pin icon, name, and address."
    }, {
      name: "Weather",
      type: "hw-header-weather",
      desc: "Center trigger (icon + temp). Dropdown shows the configure-location prompt OR today + 3-day forecast when configured."
    }, {
      name: "Clock",
      type: "hw-time-clock",
      desc: "Time (12h with superscript meridiem or 24h) + timezone label. Separated from weather by a 1.5px white divider."
    }, {
      name: "Billing marquee",
      type: "alert-msg-header",
      desc: "214px scrolling red message. On hover a full-height green Take Action button slides in from the right."
    }, {
      name: "Help / Support",
      type: "hw-header-support",
      desc: "? trigger opens the support popover — a blue version header (e.g. Version 6.9.0) over a list: Settings (with chevron), FAQ, Get Mobile App, Help Center, Feedback, Support, Release Notes."
    }, {
      name: "Settings",
      type: "fn-global-settings",
      desc: "Gear icon — routes to app settings."
    }, {
      name: "Profile",
      type: "hw-header-profile",
      desc: "Avatar opens the profile dropdown — gradient header w/ avatar + language + Edit; then name, email, change password, Light Theme toggle, logout."
    }]
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Sub-component selectors"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush",
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "proptbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Selector"), /*#__PURE__*/React.createElement("th", null, "Purpose"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-main>")), /*#__PURE__*/React.createElement("td", null, "Wrapper \u2014 composes everything below.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-apps>")), /*#__PURE__*/React.createElement("td", null, "App launcher dropdown (My App).")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-site>")), /*#__PURE__*/React.createElement("td", null, "Site switcher dropdown.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-weather>")), /*#__PURE__*/React.createElement("td", null, "Weather trigger + forecast / configure dropdown.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-time-clock>")), /*#__PURE__*/React.createElement("td", null, "Clock + timezone. Honors isMilitaryTime.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-support>")), /*#__PURE__*/React.createElement("td", null, "Help / support popover \u2014 version header + support links.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-profile>")), /*#__PURE__*/React.createElement("td", null, "Profile dropdown \u2014 language, edit, change password, theme, logout.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-franchise>")), /*#__PURE__*/React.createElement("td", null, "Franchise switcher (multi-brand managers) \u2014 optional, right zone.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-unauth>")), /*#__PURE__*/React.createElement("td", null, "Logged-out variant \u2014 logo + profile only."))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Dropdowns \u2014 opened states"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Each dropdown shown statically below for reference."), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2",
    style: {
      gap: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "My App"), /*#__PURE__*/React.createElement("div", {
    className: "dd-spec",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-app-list"
  }, /*#__PURE__*/React.createElement(HwAppsInner, null)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Site switcher"), /*#__PURE__*/React.createElement("div", {
    className: "dd-spec",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-site-list"
  }, /*#__PURE__*/React.createElement(HwSiteInner, null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Weather \u2014 configured"), /*#__PURE__*/React.createElement("div", {
    className: "dd-spec",
    style: {
      marginTop: 8,
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-weather-dd configured"
  }, /*#__PURE__*/React.createElement(HwWeatherInner, null)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    className: "dd-spec",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-profile-dd"
  }, /*#__PURE__*/React.createElement(HwProfileInner, null)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Help / Support"), /*#__PURE__*/React.createElement("div", {
    className: "dd-spec",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-dd hw-support-dd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "support-head"
  }, "Version 6.9.0"), /*#__PURE__*/React.createElement("ul", null, HW_SUPPORT.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.name
  }, /*#__PURE__*/React.createElement("span", {
    className: "si"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: s.icon
  })), s.name, s.chev && /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "caret-right"
  }))))))))), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Each trigger is keyboard-activatable with aria-haspopup + aria-expanded; dropdowns are role='menu' / role='dialog'.", "The weather temp trigger carries an aria-label with the full reading (e.g. 'Weather: 68 °F') since the icon alone isn't descriptive.", "Profile avatar img has alt set to the user title; icon-only gear has aria-label='Settings'.", "Marquee message respects prefers-reduced-motion — the animation pauses and the text wraps instead of scrolling.", "The billing alert uses role='status' so screen readers announce it without interrupting."]
  }));
}

/* static inner renderers (no positioning) reused for the spec grid */
function HwAppsInner() {
  const apps = [{
    name: "Plum POS",
    color: "#e8a13c",
    icon: "storefront"
  }, {
    name: "Plum POS DashBoard",
    color: "#7b42ff",
    icon: "chart-pie-slice"
  }, {
    name: "Plum Timekeeping",
    color: "#e23744",
    icon: "clock"
  }, {
    name: "Settings",
    color: "var(--iron)",
    icon: "gear"
  }, {
    name: "App Store",
    color: "var(--theme)",
    icon: "shopping-bag"
  }];
  return /*#__PURE__*/React.createElement("ul", null, apps.map(a => /*#__PURE__*/React.createElement("li", {
    key: a.name
  }, /*#__PURE__*/React.createElement("span", {
    className: "app-ico",
    style: {
      background: a.color
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: a.icon,
    weight: "fill",
    size: "13px"
  })), a.name)));
}
function HwSiteInner() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "choose-site"
  }, /*#__PURE__*/React.createElement("h2", null, "Choose Site(s)")), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "site-icon"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "map-pin",
    weight: "fill",
    size: "14px"
  })), /*#__PURE__*/React.createElement("span", {
    className: "site-name"
  }, "Red Panda Pappers")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "site-icon"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "map-pin",
    weight: "fill",
    size: "14px"
  })), /*#__PURE__*/React.createElement("span", {
    className: "site-name"
  }, "Site 1"), /*#__PURE__*/React.createElement("span", {
    className: "site-address"
  }, "Plum Restaurant"))));
}
function HwWeatherInner() {
  const week = [{
    d: "Mon",
    ico: "sun",
    hi: "72",
    lo: "58"
  }, {
    d: "Tue",
    ico: "cloud-sun",
    hi: "70",
    lo: "56"
  }, {
    d: "Wed",
    ico: "cloud-rain",
    hi: "65",
    lo: "54"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "weather-today"
  }, /*#__PURE__*/React.createElement("h2", null, "Fri, May 29"), /*#__PURE__*/React.createElement("div", {
    className: "w-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "cloud-sun",
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-status"
  }, "Partly cloudy"), /*#__PURE__*/React.createElement("div", {
    className: "w-high"
  }, "68\xB0F"), /*#__PURE__*/React.createElement("div", {
    className: "w-low"
  }, "54\xB0F")), /*#__PURE__*/React.createElement("div", {
    className: "weather-weekly"
  }, week.map(w => /*#__PURE__*/React.createElement("div", {
    key: w.d,
    className: "day"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dname"
  }, w.d), /*#__PURE__*/React.createElement("div", {
    className: "w-ico"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: w.ico,
    weight: "fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, w.hi, "\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: .7
    }
  }, w.lo, "\xB0")))));
}
function HwProfileInner() {
  const [light, setLight] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("English");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "profile-section"
  }, /*#__PURE__*/React.createElement("span", {
    className: "profile-img",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "user",
    weight: "fill",
    style: {
      color: "var(--primaryDark)",
      fontSize: 30
    }
  })), /*#__PURE__*/React.createElement("ul", {
    className: "profile-setting"
  }, /*#__PURE__*/React.createElement("li", {
    className: "hw-lang-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setLangOpen(v => !v),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "flag",
    src: "https://flagcdn.com/us.svg",
    alt: ""
  }), " ", lang, " ", /*#__PURE__*/React.createElement(Ph, {
    name: "caret-down",
    size: "10px"
  })), langOpen && /*#__PURE__*/React.createElement(HwLangDropdown, {
    active: lang,
    onPick: l => {
      setLang(l);
      setLangOpen(false);
    }
  })), /*#__PURE__*/React.createElement("li", null, "Edit"))), /*#__PURE__*/React.createElement("ul", {
    className: "profile-data"
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "user"
  })), " R Dixit")), /*#__PURE__*/React.createElement("li", {
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "envelope-simple"
  })), " plum@22.com")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "key"
  })), " Change Password")), /*#__PURE__*/React.createElement("li", {
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "sun"
  })), " Light Theme"), /*#__PURE__*/React.createElement(FnSwitch, {
    size: "md",
    checked: light,
    onChange: setLight,
    ariaLabel: "Light theme"
  })), /*#__PURE__*/React.createElement("li", {
    className: "red"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "pi"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "power"
  })), " Logout"))));
}
Object.assign(window, {
  ViewHwHeader,
  HwHeaderMain
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-hw-header.jsx", error: String((e && e.message) || e) }); }

// src/view-patterns.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-patterns.jsx
   Page-level composition patterns. All built from the same boilerplate.
   ============================================================================ */

/* =============================== PATTERN — APP SHELL ===================== */
function ViewPatternShell() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "App shell",
    lead: "The root layout: HW header on top, fn-menu-sidebar on the left, router outlet in the middle, ag-drawer-host + fn-loader at the bottom of the tree."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<hw-header-main></hw-header-main>
<div class="app-body">
  <fn-menu-sidebar [menu]="nav"></fn-menu-sidebar>
  <div class="page">
    <router-outlet></router-outlet>
  </div>
</div>
<fn-loader></fn-loader>
<ag-drawer-host></ag-drawer-host>`
  }, /*#__PURE__*/React.createElement(ShellMock, null)), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Zones"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      lineHeight: 1.8,
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Top bar"), " \u2014 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<hw-header-main>"), " \xB7 52px tall \xB7 dark surface \xB7 houses brand + site switcher + apps + weather + time-clock + profile."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Sidebar"), " \u2014 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<fn-menu-sidebar>"), " \xB7 240px wide \xB7 dark surface \xB7 grouped sections + badges."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Page"), " \u2014 scrollable area \xB7 contains the routed page wrapped in ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".hw-box-content"), " boilerplate."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Overlay layer"), " \u2014 ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<ag-drawer-host>"), " + ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, "<fn-loader>"), " rendered once at app root; service-driven."))));
}
function ShellMock({
  children,
  title = "Schedules",
  subtitle = "Riverside Bistro · Week of Mar 11"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default-color)",
      borderRadius: 8,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(HwHeaderMain, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "50px 1fr",
      minHeight: 360,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement(FnMenuSidebar, {
    mode: "auto",
    active: "schedule",
    onPick: () => {},
    items: [{
      id: "dashboard",
      label: "Dashboard",
      icon: "house"
    }, {
      id: "schedule",
      label: "Schedule",
      icon: "calendar",
      badge: 3
    }, {
      id: "team",
      label: "Team",
      icon: "users-three"
    }, {
      id: "timeclock",
      label: "Time clock",
      icon: "clock-counter-clockwise"
    }, {
      id: "labor",
      label: "Labor",
      icon: "chart-pie-slice"
    }, {
      id: "payroll",
      label: "Payroll",
      icon: "hand-coins"
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--body-bg)",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-box-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhs flex-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fn-global-schedule"
  }), " ", title), /*#__PURE__*/React.createElement("div", {
    className: "rhs"
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    className: "hw-title"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "download-simple",
    text: "Export"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-xs btn-round",
    iconAddonBefore: "plus",
    text: "Publish"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hw-content",
    style: {
      minHeight: 160
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Page body \u2014 table, dashboard, form, etc."))))));
}

/* =============================== PATTERN — BOILERPLATE =================== */
function ViewPatternBoilerplate() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Page boilerplate (.hw-box-content)",
    lead: "Every routed page wraps its content in this 3-region structure: a header strip (bg-primary-dark) with the page title + leading theme-colored icon, an optional title bar for tabs/filters/actions, and the content body. Do not invent alternative scaffolding."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Anatomy"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "hw-box-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhs flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "region-tag"
  }, "1 HEADER"), /*#__PURE__*/React.createElement(Ph, {
    name: "house"
  }), " Page main title"), /*#__PURE__*/React.createElement("div", {
    className: "rhs"
  }, "Page subtitle / context"))), /*#__PURE__*/React.createElement("div", {
    className: "hw-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "region-tag sec",
    style: {
      alignSelf: "center"
    }
  }, "2 TITLE BAR"), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    text: "Cancel"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-xs btn-round",
    text: "Save"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hw-content",
    style: {
      minHeight: 120
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "region-tag bdy"
  }, "3 BODY"), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Table, form, dashboard grid, detail card, or empty state.")))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Example \u2014 title + filters + empty state"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "Header carries the page title (icon + \"Menu Item Pricing\"); the title bar holds a subtitle line + filter controls; the body shows the no-data illustration when empty."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "hw-box-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhs flex-1"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "book-open"
  }), " Menu Item Pricing"))), /*#__PURE__*/React.createElement("div", {
    className: "hw-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      marginBottom: 14
    }
  }, "Manage items details and pricing here."), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      alignItems: "flex-end",
      gap: 20,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "bp-grp",
    label: "Select Menu Group"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Beverages"
    }, {
      id: 2,
      name: "Entrées"
    }],
    value: null,
    onChange: () => {},
    placeholder: "Select Group"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "bp-store",
    label: "Select Store"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Riverside Bistro"
    }],
    value: null,
    onChange: () => {},
    placeholder: "Select store"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-round",
    iconAddonAfter: "funnel",
    text: "Filter"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--body-bg)",
      borderRadius: "var(--radius-md)",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement(FnNoData, {
    headerTitle: "No Data to Display",
    showImg: true,
    imgContainerheight: 220
  }))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Example \u2014 tabbed header + actions"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: -8,
      marginBottom: 16
    }
  }, "The header hosts pill ", /*#__PURE__*/React.createElement("code", {
    className: "ds-inline"
  }, ".tab-nav"), " tabs on the left and action buttons on the right; the body shows the inline red no-data bar."), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "hw-box-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("ul", {
    className: "tab-nav"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    className: "tab-link active"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "users-three",
    weight: "fill",
    size: "15px"
  }), " Employees")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    className: "tab-link"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "user-minus",
    size: "15px"
  }), " Terminated Employees")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    className: "tab-link"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "clipboard-text",
    size: "15px"
  }), " Audit Trail"))), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "success btn-sm btn-round",
    text: "Push Changes",
    disabled: true
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-sm btn-round",
    iconAddonBefore: "plus",
    text: "Add"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-sm btn-round",
    iconAddonAfter: "caret-down",
    text: "",
    ariaLabel: "More actions"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "hw-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-nodata-bar"
  }, "No_Data_to_display")))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Template"), /*#__PURE__*/React.createElement(Demo, {
    code: `<div class="hw-box-content">
  <!-- Region 1: page header -->
  <div class="hw-header-wrap">
    <div class="row">
      <div class="col"><i class="fn-global-menuPricing"></i> {{ 'MENU_ITEM_PRICING' | fnTranslate }}</div>
    </div>
  </div>

  <!-- Region 2 (optional): title bar — tabs / filters / actions -->
  <div class="hw-title">
    <ul class="tab-nav">
      <li><a class="tabActive"><i class="fn-global-employee"></i> Employees</a></li>
      <li><a>Terminated Employees</a></li>
    </ul>
  </div>

  <!-- Region 3: page body -->
  <div class="hw-content">
    <fn-no-data-box [showImg]="true" [headerTitle]="'No_Data_to_display' | fnTranslate"></fn-no-data-box>
  </div>
</div>`
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Region contract"), /*#__PURE__*/React.createElement(PropTable, {
    rows: [{
      name: "1 Header (.hw-header-wrap)",
      type: "—",
      desc: "bg-primary-dark strip, min-height 37px. Page title (left, with leading theme-colored icon). Can also host tab-nav pills + right-aligned actions."
    }, {
      name: "2 Title bar (.hw-title)",
      type: "—",
      desc: "bg-primary. Subtitle line, filter controls, or a second action row. Rounds the top when it's the first child."
    }, {
      name: "3 Content (.hw-content)",
      type: "—",
      desc: "bg-primary body, 12px padding, rounds the bottom corners. Holds the table / form / dashboard / empty state."
    }]
  }), /*#__PURE__*/React.createElement(A11yNote, {
    items: ["Header title uses a heading element so the page has a clear h1/h2 landmark.", "tab-nav uses role='tablist' + role='tab'; the active tab has aria-selected='true' (not just the theme fill).", "Disabled actions (e.g. Push Changes) keep their label + tooltip so context isn't lost.", "The leading icon is decorative (aria-hidden) — the title text carries meaning."]
  }));
}

/* =============================== PATTERN — DASHBOARD ===================== */
function ViewPatternDashboard() {
  const tiles = [{
    label: "Open shifts",
    value: "23",
    delta: "−4",
    dir: "down",
    chart: "spark1",
    color: "var(--orange)"
  }, {
    label: "On the clock now",
    value: "47",
    delta: "+6",
    dir: "up",
    chart: "spark2",
    color: "var(--green)"
  }, {
    label: "Hours scheduled",
    value: "1,284",
    delta: "+12",
    dir: "up",
    chart: "spark3",
    color: "var(--blue)"
  }, {
    label: "Labor cost",
    value: "$18.4k",
    delta: "−2.1%",
    dir: "down",
    chart: "spark4",
    color: "var(--cyan)"
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Dashboard",
    lead: "Card-grid dashboard built on the boilerplate. Use the dashboard tokens (--dashboard-header-wrap, --dashboard-body-wrap, --dashboard-wrap-border) for tile chrome."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    className: "hw-box-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhs flex-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fn-global-schedule"
  }), " Manager dashboard"), /*#__PURE__*/React.createElement("div", {
    className: "rhs"
  }, "Riverside Bistro \xB7 this week"))), /*#__PURE__*/React.createElement("div", {
    className: "hw-title split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-group btn-group-round"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary btn-xs",
    style: {
      background: "var(--blue)",
      color: "#fff"
    }
  }, "Day"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary btn-xs"
  }, "Week"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary btn-xs"
  }, "Month")), /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "calendar",
    text: "Mar 11 \u2013 Mar 18, 2026"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "download-simple",
    text: "Export PDF"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hw-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-4",
    style: {
      marginBottom: 16
    }
  }, tiles.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.label,
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, t.label, /*#__PURE__*/React.createElement(Ph, {
    name: "dots-three",
    size: "14px"
  })), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, t.value), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `delta ${t.dir}`
  }, /*#__PURE__*/React.createElement(Ph, {
    name: t.dir === "up" ? "trend-up" : "trend-down",
    size: "12px"
  }), " ", t.delta, " vs last week"), /*#__PURE__*/React.createElement("div", {
    className: "spark",
    "aria-hidden": "true"
  }, [4, 6, 8, 5, 9, 7, 11].map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: h * 2,
      background: t.color
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tile",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("header", null, "Coverage by role \xB7 this week"), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 380 160",
    style: {
      width: "100%",
      height: 160
    }
  }, [["Server", [82, 90, 85, 78, 95, 98, 92], "var(--blue)"], ["Bartender", [60, 62, 58, 55, 72, 80, 68], "var(--orange)"], ["Cook", [70, 72, 68, 65, 80, 86, 76], "var(--green)"]].map(([name, data, color], si) => /*#__PURE__*/React.createElement(Fragment, {
    key: name
  }, /*#__PURE__*/React.createElement("polyline", {
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    points: data.map((v, i) => `${30 + i * 50},${140 - v}`).join(" ")
  }), data.map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: 30 + i * 50,
    cy: 140 - v,
    r: "3",
    fill: color
  })), /*#__PURE__*/React.createElement("text", {
    x: "320",
    y: 20 + si * 18,
    fontSize: "11",
    fill: color
  }, "\u25CF ", /*#__PURE__*/React.createElement("tspan", {
    fill: "var(--body-textColor)"
  }, name)))), ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: 30 + i * 50,
    y: 154,
    fontSize: "10",
    fill: "var(--iron)"
  }, d)))), /*#__PURE__*/React.createElement("div", {
    className: "tile",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-default-color)",
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 600,
      color: "var(--iron)",
      textTransform: "uppercase",
      letterSpacing: ".06em"
    }
  }, "Late or no-show \xB7 last 7 days"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 11,
      color: "var(--blue)",
      cursor: "pointer"
    }
  }, "View all")), [{
    who: "Diego Park",
    when: "Tue 9:14am",
    delay: "28min late",
    severity: "danger"
  }, {
    who: "Marco Silva",
    when: "Wed 5:08pm",
    delay: "No-show — replaced",
    severity: "danger"
  }, {
    who: "Priya Nair",
    when: "Fri 4:18pm",
    delay: "18min late",
    severity: "warning"
  }, {
    who: "Ipshita G.",
    when: "Sat 11:09am",
    delay: "9min late",
    severity: "warning"
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.who + r.when,
    style: {
      padding: "10px 16px",
      borderBottom: "1px solid var(--border-default-color)",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: r.who,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, r.who), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, r.when)), /*#__PURE__*/React.createElement(FnTag, {
    color: r.severity
  }, r.delay)))))))));
}

/* =============================== PATTERN — LIST ========================== */
function ViewPatternList() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "List page",
    lead: "The most common page shape: boilerplate + fn-table. Filters go in the title-bar (left), actions on the right."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Employees",
    subtitle: "Riverside Bistro \xB7 142 active"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(FnInput, {
    prefix: /*#__PURE__*/React.createElement(Ph, {
      name: "magnifying-glass"
    }),
    placeholder: "Search employees",
    style: {
      width: 240
    }
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs",
    iconAddonBefore: "funnel",
    text: "Role"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs",
    iconAddonBefore: "funnel",
    text: "Status"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs",
    iconAddonBefore: "calendar",
    text: "Hired in"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "download-simple",
    text: "Export"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-xs btn-round",
    iconAddonBefore: "plus",
    text: "Add employee"
  })), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Employee"), /*#__PURE__*/React.createElement("th", null, "Role"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "num"
  }, "Hours \xB7 wk"))), /*#__PURE__*/React.createElement("tbody", null, [["Sana Ahmed", "Manager", "Active", "42h"], ["Rahul Yadav", "Bartender", "Active", "38h"], ["Marco Silva", "Line cook", "Active", "32h"], ["Priya Nair", "Server", "Pending", "—"]].map(([n, r, s, h]) => /*#__PURE__*/React.createElement("tr", {
    key: n
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: n,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, n))), /*#__PURE__*/React.createElement("td", null, r), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnTag, {
    color: s === "Active" ? "success" : "warning"
  }, s)), /*#__PURE__*/React.createElement("td", {
    className: "num"
  }, h))))))));
}

/* =============================== PATTERN — FORM ========================== */
function ViewPatternForm() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Form page",
    lead: "Reactive form inside the boilerplate. Cancel/Save sit in a trailing .hw-title that mirrors the top action row."
  }), /*#__PURE__*/React.createElement(Demo, {
    code: `<form [formGroup]="form" (ngSubmit)="save()" novalidate>
  <div class="hw-content">
    <div class="row">
      <div class="col-6 pb-30">
        <label class="fn-label">{{ 'EMP.NAME' | fnTranslate }}</label>
        <fn-base-input formControlName="name" type="STRING" [isRequired]="true" [maxLength]="80"></fn-base-input>
      </div>
      <!-- ... -->
    </div>
  </div>
  <div class="hw-title">
    <fn-button [type]="'outline-secondary btn-xs btn-round'" [text]="'COMMON.CANCEL'" btnType="button"></fn-button>
    <fn-button [type]="'primary btn-xs btn-round'" [text]="'COMMON.SAVE'" btnType="submit" [disabled]="form.invalid"></fn-button>
  </div>
</form>`
  }, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Add employee",
    subtitle: "Step 1 of 2 \u2014 Basic info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-name",
    label: "Full name",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    placeholder: "e.g. Priya Nair"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-mail",
    label: "Work email",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "email",
    placeholder: "priya@restaurant.com"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-role",
    label: "Primary role",
    required: true
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Server"
    }, {
      id: 2,
      name: "Bartender"
    }, {
      id: 3,
      name: "Line cook"
    }],
    value: 1,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-site",
    label: "Home site",
    required: true
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "Riverside Bistro"
    }, {
      id: 2,
      name: "Downtown Grill"
    }],
    value: 1,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-start",
    label: "Start date",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    value: "Mar 18, 2026",
    readOnly: true,
    suffix: /*#__PURE__*/React.createElement(Ph, {
      name: "calendar",
      size: "13px"
    })
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-pay",
    label: "Hourly rate",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "18.50",
    prefix: "$",
    suffix: "USD"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "f-notes",
    label: "Notes",
    help: "Visible to managers only."
  }, /*#__PURE__*/React.createElement(FnTextarea, {
    rows: 3,
    placeholder: "Anything HR should know\u2026"
  })))))));
}

/* =============================== PATTERN — DETAIL ======================== */
function ViewPatternDetail() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const t = useToast();
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Detail + drawer",
    lead: "Open edit views in a right-side drawer instead of routing \u2014 the URL stays at the list. Confirm destructive actions with FnCnfModalService and feed back with FnToasterService."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Shift detail",
    subtitle: "SHIFT-2027"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Shift"), /*#__PURE__*/React.createElement("div", {
    className: "ds-h1",
    style: {
      marginTop: 4,
      marginBottom: 8
    }
  }, "Fri, Mar 18 \xB7 5:00 \u2013 11:00 pm"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13
    }
  }, "Assigned to ", /*#__PURE__*/React.createElement("b", null, "Marco Silva"), " \u2014 Line cook \xB7 Riverside Bistro"), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DetailRow, {
    icon: "user",
    label: "Employee",
    value: /*#__PURE__*/React.createElement(FnAvatar, {
      name: "Marco Silva",
      size: "sm"
    }),
    valueExtra: "Marco Silva \xB7 Line cook"
  }), /*#__PURE__*/React.createElement(DetailRow, {
    icon: "clock",
    label: "Hours",
    value: "6h 00m"
  }), /*#__PURE__*/React.createElement(DetailRow, {
    icon: "hand-coins",
    label: "Estimated pay",
    value: "$132.00"
  }), /*#__PURE__*/React.createElement(DetailRow, {
    icon: "map-pin",
    label: "Site",
    value: "Riverside Bistro \xB7 station 2"
  }), /*#__PURE__*/React.createElement(DetailRow, {
    icon: "note-pencil",
    label: "Notes",
    value: "Run brunch prep starting at 4:30. Two events on the books."
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow"
  }, "Activity"), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack",
    style: {
      gap: 0,
      marginTop: 8
    }
  }, [{
    who: "Sana Ahmed",
    when: "2h ago",
    what: "assigned the shift to Marco"
  }, {
    who: "Marco Silva",
    when: "1h ago",
    what: "accepted the shift"
  }, {
    who: "Sana Ahmed",
    when: "12min ago",
    what: "added a note"
  }].map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "10px 0",
      borderBottom: "1px solid var(--border-default-color)",
      display: "flex",
      gap: 10,
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: e.who,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("b", null, e.who), " ", /*#__PURE__*/React.createElement("span", null, e.what), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, e.when))))), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-primary btn-sm",
    iconAddonBefore: "pencil-simple",
    text: "Edit shift",
    onClick: () => setDrawerOpen(true)
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-danger btn-sm",
    iconAddonBefore: "trash",
    text: "Delete",
    onClick: () => setConfirmOpen(true)
  })))))), /*#__PURE__*/React.createElement(FnDrawer, {
    open: drawerOpen,
    onClose: () => setDrawerOpen(false),
    title: "Edit shift \xB7 SHIFT-2027",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FnButton, {
      type: "outline-secondary btn-sm",
      text: "Cancel",
      onClick: () => setDrawerOpen(false)
    }), /*#__PURE__*/React.createElement(FnButton, {
      type: "primary btn-sm",
      text: "Save changes",
      onClick: () => {
        setDrawerOpen(false);
        t.success("Shift updated");
      }
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-stack"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-emp",
    label: "Employee",
    required: true
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: "marco",
      name: "Marco Silva"
    }, {
      id: "priya",
      name: "Priya Nair"
    }],
    value: "marco",
    onChange: () => {}
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-start",
    label: "Start"
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "5:00 PM"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-end",
    label: "End"
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "11:00 PM"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-notes",
    label: "Notes"
  }, /*#__PURE__*/React.createElement(FnTextarea, {
    rows: 3,
    defaultValue: "Run brunch prep starting at 4:30. Two events on the books."
  })))), /*#__PURE__*/React.createElement(FnDialog, {
    open: confirmOpen,
    type: "danger",
    title: "Delete shift SHIFT-2027?",
    content: "The shift will be removed and Marco will be unassigned. This can't be undone.",
    confirmText: "Delete shift",
    onClose: () => setConfirmOpen(false),
    onConfirm: () => {
      setConfirmOpen(false);
      t.success("Shift deleted");
    }
  }));
}
function DetailRow({
  icon,
  label,
  value,
  valueExtra
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 12,
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: icon,
    size: "16px",
    style: {
      color: "var(--iron)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12,
      width: 110
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, value, valueExtra && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8
    }
  }, valueExtra)));
}

/* =============================== PATTERN — AUTH ========================== */
function ViewPatternAuth() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Auth",
    lead: "Split-pane auth shell \u2014 brand panel on the left, form on the right. Uses hw-header-unauth at the top."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      border: "1px solid var(--border-default-color)",
      minHeight: 480,
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--side-nav-bg)",
      padding: 40,
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 9,
      background: "linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      color: "#fff"
    }
  }, "AG"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 16
    }
  }, "HubWorks")), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 36,
      fontWeight: 600,
      letterSpacing: "-.02em",
      fontSize: 28,
      lineHeight: 1.2
    }
  }, "Built for restaurant operators who'd rather be on the floor."), /*#__PURE__*/React.createElement("p", {
    style: {
      opacity: .8,
      fontSize: 13,
      marginTop: 12,
      maxWidth: 360
    }
  }, "HubWorks turns schedule conflicts, no-shows, and labor cost into a single screen \u2014 so you can run the place, not the spreadsheet.")), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 24,
      fontSize: 12,
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 Altametrics"), /*#__PURE__*/React.createElement("span", null, "SOC 2 Type II"), /*#__PURE__*/React.createElement("span", null, "WCAG 2.1 AA"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 360,
      margin: "0 auto",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ds-h1",
    style: {
      fontSize: 22
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      marginBottom: 24
    }
  }, "Sign in to continue to Riverside Bistro."), /*#__PURE__*/React.createElement(FormGroup, {
    id: "lg-mail",
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "email",
    placeholder: "you@restaurant.com"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "lg-pwd",
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(FnCheckbox, {
    checked: true,
    onChange: () => {},
    label: "Remember me"
  }), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12,
      color: "var(--blue)"
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary",
    text: "Sign in",
    style: {
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      margin: "20px 0 12px",
      fontSize: 11,
      color: "var(--iron)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 7,
      height: 1,
      background: "var(--border-default-color)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      background: "var(--bg-primary)",
      padding: "0 10px"
    }
  }, "or")), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary",
    text: "Continue with SSO",
    iconAddonBefore: "shield-check",
    style: {
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      marginTop: 16,
      textAlign: "center",
      color: "var(--iron)"
    }
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: "var(--blue)"
    }
  }, "Request access")))))));
}

/* =============================== PATTERN — SETTINGS ====================== */
function ViewPatternSettings() {
  const [tab, setTab] = useState("general");
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Settings",
    lead: "Vertical tabs on the left, content on the right. Save bar pinned to the bottom of the content region."
  }), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Site settings",
    subtitle: "Riverside Bistro"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(FnTabs, {
    vertical: true,
    active: tab,
    onChange: setTab,
    tabs: [{
      id: "general",
      label: "General",
      icon: "gear"
    }, {
      id: "team",
      label: "Team & roles",
      icon: "users-three"
    }, {
      id: "schedule",
      label: "Scheduling rules",
      icon: "calendar"
    }, {
      id: "clock",
      label: "Time clock",
      icon: "clock"
    }, {
      id: "billing",
      label: "Billing",
      icon: "credit-card"
    }, {
      id: "danger",
      label: "Danger zone",
      icon: "warning-octagon"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-stack"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3",
    style: {
      marginTop: 0
    }
  }, "General"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13
    }
  }, "Site-level basics. Changes apply to everyone at this site.")), /*#__PURE__*/React.createElement(FormGroup, {
    id: "s-name",
    label: "Site name",
    required: true
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "Riverside Bistro"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "s-tz",
    label: "Timezone"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: "PT",
      name: "America/Los_Angeles (PT)"
    }, {
      id: "ET",
      name: "America/New_York (ET)"
    }],
    value: "PT",
    onChange: () => {}
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "s-start",
    label: "Workweek starts on"
  }, /*#__PURE__*/React.createElement(FnRadioGroup, {
    name: "ws",
    value: "mon",
    onChange: () => {},
    options: [{
      id: "sun",
      label: "Sunday"
    }, {
      id: "mon",
      label: "Monday"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Allow shift swaps",
    desc: "Employees can request swaps with peers; manager must approve",
    defaultOn: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Late-clock-in alerts",
    desc: "Manager pages on first late clock-in over 15min",
    defaultOn: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Auto-publish weekly",
    desc: "Publish next week's schedule every Sunday at 8pm"
  }))))));
}

/* =============================== PATTERN — EMPTY ========================= */
function ViewPatternEmpty() {
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pattern",
    title: "Empty & loading states",
    lead: "Empty states pair an explainer with a primary action that resolves the empty condition. Loading states use skeletons that mirror the eventual layout \u2014 never spinners over blank space."
  }), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "First-run empty"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Schedules",
    subtitle: "No published schedules yet"
  }, /*#__PURE__*/React.createElement(FnNoData, {
    icon: "calendar-blank",
    title: "No schedules yet",
    description: "Build your first week \u2014 drag shifts onto employees, or import from last week.",
    addLabel: "Build schedule",
    onAdd: () => {}
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Zero results (after filter)"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Employees",
    subtitle: "0 of 142 match"
  }, /*#__PURE__*/React.createElement(FnNoData, {
    icon: "magnifying-glass",
    title: "No employees match these filters",
    description: "Try clearing role or status \u2014 or check spelling on the search."
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Loading skeleton"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Schedules",
    subtitle: "Loading\u2026"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-4",
    style: {
      marginBottom: 16
    }
  }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "tile"
  }, /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "60%",
    height: 11
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "40%",
    height: 24
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "100%",
    height: 28
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-default-color)"
    }
  }, /*#__PURE__*/React.createElement(FnSkeleton, {
    width: "40%",
    height: 14
  })), [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-default-color)",
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(FnSkeleton, {
    shape: "circle",
    width: 26,
    height: 26
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 120,
    height: 12
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 80,
    height: 12
  }), /*#__PURE__*/React.createElement(FnSkeleton, {
    width: 60,
    height: 12
  })))))), /*#__PURE__*/React.createElement("h2", {
    className: "ds-h2"
  }, "Permission denied"), /*#__PURE__*/React.createElement(Demo, null, /*#__PURE__*/React.createElement(ShellMock, {
    title: "Payroll",
    subtitle: "Access restricted"
  }, /*#__PURE__*/React.createElement(FnNoData, {
    icon: "shield-warning",
    title: "You don't have permission to view this",
    description: "Ask your admin to grant the Payroll role from Settings \u2192 Roles & permissions."
  }))));
}

/* ============================================================================
   Export
   ============================================================================ */
Object.assign(window, {
  ViewPatternShell,
  ViewPatternBoilerplate,
  ViewPatternDashboard,
  ViewPatternList,
  ViewPatternForm,
  ViewPatternDetail,
  ViewPatternAuth,
  ViewPatternSettings,
  ViewPatternEmpty
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-patterns.jsx", error: String((e && e.message) || e) }); }

// src/view-restaurant.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-restaurant.jsx
   The restaurant scheduling demo — the full app embedded inside the gallery
   to showcase how the pieces compose into a real product surface.
   ============================================================================ */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NUMS = ["11", "12", "13", "14", "15", "16", "17"];
const EMPLOYEES_R = [{
  name: "Sana Ahmed",
  role: "Manager",
  rate: 32.00
}, {
  name: "Rahul Yadav",
  role: "Bartender",
  rate: 24.00
}, {
  name: "Marco Silva",
  role: "Line cook",
  rate: 22.00
}, {
  name: "Priya Nair",
  role: "Server",
  rate: 18.50
}, {
  name: "Ipshita Ghosh",
  role: "Server",
  rate: 18.50
}, {
  name: "Diego Park",
  role: "Dishwasher",
  rate: 17.00
}];
// shift data: by employee index, by day index — { time, kind, hours }
const SHIFTS = [
// Sana
[{
  t: "9a-5p",
  k: "done",
  h: 8
}, {
  t: "9a-5p",
  k: "done",
  h: 8
}, null, {
  t: "9a-5p",
  k: "",
  h: 8
}, {
  t: "4p-11p",
  k: "",
  h: 7
}, {
  t: "4p-11p",
  k: "",
  h: 7
}, null],
// Rahul
[null, {
  t: "4p-11p",
  k: "done",
  h: 7
}, {
  t: "4p-11p",
  k: "done",
  h: 7
}, {
  t: "4p-11p",
  k: "",
  h: 7
}, {
  t: "4p-12a",
  k: "",
  h: 8
}, {
  t: "4p-12a",
  k: "",
  h: 8
}, {
  t: "12p-8p",
  k: "swap",
  h: 8
}],
// Marco
[{
  t: "3p-11p",
  k: "done",
  h: 8
}, null, {
  t: "3p-11p",
  k: "done",
  h: 8
}, {
  t: "3p-11p",
  k: "",
  h: 8
}, {
  t: "3p-11p",
  k: "",
  h: 8
}, {
  t: "12p-10p",
  k: "",
  h: 10
}, null],
// Priya
[{
  t: "11a-4p",
  k: "done",
  h: 5
}, {
  t: "11a-4p",
  k: "done",
  h: 5
}, {
  t: "5p-11p",
  k: "done",
  h: 6
}, {
  t: "5p-11p",
  k: "",
  h: 6
}, {
  t: "5p-11p",
  k: "",
  h: 6
}, {
  t: "5p-11p",
  k: "late",
  h: 6
}, {
  t: "11a-4p",
  k: "",
  h: 5
}],
// Ipshita
[null, {
  t: "5p-10p",
  k: "done",
  h: 5
}, null, {
  t: "5p-10p",
  k: "",
  h: 5
}, {
  t: "5p-12a",
  k: "",
  h: 7
}, null, {
  t: "11a-7p",
  k: "",
  h: 8
}],
// Diego
[{
  t: "6p-12a",
  k: "done",
  h: 6
}, null, {
  t: "6p-12a",
  k: "done",
  h: 6
}, null, {
  t: "6p-12a",
  k: "",
  h: 6
}, {
  t: "6p-12a",
  k: "",
  h: 6
}, null]];
function ViewRestaurant() {
  const [tab, setTab] = useState("schedule");
  const [drawerShift, setDrawerShift] = useState(null);
  const t = useToast();
  function clickShift(emp, day, shift) {
    setDrawerShift({
      emp,
      day,
      dayNum: DAY_NUMS[day],
      dayLabel: DAYS[day],
      ...shift
    });
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "ds-main"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Showcase",
    title: "Restaurant scheduling \u2014 Riverside Bistro",
    lead: "A live mini-app composed entirely from the foundation primitives. Demonstrates how the page boilerplate, table, drawer, dialog, and toaster compose into a real scheduling tool."
  }), /*#__PURE__*/React.createElement("div", {
    className: "hw-box-content",
    style: {
      borderRadius: 10,
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lhs flex-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fn-global-schedule"
  }), " Schedules"), /*#__PURE__*/React.createElement("div", {
    className: "rhs"
  }, "Riverside Bistro \xB7 Week of Mar 11 \u2013 Mar 17, 2026"))), /*#__PURE__*/React.createElement("div", {
    className: "hw-title split"
  }, /*#__PURE__*/React.createElement(FnTabs, {
    active: tab,
    onChange: setTab,
    tabs: [{
      id: "schedule",
      label: "Schedule",
      icon: "calendar"
    }, {
      id: "shifts",
      label: "Open shifts",
      icon: "circles-three-plus",
      count: 5
    }, {
      id: "time-off",
      label: "Time off",
      icon: "airplane-takeoff",
      count: 2
    }, {
      id: "audit",
      label: "Audit log",
      icon: "clipboard-text"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-toggle-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: "on"
  }, "Week"), /*#__PURE__*/React.createElement("button", null, "Day"), /*#__PURE__*/React.createElement("button", null, "Month")), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "calendar",
    text: "Mar 11 \u2013 Mar 17"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "copy",
    text: "Copy last week"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    iconAddonBefore: "download-simple",
    text: "Export PDF",
    onClick: () => t.info("Generating PDF…", "Export")
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-xs btn-round",
    iconAddonBefore: "paper-plane-tilt",
    text: "Publish to team",
    onClick: () => t.success("Schedule published — team notified.", "Published")
  }))), tab === "schedule" && /*#__PURE__*/React.createElement(ScheduleTab, {
    onShiftClick: clickShift
  }), tab === "shifts" && /*#__PURE__*/React.createElement(OpenShiftsTab, {
    onClaim: () => t.success("Claim submitted — awaiting manager approval.")
  }), tab === "time-off" && /*#__PURE__*/React.createElement(TimeOffTab, {
    onApprove: name => t.success(`Approved time-off for ${name}.`),
    onDeny: () => {}
  }), tab === "audit" && /*#__PURE__*/React.createElement(AuditTab, null)), /*#__PURE__*/React.createElement(FnDrawer, {
    open: !!drawerShift,
    title: drawerShift ? `Shift · ${drawerShift.emp} · ${drawerShift.dayLabel} Mar ${drawerShift.dayNum}` : "",
    onClose: () => setDrawerShift(null),
    footer: drawerShift && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FnButton, {
      type: "outline-danger btn-sm",
      iconAddonBefore: "trash",
      text: "Remove",
      onClick: () => {
        setDrawerShift(null);
        t.success("Shift removed");
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(FnButton, {
      type: "outline-secondary btn-sm",
      text: "Cancel",
      onClick: () => setDrawerShift(null)
    }), /*#__PURE__*/React.createElement(FnButton, {
      type: "primary btn-sm",
      text: "Save changes",
      onClick: () => {
        setDrawerShift(null);
        t.success("Shift updated");
      }
    }))
  }, drawerShift && /*#__PURE__*/React.createElement(ShiftEditor, {
    shift: drawerShift
  })));
}

/* ----- Schedule tab ----- */
function ScheduleTab({
  onShiftClick
}) {
  const totalsByDay = DAYS.map((_, d) => SHIFTS.reduce((sum, row) => sum + (row[d]?.h || 0), 0));
  const totalHours = totalsByDay.reduce((a, b) => a + b, 0);
  const totalCost = EMPLOYEES_R.reduce((sum, emp, i) => {
    return sum + (SHIFTS[i]?.reduce((s, sh) => s + (sh?.h || 0) * emp.rate, 0) || 0);
  }, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-content",
    style: {
      background: "var(--body-bg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-4",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, "Total hours \xB7 week", /*#__PURE__*/React.createElement(Ph, {
    name: "clock",
    size: "14px"
  })), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, totalHours, "h"), /*#__PURE__*/React.createElement("div", {
    className: "delta up"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "trend-up",
    size: "12px"
  }), "+8h vs last week")), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, "Estimated labor cost", /*#__PURE__*/React.createElement(Ph, {
    name: "hand-coins",
    size: "14px"
  })), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "$", Math.round(totalCost).toLocaleString()), /*#__PURE__*/React.createElement("div", {
    className: "delta down"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "trend-down",
    size: "12px"
  }), "\u2212$142 vs last week")), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, "Open shifts", /*#__PURE__*/React.createElement(Ph, {
    name: "warning",
    size: "14px"
  })), /*#__PURE__*/React.createElement("div", {
    className: "value f-warning"
  }, "5"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11.5
    }
  }, "2 weekend cook, 3 Sat server")), /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("header", null, "Coverage", /*#__PURE__*/React.createElement(Ph, {
    name: "check-circle",
    size: "14px"
  })), /*#__PURE__*/React.createElement("div", {
    className: "value f-success"
  }, "94", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "%")), /*#__PURE__*/React.createElement(FnProgress, {
    value: 94,
    color: "success"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sched-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head",
    style: {
      background: "var(--bg-primary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Employee"), /*#__PURE__*/React.createElement("button", {
    className: "ds-iconbtn",
    style: {
      height: 22,
      width: 22,
      padding: 0
    },
    "aria-label": "Sort by role"
  }, /*#__PURE__*/React.createElement(Ph, {
    name: "funnel",
    size: "11px"
  })))), DAYS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    className: `head ${i === 4 ? "today" : ""}`
  }, /*#__PURE__*/React.createElement("div", null, d, i === 4 && /*#__PURE__*/React.createElement("span", {
    className: "bubble-primary",
    style: {
      marginLeft: 6,
      fontSize: 9,
      padding: "1px 5px",
      borderRadius: 3
    }
  }, "TODAY")), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 10,
      fontWeight: 400,
      fontFamily: "var(--ds-mono)"
    }
  }, "Mar ", DAY_NUMS[i]))), EMPLOYEES_R.map((emp, ei) => /*#__PURE__*/React.createElement(Fragment, {
    key: emp.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "cell emp",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: emp.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.2
    }
  }, emp.name), /*#__PURE__*/React.createElement("div", {
    className: "role"
  }, emp.role))), DAYS.map((_, di) => {
    const s = SHIFTS[ei]?.[di];
    return /*#__PURE__*/React.createElement("div", {
      key: di,
      className: "cell",
      style: {
        minHeight: 70,
        padding: 6,
        background: "var(--bg-primary)"
      }
    }, s ? /*#__PURE__*/React.createElement("div", {
      className: `shift-chip ${s.k}`,
      onClick: () => onShiftClick(emp.name, di, s),
      role: "button",
      tabIndex: 0,
      "aria-label": `Shift for ${emp.name} on ${DAYS[di]} ${s.t}`
    }, /*#__PURE__*/React.createElement("span", null, emp.role), /*#__PURE__*/React.createElement("span", {
      className: "t"
    }, s.t, " \xB7 ", s.h, "h")) : /*#__PURE__*/React.createElement("button", {
      className: "ds-iconbtn",
      style: {
        width: "100%",
        height: 60,
        padding: 0,
        color: "var(--iron)",
        borderStyle: "dashed",
        background: "transparent"
      },
      "aria-label": `Add shift for ${emp.name} on ${DAYS[di]}`
    }, /*#__PURE__*/React.createElement(Ph, {
      name: "plus",
      size: "14px"
    })));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cell emp",
    style: {
      fontWeight: 600,
      background: "var(--table-dark-cell)"
    }
  }, "Total hours"), totalsByDay.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "cell",
    style: {
      background: "var(--table-dark-cell)",
      fontWeight: 600,
      fontFamily: "var(--ds-mono)",
      fontSize: 13
    }
  }, h, "h"))), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      marginTop: 12,
      fontSize: 11.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "Legend:"), /*#__PURE__*/React.createElement("span", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      background: "rgba(0,91,196,.10)",
      borderLeft: "3px solid var(--blue)"
    }
  }), "Scheduled"), /*#__PURE__*/React.createElement("span", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      background: "rgba(30,126,52,.12)",
      borderLeft: "3px solid var(--green)"
    }
  }), "Completed"), /*#__PURE__*/React.createElement("span", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      background: "rgba(253,201,30,.18)",
      borderLeft: "3px solid var(--yellow)"
    }
  }), "Swap pending"), /*#__PURE__*/React.createElement("span", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      background: "rgba(198,40,40,.10)",
      borderLeft: "3px solid var(--red)"
    }
  }), "Late / issue")));
}

/* ----- Shift editor (drawer body) ----- */
function ShiftEditor({
  shift
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-stack"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      marginBottom: 0,
      padding: 14,
      background: "var(--body-bg)",
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: shift.emp,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, shift.emp), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, shift.t, " \xB7 ", shift.h, "h \xB7 est. $", (shift.h * 18.5).toFixed(2))), /*#__PURE__*/React.createElement(FnTag, {
    color: shift.k === "done" ? "success" : shift.k === "late" ? "danger" : shift.k === "swap" ? "warning" : "primary"
  }, shift.k === "done" ? "Completed" : shift.k === "late" ? "Late" : shift.k === "swap" ? "Swap pending" : "Scheduled")), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-emp",
    label: "Employee",
    required: true
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: EMPLOYEES_R.map((e, i) => ({
      id: i,
      name: e.name
    })),
    value: EMPLOYEES_R.findIndex(e => e.name === shift.emp),
    onChange: () => {}
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-role",
    label: "Role"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: ["Server", "Bartender", "Line cook", "Prep cook", "Host", "Dishwasher", "Manager"].map((r, i) => ({
      id: i,
      name: r
    })),
    value: 0,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-date",
    label: "Date"
  }, /*#__PURE__*/React.createElement(FnInput, {
    value: `Mar ${shift.dayNum}, 2026`,
    readOnly: true,
    suffix: /*#__PURE__*/React.createElement(Ph, {
      name: "calendar",
      size: "13px"
    })
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-break",
    label: "Break"
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: "30 min"
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-start",
    label: "Start time"
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: shift.t.split("-")[0]
  })), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-end",
    label: "End time"
  }, /*#__PURE__*/React.createElement(FnInput, {
    defaultValue: shift.t.split("-")[1]
  }))), /*#__PURE__*/React.createElement(FormGroup, {
    id: "d-notes",
    label: "Notes",
    help: "Visible to the assigned employee and managers."
  }, /*#__PURE__*/React.createElement(FnTextarea, {
    rows: 3,
    defaultValue: "Standard service. Brunch prep starts at 4:30 \u2014 check the prep list before clocking in."
  })), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Notify employee on save",
    desc: "Send a push notification with the change",
    defaultOn: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Allow swaps",
    desc: "Let the employee request a swap with peers",
    defaultOn: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Lock this shift",
    desc: "Prevents edits until you unlock"
  }));
}

/* ----- Open shifts tab ----- */
function OpenShiftsTab({
  onClaim
}) {
  const shifts = [{
    id: "OS-001",
    role: "Server",
    day: "Sat, Mar 16",
    time: "11am–7pm",
    site: "Riverside Bistro",
    pay: "$148",
    urgency: "high",
    match: "Priya, Ipshita"
  }, {
    id: "OS-002",
    role: "Line cook",
    day: "Sat, Mar 16",
    time: "12pm–10pm",
    site: "Riverside Bistro",
    pay: "$220",
    urgency: "high",
    match: "Marco"
  }, {
    id: "OS-003",
    role: "Bartender",
    day: "Sun, Mar 17",
    time: "5pm–12am",
    site: "Riverside Bistro",
    pay: "$168",
    urgency: "medium",
    match: "Rahul, Diego"
  }, {
    id: "OS-004",
    role: "Server",
    day: "Sun, Mar 17",
    time: "11am–4pm",
    site: "Riverside Bistro",
    pay: "$92",
    urgency: "low",
    match: "Priya"
  }, {
    id: "OS-005",
    role: "Server",
    day: "Sun, Mar 17",
    time: "5pm–11pm",
    site: "Downtown Grill",
    pay: "$111",
    urgency: "medium",
    match: "Ipshita"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      marginBottom: 14,
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "ds-h3",
    style: {
      margin: 0
    }
  }, "5 open shifts this week"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: 0,
      fontSize: 12.5
    }
  }, "Sort matches by AI suggestion \xB7 availability \xB7 role")), /*#__PURE__*/React.createElement("div", {
    className: "ds-row"
  }, /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "All sites"
    }, {
      id: 2,
      name: "Riverside only"
    }],
    value: 1,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(FnSelect, {
    items: [{
      id: 1,
      name: "All roles"
    }, {
      id: 2,
      name: "Server"
    }, {
      id: 3,
      name: "Cook"
    }],
    value: 1,
    onChange: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-grid ds-cols-2",
    style: {
      gap: 12
    }
  }, shifts.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "ds-card",
    style: {
      marginBottom: 0,
      padding: 16,
      borderLeft: `4px solid ${s.urgency === "high" ? "var(--red)" : s.urgency === "medium" ? "var(--orange)" : "var(--blue)"}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, s.role, " \xB7 ", s.day), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, s.time, " \xB7 ", s.site)), /*#__PURE__*/React.createElement(FnTag, {
    color: s.urgency === "high" ? "danger" : s.urgency === "medium" ? "warning" : "primary"
  }, s.urgency)), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      fontSize: 12,
      justifyContent: "space-between",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "Suggested matches"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, s.match)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "Est. pay"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--ds-mono)",
      fontWeight: 600
    }
  }, s.pay))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs btn-round",
    text: "Skip"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-primary btn-xs btn-round",
    iconAddonBefore: "users-three",
    text: "Notify matches"
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-xs btn-round",
    iconAddonBefore: "check",
    text: "Auto-assign",
    onClick: onClaim
  }))))));
}

/* ----- Time off tab ----- */
function TimeOffTab({
  onApprove,
  onDeny
}) {
  const requests = [{
    who: "Diego Park",
    type: "Sick",
    when: "Mar 19 — single day",
    submitted: "today",
    status: "Pending"
  }, {
    who: "Marco Silva",
    type: "Vacation",
    when: "Mar 24 – Mar 28 (5 days)",
    submitted: "yesterday",
    status: "Pending"
  }, {
    who: "Ipshita Ghosh",
    type: "Personal",
    when: "Apr 02 — half day pm",
    submitted: "3d ago",
    status: "Approved"
  }, {
    who: "Priya Nair",
    type: "Sick",
    when: "Mar 11 (today)",
    submitted: "today",
    status: "Approved"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card flush"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      border: 0,
      borderRadius: 0
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Employee"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "When"), /*#__PURE__*/React.createElement("th", null, "Submitted"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 200
    }
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, requests.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.who + r.when
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FnAvatar, {
    name: r.who,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, r.who))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnTag, {
    color: r.type === "Sick" ? "danger" : r.type === "Vacation" ? "primary" : "info"
  }, r.type)), /*#__PURE__*/React.createElement("td", null, r.when), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, r.submitted), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FnTag, {
    color: r.status === "Approved" ? "success" : "warning"
  }, r.status)), /*#__PURE__*/React.createElement("td", null, r.status === "Pending" ? /*#__PURE__*/React.createElement("div", {
    className: "ds-row",
    style: {
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(FnButton, {
    type: "success btn-xs",
    iconAddonBefore: "check",
    text: "Approve",
    onClick: () => onApprove(r.who)
  }), /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-danger btn-xs",
    iconAddonBefore: "x",
    text: "Deny",
    onClick: onDeny
  })) : /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-xs",
    text: "View"
  }))))))));
}

/* ----- Audit tab ----- */
function AuditTab() {
  const events = [{
    who: "Sana Ahmed",
    when: "10:14 AM",
    action: "Published schedule for Mar 11 – Mar 17",
    icon: "paper-plane-tilt",
    color: "var(--blue)"
  }, {
    who: "Marco Silva",
    when: "10:08 AM",
    action: "Accepted shift SHIFT-2027 (Fri 3–11 pm)",
    icon: "check-circle",
    color: "var(--green)"
  }, {
    who: "Sana Ahmed",
    when: "9:52 AM",
    action: "Approved time-off for Priya Nair (today)",
    icon: "airplane-takeoff",
    color: "var(--green)"
  }, {
    who: "System",
    when: "8:00 AM",
    action: "Auto-published draft schedule for next week",
    icon: "robot",
    color: "var(--iron)"
  }, {
    who: "Diego Park",
    when: "Yesterday",
    action: "Late clock-in — 28min past scheduled start",
    icon: "warning",
    color: "var(--red)"
  }, {
    who: "Rahul Yadav",
    when: "Yesterday",
    action: "Requested swap on SHIFT-2024 (Sat Mar 16)",
    icon: "swap",
    color: "var(--orange)"
  }, {
    who: "Sana Ahmed",
    when: "2 days ago",
    action: "Added employee Priya Nair (Server)",
    icon: "user-plus",
    color: "var(--blue)"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-card",
    style: {
      padding: 0
    }
  }, events.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 18px",
      borderBottom: i < events.length - 1 ? "1px solid var(--border-default-color)" : 0,
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 6,
      background: `${e.color}1f`,
      color: e.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    name: e.icon,
    size: "16px",
    weight: "bold"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("b", null, e.who), " ", /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "\xB7"), " ", e.action), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11.5,
      marginTop: 2
    }
  }, e.when))))));
}

/* ============================================================================
   Export
   ============================================================================ */
Object.assign(window, {
  ViewRestaurant
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-restaurant.jsx", error: String((e && e.message) || e) }); }

// src/view-tour.jsx
try { (() => {
/* ============================================================================
   AG Design System — view-tour.jsx
   Animated AG bot that walks a first-time visitor through the system,
   navigating step-by-step and finishing on "How to use this system".
   ============================================================================ */

const TOUR_STEPS = [{
  nav: "overview",
  title: "Hi, I'm AG!",
  body: "Welcome to the AG Design System. Give me a sec — I'll show you how to get from a rough idea to a finished page."
}, {
  nav: "colors",
  title: "Foundations",
  body: "Everything starts with tokens — colors, type, spacing. Use these, never raw values, so light & dark themes just work."
}, {
  nav: "fn-table",
  title: "Components",
  body: "Ready-to-use building blocks like this Prime Table. Each card shows the selector, props, and copy-paste markup."
}, {
  nav: "p-boilerplate",
  title: "Patterns",
  body: "Whole-page scaffolds. Every screen starts from the .hw-box-content boilerplate — header, title bar, content."
}, {
  nav: "how-to-use",
  title: "The workflow",
  body: "And here's the full PS → UI Dev flow: prototype → compose structure → bind data → verify VPAT. You're all set!"
}];

/* Cute SVG robot mascot — shared by tour + launcher */
function AgBotSvg() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "bot-svg",
    viewBox: "0 0 96 96",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("g", {
    className: "bot-antenna"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "48",
    y1: "14",
    x2: "48",
    y2: "24",
    stroke: "var(--cyan)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "bot-antenna-dot",
    cx: "48",
    cy: "11",
    r: "4",
    fill: "var(--orange)"
  })), /*#__PURE__*/React.createElement("g", {
    className: "bot-arm"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "50",
    width: "8",
    height: "22",
    rx: "4",
    fill: "var(--blue)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "74",
    r: "6",
    fill: "var(--cyan)"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "74",
    y: "52",
    width: "8",
    height: "20",
    rx: "4",
    fill: "var(--blue)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "78",
    cy: "73",
    r: "6",
    fill: "var(--cyan)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "24",
    y: "46",
    width: "48",
    height: "36",
    rx: "14",
    fill: "url(#agbotBody)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "33",
    y: "60",
    width: "30",
    height: "12",
    rx: "6",
    fill: "rgba(255,255,255,.18)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "48",
    y: "70",
    textAnchor: "middle",
    fontSize: "11",
    fontWeight: "700",
    fill: "#fff",
    fontFamily: "Inter, sans-serif",
    letterSpacing: "0.5"
  }, "AG"), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "22",
    width: "52",
    height: "34",
    rx: "16",
    fill: "url(#agbotHead)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "29",
    y: "29",
    width: "38",
    height: "21",
    rx: "10",
    fill: "#0b1322"
  }), /*#__PURE__*/React.createElement("ellipse", {
    className: "bot-eye",
    cx: "41",
    cy: "39",
    rx: "3.6",
    ry: "4.4",
    fill: "#5fd0ff"
  }), /*#__PURE__*/React.createElement("ellipse", {
    className: "bot-eye",
    cx: "55",
    cy: "39",
    rx: "3.6",
    ry: "4.4",
    fill: "#5fd0ff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44 45 Q48 48 52 45",
    stroke: "#5fd0ff",
    strokeWidth: "2",
    strokeLinecap: "round",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "33",
    cy: "45",
    r: "2",
    fill: "rgba(255,130,80,.5)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "63",
    cy: "45",
    r: "2",
    fill: "rgba(255,130,80,.5)"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "agbotHead",
    x1: "22",
    y1: "22",
    x2: "74",
    y2: "56",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "var(--blue)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--cyan)"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agbotBody",
    x1: "24",
    y1: "46",
    x2: "72",
    y2: "82",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "var(--primaryDark)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--blue)"
  }))));
}
function AgBot() {
  const seen = () => {
    try {
      return localStorage.getItem("ag-tour-done") === "1";
    } catch {
      return false;
    }
  };
  const [open, setOpen] = useState(() => !seen());
  const [step, setStep] = useState(0);

  // Drive navigation as the tour advances
  useEffect(() => {
    if (open && window.navigate) window.navigate(TOUR_STEPS[step].nav);
  }, [open, step]);
  function finish() {
    try {
      localStorage.setItem("ag-tour-done", "1");
    } catch {}
    setOpen(false);
  }
  function restart() {
    setStep(0);
    setOpen(true);
  }
  if (!open) {
    return /*#__PURE__*/React.createElement("button", {
      className: "agbot-launcher",
      onClick: restart,
      "aria-label": "Replay the AG guided tour",
      title: "Replay tour"
    }, /*#__PURE__*/React.createElement(AgBotSvg, null));
  }
  const s = TOUR_STEPS[step];
  const last = step === TOUR_STEPS.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "agbot-layer",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "AG guided tour"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agbot-scrim",
    onClick: finish
  }), /*#__PURE__*/React.createElement("div", {
    className: "agbot-dock pos-br"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agbot-bubble"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-ix"
  }, "Step ", step + 1, " of ", TOUR_STEPS.length), /*#__PURE__*/React.createElement("h4", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body), /*#__PURE__*/React.createElement("div", {
    className: "dots",
    "aria-hidden": "true"
  }, TOUR_STEPS.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `d ${i <= step ? "on" : ""}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "skip",
    onClick: finish
  }, "Skip tour"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), step > 0 && /*#__PURE__*/React.createElement(FnButton, {
    type: "outline-secondary btn-sm",
    text: "Back",
    onClick: () => setStep(v => v - 1)
  }), last ? /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-sm",
    text: "Got it",
    iconAddonAfter: "check",
    onClick: finish
  }) : /*#__PURE__*/React.createElement(FnButton, {
    type: "primary btn-sm",
    text: "Next",
    iconAddonAfter: "arrow-right",
    onClick: () => setStep(v => v + 1)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "agbot-mascot",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(AgBotSvg, null), /*#__PURE__*/React.createElement("span", {
    className: "bot-shadow"
  }))));
}
Object.assign(window, {
  AgBot
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "src/view-tour.jsx", error: String((e && e.message) || e) }); }

})();
