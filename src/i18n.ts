// Te Whare Tapa Whā Wellbeing Reflection App
// Internationalization engine: translation dictionaries and t() lookup.
// All user-facing strings live here — no English text is hardcoded elsewhere.

export type Language = 'en' | 'mi';

export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'mi'] as const;
export const DEFAULT_LANGUAGE: Language = 'en';

export interface TranslationParams {
  readonly [key: string]: string | number;
}

const interpolate = (text: string, params?: TranslationParams): string => {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    return Object.prototype.hasOwnProperty.call(params, key)
      ? String(params[key])
      : match;
  });
};

const translations = {
  en: {
    // Common
    'common.and': ' and ',

    // Language selector
    'lang.selectTitle': 'Choose your language',
    'lang.selectSubtitle': 'Select a language to begin',
    'lang.option.en': 'English',
    'lang.option.mi': 'Māori',
    'lang.selectButton': 'Start',

    // Welcome
    'welcome.subtitle': 'A wellbeing reflection',
    'welcome.intro1':
      'Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie.' +
      ' It describes four walls of a house, each representing a dimension of wellbeing.' +
      ' When the walls are strong and balanced, the house stands well.',
    'welcome.intro2':
      'This tool is for personal reflection and conversation.' +
      ' It is not a diagnosis or clinical assessment.' +
      ' The meaning of each score belongs to you.',
    'welcome.note':
      'This is a digital interpretation of the framework, offered with respect.',
    'welcome.startButton': 'Begin reflection',

    // Assessment
    'assessment.progressLabel': 'Progress',
    'assessment.stepOf': 'Step {step} of {total}',
    'assessment.startOver': 'Start over',
    'assessment.scoreLabel': 'Where do you sit right now?',
    'assessment.scoreFormat': ' / 5',
    'assessment.reflectionPlaceholder': 'Your thoughts (optional)',
    'assessment.chartTitle': 'Your current shape',
    'assessment.chartNote':
      'The shape updates as you move the slider.' +
      ' Stronger areas sit further out.',
    'assessment.chartScoreAria': 'Score for {name}',

    // Chart
    'chart.liveAriaLabel': 'Radar chart showing current wellbeing scores',
    'chart.summaryAriaLabel': 'Radar chart of your wellbeing scores',
    'chart.fullscreenTitle': 'Assessment chart',

    // Navigation
    'nav.back': 'Back',
    'nav.next': 'Next',
    'nav.seeSummary': 'See summary',

    // Summary
    'summary.title': 'Your reflection',
    'summary.subtitle': 'A snapshot of where you sit right now',
    'summary.scoreEven': 'Your scores sit evenly across all four dimensions.',
    'summary.scoreBalanced':
      'Your shape is fairly balanced,' +
      ' with only small differences between dimensions.',
    'summary.scoreSpread':
      'Stronger areas include {strongest}.' +
      ' Areas sitting lower include {softest}.',
    'summary.noNotes': 'No notes added.',
    'summary.edit': 'Edit',
    'summary.disclaimer':
      'This is a personal reflection tool based on Te Whare Tapa Whā.' +
      ' The scores and shape are yours to interpret.' +
      ' They do not replace professional support' +
      ' or conversation with people you trust.',
    'summary.backToEdit': 'Back to edit',
    'summary.print': 'Print or save as PDF',
    'summary.startNew': 'Start a new reflection',
    'summary.avgNote': 'Average across dimensions: {avg}',

    // Export / Import
    'export.download': 'Export assessment data',
    'export.button': 'Export',
    'export.title': 'Export your reflection',
    'export.description': 'Review your assessment data below, then download it as a JSON file.',
    'export.downloadButton': 'Download JSON file',
    'export.back': 'Back to summary',
    'import.button': 'Import',
    'import.error': 'Import failed. Please check the file format.',

    // Dialog
    'dialog.resetConfirm':
      'Start a new reflection? Your current scores and notes will be cleared.',
  },

  mi: {
    // Common
    'common.and': ' me ',

    // Language selector
    'lang.selectTitle': 'Whiriwhi i tō reo',
    'lang.selectSubtitle': 'Whiriwhi tētahi reo kia tīmata',
    'lang.option.en': 'English',
    'lang.option.mi': 'Māori',
    'lang.selectButton': 'Tīmata',

    // Welcome
    'welcome.subtitle': 'He whakamātautautā hauora',
    'welcome.intro1':
      'He taua hauora a Te Whare Tapa Whā, āwhakapapaia e Sir Mason Durie.' +
      ' E whakamārama ana i ngā pakaranga e whā o te whare,' +
      ' ko tētahi e tohutupu ana i tētahi ara hauora.' +
      ' Ki te kaha me tūturu ngā pakaranga, ka tūpato te whare.',
    'welcome.intro2':
      'Ko tēnei taputapu he whakamātautautā motu-motu me kōrero.' +
      ' Kāore i tētahi whakapa rānei aromātakitanga kiriti.' +
      ' Ko te tikanga o tētahi tūtohi ke tōu.',
    'welcome.note':
      'He whakamārama tuihāpai tōnei, āwhinatia ki te whakapono.',
    'welcome.startButton': 'Tīmata i te whakamātautautā',

    // Assessment
    'assessment.progressLabel': 'Hāpai',
    'assessment.stepOf': 'Tūtohi {step} o {total}',
    'assessment.startOver': 'Tīmata anō',
    'assessment.scoreLabel': 'He aha tō āhua o ināianei?',
    'assessment.scoreFormat': ' / 5',
    'assessment.reflectionPlaceholder': 'Āu whakaaro (kōwhiri)',
    'assessment.chartTitle': 'Ko tō āhua o ināianei',
    'assessment.chartNote':
      'Ka whakahoua tēnei āhua he rite i te tīmata o te koro.' +
      ' Ko ngā wāhi kaha kei tua.',
    'assessment.chartScoreAria': 'Tūtohi {name}',

    // Chart
    'chart.liveAriaLabel': 'Kahikātea radar e whaguanitia ana i ngā tūtohi hauora o ināianei',
    'chart.summaryAriaLabel': 'Kahikātea radar o āu tūtohi hauora',
    'chart.fullscreenTitle': 'Tūtohi aromātakitanga',

    // Navigation
    'nav.back': 'Hoki',
    'nav.next': 'Panoni',
    'nav.seeSummary': 'Tirohanga mātautautā',

    // Summary
    'summary.title': 'Tō whakamātautautā',
    'summary.subtitle': 'He tirohanga o te wāhi e noho ana koe',
    'summary.scoreEven': 'Ke tūpato ō tūtohi i runga i ngā ara e whā.',
    'summary.scoreBalanced':
      'He āhua tūturu rawa tō āhua,' +
      ' me pāmamahi iti noa i waenganui i ngā ara.',
    'summary.scoreSpread':
      'Ko ngā wāhi kaha e whāngai ana i {strongest}.' +
      ' Ko ngā wāhi ponaku kei raro e whāngai ana i {softest}.',
    'summary.noNotes': 'Kāore he kōrero anō.',
    'summary.edit': 'Whakatika',
    'summary.disclaimer':
      'He taputapu whakamātautautā motu-motu tōnei, āhono i te Whare Tapa Whā.' +
      ' Ko ngā tūtohi me te āhua ke tōu mā te whakapono.' +
      ' Kāore e korekorehu i te tautoko pūkenga rānei kōrero' +
      ' me ngā tāngata e whakapono ana koe.',
    'summary.backToEdit': 'Hoki ki te whakatika',
    'summary.print': 'Tāpata i te mātaitai',
    'summary.startNew': 'Tīmata whakamātautautā hou',
    'summary.avgNote': 'Neutoti i waenganui i ngā ara: {avg}',

    // Export / Import
    'export.download': 'Kawea i ngā raraunga aromātakitanga',
    'export.button': 'Kawea',
    'export.title': 'Kawea tō whakamātautautā',
    'export.description': 'Tirohia ō raraunga aromātakitanga ki raro, kātahi ka kukuhia hei kōnae JSON.',
    'export.downloadButton': 'Kukuhia te kōnae JSON',
    'export.back': 'Hoki ki te whakarāpopotanga',
    'import.button': 'Kuhu',
    'import.error': 'I rahua te kuhu. Tēnā whakamātau anō i te hōtuku.',

    // Dialog
    'dialog.resetConfirm':
      'Tīmata whakamātautautā hou? Ka konta o tūtohi me kōrero o ināianei.',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

const allKeys = Object.keys(translations.en) as TranslationKey[];

/** Look up a translation by key for the given language, with optional interpolation. */
export const t = (
  key: TranslationKey,
  lang: Language = DEFAULT_LANGUAGE,
  params?: TranslationParams
): string => {
  const dict = translations[lang] ?? translations.en;
  const text = dict[key] ?? translations.en[key] ?? key;
  return interpolate(text, params);
};

/** Return all translation keys (useful for completeness checks). */
export const getAllKeys = (): readonly TranslationKey[] => allKeys;

/** Return the set of keys for a given language dictionary. */
export const getKeysForLanguage = (lang: Language): readonly string[] =>
  Object.keys(translations[lang]);

// Māori UI option labels shown in the language selector.
export const LANGUAGE_LABELS: Readonly<Record<Language, string>> = {
  en: 'English',
  mi: 'Māori',
};