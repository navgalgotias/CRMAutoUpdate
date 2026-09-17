/* ============================================================================
   AG Design System — app.jsx
   App shell: sidebar nav, top bar with theme/density toggle, view router.
   ============================================================================ */
const NAV = [
  { label: "Get started", items: [
    { id: "overview",    title: "Overview",            icon: "house" },
    { id: "how-to-use",  title: "How to use this system", icon: "compass" },
    { id: "connect",     title: "Connect to a project", icon: "plug" },
    { id: "principles",  title: "Principles & rules",  icon: "gavel" },
  ]},
  { label: "Foundations", items: [
    { id: "colors",      title: "Color",               icon: "palette" },
    { id: "typography",  title: "Typography",          icon: "text-aa" },
    { id: "spacing",     title: "Spacing & radii",     icon: "ruler" },
    { id: "shadows",     title: "Shadows & elevation", icon: "stack" },
    { id: "icons",       title: "Iconography",         icon: "smiley" },
    { id: "motion",      title: "Motion",              icon: "lightning" },
  ]},
  { label: "Components — Forms", items: [
    { id: "fn-button",       title: "Button",          icon: "cursor-click" },
    { id: "fn-input",        title: "Text input",      icon: "text-t" },
    { id: "fn-select",       title: "Select",          icon: "caret-circle-down" },
    { id: "fn-switch",       title: "Switch",          icon: "toggle-right" },
    { id: "fn-checkbox",     title: "Checkbox & Radio",icon: "check-square" },
    { id: "fn-date",         title: "Date & date-range",     icon: "calendar" },
    { id: "fn-time",         title: "Time picker",     icon: "clock" },
    { id: "fn-tel",          title: "Phone input",     icon: "phone" },
    { id: "fn-color-picker", title: "Color picker",    icon: "drop" },
    { id: "fn-files",        title: "File upload",     icon: "upload-simple" },
    { id: "fn-text-editor",  title: "Rich text editor",icon: "text-h" },
    { id: "fn-rating",       title: "Rating",          icon: "star" },
  ]},
  { label: "Components — Data", items: [
    { id: "fn-table",        title: "Table",           icon: "table" },
    { id: "fn-grid",         title: "Editable grid",   icon: "grid-four" },
    { id: "fn-pagination",   title: "Pagination",      icon: "dots-three-outline" },
    { id: "fn-chart",        title: "Charts",          icon: "chart-line" },
  ]},
  { label: "Components — Navigation", items: [
    { id: "fn-breadcrumb",   title: "Breadcrumb",      icon: "list-bullets" },
    { id: "fn-tabs",         title: "Tabs",            icon: "browsers" },
    { id: "fn-menu",         title: "Sidebar menu",    icon: "list" },
    { id: "fn-accordion",    title: "Accordion",       icon: "list-plus" },
  ]},
  { label: "Components — Feedback", items: [
    { id: "fn-dialog",       title: "Dialog & confirm",icon: "warning" },
    { id: "fn-drawer",       title: "Drawer",          icon: "sidebar" },
    { id: "fn-toast",        title: "Toaster",         icon: "bell" },
    { id: "fn-loader",       title: "Loaders",         icon: "spinner" },
    { id: "fn-no-data",      title: "No Data box",     icon: "tray" },
    { id: "fn-tag",          title: "Tag / Badge",     icon: "tag" },
    { id: "fn-avatar",       title: "Avatar",          icon: "user-circle" },
    { id: "fn-float-btn",    title: "Float button",    icon: "plus-circle" },
  ]},
  { label: "HW-Foundation", items: [
    { id: "hw-header",       title: "App header",      icon: "browser" },
    { id: "hw-auth",         title: "Auth shell",      icon: "lock-key" },
    { id: "hw-app-market",   title: "App market",      icon: "squares-four" },
  ]},
  { label: "Patterns", items: [
    { id: "p-shell",         title: "App shell",        icon: "layout" },
    { id: "p-boilerplate",   title: "Page boilerplate", icon: "frame-corners" },
    { id: "p-dashboard",     title: "Dashboard",        icon: "chart-pie" },
    { id: "p-list",          title: "List page",        icon: "rows" },
    { id: "p-form",          title: "Form page",        icon: "note-pencil" },
    { id: "p-detail",        title: "Detail + drawer",  icon: "file-text" },
    { id: "p-auth",          title: "Auth",             icon: "sign-in" },
    { id: "p-settings",      title: "Settings",         icon: "gear" },
    { id: "p-empty",         title: "Empty & loading",  icon: "circle-dashed" },
  ]},
  { label: "Showcase", items: [
    { id: "restaurant",      title: "Restaurant scheduling", icon: "fork-knife" },
    { id: "variations",      title: "Visual variations →",   icon: "swap" },
  ]},
  { label: "Compliance", items: [
    { id: "a11y",            title: "VPAT & WCAG 2.1 AA",    icon: "wheelchair" },
  ]},
];

