import {DatasetController} from 'chart.js';
import {version} from '../package.json';

export default class MatrixController extends DatasetController {

  static id = 'matrix';
  static version = version;

  static defaults = {
    dataElementType: 'matrix',

    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'width', 'height']
      }
    },
  };

  static overrides = {
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        type: 'linear',
        offset: true
      },
      y: {
        type: 'linear',
        reverse: true
      }
    },
  };

  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }

  update(mode) {
    const me = this;
    const meta = me._cachedMeta;

    me.updateElements(meta.data, 0, meta.data.length, mode);
  }

  updateElements(rects, start, count, mode) {
    const me = this;
    const reset = mode === 'reset';
    const {xScale, yScale} = me._cachedMeta;
    const firstOpts = me.resolveDataElementOptions(start, mode);
    const sharedOptions = me.getSharedOptions(mode, rects[start], firstOpts);

    for (let i = start; i < start + count; i++) {
      const parsed = !reset && me.getParsed(i);
      const x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x);
      const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
      const options = me.resolveDataElementOptions(i, mode);
      const {width, height, anchorX, anchorY} = options;
      const properties = {
        x: resolveX(anchorX, x, width),
        y: resolveY(anchorY, y, height),
        width,
        height,
        options
      };
      me.updateElement(rects[i], i, properties, mode);
    }

    me.updateSharedOptions(sharedOptions, mode);
  }

  draw() {
    const me = this;
    const data = me.getMeta().data || [];
    let i, ilen;

    for (i = 0, ilen = data.length; i < ilen; ++i) {
      data[i].draw(me._ctx);
    }
  }
}

function resolveX(anchorX, x, width) {
  if (anchorX === 'left' || anchorX === 'start') {
    return x;
  }
  if (anchorX === 'right' || anchorX === 'end') {
    return x - width;
  }
  return x - width / 2;
}

function resolveY(anchorY, y, height) {
  if (anchorY === 'top' || anchorY === 'start') {
    return y;
  }
  if (anchorY === 'bottom' || anchorY === 'end') {
    return y - height;
  }
  return y - height / 2;
}
