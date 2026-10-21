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
      timeout: 60_000,
    });
  }

  async selectCity(input, city) {
    await input.fill(city);
    const citySuggestion = this.page.getByText(city, { exact: true }).first();
    await expect(citySuggestion).toBeVisible({ timeout: 15_000 });
    await citySuggestion.click();
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

  async searchBuses() {
    await this.searchBusesButton.click();
  }

  async expectAvailableBuses(from, to) {
    await expect(this.page).toHaveURL(
      new RegExp(`${from.toLowerCase()}.*${to.toLowerCase()}`, 'i'),
      { timeout: 45_000 },
    );
    await expect(
      this.page.getByText(new RegExp(`${from}.*${to}`, 'i')).first(),
    ).toBeVisible({ timeout: 45_000 });
  }
}

module.exports = ProductsPage;
