import { Chart, registerables } from 'chart.js'
import * as helpers from 'chart.js/helpers'

import 'chartjs-adapter-date-fns'
import '../src/index'
import { acquireChart, afterEvent, imageMatchers, releaseCharts, triggerMouseEvent } from './utils'

// Karma loaded the UMD bundle, which registers every Chart.js component.
Chart.register(...registerables)
// ...and attaches a couple of legacy v2-style aliases to the Chart class for
// convenience: `helpers` (used by the `scales/time` fixture) and `controllers`
// (used by the "should be registered" spec). Neither exists on the ESM build.
Chart.helpers = helpers
Chart.controllers = Chart.registry.controllers.items

// The fixture configs and specs were written against Karma's global scope.
globalThis.Chart = Chart
globalThis.acquireChart = acquireChart
globalThis.afterEvent = afterEvent
globalThis.triggerMouseEvent = triggerMouseEvent

// Pin the backing store to CSS pixels so the reference PNGs stay comparable
// whatever the host display reports.
Chart.defaults.devicePixelRatio = 1
// Disable colors plugin for tests.
Chart.defaults.plugins.colors.enabled = false

expect.extend(imageMatchers)

afterEach(() => {
  releaseCharts()
})
