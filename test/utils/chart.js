/**
 * Chart acquisition and event helpers for the browser tests.
 *
 * Ported from chartjs-test-utils v0.5.0 (MIT), minus the Karma and Jasmine
 * coupling: `pending()` became a thrown skip and the charts registry is
 * released from a Vitest `afterEach` instead of a Jasmine one.
 */
import { spritingOff, spritingOn } from './sprite.js'

// Every chart acquired by a spec, so they can all be released afterwards.
const charts = {}

function applyAttributes(node, attributes) {
  for (const key of Object.keys(attributes)) {
    node.setAttribute(key, attributes[key])
  }
}

/**
 * Injects a new canvas (and div wrapper) and creates the associated Chart
 * instance using the given config.
 * @param {object} [config] - Chart config.
 * @param {object} [options] - Chart acquisition options.
 * @param {object} [options.canvas] - Canvas attributes.
 * @param {object} [options.wrapper] - Canvas wrapper attributes.
 * @param {boolean} [options.spriteText] - Draw text from a bitmap sprite sheet.
 * @param {boolean} [options.persistent] - Keep the chart after the spec.
 */
function buildChart(config = {}, options = {}) {
  const wrapper = document.createElement('div')
  const canvas = document.createElement('canvas')

  applyAttributes(canvas, options.canvas || { height: 512, width: 512 })
  applyAttributes(wrapper, options.wrapper || { class: 'chartjs-wrapper' })

  // by default, remove chart animation and auto resize
  config.options = config.options || {}
  config.options.animation =
    config.options.animation === undefined ? false : config.options.animation
  config.options.responsive =
    config.options.responsive === undefined ? false : config.options.responsive
  config.options.locale = config.options.locale || 'en-US'

  wrapper.appendChild(canvas)
  document.body.appendChild(wrapper)

  let chart
  try {
    const ctx = canvas.getContext('2d')
    if (options.spriteText) {
      spritingOn(ctx)
    }
    chart = new Chart(ctx, config)
  } catch (e) {
    document.body.removeChild(wrapper)
    throw e
  }

  chart.$test = { persistent: options.persistent, wrapper }
  return chart
}

function destroyChart(chart) {
  spritingOff(chart.ctx)
  chart.destroy()

  const wrapper = chart.$test?.wrapper
  wrapper?.parentNode?.removeChild(wrapper)
}

export function acquireChart(config, options) {
  const chart = buildChart(config, options)
  charts[chart.id] = chart
  return chart
}

export function releaseChart(chart) {
  destroyChart(chart)
  delete charts[chart.id]
}

export function releaseCharts() {
  for (const id of Object.keys(charts)) {
    const chart = charts[id]
    if (!chart.$test?.persistent) {
      destroyChart(chart)
    }
    delete charts[id]
  }
}

/** Run `callback` once the chart has handled an event of the given type. */
export function afterEvent(chart, type, callback) {
  const override = chart._eventHandler
  chart._eventHandler = function (event) {
    override.call(this, event)
    if (event.type === type || (event.native && event.native.type === type)) {
      chart._eventHandler = override
      callback()
    }
  }
}

export function waitForResize(chart, callback) {
  const override = chart.resize
  chart.resize = function (...args) {
    chart.resize = override
    override.apply(this, args)
    callback()
  }
}

function resolveElementPoint(el) {
  if (el) {
    if (typeof el.getCenterPoint === 'function') {
      return el.getCenterPoint()
    }
    if (el.x !== undefined && el.y !== undefined) {
      return el
    }
  }
  return { x: 0, y: 0 }
}

/** Dispatch a mouse event at an element's position and await its handling. */
export async function triggerMouseEvent(chart, type, el) {
  const node = chart.canvas
  const rect = node.getBoundingClientRect()
  const point = resolveElementPoint(el)
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + point.x,
    clientY: rect.top + point.y,
    view: window,
  })

  const handled = new Promise((resolve) => afterEvent(chart, type, resolve))
  node.dispatchEvent(event)
  await handled

  return event
}
