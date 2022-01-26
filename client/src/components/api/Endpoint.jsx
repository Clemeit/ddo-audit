import React from "react";
import { ReactComponent as ExpandSVG } from "../../assets/global/expand.svg";
import { ReactComponent as LinkSVG } from "../../assets/global/chain.svg";

const Endpoint = (props) => {
    return (
        <div
            className="endpoint"
            style={{ backgroundColor: props.expanded ? "unset" : "" }}
        >
            <h4 className="endpoint-title">{props.data.name}</h4>
            <p className="endpoint-description">{props.data.description}</p>
            {props.expanded && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        marginBottom: "0.5rem",
                        fontSize: "1.5rem",
                    }}
                >
                    {props.data.sub.map((sub, i) => (
                        <div
                            className="endpoint-subdirectory"
                            key={i}
                            onClick={(e) => {
                                props.handleExpansion(sub);
                                e.stopPropagation();
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--text-lfm-number)",
                                        fontWeight: "bold",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    https://api&#8203;.ddoaudit.com/&#8203;
                                    {props.data.path}
                                    {sub.endpoint}
                                </span>
                                <a
                                    href={`https://api.ddoaudit.com/${props.data.path}${sub.endpoint}`}
                                    rel="noreferrer"
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <LinkSVG
                                        className="endpoint-link nav-icon should-invert"
                                        style={{ flexShrink: "none" }}
                                    />
                                </a>
                                <ExpandSVG
                                    className="nav-icon should-invert"
                                    style={{
                                        marginLeft: "auto",
                                        transition: "transform 200ms",
                                        transform: sub.expanded
                                            ? "rotate(-180deg)"
                                            : "",
                                        flexBasis: "30px",
                                        flexShrink: "0",
                                    }}
                                />
                            </div>
                            {sub.expanded && <div>{sub.description}</div>}
                        </div>
                    ))}
                </div>
            )}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                {!props.expanded && (
                    <ExpandSVG
                        className="nav-icon-large should-invert"
                        style={{
                            transition: "transform 200ms",
                            flexBasis: "30px",
                            flexShrink: "0",
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Endpoint;
