const { World, setWorldConstructor } = require('@cucumber/cucumber');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const config = require('../config/environment');

class RedBusWorld extends World {
  constructor(options) {
    super(options);
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.pages = undefined;
    this.video = undefined;
    this.scenarioName = '';
    this.route = config.route;
  }

  setPageObjects(page) {
    this.page = page;
    this.pages = Object.freeze({
      login: new LoginPage(page),
      products: new ProductsPage(page),
      cart: new CartPage(page),
      checkout: new CheckoutPage(page),
    });
  }
}

setWorldConstructor(RedBusWorld);
