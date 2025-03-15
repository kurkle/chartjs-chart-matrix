import { Chart } from 'chart.js'

describe('controller', function () {
  it('should be registered', function () {
    expect(Chart.controllers.matrix).toBeDefined()
    expect(Chart.registry.getElement('matrix')).toBeDefined()
  })
})
