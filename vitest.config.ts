import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*.test.ts', 'src/content.config.ts'],
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/unit',
    },
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
