/* ============================================================================
   AG Design System — view-a11y.jsx
   VPAT / WCAG 2.1 AA compliance reference — mirrors A11Y.md.
   ============================================================================ */

function ViewA11y() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Compliance" title="VPAT & WCAG 2.1 AA"
        lead="Every component in this system ships keyboard-accessible, screen-reader-labeled, and theme-contrast-checked. This page is the canonical reference for the directives and patterns that resolved your existing axe findings." />

      <div className="ds-card" style={{ borderLeft: "3px solid var(--green)" }}>
        <div className="ds-row" style={{ gap: 16, alignItems: "flex-start" }}>
          <Ph name="shield-check" size="28px" style={{ color: "var(--green)" }} />
          <div>
            <div className="ds-h3" style={{ marginTop: 0 }}>Baseline: VPAT 2.4 · WCAG 2.1 AA · Section 508</div>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              The directives and services below are wired into <code className="ds-inline">FoundationModule</code> by default. Apps that import it inherit the full a11y surface — no per-component opt-in required.
            </p>
          </div>
        </div>
      </div>

      <h2 className="ds-h2">A11y building blocks</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        These directives + services come bundled with <code className="ds-inline">FoundationModule</code>. Use the directives when generating new templates; the services run automatically.
      </p>
      <div className="ds-card flush">
        <table className="proptbl">
          <thead><tr><th>Name</th><th>Type</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code className="ds-inline">a11yClickable</code></td><td>Directive</td><td>Adds button semantics + keyboard activation (Enter/Space) to non-button clickables (e.g. clickable <code className="ds-inline">&lt;li&gt;</code>). No-op on real <code className="ds-inline">&lt;button&gt;</code>/<code className="ds-inline">&lt;a href&gt;</code>.</td></tr>
            <tr><td><code className="ds-inline">a11yIconBtn</code></td><td>Directive</td><td>Icon-only button: stamps <code className="ds-inline">aria-label</code> on host + <code className="ds-inline">aria-hidden="true"</code> on every inner <code className="ds-inline">&lt;i&gt;</code>/<code className="ds-inline">&lt;svg&gt;</code>.</td></tr>
            <tr><td><code className="ds-inline">A11yFormFieldDirective</code></td><td>Directive</td><td>Auto-associates <code className="ds-inline">&lt;label&gt;</code> with the form control inside <code className="ds-inline">.form-group</code> via <code className="ds-inline">aria-labelledby</code>.</td></tr>
            <tr><td><code className="ds-inline">A11yLabelService</code></td><td>Service</td><td>Runtime fallback: sets <code className="ds-inline">for=</code> + <code className="ds-inline">aria-labelledby</code> for labels outside <code className="ds-inline">.form-group</code> (Bootstrap rows, etc.).</td></tr>
            <tr><td><code className="ds-inline">A11yImageService</code></td><td>Service</td><td>Defensive: adds <code className="ds-inline">alt=""</code> to any <code className="ds-inline">&lt;img&gt;</code> shipped without it. Meaningful images must still set their own alt.</td></tr>
            <tr><td><code className="ds-inline">A11yScrollableRegionService</code></td><td>Service</td><td>Adds <code className="ds-inline">tabindex="0"</code> to every genuinely-scrollable <code className="ds-inline">overflow:auto/scroll</code> element after each DOM mutation. Fixes Safari keyboard access (2.1.1).</td></tr>
            <tr><td><code className="ds-inline">A11yListboxService</code></td><td>Service</td><td>Safety net for <code className="ds-inline">aria-required-children</code>: ensures every <code className="ds-inline">role="listbox"</code> has visible <code className="ds-inline">role="option"</code> children, marks empty listboxes <code className="ds-inline">aria-busy</code>.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Hard rules (do · don't)</h2>

      <h3 className="ds-h3">Images</h3>
      <div className="ds-grid ds-cols-2">
        <RuleCard tone="do"   title="Decorative icon next to text">{`<button a11yIconBtn [label]="'DOWNLOAD' | fnTranslate">
  <i class="fn-global-pdf"></i>
</button>`}</RuleCard>
        <RuleCard tone="dont" title="Missing alt on <img>">{`<img src="logo.png">
<!-- axe critical: image-alt -->`}</RuleCard>
        <RuleCard tone="do"   title="Meaningful image">{`<img [src]="emp.photoUrl"
     [alt]="'EMP.AVATAR_OF' | fnTranslate:emp.name">`}</RuleCard>
        <RuleCard tone="dont" title="Raw English in alt">{`<img src="..." alt="employee avatar">
<!-- fails i18n review -->`}</RuleCard>
      </div>

      <h3 className="ds-h3">Form controls</h3>
      <div className="ds-grid ds-cols-2">
        <RuleCard tone="do" title="Label inside .form-group (auto-associated)">{`<div class="form-group">
  <label class="fn-label">{{ 'EMP.EMAIL' | fnTranslate }}</label>
  <fn-base-input formControlName="email" type="EMAIL"
                 [isRequired]="true"></fn-base-input>
</div>`}</RuleCard>
        <RuleCard tone="do" title="Pass labelForId to ng-select">{`<!-- foundation's fn-select does this for you -->
<fn-select [labelForId]="'roleId'" ...></fn-select>`}</RuleCard>
        <RuleCard tone="dont" title="Hand-rolled clickable div">{`<div (click)="doIt()" class="card">…</div>
<!-- no keyboard, no role -->`}</RuleCard>
        <RuleCard tone="do" title="…use a11yClickable on the actual element">{`<li a11yClickable
    [attr.aria-label]="'OPEN_DETAIL' | fnTranslate"
    (click)="open(item)">…</li>`}</RuleCard>
      </div>

      <h3 className="ds-h3">Color contrast</h3>
      <div className="ds-card">
        <div className="ds-grid ds-cols-2">
          <div>
            <div className="ds-eyebrow" style={{ color: "var(--green)" }}>DO</div>
            <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18 }}>
              <li>Use <code className="ds-inline">var(--body-textColor)</code> for any text on a theme background — the variable flips for dark mode automatically.</li>
              <li>Minimum contrast: <b>4.5:1</b> for normal text, <b>3:1</b> for large text (≥18pt or ≥14pt bold) and UI components / focus indicators.</li>
              <li>When introducing a new color in SCSS, add a token to <code className="ds-inline">_variable.scss</code> (in both <code className="ds-inline">:root</code> and <code className="ds-inline">.dark-theme</code>) <i>before</i> reaching for a hex.</li>
            </ul>
          </div>
          <div>
            <div className="ds-eyebrow" style={{ color: "var(--red)" }}>DON'T</div>
            <ul style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18 }}>
              <li>Hardcode <code className="ds-inline">#ccc</code>, <code className="ds-inline">#aaa</code>, <code className="ds-inline">$gray</code>, <code className="ds-inline">$lightGray</code> — at least one theme will fail WCAG AA.</li>
              <li>Communicate status via color alone — always pair with text and/or icon.</li>
              <li>Use Tailwind text-gray-400 etc. — bypasses the theme system.</li>
            </ul>
          </div>
        </div>
      </div>

      <h3 className="ds-h3">Focus & keyboard</h3>
      <div className="ds-card">
        <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
          <li>Every interactive element gets a 2px focus ring via the global <code className="ds-inline">:focus-visible</code> rule. Don't disable it.</li>
          <li>Tab order follows DOM order — never use <code className="ds-inline">tabindex</code> values greater than 0. Only <code className="ds-inline">0</code> (focusable in order) or <code className="ds-inline">-1</code> (programmatic) are acceptable.</li>
          <li>Modals trap focus while open; on close, focus returns to the trigger element.</li>
          <li>Keyboard map: <FnTag>Tab</FnTag> next / <FnTag>Shift+Tab</FnTag> previous / <FnTag>Enter</FnTag>/<FnTag>Space</FnTag> activate / <FnTag>Esc</FnTag> dismiss / <FnTag>↑↓←→</FnTag> within composite widgets (tabs, radio groups, menus).</li>
        </ul>
      </div>

      <h3 className="ds-h3">ARIA</h3>
      <div className="ds-grid ds-cols-2">
        <RuleCard tone="do" title="Prefer native semantics">{`<button type="button" (click)="…">Save</button>
<a href="/route/...">Open detail</a>`}</RuleCard>
        <RuleCard tone="dont" title="Don't add roles to ad-hoc divs">{`<div role="button" tabindex="0" (click)="…">Save</div>
<!-- breaks keyboard, screen reader -->`}</RuleCard>
        <RuleCard tone="do" title="Empty-state listbox option">{`<!-- fn-select includes this template by default -->
<ng-template ng-notfound-tmp>
  <li role="option" aria-disabled="true">No items found</li>
</ng-template>`}</RuleCard>
        <RuleCard tone="dont" title="Hidden focusable elements">{`<button aria-hidden="true">…</button>
<!-- focusable + hidden = trap for screen readers -->`}</RuleCard>
      </div>

      <h3 className="ds-h3">Internationalization</h3>
      <div className="ds-card">
        <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
          <li>Every user-visible string goes through the <code className="ds-inline">fnTranslate</code> pipe or <code className="ds-inline">FnI18nService</code>.</li>
          <li><code className="ds-inline">alt</code>, <code className="ds-inline">aria-label</code>, <code className="ds-inline">title</code>, <code className="ds-inline">placeholder</code> must all use translation keys.</li>
          <li>RTL is handled by the foundation SCSS mixins (<code className="ds-inline">@include padding-direction(...)</code>, <code className="ds-inline">@include margin-direction(...)</code>). Don't write raw <code className="ds-inline">padding-left</code> — use the mixin.</li>
        </ul>
      </div>

      <h2 className="ds-h2">Per-component a11y matrix</h2>
      <div className="ds-card flush" style={{ overflowX: "auto" }}>
        <table className="proptbl">
          <thead><tr><th>Component</th><th>Key roles</th><th>Keyboard</th><th>Common findings</th></tr></thead>
          <tbody>
            <tr><td>Button</td><td>—</td><td>Tab + Enter/Space</td><td>Icon-only needs <code className="ds-inline">a11yIconBtn</code> for aria-label.</td></tr>
            <tr><td>Input</td><td>—</td><td>Tab</td><td>aria-required + aria-describedby for error/help text.</td></tr>
            <tr><td>Select</td><td>combobox + listbox + option</td><td>Tab to open; ↑↓ navigate; Enter commits; Esc closes</td><td>Empty state needs role=option aria-disabled (auto in fn-select).</td></tr>
            <tr><td>Switch / Checkbox</td><td>switch / checkbox</td><td>Space toggles</td><td>Visible label + association.</td></tr>
            <tr><td>Radio group</td><td>radiogroup + radio</td><td>Arrows navigate within group</td><td>First radio is tabstop; others tabindex=-1.</td></tr>
            <tr><td>Tabs</td><td>tablist + tab + tabpanel</td><td>← → navigate; Home/End ends</td><td>Selected tab gets tabindex=0; others -1.</td></tr>
            <tr><td>Dialog</td><td>dialog + aria-modal</td><td>Esc closes; focus trap</td><td>Must have aria-labelledby pointing at title.</td></tr>
            <tr><td>Drawer</td><td>dialog + aria-label</td><td>Esc closes</td><td>Focus returns to trigger on close.</td></tr>
            <tr><td>Toast</td><td>status (info/success) / alert (error)</td><td>Manual dismiss via X</td><td>aria-live=polite/assertive paired with role.</td></tr>
            <tr><td>Table</td><td>table + columnheader + cell</td><td>Native</td><td>Sortable headers need aria-sort; scrollable table gets tabindex=0 (auto).</td></tr>
            <tr><td>Date picker</td><td>dialog + grid + gridcell</td><td>Arrows / PgUp+Dn / Home+End</td><td>Today gets aria-current=date.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Anti-patterns (do not generate)</h2>
      <div className="ds-card" style={{ borderLeft: "3px solid var(--red)" }}>
        <ul style={{ fontSize: 13, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
          <li><code className="ds-inline">&lt;div (click)&gt;</code> / <code className="ds-inline">&lt;li (click)&gt;</code> without <code className="ds-inline">a11yClickable</code>. Fails keyboard.</li>
          <li><code className="ds-inline">tabindex &gt; 0</code> — disrupts natural tab order.</li>
          <li>Raw English in <code className="ds-inline">alt</code>, <code className="ds-inline">aria-label</code>, <code className="ds-inline">title</code>, <code className="ds-inline">placeholder</code>.</li>
          <li>Skipping heading levels (h1 → h3). Keep monotonic.</li>
          <li>Color-only status indicators ("the red row is bad").</li>
          <li>Hardcoded gray (<code className="ds-inline">#ccc</code>, <code className="ds-inline">#aaa</code>, <code className="ds-inline">$gray</code>) outside the token system.</li>
          <li>Custom <code className="ds-inline">overflow:auto</code> regions without keyboard access (now auto-patched, but don't rely on it for new code).</li>
          <li>Unicode glyphs (<code className="ds-inline">✓</code>, <code className="ds-inline">→</code>) as icons.</li>
          <li><code className="ds-inline">aria-hidden="true"</code> on focusable elements.</li>
        </ul>
      </div>

      <h2 className="ds-h2">Testing</h2>
      <div className="ds-card">
        <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
          <li><b>Manual smoke test:</b> Tab through every interactive element. Every focus state should be visible.</li>
          <li><b>Screen reader:</b> NVDA (Win) or VoiceOver (Mac). Headings should announce in order; form labels should read.</li>
          <li><b>Automated:</b> <code className="ds-inline">axe-core</code> via <code className="ds-inline">@axe-core/playwright</code> in your e2e pipeline.</li>
          <li><b>Contrast:</b> Toggle theme — every text/bg pair must pass AA in both modes. Use the topbar toggle to test.</li>
          <li><b>Reduced motion:</b> macOS → Accessibility → Display → Reduce motion. Transforms collapse to opacity-only.</li>
        </ul>
      </div>

      <A11yNote label="Resources">
        <ul>
          <li><code className="ds-inline">projects/foundation/A11Y.md</code> — your canonical reference (origin of these rules).</li>
          <li><code className="ds-inline">lib/a11y/*</code> — directive + service implementations.</li>
          <li>WCAG 2.1 quick ref · <code className="ds-inline">w3.org/WAI/WCAG21/quickref/</code></li>
          <li>axe rules · <code className="ds-inline">dequeuniversity.com/rules/axe/</code></li>
        </ul>
      </A11yNote>
    </main>
  );
}

function RuleCard({ tone, title, children }) {
  const isDo = tone === "do";
  return (
    <div className="ds-card" style={{ marginBottom: 0, padding: 0, borderLeft: `3px solid var(--${isDo ? "green" : "red"})` }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-default-color)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: isDo ? "var(--green)" : "var(--red)" }}>
          {isDo ? "DO" : "DON'T"}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
      </div>
      <pre className="ds-code" style={{ borderRadius: 0, margin: 0, border: 0 }}>
        <code dangerouslySetInnerHTML={{ __html: highlightAngular(children) }} />
      </pre>
    </div>
  );
}

Object.assign(window, { ViewA11y });
