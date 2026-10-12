import React from 'react';
export function ErrorPage({ code = '404', title = 'Page not found', message = "The page you're looking for may have moved or no longer exists.", actionLabel = 'Go back home', onAction, variant = 'default' }) {
  return <main className={`ui-error ui-error--${variant}`}><div className="ui-error-code">{code}</div><h1>{title}</h1><p>{message}</p>{onAction && <button type="button" onClick={onAction}>{actionLabel} <span>→</span></button>}</main>;
}
export default ErrorPage;
