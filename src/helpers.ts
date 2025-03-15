import { isObject } from 'chart.js/helpers'
import { MatrixOptions } from 'types/index.esm'

import MatrixElement from './element'

type Bounds = { left: number; top: number; right: number; bottom: number }

function getBounds(element: MatrixElement, useFinalPosition: boolean): Bounds {
  const { x, y, width, height } = element.getProps(['x', 'y', 'width', 'height'], useFinalPosition)
  return { left: x, top: y, right: x + width, bottom: y + height }
}

function limit(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min)
}

export function parseBorderWidth(options: Pick<MatrixOptions, 'borderWidth'>, maxW: number, maxH: number) {
  const value = options.borderWidth
  let t: number, r: number, b: number, l: number

  if (isObject(value)) {
    t = +value.top || 0
    r = +value.right || 0
    b = +value.bottom || 0
    l = +value.left || 0
  } else {
    t = r = b = l = +value || 0
  }

  return {
    t: limit(t, 0, maxH),
    r: limit(r, 0, maxW),
    b: limit(b, 0, maxH),
    l: limit(l, 0, maxW),
  }
}

export function boundingRects(element: MatrixElement) {
  const bounds = getBounds(element, false)
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top
  const border = parseBorderWidth(element.options, width / 2, height / 2)

  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height,
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b,
    },
  }
}

export function inRange(element: MatrixElement, x: number, y: number, useFinalPosition: boolean) {
  const skipX = x === null
  const skipY = y === null
  const bounds = !element || (skipX && skipY) ? false : getBounds(element, useFinalPosition)

  return (
    bounds && (skipX || (x >= bounds.left && x <= bounds.right)) && (skipY || (y >= bounds.top && y <= bounds.bottom))
  )
}
