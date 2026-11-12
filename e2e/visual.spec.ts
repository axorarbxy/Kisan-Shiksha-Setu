import { expect, test } from "./fixtures";

test("landing hero visual smoke", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Where fieldwork becomes a classroom.",
    }),
  ).toBeVisible();
  await expect(page.locator("main section").first()).toHaveScreenshot(
    "landing-hero.png",
    { animations: "disabled" },
  );
});

test.describe("mentor dashboard", () => {
  test.use({ role: "mentor" });

  test("visual smoke", async ({ rolePage }) => {
    await rolePage.goto("/mentor");
    await expect(
      rolePage.getByRole("heading", { name: "Mentor dashboard" }),
    ).toBeVisible();
    await expect(rolePage.getByText("Hours this month")).toBeVisible();
    await expect(rolePage.locator("main")).toHaveScreenshot(
      "mentor-dashboard.png",
      { animations: "disabled" },
    );
  });
});
