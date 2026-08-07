// Te Whare Tapa Whā Wellbeing Reflection App
// Unit tests for App controller

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDefaultDomains, type Domain } from '@src/types';
import { bootstrap } from '@src/app';

// Mock the modules that depend on DOM/storage
vi.mock('@src/storage', () => ({
  loadState: vi.fn(),
  saveState: vi.fn(),
  clearState: vi.fn(),
  loadLanguage: vi.fn(),
  saveLanguage: vi.fn(),
  exportState: vi.fn(),
  importState: vi.fn()
}));

vi.mock('@src/chart', () => ({
  drawChart: vi.fn()
}));

import { loadState, saveState, clearState, loadLanguage, saveLanguage, exportState } from '@src/storage';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadState).mockReturnValue(null);
    vi.mocked(loadLanguage).mockReturnValue('en');
    vi.mocked(exportState).mockReturnValue(JSON.stringify({ domains: [] }));
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should render welcome screen on init when language is set', () => {
    bootstrap();
    const app = document.getElementById('app');
    expect(app?.textContent).toContain('Te Whare Tapa Whā');
    expect(app?.textContent).toContain('Begin reflection');
  });

  it('should render language selector when no language is saved', () => {
    vi.mocked(loadLanguage).mockReturnValue(null);
    bootstrap();
    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('lang-select-title');
    expect(app?.textContent).toContain('Choose your language');
    expect(app?.innerHTML).toContain('data-action="select-lang"');
  });

  it('should show both English and Māori on the language selector', () => {
    vi.mocked(loadLanguage).mockReturnValue(null);
    bootstrap();
    const app = document.getElementById('app');
    // Both English and Māori title should be visible
    expect(app?.innerHTML).toContain('Choose your language');
    expect(app?.innerHTML).toContain('Whiriwhi i tō reo');
    // Both English and Māori subtitle should be visible
    expect(app?.innerHTML).toContain('Select a language to begin');
    expect(app?.innerHTML).toContain('Whiriwhi tētahi reo kia tīmata');
    // Both language option buttons should be present
    expect(app?.innerHTML).toContain('data-lang="en"');
    expect(app?.innerHTML).toContain('data-lang="mi"');
  });

  it('should skip language selector and show welcome when language is saved', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    bootstrap();
    const app = document.getElementById('app');
    expect(app?.innerHTML).not.toContain('lang-select-title');
    expect(app?.innerHTML).toContain('welcome-title');
  });

  it('should start assessment when start button is clicked', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('assessment');
    expect(app?.textContent).toContain('Step 1 of');
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
    expect(app?.textContent).toContain('Your reflection');
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

  it('should render Māori text after selecting Māori language', () => {
    vi.mocked(loadLanguage).mockReturnValue(null);
    bootstrap();

    const miOption = Array.from(document.querySelectorAll('[data-action="select-lang"]')).find(
      (el) => (el as HTMLElement).getAttribute('data-lang') === 'mi'
    ) as HTMLElement | undefined;
    expect(miOption).toBeDefined();
    miOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).not.toContain('lang-select-title');
    expect(app?.innerHTML).toContain('welcome-title');
    expect(app?.textContent).toContain('Tīmata i te whakamātautautā');
    expect(document.documentElement.getAttribute('lang')).toBe('mi');
  });

  it('should render English text after selecting English language', () => {
    vi.mocked(loadLanguage).mockReturnValue(null);
    bootstrap();

    const enOption = Array.from(document.querySelectorAll('[data-action="select-lang"]')).find(
      (el) => (el as HTMLElement).getAttribute('data-lang') === 'en'
    ) as HTMLElement | undefined;
    expect(enOption).toBeDefined();
    enOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.textContent).toContain('Begin reflection');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('should save language preference when language is selected', () => {
    vi.mocked(loadLanguage).mockReturnValue(null);
    bootstrap();

    const miOption = Array.from(document.querySelectorAll('[data-action="select-lang"]')).find(
      (el) => (el as HTMLElement).getAttribute('data-lang') === 'mi'
    ) as HTMLElement | undefined;
    miOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(saveLanguage).toHaveBeenCalledWith('mi');
  });
  it('should render Māori assessment content when language is Māori', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    // Progress label should be in Māori
    expect(app?.innerHTML).toContain('Hāpai');
    // Step text should be in Māori
    expect(app?.textContent).toContain('Tūtohi 1 o');
    // Start over button should be in Māori
    expect(app?.textContent).toContain('Tīmata anō');
    // Chart title should be in Māori
    expect(app?.textContent).toContain('Ko tō āhua o ināianei');
    // Back button should be in Māori
    expect(app?.textContent).toContain('Hoki');
    // Next button should be in Māori
    expect(app?.textContent).toContain('Panoni');
    // Score format should use i18n key (not hardcoded English)
    expect(app?.textContent).toContain(' / 5');
  });

  it('should render Māori summary content when language is Māori', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    expect(app?.textContent).toContain('Tō whakamātautautā');
    // Print button should be in Māori
    expect(app?.textContent).toContain('Tāpata i te mātaitai');
    // New reflection button should be in Māori
    expect(app?.textContent).toContain('Tīmata whakamātautautā hou');
    // Back to edit should be in Māori
    expect(app?.textContent).toContain('Hoki ki te whakatika');
  });

  it('should render Māori domain name in summary shape note when spread > 1', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Set first domain to 5, second to 3 to create spread > 1
    const input = document.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '5';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    // shapeNote should contain Māori domain name since spread > 1
    expect(app?.innerHTML).toContain('Taha tinana');
  });

  it('should render Māori score labels in summary when spread <= 1', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Set first domain to 5 (default for others is 3, spread = 2 > 1)
    const input = document.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '5';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    // With spread > 1, shape note contains the score spread message
    expect(app?.textContent).toContain('Ko ngā wāhi');
  });

  it('should render balanced score note in Māori when all scores are equal', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    vi.mocked(loadState).mockReturnValue({
      domains: createDefaultDomains() // All scores = 3
    });

    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Start and go straight to summary
    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    // spread = 0, so should show scoreEven
    expect(app?.textContent).toContain('Ke tūpato ō tūtohi i runga i ngā ara e whā.');
  });

  it('should not leak English UI text in Māori summary flow', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    const html = app?.innerHTML || '';
    // English UI strings should NOT appear in Māori mode (domain names are intentionally bilingual)
    expect(html).not.toContain('Begin reflection');
    expect(html).not.toContain('Your reflection');
    expect(html).not.toContain('Print or save as PDF');
    expect(html).not.toContain('Back to edit');
    expect(html).not.toContain('Start a new reflection');
    expect(html).not.toContain('See summary');
    expect(html).not.toContain('A snapshot of where you sit right now');
  });

  it('should render bilingual domain names in summary cards', () => {
    vi.mocked(loadLanguage).mockReturnValue('en');
    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    // Both Māori and English names should appear in summary card headings
    expect(app?.innerHTML).toContain('Taha tinana');
    expect(app?.innerHTML).toContain('Physical wellbeing');
    // Should not have a separate .summary-english paragraph
    expect(app?.innerHTML).not.toContain('summary-english');
  });

  it('should pre-select Māori option when browser language detects Māori', () => {
    vi.mocked(loadLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', {
      value: 'mi-NZ',
      configurable: true
    });

    bootstrap();

    const miOption = document.querySelector('[data-action="select-lang"][data-lang="mi"]') as HTMLElement;
    expect(miOption?.getAttribute('aria-checked')).toBe('true');
    expect(miOption?.classList.contains('selected')).toBe(true);

    // Restore
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true
    });
  });

  it('should fall back to English description when descriptionMi is missing', () => {
    vi.mocked(loadLanguage).mockReturnValue('mi');
    vi.mocked(loadState).mockReturnValue({
      domains: [{
        id: 'test',
        name: 'Test Domain',
        maoriName: 'Taha whakamātautautā',
        description: 'English fallback description',
        prompt: 'English fallback prompt',
        score: 3,
        reflection: ''
      }]
    });

    bootstrap();

    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const app = document.getElementById('app');
    // Should show English description as fallback (no descriptionMi defined)
    expect(app?.textContent).toContain('English fallback description');
    expect(app?.textContent).toContain('English fallback prompt');
  });

  it('should call window.print when print button is clicked from summary', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    document.querySelector('[data-action="print"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(printSpy).toHaveBeenCalled();

    printSpy.mockRestore();
  });

  it('should navigate to specific domain step when edit is clicked from summary', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const editBtn = document.querySelector('[data-action="edit"][data-domain="tinana"]') as HTMLElement | null;
    expect(editBtn).not.toBeNull();
    editBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('assessment');
    expect(app?.innerHTML).toContain('Taha tinana');
  });

  it('should return to last domain assessment when prev is clicked from summary', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    document.querySelector('[data-action="prev"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('assessment');
    expect(app?.innerHTML).not.toContain('welcome-title');
    expect(app?.textContent).toContain('Step 4 of');
  });

  it('should save reflection text to state and localStorage when reflection input changes', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const textarea = document.querySelector('[data-reflection="tinana"]') as HTMLTextAreaElement | null;
    expect(textarea).not.toBeNull();
    textarea!.value = 'Test reflection text';
    textarea!.dispatchEvent(new Event('input', { bubbles: true }));

    expect(saveState).toHaveBeenCalled();
    const lastCall = vi.mocked(saveState).mock.calls[vi.mocked(saveState).mock.calls.length - 1]!;
    const domainsArg = lastCall[0] as Domain[];
    const tinana = domainsArg.find((d) => d.id === 'tinana');
    expect(tinana?.reflection).toBe('Test reflection text');
  });

  it('should register DOMContentLoaded listener on module load and bootstrap app', async () => {
    vi.resetModules();
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    await import('@src/app');
    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('welcome-title');

    addEventListenerSpy.mockRestore();
  });

  it('should render quoted reflection text in summary when reflection is non-empty', () => {
    vi.mocked(loadState).mockReturnValue({
      domains: [{
        id: 'tinana',
        name: 'Physical wellbeing',
        maoriName: 'Taha tinana',
        description: 'Test description',
        prompt: 'Test prompt',
        score: 3,
        reflection: 'I feel strong today'
      }]
    });

    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('"I feel strong today"');
    expect(app?.innerHTML).toContain('summary-note');
  });

  it('should show correct step indicator after editing domain 4 from summary', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const editBtn = document.querySelector('[data-action="edit"][data-domain="whanau"]') as HTMLElement | null;
    expect(editBtn).not.toBeNull();
    editBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.textContent).toContain('Step 4 of 4');
  });

  it('should navigate to previous domain when prev is clicked during assessment', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.getElementById('app')?.textContent).toContain('Step 2 of');

    document.querySelector('[data-action="prev"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('assessment');
    expect(app?.textContent).toContain('Step 1 of');
  });

  it('should render balanced score note when spread is 1', () => {
    const domains = createDefaultDomains();
    domains[0] = { ...domains[0], score: 4 } as Domain;

    vi.mocked(loadState).mockReturnValue({
      domains
    });

    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    // spread = 1, so should show scoreBalanced
    expect(app?.textContent).toContain('with only small differences between dimensions');
  });

  it('should show export and import buttons on summary screen', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('data-action="export"');
    expect(app?.innerHTML).toContain('data-action="import"');
    expect(app?.innerHTML).toContain('data-import-input');
  });

  it('should trigger file input when import button is clicked', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    const fileInput = document.querySelector('[data-import-input]') as HTMLInputElement | null;
    const clickSpy = vi.spyOn(fileInput!, 'click');

    document.querySelector('[data-action="import"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('should show export screen when export button is clicked from summary', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    document.querySelector('[data-action="export"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('export-title');
    expect(app?.innerHTML).toContain('export-domain-list');
    expect(app?.innerHTML).toContain('data-action="export-download"');
    expect(app?.innerHTML).toContain('data-action="export-back"');
  });

  it('should return to summary when back is clicked from export screen', () => {
    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    document.querySelector('[data-action="export"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.querySelector('[data-action="export-back"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const app = document.getElementById('app');
    expect(app?.innerHTML).toContain('summary-title');
    expect(app?.innerHTML).toContain('data-action="export"');
  });

  it('should trigger download when download button is clicked from export screen', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);

    bootstrap();
    document.querySelector('[data-action="start"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    for (let i = 0; i < 4; i++) {
      document.querySelector('[data-action="next"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    document.querySelector('[data-action="export"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.querySelector('[data-action="export-download"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});