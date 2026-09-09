/**
 * Canvas and image helpers for the browser tests.
 *
 * Ported from chartjs-test-utils v0.5.0 (MIT). The Karma file server is gone,
 * so PNGs arrive as Vite asset URLs instead of `/base/test/...` paths.
 */

export function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width
  return canvas
}

export function createImageData(width, height) {
  return createCanvas(width, height).getContext('2d').getImageData(0, 0, width, height)
}

export function canvasFromImageData(data) {
  const canvas = createCanvas(data.width, data.height)
  canvas.getContext('2d').putImageData(data, 0, 0)
  return canvas
}

/** Decode a PNG into ImageData. */
export function readImageData(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = () => reject(new Error(`Failed to load image ${url}`))
    image.onload = () => {
      const { height, width } = image
      const ctx = createCanvas(width, height).getContext('2d')
      ctx.drawImage(image, 0, 0, width, height)
      resolve(ctx.getImageData(0, 0, width, height))
    }
    image.src = url
  })
}
