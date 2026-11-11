import { expect, test } from "@playwright/test";
import { migrateDraftState } from "../src/stores/observation-draft-store";
import { migrateOnboardingState } from "../src/stores/onboarding-store";
import { migrateUiState } from "../src/stores/ui-store";

test("MSW serves the API contract for domain endpoints", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Connecting learners with education opportunities.",
    }),
  ).toBeVisible();
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener("controllerchange", () =>
          resolve(),
        );
      });
    }
    return registration.active?.state;
  });

  const responses = await page.evaluate(async () => {
    const base = "http://localhost:8000";
    const call = async (
      url: string,
      method = "GET",
      body?: Record<string, unknown>,
    ) => {
      const response = await fetch(`${base}${url}`, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return { url, status: response.status, body: await response.json() };
    };
    const getUrls = [
      "/auth/me",
      "/mentors?limit=20",
      "/mentors/mentor-1",
      "/schools?limit=20",
      "/schools/school-1",
      "/matches?limit=20",
      "/experiments?limit=20",
      "/experiments/experiment-1",
      "/experiments/experiment-1/observations?limit=20",
      "/insights?scope=program&metric=active%20experiments",
      "/admin/students?limit=20",
      "/placements?limit=20",
    ];
    const gets = await Promise.all(getUrls.map((url) => call(url)));
    const posts = await Promise.all([
      call("/auth/login", "POST", {
        email: "mentor1@kss.example",
        password: "password123",
      }),
      call("/auth/register", "POST", {
        name: "New Mentor",
        email: `new-${Date.now()}@kss.example`,
        password: "password123",
        role: "mentor",
        college: "Test College",
        year: "2",
      }),
      call("/auth/logout", "POST"),
      call("/matches", "POST", {
        mentorId: "mentor-1",
        schoolId: "school-1",
        status: "pending",
        startedAt: "2026-11-01",
      }),
      call("/experiments", "POST", {
        matchId: "match-1",
        title: "Test experiment",
        hypothesis: "This works",
        cropOrTopic: "millet",
        plotType: "family",
        status: "draft",
      }),
      call("/experiments/experiment-1/observations", "POST", {
        date: "2026-11-01",
        metric: "height",
        value: 12,
        unit: "cm",
      }),
      call("/placements", "POST", {
        village: "Test village",
        district: "Test district",
        state: "Test state",
        startDate: "2026-11-01",
        endDate: "2027-01-01",
        status: "upcoming",
      }),
    ]);
    const patches = await Promise.all([
      call("/mentors/mentor-1", "PATCH", { topics: ["soil health"] }),
      call("/matches/match-1", "PATCH", { status: "active" }),
      call("/experiments/experiment-1", "PATCH", { status: "active" }),
      call("/placements/placement-1", "PATCH", { status: "active" }),
    ]);
    const scenarios = await Promise.all([
      call("/schools?scenario=empty"),
      call("/schools?scenario=unprocessable"),
      call("/schools?scenario=server-error"),
      call("/schools?scenario=unauthorized"),
    ]);
    return { gets, posts, patches, scenarios };
  });

  for (const response of responses.gets) {
    expect(response.status, response.url).toBe(
      response.url === "/auth/me" ? 401 : 200,
    );
  }
  for (const response of responses.posts) {
    const expectedStatus =
      response.url === "/auth/logout" || response.url === "/auth/login"
        ? 200
        : 201;
    expect(response.status, response.url).toBe(expectedStatus);
  }
  for (const response of responses.patches) {
    expect(response.status, response.url).toBe(200);
  }
  expect(responses.scenarios.map((response) => response.status)).toEqual([
    200, 422, 500, 401,
  ]);
  expect(responses.scenarios[0]?.body).toMatchObject({ items: [], total: 0 });
});

test("observation creation updates the cache optimistically and rolls back on error", async ({
  page,
}) => {
  await page.goto("/design/data-layer");
  const count = page.getByRole("status");

  await expect(count).toHaveText("Observations: 3");
  await page.getByRole("button", { name: "Add observation" }).click();
  await expect(count).toHaveText("Observations: 4");

  await page.getByRole("button", { name: "Force server error" }).click();
  await expect(count).toHaveText("Observations: 5");
  await expect(count).toHaveText("Observations: 4", { timeout: 10_000 });
  await expect(
    page.getByText("The mock server encountered an error."),
  ).toBeVisible();
});

test("persisted store migrations accept v0 payloads", () => {
  expect(migrateUiState({ sidebarCollapsed: true }, 0)).toEqual({
    sidebarCollapsed: true,
  });
  expect(migrateOnboardingState({ step: 2, data: { school: "A" } }, 0)).toEqual(
    { step: 2, data: { school: "A" } },
  );
  expect(migrateDraftState({ drafts: {} }, 0)).toEqual({ drafts: {} });
});

test("offline observations are queued and sync when connectivity returns", async ({
  page,
}) => {
  await page.goto("/design/data-layer");
  const count = page.getByRole("status");
  await expect(count).toHaveText("Observations: 3");

  await page.context().setOffline(true);
  await page.getByRole("button", { name: "Add observation" }).click();
  await expect(page.getByText("Saved offline, will sync")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("kss.observation-drafts")),
    )
    .toContain('"syncStatus":"queued"');

  await page.context().setOffline(false);
  await expect(count).toHaveText("Observations: 4", { timeout: 10_000 });
  await expect(page.getByText("Saved offline, will sync")).toHaveCount(0);
});
