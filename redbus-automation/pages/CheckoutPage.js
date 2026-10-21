class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.passengerNameInput = page.getByRole('textbox', {
      name: /name/i,
    });
    this.passengerAgeInput = page.getByRole('textbox', {
      name: /age/i,
    });
    this.passengerGender = page.getByRole('combobox', {
      name: /gender/i,
    });
    this.continueButton = page.getByRole('button', {
      name: /continue|proceed to pay/i,
    });
  }

  async enterPassengerDetails({ name, age, gender }) {
    await this.passengerNameInput.fill(name);
    await this.passengerAgeInput.fill(String(age));
    await this.passengerGender.selectOption({ label: gender });
  }

  async continueToPayment() {
    await this.continueButton.click();
  }
}

module.exports = CheckoutPage;
