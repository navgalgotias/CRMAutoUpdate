/* ============================================================================
   AG Design System — view-foundations.jsx
   Token explorers: Color, Type, Spacing, Shadows, Icons, Motion.
   ============================================================================ */

/* ----------------------------- Helpers ------------------------------------ */
function Swatch({ name, value, big = false }) {
  return (
    <div className="swatch-card" style={{ minHeight: big ? 120 : "auto" }}>
      <span className="color" style={{ background: `var(--${name})`, height: big ? 80 : 64 }} />
      <div className="meta">
        <div className="label">{name}</div>
        <div className="v">var(--{name})</div>
        {value && <div className="v" style={{ color: "var(--iron)" }}>{value}</div>}
      </div>
    </div>
  );
}

function TokenRow({ name, value, swatch }) {
  return (
    <div className="token-row">
      <div className="swatch-cell">
        {swatch && <span className="swatch-mini" style={swatch} />}
        <span className="name">--{name}</span>
      </div>
      <span className="value">{value}</span>
      <code className="ds-inline" onClick={() => navigator.clipboard?.writeText(`var(--${name})`)}
            style={{ cursor: "pointer" }} title="Click to copy">var(--{name})</code>
    </div>
  );
}

/* ----------------------------- Color -------------------------------------- */
function ViewColors() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Foundation" title="Color"
        lead="The palette mirrors projects/foundation/src/lib/theme/_variable.scss 1:1. Light tokens live on :root; dark overrides under .dark-theme. Toggle theme from the topbar to preview both." />

      <h2 className="ds-h2">Brand palette</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>The eleven named colors. All other UI colors derive from these through the semantic map.</p>
      <div className="ds-grid ds-cols-4" style={{ marginBottom: 24 }}>
        <Swatch name="blue"   value="primary · #005bc4" big />
        <Swatch name="cyan"   value="info" big />
        <Swatch name="green"  value="success · #1e7e34" big />
        <Swatch name="orange" value="#bf5700" big />
        <Swatch name="yellow" value="warning · #fdc91e" big />
        <Swatch name="red"    value="danger · #c62828" big />
        <Swatch name="iron"   value="dark · #4b5563" big />
        <Swatch name="purple" value="#7b42ff" big />
        <Swatch name="gray"   value="secondary" big />
        <Swatch name="black" big />
        <Swatch name="white" big />
      </div>

      <h2 className="ds-h2">Semantic mapping</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Defined in <code className="ds-inline">_color.scss</code> via <code className="ds-inline">$colorMapLight</code> + <code className="ds-inline">$colorMapDark</code>.
        For each semantic name, foundation auto-generates <code className="ds-inline">.bg-{"{"}name{"}"}</code>, <code className="ds-inline">.f-{"{"}name{"}"}</code>, <code className="ds-inline">.bubble-{"{"}name{"}"}</code>, <code className="ds-inline">.progress-bar-{"{"}name{"}"}</code>.
      </p>
      <div className="ds-card">
        <table className="proptbl">
          <thead><tr><th>Semantic</th><th>Light</th><th>Dark</th><th>Usage</th></tr></thead>
          <tbody>
            {[
              ["primary",   "blue",  "Action buttons, links, focus rings"],
              ["success",   "green", "Saved confirmations, complete shifts, active status"],
              ["warning",   "yellow","Pending shifts, swap requests"],
              ["danger",    "red",   "Destructive actions, late shifts, errors"],
              ["info",      "cyan",  "Informational toasts, badge hints"],
              ["orange",    "orange","Highlights — needs attention but not blocking"],
              ["secondary", "gray",  "Cancel, dismiss, neutral chips"],
              ["dark",      "iron",  "Muted text, secondary headings"],
            ].map(([sem, base, use]) => (
              <tr key={sem}>
                <td><span className="pn">{sem}</span></td>
                <td><span className="swatch-mini" style={{ background: `var(--${base})`, display: "inline-block", verticalAlign: "middle", marginRight: 6 }} /><code className="ds-inline">var(--{base})</code></td>
                <td><span className="muted">dark variant</span></td>
                <td className="muted">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Dark variants</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>Used for hover/active/pressed states on top of base colors.</p>
      <div className="ds-grid ds-cols-4">
        <Swatch name="primaryDark" /><Swatch name="successDark" /><Swatch name="dangerDark" /><Swatch name="orangeDark" />
        <Swatch name="infoDark" /><Swatch name="ironDark" /><Swatch name="warningDark" /><Swatch name="secondaryDark" />
      </div>

      <h2 className="ds-h2">Surfaces & structure</h2>
      <div className="ds-card">
        <TokenRow name="body-bg" value="page background"        swatch={{ background: "var(--body-bg)" }} />
        <TokenRow name="bg-primary" value="cards, dialogs, panels" swatch={{ background: "var(--bg-primary)" }} />
        <TokenRow name="bg-primary-dark" value="elevated surfaces under dark mode" swatch={{ background: "var(--bg-primary-dark)" }} />
        <TokenRow name="hover-bg-color" value="row/card hover wash" swatch={{ background: "var(--hover-bg-color)" }} />
        <TokenRow name="side-nav-bg" value="sidebar nav background" swatch={{ background: "var(--side-nav-bg)" }} />
        <TokenRow name="border-default-color" value="default 1px border" swatch={{ background: "var(--border-default-color)" }} />
        <TokenRow name="box-border-color" value="card borders" swatch={{ background: "var(--box-border-color)" }} />
        <TokenRow name="cdk-overlay-backdrop" value="modal scrim" swatch={{ background: "var(--cdk-overlay-backdrop)" }} />
      </div>

      <h2 className="ds-h2">Inputs</h2>
      <div className="ds-card">
        <TokenRow name="input-bg" value="field background" swatch={{ background: "var(--input-bg)", border: "1px solid var(--input-border-color)" }} />
        <TokenRow name="input-border-color" value="resting border" swatch={{ background: "var(--input-border-color)" }} />
        <TokenRow name="input-focus-border-color" value="focused border" swatch={{ background: "var(--input-focus-border-color)" }} />
        <TokenRow name="input-placeholder-color" value="placeholder text" swatch={{ background: "var(--input-placeholder-color)" }} />
        <TokenRow name="input-disable-color" value="disabled field" swatch={{ background: "var(--input-disable-color)" }} />
      </div>

      <h2 className="ds-h2">Tables</h2>
      <div className="ds-card">
        <TokenRow name="table-dark-cell" value="header cell bg" swatch={{ background: "var(--table-dark-cell)" }} />
        <TokenRow name="table-hover-bg" value="row hover" swatch={{ background: "var(--table-hover-bg)" }} />
        <TokenRow name="table-border-color" value="row border" swatch={{ background: "var(--table-border-color)" }} />
      </div>

      <h2 className="ds-h2">Bubbles & utility classes</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Auto-generated from the semantic map. Use these — don't write your own chip CSS.
      </p>
      <div className="ds-card">
        <div className="ds-row">
          {["primary","success","warning","danger","info","orange","secondary"].map((c) => (
            <FnTag key={c} color={c}>{c}</FnTag>
          ))}
        </div>
        <div className="divider" />
        <div className="ds-row">
          {["success","warning","danger","info","primary","orange"].map((c) => (
            <div key={c} style={{ width: 120 }}>
              <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>.progress-bar-{c}</div>
              <FnProgress value={[80,55,30,70,90,40][["success","warning","danger","info","primary","orange"].indexOf(c)]} color={c} label={c} />
            </div>
          ))}
        </div>
      </div>

      <A11yNote items={[
        "Every text/background pair in this page meets WCAG 2.1 AA contrast (≥4.5:1 for normal text, ≥3:1 for large text & UI components).",
        "Don't use raw hex codes in component SCSS — always var(--token) so dark mode swaps for free.",
        "Status is never communicated by color alone. Pair with an icon and/or text label.",
      ]} />
    </main>
  );
}

/* ----------------------------- Typography --------------------------------- */
function ViewTypography() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Foundation" title="Typography"
        lead="UI uses Inter (loaded via Google Fonts in _font.scss). Body baseline is 8.7pt / 400. The mono family (used for IDs, code, tabular data) is JetBrains Mono." />

      <h2 className="ds-h2">Scale</h2>
      <div className="ds-card">
        <div className="ds-stack">
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-.02em" }}>Page title · 28 / 600 · -2% tracking</div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.01em" }}>Section · 22 / 600</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>Subsection · 16 / 500</div>
          <div style={{ fontSize: 14 }}>Body · 14 / 400 — used for paragraphs, table cells, drawer body.</div>
          <div style={{ fontSize: 13 }}>Body small · 13 / 400 — used inside buttons (default size).</div>
          <div style={{ fontSize: 12, color: "var(--iron)" }}>Label / caption · 12 / 400 iron — form labels, table headers, breadcrumb.</div>
          <div style={{ fontSize: 11, color: "var(--red)" }}>Error · 11 / 400 red — inline form errors.</div>
        </div>
      </div>

      <h2 className="ds-h2">Mono</h2>
      <div className="ds-card">
        <div className="ds-row" style={{ fontFamily: "var(--ds-mono)" }}>
          <span style={{ fontSize: 13 }}>SHIFT-2027</span>
          <span style={{ fontSize: 12, color: "var(--iron)" }}>EMP-00482</span>
          <span style={{ fontSize: 14, fontVariantNumeric: "tabular-nums" }}>$1,284.50</span>
        </div>
      </div>

      <h2 className="ds-h2">Weights & cases</h2>
      <div className="ds-card">
        <table className="proptbl">
          <thead><tr><th>Element</th><th>Size</th><th>Weight</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>Form labels</td><td>12px</td><td>500</td><td>Sentence case. Sit above the input with 5px margin.</td></tr>
            <tr><td>Inputs</td><td>12px</td><td>400</td><td>Fixed height 30px — don't override.</td></tr>
            <tr><td>Buttons (default)</td><td>13px</td><td>400</td><td>Use 12px for <code className="ds-inline">btn-sm</code>/<code className="ds-inline">btn-xs</code>.</td></tr>
            <tr><td>Table headers</td><td>11.5px</td><td>600</td><td>UPPERCASE with 4% tracking.</td></tr>
            <tr><td>UPPERCASE eyebrows</td><td>10.5–11px</td><td>600</td><td>Used for section labels, tags. Track +6%.</td></tr>
          </tbody>
        </table>
      </div>

      <A11yNote items={[
        "Minimum size for body text is 12px — never smaller.",
        "Don't use ultra-light weights (<400) — fails contrast on thin strokes.",
        "Line-height is 1.45 for body, 1.15 for display sizes 22+.",
      ]} />
    </main>
  );
}

