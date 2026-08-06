# Storage Module Specification

## Overview
`src/storage.ts` provides a thin persistence abstraction over `localStorage` for the application. It handles serialization, deserialization, and error tolerance for the assessment state.

## Functions

### loadState
```typescript
export const loadState = (): { readonly domains: Domain[] } | null
```
- Reads `te-whare-tapa-wha-assessment` from localStorage
- Parses JSON and validates `domains` array structure
- Returns `null` on missing key, invalid JSON, or parse errors
- Never throws — all errors are caught and logged implicitly

### saveState
```typescript
export const saveState = (domains: readonly Domain[]): void
```
- Serializes domains array to JSON
- Writes to localStorage under `STORAGE_KEY`
- Creates a defensive copy with `[...domains]` to avoid storing mutable references
- Never throws — storage quota or access errors are caught

### clearState
```typescript
export const clearState = (): void
```
- Removes the assessment key from localStorage
- Used during reset flow to clear all user data
- Never throws

## Error Handling Strategy
All storage operations use try/catch to handle:
- `localStorage` unavailable (private browsing, quota exceeded)
- Corrupted JSON in storage
- Unexpected runtime errors

Errors are silently ignored because the app can always fall back to default state.

## Test Coverage
Unit tests in `tests/unit/storage.test.ts` cover:
- Null return when no saved state exists
- Successful parse of valid state
- Null return for invalid JSON
- Null return for non-array domains
- saveState and clearState calls
- Graceful error handling
