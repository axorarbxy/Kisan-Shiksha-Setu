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

test("shows the component library and supports table sorting", async ({
  page,
}) => {
  await page.goto("/design");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "shadcn/ui primitives" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Accent CTA" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Disabled" })).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Shared components" }),
  ).toBeVisible();

  const table = page.getByRole("table").first();
  const mentorHeader = table.getByRole("columnheader", { name: /Mentor/ });

  await expect(table.getByRole("row").nth(1)).toContainText("Asha Patel");
  await expect
    .poll(async () => {
      if ((await mentorHeader.getAttribute("aria-sort")) === "ascending") {
        return "ascending";
      }
      await mentorHeader.getByRole("button").click();
      return mentorHeader.getAttribute("aria-sort");
    })
    .toBe("ascending");
});
