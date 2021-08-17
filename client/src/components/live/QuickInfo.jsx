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
        <div>
            <div className={"content-cluster"}>
                <h2 style={{ color: "var(--text)" }}>Quick Info</h2>
                <hr
                    style={{
                        backgroundColor: "var(--text)",
                        opacity: 0.2,
                    }}
                />
                <ul
                    style={{
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        paddingLeft: "20px",
                        color: "var(--text)",
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
            </div>
            <div className={"content-cluster"}>
                <h2 style={{ color: "var(--text)" }}>Of Special Note</h2>
                <hr
                    style={{
                        backgroundColor: "var(--text)",
                        opacity: 0.2,
                    }}
                />
                <p
                    style={{
                        textAlign: "justify",
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text)",
                    }}
                >
                    <b>September 1, 2021:</b> DDO Audit is sporting a new
                    website! In an effort to make DDO Audit more accessible to
                    players, I've completely redesigned the website to improve
                    responsiveness, offer a better mobile experience, and
                    provide players with more transparent information. Please
                    leave any feedback or suggestions by using the button below!
                </p>
                <div className="secondary-button should-invert full-width-mobile">
                    Make a suggestion
                </div>
            </div>
        </div>
    );
};

export default QuickInfo;
