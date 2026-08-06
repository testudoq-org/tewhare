# Chart Container Refactor Specification

## 1. Overview

This specification documents the required refactor of the existing `chart-container` component (implemented in `src/chart.ts`) to add two visual layers while preserving all existing radar-chart functionality, accessibility, and responsive behavior.

**Component location:** `src/chart.ts`
**Styles location:** `public/styles.css`
**Consumers:** `src/app.ts` (assessment view and summary view)

---

## 2. Current State

The `chart-container` is a `<div>` that receives an inline SVG rendered by `drawChart(containerId, domains)`. The SVG uses a fixed `viewBox="0 0 280 280"` and contains:

- 5 nested background polygons representing score levels (level 1–5)
- 4 axes radiating from center
- A data polygon connecting scored points
- Data dots at each vertex
- Māori-name labels and numeric level labels

The container uses `aspect-ratio: 1`, `width: 100%`, and `max-width: 300px`. The SVG scales responsively via `width="100%" height="100%"`.

No external charting library is used. All rendering is vanilla TypeScript + SVG via string concatenation and `innerHTML`.

---

## 3. Required Updates

### 3.1 Feature 1 — Custom SVG Background Layer

Add a custom SVG graphic as a **full, non-interactive background layer** positioned **behind all existing chart content** and scaled **responsively to fit the container without distortion**.

**Requirements:**

- The background SVG must be inserted as the **first child** of the SVG `<svg>` element, before the existing `<g class="chart-bg">` group.
- It must use the **same viewBox** (`0 0 280 280`) so it scales identically to the existing chart layers.
- It must be **non-interactive**: no pointer events, no hover states, no click handlers, no `cursor` changes.
- It must not **obscure or distort** existing chart content at any container size.
- It must be visually separated from the data layers (e.g., via a distinct `<g class="chart-bg-custom">` group).

### 3.2 Feature 2 — Value-Level Connection Polygons

Remove the 4 small decorative pentagons from the overlay. Instead, for each numerical score value (1 through 5), connect all axis labels that share the same value with faint, light lines to form a polygon for that value group. Use the chart-level axis labels (the numeric 1–5 markers along the first axis) as the reference points for all connections.

**Requirements:**

- The value-level polygons must be inserted **after** the background SVG group and **before** `<g class="chart-bg">`.
- Each polygon must have **no fill** (`fill="none"`) and a **light stroke** using a low-contrast color.
- There must be exactly **5 polygons**, one for each score level (1, 2, 3, 4, 5).
- Each polygon connects the points on every axis at the same radius as the corresponding chart-level label. For example, the level-5 polygon connects the outermost point on each axis; the level-1 polygon connects the innermost point on each axis.
- The polygons must sit **above the custom background SVG** and **below all existing interactive chart elements** (levels, axes, data polygon, dots, labels, score labels).
- The polygons must remain **non-interactive** and **non-intrusive**: they must not compete visually with the radar data.
- The 4 small decorative pentagons previously rendered in the overlay must be **completely removed**.

**Polygon layout specification:**

- For level `L` (1–5), radius = `(L / 5) * maxRadius` (where `maxRadius` = 110).
- For each domain axis `i` (0 to `n-1`), compute the point at that radius along the axis angle.
- Connect the points in axis order to form a polygon.
- With 4 domains, each value-level polygon is a quadrilateral; the implementation must use the actual domain count (`domains.length`) rather than a hard-coded shape count.

---

## 4. Acceptance Criteria

### 4.1 Feature 1 — Background SVG

| ID | Criterion | Test Method |
|-----|-----------|-------------|
| B1 | Background SVG renders as the first child of the `<svg>` element. | Inspect DOM order in test. |
| B2 | Background SVG scales proportionally with container resize (no distortion). | Resize container via CSS/JS and assert `viewBox` alignment; check computed `width`/`height` ratio remains 1:1. |
| B3 | Background SVG does not trigger pointer events. | Assert `pointer-events: none` on the background group or SVG element. |
| B4 | Background SVG does not obscure existing chart content at any supported container width. | Visual regression / pixel comparison at 260px, 300px, 500px widths. |
| B5 | Background SVG remains visible in both light and dark contexts. | Render with light/dark background colors and confirm contrast. |
| B6 | Background SVG is ignored by screen readers. | Assert `aria-hidden="true"` on the background group or that the container's `aria-label` remains the sole accessible name. |

