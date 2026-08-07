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
- Line count of `src/app.ts` decreases by at least 10% due to removal of `+` operators and line-continuation noise.

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

- `tests/unit/storage.test.ts` contains 6 new tests covering export/import edge cases.
- `tests/unit/app.test.ts` contains 4 new tests covering UI interactions.
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

### 5.1 Problem Statement

The file `public/bg-chart.svg` (751 bytes) contains concentric circles and a house-shaped outline path that are structurally identical to the markup generated inline by the `buildBackgroundSvg()` function in `src/chart.ts` (lines 14–22). The SVG file is never imported, never referenced by any URL, and never loaded by any code (confirmed by grep across all `.ts`, `.html`, `.css`, and `.js` files). It is dead code that creates a second, unmaintained source of truth for the chart background.

### 5.2 Modules and Feature Areas Requiring Modification

| Module | File | Changes |
|--------|------|---------|
| Dead asset | `public/bg-chart.svg` | Delete the file entirely. |
| Chart renderer | `src/chart.ts` | No changes to `buildBackgroundSvg()` — it remains the sole source of truth for the background SVG markup. |

### 5.3 Reuse-First Mandate

No new code is introduced. The existing `buildBackgroundSvg()` function in `src/chart.ts` is already the working, tested implementation — the spec for "background SVG layer" was already satisfied by it (see `docs/specs/chart-container-refactor-spec.md`, section 3.1). The orphaned `bg-chart.svg` is simply deleted.

### 5.4 Justification for New Code

None. This is a pure deletion of a dead file. No new code is justified or required.

### 5.5 Risk Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Accidentally delete the wrong SVG file | Low | Low | Verify the file path with `ls -la public/bg-chart.svg` before deleting. Ensure no other SVG file in `public/` has a similar name. |
| Another module secretly imports or references `bg-chart.svg` | Low | Medium | Run `grep -r "bg-chart" src/ public/ tests/` after deletion to confirm zero matches. If any reference exists, remove it before deleting the file. |
| Build process copies the file from an unexpected location | Low | Low | Run `npm run build` after deletion and inspect the `dist/` output to confirm `bg-chart.svg` is absent. The Vite build should not emit untracked files. |

### 5.6 Success Metrics

- `public/bg-chart.svg` no longer exists in the working tree.
- `grep -r "bg-chart"` across `.ts`, `.html`, `.css`, `.js` returns zero matches.
- All existing chart unit and E2E tests pass unchanged.
- `npm run build` succeeds and the built output does not contain `bg-chart.svg`.

### 5.7 Planned Test Cases

| ID | Test Location | Type | Description |
|----|--------------|------|-------------|
| 5.7.1 | `tests/unit/chart.test.ts` (existing tests) | Regression | The two existing background tests ("should render background SVG with concentric circles and house outline" and "should keep all new decorative groups non-interactive") must continue to pass unchanged, confirming that deleting `bg-chart.svg` does not affect the inline `buildBackgroundSvg()` output. |
| 5.7.2 | `tests/e2e/reflection.spec.ts` (existing tests) | Regression | The two existing E2E tests ("should render background SVG layer in live chart" and "should render value-level polygons in live chart") must continue to pass unchanged, confirming the deployed chart still renders background circles and house paths correctly. |
| 5.7.3 | File system check | Static | Verify `public/bg-chart.svg` does not exist after the change. This can be asserted by a CI step running `test ! -f public/bg-chart.svg` or by grepping the repository for any remaining reference to `bg-chart` in `.ts`, `.html`, `.css`, and `.js` files and confirming zero matches. |

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
