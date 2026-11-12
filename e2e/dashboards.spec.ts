import { expect, test } from "@playwright/test";

async function signInAs(page: import("@playwright/test").Page, role: "mentor" | "school" | "admin") {
  await page.goto("/login");
  await page.getByRole("button", { name: role, exact: true }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${role}$`));
}

test("mentor requests a match, creates an experiment, and logs an observation", async ({
  page,
}) => {
  await signInAs(page, "mentor");

  await page.goto("/mentor/schools");
  await page.getByRole("button", { name: "Request a match" }).first().click();
  const matchDialog = page.getByRole("dialog");
  await expect(matchDialog.getByRole("heading", { name: "Request a school match" })).toBeVisible();
  await matchDialog.getByRole("radio").first().check();
  await matchDialog.getByRole("button", { name: "Send request" }).click();
  await expect(matchDialog).toBeHidden();

  await page.goto("/mentor/experiments");
  await page.getByRole("button", { name: "New experiment" }).click();
  await page.getByLabel("What will you observe?").fill("Village garden growth");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("What do you expect to happen?").fill("Weekly checks will show growth.");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("combobox", { name: "Choose a topic" }).click();
  await page.getByRole("option", { name: "soil health" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("How will you know what happened?").fill("Compare measurements each week.");
  await page.getByRole("button", { name: "Create experiment" }).click();

  await expect(page).toHaveURL(/\/mentor\/experiments\/experiment-/);
  await page.getByRole("tab", { name: "Observations" }).click();
  await page.getByLabel("Date").fill("2026-11-11");
  await page.getByLabel("Metric").fill("Plant height");
  await page.getByLabel("Value").fill("14");
  await page.getByLabel("Unit (optional)").fill("cm");
  await page.context().setOffline(true);
  await page.getByRole("button", { name: "Add observation" }).click();
  await expect(page.getByText("Plant height: 14 cm")).toBeVisible();
  await expect(page.getByText("Saved offline, will sync")).toBeVisible();

  await page.getByRole("tab", { name: "Chart" }).click();
  const chart = page.getByRole("img", { name: "Plant height line chart" });
  await expect(chart).toBeVisible();
  await expect(chart).toContainText("14");

  await page.context().setOffline(false);
  await expect(page.getByText("Saved offline, will sync")).toHaveCount(0, {
    timeout: 10_000,
  });
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Plant height: 14 cm")).toHaveCount(1);

  await page.getByRole("tab", { name: "Observations" }).click();
  await page.getByLabel("Date").fill("2026-11-12");
  await page.getByLabel("Metric").fill("Plant height");
  await page.getByLabel("Value").fill("15");
  await page.getByLabel("Unit (optional)").fill("cm");
  await page.getByRole("button", { name: "Add observation" }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Plant height: 15 cm")).toHaveCount(1);

  await page.getByRole("tab", { name: "Chart" }).click();
  await page.getByRole("button", { name: "View as table" }).click();
  await expect(page.getByRole("table", { name: "Plant height observations over time" })).toBeVisible();
});

test("school can view an experiment, mark attendance, and leave a mentor note", async ({
  page,
}) => {
  await signInAs(page, "school");
  await page.goto("/school/experiments/experiment-1");

  await expect(page.getByRole("heading", { name: "Kitchen garden diversity 1" })).toBeVisible();
  await page.getByRole("button", { name: "Mark session attended" }).click();
  await expect(page.getByText("1 session(s) marked attended.")).toBeVisible();
  await page.getByRole("textbox", { name: "Leave a note for the mentor" }).fill("The class is ready for the next observation.");
  await page.getByRole("button", { name: "Send note" }).click();
  await expect(page.getByText("The class is ready for the next observation.")).toBeVisible();
});

test("admin filters student placements, opens a detail sheet, exports CSV, and views insights", async ({
  page,
}) => {
  await signInAs(page, "admin");
  await page.goto("/admin/students");
  await page.getByRole("searchbox", { name: "Search" }).fill("Asha Patel");
  await page.getByRole("button", { name: "Asha Patel" }).click();
  await expect(page.getByRole("dialog").getByText("Field site 1")).toBeVisible();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toBe("kss-rawe-students.csv");

  await page.goto("/admin/insights");
  await page.getByLabel("Metric").selectOption("observations logged");
  await expect(page.getByRole("heading", { name: "observations logged · program" })).toBeVisible();
  await expect(page.getByText(/Observations are student-collected and indicative/)).toBeVisible();
});

test("dashboard lists and details expose empty and retryable error states", async ({
  page,
}) => {
  await signInAs(page, "admin");
  await page.goto("/admin/schools?scenario=empty");
  await expect(page.getByRole("heading", { name: "No schools yet" })).toBeVisible();

  await page.goto("/admin/schools?scenario=server-error");
  const listError = page.getByRole("alert");
  await expect(listError).toContainText("mock server encountered an error");
  await listError.getByRole("button", { name: "Try again" }).click();
  await expect(listError).toBeVisible();

  await signInAs(page, "school");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/school/experiments/experiment-1?scenario=server-error");
  const detailError = page.getByRole("alert");
  await expect(detailError).toContainText("mock server encountered an error");
  await detailError.getByRole("button", { name: "Try again" }).click();
  await expect(detailError).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