### 4.2 Feature 2 — Value-Level Connection Polygons

| ID | Criterion | Test Method |
|-----|-----------|-------------|
| V1 | Value-level polygon `<g>` is inserted after the background SVG and before `<g class="chart-bg">`. | Inspect DOM order in test. |
| V2 | Exactly 5 `<polygon>` elements exist in the value-level group (one per score level). | Count `<polygon>` elements inside the group. |
| V3 | Each polygon has `fill="none"` and a light `stroke`. | Assert `fill="none"` and `stroke` color matches a low-contrast token. |
| V4 | Each polygon connects points at the same radius as the corresponding chart-level label. | For each level L, assert polygon vertices match `(L/5) * maxRadius` on each axis. |
| V5 | Polygons do not intercept pointer events meant for the chart. | Assert `pointer-events: none` on the group. |
| V6 | Polygons remain below interactive chart elements (dots, data polygon, labels). | Inspect DOM order; optionally assert paint order. |
| V7 | The 4 small decorative pentagons are no longer present in the DOM. | Assert no `.chart-overlay-pentagons` group or old pentagon markup exists. |
| V8 | Polygons remain visible and low-contrast in both light and dark contexts. | Render in both contexts and measure stroke contrast against background. |
| V9 | Polygons do not introduce new accessible names or roles. | Assert no additional `role`, `aria-label`, or `<title>` elements inside the group. |

---

## 5. Non-Functional Requirements & Edge Cases

### 5.1 Responsive Container Resizing

- The chart SVG already uses `viewBox` + `width="100%" height="100%"`. The new layers must use the **same viewBox coordinate system** (`0 0 280 280`).
- All background and polygon shapes must be defined in **viewBox units**, not pixel units, so they scale identically with existing chart content.
- Container resizing must not cause layout shifts outside the `.chart-container` bounds.

### 5.2 Dark / Light Mode Compatibility

- The project uses CSS custom properties for colors. No hardcoded hex values should be introduced for chart-related colors.
- New stroke/fill colors for the polygons must use **existing CSS custom properties** or new variables defined in `:root` and optionally overridden in a dark-mode context.
- If a dark mode is introduced later, the polygon stroke must remain **low-contrast** (no solid black or solid white).

### 5.3 Screen Reader Accessibility

- The container `<div>` retains `role="img"` and its existing `aria-label`.
- The SVG retains `aria-hidden="true"`.
- New decorative layers must **not** introduce additional accessible names, roles, or `<title>` elements.
- If additional description is needed for the polygons, it must be added via the container `aria-label` or a visually hidden `<span>` outside the SVG, **not** inside the SVG.

### 5.4 Performance

- Rendering time must not increase measurably. Background and polygon shapes should be simple polygons/paths.
- `drawChart()` is called on every slider `input` event and on every `render()`. DOM generation must remain lightweight.

---

## 6. Constraints

- **Do not** introduce external dependencies (no D3, no chart libraries).
- **Do not** change the `drawChart()` public signature (`containerId: string, domains: readonly Domain[]`).
- **Do not** modify `src/app.ts` unless absolutely necessary (prefer internal refactor).
- **Do not** change the radar chart mathematics, axis positions, data polygon rendering, or label placement.
- **Do not** alter the responsive behavior of `.chart-container` (keep `aspect-ratio: 1`, `max-width: 300px`).
- **Do not** break existing unit tests, E2E tests, or TypeScript compilation.
- **Do not** change print stylesheet behavior unless explicitly required.
- **Do not** modify `src/types.ts`.

---

## 7. Refactoring Approach

### 7.1 Code Structure Changes

**File:** `src/chart.ts`

1. **Remove old pentagon overlay**
   - Delete the `buildPentagonOverlay` function and its helper `buildPentagonPoints`.
   - Remove the `<g class="chart-overlay-pentagons">` group from the SVG output.

2. **Add value-level polygon builder**
   - Add a new `buildValueLevelPolygons(size, domains)` helper that generates 5 faint polygons, one per score level.
   - For each level `L` from 1 to 5:
     - Compute radius `r = (L / 5) * maxRadius`.
     - For each domain axis, compute the `(x, y)` point at that radius.
     - Emit a `<polygon>` with `fill="none"`, `stroke="var(--chart-value-level-stroke)"`, `stroke-width="0.75"`, and `opacity="0.25"`.

