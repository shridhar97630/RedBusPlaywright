const { test, expect } = require('@playwright/test');
const config = require('../config/environment');
const ProductsPage = require('../pages/ProductsPage');
const installHttp1BrowserBridge = require('../support/http1-browser-bridge');

test.use({
  launchOptions: {
    headless: config.headless,
    proxy: config.browserProxy,
  },
});

test('Search buses using the configured route', async ({ context, page }) => {
  test.setTimeout(config.navigationTimeoutMs);

  if (config.http1Bridge) {
    await installHttp1BrowserBridge(context, config.baseUrl);
  }

  const products = new ProductsPage(page);
  await products.open();
  await expect(page).toHaveTitle(/redBus/i);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /online bus ticket booking site/i,
    }),
  ).toBeVisible();

  await products.enterOrigin(config.route.from);
  await products.enterDestination(config.route.to);
  await products.selectJourneyDate();
  await products.searchBuses(config.route.from, config.route.to);
  await products.expectAvailableBuses(config.route.from, config.route.to);
});
