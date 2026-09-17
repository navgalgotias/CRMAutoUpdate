/* ============================================================================
   AG Design System — view-app-market.jsx
   <hw-app-landing> — two layouts: (1) plain grid/list, (2) with promo banner.
   ============================================================================ */

const AMK_APPS = [
  { id: "store",   name: "App Store",        color: "#ffffff", icon: "shopping-cart", store: true },
  { id: "pos",     name: "Plum POS",         color: "#ad2d75", icon: "orange-slice" },
  { id: "tk",      name: "Zip Timekeeping",  color: "#21a8bd", icon: "alarm" },
  { id: "dash",    name: "Zip POS DashBoard",color: "#54a2f2", icon: "chart-line-up" },
  { id: "cater",   name: "Plum Catering",    color: "#5b5bd6", icon: "fork-knife" },
];

const AMK_APPS_FULL = [
  { id: "store",   name: "App Store",       color: "#ffffff", icon: "shopping-cart", store: true },
  { id: "tunes",   name: "Zip Tunes",       color: "#21a8bd", icon: "music-notes",      ribbon: "coming", dim: true },
  { id: "tip",     name: "Tip Pool & Share",color: "#c1466b", icon: "hand-coins",       ribbon: "coming", dim: true },
  { id: "sign",    name: "Zip Digital Signage", color: "#801452", icon: "monitor",      ribbon: "newly", dim: true },
  { id: "sched",   name: "Zip Schedules",   color: "#54a2f2", icon: "calendar-check" },
  { id: "clock",   name: "Zip Clock",       color: "#54a2f2", icon: "clock" },
  { id: "inv",     name: "Zip Inventory",   color: "#8e88ff", icon: "clipboard-text" },
  { id: "order",   name: "Zip Ordering",    color: "#6d177c", icon: "shopping-cart-simple" },
  { id: "report",  name: "Zip Reporting",   color: "#fe7b1b", icon: "chart-pie-slice" },
  { id: "shift",   name: "Zip ShiftBook",   color: "#ed1c24", icon: "book-open" },
  { id: "check",   name: "Zip Checklist",   color: "#ed1c24", icon: "check-circle" },
  { id: "haccp",   name: "Zip HACCP",       color: "#ff6600", icon: "shield-check" },
  { id: "tip2",    name: "Tip Pool & Share",color: "#ad2d75", icon: "users-three",      ribbon: "free" },
  { id: "loyal",   name: "Plum Loyalty",    color: "#5b5bd6", icon: "star" },
  { id: "ai",      name: "AI Insights",     color: "#54a2f2", icon: "shield" },
];

const AMK_PROMOS = [
  { id: "tunes", name: "Zip Tunes", color: "linear-gradient(135deg,#1c8a9b,#24c1ad)", ribbon: "coming", ribbonLabel: "Coming Soon",
    desc: "Intuitive and efficient way to control the music being played within your establishment.",
    feats: ["Craft the perfect playlist", "Schedule playlists", "Auto-recovery", "Enhanced Customer Experience"] },
  { id: "sign", name: "Zip Digital Signage", color: "linear-gradient(135deg,#5b2a86,#801452)", ribbon: "newly", ribbonLabel: "Newly Launched",
    desc: "User-friendly technology for displaying and updating multimedia content, including restaurant menus, with real-time updates, offline mode, and AI integration.",
    feats: ["Dynamic Content Display", "Remote Content Management", "Scheduling & Automation", "High-Resolution Displays"] },
  { id: "bi", name: "BI Reporting", color: "linear-gradient(135deg,#2b8a9b,#3a6ea5)", ribbon: "free", ribbonLabel: "Free till Aug'26",
    desc: "Stay ahead with real-time insights, track performance effortlessly, and make smarter decisions with powerful BI reporting.",
    feats: ["AI Analytics", "Auto Scheduled Reports", "Machine Learning", "Sales Tracking"] },
];

