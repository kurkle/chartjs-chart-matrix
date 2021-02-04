const istanbul = require('rollup-plugin-istanbul');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const builds = require('./rollup.config');
const env = process.env.NODE_ENV;

module.exports = function(karma) {
  const build = builds[0];

  if (env === 'test') {
    build.plugins = [
      resolve(),
      istanbul({exclude: ['node_modules/**/*.js', 'package.json']})
    ];
  }

  karma.set({
    browsers: ['firefox'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'kjhtml'],
    logLevel: karma.LOG_WARN,

    files: [
      {pattern: './test/fixtures/**/*.js', included: false},
      {pattern: './test/fixtures/**/*.png', included: false},
      'node_modules/chart.js/dist/chart.js',
      'node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.js',
      'src/index.js',
      'test/index.js',
      'test/specs/**/*.js'
    ],

    // Explicitly disable hardware acceleration to make image
    // diff more stable when ran on Travis and dev machine.
    // https://github.com/chartjs/Chart.js/pull/5629
    customLaunchers: {
      firefox: {
        base: 'Firefox',
        prefs: {
          'layers.acceleration.disabled': true
        }
      }
    },

    preprocessors: {
      'test/index.js': ['rollup'],
      'src/index.js': ['sources']
    },

    rollupPreprocessor: {
      plugins: [
        resolve()
      ],
      output: {
        name: 'test',
        format: 'umd',
        sourcemap: karma.autoWatch ? 'inline' : false
      }
    },

    customPreprocessors: {
      fixtures: {
        base: 'rollup',
        options: {
          output: {
            format: 'iife',
            name: 'fixture'
          }
        }
      },
      sources: {
        base: 'rollup',
        options: build
      }
    }
  });

  if (env === 'test') {
    karma.reporters.push('coverage');
    karma.coverageReporter = {
      dir: 'coverage/',
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'lcovonly', subdir: '.'}
      ]
    };
  }
};
