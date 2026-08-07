// Te Whare Tapa Whā Wellbeing Reflection App
// Unit tests for storage persistence

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadState, saveState, clearState, loadLanguage, saveLanguage } from '@src/storage';
import type { Domain } from '@src/types';

const createDomain = (overrides: Partial<Domain> = {}): Domain => ({
  id: 'tinana',
  name: 'Physical wellbeing',
  maoriName: 'Taha tinana',
  description: 'Test description',
  prompt: 'Test prompt',
  score: 3,
  reflection: '',
  ...overrides
});

describe('Storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    });
  });

  it('should return null when no saved state exists', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(loadState()).toBeNull();
  });

  it('should return parsed domains when valid state exists', () => {
    const domains = [createDomain(), createDomain({ id: 'hinengaro' })];
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({ domains }));

    const result = loadState();
    expect(result).not.toBeNull();
    expect(result!.domains).toHaveLength(2);
    expect(result!.domains[0]!.id).toBe('tinana');
  });

  it('should return null for invalid JSON', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('not json');
    expect(loadState()).toBeNull();
  });

  it('should return null when domains is not an array', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({ domains: 'invalid' }));
    expect(loadState()).toBeNull();
  });

  it('should save state to localStorage', () => {
    const domains = [createDomain()];
    saveState(domains);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'te-whare-tapa-wha-assessment',
      JSON.stringify({ domains })
    );
  });

  it('should clear state from localStorage', () => {
    clearState();
    expect(localStorage.removeItem).toHaveBeenCalledWith('te-whare-tapa-wha-assessment');
  });

  it('should handle localStorage errors gracefully', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    expect(loadState()).toBeNull();
  });
});

describe('Language Storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    });
  });

  it('should return null when no language is saved', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(loadLanguage()).toBeNull();
  });

  it('should return "en" when English is saved', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('en');
    expect(loadLanguage()).toBe('en');
  });

  it('should return "mi" when Māori is saved', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('mi');
    expect(loadLanguage()).toBe('mi');
  });

  it('should return null for invalid stored language', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fr');
    expect(loadLanguage()).toBeNull();
  });

  it('should return null for empty string in storage', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('');
    expect(loadLanguage()).toBeNull();
  });

  it('should save language to localStorage', () => {
    saveLanguage('mi');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'te-whare-tapa-wha-language',
      'mi'
    );
  });

  it('should save English to localStorage', () => {
    saveLanguage('en');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'te-whare-tapa-wha-language',
      'en'
    );
  });

  it('should handle loadLanguage errors gracefully', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    expect(loadLanguage()).toBeNull();
  });

  it('should handle saveLanguage errors gracefully', () => {
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    expect(() => saveLanguage('mi')).not.toThrow();
  });
});