function AmkToolbar({ view, setView, tab, setTab }) {
  return (
    <div className="amk-toolbar">
      <span className={`amk-tab ${tab === "apps" ? "active" : ""}`} onClick={() => setTab("apps")} role="tab" tabIndex={0} aria-selected={tab === "apps"}>
        <span className="ti"><Ph name="squares-four" weight="fill" size="18px" /></span> My Apps
      </span>
      <span className={`amk-tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")} role="tab" tabIndex={0} aria-selected={tab === "settings"}>
        <span className="ti"><Ph name="gear" size="18px" /></span> Settings
      </span>
      <div className="amk-search" role="search">
        <span className="si"><Ph name="magnifying-glass" size="16px" /></span>
        <input type="search" placeholder="Search Apps..." aria-label="Search apps" />
      </div>
      <div className="amk-viewtoggle" role="group" aria-label="View">
        <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Ph name="squares-four" weight="bold" size="16px" /></button>
        <button className={view === "list" ? "on" : ""} onClick={() => setView("list")} aria-label="List view"><Ph name="list-dashes" weight="bold" size="16px" /></button>
      </div>
    </div>
  );
}

function AmkGrid({ apps }) {
  return (
    <div className="amk-grid">
      {apps.map((a) => (
        <div key={a.id} className={`amk-tile ${a.store ? "is-store" : ""} ${a.dim ? "dim" : ""} ${a.ribbon ? "has-ribbon" : ""}`}
             style={a.store ? undefined : { background: a.color }} role="button" tabIndex={0}>
          {a.ribbon && <span className={`amk-ribbon ${a.ribbon}`}>{a.ribbon === "coming" ? "Coming Soon" : a.ribbon === "newly" ? "Newly Launched" : "Free till Aug 26"}</span>}
          <span className="tile-ico" style={a.store ? { color: "var(--theme)" } : undefined}><Ph name={a.icon} weight="fill" /></span>
          <span className="tile-name">{a.name}</span>
          {a.dim && <button className="amk-knowmore">Know More</button>}
        </div>
      ))}
    </div>
  );
}

function AmkList({ apps }) {
  return (
    <div className="amk-list">
      {apps.map((a) => (
        <div key={a.id} className={`amk-listitem ${a.store ? "is-store" : ""}`}
             style={a.store ? undefined : { background: a.color }} role="button" tabIndex={0}>
          <span className="li-ico" style={a.store ? { color: "var(--theme)" } : undefined}><Ph name={a.icon} weight="fill" /></span>
          <span className="li-name">{a.name}</span>
        </div>
      ))}
    </div>
  );
}

function AmkHeader({ user = "R Dixit" }) {
  return (
    <div className="amk-head">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="amk-welcome">Welcome, <span className="uname">{user}</span></h1>
          <div className="amk-billing"><span className="pin"><Ph name="warning" weight="fill" size="14px" /></span> Your payment detail is not updated. To keep using your account, please update your billing information.</div>
        </div>
        <div className="amk-date"><b>Friday</b> <span className="d">May 29, 2026</span></div>
      </div>
    </div>
  );
}

/* Variant 1 — plain app market (no promo, no sidenav) */
function AppMarketPlain() {
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("apps");
  return (
    <div className="amk">
      <AmkHeader user="R Dixit" />
      <AmkToolbar view={view} setView={setView} tab={tab} setTab={setTab} />
      {view === "grid" ? <AmkGrid apps={AMK_APPS} /> : <AmkList apps={AMK_APPS} />}
    </div>
  );
}

/* Variant 2 — with collapsible promo banner */
function AppMarketPromo() {
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("apps");
  const [promoOpen, setPromoOpen] = useState(false);
  return (
    <div className="amk-shell">
      {promoOpen ? (
        <div className="amk-promo-panel">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="amk-promo-toggle" style={{ width: "auto", background: "transparent", padding: 0 }} onClick={() => setPromoOpen(false)} aria-label="Collapse promotions">
              <span style={{ width: 26, height: 26, borderRadius: 6, background: "var(--orange)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Ph name="caret-left" weight="bold" size="14px" />
              </span>
            </button>
          </div>
          {AMK_PROMOS.map((p) => (
            <div key={p.id} className="amk-promo-card" style={{ background: p.color }}>
              <span className={`amk-promo-ribbon ${p.ribbon}`}>{p.ribbonLabel}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="feat">
                {p.feats.map((f) => <span key={f}><Ph name="check-circle" weight="fill" size="14px" /> {f}</span>)}
              </div>
              <button className="km">Know More</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="amk-promo-toggle">
          <button onClick={() => setPromoOpen(true)} aria-label="Expand promotions"><Ph name="caret-right" weight="bold" size="14px" /></button>
        </div>
      )}
      <div className="amk" style={{ flex: 1 }}>
        <AmkHeader user="Andrew" />
        <AmkToolbar view={view} setView={setView} tab={tab} setTab={setTab} />
        {view === "grid" ? <AmkGrid apps={AMK_APPS_FULL} /> : <AmkList apps={AMK_APPS_FULL} />}
      </div>
    </div>
  );
}

function ViewHwAppMarket() {
  return (
    <main className="ds-main">
      <ComponentHead name="App market / landing" selector="<hw-app-landing>" ngModule="HwAppMarketModule"
        summary="The post-login launchpad. Welcome header + billing banner, My Apps / Settings tabs, app search, and a grid ⇄ list view toggle. App tiles are color-coded per product with optional ribbons (Coming Soon / Newly Launched / Free till). A second variant adds a collapsible promotions rail on the left that expands to show promotional product cards." />

      <h2 className="ds-h2">Variant 1 — Apps only (grid + list)</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        No side rail. Toggle the grid/list control (top-right) to switch layouts. App Store tile is white; product tiles use their brand color.
      </p>
      <div style={{ border: "1px solid var(--border-default-color)", borderRadius: 10, overflow: "hidden", marginBottom: 32 }}>
        <AppMarketPlain />
      </div>

      <h2 className="ds-h2">Variant 2 — With promotions rail</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        The promo rail starts collapsed (thin orange tab on the left). Click it to expand the promotional product cards; collapse again with the caret. The app grid includes ribboned "Coming Soon / Newly Launched / Free" tiles with a Know More button.
      </p>
      <div style={{ border: "1px solid var(--border-default-color)", borderRadius: 10, overflow: "hidden" }}>
        <AppMarketPromo />
      </div>

      <h2 className="ds-h2">Tile color tokens</h2>
      <div className="ds-card flush" style={{ overflowX: "auto" }}>
        <table className="proptbl">
          <thead><tr><th>Class</th><th>Color</th><th>Used by</th></tr></thead>
          <tbody>
            <tr><td><code className="ds-inline">plumpos_purple</code></td><td>#ad2d75</td><td>Plum POS</td></tr>
            <tr><td><code className="ds-inline">zipTimeKeeping_blue</code></td><td>#21a8bd</td><td>Zip Timekeeping</td></tr>
            <tr><td><code className="ds-inline">zipschudels_blue / zipclock_blue</code></td><td>#54a2f2</td><td>Schedules, Clock, POS Dashboard</td></tr>
            <tr><td><code className="ds-inline">zipInventory_voilet</code></td><td>#8e88ff</td><td>Zip Inventory</td></tr>
            <tr><td><code className="ds-inline">zipordering_voilet</code></td><td>#6d177c</td><td>Zip Ordering</td></tr>
            <tr><td><code className="ds-inline">zipreporting_orange</code></td><td>#fe7b1b</td><td>Zip Reporting</td></tr>
            <tr><td><code className="ds-inline">zipchecklist_red / zipshiftbook_red</code></td><td>#ed1c24</td><td>Checklist, ShiftBook</td></tr>
            <tr><td><code className="ds-inline">zipHaccp_red</code></td><td>#ff6600</td><td>Zip HACCP</td></tr>
            <tr><td><code className="ds-inline">plumCatering_purple</code></td><td>#801452</td><td>Plum Catering, Digital Signage</td></tr>
          </tbody>
        </table>
      </div>

      <A11yNote items={[
        "Tabs use role='tab' with aria-selected; the grid/list toggle is a role='group' of labeled buttons.",
        "Each app tile is a keyboard-activatable button with the app name as its accessible label.",
        "Ribbon text ('Coming Soon' etc.) is real text, not an image — it's announced by screen readers.",
        "The promo rail toggle has aria-label='Expand/Collapse promotions'; collapsed state keeps it reachable by keyboard.",
        "Dimmed 'coming soon' tiles keep ≥3:1 contrast on their label via the Know More button + ribbon, not color alone.",
      ]} />
    </main>
  );
}

Object.assign(window, { ViewHwAppMarket, AppMarketPlain, AppMarketPromo });
