import React from "react";

export default function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  className = ""
}) {
  return (
    <span
      className={`rcui-skeleton ${className}`}
      aria-hidden="true"
      style={{ width, height, borderRadius: radius }}
    />
  );
}