/* ============================================================================
   AG Design System — primitives.jsx
   Reusable building blocks: hi-fi facsimiles of fn-* / hw-* Angular components,
   plus gallery helpers (Demo, A11yNote, PropTable, Code, SectionHead).
   ============================================================================ */
const { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, Fragment } = React;

/* ----------------------------------------------------------------------------
   Ph — Phosphor icon via Iconify web component (ph: collection).
   weight maps to Phosphor variants: regular | bold | fill | duotone | light | thin.
---------------------------------------------------------------------------- */
function Ph({ name, weight = "regular", size, style, className = "", ariaHidden = true, ...rest }) {
  const base = name.replace(/^ph-/, "");
  const icon = `ph:${base}${weight && weight !== "regular" ? `-${weight}` : ""}`;
  return (
    <iconify-icon
      icon={icon}
      class={className}
      style={{ fontSize: size, lineHeight: 0, ...style }}
      aria-hidden={ariaHidden ? "true" : undefined}
      {...rest}
    />
  );
}

/* ----------------------------------------------------------------------------
   FnIcon — wrap any icon (Phosphor or fn-global-*) — replicates <fn-icon>
---------------------------------------------------------------------------- */
function FnIcon({ icon, lib = "ph", size = "16px", color, animation, className = "", style, ...rest }) {
  // fn-global-* custom font glyphs stay as <i>; everything else uses Iconify Phosphor
  if (lib === "global" || icon.startsWith("fn-global-")) {
    return <i className={`${icon} ${className}`} style={{ fontSize: size, color, ...style }} aria-hidden="true" {...rest} />;
  }
  const base = icon.replace(/^ph-/, "");
  return (
    <iconify-icon icon={`ph:${base}`} class={className}
      style={{ fontSize: size, color, lineHeight: 0, ...style }} aria-hidden="true" {...rest} />
  );
}

/* ----------------------------------------------------------------------------
   FnButton — facsimile of <fn-button> with type/shape/size/loading
---------------------------------------------------------------------------- */
function FnButton({
  type = "primary",
  text,
  children,
  shape,
  size,
  iconAddonBefore,
  iconAddonAfter,
  isLoading = false,
  textLoading = "Loading…",
  disabled = false,
  btnType = "button",
  ariaLabel,
  onClick,
  className = "",
  ...rest
}) {
  // The Angular component interpolates `btn-{type}` so the `type` prop can pack extra classes.
  // We support both forms here.
  const typeParts = type.trim().split(/\s+/);
  const colorOrVariant = typeParts[0];
  const extras = typeParts.slice(1).join(" ");

  const classes = [
    "btn",
    `btn-${colorOrVariant}`,
    extras,
    shape && `btn-${shape}`,
    size && `btn-${size}`,
    disabled && "disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={btnType}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel || (typeof text === "string" ? text : undefined)}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="dot-spinner" aria-hidden="true" />
          <span>{textLoading}</span>
        </>
      ) : (
        <>
          {iconAddonBefore && <Ph name={iconAddonBefore.replace(/^ph-/, "")} />}
          {text || children}
          {iconAddonAfter && <Ph name={iconAddonAfter.replace(/^ph-/, "")} />}
        </>
      )}
    </button>
  );
}

/* ----------------------------------------------------------------------------
   FnInput — facsimile of <fn-base-input>
---------------------------------------------------------------------------- */
function FnInput({
  id,
  name,
  type = "text",
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  isRequired = false,
  isInvalid = false,
  isValid = false,
  rounded = false,
  prefix,
  suffix,
  ariaDescribedBy,
  readOnly,
  className = "",
  ...rest
}) {
  const cls = [
    "fn-input",
    "form-control",
    rounded && "input-round",
    isInvalid && "is-invalid",
    isValid && "is-valid",
    className,
  ].filter(Boolean).join(" ");

  // A controlled value without onChange becomes read-only (silences React warning).
  const ro = readOnly ?? (value !== undefined && !onChange);

  if (prefix || suffix) {
    return (
      <div className="input-group">
        {prefix && <span className="input-group-text">{prefix}</span>}
        <input id={id} name={name} type={type} value={value} defaultValue={defaultValue}
               onChange={onChange} placeholder={placeholder} disabled={disabled} readOnly={ro}
               required={isRequired} aria-invalid={isInvalid || undefined}
               aria-required={isRequired || undefined} aria-describedby={ariaDescribedBy}
               className={cls} {...rest} />
        {suffix && <span className="input-group-text">{suffix}</span>}
      </div>
    );
  }
  return (
    <input id={id} name={name} type={type} value={value} defaultValue={defaultValue}
           onChange={onChange} placeholder={placeholder} disabled={disabled} readOnly={ro}
           required={isRequired} aria-invalid={isInvalid || undefined}
           aria-required={isRequired || undefined} aria-describedby={ariaDescribedBy}
           className={cls} {...rest} />
  );
}

/* ----------------------------------------------------------------------------
   FnTextarea
---------------------------------------------------------------------------- */
function FnTextarea({ rows = 4, isRequired, isInvalid, ...rest }) {
  return <textarea rows={rows} className={`form-control ${isInvalid ? "is-invalid" : ""}`} aria-required={isRequired || undefined} {...rest} />;
}

