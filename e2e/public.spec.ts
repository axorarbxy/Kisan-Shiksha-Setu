import { expect, test } from "./fixtures";

test("landing page presents the pilot and its next steps", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Where fieldwork becomes a classroom.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Join as mentor/i }),
  ).toHaveAttribute("href", "/register?role=mentor");
  await expect(
    page.getByRole("link", { name: /Join as school/i }),
  ).toHaveAttribute("href", "/register?role=school");
});

test("public navigation reaches the program pages", async ({ page }) => {
  await page.goto("/");
  for (const [label, route, heading] of [
    ["How it works", "/how-it-works", "Fieldwork, shared through four simple steps."],
    ["Evidence", "/evidence", "Evidence that shapes our questions."],
    ["Survey", "/survey", "Help us shape the pilot."],
  ] as const) {
    await page.getByRole("link", { name: label, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("evidence page lists all four citations and the abstract-only disclaimer", async ({
  page,
}) => {
  await page.goto("/evidence");
  for (const citation of [
    "Heliyon 11, e42163.",
    "Front. Hum. Dyn. 8:1782307.",
    "Front. Sustain. Food Syst. 10:1814235.",
    "J. Entrepreneurship & Public Policy.",
  ]) {
    await expect(page.getByText(citation, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("Abstract-based summary")).toBeVisible();
});
