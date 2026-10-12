import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/layouts.jsx';
import { Input, Button, Notice } from '../shared/FormControls.jsx';

const AUTH_LAYOUTS = ['split', 'minimal', 'glass', 'gradient', 'aurora', 'editorial', 'terminal', 'centered'];

export function LoginPage({ onSubmit, onForgotPassword, onSignUp, layout = 'split', brand = 'formkit', title, subtitle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setMessage(''); setBusy(true);
    try {
      if (onSubmit) await onSubmit({ email, password, remember });
      else setMessage('Demo mode: connect onSubmit to your authentication service.');
    } catch (error) { setMessage(error?.message || 'Unable to sign in. Please try again.'); }
    finally { setBusy(false); }
  }
  return <AuthLayout variant={layout} title={title || 'Welcome back'} subtitle={subtitle || 'Sign in to continue to your account.'}>
    {brand !== 'formkit' && <p className="auth-brand-note">{brand}</p>}
    <form className="auth-form" onSubmit={submit}>
      <Input id="login-email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
      <Input id="login-password" label="Password" type="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
      <div className="auth-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> <span>Remember me</span></label><button type="button" className="inline-link" onClick={onForgotPassword || (() => setMessage('Connect onForgotPassword to open your password recovery flow.'))}>Forgot password?</button></div>
      <Notice>{message}</Notice>
      <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></Button>
    </form>
    <div className="auth-divider"><span>or continue with</span></div>
    <button type="button" className="social-button" onClick={() => setMessage('Connect your OAuth provider to enable Google sign in.')}><span className="google-mark">G</span> Continue with Google</button>
    <p className="auth-switch">New here? <button type="button" className="inline-link" onClick={onSignUp || (() => setMessage('Connect onSignUp to open your registration flow.'))}>Create an account</button></p>
  </AuthLayout>;
}

export function SignUpPage({ onSubmit, layout = 'split', onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' }); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setBusy(true); setMessage(''); try { if (onSubmit) await onSubmit(form); else setMessage('Demo mode: connect onSubmit to your registration service.'); } catch (err) { setMessage(err?.message || 'Unable to create account.'); } finally { setBusy(false); } }
  const change = key => e => setForm(old => ({ ...old, [key]: e.target.value }));
  return <AuthLayout variant={layout} title="Create your account" subtitle="A few details and you're on your way."><form className="auth-form" onSubmit={submit}><Input id="signup-name" label="Full name" autoComplete="name" placeholder="Your name" required value={form.name} onChange={change('name')} /><Input id="signup-email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={change('email')} /><Input id="signup-password" label="Password" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required value={form.password} onChange={change('password')} /><Notice>{message}</Notice><Button disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <span>→</span></Button></form><p className="auth-switch">Already have an account? <button className="inline-link" type="button" onClick={onLogin}>Sign in</button></p></AuthLayout>;
}

export function ForgotPasswordPage({ onSubmit, layout = 'minimal', onBack }) {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState('');
  async function submit(e) { e.preventDefault(); try { if (onSubmit) await onSubmit({ email }); else setMessage('Demo mode: connect onSubmit to send a recovery email.'); } catch (err) { setMessage(err?.message || 'Unable to send recovery email.'); } }
  return <AuthLayout variant={layout} title="Forgot your password?" subtitle="Enter the email address associated with your account."><form className="auth-form" onSubmit={submit}><Input id="forgot-email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} /><Notice>{message}</Notice><Button>Send reset link <span>→</span></Button></form><p className="auth-switch"><button className="inline-link" type="button" onClick={onBack}>← Back to sign in</button></p></AuthLayout>;
}

export function ResetPasswordPage({ onSubmit, layout = 'minimal', onLogin }) {
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState('');
  async function submit(e) { e.preventDefault(); if (password !== confirm) { setMessage('Passwords do not match.'); return; } try { if (onSubmit) await onSubmit({ password }); else setMessage('Demo mode: connect onSubmit to save your new password.'); } catch (err) { setMessage(err?.message || 'Unable to reset password.'); } }
  return <AuthLayout variant={layout} title="Choose a new password" subtitle="Use at least 8 characters for your new password."><form className="auth-form" onSubmit={submit}><Input id="reset-password" label="New password" type="password" minLength={8} autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} /><Input id="reset-confirm" label="Confirm password" type="password" minLength={8} autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /><Notice kind={message.includes('match') ? 'error' : 'info'}>{message}</Notice><Button>Reset password <span>→</span></Button></form><p className="auth-switch"><button className="inline-link" type="button" onClick={onLogin}>Back to sign in</button></p></AuthLayout>;
}

export function VerifyEmailPage({ onResend, layout = 'centered', email = 'you@example.com' }) {
  const [message, setMessage] = useState('');
  return <AuthLayout variant={layout} title="Check your inbox" subtitle={`We sent a verification link to ${email}.`}><div className="verify-art" aria-hidden="true">✉</div><Notice>{message}</Notice><Button type="button" onClick={async () => { try { if (onResend) await onResend({ email }); setMessage('Verification email requested. Check your inbox shortly.'); } catch (e) { setMessage(e?.message || 'Could not resend the email.'); } }}>Resend verification email</Button><p className="auth-switch">Already verified? Return to your app.</p></AuthLayout>;
}

export { AUTH_LAYOUTS };
export default LoginPage;
