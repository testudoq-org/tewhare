# Types Module Specification

## Overview
`src/types.ts` defines the core domain model for the Te Whare Tapa Whā wellbeing reflection application. It provides TypeScript interfaces, constants, and factory functions that are shared across all modules.

## Domain Interface
```typescript
export interface Domain {
  readonly id: string;
  readonly name: string;
  readonly maoriName: string;
  readonly description: string;
  readonly prompt: string;
  score: number;
  reflection: string;
}
```

## AssessmentState Interface
```typescript
export interface AssessmentState {
  readonly domains: Domain[];
  readonly currentStep: number;
  readonly showSummary: boolean;
}
```

## Constants
- `DEFAULT_SCORE = 3` — initial score for each domain
- `MAX_SCORE = 5` — maximum selectable score
- `MIN_SCORE = 1` — minimum selectable score
- `STORAGE_KEY = 'te-whare-tapa-wha-assessment'` — localStorage key

## DOMAINS Definition
Four readonly domain definitions representing the Te Whare Tapa Whā dimensions:
1. `tinana` — Physical wellbeing (Taha tinana)
2. `hinengaro` — Mental and emotional wellbeing (Taha hinengaro)
3. `wairua` — Spiritual wellbeing (Taha wairua)
4. `whanau` — Family and social wellbeing (Taha whānau)

## Factory Functions
- `createDefaultDomains()` — creates Domain[] with default scores and empty reflections
- `cloneDomains(domains)` — shallow clones an array of domains for immutable state updates

## Design Principles
- Immutable data where possible (`readonly` properties, `as const` assertions)
- Single source of truth for domain definitions
- Factory functions prevent accidental mutation of default state
