import { expect, test } from "@playwright/test";

test("loads the Kisan Shiksha Setu home page", async ({ page }) => {
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("localhost:8000")) {
      apiRequests.push(request.url());
    }
  });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Where fieldwork becomes a classroom.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Join as mentor/i })).toHaveAttribute(
    "href",
    "/register?role=mentor",
  );
  await expect(page.getByRole("link", { name: /Join as school/i })).toHaveAttribute(
    "href",
    "/register?role=school",
  );
  await expect(page.getByRole("link", { name: /Join as a college/i })).toHaveAttribute(
    "href",
    "/register?role=admin",
  );
  expect(apiRequests).toEqual([]);
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
    ["/how-it-works", "Fieldwork, shared through four simple steps."],
    ["/evidence", "Evidence that shapes our questions."],
    ["/survey", "Help us shape the pilot."],
    ["/login", "Welcome back"],
    ["/register", "Join the pilot"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await expect(page).toHaveTitle(/· Kisan Shiksha Setu$/);
  }
});

test("how-it-works role tabs explain each participant's journey", async ({
  page,
}) => {
  await page.goto("/how-it-works");

  await expect(page.getByRole("heading", { name: "A mentor’s week" })).toBeVisible();
  await page.getByRole("tab", { name: "School" }).click();
  await expect(page.getByRole("heading", { name: "A school’s week" })).toBeVisible();
  await page.getByRole("tab", { name: "College admin" }).click();
  await expect(
    page.getByRole("heading", { name: "A college admin’s week" }),
  ).toBeVisible();
  await expect(page.getByText(/1–3 hours a week alongside RAWE fieldwork/)).toBeVisible();
});

test("registration role cards preselect from role links", async ({ page }) => {
  for (const [role, label] of [
    ["mentor", /Mentor/],
    ["school", /School/],
    ["admin", /College admin/],
  ] as const) {
    await page.goto(`/register?role=${role}`);
    await expect(page.getByRole("radio", { name: label })).toBeChecked();
    await expect(page.getByLabel("Your name")).toBeVisible();
  }
});

test("evidence page includes citations and marks abstract-only summary", async ({
  page,
}) => {
  await page.goto("/evidence");
  await expect(page.getByText(/Heliyon 11, e42163/)).toBeVisible();
  await expect(page.getByText(/Front\. Hum\. Dyn\. 8:1782307/)).toBeVisible();
  await expect(page.getByText(/Front\. Sustain\. Food Syst\. 10:1814235/)).toBeVisible();
  await expect(page.getByText("Abstract-based summary")).toBeVisible();
  await expect(
    page.getByText("Summaries are our own reading of the papers; see originals for full detail."),
  ).toBeVisible();
});

test("survey page shows configured URL instructions and a results placeholder", async ({
  page,
}) => {
  await page.goto("/survey");
  await expect(page.getByText("NEXT_PUBLIC_SURVEY_URL")).toBeVisible();
  await expect(page.getByText("Results chart coming soon")).toBeVisible();
});

test("development role switcher navigates to the selected workspace", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "mentor", exact: true }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/mentor$/);
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
  await page.goto("/login");
  await page.getByRole("button", { name: "mentor", exact: true }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/mentor$/);
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
  await page.goto("/login");
  await page.getByRole("button", { name: "school", exact: true }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/school$/);
  await page.goto("/school/unknown");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to home" }),
  ).toHaveAttribute("href", "/school");
});
