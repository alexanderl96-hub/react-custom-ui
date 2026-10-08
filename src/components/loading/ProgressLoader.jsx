import React from "react";

export default function ProgressLoader({
  value = 0,
  label = "",
  showPercentage = true
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="rcui-progress-loader">
      {(label || showPercentage) && (
        <div className="rcui-progress-header">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div className="rcui-progress-track">
        <div className="rcui-progress-bar" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}