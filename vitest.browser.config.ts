import { defineBrowserCommand } from '@vitest/browser'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Reference images can only be produced by a real browser, so producing them is
// a mode of this suite rather than a separate tool. `npm run fixtures:update`
// sets the flag and runs Chromium alone, so one browser is the source of truth.
//
// The command is registered only in that mode, and its presence is what the
// suite checks. A flag would have to be passed through `define`, which Vitest
// re-encodes: `JSON.stringify(false)` arrives in the browser as the string
// "false", which is truthy, and every fixture quietly rewrites itself while
// reporting a pass.
const updating = process.env.UPDATE_FIXTURES === '1'

const saveFixtureImage = defineBrowserCommand<[string, string]>((_context, name, dataUrl) => {
  const file = resolve(process.cwd(), 'test/fixtures', `${name}.png`)
  writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'))
  console.log(`updated ${file}`)
})

// The same flags karma.conf.cjs used, so the canvas is rasterized by the CPU
// in both browsers and the pixel fixtures stay comparable.
//
// These belong to the provider, not to an instance. Vitest accepts a `launch`
// or `launchOptions` key on an instance and silently ignores both: verified by
// pointing `executablePath` at a file that does not exist and watching the run
// pass anyway. At provider level the same sabotage fails the run, which is how
// we know these reach Playwright.
const chromiumArgs = [
  '--disable-accelerated-2d-canvas',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
]

const firefoxPrefs = {
  'gfx.canvas.accelerated': false,
  'layers.acceleration.disabled': true,
}

export default defineConfig({
  test: {
    browser: {
      commands: updating ? { saveFixtureImage } : {},
      enabled: true,
      headless: true,
      instances: updating
        ? [{ browser: 'chromium' }]
        : [{ browser: 'chromium' }, { browser: 'firefox' }],
      provider: playwright({
        launchOptions: { args: chromiumArgs, firefoxUserPrefs: firefoxPrefs },
      }),
      screenshotFailures: false,
    },
    // Istanbul, not v8: v8 coverage is collected over the Chrome DevTools
    // Protocol and Vitest refuses it as soon as a non-Chromium instance is
    // configured. Instrumenting the source instead keeps both browsers in one
    // run and merges their results, as rollup-plugin-istanbul did under Karma.
    coverage: {
      exclude: ['**/*.test.ts', 'src/content.config.ts'],
      include: ['src/**/*.ts'],
      provider: 'istanbul',
      reporter: ['text-summary', 'lcov'],
      reportsDirectory: 'coverage/browser',
    },
    globals: true,
    include: ['test/specs/**/*.spec.js'],
    setupFiles: ['test/setup.js'],
  },
})
