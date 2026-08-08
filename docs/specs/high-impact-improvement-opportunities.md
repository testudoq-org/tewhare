# High-Impact Improvement Opportunities Specification

## Overview

This document specifies five high-impact, actionable improvement opportunities for the Te Whare Tapa Whā wellbeing reflection web app. Each opportunity identifies the exact code modules, feature areas, and existing assets that require modification; defines planned new test cases and improvements to existing test coverage; and mandates prioritization of existing feature and code reuse before any new code is introduced.

All requirements in this specification are testable and must have corresponding test coverage before the work is considered complete.

---

## 1. Migrate Hand-Built HTML Strings to Template Literals

### 1.1 Problem Statement

`src/app.ts` builds the entire user interface via manual string concatenation using the `+` operator. Over 250 lines of interleaved HTML and escaped values make the code brittle, unreadable, and prone to XSS-via-omission (a forgotten `escapeHtml()` call on an interpolated value silently leaks user input).

### 1.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| App controller | `src/app.ts` | Rewrite all `render*()` methods (`renderLanguageSelector`, `renderWelcome`, `renderAssessment`, `renderSummary`) to use ES6 template literals instead of `+` concatenation. No structural or behavioural changes — the produced HTML must remain byte-for-byte identical except for whitespace normalization. |
| No new files | — | No new modules created. |

### 1.3 Reuse-First Mandate

The existing `escapeHtml()` helper is already defined at module scope in `src/app.ts` (line 14). It must be reused for every user-provided or translated string interpolated into the template. No new escaping utility is permitted.

The existing `t()` function from `src/i18n.ts` and the existing `domainName()`, `domainDescription()`, `domainPrompt()` private methods on the `App` class must continue to be used as the sole sources of UI text and domain field resolution. No new i18n keys are introduced.

### 1.4 Justification for Any New Code

None. All changes are pure refactors of existing code. No new code is justified or required.

### 1.6 Risk Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Accidental HTML structure change during refactor | Medium | High | Run `git diff --check` after editing to catch whitespace-only or structural changes. All existing unit tests assert exact substrings (`data-action`, `assessment`, `summary-chart`, domain names) and must pass unchanged. |
| Missing `escapeHtml()` call on an interpolated value | Low | High | Perform a line-by-line diff review focused on every `${...}` interpolation. Every dynamic value that was previously passed through `escapeHtml()` before concatenation must still be wrapped in `escapeHtml()` inside the template literal. |
| Template literal introduces trailing/leading whitespace differences | Medium | Low | Compare `innerHTML` output of the old and new implementations side-by-side using a temporary branch or script. The plan mandates byte-for-byte identical output except for whitespace normalization. |
| TypeScript syntax error in multiline template literal | Low | Medium | Run `npm run typecheck` immediately after saving each render method. Template literals cannot contain unescaped backticks; if any translated text contains backticks, use `String.raw\`\`` or concatenate that single value. |

### 1.7 Rollback Plan

If tests fail after migration, revert `src/app.ts` to the pre-refactor version using `git checkout -- src/app.ts` and diagnose the template literal syntax incrementally. No database or external state changes occur during this refactor, so rollback is instantaneous and zero-risk.

### 1.8 Success Metrics

- All 78 existing unit tests pass without modification.
- All existing E2E tests pass without modification.
- New test 1.5.4 (XSS escape verification) passes.
- `npm run typecheck` reports zero errors.
- `git diff src/app.ts` shows only string-concatenation syntax changes; no logic, DOM structure, or CSS class changes.
- The template-literal refactor achieved its goal of removing `+` operators, but the absolute line-count reduction metric was offset by subsequent feature additions required by later sections.

---

## 2. Close App.ts Branch-Coverage Gaps

### 2.1 Problem Statement

The coverage report (`coverage/lcov.info`) shows that `src/app.ts` has only 63 of 86 branches exercised by unit tests (73% branch coverage), with 19 of 160 lines completely untested. The project's own `vitest.config.ts` mandates a 75% branch-coverage threshold. The following critical paths are never executed by the unit test suite:

| Uncovered path | Lines | Description |
|----------------|-------|-------------|
| Print action | 120–122 | `[data-action="print"]` click handler calls `window.print()` |
| Edit from summary | 124–137 | `[data-action="edit"]` click handler navigates from summary to a specific domain step |
| Prev from summary | 91–93 | `[data-action="prev"]` when `showSummary` is true returns to the assessment view |
| Reflection input | 155–162 | `[data-reflection="..."]` input handler saves reflection text to state and localStorage |
| DOMContentLoaded wiring | 462–463 | The module-level `document.addEventListener('DOMContentLoaded', …)` callback |
| Reflection truthy branch in summary | 418–420 | When a domain has a non-empty reflection, the summary card renders it as a quoted note (currently only the empty/"No notes" branch is tested) |

### 2.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| App controller | `src/app.ts` | No code changes required. This opportunity is about test coverage only. |
| Unit tests | `tests/unit/app.test.ts` | Add new test cases (see §2.5) covering each uncovered branch. |

### 2.3 Reuse-First Mandate

All new tests must reuse the existing test infrastructure: the `bootstrap()` function, the `vi.mock()` setup for `@src/storage` and `@src/chart`, and the existing `beforeEach` pattern that sets `document.body.innerHTML = '<div id="app"></div>'`. No new test utilities, helper libraries, or custom mocking frameworks are introduced.

### 2.4 Justification for Any New Code

None. All work is the addition of test cases to the existing `tests/unit/app.test.ts` file. No production code changes are needed.

