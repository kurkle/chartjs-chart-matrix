const resolve = require('@rollup/plugin-node-resolve')
const swc = require('@rollup/plugin-swc')

module.exports = (karma) => {
  karma.set({
    browsers: ['chromeHeadlessCI'],

    customLaunchers: {
      chromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
      },
    },

    files: [{ pattern: 'test/integration/browser-module/module.spec.js', type: 'js' }],
    frameworks: ['jasmine'],
    logLevel: karma.LOG_WARN,

    preprocessors: {
      'test/integration/browser-module/module.spec.js': ['rollup'],
    },
    reporters: ['spec'],

    rollupPreprocessor: {
      output: {
        format: 'iife',
        name: 'browserModuleIntegrationTest',
        sourcemap: false,
      },
      plugins: [
        resolve.nodeResolve({ extensions: ['.mjs', '.js', '.json'] }),
        swc.default({
          jsc: {
            parser: {
              syntax: 'ecmascript',
            },
            target: 'es2022',
          },
          module: {
            type: 'es6',
          },
          sourceMaps: false,
        }),
      ],
    },

    singleRun: true,
  })
}
