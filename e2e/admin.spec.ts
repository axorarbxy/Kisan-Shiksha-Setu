import { expect, test } from "./fixtures";

test.use({ role: "admin" });

test("admin filters students, opens a detail sheet, exports CSV, and views insights", async ({
  rolePage,
}) => {
  await rolePage.goto("/admin/students");
  await rolePage.getByLabel("Status").selectOption("active");
  await expect(rolePage).toHaveURL(/status=active/);
  const table = rolePage.getByRole("table");
  await expect(table.getByRole("row").nth(1)).toContainText("Active");
  await expect(table.getByRole("row").nth(1)).not.toContainText("Upcoming");

  await rolePage.getByRole("searchbox", { name: "Search" }).fill("Ravi Kumar");
  await rolePage.getByRole("button", { name: "Ravi Kumar" }).click();
  await expect(rolePage.getByRole("dialog")).toBeVisible();

  const download = rolePage.waitForEvent("download");
  await rolePage.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toBe("kss-rawe-students.csv");

  await rolePage.goto("/admin/insights");
  await rolePage.getByLabel("Metric").selectOption("observations logged");
  await expect(
    rolePage.getByRole("heading", {
      name: "observations logged · program",
    }),
  ).toBeVisible();
  await rolePage.getByLabel("Scope").selectOption("district");
  await expect(
    rolePage.getByRole("heading", {
      name: "observations logged · district",
    }),
  ).toBeVisible();
});
