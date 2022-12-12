import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import {readFileSync} from 'fs';

const {author, name, version, homepage, main, module, license} = JSON.parse(readFileSync('./package.json'));

const banner = `/*!
 * ${name} v${version}
 * ${homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} ${author}
 * Released under the ${license} license
 */`;

const input = 'src/index.js';
const inputESM = 'src/index.esm.js';
const external = [
  'chart.js',
  'chart.js/helpers'
];
const globals = {
  'chart.js': 'Chart',
  'chart.js/helpers': 'Chart.helpers'
};

export default [
  {
    input: inputESM,
    output: {
      name,
      file: module,
      banner,
      format: 'esm',
      indent: false,
    },
    plugins: [
      resolve(),
      json(),
    ],
    external
  },
  {
    input,
    output: {
      name,
      file: main,
      banner,
      format: 'umd',
      indent: false,
      globals
    },
    plugins: [
      resolve(),
      json(),
    ],
    external
  },
  {
    input,
    output: {
      name,
      file: main.replace('.cjs', '.min.js'),
      format: 'umd',
      sourcemap: true,
      indent: false,
      globals
    },
    plugins: [
      resolve(),
      json(),
      terser({
        output: {
          preamble: banner
        }
      })
    ],
    external
  },
];
