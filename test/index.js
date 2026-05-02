import {
  acquireChart,
  addMatchers,
  afterEvent,
  releaseCharts,
  specsFromFixtures,
  triggerMouseEvent,
} from 'chartjs-test-utils'

window.devicePixelRatio = 1
window.acquireChart = acquireChart
window.afterEvent = afterEvent
window.triggerMouseEvent = triggerMouseEvent

jasmine.fixtures = specsFromFixtures

beforeEach(() => {
  addMatchers()
})

afterEach(() => {
  releaseCharts()
})
