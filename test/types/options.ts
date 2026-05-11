import type { ChartConfiguration } from 'chart.js'
import type { MatrixDataPoint, MatrixOptions } from 'chartjs-chart-matrix'

import { Chart } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'

Chart.register(MatrixController, MatrixElement)

const matrixDataPoint: MatrixDataPoint = { v: 10, x: 1, y: 1 }

const matrixOptions: Partial<MatrixOptions> = {
  anchorX: 'center',
  anchorY: 'top',
  borderWidth: { bottom: 1, left: 2, right: 2, top: 1 },
  height: 12,
  width: 10,
}

const config: ChartConfiguration<'matrix', MatrixDataPoint[]> = {
  data: {
    datasets: [
      {
        anchorX: 'center',
        anchorY: 'top',
        backgroundColor(context) {
          return context.dataIndex > -1 ? '#000' : '#fff'
        },
        borderWidth: 1,
        data: [matrixDataPoint, { v: 20, x: '2', y: '3' }],
        height(context) {
          return context.dataset.data[context.dataIndex]?.v === 20 ? 20 : 10
        },
        hoverBorderWidth: () => 2,
        label: 'Matrix',
        width(context) {
          return context.dataset.data[context.dataIndex]?.x === '2' ? 20 : 10
        },
      },
    ],
  },
  options: {
    ...matrixOptions,
    plugins: {
      tooltip: {
        callbacks: {
          label(context) {
            const v = context.dataset.data[context.dataIndex]
            return [`x: ${v.x}`, `y: ${v.y}`, `v: ${v.v}`]
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
      },
      y: {
        type: 'category',
      },
    },
  },
  type: 'matrix',
}

new Chart('test', config)
