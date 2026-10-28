import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = this.page.getByTestId('shopping-cart-badge');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async sortProducts(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async addBackpackToCart() {
    await this.page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  }

  async addBikeLightToCart() {
    await this.page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  }
}