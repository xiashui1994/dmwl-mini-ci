import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'node18',
    ssr: true,
    lib: {
      entry: {
        'dmwl-mini-ci': './lib/index.ts',
        'commands/dmwl-ci': './lib/commands/dmwl-ci.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['miniprogram-ci'],
      output: {
        banner: (chunk) => {
          if (chunk.name === 'commands/dmwl-ci') {
            return '#!/usr/bin/env node'
          }
          return ''
        },
      },
    },
  },
  plugins: [dts({ bundleTypes: true })],
})
