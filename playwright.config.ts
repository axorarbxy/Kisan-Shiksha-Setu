import { defineConfig, devices } from "@playwright/test";

const useDevServer = process.env.PLAYWRIGHT_USE_DEV_SERVER === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  timeout: 120_000,
  reporter: [["html", { open: "never" }], ["list"]],
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      testIgnore: /.*\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "mobile",
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 375, height: 812 },
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: useDevServer
      ? "pnpm dev --hostname 0.0.0.0"
      : "pnpm build && pnpm start --hostname 0.0.0.0",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:8000",
      NEXT_PUBLIC_API_MOCKING: "enabled",
      NEXT_PUBLIC_SURVEY_URL: "",
    },
  },
});
