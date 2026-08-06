// Te Whare Tapa Whā Wellbeing Reflection App
// Playwright end-to-end tests

import { test, expect } from '@playwright/test';

test.describe('Te Whare Tapa Whā Reflection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome screen', async ({ page }) => {
    await expect(page.locator('#welcome-title')).toHaveText('Te Whare Tapa Whā');
    await expect(page.locator('[data-action="start"]')).toBeVisible();
  });

  test('should start assessment flow', async ({ page }) => {
    await page.click('[data-action="start"]');
    await expect(page.locator('.assessment')).toBeVisible();
    await expect(page.locator('#domain-title')).toContainText('Taha tinana');
  });

  test('should navigate through all domains', async ({ page }) => {
    await page.click('[data-action="start"]');

    const domains = ['tinana', 'hinengaro', 'wairua', 'whanau'];
    for (let i = 0; i < domains.length; i++) {
      await expect(page.locator('#domain-title')).toContainText(
        i === 0 ? 'Taha tinana' :
        i === 1 ? 'Taha hinengaro' :
        i === 2 ? 'Taha wairua' : 'Taha whānau'
      );

      if (i < domains.length - 1) {
        await page.click('[data-action="next"]');
      }
    }
  });

  test('should show summary after last domain', async ({ page }) => {
    await page.click('[data-action="start"]');

    // Navigate through all 4 domains
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    await expect(page.locator('#summary-title')).toHaveText('Your reflection');
    await expect(page.locator('#summary-chart')).toBeVisible();
  });

  test('should update score and chart', async ({ page }) => {
    await page.click('[data-action="start"]');

    const slider = page.locator('input[type="range"]');
    await slider.fill('5');

    const scoreValue = page.locator('[data-score-value="tinana"]');
    await expect(scoreValue).toHaveText('5');

    await expect(page.locator('#live-chart svg')).toBeVisible();
  });

  test('should add reflection text', async ({ page }) => {
    await page.click('[data-action="start"]');

    const textarea = page.locator('textarea[data-reflection="tinana"]');
    await textarea.fill('I feel strong today');

    await expect(textarea).toHaveValue('I feel strong today');
  });

  test('should allow navigation back and forth', async ({ page }) => {
    await page.click('[data-action="start"]');
    await page.click('[data-action="next"]');
    await expect(page.locator('#domain-title')).toContainText('Taha hinengaro');

    await page.click('[data-action="prev"]');
    await expect(page.locator('#domain-title')).toContainText('Taha tinana');
  });

  test('should allow editing from summary', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    await page.click('[data-action="edit"]');
    await expect(page.locator('.assessment')).toBeVisible();
  });

  test('should print summary', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    // Override window.print to verify it was called
    await page.evaluate(() => {
      (window as any).__printCalled = false;
      const originalPrint = window.print;
      window.print = () => {
        (window as any).__printCalled = true;
        return originalPrint.call(window);
      };
    });

    await page.click('[data-action="print"]');

    const printCalled = await page.evaluate(() => (window as any).__printCalled);
    expect(printCalled).toBe(true);
  });

  test('should reset assessment', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.click('[data-action="start"]');
    await page.click('[data-action="reset"]');

    await expect(page.locator('#welcome-title')).toHaveText('Te Whare Tapa Whā');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('[data-action="start"]');

    await expect(page.locator('.assessment-body')).toBeVisible();
    await expect(page.locator('#live-chart')).toBeVisible();
  });
});

