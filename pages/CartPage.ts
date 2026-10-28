import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.productName = this.cartItems.getByTestId('inventory-item-name');
    this.productPrice = this.cartItems.getByTestId('inventory-item-price');
    this.productQuantity = this.page.getByTestId('item-quantity');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async removeBackpack() {
    await this.page.getByTestId('remove-sauce-labs-backpack').click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async removeBikeLight() {
    await this.page.getByTestId('remove-sauce-labs-bike-light').click();
  }
}