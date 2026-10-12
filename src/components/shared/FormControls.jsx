import React from 'react';

export function Input({ label, id, type = 'text', error, ...props }) {
  return <label className={`form-field ${error ? 'has-error' : ''}`} htmlFor={id}>
    {label && <span className="form-label">{label}</span>}
    <input id={id} type={type} aria-invalid={Boolean(error)} {...props} />
    {error && <small className="field-error">{error}</small>}
  </label>;
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`form-button form-button--${variant} ${className}`} {...props}>{children}</button>;
}

export function Notice({ children, kind = 'info' }) {
  if (!children) return null;
  return <div className={`form-notice form-notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</div>;
}
