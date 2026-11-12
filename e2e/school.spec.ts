import { expect, test } from "./fixtures";

test.use({ role: "school" });

test("school can view its experiment and mark a session attended", async ({
  rolePage,
}) => {
  await rolePage.goto("/school");
  await expect(rolePage.getByText("Asha Patel")).toBeVisible();
  await rolePage.goto("/school/experiments/experiment-1");
  await expect(
    rolePage.getByRole("heading", { name: "Kitchen garden diversity 1" }),
  ).toBeVisible();
  await rolePage.getByRole("button", { name: "Mark session attended" }).click();
  await expect(rolePage.getByText("1 session(s) marked attended.")).toBeVisible();
});
