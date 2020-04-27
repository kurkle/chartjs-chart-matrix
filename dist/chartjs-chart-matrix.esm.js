/*!
 * chartjs-chart-matrix v1.0.0-alpha6
 * https://github.com/kurkle/chartjs-chart-matrix#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT license
 */
import Chart from 'chart.js';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * Helper function to get the bounds of the rect
 * @param {Rectangle} rect the rect
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the rect
 * @private
 */

function getBounds(rect, useFinalPosition) {
  var {
    x,
    y,
    width,
    height
  } = rect.getProps(['x', 'y', 'width', 'height'], useFinalPosition);
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height
  };
}

function limit(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function parseBorderWidth(rect, maxW, maxH) {
  var value = rect.options.borderWidth;
  var t, r, b, l;

  if (Chart.helpers.isObject(value)) {
    t = +value.top || 0;
    r = +value.right || 0;
    b = +value.bottom || 0;
    l = +value.left || 0;
  } else {
    t = r = b = l = +value || 0;
  }

  return {
    t: limit(t, 0, maxH),
    r: limit(r, 0, maxW),
    b: limit(b, 0, maxH),
    l: limit(l, 0, maxW)
  };
}

function boundingRects(rect) {
  var bounds = getBounds(rect);
  var width = bounds.right - bounds.left;
  var height = bounds.bottom - bounds.top;
  var border = parseBorderWidth(rect, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b
    }
  };
}

function inRange(rect, x, y, useFinalPosition) {
  var skipX = x === null;
  var skipY = y === null;
  var bounds = !rect || skipX && skipY ? false : getBounds(rect, useFinalPosition);
  return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom);
}

class Rectangle extends Chart.Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.width = undefined;
    this.height = undefined;

    if (cfg) {
      _extends(this, cfg);
    }
  }

  draw(ctx) {
    var options = this.options;
    var {
      inner,
      outer
    } = boundingRects(this);
    ctx.save();

    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      ctx.rect(outer.x, outer.y, outer.w, outer.h);
      ctx.clip();
      ctx.rect(inner.x, inner.y, inner.w, inner.h);
      ctx.fillStyle = options.backgroundColor;
      ctx.fill();
      ctx.fillStyle = options.borderColor;
      ctx.fill('evenodd');
    } else {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
    }

    ctx.restore();
  }

  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }

  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }

  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }

  getCenterPoint(useFinalPosition) {
    var {
      x,
      y,
      width,
      height
    } = this.getProps(['x', 'y', 'width', 'height'], useFinalPosition);
    return {
      x: x + width / 2,
      y: y + height / 2
    };
  }

  tooltipPosition() {
    return this.getCenterPoint();
  }

  getRange(axis) {
    return axis === 'x' ? this.width / 2 : this.height / 2;
  }

}

_defineProperty(Rectangle, "_type", 'rectangle');

class MatrixController extends Chart.DatasetController {
  update(mode) {
    var me = this;
    var meta = me._cachedMeta;
    me.updateElements(meta.data, 0, mode);
  }

  updateElements(rects, start, mode) {
    var me = this;
    var reset = mode === 'reset';
    var {
      xScale,
      yScale
    } = me._cachedMeta;
    var firstOpts = me.resolveDataElementOptions(start, mode);
    var sharedOptions = me.getSharedOptions(mode, rects[start], firstOpts);

    for (var i = 0; i < rects.length; i++) {
      var index = start + i;
      var parsed = !reset && me.getParsed(index);
      var x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x);
      var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
      var options = me.resolveDataElementOptions(i, mode);
      var {
        width,
        height,
        anchorX,
        anchorY
      } = options;
      var properties = {
        x: anchorX === 'left' ? x : x - width / (anchorX === 'right' ? 1 : 2),
        y: anchorY === 'top' ? y : y - height / (anchorY === 'bottom' ? 1 : 2),
        width,
        height,
        options
      };
      me.updateElement(rects[i], index, properties, mode);
    }

    me.updateSharedOptions(sharedOptions, mode);
  }

  draw() {
    var me = this;
    var data = me.getMeta().data || [];
    var i, ilen;

    for (i = 0, ilen = data.length; i < ilen; ++i) {
      data[i].draw(me._ctx);
    }
  }

}
MatrixController.prototype.dataElementType = Rectangle;
MatrixController.prototype.dataElementOptions = ['backgroundColor', 'borderColor', 'borderWidth', 'anchorX', 'anchorY', 'width', 'height'];

Chart.controllers.matrix = MatrixController;
Chart.defaults.matrix = {
  hover: {
    mode: 'nearest',
    intersect: true
  },
  datasets: {
    animation: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'width', 'height']
      }
    },
    anchorX: 'center',
    anchorY: 'center'
  },
  tooltips: {
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
  elements: {
    rectangle: {
      width: 20,
      height: 20
    }
  }
};
