import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// The built ESM bundle must not register itself, so this suite deliberately
// runs without test/setup.js.
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
      screenshotFailures: false,
    },
    globals: true,
    include: ['test/integration/browser-module/*.spec.js'],
  },
})
