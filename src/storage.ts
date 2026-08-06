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

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore clear errors
  }
};


