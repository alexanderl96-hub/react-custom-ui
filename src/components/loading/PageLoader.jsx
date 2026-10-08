import React from "react";
import Spinner from "./Spinner";

export default function PageLoader({ label = "Loading page...", size = 36 }) {
  return (
    <div className="rcui-page-loader">
      <Spinner size={size} label={label} />
    </div>
  );
}