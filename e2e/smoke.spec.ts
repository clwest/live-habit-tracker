import { test, expect } from "@playwright/test";

test("full signup → create → toggle → delete flow", async ({ page }) => {
  const email = `e2e-${Date.now()}@test.lht`;
  const password = "testpass123";

  // Landing page has both CTAs
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Live Habit Tracker" })).toBeVisible();
  await page.getByRole("link", { name: "Get started" }).click();

  // Signup
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByLabel("Name (optional)").fill("E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/^Password/).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  // Redirected to dashboard after auto-signin
  await page.waitForURL(/\/dashboard$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.getByText("No habits yet")).toBeVisible();

  // Create habit
  await page.getByPlaceholder(/new habit/i).fill("Drink water");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("Drink water")).toBeVisible();
  await expect(page.getByText("0 of 1 done today")).toBeVisible();

  // Toggle done
  await page.getByRole("button", { name: "Mark done" }).click();
  await expect(page.getByText("1 of 1 done today")).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark not done" })).toBeVisible();

  // Untoggle
  await page.getByRole("button", { name: "Mark not done" }).click();
  await expect(page.getByText("0 of 1 done today")).toBeVisible();

  // Delete
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("No habits yet")).toBeVisible();

  // Protected route enforcement: sign out and confirm redirect
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(/\/$/);
  await page.goto("/dashboard");
  await page.waitForURL(/\/signin/);
});
