import React from "react";
import { Link } from "react-router-dom";

const MiniGroup = (props) => {
    return (
        <Link
            className="mini-group"
            to={"/grouping/" + props.server}
            style={{
                textDecoration: "none",
                color: "var(--text)",
            }}
        >
            <h5 style={{ fontWeight: "bold" }}>{props.server}</h5>
            <span className="lfm-number" style={{ fontSize: "larger" }}>
                {props.questName}
            </span>
            <span style={{ fontSize: "large" }}>
                {props.leaderName}, {props.memberCount + 1} member
                {props.memberCount + 1 > 1 ? "s" : ""}
            </span>
        </Link>
    );
};

export default MiniGroup;
