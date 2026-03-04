import { test, expect } from '@playwright/test';

/**
 * E2E Test: Complete User Journey
 * Tests the flow: Signup → Login → Dashboard → Logout
 */
test.describe('User Authentication Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    password: 'TestPassword123!',
  };

  test('should complete full user journey: signup → login → dashboard → logout', async ({ page, context }) => {
    // Step 1: Visit website landing page
    await page.goto('http://localhost:3001');
    await expect(page).toHaveTitle(/<%= projectName %>/);
    
    // Step 2: Navigate to signup from website
    await page.click('text=Get Started');
    await expect(page).toHaveURL('http://localhost:3000/signup');
    
    // Step 3: Complete signup form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Step 4: Verify redirect to dashboard after signup
    await page.waitForURL('http://localhost:3000/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // Step 5: Navigate to profile page
    await page.click('text=Profile');
    await expect(page).toHaveURL('http://localhost:3000/dashboard/profile');
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
    
    // Step 6: Navigate to settings page
    await page.click('text=Settings');
    await expect(page).toHaveURL('http://localhost:3000/dashboard/settings');
    
    // Step 7: Logout
    await page.click('text=Logout');
    await page.waitForURL('http://localhost:3000/login');
    
    // Step 8: Login again with same credentials
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Step 9: Verify successful login
    await page.waitForURL('http://localhost:3000/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // Step 10: Final logout
    await page.click('text=Logout');
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('should protect dashboard routes when not authenticated', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('http://localhost:3000/login');
  });

  test('should show validation errors for invalid signup', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors or remain on signup page
    await expect(page).toHaveURL('http://localhost:3000/signup');
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Try invalid login
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should remain on login page
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});

test.describe('Website Navigation', () => {
  test('should navigate between website pages', async ({ page }) => {
    // Visit landing page
    await page.goto('http://localhost:3001');
    await expect(page.locator('h2:has-text("Build Your SaaS Business")')).toBeVisible();
    
    // Navigate to pricing
    await page.click('text=Pricing');
    await expect(page).toHaveURL('http://localhost:3001/pricing');
    await expect(page.locator('h1:has-text("Pricing")')).toBeVisible();
    
    // Navigate back to home
    await page.click(`text=<%= projectName %>`);
    await expect(page).toHaveURL('http://localhost:3001/');
  });

  test('should have working CTA buttons to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Check Sign In link
    const signInLink = page.locator('a:has-text("Sign In")').first();
    await expect(signInLink).toHaveAttribute('href', 'http://localhost:3000/login');
  });
});

test.describe('API Health', () => {
  test('should have API running and responding', async ({ request }) => {
    // Test API health/status
    const response = await request.get('http://localhost:3333/api/auth/me', {
      headers: {
        'Authorization': 'Bearer invalid-token', // Will fail auth but shows API is running
      },
    });
    
    // API should respond (even with 401 unauthorized)
    expect([200, 401]).toContain(response.status());
  });
});
