import { createFixtures } from 'chartjs-test-utils'

const specsFromFixtures = createFixtures({
  configs: {
    ...import.meta.glob('../fixtures/**/*.js', { eager: true, import: 'default' }),
    ...import.meta.glob('../fixtures/**/*.json', { eager: true, import: 'default' }),
  },
  images: import.meta.glob('../fixtures/**/*.png', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
  prefix: '../fixtures/',
})

describe('fixtures', () => {
  describe('anchor', specsFromFixtures('anchor'))
  describe('border', specsFromFixtures('border'))
  describe('scales', specsFromFixtures('scales'))
})
