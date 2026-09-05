const { test, expect } = require('@playwright/test');

test('le calendrier des dates importantes offre un lien Outlook copiable', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#guide-search')).toBeVisible();

  const card = page.locator('#section-organisation-scolaire #dates-importantes-2026-2027');
  await expect(card).toHaveCount(1);

  const copyButton = card.locator('.calendar-copy-link');
  await expect(copyButton).toBeVisible();
  await expect(copyButton).toContainText('Copier le lien pour Outlook');
  await expect(copyButton).toHaveAttribute('data-copy-value', /^https:\/\/calendar\.google\.com\/calendar\/ical\/.+\/public\/basic\.ics$/);
  await expect(card).toContainText('S’abonner à partir du web');
  await expect(card).toContainText('Ctrl + V');

  expect(pageErrors).toEqual([]);
});
