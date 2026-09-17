/* ============================================================================
   AG Design System — view-restaurant.jsx
   The restaurant scheduling demo — the full app embedded inside the gallery
   to showcase how the pieces compose into a real product surface.
   ============================================================================ */

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_NUMS = ["11","12","13","14","15","16","17"];
const EMPLOYEES_R = [
  { name: "Sana Ahmed",    role: "Manager",   rate: 32.00 },
  { name: "Rahul Yadav",   role: "Bartender", rate: 24.00 },
  { name: "Marco Silva",   role: "Line cook", rate: 22.00 },
  { name: "Priya Nair",    role: "Server",    rate: 18.50 },
  { name: "Ipshita Ghosh", role: "Server",    rate: 18.50 },
  { name: "Diego Park",    role: "Dishwasher",rate: 17.00 },
];
// shift data: by employee index, by day index — { time, kind, hours }
const SHIFTS = [
  // Sana
  [{t:"9a-5p",  k:"done",   h:8}, {t:"9a-5p", k:"done",  h:8}, null, {t:"9a-5p",k:"",h:8}, {t:"4p-11p",k:"",h:7}, {t:"4p-11p",k:"",h:7}, null],
  // Rahul
  [null, {t:"4p-11p", k:"done", h:7}, {t:"4p-11p", k:"done", h:7}, {t:"4p-11p", k:"", h:7}, {t:"4p-12a", k:"", h:8}, {t:"4p-12a", k:"", h:8}, {t:"12p-8p", k:"swap", h:8}],
  // Marco
  [{t:"3p-11p", k:"done", h:8}, null, {t:"3p-11p", k:"done", h:8}, {t:"3p-11p", k:"", h:8}, {t:"3p-11p", k:"", h:8}, {t:"12p-10p", k:"", h:10}, null],
  // Priya
  [{t:"11a-4p", k:"done", h:5}, {t:"11a-4p", k:"done", h:5}, {t:"5p-11p", k:"done", h:6}, {t:"5p-11p", k:"", h:6}, {t:"5p-11p", k:"", h:6}, {t:"5p-11p", k:"late", h:6}, {t:"11a-4p", k:"", h:5}],
  // Ipshita
  [null, {t:"5p-10p", k:"done", h:5}, null, {t:"5p-10p", k:"", h:5}, {t:"5p-12a", k:"", h:7}, null, {t:"11a-7p", k:"", h:8}],
  // Diego
  [{t:"6p-12a", k:"done", h:6}, null, {t:"6p-12a", k:"done", h:6}, null, {t:"6p-12a", k:"", h:6}, {t:"6p-12a", k:"", h:6}, null],
];

