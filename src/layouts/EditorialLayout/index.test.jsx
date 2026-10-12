import { describe, it, expect } from 'vitest';

// tw:generated index.jsx
describe('index.jsx', () => {
  it('loads without throwing', async () => {
    await expect(import('./index')).resolves.toBeDefined();
  });
});
