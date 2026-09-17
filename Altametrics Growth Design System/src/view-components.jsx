/* ============================================================================
   AG Design System — view-components.jsx
   Live demos for every fn-* / hw-* component in foundation + hw-foundation.
   ============================================================================ */

/* =============================== BUTTON =================================== */
function ViewButton() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  function fire() { setLoading(true); setTimeout(() => { setLoading(false); toast.success("Saved successfully"); }, 1400); }

  return (
    <main className="ds-main">
      <ComponentHead name="Button" selector="<fn-button>" ngModule="FnButtonModule"
        summary="Action triggers. One primary per page/form. Destructive confirmations use danger. Secondary actions use outline-secondary." />

      <h2 className="ds-h2">Types</h2>
      <Demo code={`<fn-button type="primary"   text="Save"></fn-button>
<fn-button type="success"   text="Approve"></fn-button>
<fn-button type="danger"    text="Delete"></fn-button>
<fn-button type="warning"   text="Pending"></fn-button>
<fn-button type="orange"    text="Boost"></fn-button>
<fn-button type="info"      text="Details"></fn-button>
<fn-button type="dark"      text="Dark"></fn-button>
<fn-button type="secondary" text="Cancel"></fn-button>`}>
        <div className="ds-row">
          <FnButton type="primary"   text="Save" />
          <FnButton type="success"   text="Approve" />
          <FnButton type="danger"    text="Delete" />
          <FnButton type="warning"   text="Pending" />
          <FnButton type="orange"    text="Boost" />
          <FnButton type="info"      text="Details" />
          <FnButton type="dark"      text="Dark" />
          <FnButton type="secondary" text="Cancel" />
        </div>
      </Demo>

      <h2 className="ds-h2">Outline variants</h2>
      <Demo code={`<fn-button type="outline-primary"   text="Primary"></fn-button>
<fn-button type="outline-success"   text="Success"></fn-button>
<fn-button type="outline-danger"    text="Danger"></fn-button>
<fn-button type="outline-secondary" text="Cancel"></fn-button>`}>
        <div className="ds-row">
          <FnButton type="outline-primary"   text="Primary" />
          <FnButton type="outline-success"   text="Success" />
          <FnButton type="outline-danger"    text="Danger" />
          <FnButton type="outline-warning"   text="Warning" />
          <FnButton type="outline-info"      text="Info" />
          <FnButton type="outline-secondary" text="Cancel" />
        </div>
      </Demo>

      <h2 className="ds-h2">Sizes & shape</h2>
      <Demo code={`<!-- packed class style (idiomatic) -->
<fn-button [type]="'primary btn-xs btn-round'" text="Add"></fn-button>

<!-- explicit -->
<fn-button type="primary" shape="round" btnClass="btn-xs" text="Add"></fn-button>`}>
        <div className="ds-row">
          <FnButton type="primary btn-xs" text="xs" />
          <FnButton type="primary btn-sm" text="sm" />
          <FnButton type="primary"        text="default" />
          <FnButton type="primary btn-lg" text="lg" />
          <FnButton type="primary btn-round" text="round" iconAddonBefore="plus" />
          <FnButton type="primary" text="square" className="btn-square" />
          <FnButton type="primary" text="disabled" disabled />
        </div>
      </Demo>

      <h2 className="ds-h2">With icons</h2>
      <Demo code={`<fn-button type="outline-primary" iconAddonBefore="ph-arrows-clockwise" text="Refresh"></fn-button>
<fn-button type="primary"          iconAddonBefore="ph-plus" [type]="'primary btn-round'" text="Add shift"></fn-button>
<fn-button type="outline-secondary" iconAddonAfter="ph-arrow-right" text="Continue"></fn-button>`}>
        <div className="ds-row">
          <FnButton type="outline-primary"   iconAddonBefore="arrows-clockwise" text="Refresh" />
          <FnButton type="primary btn-round" iconAddonBefore="plus"             text="Add shift" />
          <FnButton type="outline-secondary" iconAddonAfter="arrow-right"       text="Continue" />
          <FnButton type="danger btn-sm"     iconAddonBefore="trash"            text="Delete" />
        </div>
      </Demo>

      <h2 className="ds-h2">Loading state</h2>
      <Demo code={`<fn-button type="primary" text="Save" [isLoading]="saving" textLoading="COMMON.SAVING"></fn-button>`}>
        <div className="ds-row">
          <FnButton type="primary" text="Save" isLoading={loading} textLoading="Saving…" onClick={fire} />
          <span className="muted" style={{ fontSize: 12 }}>Click → 1.4s loading → success toast (top-right)</span>
        </div>
      </Demo>

      <h2 className="ds-h2">Button group</h2>
      <Demo code={`<div class="btn-group btn-group-round">
  <button class="btn btn-outline-primary active">Day</button>
  <button class="btn btn-outline-primary">Week</button>
  <button class="btn btn-outline-primary">Month</button>
</div>`}>
        <div className="btn-group btn-group-round">
          <button className="btn btn-outline-primary" style={{ background: "var(--blue)", color: "#fff" }}>Day</button>
          <button className="btn btn-outline-primary">Week</button>
          <button className="btn btn-outline-primary">Month</button>
        </div>
      </Demo>

      <h2 className="ds-h2">Props</h2>
      <PropTable rows={[
        { name: "type", type: "string", def: "'primary'", desc: "Color variant. Can pack extra classes (e.g. 'primary btn-xs btn-round'). One of primary, success, danger, warning, info, orange, dark, secondary, plus outline-* variants." },
        { name: "shape", type: "'circle' | 'round' | null", def: "null", desc: "Pill shape modifier." },
        { name: "text", type: "string", desc: "Label (passed through fnTranslate)." },
        { name: "iconAddonBefore", type: "string", desc: "Phosphor class name before the label." },
        { name: "iconAddonAfter", type: "string", desc: "Phosphor class name after the label." },
        { name: "isLoading", type: "boolean", def: "false", desc: "Replaces label with spinner + textLoading." },
        { name: "textLoading", type: "string", def: "'Loading…'", desc: "Label shown while isLoading is true." },
        { name: "btnType", type: "'submit'|'button'|'reset'", def: "'submit'", desc: "Native button type." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables click and lowers opacity to .6." },
      ]} />

      <A11yNote items={[
        "Always native <button>. Never <div role='button'>. Foundation's a11yClickable directive is the escape hatch when a real button isn't viable (e.g. clickable <li> in a list).",
        "Icon-only buttons: use the a11yIconBtn directive which stamps aria-label on host + aria-hidden on inner glyphs.",
        "Loading button gets aria-busy='true' so screen readers announce the state change.",
        "Disabled buttons keep their tooltip + label so context isn't lost.",
      ]} />
    </main>
  );
}

/* =============================== INPUT ==================================== */
function ViewInput() {
  const [val, setVal] = useState("");
  const [pwd, setPwd] = useState("");
  return (
    <main className="ds-main">
      <ComponentHead name="Text input" selector="<fn-base-input> / <fn-input>" ngModule="FnInputModule"
        summary="The text input primitive. Height is fixed at 30px. Labels sit above at 12px / 500. Errors render below in red. Wraps a ControlValueAccessor so formControlName works directly." />

      <h2 className="ds-h2">Sizes & states</h2>
      <Demo code={`<label class="fn-label">Email</label>
<fn-base-input
  [(ngModel)]="model.email"
  id="email" name="email" type="EMAIL"
  placeholder="name@co.com"
  [isRequired]="true" [maxLength]="255">
</fn-base-input>`}>
        <div className="ds-grid ds-cols-3">
          <FormGroup id="email" label="Email" required>
            <FnInput type="email" placeholder="name@co.com" value={val} onChange={(e) => setVal(e.target.value)} />
          </FormGroup>
          <FormGroup id="pwd" label="Password" required>
            <FnInput type="password" placeholder="••••••••" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          </FormGroup>
          <FormGroup id="ro" label="Disabled">
            <FnInput value="Read only" disabled />
          </FormGroup>
          <FormGroup id="err" label="With error" error="Minimum 5 characters required">
            <FnInput value="abc" />
          </FormGroup>
          <FormGroup id="ok" label="Valid">
            <FnInput value="sana@altametrics.com" isValid />
          </FormGroup>
          <FormGroup id="round" label="Rounded">
            <FnInput rounded placeholder="Search…" />
          </FormGroup>
        </div>
      </Demo>

      <h2 className="ds-h2">Input groups</h2>
      <Demo code={`<div class="input-group">
  <span class="input-group-text"><fn-icon icon="ph-magnifying-glass"></fn-icon></span>
  <input class="form-control" placeholder="Search shifts">
</div>`}>
        <div className="ds-grid ds-cols-3">
          <FnInput prefix={<Ph name="magnifying-glass" />} placeholder="Search shifts" />
          <FnInput prefix="$" suffix="USD" placeholder="0.00" />
          <FnInput prefix={<Ph name="user" />} placeholder="Employee name" />
        </div>
      </Demo>

      <h2 className="ds-h2">Textarea</h2>
      <Demo code={`<textarea class="form-control" rows="4" placeholder="Notes"></textarea>`}>
        <FormGroup id="notes" label="Shift notes" help="Visible to the assigned employee and managers.">
          <FnTextarea placeholder="Add notes, special instructions, or context…" rows={3} />
        </FormGroup>
      </Demo>

      <h2 className="ds-h2">Supported types (<code className="ds-inline">FN_INPUT_TYPES</code>)</h2>
      <div className="ds-card">
        <div className="ds-row">
          {["TEXT","PASSWORD","STRING","PHONENUMBER","NUMBER","CURRENCY","FLOAT","DOUBLE","EMAIL","BOOL","TEXTAREA","LOOKUP","MULTILOOKUP","COLOR","TEMPERATURE"].map((t) => <FnTag key={t} color="secondary">{t}</FnTag>)}
        </div>
      </div>

      <h2 className="ds-h2">Validation directives</h2>
      <div className="ds-card">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 13 }}>
          <li><code className="ds-inline">FnInputValidator</code> — attach for inline error rendering.</li>
          <li><code className="ds-inline">fnNumberDirective</code>, <code className="ds-inline">fnCurrencyDirective</code>, <code className="ds-inline">fnTemperatureDirective</code> — restrict input types (in <code className="ds-inline">FnCoreModule</code>).</li>
          <li><code className="ds-inline">fnAutoFocus</code> — focus on init.</li>
          <li>Regex constants in <code className="ds-inline">fn-form.constant.ts</code>: <code className="ds-inline">EMAIL_REGEX</code>, <code className="ds-inline">FLOAT_NUM_REGEX</code>, <code className="ds-inline">INT_NUM_REGEX</code>. Reuse — never write new regex.</li>
        </ul>
      </div>

      <A11yNote items={[
        "Every input inside .form-group is auto-associated by A11yFormFieldDirective via aria-labelledby. Keep the <label> as a sibling inside .form-group.",
        "Required fields announce 'required' to screen readers via aria-required='true'.",
        "Errors render with role='alert' and are referenced by aria-describedby on the input.",
        "Disabled state never communicates information via color alone — it pairs with reduced opacity + the not-allowed cursor.",
      ]} />
    </main>
  );
}

