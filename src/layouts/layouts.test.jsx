// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, cleanup } from '@testing-library/react';
import { AuthLayout, MinimalLayout, SplitLayout, GlassLayout, GradientLayout, AuroraLayout, EditorialLayout, TerminalLayout, CenteredCardLayout } from './layouts';

afterEach(cleanup);

// Network calls are stubbed so tests never reach a real server.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve('') })));

// tw:generated AuthLayout
describe('AuthLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(AuthLayout, { children: [] }));
    expect(container).toBeTruthy();
  });
});

// tw:generated MinimalLayout
describe('MinimalLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(MinimalLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated SplitLayout
describe('SplitLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(SplitLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated GlassLayout
describe('GlassLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(GlassLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated GradientLayout
describe('GradientLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(GradientLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated AuroraLayout
describe('AuroraLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(AuroraLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated EditorialLayout
describe('EditorialLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(EditorialLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated TerminalLayout
describe('TerminalLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(TerminalLayout, {}));
    expect(container).toBeTruthy();
  });
});

// tw:generated CenteredCardLayout
describe('CenteredCardLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(CenteredCardLayout, {}));
    expect(container).toBeTruthy();
  });
});
