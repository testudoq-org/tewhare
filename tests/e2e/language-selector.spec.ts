// Te Whare Tapa Whā Wellbeing Reflection App
// Playwright end-to-end tests for the language selector and i18n flow

import { test, expect } from '@playwright/test';

test.describe('Language Selector', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so the selector always shows
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display language selector as the first screen', async ({ page }) => {
    await expect(page.locator('#lang-select-title')).toBeVisible();
    // Selector shows BOTH English and Māori (bilingual landing page)
    await expect(page.locator('#lang-select-title')).toContainText('Choose your language');
    await expect(page.locator('#lang-select-title')).toContainText('Whiriwhi i tō reo');
    await expect(page.locator('.lang-subtitle')).toContainText('Select a language to begin');
    await expect(page.locator('.lang-subtitle')).toContainText('Whiriwhi tētahi reo kia tīmata');
    await expect(page.locator('[data-action="select-lang"][data-lang="en"]')).toBeVisible();
    await expect(page.locator('[data-action="select-lang"][data-lang="mi"]')).toBeVisible();
  });

  test('should enter the app in English when English is selected', async ({ page }) => {
    await page.click('[data-action="select-lang"][data-lang="en"]');

    // Language selector should be gone
    await expect(page.locator('#lang-select-title')).not.toBeVisible();

    // Welcome screen should appear in English
    await expect(page.locator('#welcome-title')).toHaveText('Te Whare Tapa Whā');
    await expect(page.locator('[data-action="start"]')).toHaveText('Begin reflection');
  });

  test('should enter the app in Māori when Māori is selected', async ({ page }) => {
    await page.click('[data-action="select-lang"][data-lang="mi"]');

    // Language selector should be gone
    await expect(page.locator('#lang-select-title')).not.toBeVisible();

    // Welcome screen should appear in Māori
    await expect(page.locator('#welcome-title')).toHaveText('Te Whare Tapa Whā');
    await expect(page.locator('[data-action="start"]')).toHaveText('Tīmata i te whakamātautautā');

    // English-only text should not appear on the welcome screen
    const appHtml = await page.locator('#app').innerHTML();
    expect(appHtml).not.toContain('Begin reflection');
    expect(appHtml).not.toContain('A wellbeing reflection');
    expect(appHtml).not.toContain('This tool is for personal reflection');
  });

  test('should not show language selector on reload when preference is saved', async ({ page }) => {
    await page.click('[data-action="select-lang"][data-lang="mi"]');
    await expect(page.locator('#welcome-title')).toBeVisible();
    await page.reload();
    // Should skip selector and go straight to welcome
    await expect(page.locator('#lang-select-title')).not.toBeVisible();
    await expect(page.locator('#welcome-title')).toBeVisible();
  });

  test('html lang attribute should update to selected language', async ({ page }) => {
    // Test English selection
    await page.click('[data-action="select-lang"][data-lang="en"]');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Now test Māori selection — need fresh page
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.click('[data-action="select-lang"][data-lang="mi"]');
    await expect(page.locator('html')).toHaveAttribute('lang', 'mi');
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('[data-action="select-lang"][data-lang="en"]');

    await expect(page.locator('#welcome-title')).toBeVisible();
    await expect(page.locator('[data-action="start"]')).toBeVisible();
  });

  test('should persist language preference across separate sessions', async ({ page }) => {
    await page.click('[data-action="select-lang"][data-lang="mi"]');
    await expect(page.locator('[data-action="start"]')).toHaveText('Tīmata i te whakamātautautā');

    // Simulate new session by clearing cookies but keeping localStorage
    await page.context().clearCookies();
    await page.reload();

    await expect(page.locator('#welcome-title')).toBeVisible();
    await expect(page.locator('[data-action="start"]')).toHaveText('Tīmata i te whakamātautautā');
  });
});

