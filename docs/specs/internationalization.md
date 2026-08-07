# Internationalization Specification

## Overview

This specification defines the approach for fully internationalizing all product
and content English text in the Te Whare Tapa Whā wellbeing reflection app with
accurate, culturally appropriate Māori translations. It also specifies a
user-facing language selector that appears as the very first screen before any
other product content.

## Goals

1. Separate all user-facing text from code so no English string is hardcoded
   in `src/app.ts`, `src/chart.ts`, or anywhere else in the application logic.
2. Provide complete Māori translations for every user-facing string and every
   domain-level content field (description, prompt).
3. Allow a user to choose between English and Māori as their preferred language
   at the very start of their interaction, before any product content is shown.
4. Persist the user's language preference across sessions so returning users skip
   the selector and load directly into their chosen language.
5. Guarantee that no untranslated English text appears for users who select
   Māori, verified by automated tests.
6. Display both English and te reo Māori on the landing page (language selector)
   side-by-side so users can compare and choose confidently.

## Architecture

```
src/
  i18n.ts          — Translation engine: dictionaries, t() lookup, interpolation
  types.ts         — Extended with Māori domain content fields
  storage.ts       — Extended with loadLanguage() / saveLanguage()
  app.ts           — Refactored to call t() for every user-facing string
public/
  index.html       — <html lang="en"> updated dynamically at runtime
  styles.css       — Language selector styles added, bilingual layout
tests/
  unit/
    i18n.test.ts    — Unit tests for the translation engine
    app.test.ts     — Updated for language selector flow and English leak audit
  e2e/
    language-selector.spec.ts — E2E tests for the full selector + i18n flow
```

### Translation Engine (src/i18n.ts)

A single `t()` function performs key-based lookup with optional interpolation:

```typescript
// src/i18n.ts
export type Language = 'en' | 'mi';
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'mi'] as const;
export const DEFAULT_LANGUAGE: Language = 'en';

export const t = (
  key: keyof typeof translations.en,
  lang: Language,
  params?: Record<string, string | number>
): string => { /* lookup + {param} interpolation */ };
```

**Key rules:**
- Translation dictionaries are plain `Record<string, string>` objects keyed by
  dot-path strings.
- Interpolation uses `{param}` placeholders, replaced by values from `params`.
- Missing keys fall back to the key itself (never silently empty) to make bugs
  visible during testing.
- No runtime dependencies — pure TypeScript.

### i18n Key Inventory

All user-facing strings are stored as translation keys. The complete inventory
includes UI labels, screen titles, navigation buttons, score formats, and
domain content. Below is the full key list grouped by area.

#### Common
| Key | English | Māori |
|-----|---------|-------|
| `common.and` | " and " | " me " |

#### Language Selector (bilingual landing page)
| Key | English | Māori |
|-----|---------|-------|
| `lang.selectTitle` | Choose your language | Whiriwhi i tō reo |
| `lang.selectSubtitle` | Select a language to begin | Whiriwhi tētahi reo kia tīmata |
| `lang.option.en` | English | English |
| `lang.option.mi` | Māori | Māori |
| `lang.selectButton` | Start | Tīmata |

#### Welcome
| Key | English | Māori |
|-----|---------|-------|
| `welcome.subtitle` | A wellbeing reflection | He whakamātautautā hauora |
| `welcome.intro1` | Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie. It describes four walls of a house, each representing a dimension of wellbeing. When the walls are strong and balanced, the house stands well. | He taua hauora a Te Whare Tapa Whā, āwhakapapaia e Sir Mason Durie. E whakamārama ana i ngā pakaranga e whā o te whare, ko tētahi e tohutupu ana i tētahi ara hauora. Ki te kaha me tūturu ngā pakaranga, ka tūpato te whare. |
| `welcome.intro2` | This tool is for personal reflection and conversation. It is not a diagnosis or clinical assessment. The meaning of each score belongs to you. | Ko tēnei taputapu he whakamātautautā motu-motu me kōrero. Kāore i tētahi whakapa rānei aromātakitanga kiriti. Ko te tikanga o tētahi tūtohi ke tōu. |
| `welcome.note` | This is a digital interpretation of the framework, offered with respect. | He whakamārama tuihāpai tōnei, āwhinatia ki te whakapono. |
| `welcome.startButton` | Begin reflection | Tīmata i te whakamātautautā |

