import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
  webServer: {
    command: "TURNSTILE_DISABLED=true npm run dev",
    port: 3001,
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
