const istanbul = require('rollup-plugin-istanbul');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const json = require('@rollup/plugin-json');
const env = process.env.NODE_ENV;

module.exports = async function(karma) {
  const builds = (await import('./rollup.config.js')).default;
  const regex = karma.autoWatch ? /chartjs-chart-matrix\.cjs$/ : /chartjs-chart-matrix\.min\.js$/;
  const build = builds.filter(v => v.output.file && v.output.file.match(regex))[0];

  if (!build) {
    throw new Error('could not find build for output matching ' + regex);
  }

  if (env === 'test') {
    build.plugins = [
      resolve(),
      json(),
      istanbul({exclude: ['node_modules/**/*.js', 'package.json']})
    ];
  }

  karma.set({
    browsers: ['chrome', 'firefox'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'kjhtml'],
    logLevel: karma.LOG_WARN,

    files: [
      {pattern: './test/fixtures/**/*.js', included: false},
      {pattern: './test/fixtures/**/*.png', included: false},
      'node_modules/chart.js/dist/chart.umd.js',
      'node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.js',
      {pattern: 'src/index.js', type: 'js'},
      'test/index.js',
      'test/specs/**/*.js'
    ],

    customLaunchers: {
      chrome: {
        base: 'Chrome',
        flags: [
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      },
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
            name: 'fixture',
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
        {type: 'lcovonly', subdir: (browser) => browser.toLowerCase().split(/[ /-]/)[0]}
      ]
    };
  }
};
