import { specsFromFixtures } from '../utils'

describe('fixtures', () => {
  describe('anchor', specsFromFixtures('anchor'))
  describe('border', specsFromFixtures('border'))
  describe('scales', specsFromFixtures('scales'))
})
