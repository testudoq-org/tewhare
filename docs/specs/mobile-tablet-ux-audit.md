# Mobile and Tablet UX Audit and Improvements

## Overview

This document specifies mobile-first UX improvements for the Te Whare Tapa Whā wellbeing reflection web app. The current implementation uses basic responsive breakpoints (480px, 720px) but has several touch-target, spacing, readability, and tablet-specific issues that reduce usability on phones and tablets.

All changes are incremental and preserve existing functionality. No JavaScript behavior changes are required—this spec focuses on CSS and markup adjustments only.

---

## 1. Audit Findings

### 1.1 Touch Target Sizes (Critical)

| Element | Current Size | WCAG Minimum | Status |
|---------|-------------|--------------|--------|
| `.btn` | `padding: 0.7rem 1.4rem` → ~15.4px height | 44×44px | ❌ Fails |
| `.btn.text` | `padding: 0.4rem 0.6rem` → ~9px height | 44×44px | ❌ Fails |
| `.btn.small` | `padding: 0.3rem 0.5rem` → ~7px height | 44×44px | ❌ Fails |
| `.lang-option` | `padding: 1rem 1.5rem` → ~22px height | 44×44px | ❌ Fails |
| Range slider thumb | `22px` diameter | 44×44px | ❌ Fails |
| Score badge | `padding: 0.2rem 0.55rem` → ~9px height | — | ⚠️ Informational |

**Impact:** Users on mobile struggle to tap buttons accurately, especially the small text-style buttons (Export, Import, Edit) in the summary footer. The slider thumb is difficult to grab.

### 1.2 Chart Readability on Mobile

| Element | Current Size | Recommended | Status |
|---------|-------------|-------------|--------|
| `.chart-label` | `11px` | ≥14px on mobile | ❌ Too small |
| `.chart-level-label` | `9px` | ≥12px on mobile | ❌ Too small |
| `.chart-dot` | `r="5"` → 10px diameter | ≥12px on mobile | ⚠️ Borderline |

**Impact:** Chart labels are illegible on phone screens, making the radar chart hard to interpret.

### 1.3 Spacing and Layout Density

| Issue | Current | Problem |
|-------|---------|---------|
| `.assessment-body` gap | `1.75rem` | Acceptable on desktop, cramped on small phones |
| `.summary-cards` gap | `1rem` | Cards feel tight on mobile |
| `.summary-actions` gap | `0.75rem` | Buttons are close together on mobile |
| `#app` padding | `1rem` horizontal | Adequate but could be `0.75rem` on very small screens |
| `max-width: 960px` | Fixed | On tablets in portrait (768px–1024px), content feels too wide |

### 1.4 Navigation and Reachability

| Issue | Current State | Problem |
|-------|---------------|---------|
| Assessment header layout | `flex` with `justify-content: space-between` | On small screens, progress text and reset button can wrap awkwardly |
| Summary footer actions | Flex row that wraps | Buttons wrap to new lines unpredictably on narrow screens |
| No safe-area insets | `padding: 1.5rem 1rem 3rem` | On notched phones (iPhone X+), content may extend under the notch/home indicator |
| No sticky elements | All content scrolls | Users must scroll back to access navigation on long forms |

### 1.5 Breakpoint Coverage

| Viewport | Current Coverage | Gap |
|----------|------------------|-----|
| Phone portrait (< 480px) | Basic single-column layout | Touch targets too small, chart labels tiny |
| Phone landscape (480px–767px) | Single column still | Assessment header cramped, buttons still small |
| Tablet portrait (768px–1023px) | Two-column layout kicks in at 720px | Grid feels narrow on 768px–1024px tablets |
| Tablet landscape (1024px+) | Two-column layout | Generally okay, but could optimize for wider screens |

### 1.6 Form Usability

| Element | Current State | Issue |
|---------|---------------|-------|
| `textarea` | `min-height: 100px`, `resize: vertical` | On mobile, 100px is ~7 lines—adequate but the resize handle is hard to use on touch |
| Range input | Custom styled, 22px thumb | Thumb is too small for precise touch dragging; no `touch-action: manipulation` |
| File input | Hidden, triggered by button | No visible affordance that import is available |

---

## 2. Prioritized Recommendations

### P0 — Critical (Fix Immediately)

| # | Issue | Recommendation |
|---|-------|----------------|
| 1 | Touch targets below 44×44px | Increase all button padding to meet minimum. Use `min-height: 44px` and `min-width: 44px` on `.btn`. |
| 2 | Range slider thumb too small | Increase thumb to 28–32px and add `touch-action: manipulation`. |
| 3 | Chart labels illegible on mobile | Increase `.chart-label` to 14px on mobile, `.chart-level-label` to 12px. |

### P1 — High (Fix in Next Sprint)

| # | Issue | Recommendation |
|---|-------|---------------|
| 4 | Assessment header wraps on small screens | Stack progress and reset button vertically on screens < 400px. |
| 5 | Summary actions wrap unpredictably | Use `flex-wrap: wrap` with explicit `flex-basis` or switch to stacked layout on narrow screens. |
| 6 | No safe-area insets | Add `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` to `#app`. |
| 7 | Tablet portrait feels cramped | Add a 768px breakpoint that slightly increases padding and max-width for tablets. |

