import React from "react";

export default function Sidebar({
  open = true,
  title = "Menu",
  children,
  footer,
  className = ""
}) {
  return (
    <aside className={`rcui-sidebar ${open ? "rcui-sidebar-open" : "rcui-sidebar-closed"} ${className}`}>
      <div className="rcui-sidebar-title">{title}</div>
      <nav className="rcui-sidebar-content">{children}</nav>
      {footer && <div className="rcui-sidebar-footer">{footer}</div>}
    </aside>
  );
}