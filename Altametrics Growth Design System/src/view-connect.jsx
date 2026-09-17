/* ============================================================================
   AG Design System — view-connect.jsx
   How to wire this design system into an ongoing Angular project.
   ============================================================================ */

function CodeBlock({ children }) {
  const src = Array.isArray(children) ? children.join("") : String(children ?? "");
  const html = (typeof highlightAngular === "function") ? highlightAngular(src) : src;
  return (
    <pre className="ds-code" style={{ marginBottom: 12 }}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

function StepCard({ n, title, color, children }) {
  return (
    <div className="ds-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{n}</div>
        <div className="flex-1" style={{ minWidth: 0 }}>
          <div className="ds-h3" style={{ marginTop: 0, marginBottom: 8 }}>{title}</div>
          {children}
        </div>
      </div>
    </div>
  );
}

function ViewConnect() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Get started" title="Connect to a project"
        lead="The step-by-step method to bring the foundation + hw-foundation design system into an existing Angular application." />

      <div className="ds-grid ds-cols-3" style={{ marginBottom: 24 }}>
        <div className="ds-card" style={{ marginBottom: 0, borderLeft: "3px solid var(--blue)" }}>
          <div className="ds-eyebrow">Prerequisite</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>Angular 18+</div>
          <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>The libraries are built with Angular 18. Match your host app's major version before installing.</p>
        </div>
        <div className="ds-card" style={{ marginBottom: 0, borderLeft: "3px solid var(--green)" }}>
          <div className="ds-eyebrow">Two libraries</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>foundation · hw-foundation</div>
          <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>Generic UI kit + branded HW shell. Install both, or just <code className="ds-inline">foundation</code> if you don't need HW chrome.</p>
        </div>
        <div className="ds-card" style={{ marginBottom: 0, borderLeft: "3px solid var(--orange)" }}>
          <div className="ds-eyebrow">Styling</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>Tokens + theme</div>
          <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>One SCSS theme entry pulls in every token. Tailwind preflight stays OFF.</p>
        </div>
      </div>

      <h2 className="ds-h2">Method</h2>

      <StepCard n="1" color="var(--blue)" title="Install the libraries">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Add both packages (or build them locally and link the <code className="ds-inline">dist/</code> output).</p>
        <CodeBlock>{`# from your project root
npm install foundation hw-foundation

# …or, building from this monorepo:
ng build foundation && ng build hw-foundation
# then reference them via the tsconfig path alias (step 4)`}</CodeBlock>
      </StepCard>

      <StepCard n="2" color="var(--blue)" title="Pull in peer dependencies">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>The components wrap a few well-known libs. Install the ones your screens use.</p>
        <CodeBlock>{`npm install @ng-select/ng-select @ng-bootstrap/ng-bootstrap \\
  ngx-toastr @angular/cdk primeng ngx-color-picker \\
  intl-tel-input suneditor @amcharts/amcharts5`}</CodeBlock>
      </StepCard>

      <StepCard n="3" color="var(--green)" title="Wire the theme (tokens + global font)">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Import the foundation theme entry in your global <code className="ds-inline">styles.scss</code>. This is what defines every <code className="ds-inline">--token</code> on <code className="ds-inline">:root</code> and <code className="ds-inline">.dark-theme</code>.</p>
        <CodeBlock>{`/* styles.scss */
@import "foundation/theme/variable";   /* --blue, --body-bg, radii, … */
@import "foundation/theme/index";      /* component theme partials   */
@import "foundation/theme/globalFont"; /* fn-global-* icon font       */

/* Phosphor icons (used by fn-icon) */
@import "@phosphor-icons/web/src/regular/style.css";`}</CodeBlock>
        <div className="ds-a11y" role="note" style={{ marginTop: 4 }}>
          <span className="badge">Rule</span>
          <div className="flex-1">Keep Tailwind's <code className="ds-inline">preflight</code> disabled — base resets come from Bootstrap/Material. See <a onClick={() => window.navigate?.("principles")} style={{ color: "var(--blue)", cursor: "pointer" }}>Principles &amp; rules</a>.</div>
        </div>
      </StepCard>

      <StepCard n="4" color="var(--green)" title="Set the import aliases">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>So you always import from <code className="ds-inline">'foundation'</code> / <code className="ds-inline">'hw-foundation'</code> — never from a deep source path.</p>
        <CodeBlock>{`// tsconfig.json → compilerOptions.paths
{
  "paths": {
    "foundation":    ["dist/foundation"],
    "hw-foundation": ["dist/hw-foundation"]
  }
}`}</CodeBlock>
      </StepCard>

      <StepCard n="5" color="var(--orange)" title="Register the root providers">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Add the cross-cutting services once at app bootstrap. <code className="ds-inline">FoundationModule</code> wires the a11y directives, HTTP, i18n + loader; <code className="ds-inline">HwFoundationModule.forRoot()</code> adds the branded shell.</p>
        <CodeBlock>{`// app.config.ts (standalone) or AppModule imports
import { FoundationModule } from 'foundation';
import { HwFoundationModule } from 'hw-foundation';

imports: [
  FoundationModule,
  HwFoundationModule.forRoot({ appId: 'your-app' }),
]`}</CodeBlock>
      </StepCard>

      <StepCard n="6" color="var(--orange)" title="Import per-feature modules where you use them">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Don't import the whole library into a feature. Pull only the component module you need — every component card here lists its module name.</p>
        <CodeBlock>{`// employees.module.ts
import { FnButtonModule } from 'foundation';
import { FnInputModule } from 'foundation';
import { FnPrimeTableModule } from 'foundation';

@NgModule({ imports: [FnButtonModule, FnInputModule, FnPrimeTableModule] })
export class EmployeesModule {}`}</CodeBlock>
      </StepCard>

      <StepCard n="7" color="var(--purple)" title="Build the page from the boilerplate">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Every routed page uses the <a onClick={() => window.navigate?.("p-boilerplate")} style={{ color: "var(--blue)", cursor: "pointer" }}>.hw-box-content boilerplate</a>, then drops components into the body and binds data.</p>
        <CodeBlock>{`<div class="hw-box-content">
  <div class="hw-header-wrap"><div class="row">
    <div class="col"><i class="fn-global-employee"></i>
      {{ 'EMP.TITLE' | fnTranslate }}</div>
  </div></div>
  <div class="hw-content">
    <ag-prime-table [data]="rows" [columns]="cols"
                    [isPagginator]="true"></ag-prime-table>
  </div>
</div>`}</CodeBlock>
      </StepCard>

      <StepCard n="8" color="var(--purple)" title="Verify compliance">
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>Run the a11y checks before merging. The directives from step 5 resolve most findings automatically; confirm the rest against the <a onClick={() => window.navigate?.("a11y")} style={{ color: "var(--blue)", cursor: "pointer" }}>VPAT / WCAG 2.1 AA</a> page.</p>
        <CodeBlock>{`# axe in your e2e pipeline
npm install -D @axe-core/playwright
# then toggle light/dark and re-run contrast checks`}</CodeBlock>
      </StepCard>

      <h2 className="ds-h2">Checklist</h2>
      <div className="ds-card flush" style={{ overflowX: "auto" }}>
        <table className="proptbl">
          <thead><tr><th>Step</th><th>Done when…</th></tr></thead>
          <tbody>
            <tr><td>Libraries installed</td><td className="muted"><code className="ds-inline">foundation</code> + <code className="ds-inline">hw-foundation</code> resolve in <code className="ds-inline">node_modules</code> / <code className="ds-inline">dist</code>.</td></tr>
            <tr><td>Peer deps installed</td><td className="muted">ng-select, ng-bootstrap, primeng, toastr, cdk, etc. present.</td></tr>
            <tr><td>Theme imported</td><td className="muted">A token like <code className="ds-inline">var(--blue)</code> resolves; dark mode flips with <code className="ds-inline">.dark-theme</code> on <code className="ds-inline">&lt;html&gt;</code>.</td></tr>
            <tr><td>Aliases set</td><td className="muted">Imports come from <code className="ds-inline">'foundation'</code>, not <code className="ds-inline">'../../dist/...'</code>.</td></tr>
            <tr><td>Root providers</td><td className="muted">A bare <code className="ds-inline">fn-button</code> renders styled + keyboard-focusable.</td></tr>
            <tr><td>First page</td><td className="muted">A real screen built from the boilerplate + bound data renders.</td></tr>
            <tr><td>Compliance</td><td className="muted">axe passes in light + dark; keyboard nav works end-to-end.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Common pitfalls</h2>
      <div className="ds-card" style={{ borderLeft: "3px solid var(--red)" }}>
        <ul style={{ lineHeight: 1.9, paddingLeft: 18, margin: 0, fontSize: 13.5 }}>
          <li><b>Tailwind preflight on</b> → resets fight Bootstrap/Material. Disable it in <code className="ds-inline">tailwind.config.js</code> (<code className="ds-inline">corePlugins.preflight: false</code>).</li>
          <li><b>Importing from source paths</b> → breaks builds. Always import from the package alias.</li>
          <li><b>Hardcoded hex</b> instead of tokens → dark mode breaks + fails contrast. Use <code className="ds-inline">var(--token)</code>.</li>
          <li><b>Missing peer dep</b> → component throws at runtime. Install the lib the component wraps.</li>
          <li><b>Whole-library import</b> in a feature module → bloats the bundle. Import the per-feature module only.</li>
        </ul>
      </div>

      <A11yNote label="Note">
        This gallery documents the contract; the components ship from the <code className="ds-inline">foundation</code> / <code className="ds-inline">hw-foundation</code> packages. Once connected, use each component card here as the reference for selector, module, props, and markup.
      </A11yNote>
    </main>
  );
}

Object.assign(window, { ViewConnect });
