import React from "react";
import { ReactComponent as ExpandSVG } from "../assets/global/expand.svg";

const ExpandableCard = (props) => {
    var [viewState, set_viewState] = React.useState("collapsed");

    //let children = React.cloneElement(props.children);

    // function CardId() {
    //     return props.title.replace(/[^A-Z0-9\s]+/gi, "").replace(/[\s]+/g, "_");
    // }

    return (
        <div
            className={"card expandable " + (props.className || "")}
            style={{
                maxHeight:
                    viewState === "expanded"
                        ? props.largeHeight
                        : props.smallHeight,
                transition: "max-height 400ms",
            }}
        >
            <div
                className="expandable-gradient"
                style={{
                    display: viewState === "expanded" ? "none" : "block",
                }}
                onClick={() =>
                    set_viewState(
                        viewState === "expanded" ? "collapsed" : "expanded"
                    )
                }
            ></div>
            {props.children}
            <div style={{ height: "25px" }} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "larger",
                    position: "absolute",
                    bottom: "2px",
                    left: "0px",
                    width: "100%",
                }}
                onClick={() =>
                    set_viewState(
                        viewState === "expanded" ? "collapsed" : "expanded"
                    )
                }
            >
                <div>
                    See {viewState === "expanded" ? "less" : "more"}
                    <ExpandSVG
                        className="link-icon"
                        width={30}
                        height={30}
                        style={{
                            transform:
                                "rotate(" +
                                (viewState === "expanded"
                                    ? "-180deg"
                                    : "0deg") +
                                ")",
                            transition: "transform 400ms",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpandableCard;
