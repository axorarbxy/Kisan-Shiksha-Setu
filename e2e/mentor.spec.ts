import { expect, test } from "./fixtures";

test.use({ role: "mentor" });

test("mentor can request a school match", async ({ rolePage }) => {
  await rolePage.goto("/mentor/schools");
  await rolePage.getByRole("button", { name: "Request a match" }).first().click();

  const dialog = rolePage.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Request a school match" }),
  ).toBeVisible();
  await dialog.getByRole("radio").first().check();
  await dialog.getByRole("button", { name: "Send request" }).click();
  await expect(dialog).toBeHidden();
});
