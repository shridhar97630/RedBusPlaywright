class CartPage {
  constructor(page) {
    this.page = page;
    this.seatMap = page.locator(
      '[data-testid*="seat"], [class*="seatMap"], [class*="seat-map"]',
    );
    this.continueButton = page.getByRole('button', {
      name: /continue|proceed/i,
    });
  }

  async selectSeat(seatName) {
    await this.page.getByRole('button', { name: seatName }).click();
  }

  async continueToCheckout() {
    await this.continueButton.click();
  }
}

module.exports = CartPage;
