/* ============================================================================
   AG Design System — view-patterns.jsx
   Page-level composition patterns. All built from the same boilerplate.
   ============================================================================ */

/* =============================== PATTERN — APP SHELL ===================== */
function ViewPatternShell() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="App shell"
        lead="The root layout: HW header on top, fn-menu-sidebar on the left, router outlet in the middle, ag-drawer-host + fn-loader at the bottom of the tree." />

      <Demo code={`<hw-header-main></hw-header-main>
<div class="app-body">
  <fn-menu-sidebar [menu]="nav"></fn-menu-sidebar>
  <div class="page">
    <router-outlet></router-outlet>
  </div>
</div>
<fn-loader></fn-loader>
<ag-drawer-host></ag-drawer-host>`}>
        <ShellMock />
      </Demo>

      <h2 className="ds-h2">Zones</h2>
      <div className="ds-card">
        <ol style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li><b>Top bar</b> — <code className="ds-inline">&lt;hw-header-main&gt;</code> · 52px tall · dark surface · houses brand + site switcher + apps + weather + time-clock + profile.</li>
          <li><b>Sidebar</b> — <code className="ds-inline">&lt;fn-menu-sidebar&gt;</code> · 240px wide · dark surface · grouped sections + badges.</li>
          <li><b>Page</b> — scrollable area · contains the routed page wrapped in <code className="ds-inline">.hw-box-content</code> boilerplate.</li>
          <li><b>Overlay layer</b> — <code className="ds-inline">&lt;ag-drawer-host&gt;</code> + <code className="ds-inline">&lt;fn-loader&gt;</code> rendered once at app root; service-driven.</li>
        </ol>
      </div>
    </main>
  );
}

