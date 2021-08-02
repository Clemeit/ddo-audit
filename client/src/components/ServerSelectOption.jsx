import React from "react";
import { Link, useLocation } from "react-router-dom";

const ServerSelectOption = (props) => {
    function GetS() {
        if (
            props.number === null ||
            props.number === undefined ||
            props.number === 1
        )
            return "";

        return "s";
    }

    return (
        <Link
            to={props.destination + "/" + props.server.toLowerCase()}
            className="server-select-option"
        >
            <h3 style={{ fontWeight: "bold", marginBottom: "0px" }}>
                {props.server}
            </h3>
            <span
                className="lfm-number"
                style={{ fontSize: "x-large", marginLeft: "auto" }}
            >
                {props.number}
            </span>
            <span style={{ fontSize: "x-large", marginLeft: "5px" }}>
                {props.word}
                {GetS()}
            </span>
        </Link>
    );
};

export default ServerSelectOption;