function findItem(id) {
  for (const sec of NAV) for (const it of sec.items) if (it.id === id) return { item: it, section: sec.label };
  return { item: null, section: null };
}

/* ----------------------------- Sidebar ------------------------------------ */
function Sidebar({ active, onPick, search, onSearch }) {
  const filterFn = (it) => !search || it.title.toLowerCase().includes(search.toLowerCase()) || it.id.includes(search.toLowerCase());
  return (
    <aside className="ds-sidebar" aria-label="Primary navigation">
      <div className="brand">
        <div className="logo" aria-hidden="true">AG</div>
        <div className="name">AG Design System</div>
        <div className="ver">v1.0</div>
      </div>
      {NAV.map((sec) => {
        const items = sec.items.filter(filterFn);
        if (items.length === 0) return null;
        return (
          <div key={sec.label} className="nav-section">
            <div className="label">{sec.label}</div>
            {items.map((it) => (
              <div key={it.id} role="link" tabIndex={0}
                   className={`nav-item ${active === it.id ? "active" : ""}`}
                   onClick={() => onPick(it.id)}
                   onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(it.id); } }}
                   aria-current={active === it.id ? "page" : undefined}>
                <Ph name={it.icon} size="16px" />
                <span>{it.title}</span>
              </div>
            ))}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{ padding: 12, fontSize: 11, color: "var(--iron)", borderTop: "1px solid var(--border-default-color)" }}>
        Mirrors <code className="ds-inline">projects/foundation</code> + <code className="ds-inline">hw-foundation</code>.
        Tokens stay 1:1 with <code className="ds-inline">_variable.scss</code>.
      </div>
    </aside>
  );
}

/* ----------------------------- Top bar ------------------------------------ */
function TopBar({ section, current, theme, onToggleTheme, density, onDensity, search, onSearch }) {
  return (
    <header className="ds-topbar" role="banner">
      <nav className="fn-breadcrumb" aria-label="Breadcrumb">
        <a tabIndex={0} role="link" onClick={() => window.navigate?.("overview")}
           style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Ph name="house" size="13px" />
          AG DS
        </a>
        <span className="sep" aria-hidden="true">/</span>
        <a tabIndex={0} role="link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Ph name="folder-simple" size="13px" />
          {section || "Foundations"}
        </a>
        <span className="sep" aria-hidden="true">/</span>
        <span className="current" aria-current="page" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {current?.icon && <Ph name={current.icon} size="13px" />}
          {current?.title || ""}
        </span>
      </nav>
      <div className="right">
        <div className="ds-search" role="search">
          <Ph name="magnifying-glass" size="14px" />
          <input type="search" placeholder="Search components & tokens"
                 value={search} onChange={(e) => onSearch(e.target.value)} aria-label="Search" />
          <span className="kbd">⌘K</span>
        </div>

        <div className="ds-toggle-group" role="group" aria-label="Density">
          <button className={density === "comfortable" ? "on" : ""} onClick={() => onDensity("comfortable")}><Ph name="rows" size="13px" /> Comfortable</button>
          <button className={density === "default"     ? "on" : ""} onClick={() => onDensity("default")}><Ph name="list" size="13px" /> Default</button>
          <button className={density === "compact"     ? "on" : ""} onClick={() => onDensity("compact")}><Ph name="list-dashes" size="13px" /> Compact</button>
        </div>

        <button className="ds-iconbtn" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle light / dark">
          <Ph name={theme === "dark" ? "sun" : "moon"} />
        </button>

        <a className="ds-iconbtn" href="Variations.html" aria-label="Open visual variations">
          <Ph name="layout" /> Variations
        </a>
      </div>
    </header>
  );
}

