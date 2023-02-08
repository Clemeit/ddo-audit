import React from "react";

const LoadingOverlay = (props) => {
  return (
    <div className="loading-overlay">
      <span>{props.message || "Loading data. Please wait..."}</span>
    </div>
  );
};

export default LoadingOverlay;