/* ----------------------------- Spacing ------------------------------------ */
function ViewSpacing() {
  const scale = [4, 8, 12, 16, 24, 32, 48];
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Foundation" title="Spacing & radii"
        lead="4px base unit. Component padding leans dense (16px inside cards, not 24px). Radii are tight: 4px for chips/buttons, 6px for forms, 9px for cards/dialogs, 30px for pill buttons." />

      <h2 className="ds-h2">Spacing scale</h2>
      <div className="ds-card">
        {scale.map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <code className="ds-inline" style={{ width: 90 }}>--space-{i + 1}</code>
            <span style={{ width: 60, fontFamily: "var(--ds-mono)", fontSize: 12, color: "var(--iron)" }}>{n}px</span>
            <span style={{ display: "inline-block", height: 18, width: n, background: "var(--blue)", borderRadius: 3 }} />
          </div>
        ))}
        <div className="divider" />
        <div className="muted" style={{ fontSize: 12 }}>In component SCSS prefer the foundation mixins (<code className="ds-inline">@include padding(...)</code>, <code className="ds-inline">@include radius(...)</code>) — they handle RTL automatically.</div>
      </div>

      <h2 className="ds-h2">Radii</h2>
      <div className="ds-grid ds-cols-4">
        {[
          { name: "4px",                v: "4px",  use: "Chips, buttons (default), inputs" },
          { name: "var(--radius-sm)",   v: "6px",  use: "Cards (compact), tag groups" },
          { name: "var(--radius-md)",   v: "9px",  use: "Dialogs, drawers, big surfaces" },
          { name: "30px",               v: "30px", use: ".btn-round, pill chips" },
          { name: "50%",                v: "circle", use: "Avatars, fn-float-btn, dots" },
        ].map((r) => (
          <div key={r.name} className="ds-card" style={{ marginBottom: 0, padding: 16, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "var(--blue)", margin: "0 auto 10px", borderRadius: r.v === "circle" ? "50%" : r.v }} />
            <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11.5 }}>{r.name}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{r.use}</div>
          </div>
        ))}
      </div>

      <h2 className="ds-h2">Padding presets in code</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`// _mixins.scss exposes:
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
}`) }} /></pre>
    </main>
  );
}

