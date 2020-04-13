const resolve = require('@rollup/plugin-node-resolve');
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()}  ${pkg.author}
 * Released under the ${pkg.license} license
 */`;

 module.exports = [
	{
		input: 'src/index.js',
		output: {
			file: `dist/${pkg.name}.js`,
			banner: banner,
			format: 'umd',
			indent: false,
			globals: {
				'chart.js': 'Chart'
			}
		},
		plugins: [
			resolve()
		],
		external: [
			'chart.js'
		]
	},
	{
		input: 'src/index.js',
		output: {
			file: `dist/${pkg.name}.min.js`,
			format: 'umd',
			indent: false,
			globals: {
				'chart.js': 'Chart'
			}
		},
		plugins: [
			resolve(),
			terser({
				output: {
					preamble: banner
				}
			})
		],
		external: [
			'chart.js'
		]
	 },
	 {
		input: 'src/index.js',
		output: {
			file: `dist/${pkg.name}.esm.js`,
			banner: banner,
			format: 'esm',
			indent: false,
			globals: {
				'chart.js': 'Chart'
			}
		},
		plugins: [
			resolve()
		],
		external: [
			'chart.js'
		]
	},
	{
		input: 'src/index.js',
		output: {
			file: `dist/${pkg.name}.esm.min.js`,
			format: 'esm',
			indent: false,
			globals: {
				'chart.js': 'Chart'
			}
		},
		plugins: [
			resolve(),
			terser({
				output: {
					preamble: banner
				}
			})
		],
		external: [
			'chart.js'
		]
	}
];
