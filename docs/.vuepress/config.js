const path = require('path');

module.exports = {
    title: 'chartjs-chart-matrix',
    description: 'Chart.js module for creating matrix charts',
    theme: 'chartjs',
    base: '',
    dest: path.resolve(__dirname, '../../dist/docs'),
    head: [
      ['link', {rel: 'icon', href: '/favicon.ico'}],
    ],
    plugins: [
      ['flexsearch'],
      ['redirect', {
        redirectors: [
          // Default sample page when accessing /samples.
          {base: '/samples', alternative: ['basic']},
        ],
      }],
    ],
    chainWebpack(config) {
      config.module
        .rule('chart.js')
        .include.add(path.resolve('node_modules/chart.js')).end()
        .use('babel-loader')
        .loader('babel-loader')
        .options({
          presets: ['@babel/preset-env']
        })
        .end();
    },
    themeConfig: {
      repo: 'kurkle/chartjs-chart-matrix',
      logo: '/favicon.ico',
      lastUpdated: 'Last Updated',
      searchPlaceholder: 'Search...',
      editLinks: false,
      docsDir: 'docs',
      chart: {
        imports: [
          ['scripts/register.js'],
          ['scripts/utils.js', 'Utils'],
          ['scripts/helpers.js', 'helpers'],
        ]
      },
      nav: [
        {text: 'Home', link: '/'},
        {text: 'Samples', link: `/samples/`},
        {
          text: 'Ecosystem',
          ariaLabel: 'Community Menu',
          items: [
            { text: 'Awesome', link: 'https://github.com/chartjs/awesome' },
          ]
        }
      ],
      sidebar: {
        '/samples/': [
          'basic',
          'calendar',
          'category',
          'time',
          'utils'
        ],
        '/': [
          '',
          'integration',
          'usage'
        ],
      }
    }
  };