test.describe('Full i18n Flow – Māori', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.click('[data-action="select-lang"][data-lang="mi"]');
  });

  test('should show Māori text on welcome screen', async ({ page }) => {
    const html = await page.locator('#app').innerHTML();
    expect(html).toContain('He whakamātautautā hauora');
    expect(html).toContain('Tīmata i te whakamātautautā');
  });

  test('should show Māori domain descriptions in assessment', async ({ page }) => {
    await page.click('[data-action="start"]');
    await expect(page.locator('#domain-title')).toContainText('Taha tinana');

    // Description should be in Māori (the tinana descriptionMi)
    const desc = await page.locator('.domain-desc').textContent();
    expect(desc).not.toContain('How your body feels');
    expect(desc).not.toContain('movement, rest, nourishment');
  });

  test('should show Māori reflection prompts for each domain', async ({ page }) => {
    await page.click('[data-action="start"]');

    // Check tinana (physical) reflection prompt via label element
    const labelText = await page.locator('label[for="reflection-tinana"]').textContent();
    expect(labelText).not.toContain('What does looking after your tinana');
    expect(labelText).toContain('He aha');
  });

  test('should show Māori summary text after assessment', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    const html = await page.locator('#app').innerHTML();
    expect(html).toContain('Tō whakamātautautā');
    expect(html).not.toContain('Your reflection');
    expect(html).not.toContain('Back to edit');
  });

  test('should use Māori domain names in summary shape note', async ({ page }) => {
    await page.click('[data-action="start"]');

    // Set one score high to create a spread > 1 (others remain at 3)
    await page.locator('input[type="range"]').fill('5');

    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    const shapeNote = await page.locator('.shape-note').textContent();
    // Should contain Māori domain names (with "Taha" prefix) in the spread message
    expect(shapeNote).toMatch(/Taha/);
  });

  test('should not leak English UI text in Māori summary flow', async ({ page }) => {
    await page.click('[data-action="start"]');

    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    const html = await page.locator('#app').innerHTML();
    // English UI strings should NOT appear in Māori mode
    expect(html).not.toContain('Begin reflection');
    expect(html).not.toContain('Your reflection');
    expect(html).not.toContain('Print or save as PDF');
    expect(html).not.toContain('Back to edit');
    expect(html).not.toContain('Start a new reflection');
    expect(html).not.toContain('See summary');
    expect(html).not.toContain('A snapshot of where you sit right now');
  });

  test('should use i18n score format (no hardcoded / 5) in Māori flow', async ({ page }) => {
    await page.click('[data-action="start"]');

    // Score label should use i18n format
    const label = await page.locator('label[for="score-tinana"]').textContent();
    expect(label).toContain('/ 5');

    // Navigate to summary
    await page.locator('input[type="range"]').fill('4');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    // Summary score badge should also use i18n format
    const badge = await page.locator('.score-badge').first().textContent();
    expect(badge).toContain('/ 5');
  });

  test('should show bilingual domain names in summary cards', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    // Both Māori and English names should appear in summary card headings
    const html = await page.locator('#app').innerHTML();
    expect(html).toContain('Taha tinana');
    expect(html).toContain('Physical wellbeing');
    // Should not have a separate summary-english paragraph
    expect(html).not.toContain('summary-english');
  });
});

test.describe('Full i18n Flow – English', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.click('[data-action="select-lang"][data-lang="en"]');
  });

  test('should show English text on welcome screen after language selection', async ({ page }) => {
    const html = await page.locator('#app').innerHTML();
    expect(html).toContain('Begin reflection');
    expect(html).toContain('A wellbeing reflection');
  });

  test('should show English domain descriptions in assessment', async ({ page }) => {
    await page.click('[data-action="start"]');
    const desc = await page.locator('.domain-desc').textContent();
    expect(desc).toContain('How your body feels');
  });

  test('should show English summary text', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    const html = await page.locator('#app').innerHTML();
    expect(html).toContain('Your reflection');
    expect(html).toContain('Print or save as PDF');
  });

  test('should use English domain names in summary shape note', async ({ page }) => {
    await page.click('[data-action="start"]');

    // Set one score high to create a spread > 1 (others remain at 3)
    await page.locator('input[type="range"]').fill('5');

    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    const shapeNote = await page.locator('.shape-note').textContent();
    expect(shapeNote).toMatch(/Stronger areas include/);
    expect(shapeNote).toMatch(/Areas sitting lower include/);
  });
});
