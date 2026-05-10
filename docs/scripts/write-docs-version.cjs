const fs = require('node:fs')
const path = require('node:path')
function normalizeVersion(version) {
  return version?.replace(/^v/, '') || null
}

const resolvedVersion = normalizeVersion(process.env.DOCS_VERSION) || ''

const escapedVersion = resolvedVersion.replaceAll('\\', '\\\\').replaceAll("'", "\\'")

const target = path.resolve(__dirname, '../src/generated/version.js')

fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, `export const docsVersion = '${escapedVersion}'\n`)

process.stdout.write(`docs version: ${resolvedVersion || '(not set)'}\n`)
