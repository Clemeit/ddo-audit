import React from "react";
import { ReactComponent as CloseSVG } from "../../assets/global/close.svg";

const YesNoModal = (props) => {
    return (
        <div className="absolute-center">
            <div className="overlay" onClick={() => props.close()} />
            <div
                className="popup-message fullscreen"
                style={{ width: "600px", maxWidth: "90%" }}
            >
                <CloseSVG
                    className="link-icon should-invert"
                    style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() => props.close()}
                />
                <h3>{props.title || ""}</h3>
                {props.message && (
                    <span style={{ fontSize: "1.3rem" }}>{props.message}</span>
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                    }}
                >
                    <div
                        className={"primary-button should-invert"}
                        style={{
                            marginLeft: "auto",
                            minWidth: "100px",
                            textAlign: "center",
                            marginTop: "10px",
                        }}
                        onClick={() => props.yes()}
                    >
                        Yes
                    </div>
                    <div
                        className={"primary-button should-invert"}
                        style={{
                            // marginLeft: "auto",
                            minWidth: "100px",
                            textAlign: "center",
                            marginTop: "10px",
                        }}
                        onClick={() => props.no()}
                    >
                        No
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YesNoModal;