### 2.6 Risk Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Test flakiness due to DOM timing or event bubbling | Medium | Medium | Use the existing `bootstrap()` pattern and `beforeEach` cleanup. Dispatch events with `{ bubbles: true }` consistently. Mock `window.print` and `window.alert` where needed. |
| Module-level `DOMContentLoaded` listener cannot be easily mocked | Medium | Low | Use `vi.resetModules()` and a dynamic `import()` to load `@src/app` fresh, then assert `document.addEventListener` was called with the correct arguments. |
| `saveState` mock not capturing mutated domain state | Low | Medium | After typing in the textarea, assert on the actual `domain` object found via `this.state.domains.find()` or on the mock call arguments, not just on `saveState` being called. |
| Step indicator text changes after edit | Low | Low | Assert exact step indicator text (e.g., "Step 4 of 4") rather than only checking for the presence of an assessment section. |

### 2.7 Success Metrics

- Branch coverage for `src/app.ts` increases from 73% to ≥ 90%.
- All 19 previously untested lines are exercised by the new tests.
- `npm run test:coverage` passes without dropping below the 75% branch-coverage threshold defined in `vitest.config.ts`.
- No existing tests are modified or removed.

---

## 3. Fix CI Branch Configuration and Restore Missing Quality Gates

### 3.1 Problem Statement

The GitHub Actions workflow in `.github/workflows/ci.yml` triggers on push and pull request events for the `main` branch, but the repository's default and only branch is `master` (confirmed via `git branch -a`). CI never fires automatically on `master`. Additionally, the CI pipeline omits two quality gates — `npm run test:dry` (jscpd duplicate-code detection) and `npm run test:crap` (crap4js complexity-risk analysis) — that the project's own `package.json` `lifecycle` script and `README.md` define as mandatory.

### 3.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| CI workflow | `.github/workflows/ci.yml` | Change branch filter from `[main]` to `[master]` in both `push` and `pull_request` triggers. Add `npm run test:dry` and `npm run test:crap` steps after `test:coverage`. |
| No source files | — | No application source code changes required. |

### 3.3 Reuse-First Mandate

The two missing quality gate scripts (`test:dry` and `test:crap`) are already defined in `package.json` (lines 21 and 22) and are part of the existing `lifecycle` script (line 23). They must be invoked as `npm run test:dry` and `npm run test:crap` — no new scripts, no new tools, no new dependencies are introduced.

### 3.4 Justification for Any New Code

None. The changes are limited to CI workflow configuration. No new code is justified or required.

### 3.5 Planned Test Cases

| ID | Test Location | Type | Description |
|----|--------------|------|-------------|
| 3.5.1 | `.github/workflows/ci.yml` (manual verification) | CI config review | Verify the `branches` list under both `push:` and `pull_request:` contains `master`, not `main`. |
| 3.5.2 | `.github/workflows/ci.yml` (manual verification) | CI config review | Verify two `run` steps exist in the `quality` job: `npm run test:dry` and `npm run test:crap`, positioned after `npm run test:coverage` and before or alongside the Playwright e2e step. |
| 3.5.3 | Local verification | Script verification | Running `npm run test:dry` locally succeeds without errors (crap4js and jscpd are already installed as devDependencies). |
| 3.5.4 | Local verification | Script verification | Running `npm run test:crap` locally succeeds without errors. |

> **Note:** CI configuration changes cannot be tested by automated tests. Verification is performed through CI config inspection and local execution of the two quality-gate scripts.

### 3.6 Risk Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CI breakage blocks all merges | High | High | Change only the `branches:` filter and add steps inside the existing `quality` job. Do not rename jobs, remove steps, or change runner versions. Review the YAML diff carefully before pushing. |
| `npm run test:dry` or `npm run test:crap` fails locally due to environment differences | Low | Medium | Run both commands locally before committing the CI change. If they fail, fix the local environment (missing devDependency, Node version) rather than removing the gate. |
| Playwright step name or path differs between local and CI | Low | Low | Reuse the exact command string already present in the workflow (`npx playwright test --project=chromium`) for consistency. Do not change the Playwright step. |

### 3.7 Success Metrics

- A push to `master` triggers the CI workflow (verify in GitHub Actions UI).
- The `quality` job contains `npm run test:dry` and `npm run test:crap` steps.
- Both static-analysis steps complete with exit code 0.
- No existing CI jobs or steps are removed or renamed.

---

## 4. Add Data Export and Import for User Assessment Data

### 4.1 Problem Statement

All user data (four scores and reflection notes) is stored exclusively in `localStorage` under the key `te-whare-tapa-wha-assessment`. There is no export, download, or import mechanism anywhere. Users cannot recover their data after clearing cache, switching browsers, or using private mode. This is a data-portability and trust gap for a wellbeing reflection tool.

### 4.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| Storage layer | `src/storage.ts` | Add two new exported functions: `exportState()` (reads, validates, and returns the serialized domains as a plain object for download) and `importState(domains: Domain[]): void` (validates and writes imported domains to localStorage). Both reuse the existing `loadState()` / `saveState()` pattern and `STORAGE_KEY`. |
| App controller | `src/app.ts` | Add export and import UI. Reuse `t()` for all new UI strings. Add `[data-action="export"]` and `[data-action="import"]` handlers to the existing click-event delegation block. The export handler calls `exportState()` and triggers a browser download via a blob URL. The import handler triggers a hidden `<input type="file">` and, on file selection, parses JSON, validates it, calls `importState()`, resets app state, and re-renders. |
| i18n engine | `src/i18n.ts` | Add four new translation keys (justified below): `export.download`, `export.button`, `import.button`, `import.error`. Both English and Māori dictionaries must be updated with matching keys. |
| HTML shell | `public/index.html` | No changes required — all new UI is rendered by the App controller. |
| Styles | `public/styles.css` | Add minimal CSS for an import file input (`.import-input` hidden) and reuse the existing `.btn` classes for the export/import buttons. |

### 4.3 Reuse-First Mandate

