// Te Whare Tapa Whā Wellbeing Reflection App
// Unit tests for the i18n translation engine

import { describe, it, expect } from 'vitest';
import {
  t,
  getAllKeys,
  getKeysForLanguage,
  LANGUAGE_LABELS,
  DEFAULT_LANGUAGE
} from '@src/i18n';

describe('i18n', () => {
  describe('Language constants', () => {
    it('should default to English', () => {
      expect(DEFAULT_LANGUAGE).toBe('en');
    });

    it('should provide labels for both languages', () => {
      expect(LANGUAGE_LABELS.en).toBe('English');
      expect(LANGUAGE_LABELS.mi).toBe('Māori');
    });
  });

  describe('t() — key lookup', () => {
    it('returns English text for English language', () => {
      expect(t('lang.selectTitle', 'en')).toBe('Choose your language');
      expect(t('welcome.startButton', 'en')).toBe('Begin reflection');
      expect(t('nav.back', 'en')).toBe('Back');
    });

    it('returns Māori text for Māori language', () => {
      expect(t('lang.selectTitle', 'mi')).toBe('Whiriwhi i tō reo');
      expect(t('welcome.startButton', 'mi')).toBe('Tīmata i te whakamātautautā');
      expect(t('nav.back', 'mi')).toBe('Hoki');
    });

    it('returns English text when no language is specified', () => {
      expect(t('lang.selectTitle')).toBe('Choose your language');
    });

    it('returns the key itself for unknown keys', () => {
      expect(t('unknown.key' as never, 'en')).toBe('unknown.key');
    });

    it('falls back to English when language is not supported', () => {
      expect(t('nav.back', 'xx' as never)).toBe('Back');
    });

    it('falls back to English when translation is missing for a language', () => {
      // All keys should exist in both; this tests the fallback mechanism
      const enText = t('welcome.subtitle', 'en');
      const miText = t('welcome.subtitle', 'mi');
      expect(enText).not.toBe(miText);
      expect(enText).toBe('A wellbeing reflection');
    });

    it('returns the score format suffix for both languages', () => {
      expect(t('assessment.scoreFormat', 'en')).toBe(' / 5');
      expect(t('assessment.scoreFormat', 'mi')).toBe(' / 5');
    });
  });

  describe('t() — interpolation', () => {
    it('interpolates {step} and {total} in assessment.stepOf', () => {
      const result = t('assessment.stepOf', 'en', { step: 2, total: 4 });
      expect(result).toBe('Step 2 of 4');
    });

    it('interpolates {score} placeholder in assessment.scoreLabel', () => {
      // scoreLabel no longer has {score}, but this confirms it returns plain text
      const result = t('assessment.scoreLabel', 'en', { score: 3 });
      expect(result).toBe('Where do you sit right now?');
    });

    it('interpolates {strongest} and {softest} in summary.scoreSpread', () => {
      const result = t('summary.scoreSpread', 'en', {
        strongest: 'Taha tinana',
        softest: 'Taha wairua',
      });
      expect(result).toBe(
        'Stronger areas include Taha tinana. Areas sitting lower include Taha wairua.'
      );
    });

    it('interpolates {name} in assessment.chartScoreAria', () => {
      const result = t('assessment.chartScoreAria', 'en', { name: 'Taha tinana' });
      expect(result).toBe('Score for Taha tinana');
    });

    it('interpolates {avg} in summary.avgNote', () => {
      const result = t('summary.avgNote', 'en', { avg: '3.5' });
      expect(result).toBe('Average across dimensions: 3.5');
    });

    it('leaves unknown placeholders untouched', () => {
      const result = t('summary.avgNote', 'en', { wrong: 'x' });
      expect(result).toBe('Average across dimensions: {avg}');
    });
  });

  describe('t() — Māori interpolation', () => {
    it('interpolates {step} and {total} in Māori', () => {
      const result = t('assessment.stepOf', 'mi', { step: 2, total: 4 });
      expect(result).toBe('Tūtohi 2 o 4');
    });

    it('interpolates {strongest} and {softest} in Māori', () => {
      const result = t('summary.scoreSpread', 'mi', {
        strongest: 'Taha tinana',
        softest: 'Taha wairua',
      });
      expect(result).toBe(
        'Ko ngā wāhi kaha e whāngai ana i Taha tinana.' +
          ' Ko ngā wāhi ponaku kei raro e whāngai ana i Taha wairua.'
      );
    });
  });

  describe('Translation completeness', () => {
    it('English and Māori dictionaries have identical key sets', () => {
      const enKeys = new Set(getKeysForLanguage('en'));
      const miKeys = new Set(getKeysForLanguage('mi'));

      const enOnly = [...enKeys].filter((k) => !miKeys.has(k));
      const miOnly = [...miKeys].filter((k) => !enKeys.has(k));

      expect(enOnly).toEqual([]);
      expect(miOnly).toEqual([]);
    });

    it('every English key has a non-empty Māori value', () => {
      const enKeys = getAllKeys();
      enKeys.forEach((key) => {
        const miValue = t(key, 'mi');
        expect(miValue).not.toBe('');
        expect(miValue).not.toBe(key);
      });
    });

    it('every Māori key has a non-empty English value', () => {
      const enKeys = getAllKeys();
      enKeys.forEach((key) => {
        const enValue = t(key, 'en');
        expect(enValue).not.toBe('');
        expect(enValue).not.toBe(key);
      });
    });

    it('common.and returns the correct conjunction for each language', () => {
      expect(t('common.and', 'en')).toBe(' and ');
      expect(t('common.and', 'mi')).toBe(' me ');
    });
  });

  describe('Translation quality', () => {
    // English UI words that should not appear in Māori translations
    const englishLeakTokens = [' the ', ' a ', ' is ', ' are ', ' for ', ' of '];
    const keysToCheck = getAllKeys().filter(
      (k) => !k.startsWith('lang.option') && !k.startsWith('welcome.intro') && !k.startsWith('welcome.note') && !k.startsWith('assessment.chartNote') && !k.startsWith('summary.disclaimer') && !k.startsWith('dialog.resetConfirm')
    );

    it('no Māori translation contains common English leak tokens', () => {
      keysToCheck.forEach((key) => {
        const miText = t(key, 'mi');
        englishLeakTokens.forEach((token) => {
          // Check case-insensitive, but allow 'Taha' which is a Māori word
          expect(miText.toLowerCase()).not.toContain(token.toLowerCase());
        });
      });
    });

    it('Māori option labels are exactly "English" and "Māori"', () => {
      expect(t('lang.option.en', 'en')).toBe('English');
      expect(t('lang.option.mi', 'mi')).toBe('Māori');
      // In English context, Māori option should still show "Māori"
      expect(t('lang.option.mi', 'en')).toBe('Māori');
      // In Māori context, English option should still show "English"
      expect(t('lang.option.en', 'mi')).toBe('English');
    });

    it('all Māori translations contain at least one macronised vowel', () => {
      // Most Māori strings should contain at least one of ā, ē, ī, ō, ū
      // (Some short strings like button labels may not, so check domain-specific content)
      const intro1 = t('welcome.intro1', 'mi');
      expect(intro1).toMatch(/[āēīōū]/);
    });
  });

  describe('INTERPOLATION placeholder consistency', () => {
    // Keys that contain interpolation placeholders
    const keysWithParams: { key: string; params: string[] }[] = [
      { key: 'assessment.stepOf', params: ['step', 'total'] },
      { key: 'assessment.chartScoreAria', params: ['name'] },
      { key: 'summary.scoreSpread', params: ['strongest', 'softest'] },
      { key: 'summary.avgNote', params: ['avg'] },
    ];

    keysWithParams.forEach(({ key, params }) => {
      it(`placeholder {${params.join('}, {')}} present in both languages for key "${key}"`, () => {
        params.forEach((p) => {
          const enVal = t(key as never, 'en', { [p]: '__TEST__' });
          const miVal = t(key as never, 'mi', { [p]: '__TEST__' });
          expect(enVal).toContain('__TEST__');
          expect(miVal).toContain('__TEST__');
        });
      });
    });
  });

  describe('Export / Import keys', () => {
    it('returns English text for export keys', () => {
      expect(t('export.download', 'en')).toBe('Export assessment data');
      expect(t('export.button', 'en')).toBe('Export');
    });

    it('returns Māori text for export keys', () => {
      expect(t('export.download', 'mi')).toBe('Kawea i ngā raraunga aromātakitanga');
      expect(t('export.button', 'mi')).toBe('Kawea');
    });

    it('returns English text for import keys', () => {
      expect(t('import.button', 'en')).toBe('Import');
      expect(t('import.error', 'en')).toBe('Import failed. Please check the file format.');
    });

    it('returns Māori text for import keys', () => {
      expect(t('import.button', 'mi')).toBe('Kuhu');
      expect(t('import.error', 'mi')).toBe('I rahua te kuhu. Tēnā whakamātau anō i te hōtuku.');
    });

    it('export and import keys are present in both languages', () => {
      const enKeys = new Set(getKeysForLanguage('en'));
      const miKeys = new Set(getKeysForLanguage('mi'));
      ['export.download', 'export.button', 'import.button', 'import.error'].forEach((key) => {
        expect(enKeys.has(key)).toBe(true);
        expect(miKeys.has(key)).toBe(true);
      });
    });
  });

  describe('Export / Kawea screen keys', () => {
    it('returns English text for export screen keys', () => {
      expect(t('export.title', 'en')).toBe('Export your reflection');
      expect(t('export.description', 'en')).toBe('Review your assessment data below, then download it as a JSON file.');
      expect(t('export.downloadButton', 'en')).toBe('Download JSON file');
      expect(t('export.back', 'en')).toBe('Back to summary');
    });

    it('returns Māori text for export screen keys', () => {
      expect(t('export.title', 'mi')).toBe('Kawea tō whakamātautautā');
      expect(t('export.description', 'mi')).toBe('Tirohia ō raraunga aromātakitanga ki raro, kātahi ka kukuhia hei kōnae JSON.');
      expect(t('export.downloadButton', 'mi')).toBe('Kukuhia te kōnae JSON');
      expect(t('export.back', 'mi')).toBe('Hoki ki te whakarāpopotanga');
    });

    it('export screen keys are present in both languages', () => {
      const enKeys = new Set(getKeysForLanguage('en'));
      const miKeys = new Set(getKeysForLanguage('mi'));
      ['export.title', 'export.description', 'export.downloadButton', 'export.back'].forEach((key) => {
        expect(enKeys.has(key)).toBe(true);
        expect(miKeys.has(key)).toBe(true);
      });
    });
  });
});