/* ----------------------------- View router -------------------------------- */
function ViewRouter({ id }) {
  // Foundations
  if (id === "overview" || id === "principles") return <ViewOverview id={id} />;
  if (id === "how-to-use") return <ViewHowToUse />;
  if (id === "connect")    return <ViewConnect />;
  if (id === "colors")     return <ViewColors />;
  if (id === "typography") return <ViewTypography />;
  if (id === "spacing")    return <ViewSpacing />;
  if (id === "shadows")    return <ViewShadows />;
  if (id === "icons")      return <ViewIcons />;
  if (id === "motion")     return <ViewMotion />;

  // Components — Forms
  if (id === "fn-button")       return <ViewButton />;
  if (id === "fn-input")        return <ViewInput />;
  if (id === "fn-select")       return <ViewSelect />;
  if (id === "fn-switch")       return <ViewSwitch />;
  if (id === "fn-checkbox")     return <ViewCheckbox />;
  if (id === "fn-date")         return <ViewDate />;
  if (id === "fn-time")         return <ViewTime />;
  if (id === "fn-tel")          return <ViewTel />;
  if (id === "fn-color-picker") return <ViewColorPicker />;
  if (id === "fn-files")        return <ViewFiles />;
  if (id === "fn-text-editor")  return <ViewEditor />;
  if (id === "fn-rating")       return <ViewRatingPage />;

  // Components — Data
  if (id === "fn-table")        return <ViewTable />;
  if (id === "fn-grid")         return <ViewGrid />;
  if (id === "fn-pagination")   return <ViewPagination />;
  if (id === "fn-chart")        return <ViewChart />;

  // Components — Navigation
  if (id === "fn-breadcrumb")   return <ViewBreadcrumb />;
  if (id === "fn-tabs")         return <ViewTabsPage />;
  if (id === "fn-menu")         return <ViewMenu />;
  if (id === "fn-accordion")    return <ViewAccordionPage />;

  // Components — Feedback
  if (id === "fn-dialog")       return <ViewDialog />;
  if (id === "fn-drawer")       return <ViewDrawerPage />;
  if (id === "fn-toast")        return <ViewToastPage />;
  if (id === "fn-loader")       return <ViewLoader />;
  if (id === "fn-no-data")      return <ViewNoData />;
  if (id === "fn-tag")          return <ViewTagPage />;
  if (id === "fn-avatar")       return <ViewAvatarPage />;
  if (id === "fn-float-btn")    return <ViewFloat />;

  // HW
  if (id === "hw-header")       return <ViewHwHeader />;
  if (id === "hw-auth")         return <ViewHwAuth />;
  if (id === "hw-app-market")   return <ViewHwAppMarket />;

  // Patterns
  if (id === "p-shell")         return <ViewPatternShell />;
  if (id === "p-boilerplate")   return <ViewPatternBoilerplate />;
  if (id === "p-dashboard")     return <ViewPatternDashboard />;
  if (id === "p-list")          return <ViewPatternList />;
  if (id === "p-form")          return <ViewPatternForm />;
  if (id === "p-detail")        return <ViewPatternDetail />;
  if (id === "p-auth")          return <ViewPatternAuth />;
  if (id === "p-settings")      return <ViewPatternSettings />;
  if (id === "p-empty")         return <ViewPatternEmpty />;

  // Showcase
  if (id === "restaurant")      return <ViewRestaurant />;
  if (id === "variations")      return <ViewVariationsCTA />;

  // A11y
  if (id === "a11y")            return <ViewA11y />;

  return <ViewOverview id="overview" />;
}

function ViewVariationsCTA() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Showcase" title="Visual variations"
        lead="Open the side-by-side variations canvas — three directions exploring how the gallery itself could be themed without changing tokens." />
      <a href="Variations.html" className="ds-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        <div className="ds-row" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="ds-h3" style={{ marginTop: 0 }}>Open variations canvas</div>
            <div className="muted">3 directions on an infinite canvas · drag-reorder · fullscreen focus</div>
          </div>
          <Ph name="arrow-square-out" size="24px" style={{ color: "var(--blue)" }} />
        </div>
      </a>
    </main>
  );
}

