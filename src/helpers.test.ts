import MatrixElement from './element'
import { boundingRects, inRange, parseBorderWidth } from './helpers'

describe('parseBorderWidth', () => {
  it('should return uniform border width when given a number', () => {
    const result = parseBorderWidth({ borderWidth: 5 }, 10, 10)
    expect(result).toEqual({ t: 5, r: 5, b: 5, l: 5 })
  })

  it('should return individual border widths when given an object', () => {
    const borderWidth = { top: 2, right: 4, bottom: 6, left: 8 }
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ t: 2, r: 4, b: 6, l: 8 })
  })

  it('should apply limits on border width', () => {
    const borderWidth = { top: 15, right: 20, bottom: 25, left: 30 }
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ t: 10, r: 10, b: 10, l: 10 })
  })

  it('should handle missing object properties as zero', () => {
    const borderWidth = { top: 3, right: undefined, bottom: null, left: 7 }
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ t: 3, r: 0, b: 0, l: 7 })
  })

  it('should return zero when borderWidth is undefined', () => {
    const result = parseBorderWidth({ borderWidth: undefined }, 10, 10)
    expect(result).toEqual({ t: 0, r: 0, b: 0, l: 0 })
  })

  it('should return zero when borderWidth is null', () => {
    const result = parseBorderWidth({ borderWidth: null }, 10, 10)
    expect(result).toEqual({ t: 0, r: 0, b: 0, l: 0 })
  })

  it('should return zero when borderWidth is NaN', () => {
    const result = parseBorderWidth({ borderWidth: NaN }, 10, 10)
    expect(result).toEqual({ t: 0, r: 0, b: 0, l: 0 })
  })

  it('should coerce string numbers to actual numbers', () => {
    const borderWidth = { top: '2', right: '4', bottom: '6', left: '8' }
    // @ts-expect-error types don't allow strings in borderwidth
    const result = parseBorderWidth({ borderWidth }, 10, 10)
    expect(result).toEqual({ t: 2, r: 4, b: 6, l: 8 })
  })
})

describe('inRange', () => {
  it('should return false if rect is null', () => {
    expect(inRange(null, 5, 5, false)).toBeFalse()
  })

  it('should return false if both x and y are null', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, null, null, false)).toBeFalse()
  })

  it('should return true if x and y are within bounds', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, 5, 5, false)).toBeTrue()
  })

  it('should return false if x is out of bounds', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, 15, 5, false)).toBeFalse()
  })

  it('should return false if y is out of bounds', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, 5, 15, false)).toBeFalse()
  })

  it('should return true if x is null (ignores x check)', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, null, 5, false)).toBeTrue()
  })

  it('should return true if y is null (ignores y check)', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, 5, null, false)).toBeTrue()
  })

  it('should return true if x and y are on the boundary', () => {
    const rect = new MatrixElement({ x: 0, width: 10, y: 0, height: 10 })
    expect(inRange(rect, 0, 0, false)).toBeTrue()
    expect(inRange(rect, 10, 10, false)).toBeTrue()
  })
})

describe('boundingRects', () => {
  it('should return correct outer and inner bounding rectangles', () => {
    const element = new MatrixElement({
      x: 10,
      width: 20,
      y: 20,
      height: 30,
      options: { borderWidth: { top: 2, right: 3, bottom: 4, left: 5 } },
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ x: 10, y: 20, w: 20, h: 30 })
    expect(result.inner).toEqual({ x: 15, y: 22, w: 12, h: 24 })
  })

  it('should handle uniform numeric border width', () => {
    const element = new MatrixElement({ x: 0, width: 20, y: 0, height: 20, options: { borderWidth: 3 } })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ x: 0, y: 0, w: 20, h: 20 })
    expect(result.inner).toEqual({ x: 3, y: 3, w: 14, h: 14 })
  })

  it('should handle missing border width as zero', () => {
    const element = new MatrixElement({ x: 5, width: 20, y: 10, height: 30, options: { borderWidth: undefined } })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ x: 5, y: 10, w: 20, h: 30 })
    expect(result.inner).toEqual({ x: 5, y: 10, w: 20, h: 30 })
  })

  it('should handle partially defined border width', () => {
    const element = new MatrixElement({
      x: 10,
      width: 30,
      y: 15,
      height: 30,
      options: { borderWidth: { top: 2, left: 4 } },
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ x: 10, y: 15, w: 30, h: 30 })
    expect(result.inner).toEqual({ x: 14, y: 17, w: 26, h: 28 })
  })

  it('should return the same inner and outer bounds if border width exceeds half size', () => {
    const element = new MatrixElement({
      x: 0,
      width: 10,
      y: 0,
      height: 10,
      options: { borderWidth: { top: 10, right: 10, bottom: 10, left: 10 } },
    })

    const result = boundingRects(element)
    expect(result.outer).toEqual({ x: 0, y: 0, w: 10, h: 10 })
    expect(result.inner).toEqual({ x: 5, y: 5, w: 0, h: 0 })
  })
})