/* ----------------------------------------------------------------------------
   FormGroup — label + input + help/error (replicates .form-group)
---------------------------------------------------------------------------- */
function FormGroup({ label, required, error, help, children, id }) {
  const helpId = help ? `${id}-help` : undefined;
  const errId  = error ? `${id}-err` : undefined;
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="fn-label">
          {label}
          {required && <span className="fn-required" aria-hidden="true">*</span>}
        </label>
      )}
      {React.Children.map(children, (c) => {
        if (!React.isValidElement(c)) return c;
        // Host (DOM) elements only accept valid attributes — don't leak isRequired/isInvalid.
        const isHost = typeof c.type === "string";
        return React.cloneElement(c, isHost ? {
          id,
          "aria-describedby": [helpId, errId].filter(Boolean).join(" ") || undefined,
        } : {
          id,
          isRequired: required,
          isInvalid: !!error,
          "aria-describedby": [helpId, errId].filter(Boolean).join(" ") || undefined,
        });
      })}
      {help && !error && <div id={helpId} className="fn-help">{help}</div>}
      {error && (
        <div id={errId} className="fn-error" role="alert">
          <Ph name="warning-circle" size="12px" />
          {error}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnSelect — single + multi
---------------------------------------------------------------------------- */
function FnSelect({
  items = [],
  bindLabel = "name",
  bindValue = "id",
  value,
  onChange,
  placeholder = "Select…",
  multi = false,
  disabled = false,
  searchable = false,
  clearable = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selectedItems = multi
    ? items.filter((it) => (value || []).includes(it[bindValue]))
    : items.find((it) => it[bindValue] === value);

  const filtered = q
    ? items.filter((it) => String(it[bindLabel]).toLowerCase().includes(q.toLowerCase()))
    : items;

  function pick(it) {
    if (multi) {
      const v = value || [];
      const next = v.includes(it[bindValue]) ? v.filter((x) => x !== it[bindValue]) : [...v, it[bindValue]];
      onChange && onChange(next);
    } else {
      onChange && onChange(it[bindValue]);
      setOpen(false);
    }
  }

  return (
    <div className={`fn-select ${multi ? "is-multi" : ""} ${open ? "is-open" : ""}`}
         ref={ref}
         role="combobox"
         aria-haspopup="listbox"
         aria-expanded={open}
         aria-disabled={disabled || undefined}
         aria-label={ariaLabel}
         tabIndex={disabled ? -1 : 0}
         onClick={() => !disabled && setOpen((v) => !v)}
         onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); setOpen((v) => !v); } if (e.key === "Escape") setOpen(false); }}>
      {!multi && (
        selectedItems ? <span className="value">{selectedItems[bindLabel]}</span>
                      : <span className="placeholder">{placeholder}</span>
      )}
      {multi && (
        selectedItems.length === 0 ? <span className="placeholder">{placeholder}</span>
        : <>{selectedItems.map((it) => (
              <span key={it[bindValue]} className="chip">
                {it[bindLabel]}
                <span className="x" onClick={(e) => { e.stopPropagation(); pick(it); }} aria-label="Remove">×</span>
              </span>
            ))}</>
      )}
      {clearable && !multi && selectedItems && (
        <span className="caret" onClick={(e) => { e.stopPropagation(); onChange && onChange(null); }} aria-label="Clear" style={{ marginLeft: "auto" }}>
          <Ph name="x" size="12px" />
        </span>
      )}
      <span className="caret caret-main" style={{ marginLeft: clearable && selectedItems ? 0 : "auto" }} aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>

      {open && !disabled && (
        <div className="fn-select-menu" role="listbox">
          {searchable && (
            <div className="menu-search">
              <input className="form-control" autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                     placeholder="Search…" onClick={(e) => e.stopPropagation()}
                     style={{ height: 28 }} aria-label="Filter options" />
            </div>
          )}
          {filtered.length === 0 ? (
            <div role="option" aria-disabled="true" className="menu-empty">No_Items_Found</div>
          ) : filtered.map((it) => {
            const isSel = multi ? (value || []).includes(it[bindValue]) : value === it[bindValue];
            return (
              <div key={it[bindValue]} role="option" aria-selected={isSel}
                   className={`option ${isSel ? "selected" : ""}`}
                   onClick={(e) => { e.stopPropagation(); pick(it); }}>
                {multi && <FnCheckbox checked={isSel} readOnly />}
                <span>{it[bindLabel]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnTime — faithful port of foundation/src/lib/component/time/*
   - mode="single":   <fn-time-picker>           — 12-hour (default) or 24-hour, single value
   - mode="duration": <fn-duration-time-picker>  — 24-hour, no meridiem (durations like 00:15)
   - mode="range":    <fn-multi-time-picker>     — two-time string like "12:00a-2:00P"
---------------------------------------------------------------------------- */
function FnTime({ mode = "single", value, onChange, step = 15, isMilitary = false, isNextDay = false, disabled, ariaLabel, placeholder }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value || "");
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef();
  const listRef = useRef();
  useEffect(() => setText(value || ""), [value]);

  const items = useMemo(() => {
    if (mode === "duration" || isMilitary) return buildTimeOptions("duration", step);
    if (mode === "range")    return buildTimeOptions("single", step);
    return buildTimeOptions("single", step);
  }, [mode, step, isMilitary]);

  // Filter as user types (matches foundation's filterTime / filterValue)
  const filtered = useMemo(() => {
    if (!text || text === value) return items;
    const q = text.toLowerCase().replace(/\s/g, "");
    const match = items.filter((it) => it.toLowerCase().startsWith(q));
    return match.length ? match : items;
  }, [text, items, value]);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const sel = listRef.current.querySelector(".active");
    if (sel) sel.scrollIntoView({ block: "nearest" });
  }, [open]);

  function pick(v) { onChange && onChange(v); setText(v); setOpen(false); }

  function onKey(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); setOpen(true); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); setOpen(true); }
    if (e.key === "Enter")     { e.preventDefault(); if (filtered[activeIdx]) pick(filtered[activeIdx]); }
    if (e.key === "Tab")       { setOpen(false); }
    if (e.key === "Escape")    { setOpen(false); }
  }

  return (
    <div className={`fn-time-picker-search ${mode === "range" ? "is-multi" : ""}`} ref={ref}>
      <input className="form-control"
             value={text}
             onChange={(e) => { setText(e.target.value); setActiveIdx(0); if (!open) setOpen(true); }}
             onClick={() => !disabled && setOpen(true)}
             onKeyDown={onKey}
             disabled={disabled}
             maxLength={17}
             aria-label={ariaLabel}
             aria-haspopup="listbox" aria-expanded={open}
             placeholder={placeholder || (mode === "duration" ? "00:00" : mode === "range" ? "12:00a-2:00p" : "12:00a")} />
      {isNextDay && (
        <span className="mextDay" aria-label="Next day"><span>+1</span><span>Day</span></span>
      )}
      {mode !== "range" && (
        <i className={`fn-global-dropdownArrow ${open ? "fn-open-dropdown" : ""}`}
           onClick={() => !disabled && setOpen((v) => !v)}
           role="button" aria-label={open ? "Close" : "Open"}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
            <path d="M5 6L0 0H10L5 6Z" />
          </svg>
        </i>
      )}
      {open && !disabled && filtered.length > 0 && (
        <ul className="fn-time-picker-ul" role="listbox" ref={listRef}>
          {filtered.map((it, i) => (
            <li key={it} role="option" aria-selected={it === value}
                className={i === activeIdx ? "active" : ""}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={(e) => { e.preventDefault(); pick(it); }}>
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function buildTimeOptions(mode, step) {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      if (mode === "duration") {
        out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      } else {
        const mer = h < 12 ? "a" : "p";
        const hh = ((h + 11) % 12) + 1;
        out.push(`${hh}:${String(m).padStart(2, "0")}${mer}`);
      }
    }
  }
  return out;
}

/* ----------------------------------------------------------------------------
   FnDatePicker — single-date picker. Faithful port of <fn-date-picker>.
   btn-group with prev / center (calendar + date + drop caret) / next buttons,
   plus a popup calendar replica of the Material datepicker.
---------------------------------------------------------------------------- */
function FnDatePicker({ value, onChange, hideNextPrev = false, disabled = false, format = "D/M/YYYY", ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value || new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date((value || new Date()).getFullYear(), (value || new Date()).getMonth(), 1));
  const ref = useRef();
  useEffect(() => { if (value) { setDate(value); setViewMonth(new Date(value.getFullYear(), value.getMonth(), 1)); } }, [value]);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function step(delta) {
    if (disabled) return;
    const d = new Date(date); d.setDate(d.getDate() + delta);
    setDate(d); setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    onChange && onChange(d);
  }
  function pick(d) { setDate(d); onChange && onChange(d); setOpen(false); }
  function fmt(d) {
    const dd = d.getDate(), mm = d.getMonth() + 1, yyyy = d.getFullYear();
    if (format === "YYYY/MM/DD") return `${yyyy}/${String(mm).padStart(2,'0')}/${String(dd).padStart(2,'0')}`;
    return `${dd}/${mm}/${yyyy}`;
  }

  return (
    <div className="single-date-picker" ref={ref}>
      <div className="btn-group btn-group-round" role="group" aria-label={ariaLabel || "Date picker"}>
        {!hideNextPrev && (
          <button type="button" className="btn btn-sm btn-outline-secondary dp-prev"
                  onClick={() => step(-1)} disabled={disabled} aria-label="Previous date">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button type="button" className="btn btn-sm btn-outline-secondary dp-center"
                onClick={() => !disabled && setOpen((v) => !v)} disabled={disabled} aria-haspopup="dialog" aria-expanded={open}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="dp-cal-icon">
            <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 1.5V4M11 1.5V4M2 7H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span className="dp-date">{fmt(date)}</span>
          <span className="dp-drop" aria-hidden="true">
            <svg width="8" height="5" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
          </span>
        </button>
        {!hideNextPrev && (
          <button type="button" className="btn btn-sm btn-outline-secondary dp-next"
                  onClick={() => step(1)} disabled={disabled} aria-label="Next date">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {open && !disabled && (
        <CalendarPopup viewMonth={viewMonth} setViewMonth={setViewMonth} selected={date} onPick={pick} />
      )}
    </div>
  );
}

function CalendarPopup({ viewMonth, setViewMonth, selected, onPick }) {
  const y = viewMonth.getFullYear(), m = viewMonth.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const weeks = [];
  let cur = 1 - firstDay;
  for (let r = 0; r < 6; r++) {
    const w = [];
    for (let c = 0; c < 7; c++) {
      const dnum = cur++;
      w.push(dnum >= 1 && dnum <= lastDate ? dnum : null);
    }
    weeks.push(w);
  }
  const monthName = viewMonth.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const today = new Date();

  return (
    <div className="dp-popup" role="dialog" aria-label="Choose date">
      <div className="dp-controls">
        <button type="button" className="dp-period">
          {monthName} {y}
          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
        </button>
        <div className="dp-nav">
          <button type="button" aria-label="Previous month" onClick={() => setViewMonth(new Date(y, m - 1, 1))}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button type="button" aria-label="Next month" onClick={() => setViewMonth(new Date(y, m + 1, 1))}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      <table role="grid">
        <thead><tr>{["S","M","T","W","T","F","S"].map((d, i) => <th key={i} scope="col">{d}</th>)}</tr></thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>{w.map((d, j) => {
              if (!d) return <td key={j}></td>;
              const isSel = selected && d === selected.getDate() && m === selected.getMonth() && y === selected.getFullYear();
              const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
              return (
                <td key={j}>
                  <span className={`dp-day ${isSel ? "selected" : ""} ${isToday && !isSel ? "today" : ""}`}
                        role="gridcell" aria-selected={isSel || undefined}
                        onClick={() => onPick(new Date(y, m, d))}>
                    {d}
                  </span>
                </td>
              );
            })}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnDateRangePicker — pill input + dual-month inline calendar + Cancel/Apply
---------------------------------------------------------------------------- */
function FnDateRangePicker({ value, onChange, disabled = false, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(value?.from || null);
  const [to, setTo] = useState(value?.to || null);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [leftMonth, setLeftMonth] = useState(() => {
    const base = from || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const ref = useRef();

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function fmt(d) {
    if (!d) return "";
    const yyyy = d.getFullYear(), mm = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  }
  const valueStr = from && to ? `${fmt(from)} - ${fmt(to)}` : "";

  function pickDay(d) {
    if (!draftFrom || (draftFrom && draftTo)) { setDraftFrom(d); setDraftTo(null); }
    else if (d < draftFrom) { setDraftFrom(d); setDraftTo(draftFrom); }
    else { setDraftTo(d); }
  }
  function apply() {
    if (draftFrom && draftTo) {
      setFrom(draftFrom); setTo(draftTo);
      onChange && onChange({ from: draftFrom, to: draftTo });
    }
    setOpen(false);
  }
  function cancel() { setDraftFrom(from); setDraftTo(to); setOpen(false); }

  return (
    <div className={`date-range-picker-input ${open ? "is-open" : ""}`} ref={ref}>
      <span className="drp-cal-prefix" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 1.5V4M11 1.5V4M2 7H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </span>
      <input className="form-control input-round" value={valueStr} readOnly
             onClick={() => !disabled && setOpen(true)} disabled={disabled}
             aria-label={ariaLabel || "Date range"}
             placeholder="YYYY/MM/DD - YYYY/MM/DD" />
      <span className="drp-drop" aria-hidden="true" onClick={() => !disabled && setOpen((v) => !v)}>
        <svg width="8" height="5" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
      </span>

      {open && (
        <div className="drp-popup" role="dialog" aria-label="Choose date range">
          <div className="drp-months">
            <DRMonth which="left"  month={leftMonth} setMonth={setLeftMonth} from={draftFrom} to={draftTo} pick={pickDay} />
            <DRMonth which="right" month={new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)}
                     setMonth={(d) => setLeftMonth(new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                     from={draftFrom} to={draftTo} pick={pickDay} />
          </div>
          <div className="drp-footer">
            <button type="button" className="btn btn-danger btn-xs btn-round" style={{ width: 96 }} onClick={cancel}>Cancel</button>
            <button type="button" className="btn btn-success btn-xs btn-round" style={{ width: 96 }} onClick={apply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DRMonth({ which, month, setMonth, from, to, pick }) {
  const y = month.getFullYear(), m = month.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const offset = (firstDay + 6) % 7; // Monday-start
  const lastDate = new Date(y, m + 1, 0).getDate();
  const weeks = [];
  let cur = 1 - offset;
  for (let r = 0; r < 6; r++) {
    const w = [];
    for (let c = 0; c < 7; c++) {
      const dnum = cur++;
      w.push(dnum >= 1 && dnum <= lastDate ? dnum : null);
    }
    weeks.push(w);
  }
  const monthName = month.toLocaleString("en-US", { month: "long" }).toUpperCase();

  function classFor(d) {
    if (!d) return "";
    const date = new Date(y, m, d);
    const eqFrom = from && date.getTime() === from.getTime();
    const eqTo   = to   && date.getTime() === to.getTime();
    if (eqFrom) return "range-start";
    if (eqTo)   return "range-end";
    return "";
  }
  function inRange(d) {
    if (!d || !from || !to) return false;
    const date = new Date(y, m, d);
    return date > from && date < to;
  }

  return (
    <div>
      <div className="drp-month-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {which === "left" && (
          <button type="button" aria-label="Previous month" style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--theme)" }}
                  onClick={() => setMonth(new Date(y, m - 1, 1))}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <span style={{ flex: 1, textAlign: "center" }}>{monthName} {y}</span>
        {which === "right" && (
          <button type="button" aria-label="Next month" style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--theme)" }}
                  onClick={() => setMonth(new Date(y, m + 1, 1))}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
      <table role="grid">
        <thead><tr>{["M","T","W","T","F","S","S"].map((d, i) => <th key={i} scope="col">{d}</th>)}</tr></thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>{w.map((d, j) => (
              <td key={j} className={inRange(d) ? "in-range" : ""}>
                {d && (
                  <span className={`drp-day ${classFor(d)}`}
                        role="gridcell" aria-selected={!!classFor(d) || undefined}
                        onClick={() => pick(new Date(y, m, d))}>
                    {d}
                  </span>
                )}
              </td>
            ))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnPrimeTable — port of <ag-prime-table>. Supports:
   - per-column: frozen (left/right), sortable, filterable, custom cell renderer
   - sticky header + sticky pagination footer
   - scrollable body via the `scrollable` prop (matches pTableScrollable)
   - per-column 3-dot menu (Sort ASC/DESC · Filter · Hide · Manage · Clear)
---------------------------------------------------------------------------- */
function FnPrimeTable({
  columns = [],
  data = [],
  uniqueKey = "id",
  scrollable = false,
  scrollHeight = 480,
  pageSize: pageSizeProp = 15,
  pageSizeOptions = [10, 15, 20, 30],
  showPaginator = true,
  empty = "No data to display.",
  caption,        // ReactNode rendered above the table — title + filter + add row
  search = false, // true to show a built-in search input above the table
  onSearch,
}) {
  const [sort, setSort] = useState({ field: null, dir: 0 });
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeProp);
  const [globalQ, setGlobalQ] = useState("");
  const [menuFor, setMenuFor] = useState(null); // { field, x, y }
  const [filterFor, setFilterFor] = useState(null);
  const wrapRef = useRef();

  useEffect(() => {
    function onDown(e) {
      if (!wrapRef.current?.contains(e.target)) { setMenuFor(null); setFilterFor(null); }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Apply filters + sort + global search
  const filtered = useMemo(() => {
    let rows = data;
    for (const [field, q] of Object.entries(filters)) {
      if (!q) continue;
      rows = rows.filter((r) => String(r[field] ?? "").toLowerCase().includes(String(q).toLowerCase()));
    }
    if (globalQ) {
      const q = globalQ.toLowerCase();
      rows = rows.filter((r) => Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)));
    }
    if (sort.field && sort.dir !== 0) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.field], bv = b[sort.field];
        if (av == null) return 1; if (bv == null) return -1;
        if (typeof av === "number") return sort.dir * (av - bv);
        return sort.dir * String(av).localeCompare(String(bv));
      });
    }
    return rows;
  }, [data, filters, sort, globalQ]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = showPaginator ? filtered.slice(start, start + pageSize) : filtered;

  function toggleSort(field) {
    setSort((s) => {
      if (s.field !== field) return { field, dir: 1 };
      if (s.dir === 1)  return { field, dir: -1 };
      return { field: null, dir: 0 };
    });
  }

  function openMenu(e, field) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    setFilterFor(null);
    setMenuFor({ field, x: rect.right - wrapRect.left - 180, y: rect.bottom - wrapRect.top + 4 });
  }
  function openFilter(field) {
    const headerEl = wrapRef.current?.querySelector(`[data-col-field="${field}"]`);
    const rect = headerEl.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    setFilterFor({ field, x: rect.left - wrapRect.left, y: rect.bottom - wrapRect.top + 4 });
    setMenuFor(null);
  }

  function paginate(p) { setPage(Math.max(1, Math.min(p, totalPages))); }

  return (
    <div className={`pt-wrap ${scrollable ? "is-scrollable" : ""}`} ref={wrapRef}>
      {caption}
      {search && (
        <div className="pt-search-row">
          <div className="pt-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input type="search" placeholder="Search keyword" value={globalQ}
                   onChange={(e) => { setGlobalQ(e.target.value); onSearch?.(e.target.value); }} />
          </div>
        </div>
      )}
      <div className="pt-scroll" style={scrollable ? { maxHeight: scrollHeight } : undefined}>
        <table className="pt-table" role="grid">
          <thead>
            <tr>
              {columns.map((c) => {
                const sorted = sort.field === c.field;
                const alignClass = c.align === "center" ? "center" : c.align === "right" ? "right" : "";
                const frozenClass = c.frozen === "left" ? "frozen-left" : c.frozen === "right" ? "frozen-right" : "";
                return (
                  <th key={c.field}
                      data-col-field={c.field}
                      className={`${alignClass} ${frozenClass} ${sorted ? "sorted" : ""} ${menuFor?.field === c.field ? "col-menu-active" : ""}`}
                      style={{ minWidth: c.minWidth || 150, width: c.width }}
                      scope="col"
                      aria-sort={sorted ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
                    <span className="th-inner"
                          onClick={() => c.sortable !== false && toggleSort(c.field)}
                          role={c.sortable !== false ? "button" : undefined}
                          tabIndex={c.sortable !== false ? 0 : -1}
                          style={{ cursor: c.sortable !== false ? "pointer" : "default" }}>
                      {c.header}
                      {c.sortable !== false && (
                        <span className="sort-icon" aria-hidden="true">
                          <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ opacity: sorted && sort.dir === 1 ? 1 : .55 }}><path d="M5 0L0 6H10L5 0Z" /></svg>
                          <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ opacity: sorted && sort.dir === -1 ? 1 : .55 }}><path d="M5 6L0 0H10L5 6Z" /></svg>
                        </span>
                      )}
                    </span>
                    {(c.sortable !== false || c.filterable !== false) && (
                      <button className="col-menu-btn"
                              onClick={(e) => openMenu(e, c.field)}
                              aria-label={`Column options for ${c.header}`}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
                        </svg>
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="pt-empty">
                <div className="msg">{empty}</div>
              </td></tr>
            ) : paged.map((row) => (
              <tr key={row[uniqueKey]}>
                {columns.map((c) => {
                  const alignClass = c.align === "center" ? "center" : c.align === "right" ? "right" : "";
                  const frozenClass = c.frozen === "left" ? "frozen-left" : c.frozen === "right" ? "frozen-right" : "";
                  return (
                    <td key={c.field} className={`${alignClass} ${frozenClass}`}>
                      {c.render ? c.render(row) : (
                        c.type === "boolean" ? (row[c.field] ? "Yes" : "No")
                        : c.type === "currency" ? `$${Number(row[c.field] || 0).toLocaleString()}`
                        : row[c.field]
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column menu popover */}
      {menuFor && (
        <div className="pt-colmenu" style={{ left: menuFor.x, top: menuFor.y }} role="menu">
          <div className="ag-col-menu-item" role="menuitem"
               onClick={() => { setSort({ field: menuFor.field, dir: 1 });  setMenuFor(null); }}>
            <PtIcon name="sort-asc" /><span>Sort by ASC</span>
          </div>
          <div className="ag-col-menu-item" role="menuitem"
               onClick={() => { setSort({ field: menuFor.field, dir: -1 }); setMenuFor(null); }}>
            <PtIcon name="sort-desc" /><span>Sort by DESC</span>
          </div>
          <div className="ag-col-menu-separator" />
          <div className="ag-col-menu-item" role="menuitem"
               onClick={() => openFilter(menuFor.field)}>
            <PtIcon name="filter" /><span>Filter</span>
          </div>
          <div className="ag-col-menu-separator" />
          <div className="ag-col-menu-item" role="menuitem">
            <PtIcon name="eye-slash" /><span>Hide column</span>
          </div>
          <div className="ag-col-menu-item" role="menuitem">
            <PtIcon name="table" /><span>Manage columns</span>
          </div>
          {filters[menuFor.field] && (
            <div className="ag-col-menu-item" role="menuitem" style={{ color: "var(--red)" }}
                 onClick={() => { setFilters((f) => ({ ...f, [menuFor.field]: "" })); setMenuFor(null); }}>
              <PtIcon name="x-circle" /><span>Clear filter</span>
            </div>
          )}
        </div>
      )}

      {/* Filter overlay */}
      {filterFor && (
        <div className="pt-filter-overlay" style={{ left: filterFor.x, top: filterFor.y }}>
          <select defaultValue="contains">
            <option value="contains">Contains</option>
            <option value="startsWith">Starts with</option>
            <option value="endsWith">Ends with</option>
            <option value="equals">Equals</option>
          </select>
          <input type="text" placeholder="Search" autoFocus
                 value={filters[filterFor.field] || ""}
                 onChange={(e) => setFilters((f) => ({ ...f, [filterFor.field]: e.target.value }))} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline-secondary btn-xs" style={{ flex: 1 }}
                    onClick={() => { setFilters((f) => ({ ...f, [filterFor.field]: "" })); setFilterFor(null); }}>Clear</button>
            <button className="btn btn-primary btn-xs" style={{ flex: 1 }} onClick={() => setFilterFor(null)}>Apply</button>
          </div>
        </div>
      )}

      {showPaginator && (
        <div className="pt-footer">
          <div className="pt-pager" role="group" aria-label="Pagination">
            <button className="pp" onClick={() => paginate(1)}             disabled={safePage <= 1} aria-label="First page">«</button>
            <button className="pp" onClick={() => paginate(safePage - 1)} disabled={safePage <= 1} aria-label="Previous page">‹</button>
            {pagerNumbers(safePage, totalPages).map((p, i) =>
              p === "…"
                ? <span key={`e-${i}`} className="pp" aria-hidden="true">…</span>
                : <button key={p} className={`pp ${p === safePage ? "active" : ""}`} onClick={() => paginate(p)}
                          aria-current={p === safePage ? "page" : undefined}>{p}</button>
            )}
            <button className="pp" onClick={() => paginate(safePage + 1)} disabled={safePage >= totalPages} aria-label="Next page">›</button>
            <button className="pp" onClick={() => paginate(totalPages)}    disabled={safePage >= totalPages} aria-label="Last page">»</button>
          </div>
          <div className="pt-pagesize">
            <select value={pageSize} onChange={(e) => { setPageSize(+e.target.value); setPage(1); }} aria-label="Rows per page">
              {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="ps-caret" aria-hidden="true">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function pagerNumbers(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)   return [1, 2, 3, 4, 5, "…", total];
  if (cur >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", cur - 1, cur, cur + 1, "…", total];
}

function PtIcon({ name }) {
  const map = {
    "sort-asc":  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12V4M4 4L7 7M4 4L1 7M9 5h6M9 9h4M9 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    "sort-desc": <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4V12M4 12L7 9M4 12L1 9M9 5h2M9 9h4M9 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    "filter":    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h12l-4.5 6v4l-3 1.5V9L2 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    "eye-slash": <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8s2-5 6-5 6 5 6 5-2 5-6 5-6-5-6-5z M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "table":     <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7H14M6 3v10" stroke="currentColor" strokeWidth="1.5"/></svg>,
    "x-circle":  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };
  return map[name] || null;
}

/* Square-pencil edit icon used inside .pt-edit-btn */
function PtEditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.5 5.5L12 7M9 6.5L6 9.5L5.5 11.5L7.5 11L10.5 8L9 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

/* ----------------------------------------------------------------------------
   FnSwitch
---------------------------------------------------------------------------- */
function FnSwitch({ checked = false, onChange, size = "md", disabled = false, ariaLabel, ariaLabelledBy }) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={disabled ? -1 : 0}
      className={`fn-switch ${checked ? "on" : ""} size-${size}`}
      onClick={() => !disabled && onChange && onChange(!checked)}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); onChange && onChange(!checked); } }}
    />
  );
}

/* ----------------------------------------------------------------------------
   FnMenuSidebar — port of <fn-menu-sidebar>
   Two display modes (controlled by `mode`):
     - 'auto' (default): 50px collapsed; expands to 240px on hover
     - 'expanded': always 240px
     - 'collapsed': always 50px
   Each item: { id, label, icon, badge, children? }
   The icon prop accepts either a Phosphor name OR a CSS class string starting
   with 'fn-global-' / 'ag-icon-' (mirrors the foundation behavior).
---------------------------------------------------------------------------- */
function FnMenuSidebar({ items = [], active, onPick, mode = "auto" }) {
  const [expandedIds, setExpandedIds] = useState([]);

  function isExpanded(id) { return expandedIds.includes(id); }
  function toggle(id)     { setExpandedIds((e) => e.includes(id) ? e.filter((x) => x !== id) : [...e, id]); }

  const cls = ["fn-menu-sidebar",
    mode === "expanded"  ? "is-static-expanded" : "",
    mode === "collapsed" ? "" : "",
  ].filter(Boolean).join(" ");

  function renderItem(it, depth = 0) {
    const has = it.children && it.children.length > 0;
    const open = isExpanded(it.id);
    const isActive = active === it.id;
    return (
      <Fragment key={it.id}>
        <li className={`menu-item ${isActive ? "active" : ""} ${has ? "has-children" : ""} ${open ? "expanded" : ""}`}
            role="link" tabIndex={0}
            onClick={() => { if (has) toggle(it.id); else onPick?.(it.id); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (has) toggle(it.id); else onPick?.(it.id); } }}
            aria-current={isActive ? "page" : undefined}
            aria-expanded={has ? open : undefined}>
          <span className="menu-icon" aria-hidden="true">
            {it.icon?.startsWith?.("fn-global-") || it.icon?.startsWith?.("ag-icon-")
              ? <i className={it.icon} />
              : <Ph name={it.icon || "circle"} size="20px" />}
          </span>
          <span className="menu-label">{it.label}</span>
          {it.badge != null && <span className="badge">{it.badge}</span>}
        </li>
        {has && (
          <ul className="menu-sub">
            {it.children.map((c) => renderItem(c, depth + 1))}
          </ul>
        )}
      </Fragment>
    );
  }

  return (
    <aside className={cls} role="navigation" aria-label="Sidebar menu">
      <ul className="menu-nav">
        {items.map((it) => renderItem(it))}
      </ul>
    </aside>
  );
}

/* ----------------------------------------------------------------------------
   FnCheckbox / FnRadio
---------------------------------------------------------------------------- */
function FnCheckbox({ checked = false, onChange, label, disabled = false, readOnly, id }) {
  function toggle() { if (!disabled && !readOnly) onChange && onChange(!checked); }
  return (
    <label className={`fn-checkbox ${checked ? "on" : ""}`} style={{ opacity: disabled ? .5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <input type="checkbox" id={id} checked={checked} onChange={toggle} disabled={disabled}
             style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: "none" }} />
      <span className="box" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

function FnRadio({ checked = false, onChange, label, disabled = false, name, value }) {
  return (
    <label className={`fn-radio ${checked ? "on" : ""}`} style={{ opacity: disabled ? .5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled}
             onChange={() => onChange && onChange(value)}
             style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: "none" }} />
      <span className="dot" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
}

function FnRadioGroup({ options, value, onChange, name, vertical = false }) {
  return (
    <div role="radiogroup" style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: vertical ? 10 : 16, flexWrap: "wrap" }}>
      {options.map((o) => (
        <FnRadio key={o.id} name={name} value={o.id} label={o.label}
                 checked={value === o.id} onChange={onChange} disabled={o.disabled} />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnTag — pill chip
---------------------------------------------------------------------------- */
function FnTag({ children, color = "primary", removable, onRemove }) {
  return (
    <span className={`fn-tag bubble-${color}`}>
      {children}
      {removable && <span className="x" onClick={onRemove} role="button" aria-label="Remove" tabIndex={0}>×</span>}
    </span>
  );
}

/* ----------------------------------------------------------------------------
   FnAvatar — initials avatar
---------------------------------------------------------------------------- */
function FnAvatar({ name = "", size = "md", color, alt }) {
  const initials = name.split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  // deterministic color from name
  const palette = ["var(--blue)", "var(--orange)", "var(--green)", "var(--cyan)", "var(--purple)", "var(--iron)"];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const bg = color || palette[h % palette.length];
  return (
    <span className={`fn-avtar size-${size}`} style={{ background: bg }} role="img" aria-label={alt || name}>
      {initials || "?"}
    </span>
  );
}

function FnAvatarStack({ names = [], max = 4, size = "md" }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span className="fn-avtar-stack">
      {shown.map((n, i) => <FnAvatar key={n + i} name={n} size={size} />)}
      {extra > 0 && (
        <span className={`fn-avtar size-${size}`} style={{ background: "var(--secondaryDark)" }}>+{extra}</span>
      )}
    </span>
  );
}

/* ----------------------------------------------------------------------------
   FnPagination — standalone, identical to the prime-table footer pager
---------------------------------------------------------------------------- */
function FnPagination({ currentPage = 1, totalPage = 1, onChange, pageSize, pageSizeOptions = [10, 15, 20, 30], onPageSizeChange, showPageSize = true }) {
  function go(p) { onChange?.(Math.max(1, Math.min(p, totalPage))); }
  return (
    <div className="pt-footer" style={{ position: "relative", borderTop: 0 }}>
      <div className="pt-pager" role="group" aria-label="Pagination">
        <button className="pp" onClick={() => go(1)}              disabled={currentPage <= 1}         aria-label="First page">«</button>
        <button className="pp" onClick={() => go(currentPage - 1)} disabled={currentPage <= 1}         aria-label="Previous page">‹</button>
        {pagerNumbers(currentPage, totalPage).map((p, i) =>
          p === "…"
            ? <span key={`e-${i}`} className="pp" aria-hidden="true">…</span>
            : <button key={p} className={`pp ${p === currentPage ? "active" : ""}`} onClick={() => go(p)}
                      aria-current={p === currentPage ? "page" : undefined}>{p}</button>
        )}
        <button className="pp" onClick={() => go(currentPage + 1)} disabled={currentPage >= totalPage} aria-label="Next page">›</button>
        <button className="pp" onClick={() => go(totalPage)}       disabled={currentPage >= totalPage} aria-label="Last page">»</button>
      </div>
      {showPageSize && pageSize != null && (
        <div className="pt-pagesize">
          <select value={pageSize} onChange={(e) => onPageSizeChange?.(+e.target.value)} aria-label="Rows per page">
            {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="ps-caret" aria-hidden="true">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
          </span>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnBreadcrumb
---------------------------------------------------------------------------- */
function FnBreadcrumb({ items = [] }) {
  return (
    <nav className="fn-breadcrumb" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {last ? <span className="current" aria-current="page">{it.label}</span>
                  : <><a tabIndex={0} role="link" onClick={it.onClick}>{it.label}</a><span className="sep" aria-hidden="true">/</span></>}
          </Fragment>
        );
      })}
    </nav>
  );
}

/* ----------------------------------------------------------------------------
   FnTabs — port of <fn-tab>. Two layouts:
     - horizontal: pill-shaped tab row above the content panel
     - vertical:   left-column tab list with a right-pointing arrow on the
                   active tab + content panel to the right
   Pass `panels={{ id: ReactNode }}` to render content as a real panel below /
   beside the tabs. Without panels, this works as a controlled tab strip.
---------------------------------------------------------------------------- */
function FnTabs({ tabs = [], active, onChange, vertical = false, panels }) {
  function onKey(e, i) {
    if (e.key === (vertical ? "ArrowDown" : "ArrowRight")) { e.preventDefault(); onChange(tabs[(i + 1) % tabs.length].id); }
    if (e.key === (vertical ? "ArrowUp"   : "ArrowLeft"))  { e.preventDefault(); onChange(tabs[(i - 1 + tabs.length) % tabs.length].id); }
    if (e.key === "Home") { e.preventDefault(); onChange(tabs[0].id); }
    if (e.key === "End")  { e.preventDefault(); onChange(tabs[tabs.length - 1].id); }
  }

  if (vertical) {
    return (
      <div className="fn-tabs-vertical">
        <div className="fn-tab-list" role="tablist" aria-orientation="vertical">
          {tabs.map((t, i) => (
            <button key={t.id} role="tab" aria-selected={active === t.id} tabIndex={active === t.id ? 0 : -1}
                    className={`tab ${active === t.id ? "active" : ""}`}
                    onClick={() => onChange(t.id)}
                    onKeyDown={(e) => onKey(e, i)}>
              {t.icon && <Ph name={t.icon} />}
              {t.count != null && <span className="count-num">{t.count}</span>}
              {t.label}
            </button>
          ))}
        </div>
        {panels && (
          <div className="fn-tab-panel" role="tabpanel">
            {panels[active]}
          </div>
        )}
      </div>
    );
  }

  // horizontal
  return (
    <div className={panels ? "fn-tabs-horizontal" : ""}>
      <div className={panels ? "fn-tab-row" : ""}>
        <div className="fn-tabs is-horizontal" role="tablist" aria-orientation="horizontal">
          {tabs.map((t, i) => (
            <button key={t.id} role="tab" aria-selected={active === t.id} tabIndex={active === t.id ? 0 : -1}
                    className={`tab ${active === t.id ? "active" : ""}`}
                    onClick={() => onChange(t.id)}
                    onKeyDown={(e) => onKey(e, i)}>
              {t.icon && <Ph name={t.icon} />}
              {t.count != null && <span className="count-num">{t.count}</span>}
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {panels && (
        <div className="fn-tab-panel" role="tabpanel">
          {panels[active]}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnAccordion — port of <fn-accordian>
   Each panel: closed = white header with gray text + small blue-tinted caret;
   open = dark navy header with white text + white circle (caret rotated 180°).
---------------------------------------------------------------------------- */
function FnAccordion({ items = [], allowMulti = false, defaultOpenIds }) {
  const [open, setOpen] = useState(defaultOpenIds || (items[0] ? [items[0].id] : []));
  function toggle(id) {
    setOpen((o) => {
      if (o.includes(id)) return o.filter((x) => x !== id);
      return allowMulti ? [...o, id] : [id];
    });
  }
  return (
    <div className="fn-accordian">
      {items.map((it) => {
        const expanded = open.includes(it.id);
        return (
          <div key={it.id} className="accordian-panel-wrapper">
            <div className={`fn-panel ${expanded ? "fn-panel-expend" : ""}`}>
              <div className="fn-panel-header"
                   role="button" tabIndex={0}
                   aria-expanded={expanded}
                   aria-controls={`acc-body-${it.id}`}
                   onClick={() => toggle(it.id)}
                   onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(it.id); } }}>
                <span>{it.title}</span>
                <span className="fn-panel_icon" aria-hidden="true">
                  <svg width="11" height="7" viewBox="0 0 12 8" fill="none">
                    <path d="M2 2.5L6 6L10 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <div className="fn-panel-body" id={`acc-body-${it.id}`} role="region" aria-labelledby={`acc-head-${it.id}`}>
                {it.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnDialog — port of <fn-confirm-modal> / <fn-modal>
   header (gray strip + red-circle X) · content · actions (right-aligned).
   Colored variants via `type`: primary | success | danger | warning | info | orange.
---------------------------------------------------------------------------- */
function FnDialog({
  open,
  title = "Modal Header",
  type,                // undefined = neutral; "primary"|"success"|"danger"|"warning"|"info"|"orange"
  children,
  onClose,
  actions,             // ReactNode — buttons row; defaults below
  defaultActions = "close",   // "close" | "yes-no"
  confirmText = "Yes",
  cancelText = "No",
  closeText = "Close",
  onConfirm,
  ariaLabel,
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function key(e) { if (e.key === "Escape" && onClose) onClose(); }
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [open, onClose]);

  if (!open) return null;

  // Default action buttons mirror foundation's confirm-modal template
  let actionsNode = actions;
  if (!actionsNode) {
    if (defaultActions === "yes-no") {
      actionsNode = (<>
        <button className="btn btn-primary btn-round" onClick={() => { onConfirm?.(true);  onClose?.(); }}>{confirmText}</button>
        <button className="btn btn-danger btn-round"  onClick={() => { onConfirm?.(false); onClose?.(); }}>{cancelText}</button>
      </>);
    } else {
      actionsNode = (
        <button className="btn btn-danger btn-round" onClick={onClose}>{closeText}</button>
      );
    }
  }

  return (
    <div className="fn-modal-overlay" onClick={onClose} role="presentation">
      <div className="fn-modal" onClick={(e) => e.stopPropagation()}
           role="dialog" aria-modal="true" aria-labelledby="fn-modal-title" aria-label={ariaLabel}>
        <div className={`fn-modal-header ${type ? `modal-header-${type}` : ""}`}>
          <h5 id="fn-modal-title" className="modal-title">{title}</h5>
          <button type="button" className="close" onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={`fn-modal-content ${type ? `alert-msg-${type}` : ""}`}>
          {children}
        </div>
        <div className="fn-modal-actions">
          {actionsNode}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnDrawer (ag-drawer-host)
---------------------------------------------------------------------------- */
function FnDrawer({ open, title, children, onClose, width = 420, position = "right", footer }) {
  useEffect(() => {
    if (!open) return;
    function key(e) { if (e.key === "Escape" && onClose) onClose(); }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, onClose]);
  if (!open) return null;
  const isRight = position === "right";
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--cdk-overlay-backdrop)", zIndex: 180,
                  display: "flex", justifyContent: isRight ? "flex-end" : "flex-start" }}
         onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="fn-drawer" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="drw-head">
          <span>{title}</span>
          <button className="ds-iconbtn" onClick={onClose} aria-label="Close drawer"><Ph name="x" /></button>
        </div>
        <div className="drw-body">{children}</div>
        {footer && <div className="drw-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnToast + ToastHost
---------------------------------------------------------------------------- */
function FnToast({ type = "info", title, message, onClose }) {
  const iconMap = { success: "check-circle", danger: "x-circle", warning: "warning", info: "info" };
  return (
    <div className={`fn-toast ${type}`} role={type === "danger" ? "alert" : "status"} aria-live={type === "danger" ? "assertive" : "polite"}>
      <span className="icon"><Ph name={iconMap[type]} weight="bold" /></span>
      <div className="flex-1">
        {title && <div className="title">{title}</div>}
        {message && <div>{message}</div>}
      </div>
      {onClose && <span className="x" onClick={onClose} role="button" aria-label="Dismiss" tabIndex={0}><Ph name="x" size="14px" /></span>}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnNoData — port of <fn-no-data-box>
   Two variants driven by `showImg`:
     - false: just the centered headerTitle on the gray bar
     - true:  vertical illustration above the title; optional onHoverAdd CTA
---------------------------------------------------------------------------- */
function FnNoData({
  headerTitle = "No Data to display",
  description = "It's look like you have nothing to display. You can add some valuable data just by clicking on Add/Update button.",
  showImg = false,
  showDesc = false,
  showAddBtn = false,
  imgContainerheight,
  imgPath = "https://agcdn.altametrics.com/hubworks_resources/pre_dev/images/common/no_data_display_icon.svg",
  onAdd,
}) {
  return (
    <div className="fn-no-data-box">
      <div className="no_data_component" style={imgContainerheight ? { height: imgContainerheight } : undefined}>
        {showImg && (
          <div className="vertical_img" style={imgContainerheight ? { height: imgContainerheight } : undefined}>
            <img src={imgPath} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            {showAddBtn && (
              <div className="onHoverAdd" onClick={onAdd} role="button" tabIndex={0} aria-label="Add new">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        )}
        <div className="no_data_text">
          <h1>{headerTitle}</h1>
          {showDesc && <div className="mt-5">{description}</div>}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FnSkeleton
---------------------------------------------------------------------------- */
function FnSkeleton({ shape = "line", width = "100%", height, count = 1 }) {
  const h = height || (shape === "circle" ? width : shape === "card" ? 120 : 14);
  const w = width;
  const radius = shape === "circle" ? "50%" : shape === "card" ? "var(--radius-md)" : "4px";
  return (<>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="fn-skeleton" style={{ width: w, height: h, borderRadius: radius, marginBottom: 8 }} />
    ))}
  </>);
}

/* ----------------------------------------------------------------------------
   FnRating
---------------------------------------------------------------------------- */
function FnRating({ value = 0, onChange, readOnly = false, max = 5 }) {
  return (
    <span className="fn-rating" role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} role={readOnly ? undefined : "radio"} aria-checked={i + 1 === value}
              tabIndex={readOnly ? -1 : 0}
              className={`star ${i < value ? "on" : ""}`}
              onClick={() => !readOnly && onChange && onChange(i + 1)}
              onKeyDown={(e) => { if (!readOnly && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onChange && onChange(i + 1); } }}
              aria-label={`${i + 1} star${i ? "s" : ""}`}>
          <Ph name="star" weight={i < value ? "fill" : "regular"} />
        </span>
      ))}
    </span>
  );
}

/* ----------------------------------------------------------------------------
   FnProgress
---------------------------------------------------------------------------- */
function FnProgress({ value = 0, max = 100, color = "primary", label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin="0" aria-valuemax="100" aria-label={label}>
      <div className={`fn-progress ${color !== "primary" ? color : ""}`}><div className="bar" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

/* ============================================================================
   GALLERY HELPERS
   ============================================================================ */

/* ----------------------------------------------------------------------------
   Demo — preview frame + code block side-by-side or stacked
---------------------------------------------------------------------------- */
function Demo({ children, code, label, surface = false, hideCode = false }) {
  const [show, setShow] = useState(true);
  return (
    <div style={{ marginBottom: 16 }}>
      <div className={`ds-preview ${surface ? "surface" : ""}`}>
        {label && <span className="preview-label">{label}</span>}
        {children}
      </div>
      {code && !hideCode && (
        <div style={{ position: "relative" }}>
          <button className="ds-iconbtn" onClick={() => setShow((s) => !s)}
                  style={{ position: "absolute", top: 6, right: 6, zIndex: 1, height: 24, padding: "0 8px", fontSize: 11 }}
                  aria-label={show ? "Hide code" : "Show code"}>
            {show ? "Hide code" : "Show code"}
          </button>
          {show && <pre className="ds-code"><code dangerouslySetInnerHTML={{ __html: highlightAngular(code) }} /></pre>}
        </div>
      )}
    </div>
  );
}

/* Very small Angular/HTML syntax tinter */
function highlightAngular(src) {
  return src
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\[?\(?[a-zA-Z_][a-zA-Z0-9_-]*\)?\]?)=&quot;([^&]*?)&quot;/g, '<span class="k">$1</span>=<span class="s">"$2"</span>')
    .replace(/(\{\{[^}]+\}\})/g, '<span class="s">$1</span>')
    .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span class="t">$2</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>');
}

/* ----------------------------------------------------------------------------
   A11yNote — VPAT compliance callout
---------------------------------------------------------------------------- */
function A11yNote({ children, items, label = "VPAT" }) {
  return (
    <div className="ds-a11y" role="note">
      <span className="badge">{label}</span>
      <div className="flex-1">
        {children}
        {items && <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   PropTable
---------------------------------------------------------------------------- */
function PropTable({ rows = [] }) {
  return (
    <div className="ds-card flush" style={{ overflowX: "auto" }}>
      <table className="proptbl">
        <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className={r.required ? "required" : ""}><span className="pn">{r.name}</span></td>
              <td><span className="pt">{r.type}</span></td>
              <td><span className="pt">{r.def || "—"}</span></td>
              <td>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   SectionHead — H2 with eyebrow + lead
---------------------------------------------------------------------------- */
function SectionHead({ eyebrow, title, lead, children }) {
  return (
    <header style={{ marginBottom: 24 }}>
      {eyebrow && <div className="ds-eyebrow">{eyebrow}</div>}
      <h1 className="ds-h1">{title}</h1>
      {lead && <p className="ds-lead">{lead}</p>}
      {children}
    </header>
  );
}

function ComponentHead({ name, selector, ngModule, summary }) {
  return (
    <header style={{ marginBottom: 20 }}>
      <div className="ds-eyebrow">Component</div>
      <h1 className="ds-h1">{name}</h1>
      <p className="ds-lead" style={{ marginBottom: 12 }}>{summary}</p>
      <div className="ds-row" style={{ gap: 8, fontSize: 12 }}>
        {selector && <span><span className="muted">Selector</span> <code className="ds-inline">{selector}</code></span>}
        {ngModule && <span><span className="muted">Module</span> <code className="ds-inline">{ngModule}</code></span>}
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------------------
   Toast manager — singleton hook
---------------------------------------------------------------------------- */
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const api = {
    success: (msg, title) => push("success", msg, title),
    error:   (msg, title) => push("danger",  msg, title),
    warning: (msg, title) => push("warning", msg, title),
    info:    (msg, title) => push("info",    msg, title),
  };
  function push(type, message, title) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message, title }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 300, display: "flex", flexDirection: "column", gap: 10 }} role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <FnToast key={t.id} type={t.type} title={t.title} message={t.message}
                   onClose={() => setToasts((s) => s.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() { return useContext(ToastCtx) || { success: () => {}, error: () => {}, warning: () => {}, info: () => {} }; }

/* ============================================================================
   Export to window
   ============================================================================ */
Object.assign(window, {
  Ph, FnIcon,
  FnButton, FnInput, FnTextarea, FormGroup,
  FnSelect, FnTime, FnDatePicker, FnDateRangePicker, CalendarPopup, DRMonth, FnPrimeTable, PtEditIcon, FnSwitch, FnCheckbox, FnRadio, FnRadioGroup,
  FnTag, FnAvatar, FnAvatarStack,
  FnPagination, FnBreadcrumb, FnTabs, FnAccordion, FnMenuSidebar,
  FnDialog, FnDrawer, FnToast, FnNoData, FnSkeleton, FnRating, FnProgress,
  Demo, A11yNote, PropTable, SectionHead, ComponentHead,
  ToastProvider, useToast,
});
