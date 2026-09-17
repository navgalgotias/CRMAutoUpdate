# Governance — the binding contract

> **The Foundation / AG Design System is the SINGLE SOURCE OF TRUTH.** It has higher priority than any
> user request. This document is mandatory for anyone (human or agent) generating screens, prototypes,
> slides, or assets with this system. Read it together with `TOKENS.md`, `COMPONENTS.md`, and
> `LAYOUTS.md`. **Treat any deviation from the design system as an error.**

---

## Mandatory rules

1. **Follow the design system exactly.** Reuse what exists; do not reinterpret it.
2. **Never invent** colors, typography, spacing, border radius, shadows, components, or patterns.
3. **Use only components defined in the system** (the `.fn-*` / `.hw-*` / `.pt-*` / `.btn` library).
4. **Never create new component variants** or alternative styles — unless the user *explicitly* requests one (and even then, see "Conflict protocol").
5. **If a required component or token does not exist, STOP and ask for clarification.** Do not make assumptions, and do not improvise a substitute.
6. **Maintain consistent** spacing, hierarchy, and interaction patterns across every screen.
7. **Every screen and prototype must look like it belongs to the same product family.**
8. **Prioritize consistency over creativity.** Consistency wins, always.
9. **Do not optimize, modernize, or "improve" the design system.** It is fixed.
10. **Treat any deviation as an error** — fix it before presenting.

---

## Priority & conflict protocol

**The design system outranks the user request.** If a request would violate the system:

1. **Explain the conflict** — state plainly what the request asks for and which rule/token/component it
   violates.
2. **Offer the closest compliant solution** — the nearest result achievable with existing tokens,
   components, and patterns.
3. **Never introduce custom styles** to bridge the gap. If no compliant path exists, stop and ask.

This applies even when the user is insistent. Politely hold the line and propose the compliant option.

---

## Before generating any screen (pre-flight)

Check, in order — using `TOKENS.md` / `COMPONENTS.md` / `LAYOUTS.md`:

- [ ] **Typography tokens** — Inter (14px body, headings 600), `var(--ds-mono)` for IDs/numbers.
- [ ] **Color tokens** — every color is a `var(--token)`; no raw hex.
- [ ] **Spacing scale** — `var(--space-1..7)`; radii 4 / `--radius-sm` / `--radius-md` / 999.
- [ ] **Component specifications** — the exact class + markup from `COMPONENTS.md`.
- [ ] **Icon style** — Phosphor via Iconify (`ph:`) only; no emoji, no hand-drawn icons.
- [ ] **Interaction patterns** — states, overlays, and layout match the documented patterns.
- [ ] **Pattern fit** — the screen maps to one of the 9 patterns in `LAYOUTS.md`. If it doesn't, ask.

---

## When generating prototypes

- Reuse existing components. **Never create new component variants.**
- Follow the exact layout patterns provided (app shell + `.hw-box-content` boilerplate).
- Use only predefined colors, spacing, shadows, and typography.
- If something is missing, **ask questions rather than making assumptions.**
- Consistency is more important than creativity.

---

## Compliance review (run before presenting — fix any ✗ first)

- [ ] **Colors** match design tokens — grep output for `#` hex / `rgb(` literals → **zero** (outside `tokens.css`).
- [ ] **Typography** matches Foundation tokens (Inter / mono, 14px body, 600 headings; no ad-hoc sizes/families).
- [ ] **Buttons** follow spec — `.btn` + a defined intent only; no restyled buttons.
- [ ] **Inputs** follow spec — `.form-control` / `.fn-select` / `.input-group`, each with a `<label>`.
- [ ] **Spacing** follows the scale — padding/margin/`gap` are `var(--space-*)`; radii from the set.
- [ ] **No new styles** — own `<style>` is layout-only (grid/flex/gap/position) using tokens; no restyle of any system class.
- [ ] **Components** match the library — every element is a documented component.
- [ ] **Patterns** are consistent with the design system and map to a documented pattern.

> A prototype that fails any item is **not** ready. Correct it, re-review, then present.

---

## If something is missing

Do **not** fill the gap with a custom style or an invented component. Instead:

1. Name the missing component/token/pattern.
2. Point to the nearest existing thing in the system.
3. Ask the user how to proceed.