/* ----------------------------- Shadows ------------------------------------ */
function ViewShadows() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Foundation" title="Shadows & elevation"
        lead="Foundation prefers borders over shadows in dense views. Shadows are reserved for floating chrome: dropdowns, modals, drawers, toasts, the float button." />

      <h2 className="ds-h2">Levels</h2>
      <div className="ds-grid ds-cols-3" style={{ marginBottom: 24 }}>
        <div style={{ padding: 32, background: "var(--bg-primary)", borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default-color)", textAlign: "center" }}>
          <div className="ds-h3" style={{ marginTop: 0 }}>Resting</div>
          <div className="muted" style={{ fontSize: 12 }}>1px border, no shadow</div>
          <code className="ds-inline" style={{ marginTop: 12, display: "inline-block" }}>border-default-color</code>
        </div>
        <div style={{ padding: 32, background: "var(--bg-primary)", borderRadius: "var(--radius-md)",
                      boxShadow: "0 4px 12px rgba(15,18,40,0.06), 0 1px 2px rgba(15,18,40,0.04)", textAlign: "center" }}>
          <div className="ds-h3" style={{ marginTop: 0 }}>Menu / dropdown</div>
          <div className="muted" style={{ fontSize: 12 }}>used for ng-select menu, popovers</div>
          <code className="ds-inline" style={{ marginTop: 12, display: "inline-block" }}>shadow-md</code>
        </div>
        <div style={{ padding: 32, background: "var(--bg-primary)", borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow)", textAlign: "center" }}>
          <div className="ds-h3" style={{ marginTop: 0 }}>Modal / drawer</div>
          <div className="muted" style={{ fontSize: 12 }}>fn-dialog, ag-drawer-host, toast</div>
          <code className="ds-inline" style={{ marginTop: 12, display: "inline-block" }}>var(--shadow)</code>
        </div>
      </div>

      <h2 className="ds-h2">Tokens</h2>
      <div className="ds-card">
        <TokenRow name="shadow" value="0 7px 22px rgba(0,0,0,.15) — light  ·  0 15px 35px rgba(0,0,0,.6) — dark" />
        <TokenRow name="table-shadow" value="rgba(0,0,0,.05) — used by fn-grid resize handle" />
        <TokenRow name="cdk-overlay-backdrop" value="rgba(0,0,0,.68) light  ·  rgba(0,0,0,.32) dark — modal scrim" />
      </div>

      <h2 className="ds-h2">Focus ring</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Every interactive element gets <code className="ds-inline">:focus-visible</code> outline via the global rule — a 2px blue ring with 4px radius. Keyboard-first is non-negotiable per VPAT.
      </p>
      <div className="ds-card ds-row">
        <FnButton type="primary" text="Tab here →" />
        <FnInput placeholder="Tab to me" style={{ width: 200 }} />
        <FnSelect items={[{id: 1, name: "Option A"}, {id: 2, name: "Option B"}]} placeholder="Select…" />
      </div>
    </main>
  );
}

