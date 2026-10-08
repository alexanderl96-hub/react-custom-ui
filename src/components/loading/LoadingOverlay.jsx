import React from "react";
import Spinner from "./Spinner";

export default function LoadingOverlay({
  loading = false,
  label = "Loading...",
  children
}) {
  return (
    <div className="rcui-overlay-container">
      {children}
      {loading && (
        <div className="rcui-loading-overlay">
          <Spinner size={38} label={label} />
        </div>
      )}
    </div>
  );
}