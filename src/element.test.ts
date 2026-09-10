import type { Mock } from 'vitest'

import MatrixElement from './element.js'

type MockCanvasContext = Pick<
  CanvasRenderingContext2D,
  'arc' | 'beginPath' | 'lineTo' | 'restore' | 'save'
> & {
  fill: Mock
  fillStyle: CanvasRenderingContext2D['fillStyle']
}

function createMockContext(): MockCanvasContext {
  return {
    arc: vi.fn(),
    beginPath: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    lineTo: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
  }
}

describe('MatrixElement range methods', () => {
  it('should default inRange to the current position', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    const getProps = vi.spyOn(rect, 'getProps')

    expect(rect.inRange(5, 5)).toBe(true)
    expect(getProps).toHaveBeenCalledWith(['x', 'y', 'width', 'height'], false)
  })

  it('should default inXRange to the current position', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    const getProps = vi.spyOn(rect, 'getProps')

    expect(rect.inXRange(5)).toBe(true)
    expect(getProps).toHaveBeenCalledWith(['x', 'y', 'width', 'height'], false)
  })

  it('should default inYRange to the current position', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    const getProps = vi.spyOn(rect, 'getProps')

    expect(rect.inYRange(5)).toBe(true)
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

    expect(ctx.fill.mock.calls).toHaveLength(1)
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

    expect(ctx.fill.mock.calls).toHaveLength(2)
    expect(ctx.fill.mock.calls[0]).toEqual([])
    expect(ctx.fill.mock.calls[1]).toEqual(['evenodd'])
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
