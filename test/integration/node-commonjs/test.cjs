const { Chart } = require('chart.js')

// side-effects
require('chartjs-chart-matrix')

const { createCanvas } = require('@napi-rs/canvas')

const canvas = createCanvas(300, 320)
const ctx = canvas.getContext('2d')

module.exports = new Chart(ctx, {
  type: 'matrix',
})
