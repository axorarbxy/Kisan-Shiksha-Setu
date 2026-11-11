import { expect, test } from "@playwright/test";

test("loads the Kisan Shiksha Setu home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Kisan Shiksha Setu" }),
  ).toBeVisible();
});