/* =============================== SELECT =================================== */
function ViewSelect() {
  const employeeTypes = [
    { id: 1, name: "Assistant Manager" },
    { id: 2, name: "Crew" },
    { id: 3, name: "Manager" },
    { id: 4, name: "Shift Manager" },
  ];
  const sites = [
    { id: 1, name: "Riverside Bistro" },
    { id: 2, name: "Downtown Grill" },
    { id: 3, name: "Lakeside Café" },
    { id: 4, name: "Summit Tap Room" },
    { id: 5, name: "Eastside Pizzeria" },
  ];
  const [empType, setEmpType] = useState(2);
  const [siteIds, setSiteIds] = useState([]);

  return (
    <main className="ds-main">
      <ComponentHead name="Select" selector="<fn-select> / <fn-multi-select>" ngModule="FnSelectModule"
        summary="Single + multi select backed by @ng-select/ng-select. 38px trigger height, 6px radius, brand maroon caret. Selected option in the menu is bold (no background tint)." />

      <h2 className="ds-h2">States</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Resting · Opened · Multi (with empty) · Disabled.
      </p>

      <div className="ds-grid ds-cols-2" style={{ gap: 24 }}>
        {/* Resting */}
        <div className="ds-preview surface" style={{ minHeight: 130 }}>
          <span className="preview-label">resting</span>
          <FormGroup id="emp-type-1" label="Employee Type">
            <FnSelect items={employeeTypes} value={empType} onChange={setEmpType} placeholder="Select…" />
          </FormGroup>
        </div>

        {/* Opened — shows selected option in bold */}
        <div className="ds-preview surface" style={{ minHeight: 330 }}>
          <span className="preview-label">opened</span>
          <FormGroup id="emp-type-2" label="Employee Type">
            <SelectAlwaysOpen items={employeeTypes} value={2} />
          </FormGroup>
        </div>

        {/* Multi — empty results */}
        <div className="ds-preview surface" style={{ minHeight: 160 }}>
          <span className="preview-label">multi · no items</span>
          <FormGroup id="sites" label="Assign Site(s)">
            <SelectAlwaysOpen items={[]} multi placeholder="Select Site(s)" />
          </FormGroup>
        </div>

        {/* Disabled */}
        <div className="ds-preview surface" style={{ minHeight: 130 }}>
          <span className="preview-label">disabled</span>
          <FormGroup id="order-type" label="Order Type">
            <FnSelect items={[{id:1, name:"Pickup"},{id:2,name:"Delivery"}]} value={1} disabled placeholder="Select…" />
          </FormGroup>
        </div>
      </div>

      <h2 className="ds-h2">Live multi-select</h2>
      <Demo code={`<fn-multi-select
  [items]="sites"
  bindLabel="name" bindValue="id"
  [(ngModel)]="selectedSiteIds"
  placeholder="Select Site(s)">
</fn-multi-select>`}>
        <div style={{ maxWidth: 480 }}>
          <FormGroup id="sites-live" label="Assign Site(s)" help="Click to open. Pick multiple — they appear as chips inside the trigger.">
            <FnSelect items={sites} value={siteIds} onChange={setSiteIds} multi placeholder="Select Site(s)" />
          </FormGroup>
        </div>
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<fn-select
  [items]="employeeTypes"
  bindLabel="name" bindValue="id"
  [(ngModel)]="form.empType"
  placeholder="Select…">
</fn-select>

<fn-multi-select
  [items]="sites"
  bindLabel="name" bindValue="id"
  [(ngModel)]="form.siteIds"
  placeholder="Select Site(s)">
</fn-multi-select>`) }} /></pre>

      <A11yNote items={[
        "fn-select passes [labelForId] to ng-select so the internal search input gets autocomplete='off' (fixes axe autocomplete-valid).",
        "Empty state ('No_Items_Found') has role='option' aria-disabled='true' — required for aria-required-children on role='listbox'.",
        "Keyboard: Enter/Space to open, Esc to close, arrow keys to navigate options, Tab to commit & move.",
        "Selected option is communicated to AT via aria-selected='true' (not just bold styling) — meets WCAG 1.4.1 (color not sole means).",
      ]} />
    </main>
  );
}

/* Helper — shows the select with its menu permanently visible, for the spec sheet */
function SelectAlwaysOpen({ items, value, multi, placeholder = "Select…" }) {
  const selected = !multi && items.find((it) => it.id === value);
  return (
    <div style={{ position: "relative" }}>
      <div className="fn-select is-open" aria-expanded="true" role="combobox" tabIndex={-1}>
        {multi ? <span className="placeholder">{placeholder}</span>
               : (selected ? <span className="value">{selected.name}</span> : <span className="placeholder">{placeholder}</span>)}
        <span className="caret caret-main" style={{ marginLeft: "auto", transform: "rotate(180deg)" }} aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      <div className="fn-select-menu" role="listbox" style={{ position: "static", marginTop: 4 }}>
        {items.length === 0 ? (
          <div role="option" aria-disabled="true" className="menu-empty">No_Items_Found</div>
        ) : items.map((it) => (
          <div key={it.id} role="option" aria-selected={it.id === value}
               className={`option ${it.id === value ? "selected" : ""}`}>
            <span>{it.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================== SWITCH =================================== */
function ViewSwitch() {
  const [on, setOn] = useState(true);
  return (
    <main className="ds-main">
      <ComponentHead name="Switch" selector="<fn-switch>" ngModule="FnSwitchModule"
        summary="Two-state toggle with keyboard support (←/→/Space/Enter). Supports lg/md/sm sizes and custom on/off templates." />

      <h2 className="ds-h2">States & sizes</h2>
      <Demo code={`<fn-switch [(ngModel)]="prefs.notify" fnSize="lg"></fn-switch>`}>
        <div className="ds-row" style={{ gap: 24 }}>
          <FnSwitch size="sm" checked={on} onChange={setOn} ariaLabel="Notifications" />
          <FnSwitch size="md" checked={on} onChange={setOn} ariaLabel="Notifications" />
          <FnSwitch size="lg" checked={on} onChange={setOn} ariaLabel="Notifications" />
          <FnSwitch size="md" checked={false} disabled ariaLabel="Disabled off" />
          <FnSwitch size="md" checked={true}  disabled ariaLabel="Disabled on" />
        </div>
      </Demo>

      <h2 className="ds-h2">Inline with label</h2>
      <Demo>
        <div className="ds-stack" style={{ gap: 14, maxWidth: 360 }}>
          <SwitchRow label="Shift reminders"    desc="Push notification 30min before your shift" />
          <SwitchRow label="Manager approvals"  desc="Email me when shift swaps need review" />
          <SwitchRow label="Late-clock-in alert" desc="Page me if anyone is >15min late" defaultOn />
        </div>
      </Demo>

      <A11yNote items={[
        "role='switch' + aria-checked. Foundation's component does this for you.",
        "Always associate with a visible label — either as <label> sibling or via ariaLabel.",
        "Disabled switches keep tab-stop removed but maintain visual contrast.",
      ]} />
    </main>
  );
}
function SwitchRow({ label, desc, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  const id = useMemo(() => "sw-" + Math.random().toString(36).slice(2, 7), []);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 14px", border: "1px solid var(--border-default-color)", borderRadius: 6, background: "var(--bg-primary)" }}>
      <div>
        <label id={id} style={{ fontWeight: 500, fontSize: 13, display: "block", marginBottom: 2 }}>{label}</label>
        <div className="muted" style={{ fontSize: 11.5 }}>{desc}</div>
      </div>
      <FnSwitch checked={on} onChange={setOn} ariaLabelledBy={id} />
    </div>
  );
}

/* =============================== CHECKBOX / RADIO ========================= */
function ViewCheckbox() {
  const [opts, setOpts] = useState({ a: true, b: false, c: true });
  const [pick, setPick] = useState("week");
  return (
    <main className="ds-main">
      <ComponentHead name="Checkbox & Radio" selector="<fn-checkbox>, <fn-input-radio>, <fn-checkbox-filter>" ngModule="FnInputModule"
        summary="Standard checkbox + grouped radio + checkbox-filter (multi-select filter list)." />

      <h2 className="ds-h2">Checkbox</h2>
      <Demo code={`<fn-checkbox id="agree" name="agree" label="I accept the terms" [(ngModel)]="form.agree"></fn-checkbox>`}>
        <div className="ds-stack" style={{ gap: 10 }}>
          <FnCheckbox checked={opts.a} onChange={(v) => setOpts({ ...opts, a: v })} label="Allow weekend shifts" />
          <FnCheckbox checked={opts.b} onChange={(v) => setOpts({ ...opts, b: v })} label="Receive SMS notifications" />
          <FnCheckbox checked={opts.c} onChange={(v) => setOpts({ ...opts, c: v })} label="Auto-clock-out at end of shift" />
          <FnCheckbox checked={false} disabled label="Disabled option" />
        </div>
      </Demo>

      <h2 className="ds-h2">Radio group</h2>
      <Demo code={`<fn-input-radio name="tier" [options]="[{id:'day',label:'Day'},{id:'week',label:'Week'},{id:'month',label:'Month'}]" [(ngModel)]="form.range"></fn-input-radio>`}>
        <FnRadioGroup name="range" value={pick} onChange={setPick} options={[
          { id: "day", label: "Day" },
          { id: "week", label: "Week" },
          { id: "month", label: "Month" },
          { id: "quarter", label: "Quarter", disabled: true },
        ]} />
      </Demo>

      <h2 className="ds-h2">Checkbox filter (list)</h2>
      <Demo code={`<fn-checkbox-filter [config]="filterCfg" (selectionChange)="onFilter($event)"></fn-checkbox-filter>`}>
        <div style={{ width: 280, padding: 12, border: "1px solid var(--border-default-color)", borderRadius: 6, background: "var(--bg-primary)" }}>
          <div className="ds-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Filter by role</span>
            <a style={{ fontSize: 11, color: "var(--blue)", cursor: "pointer" }}>Clear</a>
          </div>
          <FnInput rounded placeholder="Search" prefix={<Ph name="magnifying-glass" size="12px" />} />
          <div className="ds-stack" style={{ gap: 8, marginTop: 10 }}>
            {["Server","Bartender","Line cook","Host","Dishwasher"].map((r, i) => (
              <FnCheckbox key={r} checked={i < 2} onChange={() => {}} label={<span>{r} <span className="muted">({[12,8,7,5,4][i]})</span></span>} />
            ))}
          </div>
        </div>
      </Demo>

      <A11yNote items={[
        "Checkbox + radio inside .form-group get auto-associated labels via A11yFormFieldDirective.",
        "Radio group uses role='radiogroup' with arrow-key navigation; first radio is the focus target.",
        "Hit target is at least 16×16px for the indicator + 8px gap to the label — total target ≥36px.",
      ]} />
    </main>
  );
}

/* =============================== DATE ===================================== */
function ViewDate() {
  const [single, setSingle] = useState(new Date(2026, 4, 27));
  const [range, setRange] = useState({ from: new Date(2019, 11, 10), to: new Date(2019, 11, 17) });

  return (
    <main className="ds-main">
      <ComponentHead name="Date pickers" selector="<fn-date-picker>, <fn-date-range-picker>" ngModule="FnDatePickerModule · FnDateRangeModule"
        summary="Two flavors. Single = pill-shaped btn-group with prev/next chevrons either side of the date trigger; opens a single-month calendar. Range = pill input with calendar prefix + drop caret; opens a dual-month calendar with Cancel/Apply pill buttons in the footer." />

      <h2 className="ds-h2">Single date picker — <code className="ds-inline">&lt;fn-date-picker&gt;</code></h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Three-button pill: prev day, calendar trigger (with date + drop caret), next day. The two chevron buttons step the date by one day. The center button opens the calendar.
      </p>

      <div className="ds-grid ds-cols-2" style={{ gap: 20 }}>
        <div className="ds-preview surface" style={{ minHeight: 100 }}>
          <span className="preview-label">resting</span>
          <FnDatePicker value={single} onChange={setSingle} />
        </div>
        <div className="ds-preview surface" style={{ minHeight: 100 }}>
          <span className="preview-label">hide prev/next</span>
          <FnDatePicker value={single} onChange={setSingle} hideNextPrev />
        </div>
      </div>

      <div className="ds-card flush" style={{ marginTop: 16, padding: 20, minHeight: 440, background: "var(--bg-primary)" }}>
        <div style={{ fontSize: 11, color: "var(--iron)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, marginBottom: 12 }}>Opened</div>
        <div style={{ position: "relative", height: 420 }}>
          <FnDatePickerOpen value={single} onChange={setSingle} />
        </div>
      </div>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<!-- Default — with prev/next chevrons -->
<fn-date-picker
  [(ngModel)]="form.shiftDate"
  [hideNextPrev]="false">
</fn-date-picker>

<!-- Trigger only (no prev/next) -->
<fn-date-picker
  [(ngModel)]="form.shiftDate"
  [hideNextPrev]="true">
</fn-date-picker>`) }} /></pre>

      <h2 className="ds-h2" style={{ marginTop: 48 }}>Date range picker — <code className="ds-inline">&lt;fn-date-range-picker&gt;</code></h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Single pill input shows the range as <code className="ds-inline">YYYY/MM/DD - YYYY/MM/DD</code>. Opening reveals two months side-by-side. Day headers use <code className="ds-inline">var(--theme)</code>; the range fill is <code className="ds-inline">var(--theme-fade)</code>; start/end days are solid theme circles. Footer has a red Cancel + green Apply pill.
      </p>

      <div className="ds-grid ds-cols-2" style={{ gap: 20 }}>
        <div className="ds-preview surface" style={{ minHeight: 100 }}>
          <span className="preview-label">resting</span>
          <FnDateRangePicker value={range} onChange={setRange} />
        </div>
        <div className="ds-preview surface" style={{ minHeight: 100 }}>
          <span className="preview-label">disabled</span>
          <FnDateRangePicker value={range} disabled />
        </div>
      </div>

      <div className="ds-card flush" style={{ marginTop: 16, padding: 20, minHeight: 460, background: "var(--bg-primary)" }}>
        <div style={{ fontSize: 11, color: "var(--iron)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, marginBottom: 12 }}>Opened — dual-month with range</div>
        <div style={{ position: "relative", height: 440 }}>
          <FnDateRangeOpen from={new Date(2019, 11, 10)} to={new Date(2019, 11, 17)} />
        </div>
      </div>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<fn-date-range-picker
  [(ngModel)]="range"
  [fnMinDate]="minDate" [fnMaxDate]="maxDate"
  [markDisabled]="isDisabled">
</fn-date-range-picker>`) }} /></pre>

      <div className="ds-card">
        <b>Format tokens</b> live in <code className="ds-inline">fn-date-format.constant.ts</code>. Always use <code className="ds-inline">date.formatter(FN_DATE_FORMAT.MM_DD_YYYY)</code> — never hand-formatted strings.
      </div>

      <A11yNote items={[
        "Trigger has aria-haspopup='dialog' and aria-expanded; the popup uses role='dialog' with aria-label.",
        "Calendar grid is role='grid' with each day cell role='gridcell' and aria-selected on the chosen day.",
        "Keyboard: arrow keys navigate days, PgUp/PgDn month, Shift+PgUp/PgDn year, Home/End to week edges, Enter selects.",
        "Range picker: first click sets the start; second click sets the end. Apply commits; Cancel reverts.",
      ]} />
    </main>
  );
}

/* Always-open helpers for the spec sheet */
function FnDatePickerOpen({ value, onChange }) {
  const [date, setDate] = useState(value);
  const [vm, setVm] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  return (
    <div className="single-date-picker" style={{ position: "relative" }}>
      <div className="btn-group btn-group-round" role="group">
        <button type="button" className="btn btn-sm btn-outline-secondary dp-prev" aria-label="Previous date">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary dp-center">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="dp-cal-icon">
            <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 1.5V4M11 1.5V4M2 7H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span className="dp-date">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
          <span className="dp-drop" aria-hidden="true">
            <svg width="8" height="5" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
          </span>
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary dp-next" aria-label="Next date">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <CalendarPopup viewMonth={vm} setViewMonth={setVm} selected={date} onPick={(d) => { setDate(d); onChange && onChange(d); }} />
    </div>
  );
}

function FnDateRangeOpen({ from, to }) {
  const [leftMonth, setLeftMonth] = useState(new Date(from.getFullYear(), from.getMonth(), 1));
  return (
    <div className="date-range-picker-input is-open" style={{ position: "relative" }}>
      <span className="drp-cal-prefix" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 1.5V4M11 1.5V4M2 7H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </span>
      <input className="form-control input-round"
             value={`${from.getFullYear()}/${String(from.getMonth() + 1).padStart(2, "0")}/${String(from.getDate()).padStart(2, "0")} - ${to.getFullYear()}/${String(to.getMonth() + 1).padStart(2, "0")}/${String(to.getDate()).padStart(2, "0")}`} readOnly />
      <span className="drp-drop" aria-hidden="true">
        <svg width="8" height="5" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
      </span>
      <div className="drp-popup" style={{ top: "calc(100% + 8px)" }}>
        <div className="drp-months">
          <DRMonth which="left"  month={leftMonth} setMonth={setLeftMonth} from={from} to={to} pick={() => {}} />
          <DRMonth which="right" month={new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)}
                   setMonth={(d) => setLeftMonth(new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                   from={from} to={to} pick={() => {}} />
        </div>
        <div className="drp-footer">
          <button type="button" className="btn btn-danger btn-xs btn-round" style={{ width: 96 }}>Cancel</button>
          <button type="button" className="btn btn-success btn-xs btn-round" style={{ width: 96 }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

/* =============================== TIME ===================================== */
function ViewTime() {
  const [single, setSingle] = useState("12:00a");
  const [duration, setDuration] = useState("00:00");
  const [range, setRange] = useState("12:00a-2:00p");

  return (
    <main className="ds-main">
      <ComponentHead name="Time picker" selector="<fn-time-picker> / <fn-multi-time-picker> / <fn-duration-time-picker>" ngModule="FnTimePickerModule"
        summary="Three sibling components in the time/ folder. All share the .fn-time-picker-search markup: <input class='form-control'> + <i class='fn-global-dropdownArrow'> + <ul class='fn-time-picker-ul'>. Active dropdown item paints var(--theme) with white text. Single picker can show a '+1 Day' badge when the shift crosses midnight." />

      <h2 className="ds-h2">Three variants</h2>

      <div className="ds-grid ds-cols-3" style={{ gap: 20 }}>
        {/* Single — 12h with meridiem */}
        <div className="ds-preview surface" style={{ minHeight: 360 }}>
          <span className="preview-label">single · 12:00a</span>
          <FormGroup id="t-single" label="Start time">
            <FnTime mode="single" value={single} onChange={setSingle} ariaLabel="Start time" />
          </FormGroup>
          <div className="muted" style={{ fontSize: 11, marginTop: 6, fontFamily: "var(--ds-mono)" }}>value: {single}</div>
        </div>

        {/* Duration — 24h */}
        <div className="ds-preview surface" style={{ minHeight: 360 }}>
          <span className="preview-label">duration · 00:00</span>
          <FormGroup id="t-duration" label="Break duration" help="Type '00:2' to filter the dropdown.">
            <FnTime mode="duration" value={duration} onChange={setDuration} ariaLabel="Break duration" />
          </FormGroup>
          <div className="muted" style={{ fontSize: 11, marginTop: 6, fontFamily: "var(--ds-mono)" }}>value: {duration}</div>
        </div>

        {/* Range — multi */}
        <div className="ds-preview surface" style={{ minHeight: 360 }}>
          <span className="preview-label">range · 12:00a-2:00P</span>
          <FormGroup id="t-range" label="Shift window">
            <FnTime mode="range" value={range} onChange={setRange} ariaLabel="Shift window" />
          </FormGroup>
          <div className="muted" style={{ fontSize: 11, marginTop: 6, fontFamily: "var(--ds-mono)" }}>value: {range}</div>
        </div>
      </div>

      <h2 className="ds-h2">Spanning midnight — single picker</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        When the parent shift form computes that an end-time crosses midnight, the picker shows a <code className="ds-inline">+1 Day</code> badge at the right edge — driven by the <code className="ds-inline">isNextDay</code> input.
      </p>
      <Demo>
        <div style={{ maxWidth: 240 }}>
          <FormGroup id="t-next" label="End time">
            <FnTime mode="single" value="2:00a" isNextDay onChange={() => {}} />
          </FormGroup>
        </div>
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<!-- Single time (12h or 24h via isMilitaryTime) -->
<fn-time-picker
  [(ngModel)]="shift.start"
  [isMilitaryTime]="false"
  [isNextDay]="endsTomorrow"
  placeholder="12:00a">
</fn-time-picker>

<!-- Duration (24h, no meridiem) -->
<fn-duration-time-picker
  [(ngModel)]="shift.break"
  placeholder="00:00">
</fn-duration-time-picker>

<!-- Range (one input, "start-end" string) -->
<fn-multi-time-picker
  [(ngModel)]="shift.window"
  placeholder="12:00a-2:00p">
</fn-multi-time-picker>`) }} /></pre>

      <h2 className="ds-h2">Props (common to all three)</h2>
      <PropTable rows={[
        { name: "value / ngModel", type: "string", desc: "Time string. Format depends on mode: '12:00a' (single), '00:00' (duration), '12:00a-2:00p' (range)." },
        { name: "isMilitaryTime", type: "boolean", def: "false", desc: "fn-time-picker only — switches the value format and dropdown to 24-hour." },
        { name: "isNextDay", type: "boolean", def: "false", desc: "fn-time-picker only — renders the '+1 Day' badge inside the trigger." },
        { name: "isDisabled", type: "boolean", def: "false", desc: "Disables typing and the dropdown." },
        { name: "placeholder", type: "string", desc: "Shown when no value." },
        { name: "appendTo", type: "string (CSS selector)", desc: "Where to append the dropdown <ul> — for use inside scrollable containers." },
      ]} />

      <A11yNote items={[
        "Trigger is a real <input class='form-control'> — supports direct typing, screen-reader announcement of value, and the global focus ring.",
        "Caret icon is the custom-font glyph fn-global-dropdownArrow — auto-rotates 180° when the dropdown is open via the .fn-open-dropdown modifier class.",
        "Keyboard: type to filter, ArrowUp/Down to move the active option, Enter to commit, Tab/Escape to close.",
        "The dropdown <ul> has role='listbox' and each <li> is role='option' with aria-selected on the current value.",
        "Active highlight uses both color (var(--theme) bg + white text) AND aria-selected — meets WCAG 1.4.1.",
      ]} />
    </main>
  );
}

