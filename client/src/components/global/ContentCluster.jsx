import React from "react";
import { ReactComponent as LinkSVG } from "../../assets/global/chain.svg";

const ContentCluster = (props) => {
    function getId() {
        return props.altTitle
            ? props.altTitle.replace(/\s/g, "-").toLowerCase()
            : props.title
            ? props.title.replace(/\s/g, "-").toLowerCase()
            : "missing-header";
    }

    function getPath() {
        if (window.location.href.includes("#")) {
            return `${window.location.href.substring(
                0,
                window.location.href.indexOf("#")
            )}#${getId()}`;
        } else {
            return `${window.location.href}#${getId()}`;
        }
    }

    return (
        <section
            className="content-cluster"
            id={getId()}
            style={{
                display: props.hidden ? "none" : "",
                margin: props.noMargin
                    ? "0px"
                    : props.smallMargin
                    ? "10px"
                    : "",
                marginBottom: props.smallBottomMargin ? "25px" : "",
            }}
        >
            <h2 className="content-cluster-title">
                {props.title || "Missing Header"}
                {!props.noLink && (
                    <a href={getPath()}>
                        <span className="sr-only">
                            Link to the '{getId()}' header
                        </span>
                        <LinkSVG className="anchor-link nav-icon should-invert" />
                    </a>
                )}
            </h2>
            <hr
                style={{
                    backgroundColor: "var(--text)",
                    opacity: 0.2,
                }}
            />
            {props.description && (
                <div
                    className="content-cluster-description"
                    style={{
                        color: props.noFade
                            ? "var(--text)"
                            : "var(--text-faded)",
                    }}
                >
                    {props.description}
                </div>
            )}
            {props.children}
        </section>
    );
};

export default ContentCluster;
