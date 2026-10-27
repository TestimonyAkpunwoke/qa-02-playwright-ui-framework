import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test('TC-INV-001: standard user can view the inventory page', async ({ page }) => {
  // Arrange: log in with a valid account.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // Act: create the inventory page object.
  const inventoryPage = new InventoryPage(page);

  // Assert: verify the inventory page and products are visible.
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');
  await expect(inventoryPage.inventoryItems).toHaveCount(6);
  await expect(inventoryPage.cartLink).toBeVisible();
});


test('TC-INV-002: products can be sorted by name A to Z', async ({ page }) => {
  // Arrange: log in and open the inventory page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  // Act: sort products alphabetically.
  await inventoryPage.sortProducts('az');

  // Assert: verify the product names are in alphabetical order.
const productNames = await page
  .getByTestId('inventory-item-name')
  .allTextContents();

expect(productNames).toEqual([
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
]);
});



test('TC-INV-003: products can be sorted by name Z to A', async ({ page }) => {
  // Arrange: log in and prepare the inventory page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  // Act: sort products in reverse alphabetical order.
  await inventoryPage.sortProducts('za');

  // Assert: verify the product names are in reverse alphabetical order.
  const productNames = await page
    .getByTestId('inventory-item-name')
    .allTextContents();

  expect(productNames).toEqual([
  'Test.allTheThings() T-Shirt (Red)',
  'Sauce Labs Onesie',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Bike Light',
  'Sauce Labs Backpack',
]);
});



test('TC-INV-004: products can be sorted by price low to high', async ({ page }) => {
  // Arrange: log in and prepare the inventory page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  // Act: sort products by ascending price.
  await inventoryPage.sortProducts('lohi');

  // Assert: verify that displayed prices are in ascending order.
  const priceTexts = await page
    .getByTestId('inventory-item-price')
    .allTextContents();

  const prices = priceTexts.map((price) =>
    Number(price.replace('$', ''))
  );

  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});



test('TC-INV-005: products can be sorted by price high to low', async ({ page }) => {
  // Arrange: log in and prepare the inventory page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  // Act: sort products by descending price.
  await inventoryPage.sortProducts('hilo');

  // Assert: verify that displayed prices are in descending order.
  const priceTexts = await page
    .getByTestId('inventory-item-price')
    .allTextContents();

  const prices = priceTexts.map((price) =>
    Number(price.replace('$', ''))
  );

  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});