/* =============================== TEL / COLOR / FILES / EDITOR / RATING ==== */
const TEL_COUNTRIES = [
  { c: "af", name: "Afghanistan", dial: "+93" },
  { c: "ax", name: "Åland Islands", dial: "+358" },
  { c: "al", name: "Albania", dial: "+355" },
  { c: "dz", name: "Algeria", dial: "+213" },
  { c: "as", name: "American Samoa", dial: "+1" },
  { c: "ad", name: "Andorra", dial: "+376" },
  { c: "in", name: "India", dial: "+91" },
  { c: "gb", name: "United Kingdom", dial: "+44" },
  { c: "us", name: "United States", dial: "+1" },
  { c: "ca", name: "Canada", dial: "+1" },
  { c: "au", name: "Australia", dial: "+61" },
  { c: "de", name: "Germany", dial: "+49" },
  { c: "fr", name: "France", dial: "+33" },
  { c: "es", name: "Spain", dial: "+34" },
  { c: "it", name: "Italy", dial: "+39" },
  { c: "jp", name: "Japan", dial: "+81" },
  { c: "cn", name: "China", dial: "+86" },
  { c: "br", name: "Brazil", dial: "+55" },
  { c: "mx", name: "Mexico", dial: "+52" },
  { c: "ae", name: "United Arab Emirates", dial: "+971" },
];
function ViewTel() {
  const [country, setCountry] = useState(TEL_COUNTRIES.find((x) => x.c === "us"));
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const filtered = q ? TEL_COUNTRIES.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()) || x.dial.includes(q)) : TEL_COUNTRIES;

  return (
    <main className="ds-main">
      <ComponentHead name="Phone input" selector="<fn-tel-input>" ngModule="FnTelInputModule"
        summary="Phone input with a searchable country-code dropdown. Wraps intl-tel-input — clicking the flag opens a filterable list of countries with flag + name + dial code." />
      <Demo code={`<fn-tel-input [(ngModel)]="form.phone" [defaultCountry]="'us'" [enableSearch]="true"></fn-tel-input>`}>
        <div style={{ maxWidth: 360 }}>
          <FormGroup id="tel" label="Phone">
            <div style={{ display: "flex", alignItems: "stretch", position: "relative" }} ref={ref}>
              <button type="button" aria-haspopup="listbox" aria-expanded={open}
                      onClick={() => setOpen((v) => !v)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 30, padding: "0 10px", border: "1px solid var(--input-border-color)", borderRight: 0, borderRadius: "4px 0 0 4px", background: "var(--input-bg)", color: "var(--body-textColor)", fontSize: 12, cursor: "pointer" }}>
                <img src={`https://flagcdn.com/${country.c}.svg`} alt="" style={{ width: 20, height: 14, borderRadius: 2, objectFit: "cover" }} />
                <span style={{ fontFamily: "var(--ds-mono)" }}>{country.dial}</span>
                <Ph name="caret-down" size="10px" style={{ color: "var(--iron)" }} />
              </button>
              <FnInput placeholder="Phone Number" style={{ borderRadius: "0 4px 4px 0" }} />
              {open && (
                <div className="fn-select-menu" role="listbox" style={{ position: "absolute", top: 36, left: 0, right: 0, padding: 0, maxHeight: 280 }}>
                  <div className="menu-search" style={{ position: "sticky", top: 0, background: "var(--bg-primary)", padding: 8 }}>
                    <FnInput rounded prefix={<Ph name="magnifying-glass" size="12px" />} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
                  </div>
                  {filtered.map((x) => (
                    <div key={x.c + x.name} role="option" aria-selected={country.c === x.c}
                         className={`option ${country.c === x.c ? "selected" : ""}`}
                         onClick={() => { setCountry(x); setOpen(false); setQ(""); }}
                         style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={`https://flagcdn.com/${x.c}.svg`} alt="" style={{ width: 22, height: 15, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{x.name}</span>
                      <span className="muted" style={{ fontFamily: "var(--ds-mono)", fontSize: 12 }}>{x.dial}</span>
                    </div>
                  ))}
                  {filtered.length === 0 && <div className="menu-empty">No countries found</div>}
                </div>
              )}
            </div>
          </FormGroup>
        </div>
      </Demo>
      <A11yNote items={[
        "Country trigger is a real <button> with aria-haspopup='listbox' + aria-expanded.",
        "The list is role='listbox' with role='option' rows; the selected country gets aria-selected='true'.",
        "Search input is auto-focused on open; Esc / outside-click closes the dropdown.",
        "Flags are decorative (alt='') — the country name + dial code carry the meaning.",
      ]} />
    </main>
  );
}

