import { Element } from 'chart.js'
import { addRoundedRectPath, toTRBLCorners } from 'chart.js/helpers'
import { MatrixOptions, MatrixProps } from 'types/index.esm'

import { boundingRects, inRange } from './helpers'

export default class MatrixElement extends Element<MatrixProps, MatrixOptions> {
  static readonly id = 'matrix'

  static override readonly defaults = {
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

  constructor(cfg: MatrixProps) {
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
