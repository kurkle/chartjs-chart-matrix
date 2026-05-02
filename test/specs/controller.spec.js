import { Chart } from 'chart.js'

describe('controller', () => {
  it('should be registered', () => {
    expect(Chart.controllers.matrix).toBeDefined()
    expect(Chart.registry.getElement('matrix')).toBeDefined()
  })
})
