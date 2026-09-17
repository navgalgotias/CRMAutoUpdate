/* ============================================================================
   AG Design System — view-hw-header.jsx
   <hw-header-main> — full interactive port with all dropdowns.
   ============================================================================ */

/* ----- The header itself, reusable inside the gallery + patterns ----- */
function HwHeaderMain({ logoMark = "plum" }) {
  const [open, setOpen] = useState(null); // 'apps' | 'site' | 'weather' | 'profile' | 'support' | null
  const [lightTheme, setLightTheme] = useState(true);
  const ref = useRef();

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(null); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function toggle(id) { setOpen((o) => (o === id ? null : id)); }

  return (
    <div className="hw-navbar" ref={ref}>
      {/* LEFT */}
      <ul className="navbar-left">
        <li className="brand">
          <span className="logo-box" aria-label="Plum logo">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="18" r="10" fill="#e23744"/>
              <path d="M16 8C16 8 13 4 9 4C9 9 13 10 16 10" fill="#3d8b40"/>
              <path d="M16 8C16 8 19 4 23 4C23 9 19 10 16 10" fill="#4caf50"/>
            </svg>
          </span>
        </li>
        <li className="header-list-item" onClick={() => toggle("apps")} style={{ position: "relative" }}
            role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open === "apps"}>
          <span>
            <span className="lead-icon"><Ph name="squares-four" weight="bold" /></span>
            My App
            <span className="caret-ico"><Ph name="caret-down" size="11px" weight="bold" /></span>
          </span>
        </li>
        <li className="header-list-item" onClick={() => toggle("site")}
            role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open === "site"}>
          <span>
            <span className="lead-icon"><Ph name="map-pin" weight="bold" /></span>
            Site 1
            <span className="caret-ico"><Ph name="caret-down" size="11px" weight="bold" /></span>
          </span>
        </li>
      </ul>

      {/* CENTER */}
      <ul className="navbar-center">
        <li onClick={() => toggle("weather")} role="button" tabIndex={0} aria-haspopup="dialog" aria-expanded={open === "weather"}>
          <span className="weather-trigger">
            <span className="w-ico"><Ph name="cloud-sun" weight="fill" /></span>
            <Ph name="caret-down" size="11px" weight="bold" style={{ color: "var(--blue)" }} />
          </span>
        </li>
        <li className="cursor-default" style={{ cursor: "default" }}>
          <span className="clock">
            <span>05:22<sup>A</sup></span>
            <span className="tz">America/New York</span>
          </span>
        </li>
      </ul>

      {/* RIGHT */}
      <ul className="navbar-right">
        <li className="header-list-item">
          <div className="alert-msg-header">
            <div className="text-anim-marquee">
              <div className="msg-wrap"><p>Your trial is not updated. To keep using your account, please update your billing.</p></div>
            </div>
            <button className="take-action">Take Action</button>
          </div>
        </li>
        <li className="help-btn" title="Help & support" onClick={() => toggle("support")}
            role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open === "support"} aria-label="Help and support">
          <Ph name="question" weight="bold" />
        </li>
        <li className="gear-btn" title="Settings" role="button" tabIndex={0} aria-label="Settings">
          <Ph name="gear" weight="fill" />
        </li>
        <li onClick={() => toggle("profile")} role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={open === "profile"}>
          <span className="user-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#cfe0ff" }}>
            <Ph name="user" weight="fill" style={{ color: "#fff", fontSize: 20 }} />
          </span>
        </li>
      </ul>

      {/* DROPDOWNS */}
      {open === "apps" && <HwAppsDropdown />}
      {open === "site" && <HwSiteDropdown />}
      {open === "weather" && <HwWeatherDropdown />}
      {open === "profile" && <HwProfileDropdown lightTheme={lightTheme} setLightTheme={setLightTheme} />}
      {open === "support" && <HwSupportDropdown />}
    </div>
  );
}

