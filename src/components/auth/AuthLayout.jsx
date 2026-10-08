import React from "react";

export default function AuthLayout({
  children,
  brand = "Your Brand",
  tagline = "Simple. Modern. Reusable.",
  logo,
  footer,
  className = ""
}) {
  return (
    <main className={`rcui-auth-layout ${className}`}>
      <section className="rcui-auth-brand">
        <div className="rcui-auth-brand-inner">
          {logo ? (
            <img className="rcui-auth-logo" src={logo} alt={brand} />
          ) : (
            <div className="rcui-auth-logo-placeholder">{brand.charAt(0)}</div>
          )}
          <h1>{brand}</h1>
          <p>{tagline}</p>
        </div>
      </section>

      <section className="rcui-auth-content">
        <div className="rcui-auth-card">
          {children}
          {footer && <div className="rcui-auth-footer">{footer}</div>}
        </div>
      </section>
    </main>
  );
}