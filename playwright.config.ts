import {
  defineConfig,
  devices,
  type ReporterDescription,
} from "@playwright/test";

const ciReporters: ReporterDescription[] = [
  ["junit", { outputFile: "reports/playwright.xml" }],
  ["json", { outputFile: "reports/playwright.json" }],
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  // In CI, one retry turns an intermittent failure into a "flaky" result
  // instead of a red build; scripts/ci-test-insights.mjs reports those.
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ...(process.env.CI ? ciReporters : []),
  ],
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 8080",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
});
