/* ============================================================================
   AG Design System — view-how-to-use.jsx
   Onboarding: the PS → UI Dev workflow + objectives this system fulfills.
   ============================================================================ */

function ViewHowToUse() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Get started" title="How to use this system"
        lead="This page spells out the workflow this design system is built to support — from a rough prototype to a data-bound page — and who does what at each step." />

      <h2 className="ds-h2">Why this system exists</h2>
      <div className="ds-grid ds-cols-2" style={{ marginBottom: 16 }}>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--blue)", marginBottom: 0 }}>
          <div className="ds-eyebrow">Objective 1</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>One centralized system</div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>Every token, component, and rule lives in one place and is followed across the whole application — no per-team reinvention.</p>
        </div>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--green)", marginBottom: 0 }}>
          <div className="ds-eyebrow">Objective 2</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>Fast page structure</div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>PS / UI Dev assemble a page's structure from a rough or prototype in minutes by composing documented patterns + components.</p>
        </div>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--orange)", marginBottom: 0 }}>
          <div className="ds-eyebrow">Objective 3</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>Render + bind only</div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>The UI Dev's remaining job is to drop the documented component and bind real data — not to design or hand-build UI.</p>
        </div>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--purple)", marginBottom: 0 }}>
          <div className="ds-eyebrow">Objective 4</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>VPAT / WCAG 2.1 AA</div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>Accessibility + color-contrast compliance is baked into every component, with the rules documented and verifiable.</p>
        </div>
      </div>

      <h2 className="ds-h2">The workflow</h2>
      <div className="ds-card">
        <div className="ds-stack" style={{ gap: 0 }}>
          {[
            { n: "1", who: "Designer / PS", color: "var(--blue)", title: "Start from a rough or prototype",
              body: <>Sketch the page intent. Identify which <a onClick={() => window.navigate?.("p-boilerplate")} style={{ color: "var(--blue)", cursor: "pointer" }}>page pattern</a> it maps to (list, form, detail+drawer, settings) and which components fill the body.</> },
            { n: "2", who: "PS / UI Dev", color: "var(--green)", title: "Compose the structure",
              body: <>Drop the <code className="ds-inline">.hw-box-content</code> boilerplate, then place the documented components (<a onClick={() => window.navigate?.("fn-table")} style={{ color: "var(--blue)", cursor: "pointer" }}>prime-table</a>, <a onClick={() => window.navigate?.("fn-select")} style={{ color: "var(--blue)", cursor: "pointer" }}>select</a>, <a onClick={() => window.navigate?.("fn-date")} style={{ color: "var(--blue)", cursor: "pointer" }}>date pickers</a>…). Copy the Markup block from each component card.</> },
            { n: "3", who: "UI Dev", color: "var(--orange)", title: "Bind data + wire events",
              body: <>Read the component's selector + NgModule + props table. Import the per-feature module, then bind <code className="ds-inline">[data]</code> / <code className="ds-inline">[(ngModel)]</code> / <code className="ds-inline">[config]</code> and handle output events. No new CSS — styling comes from the tokens.</> },
            { n: "4", who: "Everyone", color: "var(--purple)", title: "Verify compliance",
              body: <>Confirm the page follows the <a onClick={() => window.navigate?.("a11y")} style={{ color: "var(--blue)", cursor: "pointer" }}>VPAT / WCAG 2.1 AA</a> rules — keyboard, labels, focus, contrast — using the directives the foundation already provides.</> },
          ].map((s, i, arr) => (
            <div key={s.n} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border-default-color)" : 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: s.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
              <div className="flex-1">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</span>
                  <span className="fn-tag bubble-secondary" style={{ fontSize: 10.5 }}>{s.who}</span>
                </div>
                <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="ds-h2">What each role can rely on</h2>
      <div className="ds-card flush" style={{ overflowX: "auto" }}>
        <table className="proptbl">
          <thead><tr><th>Role</th><th>Uses this system for</th><th>Does NOT need to</th></tr></thead>
          <tbody>
            <tr><td><b>Designer / PS</b></td><td className="muted">Pick patterns + components that already exist; design within the token palette + type scale.</td><td className="muted">Invent new colors, spacing, or one-off components.</td></tr>
            <tr><td><b>UI Dev</b></td><td className="muted">Copy markup, import the feature module, bind data, handle events.</td><td className="muted">Write component CSS, re-implement tables/pickers, or hand-roll a11y.</td></tr>
            <tr><td><b>Reviewer / QA</b></td><td className="muted">Check the page against the documented VPAT rules + visual patterns.</td><td className="muted">Guess at intended behavior — it's specified per component.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Ground rules (non-negotiable)</h2>
      <div className="ds-card">
        <ul style={{ lineHeight: 1.9, paddingLeft: 18, margin: 0, fontSize: 13.5 }}>
          <li>Colors come from <a onClick={() => window.navigate?.("colors")} style={{ color: "var(--blue)", cursor: "pointer" }}>tokens</a> — never raw hex.</li>
          <li>Every page uses the <a onClick={() => window.navigate?.("p-boilerplate")} style={{ color: "var(--blue)", cursor: "pointer" }}>.hw-box-content boilerplate</a>.</li>
          <li>Reuse components — if one doesn't exist, extend the library, don't fork in a page.</li>
          <li>All user-visible text goes through i18n; all interactive elements meet <a onClick={() => window.navigate?.("a11y")} style={{ color: "var(--blue)", cursor: "pointer" }}>WCAG 2.1 AA</a>.</li>
        </ul>
      </div>

      <h2 className="ds-h2">Keeping this in sync</h2>
      <div className="ds-card">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
          This gallery is a <b>faithful mirror</b> of the <code className="ds-inline">foundation</code> + <code className="ds-inline">hw-foundation</code> Angular libraries — it does not read them at runtime. When you change the real library, re-sync the gallery so it stays trustworthy.
        </p>
        <div className="ds-grid ds-cols-3" style={{ gap: 12 }}>
          <div className="ds-card" style={{ marginBottom: 0, borderLeft: "3px solid var(--blue)" }}>
            <div className="ds-h3" style={{ marginTop: 0, fontSize: 14 }}>Changed a component</div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>Restyled or restructured an <code className="ds-inline">fn-*</code> / <code className="ds-inline">hw-*</code> component? Flag that one component — its SCSS/HTML is re-read and the matching card here is updated.</p>
          </div>
          <div className="ds-card" style={{ marginBottom: 0, borderLeft: "3px solid var(--green)" }}>
            <div className="ds-h3" style={{ marginTop: 0, fontSize: 14 }}>Added a component</div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>New selector (e.g. <code className="ds-inline">fn-stepper</code>)? It gets a facsimile, props table, a11y notes, and a sidebar entry.</p>
          </div>
          <div className="ds-card" style={{ marginBottom: 0, borderLeft: "3px solid var(--orange)" }}>
            <div className="ds-h3" style={{ marginTop: 0, fontSize: 14 }}>Changed tokens</div>
            <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>Edited <code className="ds-inline">_variable.scss</code> (colors, radii, spacing)? This is the highest-impact change — it propagates to every component. <code className="ds-inline">tokens.css</code> is kept 1:1 with it.</p>
          </div>
        </div>
        <div className="divider" />
        <ul style={{ lineHeight: 1.9, paddingLeft: 18, margin: 0, fontSize: 13.5 }}>
          <li><b>Source of truth is the library, never the gallery.</b> Change the real component first, then sync here — edits here don't flow back to Angular.</li>
          <li><b>Re-sync per change, not in bulk.</b> When a PR touches a component, sync that one — fast and accurate.</li>
          <li><b>Tokens first.</b> If a token changed, sync <code className="ds-inline">tokens.css</code> before component visuals — everything inherits from it.</li>
        </ul>
      </div>

      <A11yNote label="Note">
        This gallery is a faithful reference mirror of the <code className="ds-inline">foundation</code> + <code className="ds-inline">hw-foundation</code> Angular libraries. It documents what to use and how it should look + behave; the components themselves ship from those libraries.
      </A11yNote>
    </main>
  );
}

Object.assign(window, { ViewHowToUse });
