// templates/app-page/ds-base.js
// Loads the Altametrics Growth Design System into this template.
// If you copied this template into a consuming project, keep `base`
// pointing at wherever the design system files live.
(() => {
  const base = '../..';

  // Suppress paint + transitions until DS styles arrive, so components don't
  // flash unstyled (and .btn/.fn-* transitions don't animate from UA defaults).
  const guard = document.createElement('style');
  guard.textContent = 'html.ds-loading body{visibility:hidden} html.ds-loading *{transition:none!important;animation:none!important}';
  document.head.appendChild(guard);
  document.documentElement.classList.add('ds-loading');
  const reveal = () => {
    // Force a style flush WHILE transitions are still disabled, so the freshly
    // loaded sheet's values commit without animating from UA defaults…
    void getComputedStyle(document.body || document.documentElement).visibility;
    // …then un-hide; nothing changes visually, so no transitions start.
    document.documentElement.classList.remove('ds-loading');
  };

  let pending = 0;
  for (const p of ['styles.css']) { // DS global stylesheets (tokens + components)
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + '/' + p;
    pending++;
    l.onload = l.onerror = () => { if (--pending === 0) reveal(); };
    document.head.appendChild(l);
  }
  if (pending === 0) reveal();
  setTimeout(reveal, 3000); // never hold the page hostage

  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => {}; // tolerate a not-yet-compiled bundle
  document.head.appendChild(s);
  // NOTE: hw-header.js (the header markup + dropdown/support behavior) is inlined
  // INTO _ds_bundle.js by the compiler and runs on load — no separate <script> needed.
})();
