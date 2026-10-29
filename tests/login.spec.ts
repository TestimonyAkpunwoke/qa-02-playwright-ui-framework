
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('TC-LOGIN-001: standard user can log in @regression', async ({ page }) => {
  // Arrange: prepare the login page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: log in with valid credentials.
  await loginPage.login('standard_user', 'secret_sauce');

  // Assert: verify that login navigates to the inventory page.
  await expect(page).toHaveURL(/inventory\.html/);
});

test('TC-LOGIN-002: invalid password shows an error @regression', async ({ page }) => {
  // Arrange: open the login page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: submit an incorrect password.
  await loginPage.login('standard_user', 'wrong_password');

  // Assert: verify that the application displays an error.
  await expect(loginPage.error).toBeVisible();
  await expect(loginPage.error).toContainText(
    'Username and password do not match'
  );
});

test('TC-LOGIN-003: locked-out user cannot log in @regression', async ({ page }) => {
  // Arrange: prepare the login page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: attempt to log in with the locked-out account.
  await loginPage.login('locked_out_user', 'secret_sauce');

  // Assert: verify that login is rejected.
  await expect(loginPage.error).toBeVisible();
  await expect(loginPage.error).toContainText(
    'Sorry, this user has been locked out'
  );
});

test('TC-LOGIN-004: empty username shows a validation error @regression', async ({ page }) => {
  // Arrange: prepare the login page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: submit an empty username.
  await loginPage.login('', 'secret_sauce');

  // Assert: verify that the application displays a validation error.
  await expect(loginPage.error).toBeVisible();
  await expect(loginPage.error).toContainText('Username is required');
});

test('TC-LOGIN-005: empty password shows a validation error @regression', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act
  await loginPage.login('standard_user', '');

  // Assert
  await expect(loginPage.error).toBeVisible();
  await expect(loginPage.error).toContainText('Password is required');
});