function ViewRestaurant() {
  const [tab, setTab] = useState("schedule");
  const [drawerShift, setDrawerShift] = useState(null);
  const t = useToast();

  function clickShift(emp, day, shift) {
    setDrawerShift({ emp, day, dayNum: DAY_NUMS[day], dayLabel: DAYS[day], ...shift });
  }

  return (
    <main className="ds-main">
      <SectionHead eyebrow="Showcase" title="Restaurant scheduling — Riverside Bistro"
        lead="A live mini-app composed entirely from the foundation primitives. Demonstrates how the page boilerplate, table, drawer, dialog, and toaster compose into a real scheduling tool." />

      <div className="hw-box-content" style={{ borderRadius: 10, overflow: "visible" }}>
        {/* Header */}
        <div className="hw-header-wrap">
          <div className="row">
            <div className="lhs flex-1"><i className="fn-global-schedule"></i> Schedules</div>
            <div className="rhs">Riverside Bistro · Week of Mar 11 – Mar 17, 2026</div>
          </div>
        </div>

        {/* Title bar with view tabs */}
        <div className="hw-title split">
          <FnTabs active={tab} onChange={setTab} tabs={[
            { id: "schedule",  label: "Schedule",  icon: "calendar" },
            { id: "shifts",    label: "Open shifts", icon: "circles-three-plus", count: 5 },
            { id: "time-off",  label: "Time off",  icon: "airplane-takeoff", count: 2 },
            { id: "audit",     label: "Audit log", icon: "clipboard-text" },
          ]} />
          <div className="ds-row">
            <div className="ds-toggle-group">
              <button className="on">Week</button>
              <button>Day</button>
              <button>Month</button>
            </div>
            <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="calendar" text="Mar 11 – Mar 17" />
            <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="copy" text="Copy last week" />
            <FnButton type="outline-secondary btn-xs btn-round" iconAddonBefore="download-simple" text="Export PDF"
                      onClick={() => t.info("Generating PDF…", "Export")} />
            <FnButton type="primary btn-xs btn-round" iconAddonBefore="paper-plane-tilt" text="Publish to team"
                      onClick={() => t.success("Schedule published — team notified.", "Published")} />
          </div>
        </div>

        {tab === "schedule" && <ScheduleTab onShiftClick={clickShift} />}
        {tab === "shifts"   && <OpenShiftsTab onClaim={() => t.success("Claim submitted — awaiting manager approval.")} />}
        {tab === "time-off" && <TimeOffTab onApprove={(name) => t.success(`Approved time-off for ${name}.`)} onDeny={() => {}} />}
        {tab === "audit"    && <AuditTab />}
      </div>

      <FnDrawer open={!!drawerShift} title={drawerShift ? `Shift · ${drawerShift.emp} · ${drawerShift.dayLabel} Mar ${drawerShift.dayNum}` : ""}
                onClose={() => setDrawerShift(null)}
                footer={drawerShift && (<>
                  <FnButton type="outline-danger btn-sm" iconAddonBefore="trash" text="Remove" onClick={() => { setDrawerShift(null); t.success("Shift removed"); }} />
                  <div style={{ flex: 1 }} />
                  <FnButton type="outline-secondary btn-sm" text="Cancel" onClick={() => setDrawerShift(null)} />
                  <FnButton type="primary btn-sm" text="Save changes" onClick={() => { setDrawerShift(null); t.success("Shift updated"); }} />
                </>)}>
        {drawerShift && <ShiftEditor shift={drawerShift} />}
      </FnDrawer>
    </main>
  );
}

