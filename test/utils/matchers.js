/**
 * The pixel comparison matcher used by the fixture specs.
 *
 * Ported from chartjs-test-utils v0.5.0 (MIT). Comparison still runs on
 * `getImageData` against a reference PNG through pixelmatch, rather than
 * Vitest's `toMatchScreenshot`, which screenshots the DOM and is sensitive to
 * the device pixel ratio.
 */
import pixelmatch from 'pixelmatch'

import { canvasFromImageData, createImageData } from './canvas.js'

const DEFAULT_THRESHOLD = 0.1
const DEFAULT_TOLERANCE = 0.001

function toPercent(value) {
  return Math.round(value * 10000) / 100
}

function resolveContext(actual) {
  if (actual instanceof CanvasRenderingContext2D) {
    return actual
  }
  if (actual instanceof HTMLCanvasElement) {
    return actual.getContext('2d')
  }
  // A Chart instance; `instanceof Chart` is not available in every project.
  return actual?.ctx instanceof CanvasRenderingContext2D ? actual.ctx : null
}

/**
 * Log the actual, expected and diff images to the browser console, where they
 * can be inspected in the Vitest UI. Replaces the DOM preview Karma appended
 * to its reporter.
 */
function logPreview(description, images) {
  const parts = images.map(({ data }) => canvasFromImageData(data).toDataURL())
  console.log(
    `%c ${description}\n${images.map(({ label }) => label).join(' | ')}\n%c %c %c `,
    'font: 12px monospace',
    ...parts.map((url) => `padding: 128px 128px; background: url(${url}) no-repeat center/contain`)
  )
}

export function toEqualImageData(actual, expected, opts = {}) {
  const ctx = resolveContext(actual)
  if (!ctx) {
    return { message: () => 'Input value is not a valid image source.', pass: false }
  }

  const threshold = opts.threshold === undefined ? DEFAULT_THRESHOLD : opts.threshold
  const tolerance = opts.tolerance === undefined ? DEFAULT_TOLERANCE : opts.tolerance
  // pixelmatch 7.2.0 added a `checkerboard` option and defaulted it to true,
  // changing how semi-transparent pixels are compared -- in a minor release,
  // which a `^7.1.0` range picks up on any lockfile refresh. Every reference
  // PNG here was captured under pixelmatch 5, which blended them against plain
  // white and offered no alternative. Checkerboard blending is a different
  // measurement rather than a stricter one: each goes blind where the ink
  // colour meets the background it is blended against. Default to white, and
  // let a fixture opt into the checkerboard once its reference image has been
  // re-validated against it.
  const checkerboard = opts.checkerboard === true
  const { height, width } = expected
  const actualWidth = ctx.canvas.width
  const actualHeight = ctx.canvas.height

  const actualData = ctx.getImageData(0, 0, actualWidth, actualHeight)
  const diffData = createImageData(width, height)
  const count =
    actualWidth === width && actualHeight === height
      ? pixelmatch(actualData.data, expected.data, diffData.data, width, height, {
          checkerboard,
          threshold,
        })
      : Math.abs(actualWidth * actualHeight - width * height)
  const ratio = count / (width * height)
  const pass = ratio <= tolerance && !opts.debug

  if (!pass) {
    logPreview(opts.description || 'fixture', [
      { data: actualData, label: 'actual' },
      { data: expected, label: 'expected' },
      { data: diffData, label: 'diff' },
    ])
  }

  return {
    message: () =>
      `Expected the rendered canvas to match the reference image.\n` +
      `  Size: ${actualWidth}x${actualHeight}, expected ${width}x${height}\n` +
      `  Difference: ${count}px / ${toPercent(ratio)}%\n` +
      `  Threshold: ${toPercent(threshold)}%, tolerance: ${toPercent(tolerance)}%`,
    pass,
  }
}

export const imageMatchers = { toEqualImageData }
