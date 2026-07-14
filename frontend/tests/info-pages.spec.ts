import { test, expect } from '@playwright/test';

const closePopup = async (page) => {
  try {
    await page.waitForTimeout(1000); 
    const backdrop = page.locator('.bg-black\\/40').first();
    if (await backdrop.isVisible({ timeout: 1000 })) {
      await page.mouse.click(10, 10);
      await page.waitForTimeout(500);
    }
  } catch (e) {}
};

test.describe('Static & Info Pages', () => {

  test('Contact Page renders map and details', async ({ page }) => {
    await page.goto('/contact');
    await closePopup(page);

    // Verify contact header and map
    await expect(page.locator('text=Global HQ & Manufacturing').first()).toBeVisible();
    await expect(page.locator('text=Connecting Excellence Across Borders').first()).toBeVisible();
    
    // Verify contact details
    await expect(page.locator('text=info@amp-flora.com').first()).toBeVisible();
    await expect(page.locator('text=+94 77 123 4567').first()).toBeVisible();
  });

  test('FAQ Page loads and accordions work', async ({ page }) => {
    await page.goto('/faq');
    await closePopup(page);

    await expect(page.locator('text=Frequently Asked Questions').first()).toBeVisible();
    
    // Check if a question exists and click it
    const firstQuestion = page.locator('text=What is your minimum order quantity').first();
    await expect(firstQuestion).toBeVisible();
    await firstQuestion.click();
    
    // Check if answer appears
    await expect(page.locator('text=Our standard MOQ').first()).toBeVisible();
  });

  test('Privacy Policy loads correctly', async ({ page }) => {
    await page.goto('/privacy-policy');
    await closePopup(page);

    // Verify privacy policy title
    await expect(page.locator('h1:has-text("Privacy Policy")')).toBeVisible();
    
    // Verify specific content
    await expect(page.locator('text=We are committed to safeguarding').first()).toBeVisible();
  });
});
