import { resolve } from "node:path";
import { test as base, type Page } from "@playwright/test";

export type DemoRole = "mentor" | "school" | "admin";

type Fixtures = {
  role: DemoRole | null;
  rolePage: Page;
};

export const test = base.extend<Fixtures>({
  role: [null, { option: true }],
  storageState: async ({ role }, use) => {
    await use(
      role
        ? resolve(process.cwd(), "e2e", ".auth", `${role}.json`)
        : undefined,
    );
  },
  rolePage: async ({ page }, use) => {
    await use(page);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        const handleControllerChange = () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            handleControllerChange,
          );
          resolve();
        };
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          handleControllerChange,
        );
        if (navigator.serviceWorker.controller) {
          handleControllerChange();
        }
      });
    }

    const response = await fetch("http://localhost:8000/__mock/reset", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Mock API reset failed with status ${response.status}.`);
    }
    localStorage.removeItem("kss.observation-drafts");
  });
});

export { expect };