function ViewColorPicker() {
  const [color, setColor] = useState("#005bc4");
  const swatches = ["#005bc4","#1e7e34","#bf5700","#fdc91e","#c62828","#0078a8","#7b42ff","#4b5563"];
  return (
    <main className="ds-main">
      <ComponentHead name="Color picker" selector="<fn-color-picker>" ngModule="FnColorPickerModule"
        summary="Wraps ngx-color-picker. Clicking the swatch opens a popover with a saturation/value box, a hue slider, the current-color preview, and Cancel / OK. Use for theming, tag colors, calendar event colors." />
      <Demo code={`<fn-color-picker [id]="'color-picker'" [(ngModel)]="favColor" name="color"></fn-color-picker>`}>
        <div style={{ maxWidth: 420 }}>
          <FormGroup id="cp" label="Event color">
            <FnColorPicker value={color} onChange={setColor} />
          </FormGroup>
        </div>
      </Demo>

      <h2 className="ds-h2">Preset swatches</h2>
      <Demo>
        <div className="ds-row" style={{ gap: 6 }}>
          {swatches.map((c) => (
            <button key={c} onClick={() => setColor(c)}
                    style={{ width: 26, height: 26, borderRadius: 6, background: c, border: c === color ? "2px solid var(--body-textColor)" : "1px solid var(--border-default-color)", cursor: "pointer" }}
                    aria-label={`Pick ${c}`} />
          ))}
          <code className="ds-inline" style={{ marginLeft: 8 }}>{color}</code>
        </div>
      </Demo>

      <A11yNote items={[
        "Trigger swatch is a <button> with aria-label exposing the current hex; aria-haspopup='dialog'.",
        "Saturation box + hue slider are keyboard-operable (arrow keys nudge); Esc closes, OK commits.",
        "Selected color value is always shown as text (hex) — never communicated by the swatch alone.",
      ]} />
    </main>
  );
}

