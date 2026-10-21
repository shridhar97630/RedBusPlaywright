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

When('user enters {string} in the From location', async function (city) {
  this.route = { ...this.route, from: city };
  await this.pages.products.enterOrigin(city);
});

When('user enters {string} in the To location', async function (city) {
  this.route = { ...this.route, to: city };
  await this.pages.products.enterDestination(city);
});

When('user selects a journey date', async function () {
  await this.pages.products.selectJourneyDate();
});

When('user clicks on the Search buses button', async function () {
  await this.pages.products.searchBuses(this.route.from, this.route.to);
});

Then(
  'user should see the available buses from {word} to {word}',
  async function (from, to) {
    await this.pages.products.expectAvailableBuses(from, to);
  },
);
