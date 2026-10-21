const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('user launches the redBus website', async function () {
  await this.pages.products.open();
  await expect(this.page).toHaveTitle(/redBus/i);
  await expect(
    this.page.getByRole('heading', {
      level: 1,
      name: /online bus ticket booking site/i,
    }),
  ).toBeVisible();
});

When('user enters the configured From location', async function () {
  await this.pages.products.enterOrigin(this.route.from);
});

When('user enters the configured To location', async function () {
  await this.pages.products.enterDestination(this.route.to);
});

When('user selects a journey date', async function () {
  await this.pages.products.selectJourneyDate();
});

When('user clicks on the Search buses button', async function () {
  await this.pages.products.searchBuses(this.route.from, this.route.to);
});

Then(
  'user should see the available buses for the configured route',
  async function () {
    await this.pages.products.expectAvailableBuses(
      this.route.from,
      this.route.to,
    );
  },
);
