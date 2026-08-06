# App Controller Specification

## Overview
`src/app.ts` is the main application controller. It manages state, handles user interactions, and renders the UI for the three primary screens: welcome, assessment, and summary.

## Class: App

### State
```typescript
private state: AssessmentState;
```
Immutable state object containing:
- `domains: Domain[]` — current assessment data
- `currentStep: number` — 0 = welcome, 1–4 = assessment steps
- `showSummary: boolean` — whether to show the summary view

### Initialization
1. Loads saved state from `localStorage` via `loadState()`
2. Falls back to `createDefaultDomains()` if no saved state
3. Calls `init()` which renders and binds events

### Event Handling

#### Click Events
- `[data-action="start"]` — begins assessment, clones domains, sets step to 1
- `[data-action="next"]` — advances to next step or summary
- `[data-action="prev"]` — goes back or from summary to last step
- `[data-action="reset"]` — confirms and clears all state
- `[data-action="print"]` — triggers `window.print()`
- `[data-action="edit"]` — jumps to specific domain from summary

#### Input Events
- `[data-score]` — updates domain score (1–5 clamped), saves state, updates chart
- `[data-reflection]` — updates domain reflection text, saves state

### Rendering
- `renderWelcome()` — static welcome screen with cultural context
- `renderAssessment()` — step-by-step domain evaluation with live chart
- `renderSummary()` — final overview with chart, shape analysis, and domain cards

### Chart Integration
- `updateChart()` — calls `drawChart()` for live and/or summary containers
- Triggered on score changes and screen transitions

## Export: bootstrap
```typescript
export const bootstrap = (): void => { new App(); }
```
Used by tests to instantiate the app without DOMContentLoaded dependency.

## Design Decisions
- State is always cloned before mutation to preserve referential integrity
- Storage writes are debounced implicitly by event-driven updates
- HTML is generated via string concatenation for minimal footprint (no template library)
- `escapeHtml()` prevents XSS in user reflection text
