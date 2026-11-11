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

test("renders public, auth, and role-aware application routes", async ({
  page,
}) => {
  const routes = [
    ["/how-it-works", "How it works"],
    ["/evidence", "Evidence"],
    ["/survey", "Survey"],
    ["/login", "Welcome back"],
    ["/register", "Join the pilot"],
    ["/mentor", "Mentor dashboard"],
    ["/mentor/placement", "Placement"],
    ["/mentor/schools", "Matched schools"],
    ["/mentor/experiments", "Experiments"],
    ["/mentor/experiments/demo", "Experiment demo"],
    ["/school", "School dashboard"],
    ["/school/mentors", "Mentors"],
    ["/school/experiments", "Experiments"],
    ["/school/experiments/demo", "Experiment demo"],
    ["/admin", "Admin dashboard"],
    ["/admin/students", "RAWE students"],
    ["/admin/schools", "Schools"],
    ["/admin/insights", "Insights"],
    ["/settings", "Settings"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await expect(page).toHaveTitle(/· Kisan Shiksha Setu$/);
  }
});

test("development role switcher navigates to the selected workspace", async ({
  page,
}) => {
  await page.goto("/mentor");
  await page.waitForLoadState("networkidle");
  await page.getByRole("combobox", { name: "Switch development role" }).click();
  await page.getByRole("option", { name: "School" }).click();

  await expect(page).toHaveURL(/\/school$/);
  await expect(
    page.getByRole("heading", { name: "School dashboard" }),
  ).toBeVisible();
  await expect(page.getByText("School", { exact: true }).first()).toBeVisible();

  await page.waitForLoadState("networkidle");
  await page.getByRole("combobox", { name: "Switch development role" }).click();
  await page.getByRole("option", { name: "Admin" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("link", { name: "RAWE students" })).toBeVisible();
});

test("application navigation opens and works in the mobile drawer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/mentor");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Toggle navigation" }).click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: "Matched schools" }).click();

  await expect(page).toHaveURL(/\/mentor\/schools$/);
  await expect(
    page.getByRole("heading", { name: "Matched schools" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= 375),
    )
    .toBe(true);
});

test("not-found action returns to the current role home", async ({ page }) => {
  await page.goto("/school/unknown");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to home" }),
  ).toHaveAttribute("href", "/school");
});
