import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 120000,
  testMatch: /.*\.e2e-spec\.ts$/,
  testDir: '.',
  reporter: 'html',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
