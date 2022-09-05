import React from "react";

const ToggleButton = (props) => {
    return (
        <div
            style={{ display: "flex", gap: "0px", paddingBottom: "5px" }}
            className={props.className}
        >
            <button
                className={`secondary-button should-invert${
                    props.isA ? " selected" : ""
                }`}
                style={{ fontSize: "1rem", borderRadius: "3px 0px 0px 3px" }}
                onClick={() => {
                    props.doA();
                }}
            >
                {props.textA}
            </button>
            <button
                className={`secondary-button should-invert${
                    props.isB ? " selected" : ""
                }`}
                style={{ fontSize: "1rem", borderRadius: "0px 3px 3px 0px" }}
                onClick={() => {
                    props.doB();
                }}
            >
                {props.textB}
            </button>
        </div>
    );
};

export default ToggleButton;