#### Assessment
| Key | English | Māori |
|-----|---------|-------|
| `assessment.progressLabel` | Progress | Hāpai |
| `assessment.stepOf` | Step {step} of {total} | Tūtohi {step} o {total} |
| `assessment.startOver` | Start over | Tīmata anō |
| `assessment.scoreLabel` | Where do you sit right now? | He aha tō āhua o ināianei? |
| `assessment.scoreFormat` | " / 5" | " / 5" |
| `assessment.reflectionPlaceholder` | Your thoughts (optional) | Āu whakaaro (kōwhiri) |
| `assessment.chartTitle` | Your current shape | Ko tō āhua o ināianei |
| `assessment.chartNote` | The shape updates as you move the slider. Stronger areas sit further out. | Ka whakahoua tēnei āhua he rite i te tīmata o te koro. Ko ngā wāhi kaha kei tua. |
| `assessment.chartScoreAria` | Score for {name} | Tūtohi {name} |

#### Chart
| Key | English | Māori |
|-----|---------|-------|
| `chart.liveAriaLabel` | Radar chart showing current wellbeing scores | Kahikātea radar e whaguanitia ana i ngā tūtohi hauora o ināianei |
| `chart.summaryAriaLabel` | Radar chart of your wellbeing scores | Kahikātea radar o āu tūtohi hauora |

#### Navigation
| Key | English | Māori |
|-----|---------|-------|
| `nav.back` | Back | Hoki |
| `nav.next` | Next | Panoni |
| `nav.seeSummary` | See summary | Tirohanga mātautautā |

#### Summary
| Key | English | Māori |
|-----|---------|-------|
| `summary.title` | Your reflection | Tō whakamātautautā |
| `summary.subtitle` | A snapshot of where you sit right now | He tirohanga o te wāhi e noho ana koe |
| `summary.scoreEven` | Your scores sit evenly across all four dimensions. | Ke tūpato ō tūtohi i runga i ngā ara e whā. |
| `summary.scoreBalanced` | Your shape is fairly balanced, with only small differences between dimensions. | He āhua tūturu rawa tō āhua, me pāmamahi iti noa i waenganui i ngā ara. |
| `summary.scoreSpread` | Stronger areas include {strongest}. Areas sitting lower include {softest}. | Ko ngā wāhi kaha e whāngai ana i {strongest}. Ko ngā wāhi ponaku kei raro e whāngai ana i {softest}. |
| `summary.noNotes` | No notes added. | Kāore he kōrero anō. |
| `summary.edit` | Edit | Whakatika |
| `summary.disclaimer` | This is a personal reflection tool based on Te Whare Tapa Whā. The scores and shape are yours to interpret. They do not replace professional support or conversation with people you trust. | He taputapu whakamātautautā motu-motu tōnei, āhono i te Whare Tapa Whā. Ko ngā tūtohi me te āhua ke tōu mā te whakapono. Kāore e korekorehu i te tautoko pūkenga rānei kōrero me ngā tāngata e whakapono ana koe. |
| `summary.backToEdit` | Back to edit | Hoki ki te whakatika |
| `summary.print` | Print or save as PDF | Tāpata i te mātaitai |
| `summary.startNew` | Start a new reflection | Tīmata whakamātautautā hou |
| `summary.avgNote` | Average across dimensions: {avg} | Neutoti i waenganui i ngā ara: {avg} |

#### Dialog
| Key | English | Māori |
|-----|---------|-------|
| `dialog.resetConfirm` | Start a new reflection? Your current scores and notes will be cleared. | Tīmata whakamātautautā hou? Ka konta o tūtohi me kōrero o ināianei. |

### Domain Content (src/types.ts — DOMAINS array)

The 4 domains receive Māori translations for `descriptionMi` and `promptMi`:

| id | English description | Māori description |
|-----|---------------------|-------------------|
| tinana | How your body feels and how you care for it — movement, rest, nourishment, and physical strength. | He aha tō kiko e noho nei, me tūpato koe i a ia — neke, moemoeā, kaiponu, me kaha tinana. |
| hinengaro | Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside. | Ōu whakaaro, ōu feelings, me tips ake koe i te ao. Whakaaro clear me āwhina i te mea e noho nei ki roto. |
| wairua | Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose. | Tō whakapono o tētahi, hononga ki tētahi mea nui, āhua, whakapono, me te mea e homai nei he-āhua ki tō ao. |
| whanau | The people you belong with — family, friends, community, and the relationships that support and shape you. | Ngā tāngata e tūpato ana koe — whānau, hoa, hapai, me ngā whakapā e tautoko ana me āhua koe. |