function ShellMock({ children, title = "Schedules", subtitle = "Riverside Bistro · Week of Mar 11" }) {
  return (
    <div style={{ border: "1px solid var(--border-default-color)", borderRadius: 8, overflow: "hidden" }}>
      <HwHeaderMain />
      <div style={{ display: "grid", gridTemplateColumns: "50px 1fr", minHeight: 360, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, zIndex: 20 }}>
            <FnMenuSidebar mode="auto" active="schedule" onPick={() => {}} items={[
              { id: "dashboard", label: "Dashboard",  icon: "house" },
              { id: "schedule",  label: "Schedule",   icon: "calendar", badge: 3 },
              { id: "team",      label: "Team",       icon: "users-three" },
              { id: "timeclock", label: "Time clock", icon: "clock-counter-clockwise" },
              { id: "labor",     label: "Labor",      icon: "chart-pie-slice" },
              { id: "payroll",   label: "Payroll",    icon: "hand-coins" },
            ]} />
          </div>
        </div>
        <div style={{ background: "var(--body-bg)", padding: 20 }}>
          <div className="hw-box-content">
            <div className="hw-header-wrap">
              <div className="row">
                <div className="lhs flex-1"><i className="fn-global-schedule"></i> {title}</div>
                <div className="rhs">{subtitle}</div>
              </div>
            </div>
            <div className="hw-title">
              <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="download-simple" text="Export" />
              <FnButton type="primary btn-xs btn-round" iconAddonBefore="plus" text="Publish" />
            </div>
            <div className="hw-content" style={{ minHeight: 160 }}>
              {children || <div className="muted" style={{ fontSize: 12 }}>Page body — table, dashboard, form, etc.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================== PATTERN — BOILERPLATE =================== */
function ViewPatternBoilerplate() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Page boilerplate (.hw-box-content)"
        lead="Every routed page wraps its content in this 3-region structure: a header strip (bg-primary-dark) with the page title + leading theme-colored icon, an optional title bar for tabs/filters/actions, and the content body. Do not invent alternative scaffolding." />

      <h2 className="ds-h2">Anatomy</h2>
      <Demo>
        <div className="hw-box-content">
          <div className="hw-header-wrap">
            <div className="row">
              <div className="lhs flex-1"><span className="region-tag">1 HEADER</span><Ph name="house" /> Page main title</div>
              <div className="rhs">Page subtitle / context</div>
            </div>
          </div>
          <div className="hw-title">
            <span className="region-tag sec" style={{ alignSelf: "center" }}>2 TITLE BAR</span>
            <FnButton type="outline-secondary btn-xs btn-round" text="Cancel" />
            <FnButton type="primary btn-xs btn-round" text="Save" />
          </div>
          <div className="hw-content" style={{ minHeight: 120 }}>
            <span className="region-tag bdy">3 BODY</span>
            <span className="muted" style={{ fontSize: 12 }}>Table, form, dashboard grid, detail card, or empty state.</span>
          </div>
        </div>
      </Demo>

      <h2 className="ds-h2">Example — title + filters + empty state</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Header carries the page title (icon + "Menu Item Pricing"); the title bar holds a subtitle line + filter controls; the body shows the no-data illustration when empty.
      </p>
      <Demo>
        <div className="hw-box-content">
          <div className="hw-header-wrap">
            <div className="row">
              <div className="lhs flex-1"><Ph name="book-open" /> Menu Item Pricing</div>
            </div>
          </div>
          <div className="hw-content">
            <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Manage items details and pricing here.</div>
            <div className="ds-row" style={{ alignItems: "flex-end", gap: 20, marginBottom: 8 }}>
              <FormGroup id="bp-grp" label="Select Menu Group">
                <FnSelect items={[{ id: 1, name: "Beverages" }, { id: 2, name: "Entrées" }]} value={null} onChange={() => {}} placeholder="Select Group" />
              </FormGroup>
              <FormGroup id="bp-store" label="Select Store">
                <FnSelect items={[{ id: 1, name: "Riverside Bistro" }]} value={null} onChange={() => {}} placeholder="Select store" />
              </FormGroup>
              <div style={{ flex: 1 }} />
              <FnButton type="outline-secondary btn-round" iconAddonAfter="funnel" text="Filter" />
            </div>
            <div style={{ background: "var(--body-bg)", borderRadius: "var(--radius-md)", padding: "40px 0" }}>
              <FnNoData headerTitle="No Data to Display" showImg imgContainerheight={220} />
            </div>
          </div>
        </div>
      </Demo>

      <h2 className="ds-h2">Example — tabbed header + actions</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        The header hosts pill <code className="ds-inline">.tab-nav</code> tabs on the left and action buttons on the right; the body shows the inline red no-data bar.
      </p>
      <Demo>
        <div className="hw-box-content">
          <div className="hw-header-wrap">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <ul className="tab-nav">
                <li><button className="tab-link active"><Ph name="users-three" weight="fill" size="15px" /> Employees</button></li>
                <li><button className="tab-link"><Ph name="user-minus" size="15px" /> Terminated Employees</button></li>
                <li><button className="tab-link"><Ph name="clipboard-text" size="15px" /> Audit Trail</button></li>
              </ul>
              <div className="ds-row" style={{ gap: 8 }}>
                <FnButton type="success btn-sm btn-round" text="Push Changes" disabled />
                <FnButton type="primary btn-sm btn-round" iconAddonBefore="plus" text="Add" />
                <FnButton type="outline-secondary btn-sm btn-round" iconAddonAfter="caret-down" text="" ariaLabel="More actions" />
              </div>
            </div>
          </div>
          <div className="hw-content">
            <div className="hw-nodata-bar">No_Data_to_display</div>
          </div>
        </div>
      </Demo>

      <h2 className="ds-h2">Template</h2>
      <Demo code={`<div class="hw-box-content">
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
</div>`}></Demo>

      <h2 className="ds-h2">Region contract</h2>
      <PropTable rows={[
        { name: "1 Header (.hw-header-wrap)", type: "—",  desc: "bg-primary-dark strip, min-height 37px. Page title (left, with leading theme-colored icon). Can also host tab-nav pills + right-aligned actions." },
        { name: "2 Title bar (.hw-title)",     type: "—", desc: "bg-primary. Subtitle line, filter controls, or a second action row. Rounds the top when it's the first child." },
        { name: "3 Content (.hw-content)",     type: "—", desc: "bg-primary body, 12px padding, rounds the bottom corners. Holds the table / form / dashboard / empty state." },
      ]} />

      <A11yNote items={[
        "Header title uses a heading element so the page has a clear h1/h2 landmark.",
        "tab-nav uses role='tablist' + role='tab'; the active tab has aria-selected='true' (not just the theme fill).",
        "Disabled actions (e.g. Push Changes) keep their label + tooltip so context isn't lost.",
        "The leading icon is decorative (aria-hidden) — the title text carries meaning.",
      ]} />
    </main>
  );
}

/* =============================== PATTERN — DASHBOARD ===================== */
function ViewPatternDashboard() {
  const tiles = [
    { label: "Open shifts",      value: "23",     delta: "−4", dir: "down", chart: "spark1", color: "var(--orange)" },
    { label: "On the clock now", value: "47",     delta: "+6", dir: "up",   chart: "spark2", color: "var(--green)" },
    { label: "Hours scheduled",  value: "1,284",  delta: "+12", dir: "up",  chart: "spark3", color: "var(--blue)" },
    { label: "Labor cost",       value: "$18.4k", delta: "−2.1%", dir: "down", chart: "spark4", color: "var(--cyan)" },
  ];
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Dashboard"
        lead="Card-grid dashboard built on the boilerplate. Use the dashboard tokens (--dashboard-header-wrap, --dashboard-body-wrap, --dashboard-wrap-border) for tile chrome." />

      <Demo>
        <div className="hw-box-content">
          <div className="hw-header-wrap">
            <div className="row">
              <div className="lhs flex-1"><i className="fn-global-schedule"></i> Manager dashboard</div>
              <div className="rhs">Riverside Bistro · this week</div>
            </div>
          </div>
          <div className="hw-title split">
            <div className="btn-group btn-group-round">
              <button className="btn btn-outline-primary btn-xs" style={{ background: "var(--blue)", color: "#fff" }}>Day</button>
              <button className="btn btn-outline-primary btn-xs">Week</button>
              <button className="btn btn-outline-primary btn-xs">Month</button>
            </div>
            <div className="ds-row">
              <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="calendar" text="Mar 11 – Mar 18, 2026" />
              <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="download-simple" text="Export PDF" />
            </div>
          </div>
          <div className="hw-content">
            <div className="ds-grid ds-cols-4" style={{ marginBottom: 16 }}>
              {tiles.map((t) => (
                <div key={t.label} className="tile">
                  <header>{t.label}<Ph name="dots-three" size="14px" /></header>
                  <div className="value">{t.value}</div>
                  <div className="ds-row" style={{ justifyContent: "space-between" }}>
                    <span className={`delta ${t.dir}`}><Ph name={t.dir === "up" ? "trend-up" : "trend-down"} size="12px" /> {t.delta} vs last week</span>
                    <div className="spark" aria-hidden="true">{[4,6,8,5,9,7,11].map((h, i) => <span key={i} style={{ height: h * 2, background: t.color }} />)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ds-grid ds-cols-2">
              <div className="tile" style={{ padding: 18 }}>
                <header>Coverage by role · this week</header>
                <svg viewBox="0 0 380 160" style={{ width: "100%", height: 160 }}>
                  {[
                    ["Server",    [82,90,85,78,95,98,92], "var(--blue)"],
                    ["Bartender", [60,62,58,55,72,80,68], "var(--orange)"],
                    ["Cook",      [70,72,68,65,80,86,76], "var(--green)"],
                  ].map(([name, data, color], si) => (
                    <Fragment key={name}>
                      <polyline fill="none" stroke={color} strokeWidth="2"
                                points={data.map((v, i) => `${30 + i * 50},${140 - v}`).join(" ")} />
                      {data.map((v, i) => <circle key={i} cx={30 + i * 50} cy={140 - v} r="3" fill={color} />)}
                      <text x="320" y={20 + si * 18} fontSize="11" fill={color}>● <tspan fill="var(--body-textColor)">{name}</tspan></text>
                    </Fragment>
                  ))}
                  {["M","T","W","T","F","S","S"].map((d, i) => <text key={i} x={30 + i * 50} y={154} fontSize="10" fill="var(--iron)">{d}</text>)}
                </svg>
              </div>
              <div className="tile" style={{ padding: 0 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-default-color)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--iron)", textTransform: "uppercase", letterSpacing: ".06em" }}>Late or no-show · last 7 days</span>
                  <a style={{ fontSize: 11, color: "var(--blue)", cursor: "pointer" }}>View all</a>
                </div>
                {[
                  { who: "Diego Park",  when: "Tue 9:14am",  delay: "28min late",       severity: "danger" },
                  { who: "Marco Silva", when: "Wed 5:08pm",  delay: "No-show — replaced", severity: "danger" },
                  { who: "Priya Nair",  when: "Fri 4:18pm",  delay: "18min late",       severity: "warning" },
                  { who: "Ipshita G.",  when: "Sat 11:09am", delay: "9min late",        severity: "warning" },
                ].map((r) => (
                  <div key={r.who + r.when} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-default-color)", display: "flex", gap: 10, alignItems: "center" }}>
                    <FnAvatar name={r.who} size="sm" />
                    <div className="flex-1">
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.who}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{r.when}</div>
                    </div>
                    <FnTag color={r.severity}>{r.delay}</FnTag>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Demo>
    </main>
  );
}

/* =============================== PATTERN — LIST ========================== */
function ViewPatternList() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="List page"
        lead="The most common page shape: boilerplate + fn-table. Filters go in the title-bar (left), actions on the right." />
      <Demo>
        <ShellMock title="Employees" subtitle="Riverside Bistro · 142 active">
          <div className="ds-row" style={{ marginBottom: 12 }}>
            <FnInput prefix={<Ph name="magnifying-glass" />} placeholder="Search employees" style={{ width: 240 }} />
            <FnButton type="outline-secondary btn-xs" iconAddonBefore="funnel" text="Role" />
            <FnButton type="outline-secondary btn-xs" iconAddonBefore="funnel" text="Status" />
            <FnButton type="outline-secondary btn-xs" iconAddonBefore="calendar" text="Hired in" />
            <div style={{ flex: 1 }} />
            <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="download-simple" text="Export" />
            <FnButton type="primary btn-xs btn-round" iconAddonBefore="plus" text="Add employee" />
          </div>
          <table className="tbl">
            <thead><tr><th>Employee</th><th>Role</th><th>Status</th><th className="num">Hours · wk</th></tr></thead>
            <tbody>
              {[
                ["Sana Ahmed",   "Manager",   "Active",   "42h"],
                ["Rahul Yadav",  "Bartender", "Active",   "38h"],
                ["Marco Silva",  "Line cook", "Active",   "32h"],
                ["Priya Nair",   "Server",    "Pending",  "—"],
              ].map(([n, r, s, h]) => (
                <tr key={n}>
                  <td><div className="ds-row" style={{ gap: 8 }}><FnAvatar name={n} size="sm" /><span style={{ fontWeight: 500 }}>{n}</span></div></td>
                  <td>{r}</td>
                  <td><FnTag color={s === "Active" ? "success" : "warning"}>{s}</FnTag></td>
                  <td className="num">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ShellMock>
      </Demo>
    </main>
  );
}

/* =============================== PATTERN — FORM ========================== */
function ViewPatternForm() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Form page"
        lead="Reactive form inside the boilerplate. Cancel/Save sit in a trailing .hw-title that mirrors the top action row." />
      <Demo code={`<form [formGroup]="form" (ngSubmit)="save()" novalidate>
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
</form>`}>
        <ShellMock title="Add employee" subtitle="Step 1 of 2 — Basic info">
          <div className="ds-grid ds-cols-2">
            <FormGroup id="f-name" label="Full name" required><FnInput placeholder="e.g. Priya Nair" /></FormGroup>
            <FormGroup id="f-mail" label="Work email" required><FnInput type="email" placeholder="priya@restaurant.com" /></FormGroup>
            <FormGroup id="f-role" label="Primary role" required><FnSelect items={[{id:1,name:"Server"},{id:2,name:"Bartender"},{id:3,name:"Line cook"}]} value={1} onChange={() => {}} /></FormGroup>
            <FormGroup id="f-site" label="Home site" required><FnSelect items={[{id:1,name:"Riverside Bistro"},{id:2,name:"Downtown Grill"}]} value={1} onChange={() => {}} /></FormGroup>
            <FormGroup id="f-start" label="Start date" required><FnInput value="Mar 18, 2026" readOnly suffix={<Ph name="calendar" size="13px" />} /></FormGroup>
            <FormGroup id="f-pay" label="Hourly rate" required><FnInput defaultValue="18.50" prefix="$" suffix="USD" /></FormGroup>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormGroup id="f-notes" label="Notes" help="Visible to managers only.">
                <FnTextarea rows={3} placeholder="Anything HR should know…" />
              </FormGroup>
            </div>
          </div>
        </ShellMock>
      </Demo>
    </main>
  );
}

/* =============================== PATTERN — DETAIL ======================== */
function ViewPatternDetail() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const t = useToast();
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Detail + drawer"
        lead="Open edit views in a right-side drawer instead of routing — the URL stays at the list. Confirm destructive actions with FnCnfModalService and feed back with FnToasterService." />
      <Demo>
        <ShellMock title="Shift detail" subtitle="SHIFT-2027">
          <div className="ds-grid ds-cols-2">
            <div>
              <div className="ds-eyebrow">Shift</div>
              <div className="ds-h1" style={{ marginTop: 4, marginBottom: 8 }}>Fri, Mar 18 · 5:00 – 11:00 pm</div>
              <p className="muted" style={{ fontSize: 13 }}>Assigned to <b>Marco Silva</b> — Line cook · Riverside Bistro</p>
              <div className="divider" />
              <div className="ds-stack" style={{ gap: 10 }}>
                <DetailRow icon="user" label="Employee" value={<FnAvatar name="Marco Silva" size="sm" />} valueExtra="Marco Silva · Line cook" />
                <DetailRow icon="clock" label="Hours" value="6h 00m" />
                <DetailRow icon="hand-coins" label="Estimated pay" value="$132.00" />
                <DetailRow icon="map-pin" label="Site" value="Riverside Bistro · station 2" />
                <DetailRow icon="note-pencil" label="Notes" value="Run brunch prep starting at 4:30. Two events on the books." />
              </div>
            </div>
            <div>
              <div className="ds-eyebrow">Activity</div>
              <div className="ds-stack" style={{ gap: 0, marginTop: 8 }}>
                {[
                  { who: "Sana Ahmed", when: "2h ago",    what: "assigned the shift to Marco" },
                  { who: "Marco Silva", when: "1h ago",   what: "accepted the shift" },
                  { who: "Sana Ahmed", when: "12min ago", what: "added a note" },
                ].map((e, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--border-default-color)", display: "flex", gap: 10, fontSize: 12.5 }}>
                    <FnAvatar name={e.who} size="sm" />
                    <div className="flex-1"><b>{e.who}</b> <span>{e.what}</span><div className="muted" style={{ fontSize: 11 }}>{e.when}</div></div>
                  </div>
                ))}
              </div>
              <div className="ds-row" style={{ marginTop: 16 }}>
                <FnButton type="outline-primary btn-sm" iconAddonBefore="pencil-simple" text="Edit shift" onClick={() => setDrawerOpen(true)} />
                <FnButton type="outline-danger btn-sm"  iconAddonBefore="trash" text="Delete" onClick={() => setConfirmOpen(true)} />
              </div>
            </div>
          </div>
        </ShellMock>
      </Demo>

      <FnDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Edit shift · SHIFT-2027"
                footer={<>
                  <FnButton type="outline-secondary btn-sm" text="Cancel" onClick={() => setDrawerOpen(false)} />
                  <FnButton type="primary btn-sm" text="Save changes"
                            onClick={() => { setDrawerOpen(false); t.success("Shift updated"); }} />
                </>}>
        <div className="ds-stack">
          <FormGroup id="d-emp" label="Employee" required>
            <FnSelect items={[{id:"marco", name:"Marco Silva"},{id:"priya", name:"Priya Nair"}]} value="marco" onChange={() => {}} />
          </FormGroup>
          <FormGroup id="d-start" label="Start"><FnInput defaultValue="5:00 PM" /></FormGroup>
          <FormGroup id="d-end"   label="End"><FnInput defaultValue="11:00 PM" /></FormGroup>
          <FormGroup id="d-notes" label="Notes"><FnTextarea rows={3} defaultValue="Run brunch prep starting at 4:30. Two events on the books." /></FormGroup>
        </div>
      </FnDrawer>

      <FnDialog open={confirmOpen} type="danger" title="Delete shift SHIFT-2027?"
                content="The shift will be removed and Marco will be unassigned. This can't be undone."
                confirmText="Delete shift"
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => { setConfirmOpen(false); t.success("Shift deleted"); }} />
    </main>
  );
}
function DetailRow({ icon, label, value, valueExtra }) {
  return (
    <div className="ds-row" style={{ gap: 12, padding: "8px 0" }}>
      <Ph name={icon} size="16px" style={{ color: "var(--iron)" }} />
      <span className="muted" style={{ fontSize: 12, width: 110 }}>{label}</span>
      <span style={{ fontSize: 13 }}>{value}{valueExtra && <span style={{ marginLeft: 8 }}>{valueExtra}</span>}</span>
    </div>
  );
}

