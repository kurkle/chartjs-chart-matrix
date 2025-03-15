import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { default as swc } from '@rollup/plugin-swc'
import terser from '@rollup/plugin-terser'
import { readFileSync } from 'fs'
import cleanup from 'rollup-plugin-cleanup'

const { author, homepage, license, main, module, name, version } = JSON.parse(readFileSync('./package.json'))

const banner = `/*!
 * ${name} v${version}
 * ${homepage}
 * (c) ${new Date(process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()).getFullYear()} ${author}
 * Released under the ${license} license
 */`

const input = 'src/index.ts'
const inputESM = 'src/index.esm.ts'
const external = ['chart.js', 'chart.js/helpers']
const globals = {
  'chart.js': 'Chart',
  'chart.js/helpers': 'Chart.helpers',
}

const plugins = (minify) => [
  json(),
  resolve({ extensions: ['.ts', '.mjs', '.js', '.json'] }),
  swc({
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      target: 'es2022',
    },
    module: {
      type: 'es6',
    },
    sourceMaps: true,
  }),
  minify
    ? terser({
        output: { preamble: banner },
      })
    : cleanup({ comments: ['some', /__PURE__/] }),
]

export default [
  {
    input,
    output: {
      name,
      file: main,
      banner,
      format: 'umd',
      indent: false,
      globals,
    },
    plugins: plugins(),
    external,
  },
  {
    input,
    output: {
      name,
      file: main.replace('.cjs', '.min.js'),
      format: 'umd',
      sourcemap: true,
      indent: false,
      globals,
    },
    plugins: plugins(true),
    external,
  },
  {
    input: inputESM,
    output: {
      name,
      file: module,
      banner,
      format: 'esm',
      indent: false,
    },
    plugins: plugins(),
    external,
  },
]
