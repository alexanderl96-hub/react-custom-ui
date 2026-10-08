import React from "react";

export default function NavItem({
  children,
  icon,
  active = false,
  onClick
}) {
  return (
    <button
      className={`rcui-nav-item ${active ? "rcui-nav-item-active" : ""}`}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}