3. **Maintain DOM layering order**
   Final SVG structure:

   ```xml
   <svg viewBox="0 0 280 280" width="100%" height="100%" class="radar-svg" aria-hidden="true">
     <g class="chart-bg-custom" aria-hidden="true">
       <!-- Custom background SVG -->
     </g>
     <g class="chart-value-level-polygons" aria-hidden="true">
       <!-- 5 faint polygons, one per score level -->
     </g>
     <g class="chart-bg">
       <!-- Existing levels + axes -->
     </g>
     <!-- Existing data polygon, dots, labels, score labels -->
   </svg>
   ```

4. **Add CSS custom property** in `public/styles.css`:

   ```css
   --chart-value-level-stroke: rgba(44, 95, 74, 0.15);
   ```

   Use the variable in the polygon stroke so it adapts to theme changes.

### 7.2 Dependency Updates

**None required.** This is a pure rendering refactor using existing vanilla TypeScript and CSS. No new npm packages are needed.

### 7.3 Step-by-Step Testing

| Step | Action | Expected Outcome |
|------|--------|------------------|
| 1 | Run `npm run typecheck`. | No TypeScript errors. |
| 2 | Run `npm run test`. | All existing unit tests pass. |
| 3 | Run `npm run test:e2e --project=chromium`. | All existing E2E tests pass. |
| 4 | Open assessment view in browser. | Radar chart renders with background and value-level polygons visible. |
| 5 | Resize browser window from 320px to 1200px. | Chart scales smoothly; background and polygons remain proportional; no scrollbars appear inside `.chart-container`. |
| 6 | Move score sliders in assessment view. | Data polygon, dots, and labels update in real time; background and polygons remain static and non-interactive. |
| 7 | Open summary view. | Second chart instance (`summary-chart`) renders identically with background and polygons. |
| 8 | Inspect DOM order in DevTools. | Background group is first, value-level polygon group is second, chart-bg group is third. No `.chart-overlay-pentagons` group exists. |
| 9 | Run screen reader (NVDA / VoiceOver) on chart container. | Only the container `aria-label` is announced; no extra noise from new SVG layers. |
| 10 | Print preview (`Ctrl+P`). | Chart renders correctly in print layout; polygons remain low-contrast but visible. |
| 11 | Run Lighthouse accessibility audit. | No new violations introduced. |
| 12 | Run `npm run build` and preview production bundle. | New layers render correctly in built output. |

### 7.4 Rollback Plan

If issues arise after deployment:

1. **Immediate revert (code-level):**
   - Revert the single commit containing the refactor:
     ```bash
     git revert <commit-sha>
     ```
   - Or restore `src/chart.ts` and `public/styles.css` from the previous commit:
     ```bash
     git checkout <previous-commit-sha> -- src/chart.ts public/styles.css
     ```

2. **Feature flag (recommended for production):**
   - Wrap the new rendering paths behind a feature flag:
     ```typescript
     const ENABLE_CHART_ENHANCEMENTS = false; // toggle to true
     ```
   - If the new layers cause issues, set the flag to `false` without deploying new code.

3. **Hotfix priority:**
   - If polygons obscure data in a specific viewport, patch the polygon `stroke-width` or opacity values in a follow-up commit.
   - If background causes performance degradation, remove the background group first and keep only the polygons (or vice versa) to isolate the issue.

---

## 8. Open Questions / Assumptions

| Item | Assumption / Question |
|------|----------------------|
| Background SVG content | The exact SVG path data for the custom background graphic is not specified. The implementation team must provide the SVG markup. |
| Polygon opacity and stroke width | Exact `opacity` and `stroke-width` values must be tuned visually to ensure polygons are faint enough not to obscure the existing level grid. |
| Dark mode | The app currently has no dark mode. Polygon colors are chosen for light mode only; dark-mode overrides must be added if a theme switch is introduced. |
| Print behavior | Polygons should remain visible in print. If they become distracting, a print-specific style may hide or simplify them. |

---

*Document generated for refactoring `chart-container` component. All file paths are relative to `D:\Code\GitHub\tewhare`.*
