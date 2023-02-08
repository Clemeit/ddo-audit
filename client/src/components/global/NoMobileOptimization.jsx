import React from "react";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";

const NoMobileOptimization = (props) => {
  return (
    <div
      className="show-on-mobile"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <p
        style={{
          fontSize: "1.5rem",
          lineHeight: "normal",
          color: "var(--text-faded)",
          textAlign: "center",
        }}
      >
        <WarningSVG style={{ verticalAlign: "top" }} />
        This page is not optimized for mobile browsing.
      </p>
    </div>
  );
};

export default NoMobileOptimization;
