const { test, expect } = require('@playwright/test');

async function openPortal(page) {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#guide-search')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.PORTAL_SEARCH_ENGINE || '')).toBe('2.0');
  return pageErrors;
}

async function searchAndOpen(page, query, expectedText) {
  const input = page.locator('#guide-search');
  await input.fill(query);
  const first = page.locator('#search-suggestions .suggestion').first();
  await expect(first).toBeVisible();
  await expect(first).toContainText(expectedText);
  await expect(first).toHaveAttribute('data-search-index', '0');
  await first.click();
  await expect(page.locator('.portal-search-flash')).toBeVisible();
  return page.locator('.portal-search-flash');
}

test('suppléance mène directement à Scolago et fait flasher la ressource', async ({ page }) => {
  const errors = await openPortal(page);
  const target = await searchAndOpen(page, 'suppléance', 'Scolago');
  await expect(target).toContainText('Scolago');
  await expect(page).toHaveURL(/#scolago$/);
  expect(errors).toEqual([]);
});

test('plan de cl mène au Plan de classe et ouvre la fiche', async ({ page }) => {
  const errors = await openPortal(page);
  await searchAndOpen(page, 'plan de cl', 'Plan de classe');
  await expect(page.locator('#planclasse')).toHaveAttribute('open', '');
  await expect(page).toHaveURL(/#planclasse$/);
  expect(errors).toEqual([]);
});

test('présences utilise le logo Mozaïk local', async ({ page }) => {
  const errors = await openPortal(page);
  const target = await searchAndOpen(page, 'présences', 'Présences');
  await expect(target).toContainText('Mozaïk');
  const logo = page.locator('#presences summary .procedure-visual img');
  await expect(logo).toHaveAttribute('src', /assets\/mozaik\.svg$/);
  expect(errors).toEqual([]);
});

test('Retour en haut ferme les fiches, vide la recherche et remet la page propre', async ({ page }) => {
  const errors = await openPortal(page);
  await searchAndOpen(page, 'plan de classe', 'Plan de classe');
  const backToTop = page.locator('#back-to-top');
  await expect(backToTop).toBeVisible();
  await backToTop.click();
  await expect(page.locator('.procedure[open]')).toHaveCount(0);
  await expect(page.locator('#guide-search')).toHaveValue('');
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
});

test('le moteur tolère une faute simple sur suppléance', async ({ page }) => {
  const errors = await openPortal(page);
  const input = page.locator('#guide-search');
  await input.fill('suppleence');
  const first = page.locator('#search-suggestions .suggestion').first();
  await expect(first).toBeVisible();
  await expect(first).toContainText('Scolago');
  expect(errors).toEqual([]);
});

test('le moteur comprend une recherche partielle de photocopie', async ({ page }) => {
  const errors = await openPortal(page);
  const input = page.locator('#guide-search');
  await input.fill('photocopi');
  const first = page.locator('#search-suggestions .suggestion').first();
  await expect(first).toBeVisible();
  await expect(first).toContainText('Repro+');
  expect(errors).toEqual([]);
});
