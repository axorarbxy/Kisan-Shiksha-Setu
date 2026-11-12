import { expect, test } from "./fixtures";

test.use({ role: "mentor" });

test("offline observation drafts persist locally, sync, and remain after reload", async ({
  rolePage,
}) => {
  await rolePage.goto("/mentor/experiments/experiment-1");
  await rolePage.getByRole("tab", { name: "Observations" }).click();
  await rolePage.getByLabel("Date").fill("2026-11-15");
  await rolePage.getByLabel("Metric").fill("Soil moisture");
  await rolePage.getByLabel("Value").fill("18");
  await rolePage.getByLabel("Unit (optional)").fill("%");

  await rolePage.context().setOffline(true);
  await rolePage.getByRole("button", { name: "Add observation" }).click();
  await expect(rolePage.getByText("Saved offline, will sync")).toBeVisible();
  await expect
    .poll(() =>
      rolePage.evaluate(() =>
        localStorage.getItem("kss.observation-drafts") ?? "",
      ),
    )
    .toContain('"syncStatus":"queued"');

  await rolePage.context().setOffline(false);
  await expect(rolePage.getByText("Saved offline, will sync")).toHaveCount(0, {
    timeout: 10_000,
  });
  await rolePage.reload();
  await rolePage.getByRole("tab", { name: "Observations" }).click();
  await expect(rolePage.getByText("Soil moisture: 18 %")).toBeVisible();
});
