import React from "react";
import CanvasFriendsPanel from "./CanvasFriendsPanel";

const FriendsPanel = (props) => {
    return (
        <div
            className={
                "content-container" +
                `${props.minimal ? " hide-on-mobile" : ""}`
            }
            style={{ minHeight: "700px", width: "706px" }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CanvasFriendsPanel />
            </div>
        </div>
    );
};

export default FriendsPanel;