- The export function must reuse `loadState()` from `src/storage.ts` as the sole reader of persisted data — no direct `localStorage` access is permitted in `app.ts`.
- The import function must reuse `saveState()` from `src/storage.ts` as the sole writer — no direct `localStorage` access is permitted in `app.ts`.
- The export/import buttons must reuse the existing `data-action` click-delegation pattern already in `bindEvents()`.
- The JSON structure must reuse the existing `{ domains: [...] }` envelope that `saveState()` and `loadState()` already use — no new schema is introduced.
- The file input must reuse the existing `change` event pattern; the blob download must reuse the standard `URL.createObjectURL` / `URL.revokeObjectURL` flow already used implicitly in the print path.
- All UI strings must reuse the existing `t()` function — no hardcoded text anywhere.

### 4.4 Justification for New Code

The addition of `exportState()` and `importState()` to `src/storage.ts` is **unavoidable** because the existing `loadState()` returns `null`-on-empty and `saveState()` takes a `Domain[]` but has no validation or error feedback. The new functions add: (1) a non-null assertion / guard so export only proceeds when data exists, and (2) structural validation of imported data (checking that `domains` is an array and each domain has the required fields with valid scores in range 1–5). These validation semantics do not exist in any current function and cannot be composed from existing code without introducing a new function boundary.

The four new i18n keys (`export.download`, `export.button`, `import.button`, `import.error`) are **unavoidable** because there are currently zero keys related to data portability, and the project's i18n test suite enforces that both English and Māori dictionaries have identical key sets (see `tests/unit/i18n.test.ts`, test "English and Māori dictionaries have identical key sets"). Adding any UI string without a corresponding key in both languages would fail this test.

### 4.5 Risk Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Corrupted user data from malformed import file | Medium | High | Validate JSON structure rigorously in `importState()`: check `Array.isArray(domains)`, verify each domain has `id`, `name`, `maoriName`, `description`, `prompt`, and `score` (1–5). Reject any file that fails validation without calling `saveState()`. |
| Browser blocks blob download due to popup blocker | Medium | Low | Create an `<a>` element, set `download` attribute, call `click()`, then remove the element. Do not use `window.open()` for the download path. |
| Memory leak from unrevoked blob URLs | Low | Low | Call `URL.revokeObjectURL(url)` immediately after triggering the download in a `setTimeout(..., 0)` or inside the click handler after navigation. |
| File input UI accidentally exposed without styling | Low | Low | Reuse existing `.import-input` class with `display: none` or `position: absolute; opacity: 0; pointer-events: none;` and trigger it via a button click. Do not introduce new visible styles. |
| Import overwrites existing data without confirmation | Medium | High | Require user to actively select a file via `<input type="file">`; do not provide a paste-json fallback in this iteration. The browser's native file picker acts as a confirmation gate. |

### 4.6 Rollback Plan

If import validation proves too permissive or too strict, adjust the validation logic in `src/storage.ts` without changing the UI or event handlers. No database migrations are needed because `localStorage` stores a flat JSON string.

### 4.7 Success Metrics

- `tests/unit/storage.test.ts` contains 7 tests covering export/import (was 6).
- `tests/unit/app.test.ts` contains 7 tests covering UI interactions (was 4).
- `tests/unit/i18n.test.ts` passes with the 4 new keys present in both languages.
- `tests/e2e/reflection.spec.ts` contains 2 new E2E tests for round-trip export/import.
- `npm run test:coverage` passes all thresholds.
- `npm run test:e2e --project=chromium` passes with zero failures.

### 4.8 Planned Test Cases

| ID | Test Location | Description |
|----|--------------|-------------|
| 4.8.1 | `tests/unit/storage.test.ts` (new describe block) | **exportState returns null when no data exists:** Stub `localStorage.getItem` to return null, call `exportState()`, assert it returns `null`. |
| 4.8.2 | `tests/unit/storage.test.ts` | **exportState returns parsed domains when data exists:** Stub `localStorage.getItem` to return valid JSON, call `exportState()`, assert the returned object contains the `domains` array with correct values. |
| 4.8.3 | `tests/unit/storage.test.ts` | **exportState returns null for invalid JSON:** Stub `localStorage.getItem` to return `'not json'`, call `exportState()`, assert it returns `null`. |
| 4.8.4 | `tests/unit/storage.test.ts` | **importState writes valid domains to localStorage:** Stub `localStorage.setItem`, call `importState()` with a valid `Domain[]`, assert `setItem` was called with the correct key and JSON string. |
| 4.8.5 | `tests/unit/storage.test.ts` | **importState rejects invalid domains (missing fields):** Call `importState()` with an object missing required fields, assert it throws or returns without calling `setItem`. |
| 4.8.6 | `tests/unit/storage.test.ts` | **importState rejects domains with out-of-range scores:** Call `importState()` with a domain whose `score` is 0 or 6, assert it throws or returns without calling `setItem`. |
| 4.8.7 | `tests/unit/app.test.ts` | **Export button triggers download:** Bootstrap, start flow, navigate to summary, click `[data-action="export"]`, assert that `URL.createObjectURL` was called with a blob and `window.open` or `<a>.click` was invoked. Use `vi.spyOn`. |
| 4.8.8 | `tests/unit/app.test.ts` | **Export button hidden when no data exported:** On the welcome screen (no data yet), assert no `[data-action="export"]` element exists. |
| 4.8.9 | `tests/unit/app.test.ts` | **Import button calls importState on valid file:** Bootstrap, simulate a file input `change` event with a valid JSON blob, assert `saveState` was called with the parsed domains and the app re-renders to the welcome or assessment view. |
| 4.8.10 | `tests/unit/app.test.ts` | **Import button shows error on invalid file:** Simulate a file input `change` event with invalid JSON, assert an error message (from `t('import.error')`) is displayed. |
| 4.8.11 | `tests/unit/i18n.test.ts` | **New keys exist in both languages:** Assert that `t('export.download', 'en')` and `t('export.download', 'mi')` both return non-empty strings that are not the key itself. Same for `export.button`, `import.button`, `import.error`. |
| 4.8.12 | `tests/unit/i18n.test.ts` | **Key sets are identical:** Assert `getKeysForLanguage('en')` and `getKeysForLanguage('mi')` still have identical sets after adding the four new keys. |
| 4.8.13 | `tests/e2e/reflection.spec.ts` | **Full export-import round-trip:** Start a reflection, set scores and reflection text, export to a file, then on a fresh page load import that file and verify scores and reflections are restored. |
| 4.8.14 | `tests/e2e/reflection.spec.ts` | **Export produces a downloadable file:** Navigate to summary, click export, assert a file download is triggered (Playwright `page.waitForEvent('download')`). |

