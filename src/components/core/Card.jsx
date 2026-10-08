import React from "react";

export default function Card({
  title,
  subtitle,
  children,
  footer,
  padding = "medium",
  className = ""
}) {
  return (
    <section className={`rcui-card rcui-card-${padding} ${className}`}>
      {(title || subtitle) && (
        <header className="rcui-card-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}
      <div className="rcui-card-content">{children}</div>
      {footer && <footer className="rcui-card-footer">{footer}</footer>}
    </section>
  );
}