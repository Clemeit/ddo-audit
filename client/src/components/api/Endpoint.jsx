import React from "react";
import { ReactComponent as ExpandSVG } from "../../assets/global/expand.svg";
import { ReactComponent as LinkSVG } from "../../assets/global/chain.svg";

const Endpoint = (props) => {
    return (
        <div className="endpoint">
            <h4 className="endpoint-title">{props.data.name}</h4>
            <p className="endpoint-description">{props.data.description}</p>
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
                        onClick={() => props.handleExpansion(sub)}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    color: "var(--text-lfm-number)",
                                    fontWeight: "bold",
                                }}
                            >
                                https://api.ddoaudit.com/{props.data.path}
                                {sub.endpoint}
                            </span>
                            <a
                                href={`https://api.ddoaudit.com/${props.data.path}${sub.endpoint}`}
                                rel="noreferrer"
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <LinkSVG className="endpoint-link nav-icon should-invert" />
                            </a>
                            <ExpandSVG
                                style={{
                                    marginLeft: "auto",
                                    transition: "transform 200ms",
                                    transform: sub.expanded
                                        ? "rotate(-180deg)"
                                        : "",
                                }}
                            />
                        </div>
                        {sub.expanded && <div>{sub.description}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Endpoint;
