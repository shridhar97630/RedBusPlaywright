const { expect } = require('@playwright/test');
const config = require('../config/environment');

class ProductsPage {
  constructor(page) {
    this.page = page;
    this.fromInput = page.getByRole('combobox', { name: 'From' });
    this.toInput = page.getByRole('combobox', { name: 'To' });
    this.journeyDate = page.getByRole('dialog', {
      name: 'Select date of journey',
    });
    this.searchBusesButton = page.getByRole('button', {
      name: 'Search buses',
    });
  }

  async open() {
    await this.page.goto(config.baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: config.navigationTimeoutMs,
    });
  }

  async selectCity(input, city) {
    const suggestionResponse = this.page.waitForResponse(
      (response) => {
        const url = new URL(response.url());
        return (
          url.pathname === '/rpw/api/citySuggestion' &&
          url.searchParams.get('search') === city
        );
      },
      { timeout: config.navigationTimeoutMs },
    );
    await input.fill(city);
    const response = await suggestionResponse;
    expect(response.ok(), `Autocomplete request for ${city} should succeed`).toBe(
      true,
    );
    const citySuggestion = this.page
      .locator(`[role="heading"][aria-label="${city}"]`)
      .first();
    await expect(citySuggestion).toBeVisible({ timeout: 30_000 });
    await citySuggestion.click();
    await expect(input).toHaveValue(city);
  }

  async enterOrigin(city) {
    await this.selectCity(this.fromInput, city);
  }

  async enterDestination(city) {
    await this.selectCity(this.toInput, city);
  }

  async selectJourneyDate() {
    const tomorrowButton = this.page.getByRole('button', {
      name: /search for tomorrow/i,
    });

    if (await tomorrowButton.isVisible()) {
      await tomorrowButton.click();
      return;
    }

    await this.journeyDate.click();
    await expect(
      this.page.getByRole('button', { name: /tomorrow/i }).first(),
    ).toBeVisible();
    await this.page.getByRole('button', { name: /tomorrow/i }).first().click();
  }

  async searchBuses(from, to) {
    const routePath = new RegExp(
      `/bus-tickets/${from.toLowerCase().replace(/\s+/g, '-')}-to-${to
        .toLowerCase()
        .replace(/\s+/g, '-')}`,
      'i',
    );
    const navigation = this.page.waitForURL(
      (url) => routePath.test(url.pathname),
      { timeout: config.navigationTimeoutMs },
    );
    const [clickResult, navigationResult] = await Promise.allSettled([
      this.searchBusesButton.click({
        timeout: config.navigationTimeoutMs,
      }),
      navigation,
    ]);

    if (navigationResult.status === 'rejected') {
      throw clickResult.status === 'rejected'
        ? clickResult.reason
        : navigationResult.reason;
    }
    // redBus replaces the search button during navigation before Playwright settles the click.
  }

  async expectAvailableBuses(from, to) {
    await expect(this.page).toHaveURL(
      new RegExp(`${from.toLowerCase()}.*${to.toLowerCase()}`, 'i'),
      { timeout: 45_000 },
    );
    const availableBuses = this.page
      .getByText(/^\d+\s+buses found$/i)
      .last();
    await expect(availableBuses).toBeVisible({ timeout: 45_000 });
    const busCount = Number.parseInt(await availableBuses.innerText(), 10);
    expect(busCount).toBeGreaterThan(0);
    await expect(
      this.page.locator('[class*="busTitleWrapper"]').first(),
    ).toBeVisible({ timeout: 45_000 });
  }
}

module.exports = ProductsPage;
