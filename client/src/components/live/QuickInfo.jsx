import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Fetch } from "../../services/DataLoader";
import ContentCluster from "../global/ContentCluster";

const QuickInfo = (props) => {
    const [news, setNews] = React.useState(null);

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

    function GetNews() {
        Fetch("https://api.ddoaudit.com/news", 5000)
            .then((val) => {
                setNews(val || []);
            })
            .catch(() => {});
    }

    function getDefaultServerLink() {
        let defaultserver = "";
        if (
            props.serverstatus == null ||
            props.serverstatus.Worlds == null ||
            props.serverstatus.Worlds.length == 0
        ) {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (failed to fetch data)
                </span>
            );
        }
        props.serverstatus.Worlds.forEach((server) => {
            if (server.Order == 0) {
                if (defaultserver == "") {
                    defaultserver = server.Name;
                } else {
                    defaultserver = "unknown (servers are offline)";
                }
            }
        });
        if (defaultserver == "unknown (servers are offline)") {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (servers are offline)
                </span>
            );
        }
        return (
            <Link
                id="default_server"
                className="blue-link"
                to={"/servers/" + defaultserver}
                style={{ textDecoration: "underline" }}
            >
                {defaultserver}
            </Link>
        );
    }

    function getMostPopulatedServerLink() {
        let mostpopulatedserver = "";
        let population = 0;
        if (
            props.serverdistribution == null ||
            props.serverdistribution == []
        ) {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (failed to fetch data)
                </span>
            );
        }
        props.serverdistribution.forEach((series) => {
            if (series.value > population && series.id !== "Hardcore") {
                population = series.value;
                mostpopulatedserver = series.id;
            }
        });
        if (mostpopulatedserver == "unknown (servers are offline)") {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (servers are offline)
                </span>
            );
        }
        return (
            <Link
                id="populous_server"
                className="blue-link"
                to={"/servers/" + mostpopulatedserver}
                style={{ textDecoration: "underline" }}
            >
                {mostpopulatedserver}
            </Link>
        );
    }

    React.useEffect(() => {
        GetNews();
    }, []);

    return (
        <>
            <ContentCluster title="Quick Info">
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
                        {props.serverstatus === null
                            ? "(Loading...)"
                            : getDefaultServerLink()}
                    </li>
                    <li>
                        The most populated server is{" "}
                        {props.serverdistribution === null
                            ? "(Loading...)"
                            : getMostPopulatedServerLink()}
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
                        unique guilds
                    </li>
                </ul>
            </ContentCluster>
            <ContentCluster title="Of Special Note">
                {news == null ? (
                    <span
                        style={{
                            textAlign: "justify",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                            marginBottom: "30px",
                        }}
                    >
                        Loading news...
                    </span>
                ) : news.length > 0 ? (
                    <div
                        style={{
                            marginBottom: "30px",
                        }}
                    >
                        {news.map((message, i) => (
                            <div key={i}>
                                <p
                                    style={{
                                        textAlign: "justify",
                                        fontSize: "1.5rem",
                                        lineHeight: "normal",
                                        color: "var(--text)",
                                    }}
                                >
                                    <b>{message.date}:</b>{" "}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: message.description,
                                        }}
                                    ></span>
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p
                        style={{
                            textAlign: "justify",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                            marginBottom: "30px",
                        }}
                    >
                        There's nothing going on in our neck of the woods!
                    </p>
                )}
                {news != null && (
                    <Link
                        to="/suggestions"
                        className="secondary-button should-invert full-width-mobile"
                        style={{
                            color: "var(--text)",
                            textDecoration: "none",
                        }}
                    >
                        Make a suggestion
                    </Link>
                )}
            </ContentCluster>
        </>
    );
};

export default QuickInfo;
