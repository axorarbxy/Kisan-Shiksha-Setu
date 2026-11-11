import { expect, test } from "@playwright/test";

test("unauthenticated users return to their requested route after login", async ({
  page,
}) => {
  await page.goto("/mentor");
  await expect(page).toHaveURL(/\/login\?next=%2Fmentor$/);

  await page.getByRole("button", { name: "mentor", exact: true }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/mentor$/);
  await expect(
    page.getByRole("heading", { name: "Mentor dashboard" }),
  ).toBeVisible();

  await page.goto("/admin");
  await expect(
    page.getByRole("heading", {
      name: "This workspace isn’t available to your account",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Go to my workspace" }),
  ).toHaveAttribute("href", "/mentor");

  await page.getByRole("button", { name: "Open user menu" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/mentor");
  await expect(page).toHaveURL(/\/login\?next=%2Fmentor$/);
});

test("registration supports all roles", async ({ browser }) => {
  const cases = [
    { role: "mentor", email: "mentor" },
    { role: "school", email: "school" },
    { role: "admin", email: "admin" },
  ] as const;

  for (const { role, email } of cases) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/register");
    await page.getByRole("radio", { name: new RegExp(role, "i") }).click();
    await page.getByLabel("Your name").fill(`New ${role}`);
    await page.getByLabel("Email", { exact: true }).fill(
      `${email}-${Date.now()}@example.test`,
    );
    await page.getByLabel("Password", { exact: true }).fill("password123");

    if (role === "mentor") {
      await page.getByLabel("College", { exact: true }).fill("Test College");
    } else if (role === "school") {
      await page.getByLabel("School name").fill("Test School");
      await page.getByLabel("Village").fill("Test Village");
      await page.getByLabel("District").fill("Test District");
      await page.getByLabel("Number of students").fill("40");
    } else {
      await page.getByLabel("College name").fill("Test College");
      await page.getByLabel("Designation").fill("Coordinator");
    }

    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await context.close();
  }
});

test("registration maps API field errors to the matching input", async ({
  page,
}) => {
  await page.goto("/register");
  await page.getByRole("radio", { name: /mentor/i }).click();
  await page.getByLabel("Your name").fill("Duplicate Mentor");
  await page.getByLabel("Email", { exact: true }).fill("mentor@kss.test");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("College", { exact: true }).fill("Test College");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(
    page.getByText("This email address is already in use.", { exact: true }),
  ).toBeVisible();
});

test("onboarding progress survives a refresh", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "mentor", exact: true }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/mentor$/);
  await page.goto("/onboarding");

  await page.getByLabel("College", { exact: true }).fill("Saved College");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "RAWE placement" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "RAWE placement" })).toBeVisible();
  await expect(page.getByLabel("College", { exact: true })).toHaveValue("Saved College");
});
