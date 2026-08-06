# Chart Module Specification

## Overview
`src/chart.ts` renders the radar/pentagon visualization for the wellbeing assessment. It produces pure SVG markup injected into a container element.

## Core Function
```typescript
export const drawChart = (containerId: string, domains: readonly Domain[]): void
```

## Rendering Logic

### Coordinate System
- SVG viewBox: `0 0 280 280`
- Center point: `(140, 140)`
- Max radius: `110px`
- 5 nested polygon levels (1–5)
- Start angle: `-Math.PI / 2` (top of circle)

### Generated SVG Elements
1. **Background levels** — 5 nested polygons (`level-5` to `level-1`) with decreasing radii
2. **Axes** — lines from center to max radius for each domain
3. **Data polygon** — filled polygon connecting score points
4. **Data dots** — circles at each score point (radius 5px)
5. **Labels** — domain names without "Taha " prefix, positioned outside the chart
6. **Score labels** — small numbers 1–5 along the first axis

### Dynamic Updates
- Re-renders entirely on each call (no incremental updates)
- Called during `input` events for live chart updates
- Called after navigation to update both live and summary charts

## Accessibility
- Container has `role="img"` with `aria-label`
- SVG has `aria-hidden="true"` because the container provides the accessible name
- Decorative elements have no additional ARIA attributes

## Test Coverage
Unit tests in `tests/unit/chart.test.ts` verify:
- SVG element creation with correct viewBox
- All 5 polygon levels rendered
- Correct number of axes for domain count
- Data polygon and dots rendered
- Labels strip "Taha " prefix
- Point positions calculate correctly for score 5
- Graceful handling of missing container
