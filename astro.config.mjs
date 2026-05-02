import mdx from '@astrojs/mdx'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    starlight({
      customCss: ['docs/styles/starlight.css'],
      description: 'Chart.js module for creating matrix charts',
      favicon: '/favicon.ico',
      head: [
        {
          attrs: { href: '/favicon-96x96.png', rel: 'icon', sizes: '96x96', type: 'image/png' },
          tag: 'link',
        },
        {
          attrs: { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
          tag: 'link',
        },
        {
          attrs: { href: '/favicon.ico', rel: 'shortcut icon' },
          tag: 'link',
        },
        {
          attrs: { href: '/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180' },
          tag: 'link',
        },
        {
          attrs: { href: '/site.webmanifest', rel: 'manifest' },
          tag: 'link',
        },
      ],
      sidebar: [
        {
          items: [
            { label: 'Getting Started', link: '/' },
            { label: 'Integration', link: '/integration/' },
            { label: 'Usage', link: '/usage/' },
          ],
          label: 'Guide',
        },
        {
          items: [
            { label: 'Basic', link: '/samples/basic/' },
            { label: 'Calendar', link: '/samples/calendar/' },
            { label: 'Category', link: '/samples/category/' },
            { label: 'Time', link: '/samples/time/' },
            { label: 'Utils', link: '/samples/utils/' },
            { label: 'Year Week', link: '/samples/yearweek/' },
          ],
          label: 'Samples',
        },
        {
          items: [
            {
              attrs: { rel: 'noopener noreferrer', target: '_blank' },
              label: 'Awesome Chart.js',
              link: 'https://github.com/chartjs/awesome',
            },
            {
              label: 'chartjs-chart-sankey',
              link: 'https://github.com/kurkle/chartjs-chart-sankey',
            },
            {
              label: 'chartjs-chart-treemap',
              link: 'https://chartjs-chart-treemap.pages.dev/',
            },
            {
              label: 'chartjs-plugin-autocolors',
              link: 'https://github.com/kurkle/chartjs-plugin-autocolors',
            },
            {
              label: 'chartjs-plugin-gradient',
              link: 'https://github.com/kurkle/chartjs-plugin-gradient',
            },
          ],
          label: 'Ecosystem',
        },
      ],
      social: [
        { href: 'https://github.com/kurkle/chartjs-chart-matrix', icon: 'github', label: 'GitHub' },
      ],
      title: 'chartjs-chart-matrix',
    }),
    mdx(),
  ],
  outDir: './dist/docs',
  publicDir: './docs/public',
  site: 'https://chartjs-chart-matrix.pages.dev',
})
