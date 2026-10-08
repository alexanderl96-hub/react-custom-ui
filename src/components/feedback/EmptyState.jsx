import React from "react";

export default function EmptyState({
  icon = "∅",
  title = "Nothing here yet",
  description = "",
  actionLabel,
  onAction
}) {
  return (
    <div className="rcui-empty-state">
      <div className="rcui-empty-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionLabel && onAction && (
        <button className="rcui-primary-button rcui-small-button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}