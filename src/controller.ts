import type {
  UpdateMode,
} from 'chart.js'
import type MatrixElement from './element.js'
import type {
  AnchorX,
  AnchorY,
  MatrixControllerDatasetOptions,
  MatrixParsedDataPoint,
} from './types.js'

import { DatasetController } from 'chart.js'

import pkg from '../package.json' with { type: "json" }

export default class MatrixController extends DatasetController<
  'matrix',
  MatrixElement,
  MatrixElement,
  MatrixParsedDataPoint
> {
  static readonly id = 'matrix'
  static readonly version = pkg.version

  static readonly defaults = {
    animations: {
      numbers: {
        properties: ['x', 'y', 'width', 'height'],
        type: 'number',
      },
    },
    dataElementType: 'matrix',
  }

  static readonly overrides = {
    interaction: {
      intersect: true,
      mode: 'nearest',
    },
    scales: {
      x: {
        offset: true,
        type: 'linear',
      },
      y: {
        reverse: true,
        type: 'linear',
      },
    },
  }

  declare options: MatrixControllerDatasetOptions

  override initialize() {
    this.enableOptionSharing = true
    super.initialize()
  }

  override update(mode: UpdateMode) {
    const meta = this._cachedMeta

    this.updateElements(meta.data, 0, meta.data.length, mode)
  }

  override updateElements(rects: MatrixElement[], start: number, count: number, mode: UpdateMode) {
    const reset = mode === 'reset'
    const { xScale, yScale } = this._cachedMeta
    const firstOpts = this.resolveDataElementOptions(start, mode)
    const sharedOptions = this.getSharedOptions(firstOpts)

    if (!xScale || !yScale) {
      return
    }

    for (let i = start; i < start + count; i++) {
      const parsed = this.getParsed(i) as MatrixParsedDataPoint
      const x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x)
      const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y)
      const options = this.resolveDataElementOptions(i, mode)
      const { width, height, anchorX, anchorY } = options
      const properties = {
        height,
        options,
        width,
        x: resolveX(anchorX, x, width),
        y: resolveY(anchorY, y, height),
      }
      this.updateElement(rects[i], i, properties, mode)
    }

    if (sharedOptions) {
      this.updateSharedOptions(sharedOptions, mode, firstOpts)
    }
  }

  override draw() {
    const ctx = this.chart.ctx
    const data = this.getMeta().data || []
    let i: number, ilen: number

    for (i = 0, ilen = data.length; i < ilen; ++i) {
      data[i].draw(ctx)
    }
  }
}

function resolveX(anchorX: AnchorX, x: number, width: number) {
  if (anchorX === 'left' || anchorX === 'start') {
    return x
  }
  if (anchorX === 'right' || anchorX === 'end') {
    return x - width
  }
  return x - width / 2
}

function resolveY(anchorY: AnchorY, y: number, height: number) {
  if (anchorY === 'top' || anchorY === 'start') {
    return y
  }
  if (anchorY === 'bottom' || anchorY === 'end') {
    return y - height
  }
  return y - height / 2
}
