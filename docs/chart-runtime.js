import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { MatrixController, MatrixElement } from '../dist/chartjs-chart-matrix.esm.js'
import { docsVersion } from './src/generated/version.js'
import * as helpers from './scripts/helpers.js'
import * as Utils from './scripts/utils.js'

Chart.register(MatrixController, MatrixElement, zoomPlugin)
Chart.register({
  id: 'version',
  afterDraw(chart) {
    const ctx = chart.ctx
    const versionLabel = docsVersion
      ? `Chart.js v${Chart.version} + chartjs-chart-matrix v${docsVersion}`
      : `Chart.js v${Chart.version}`
    ctx.save()
    ctx.font = '9px monospace'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(versionLabel, chart.chartArea.right - 8, 2)
    ctx.restore()
  },
})

export const globals = { Chart, Utils, helpers }

export function createChart(canvas, config) {
  return new Chart(canvas, config)
}
