# vTiger CRM Auto Update

A static, front-end-only tool that reads an Excel sheet, finds the cells you highlighted in **red**, and pushes those changes straight into **vTiger CRM** through its public Webservice API — matching records by **Ticket Number**.

No backend, no build step, no server-side storage. Everything runs in your browser.

## How it works

The app opens on a **login screen** that first asks for your **username**, then a **password**. Behind the scenes, the app looks your username up in the admin-managed **Users** list (see below), pulls the matching vTiger access key, and uses it to sign in via vTiger's own `login` webservice call. Your entry in that list also decides your **role** for this session:

- **Admin** — full access, including **Settings** and **Documentation**.
- **Team Member** — access to the ticket-update wizard and **Reconnect** only; Settings and Documentation are hidden.

Once signed in, a status pill in the header shows *Connected* / *Connection failed*, and **Reconnect** lets you retry without logging out. The actual ticket-update workflow is a 4-step wizard:

1. **Upload** — upload the `.xlsx` file that contains your tracked changes and pick the worksheet to scan.
2. **Map Fields** — tell the app which Excel column holds the Ticket Number (the unique identifier), and map every other red-highlighted column to the matching vTiger field API name. Mappings are remembered in your browser for next time.
3. **Review** — see exactly which tickets and fields will change. Uncheck any row or click a highlighted value to exclude just that field.
4. **Update** — click the button and the app looks up each ticket by number, retrieves the current record, applies only the mapped/red fields, and calls vTiger's `update` operation. A results table shows success/failure per ticket.

Cell scanning happens right after you pick a worksheet in step 1: the app inspects every cell's fill color and flags cells with a red-ish background as pending changes.

## Passwords: set at first sign-in

No one — not even an Admin — sets another user's password directly. Instead:

1. An Admin adds a user to the **Users** list with just a username, name, vTiger access key, and role (no password).
2. The login screen shows username and password together. The first time that person signs in, a **Confirm Password** field appears automatically as soon as they leave the username field (the app recognizes they have no password yet) — whatever they enter is saved as their password the moment their vTiger connection succeeds.
3. Every sign-in after that asks for that same username + password; a wrong password blocks sign-in before it ever touches vTiger.
4. If someone forgets their password, an **Admin** can **reset** it from Settings → Users → Password column → **Reset**. That clears the stored password, so the next time they sign in the Confirm Password field reappears — the admin never sees or sets the new one.
5. **Remember my password on this device** — a toggle on the login screen. Turn it on and both the **username and password** are saved in this browser's `localStorage`; the login screen then shows up already filled in — including right after **Log Out** or an automatic [session timeout](#settings-admins-only) — instead of asking you to retype them. Turn it off (or never turn it on) and neither is stored. Same trust model as the access-key list below: convenient for a trusted personal or shared device, not something to enable on a public one.

## Project structure

```
index.html                          Markup / app shell (auto-connect header + 4-step wizard + settings modal)
css/style.css                       Page-layout only (spacing/structure) — component look-and-feel comes from the design system
js/app.js                           All application logic (Excel parsing, vTiger API calls, UI wiring)
assets/                             Logo/favicon (SVG)
Altametrics Growth Design System/   The design system this UI is built on (tokens, components, icons, fonts)
```

