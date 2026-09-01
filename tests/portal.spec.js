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
  await expect(logo).toHaveAttribute('src', /assets\/vendor\/moz\.png$/);
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

test('le moteur comprend une recherche partielle de reprographie', async ({ page }) => {
  const errors = await openPortal(page);
  const input = page.locator('#guide-search');
  await input.fill('reprographi');
  const first = page.locator('#search-suggestions .suggestion').first();
  await expect(first).toBeVisible();
  await expect(first).toContainText('Repro+');
  expect(errors).toEqual([]);
});

test('RFEEF est dans Formulaires et ressort pour facture', async ({ page }) => {
  const errors = await openPortal(page);
  await expect(page.locator('#section-formulaires #rfeef')).toHaveCount(1);
  const target = await searchAndOpen(page, 'facture', 'RFEEF');
  await expect(target).toHaveAttribute('id', 'rfeef');
  await expect(target.locator('a[href="https://rfeef.cssc.gouv.qc.ca/"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('les deux demandes de perfectionnement sont dans Formulaires avec les bons liens et le logo local', async ({ page }) => {
  const errors = await openPortal(page);
  const central = page.locator('#section-formulaires #perf-central');
  const local = page.locator('#section-formulaires #perf-local');
  await expect(central).toHaveCount(1);
  await expect(local).toHaveCount(1);
  await expect(central.locator('a[href*="1JM3oKD1UJ3xhqIlXqvaErvO1QKrBKwDD"]')).toHaveCount(1);
  await expect(local.locator('a[href="https://appsp.ca/formulaire/envoi.php?id=1"]')).toHaveCount(1);
  await expect(local.locator('summary .procedure-visual img')).toHaveAttribute('src', /assets\/vendor\/perf-20local-138294d2d1\.png$/);
  await expect(local).toContainText('faites d’abord');
  await expect(central).toContainText('remplissez également');
  expect(errors).toEqual([]);
});

test('Organisation scolaire contient les horaires et leurs versions du 1er septembre', async ({ page }) => {
  const errors = await openPortal(page);
  const enseignants = page.locator('#section-organisation-scolaire #horaire-enseignants-2026-2027');
  const locaux = page.locator('#section-organisation-scolaire #horaire-locaux-2026-2027');
  await expect(enseignants).toHaveCount(1);
  await expect(locaux).toHaveCount(1);
  await expect(enseignants).toContainText('Version du 1er septembre 2026');
  await expect(locaux).toContainText('Version du 1er septembre 2026');
  await expect(enseignants.locator('a[href*="1E2W_9W5rQAeyq9b1I3iin7uuazH8n70J"]')).toHaveCount(1);
  await expect(locaux.locator('a[href*="1NosMEe-dexjnXa2h9gOIIS-p4nZd4gE5"]')).toHaveCount(1);
  const target = await searchAndOpen(page, 'horaire locaux', 'Horaire des locaux');
  await expect(target).toHaveAttribute('id', 'horaire-locaux-2026-2027');
  expect(errors).toEqual([]);
});

test('Plans de l’école contient les deux plans demandés', async ({ page }) => {
  const errors = await openPortal(page);
  const plans = page.locator('#section-organisation-scolaire #plans-ecole');
  await expect(plans).toHaveCount(1);
  await expect(plans.locator('a[href*="11yGTXbZL1WUYYRKOxtDspNLZbqs7Jcu0"]')).toHaveCount(1);
  await expect(plans.locator('a[href*="124-lJYUIbzcFfmrflPw5iEAygAWMaf3n"]')).toHaveCount(1);
  await expect(plans).toContainText('nouvelle partie');
  await expect(plans).toContainText('partie existante');
  expect(errors).toEqual([]);
});

test('la navigation affiche les deux nouvelles catégories', async ({ page }) => {
  const errors = await openPortal(page);
  const nav = page.locator('.section-nav-inner');
  await expect(nav.locator('a[href="#section-formulaires"]')).toContainText('Formulaires');
  await expect(nav.locator('a[href="#section-organisation-scolaire"]')).toContainText('Organisation scolaire');
  await nav.locator('a[href="#section-formulaires"]').click();
  await expect(page).toHaveURL(/#section-formulaires$/);
  expect(errors).toEqual([]);
});
