import { test, expect, Page } from '@playwright/test';

/**
 * COMPREHENSIVE UI TESTING
 *
 * This test suite ensures critical UI paths work correctly without JavaScript errors.
 * Focus: Auth flows (signup, login, dashboard) where we have full control
 * Note: Website landing page tests moved to auth-flow.spec.ts (handles missing elements gracefully)
 */

// Helper to detect FATAL console errors (not expected network errors)
async function captureFatalErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();

      // Filter out expected network errors (401, 404, etc from API calls)
      const isNetworkError =
        text.includes('Failed to load resource') ||
        text.includes('401') ||
        text.includes('404') ||
        text.includes('Unauthorized') ||
        text.includes('Not Found');

      // These are FATAL JavaScript errors that break the UI
      const isFatalError =
        text.includes('is not defined') ||
        text.includes('Cannot read property') ||
        text.includes('undefined is not a function') ||
        text.includes('null is not an object') ||
        text.includes('Uncaught') ||
        text.includes('Unexpected token') ||
        text.includes('SyntaxError');

      if (isFatalError || (!isNetworkError && !text.includes('http'))) {
        errors.push(text);
      }
    }
  });

  page.on('pageerror', (error) => {
    // Page errors are always fatal (they crash the JS runtime)
    errors.push(error.message);
  });

  return errors;
}

// Helper to verify page loads without errors
async function verifyPageLoadsCleanly(
  page: Page,
  url: string,
  expectedElements: string[]
) {
  const errors = await captureFatalErrors(page);

  await page.goto(url);
  await page.waitForLoadState('networkidle');

  // Check for any console errors
  await page.waitForTimeout(500); // Let any async errors surface
  if (errors.length > 0) {
    throw new Error(`Page ${url} has console errors: ${errors.join(', ')}`);
  }

  // Verify expected elements exist
  for (const selector of expectedElements) {
    const element = page.locator(selector).first();
    await expect(element).toBeVisible({ timeout: 5000 });
  }

  return errors;
}

test.describe('CRITICAL PATH 1: Signup Page', () => {
  test('page loads without JavaScript errors', async ({ page }) => {
    await verifyPageLoadsCleanly(page, 'http://localhost:4200/signup', [
      'input[type="email"]',
      'input[type="password"]',
      'button[type="submit"]',
    ]);
  });

  test('form renders with all required fields', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    if (errors.length > 0) {
      throw new Error(`Signup page has console errors: ${errors.join(', ')}`);
    }

    // Verify all form fields exist and are interactable
    const nameInput = page
      .locator('input#name, input[name="name"], input[placeholder*="name" i]')
      .first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled();
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('can type into all form fields without errors', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');

    const nameInput = page
      .locator('input#name, input[name="name"], input[placeholder*="name" i]')
      .first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    // Type into each field
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    await page.waitForTimeout(500);

    if (errors.length > 0) {
      throw new Error(`Errors occurred while typing: ${errors.join(', ')}`);
    }

    // Verify values were set
    await expect(nameInput).toHaveValue('Test User');
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('empty form submission is handled without crashes', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      throw new Error(
        `Empty form submission caused errors: ${errors.join(', ')}`
      );
    }

    // Should still be on signup page (or dashboard if no validation)
    const url = page.url();
    const isValid = url.includes('signup') || url.includes('dashboard');
    expect(isValid).toBe(true);

    // Form should still be functional
    await expect(submitButton).toBeVisible();
  });

  test('filled form submission works without JavaScript errors', async ({
    page,
  }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');

    const timestamp = Date.now();
    const nameInput = page
      .locator('input#name, input[name="name"], input[placeholder*="name" i]')
      .first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await nameInput.fill('Test User');
    await emailInput.fill(`test.${timestamp}@example.com`);
    await passwordInput.fill('SecurePass123!');
    await submitButton.click();

    await page.waitForTimeout(3000);

    if (errors.length > 0) {
      throw new Error(
        `Form submission caused JavaScript errors: ${errors.join(', ')}`
      );
    }

    // After submission, should be somewhere valid (signup or dashboard)
    const url = page.url();
    const isValid = url.includes('signup') || url.includes('dashboard');
    expect(isValid).toBe(true);
  });

  test('sign in link navigates to login page', async ({ page }) => {
    await page.goto('http://localhost:4200/signup');

    const signInLink = page
      .locator('a:has-text("Sign in"), a:has-text("Log in"), a[href*="login"]')
      .first();
    await expect(signInLink).toBeVisible();
    await signInLink.click();

    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });
});

