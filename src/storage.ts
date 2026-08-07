// Te Whare Tapa Whā Wellbeing Reflection App
// A digital interpretation for personal reflection, not a clinical tool.

import { Domain, STORAGE_KEY } from './types';

export const loadState = (): { readonly domains: Domain[] } | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.domains && Array.isArray(parsed.domains)) {
        return { domains: parsed.domains };
      }
    }
  } catch {
    // Ignore load errors
  }
  return null;
};

export const saveState = (domains: readonly Domain[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ domains: [...domains] }));
  } catch {
    // Ignore save errors
  }
};

export const exportState = (): { readonly domains: Domain[] } | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.domains && Array.isArray(parsed.domains)) {
        return { domains: parsed.domains };
      }
    }
  } catch {
    // Ignore export errors
  }
  return null;
};

export const importState = (domains: readonly Domain[]): void => {
  if (!Array.isArray(domains)) {
    throw new Error('Invalid import data: domains must be an array');
  }

  const requiredFields = ['id', 'name', 'maoriName', 'description', 'prompt', 'score'];
  for (const domain of domains) {
    for (const field of requiredFields) {
      if (!Object.prototype.hasOwnProperty.call(domain, field)) {
        throw new Error(`Invalid domain: missing required field "${field}"`);
      }
    }
    const score = domain.score;
    if (typeof score !== 'number' || score < 1 || score > 5) {
      throw new Error(`Invalid domain: score must be between 1 and 5`);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ domains: [...domains] }));
  } catch {
    // Ignore import errors
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore clear errors
  }
};

import { Language } from './i18n';

export const LANGUAGE_STORAGE_KEY = 'te-whare-tapa-wha-language';

export const loadLanguage = (): Language | null => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'mi') {
      return saved as Language;
    }
  } catch {
    // Ignore load errors
  }
  return null;
};

export const saveLanguage = (lang: Language): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Ignore save errors
  }
};
