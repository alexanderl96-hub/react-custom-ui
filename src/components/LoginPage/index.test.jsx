// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createElement } from 'react';
import { render, cleanup } from '@testing-library/react';
import { LoginPage, SignUpPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from './index';

afterEach(cleanup);

// Network calls are stubbed so tests never reach a real server.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]), text: () => Promise.resolve('') })));

// tw:generated LoginPage
describe('LoginPage', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(LoginPage, { onSubmit: () => {}, onForgotPassword: () => {}, onSignUp: () => {}, title: 'test', subtitle: 'test' }));
    expect(container).toBeTruthy();
  });
});

// tw:generated SignUpPage
describe('SignUpPage', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(SignUpPage, { onSubmit: () => {}, onLogin: () => {} }));
    expect(container).toBeTruthy();
  });
});

// tw:generated ForgotPasswordPage
describe('ForgotPasswordPage', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(ForgotPasswordPage, { onSubmit: () => {}, onBack: () => {} }));
    expect(container).toBeTruthy();
  });
});

// tw:generated ResetPasswordPage
describe('ResetPasswordPage', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(ResetPasswordPage, { onSubmit: () => {}, onLogin: () => {} }));
    expect(container).toBeTruthy();
  });
});

// tw:generated VerifyEmailPage
describe('VerifyEmailPage', () => {
  it('renders without crashing', () => {
    const { container } = render(createElement(VerifyEmailPage, { onResend: () => {} }));
    expect(container).toBeTruthy();
  });
});
