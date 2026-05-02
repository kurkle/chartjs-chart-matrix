import type { DefaultThemeConfig, PluginTuple } from 'vuepress/config'

import { defineConfig } from 'vuepress/config'

import path from 'node:path'

export default defineConfig({
  chainWebpack(config) {
    config.module
      .rule('chart.js')
      .include.add(path.resolve('node_modules/chart.js'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: ['@babel/preset-env'],
      })
      .end()
  },
  description: 'Chart.js module for creating matrix charts',
  // base: '',
  dest: path.resolve(__dirname, '../../dist/docs'),
  head: [['link', { href: '/favicon.ico', rel: 'icon' }]],
  plugins: [
    ['flexsearch'],
    [
      'redirect',
      {
        redirectors: [
          // Default sample page when accessing /samples.
          { alternative: ['basic'], base: '/samples' },
        ],
      },
    ],
  ] as PluginTuple[],
  theme: 'chartjs',
  themeConfig: {
    chart: {
      imports: [
        ['scripts/register.js', 'Register'],
        ['scripts/utils.js', 'Utils'],
        ['scripts/helpers.js', 'helpers'],
      ],
    },
    docsDir: 'docs',
    editLinks: false,
    lastUpdated: 'Last Updated',
    logo: '/favicon.ico',
    nav: [
      { link: '/', text: 'Home' },
      { link: `/samples/`, text: 'Samples' },
      {
        ariaLabel: 'Community Menu',
        items: [{ link: 'https://github.com/chartjs/awesome', text: 'Awesome' }],
        text: 'Ecosystem',
      },
    ],
    repo: 'kurkle/chartjs-chart-matrix',
    searchPlaceholder: 'Search...',
    sidebar: {
      '/': ['', 'integration', 'usage'],
      '/samples/': ['basic', 'calendar', 'category', 'time', 'yearweek', 'utils'],
    },
  } as DefaultThemeConfig,
  title: 'chartjs-chart-matrix',
})
