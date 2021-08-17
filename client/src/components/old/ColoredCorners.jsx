import React from "react";

const ColoredCorners = (props) => {
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    width: "70px",
                    height: "70px",
                    backgroundColor: "#004488",
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%)",
                    opacity: 0.2,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "0px",
                    left: "0px",
                    width: "70px",
                    height: "70px",
                    backgroundColor: "#880088",
                    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
                    opacity: 0.2,
                }}
            />
        </div>
    );
};

export default ColoredCorners;
