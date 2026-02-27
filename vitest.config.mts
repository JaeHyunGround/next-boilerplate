import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // Mock node-only modules to prevent Vite browser build crashes
      '@mswjs/interceptors/ClientRequest': path.resolve(
        dirname,
        'node_modules/vite/dist/client/env.mjs',
      ),
      '@mswjs/interceptors/XMLHttpRequest': path.resolve(
        dirname,
        'node_modules/vite/dist/client/env.mjs',
      ),
      '@mswjs/interceptors/fetch': path.resolve(
        dirname,
        'node_modules/vite/dist/client/env.mjs',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
          // Provide an empty mock for MSW node imports inside browser tests
          alias: {
            '@/mocks/node': path.resolve(
              dirname,
              '.storybook/mock-msw-node.ts',
            ),
          },
        },
      },
    ],
  },
});
