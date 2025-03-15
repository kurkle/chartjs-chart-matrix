import { Element } from 'chart.js'
import { addRoundedRectPath, isObject, toTRBLCorners } from 'chart.js/helpers'

type Bounds = { left: number; top: number; right: number; bottom: number }

function getBounds(rect: Element, useFinalPosition: boolean): Bounds {
  const { x, y, width, height } = rect.getProps(['x', 'y', 'width', 'height'], useFinalPosition)
  return { left: x, top: y, right: x + width, bottom: y + height }
}

function limit(value, min, max) {
  return Math.max(Math.min(value, max), min)
}

function parseBorderWidth(rect, maxW, maxH) {
  const value = rect.options.borderWidth
  let t, r, b, l

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

function boundingRects(rect) {
  const bounds = getBounds(rect, false)
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top
  const border = parseBorderWidth(rect, width / 2, height / 2)

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

function inRange(rect, x, y, useFinalPosition) {
  const skipX = x === null
  const skipY = y === null
  const bounds = !rect || (skipX && skipY) ? false : getBounds(rect, useFinalPosition)

  return (
    bounds && (skipX || (x >= bounds.left && x <= bounds.right)) && (skipY || (y >= bounds.top && y <= bounds.bottom))
  )
}

export default class MatrixElement extends Element {
  static id = 'matrix'

  static override defaults = {
    backgroundColor: undefined,
    borderColor: undefined,
    borderWidth: undefined,
    borderRadius: 0,
    anchorX: 'center',
    anchorY: 'center',
    width: 20,
    height: 20,
  }

  width: number
  height: number

  constructor(cfg) {
    super()

    if (cfg) {
      Object.assign(this, cfg)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const options = this.options
    const { inner, outer } = boundingRects(this)
    const radius = toTRBLCorners(options.borderRadius)

    ctx.save()

    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath()
      addRoundedRectPath(ctx, { x: outer.x, y: outer.y, w: outer.w, h: outer.h, radius })
      addRoundedRectPath(ctx, { x: inner.x, y: inner.y, w: inner.w, h: inner.h, radius })
      ctx.fillStyle = options.backgroundColor
      ctx.fill()
      ctx.fillStyle = options.borderColor
      ctx.fill('evenodd')
    } else {
      ctx.beginPath()
      addRoundedRectPath(ctx, { x: inner.x, y: inner.y, w: inner.w, h: inner.h, radius })
      ctx.fillStyle = options.backgroundColor
      ctx.fill()
    }

    ctx.restore()
  }

  inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean) {
    return inRange(this, mouseX, mouseY, useFinalPosition)
  }

  inXRange(mouseX: number, useFinalPosition?: boolean) {
    return inRange(this, mouseX, null, useFinalPosition)
  }

  inYRange(mouseY: number, useFinalPosition?: boolean) {
    return inRange(this, null, mouseY, useFinalPosition)
  }

  getCenterPoint(useFinalPosition?: boolean) {
    const { x, y, width, height } = this.getProps(['x', 'y', 'width', 'height'], useFinalPosition)
    return {
      x: x + width / 2,
      y: y + height / 2,
    }
  }

  override tooltipPosition() {
    return this.getCenterPoint()
  }

  getRange(axis: 'x' | 'y') {
    return axis === 'x' ? this.width / 2 : this.height / 2
  }
}
