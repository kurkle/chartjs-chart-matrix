import { Chart, registerables } from 'chart.js'

import { MatrixController, MatrixElement } from '../../../dist/chartjs-chart-matrix.esm.js'

describe('browser esm integration', () => {
  const getRegisteredController = () => Chart.registry.controllers.items.matrix
  const getRegisteredElement = () => Chart.registry.elements.items.matrix
  let canvas

  afterEach(() => {
    canvas?.remove()
    canvas = null
    Chart.unregister(...registerables)
    Chart.unregister(MatrixController, MatrixElement)
  })

  it('requires explicit registration for the built esm bundle', () => {
    expect(getRegisteredController()).toBeUndefined()
    expect(getRegisteredElement()).toBeUndefined()
  })

  it('imports the built esm bundle and creates a matrix chart after registration', () => {
    Chart.register(...registerables, MatrixController, MatrixElement)

    expect(getRegisteredController()).toBe(MatrixController)
    expect(getRegisteredElement()).toBe(MatrixElement)

    canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 150
    document.body.appendChild(canvas)

    const chart = new Chart(canvas.getContext('2d'), {
      data: {
        datasets: [
          {
            data: [{ v: 1, x: 1, y: 1 }],
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
          },
          y: {
            type: 'linear',
          },
        },
      },
      type: 'matrix',
    })

    expect(chart.config.type).toBe('matrix')
    expect(chart.data.datasets.length).toBe(1)
    expect(chart.data.datasets[0].data.length).toBe(1)
    expect(chart.getDatasetMeta(0).type).toBe('matrix')
    expect(chart.getDatasetMeta(0).controller).toBeTruthy()

    chart.destroy()
  })
})
