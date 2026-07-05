import { Chart } from 'chart.js'

describe('controller', () => {
  it('should be registered', () => {
    expect(Chart.controllers.matrix).toBeDefined()
    expect(Chart.registry.getElement('matrix')).toBeDefined()
  })

  it('should skip element updates when scales are missing', () => {
    const chart = window.acquireChart({
      data: {
        datasets: [
          {
            data: [{ x: 1, y: 1 }],
          },
        ],
      },
      options: {
        scales: {
          x: { type: 'linear' },
          y: { type: 'linear' },
        },
      },
      type: 'matrix',
    })
    const meta = chart.getDatasetMeta(0)
    const controller = meta.controller

    meta.xScale = null
    spyOn(controller, 'resolveDataElementOptions')

    expect(() => controller.updateElements(meta.data, 0, meta.data.length, 'default')).not.toThrow()
    expect(controller.resolveDataElementOptions).not.toHaveBeenCalled()
  })

  it('should use scale base pixels in reset mode', () => {
    const chart = window.acquireChart({
      data: {
        datasets: [
          {
            data: [{ x: 1, y: 1 }],
          },
        ],
      },
      options: {
        scales: {
          x: { type: 'linear' },
          y: { type: 'linear' },
        },
      },
      type: 'matrix',
    })
    const meta = chart.getDatasetMeta(0)

    spyOn(meta.xScale, 'getBasePixel').and.callThrough()
    spyOn(meta.yScale, 'getBasePixel').and.callThrough()

    meta.controller.updateElements(meta.data, 0, meta.data.length, 'reset')

    expect(meta.xScale.getBasePixel).toHaveBeenCalled()
    expect(meta.yScale.getBasePixel).toHaveBeenCalled()
  })
})
