# End-to-End Tests Specification

## Overview
Playwright E2E tests verify the complete user flow in a real browser. Tests run against a live dev server and cover the full application experience.

## Configuration: `playwright.config.ts`

### Projects
- `chromium` — Desktop Chrome
- `firefox` — Desktop Firefox
- `webkit` — Desktop Safari
- `Mobile Chrome` — Pixel 5 viewport
- `Mobile Safari` — iPhone 13 viewport

### Web Server
- Command: `npx vite --port 3000`
- URL: `http://localhost:3000`
- Reuse existing server in local development

### Test Directory
`tests/e2e/reflection.spec.ts`

## Test Coverage

### Navigation Flow
- Displays welcome screen with title and start button
- Starts assessment flow when start clicked
- Navigates through all 4 domains (tinana, hinengaro, wairua, whanau)
- Shows summary after last domain
- Allows back/forth navigation
- Allows editing from summary back to assessment

### Interaction
- Updates score via range slider
- Updates chart dynamically when score changes
- Adds reflection text to textarea
- Saves state on input changes

### Summary Features
- Displays radar chart in summary view
- Shows domain cards with scores and reflections
- Shows shape interpretation note
- Shows average score

### Actions
- Print summary (verifies `window.print` called)
- Reset assessment with confirmation dialog

### Responsive Design
- Tested on mobile viewport (375x667)
- Assessment body and chart remain visible and usable

## Running E2E Tests
```bash
npm run test:e2e
```
Runs all projects. For local development, use:
```bash
npm run test:e2e:ui
```
