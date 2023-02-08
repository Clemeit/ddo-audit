import React from "react";

const ToggleButton = (props) => {
  return (
    <div className={`toggle-button-container ${props.className}`}>
      <div className={`toggle-button-inner ${props.className}`}>
        <button
          className={`toggle-button left${props.isA ? " selected" : ""}`}
          style={{
            fontSize: "1rem",
            borderRadius: "3px 0px 0px 3px",
          }}
          onClick={() => {
            props.doA();
          }}
        >
          <div />
          <span>{props.textA}</span>
        </button>
        <button
          className={`toggle-button right${props.isB ? " selected" : ""}`}
          style={{
            fontSize: "1rem",
            borderRadius: "0px 3px 3px 0px",
          }}
          onClick={() => {
            props.doB();
          }}
        >
          <div />
          <span>{props.textB}</span>
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;
