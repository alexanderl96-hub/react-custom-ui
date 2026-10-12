import { describe, it, expect } from 'vitest';

// tw:generated index.js
describe('index.js', () => {
  it('loads without throwing', async () => {
    await expect(import('./index')).resolves.toBeDefined();
  });
});
