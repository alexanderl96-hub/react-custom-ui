// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, cleanup } from '@testing-library/react';
import { LoadingPage } from './index';

afterEach(cleanup);

// Network calls are stubbed so tests never reach a real server.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve('') })));

// tw:generated LoadingPage
describe('LoadingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(LoadingPage, { onComplete: () => {} }));
    expect(container).toBeTruthy();
  });
});
