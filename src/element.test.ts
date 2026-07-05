import MatrixElement from './element'

type MockCanvasContext = Pick<
  CanvasRenderingContext2D,
  'arc' | 'beginPath' | 'lineTo' | 'restore' | 'save'
> & {
  fill: jasmine.Spy
  fillStyle: CanvasRenderingContext2D['fillStyle']
}

function createMockContext(): MockCanvasContext {
  return {
    arc: jasmine.createSpy('arc'),
    beginPath: jasmine.createSpy('beginPath'),
    fill: jasmine.createSpy('fill'),
    fillStyle: '',
    lineTo: jasmine.createSpy('lineTo'),
    restore: jasmine.createSpy('restore'),
    save: jasmine.createSpy('save'),
  }
}

describe('MatrixElement range methods', () => {
  it('should default inRange to the current position', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    const getProps = spyOn(rect, 'getProps').and.callThrough()

    expect(rect.inRange(5, 5)).toBeTrue()
    expect(getProps).toHaveBeenCalledWith(['x', 'y', 'width', 'height'], false)
  })

  it('should default inXRange to the current position', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    const getProps = spyOn(rect, 'getProps').and.callThrough()

    expect(rect.inXRange(5)).toBeTrue()
    expect(getProps).toHaveBeenCalledWith(['x', 'y', 'width', 'height'], false)
  })

  it('should default inYRange to the current position', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    const getProps = spyOn(rect, 'getProps').and.callThrough()

    expect(rect.inYRange(5)).toBeTrue()
    expect(getProps).toHaveBeenCalledWith(['x', 'y', 'width', 'height'], false)
  })
})

describe('MatrixElement drawing and positioning', () => {
  it('should draw a filled rectangle when there is no border', () => {
    const element = new MatrixElement({
      height: 20,
      options: {
        backgroundColor: 'red',
        borderRadius: 0,
        borderWidth: 0,
      },
      width: 20,
      x: 0,
      y: 0,
    })
    const ctx = createMockContext()

    element.draw(ctx as unknown as CanvasRenderingContext2D)

    expect(ctx.fill.calls.count()).toBe(1)
  })

  it('should draw a border with the evenodd fill rule', () => {
    const element = new MatrixElement({
      height: 20,
      options: {
        backgroundColor: 'red',
        borderColor: 'black',
        borderRadius: 0,
        borderWidth: 2,
      },
      width: 20,
      x: 0,
      y: 0,
    })
    const ctx = createMockContext()

    element.draw(ctx as unknown as CanvasRenderingContext2D)

    expect(ctx.fill.calls.count()).toBe(2)
    expect(ctx.fill.calls.argsFor(0)).toEqual([])
    expect(ctx.fill.calls.argsFor(1)).toEqual(['evenodd'])
  })

  it('should return its center point', () => {
    const element = new MatrixElement({ height: 20, width: 30, x: 5, y: 10 })

    expect(element.getCenterPoint()).toEqual({ x: 20, y: 20 })
  })

  it('should use the center point for tooltip position', () => {
    const element = new MatrixElement({ height: 20, width: 30, x: 5, y: 10 })

    expect(element.tooltipPosition()).toEqual({ x: 20, y: 20 })
  })

  it('should return half of the element size as range', () => {
    const element = new MatrixElement({ height: 20, width: 30, x: 0, y: 0 })

    expect(element.getRange('x')).toBe(15)
    expect(element.getRange('y')).toBe(10)
  })
})
