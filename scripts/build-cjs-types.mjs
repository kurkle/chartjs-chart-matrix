/**
 * Emits the CommonJS half of the type declarations.
 *
 * `exports.require` serves the UMD bundle under a `.cjs` name, but `tsc` emits
 * only ESM declarations. TypeScript reads a `.d.ts` reached through `require`
 * as ESM and reports the package as masquerading (attw's FalseESM), so the
 * require condition needs its own `.d.cts` tree.
 *
 * Three rewrites make that tree compile rather than merely resolve:
 *
 *  1. A `.d.cts` resolves a relative `./x.cjs` specifier to `./x.d.cts`, so the
 *     copies rewrite their own specifiers as they go.
 *
 *  2. Imports from a package whose types are ESM — chart.js — become type-only
 *     and carry `resolution-mode`, or a CommonJS declaration cannot reach them
 *     (TS1479 for a value import, TS1541 for a type-only one). The attribute is
 *     legal here only because the import is type-only: on a value import it
 *     needs `--module` to be esnext, node18, node20, nodenext or preserve, and
 *     `node16` is none of those (TS2823).
 *
 *  3. A `declare module 'chart.js'` augmentation resolves its own specifier in
 *     the enclosing file's mode, and no attribute syntax can override that. The
 *     block is dropped and pulled back in from the ESM twin of the same file,
 *     which resolves it in import mode.
 *
 * Without 2 and 3 the package still passes attw and publint — they check
 * resolution, not compilation — and still fails for a `skipLibCheck: false`
 * consumer.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist'

const typeOnlyPackageImports = (source) =>
  source.replace(
    /import[ \t]+(?:type[ \t]+)?([^;'"]+?)[ \t]+from[ \t]+'([^.'][^']*)'[ \t]*;?/g,
    (_match, clause, specifier) =>
      `import type ${clause} from '${specifier}' with { 'resolution-mode': 'import' };`
  )

const endOfBlock = (source, from) => {
  let depth = 0
  let at = source.indexOf('{', from)

  do {
    depth += source[at] === '{' ? 1 : source[at] === '}' ? -1 : 0
    at += 1
  } while (depth > 0)

  return at
}

const withoutAugmentations = (source) => {
  let result = source
  let removed = false

  for (;;) {
    const start = result.search(/declare module '[^.'][^']*' \{/)
    if (start === -1) {
      return { removed, source: result }
    }

    result = result.slice(0, start) + result.slice(endOfBlock(result, start))
    removed = true
  }
}

for (const name of readdirSync(dir).filter((file) => file.endsWith('.d.ts'))) {
  const relative = readFileSync(join(dir, name), 'utf8').replace(
    /(from\s+'\.\/[^']+)\.js'/g,
    "$1.cjs'"
  )

  const { removed, source } = withoutAugmentations(typeOnlyPackageImports(relative))
  const twin = name.replace(/\.d\.ts$/, '.js')
  const prefix = removed
    ? `import type {} from './${twin}' with { 'resolution-mode': 'import' };\n`
    : ''

  writeFileSync(
    join(dir, name.replace(/\.d\.ts$/, '.d.cts')),
    (prefix + source).replace(/\n{3,}/g, '\n\n')
  )
}
