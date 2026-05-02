const istanbul = require('rollup-plugin-istanbul')
const env = process.env.NODE_ENV

module.exports = async (karma) => {
  const builds = (await import('./rollup.config.js')).default
  const build = builds[0]
  const buildPlugins = [...build.plugins]

  if (env === 'test') {
    build.plugins.push(istanbul({ exclude: ['node_modules/**/*.js', 'package.json'] }))
  }

  karma.set({
    browsers: ['chrome', 'firefox'],

    customLaunchers: {
      chrome: {
        base: 'Chrome',
        flags: [
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
      },
      firefox: {
        base: 'Firefox',
        prefs: {
          'layers.acceleration.disabled': true,
        },
      },
    },

    customPreprocessors: {
      fixtures: {
        base: 'rollup',
        options: {
          output: {
            format: 'iife',
            name: 'fixture',
          },
        },
      },
      sources: {
        base: 'rollup',
        options: build,
      },
    },

    files: [
      { included: false, pattern: './test/fixtures/**/*.js' },
      { included: false, pattern: './test/fixtures/**/*.png' },
      'node_modules/chart.js/dist/chart.umd.js',
      'node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.js',
      'test/index.js',
      { pattern: 'src/index.ts', type: 'js' },
      { pattern: 'test/specs/**/*.js', type: 'js' },
    ],
    frameworks: ['jasmine'],
    logLevel: karma.LOG_WARN,

    preprocessors: {
      'src/index.ts': ['sources'],
      'test/fixtures/**/*.js': ['fixtures'],
      'test/index.js': ['rollup'],
      'test/specs/**/*.js': ['rollup'],
    },
    reporters: ['spec', 'kjhtml'],

    rollupPreprocessor: {
      external: ['chart.js'],
      output: {
        format: 'umd',
        globals: {
          'chart.js': 'Chart',
        },
        name: 'test',
        sourcemap: karma.autoWatch ? 'inline' : false,
      },
      plugins: buildPlugins,
    },
  })

  if (env === 'test') {
    karma.reporters.push('coverage')
    karma.coverageReporter = {
      dir: 'coverage/',
      reporters: [
        { subdir: 'html', type: 'html' },
        { subdir: (browser) => browser.toLowerCase().split(/[ /-]/)[0], type: 'lcovonly' },
      ],
    }
  }
}
