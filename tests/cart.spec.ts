import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test('TC-CART-001: added product appears in the shopping cart', async ({ page }) => {
  // Arrange: log in with a valid account.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Act: add the backpack and open the cart.
  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.goto();

  // Assert: verify the product appears in the cart.
  await expect(cartPage.title).toHaveText('Your Cart');
  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.cartItems).toContainText('Sauce Labs Backpack');
});

test('TC-CART-002: product can be removed from the shopping cart', async ({ page }) => {
  // Arrange: log in and add the backpack.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();

  // Act: remove the backpack.
  await cartPage.removeBackpack();

  // Assert: verify that the cart is empty.
  await expect(cartPage.cartItems).toHaveCount(0);
});

test('TC-CART-003: cart badge updates when a product is added and removed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Initially, no product has been added.
  await expect(inventoryPage.cartBadge).toHaveCount(0);

  // Add the backpack.
  await inventoryPage.addBackpackToCart();
  await expect(inventoryPage.cartBadge).toHaveText('1');

  // Open the cart and remove the backpack.
  await inventoryPage.cartLink.click();
  await cartPage.removeBackpack();

  // Return to inventory and verify the badge is gone.
  await inventoryPage.cartLink.click();
  await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test('TC-CART-004: cart displays the correct product details', async ({ page }) => {
  // Arrange: log in and add the backpack.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();

  // Assert: verify the product details.
  await expect(cartPage.productName).toHaveText('Sauce Labs Backpack');
  await expect(cartPage.productPrice).toHaveText('$29.99');
  await expect(cartPage.productQuantity).toHaveText('1');
});

test('TC-CART-005: user can continue shopping from the cart', async ({ page }) => {
  // Arrange: log in and open the cart.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.cartLink.click();

  // Act: select Continue Shopping.
  await cartPage.continueShopping();

  // Assert: verify the user returns to the inventory page.
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');
});

test('TC-CART-006: cart contents remain after continuing shopping', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.continueShopping();
  await inventoryPage.cartLink.click();

  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.cartItems).toContainText('Sauce Labs Backpack');
});

test('TC-CART-007: two different products can be added to the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.cartLink.click();

  await expect(cartPage.cartItems).toHaveCount(2);
  await expect(cartPage.productName).toHaveText([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ]);
});

test('TC-CART-008: removing one product leaves the other product in the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.cartLink.click();

  await cartPage.removeBackpack();

  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.cartItems).toContainText('Sauce Labs Bike Light');
  await expect(cartPage.cartItems).not.toContainText('Sauce Labs Backpack');
});

test('TC-CART-009: cart badge shows the number of products added', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await expect(inventoryPage.cartBadge).toHaveText('2');
});

test('TC-CART-010: checkout button opens the checkout information page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.cartLink.click();
  await cartPage.checkoutButton.click();

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
});
