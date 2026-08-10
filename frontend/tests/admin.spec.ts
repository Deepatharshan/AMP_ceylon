import { test, expect, Page } from '@playwright/test';

const closePopup = async (page: Page) => {
  try {
    await page.waitForTimeout(1000); 
    const backdrop = page.locator('.bg-black\\/40').first();
    if (await backdrop.isVisible({ timeout: 1000 })) {
      await page.mouse.click(10, 10);
      await page.waitForTimeout(500);
    }
  } catch (e) {}
};

test.describe('Dashboard Security', () => {

  test('Unauthorized users are blocked from admin dashboard', async ({ page }) => {
    // Go directly to the admin dashboard
    await page.goto('/admin/dashboard');
    
    // Check if the page redirects to the login screen or shows unauthorized
    // If it redirects to login, the URL will change to /admin/login or similar
    // Or it might show a login form directly on the page
    
    // Assuming Supabase auth triggers a redirect to login or renders a login button
    await expect(page.locator('text=Sign in').or(page.locator('text=Login')).or(page.locator('input[type="password"]')).first()).toBeVisible();
    
    // Note: If you want to test a successful login, you would need to fill the form
    // using page.fill() and click submit, then verify you reach the dashboard.
    // However, that requires valid test credentials in the .env file.
  });
});
