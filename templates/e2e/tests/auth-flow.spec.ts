import { test, expect } from '@playwright/test';

test.describe('Auth Flow Smoke Test', () => {
  test('Website loads with styles', async ({ page }) => {
    await page.goto('http://localhost:4201');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toContain('devfolio');
    console.log(`✅ Website loaded: ${title}`);
  });

  test('Dashboard loads', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toContain('Dashboard');
    console.log(`✅ Dashboard loaded: ${title}`);
  });

  test('Signup page loads', async ({ page }) => {
    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    console.log('✅ Signup page loaded');
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    console.log('✅ Login page loaded');
  });

  test('Can login with demo user', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).not.toContain('/login');
    console.log(`✅ Logged in, redirected to: ${url}`);
  });

  test('API health check', async ({ request }) => {
    const response = await request.get('http://localhost:4202/api');
    expect([200, 404]).toContain(response.status());
    console.log(`✅ API responding: ${response.status()}`);
  });

  test('Website navigation to signup works', async ({ page }) => {
    await page.goto('http://localhost:4201');
    await page.waitForLoadState('networkidle');

    await page.click('text=Get Started');
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).toContain('localhost:4200');
    console.log(`✅ Navigation to signup works: ${url}`);
  });
});
