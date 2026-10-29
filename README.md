# SauceDemo UI Automation Framework

A UI test automation framework for the [SauceDemo](https://www.saucedemo.com/) e-commerce application, built with Playwright and TypeScript. The project demonstrates structured test automation, reusable page objects, cross-browser execution, and CI using GitHub Actions.

## Project Objectives

- Automate critical e-commerce user journeys.
- Validate login, inventory, cart, and checkout functionality.
- Use the Page Object Model (POM) to organize reusable page interactions.
- Run tests across Chromium, Firefox, and WebKit.
- Execute automated tests through GitHub Actions.
- Capture reports and failure evidence to support troubleshooting.

## Technology Stack

- **Language:** TypeScript
- **Automation:** Playwright Test
- **Runtime:** Node.js
- **Package manager:** npm
- **CI/CD:** GitHub Actions
- **Target application:** SauceDemo

## Project Structure

```text
qa-02-playwright-ui-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── tests/
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── e2e-purchase.spec.ts
│   ├── inventory.spec.ts
│   └── login.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
└── playwright.config.ts
```

Generated reports and test results are created during execution and are not part of the source-code structure.

## Test Coverage

The framework contains 32 UI test cases covering:

| Area | Coverage |
|---|---|
| Login | Successful login, invalid credentials, locked-out account, and empty-field validation |
| Inventory | Product visibility and sorting |
| Cart | Adding and removing items, cart badge, product details, and navigation |
| Checkout | Required-field validation, order overview, totals, completion, and cancellation |
| End-to-end purchase | Complete purchase journeys |

## Page Object Model

The framework separates page interactions from test scenarios.

- `LoginPage.ts` — login form interactions.
- `InventoryPage.ts` — inventory and product interactions.
- `CartPage.ts` — cart item interactions and assertions.
- `CheckoutPage.ts` — checkout form and order-flow interactions.

This separation reduces duplicated locator logic and makes the tests easier to maintain.

## Prerequisites

Install Node.js and npm, then install the project dependencies.

## Setup

Clone the repository and enter the project directory:

```bash
git clone https://github.com/TestimonyAkpunwoke/qa-02-playwright-ui-framework.git
cd qa-02-playwright-ui-framework
npm ci
npx playwright install
```

## Running Tests

Run the complete suite:

```bash
npm test
```

Run tests in a specific browser:

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

Open the HTML report after a test run:

```bash
npm run report
```

## Continuous Integration

GitHub Actions runs the Playwright test suite on pushes and pull requests targeting `main`.

The workflow uses a browser matrix to execute tests in Chromium, Firefox, and WebKit. It installs the required dependencies, runs the browser-specific tests, and uploads available test reports and failure evidence as workflow artifacts.

## Test Evidence and Troubleshooting

The HTML report helps identify passed and failed tests. Playwright can also capture screenshots, videos, and traces according to the project configuration.

Use the reports and captured evidence to investigate failures before changing selectors, assertions, or timeouts.

## Repository

[View the project on GitHub](https://github.com/TestimonyAkpunwoke/qa-02-playwright-ui-framework)

## Project Status

Core UI automation and cross-browser CI have been implemented. Final documentation and project review are in progress.