import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('TC-LOGIN-001: standard user can log in', async ({ page }) => {
  // Arrange: prepare the login page.
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // Act: log in with valid credentials.
  await loginPage.login('standard_user', 'secret_sauce');

  // Assert: verify that login navigates to the inventory page.
  await expect(page).toHaveURL(/inventory\.html/);
});



test('TC-LOGIN-002: invalid password shows an error', async ({ page }) => {
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