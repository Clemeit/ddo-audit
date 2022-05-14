import React from "react";
import { ReactComponent as InfoSVG } from "../../assets/global/info.svg";
import { ReactComponent as ErrorSVG } from "../../assets/global/error.svg";
import { ReactComponent as WarningSVG } from "../../assets/global/warning.svg";

const PageMessage = (props) => {
    function getIcon() {
        switch (props.type) {
            case "warning":
                return <WarningSVG style={{ marginRight: "5px" }} />;
            case "error":
                return <ErrorSVG style={{ marginRight: "5px" }} />;
            case "info":
            default:
                return <InfoSVG style={{ marginRight: "5px" }} />;
        }
    }

    function getColor() {
        switch (props.type) {
            case "warning":
                return "orange";
            case "error":
                return "red";
            case "info":
            default:
                return "blue";
        }
    }

    return (
        <div>
            <div
                style={{
                    width: "100%",
                    border: `1px solid ${getColor()}`,
                    borderRadius: "4px",
                    padding: "7px 10px",
                    marginBottom: "5px",
                }}
            >
                <span
                    style={{
                        fontSize: `${props.fontSize}rem`,
                        fontWeight: "bold",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    {getIcon()}
                    {props.title}
                </span>
                <span style={{ fontSize: `${props.fontSize}rem` }}>
                    {props.message}
                </span>
                <br />
                {props.submessage && (
                    <span
                        style={{
                            fontSize: `${props.fontSize - 0.2}rem`,
                            color: "var(--text-faded)",
                        }}
                    >
                        {props.submessage}
                    </span>
                )}
            </div>
            {props.pushBottom && <div style={{ height: "15px" }} />}
        </div>
    );
};

export default PageMessage;