/* HSV ↔ HEX helpers */
function hsvToHex(h, s, v) {
  s /= 100; v /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${to(f(5))}${to(f(3))}${to(f(1))}`;
}
function hexToHsv(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  if ([r, g, b].some(Number.isNaN)) return { h: 210, s: 100, v: 77 };
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return { h, s: max ? (d / max) * 100 : 0, v: max * 100 };
}

function FnColorPicker({ value = "#005bc4", onChange }) {
  const [open, setOpen] = useState(false);
  const init = hexToHsv(value);
  const [hsv, setHsv] = useState(init);
  const [draft, setDraft] = useState(value);
  const ref = useRef();
  const satRef = useRef();

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function key(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", key); };
  }, []);

  useEffect(() => { setDraft(hsvToHex(hsv.h, hsv.s, hsv.v)); }, [hsv]);

  function pickSat(e) {
    const rect = satRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setHsv((p) => ({ ...p, s: x * 100, v: (1 - y) * 100 }));
  }
  function dragSat(e) {
    e.preventDefault(); pickSat(e);
    const move = (ev) => pickSat(ev);
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move); document.addEventListener("mouseup", up);
  }

  return (
    <div style={{ position: "relative", display: "block" }} ref={ref}>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={`Color ${value}`}
              onClick={() => { setHsv(hexToHsv(value)); setOpen((v) => !v); }}
              style={{ width: 84, height: 36, borderRadius: 6, background: value, border: "1px solid var(--input-border-color)", cursor: "pointer" }} />

      {open && (
        <div className="cp-popover" role="dialog" aria-label="Choose color"
             style={{ position: "absolute", top: 44, left: 0, zIndex: 60, width: 320, background: "var(--bg-primary)", border: "1px solid var(--border-default-color)", borderRadius: 12, boxShadow: "var(--shadow)", padding: 14 }}>
          {/* saturation / value box */}
          <div ref={satRef} onMouseDown={dragSat}
               style={{ position: "relative", height: 170, borderRadius: 8, cursor: "crosshair",
                        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))` }}>
            <span style={{ position: "absolute", left: `${hsv.s}%`, top: `${100 - hsv.v}%`, width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,.3)", background: draft }} />
          </div>
          {/* hue slider + preview */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <span style={{ width: 38, height: 38, borderRadius: "50%", background: draft, border: "1px solid var(--border-default-color)", flexShrink: 0 }} />
            <div style={{ position: "relative", flex: 1, height: 14, borderRadius: 999, background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}>
              <input type="range" min="0" max="360" value={hsv.h}
                     onChange={(e) => setHsv((p) => ({ ...p, h: +e.target.value }))}
                     aria-label="Hue"
                     style={{ position: "absolute", inset: 0, width: "100%", margin: 0, opacity: 0, cursor: "pointer" }} />
              <span style={{ position: "absolute", left: `${(hsv.h / 360) * 100}%`, top: "50%", width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,.3)", background: `hsl(${hsv.h} 100% 50%)`, pointerEvents: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <FnInput value={draft} onChange={(e) => { setDraft(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) setHsv(hexToHsv(e.target.value)); }} style={{ width: 110, fontFamily: "var(--ds-mono)" }} />
            <div style={{ flex: 1 }} />
            <FnButton type="danger btn-sm btn-round" text="Cancel" onClick={() => setOpen(false)} />
            <FnButton type="primary btn-sm btn-round" text="OK" onClick={() => { onChange?.(draft); setOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function ViewFiles() {
  return (
    <main className="ds-main">
      <ComponentHead name="File upload" selector="<fn-img-upload>, <fn-files-upload>" ngModule="FnImgUploadModule, FnFilesUploadModule"
        summary="Image and multi-file upload with preview, drag-and-drop, and progress." />
      <h2 className="ds-h2">Image upload</h2>
      <Demo code={`<fn-img-upload [(ngModel)]="employee.avatar" [maxSize]="2 * 1024 * 1024"></fn-img-upload>`}>
        <div style={{ width: 220, padding: 24, border: "2px dashed var(--input-border-color)", borderRadius: 8, textAlign: "center", background: "var(--bg-primary)" }}>
          <Ph name="image-square" weight="duotone" size="32px" style={{ color: "var(--iron)" }} />
          <div style={{ fontSize: 12, fontWeight: 500, marginTop: 8 }}>Drop image or click to browse</div>
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>PNG or JPG up to 2MB</div>
        </div>
      </Demo>

      <h2 className="ds-h2">Multi-file with progress</h2>
      <Demo>
        <div className="ds-card flush" style={{ marginBottom: 0 }}>
          {[
            { name: "Shift-schedule-week-12.pdf", size: "382 KB", progress: 100, done: true },
            { name: "Employee-onboarding.docx", size: "1.4 MB", progress: 64 },
            { name: "Photos-staff-meeting.zip", size: "12.8 MB", progress: 28 },
          ].map((f, i) => (
            <div key={i} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-default-color)", display: "flex", gap: 12, alignItems: "center" }}>
              <Ph name={f.done ? "file-text" : "file"} size="20px" style={{ color: f.done ? "var(--green)" : "var(--blue)" }} />
              <div className="flex-1">
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
                <div className="ds-row" style={{ gap: 8, fontSize: 11, color: "var(--iron)" }}>
                  <span>{f.size}</span>
                  <span>•</span>
                  <span>{f.done ? "Uploaded" : `${f.progress}%`}</span>
                </div>
                {!f.done && <FnProgress value={f.progress} />}
              </div>
              <button className="ds-iconbtn" aria-label="Remove"><Ph name="x" /></button>
            </div>
          ))}
        </div>
      </Demo>
    </main>
  );
}

function ViewEditor() {
  return (
    <main className="ds-main">
      <ComponentHead name="Rich text editor" selector="<fn-text-editor>" ngModule="FnTextEditorModule"
        summary="Wraps suneditor. Used for shift notes, employee bios, release notes, FAQ content." />
      <Demo code={`<fn-text-editor [(ngModel)]="note.body" [config]="editorCfg"></fn-text-editor>`}>
        <div style={{ border: "1px solid var(--border-default-color)", borderRadius: 6, background: "var(--bg-primary)" }}>
          <div style={{ display: "flex", gap: 4, padding: 6, borderBottom: "1px solid var(--border-default-color)", background: "var(--body-bg)", borderRadius: "6px 6px 0 0" }}>
            {[["text-b","Bold"],["text-italic","Italic"],["text-underline","Underline"]].map(([i, l]) => (
              <button key={i} className="ds-iconbtn" style={{ height: 26, width: 26, padding: 0 }} aria-label={l}><Ph name={i} size="14px" /></button>
            ))}
            <span style={{ width: 1, background: "var(--border-default-color)", margin: "0 4px" }} />
            {[["list-bullets","Bullets"],["list-numbers","Numbered"]].map(([i, l]) => (
              <button key={i} className="ds-iconbtn" style={{ height: 26, width: 26, padding: 0 }} aria-label={l}><Ph name={i} size="14px" /></button>
            ))}
            <span style={{ width: 1, background: "var(--border-default-color)", margin: "0 4px" }} />
            {[["link","Link"],["image-square","Image"],["code","Code"]].map(([i, l]) => (
              <button key={i} className="ds-iconbtn" style={{ height: 26, width: 26, padding: 0 }} aria-label={l}><Ph name={i} size="14px" /></button>
            ))}
          </div>
          <div style={{ padding: 16, minHeight: 140, fontSize: 13, lineHeight: 1.6 }}>
            <p style={{ margin: 0, marginBottom: 8 }}><b>Weekend coverage</b> needs an extra server Fri/Sat 5–10pm.</p>
            <p style={{ margin: 0 }}>Reach out to Priya or Marco — both opted in for extra shifts.</p>
          </div>
        </div>
      </Demo>
    </main>
  );
}

function ViewRatingPage() {
  const [val, setVal] = useState(4);
  return (
    <main className="ds-main">
      <ComponentHead name="Rating" selector="<fn-rating>" ngModule="FnRatingModule"
        summary="Star rating control. 1–5 (configurable). Read-only and interactive modes." />
      <Demo code={`<fn-rating [(ngModel)]="review.score" [max]="5"></fn-rating>`}>
        <div className="ds-stack">
          <FnRating value={val} onChange={setVal} />
          <span className="muted" style={{ fontSize: 12 }}>Selected: {val} / 5</span>
          <div className="ds-row">
            <span style={{ fontSize: 13, fontWeight: 500 }}>Customer review:</span>
            <FnRating value={5} readOnly />
            <span className="muted" style={{ fontSize: 12 }}>"Fast service, super friendly host."</span>
          </div>
        </div>
      </Demo>
    </main>
  );
}

/* =============================== TABLE ==================================== */
function ViewTable() {
  /* ============ DEMO 1 — Templates (matches the user's screenshot) ============ */
  const templates = useMemo(() => {
    const names  = ["Summer Promo Banner","Happy Hour Video","Breakfast Menu Board","Drive-Thru Special","Weekend Deals Reel","Kids Meal Spotlight","Combo Offer Slide","New Arrivals Showcase","Loyalty Program Ad","Grand Opening Banner","Flash Sale Countdown","Anniversary Promo","Catering Highlight","Pickup Special","Family Pack Promo"];
    const sources = ["PCM","EzCater","PlumCater"];
    const dely    = ["Pickup","Delivery"];
    const pushed  = ["Pushed","No"];
    const paid    = ["Paid","Unpaid","Refunded"];
    const thumbs  = ["forest","ocean","flag","road","barn","field","tree","beach"];
    return names.map((n, i) => ({
      id: `TPL-${String(i + 1).padStart(3, "0")}`,
      thumbnail: thumbs[i % thumbs.length],
      name: n,
      source: sources[i % sources.length],
      eventDate: `0${(i % 5) + 3}/${10 + (i * 2 % 18) || 10}/2025`,
      delivery: dely[i % 2],
      total: 120 + ((i * 73) % 500),
      pushed: pushed[i % 2],
      status: "Accepted",
      paid: paid[i % 3],
      enabled: i % 4 === 0,
    }));
  }, []);

  // Tiny gradient SVG thumbnails (placeholders)
  function ThumbBox({ kind }) {
    const palettes = {
      forest:  ["#a3c5a8", "#5d8c63"],
      ocean:   ["#5da3d4", "#2c5e8a"],
      flag:    ["#c44e4e", "#dde2e9"],
      road:    ["#d6a86b", "#7d553b"],
      barn:    ["#8a6f50", "#c4ad88"],
      field:   ["#b6c970", "#5e7a3a"],
      tree:    ["#6b8a5b", "#3d5c30"],
      beach:   ["#e7c895", "#8db2c4"],
    };
    const [c1, c2] = palettes[kind] || ["#9ca3af", "#4b5563"];
    return (
      <div style={{ width: 36, height: 22, borderRadius: 3, background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, display: "inline-block" }} aria-hidden="true" />
    );
  }

  const tplColumns = [
    { field: "id",        header: "ID",              minWidth: 110 },
    { field: "thumbnail", header: "Thumbnail",       minWidth: 110, sortable: false, filterable: false,
      render: (r) => <ThumbBox kind={r.thumbnail} /> },
    { field: "name",      header: "Template Name",   minWidth: 200 },
    { field: "source",    header: "Source",          minWidth: 130 },
    { field: "eventDate", header: "Event Date",      minWidth: 130 },
    { field: "delivery",  header: "Delivery Method", minWidth: 150,
      render: (r) => (
        <span className={`pt-pill ${r.delivery === "Pickup" ? "solid-primary" : "solid-danger"}`}>{r.delivery}</span>
      ) },
    { field: "total",     header: "Total",           align: "right", minWidth: 90,
      render: (r) => `$${r.total}` },
    { field: "pushed",    header: "Pushed",          minWidth: 110,
      render: (r) => (
        <span className={`pt-pill ${r.pushed === "Pushed" ? "solid-success" : "outline-danger"}`}>{r.pushed}</span>
      ) },
    { field: "status",    header: "Status",          minWidth: 110 },
    { field: "paid",      header: "Paid",            minWidth: 120,
      render: (r) => (
        <span className={`pt-pill ${r.paid === "Paid" ? "solid-success" : r.paid === "Refunded" ? "solid-warning" : "outline-muted"}`}>{r.paid}</span>
      ) },
    { field: "actions",   header: "Actions",         minWidth: 140, sortable: false, filterable: false,
      render: (r) => (
        <div className="ds-row" style={{ gap: 6, justifyContent: "flex-start" }}>
          <button className="pt-edit-btn" aria-label={`Edit ${r.name}`}><PtEditIcon /></button>
          <button className="pt-edit-btn" aria-label={`View ${r.name}`} style={{ color: "var(--iron)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <FnSwitch size="md" checked={false} onChange={() => {}} ariaLabel={`Toggle ${r.name}`} />
        </div>
      ) },
  ];

  /* ============ DEMO 2 — Dashboard (simpler, frozen left/right) ============ */
  const dashboards = [
    { id: 1, name: "Store Health" },
    { id: 2, name: "Compliance" },
    { id: 3, name: "Risk Analysis" },
    { id: 4, name: "Time Loss" },
    { id: 5, name: "DAR Dashboard" },
  ];
  const dashColumns = [
    { field: "id", header: "Dashboard ID", frozen: "left", minWidth: 200,
      render: (row) => (
        <div className="ds-row" style={{ gap: 12, justifyContent: "space-between" }}>
          <span>{row.id}</span>
          <button className="pt-edit-btn" aria-label={`Inline edit row ${row.id}`}><PtEditIcon /></button>
        </div>
      ) },
    { field: "name", header: "Friendly Name", align: "center", minWidth: 280 },
    { field: "actions", header: "Actions", align: "center", frozen: "right", minWidth: 140, sortable: false, filterable: false,
      render: (row) => (
        <button className="pt-edit-btn" aria-label={`Edit ${row.name}`}><PtEditIcon /></button>
      ) },
  ];

  return (
    <main className="ds-main">
      <ComponentHead name="Prime Table" selector="<ag-prime-table>" ngModule="FnPrimeTableModule"
        summary="Workhorse table primitive built on PrimeNG p-table. Caption row with title + filters + actions + global search; sticky header with sortable & filterable columns + 3-dot menu; gridline-bordered cells; sticky paginator centered horizontally with rows-per-page selector at the right; optional vertical scroll. Frozen columns (left/right) stay pinned during horizontal + vertical scroll." />

      <h2 className="ds-h2">Full toolbar — templates list</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Matches the production templates listing: caption row with title (left) + Filter pill (center) + Add pill (right), a search input above the table, gridline-bordered cells with rich pill renderers (Delivery / Pushed / Paid), edit / view / toggle action cell, and the centered paginator.
      </p>
      <FnPrimeTable
        columns={tplColumns}
        data={templates}
        uniqueKey="id"
        pageSize={11}
        search
        caption={
          <div className="pt-caption">
            <span className="pt-title">
              <span className="pt-title-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 5h5M5.5 8h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              Templates Hello
            </span>
            <div className="pt-center">
              <button className="btn btn-outline-secondary btn-round">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                  <path d="M2 3h12l-4.5 6v4l-3 1.5V9L2 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                Filter
              </button>
            </div>
            <div className="pt-right">
              <button className="btn btn-primary btn-round">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 6 }}>
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                Add
              </button>
            </div>
          </div>
        }
      />

      <h2 className="ds-h2" style={{ marginTop: 40 }}>Three columns · frozen-left + frozen-right</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Dashboard ID frozen-left with an inline edit button. Actions frozen-right. Friendly Name unfrozen and centered. Hover a header to reveal the 3-dot menu.
      </p>
      <FnPrimeTable
        columns={dashColumns}
        data={dashboards}
        uniqueKey="id"
        pageSize={15}
      />

      <h2 className="ds-h2" style={{ marginTop: 40 }}>Column model</h2>
      <PropTable rows={[
        { name: "field", type: "string", required: true, desc: "Row property to render in this column." },
        { name: "header", type: "string", required: true, desc: "Column header label (passed through fnTranslate)." },
        { name: "frozen", type: "'left' | 'right' | undefined", desc: "Pins the column to the left or right edge with a 1px shadow seam." },
        { name: "align", type: "'left' | 'center' | 'right'", def: "'left'", desc: "Body & header text alignment." },
        { name: "sortable", type: "boolean", def: "true", desc: "When false, header skips the sort icon and click-to-sort." },
        { name: "filterable", type: "boolean", def: "true", desc: "When false, the 3-dot menu hides Filter / Clear filter items." },
        { name: "type", type: "'text' | 'numeric' | 'date' | 'boolean' | 'image' | 'currency'", def: "'text'", desc: "Pre-built renderers from foundation; override via render." },
        { name: "render", type: "(row) => ReactNode", desc: "Custom cell template — use for avatars, status pills, action buttons." },
        { name: "minWidth", type: "number", def: "150", desc: "Pixel minimum width." },
        { name: "excludeFromSorting / Filtering / ColMenu", type: "boolean", desc: "Foundation flags to hide individual menu items." },
      ]} />

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<ag-prime-table
  [data]="rows"
  [columns]="columns"
  [isPagginator]="true"
  [pTableScrollable]="false"
  [globalFilterFields]="['name','source']"
  [showDynamicColHandler]="false">

  <ng-template #headerLeftTemplate>
    <div class="pt-title"><i class="fn-global-template"></i> Templates Hello</div>
  </ng-template>
  <ng-template #headerRightTemplate>
    <fn-button [type]="'outline-secondary btn-round'" iconAddonBefore="ph-funnel" text="Filter"></fn-button>
    <fn-button [type]="'primary btn-round'" iconAddonBefore="ph-plus" text="Add" (click)="openCreate()"></fn-button>
  </ng-template>
</ag-prime-table>

// columns:
columns: AgPrimeTableColumn[] = [
  { field: 'id',        header: 'ID' },
  { field: 'thumbnail', header: 'Thumbnail', excludeFromSorting: true, excludeFromFiltering: true },
  { field: 'name',      header: 'Template Name' },
  { field: 'delivery',  header: 'Delivery Method', isTag: true, type: 'text' },
  { field: 'pushed',    header: 'Pushed',   isTag: true },
  { field: 'paid',      header: 'Paid',     isTag: true },
  { field: 'actions',   header: 'Actions',  excludeFromSorting: true, excludeFromFiltering: true,
                        isCustomTpl: true },
];`) }} /></pre>

      <A11yNote items={[
        "Headers use <th scope='col'>; sortable ones expose aria-sort='ascending|descending|none'.",
        "3-dot menu is a <button> with aria-label='Column options for {header}'; the menu uses role='menu' + role='menuitem'.",
        "Action buttons inside cells use a11yIconBtn so they get aria-label='Edit {row.name}'.",
        "Scrollable bodies get tabindex='0' from A11yScrollableRegionService so keyboard users can scroll the region.",
        "Pagination is real <button>s inside role='group' aria-label='Pagination'; the current page gets aria-current='page'.",
      ]} />
    </main>
  );
}

function ViewGrid() {
  return (
    <main className="ds-main">
      <ComponentHead name="Editable grid" selector="<fn-grid>" ngModule="FnGridModule"
        summary="Inline-edit grid for spreadsheet-like data entry. Supports per-cell types, validation, add/remove rows, column resize." />
      <Demo code={`<fn-grid [config]="gridCfg" [rows]="lines" (rowsChange)="onChange($event)"></fn-grid>`}>
        <div className="ds-card flush">
          <table className="tbl" style={{ border: 0, borderRadius: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 32 }}>#</th>
                <th>Role</th>
                <th>Day</th>
                <th>Start</th>
                <th>End</th>
                <th className="num">Hours</th>
                <th className="num">Pay rate</th>
                <th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {[
                { i: 1, role: "Bartender", day: "Mon", s: "16:00", e: "23:00", h: 7, p: "$24.00" },
                { i: 2, role: "Server",    day: "Mon", s: "17:00", e: "23:00", h: 6, p: "$18.50" },
                { i: 3, role: "Line cook", day: "Mon", s: "15:00", e: "22:00", h: 7, p: "$22.00" },
              ].map((r) => (
                <tr key={r.i}>
                  <td className="id">{r.i}</td>
                  <td><FnInput defaultValue={r.role} style={{ height: 26, border: 0, padding: "0 6px" }} /></td>
                  <td><FnInput defaultValue={r.day}  style={{ height: 26, border: 0, padding: "0 6px" }} /></td>
                  <td><FnInput defaultValue={r.s}    style={{ height: 26, border: 0, padding: "0 6px", fontFamily: "var(--ds-mono)" }} /></td>
                  <td><FnInput defaultValue={r.e}    style={{ height: 26, border: 0, padding: "0 6px", fontFamily: "var(--ds-mono)" }} /></td>
                  <td className="num">{r.h}</td>
                  <td className="num">{r.p}</td>
                  <td><button className="ds-iconbtn" aria-label={`Remove row ${r.i}`} style={{ height: 24, width: 24, padding: 0, color: "var(--red)" }}><Ph name="trash" size="13px" /></button></td>
                </tr>
              ))}
              <tr><td colSpan={8} style={{ padding: 8 }}>
                <FnButton type="outline-secondary btn-sm" iconAddonBefore="plus" text="Add row" />
              </td></tr>
            </tbody>
          </table>
        </div>
      </Demo>
    </main>
  );
}

function ViewPagination() {
  const [p, setP] = useState(3);
  const [size, setSize] = useState(15);
  return (
    <main className="ds-main">
      <ComponentHead name="Pagination" selector="<fn-pagination>" ngModule="FnPaginationModule"
        summary="Standalone paginator. Identical UI to the prime-table footer — centered controls (« ‹ pages › ») with a circular active page in a light-theme wash, plus the page-size dropdown to the right. Use this on non-table screens (card grids, schedule weeks, custom lists)." />

      <h2 className="ds-h2">Default</h2>
      <Demo code={`<fn-pagination
  [currentPage]="page"
  [totalPage]="totalPages"
  [pageSize]="15"
  (changePage)="onPageChange($event)"
  (changePageSize)="onPageSizeChange($event)">
</fn-pagination>`}>
        <FnPagination currentPage={p} totalPage={12} onChange={setP}
                      pageSize={size} onPageSizeChange={setSize} />
      </Demo>

      <h2 className="ds-h2">Without page-size selector</h2>
      <Demo>
        <FnPagination currentPage={p} totalPage={12} onChange={setP} showPageSize={false} />
      </Demo>

      <h2 className="ds-h2">Edge — single page (all disabled)</h2>
      <Demo>
        <FnPagination currentPage={1} totalPage={1} onChange={() => {}} pageSize={15} />
      </Demo>

      <h2 className="ds-h2">Props</h2>
      <PropTable rows={[
        { name: "currentPage",      type: "number", required: true, desc: "1-indexed current page." },
        { name: "totalPage",        type: "number", required: true, desc: "Total page count." },
        { name: "onChange",         type: "(page: number) => void", desc: "Page navigation callback." },
        { name: "pageSize",         type: "number", desc: "Current rows-per-page. Omit to hide the selector." },
        { name: "pageSizeOptions",  type: "number[]", def: "[10, 15, 20, 30]", desc: "Choices in the rows-per-page selector." },
        { name: "onPageSizeChange", type: "(size: number) => void", desc: "Rows-per-page change callback." },
        { name: "showPageSize",     type: "boolean", def: "true", desc: "Force-hide the page-size selector even when pageSize is provided." },
      ]} />

      <A11yNote items={[
        "All buttons are real <button>s inside role='group' aria-label='Pagination'.",
        "Active page gets aria-current='page'; first/prev/next/last are aria-labeled.",
        "Disabled prev/first when on page 1; disabled next/last when on the last page — both via the native disabled attribute (not just opacity).",
        "Page-size <select> has aria-label='Rows per page' for screen-reader context.",
      ]} />
    </main>
  );
}

function ViewChart() {
  return (
    <main className="ds-main">
      <ComponentHead name="Charts" selector="<fn-chart>" ngModule="FnChartModule"
        summary="amCharts 5 wrapper. Supported types: line, bar, column, pie, donut, gauge, sankey." />
      <Demo code={`<fn-chart [type]="'column'" [data]="weeklyHours" [config]="chartCfg"></fn-chart>`}>
        <div className="ds-grid ds-cols-2">
          <div className="tile">
            <header>Hours by day · this week<span className="muted" style={{ fontWeight: 400 }}>—</span></header>
            <svg viewBox="0 0 320 140" style={{ width: "100%", height: 140 }}>
              {[42, 58, 71, 64, 86, 92, 78].map((h, i) => (
                <Fragment key={i}>
                  <rect x={20 + i * 42} y={130 - h} width={28} height={h} rx={4} fill="var(--blue)" opacity={i === 5 ? 1 : 0.7} />
                  <text x={34 + i * 42} y={130 - h - 6} fontSize="9" textAnchor="middle" fill="var(--iron)" fontFamily="var(--ds-mono)">{h}</text>
                  <text x={34 + i * 42} y={148} fontSize="10" textAnchor="middle" fill="var(--iron)">{["M","T","W","T","F","S","S"][i]}</text>
                </Fragment>
              ))}
            </svg>
          </div>
          <div className="tile">
            <header>Roles distribution<span className="muted" style={{ fontWeight: 400 }}>—</span></header>
            <svg viewBox="0 0 200 140" style={{ width: "100%", height: 140 }}>
              <circle cx="70" cy="70" r="55" fill="none" stroke="var(--blue)"    strokeWidth="16" strokeDasharray="120 346" />
              <circle cx="70" cy="70" r="55" fill="none" stroke="var(--green)"   strokeWidth="16" strokeDasharray="90 346"  strokeDashoffset="-120" />
              <circle cx="70" cy="70" r="55" fill="none" stroke="var(--orange)"  strokeWidth="16" strokeDasharray="70 346"  strokeDashoffset="-210" />
              <circle cx="70" cy="70" r="55" fill="none" stroke="var(--cyan)"    strokeWidth="16" strokeDasharray="66 346"  strokeDashoffset="-280" />
              {[["Server","var(--blue)","34%"],["Cook","var(--green)","26%"],["Bartender","var(--orange)","20%"],["Other","var(--cyan)","20%"]].map(([n, c, p], i) => (
                <Fragment key={n}>
                  <circle cx="150" cy={36 + i * 22} r="5" fill={c} />
                  <text x="162" y={40 + i * 22} fontSize="11" fill="var(--body-textColor)">{n} <tspan fill="var(--iron)">{p}</tspan></text>
                </Fragment>
              ))}
            </svg>
          </div>
        </div>
      </Demo>
    </main>
  );
}

/* =============================== NAVIGATION =============================== */
function ViewBreadcrumb() {
  return (
    <main className="ds-main">
      <ComponentHead name="Breadcrumb" selector="<fn-breadcrumb>" ngModule="FnBreadcrumbModule"
        summary="Page-level breadcrumb. Items ending in _Global / _Site are auto-filtered. The last item is unclickable." />
      <Demo code={`<fn-breadcrumb [menuItemArray]="crumbs" (menuClickEvent)="onCrumb($event)"></fn-breadcrumb>`}>
        <FnBreadcrumb items={[
          { label: "Home" }, { label: "Schedules" },
          { label: "Riverside Bistro" }, { label: "Week of Mar 11" },
        ]} />
      </Demo>
    </main>
  );
}

function ViewTabsPage() {
  const tabs = [
    { id: "one",   label: "Tab One" },
    { id: "two",   label: "Tab Two" },
    { id: "three", label: "Tab Three" },
    { id: "four",  label: "Tab Four" },
  ];
  const panels = {
    one:   <>Tab One Data</>,
    two:   <>Tab Two Data</>,
    three: <>Tab Three Data</>,
    four:  <>Tab Four Data</>,
  };
  const [vt, setVt] = useState("one");
  const [ht, setHt] = useState("one");

  return (
    <main className="ds-main">
      <ComponentHead name="Tabs" selector="<fn-tab>" ngModule="FnTabModule"
        summary="Two layouts driven by isVertical. Horizontal renders a pill-shaped row above the content; vertical renders a left-column list — the active tab gets a right-pointing arrow that snaps into the content panel. Both use var(--theme) for the active state with white text." />

      <h2 className="ds-h2">Vertical</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Tab labels stack on the left, content panel on the right. The active tab shows a small triangle pointing at the content.
      </p>
      <div className="ds-card flush" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
        <FnTabs vertical tabs={tabs} active={vt} onChange={setVt} panels={panels} />
      </div>

      <h2 className="ds-h2">Horizontal</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Pill-shaped tabs sit in a row above the content panel. Hover shows a thin theme-color border; active fills with the theme color.
      </p>
      <div className="ds-card flush" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
        <FnTabs tabs={tabs} active={ht} onChange={setHt} panels={panels} />
      </div>

      <h2 className="ds-h2">Optional icon + count badge</h2>
      <Demo>
        <FnTabs tabs={[
          { id: "all",     label: "All",      icon: "list" },
          { id: "open",    label: "Open",     icon: "circle-dashed", count: 12 },
          { id: "review",  label: "In review", icon: "eye",           count: 4 },
          { id: "done",    label: "Done",     icon: "check-circle" },
        ]} active={ht} onChange={setHt} />
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<fn-tab
  [tabArray]="tabs"
  [selectIndex]="0"
  [isVertical]="false"
  [isMatStretchTabs]="false"
  [dataTemplate]="tabBody"
  (callback)="onTab($event)">
</fn-tab>

<ng-template #tabBody let-cfg>
  <!-- per-tab body, cfg is the FnTabConfig for the active tab -->
</ng-template>

// tabs:
tabs: FnTabConfig[] = [
  { titile: 'Tab One',   showIcon: false, iconClass: '', showNum: false, countNum: 0 },
  { titile: 'Tab Two',   showIcon: false },
  { titile: 'Tab Three', showIcon: false },
  { titile: 'Tab Four',  showIcon: false },
];`) }} /></pre>

      <h2 className="ds-h2">Props</h2>
      <PropTable rows={[
        { name: "tabArray",        type: "FnTabConfig[]", required: true, desc: "Tab list. Each entry: { titile, showIcon, iconClass, showNum, countNum, showRightIcon, rightIconClass }." },
        { name: "selectIndex",     type: "number", def: "0", desc: "1-indexed initial active tab." },
        { name: "isVertical",      type: "boolean", def: "false", desc: "Switches between horizontalTab and verticalTab themes." },
        { name: "isMatStretchTabs",type: "boolean", def: "false", desc: "Passes through to mat-tab-group [mat-stretch-tabs]." },
        { name: "dataTemplate",    type: "TemplateRef", required: true, desc: "Per-tab body template — receives the active FnTabConfig as $implicit." },
        { name: "callback",        type: "EventEmitter<MatTabChangeEvent>", desc: "Fires on tab change." },
      ]} />

      <A11yNote items={[
        "role='tablist' on the strip, role='tab' on each button, role='tabpanel' on the content region.",
        "Horizontal: ←/→ arrows move the active tab. Vertical: ↑/↓ arrows. Home / End jump to first / last.",
        "Selected tab gets tabindex='0'; the rest get tabindex='-1' so Tab moves out of the strip — matches APG.",
        "Active state is communicated by aria-selected='true' (not just color) — meets WCAG 1.4.1.",
      ]} />
    </main>
  );
}

function ViewMenu() {
  const [active, setActive] = useState("employees");
  const items = [
    { id: "dashboard",  label: "Dashboard",          icon: "house" },
    { id: "ongoing",    label: "Ongoing Checklist",  icon: "leaf" },
    { id: "historical", label: "Historical Checklist", icon: "clipboard-text" },
    { id: "employees",  label: "Employees",          icon: "user" },
    { id: "tasks",      label: "Task Assignment",    icon: "check-square" },
    { id: "cloud",      label: "Cloud Library",      icon: "t-shirt" },
    { id: "reports",    label: "Reports",            icon: "chart-pie-slice" },
  ];

  return (
    <main className="ds-main">
      <ComponentHead name="Sidebar menu" selector="<fn-menu-sidebar>" ngModule="FnMenuModule"
        summary="Dark navy left rail. 50px wide collapsed; expands to 240px on hover. Each item is icon + label with a 2px left-border + translucent theme wash on the active row. Sub-menus expand inline with a 300ms max-height transition. Icons accept Phosphor names or the foundation custom-font classes (fn-global-*)." />

      <h2 className="ds-h2">Expanded</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Hover to expand by default. Pass <code className="ds-inline">mode="expanded"</code> to lock it open.
      </p>
      <div style={{ display: "flex", gap: 24, minHeight: 520 }}>
        <FnMenuSidebar mode="expanded" items={items} active={active} onPick={setActive} />
        <div style={{ flex: 1, padding: 20, border: "1px solid var(--border-default-color)", borderRadius: 8, background: "var(--bg-primary)" }}>
          <div className="muted" style={{ fontSize: 12 }}>Active item: <code className="ds-inline">{active}</code></div>
          <div className="ds-h3" style={{ marginTop: 10 }}>{items.find((i) => i.id === active)?.label}</div>
          <p style={{ fontSize: 13, color: "var(--iron)" }}>The page body sits to the right of the sidebar. The active row's 2px left border in <code className="ds-inline">var(--theme)</code> visually anchors the selection.</p>
        </div>
      </div>

      <h2 className="ds-h2">Collapsed (icon-only rail)</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Pass <code className="ds-inline">mode="collapsed"</code> for an icon-only rail. Labels are kept in the DOM for screen readers but hidden visually via the 50px width + <code className="ds-inline">overflow: hidden</code>.
      </p>
      <div style={{ display: "flex", gap: 24, minHeight: 520 }}>
        <FnMenuSidebar mode="collapsed" items={items} active={active} onPick={setActive} />
        <div style={{ flex: 1, padding: 20, border: "1px solid var(--border-default-color)", borderRadius: 8, background: "var(--bg-primary)" }}>
          <div className="muted" style={{ fontSize: 12 }}>Click an icon to navigate.</div>
        </div>
      </div>

      <h2 className="ds-h2">Hover-expand (auto)</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Default behavior — sits at 50px until the user hovers, then animates to 240px.
      </p>
      <div style={{ display: "flex", gap: 24, minHeight: 520 }}>
        <FnMenuSidebar items={items} active={active} onPick={setActive} />
        <div style={{ flex: 1, padding: 20, border: "1px solid var(--border-default-color)", borderRadius: 8, background: "var(--bg-primary)" }}>
          <div className="muted" style={{ fontSize: 12 }}>Hover the rail on the left to expand.</div>
        </div>
      </div>

      <h2 className="ds-h2">With sub-menu</h2>
      <Demo>
        <div style={{ display: "flex", gap: 24 }}>
          <FnMenuSidebar mode="expanded" items={[
            { id: "dashboard", label: "Dashboard", icon: "house" },
            { id: "reports",   label: "Reports",   icon: "chart-pie-slice", children: [
              { id: "labor",   label: "Labor",     icon: "users-three" },
              { id: "sales",   label: "Sales",     icon: "currency-dollar" },
              { id: "checklist", label: "Checklists", icon: "clipboard-text" },
            ] },
            { id: "settings",  label: "Settings",  icon: "gear" },
          ]} active="dashboard" onPick={() => {}} />
          <div style={{ flex: 1, padding: 20, fontSize: 12, color: "var(--iron)" }}>Click <b>Reports</b> to expand its children.</div>
        </div>
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<fn-menu-sidebar [menuData]="menuItems" [sidebarHeight]="'100vh'"></fn-menu-sidebar>

// menuItems:
[
  { title: 'Dashboard',          icon: 'fn-global-dashboard', route: '/dashboard' },
  { title: 'Ongoing Checklist',  icon: 'fn-global-checklist', route: '/checklist' },
  { title: 'Reports', icon: 'fn-global-report', children: [
    { title: 'Labor', route: '/reports/labor' },
    { title: 'Sales', route: '/reports/sales' },
  ]},
]`) }} /></pre>

      <h2 className="ds-h2">Props</h2>
      <PropTable rows={[
        { name: "menuData", type: "FnMenuItem[]", required: true, desc: "Tree of items. Each: { title, icon, route, children, badge }." },
        { name: "sidebarHeight", type: "string", def: "'calc(100vh - 50px)'", desc: "CSS height. Defaults to viewport minus the top bar." },
        { name: "mode (gallery only)", type: "'auto' | 'expanded' | 'collapsed'", def: "'auto'", desc: "Override hover-expand behavior in the gallery — in production the rail is always hover-expand." },
      ]} />

      <A11yNote items={[
        "Root is <aside role='navigation'> aria-label='Sidebar menu'.",
        "Each item is keyboard-activatable with Enter / Space; tabindex='0' on every item.",
        "Active item gets aria-current='page'. Sub-menu parents get aria-expanded='true|false'.",
        "Labels stay in the DOM when collapsed — overflow hides them visually but screen readers still announce them.",
        "Don't rely on color alone for the active state — the 2px left border + translucent wash double-encode it.",
      ]} />
    </main>
  );
}

function ViewAccordionPage() {
  return (
    <main className="ds-main">
      <ComponentHead name="Accordion" selector="<fn-accordian> + <fn-accordian-panel>" ngModule="FnAccordianModule"
        summary="Expandable panels with two clearly distinct states: collapsed = white surface with muted header text and a small blue-tinted circle on the right; expanded = dark navy header with white text and a white circle (caret rotated 180°). Body sits flush below the header with a hover-bg fill. By default only one panel can be open; pass allowMulti to keep multiple open." />

      <h2 className="ds-h2">Default (single-open)</h2>
      <Demo>
        <FnAccordion defaultOpenIds={["1"]} items={[
          { id: "1", title: "Accordion Header", content: "Accordion Body" },
          { id: "2", title: "Accordion Header", content: "Accordion Body" },
          { id: "3", title: "Accordion Header", content: "Accordion Body" },
        ]} />
      </Demo>

      <h2 className="ds-h2">Collapsed only</h2>
      <Demo>
        <FnAccordion defaultOpenIds={[]} items={[
          { id: "1", title: "Accordion Header", content: "Accordion Body" },
        ]} />
      </Demo>

      <h2 className="ds-h2">Allow multiple open</h2>
      <Demo>
        <FnAccordion allowMulti defaultOpenIds={["1", "3"]} items={[
          { id: "1", title: "How do shift swaps work?", content: <>An employee submits a swap request; eligible matches are surfaced based on role + availability; a manager approves before the swap commits.</> },
          { id: "2", title: "What counts as a 'late' clock-in?", content: <>15 minutes past the scheduled start. Configurable per-site in <code className="ds-inline">Settings → Time clock</code>.</> },
          { id: "3", title: "Can employees view each other's schedules?", content: <>Yes by default. Disable under <code className="ds-inline">Settings → Privacy</code> if your franchise requires it.</> },
        ]} />
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<fn-accordian>
  <fn-accordian-panel *ngFor="let p of panels" [opendFnPanelValue]="p.id">
    <fn-accordian-panel-header>{{ p.title | fnTranslate }}</fn-accordian-panel-header>
    <ng-template fnPanelContent>
      {{ p.body | fnTranslate }}
    </ng-template>
  </fn-accordian-panel>
</fn-accordian>`) }} /></pre>

      <h2 className="ds-h2">Props</h2>
      <PropTable rows={[
        { name: "opendFnPanelValue", type: "string", desc: "Unique key emitted on (opened); use to track active panel from the parent." },
        { name: "isPanelopen",       type: "boolean", def: "false", desc: "Two-way binding for open state." },
        { name: "isDisabled",        type: "boolean", def: "false", desc: "Disables header click. Header stays collapsed." },
        { name: "fnPanelClass",      type: "string", desc: "Extra class on the host. Add 'fn-accordian-dark' on the parent for the dark-on-light header look." },
        { name: "opened",            type: "EventEmitter<string>", desc: "Fires when this panel opens. Emits opendFnPanelValue." },
        { name: "closed",            type: "EventEmitter<boolean>", desc: "Fires when this panel closes." },
      ]} />

      <A11yNote items={[
        "Header is role='button' with aria-expanded='true|false' and aria-controls pointing at the body.",
        "Enter / Space toggles the panel.",
        "Body has role='region' so screen readers announce it as a landmark when expanded.",
        "Open / closed is double-encoded by both color AND the caret rotation — meets WCAG 1.4.1 (color is not sole indicator).",
        "Only one panel open by default (matches accordion APG); allowMulti opts into a disclosure-group pattern.",
      ]} />
    </main>
  );
}

