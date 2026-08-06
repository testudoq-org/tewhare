// Te Whare Tapa Whā Wellbeing Reflection App
// Unit tests for App controller

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDefaultDomains } from '@src/types';
import { bootstrap } from '@src/app';

// Mock the modules that depend on DOM/storage
vi.mock('@src/storage', () => ({
  loadState: vi.fn(),
  saveState: vi.fn(),
  clearState: vi.fn()
}));

vi.mock('@src/chart', () => ({
  drawChart: vi.fn()
}));

import { loadState, saveState, clearState } from '@src/storage';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadState).mockReturnValue(null);
    document.body.innerHTML = '<main id="app"></main>';
  });

  it('should render welcome screen on init', () => {
    bootstrap();
    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('Te Whare Tapa Whā');
    expect(app?.innerHTML).toContain('Begin reflection');
  });

  it('should start assessment when start button is clicked', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('assessment');
    expect(app?.innerHTML).toContain('Step 1 of');
  });

  it('should load saved state from localStorage', () => {
    const savedDomains = createDefaultDomains();
    const firstDomain = savedDomains[0];
    if (firstDomain) firstDomain.score = 5;
    vi.mocked(loadState).mockReturnValue({ domains: savedDomains });

    bootstrap();

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('assessment');
  });

  it('should render summary when reaching last step', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('Your reflection');
    expect(app?.innerHTML).toContain('summary-chart');
  });

  it('should save state when score changes', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const input = document.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '4';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(saveState).toHaveBeenCalled();
  });

  it('should reset when reset is confirmed', () => {
    window.confirm = vi.fn(() => true);

    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    document.querySelector('[data-action="reset"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clearState).toHaveBeenCalled();
    expect(document.getElementById('app')?.innerHTML).toContain('Begin reflection');
  });
});
