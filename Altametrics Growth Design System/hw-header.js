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
  function isDark() { return document.documentElement.classList.contains('dark-theme'); }
  function setDark(dark) {
    document.documentElement.classList.toggle('dark-theme', dark);
    try { localStorage.setItem('ds-theme', dark ? 'dark' : 'light'); } catch (e) {}
    // reflect on every rendered Light-Theme switch (on = light)
    document.querySelectorAll('[data-hw-theme-toggle]').forEach(function (sw) {
      sw.classList.toggle('on', !dark);
      sw.setAttribute('aria-checked', String(!dark));
    });
  }
  // apply any saved preference as early as possible
  try { if (localStorage.getItem('ds-theme') === 'dark') document.documentElement.classList.add('dark-theme'); } catch (e) {}

  function initHeader(nav) {
    if (nav.__hwHeaderInit) return;
    nav.__hwHeaderInit = true;

    function panels() { return nav.querySelectorAll('[data-hw-panel]'); }
    function triggers() { return nav.querySelectorAll('[data-hw-trigger]'); }
    function subpanels() { return nav.querySelectorAll('[data-hw-subpanel]'); }

    function closeSubs() {
      subpanels().forEach(function (p) { p.classList.remove('open'); });
      nav.querySelectorAll('[data-hw-subtrigger]').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    }
    function closeAll() {
      panels().forEach(function (p) { p.classList.remove('open'); });
      triggers().forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
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
        if (spanel && !open) { spanel.classList.add('open'); sub.setAttribute('aria-expanded', 'true'); }
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
        if (e.target.closest('[data-hw-stop]')) { return; }
        if (e.target.closest('[data-hw-close]')) { closeAll(); return; }
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
    var a = function (n, d) { var v = nav.getAttribute(n); return v == null ? d : v; };
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
    var logo = esc(a('data-logo-icon', 'ph:fork-knife'));
    var appName = esc(a('data-app-name', 'My Apps'));
    var siteName = esc(a('data-site-name', 'Site 1'));
    var time = esc(a('data-time', '9:41'));
    var mer = a('data-meridiem', 'A');
    var tz = esc(a('data-tz', 'America/Los Angeles'));
    var version = esc(a('data-version', '6.9.0'));
    var billing = nav.getAttribute('data-billing');

    var billingHtml = billing ? (
      '<li class="header-list-item"><div class="alert-msg-header">' +
        '<div class="text-anim-marquee"><div class="msg-wrap"><p>' + esc(billing) + '</p></div></div>' +
        '<button class="take-action">Take Action</button>' +
      '</div></li>') : '';

    var clockHtml = '<span class="clock"><span>' + time +
      (mer ? '<sup>' + esc(mer) + '</sup>' : '') + '</span><span class="tz">' + tz + '</span></span>';

    nav.innerHTML =
      '<ul class="navbar-left">' +
        '<li class="brand"><span class="logo-box"><iconify-icon icon="' + logo + '" style="color:#fff;font-size:22px;"></iconify-icon></span></li>' +
        '<li class="header-list-item" data-hw-trigger="apps" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><span><span class="lead-icon"><iconify-icon icon="ph:squares-four"></iconify-icon></span> ' + appName + ' <span class="caret-ico"><iconify-icon icon="ph:caret-down"></iconify-icon></span></span></li>' +
        '<li class="header-list-item" data-hw-trigger="site" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><span><span class="lead-icon"><iconify-icon icon="ph:map-pin"></iconify-icon></span> ' + siteName + ' <span class="caret-ico"><iconify-icon icon="ph:caret-down"></iconify-icon></span></span></li>' +
      '</ul>' +
      '<ul class="navbar-center">' +
        '<li data-hw-trigger="weather" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false"><span class="weather-trigger"><span class="w-ico"><iconify-icon icon="ph:cloud-sun"></iconify-icon></span> <iconify-icon icon="ph:caret-down" style="font-size:11px;"></iconify-icon></span></li>' +
        '<li class="cursor-default" style="cursor:default;">' + clockHtml + '</li>' +
      '</ul>' +
      '<ul class="navbar-right">' +
        billingHtml +
        '<li class="help-btn" data-hw-trigger="support" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false" aria-label="Help and support" title="Help &amp; support"><iconify-icon icon="ph:question"></iconify-icon></li>' +
        '<li class="gear-btn" role="button" tabindex="0" aria-label="Settings" title="Settings"><iconify-icon icon="ph:gear"></iconify-icon></li>' +
        '<li data-hw-trigger="profile" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false"><span class="user-icon" style="display:inline-flex;align-items:center;justify-content:center;background:#cfe0ff;"><iconify-icon icon="ph:user-fill" style="color:#fff;font-size:20px;"></iconify-icon></span></li>' +
      '</ul>' +
      // --- dropdowns ---
      '<div class="hw-dd hw-app-list" data-hw-panel="apps" role="menu"><ul>' +
        '<li role="menuitem"><span class="app-ico" style="background:#e8a13c;"><iconify-icon icon="ph:storefront-fill"></iconify-icon></span>Plum POS</li>' +
        '<li role="menuitem"><span class="app-ico" style="background:#7b42ff;"><iconify-icon icon="ph:chart-pie-slice-fill"></iconify-icon></span>Plum POS DashBoard</li>' +
        '<li role="menuitem"><span class="app-ico" style="background:#e23744;"><iconify-icon icon="ph:clock-fill"></iconify-icon></span>Plum Timekeeping</li>' +
        '<li role="menuitem"><span class="app-ico" style="background:var(--iron);"><iconify-icon icon="ph:gear-fill"></iconify-icon></span>Settings</li>' +
        '<li role="menuitem"><span class="app-ico" style="background:var(--theme);"><iconify-icon icon="ph:shopping-bag-fill"></iconify-icon></span>App Store</li>' +
      '</ul></div>' +
      '<div class="hw-dd hw-site-list" data-hw-panel="site" role="menu"><div class="choose-site"><h2>Choose Site(s)</h2></div><ul>' +
        '<li role="menuitem"><span class="site-icon"><iconify-icon icon="ph:map-pin-fill"></iconify-icon></span><span class="site-name">Red Panda Peppers</span></li>' +
        '<li role="menuitem"><span class="site-icon"><iconify-icon icon="ph:map-pin-fill"></iconify-icon></span><span class="site-name">' + siteName + '</span><span class="site-address">Plum Restaurant</span></li>' +
      '</ul></div>' +
      '<div class="hw-dd hw-weather-dd configured" data-hw-panel="weather" role="dialog" aria-label="Weather forecast">' +
        '<div class="weather-today"><h2>Fri, May 29</h2><div class="w-ico"><iconify-icon icon="ph:cloud-sun-fill"></iconify-icon></div><div class="w-status">Partly cloudy</div><div class="w-high">68°F</div><div class="w-low">54°F</div></div>' +
        '<div class="weather-weekly">' +
          '<div class="day"><div class="dname">Mon</div><div class="w-ico"><iconify-icon icon="ph:sun-fill"></iconify-icon></div><div style="font-size:15px;font-weight:700;">72°</div><div style="font-size:13px;opacity:.7;">58°</div></div>' +
          '<div class="day"><div class="dname">Tue</div><div class="w-ico"><iconify-icon icon="ph:cloud-sun-fill"></iconify-icon></div><div style="font-size:15px;font-weight:700;">70°</div><div style="font-size:13px;opacity:.7;">56°</div></div>' +
          '<div class="day"><div class="dname">Wed</div><div class="w-ico"><iconify-icon icon="ph:cloud-rain-fill"></iconify-icon></div><div style="font-size:15px;font-weight:700;">65°</div><div style="font-size:13px;opacity:.7;">54°</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="hw-dd hw-profile-dd" data-hw-panel="profile" role="menu">' +
        '<div class="profile-section"><span class="profile-img" style="display:inline-flex;align-items:center;justify-content:center;"><iconify-icon icon="ph:user-fill" style="color:var(--primaryDark);font-size:30px;"></iconify-icon></span>' +
          '<ul class="profile-setting"><li class="hw-lang-wrap" data-hw-stop>' +
            '<span data-hw-subtrigger="lang" aria-expanded="false" style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;"><img class="flag" src="https://flagcdn.com/us.svg" alt="" /> English <iconify-icon icon="ph:caret-down" style="font-size:10px;"></iconify-icon></span>' +
            '<ul class="hw-lang-dd" data-hw-subpanel="lang" role="menu" aria-label="Select language">' +
              '<li class="lang-head" style="cursor:default;" aria-hidden="true">Select Language</li>' +
              '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/us.svg" alt="" /> English</li>' +
              '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/es.svg" alt="" /> Spanish</li>' +
              '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/fr.svg" alt="" /> French</li>' +
              '<li role="menuitemradio"><img class="flag" src="https://flagcdn.com/cn.svg" alt="" /> Chinese</li>' +
            '</ul>' +
          '</li><li>Edit</li></ul>' +
        '</div>' +
        '<ul class="profile-data">' +
          '<li style="cursor:default;"><span><i class="pi"><iconify-icon icon="ph:user"></iconify-icon></i> R Dixit</span></li>' +
          '<li style="cursor:default;"><span><i class="pi"><iconify-icon icon="ph:envelope-simple"></iconify-icon></i> plum@22.com</span></li>' +
          '<li><span><i class="pi"><iconify-icon icon="ph:key"></iconify-icon></i> Change Password</span></li>' +
          '<li style="cursor:default;" data-hw-stop><span><i class="pi"><iconify-icon icon="ph:sun"></iconify-icon></i> Light Theme</span><span class="fn-switch' + (isDark() ? '' : ' on') + '" data-hw-theme-toggle role="switch" tabindex="0" aria-checked="' + (isDark() ? 'false' : 'true') + '" aria-label="Light theme"></span></li>' +
          '<li class="red" data-hw-close><span><i class="pi"><iconify-icon icon="ph:power"></iconify-icon></i> Logout</span></li>' +
        '</ul>' +
      '</div>' +
      '<div class="hw-dd hw-support-dd" data-hw-panel="support" role="menu"><div class="support-head">Version ' + version + '</div><ul>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:gear-six"></iconify-icon></span>Settings<span class="chev"><iconify-icon icon="ph:caret-right"></iconify-icon></span></li>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:question"></iconify-icon></span>FAQ</li>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:device-mobile"></iconify-icon></span>Get Mobile App</li>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:play-circle"></iconify-icon></span>Help Center</li>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:chat-dots"></iconify-icon></span>Feedback</li>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:lifebuoy"></iconify-icon></span>Support</li>' +
        '<li role="menuitem" data-hw-close><span class="si"><iconify-icon icon="ph:scroll"></iconify-icon></span>Release Notes</li>' +
      '</ul></div>';
  }

  function boot() {
    document.querySelectorAll('[data-hw-header]').forEach(function (nav) {
      // Auto-render the standard header markup when asked (data-hw-render="standard")
      // or when the element is left empty. This keeps the canonical header in ONE
      // place (this file): consumers drop a one-liner and get the full chrome +
      // every dropdown + the support panel, and future updates flow automatically.
      var wantsRender = nav.getAttribute('data-hw-render') === 'standard'
        || nav.children.length === 0;
      if (wantsRender) renderStandard(nav);
      initHeader(nav);
    });
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);

  window.HwHeader = { init: initHeader, boot: boot, render: renderStandard };
})();
