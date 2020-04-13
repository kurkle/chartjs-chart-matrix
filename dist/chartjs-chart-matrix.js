/*!
 * chartjs-chart-matrix v1.0.0-alpha5
 * https://github.com/kurkle/chartjs-chart-matrix#readme
 * (c) 2020  Jukka Kurkela
 * Released under the MIT license
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = global || self, factory(global.Chart));
}(this, (function (Chart) { 'use strict';

Chart = Chart && Object.prototype.hasOwnProperty.call(Chart, 'default') ? Chart['default'] : Chart;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

/**
 * Helper function to get the bounds of the rect
 * @param {Rectangle} rect the rect
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the rect
 * @private
 */

function getBounds(rect, useFinalPosition) {
  var _rect$getProps = rect.getProps(['x', 'y', 'width', 'height'], useFinalPosition),
      x = _rect$getProps.x,
      y = _rect$getProps.y,
      width = _rect$getProps.width,
      height = _rect$getProps.height;

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

function _inRange(rect, x, y, useFinalPosition) {
  var skipX = x === null;
  var skipY = y === null;
  var bounds = !rect || skipX && skipY ? false : getBounds(rect, useFinalPosition);
  return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom);
}

var Rectangle = /*#__PURE__*/function (_Chart$Element) {
  _inherits(Rectangle, _Chart$Element);

  var _super = _createSuper(Rectangle);

  function Rectangle(cfg) {
    var _this;

    _classCallCheck(this, Rectangle);

    _this = _super.call(this);
    _this.options = undefined;
    _this.width = undefined;
    _this.height = undefined;

    if (cfg) {
      _extends(_assertThisInitialized(_this), cfg);
    }

    return _this;
  }

  _createClass(Rectangle, [{
    key: "draw",
    value: function draw(ctx) {
      var options = this.options;

      var _boundingRects = boundingRects(this),
          inner = _boundingRects.inner,
          outer = _boundingRects.outer;

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
  }, {
    key: "inRange",
    value: function inRange(mouseX, mouseY, useFinalPosition) {
      return _inRange(this, mouseX, mouseY, useFinalPosition);
    }
  }, {
    key: "inXRange",
    value: function inXRange(mouseX, useFinalPosition) {
      return _inRange(this, mouseX, null, useFinalPosition);
    }
  }, {
    key: "inYRange",
    value: function inYRange(mouseY, useFinalPosition) {
      return _inRange(this, null, mouseY, useFinalPosition);
    }
  }, {
    key: "getCenterPoint",
    value: function getCenterPoint(useFinalPosition) {
      var _this$getProps = this.getProps(['x', 'y', 'width', 'height'], useFinalPosition),
          x = _this$getProps.x,
          y = _this$getProps.y,
          width = _this$getProps.width,
          height = _this$getProps.height;

      return {
        x: x + width / 2,
        y: y + height / 2
      };
    }
  }, {
    key: "tooltipPosition",
    value: function tooltipPosition() {
      return this.getCenterPoint();
    }
  }, {
    key: "getRange",
    value: function getRange(axis) {
      return axis === 'x' ? this.width / 2 : this.height / 2;
    }
  }]);

  return Rectangle;
}(Chart.Element);

_defineProperty(Rectangle, "_type", 'rectangle');

var MatrixController = /*#__PURE__*/function (_Chart$DatasetControl) {
  _inherits(MatrixController, _Chart$DatasetControl);

  var _super = _createSuper(MatrixController);

  function MatrixController() {
    _classCallCheck(this, MatrixController);

    return _super.apply(this, arguments);
  }

  _createClass(MatrixController, [{
    key: "update",
    value: function update(mode) {
      var me = this;
      var meta = me._cachedMeta;
      me.updateElements(meta.data, 0, mode);
    }
  }, {
    key: "updateElements",
    value: function updateElements(rects, start, mode) {
      var me = this;
      var reset = mode === 'reset';
      var _me$_cachedMeta = me._cachedMeta,
          xScale = _me$_cachedMeta.xScale,
          yScale = _me$_cachedMeta.yScale;
      var firstOpts = me.resolveDataElementOptions(start, mode);
      var sharedOptions = me.getSharedOptions(mode, rects[start], firstOpts);

      for (var i = 0; i < rects.length; i++) {
        var index = start + i;
        var parsed = !reset && me.getParsed(index);
        var x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x);
        var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
        var options = me.resolveDataElementOptions(i, mode);
        var width = options.width,
            height = options.height;
        var properties = {
          x: x - width / 2,
          y: y - height / 2,
          width: width,
          height: height,
          options: options
        };
        me.updateElement(rects[i], index, properties, mode);
      }

      me.updateSharedOptions(sharedOptions, mode);
    }
  }, {
    key: "draw",
    value: function draw() {
      var me = this;
      var data = me.getMeta().data || [];
      var i, ilen;

      for (i = 0, ilen = data.length; i < ilen; ++i) {
        data[i].draw(me._ctx);
      }
    }
  }]);

  return MatrixController;
}(Chart.DatasetController);
MatrixController.prototype.dataElementType = Rectangle;
MatrixController.prototype.dataElementOptions = ['backgroundColor', 'borderColor', 'borderWidth', 'width', 'height'];

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
    }
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

})));