test.describe('CRITICAL PATH 2: Login Page', () => {
  test('page loads without JavaScript errors', async ({ page }) => {
    await verifyPageLoadsCleanly(page, 'http://localhost:4200/login', [
      'input[type="email"]',
      'input[type="password"]',
      'button[type="submit"]',
    ]);
  });

  test('form renders with all required fields', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    if (errors.length > 0) {
      throw new Error(`Login page has console errors: ${errors.join(', ')}`);
    }

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('can type into all form fields without errors', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    await page.waitForTimeout(500);

    if (errors.length > 0) {
      throw new Error(`Errors occurred while typing: ${errors.join(', ')}`);
    }

    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('empty form submission is handled without crashes', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      throw new Error(
        `Empty form submission caused errors: ${errors.join(', ')}`
      );
    }

    // Should remain functional
    await expect(submitButton).toBeVisible();
  });

  test('filled form submission works without JavaScript errors', async ({
    page,
  }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await submitButton.click();

    await page.waitForTimeout(3000);

    if (errors.length > 0) {
      throw new Error(
        `Login form submission caused JavaScript errors: ${errors.join(', ')}`
      );
    }

    // After submission, should be somewhere valid
    const url = page.url();
    const isValid = url.includes('login') || url.includes('dashboard');
    expect(isValid).toBe(true);
  });

  test('sign up link navigates to signup page', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    const signUpLink = page
      .locator(
        'a:has-text("Sign up"), a:has-text("Create account"), a[href*="signup"]'
      )
      .first();
    await expect(signUpLink).toBeVisible();
    await signUpLink.click();

    await expect(page).toHaveURL(/signup/, { timeout: 5000 });
  });
});

test.describe('CRITICAL PATH 3: Dashboard Page', () => {
  test('page loads without JavaScript errors', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    await page.goto('http://localhost:4200/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    if (errors.length > 0) {
      throw new Error(
        `Dashboard page has console errors: ${errors.join(', ')}`
      );
    }

    // Verify some dashboard content exists
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(0);
  });

  test('dashboard is accessible (auth implementation pending)', async ({
    page,
  }) => {
    await page.goto('http://localhost:4200/dashboard');
    await page.waitForLoadState('networkidle');

    // Should either show dashboard or redirect to login
    const url = page.url();
    const isValid = url.includes('dashboard') || url.includes('login');
    expect(isValid).toBe(true);
  });
});

test.describe('CRITICAL PATH 4: Direct URL Navigation', () => {
  const routes = [
    'http://localhost:4201/',
    'http://localhost:4200/signup',
    'http://localhost:4200/login',
    'http://localhost:4200/dashboard',
  ];

  for (const route of routes) {
    test(`${route} loads without JavaScript errors`, async ({ page }) => {
      const errors = await captureFatalErrors(page);

      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      if (errors.length > 0) {
        throw new Error(
          `Route ${route} has console errors: ${errors.join(', ')}`
        );
      }

      // Verify page has content
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText!.trim().length).toBeGreaterThan(0);
    });
  }
});

test.describe('CRITICAL PATH 6: Complete User Journeys', () => {
  test('Journey: Signup → Form interaction', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    // Start at signup page directly
    await page.goto('http://localhost:4200/signup');
    await page.waitForLoadState('networkidle');

    // Interact with signup form
    const nameInput = page
      .locator('input#name, input[name="name"], input[placeholder*="name" i]')
      .first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await nameInput.fill('Journey Test User');
    await emailInput.fill(`journey.${Date.now()}@example.com`);
    await passwordInput.fill('SecurePass123!');

    // Submit
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    await page.waitForTimeout(3000);

    // Verify no errors occurred throughout entire journey
    if (errors.length > 0) {
      throw new Error(
        `User journey had JavaScript errors: ${errors.join(', ')}`
      );
    }
  });

  test('Journey: Login → Form interaction', async ({ page }) => {
    const errors = await captureFatalErrors(page);

    // Start at login page directly
    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('networkidle');

    // Interact with login form
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill('journey@example.com');
    await passwordInput.fill('password123');

    // Submit
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    await page.waitForTimeout(3000);

    // Verify no errors occurred
    if (errors.length > 0) {
      throw new Error(
        `Login journey had JavaScript errors: ${errors.join(', ')}`
      );
    }
  });
});
