import React, { Component } from "react";
import { Link } from "react-router-dom";

const QuickInfo = (props) => {
    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function GetTotalUniquePlayerCount() {
        let total = 0;
        props.unique.forEach((server) => {
            total += server.UniquePlayers;
        });
        return FormatWithCommas(total.toString());
    }

    function GetTotalUniqueGuildCount() {
        let total = 0;
        props.unique.forEach((server) => {
            total += server.UniqueGuilds;
        });
        return FormatWithCommas(total.toString());
    }

    return (
        <div className={"card " + props.className}>
            <h2 style={{ fontSize: "x-large", fontWeight: "bold" }}>
                Quick Info
            </h2>
            <ul
                style={{
                    fontSize: "larger",
                    lineHeight: "normal",
                    paddingLeft: "20px",
                }}
            >
                <li>
                    The default server is{" "}
                    {props.data === null ? (
                        "(Loading...)"
                    ) : (
                        <Link
                            id="default_server"
                            className="blue-link"
                            to={
                                "/servers?s=" +
                                props.data.DefaultServer.toLowerCase()
                            }
                            style={{ textDecoration: "underline" }}
                        >
                            {props.data.DefaultServer}
                        </Link>
                    )}
                </li>
                <li>
                    The most populated server is{" "}
                    {props.data === null ? (
                        "(Loading...)"
                    ) : (
                        <Link
                            id="populous_server"
                            className="blue-link"
                            to={
                                "/servers?s=" +
                                props.data.DefaultServer.toLowerCase()
                            }
                            style={{ textDecoration: "underline" }}
                        >
                            {props.data.DefaultServer}
                        </Link>
                    )}
                </li>
                <li>
                    In the last quarter, we've seen{" "}
                    <span className="population-number">
                        {props.unique === null
                            ? "(Loading...)"
                            : GetTotalUniquePlayerCount()}
                    </span>{" "}
                    unique characters and{" "}
                    <span className="lfm-number">
                        {props.unique === null
                            ? "(Loading...)"
                            : GetTotalUniqueGuildCount()}
                    </span>{" "}
                    unique guilds.
                </li>
            </ul>
            <hr style={{ width: "80%", backgroundColor: "whitesmoke" }} />
            <h2 style={{ fontSize: "x-large", fontWeight: "bold" }}>
                Of Special Note
            </h2>
            <p
                style={{
                    textAlign: "justify",
                    fontSize: "larger",
                    lineHeight: "normal",
                }}
            >
                <b>March 24, 2021:</b> Hardcore League Season 4 begins March 31,
                2021! Find groups on the{" "}
                <Link
                    to="/grouping"
                    className="blue-link"
                    style={{ textDecoration: "underline" }}
                >
                    Grouping page
                </Link>
                , lookup players on the{" "}
                <Link
                    to="/who"
                    className="blue-link"
                    style={{ textDecoration: "underline" }}
                >
                    live Who list
                </Link>
                , and discover what builds other players are running on the{" "}
                <Link
                    to="/servers"
                    className="blue-link"
                    style={{ textDecoration: "underline" }}
                >
                    Server page
                </Link>
                . See you in Eberron!
            </p>
        </div>
    );
};

export default QuickInfo;
