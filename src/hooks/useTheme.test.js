// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

// Network calls are stubbed so tests never reach a real server.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve('') })));

// tw:generated useTheme.js
describe('useTheme.js', () => {
  it('loads without throwing', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await expect(import('./useTheme')).resolves.toBeDefined();
  });
});
