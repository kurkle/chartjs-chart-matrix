import { DatasetController, UpdateMode } from 'chart.js'
import { AnchorX, AnchorY, MatrixControllerDatasetOptions, MatrixDataPoint } from 'types/index.esm'

import { version } from '../package.json'

import MatrixElement from './element'

export default class MatrixController extends DatasetController<
  'matrix',
  MatrixElement,
  MatrixElement,
  MatrixDataPoint
> {
  static id = 'matrix'
  static version = version

  static defaults = {
    dataElementType: 'matrix',

    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'width', 'height'],
      },
    },
  }

  static overrides = {
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        type: 'linear',
        offset: true,
      },
      y: {
        type: 'linear',
        reverse: true,
      },
    },
  }

  options: MatrixControllerDatasetOptions

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

    for (let i = start; i < start + count; i++) {
      const parsed = !reset && this.getParsed(i)
      const x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x)
      const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y)
      const options = this.resolveDataElementOptions(i, mode)
      const { width, height, anchorX, anchorY } = options
      const properties = {
        x: resolveX(anchorX, x, width),
        y: resolveY(anchorY, y, height),
        width,
        height,
        options,
      }
      this.updateElement(rects[i], i, properties, mode)
    }

    this.updateSharedOptions(sharedOptions, mode, firstOpts)
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
