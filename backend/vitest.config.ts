import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      include: [
        'src/products/products.controller.ts',
        'src/products/products.service.ts',
        'src/products/http-exception.filter.ts',
        'src/products/repository/products.repository.ts',
        'src/products/dto/product-request.dto.ts',
      ],
      reporter: ['text', 'html'],
    },
  },
});
