# Unit Tests Specification

## Overview
Vitest + jsdom unit tests verify the core modules in isolation. Tests run in `tests/unit/` and are executed via `npm test`.

## Configuration: `vitest.config.ts`
- Environment: `jsdom` (simulates DOM APIs)
- Globals: enabled (describe, it, expect available without imports)
- Include: `tests/**/*.test.ts`
- Coverage: v8 provider with 80% line/function/branch thresholds

## Test Files

### `tests/unit/storage.test.ts`
Tests the `storage.ts` module with mocked `localStorage`:
- Returns `null` when no saved state exists
- Parses and returns valid saved domains
- Returns `null` for invalid JSON
- Returns `null` when domains is not an array
- Calls `localStorage.setItem` on save
- Calls `localStorage.removeItem` on clear
- Handles localStorage errors gracefully

### `tests/unit/chart.test.ts`
Tests the `chart.ts` SVG renderer with jsdom:
- Renders SVG element with correct viewBox
- Renders all 5 nested polygon levels
- Renders correct number of axes for domain count
- Renders data polygon and dots
- Strips "Taha " prefix from labels
- Calculates correct point positions for score 5
- Handles missing container gracefully

### `tests/unit/app.test.ts`
Tests the `app.ts` controller:
- Renders welcome screen on init
- Starts assessment when start button clicked
- Loads saved state from localStorage
- Renders summary after navigating all domains
- Saves state when score changes
- Resets when reset is confirmed

## Mocking Strategy
- `vi.mock('@src/storage', ...)` — mocks loadState/saveState/clearState
- `vi.mock('@src/chart', ...)` — mocks drawChart
- `vi.stubGlobal('localStorage', ...)` — stubs global localStorage for storage tests

## Path Aliases
Tests use `@src/*` alias defined in both `tsconfig.json` and `vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@src': '/src'
  }
}
```