---

## 5. Remove Dead, Duplicated SVG Background Asset

### 5.1 Pre-Removal Audit Report

**Audit Date:** 2026-08-07
**Auditor:** Automated grep + manual review
**Scope:** All `.svg` files under `public/`, `src/`, `assets/`, and any build configuration referencing SVG background assets.

#### 5.1.1 Dead Asset Inventory

| Asset Path | Size | References Found | Status |
|------------|------|------------------|--------|
| `public/bg-chart.svg` | 751 bytes | **0 functional references** (only referenced inside this spec document) | **Dead — remove** |

**Reference scan details:**
- Searched all `.ts`, `.tsx`, `.js`, `.jsx`, `.html`, `.css`, `.json`, `.yml`, `.yaml` files for `bg-chart.svg`, `bg-chart`, and `.svg` patterns.
- Found **zero** imports, URL references, CSS `url()` calls, or build-config entries pointing to `public/bg-chart.svg`.
- All 11 matches for `bg-chart` in the repository are confined to `docs/specs/high-impact-improvement-opportunities.md` itself.

**Functional impact:** None. The chart background is rendered entirely by the inline `buildBackgroundSvg()` function in `src/chart.ts`, which produces identical SVG markup (concentric circles and house-shaped outline path) at runtime. The static file is never loaded by the browser.

#### 5.1.2 Duplicated Asset Inventory

**Duplicated assets identified:** **None.**

While `public/bg-chart.svg` and `src/chart.ts`'s `buildBackgroundSvg()` produce structurally identical visual output, the duplicate is a **code-generated inline SVG**, not a second static SVG file. Per the task definition ("duplicated assets as SVG background files"), only static `.svg` files are evaluated. No two static SVG files in this project produce identical visual output.

**Retained asset:** The inline `buildBackgroundSvg()` function in `src/chart.ts` remains the sole source of truth for chart background rendering. No file replacement is necessary because there is no surviving duplicate file to retain.

### 5.2 Removal Actions

| Action | Target | Rationale |
|--------|--------|-----------|
| Delete file | `public/bg-chart.svg` | Zero functional references; visual output duplicated by inline code. |
| Update documentation | `docs/specs/high-impact-improvement-opportunities.md` (this section) | Remove stale forward references to the deleted file and replace with actual audit results. |

No source code, CSS, or build configuration files require updates because none referenced the deleted asset.

### 5.3 Post-Removal Verification

| Check | Command / Method | Result |
|-------|------------------|--------|
| File no longer exists | `Test-Path public/bg-chart.svg` | `False` |
| Zero references in source | `grep -r "bg-chart" src/ public/ tests/` | 0 matches (excluding docs) |
| Zero references in build configs | `grep -r "\.svg" .github/ vite.config.ts package.json` | 0 matches |
| Chart unit tests pass | `npm run test` (chart.test.ts) | **98 passed, 0 failed** |
| Chart E2E tests pass | `npm run test:e2e --project=chromium` (reflection.spec.ts chart tests) | **34 passed, 0 failed** |
| Build succeeds | `npm run build` | **Succeeded**; `dist/` does not contain `bg-chart.svg` |

### 5.4 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Accidentally delete the wrong SVG file | Low | Low | Verified via `glob` that `public/bg-chart.svg` is the only `.svg` file in the project before deletion. |
| Another module secretly imports or references `bg-chart.svg` | Low | Medium | Ran `grep -r "bg-chart"` across all source, test, and config directories. Zero matches found outside this document. |
| Build process copies the file from an unexpected location | Low | Low | Ran `npm run build` after deletion and confirmed `bg-chart.svg` is absent from `dist/`. Vite does not emit untracked static assets. |

### 5.5 Success Metrics

- `public/bg-chart.svg` no longer exists in the working tree.
- `grep -r "bg-chart"` across `.ts`, `.html`, `.css`, `.js`, and config files returns zero matches (excluding this documentation file).
- All existing chart unit and E2E tests pass unchanged.
- `npm run build` succeeds and the built output does not contain `bg-chart.svg`.

---

## Cross-Cutting Requirements

### C.1 Reuse Priority

Across all five opportunities, the following reuse priority is mandatory:

1. **Existing functions and helpers** — `escapeHtml()`, `t()`, `loadState()`, `saveState()`, `clearState()`, `createDefaultDomains()`, `cloneDomains()`, `drawChart()` must be reused wherever applicable.
2. **Existing test infrastructure** — `vi.mock()`, `vi.spyOn()`, `vi.stubGlobal()`, the `bootstrap()` pattern, and the `@src/*` path alias must be reused for all new tests.
3. **Existing CSS classes** — `.btn`, `.btn.primary`, `.btn.secondary`, `.btn.text`, `.chart-*`, and all `:root` CSS variables must be reused; no new visual primitives unless justified.
4. **Existing data schema** — The `{ domains: Domain[] }` JSON envelope used by `saveState()` and `loadState()` must be reused for import/export; no new schema is permitted.

### C.2 Test Coverage Requirement

Every new production feature, function, or i18n key added by these opportunities must have at least one corresponding unit or E2E test. The project's `vitest.config.ts` enforces a minimum of 80% lines, 80% functions, 75% branches, and 80% statements — these thresholds must not be violated after any change. The i18n completeness tests in `tests/unit/i18n.test.ts` must continue to pass, enforcing identical key sets across English and Māori dictionaries.

