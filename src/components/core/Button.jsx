import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`rcui-button rcui-button-${variant} rcui-button-${size} ${fullWidth ? "rcui-button-full" : ""} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <span className="rcui-button-loading"><span className="rcui-mini-spinner" /> Loading...</span> : children}
    </button>
  );
}