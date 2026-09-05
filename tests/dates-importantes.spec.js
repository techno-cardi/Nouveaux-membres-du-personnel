const { test, expect } = require('@playwright/test');

test('le calendrier des dates importantes est dans Organisation scolaire avec les bons accès', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#guide-search')).toBeVisible();

  const card = page.locator('#section-organisation-scolaire #dates-importantes-2026-2027');
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('Calendrier des dates importantes 2026-2027');
  await expect(card.locator('a[href*="1bfyqip0TJWvj58fUznfQzTx4Oc21i3PN"]')).toHaveCount(1);
  await expect(card.locator('a[href*="calendar.google.com/calendar/u/0?cid="]')).toHaveCount(1);
  await expect(card).toContainText('Ajouter le calendrier partagé à Google Agenda');
  await expect(card).toContainText('S’abonner à partir du web');
  await expect(card).toContainText('lien d’abonnement iCal');

  const input = page.locator('#guide-search');
  await input.fill('dates importantes 2026 2027');
  const first = page.locator('#search-suggestions .suggestion').first();
  await expect(first).toBeVisible();
  await expect(first).toContainText('Calendrier des dates importantes 2026-2027');

  expect(pageErrors).toEqual([]);
});