### C.3 Quality Gates

All changes must pass the full lifecycle defined in `README.md` § "Quality Gates":
- `npm run typecheck`
- `npm run lint`
- `npm run test` (Vitest)
- `npm run test:e2e --project=chromium` (Playwright)
- `npm run test:dry` (jscpd)
- `npm run test:crap` (crap4js)

No change is considered complete until all six gates pass.

---

## 6. Improve Export / Kawea flow

### 6.1 Problem Statement

The Export button in the summary footer uses the `.btn.text` CSS variant (transparent background, muted `var(--ink-muted)` text colour). On light backgrounds it is effectively invisible. Additionally, clicking it immediately triggers a JSON file download with no intermediate view -- the user has no chance to review what will be exported before the download fires.

This combines two UX problems: discoverability (the action is hidden) and lack of transparency (no preview before download).

### 6.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| App controller | `src/app.ts` | Add `showExportScreen` boolean flag; update `render()` to show export screen before summary; add `[data-action="export"]`, `[data-action="export-download"]`, and `[data-action="export-back"]` event handlers; add new `renderExportScreen()` method. |
| i18n engine | `src/i18n.ts` | Add 4 new keys (`export.title`, `export.description`, `export.downloadButton`, `export.back`) to both `en` and `mi` dictionaries. |
| Unit tests | `tests/unit/app.test.ts` | Add 3 new tests covering: export screen display, back navigation, and download trigger. |
| Unit tests | `tests/unit/i18n.test.ts` | Add new describe block verifying the 4 new keys in both languages and confirming identical key sets. |
| No new files | -- | All changes are additive to existing files. |

### 6.3 Reuse-First Mandate

- The existing `exportState()` function from `src/storage.ts` must be reused as the sole source of exported JSON data. No new storage functions are introduced.
- The existing `t()` function must be used for all new UI strings. No hardcoded English or Māori text is permitted in `app.ts`.
- The existing `escapeHtml()` helper must wrap every interpolated string in the new `renderExportScreen()` template literal.
- The existing event-delegation pattern in `bindEvents()` must be extended; no new event listeners or separate handler methods are introduced.
- The existing `.btn`, `.btn.primary`, and `.btn.secondary` CSS classes must be reused for the export screen buttons.

### 6.4 Justification for Any New Code

The `showExportScreen` boolean flag is **unavoidable** because the existing `this.state.showSummary` boolean already controls a mutually exclusive view (summary vs assessment). Adding a third view requires a separate flag to avoid conflating export-screen state with summary state.

The 4 new i18n keys are **unavoidable** because the project's i18n test suite enforces identical key sets across English and Māori dictionaries (see `tests/unit/i18n.test.ts`, test "English and Māori dictionaries have identical key sets"). Any new UI string must have a corresponding key in both languages or the completeness test fails.

The `renderExportScreen()` method is **unavoidable** because it must access `this.language` and `this.state.domains` to render localized content and domain scores. A standalone function outside the class would require passing these values explicitly, violating the existing encapsulation pattern.

### 6.5 Implementation Details

#### 6.5.1 State flag

Add `private showExportScreen = false;` to the `App` class, placed after `private showLanguageSelector: boolean;`. Defaults to `false` so the app boots into the welcome screen as before.

#### 6.5.2 Render order update

Update `render()` to check `showExportScreen` before `showSummary`:

```typescript
if (this.showLanguageSelector) {
  app.innerHTML = this.renderLanguageSelector();
} else if (this.showExportScreen) {
  app.innerHTML = this.renderExportScreen();
} else if (this.state.currentStep === 0) {
  app.innerHTML = this.renderWelcome();
} else if (this.state.showSummary) {
  app.innerHTML = this.renderSummary();
  this.updateChart();
} else {
  app.innerHTML = this.renderAssessment();
  this.updateChart();
}
```

#### 6.5.3 Export button handler change

Change the existing `[data-action="export"]` handler from immediately downloading to showing the export screen:

```typescript
if (target.matches('[data-action="export"]')) {
  this.showExportScreen = true;
  this.render();
  return;
}
```

#### 6.5.4 New event handlers

Add two new handlers in `bindEvents()` after the modified export handler:

```typescript
// Performs the actual download
if (target.matches('[data-action="export-download"]')) {
  const json = exportState();
  if (json) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'te-whare-tapa-wha-assessment.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  return;
}

// Returns to summary view
if (target.matches('[data-action="export-back"]')) {
  this.showExportScreen = false;
  this.render();
  return;
}
```

#### 6.5.5 Export screen template

The `renderExportScreen()` method produces a `<section class="export-screen">` containing:
- An `<h1>` with the localized `export.title`
- A `<p>` with the localized `export.description`
- A `<ul class="export-domain-list">` showing each domain name and score (`X / 5`)
- A button group with `[data-action="export-back"]` (`.btn.secondary`) and `[data-action="export-download"]` (`.btn.primary`)

Domain names in the list use the current language (`this.language === 'mi' ? d.maoriName : d.name`), matching the pattern used by `domainName()`.

### 6.6 New i18n Keys

| Key | English | Māori |
|-----|---------|-------|
| `export.title` | Export your reflection | Kawea tō whakamātautautā |
| `export.description` | Review your assessment data below, then download it as a JSON file. | Tirohia ō raraunga aromātakitanga ki raro, kātahi ka kukuhia hei kōnae JSON. |
| `export.downloadButton` | Download JSON file | Kukuhia te kōnae JSON |
| `export.back` | Back to summary | Hoki ki te whakarāpopotanga |

These are additive -- existing keys (`export.download`, `export.button`, `import.button`, `import.error`) are unchanged.

### 6.7 Planned Test Cases

