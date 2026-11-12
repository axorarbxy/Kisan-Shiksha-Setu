import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const roles = ["mentor", "school", "admin"] as const;
const dashboardHeadings = {
  mentor: "Mentor dashboard",
  school: "School dashboard",
  admin: "Program dashboard",
} as const;
const authDirectory = resolve(process.cwd(), "e2e", ".auth");

test("authenticate the demo roles", async ({ browser }) => {
  mkdirSync(authDirectory, { recursive: true });

  for (const role of roles) {
    const context = await browser.newContext({
      baseURL: "http://localhost:3000",
    });
    const page = await context.newPage();
    await page.goto("/login");
    await page.getByRole("button", { name: role, exact: true }).click();
    await page.getByRole("button", { name: "Log in", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${role}$`));
    await expect(
      page.getByRole("heading", {
        name: dashboardHeadings[role],
        exact: true,
      }),
    ).toBeVisible();
    await context.storageState({
      path: resolve(authDirectory, `${role}.json`),
    });
    await context.close();
  }
});
