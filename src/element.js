import {Element} from 'chart.js';
import {isObject, addRoundedRectPath, toTRBLCorners} from 'chart.js/helpers';

/**
 * Helper function to get the bounds of the rect
 * @param {MatrixElement} rect the rect
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the rect
 * @private
 */
function getBounds(rect, useFinalPosition) {
  const {x, y, width, height} = rect.getProps(['x', 'y', 'width', 'height'], useFinalPosition);
  return {left: x, top: y, right: x + width, bottom: y + height};
}

function limit(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function parseBorderWidth(rect, maxW, maxH) {
  const value = rect.options.borderWidth;
  let t, r, b, l;

  if (isObject(value)) {
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
  const bounds = getBounds(rect);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const border = parseBorderWidth(rect, width / 2, height / 2);

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
  const skipX = x === null;
  const skipY = y === null;
  const bounds = !rect || (skipX && skipY) ? false : getBounds(rect, useFinalPosition);

  return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

export default class MatrixElement extends Element {
  constructor(cfg) {
    super();

    this.options = undefined;
    this.width = undefined;
    this.height = undefined;

    if (cfg) {
      Object.assign(this, cfg);
    }
  }

  draw(ctx) {
    const options = this.options;
    const {inner, outer} = boundingRects(this);
    const radius = toTRBLCorners(options.borderRadius);

    ctx.save();

    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      addRoundedRectPath(ctx, {x: outer.x, y: outer.y, w: outer.w, h: outer.h, radius});
      addRoundedRectPath(ctx, {x: inner.x, y: inner.y, w: inner.w, h: inner.h, radius});
      ctx.fillStyle = options.backgroundColor;
      ctx.fill();
      ctx.fillStyle = options.borderColor;
      ctx.fill('evenodd');
    } else {
      ctx.beginPath();
      addRoundedRectPath(ctx, {x: inner.x, y: inner.y, w: inner.w, h: inner.h, radius});
      ctx.fillStyle = options.backgroundColor;
      ctx.fill();
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
    const {x, y, width, height} = this.getProps(['x', 'y', 'width', 'height'], useFinalPosition);
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

MatrixElement.id = 'matrix';
MatrixElement.defaults = {
  backgroundColor: undefined,
  borderColor: undefined,
  borderWidth: undefined,
  borderRadius: 0,
  anchorX: undefined,
  anchorY: undefined,
  width: 20,
  height: 20
};
