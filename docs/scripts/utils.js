import { valueOrDefault } from 'chart.js/helpers'

// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
var _seed = Date.now()

export function srand(seed) {
  _seed = seed
}

export function rand(min, max) {
  min = valueOrDefault(min, 0)
  max = valueOrDefault(max, 0)
  _seed = (_seed * 9301 + 49297) % 233280
  return min + (_seed / 233280) * (max - min)
}

export function numbers(config) {
  var cfg = config || {}
  var min = valueOrDefault(cfg.min, 0)
  var max = valueOrDefault(cfg.max, 100)
  var from = valueOrDefault(cfg.from, [])
  var count = valueOrDefault(cfg.count, 8)
  var decimals = valueOrDefault(cfg.decimals, 8)
  var continuity = valueOrDefault(cfg.continuity, 1)
  var dfactor = Math.pow(10, decimals) || 0
  var data = []
  var i, value

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + this.rand(min, max)
    if (this.rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor)
    } else {
      data.push(null)
    }
  }

  return data
}

export function isoDayOfWeek(dt) {
  let wd = dt.getDay() // 0..6, from sunday
  wd = ((wd + 6) % 7) + 1 // 1..7 from monday
  return '' + wd // string so it gets parsed
}

export function startOfToday() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}
