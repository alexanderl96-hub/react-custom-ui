import React from 'react';

const layoutClasses = {
  minimal: 'auth-layout auth-layout--minimal',
  split: 'auth-layout auth-layout--split',
  glass: 'auth-layout auth-layout--glass',
  gradient: 'auth-layout auth-layout--gradient',
  aurora: 'auth-layout auth-layout--aurora',
  editorial: 'auth-layout auth-layout--editorial',
  terminal: 'auth-layout auth-layout--terminal',
  centered: 'auth-layout auth-layout--centered',
};

export function AuthLayout({ variant = 'split', children, title = 'Welcome back', subtitle = 'Sign in to continue to your account.' }) {
  const cls = layoutClasses[variant] || layoutClasses.split;
  return <main className={cls}>
    {variant === 'split' && <aside className="auth-promo"><div className="auth-brand-mark">✦</div><span className="auth-kicker">YOUR WORKSPACE, REIMAGINED</span><h2>Make room for<br /><em>what matters.</em></h2><p>A calmer place to focus, create, and move forward.</p><div className="auth-promo-orb" /></aside>}
    <section className="auth-panel"><div className="auth-panel-inner">
      {variant !== 'split' && <a className="auth-brand" href="#home"><span>✦</span> form<span className="auth-brand-light">kit</span></a>}
      <div className="auth-heading"><h1>{title}</h1><p>{subtitle}</p></div>
      {children}
      <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
    </div></section>
  </main>;
}

export const MinimalLayout = (props) => <AuthLayout variant="minimal" {...props} />;
export const SplitLayout = (props) => <AuthLayout variant="split" {...props} />;
export const GlassLayout = (props) => <AuthLayout variant="glass" {...props} />;
export const GradientLayout = (props) => <AuthLayout variant="gradient" {...props} />;
export const AuroraLayout = (props) => <AuthLayout variant="aurora" {...props} />;
export const EditorialLayout = (props) => <AuthLayout variant="editorial" {...props} />;
export const TerminalLayout = (props) => <AuthLayout variant="terminal" {...props} />;
export const CenteredCardLayout = (props) => <AuthLayout variant="centered" {...props} />;
