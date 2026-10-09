import React from "react";

/**
 * Presentation-only wrapper for authentication screens.
 * Supported layouts: split (default), minimal, glass, gradient, aurora, editorial, terminal, centered.
 * Keep authentication state and API calls in the consuming application.
 */
export default function AuthLayout({
  children,
  brand = "Your Brand",
  tagline = "Simple. Modern. Reusable.",
  logo,
  footer,
  layout = "split",
  eyebrow = "WELCOME BACK",
  illustration,
  className = ""
}) {
  const supported = ["split", "minimal", "glass", "gradient", "aurora", "editorial", "terminal", "centered"];
  const selectedLayout = supported.includes(layout) ? layout : "split";
  const hasSidePanel = selectedLayout === "split" || selectedLayout === "editorial";

  const brandMark = logo ? (
    <img className="rcui-auth-logo" src={logo} alt={`${brand} logo`} />
  ) : (
    <div className="rcui-auth-logo-placeholder" aria-hidden="true">{brand.trim().charAt(0).toUpperCase() || "R"}</div>
  );

  return (
    <main className={`rcui-auth-layout rcui-layout-${selectedLayout} ${className}`.trim()} data-layout={selectedLayout}>
      {hasSidePanel && (
        <section className="rcui-auth-brand">
          <div className="rcui-auth-brand-inner">
            {brandMark}
            <span className="rcui-layout-eyebrow">{eyebrow}</span>
            <h1>{brand}</h1>
            <p>{tagline}</p>
            {illustration && <img className="rcui-auth-illustration" src={illustration} alt="" />}
            {!illustration && selectedLayout === "editorial" && (
              <div className="rcui-editorial-art" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
            )}
          </div>
        </section>
      )}
      <section className="rcui-auth-content">
        {!hasSidePanel && selectedLayout !== "terminal" && (
          <header className="rcui-auth-top-brand">
            {brandMark}<span>{brand}</span>
          </header>
        )}
        <div className="rcui-auth-card">
          {selectedLayout === "terminal" && <div className="rcui-terminal-bar" aria-hidden="true"><i /><i /><i /><span>{brand.toLowerCase().replace(/\s+/g, "-")}</span></div>}
          {children}
          {footer && <div className="rcui-auth-footer">{footer}</div>}
        </div>
        {selectedLayout === "terminal" && <div className="rcui-terminal-caption">SECURE ACCESS // AUTHENTICATION PORTAL</div>}
      </section>
    </main>
  );
}
