import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('TC-CHECKOUT-001: checkout opens from the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
});

test('TC-CHECKOUT-002: first name is required', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();

  await checkoutPage.fillCustomerInformation('', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();

  await expect(checkoutPage.error).toContainText('First Name is required');
});

test('TC-CHECKOUT-003: last name is required', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();

  await checkoutPage.fillCustomerInformation('Testimony', '', '100001');
  await checkoutPage.continueToOverview();

  await expect(checkoutPage.error).toContainText('Last Name is required');
});

test('TC-CHECKOUT-004: postal code is required', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();

  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '');
  await checkoutPage.continueToOverview();

  await expect(checkoutPage.error).toContainText('Postal Code is required');
});

test('TC-CHECKOUT-005: valid customer information opens order overview', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();

  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(checkoutPage.title).toHaveText('Checkout: Overview');
});


test('TC-CHECKOUT-006: order overview displays the selected product and price', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();
  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();

  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');
  await expect(cartPage.productPrice).toHaveText('$29.99');
});

test('TC-CHECKOUT-007: order overview displays the item total and total with tax', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();
  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();

  await expect(page.getByTestId('subtotal-label')).toContainText('$29.99');
  await expect(page.getByTestId('tax-label')).toContainText('Tax');
  await expect(page.getByTestId('total-label')).toContainText('Total');
});

test('TC-CHECKOUT-008: finishing the order displays confirmation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();
  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();
  await checkoutPage.finishOrder();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
});

test('TC-CHECKOUT-009: completed order can return to products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();
  await checkoutPage.fillCustomerInformation('Testimony', 'Akpunwoke', '100001');
  await checkoutPage.continueToOverview();
  await checkoutPage.finishOrder();
  await checkoutPage.backToProducts();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');
});

test('TC-CHECKOUT-010: checkout can be cancelled from the information page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();
  await checkoutPage.cancelCheckout();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cartPage.title).toHaveText('Your Cart');
});
