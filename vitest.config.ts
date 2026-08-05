import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    include: ['channels/elektrotechnik/**/*.test.ts'],
  },
});