The Excel parsing library ([SheetJS/xlsx](https://github.com/SheetJS/sheetjs)) is loaded from a CDN in `index.html`. If you need a fully offline copy, download `xlsx.full.min.js` and reference it locally instead of the CDN `<script>` tag.

## Styling: Altametrics Growth Design System

All buttons, inputs, tables, the settings dialog, pills/tags, the avatar, and the progress/spinner
UI are the **Altametrics Growth Design System**'s own component classes (`.btn`, `.form-control`,
`.pt-table`/`.pt-wrap`, `.fn-modal-*`, `.fn-tag`, `.fn-avtar`, `.fn-progress`, `.fn-spinner`, Phosphor
icons via `<iconify-icon>`), loaded from `Altametrics Growth Design System/styles.css`. `css/style.css`
only adds page-specific layout (the login screen, the step wizard shell, the upload dropzone) — every
value in it is a design-system token (`var(--space-*)`, `var(--radius-*)`, color tokens), never a raw
hex or invented size. See `Altametrics Growth Design System/docs/` for the full component/token
reference if you extend this UI.

## Important: CORS

This app calls vTiger's `webservice.php` directly from the browser using `fetch`. Because there is intentionally **no backend/proxy**, the browser enforces the standard **Cross-Origin Resource Sharing (CORS)** policy:

- If you host this app on the **same domain** as your vTiger CRM, requests work without any extra configuration.
- If you host it elsewhere (e.g. GitHub Pages), your vTiger web server (Apache/Nginx in front of vTiger) must send `Access-Control-Allow-Origin` headers permitting this app's origin, and must respond correctly to any CORS preflight requests. Ask your vTiger administrator to enable this if you see a network/CORS error on the login screen.

Because vTiger's `webservice.php` is normally same-origin only, this is a limitation of using a pure static/front-end app — it is not a bug in this project.

## Detecting "red" highlights

The app treats a cell as changed if its fill color is red-dominant (red channel clearly higher than green and blue), which covers plain red fills as well as common "light red" highlight tones used for tracked changes/conditional formatting. Cell background colors are read from the workbook's styles, so the source file must be a real `.xlsx`/`.xls` with cell fill formatting (not just red text).

## Field mapping tips

- The **Ticket Number** column is the unique identifier used to look up each vTiger record; it does not need to be red-highlighted itself.
- Only columns that contain at least one red cell are shown in the mapping step.
- Field names must match vTiger's internal **API field names**, not the on-screen labels (e.g. use `ticket_title`, not "Title"). After connecting, the app calls vTiger's `describe` operation and offers matching field names as autocomplete suggestions in the mapping step; a field name not recognized by the connected module is outlined in red.
- Mappings are saved per-browser (via `localStorage`) so you don't have to redo them for every upload with the same column headers.
- For reference/owner fields (e.g. "assigned to"), you can put a plain name in Excel (like a vTiger username) — the app looks up the matching Users/Groups record and resolves it to the real vTiger id before sending the update.

## Why a "Success" result can still mean nothing changed

vTiger's `update` Webservice operation returns `success: true` as long as the request itself is well-formed — it does **not** error out just because a field name doesn't exist on the module, or because a reference/owner field was given a value it can't use (e.g. a display name instead of a record id). In both cases vTiger silently ignores that one field rather than rejecting the whole update.

To catch this, the app now:

1. Rejects any mapped field name that isn't in the connected module's field list (from `describe`) *before* sending anything, instead of letting vTiger silently drop it.
2. Attempts to resolve name-like values for reference/owner fields to actual vTiger record ids.
3. Compares the record vTiger returns after `update` against the values you intended to set, and reports the row as **failed** (with the specific field names) if any of them didn't actually persist — instead of trusting the bare `success: true`.

## Settings (Admins only)

Click **Settings** in the header to set the shared **CRM URL**, **ticket module**, **unique identifier field**, and **Session Timeout** once. These are saved in this browser's `localStorage` and apply to everyone who signs in on this device — personal usernames/access keys are never entered here, only on the login screen. Use **Reset to Defaults** to restore the built-in placeholder values.

**Session Timeout (minutes)** signs a user out automatically after that many minutes with no mouse/keyboard/scroll activity — same effect as clicking **Log Out**, with a toast explaining why. Set it to `0` (or leave it blank) to disable auto sign-out entirely. Changing it while someone is signed in applies immediately, without needing to reconnect.

## Users (Admins only)

Also inside **Settings**, Admins manage the full list of people who can sign in — each entry has a **username**, **first/last name**, that user's own **vTiger access key**, and a **role**:

- **Add / Update User** adds a brand-new user, or overwrites an existing user's name, access key, and role — it never sets their password (see [Passwords](#passwords-set-at-first-sign-in) above).
- Each row in the table also has its own **Role** dropdown for quickly promoting/demoting someone without retyping their access key, and a **Show/Hide** toggle to reveal an access key when you need to verify it.
- The **Password** column shows **Not set** (they'll create one at their next sign-in) or **Set**, with a **Reset** button to clear it and put them through that first-sign-in flow again — for example if they forget it.
- First/last name is used only for display — in the Users table and in the profile menu after signing in (initials avatar, full name, username, role). It's optional; if left blank, the username is shown instead.
- Anyone who tries to log in with a username *not* on this list is rejected with "Username not found."
- The default login (`alta_support`) is seeded as **Admin** the first time the app runs on a browser, with no password until its first sign-in.

This list — **including every listed access key and password** — is stored per-browser via `localStorage`. It is **not** a real access-control or credential-vault system: anyone comfortable with browser dev tools could read `localStorage` directly and see every user's access key or password, or edit roles. This exists purely as a convenience for a trusted internal team sharing a device, so that most people never have to know or type an access key at all — don't use it for credentials that must stay confidential, and don't treat the Admin/Team Member split (or the password step) as protecting anything from a determined user of the same browser.

## Sharing the app with your team

There is **no backend**, so the Users list and Settings live only in the browser where they were entered. Sending a teammate the app's URL is not enough — their browser starts empty, so their username isn't on the list and they're rejected with **"Username not found."** To onboard them:

1. **Admin:** open **Settings → Users → Export Setup File**. This downloads `crm-auto-update-setup.json` containing the CRM settings and the user list.
2. **Send that file to your team privately** — Teams, Slack DM, email. **Never commit it to the repository** (it contains everyone's vTiger access keys; `.gitignore` already blocks that filename as a safety net).
3. **Teammate:** open the app's URL and click **"First time on this device? Import team setup file"** at the bottom of the login card, then pick the file. Their browser is now set up.
4. They sign in with their own username and create their own password on that first sign-in.

Notes:

- **Passwords are never exported.** Each person sets their own on their own device, so the file only carries usernames, names, roles, and access keys.
- Importing **merges**: entries in the file are added or updated, anything already on that device is left alone, and a password already set on that device is preserved — so you can re-send an updated file after adding people, without resetting anyone.
- Admins can also use **Import Setup File** inside Settings to load a file (e.g. moving your own setup to a new laptop).
- Whenever you add or remove people, export and re-share the file — there's nothing that syncs automatically.

## Login sessions

Signing in stores your **username only** in `sessionStorage` (not `localStorage`) — your access key and role are always looked up fresh from the Users list on reconnect, so an admin's changes to your role or key take effect the next time you reconnect or log in. This means:

- Reloading the page or navigating within the same browser tab keeps you signed in.
- Closing the tab/browser clears it — you'll need to sign in again next time.
- Click your avatar in the header to open the profile menu, showing your name, username, and role, and to **Log Out** (which clears it immediately).
- If your username is removed from the Users list while you're signed in, **Reconnect** will fail and tell you to contact your admin.

## Security notes

> ⚠️ **Hosting this on a public GitHub Pages site publishes `js/app.js` — including the seeded `alta_support` access key baked into `DEFAULT_USERS`.** Anyone who finds the page can read that key from the source and use it against your vTiger instance. If this app is (or ever was) deployed publicly: rotate that access key in vTiger, and replace the seeded entry with a placeholder so no real credential is committed. Everyone else's keys should arrive via the [exported setup file](#sharing-the-app-with-your-team), never through the repo.

- Your vTiger access key (looked up from the Users list) is used only to call your own vTiger server from your own browser session; nothing is sent to any third party.
- The exported setup file contains access keys in clear text — share it privately and delete stray copies; it is `.gitignore`d so it can't be committed by accident.
- The login session itself (your username) lives only in `sessionStorage` for the current browser tab — never written to `localStorage`.
- Your login password is checked locally against the value stored in the Users list before the app ever calls vTiger — it is **not** your vTiger password and vTiger never sees it.
- The Users list and the Admin/Team Member split are a **UI convenience**, not a security boundary (see Users above) — every listed access key and password is readable by anyone with access to this browser's dev tools.
- Always review the **Review** step carefully before clicking **Update** — updates are applied immediately to live CRM records.

## Running locally

No build tools required. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static file server, e.g.:

```bash
npx serve .
```

## Deploying

Any static host works (GitHub Pages, Netlify, an internal web server, or the same server that runs vTiger). Just publish the folder as-is — see the [CORS](#important-cors) note above for cross-domain hosting.

## License

Use and adapt freely within your organization.
