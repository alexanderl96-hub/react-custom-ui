// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, cleanup } from '@testing-library/react';
import { Input, Button, Notice } from './FormControls';

afterEach(cleanup);

// Network calls are stubbed so tests never reach a real server.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve('') })));

// tw:generated Input
describe('Input', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(Input, { label: 'test', id: 1, error: 1 }));
    expect(container).toBeTruthy();
  });
});

// tw:generated Button
describe('Button', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(Button, { children: [] }));
    expect(container).toBeTruthy();
  });
});

// tw:generated Notice
describe('Notice', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(Notice, { children: [] }));
    expect(container).toBeTruthy();
  });
});