/* =============================== PATTERN — AUTH ========================== */
function ViewPatternAuth() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Auth"
        lead="Split-pane auth shell — brand panel on the left, form on the right. Uses hw-header-unauth at the top." />
      <Demo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-default-color)", minHeight: 480, background: "var(--bg-primary)" }}>
          <div style={{ background: "var(--side-nav-bg)", padding: 40, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 9, background: "linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>AG</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>HubWorks</div>
              </div>
              <h2 style={{ marginTop: 36, fontWeight: 600, letterSpacing: "-.02em", fontSize: 28, lineHeight: 1.2 }}>Built for restaurant operators who'd rather be on the floor.</h2>
              <p style={{ opacity: .8, fontSize: 13, marginTop: 12, maxWidth: 360 }}>HubWorks turns schedule conflicts, no-shows, and labor cost into a single screen — so you can run the place, not the spreadsheet.</p>
            </div>
            <div className="ds-row" style={{ gap: 24, fontSize: 12, opacity: .7 }}>
              <span>© Altametrics</span>
              <span>SOC 2 Type II</span>
              <span>WCAG 2.1 AA</span>
            </div>
          </div>
          <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
              <h2 className="ds-h1" style={{ fontSize: 22 }}>Welcome back</h2>
              <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Sign in to continue to Riverside Bistro.</p>
              <FormGroup id="lg-mail" label="Email" required><FnInput type="email" placeholder="you@restaurant.com" /></FormGroup>
              <FormGroup id="lg-pwd"  label="Password" required><FnInput type="password" placeholder="••••••••" /></FormGroup>
              <div className="ds-row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
                <FnCheckbox checked={true} onChange={() => {}} label="Remember me" />
                <a style={{ fontSize: 12, color: "var(--blue)" }}>Forgot password?</a>
              </div>
              <FnButton type="primary" text="Sign in" style={{ width: "100%" }} />
              <div style={{ textAlign: "center", margin: "20px 0 12px", fontSize: 11, color: "var(--iron)", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, right: 0, top: 7, height: 1, background: "var(--border-default-color)" }} />
                <span style={{ position: "relative", background: "var(--bg-primary)", padding: "0 10px" }}>or</span>
              </div>
              <FnButton type="outline-secondary" text="Continue with SSO" iconAddonBefore="shield-check" style={{ width: "100%" }} />
              <p style={{ fontSize: 12, marginTop: 16, textAlign: "center", color: "var(--iron)" }}>
                Don't have an account? <a style={{ color: "var(--blue)" }}>Request access</a>
              </p>
            </div>
          </div>
        </div>
      </Demo>
    </main>
  );
}

