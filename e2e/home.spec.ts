import { expect, test } from "@playwright/test";

test("loads the Kisan Shiksha Setu home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Connecting learners with education opportunities.",
    }),
  ).toBeVisible();
});

test("shows design tokens in development", async ({ page }) => {
  await page.goto("/design");

  await expect(
    page.getByRole("heading", { name: "Design tokens" }),
  ).toBeVisible();
  await expect(page.getByText("forest-50", { exact: true })).toBeVisible();
  await expect(page.getByText("sand-500")).toBeVisible();
  await expect(page.getByText("purple-600")).toBeVisible();
  await expect(page.getByText("Tempting display sample")).toBeVisible();
  await expect(
    page.getByText("Inter body sample", { exact: false }),
  ).toBeVisible();
});
