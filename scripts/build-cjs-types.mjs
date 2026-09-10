/**
 * Emits the CommonJS half of the type declarations.
 *
 * `exports.require` serves the UMD bundle under a `.cjs` name, but `tsc` emits
 * only ESM declarations. TypeScript reads a `.d.ts` reached through `require`
 * as ESM and reports the package as masquerading (attw's FalseESM), so the
 * require condition needs its own `.d.cts` tree.
 *
 * A `.d.cts` resolves a relative `./x.cjs` specifier to `./x.d.cts`, so the
 * copies rewrite their own specifiers as they go.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist'

for (const name of readdirSync(dir).filter((f) => f.endsWith('.d.ts'))) {
  const source = readFileSync(join(dir, name), 'utf8')
  const rewritten = source.replace(/(from\s+'\.\/[^']+)\.js'/g, "$1.cjs'")
  writeFileSync(join(dir, name.replace(/\.d\.ts$/, '.d.cts')), rewritten)
}
