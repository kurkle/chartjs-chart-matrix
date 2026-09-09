/**
 * Rewrites the fixture reference images from a real browser render.
 *
 * Regenerating a reference image is never routine: it means accepting that the
 * output changed. Run it deliberately, then read the diff.
 *
 *   npm run fixtures:update
 */
import { spawnSync } from 'node:child_process'

const result = spawnSync(
  'npx',
  ['vitest', 'run', '--config', 'vitest.browser.config.ts', ...process.argv.slice(2)],
  { env: { ...process.env, UPDATE_FIXTURES: '1' }, stdio: 'inherit' }
)

process.exit(result.status ?? 1)