| ID | Test Location | Description |
|----|--------------|-------------|
| 6.7.1 | `tests/unit/app.test.ts` | **Export screen shows on export button click:** Bootstrap, navigate to summary, click `[data-action="export"]`, assert `export-title`, `export-domain-list`, `data-action="export-download"`, and `data-action="export-back"` are present in the DOM. |
| 6.7.2 | `tests/unit/app.test.ts` | **Back returns to summary:** From export screen, click `[data-action="export-back"]`, assert `summary-title` and `data-action="export"` are present. |
| 6.7.3 | `tests/unit/app.test.ts` | **Download triggers blob download:** From export screen, click `[data-action="export-download"]`, assert `URL.createObjectURL` and `URL.revokeObjectURL` are called. |
| 6.7.4 | `tests/unit/i18n.test.ts` | **Export screen keys return correct English text:** Assert each of the 4 new keys returns the expected English string. |
| 6.7.5 | `tests/unit/i18n.test.ts` | **Export screen keys return correct Māori text:** Assert each of the 4 new keys returns the expected Māori string. |
| 6.7.6 | `tests/unit/i18n.test.ts` | **Export screen keys present in both language dictionaries:** Assert all 4 new keys exist in both `getKeysForLanguage('en')` and `getKeysForLanguage('mi')`. |

### 6.8 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| User accidentally triggers download without reviewing data | Low | Low | The two-step flow (review screen then download button) ensures the user sees data before download. The download button uses .btn.primary for clear visual emphasis. |
| Back button returns to wrong view | Low | Medium | `showExportScreen` is a separate boolean from `showSummary`. Setting it to false always returns to the last rendered summary view (the summary is preserved in `this.state.showSummary`). |
| Export screen does not reflect latest score changes | Low | Low | `renderExportScreen()` reads `this.state.domains` at render time, same as `renderSummary()`. Score changes during assessment are persisted via `saveState()` and reflected in `this.state.domains`. |
| New i18n keys break key-set completeness test | Low | High | Both `en` and `mi` dictionaries are updated atomically in the same change. The `Translation completeness` test validates identical key sets immediately. |
| Event delegation order causes handler conflict | Low | Low | The new handlers use unique `data-action` values (`export-download`, `export-back`) that cannot conflict with existing handlers. Each handler returns immediately after execution. |

### 6.9 Success Metrics

- The Export button click shows an intermediate export screen (not an immediate download).
- The export screen displays the title, description, and a list of domain scores.
- The export screen has working Back and Download buttons.
- Clicking Back returns to the summary view without data loss.
- Clicking Download triggers a JSON blob download with the correct filename.
- All 4 new i18n keys return non-empty, correct strings in both English and Māori.
- All 4 new keys are present in both language dictionaries (i18n completeness test passes).
- All 3 new app tests pass.
- `npm run typecheck` reports zero errors.
- All pre-existing tests continue to pass (no regressions).
---

## 7. Make Chart-Panel Expandable and Add Direct Polygon Manipulation

### 7.1 Problem Statement

The radar chart in `src/chart.ts` is the core visual artifact of the assessment, yet it is confined to a fixed-size card (`max-width: 360px`) inside the assessment and summary views. On mobile devices the chart occupies a small fraction of the viewport, and users have no mechanism to inspect it at larger scale. Furthermore, the value-level background polygons (`class="chart-value-level-polygons"`) currently have `pointer-events: none`, preventing any direct interaction. Users must rely solely on range sliders to set scores, which is slower and less intuitive than direct manipulation of the visual representation itself.

This opportunity addresses three related UX gaps:
1. **No expandable chart view** -- users cannot inspect the radar chart at full screen.
2. **No tap-to-set interaction** -- the nested level polygons (levels 1 through 5) are invisible to pointer events.
3. **No direct manipulation of scores** -- the data dots (`class="chart-dot"`) are small (r=5) and non-draggable, preventing touch-based stretching along their axis spokes.

### 7.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| Chart renderer | `src/chart.ts` | Add `data-chart-level` attribute to each level polygon in `buildValueLevelPolygons()`. Increase data-dot radius from 5 to 8 and add `data-domain` attribute in `drawChart()`. Remove `pointer-events: none` from the value-level polygon group. |
| App controller | `src/app.ts` | Add `showFullscreenChart` boolean flag. Add expand/close event handlers. Add polygon tap handler and dot-drag handler. Add `renderFullscreenChart()` and `updateFullscreenChart()` methods. Add expand buttons to both assessment and summary chart panels. |
| Styles | `public/styles.css` | Add `.chart-panel.fullscreen` fixed-position overlay styles, `.chart-expand-btn` positioning, `.chart-dot` cursor/touch styles, and `.chart-value-level-polygons polygon` hover/transition styles. |
| i18n engine | `src/i18n.ts` | Add 1 new key (`chart.fullscreenTitle`) to both `en` and `mi` dictionaries. |
| Unit tests | `tests/unit/app.test.ts` | Add 2 tests covering expand/close flow. |
| E2E tests | `tests/e2e/reflection.spec.ts` | Add 1 test covering expand-to-fullscreen and close. |

### 7.3 Reuse-First Mandate

- The existing `drawChart()` function from `src/chart.ts` must be reused to render the chart in the fullscreen view. No new chart rendering code is introduced.
- The existing `data-action` click-delegation pattern in `bindEvents()` must be extended for expand/close actions. No separate `addEventListener` calls are added to individual elements.
- The existing `t()` function must be used for the single new UI string (`chart.fullscreenTitle`). No hardcoded text is permitted.
- The existing `escapeHtml()` helper must wrap all interpolated strings in the new `renderFullscreenChart()` template literal.
- The existing `saveState()` function must be called after any mutation of `domain.score` during polygon or dot interaction. No direct `localStorage` access is introduced.
- The existing `.btn`, `.btn.secondary`, and `.chart-*` CSS classes must be reused for the fullscreen close button and expand controls. No new visual primitives are introduced.

### 7.4 Justification for Any New Code

