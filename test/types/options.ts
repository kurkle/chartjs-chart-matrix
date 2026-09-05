import { Chart } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'

Chart.register(MatrixController, MatrixElement)

new Chart('test', {
  data: {
    datasets: [
      {
        anchorX: 'center',
        anchorY: 'top',
        backgroundColor(context) {
          return context.dataIndex > -1 ? '#000' : '#fff'
        },
        borderWidth: 1,
        data: [{ v: 10, x: 1, y: 1 }],
        height(context) {
          return context.dataIndex > -1 ? 10 : 0
        },
        hoverBorderWidth: () => 2,
        label: 'Matrix',
        width(context) {
          return context.dataIndex > -1 ? 10 : 0
        },
      },
    ],
  },
  options: {
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
    },
  },
  type: 'matrix',
})
