import MatrixElement from './element'
import { boundingRects, inRange, parseBorderWidth } from './helpers'

describe('parseBorderWidth', () => {
  it('should return uniform border width when given a number', () => {
    const result = parseBorderWidth({ borderWidth: 5 }, 10, 10)
    expect(result).toEqual({ b: 5, l: 5, r: 5, t: 5 })
  })

  it('should return individual border widths when given an object', () => {
    const borderWidth = { bottom: 6, left: 8, right: 4, top: 2 }
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ b: 6, l: 8, r: 4, t: 2 })
  })

  it('should apply limits on border width', () => {
    const borderWidth = { bottom: 25, left: 30, right: 20, top: 15 }
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ b: 10, l: 10, r: 10, t: 10 })
  })

  it('should handle missing object properties as zero', () => {
    const borderWidth = { bottom: null, left: 7, right: undefined, top: 3 }
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ b: 0, l: 7, r: 0, t: 3 })
  })

  it('should return zero when borderWidth is undefined', () => {
    const result = parseBorderWidth({ borderWidth: undefined }, 10, 10)
    expect(result).toEqual({ b: 0, l: 0, r: 0, t: 0 })
  })

  it('should return zero when borderWidth is null', () => {
    const result = parseBorderWidth({ borderWidth: null }, 10, 10)
    expect(result).toEqual({ b: 0, l: 0, r: 0, t: 0 })
  })

  it('should return zero when borderWidth is NaN', () => {
    const result = parseBorderWidth({ borderWidth: NaN }, 10, 10)
    expect(result).toEqual({ b: 0, l: 0, r: 0, t: 0 })
  })

  it('should coerce string numbers to actual numbers', () => {
    const borderWidth = { bottom: '6', left: '8', right: '4', top: '2' }
    // @ts-expect-error types don't allow strings in borderwidth
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ b: 6, l: 8, r: 4, t: 2 })
  })
})

describe('inRange', () => {
  it('should return false if rect is null', () => {
    expect(inRange(null, 5, 5, false)).toBeFalse()
  })

  it('should return false if both x and y are null', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, null, null, false)).toBeFalse()
  })

  it('should return true if x and y are within bounds', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, 5, 5, false)).toBeTrue()
  })

  it('should return false if x is out of bounds', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, 15, 5, false)).toBeFalse()
  })

  it('should return false if y is out of bounds', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, 5, 15, false)).toBeFalse()
  })

  it('should return true if x is null (ignores x check)', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, null, 5, false)).toBeTrue()
  })

  it('should return true if y is null (ignores y check)', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, 5, null, false)).toBeTrue()
  })

  it('should return true if x and y are on the boundary', () => {
    const rect = new MatrixElement({ height: 10, width: 10, x: 0, y: 0 })
    expect(inRange(rect, 0, 0, false)).toBeTrue()
    expect(inRange(rect, 10, 10, false)).toBeTrue()
  })
})

describe('boundingRects', () => {
  it('should return correct outer and inner bounding rectangles', () => {
    const element = new MatrixElement({
      height: 30,
      options: { borderWidth: { bottom: 4, left: 5, right: 3, top: 2 } },
      width: 20,
      x: 10,
      y: 20,
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ h: 30, w: 20, x: 10, y: 20 })
    expect(result.inner).toEqual({ h: 24, w: 12, x: 15, y: 22 })
  })

  it('should handle uniform numeric border width', () => {
    const element = new MatrixElement({
      height: 20,
      options: { borderWidth: 3 },
      width: 20,
      x: 0,
      y: 0,
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ h: 20, w: 20, x: 0, y: 0 })
    expect(result.inner).toEqual({ h: 14, w: 14, x: 3, y: 3 })
  })

  it('should handle missing border width as zero', () => {
    const element = new MatrixElement({
      height: 30,
      options: { borderWidth: undefined },
      width: 20,
      x: 5,
      y: 10,
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ h: 30, w: 20, x: 5, y: 10 })
    expect(result.inner).toEqual({ h: 30, w: 20, x: 5, y: 10 })
  })

  it('should handle partially defined border width', () => {
    const element = new MatrixElement({
      height: 30,
      options: { borderWidth: { left: 4, top: 2 } },
      width: 30,
      x: 10,
      y: 15,
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ h: 30, w: 30, x: 10, y: 15 })
    expect(result.inner).toEqual({ h: 28, w: 26, x: 14, y: 17 })
  })

  it('should return the same inner and outer bounds if border width exceeds half size', () => {
    const element = new MatrixElement({
      height: 10,
      options: { borderWidth: { bottom: 10, left: 10, right: 10, top: 10 } },
      width: 10,
      x: 0,
      y: 0,
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ h: 10, w: 10, x: 0, y: 0 })
    expect(result.inner).toEqual({ h: 0, w: 0, x: 5, y: 5 })
  })
})
