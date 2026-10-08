import React from "react";

export default function Navbar({
  brand = "Brand",
  logo,
  children,
  actions,
  className = ""
}) {
  return (
    <nav className={`rcui-navbar ${className}`}>
      <div className="rcui-navbar-brand">
        {logo && <img src={logo} alt="" />}
        <strong>{brand}</strong>
      </div>
      <div className="rcui-navbar-links">{children}</div>
      <div className="rcui-navbar-actions">{actions}</div>
    </nav>
  );
}