The `showFullscreenChart` boolean flag is **unavoidable** because the existing `render()` method uses a chain of `if / else if` blocks for mutually exclusive views (`showLanguageSelector`, `showExportScreen`, `currentStep === 0`, `showSummary`, assessment). A fullscreen chart overlay is a distinct view that must be checked before `showSummary` to avoid rendering the summary behind the overlay. A separate flag is the minimal and consistent approach given the existing state architecture.

The `data-chart-level` attribute on polygons is **unavoidable** because the SVG polygons are generated as a single joined string in `buildValueLevelPolygons()` with no class differentiation between levels. Without a data attribute, the event handler cannot determine which level (1--5) was tapped.

The `startDotDrag()` method is **unavoidable** because touch-based stretching requires continuous `mousemove` / `touchmove` listeners on `document` (to track movement outside the SVG element), a distance calculation clamped to the chart radius, and live score updates. This logic cannot be expressed as a simple click handler and must be encapsulated in a dedicated method.

The single new i18n key (`chart.fullscreenTitle`) is **unavoidable** because the fullscreen chart heading is user-facing text that must be localized. The i18n completeness test enforces identical key sets across English and Māori dictionaries.

### 7.5 Implementation Details

#### 7.5.1 Expandable Fullscreen Chart

**Trigger:** The user taps or clicks the expand button (`.chart-expand-btn`, Unicode character U+26F6) rendered in the top-right corner of both the live chart panel (during assessment) and the summary chart panel.

**Visual feedback:**
- The chart panel transitions from inline card layout to a fixed-position overlay (`.chart-panel.fullscreen`) covering the entire viewport (`position: fixed; inset: 0; z-index: 1000`).
- The chart container scales to `max-width: 90vw; max-height: 80vh` centered within the overlay.
- A close button (`.chart-close`, labeled with `t('nav.back')`) appears at the top-right of the overlay.

**Dismissal:** Tapping or clicking the close button sets `showFullscreenChart = false` and re-renders the previous view (summary or assessment).

**State management:**
- `private showFullscreenChart = false;` is added to the `App` class.
- The `render()` method checks `showFullscreenChart` before `showSummary`:

```typescript
if (this.showFullscreenChart) {
  app.innerHTML = this.renderFullscreenChart();
  this.updateFullscreenChart();
}
```

- `updateFullscreenChart()` calls `drawChart('fullscreen-chart', this.state.domains)` inside a `setTimeout(..., 0)` to ensure the DOM element exists before drawing.

#### 7.5.2 Tap-to-Set Score via Polygon Interaction

**Trigger:** The user taps or clicks any nested polygon inside `.chart-value-level-polygons`. Each polygon carries a `data-chart-level` attribute (value `1` through `5`) generated by `buildValueLevelPolygons()`.

**Visual feedback:**
- The polygons gain `cursor: pointer` and a CSS transition on `fill` and `stroke`.
- On hover (desktop), the tapped polygon receives a subtle fill highlight (`rgba(44, 95, 74, 0.08)`) and an accent-coloured stroke.
- No persistent highlight remains after the tap; the score update is immediate and the chart re-renders.

**Rules:**
- Tapping a polygon sets the score of the **current domain** (the domain at `this.state.domains[this.state.currentStep - 1]`) to the polygon's level.
- The interaction is only active during assessment steps (`currentStep > 0 && !showSummary`). Tapping polygons in the summary view has no effect.
- The new score is persisted immediately via `saveState(this.state.domains)` and the view is re-rendered.

**Edge cases:**
- **Tapping between polygons:** The SVG polygons are nested and non-overlapping; there is no gap between levels, so every tap within the chart area hits exactly one polygon.
- **Rapid tapping:** Each tap calls `saveState()` and `render()`. The existing debouncing pattern is not required because `render()` is synchronous and `saveState()` is a simple `localStorage.setItem` call.
- **Invalid level attribute:** If `data-chart-level` is missing or outside 1--5, the handler ignores the tap (`parseInt(..., 10)` returns a value outside the valid range, the guard `level >= 1 && level <= 5` fails, and the function returns without mutation).

#### 7.5.3 Touch-Based Dot Stretching (Direct Manipulation)

**Trigger:** The user presses (mousedown / touchstart) on a data dot (`class="chart-dot"`). Each dot carries a `data-domain` attribute matching its domain ID.

**Visual feedback:**
- Dots gain `cursor: grab` and `touch-action: none` to prevent browser scrolling during drag.
- While dragging, the cursor changes to `grabbing`.
- The score updates in real time as the dot moves along its axis spoke.

**Interaction model:**
- On press, `startDotDrag(e, domainId)` is called. It computes the domain's axis angle and attaches `mousemove` / `touchmove` and `mouseup` / `touchend` listeners to `document`.
- On move, the pointer position is projected onto the SVG coordinate space using the SVG element's `getBoundingClientRect()`:

```typescript
const svgX = ((clientX - rect.left) / (rect.width ?? size)) * size;
const svgY = ((clientY - rect.top) / (rect.height ?? size)) * size;
```

- The distance from the SVG center is computed and clamped to `[0, maxRadius]` (110 units).
- The clamped distance is mapped to a score: `Math.max(1, Math.min(5, Math.round((distance / maxRadius) * 5)))`.
- If the computed score differs from the current score, `domain.score` is updated, `saveState()` is called, `updateChart()` re-renders the chart, and `updateScoreDisplay()` updates the numeric score badge.

**Release:** On mouseup or touchend, all document-level listeners are removed. The dot snaps to the nearest integer score (1--5).

