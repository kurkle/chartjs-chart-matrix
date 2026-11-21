/**
 * Rewrites the fixture reference images from a real browser render.
 *
 * Regenerating a reference image is never routine: it means accepting that the
 * output changed. Run it deliberately, then read the diff.
 *
 *   npm run fixtures:update
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

// Run vitest's own CLI with this Node binary instead of looking `npx` up on PATH.
const pkg = createRequire(import.meta.url).resolve('vitest/package.json')
const vitest = join(dirname(pkg), 'vitest.mjs')

const result = spawnSync(
  process.execPath,
  [vitest, 'run', '--config', 'vitest.browser.config.ts', ...process.argv.slice(2)],
  { env: { ...process.env, UPDATE_FIXTURES: '1' }, stdio: 'inherit' }
)

process.exit(result.status ?? 1)