| id | English prompt | Māori prompt |
|-----|---------------|-------------|
| tinana | What does looking after your tinana mean for you right now? | He aha te tikanga o tips ake i tō tinana mō koe kei ināianei? |
| hinengaro | How are your thoughts and feelings sitting with you at the moment? | He aha ōu whakaaro me feelings e noho nei mā koe pēlā? |
| wairua | What gives your life meaning or a sense of connection right now? | He aha e homai nei he-āhua ki tō ao rānei hononga kei ināianei? |
| whanau | Who helps you feel you belong, and how are those connections for you? | Ko wai e āwhina ana kia tūpato koe, me he aha āu hononga? |

All Māori translations are marked as **draft pending native-speaker review**.

### Score Format

The score display uses the `assessment.scoreFormat` key to avoid hardcoding
the "/ 5" suffix. Both languages use " / 5" since this is a mathematical
notation (numerals and slash are universal).

### Summary Card Design

The summary card heading displays both Māori (`maoriName`) and English (`name`)
domain names as a bilingual heading, consistent with the assessment screen.
The previous design had a separate `<p class="summary-english">` paragraph
showing only the English name; this has been removed in favour of the bilingual
inline heading to avoid English-only content appearing in the Māori flow.

### Language Persistence (src/storage.ts)

Two new functions are added to the existing storage module:

```typescript
export const LANGUAGE_STORAGE_KEY = 'te-whare-tapa-wha-language';

export const loadLanguage = (): Language | null => { /* reads localStorage */ };
export const saveLanguage = (lang: Language): void => { /* writes localStorage */ };
```

Storage rules:
- `loadLanguage` returns `'en'`, `'mi'`, or `null` (null = first visit, show
  selector). Invalid stored values are treated as null.
- `saveLanguage` is wrapped in try/catch, same pattern as `saveState`.
- Language preference is stored separately from assessment data so clearing
  assessment state does not wipe the language preference.

## Language Selector Flow

### Trigger Condition

On app initialisation:
1. Call `loadLanguage()`.
2. If it returns a valid `Language` → skip selector, set `this.language`,
   render the normal flow.
3. If it returns `null` → set `this.showLanguageSelector = true`, render the
   language selector screen.

### Selector Screen (shown before any product content)

The screen is full-viewport, centred, accessible. The title and subtitle are
displayed **bilingually** — both English and te reo Māori side-by-side — so users
can compare before choosing.

```html
<section class="lang-selector" aria-labelledby="lang-select-title">
  <h1 id="lang-select-title">
    <span class="lang-mi">Whiriwhi i tō reo</span>
    <span class="lang-en">Choose your language</span>
  </h1>
  <p class="lang-subtitle">
    <span class="lang-mi">Whiriwhi tētahi reo kia tīmata</span>
    <span class="lang-en">Select a language to begin</span>
  </p>
  <div class="lang-options" role="radiogroup" aria-label="...">
    <button type="button" class="lang-option" data-action="select-lang" data-lang="en">
      English
    </button>
    <button type="button" class="lang-option" data-action="select-lang" data-lang="mi">
      Māori
    </button>
  </div>
</section>
```

The buttons always show the language name in its own language ("English" and
"Māori"), since these are the names of the languages themselves.

**Interaction:**
- Clicking a `data-lang` button:
  1. Sets `this.language` to the chosen `Language`.
  2. Calls `saveLanguage(lang)`.
  3. Sets `this.showLanguageSelector = false`.
  4. Re-renders → welcome screen in selected language.

**Accessibility:**
- The two options use `role="radiogroup"` + individual buttons with
  `aria-checked` (set via JS on render) to convey the selected state.
- Keyboard navigation between options via Tab/arrow keys (buttons are
  natively focusable).
- The screen has a single `<h1>` for screen-reader context.
- `<html lang>` attribute is updated to match the selected language.
- Bilingual title/subtitle uses `.lang-mi` (primary, accent color) and
  `.lang-en` (secondary, muted color) CSS classes for visual hierarchy.

### Browser Language Detection (hint only)

If no saved preference exists, the app checks `navigator.language`:
- If it starts with `'mi'` → pre-select Māori as the highlighted option
  (but still show the selector for explicit confirmation).
- Otherwise → pre-select English.

This is a hint only; the user always confirms by clicking.

## Translation Quality Requirements

### Source Material

All Māori translations are based on:
1. **Te Taura Whiri i te Reo Māori (Māori Language Commission)**
   publications and style guidelines.
2. **Māori-language versions of New Zealand Government Services**
   (e.g. health.govt.nz, education.govt.nz) for established UI terminology.
3. Existing bilingual Te Whare Tapa Whā materials by Sir Mason Durie.

### Accuracy Standards

- Translations must use correct macrons (e.g. "whānau", "hinengaro", "wairua").
- No machine-translation artefacts (e.g. literal word-for-word phrasing that
  reads unnaturally).