/* =============================== FEEDBACK ================================= */
function ViewDialog() {
  const [neutral, setNeutral] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "primary"|"success"|"danger"|"warning"|"info"|"orange"

  return (
    <main className="ds-main">
      <ComponentHead name="Dialog & confirm" selector="<fn-confirm-modal> · FnCnfModalService" ngModule="FnDialogModule"
        summary="Modal with three regions — gray header strip (16px bold black title + red-bordered circular X), white content area, divider + right-aligned pill actions in the footer. Backdrop is rgba(0,0,0,0.5) with a 3px blur. Use the neutral variant (no type) for content modals like the screenshot; pass type for semantic confirmations." />

      <h2 className="ds-h2">Neutral modal</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Matches the screenshot. Header bg is <code className="ds-inline">var(--modal-header-bg)</code>, title is 16px / 700, and the close button is a 22px red-bordered circle.
      </p>
      <Demo>
        <FnButton type="primary" text="Open modal" onClick={() => setNeutral(true)} />
      </Demo>

      <h2 className="ds-h2">Semantic variants (color-coded header)</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Pass <code className="ds-inline">type</code> to color the header strip with the semantic color and switch the close button to a white outline.
      </p>
      <Demo>
        <div className="ds-row">
          {["primary","success","warning","danger","info","orange"].map((t) => (
            <FnButton key={t}
                      type={t === "primary" ? "outline-primary" : t === "success" ? "success" : t === "warning" ? "warning" : t === "info" ? "info" : t === "orange" ? "orange" : "danger"}
                      text={`Open ${t}`} onClick={() => setConfirmType(t)} />
          ))}
        </div>
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`// Imperative open
this.cnf.open({
  title: 'Modal Header',
  content: 'Modal Content......',
  type: 'danger',
  isConformationMdl: false   // hides Yes/No, shows single Close
}).subscribe(confirmed => { /* … */ });

// Template
<fn-confirm-modal>
  <fn-modal-header class="modal-header-{{ type }}">
    <h5 class="modal-title">{{ dialogData.title | fnTranslate }}</h5>
    <button class="close" (click)="close(false)">
      <i class="fn-global-times"></i>
    </button>
  </fn-modal-header>
  <mat-dialog-content>
    <h3 [innerHTML]="dialogData.content | fnTranslate"
        class="alert-msg-{{ type }}"></h3>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="btn btn-primary btn-round">Yes</button>
    <button class="btn btn-danger btn-round">No</button>
  </mat-dialog-actions>
</fn-confirm-modal>`) }} /></pre>

      <h2 className="ds-h2">DialogData</h2>
      <PropTable rows={[
        { name: "title",   type: "string", required: true, desc: "Header text. i18n key — runs through fnTranslate." },
        { name: "content", type: "string", required: true, desc: "Body HTML. Also translated." },
        { name: "type",    type: "'primary'|'success'|'warning'|'danger'|'info'|'orange'", desc: "Color-codes the header strip. Omit for the neutral gray header from the screenshot." },
        { name: "isConformationMdl", type: "boolean", def: "false", desc: "When true, footer shows Yes / No. Otherwise shows a single Close button." },
        { name: "isCustomBtn", type: "boolean", def: "false", desc: "Foundation flag to swap to an OK-only footer." },
        { name: "titleClass",  type: "string", desc: "Optional leading icon class (e.g. fn-global-warning) before the title text." },
      ]} />

      <FnDialog open={neutral} title="Modal Header" onClose={() => setNeutral(false)}>
        Modal Content......
      </FnDialog>

      <FnDialog open={!!confirmType} type={confirmType}
                title={`Modal Header — ${confirmType || ""}`}
                onClose={() => setConfirmType(null)}
                defaultActions="yes-no"
                onConfirm={() => {}}>
        Modal Content...... This header is colored using <code className="ds-inline">modal-header-{confirmType}</code>.
      </FnDialog>

      <A11yNote items={[
        "role='dialog' + aria-modal='true' + aria-labelledby pointing at the title (id='fn-modal-title').",
        "Esc closes the modal; focus is trapped inside while open and returns to the trigger on close.",
        "Close button has aria-label='Close' so the icon-only control is announced.",
        "Backdrop click closes by default — for destructive flows, set closeOnBackdrop={false} and force user to use Cancel / X.",
      ]} />
    </main>
  );
}

function ViewDrawerPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="ds-main">
      <ComponentHead name="Drawer" selector="<ag-drawer-host> + AgDrawerService" ngModule="DrawerModule"
        summary="Imperative right-side drawer. Use for detail/edit instead of routing, unless the URL needs to be shareable." />
      <Demo code={`this.drawer.open({
  component: EmployeeEditComponent,
  inputs: { employeeId: 42 },
  outputs: { save: v => this.refresh() },
  headerTitle: 'Edit employee',
  position: 'right', width: '480px',
  closeOnEscape: true, showCloseIcon: true
});`}>
        <FnButton type="primary" text="Open drawer" iconAddonBefore="sidebar" onClick={() => setOpen(true)} />
      </Demo>

      <FnDrawer open={open} onClose={() => setOpen(false)} title="Edit employee · Sana Ahmed"
                footer={<>
                  <FnButton type="outline-secondary btn-sm" text="Cancel" onClick={() => setOpen(false)} />
                  <FnButton type="primary btn-sm" text="Save changes" onClick={() => setOpen(false)} />
                </>}>
        <div className="ds-stack">
          <FormGroup id="d-name" label="Name" required><FnInput defaultValue="Sana Ahmed" /></FormGroup>
          <FormGroup id="d-role" label="Role"><FnSelect items={[{id:1, name:"Manager"},{id:2, name:"Bartender"}]} value={1} onChange={() => {}} /></FormGroup>
          <FormGroup id="d-mail" label="Email" required><FnInput defaultValue="sana@altametrics.com" /></FormGroup>
          <FormGroup id="d-pay"  label="Hourly rate"><FnInput defaultValue="32.00" prefix="$" suffix="USD" /></FormGroup>
          <div className="divider" />
          <SwitchRow label="Active employee"     desc="Inactive employees are hidden from scheduling" defaultOn />
          <SwitchRow label="Receive notifications" desc="Schedule changes + shift reminders" defaultOn />
        </div>
      </FnDrawer>
    </main>
  );
}