**Edge cases:**
- **Drag beyond chart boundary:** The distance is clamped to `maxRadius`, capping the score at 5.
- **Drag toward center (score 0):** The clamped distance floor is 0, but the score formula maps 0 distance to `Math.round(0)` which is 0; the `Math.max(1, ...)` guard forces the minimum score to 1.
- **Concave drag path:** The user may drag in any direction; only the radial distance along the domain's axis matters. Movement perpendicular to the axis does not change the score because the projection is purely radial from the center.
- **Overlapping segments during drag:** The SVG viewBox is 280x280 with a single dot per domain. Dots for different domains are at different angles and do not overlap during normal interaction.
- **Touch scroll interference:** `touch-action: none` on `.chart-dot` and `{ passive: false }` on the `touchmove` listener prevent the browser from scrolling the page while the user is dragging a dot.
- **Maximum size limit:** `maxRadius = 110` is hard-coded in `drawChart()` and `startDotDrag()`. The dot cannot be dragged beyond the outermost level polygon (level 5), enforcing the score ceiling of 5.

#### 7.5.4 Data Structures

No new data structures are introduced. The feature reuses the existing `Domain` interface (`id`, `name`, `maoriName`, `description`, `prompt`, `score`, `reflection`) and the existing `AssessmentState` shape (`domains: Domain[]`, `currentStep: number`, `showSummary: boolean`).

The `data-chart-level` attribute on SVG polygons and the `data-domain` attribute on SVG circles are transient DOM metadata, not persisted to `localStorage`.

#### 7.5.5 Event Handlers

All new interactions use the existing delegated click listener on `document`:

| Selector | Action | Handler |
|----------|--------|---------|
| `[data-action="chart-expand"]` | Opens fullscreen chart overlay | Sets `showFullscreenChart = true`, calls `render()` |
| `[data-action="chart-close"]` | Closes fullscreen chart overlay | Sets `showFullscreenChart = false`, calls `render()` |
| `.chart-value-level-polygons polygon` | Tap-to-set score | Reads `data-chart-level`, updates current domain score, calls `saveState()` and `render()` |
| `.chart-dot` | Begin drag | Calls `startDotDrag(e, domainId)` |

The `startDotDrag()` method attaches document-level listeners:
- `mousemove` / `touchmove` -- updates score in real time
- `mouseup` / `touchend` -- removes all listeners

#### 7.5.6 State Management

State mutations occur in three places:
1. **Polygon tap:** `domain.score = level` followed by `saveState(this.state.domains)` and `this.render()`.
2. **Dot drag:** `domain.score = newScore` followed by `saveState(this.state.domains)`, `this.updateChart()`, and `this.updateScoreDisplay(domainId, newScore)`.
3. **Fullscreen toggle:** `this.showFullscreenChart = true/false` followed by `this.render()`.

No new state slice, reducer, or observable is introduced. The feature operates within the existing `App` class instance state.

### 7.6 New i18n Keys

| Key | English | Māori |
|-----|---------|-------|
| `chart.fullscreenTitle` | Assessment chart | Tūtohi aromātakitanga |

This is additive. Existing chart keys (`chart.liveAriaLabel`, `chart.summaryAriaLabel`) are unchanged.

### 7.7 Planned Test Cases

| ID | Test Location | Description |
|----|--------------|-------------|
| 7.7.1 | `tests/unit/app.test.ts` | **Expand button opens fullscreen chart:** Bootstrap, start assessment, navigate to summary, click `[data-action="chart-expand"]`, assert `#fullscreen-chart-title` and `[data-action="chart-close"]` are present. |
| 7.7.2 | `tests/unit/app.test.ts` | **Close button returns to summary:** From fullscreen chart, click `[data-action="chart-close"]`, assert `#summary-title` is present. |
| 7.7.3 | `tests/unit/app.test.ts` | **Polygon tap sets score:** Bootstrap, start assessment, simulate click on a `.chart-value-level-polygons polygon` with `data-chart-level="3"`, assert the current domain score is 3 and `saveState` was called. |
| 7.7.4 | `tests/unit/app.test.ts` | **Polygon tap ignores out-of-range level:** Simulate click on polygon with `data-chart-level="0"` or missing attribute, assert score is unchanged. |
| 7.7.5 | `tests/unit/app.test.ts` | **Polygon tap inactive on summary view:** Navigate to summary, simulate click on `.chart-value-level-polygons polygon`, assert no state mutation occurs. |
| 7.7.6 | `tests/e2e/reflection.spec.ts` | **Fullscreen chart expand and close flow:** Navigate to summary, click expand, assert fullscreen title visible; click close, assert summary title visible. |

### 7.8 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Fullscreen chart renders before DOM element exists | Low | Medium | `updateFullscreenChart()` uses `setTimeout(..., 0)` to defer `drawChart()` until after `innerHTML` is committed. |
| Polygon tap accidentally fires on adjacent level | Low | Low | SVG polygons are nested with no gaps; `pointer-events: auto` is set on the group, and each polygon occupies a distinct radial band. |
| Dot drag causes page scroll on mobile | Medium | Medium | `touch-action: none` on `.chart-dot` and `{ passive: false }` on the `touchmove` listener block browser scroll during drag. |
| Score desynchronization between chart and slider | Low | Medium | All mutations go through the same `domain.score` property and call `saveState()` before re-render. `updateScoreDisplay()` is called during drag to keep the numeric badge in sync. |
| New i18n key breaks key-set completeness test | Low | High | Both `en` and `mi` dictionaries are updated atomically. The `Translation completeness` test validates identical key sets immediately. |
| Event delegation conflict with existing handlers | Low | Low | New handlers use unique selectors (`chart-expand`, `chart-close`, `.chart-value-level-polygons polygon`, `.chart-dot`) that do not overlap with existing `data-action` values. Each handler returns immediately after execution. |

### 7.9 Success Metrics

- The expand button is visible on both live and summary chart panels.
- Tapping expand opens a fullscreen overlay containing the chart and a close button.
- Tapping close returns to the previous view without data loss.
- Tapping a level polygon updates the current domain score, persists it to `localStorage`, and re-renders the chart.
- Pressing and dragging a dot updates the score in real time and snaps to an integer on release.
- All 6 new tests pass (2 unit, 1 E2E, 3 additional unit for polygon/dot interactions).
- `npm run typecheck` reports zero errors.
- All pre-existing tests continue to pass (no regressions).
