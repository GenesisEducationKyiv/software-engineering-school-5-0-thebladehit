import { test, expect } from '@playwright/test';

const PAGE_URL = process.env.BASE_URL || 'http://localhost:3003/';

test.describe('Subscription form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test('Page renders correctly with the title', async ({ page }) => {
    await expect(page).toHaveTitle(/Weather Subscription/i);
  });

  test('Submitting form with valid data shows success message', async ({
    page,
  }) => {
    await page.fill('#email', `test${Date.now()}@example.com`);
    await page.selectOption('#frequency', 'DAILY');
    await page.fill('#city', 'Kyiv');

    await page.click('button[type=submit]');

    const message = page.locator('#message');
    await expect(message).toBeVisible();
    await expect(message).toHaveText(
      'Check your email to confirm your subscription.'
    );
    await expect(message).not.toHaveClass(/error/);
  });

  test('Submitting with invalid city shows error message', async ({ page }) => {
    const invalidCity = '!fdsafasff';
    await page.fill('#email', `test${Date.now()}@example.com`);
    await page.selectOption('#frequency', 'DAILY');
    await page.fill('#city', invalidCity);

    await page.click('button[type=submit]');

    const message = page.locator('#message');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/error/);
    await expect(message).toHaveText(`City ${invalidCity} not found`);
  });

  test('Submitting empty form does not proceed (built-in validation)', async ({
    page,
  }) => {
    await page.click('button[type=submit]');

    const emailValid = await page.$eval('#email', (el) =>
      (el as HTMLInputElement).checkValidity()
    );
    const cityValid = await page.$eval('#city', (el) =>
      (el as HTMLInputElement).checkValidity()
    );

    expect(emailValid).toBe(false);
    expect(cityValid).toBe(false);
  });
});