function ViewToastPage() {
  const t = useToast();
  return (
    <main className="ds-main">
      <ComponentHead name="Toaster" selector="FnToasterService" ngModule="FnToasterModule"
        summary="Bottom-of-stack notifications. Wraps ngx-toastr. Messages are i18n keys." />
      <Demo code={`this.toast.success('Saved successfully');
this.toast.error('Could not save');
this.toast.warning('Unsaved changes');
this.toast.info('Sync scheduled');`}>
        <div className="ds-row">
          <FnButton type="success" text="Success" onClick={() => t.success("Shift assigned to Marco Silva", "Saved")} />
          <FnButton type="danger"  text="Error"   onClick={() => t.error("Couldn't reach the server. Retry?", "Save failed")} />
          <FnButton type="warning" text="Warning" onClick={() => t.warning("3 unsaved changes will be lost", "Heads up")} />
          <FnButton type="info"    text="Info"    onClick={() => t.info("Schedule will publish in 5 minutes", "Heads up")} />
        </div>
      </Demo>
      <A11yNote items={[
        "Success/info toasts use role='status' + aria-live='polite'.",
        "Error toasts use role='alert' + aria-live='assertive' so they interrupt screen-readers.",
        "Auto-dismiss is 4.2s; user can dismiss manually with the X.",
      ]} />
    </main>
  );
}

function ViewLoader() {
  return (
    <main className="ds-main">
      <ComponentHead name="Loaders & skeletons" selector="<fn-loader>, <fn-skeleton-loader>" ngModule="FnLoaderModule"
        summary="Global blocking loader (auto-toggled by HTTP interceptor) + inline skeleton placeholders for content." />
      <h2 className="ds-h2">Global loader</h2>
      <Demo>
        <div className="ds-row" style={{ alignItems: "center", gap: 32 }}>
          <span className="fn-spinner" />
          <span className="muted">FnLoaderService is toggled by loader.interceptor for in-flight HTTP requests.</span>
        </div>
      </Demo>

      <h2 className="ds-h2">Skeleton — card grid</h2>
      <Demo code={`<fn-skeleton-loader shape="card" count="3"></fn-skeleton-loader>`}>
        <div className="ds-grid ds-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="tile">
              <FnSkeleton width="60%" height={11} />
              <FnSkeleton width="40%" height={24} />
              <FnSkeleton width="100%" height={32} />
            </div>
          ))}
        </div>
      </Demo>

      <h2 className="ds-h2">Skeleton — table rows</h2>
      <Demo>
        <div className="ds-card flush">
          <table className="tbl" style={{ border: 0, borderRadius: 0 }}>
            <thead><tr><th>Employee</th><th>Role</th><th>Status</th><th>Shifts</th></tr></thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  <td><div className="ds-row" style={{ gap: 8 }}><FnSkeleton shape="circle" width={26} height={26} /><FnSkeleton width={120} height={12} /></div></td>
                  <td><FnSkeleton width={80} height={12} /></td>
                  <td><FnSkeleton width={60} height={18} /></td>
                  <td><FnSkeleton width={30} height={12} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Demo>
    </main>
  );
}

function ViewNoData() {
  return (
    <main className="ds-main">
      <ComponentHead name="No Data box" selector="<fn-no-data-box>" ngModule="FnNoDataBoxModule"
        summary="Standard empty / zero-results state with two variants. Just-message: a single-line gray bar with the title centered. With-illustration: vertical box illustration above the title, optional description below, and an optional hover-to-add overlay (showAddBtn) — used by fn-table, fn-grid, ag-prime-table when there's no data." />

      <h2 className="ds-h2">Variant 1 — Just the message</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Compact inline empty state. Used inside tables and grids — sits where the data rows would be.
      </p>
      <Demo>
        <FnNoData headerTitle="No Data to display" />
      </Demo>

      <h2 className="ds-h2">Variant 2 — Illustration + message</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}>
        Full empty state. Renders the foundation box illustration above the title. Hover the icon to reveal the round add CTA (when <code className="ds-inline">showAddBtn</code> is true).
      </p>
      <Demo>
        <FnNoData headerTitle="No Data To Display" showImg imgContainerheight={420} />
      </Demo>

      <h2 className="ds-h2">With description + add button</h2>
      <Demo>
        <FnNoData
          headerTitle="No Data To Display"
          description="It's look like you have nothing to display. You can add some valuable data just by clicking on Add/Update button."
          showImg showDesc showAddBtn
          imgContainerheight={300}
          onAdd={() => {}}
        />
      </Demo>

      <h2 className="ds-h2">Markup</h2>
      <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(
`<!-- Just the message -->
<fn-no-data-box [headerTitle]="'No_Data_to_display' | fnTranslate"></fn-no-data-box>

<!-- With illustration -->
<fn-no-data-box
  [showImg]="true"
  [isVerticalImg]="true"
  [showDesc]="true"
  [showAddBtn]="true"
  [imgContainerheight]="600"
  [headerTitle]="'No_Data_to_display' | fnTranslate"
  [description]="'NO_DATA_DESC' | fnTranslate"
  (addActionCB)="openCreate()">
</fn-no-data-box>`) }} /></pre>

      <h2 className="ds-h2">Props</h2>
      <PropTable rows={[
        { name: "headerTitle", type: "string", def: "'No Data to Display'", desc: "Title text. Pass through fnTranslate." },
        { name: "showImg",     type: "boolean", def: "false", desc: "Show the box illustration." },
        { name: "showDesc",    type: "boolean", def: "false", desc: "Show the secondary description line under the title." },
        { name: "description", type: "string", desc: "Description copy (when showDesc is true)." },
        { name: "showAddBtn",  type: "boolean", def: "false", desc: "Reveal a round add CTA on hover over the illustration." },
        { name: "imgContainerheight", type: "string | number", desc: "Pixel height of the illustration container. Use to fit the empty state inside fixed-height regions (table body, drawer)." },
        { name: "isVerticalImg", type: "boolean", def: "true", desc: "Stacks illustration above text. False = horizontal layout (deprecated layout — kept for legacy)." },
        { name: "imgPath",     type: "string", desc: "Custom illustration URL. Defaults to the foundation CDN no_data_display_icon.svg." },
        { name: "addActionCB", type: "EventEmitter<void>", desc: "Fires when the hover-add CTA is clicked." },
      ]} />

      <A11yNote items={[
        "Image gets alt='' (decorative) — the headerTitle carries the semantic meaning.",
        "When showAddBtn is true, the round CTA is keyboard-activatable: tabindex='0' + role='button' + aria-label='Add new'.",
        "Title uses <h1> per foundation's component template — make sure the parent route already places this inside a heading hierarchy.",
        "Don't lower the contrast on the gray bar below WCAG AA — var(--body-bg) on var(--body-textColor) passes 4.5:1.",
      ]} />
    </main>
  );
}

function ViewTagPage() {
  return (
    <main className="ds-main">
      <ComponentHead name="Tag / Badge" selector="<fn-tag>" ngModule="FnTagModule"
        summary="Chips input for tag collections (returns FnTagData[]). Use bubble-* classes for static status pills." />
      <h2 className="ds-h2">Static status pills</h2>
      <Demo>
        <div className="ds-row">
          {["primary","success","warning","danger","info","orange","secondary"].map((c) => <FnTag key={c} color={c}>{c}</FnTag>)}
        </div>
      </Demo>
      <h2 className="ds-h2">Chips input</h2>
      <Demo>
        <div style={{ maxWidth: 480, padding: 8, border: "1px solid var(--input-border-color)", borderRadius: 4, display: "flex", gap: 6, flexWrap: "wrap", background: "var(--input-bg)" }}>
          <FnTag color="primary" removable>Bartender</FnTag>
          <FnTag color="primary" removable>Weekend</FnTag>
          <FnTag color="primary" removable>Site lead</FnTag>
          <input className="fn-input" style={{ border: 0, height: 22, flex: 1, minWidth: 100 }} placeholder="Add tag…" />
        </div>
      </Demo>
    </main>
  );
}

function ViewAvatarPage() {
  return (
    <main className="ds-main">
      <ComponentHead name="Avatar" selector="<fn-avtar-text>" ngModule="FnAvtarTextModule"
        summary="Initials avatar with deterministic auto-color from the name. Use the stack variant in tables to show shift assignees." />
      <h2 className="ds-h2">Sizes</h2>
      <Demo>
        <div className="ds-row" style={{ alignItems: "center", gap: 16 }}>
          <FnAvatar name="Sana Ahmed" size="sm" />
          <FnAvatar name="Sana Ahmed" size="md" />
          <FnAvatar name="Sana Ahmed" size="lg" />
          <FnAvatar name="Sana Ahmed" size="xl" />
        </div>
      </Demo>
      <h2 className="ds-h2">Stack</h2>
      <Demo>
        <FnAvatarStack names={["Sana Ahmed","Rahul Yadav","Ipshita Ghosh","Marco Silva","Priya Nair","Diego Park"]} max={4} />
      </Demo>
    </main>
  );
}

function ViewFloat() {
  return (
    <main className="ds-main">
      <ComponentHead name="Float button" selector="<fn-float-btn>" ngModule="FnFloatBtnModule"
        summary="Bottom-right floating action button. One per screen — typically primary 'add' action on touch-heavy screens." />
      <Demo>
        <div style={{ position: "relative", height: 220, background: "var(--body-bg)", borderRadius: 8 }}>
          <button className="fn-float-btn" style={{ position: "absolute", bottom: 16, right: 16 }} aria-label="Add shift">
            <Ph name="plus" weight="bold" />
          </button>
        </div>
      </Demo>
    </main>
  );
}

/* =============================== HW-FOUNDATION ============================ */
/* ViewHwHeader now lives in src/view-hw-header.jsx */
function ViewHwAuth() {
  return (
    <main className="ds-main">
      <ComponentHead name="Auth shell (HW)" selector="<hw-auth>" ngModule="HwAuthModule"
        summary="Login / signup / forgot-password shell. Built-in OAuth handoff via HwAuthService." />
      <Demo>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-default-color)", minHeight: 360 }}>
          <div style={{ background: "linear-gradient(135deg, var(--blue) 0%, var(--cyan) 100%)", padding: 32, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: 40, height: 40, borderRadius: 9, background: "rgba(255,255,255,.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>AG</div>
              <h2 style={{ marginTop: 24, fontWeight: 600, letterSpacing: "-.02em" }}>Schedule less.<br />Run more.</h2>
              <p style={{ opacity: .88, fontSize: 13 }}>Restaurant operators ship 30% faster schedules with HubWorks.</p>
            </div>
            <div style={{ fontSize: 12, opacity: .8 }}>© Altametrics · v1.0</div>
          </div>
          <div style={{ background: "var(--bg-primary)", padding: 36 }}>
            <h2 style={{ margin: 0, fontWeight: 600 }}>Sign in</h2>
            <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Welcome back. Pick up where you left off.</p>
            <FormGroup id="a-mail" label="Email" required><FnInput type="email" placeholder="you@restaurant.com" /></FormGroup>
            <FormGroup id="a-pwd"  label="Password" required><FnInput type="password" placeholder="••••••••" /></FormGroup>
            <div className="ds-row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
              <FnCheckbox label="Remember me" checked={true} onChange={() => {}} />
              <a style={{ fontSize: 12, color: "var(--blue)" }}>Forgot password?</a>
            </div>
            <FnButton type="primary" text="Sign in" style={{ width: "100%" }} />
            <div style={{ textAlign: "center", margin: "16px 0", fontSize: 11, color: "var(--iron)" }}>or continue with</div>
            <FnButton type="outline-secondary" text="Continue with SSO" iconAddonBefore="shield-check" style={{ width: "100%" }} />
          </div>
        </div>
      </Demo>
    </main>
  );
}

/* ViewHwAppMarket now lives in src/view-app-market.jsx */

/* ============================================================================
   Export
   ============================================================================ */
Object.assign(window, {
  ViewButton, ViewInput, ViewSelect, ViewSwitch, ViewCheckbox,
  ViewDate, ViewTime, ViewTel, ViewColorPicker, ViewFiles, ViewEditor, ViewRatingPage,
  ViewTable, ViewGrid, ViewPagination, ViewChart,
  ViewBreadcrumb, ViewTabsPage, ViewMenu, ViewAccordionPage,
  ViewDialog, ViewDrawerPage, ViewToastPage, ViewLoader, ViewNoData,
  ViewTagPage, ViewAvatarPage, ViewFloat,
  ViewHwAuth,
});
