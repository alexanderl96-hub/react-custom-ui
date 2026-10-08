import React from "react";

export default function PulseLoader({ size = 12, count = 3 }) {
  return (
    <div className="rcui-pulse-loader" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          style={{ width: size, height: size, animationDelay: `${index * 0.16}s` }}
        />
      ))}
    </div>
  );
}