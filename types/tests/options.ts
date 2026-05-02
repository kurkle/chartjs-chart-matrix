import { Chart } from 'chart.js'

import { MatrixController, MatrixElement } from '../index.esm'

Chart.register(MatrixController, MatrixElement)

new Chart('test', {
  data: {
    datasets: [
      {
        anchorX: 'center',
        anchorY: 'top',
        borderWidth: 1,
        data: [{ v: 10, x: 1, y: 1 }],
        height: 10,
        hoverBorderWidth: () => 2,
        label: 'Matrix',
        width: 10,
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: 'linear',
      },
    },
  },
  type: 'matrix',
})
