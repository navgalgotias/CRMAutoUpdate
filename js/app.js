/*
 * vTiger CRM Auto Update
 * Reads red-highlighted cells from an uploaded Excel sheet and pushes
 * the changed fields into vTiger CRM through its public Webservice API.
 * Pure client-side: no backend, no server-side storage.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * Minimal MD5 (needed for vTiger's login accessKey hashing)
   * Public-domain implementation (Joseph Myers), trimmed to what we need.
   * ------------------------------------------------------------------- */
  const md5 = (function () {
    function safeAdd(x, y) {
      const lsw = (x & 0xffff) + (y & 0xffff);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff);
    }
    function bitRotateLeft(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }
    function md5cmn(q, a, b, x, s, t) {
      return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
    function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

    function binlMD5(x, len) {
      x[len >> 5] |= 0x80 << (len % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;
      let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
      for (let i = 0; i < x.length; i += 16) {
        const olda = a, oldb = b, oldc = c, oldd = d;
        a = md5ff(a, b, c, d, x[i], 7, -680876936);
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, x[i], 20, -373897302);
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, x[i], 11, -358537222);
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5ii(a, b, c, d, x[i], 6, -198630844);
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
      }
      return [a, b, c, d];
    }
    function binl2rstr(input) {
      let output = "";
      const length32 = input.length * 32;
      for (let i = 0; i < length32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
      }
      return output;
    }
    function rstr2binl(input) {
      const output = [];
      output[(input.length >> 2) - 1] = undefined;
      for (let i = 0; i < output.length; i += 1) output[i] = 0;
      const length8 = input.length * 8;
      for (let i = 0; i < length8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
      }
      return output;
    }
    function rstrMD5(s) { return binl2rstr(binlMD5(rstr2binl(s), s.length * 8)); }
    function rstr2hex(input) {
      const hexTab = "0123456789abcdef";
      let output = "";
      for (let i = 0; i < input.length; i += 1) {
        const x = input.charCodeAt(i);
        output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
      }
      return output;
    }
    function str2rstrUTF8(input) { return unescape(encodeURIComponent(input)); }
    return function (str) {
      return rstr2hex(rstrMD5(str2rstrUTF8(str)));
    };
  })();

  /* ---------------------------------------------------------------------
   * DOM references
   * ------------------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);

  const els = {
    appHeader: $("app-header"),
    headerActions: $("header-actions"),
    connectStatus: $("connect-status"),
    btnReconnect: $("btn-reconnect"),
    linkDocumentation: $("link-documentation"),
    appMain: $("app-main"),

    profileMenu: $("profile-menu"),
    btnProfile: $("btn-profile"),
    profileDropdown: $("profile-dropdown"),
    avatarCircle: $("avatar-circle"),
    avatarCircleLg: $("avatar-circle-lg"),
    profileName: $("profile-name"),
    profileUsername: $("profile-username"),
    profileRoleTag: $("profile-role-tag"),
    btnLogout: $("btn-logout"),

    loginScreen: $("login-screen"),
    loginForm: $("login-form"),
    loginSubtitle: $("login-subtitle"),
    loginUsername: $("login-username"),
    loginPassword: $("login-password"),
    loginPasswordLabel: $("login-password-label"),
    loginPasswordConfirmField: $("login-password-confirm-field"),
    loginPasswordConfirm: $("login-password-confirm"),
    loginFirstTimeHint: $("login-first-time-hint"),
    loginRememberToggle: $("login-remember-toggle"),
    loginCrmUrl: $("login-crm-url"),
    btnLogin: $("btn-login"),
    loginStatus: $("login-status"),

    usersBody: $("users-body"),
    usersRoleTh: $("users-role-th"),
    newUserUsername: $("new-user-username"),
    newUserFirstName: $("new-user-firstname"),
    newUserLastName: $("new-user-lastname"),
    newUserAccessKey: $("new-user-accesskey"),
    newUserRole: $("new-user-role"),
    btnAddUser: $("btn-add-user"),

    uploadBox: $("upload-box"),
    fileInput: $("file-input"),
    fileName: $("file-name"),
    sheetSelect: $("sheet-select"),
    btnParse: $("btn-parse"),

    identifierColumn: $("identifier-column"),
    mappingTableBody: document.querySelector("#mapping-table tbody"),
    btnBuildReview: $("btn-build-review"),

    reviewHeadRow: $("review-head-row"),
    reviewBody: $("review-body"),
    reviewSummary: $("review-summary"),
    btnGotoUpdate: $("btn-goto-update"),

    btnRunUpdate: $("btn-run-update"),
    progressWrap: $("progress-wrap"),
    progressFill: $("progress-fill"),
    progressText: $("progress-text"),
    resultsTable: $("results-table"),
    resultsBody: $("results-body"),

    toast: $("toast"),

    btnOpenSettings: $("btn-open-settings"),
    btnSettingsClose: $("btn-settings-close"),
    settingsOverlay: $("settings-overlay"),
    settingsForm: $("settings-form"),
    settingsUrl: $("settings-url"),
    settingsModule: $("settings-module"),
    settingsIdField: $("settings-idfield"),
    settingsTimeout: $("settings-timeout"),
    btnSettingsClear: $("btn-settings-clear"),
    btnExportSetup: $("btn-export-setup"),
    btnSettingsImport: $("btn-settings-import"),
    settingsImportInput: $("settings-import-input"),
    btnImportSetup: $("btn-import-setup"),
    importSetupInput: $("import-setup-input"),
  };

  /* ---------------------------------------------------------------------
   * App state
   * ------------------------------------------------------------------- */
  const state = {
    crm: { url: "", module: "HelpDesk", idField: "ticket_no", timeoutMinutes: 30 },
    session: null, // { sessionName, userId } — the vTiger Webservice login session
    auth: null, // { username, role } — the signed-in app user, once logged in
    moduleFields: {}, // { fieldApiName: describe() field metadata }
    workbook: null,
    sheetName: null,
    headers: [], // column header strings, index-aligned to columns
    dataRows: [], // array of { rowIndex, cells: [{value, isRed}] }
    identifierColIndex: -1,
    mapping: {}, // { columnIndex: vtigerFieldApiName }
    included: {}, // { columnIndex: boolean }
    reviewRows: [], // { ticketNo, changes: {field: value}, rowIndex, include: bool, fieldInclude: {field: bool} }
  };

  const MAPPING_STORAGE_KEY = "vtigerAutoUpdate.fieldMapping.v1";
  const SETTINGS_STORAGE_KEY = "vtigerAutoUpdate.connectionSettings.v2";
  const USERS_STORAGE_KEY = "vtigerAutoUpdate.users.v1";
  const SESSION_STORAGE_KEY = "vtigerAutoUpdate.session.v1"; // sessionStorage — cleared when the tab/browser closes

  // Shared CRM connection config (admin-configurable via Settings).
  // `timeoutMinutes` is the idle-logout window; 0 disables it (never auto sign out).
  const DEFAULT_CRM_CONFIG = {
    url: "https://qaaltasupportcrm.altametrics.com/",
    module: "HelpDesk",
    idField: "ticket_no",
    timeoutMinutes: 30,
  };

  // Seed user list: { username: { accessKey, role } }. Everyone else must be added by an admin.
  // `password` starts unset (null) for every seeded/new user — they create it themselves at
  // their first sign-in; an admin can only reset it back to null to force that flow again.
  const DEFAULT_USERS = {
    alta_support: { accessKey: "FcGFJgx1PWe9knbA", role: "admin", firstName: "Alta", lastName: "Support", password: null },
  };

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "null");
      if (saved && saved.url) return Object.assign({}, DEFAULT_CRM_CONFIG, saved);
    } catch (_e) { /* fall through to defaults */ }
    return Object.assign({}, DEFAULT_CRM_CONFIG);
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (_e) { /* ignore quota errors */ }
  }

  function applySettingsToModalForm(settings) {
    els.settingsUrl.value = settings.url;
    els.settingsModule.value = settings.module;
    els.settingsIdField.value = settings.idField;
    els.settingsTimeout.value = settings.timeoutMinutes || "";
  }

  /* ---------------------------------------------------------------------
   * User list (admin-managed, per-browser): username -> { accessKey, role }.
   * The login screen only asks for a username; the matching access key here
   * is what actually authenticates against vTiger. This is a UI-level
   * convenience, not a security boundary — anyone with browser dev tools
   * could read every listed access key or bypass role checks.
   * ------------------------------------------------------------------- */
  function normalizeUsername(u) {
    return String(u || "").trim().toLowerCase();
  }

  function loadUsers() {
    try {
      const saved = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") return saved;
    } catch (_e) { /* fall through to seed */ }
    const seeded = JSON.parse(JSON.stringify(DEFAULT_USERS));
    saveUsers(seeded);
    return seeded;
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (_e) { /* ignore quota errors */ }
  }

  /* Returns { username, accessKey, role } for a case-insensitive username match, or null. */
  function getUser(username) {
    const users = loadUsers();
    const key = normalizeUsername(username);
    const match = Object.keys(users).find((u) => normalizeUsername(u) === key);
    return match ? Object.assign({ username: match }, users[match]) : null;
  }

  /* `password` is optional — pass it only when you actually mean to change it (a first-time
   * set, or an admin reset to null). Omit it (undefined) to keep whatever was already stored,
   * so edits like renaming a user or changing their role never wipe out their password. */
  function setUser(username, accessKey, role, firstName, lastName, password) {
    const users = loadUsers();
    const key = normalizeUsername(username);
    const existingKey = Object.keys(users).find((u) => normalizeUsername(u) === key);
    const existing = existingKey ? users[existingKey] : null;
    if (existingKey) delete users[existingKey];
    users[username.trim()] = {
      accessKey,
      role,
      firstName: (firstName || "").trim(),
      lastName: (lastName || "").trim(),
      password: password !== undefined ? password : (existing ? existing.password : null),
    };
    saveUsers(users);
  }

  function fullName(user) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    return name || user.username;
  }

  function initialsFor(user) {
    const first = (user.firstName || "").trim();
    const last = (user.lastName || "").trim();
    if (first || last) return ((first[0] || "") + (last[0] || "")).toUpperCase();
    return (user.username || "?").slice(0, 2).toUpperCase();
  }

  function removeUser(username) {
    const users = loadUsers();
    const key = normalizeUsername(username);
    const existingKey = Object.keys(users).find((u) => normalizeUsername(u) === key);
    if (existingKey) delete users[existingKey];
    saveUsers(users);
  }

  function roleLabel(role) {
    return role === "admin" ? "Admin" : "Team Member";
  }

  /* ---------------------------------------------------------------------
   * Setup export / import — the only way to get the same user list and CRM
   * settings onto another device, since everything here lives in this
   * browser's localStorage and there is no backend to sync through.
   *
   * Passwords are deliberately stripped on export: each person creates their
   * own at their first sign-in on their own device. Access keys ARE included
   * (the app can't sign anyone in without them), which is exactly why the
   * file must be shared privately and never committed to the repo.
   * ------------------------------------------------------------------- */
  const SETUP_FILE_MARKER = "vtigerAutoUpdate.setup";

  function buildSetupPayload() {
    const users = loadUsers();
    const usersWithoutPasswords = {};
    Object.keys(users).forEach((username) => {
      usersWithoutPasswords[username] = Object.assign({}, users[username], { password: null });
    });
    return {
      app: SETUP_FILE_MARKER,
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: loadSettings(),
      users: usersWithoutPasswords,
    };
  }

  function exportSetupFile() {
    const json = JSON.stringify(buildSetupPayload(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "crm-auto-update-setup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Setup file downloaded. Send it to your team privately — it contains access keys.", "success");
  }

  /* Merges an exported file into this browser. Imported entries win over
   * existing ones of the same username; anything already here that isn't in
   * the file is left alone. Any password already set on this device for a
   * user is kept, so importing an updated file doesn't force a reset. */
  function applySetupPayload(data) {
    if (!data || data.app !== SETUP_FILE_MARKER || !data.users || typeof data.users !== "object") {
      throw new Error("this isn't a vTiger CRM Auto Update setup file");
    }

    const existing = loadUsers();
    const merged = Object.assign({}, existing);
    Object.keys(data.users).forEach((username) => {
      const incoming = data.users[username] || {};
      const localMatch = Object.keys(existing).find((u) => normalizeUsername(u) === normalizeUsername(username));
      const keptPassword = localMatch ? existing[localMatch].password : null;
      if (localMatch && localMatch !== username) delete merged[localMatch];
      merged[username] = Object.assign({}, incoming, { password: incoming.password || keptPassword || null });
    });
    saveUsers(merged);

    if (data.settings && data.settings.url) {
      saveSettings(Object.assign({}, DEFAULT_CRM_CONFIG, data.settings));
      state.crm.timeoutMinutes = loadSettings().timeoutMinutes;
    }

    return Object.keys(data.users).length;
  }

  function importSetupFile(file, onDone) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let count;
      try {
        count = applySetupPayload(JSON.parse(e.target.result));
      } catch (err) {
        toast("Could not import that file: " + err.message + ".", "error");
        return;
      }
      els.loginCrmUrl.textContent = "Connecting to: " + loadSettings().url;
      toast(count + " user(s) imported. You can sign in with your own username now.", "success");
      if (onDone) onDone();
    };
    reader.onerror = () => toast("Could not read that file.", "error");
    reader.readAsText(file);
  }

  els.btnExportSetup.addEventListener("click", exportSetupFile);

  els.btnSettingsImport.addEventListener("click", () => els.settingsImportInput.click());
  els.settingsImportInput.addEventListener("change", () => {
    const file = els.settingsImportInput.files[0];
    if (file) importSetupFile(file, () => { renderUsersTable(); applySettingsToModalForm(loadSettings()); });
    els.settingsImportInput.value = "";
  });

  els.btnImportSetup.addEventListener("click", () => els.importSetupInput.click());
  els.importSetupInput.addEventListener("change", () => {
    const file = els.importSetupInput.files[0];
    if (file) importSetupFile(file, () => els.loginUsername.focus());
    els.importSetupInput.value = "";
  });

  /* ---------------------------------------------------------------------
   * Login session (sessionStorage — cleared when the tab/browser closes,
   * so this behaves like a real "sign in each session" login screen).
   * Only the username is stored; the access key/role are always looked up
   * fresh from the Users list so admin changes take effect on reconnect.
   * ------------------------------------------------------------------- */
  function loadAuthSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || "null");
    } catch (_e) {
      return null;
    }
  }

  function saveAuthSession(auth) {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(auth));
    } catch (_e) { /* ignore quota errors */ }
  }

  function clearAuthSession() {
    try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch (_e) { /* ignore */ }
  }

  function applyRoleToUI(role) {
    const isAdmin = role === "admin";
    document.querySelectorAll(".is-admin-only").forEach((el) => { el.hidden = !isAdmin; });

    const auth = state.auth || {};
    const display = fullName(auth);
    const initials = initialsFor(auth);

    els.avatarCircle.textContent = initials;
    els.avatarCircleLg.textContent = initials;
    els.profileName.textContent = display;
    els.profileUsername.textContent = auth.username || "";
    els.profileRoleTag.textContent = roleLabel(role);
  }

  function closeProfileDropdown() {
    els.profileDropdown.hidden = true;
    els.btnProfile.setAttribute("aria-expanded", "false");
  }

  els.btnProfile.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !els.profileDropdown.hidden;
    els.profileDropdown.hidden = isOpen;
    els.btnProfile.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!els.profileMenu.contains(e.target)) closeProfileDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProfileDropdown();
  });

  function showApp() {
    els.loginScreen.hidden = true;
    els.appHeader.hidden = false;
    els.headerActions.hidden = false;
    els.appMain.hidden = false;
    scheduleIdleTimer();
  }

  function showLogin() {
    els.loginScreen.hidden = false;
    els.appHeader.hidden = true;
    els.headerActions.hidden = true;
    els.appMain.hidden = true;
    clearIdleTimer();
    resetLoginForm();
  }

  /* ---------------------------------------------------------------------
   * Session (idle) timeout — configured in Settings ("Session Timeout").
   * Any user activity while signed in restarts the countdown; if it ever
   * fires, the user is signed out the same way the Log Out button does.
   * timeoutMinutes of 0 (or blank) disables this entirely.
   * ------------------------------------------------------------------- */
  let idleTimer = null;

  function clearIdleTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function scheduleIdleTimer() {
    clearIdleTimer();
    const minutes = Number(state.crm.timeoutMinutes) || 0;
    if (!minutes || !state.auth) return;
    idleTimer = setTimeout(() => {
      if (!state.auth) return;
      clearAuthSession();
      state.auth = null;
      state.session = null;
      showLogin();
      toast("You were signed out after " + minutes + " minute(s) of inactivity.", "error");
    }, minutes * 60 * 1000);
  }

  let lastActivityAt = 0;
  function handleUserActivity() {
    if (!state.auth) return;
    const now = Date.now();
    if (now - lastActivityAt < 1000) return; // throttle — no need to reset on every pixel of mouse movement
    lastActivityAt = now;
    scheduleIdleTimer();
  }
  ["mousemove", "mousedown", "keydown", "scroll", "touchstart"].forEach((evt) => {
    document.addEventListener(evt, handleUserActivity, { passive: true });
  });

  /* ---------------------------------------------------------------------
   * Utilities
   * ------------------------------------------------------------------- */
  function toast(message, type) {
    els.toast.textContent = message;
    els.toast.className = "toast" + (type ? " " + type : "");
    els.toast.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { els.toast.hidden = true; }, 4500);
  }

  function setStep(stepNumber) {
    document.querySelectorAll(".step").forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.toggle("active", n === stepNumber);
      el.classList.toggle("completed", n < stepNumber);
    });
    for (let i = 1; i <= 4; i += 1) {
      const panel = $("panel-" + i);
      if (!panel) continue;
      panel.classList.toggle("is-disabled", i > stepNumber);
    }
  }

  function normalizeBaseUrl(url) {
    return url.trim().replace(/\/+$/, "") + "/";
  }

  function webserviceUrl() {
    return normalizeBaseUrl(state.crm.url) + "webservice.php";
  }

  /* Parse an ARGB / RGB hex string ("FFFF0000", "FF0000") to {r,g,b} */
  function parseColorHex(hex) {
    if (!hex) return null;
    let h = hex.replace("#", "");
    if (h.length === 8) h = h.slice(2); // drop alpha
    if (h.length !== 6) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  /* Heuristic: does this fill color look "red" the way Excel users highlight edits? */
  function isReddish(rgb) {
    if (!rgb) return false;
    const { r, g, b } = rgb;
    // Strong / pure reds and common "light red fill" conditional formatting tones.
    return r >= 150 && r - g >= 40 && r - b >= 40;
  }

  function cellIsRedHighlighted(cell) {
    if (!cell || !cell.s) return false;
    const fill = cell.s.fgColor || cell.s.bgColor;
    if (!fill) return false;
    const rgb = parseColorHex(fill.rgb);
    return isReddish(rgb);
  }

  function colLetter(n) {
    let s = "";
    let num = n + 1;
    while (num > 0) {
      const rem = (num - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      num = Math.floor((num - 1) / 26);
    }
    return s;
  }

  /* ---------------------------------------------------------------------
   * vTiger Webservice API
   * ------------------------------------------------------------------- */
  const VTiger = {
    async getChallenge(username) {
      const url = webserviceUrl() + "?operation=getchallenge&username=" + encodeURIComponent(username);
      const res = await fetch(url, { method: "GET" });
      const json = await res.json();
      if (!json.success) throw new Error((json.error && json.error.message) || "Failed to get challenge token.");
      return json.result.token;
    },

    async login(username, accessKey) {
      const token = await this.getChallenge(username);
      const hash = md5(token + accessKey);
      const body = new URLSearchParams();
      body.set("operation", "login");
      body.set("username", username);
      body.set("accessKey", hash);
      const res = await fetch(webserviceUrl(), { method: "POST", body });
      const json = await res.json();
      if (!json.success) throw new Error((json.error && json.error.message) || "Login failed.");
      return { sessionName: json.result.sessionName, userId: json.result.userId };
    },

    async query(sessionName, queryStr) {
      const url = webserviceUrl() + "?operation=query&sessionName=" + encodeURIComponent(sessionName) +
        "&query=" + encodeURIComponent(queryStr);
      const res = await fetch(url, { method: "GET" });
      const json = await res.json();
      if (!json.success) throw new Error((json.error && json.error.message) || "Query failed.");
      return json.result;
    },

    async retrieve(sessionName, id) {
      const url = webserviceUrl() + "?operation=retrieve&sessionName=" + encodeURIComponent(sessionName) +
        "&id=" + encodeURIComponent(id);
      const res = await fetch(url, { method: "GET" });
      const json = await res.json();
      if (!json.success) throw new Error((json.error && json.error.message) || "Retrieve failed.");
      return json.result;
    },

    async update(sessionName, element) {
      const body = new URLSearchParams();
      body.set("operation", "update");
      body.set("sessionName", sessionName);
      body.set("element", JSON.stringify(element));
      const res = await fetch(webserviceUrl(), { method: "POST", body });
      const json = await res.json();
      if (!json.success) throw new Error((json.error && json.error.message) || "Update failed.");
      return json.result;
    },

    async describe(sessionName, moduleName) {
      const url = webserviceUrl() + "?operation=describe&sessionName=" + encodeURIComponent(sessionName) +
        "&elementType=" + encodeURIComponent(moduleName);
      const res = await fetch(url, { method: "GET" });
      const json = await res.json();
      if (!json.success) throw new Error((json.error && json.error.message) || "Describe failed.");
      return json.result;
    },
  };

  /* Turn a vTiger `describe` field type into: is it a reference field, and to which modules? */
  function referenceModulesForField(fieldMeta) {
    if (!fieldMeta || !fieldMeta.type) return null;
    const type = fieldMeta.type;
    if (type.name === "reference" && Array.isArray(type.refersTo)) return type.refersTo;
    return null;
  }

  /* Best-effort: resolve a plain display name (e.g. "Jane Doe") typed in Excel into the
   * vTiger record id a reference/owner field actually needs (e.g. "19x5"), by looking it
   * up in the module(s) the field refers to. Falls back to the raw value if it already
   * looks like a vTiger id, or if no match is found. */
  async function resolveReferenceValue(sessionName, fieldMeta, rawValue) {
    const value = String(rawValue).trim();
    if (/^\d+x\d+$/.test(value)) return value; // already a vTiger id

    const modules = referenceModulesForField(fieldMeta);
    if (!modules) return rawValue;

    for (const moduleName of modules) {
      const escaped = value.replace(/'/g, "\\'");
      let candidates = [];
      if (moduleName === "Users") {
        candidates = [
          "select id from Users where user_name = '" + escaped + "';",
          "select id from Users where last_name = '" + escaped + "';",
        ];
      } else if (moduleName === "Groups") {
        candidates = ["select id from Groups where groupname = '" + escaped + "';"];
      } else {
        candidates = ["select id from " + moduleName + " where name = '" + escaped + "';"];
      }
      for (const q of candidates) {
        try {
          const rows = await VTiger.query(sessionName, q);
          if (rows && rows.length > 0) return rows[0].id;
        } catch (_e) { /* try next candidate */ }
      }
    }
    return rawValue; // no match — send as-is, verification step will flag it if it didn't take
  }

  /* ---------------------------------------------------------------------
   * Connect (background — not a wizard step; runs automatically on load,
   * whenever Settings are saved, and via the header "Reconnect" button)
   * ------------------------------------------------------------------- */
  /* Establishes the vTiger Webservice session + field metadata. Returns true/false;
   * does not touch the login screen, app visibility, or auth/session state — callers
   * (login, reconnect, silent restore) decide what to do with the result. */
  async function connectToVtiger(settings) {
    if (!settings.url || !settings.username || !settings.accessKey) {
      els.connectStatus.textContent = "Not connected";
      els.connectStatus.className = "pt-pill outline-muted";
      return false;
    }

    state.crm.url = settings.url;
    state.crm.module = settings.module;
    state.crm.idField = settings.idField;
    state.crm.timeoutMinutes = settings.timeoutMinutes;

    els.btnReconnect.disabled = true;
    els.connectStatus.textContent = "Connecting...";
    els.connectStatus.className = "pt-pill solid-warning";

    try {
      const session = await VTiger.login(settings.username, settings.accessKey);
      state.session = session;
      els.connectStatus.textContent = "Connected";
      els.connectStatus.className = "pt-pill solid-success";

      try {
        const describeResult = await VTiger.describe(session.sessionName, settings.module);
        state.moduleFields = {};
        (describeResult.fields || []).forEach((f) => { state.moduleFields[f.name] = f; });
      } catch (describeErr) {
        state.moduleFields = {};
        console.warn("Could not load field metadata via describe():", describeErr.message);
      }
      populateFieldDatalist();

      // The "Unique Identifier Field" in Settings must be a real vTiger API field name
      // (e.g. "ticket_no" or a custom "cf_XXX"), not a display label like "Ticket Number" —
      // an invalid/label field name breaks every lookup query with a syntax error.
      if (Object.keys(state.moduleFields).length > 0 && !state.moduleFields[state.crm.idField]) {
        const resolved = guessBestFieldMatch(state.crm.idField);
        if (resolved) {
          toast(
            "Unique identifier field \"" + state.crm.idField + "\" isn't a valid API name on " +
            state.crm.module + " — using \"" + resolved + "\" instead. Update Settings to make this permanent.",
            "error"
          );
          state.crm.idField = resolved;
        } else {
          toast(
            "Unique identifier field \"" + state.crm.idField + "\" was not found on " + state.crm.module +
            ". Open Settings and set it to the correct API field name (e.g. ticket_no or a cf_XXX field).",
            "error"
          );
        }
      }

      return true;
    } catch (err) {
      state.session = null;
      els.connectStatus.textContent = "Connection failed";
      els.connectStatus.className = "pt-pill solid-danger";
      toast(
        "Could not connect: " + err.message +
        ". This is often a CORS restriction on the vTiger server — see README.md.",
        "error"
      );
      return false;
    } finally {
      els.btnReconnect.disabled = false;
    }
  }

  els.btnReconnect.addEventListener("click", async () => {
    if (!state.auth) return;
    const user = getUser(state.auth.username);
    if (!user) {
      toast("Your user entry was removed from the list. Please log out and contact your admin.", "error");
      return;
    }
    const ok = await connectToVtiger(Object.assign({}, loadSettings(), {
      username: user.username,
      accessKey: user.accessKey,
    }));
    if (ok) {
      // Pick up any role/name change an admin made since the last connection.
      Object.assign(state.auth, { role: user.role, firstName: user.firstName, lastName: user.lastName });
      applyRoleToUI(state.auth.role);
      toast("Reconnected to vTiger CRM.", "success");
    }
  });

  /* ---------------------------------------------------------------------
   * Login screen — username + password on one screen.
   *   - No password on record yet -> "first sign-in": a Confirm Password
   *     field appears and whatever is entered becomes their password the
   *     moment the vTiger connection succeeds.
   *   - Password on record        -> it must match to proceed.
   * An admin can reset a user's stored password back to unset (Settings ->
   * Users -> Reset), which puts them through the "create a password" flow
   * again next time they sign in.
   *
   * The "Remember my password on this device" toggle stores the password
   * (per-username) in localStorage, same trust model as the access-key/
   * password storage documented in README — convenience, not security.
   * ------------------------------------------------------------------- */
  const REMEMBERED_PASSWORDS_KEY = "vtigerAutoUpdate.rememberedPasswords.v1";
  const REMEMBERED_USERNAME_KEY = "vtigerAutoUpdate.rememberedUsername.v1";

  function loadRememberedUsername() {
    try { return localStorage.getItem(REMEMBERED_USERNAME_KEY) || ""; } catch (_e) { return ""; }
  }

  function setRememberedUsername(username) {
    try { localStorage.setItem(REMEMBERED_USERNAME_KEY, username); } catch (_e) { /* ignore quota errors */ }
  }

  function clearRememberedUsername() {
    try { localStorage.removeItem(REMEMBERED_USERNAME_KEY); } catch (_e) { /* ignore */ }
  }

  function loadRememberedPasswords() {
    try {
      const saved = JSON.parse(localStorage.getItem(REMEMBERED_PASSWORDS_KEY) || "{}");
      return (saved && typeof saved === "object") ? saved : {};
    } catch (_e) {
      return {};
    }
  }

  function getRememberedPassword(username) {
    const map = loadRememberedPasswords();
    return map[normalizeUsername(username)] || "";
  }

  function setRememberedPassword(username, password) {
    const map = loadRememberedPasswords();
    map[normalizeUsername(username)] = password;
    try { localStorage.setItem(REMEMBERED_PASSWORDS_KEY, JSON.stringify(map)); } catch (_e) { /* ignore quota errors */ }
  }

  function clearRememberedPassword(username) {
    const map = loadRememberedPasswords();
    delete map[normalizeUsername(username)];
    try { localStorage.setItem(REMEMBERED_PASSWORDS_KEY, JSON.stringify(map)); } catch (_e) { /* ignore quota errors */ }
  }

  function setRememberToggle(on) {
    els.loginRememberToggle.classList.toggle("on", on);
    els.loginRememberToggle.setAttribute("aria-checked", String(on));
  }

  function isRememberToggleOn() {
    return els.loginRememberToggle.classList.contains("on");
  }

  function toggleRemember() {
    setRememberToggle(!isRememberToggleOn());
  }

  els.loginRememberToggle.addEventListener("click", toggleRemember);
  els.loginRememberToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleRemember(); }
  });

  /* As soon as a known username is typed, shape the password field(s) for
   * that user (first-time vs. returning) and prefill a remembered password. */
  function syncPasswordFieldToUsername() {
    const username = els.loginUsername.value.trim();
    const user = username ? getUser(username) : null;

    if (user && !user.password) {
      els.loginPasswordLabel.textContent = "Create Password";
      els.loginPassword.placeholder = "Choose a password";
      els.loginPasswordConfirmField.hidden = false;
      els.loginFirstTimeHint.hidden = false;
    } else {
      els.loginPasswordLabel.textContent = "Password";
      els.loginPassword.placeholder = "Enter your password";
      els.loginPasswordConfirmField.hidden = true;
      els.loginFirstTimeHint.hidden = true;
    }

    const remembered = user ? getRememberedPassword(user.username) : "";
    if (remembered) {
      els.loginPassword.value = remembered;
      setRememberToggle(true);
    } else {
      setRememberToggle(false);
    }
  }

  els.loginUsername.addEventListener("blur", syncPasswordFieldToUsername);

  function resetLoginForm() {
    els.loginUsername.value = "";
    els.loginPassword.value = "";
    els.loginPasswordConfirm.value = "";
    els.loginPasswordLabel.textContent = "Password";
    els.loginPassword.placeholder = "Enter your password";
    els.loginPasswordConfirmField.hidden = true;
    els.loginFirstTimeHint.hidden = true;
    setRememberToggle(false);
    els.loginSubtitle.textContent = "Sign in with your vTiger CRM username and password.";
    els.loginStatus.textContent = "Not signed in";
    els.loginStatus.className = "pt-pill outline-muted";

    // If "Remember" was on at the last successful sign-in, prefill both
    // fields (e.g. right after a Log Out or a session timeout) instead of
    // making the user retype everything.
    const rememberedUsername = loadRememberedUsername();
    if (rememberedUsername) {
      els.loginUsername.value = rememberedUsername;
      syncPasswordFieldToUsername();
    }
  }

  els.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = els.loginUsername.value.trim();
    if (!username) {
      toast("Please enter your username.", "error");
      return;
    }

    const user = getUser(username);
    if (!user) {
      els.loginStatus.textContent = "Username not found";
      els.loginStatus.className = "pt-pill solid-danger";
      toast("\"" + username + "\" isn't in the registered user list. Ask your admin to add you in Settings.", "error");
      return;
    }

    const password = els.loginPassword.value;
    let passwordToSave = null;

    if (user.password) {
      if (password !== user.password) {
        els.loginStatus.textContent = "Incorrect password";
        els.loginStatus.className = "pt-pill solid-danger";
        toast("Incorrect password.", "error");
        return;
      }
    } else {
      if (!password || password.length < 4) {
        toast("Choose a password with at least 4 characters.", "error");
        return;
      }
      if (password !== els.loginPasswordConfirm.value) {
        toast("Passwords do not match.", "error");
        return;
      }
      passwordToSave = password;
    }

    els.btnLogin.disabled = true;
    els.btnLogin.classList.add("is-loading");
    els.loginStatus.textContent = "Signing in...";
    els.loginStatus.className = "pt-pill solid-warning";

    const crmConfig = loadSettings();
    const ok = await connectToVtiger(Object.assign({}, crmConfig, {
      username: user.username,
      accessKey: user.accessKey,
    }));

    if (ok) {
      if (passwordToSave) {
        setUser(user.username, user.accessKey, user.role, user.firstName, user.lastName, passwordToSave);
      }
      if (isRememberToggleOn()) {
        setRememberedPassword(user.username, password);
        setRememberedUsername(user.username);
      } else {
        clearRememberedPassword(user.username);
        if (normalizeUsername(loadRememberedUsername()) === normalizeUsername(user.username)) {
          clearRememberedUsername();
        }
      }
      state.auth = { username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName };
      saveAuthSession({ username: user.username });
      applyRoleToUI(user.role);
      showApp();
      setStep(1);
      toast(
        (passwordToSave ? "Password created. Signed in as " : "Signed in as ") +
        user.username + " (" + roleLabel(user.role) + ").",
        "success"
      );
      resetLoginForm();
    } else {
      els.loginStatus.textContent = "Sign-in failed";
      els.loginStatus.className = "pt-pill solid-danger";
    }
    els.btnLogin.disabled = false;
    els.btnLogin.classList.remove("is-loading");
  });

  els.btnLogout.addEventListener("click", () => {
    clearAuthSession();
    state.auth = null;
    state.session = null;
    showLogin();
    toast("Logged out.", "success");
  });

  /* ---------------------------------------------------------------------
   * Step 1: Upload & scan Excel
   * ------------------------------------------------------------------- */
  els.uploadBox.addEventListener("click", () => els.fileInput.click());
  els.uploadBox.addEventListener("dragover", (e) => { e.preventDefault(); els.uploadBox.classList.add("dragover"); });
  els.uploadBox.addEventListener("dragleave", () => els.uploadBox.classList.remove("dragover"));
  els.uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    els.uploadBox.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      els.fileInput.files = e.dataTransfer.files;
      handleFile(e.dataTransfer.files[0]);
    }
  });
  els.fileInput.addEventListener("change", () => {
    if (els.fileInput.files[0]) handleFile(els.fileInput.files[0]);
  });

  function handleFile(file) {
    els.fileName.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", cellStyles: true });
        state.workbook = workbook;
        els.sheetSelect.innerHTML = "";
        workbook.SheetNames.forEach((name) => {
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          els.sheetSelect.appendChild(opt);
        });
        els.sheetSelect.disabled = false;
        els.btnParse.disabled = false;
        toast("File loaded. Choose a worksheet and scan it.", "success");
      } catch (err) {
        toast("Could not read this Excel file: " + err.message, "error");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  els.btnParse.addEventListener("click", () => {
    if (!state.workbook) return;
    const sheetName = els.sheetSelect.value;
    state.sheetName = sheetName;
    const sheet = state.workbook.Sheets[sheetName];
    if (!sheet || !sheet["!ref"]) {
      toast("Selected worksheet is empty.", "error");
      return;
    }
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const headers = [];
    for (let c = range.s.c; c <= range.e.c; c += 1) {
      const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c });
      const cell = sheet[cellRef];
      headers.push(cell && cell.v !== undefined ? String(cell.v) : colLetter(c));
    }
    state.headers = headers;

    const dataRows = [];
    for (let r = range.s.r + 1; r <= range.e.r; r += 1) {
      const cells = [];
      let hasAnyValue = false;
      for (let c = range.s.c; c <= range.e.c; c += 1) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        const cell = sheet[cellRef];
        const value = cell && cell.v !== undefined ? cell.v : "";
        if (value !== "") hasAnyValue = true;
        cells.push({ value, isRed: cellIsRedHighlighted(cell) });
      }
      if (hasAnyValue) dataRows.push({ rowIndex: r, cells });
    }
    state.dataRows = dataRows;

    const redRowCount = dataRows.filter((row) => row.cells.some((c) => c.isRed)).length;
    if (redRowCount === 0) {
      toast("No red-highlighted cells were found in this sheet.", "error");
    } else {
      toast(redRowCount + " row(s) contain red-highlighted changes.", "success");
    }

    buildMappingUI();
    setStep(2);
  });

  /* ---------------------------------------------------------------------
   * Step 3: Field mapping
   * ------------------------------------------------------------------- */
  function loadSavedMapping() {
    try {
      return JSON.parse(localStorage.getItem(MAPPING_STORAGE_KEY) || "{}");
    } catch (_e) {
      return {};
    }
  }

  function saveMapping(mappingByHeaderName) {
    try {
      localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(mappingByHeaderName));
    } catch (_e) { /* ignore quota errors */ }
  }

  function populateFieldDatalist() {
    const datalist = $("vtiger-field-list");
    if (!datalist) return;
    datalist.innerHTML = "";
    Object.keys(state.moduleFields).sort().forEach((name) => {
      const meta = state.moduleFields[name];
      const opt = document.createElement("option");
      opt.value = name;
      opt.label = meta.label ? meta.label + " (" + name + ")" : name;
      datalist.appendChild(opt);
    });
  }

  function buildMappingUI() {
    populateFieldDatalist();

    // Identifier column select
    els.identifierColumn.innerHTML = "";
    state.headers.forEach((h, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = h;
      els.identifierColumn.appendChild(opt);
    });
    const guessedIdx = state.headers.findIndex((h) =>
      /ticket/i.test(h) && /(no|num|#|id)/i.test(h)
    );
    els.identifierColumn.value = String(guessedIdx >= 0 ? guessedIdx : 0);

    // Columns that actually contain at least one red cell
    const redColumnIdx = new Set();
    state.dataRows.forEach((row) => {
      row.cells.forEach((cell, idx) => {
        if (cell.isRed) redColumnIdx.add(idx);
      });
    });

    const savedMapping = loadSavedMapping();
    els.mappingTableBody.innerHTML = "";
    state.mapping = {};
    state.included = {};

    state.headers.forEach((header, idx) => {
      if (Number(els.identifierColumn.value) === idx) return; // identifier isn't a "change" field
      if (!redColumnIdx.has(idx)) return;

      const sampleRow = state.dataRows.find((row) => row.cells[idx].isRed);
      const sampleValue = sampleRow ? sampleRow.cells[idx].value : "";

      const tr = document.createElement("tr");

      const tdHeader = document.createElement("td");
      tdHeader.textContent = header;
      tr.appendChild(tdHeader);

      const tdSample = document.createElement("td");
      tdSample.textContent = String(sampleValue).slice(0, 60);
      tr.appendChild(tdSample);

      const tdField = document.createElement("td");
      const fieldNames = Object.keys(state.moduleFields);
      let fieldControl;

      if (fieldNames.length > 0) {
        // Real vTiger field list is known: force a pick from it so a typo/label
        // can never be sent as a "field name" (that's what silently no-ops in vTiger).
        fieldControl = document.createElement("select");
        const blankOpt = document.createElement("option");
        blankOpt.value = "";
        blankOpt.textContent = "-- do not map --";
        fieldControl.appendChild(blankOpt);
        fieldNames
          .slice()
          .sort((a, b) => fieldLabel(a).localeCompare(fieldLabel(b)))
          .forEach((name) => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = fieldLabel(name);
            opt.title = name; // API name, shown on hover for reference
            fieldControl.appendChild(opt);
          });
        const savedPreset = savedMapping[header];
        const preset = savedPreset || guessBestFieldMatch(header);
        fieldControl.value = fieldNames.includes(preset) ? preset : "";

        const hint = document.createElement("div");
        hint.className = "muted";
        hint.style.fontSize = "0.75rem";
        hint.style.marginTop = "4px";
        if (fieldControl.value && !savedPreset) {
          hint.textContent = "Auto-detected — please confirm";
        } else if (!fieldControl.value) {
          hint.textContent = "No confident match — please select manually";
        }
        fieldControl.addEventListener("change", () => {
          state.mapping[idx] = fieldControl.value;
          hint.textContent = "";
        });
        tdField._hint = hint;
      } else {
        // describe() metadata wasn't available (e.g. connection issue) — fall back to
        // free text, best-effort only.
        fieldControl = document.createElement("input");
        fieldControl.type = "text";
        fieldControl.placeholder = "e.g. ticket_title";
        fieldControl.setAttribute("list", "vtiger-field-list");
        fieldControl.value = savedMapping[header] || guessFieldName(header);
        fieldControl.addEventListener("input", () => {
          state.mapping[idx] = fieldControl.value.trim();
        });
      }
      fieldControl.dataset.colIndex = String(idx);
      state.mapping[idx] = fieldControl.value;
      tdField.appendChild(fieldControl);
      if (tdField._hint) tdField.appendChild(tdField._hint);
      tr.appendChild(tdField);

      const tdInclude = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.addEventListener("change", () => {
        state.included[idx] = checkbox.checked;
      });
      tdInclude.appendChild(checkbox);
      tr.appendChild(tdInclude);

      state.included[idx] = true;

      els.mappingTableBody.appendChild(tr);
    });

    if (els.mappingTableBody.children.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.className = "muted";
      td.textContent = "No red-highlighted columns were detected in this sheet.";
      tr.appendChild(td);
      els.mappingTableBody.appendChild(tr);
    }
  }

  function guessFieldName(header) {
    return header
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function normalizeForMatch(s) {
    return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  /* Human-friendly display name for a vTiger API field name, e.g. "cf_943" -> "Category".
   * Falls back to the raw API name if no describe() label is known for it. */
  function fieldLabel(name) {
    const meta = state.moduleFields[name];
    return (meta && meta.label) ? meta.label : name;
  }

  function tokenize(s) {
    return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter(Boolean);
  }

  /* Word-overlap similarity (Jaccard over token sets), 0..1. */
  function tokenSimilarity(a, b) {
    const ta = tokenize(a);
    const tb = tokenize(b);
    if (ta.length === 0 || tb.length === 0) return 0;
    const setA = new Set(ta);
    const setB = new Set(tb);
    let intersection = 0;
    setA.forEach((t) => { if (setB.has(t)) intersection += 1; });
    const union = new Set([...ta, ...tb]).size;
    return intersection / union;
  }

  const AUTO_MAP_THRESHOLD = 0.4;

  /* Best-effort match of an Excel header to a real vTiger field, comparing against
   * both the field's API name and its display label. Tries exact matches first
   * (e.g. "Ticket Title" == label "Ticket Title"), then falls back to fuzzy
   * word-overlap / substring matching (e.g. "Internal Status" -> label "Status",
   * or "Assigned To" -> field "assigned_user_id" with label "Assigned To"). */
  function guessBestFieldMatch(header) {
    const target = normalizeForMatch(header);
    const guessedName = guessFieldName(header);

    let bestName = "";
    let bestScore = 0;

    Object.keys(state.moduleFields).forEach((name) => {
      const meta = state.moduleFields[name];
      const label = meta.label || "";
      const normName = normalizeForMatch(name);
      const normLabel = normalizeForMatch(label);

      let score = 0;
      if (name === guessedName || normName === target || normLabel === target) {
        score = 1; // exact match
      } else {
        const nameSim = tokenSimilarity(header, name.replace(/_/g, " "));
        const labelSim = tokenSimilarity(header, label);
        score = Math.max(nameSim, labelSim);

        // Containment bonus: e.g. "Internal Status" contains label "Status",
        // or label "Assigned To" is contained in header "Internal Assigned To".
        if (normLabel && (target.includes(normLabel) || normLabel.includes(target))) {
          score = Math.max(score, 0.6 + 0.4 * (Math.min(normLabel.length, target.length) /
            Math.max(normLabel.length, target.length)));
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestName = name;
      }
    });

    return bestScore >= AUTO_MAP_THRESHOLD ? bestName : "";
  }

  els.btnBuildReview.addEventListener("click", () => {
    state.identifierColIndex = Number(els.identifierColumn.value);

    const mappingByHeaderName = {};
    Object.keys(state.mapping).forEach((idx) => {
      mappingByHeaderName[state.headers[idx]] = state.mapping[idx];
    });
    saveMapping(mappingByHeaderName);

    const includedCols = Object.keys(state.mapping)
      .map(Number)
      .filter((idx) => state.included[idx] && state.mapping[idx]);

    if (includedCols.length === 0) {
      toast("Map at least one column to a vTiger field before continuing.", "error");
      return;
    }

    const reviewRows = [];
    state.dataRows.forEach((row) => {
      const changes = {};
      const fieldInclude = {};
      includedCols.forEach((idx) => {
        const cell = row.cells[idx];
        if (cell.isRed) {
          const fieldName = state.mapping[idx];
          changes[fieldName] = cell.value;
          fieldInclude[fieldName] = true;
        }
      });
      if (Object.keys(changes).length === 0) return;

      const ticketNo = row.cells[state.identifierColIndex]
        ? row.cells[state.identifierColIndex].value
        : "";
      if (!ticketNo) return;

      reviewRows.push({
        rowIndex: row.rowIndex,
        ticketNo: String(ticketNo),
        changes,
        fieldInclude,
        include: true,
      });
    });

    state.reviewRows = reviewRows;
    buildReviewUI();
    setStep(3);
  });

  /* ---------------------------------------------------------------------
   * Step 3: Review
   * ------------------------------------------------------------------- */
  function buildReviewUI() {
    const allFields = new Set();
    state.reviewRows.forEach((row) => Object.keys(row.changes).forEach((f) => allFields.add(f)));
    const fields = Array.from(allFields);

    els.reviewHeadRow.innerHTML = "";
    const thInclude = document.createElement("th");
    thInclude.textContent = "Include";
    els.reviewHeadRow.appendChild(thInclude);
    const thTicket = document.createElement("th");
    thTicket.textContent = "Ticket #";
    els.reviewHeadRow.appendChild(thTicket);
    fields.forEach((f) => {
      const th = document.createElement("th");
      th.textContent = fieldLabel(f);
      th.title = f; // API name, shown on hover for reference
      els.reviewHeadRow.appendChild(th);
    });

    els.reviewBody.innerHTML = "";
    state.reviewRows.forEach((row) => {
      const tr = document.createElement("tr");

      const tdInc = document.createElement("td");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = row.include;
      cb.addEventListener("change", () => { row.include = cb.checked; });
      tdInc.appendChild(cb);
      tr.appendChild(tdInc);

      const tdTicket = document.createElement("td");
      tdTicket.textContent = row.ticketNo;
      tr.appendChild(tdTicket);

      fields.forEach((f) => {
        const td = document.createElement("td");
        if (Object.prototype.hasOwnProperty.call(row.changes, f)) {
          const span = document.createElement("span");
          span.className = "cell-changed";
          span.textContent = String(row.changes[f]);
          span.title = "Click to exclude just this field";
          span.style.cursor = "pointer";
          span.addEventListener("click", () => {
            row.fieldInclude[f] = !row.fieldInclude[f];
            span.style.opacity = row.fieldInclude[f] ? "1" : "0.35";
            span.style.textDecoration = row.fieldInclude[f] ? "none" : "line-through";
          });
          td.appendChild(span);
        } else {
          td.textContent = "—";
        }
        tr.appendChild(td);
      });

      els.reviewBody.appendChild(tr);
    });

    els.reviewSummary.textContent =
      state.reviewRows.length + " ticket(s) with red-highlighted changes ready to review.";
  }

  els.btnGotoUpdate.addEventListener("click", () => {
    const activeRows = state.reviewRows.filter((r) => r.include);
    if (activeRows.length === 0) {
      toast("No rows selected for update.", "error");
      return;
    }
    setStep(4);
  });

  /* ---------------------------------------------------------------------
   * Step 4: Run the update against vTiger
   * ------------------------------------------------------------------- */
  els.btnRunUpdate.addEventListener("click", async () => {
    if (!state.session) {
      toast("Not connected to vTiger. Please reconnect.", "error");
      return;
    }
    const rows = state.reviewRows.filter((r) => r.include);
    if (rows.length === 0) {
      toast("No rows to update.", "error");
      return;
    }

    els.btnRunUpdate.disabled = true;
    els.progressWrap.hidden = false;
    els.resultsTable.hidden = false;
    els.resultsBody.innerHTML = "";

    let done = 0;
    for (const row of rows) {
      const fieldsToApply = {};
      Object.keys(row.changes).forEach((f) => {
        if (row.fieldInclude[f]) fieldsToApply[f] = row.changes[f];
      });

      const resultRow = { ticketNo: row.ticketNo, fields: Object.keys(fieldsToApply) };
      try {
        if (Object.keys(fieldsToApply).length === 0) {
          throw new Error("All fields excluded for this row.");
        }

        const unknownFields = Object.keys(fieldsToApply).filter(
          (f) => Object.keys(state.moduleFields).length > 0 && !state.moduleFields[f]
        );
        if (unknownFields.length > 0) {
          throw new Error(
            "Field name(s) not found on " + state.crm.module + ": " + unknownFields.join(", ") +
            ". vTiger silently ignores unknown fields, so nothing was sent for these — fix the mapping in step 2."
          );
        }

        const escapedTicket = String(row.ticketNo).replace(/'/g, "\\'");
        const queryStr =
          "select id from " + state.crm.module +
          " where " + state.crm.idField + " = '" + escapedTicket + "';";
        const matches = await VTiger.query(state.session.sessionName, queryStr);
        if (!matches || matches.length === 0) {
          throw new Error("No matching record found for this ticket number.");
        }
        const recordId = matches[0].id;

        // Resolve reference/owner fields (e.g. assigned-to) from a display name to the
        // actual vTiger record id the field needs, otherwise vTiger accepts the request
        // but silently drops the value.
        const resolvedFields = {};
        for (const fieldName of Object.keys(fieldsToApply)) {
          const fieldMeta = state.moduleFields[fieldName];
          resolvedFields[fieldName] = await resolveReferenceValue(
            state.session.sessionName, fieldMeta, fieldsToApply[fieldName]
          );
        }

        const fullRecord = await VTiger.retrieve(state.session.sessionName, recordId);
        Object.assign(fullRecord, resolvedFields);

        const updated = await VTiger.update(state.session.sessionName, fullRecord);

        const mismatches = Object.keys(resolvedFields).filter(
          (f) => String(updated[f] ?? "") !== String(resolvedFields[f] ?? "")
        );
        if (mismatches.length > 0) {
          throw new Error(
            "vTiger accepted the request but did not persist: " + mismatches.map(fieldLabel).join(", ") +
            ". Check the field is editable, not a formula/calculated field, and (for reference " +
            "fields) that the value could be matched to a record."
          );
        }

        resultRow.status = "success";
        resultRow.message = "Updated and verified successfully.";
      } catch (err) {
        resultRow.status = "error";
        resultRow.message = err.message;
      }

      appendResultRow(resultRow);
      done += 1;
      els.progressFill.style.width = Math.round((done / rows.length) * 100) + "%";
      els.progressText.textContent = "Processing " + done + " / " + rows.length;
    }

    els.btnRunUpdate.disabled = false;
    const successCount = els.resultsBody.querySelectorAll(".badge-success").length;
    toast(successCount + " / " + rows.length + " ticket(s) updated successfully.",
      successCount === rows.length ? "success" : "error");
  });

  function appendResultRow(result) {
    const tr = document.createElement("tr");

    const tdTicket = document.createElement("td");
    tdTicket.textContent = result.ticketNo;
    tr.appendChild(tdTicket);

    const tdFields = document.createElement("td");
    tdFields.textContent = result.fields.map(fieldLabel).join(", ") || "—";
    tr.appendChild(tdFields);

    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + (result.status === "success" ? "badge-success" : "badge-error");
    badge.textContent = result.status === "success" ? "Success" : "Failed";
    tdStatus.appendChild(badge);
    tr.appendChild(tdStatus);

    const tdMessage = document.createElement("td");
    tdMessage.textContent = result.message;
    tr.appendChild(tdMessage);

    els.resultsBody.appendChild(tr);
  }

  /* ---------------------------------------------------------------------
   * Settings modal
   * ------------------------------------------------------------------- */
  function openSettingsModal() {
    if (!state.auth || state.auth.role !== "admin") {
      toast("Only Admins can open Settings.", "error");
      return;
    }
    applySettingsToModalForm(loadSettings());
    renderUsersTable();
    els.settingsOverlay.hidden = false;
  }
  function closeSettingsModal() {
    els.settingsOverlay.hidden = true;
  }

  els.btnOpenSettings.addEventListener("click", openSettingsModal);
  els.btnSettingsClose.addEventListener("click", closeSettingsModal);
  els.settingsOverlay.addEventListener("click", (e) => {
    if (e.target === els.settingsOverlay) closeSettingsModal();
  });

  async function reconnectCurrentUser(crmConfig) {
    if (!state.auth) return;
    const user = getUser(state.auth.username);
    if (!user) return;
    await connectToVtiger(Object.assign({}, crmConfig, {
      username: user.username,
      accessKey: user.accessKey,
    }));
  }

  els.settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const settings = {
      url: els.settingsUrl.value.trim(),
      module: els.settingsModule.value.trim() || "HelpDesk",
      idField: els.settingsIdField.value.trim() || "ticket_no",
      timeoutMinutes: Math.max(0, parseInt(els.settingsTimeout.value, 10) || 0),
    };
    if (!settings.url) {
      toast("Please fill in the CRM URL.", "error");
      return;
    }
    saveSettings(settings);
    state.crm.timeoutMinutes = settings.timeoutMinutes;
    scheduleIdleTimer();
    closeSettingsModal();
    toast("Settings saved. Reconnecting...", "success");
    await reconnectCurrentUser(settings);
  });

  els.btnSettingsClear.addEventListener("click", async () => {
    try { localStorage.removeItem(SETTINGS_STORAGE_KEY); } catch (_e) { /* ignore */ }
    applySettingsToModalForm(DEFAULT_CRM_CONFIG);
    state.crm.timeoutMinutes = DEFAULT_CRM_CONFIG.timeoutMinutes;
    scheduleIdleTimer();
    toast("Settings reset to defaults. Reconnecting...", "success");
    await reconnectCurrentUser(DEFAULT_CRM_CONFIG);
  });

  /* ---------------------------------------------------------------------
   * User list admin UI (inside Settings modal)
   * ------------------------------------------------------------------- */
  let usersRoleSort = "asc"; // default sort: by role (admin first) — null (username order) | "asc" | "desc"

  function updateUsersRoleSortIcon() {
    if (!els.usersRoleTh) return;
    els.usersRoleTh.classList.toggle("sorted", !!usersRoleSort);
    const carets = els.usersRoleTh.querySelectorAll(".sort-icon svg");
    if (carets.length < 2) return;
    const [up, down] = carets;
    up.style.opacity = usersRoleSort === "asc" ? "1" : ".55";
    down.style.opacity = usersRoleSort === "desc" ? "1" : ".55";
  }

  if (els.usersRoleTh) {
    els.usersRoleTh.addEventListener("click", () => {
      usersRoleSort = usersRoleSort === "asc" ? "desc" : "asc";
      renderUsersTable();
    });
    els.usersRoleTh.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); els.usersRoleTh.click(); }
    });
  }

  function renderUsersTable() {
    const users = loadUsers();
    els.usersBody.innerHTML = "";
    updateUsersRoleSortIcon();
    Object.keys(users).sort((a, b) => {
      if (usersRoleSort) {
        const roleCmp = String(users[a].role || "member").localeCompare(users[b].role || "member");
        if (roleCmp !== 0) return usersRoleSort === "asc" ? roleCmp : -roleCmp;
      }
      return a.localeCompare(b);
    }).forEach((username) => {
      const record = users[username];
      const tr = document.createElement("tr");

      const tdUser = document.createElement("td");
      tdUser.textContent = username;
      tr.appendChild(tdUser);

      const tdName = document.createElement("td");
      const displayName = [record.firstName, record.lastName].filter(Boolean).join(" ").trim();
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control";
      nameInput.placeholder = "First Last";
      nameInput.value = displayName;
      nameInput.setAttribute("aria-label", "Name for " + username);
      function saveName() {
        const parts = nameInput.value.trim().split(/\s+/).filter(Boolean);
        const firstName = parts.shift() || "";
        const lastName = parts.join(" ");
        setUser(username, record.accessKey, record.role, firstName, lastName);
        record.firstName = firstName;
        record.lastName = lastName;
        if (state.auth && normalizeUsername(state.auth.username) === normalizeUsername(username)) {
          Object.assign(state.auth, { firstName, lastName });
          applyRoleToUI(state.auth.role);
        }
        toast("Name updated for " + username + ".", "success");
      }
      nameInput.addEventListener("blur", () => {
        const parts = nameInput.value.trim().split(/\s+/).filter(Boolean);
        const firstName = parts.shift() || "";
        const lastName = parts.join(" ");
        if (firstName === (record.firstName || "") && lastName === (record.lastName || "")) return;
        saveName();
      });
      nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); nameInput.blur(); }
      });
      tdName.appendChild(nameInput);
      tr.appendChild(tdName);

      const tdKey = document.createElement("td");
      const keyWrap = document.createElement("div");
      keyWrap.className = "access-key-cell";
      const keySpan = document.createElement("span");
      keySpan.textContent = "•".repeat(10);
      const revealBtn = document.createElement("button");
      revealBtn.type = "button";
      revealBtn.className = "btn-reveal-key";
      revealBtn.textContent = "Show";
      let revealed = false;
      revealBtn.addEventListener("click", () => {
        revealed = !revealed;
        keySpan.textContent = revealed ? record.accessKey : "•".repeat(10);
        revealBtn.textContent = revealed ? "Hide" : "Show";
      });
      keyWrap.appendChild(keySpan);
      keyWrap.appendChild(revealBtn);
      tdKey.appendChild(keyWrap);
      tr.appendChild(tdKey);

      const tdRole = document.createElement("td");
      const select = document.createElement("select");
      ["admin", "member"].forEach((r) => {
        const opt = document.createElement("option");
        opt.value = r;
        opt.textContent = roleLabel(r);
        if (record.role === r) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener("change", () => {
        setUser(username, record.accessKey, select.value, record.firstName, record.lastName);
        if (state.auth && normalizeUsername(state.auth.username) === normalizeUsername(username)) {
          toast("You changed your own role — it takes effect next time you sign in or reconnect.", "success");
        }
      });
      tdRole.appendChild(select);
      tr.appendChild(tdRole);

      const tdPassword = document.createElement("td");
      if (record.password) {
        const setTag = document.createElement("span");
        setTag.className = "fn-tag bubble-success";
        setTag.textContent = "Set";
        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.className = "btn-reveal-key";
        resetBtn.style.marginLeft = "8px";
        resetBtn.textContent = "Reset";
        resetBtn.addEventListener("click", () => {
          setUser(username, record.accessKey, record.role, record.firstName, record.lastName, null);
          record.password = null;
          if (state.auth && normalizeUsername(state.auth.username) === normalizeUsername(username)) {
            state.auth.password = null;
          }
          renderUsersTable();
          toast("Password reset for " + username + " — they'll set a new one at their next sign-in.", "success");
        });
        tdPassword.appendChild(setTag);
        tdPassword.appendChild(resetBtn);
      } else {
        const notSetTag = document.createElement("span");
        notSetTag.className = "fn-tag bubble-orange";
        notSetTag.textContent = "Not set";
        tdPassword.appendChild(notSetTag);
      }
      tr.appendChild(tdPassword);

      const tdRemove = document.createElement("td");
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-remove-user";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        removeUser(username);
        renderUsersTable();
      });
      tdRemove.appendChild(removeBtn);
      tr.appendChild(tdRemove);

      els.usersBody.appendChild(tr);
    });

    if (Object.keys(users).length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.className = "muted";
      td.textContent = "No users added yet — no one will be able to sign in until you add at least one.";
      tr.appendChild(td);
      els.usersBody.appendChild(tr);
    }
  }

  els.btnAddUser.addEventListener("click", () => {
    const username = els.newUserUsername.value.trim();
    const firstName = els.newUserFirstName.value.trim();
    const lastName = els.newUserLastName.value.trim();
    const accessKey = els.newUserAccessKey.value.trim();
    const role = els.newUserRole.value;
    if (!username || !accessKey) {
      toast("Enter both a username and an access key.", "error");
      return;
    }
    setUser(username, accessKey, role, firstName, lastName);
    els.newUserUsername.value = "";
    els.newUserFirstName.value = "";
    els.newUserLastName.value = "";
    els.newUserAccessKey.value = "";
    renderUsersTable();
    toast("User saved: " + username + ".", "success");
  });

  /* ---------------------------------------------------------------------
   * Initial state — try to silently restore a previous sign-in for this
   * browser tab session; otherwise show the login screen.
   * ------------------------------------------------------------------- */
  (async function init() {
    els.loginCrmUrl.textContent = "Connecting to: " + loadSettings().url;

    const storedAuth = loadAuthSession();
    if (storedAuth && storedAuth.username) {
      const user = getUser(storedAuth.username);
      if (user) {
        const ok = await connectToVtiger(Object.assign({}, loadSettings(), {
          username: user.username,
          accessKey: user.accessKey,
        }));
        if (ok) {
          state.auth = { username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName };
          applyRoleToUI(user.role);
          showApp();
          setStep(1);
          return;
        }
      }
      clearAuthSession();
      toast("Your session expired — please sign in again.", "error");
    }
    showLogin();
  })();
})();

/* ---------------------------------------------------------------------
 * Login screen image carousel — purely decorative, auto-advances on a
 * fixed timer (no controls). Independent of the app above so a missing
 * image or an empty carousel never affects sign-in.
 * ------------------------------------------------------------------- */
(function () {
  "use strict";
  const carousel = document.getElementById("login-carousel");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".login-carousel-slide");
  const dots = carousel.querySelectorAll(".login-carousel-dots .dot");
  if (slides.length < 2) return;

  /* The frame is a fixed size (see CSS) — this only ever toggles opacity on
   * the images themselves, so nothing on the page reflows when it advances. */
  const intervalMs = Number(carousel.dataset.interval) || 3000;
  let index = 0;

  setInterval(() => {
    slides[index].classList.remove("is-active");
    if (dots[index]) dots[index].classList.remove("is-active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-active");
    if (dots[index]) dots[index].classList.add("is-active");
  }, intervalMs);
})();