/* =============================== PATTERN — SETTINGS ====================== */
function ViewPatternSettings() {
  const [tab, setTab] = useState("general");
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Settings"
        lead="Vertical tabs on the left, content on the right. Save bar pinned to the bottom of the content region." />
      <Demo>
        <ShellMock title="Site settings" subtitle="Riverside Bistro">
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
            <FnTabs vertical active={tab} onChange={setTab} tabs={[
              { id: "general",  label: "General", icon: "gear" },
              { id: "team",     label: "Team & roles", icon: "users-three" },
              { id: "schedule", label: "Scheduling rules", icon: "calendar" },
              { id: "clock",    label: "Time clock", icon: "clock" },
              { id: "billing",  label: "Billing", icon: "credit-card" },
              { id: "danger",   label: "Danger zone", icon: "warning-octagon" },
            ]} />
            <div className="ds-stack">
              <div>
                <h3 className="ds-h3" style={{ marginTop: 0 }}>General</h3>
                <p className="muted" style={{ fontSize: 13 }}>Site-level basics. Changes apply to everyone at this site.</p>
              </div>
              <FormGroup id="s-name"  label="Site name" required><FnInput defaultValue="Riverside Bistro" /></FormGroup>
              <FormGroup id="s-tz"    label="Timezone"><FnSelect items={[{id:"PT", name:"America/Los_Angeles (PT)"},{id:"ET", name:"America/New_York (ET)"}]} value="PT" onChange={() => {}} /></FormGroup>
              <FormGroup id="s-start" label="Workweek starts on">
                <FnRadioGroup name="ws" value="mon" onChange={() => {}} options={[{id:"sun",label:"Sunday"},{id:"mon",label:"Monday"}]} />
              </FormGroup>
              <div className="divider" />
              <SwitchRow label="Allow shift swaps"     desc="Employees can request swaps with peers; manager must approve" defaultOn />
              <SwitchRow label="Late-clock-in alerts"  desc="Manager pages on first late clock-in over 15min"             defaultOn />
              <SwitchRow label="Auto-publish weekly"   desc="Publish next week's schedule every Sunday at 8pm"            />
            </div>
          </div>
        </ShellMock>
      </Demo>
    </main>
  );
}

