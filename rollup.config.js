const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('rollup-plugin-terser').terser;
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} license
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

module.exports = [
  {
    input,
    output: {
      name: pkg.name,
      file: pkg.main,
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
      name: pkg.name,
      file: pkg.main.replace('.js', '.min.js'),
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
  {
    input: inputESM,
    output: {
      name: pkg.name,
      file: pkg.module,
      banner,
      format: 'esm',
      indent: false,
    },
    plugins: [
      resolve(),
      json(),
    ],
    external
  }
];
