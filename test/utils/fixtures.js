/**
 * Fixture discovery for the pixel tests.
 *
 * Karma scanned `__karma__.files` and re-read every config through XHR. Vite
 * resolves the same three file types at build time instead: the config module,
 * an optional JSON config and the reference PNG as an asset URL.
 */

import { server } from 'vitest/browser'

import { readImageData } from './canvas.js'
import { acquireChart, releaseChart } from './chart.js'
import { toEqualImageData } from './matchers.js'

const PREFIX = '../fixtures/'

const jsConfigs = import.meta.glob('../fixtures/**/*.js', { eager: true, import: 'default' })
const jsonConfigs = import.meta.glob('../fixtures/**/*.json', { eager: true, import: 'default' })
const images = import.meta.glob('../fixtures/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
})

/** `../fixtures/basic/labels.js` -> `basic/labels` */
function fixtureName(path) {
  return path.slice(PREFIX.length).replace(/\.(js|json|png)$/, '')
}

function collect() {
  const inputs = {}
  const add = (path, key, value) => {
    const name = fixtureName(path)
    inputs[name] = inputs[name] || {}
    inputs[name][key] = value
  }

  for (const [path, config] of Object.entries(jsConfigs)) {
    add(path, 'config', config)
  }
  for (const [path, config] of Object.entries(jsonConfigs)) {
    add(path, 'config', config)
  }
  for (const [path, url] of Object.entries(images)) {
    add(path, 'png', url)
  }
  return inputs
}

const fixtures = collect()

function prepareConfig(name, json) {
  const config = json.config
  config.options = config.options || {}
  // plugins are disabled by default, except if the path contains 'plugin' or
  // there are instance plugins
  if (!name.includes('plugin') && config.plugins === undefined) {
    config.options.plugins = config.options.plugins || false
  }
  return config
}

/**
 * Asserts against the reference image, or rewrites it when updating.
 *
 * The update command exists only when `npm run fixtures:update` registered it,
 * so the normal suite cannot take this path by accident. Even then it rewrites
 * only images that actually changed, so an update is a reviewable diff rather
 * than 62 touched files.
 */
async function compareOrSave(chart, name, inputs, json) {
  const save = server.commands.saveFixtureImage
  const expected = inputs.png ? await readImageData(inputs.png) : undefined

  if (!save) {
    expect(chart).toEqualImageData(expected, json)
    return
  }
  if (expected && toEqualImageData(chart, expected, json).pass) {
    return
  }
  await save(name, chart.ctx.canvas.toDataURL())
}

function specFromFixture(name, inputs) {
  it(name, async () => {
    const json = inputs.config
    if (!json) {
      throw new Error(`Missing config file for fixture ${name}`)
    }
    if (!inputs.png && !server.commands.saveFixtureImage) {
      throw new Error(`Missing PNG comparison file for fixture ${name}`)
    }
    json.description = json.description || name

    const chart = acquireChart(prepareConfig(name, json), json.options)
    try {
      const run = json.options?.run
      if (typeof run === 'function') {
        await run(chart)
      }
      await compareOrSave(chart, name, inputs, json)
    } finally {
      releaseChart(chart)
    }
  })
}

/**
 * Returns a suite body registering one spec per fixture below `path`.
 * @param {string} path - directory under `test/fixtures`, e.g. `basic`
 */
export function specsFromFixtures(path) {
  const names = Object.keys(fixtures)
    .filter((name) => name.startsWith(`${path}/`))
    .sort()

  return () => {
    if (names.length === 0) {
      throw new Error(`No fixtures found under test/fixtures/${path}`)
    }
    for (const name of names) {
      specFromFixture(name, fixtures[name])
    }
  }
}
