/* ============================================================================
   AG Design System — view-tour.jsx
   Animated AG bot that walks a first-time visitor through the system,
   navigating step-by-step and finishing on "How to use this system".
   ============================================================================ */

const TOUR_STEPS = [
  { nav: "overview",      title: "Hi, I'm AG!",  body: "Welcome to the AG Design System. Give me a sec — I'll show you how to get from a rough idea to a finished page." },
  { nav: "colors",        title: "Foundations",  body: "Everything starts with tokens — colors, type, spacing. Use these, never raw values, so light & dark themes just work." },
  { nav: "fn-table",      title: "Components",   body: "Ready-to-use building blocks like this Prime Table. Each card shows the selector, props, and copy-paste markup." },
  { nav: "p-boilerplate", title: "Patterns",     body: "Whole-page scaffolds. Every screen starts from the .hw-box-content boilerplate — header, title bar, content." },
  { nav: "how-to-use",    title: "The workflow", body: "And here's the full PS → UI Dev flow: prototype → compose structure → bind data → verify VPAT. You're all set!" },
];

/* Cute SVG robot mascot — shared by tour + launcher */
function AgBotSvg() {
  return (
    <svg className="bot-svg" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* antenna */}
      <g className="bot-antenna">
        <line x1="48" y1="14" x2="48" y2="24" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" />
        <circle className="bot-antenna-dot" cx="48" cy="11" r="4" fill="var(--orange)" />
      </g>
      {/* waving arm (left) */}
      <g className="bot-arm">
        <rect x="14" y="50" width="8" height="22" rx="4" fill="var(--blue)" />
        <circle cx="18" cy="74" r="6" fill="var(--cyan)" />
      </g>
      {/* right arm */}
      <rect x="74" y="52" width="8" height="20" rx="4" fill="var(--blue)" />
      <circle cx="78" cy="73" r="6" fill="var(--cyan)" />
      {/* body */}
      <rect x="24" y="46" width="48" height="36" rx="14" fill="url(#agbotBody)" />
      <rect x="33" y="60" width="30" height="12" rx="6" fill="rgba(255,255,255,.18)" />
      <text x="48" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif" letterSpacing="0.5">AG</text>
      {/* head */}
      <rect x="22" y="22" width="52" height="34" rx="16" fill="url(#agbotHead)" />
      {/* face screen */}
      <rect x="29" y="29" width="38" height="21" rx="10" fill="#0b1322" />
      <ellipse className="bot-eye" cx="41" cy="39" rx="3.6" ry="4.4" fill="#5fd0ff" />
      <ellipse className="bot-eye" cx="55" cy="39" rx="3.6" ry="4.4" fill="#5fd0ff" />
      <path d="M44 45 Q48 48 52 45" stroke="#5fd0ff" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <circle cx="33" cy="45" r="2" fill="rgba(255,130,80,.5)" />
      <circle cx="63" cy="45" r="2" fill="rgba(255,130,80,.5)" />
      <defs>
        <linearGradient id="agbotHead" x1="22" y1="22" x2="74" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--blue)" /><stop offset="1" stopColor="var(--cyan)" />
        </linearGradient>
        <linearGradient id="agbotBody" x1="24" y1="46" x2="72" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--primaryDark)" /><stop offset="1" stopColor="var(--blue)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AgBot() {
  const seen = () => { try { return localStorage.getItem("ag-tour-done") === "1"; } catch { return false; } };
  const [open, setOpen] = useState(() => !seen());
  const [step, setStep] = useState(0);

  // Drive navigation as the tour advances
  useEffect(() => {
    if (open && window.navigate) window.navigate(TOUR_STEPS[step].nav);
  }, [open, step]);

  function finish() {
    try { localStorage.setItem("ag-tour-done", "1"); } catch {}
    setOpen(false);
  }
  function restart() { setStep(0); setOpen(true); }

  if (!open) {
    return (
      <button className="agbot-launcher" onClick={restart} aria-label="Replay the AG guided tour" title="Replay tour">
        <AgBotSvg />
      </button>
    );
  }

  const s = TOUR_STEPS[step];
  const last = step === TOUR_STEPS.length - 1;

  return (
    <div className="agbot-layer" role="dialog" aria-modal="true" aria-label="AG guided tour">
      <div className="agbot-scrim" onClick={finish} />
      <div className="agbot-dock pos-br">
        <div className="agbot-bubble">
          <div className="step-ix">Step {step + 1} of {TOUR_STEPS.length}</div>
          <h4>{s.title}</h4>
          <p>{s.body}</p>
          <div className="dots" aria-hidden="true">
            {TOUR_STEPS.map((_, i) => <span key={i} className={`d ${i <= step ? "on" : ""}`} />)}
          </div>
          <div className="row">
            <button className="skip" onClick={finish}>Skip tour</button>
            <div style={{ flex: 1 }} />
            {step > 0 && <FnButton type="outline-secondary btn-sm" text="Back" onClick={() => setStep((v) => v - 1)} />}
            {last
              ? <FnButton type="primary btn-sm" text="Got it" iconAddonAfter="check" onClick={finish} />
              : <FnButton type="primary btn-sm" text="Next" iconAddonAfter="arrow-right" onClick={() => setStep((v) => v + 1)} />}
          </div>
        </div>
        <div className="agbot-mascot" aria-hidden="true">
          <AgBotSvg />
          <span className="bot-shadow" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AgBot });
