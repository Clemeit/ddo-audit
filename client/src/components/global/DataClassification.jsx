import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as InfoSVG } from "../../assets/global/info.svg";

const DataClassification = ({ classification } = props) => {
  const getText = () => {
    switch (classification) {
      case "mixed":
        return "Mixed Data";
      case "observed":
        return "Observed Data";
      case "inferred":
        return "Inferred Data";
    }
  };

  return (
    <div
      className="content-cluster hide-on-mobile"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        color: "var(--text)",
        paddingTop: "10px",
        margin: "0px",
      }}
    >
      <Link
        to={`/data/${classification}`}
        className="data-classification-content"
      >
        <InfoSVG
          className="data-classification-icon"
          style={{ marginRight: "5px", filter: "grayscale(100%)" }}
        />
        <span>{getText()}</span>
      </Link>
    </div>
  );
};

export default DataClassification;