### P2 — Medium (Nice to Have)

| # | Issue | Recommendation |
|---|-------|---------------|
| 8 | Textarea resize on mobile | Disable vertical resize on touch devices or increase min-height to 120px. |
| 9 | Chart container max-width | Allow chart to grow slightly on larger phones/tablets (`max-width: 320px` on mobile, `360px` on tablet). |
| 10 | Summary card spacing | Increase gap on mobile to `1.25rem` for better readability. |
| 11 | Language selector min-height | Replace `min-height: 100vh` with `min-height: 100dvh` for better mobile browser handling. |

---

## 3. Implementation Plan

### 3.1 CSS Changes (`public/styles.css`)

#### Touch Targets

```css
/* Base button touch target minimum */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.25rem;
}

.btn.text {
  padding: 0.5rem 0.75rem;
  min-height: 44px;
}

.btn.small {
  padding: 0.4rem 0.6rem;
  min-height: 36px; /* Slightly smaller for secondary actions, still usable */
}
```

#### Range Slider

```css
input[type="range"] {
  touch-action: manipulation;
  height: 12px;
}

input[type="range"]::-webkit-slider-thumb {
  width: 32px;
  height: 32px;
}

input[type="range"]::-moz-range-thumb {
  width: 32px;
  height: 32px;
}
```

#### Chart Labels (Mobile)

```css
@media (max-width: 480px) {
  .chart-label {
    font-size: 14px;
  }
  .chart-level-label {
    font-size: 12px;
  }
}
```

#### Assessment Header (Mobile Stack)

```css
@media (max-width: 400px) {
  .assessment-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .assessment-header .btn {
    align-self: flex-end;
  }
}
```

#### Summary Actions (Mobile)

```css
@media (max-width: 480px) {
  .summary-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-actions .btn {
    width: 100%;
  }
}
```

#### Safe Areas

```css
#app {
  padding: 1.5rem 1rem 3rem;
  padding: max(1rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right)) max(2rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
}
```

#### Tablet Optimization

```css
@media (min-width: 768px) {
  #app {
    max-width: 1024px;
    padding: 2rem;
  }
  
  .assessment-body {
    gap: 2rem;
  }
  
  .chart-container {
    max-width: 360px;
  }
}
```

#### Language Selector

```css
.lang-selector {
  min-height: 100dvh;
}
```

#### Textarea

```css
@media (max-width: 480px) {
  textarea {
    min-height: 120px;
    font-size: 1rem; /* Prevent iOS zoom on focus */
  }
}
```

### 3.2 HTML Changes (`src/app.ts`)

No structural HTML changes required. The existing template literals already use semantic classes that will be styled by the new CSS.

One addition: ensure the import input has an accessible label (currently hidden):

```typescript
// In renderSummary(), update the file input to include aria-label
`<input type="file" accept=".json" data-import-input style="display: none;" aria-label="${escapeHtml(t('import.button', this.language))}" />`
```

### 3.3 Tests

#### Unit Tests (`tests/unit/app.test.ts`)

Add responsive rendering tests:
- Verify assessment header renders correctly on narrow viewports
- Verify summary actions render full-width buttons on mobile
- Verify export/import buttons are present and have correct classes

#### E2E Tests (`tests/e2e/reflection.spec.ts`)

Add mobile viewport tests:
- Test complete assessment flow at 375×667 (iPhone SE)
- Test complete assessment flow at 768×1024 (iPad portrait)
- Test landscape orientation at 667×375
- Verify touch targets are tappable (Playwright can simulate taps)
- Verify chart labels are visible on mobile viewport

---

## 4. Success Metrics

- All interactive elements meet or exceed 44×44px touch target minimum.
- Chart labels are legible (≥14px) on viewports ≤ 480px wide.
- Assessment header stacks vertically on viewports ≤ 400px wide.
- Summary actions are full-width buttons on viewports ≤ 480px wide.
- Safe-area insets are respected on notched devices.
- No horizontal scroll on any viewport from 320px to 1024px.
- All existing unit and E2E tests pass without modification.
- Playwright mobile viewport tests pass.

---

## 5. Rollout Plan

1. **CSS-only first:** Implement all CSS changes in `public/styles.css`. This is the lowest-risk phase because it does not alter JavaScript behavior.
2. **Verify existing tests:** Run full test suite to confirm no regressions.
3. **Add mobile E2E tests:** Add Playwright tests for 375×667, 768×1024, and landscape viewports.
4. **Manual QA:** Test on physical iOS and Android devices if available.
5. **Documentation:** Update this spec with any adjustments made during QA.

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Larger buttons break desktop layout | Use `min-height`/`min-width` instead of fixed sizes; desktop layout remains flexible |
| Increased padding causes horizontal overflow on very small screens | Use `max(0.75rem, env(safe-area-inset-right))` pattern and test at 320px viewport |
| Chart label size increase causes SVG overlap | Increase `max-width` of chart container on mobile to accommodate larger text |
| Safe-area padding causes layout shift | Use `max()` to combine fixed padding with safe-area values |
