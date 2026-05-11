import type MatrixElement from './element.js'
import type { MatrixOptions } from './types.js'

import { isObject } from 'chart.js/helpers'

type Bounds = { left: number; top: number; right: number; bottom: number }

function getBounds(element: MatrixElement, useFinalPosition: boolean): Bounds {
  const { x, y, width, height } = element.getProps(['x', 'y', 'width', 'height'], useFinalPosition)
  return { bottom: y + height, left: x, right: x + width, top: y }
}

function limit(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min)
}

export function parseBorderWidth(
  options: Pick<MatrixOptions, 'borderWidth'>,
  maxW: number,
  maxH: number
) {
  const value = options.borderWidth
  let t: number, r: number, b: number, l: number

  if (isObject(value)) {
    t = +(value.top ?? 0) || 0
    r = +(value.right ?? 0) || 0
    b = +(value.bottom ?? 0) || 0
    l = +(value.left ?? 0) || 0
  } else {
    t = r = b = l = +value || 0
  }

  return {
    b: limit(b, 0, maxH),
    l: limit(l, 0, maxW),
    r: limit(r, 0, maxW),
    t: limit(t, 0, maxH),
  }
}

export function boundingRects(element: MatrixElement) {
  const bounds = getBounds(element, false)
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top
  const border = parseBorderWidth(element.options, width / 2, height / 2)

  return {
    inner: {
      h: height - border.t - border.b,
      w: width - border.l - border.r,
      x: bounds.left + border.l,
      y: bounds.top + border.t,
    },
    outer: {
      h: height,
      w: width,
      x: bounds.left,
      y: bounds.top,
    },
  }
}

export function inRange(
  element: MatrixElement | null,
  x: number | null,
  y: number | null,
  useFinalPosition?: boolean
) {
  const skipX = x === null
  const skipY = y === null
  const bounds = !element || (skipX && skipY) ? false : getBounds(element, !!useFinalPosition)

  return (
    bounds &&
    (skipX || (x >= bounds.left && x <= bounds.right)) &&
    (skipY || (y >= bounds.top && y <= bounds.bottom))
  )
}
