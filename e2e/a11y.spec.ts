import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(violations).toEqual([]);
}

test("landing page has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expectNoSeriousA11yViolations(page);
});

test("login page has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/login");
  await expectNoSeriousA11yViolations(page);
});

for (const role of ["mentor", "school", "admin"] as const) {
  test.describe(`${role} dashboard accessibility`, () => {
    test.use({ role });

    test("has no serious or critical violations", async ({ rolePage }) => {
      await rolePage.goto(`/${role}`);
      if (role === "mentor") {
        await expect(rolePage.getByText("Hours this month")).toBeVisible();
      } else if (role === "school") {
        await expect(rolePage.getByText("Asha Patel")).toBeVisible();
      } else {
        await expect(rolePage.getByText("Students on RAWE")).toBeVisible();
      }
      await expectNoSeriousA11yViolations(rolePage);
    });
  });
}
