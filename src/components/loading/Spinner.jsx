import React from "react";

export default function Spinner({ size = 32, label = "", className = "" }) {
  return (
    <span className={`rcui-spinner-wrap ${className}`} role="status" aria-label={label || "Loading"}>
      <span
        className="rcui-spinner"
        style={{ width: size, height: size }}
      />
      {label && <span className="rcui-spinner-label">{label}</span>}
    </span>
  );
}