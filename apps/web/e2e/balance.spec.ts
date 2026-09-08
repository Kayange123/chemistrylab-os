import { expect, test } from '@playwright/test';

// The golden path from the founding brief's §8 user journey, condensed to
// what v0.1 actually implements: open the playground, load a curated
// reaction, balance it, and see the result confirmed on screen.
test('balances hydrogen combustion end to end', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'ChemistryLab OS — Playground' })).toBeVisible();

  await page.getByLabel(/curated reactions/i).selectOption('hydrogen-combustion');
  await expect(page.getByLabel(/^equation$/i)).toHaveValue('H2 + O2 -> H2O');
  await expect(page.getByText('✗ Not balanced')).toBeVisible();

  await page.getByRole('button', { name: /balance automatically/i }).click();

  await expect(page.getByLabel(/^equation$/i)).toHaveValue('2H2 + O2 -> 2H2O');
  await expect(page.getByText('✓ Balanced')).toBeVisible();
});
