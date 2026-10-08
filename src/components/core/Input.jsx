import React from "react";

export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}) {
  const inputId = id || `rcui-input-${Math.random().toString(36).slice(2)}`;

  return (
    <label className={`rcui-input-field ${className}`} htmlFor={inputId}>
      {label && <span className="rcui-input-label">{label}</span>}
      <input id={inputId} className={error ? "rcui-input-error" : ""} {...props} />
      {error ? (
        <span className="rcui-input-message rcui-input-message-error">{error}</span>
      ) : hint ? (
        <span className="rcui-input-message">{hint}</span>
      ) : null}
    </label>
  );
}