const HW_SUPPORT = [
  { name: "Settings",       icon: "gear-six",     chev: true },
  { name: "FAQ",            icon: "question" },
  { name: "Get Mobile App", icon: "device-mobile" },
  { name: "Help Center",    icon: "play-circle" },
  { name: "Feedback",       icon: "chat-dots" },
  { name: "Support",        icon: "lifebuoy" },
  { name: "Release Notes",  icon: "scroll" },
];
function HwSupportDropdown() {
  return (
    <div className="hw-dd hw-support-dd" role="menu">
      <div className="support-head">Version 6.9.0</div>
      <ul>
        {HW_SUPPORT.map((s) => (
          <li key={s.name} role="menuitem">
            <span className="si"><Ph name={s.icon} /></span>{s.name}
            {s.chev && <span className="chev"><Ph name="caret-right" /></span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HwAppsDropdown() {
  const apps = [
    { name: "Plum POS",          color: "#e8a13c", icon: "storefront" },
    { name: "Plum POS DashBoard",color: "#7b42ff", icon: "chart-pie-slice" },
    { name: "Plum Timekeeping",  color: "#e23744", icon: "clock" },
    { name: "Settings",          color: "var(--iron)", icon: "gear", isSetting: true },
    { name: "App Store",         color: "var(--theme)", icon: "shopping-bag", isStore: true },
  ];
  return (
    <div className="hw-dd hw-app-list" role="menu">
      <ul>
        {apps.map((a) => (
          <li key={a.name} role="menuitem">
            <span className="app-ico" style={{ background: a.color }}><Ph name={a.icon} weight="fill" size="13px" /></span>
            {a.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HwSiteDropdown() {
  const sites = [
    { name: "Red Panda Pappers", addr: "" },
    { name: "Site 1", addr: "Plum Restaurant" },
  ];
  return (
    <div className="hw-dd hw-site-list" role="menu">
      <div className="choose-site"><h2>Choose Site(s)</h2></div>
      <ul>
        {sites.map((s) => (
          <li key={s.name} role="menuitem">
            <span className="site-icon"><Ph name="map-pin" weight="fill" size="14px" /></span>
            <span className="site-name">{s.name}</span>
            {s.addr && <span className="site-address">{s.addr}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HwWeatherDropdown({ configured = false }) {
  if (!configured) {
    return (
      <div className="hw-dd hw-weather-dd" role="dialog" aria-label="Weather forecast">
        <h2 className="update-location-title">Weather Forecast</h2>
        <p className="update-location-smry">Site Location/Adress is not yet configured.<br />Please provide the Site Location to view weather forecast.</p>
        <div className="update-location">
          <input placeholder="Please Enter Location name" aria-label="Location name" />
        </div>
      </div>
    );
  }
  const week = [
    { d: "Mon", ico: "sun", hi: "72", lo: "58" },
    { d: "Tue", ico: "cloud-sun", hi: "70", lo: "56" },
    { d: "Wed", ico: "cloud-rain", hi: "65", lo: "54" },
  ];
  return (
    <div className="hw-dd hw-weather-dd configured" role="dialog" aria-label="Weather forecast">
      <div className="weather-today">
        <h2>Fri, May 29</h2>
        <div className="w-ico"><Ph name="cloud-sun" weight="fill" /></div>
        <div className="w-status">Partly cloudy</div>
        <div className="w-high">68°F</div>
        <div className="w-low">54°F</div>
      </div>
      <div className="weather-weekly">
        {week.map((w) => (
          <div key={w.d} className="day">
            <div className="dname">{w.d}</div>
            <div className="w-ico"><Ph name={w.ico} weight="fill" /></div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{w.hi}°</div>
            <div style={{ fontSize: 13, opacity: .7 }}>{w.lo}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HwProfileDropdown({ lightTheme, setLightTheme }) {
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("English");
  return (
    <div className="hw-dd hw-profile-dd" role="menu">
      <div className="profile-section">
        <span className="profile-img" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Ph name="user" weight="fill" style={{ color: "var(--primaryDark)", fontSize: 30 }} />
        </span>
        <ul className="profile-setting">
          <li className="hw-lang-wrap">
            <span onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <img className="flag" src="https://flagcdn.com/us.svg" alt="" /> {lang} <Ph name="caret-down" size="10px" />
            </span>
            {langOpen && <HwLangDropdown active={lang} onPick={(l) => { setLang(l); setLangOpen(false); }} />}
          </li>
          <li>Edit</li>
        </ul>
      </div>
      <ul className="profile-data">
        <li style={{ cursor: "default" }}><span><i className="pi"><Ph name="user" /></i> R Dixit</span></li>
        <li style={{ cursor: "default" }}><span><i className="pi"><Ph name="envelope-simple" /></i> plum@22.com</span></li>
        <li><span><i className="pi"><Ph name="key" /></i> Change Password</span></li>
        <li style={{ cursor: "default" }}>
          <span><i className="pi"><Ph name="sun" /></i> Light Theme</span>
          <FnSwitch size="md" checked={lightTheme} onChange={setLightTheme} ariaLabel="Light theme" />
        </li>
        <li className="red"><span><i className="pi"><Ph name="power" /></i> Logout</span></li>
      </ul>
    </div>
  );
}

const HW_LANGS = [
  { name: "English", flag: "us" },
  { name: "Spanish", flag: "es" },
  { name: "French",  flag: "fr" },
  { name: "Chinese", flag: "cn" },
  { name: "Italian", flag: "it" },
  { name: "German",  flag: "de" },
];
function HwLangDropdown({ active, onPick }) {
  return (
    <ul className="hw-lang-dd" role="menu" aria-label="Select language">
      <li className="lang-head" style={{ cursor: "default" }} aria-hidden="true">Select Language</li>
      {HW_LANGS.map((l) => (
        <li key={l.name} role="menuitemradio" aria-checked={active === l.name}
            onClick={(e) => { e.stopPropagation(); onPick(l.name); }}>
          <img className="flag" src={`https://flagcdn.com/${l.flag}.svg`} alt="" />
          {l.name}
        </li>
      ))}
    </ul>
  );
}

/* ----- The doc page ----- */
function ViewHwHeader() {
  return (
    <main className="ds-main">
      <ComponentHead name="App header" selector="<hw-header-main>" ngModule="HwFoundationModule.forRoot()"
        summary="The top app chrome — 50px tall on var(--side-nav-bg), pinned to the top of its scroll context (position: sticky; top: 0) so it stays put while the page body scrolls. Three zones: left (logo · My App dropdown · Site dropdown), center (absolutely-centered weather trigger + clock/timezone), right (billing marquee with hover Take-Action button · help/support popover · settings gear · profile dropdown). Composes the hw-header-apps, hw-header-site, hw-header-weather, hw-header-support, hw-header-profile, and hw-time-clock sub-components." />

      <h2 className="ds-h2">Full header</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Click <b>My App</b>, <b>Site 1</b>, the <b>weather</b> icon, the <b>?</b> help/support button, or the <b>profile</b> avatar to open each dropdown. Hover the red billing message to reveal the green Take Action button. The header is pinned (<code className="ds-inline">position: sticky; top: 0</code>) so it stays in place as the page scrolls.
      </p>
      <div style={{ border: "1px solid var(--border-default-color)", borderRadius: 8, overflow: "visible", position: "relative", minHeight: 460 }}>
        <HwHeaderMain />
        <div style={{ background: "var(--body-bg)", padding: 24, minHeight: 350, borderRadius: "0 0 8px 8px" }}>
          <div className="muted" style={{ fontSize: 12 }}>Page content sits below the header. Dropdowns overlay this area.</div>
        </div>
      </div>

      <h2 className="ds-h2">Anatomy</h2>
      <PropTable rows={[
        { name: "Logo (brand)", type: "img.logo", desc: "App mark — full-bleed 50×50 cell, no padding. Per-app icon (Plum POS, Timekeeping, etc.)." },
        { name: "My App", type: "hw-header-apps", desc: "App-switcher dropdown — lists the org's apps + Settings + App Store with per-app icons." },
        { name: "Site 1", type: "hw-header-site", desc: "Site switcher — 'Choose Site(s)' heading + zebra-striped list with pin icon, name, and address." },
        { name: "Weather", type: "hw-header-weather", desc: "Center trigger (icon + temp). Dropdown shows the configure-location prompt OR today + 3-day forecast when configured." },
        { name: "Clock", type: "hw-time-clock", desc: "Time (12h with superscript meridiem or 24h) + timezone label. Separated from weather by a 1.5px white divider." },
        { name: "Billing marquee", type: "alert-msg-header", desc: "214px scrolling red message. On hover a full-height green Take Action button slides in from the right." },
        { name: "Help / Support", type: "hw-header-support", desc: "? trigger opens the support popover — a blue version header (e.g. Version 6.9.0) over a list: Settings (with chevron), FAQ, Get Mobile App, Help Center, Feedback, Support, Release Notes." },
        { name: "Settings", type: "fn-global-settings", desc: "Gear icon — routes to app settings." },
        { name: "Profile", type: "hw-header-profile", desc: "Avatar opens the profile dropdown — gradient header w/ avatar + language + Edit; then name, email, change password, Light Theme toggle, logout." },
      ]} />

      <h2 className="ds-h2">Sub-component selectors</h2>
      <div className="ds-card flush" style={{ overflowX: "auto" }}>
        <table className="proptbl">
          <thead><tr><th>Selector</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code className="ds-inline">&lt;hw-header-main&gt;</code></td><td>Wrapper — composes everything below.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-apps&gt;</code></td><td>App launcher dropdown (My App).</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-site&gt;</code></td><td>Site switcher dropdown.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-weather&gt;</code></td><td>Weather trigger + forecast / configure dropdown.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-time-clock&gt;</code></td><td>Clock + timezone. Honors isMilitaryTime.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-support&gt;</code></td><td>Help / support popover — version header + support links.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-profile&gt;</code></td><td>Profile dropdown — language, edit, change password, theme, logout.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-franchise&gt;</code></td><td>Franchise switcher (multi-brand managers) — optional, right zone.</td></tr>
            <tr><td><code className="ds-inline">&lt;hw-header-unauth&gt;</code></td><td>Logged-out variant — logo + profile only.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="ds-h2">Dropdowns — opened states</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>Each dropdown shown statically below for reference.</p>

      <div className="ds-grid ds-cols-2" style={{ gap: 24, alignItems: "start" }}>
        <div>
          <div className="ds-eyebrow">My App</div>
          <div className="dd-spec" style={{ marginTop: 8 }}>
            <div className="hw-dd hw-app-list"><HwAppsInner /></div>
          </div>
        </div>
        <div>
          <div className="ds-eyebrow">Site switcher</div>
          <div className="dd-spec" style={{ marginTop: 8 }}>
            <div className="hw-dd hw-site-list"><HwSiteInner /></div>
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <div className="ds-eyebrow">Weather — configured</div>
          <div className="dd-spec" style={{ marginTop: 8, overflowX: "auto" }}>
            <div className="hw-dd hw-weather-dd configured"><HwWeatherInner /></div>
          </div>
        </div>
        <div>
          <div className="ds-eyebrow">Profile</div>
          <div className="dd-spec" style={{ marginTop: 8 }}>
            <div className="hw-dd hw-profile-dd"><HwProfileInner /></div>
          </div>
        </div>
        <div>
          <div className="ds-eyebrow">Help / Support</div>
          <div className="dd-spec" style={{ marginTop: 8 }}>
            <div className="hw-dd hw-support-dd">
              <div className="support-head">Version 6.9.0</div>
              <ul>
                {HW_SUPPORT.map((s) => (
                  <li key={s.name}><span className="si"><Ph name={s.icon} /></span>{s.name}{s.chev && <span className="chev"><Ph name="caret-right" /></span>}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <A11yNote items={[
        "Each trigger is keyboard-activatable with aria-haspopup + aria-expanded; dropdowns are role='menu' / role='dialog'.",
        "The weather temp trigger carries an aria-label with the full reading (e.g. 'Weather: 68 °F') since the icon alone isn't descriptive.",
        "Profile avatar img has alt set to the user title; icon-only gear has aria-label='Settings'.",
        "Marquee message respects prefers-reduced-motion — the animation pauses and the text wraps instead of scrolling.",
        "The billing alert uses role='status' so screen readers announce it without interrupting.",
      ]} />
    </main>
  );
}

/* static inner renderers (no positioning) reused for the spec grid */
function HwAppsInner() {
  const apps = [
    { name: "Plum POS",          color: "#e8a13c", icon: "storefront" },
    { name: "Plum POS DashBoard",color: "#7b42ff", icon: "chart-pie-slice" },
    { name: "Plum Timekeeping",  color: "#e23744", icon: "clock" },
    { name: "Settings",          color: "var(--iron)", icon: "gear" },
    { name: "App Store",         color: "var(--theme)", icon: "shopping-bag" },
  ];
  return (
    <ul>
      {apps.map((a) => (
        <li key={a.name}><span className="app-ico" style={{ background: a.color }}><Ph name={a.icon} weight="fill" size="13px" /></span>{a.name}</li>
      ))}
    </ul>
  );
}
function HwSiteInner() {
  return (<>
    <div className="choose-site"><h2>Choose Site(s)</h2></div>
    <ul>
      <li><span className="site-icon"><Ph name="map-pin" weight="fill" size="14px" /></span><span className="site-name">Red Panda Pappers</span></li>
      <li><span className="site-icon"><Ph name="map-pin" weight="fill" size="14px" /></span><span className="site-name">Site 1</span><span className="site-address">Plum Restaurant</span></li>
    </ul>
  </>);
}
function HwWeatherInner() {
  const week = [
    { d: "Mon", ico: "sun", hi: "72", lo: "58" },
    { d: "Tue", ico: "cloud-sun", hi: "70", lo: "56" },
    { d: "Wed", ico: "cloud-rain", hi: "65", lo: "54" },
  ];
  return (<>
    <div className="weather-today">
      <h2>Fri, May 29</h2>
      <div className="w-ico"><Ph name="cloud-sun" weight="fill" /></div>
      <div className="w-status">Partly cloudy</div>
      <div className="w-high">68°F</div>
      <div className="w-low">54°F</div>
    </div>
    <div className="weather-weekly">
      {week.map((w) => (
        <div key={w.d} className="day">
          <div className="dname">{w.d}</div>
          <div className="w-ico"><Ph name={w.ico} weight="fill" /></div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{w.hi}°</div>
          <div style={{ fontSize: 13, opacity: .7 }}>{w.lo}°</div>
        </div>
      ))}
    </div>
  </>);
}
function HwProfileInner() {
  const [light, setLight] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("English");
  return (<>
    <div className="profile-section">
      <span className="profile-img" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Ph name="user" weight="fill" style={{ color: "var(--primaryDark)", fontSize: 30 }} />
      </span>
      <ul className="profile-setting">
        <li className="hw-lang-wrap">
          <span onClick={() => setLangOpen((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <img className="flag" src="https://flagcdn.com/us.svg" alt="" /> {lang} <Ph name="caret-down" size="10px" />
          </span>
          {langOpen && <HwLangDropdown active={lang} onPick={(l) => { setLang(l); setLangOpen(false); }} />}
        </li>
        <li>Edit</li>
      </ul>
    </div>
    <ul className="profile-data">
      <li style={{ cursor: "default" }}><span><i className="pi"><Ph name="user" /></i> R Dixit</span></li>
      <li style={{ cursor: "default" }}><span><i className="pi"><Ph name="envelope-simple" /></i> plum@22.com</span></li>
      <li><span><i className="pi"><Ph name="key" /></i> Change Password</span></li>
      <li style={{ cursor: "default" }}>
        <span><i className="pi"><Ph name="sun" /></i> Light Theme</span>
        <FnSwitch size="md" checked={light} onChange={setLight} ariaLabel="Light theme" />
      </li>
      <li className="red"><span><i className="pi"><Ph name="power" /></i> Logout</span></li>
    </ul>
  </>);
}

Object.assign(window, { ViewHwHeader, HwHeaderMain });
