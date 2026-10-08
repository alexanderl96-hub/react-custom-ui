import React from "react";

export default function Alert({
  type = "info",
  title,
  children,
  onClose
}) {
  return (
    <div className={`rcui-alert rcui-alert-${type}`} role="alert">
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button className="rcui-alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}