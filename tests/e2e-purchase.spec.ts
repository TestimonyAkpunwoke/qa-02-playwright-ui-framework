import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('TC-E2E-001: user completes a purchase successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();

  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');

  await cartPage.checkoutButton.click();
  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();

  await expect(checkoutPage.title).toHaveText('Checkout: Overview');
  await checkoutPage.finishOrder();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
});

test('TC-E2E-002: user purchases multiple products successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.cartLink.click();

  await expect(cartPage.cartItems).toHaveCount(2);
  await expect(cartPage.productName).toHaveText([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ]);

  await cartPage.checkoutButton.click();
  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();

  await expect(cartPage.cartItems).toHaveCount(2);
  await expect(cartPage.productName).toHaveText([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ]);

  await checkoutPage.finishOrder();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
});
