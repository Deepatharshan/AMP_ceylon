import { test, expect } from '@playwright/test';

// Helper function to close the popup if it exists
const closePopup = async (page) => {
  try {
    await page.waitForTimeout(1000); 
    const backdrop = page.locator('.bg-black\\/40').first();
    if (await backdrop.isVisible({ timeout: 1000 })) {
      await page.mouse.click(10, 10); // Click the top left corner (backdrop)
      await page.waitForTimeout(500); // Wait for animation to finish
    }
  } catch (e) {
    // Popup might not exist
  }
};

test.describe('Homepage UI & Components', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closePopup(page);
  });

  test('Hero section loads correctly', async ({ page }) => {
    await expect(page.locator('text=AMP Ceylon').first()).toBeVisible();
    await expect(page.locator('text=Premium manufacturers and global exporter').first()).toBeVisible();
  });

  test('Featured Products section renders', async ({ page }) => {
    await expect(page.locator('text=Which Products We Have').first()).toBeVisible();
    await expect(page.locator('text=Our Products').first()).toBeVisible();
    await expect(page.locator('text=Explore Full Catalog').first()).toBeVisible();
  });

  test('Curation section is visible', async ({ page }) => {
    await expect(page.locator('text=Curation of Excellence').first()).toBeVisible();
    await expect(page.locator('text=Signature Arrangements').first()).toBeVisible();
  });

  test('Heritage section is visible', async ({ page }) => {
    await expect(page.locator('text=Our Heritage').first()).toBeVisible();
    await expect(page.locator('text=35 Years of Botanical Excellence').first()).toBeVisible();
  });
});
