class LoginPage {
  constructor(page) {
    this.page = page;
    this.accountButton = page.getByRole('button', { name: 'Account' });
    this.loginDialog = page.getByRole('dialog');
    this.mobileNumberInput = page.getByRole('textbox', {
      name: /mobile number|phone number/i,
    });
  }

  async open() {
    await this.accountButton.click();
  }
}

module.exports = LoginPage;