- Domain-specific terms (hauora, whānau, tinana, hinengaro, wairua) use the
  established spellings from existing domain data.
- UI action verbs follow NZ Government Māori UI conventions:
  - "Start" → "Tīmata"
  - "Back" → "Hoki"
  - "Next" → "Panoni"
  - "Edit" → "Whakatika"
- Score format "/ 5" uses the i18n key `assessment.scoreFormat` rather than
  hardcoding, even though both languages share the same value (numerals and
  slash are universal).

### Native-Speaker Review

Every Māori string must be reviewed by at least one native or highly
proficient Māori speaker before release. The spec marks all translations as
"draft" until reviewed. The `i18n.test.ts` unit tests include a
`translationQuality` test suite that asserts:

- No Māori string contains the English word "the" as a standalone token.
- All Māori option labels match expected values exactly.
- Translation key sets are identical across languages (no missing keys).
- All interpolation placeholders appear in both languages for matching keys.
- No English UI text leaks into the Māori user flow (verified by unit and E2E
  tests).

## Testing Requirements

### Unit Tests (tests/unit/i18n.test.ts)

1. **`t()` returns correct English for known keys.**
2. **`t()` returns correct Māori for known keys.**
3. **`t()` interpolates `{param}` placeholders.**
4. **`t()` returns the key itself for missing keys (never empty).**
5. **Both dictionaries have identical key sets.**
6. **Interpolation placeholders match across languages for each key.**
7. **No English tokens leak into Māori translations** (e.g. "the", "a", "is"
   as standalone words).
8. **Māori option labels are exactly "English" and "Māori".**
9. **`assessment.scoreFormat` returns the correct suffix for both languages.**

### Unit Tests (tests/unit/app.test.ts — updated)

1. **App renders the language selector on first load** (no saved language).
2. **App skips the selector when a language is saved.**
3. **App renders welcome screen after selecting a language.**
4. **App renders Māori text after Māori is selected.**
5. **App renders English text after English is selected.**
6. **App saves the selected language to localStorage.**
7. **App updates `<html lang>` attribute.**
8. **Language selector shows both English and Māori title/subtitle** (bilingual).
9. **No English UI text leaks in Māori summary flow.**
10. **Summary cards show bilingual domain names** (no separate English-only paragraph).
11. **All other existing app tests still pass.**

### E2E Tests (tests/e2e/language-selector.spec.ts)

1. **Language selector appears as the first screen.**
2. **Selector shows both English and Māori title/subtitle** (bilingual).
3. **Clicking "English" enters the app and shows English content.**
4. **Clicking "Māori" enters the app and shows Māori content.**
5. **No English UI text appears when Māori is selected** (scans the welcome
   and summary screens for hardcoded English strings from the inventory).
6. **Māori domain descriptions and prompts are rendered** in assessment screens.
7. **Māori reflection prompts are rendered** for each domain.
8. **Summary cards show bilingual domain names** (both Māori and English).
9. **Score format uses i18n key** (no hardcoded "/ 5" in either language).
10. **Language preference persists across page reloads.**
11. **Language selector does not reappear on reload when a preference is saved.**
12. **Language selector works on mobile viewport.**
13. **`<html lang>` attribute is updated correctly for each language.**

### E2E Tests (tests/e2e/reflection.spec.ts — updated)

1. **Pre-sets language to English** in `beforeEach` to bypass the language selector.
2. **All existing reflection flow tests still pass.**

## Implementation Notes

- The language selector screen replaces `currentStep === 0` (welcome) as the
  initial state. It is controlled by `this.showLanguageSelector` in the `App`
  class.
- All `t()` calls pass `this.language` so rendering is deterministic.
- The `render()` method checks `showLanguageSelector` before step/showSummary.
- Domain descriptions/prompts are resolved via a helper:
  `domain.descriptionMi || domain.description` when language is Māori.
- The `escapeHtml` helper is applied to all translated content that may
  contain user input (e.g. domain descriptions, summary notes) to prevent XSS.
  All dictionary values are static and trusted, so no escaping is needed for
  them.
- The language selector title and subtitle are rendered bilingually by calling
  `t()` with both `'en'` and `'mi'` explicitly, showing both languages
  side-by-side regardless of browser detection.
- Summary card headings use `.domain-names` wrapper containing both
  `.maori` and `.english` spans, consistent with the assessment screen design.
- `crap4js` and `dry-4js` (jscpd) quality gates must pass on `src/i18n.ts` —
  no duplicated code, no excessive cyclomatic complexity. The `t()` function
  itself must stay under a CRAP score of 2.