/* ----- Schedule tab ----- */
function ScheduleTab({ onShiftClick }) {
  const totalsByDay = DAYS.map((_, d) => SHIFTS.reduce((sum, row) => sum + ((row[d]?.h) || 0), 0));
  const totalHours = totalsByDay.reduce((a, b) => a + b, 0);
  const totalCost = EMPLOYEES_R.reduce((sum, emp, i) => {
    return sum + (SHIFTS[i]?.reduce((s, sh) => s + ((sh?.h || 0) * emp.rate), 0) || 0);
  }, 0);

  return (
    <div className="hw-content" style={{ background: "var(--body-bg)" }}>
      {/* Stats above the grid */}
      <div className="ds-grid ds-cols-4" style={{ marginBottom: 16 }}>
        <div className="tile">
          <header>Total hours · week<Ph name="clock" size="14px" /></header>
          <div className="value">{totalHours}h</div>
          <div className="delta up"><Ph name="trend-up" size="12px" />+8h vs last week</div>
        </div>
        <div className="tile">
          <header>Estimated labor cost<Ph name="hand-coins" size="14px" /></header>
          <div className="value">${Math.round(totalCost).toLocaleString()}</div>
          <div className="delta down"><Ph name="trend-down" size="12px" />−$142 vs last week</div>
        </div>
        <div className="tile">
          <header>Open shifts<Ph name="warning" size="14px" /></header>
          <div className="value f-warning">5</div>
          <div className="muted" style={{ fontSize: 11.5 }}>2 weekend cook, 3 Sat server</div>
        </div>
        <div className="tile">
          <header>Coverage<Ph name="check-circle" size="14px" /></header>
          <div className="value f-success">94<span style={{ fontSize: 18 }}>%</span></div>
          <FnProgress value={94} color="success" />
        </div>
      </div>

      {/* Schedule grid */}
      <div className="sched-grid">
        <div className="head" style={{ background: "var(--bg-primary)" }}>
          <div className="ds-row" style={{ justifyContent: "space-between" }}>
            <span>Employee</span>
            <button className="ds-iconbtn" style={{ height: 22, width: 22, padding: 0 }} aria-label="Sort by role"><Ph name="funnel" size="11px" /></button>
          </div>
        </div>
        {DAYS.map((d, i) => (
          <div key={d} className={`head ${i === 4 ? "today" : ""}`}>
            <div>{d}{i === 4 && <span className="bubble-primary" style={{ marginLeft: 6, fontSize: 9, padding: "1px 5px", borderRadius: 3 }}>TODAY</span>}</div>
            <div className="muted" style={{ fontSize: 10, fontWeight: 400, fontFamily: "var(--ds-mono)" }}>Mar {DAY_NUMS[i]}</div>
          </div>
        ))}

        {EMPLOYEES_R.map((emp, ei) => (
          <Fragment key={emp.name}>
            <div className="cell emp" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FnAvatar name={emp.name} size="sm" />
              <div className="flex-1">
                <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{emp.name}</div>
                <div className="role">{emp.role}</div>
              </div>
            </div>
            {DAYS.map((_, di) => {
              const s = SHIFTS[ei]?.[di];
              return (
                <div key={di} className="cell" style={{ minHeight: 70, padding: 6, background: "var(--bg-primary)" }}>
                  {s ? (
                    <div className={`shift-chip ${s.k}`} onClick={() => onShiftClick(emp.name, di, s)}
                         role="button" tabIndex={0} aria-label={`Shift for ${emp.name} on ${DAYS[di]} ${s.t}`}>
                      <span>{emp.role}</span>
                      <span className="t">{s.t} · {s.h}h</span>
                    </div>
                  ) : (
                    <button className="ds-iconbtn" style={{ width: "100%", height: 60, padding: 0, color: "var(--iron)", borderStyle: "dashed", background: "transparent" }}
                            aria-label={`Add shift for ${emp.name} on ${DAYS[di]}`}>
                      <Ph name="plus" size="14px" />
                    </button>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}

        {/* Totals row */}
        <div className="cell emp" style={{ fontWeight: 600, background: "var(--table-dark-cell)" }}>Total hours</div>
        {totalsByDay.map((h, i) => (
          <div key={i} className="cell" style={{ background: "var(--table-dark-cell)", fontWeight: 600, fontFamily: "var(--ds-mono)", fontSize: 13 }}>{h}h</div>
        ))}
      </div>

      {/* Legend */}
      <div className="ds-row" style={{ marginTop: 12, fontSize: 11.5 }}>
        <span className="muted">Legend:</span>
        <span className="ds-row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, background: "rgba(0,91,196,.10)", borderLeft: "3px solid var(--blue)" }} />Scheduled</span>
        <span className="ds-row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, background: "rgba(30,126,52,.12)", borderLeft: "3px solid var(--green)" }} />Completed</span>
        <span className="ds-row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, background: "rgba(253,201,30,.18)", borderLeft: "3px solid var(--yellow)" }} />Swap pending</span>
        <span className="ds-row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, background: "rgba(198,40,40,.10)", borderLeft: "3px solid var(--red)" }} />Late / issue</span>
      </div>
    </div>
  );
}

/* ----- Shift editor (drawer body) ----- */
function ShiftEditor({ shift }) {
  return (
    <div className="ds-stack">
      <div className="ds-card" style={{ marginBottom: 0, padding: 14, background: "var(--body-bg)", display: "flex", gap: 12, alignItems: "center" }}>
        <FnAvatar name={shift.emp} size="md" />
        <div className="flex-1">
          <div style={{ fontWeight: 600 }}>{shift.emp}</div>
          <div className="muted" style={{ fontSize: 12 }}>{shift.t} · {shift.h}h · est. ${(shift.h * 18.5).toFixed(2)}</div>
        </div>
        <FnTag color={shift.k === "done" ? "success" : shift.k === "late" ? "danger" : shift.k === "swap" ? "warning" : "primary"}>
          {shift.k === "done" ? "Completed" : shift.k === "late" ? "Late" : shift.k === "swap" ? "Swap pending" : "Scheduled"}
        </FnTag>
      </div>

      <FormGroup id="d-emp" label="Employee" required>
        <FnSelect items={EMPLOYEES_R.map((e, i) => ({ id: i, name: e.name }))} value={EMPLOYEES_R.findIndex((e) => e.name === shift.emp)} onChange={() => {}} />
      </FormGroup>

      <FormGroup id="d-role" label="Role">
        <FnSelect items={["Server","Bartender","Line cook","Prep cook","Host","Dishwasher","Manager"].map((r, i) => ({id:i, name:r}))} value={0} onChange={() => {}} />
      </FormGroup>

      <div className="ds-grid ds-cols-2">
        <FormGroup id="d-date"  label="Date"><FnInput value={`Mar ${shift.dayNum}, 2026`} readOnly suffix={<Ph name="calendar" size="13px" />} /></FormGroup>
        <FormGroup id="d-break" label="Break"><FnInput defaultValue="30 min" /></FormGroup>
        <FormGroup id="d-start" label="Start time"><FnInput defaultValue={shift.t.split("-")[0]} /></FormGroup>
        <FormGroup id="d-end"   label="End time"><FnInput defaultValue={shift.t.split("-")[1]} /></FormGroup>
      </div>

      <FormGroup id="d-notes" label="Notes" help="Visible to the assigned employee and managers.">
        <FnTextarea rows={3} defaultValue="Standard service. Brunch prep starts at 4:30 — check the prep list before clocking in." />
      </FormGroup>

      <div className="divider" />
      <SwitchRow label="Notify employee on save"        desc="Send a push notification with the change"            defaultOn />
      <SwitchRow label="Allow swaps"                    desc="Let the employee request a swap with peers"          defaultOn />
      <SwitchRow label="Lock this shift"                desc="Prevents edits until you unlock"                     />
    </div>
  );
}

/* ----- Open shifts tab ----- */
function OpenShiftsTab({ onClaim }) {
  const shifts = [
    { id: "OS-001", role: "Server",    day: "Sat, Mar 16",  time: "11am–7pm", site: "Riverside Bistro",  pay: "$148", urgency: "high",   match: "Priya, Ipshita" },
    { id: "OS-002", role: "Line cook", day: "Sat, Mar 16",  time: "12pm–10pm", site: "Riverside Bistro", pay: "$220", urgency: "high",   match: "Marco" },
    { id: "OS-003", role: "Bartender", day: "Sun, Mar 17",  time: "5pm–12am",  site: "Riverside Bistro", pay: "$168", urgency: "medium", match: "Rahul, Diego" },
    { id: "OS-004", role: "Server",    day: "Sun, Mar 17",  time: "11am–4pm",  site: "Riverside Bistro", pay: "$92",  urgency: "low",    match: "Priya" },
    { id: "OS-005", role: "Server",    day: "Sun, Mar 17",  time: "5pm–11pm",  site: "Downtown Grill",   pay: "$111", urgency: "medium", match: "Ipshita" },
  ];
  return (
    <div className="hw-content">
      <div className="ds-row" style={{ marginBottom: 14, justifyContent: "space-between" }}>
        <div>
          <h3 className="ds-h3" style={{ margin: 0 }}>5 open shifts this week</h3>
          <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>Sort matches by AI suggestion · availability · role</p>
        </div>
        <div className="ds-row">
          <FnSelect items={[{id:1,name:"All sites"},{id:2,name:"Riverside only"}]} value={1} onChange={() => {}} />
          <FnSelect items={[{id:1,name:"All roles"},{id:2,name:"Server"},{id:3,name:"Cook"}]} value={1} onChange={() => {}} />
        </div>
      </div>
      <div className="ds-grid ds-cols-2" style={{ gap: 12 }}>
        {shifts.map((s) => (
          <div key={s.id} className="ds-card" style={{ marginBottom: 0, padding: 16, borderLeft: `4px solid ${s.urgency === "high" ? "var(--red)" : s.urgency === "medium" ? "var(--orange)" : "var(--blue)"}` }}>
            <div className="ds-row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.role} · {s.day}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{s.time} · {s.site}</div>
              </div>
              <FnTag color={s.urgency === "high" ? "danger" : s.urgency === "medium" ? "warning" : "primary"}>{s.urgency}</FnTag>
            </div>
            <div className="ds-row" style={{ fontSize: 12, justifyContent: "space-between", marginTop: 4 }}>
              <div>
                <div className="muted" style={{ fontSize: 11 }}>Suggested matches</div>
                <div style={{ fontWeight: 500 }}>{s.match}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11 }}>Est. pay</div>
                <div style={{ fontFamily: "var(--ds-mono)", fontWeight: 600 }}>{s.pay}</div>
              </div>
            </div>
            <div className="divider" />
            <div className="ds-row" style={{ gap: 6 }}>
              <FnButton type="outline-secondary btn-xs btn-round" text="Skip" />
              <FnButton type="outline-primary btn-xs btn-round" iconAddonBefore="users-three" text="Notify matches" />
              <FnButton type="primary btn-xs btn-round" iconAddonBefore="check" text="Auto-assign" onClick={onClaim} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----- Time off tab ----- */
function TimeOffTab({ onApprove, onDeny }) {
  const requests = [
    { who: "Diego Park",    type: "Sick",     when: "Mar 19 — single day",      submitted: "today",   status: "Pending" },
    { who: "Marco Silva",   type: "Vacation", when: "Mar 24 – Mar 28 (5 days)", submitted: "yesterday", status: "Pending" },
    { who: "Ipshita Ghosh", type: "Personal", when: "Apr 02 — half day pm",     submitted: "3d ago",  status: "Approved" },
    { who: "Priya Nair",    type: "Sick",     when: "Mar 11 (today)",           submitted: "today",   status: "Approved" },
  ];
  return (
    <div className="hw-content">
      <div className="ds-card flush">
        <table className="tbl" style={{ border: 0, borderRadius: 0 }}>
          <thead><tr><th>Employee</th><th>Type</th><th>When</th><th>Submitted</th><th>Status</th><th style={{ width: 200 }}>Actions</th></tr></thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.who + r.when}>
                <td><div className="ds-row" style={{ gap: 8 }}><FnAvatar name={r.who} size="sm" /><span style={{ fontWeight: 500 }}>{r.who}</span></div></td>
                <td><FnTag color={r.type === "Sick" ? "danger" : r.type === "Vacation" ? "primary" : "info"}>{r.type}</FnTag></td>
                <td>{r.when}</td>
                <td className="muted">{r.submitted}</td>
                <td><FnTag color={r.status === "Approved" ? "success" : "warning"}>{r.status}</FnTag></td>
                <td>
                  {r.status === "Pending" ? (
                    <div className="ds-row" style={{ gap: 4 }}>
                      <FnButton type="success btn-xs" iconAddonBefore="check" text="Approve" onClick={() => onApprove(r.who)} />
                      <FnButton type="outline-danger btn-xs" iconAddonBefore="x" text="Deny" onClick={onDeny} />
                    </div>
                  ) : (
                    <FnButton type="outline-secondary btn-xs" text="View" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----- Audit tab ----- */
function AuditTab() {
  const events = [
    { who: "Sana Ahmed",    when: "10:14 AM",   action: "Published schedule for Mar 11 – Mar 17", icon: "paper-plane-tilt", color: "var(--blue)" },
    { who: "Marco Silva",   when: "10:08 AM",   action: "Accepted shift SHIFT-2027 (Fri 3–11 pm)", icon: "check-circle",     color: "var(--green)" },
    { who: "Sana Ahmed",    when: "9:52 AM",    action: "Approved time-off for Priya Nair (today)", icon: "airplane-takeoff", color: "var(--green)" },
    { who: "System",        when: "8:00 AM",    action: "Auto-published draft schedule for next week",  icon: "robot",          color: "var(--iron)" },
    { who: "Diego Park",    when: "Yesterday",  action: "Late clock-in — 28min past scheduled start",   icon: "warning",        color: "var(--red)" },
    { who: "Rahul Yadav",   when: "Yesterday",  action: "Requested swap on SHIFT-2024 (Sat Mar 16)",    icon: "swap",           color: "var(--orange)" },
    { who: "Sana Ahmed",    when: "2 days ago", action: "Added employee Priya Nair (Server)",           icon: "user-plus",      color: "var(--blue)" },
  ];
  return (
    <div className="hw-content">
      <div className="ds-card" style={{ padding: 0 }}>
        {events.map((e, i) => (
          <div key={i} style={{ padding: "14px 18px", borderBottom: i < events.length - 1 ? "1px solid var(--border-default-color)" : 0, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: `${e.color}1f`, color: e.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ph name={e.icon} size="16px" weight="bold" />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 13 }}><b>{e.who}</b> <span className="muted">·</span> {e.action}</div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{e.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   Export
   ============================================================================ */
Object.assign(window, { ViewRestaurant });