/* =============================== PATTERN — EMPTY ========================= */
function ViewPatternEmpty() {
  return (
    <main className="ds-main">
      <SectionHead eyebrow="Pattern" title="Empty & loading states"
        lead="Empty states pair an explainer with a primary action that resolves the empty condition. Loading states use skeletons that mirror the eventual layout — never spinners over blank space." />

      <h2 className="ds-h2">First-run empty</h2>
      <Demo>
        <ShellMock title="Schedules" subtitle="No published schedules yet">
          <FnNoData icon="calendar-blank" title="No schedules yet" description="Build your first week — drag shifts onto employees, or import from last week."
                    addLabel="Build schedule" onAdd={() => {}} />
        </ShellMock>
      </Demo>

      <h2 className="ds-h2">Zero results (after filter)</h2>
      <Demo>
        <ShellMock title="Employees" subtitle="0 of 142 match">
          <FnNoData icon="magnifying-glass" title="No employees match these filters" description="Try clearing role or status — or check spelling on the search." />
        </ShellMock>
      </Demo>

      <h2 className="ds-h2">Loading skeleton</h2>
      <Demo>
        <ShellMock title="Schedules" subtitle="Loading…">
          <div className="ds-grid ds-cols-4" style={{ marginBottom: 16 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} className="tile">
                <FnSkeleton width="60%" height={11} />
                <FnSkeleton width="40%" height={24} />
                <FnSkeleton width="100%" height={28} />
              </div>
            ))}
          </div>
          <div className="ds-card flush">
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-default-color)" }}>
              <FnSkeleton width="40%" height={14} />
            </div>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-default-color)", display: "flex", gap: 12 }}>
                <FnSkeleton shape="circle" width={26} height={26} />
                <FnSkeleton width={120} height={12} />
                <FnSkeleton width={80} height={12} />
                <FnSkeleton width={60} height={12} />
              </div>
            ))}
          </div>
        </ShellMock>
      </Demo>

      <h2 className="ds-h2">Permission denied</h2>
      <Demo>
        <ShellMock title="Payroll" subtitle="Access restricted">
          <FnNoData icon="shield-warning" title="You don't have permission to view this" description="Ask your admin to grant the Payroll role from Settings → Roles & permissions." />
        </ShellMock>
      </Demo>
    </main>
  );
}

/* ============================================================================
   Export
   ============================================================================ */
Object.assign(window, {
  ViewPatternShell, ViewPatternBoilerplate, ViewPatternDashboard,
  ViewPatternList, ViewPatternForm, ViewPatternDetail,
  ViewPatternAuth, ViewPatternSettings, ViewPatternEmpty,
});