/* ----------------------------- Overview ----------------------------------- */
function ViewOverview({ id }) {
  if (id === "principles") {
    return (
      <main className="ds-main">
        <SectionHead eyebrow="Get started" title="Principles & rules"
          lead="Hard constraints copied from your foundation reference doc. AI agents and engineers must follow these when generating pages." />
        <div className="ds-card">
          <ol style={{ lineHeight: 1.8, paddingLeft: 18 }}>
            <li><b>Never import from source paths.</b> Always import from <code className="ds-inline">'foundation'</code> or <code className="ds-inline">'hw-foundation'</code>. The tsconfig alias resolves these to <code className="ds-inline">dist/</code>.</li>
            <li><b>Import the per-feature module</b>, not the whole library. Need a button → <code className="ds-inline">FnButtonModule</code>. <code className="ds-inline">FoundationModule</code> only provides cross-cutting services.</li>
            <li><b>Prefix discipline.</b> Components: <code className="ds-inline">Fn*</code> / <code className="ds-inline">Hw*</code>. Selectors: <code className="ds-inline">fn-*</code> / <code className="ds-inline">hw-*</code>.</li>
            <li><b>Colors come from tokens.</b> <code className="ds-inline">var(--blue)</code>, never <code className="ds-inline">#005bc4</code>. To add a color, extend <code className="ds-inline">_variable.scss</code> and <code className="ds-inline">_color.scss</code> first.</li>
            <li><b>Text goes through i18n.</b> Every user-visible string is a key fed to the <code className="ds-inline">fnTranslate</code> pipe or <code className="ds-inline">FnI18nService</code>.</li>
            <li><b>Dates use the global prototype.</b> <code className="ds-inline">date.formatter(FN_DATE_FORMAT.XYZ)</code> from <code className="ds-inline">fn-date-format.constant.ts</code>.</li>
            <li><b>HTTP via <code className="ds-inline">FnHttpService</code></b> (foundation) or <code className="ds-inline">HwHttpService</code> (hw-foundation). The interceptor + error handler are wired on these.</li>
            <li><b>Forms are reactive.</b> <code className="ds-inline">FormGroup</code> + <code className="ds-inline">formControlName</code>.</li>
            <li><b>Tailwind is styling-only.</b> <code className="ds-inline">preflight</code> is disabled — base resets come from Bootstrap/Material.</li>
            <li><b>Dark mode is a class on <code className="ds-inline">&lt;html&gt;</code>.</b> Token overrides only — no media queries.</li>
            <li><b>Every routed page uses the <code className="ds-inline">.hw-box-content</code> boilerplate</b> — three regions: header / title-bar / content.</li>
            <li><b>VPAT/WCAG 2.1 AA.</b> Labels associated; focus visible; <code className="ds-inline">role</code>/<code className="ds-inline">tabindex</code> only via <code className="ds-inline">a11yClickable</code>/<code className="ds-inline">a11yIconBtn</code>.</li>
          </ol>
        </div>
      </main>
    );
  }
  return (
    <main className="ds-main">
      <SectionHead eyebrow="AG Design System" title="One system. Two libraries. Every screen."
        lead="The reference for building Angular apps on top of foundation and hw-foundation. Every component below is keyboard-accessible, screen-reader-labeled, theme-aware, and i18n-ready." />

      <div className="ds-grid ds-cols-3" style={{ marginBottom: 16 }}>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--blue)" }}>
          <div className="ds-eyebrow">foundation</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>Generic UI kit</div>
          <p className="muted" style={{ fontSize: 12.5 }}>
            <code className="ds-inline">Fn*</code> components and platform services. Selector prefix <code className="ds-inline">fn-*</code>. Imported per feature module.
          </p>
          <div className="ds-row" style={{ gap: 6 }}>
            <FnTag color="primary">Buttons</FnTag>
            <FnTag color="primary">Inputs</FnTag>
            <FnTag color="primary">Table</FnTag>
            <FnTag color="primary">Grid</FnTag>
            <FnTag color="primary">Drawer</FnTag>
          </div>
        </div>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--orange)" }}>
          <div className="ds-eyebrow">hw-foundation</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>Branded shell</div>
          <p className="muted" style={{ fontSize: 12.5 }}>
            HW-branded headers, auth, app market, chit-chat, employee, release notes. Selector prefix <code className="ds-inline">hw-*</code>.
          </p>
          <div className="ds-row" style={{ gap: 6 }}>
            <FnTag color="orange">Header</FnTag>
            <FnTag color="orange">Auth</FnTag>
            <FnTag color="orange">Employee</FnTag>
          </div>
        </div>
        <div className="ds-card" style={{ borderLeft: "3px solid var(--green)" }}>
          <div className="ds-eyebrow">VPAT-ready</div>
          <div className="ds-h3" style={{ marginTop: 0 }}>WCAG 2.1 AA</div>
          <p className="muted" style={{ fontSize: 12.5 }}>
            Every component ships with keyboard support, ARIA roles, focus rings, and the directives that resolved your existing axe findings.
          </p>
          <div className="ds-row" style={{ gap: 6 }}>
            <FnTag color="success">a11yClickable</FnTag>
            <FnTag color="success">a11yIconBtn</FnTag>
          </div>
        </div>
      </div>

      <h2 className="ds-h2">Tokens at a glance</h2>
      <div className="ds-grid ds-cols-6" style={{ marginBottom: 16 }}>
        {["blue","cyan","green","orange","yellow","red"].map((c) => (
          <div key={c} className="swatch-card">
            <span className="color" style={{ background: `var(--${c})` }} />
            <div className="meta">
              <div className="label">{c}</div>
              <div className="v">var(--{c})</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="ds-h2">Build a page in 4 steps</h2>
      <div className="ds-card">
        <ol style={{ lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
          <li>Pick the <a onClick={() => navigate("p-boilerplate")} style={{ color: "var(--blue)", cursor: "pointer" }}>page boilerplate</a> (header / title-bar / content).</li>
          <li>Compose the body from <a onClick={() => navigate("fn-button")} style={{ color: "var(--blue)", cursor: "pointer" }}>buttons</a>, <a onClick={() => navigate("fn-input")} style={{ color: "var(--blue)", cursor: "pointer" }}>inputs</a>, <a onClick={() => navigate("fn-table")} style={{ color: "var(--blue)", cursor: "pointer" }}>tables</a>, etc.</li>
          <li>Use only <a onClick={() => navigate("colors")} style={{ color: "var(--blue)", cursor: "pointer" }}>tokens</a> — never raw hex.</li>
          <li>Import the per-feature <code className="ds-inline">NgModule</code> shown on each component card.</li>
        </ol>
      </div>

      <h2 className="ds-h2">Component coverage</h2>
      <div className="ds-card flush" style={{ overflowX: "auto" }}>
        <table className="proptbl">
          <thead><tr><th>Category</th><th>Count</th><th>Components</th></tr></thead>
          <tbody>
            <tr><td>Forms</td><td><code className="ds-inline">11</code></td><td className="muted">Button, Input, Select, Switch, Checkbox/Radio, Date pickers (4), Tel, Color, File upload, Editor, Rating</td></tr>
            <tr><td>Data</td><td><code className="ds-inline">4</code></td><td className="muted">Table, Editable grid, Pagination, Charts</td></tr>
            <tr><td>Navigation</td><td><code className="ds-inline">4</code></td><td className="muted">Breadcrumb, Tabs, Sidebar menu, Accordion</td></tr>
            <tr><td>Feedback</td><td><code className="ds-inline">8</code></td><td className="muted">Dialog, Drawer, Toast, Loader, No-data, Tag, Avatar, Float button</td></tr>
            <tr><td>HW shell</td><td><code className="ds-inline">9</code></td><td className="muted">Header (main/site/profile/apps/weather/time-clock/franchise/unauth), Auth, App market</td></tr>
            <tr><td>Patterns</td><td><code className="ds-inline">9</code></td><td className="muted">App shell, Boilerplate, Dashboard, List, Form, Detail, Auth, Settings, Empty/Loading</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  );
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
  useEffect(() => { localStorage.setItem("ds-density", density); }, [density]);

  useEffect(() => {
    function onHash() { setActive(location.hash.replace("#", "") || "overview"); window.scrollTo({ top: 0 }); }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function navigate(id) { location.hash = id; setActive(id); window.scrollTo({ top: 0 }); }
  // Expose for cross-component navigation links
  window.navigate = navigate;

  const { item, section } = findItem(active);

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

  return (
    <ToastProvider>
      <div className={`ds-shell density-${density}`}>
        <Sidebar active={active} onPick={navigate} search={search} onSearch={setSearch} />
        <div>
          <TopBar section={section} current={item} theme={theme}
                  onToggleTheme={() => setTheme((t) => t === "light" ? "dark" : "light")}
                  density={density} onDensity={setDensity}
                  search={search} onSearch={setSearch} />
          <ViewRouter id={active} />
        </div>
      </div>
      <AgBot />
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
