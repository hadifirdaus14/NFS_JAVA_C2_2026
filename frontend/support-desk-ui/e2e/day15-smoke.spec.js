import { test, expect } from '@playwright/test';

test('admin can login and create a ticket through the protected UI', async ({ page }) => {
  // Unique title so each run creates a distinct ticket
  const uniqueSuffix = Date.now();
  const ticketTitle = `E2E smoke ticket ${uniqueSuffix}`;

  // 1. Open the login page
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Login to Support Desk' })).toBeVisible();

  // 2. Log in as the seeded admin
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('Admin@12345');
  await page.getByRole('button', { name: 'Login' }).click();

  // 3. Confirm the protected dashboard opened
  await expect(page).toHaveURL(/\/app\/dashboard/);
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

  // 4. Open the Tickets page (nav link)
  await page.getByRole('link', { name: 'Tickets', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/tickets$/);

  // 5. Open the Create Ticket form
  await page.getByRole('link', { name: 'Create Ticket' }).click();
  await expect(page.getByRole('heading', { name: 'Create a new ticket' })).toBeVisible();

  // 6. Fill and submit a valid ticket through the 3-step wizard
  // Step 1 — details
  await page.getByLabel('Title').fill(ticketTitle);
  await page.getByLabel('Description').fill('Created by the Playwright end-to-end smoke test.');
  await page.getByLabel('Category').fill('Testing');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 2 — classification (defaults are valid: priority LOW, status OPEN)
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 3 — review + confirm, then submit
  await page
    .getByLabel('I have reviewed the ticket details and they are ready to submit.')
    .check();
  await page.getByRole('button', { name: 'Create Ticket' }).click();

  // 7. Confirm the success message
  await expect(page.getByText('Ticket created successfully.')).toBeVisible();
});
