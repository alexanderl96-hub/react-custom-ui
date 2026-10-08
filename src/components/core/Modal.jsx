import React, { useEffect } from "react";

export default function Modal({
  open = false,
  title,
  children,
  footer,
  onClose,
  size = "medium"
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (event) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="rcui-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`rcui-modal rcui-modal-${size}`} role="dialog" aria-modal="true">
        <header className="rcui-modal-header">
          <h2>{title}</h2>
          <button className="rcui-icon-button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="rcui-modal-body">{children}</div>
        {footer && <footer className="rcui-modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}