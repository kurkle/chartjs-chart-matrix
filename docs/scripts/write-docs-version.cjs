const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

const packageJson = require('../../package.json')

function gitVersion() {
  try {
    return execSync('git describe --tags --exact-match', {
      cwd: path.resolve(__dirname, '../..'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

function normalizeVersion(version) {
  return version?.replace(/^v/, '') || null
}

const resolvedVersion =
  normalizeVersion(process.env.DOCS_VERSION) ||
  normalizeVersion(process.env.CF_PAGES_COMMIT_TAG) ||
  normalizeVersion(gitVersion()) ||
  packageJson.version

const escapedVersion = resolvedVersion.replaceAll('\\', '\\\\').replaceAll("'", "\\'")

const target = path.resolve(__dirname, '../src/generated/version.js')

fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, `export const docsVersion = '${escapedVersion}'\n`)

process.stdout.write(`docs version: ${resolvedVersion}\n`)
