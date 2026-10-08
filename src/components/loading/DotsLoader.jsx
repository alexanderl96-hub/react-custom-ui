import React from "react";

export default function DotsLoader({ size = "medium", label = "" }) {
  return (
    <div className={`rcui-dots-loader rcui-dots-${size}`} role="status" aria-label={label || "Loading"}>
      <span />
      <span />
      <span />
      {label && <span className="rcui-loading-label">{label}</span>}
    </div>
  );
}