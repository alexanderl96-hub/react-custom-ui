import React from "react";
import Spinner from "./Spinner";

export default function LoadingScreen({
  title = "Loading",
  subtitle = "Please wait...",
  logo,
  spinnerSize = 44,
  className = ""
}) {
  return (
    <div className={`rcui-loading-screen ${className}`}>
      {logo ? (
        <img className="rcui-loading-logo" src={logo} alt="" />
      ) : (
        <div className="rcui-loading-logo-placeholder">R</div>
      )}
      <Spinner size={spinnerSize} />
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}