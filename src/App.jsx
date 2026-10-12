import React, { useState } from 'react';
import { LoginPage, SignUpPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, ErrorPage, AUTH_LAYOUTS } from './index.js';
import { useTheme } from './hooks/useTheme.js';
import { LoadingDemo } from '../examples/LoadingDemo.jsx';
import { LoadingPage, LOADING_LAYOUTS } from './components/LoadingPage/index.jsx';
import './themes/ui-kit.css';
import './styles.css';

export default function App() {
  const [section, setSection] = useState('login'); const [layout, setLayout] = useState('split'); const { theme, toggleTheme } = useTheme();
  const nav = [['combined', 'Login + Loading'], ['login', 'Login'], ['signup', 'Sign up'], ['forgot', 'Forgot password'], ['reset', 'Reset password'], ['verify', 'Verify email'], ['loading', 'Loading pages'], ['error', 'Error page']];
  return <div className="kit-demo-shell" data-theme={theme}>
    <header className="kit-demo-header"><a className="kit-demo-brand" href="#home"><span>✦</span> react-ui-kit</a><div className="kit-demo-controls"><label>Auth layout <select value={layout} onChange={e => setLayout(e.target.value)}>{AUTH_LAYOUTS.map(name => <option value={name} key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>)}</select></label><button type="button" onClick={toggleTheme}>{theme === 'light' ? '☾ Dark mode' : '☼ Light mode'}</button></div></header>
    <nav className="kit-demo-tabs" aria-label="Component examples">{nav.map(([id, label]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}>{label}</button>)}</nav>
    <div className="kit-demo-content">{section === 'combined' && <CombinedPreview layout={layout} onLayoutChange={setLayout} onSignUp={() => setSection('signup')} onForgotPassword={() => setSection('forgot')} />}
    {section === 'login' && <LoginPage layout={layout} onSubmit={async data => { console.info('Example login payload:', { ...data, password: '[redacted]' }); }} onSignUp={() => setSection('signup')} onForgotPassword={() => setSection('forgot')} />}{section === 'signup' && <SignUpPage layout={layout} onLogin={() => setSection('login')} />}{section === 'forgot' && <ForgotPasswordPage layout={layout} onBack={() => setSection('login')} />}{section === 'reset' && <ResetPasswordPage layout={layout} onLogin={() => setSection('login')} />}{section === 'verify' && <VerifyEmailPage layout={layout} />}{section === 'loading' && <LoadingDemo />}{section === 'error' && <ErrorPage onAction={() => setSection('login')} />}</div>
    <footer className="kit-demo-footer">Reusable components, not an application backend. Wire the callbacks to your own auth/API.</footer>
  </div>;
}


function CombinedPreview({ layout, onLayoutChange, onSignUp, onForgotPassword }) {
  const [loadingLayout, setLoadingLayout] = useState('gradient');
  const [restartKey, setRestartKey] = useState(0);
  return <main className="combined-preview layered-combined-preview">
    <div className="combined-heading">
      <div><span className="combined-eyebrow">LAYERED AUTH EXPERIENCE</span><h1>Login in front. Loading in the background.</h1><p>Switch the foreground login layout and the background loading style independently to preview how they work together.</p></div>
      <div className="layered-preview-controls">
        <label className="combined-loading-select">Background loading layout<select value={loadingLayout} onChange={e => { setLoadingLayout(e.target.value); setRestartKey(v => v + 1); }}>{LOADING_LAYOUTS.map(name => <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>)}</select></label>
        <label className="combined-loading-select">Foreground login layout<select value={layout} onChange={e => onLayoutChange(e.target.value)}>{AUTH_LAYOUTS.map(name => <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>)}</select></label>
      </div>
    </div>
    <section className={`layered-demo-scene layered-bg-${loadingLayout}`} aria-label="Combined login and loading preview">
      <div className="layered-scene-decoration" aria-hidden="true" />
      <div className="layered-loading-backdrop" data-layout={loadingLayout}>
        <LoadingPage key={restartKey} layout={loadingLayout} duration={5000} title="Preparing your workspace" subtitle="Getting your account ready." onComplete={() => console.info('Background loading preview completed.')} />
      </div>
      <div className="layered-scene-label"><span className="layered-live-dot" /> BACKGROUND · {loadingLayout.toUpperCase()} LOADING</div>
      <div className="layered-login-foreground">
        <div className="layered-login-label">FOREGROUND · {layout.toUpperCase()} LOGIN</div>
        <LoginPage layout={layout} onSubmit={async data => console.info('Example login payload:', { ...data, password: '[redacted]' })} onSignUp={onSignUp} onForgotPassword={onForgotPassword} />
      </div>
      <button className="layered-restart-button" type="button" onClick={() => setRestartKey(v => v + 1)}>↻ Restart background loading</button>
    </section>
    <p className="layered-helper">Use the two layout selectors above to mix and match styles. The loading animation runs for 5 seconds; restart it any time.</p>
  </main>;
}
