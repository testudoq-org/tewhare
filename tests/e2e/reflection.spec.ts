// Te Whare Tapa Whā Wellbeing Reflection App
// Playwright end-to-end tests

import { test, expect } from '@playwright/test';

test.describe('Te Whare Tapa Whā Reflection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('te-whare-tapa-wha-language', 'en');
    });
    await page.reload();
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

    await page.evaluate(() => {
      (window as Window & { __printCalled?: boolean }).__printCalled = false;
      const originalPrint = window.print;
      window.print = () => {
        (window as Window & { __printCalled?: boolean }).__printCalled = true;
        return originalPrint.call(window);
      };
    });

    await page.click('[data-action="print"]');

    const printCalled = await page.evaluate(() => (window as Window & { __printCalled?: boolean }).__printCalled);
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

  test('should render value-level polygons in live chart', async ({ page }) => {
    await page.click('[data-action="start"]');

    const chart = page.locator('#live-chart');
    await expect(chart).toBeVisible();
    await expect(page.locator('#live-chart svg')).toBeVisible();

    await expect(page.locator('#live-chart .chart-value-level-polygons')).toHaveCount(1);

    const polygons = page.locator('#live-chart .chart-value-level-polygons polygon');
    await expect(polygons).toHaveCount(5);

    for (let i = 0; i < 5; i++) {
      const polygon = polygons.nth(i);
      await expect(polygon).toHaveAttribute('fill', 'none');
      await expect(polygon).toHaveAttribute('stroke', 'var(--chart-value-level-stroke)');
    }
  });

  test('should render background SVG layer in live chart', async ({ page }) => {
    await page.click('[data-action="start"]');

    await expect(page.locator('#live-chart svg')).toBeVisible();

    await expect(page.locator('#live-chart .chart-bg-custom')).toHaveCount(1);

    await expect(page.locator('#live-chart .chart-bg-custom circle')).toHaveCount(3);

    await expect(page.locator('#live-chart .chart-bg-custom path')).toHaveCount(2);
  });

  test('should render polygon overlay in summary chart', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    await expect(page.locator('#summary-chart svg')).toBeVisible();

    await expect(page.locator('#summary-chart .chart-value-level-polygons')).toHaveCount(1);

    const polygons = page.locator('#summary-chart .chart-value-level-polygons polygon');
    await expect(polygons).toHaveCount(5);
  });

  test('should preserve chart interactivity after refactor', async ({ page }) => {
    await page.click('[data-action="start"]');

    const slider = page.locator('input[type="range"]');
    await slider.fill('5');

    const scoreValue = page.locator('[data-score-value="tinana"]');
    await expect(scoreValue).toHaveText('5');

    await expect(page.locator('#live-chart svg')).toBeVisible();
    await expect(page.locator('#live-chart .chart-dot')).toHaveCount(4);
  });

  test('should export assessment data as downloadable file', async ({ page }) => {
    await page.click('[data-action="start"]');
    const slider = page.locator('input[type="range"]');
    await slider.fill('4');
    await slider.dispatchEvent('input');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    await page.click('button[data-action="export"]');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button[data-action="export-download"]')
    ]);

    expect(download.suggestedFilename()).toBe('te-whare-tapa-wha-assessment.json');
  });

  test('should import assessment data from file and restore scores', async ({ page }) => {
    await page.click('[data-action="start"]');
    for (let i = 0; i < 4; i++) {
      await page.click('[data-action="next"]');
    }

    const assessmentData = {
      domains: [
        { id: 'tinana', name: 'Physical wellbeing', maoriName: 'Taha tinana', description: 'Test', prompt: 'Test', score: 4, reflection: 'Strong' },
        { id: 'hinengaro', name: 'Mental', maoriName: 'Taha hinengaro', description: 'Test', prompt: 'Test', score: 5, reflection: 'Clear' },
        { id: 'wairua', name: 'Spiritual', maoriName: 'Taha wairua', description: 'Test', prompt: 'Test', score: 3, reflection: '' },
        { id: 'whanau', name: 'Family', maoriName: 'Taha whānau', description: 'Test', prompt: 'Test', score: 2, reflection: 'Needs work' }
      ]
    };

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('[data-action="import"]')
    ]);

    await fileChooser.setFiles({
      name: 'assessment.json',
      mimeType: 'application/json',
      buffer: (globalThis as unknown as { Buffer: { from: (data: string) => Buffer } }).Buffer.from(JSON.stringify(assessmentData))
    });

    await page.waitForTimeout(500);

    await page.click('[data-action="start"]');

    const app = page.locator('#app');
    await expect(app).toContainText('Physical wellbeing');
    await expect(app).toContainText('4 / 5');
  });

  test('should render complete flow on mobile viewport without horizontal scroll', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.setViewportSize({ width: 375, height: 667 });

    await page.click('button[data-action="select-lang"][data-lang="en"]');
    await page.click('button[data-action="start"]');

    for (let i = 0; i < 4; i++) {
      await page.click('button[data-action="next"]');
    }

    const app = page.locator('#app');
    await expect(app).toContainText('Your reflection');
    await expect(app).toContainText('Export');
    await expect(app).toContainText('Import');

    const body = page.locator('body');
    await expect(body).toHaveCSS('overflow-x', 'hidden');
  });

  test('should render complete flow on tablet viewport', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.click('button[data-action="select-lang"][data-lang="en"]');
    await page.click('button[data-action="start"]');

    for (let i = 0; i < 4; i++) {
      await page.click('button[data-action="next"]');
    }

    const app = page.locator('#app');
    await expect(app).toContainText('Your reflection');
    await expect(app).toContainText('Export');
    await expect(app).toContainText('Import');
  });

  test('should render complete flow on mobile landscape without horizontal scroll', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.setViewportSize({ width: 667, height: 375 });

    await page.click('button[data-action="select-lang"][data-lang="en"]');
    await page.click('button[data-action="start"]');

    for (let i = 0; i < 4; i++) {
      await page.click('button[data-action="next"]');
    }

    const app = page.locator('#app');
    await expect(app).toContainText('Your reflection');

    const body = page.locator('body');
    await expect(body).toHaveCSS('overflow-x', 'hidden');
  });
});