/* ----------------------------- Icons -------------------------------------- */
function ViewIcons() {
  const phosphorSamples = ["house","user-circle","gear","bell","calendar","clock","check-circle",
    "x-circle","warning","info","plus","minus","pencil","trash","magnifying-glass",
    "caret-down","caret-right","arrow-right","arrow-left","download-simple","upload-simple",
    "share-network","chat-circle","heart","star","kanban","table","chart-pie","fork-knife",
    "users-three","hand-coins","clipboard-text","note-pencil"];

  const fnGlobalSamples = ["fn-global-site","fn-global-employee","fn-global-schedule",
    "fn-global-report","fn-global-setting","fn-global-cloud","fn-global-pdf","fn-global-csv",
    "fn-global-edit","fn-global-delete","fn-global-eye","fn-global-export"];

  return (
    <main className="ds-main">
      <SectionHead eyebrow="Foundation" title="Iconography"
        lead="Foundation uses Phosphor (regular / bold / duotone / fill / light / thin) plus a custom AG global font (fn-global-*). All icons render through <fn-icon> for consistent sizing, color, and a11y." />

      <h2 className="ds-h2">Phosphor</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Reference by class name. Weights: <code className="ds-inline">ph</code> (regular), <code className="ds-inline">ph-bold</code>, <code className="ds-inline">ph-duotone</code>, <code className="ds-inline">ph-fill</code>, <code className="ds-inline">ph-light</code>, <code className="ds-inline">ph-thin</code>.
      </p>
      <Demo
        code={`<fn-icon icon="ph-gear" lib="ph" size="20px"></fn-icon>
<fn-icon icon="ph-bell" lib="ph" size="18px" color="var(--orange)"></fn-icon>`}>
        <div className="ds-row" style={{ gap: 16 }}>
          {["regular","bold","duotone","fill"].map((w) => (
            <div key={w} className="ds-stack" style={{ gap: 4, alignItems: "center" }}>
              <Ph name="gear" weight={w} size="28px" />
              <span className="muted" style={{ fontSize: 11 }}>{w}</span>
            </div>
          ))}
        </div>
      </Demo>

      <h2 className="ds-h2">Phosphor — common set</h2>
      <div className="ds-card">
        <div className="ds-grid ds-cols-6" style={{ gap: 8 }}>
          {phosphorSamples.map((name) => (
            <div key={name} className="ds-stack" style={{ gap: 4, alignItems: "center", padding: 10, borderRadius: 6, border: "1px solid var(--border-default-color)", background: "var(--bg-primary)" }}>
              <Ph name={name} size="20px" />
              <span style={{ fontSize: 10.5, color: "var(--iron)", fontFamily: "var(--ds-mono)", textAlign: "center" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="ds-h2">AG custom font (fn-global-*)</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Loaded from <code className="ds-inline">_globalFont.scss</code> via the altametrics CDN. Use these for product-specific glyphs that Phosphor doesn't cover (sites, employees, schedules, exports).
      </p>
      <div className="ds-card">
        <div className="ds-grid ds-cols-6" style={{ gap: 8 }}>
          {fnGlobalSamples.map((name) => (
            <div key={name} className="ds-stack" style={{ gap: 4, alignItems: "center", padding: 10, borderRadius: 6, border: "1px solid var(--border-default-color)", background: "var(--bg-primary)" }}>
              <i className={name} style={{ fontSize: 22 }} aria-hidden="true" />
              <span style={{ fontSize: 10, color: "var(--iron)", fontFamily: "var(--ds-mono)", textAlign: "center", wordBreak: "break-all" }}>{name.replace("fn-global-","")}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="ds-h2">Sizes</h2>
      <div className="ds-card ds-row" style={{ alignItems: "baseline", gap: 24 }}>
        <div className="ds-stack" style={{ alignItems: "center", gap: 4 }}><Ph name="gear" size="14px" /><span className="muted" style={{ fontSize: 11 }}>14 · dense</span></div>
        <div className="ds-stack" style={{ alignItems: "center", gap: 4 }}><Ph name="gear" size="16px" /><span className="muted" style={{ fontSize: 11 }}>16 · default</span></div>
        <div className="ds-stack" style={{ alignItems: "center", gap: 4 }}><Ph name="gear" size="20px" /><span className="muted" style={{ fontSize: 11 }}>20 · button</span></div>
        <div className="ds-stack" style={{ alignItems: "center", gap: 4 }}><Ph name="gear" size="24px" /><span className="muted" style={{ fontSize: 11 }}>24 · empty state</span></div>
      </div>

      <A11yNote label="VPAT — icons">
        <ul>
          <li>Decorative icons in buttons next to a visible label: <code className="ds-inline">aria-hidden="true"</code>. Don't double-announce.</li>
          <li>Icon-only buttons: use the <code className="ds-inline">a11yIconBtn</code> directive — it stamps <code className="ds-inline">aria-label</code> on the host and <code className="ds-inline">aria-hidden="true"</code> on every inner glyph.</li>
          <li>Never use Unicode glyphs (<code className="ds-inline">→</code>, <code className="ds-inline">✓</code>) or emoji as icons — they don't translate and don't have consistent line-height. Always SVG / icon font.</li>
        </ul>
      </A11yNote>
    </main>
  );
}

/* ----------------------------- Motion ------------------------------------- */
function ViewMotion() {
  const [bounce, setBounce] = useState(0);
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Foundation" title="Motion"
        lead="Motion is functional — never decorative. Linear easing for state changes, 120–240ms durations. No bounces, no springs, no confetti." />

      <h2 className="ds-h2">Durations</h2>
      <div className="ds-card">
        <table className="proptbl">
          <thead><tr><th>Token</th><th>Value</th><th>Used for</th></tr></thead>
          <tbody>
            <tr><td><code className="ds-inline">--dur-instant</code></td><td>80ms</td><td>Press feedback (button scale down)</td></tr>
            <tr><td><code className="ds-inline">--dur-fast</code></td><td>120ms</td><td>Hover, focus ring, switch toggle</td></tr>
            <tr><td><code className="ds-inline">--dur-base</code></td><td>180ms</td><td>Tab switch, state changes, accordion</td></tr>
            <tr><td><code className="ds-inline">--dur-slow</code></td><td>240ms</td><td>Drawer slide, dialog open</td></tr>
            <tr><td><code className="ds-inline">--dur-slower</code></td><td>320ms</td><td>Modal in/out, complex panel transitions</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Easing</h2>
      <div className="ds-card">
        <table className="proptbl">
          <thead><tr><th>Token</th><th>Value</th><th>Feel</th></tr></thead>
          <tbody>
            <tr><td><code className="ds-inline">linear</code></td><td>0.2s linear</td><td>Default for fades and color transitions in <code className="ds-inline">_input.scss</code>.</td></tr>
            <tr><td><code className="ds-inline">--ease-out</code></td><td>cubic-bezier(0.16, 1, 0.3, 1)</td><td>Micro-interactions — switch knob, focus ring expansion.</td></tr>
            <tr><td><code className="ds-inline">--ease-soft</code></td><td>cubic-bezier(0.32, 0.72, 0, 1)</td><td>Panel/drawer slides — gentle exit.</td></tr>
            <tr><td><code className="ds-inline">--ease-in-out</code></td><td>cubic-bezier(0.65, 0, 0.35, 1)</td><td>Two-way state (tab indicator move).</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Live preview</h2>
      <Demo>
        <div className="ds-row">
          <FnSwitch checked={bounce > 0} onChange={(v) => setBounce(v ? 1 : 0)} ariaLabel="Demo switch" />
          <FnButton type="primary" text="Hover & press me" />
          <span className="fn-spinner" />
        </div>
      </Demo>

      <A11yNote>
        Every transform/translate in foundation respects <code className="ds-inline">prefers-reduced-motion</code> — animations collapse to opacity-only. No exceptions: spinners use opacity pulse, not rotation, under reduced-motion.
      </A11yNote>
    </main>
  );
}

/* ----------------------------- Export ------------------------------------- */
Object.assign(window, {
  ViewColors, ViewTypography, ViewSpacing, ViewShadows, ViewIcons, ViewMotion,
});
