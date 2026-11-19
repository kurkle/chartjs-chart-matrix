import { Chart, registerables } from 'chart.js'
import * as helpers from 'chart.js/helpers'
import { acquireChart, afterEvent, setup, triggerMouseEvent } from 'chartjs-test-utils'

import 'chartjs-adapter-date-fns'
import '../src/index'

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

// Registers the image matchers and the per-spec chart release, and pins the
// backing store to CSS pixels so the reference PNGs stay comparable whatever
// the host display reports.
setup({ Chart })

// Disable colors plugin for tests.
Chart.defaults.plugins.colors.enabled = false
