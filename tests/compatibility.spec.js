const { test, expect } = require('@playwright/test');

const LOCAL_ORIGIN = 'http://127.0.0.1:4173';

async function openPortal(page) {
  await page.goto('/');
  await expect(page.locator('#guide-search')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.PORTAL_SEARCH_ENGINE || '')).toBe('2.0');
}

async function expectNoHorizontalOverflow(page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
  expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
}

test('le chargement complet ne produit ni erreur JS ni ressource locale manquante', async ({ page }) => {
  const pageErrors = [];
  const failedRequests = [];
  const badResponses = [];

  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => {
    if (request.url().startsWith(LOCAL_ORIGIN)) {
      failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText || 'échec'}`);
    }
  });
  page.on('response', response => {
    if (response.url().startsWith(LOCAL_ORIGIN) && response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await openPortal(page);
  await page.waitForTimeout(500);

  const criticalCards = [
    'mise-a-jour-recuperation',
    'etude-surveillee',
    'sos-groupe',
    'commotion-cerebrale',
    'sortie-educative',
    'dates-importantes-2026-2027'
  ];
  for (const id of criticalCards) {
    await expect(page.locator(`#${id}`), `La fiche #${id} doit être rendue`).toHaveCount(1);
  }

  const deadInternalLinks = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
    .map(anchor => anchor.getAttribute('href'))
    .filter(href => href && href.length > 1)
    .filter(href => {
      try {
        return !document.getElementById(decodeURIComponent(href.slice(1)));
      } catch {
        return true;
      }
    }));

  const visibleBrokenImages = await page.evaluate(() => [...document.images]
    .filter(img => img.complete && img.naturalWidth === 0 && getComputedStyle(img).display !== 'none')
    .map(img => img.getAttribute('src') || 'image sans src'));

  expect(deadInternalLinks).toEqual([]);
  expect(visibleBrokenImages).toEqual([]);
  expect(failedRequests).toEqual([]);
  expect(badResponses).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('la page ne déborde pas horizontalement, même avec une fiche longue ouverte', async ({ page }) => {
  await openPortal(page);
  await expectNoHorizontalOverflow(page);

  const applications = page.locator('#applications-cssc');
  await applications.locator('summary').click();
  await expect(applications).toHaveAttribute('open', '');
  await applications.scrollIntoViewIfNeeded();
  await expectNoHorizontalOverflow(page);
});

test('la recherche et ses suggestions restent utilisables dans la largeur de l’écran', async ({ page }) => {
  await openPortal(page);
  const input = page.locator('#guide-search');
  await input.fill('dates importantes');

  const first = page.locator('#search-suggestions .suggestion').first();
  await expect(first).toBeVisible();
  await expect(first).toContainText('Calendrier des dates importantes');

  const viewport = page.viewportSize();
  const suggestionBox = await first.boundingBox();
  expect(viewport).not.toBeNull();
  expect(suggestionBox).not.toBeNull();
  expect(suggestionBox.x).toBeGreaterThanOrEqual(-1);
  expect(suggestionBox.x + suggestionBox.width).toBeLessThanOrEqual(viewport.width + 1);

  await first.click();
  await expect(page.locator('#dates-importantes-2026-2027')).toHaveAttribute('open', '');
  await expect(page).toHaveURL(/#dates-importantes-2026-2027$/);
  await expectNoHorizontalOverflow(page);
});

test('la fenêtre d’aide Chrome s’ouvre, reste dans l’écran et se ferme correctement', async ({ page }) => {
  await openPortal(page);
  const openButton = page.locator('#chrome-help-open');
  await expect(openButton).toBeVisible();
  await openButton.click();

  const dialog = page.locator('#chrome-help-dialog');
  await expect(dialog).toBeVisible();
  const viewport = page.viewportSize();
  const box = await dialog.boundingBox();
  expect(viewport).not.toBeNull();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.height).toBeLessThanOrEqual(viewport.height + 1);
  await expectNoHorizontalOverflow(page);

  await dialog.locator('.chrome-dialog-close').click();
  await expect(dialog).not.toBeVisible();
});
