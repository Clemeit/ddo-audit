import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Fetch } from "../../services/DataLoader";
import ContentCluster from "../global/ContentCluster";
import FAQ from "./FAQ";
import { SERVER_LIST_LOWERCASE } from "../../constants/Servers";

const QuickInfo = (props) => {
    const FAQ_STRUCTURED = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is DDO's most populated server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `${getMostPopulatedServerLink(
                        true
                    )} is DDO's most populated server.`,
                },
            },
            {
                "@type": "Question",
                name: "What is DDO's default server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `${getDefaultServerLink(
                        true
                    )} is currently DDO's default server and will have the most new players.`,
                },
            },
            {
                "@type": "Question",
                name: "How many players does DDO have?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `There have been ${getTotalUniquePlayerCount()} unique characters on DDO in the last 90 days.`,
                },
            },
            {
                "@type": "Question",
                name: "What is DDO's best server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The best server for you will depend on the number of players online during your preferred play time (check our "Servers" page for more information). If you're new to DDO, start on ${getDefaultServerLink(
                        true
                    )} which is currently DDO's default server.`,
                },
            },
            {
                "@type": "Question",
                name: "Is DDO down?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `Server status can be checked on our "Live" page. The data is updated every minute.`,
                },
            },
            {
                "@type": "Question",
                name: `Is DDO still active in ${new Date().getFullYear()}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes, DDO is still active and receives periodic updates and content releases. There have been ${getTotalUniquePlayerCount()} unique characters and ${getTotalUniqueGuildCount()} unique guilds on DDO in the last 90 days.`,
                },
            },
        ],
    };

    const [news, setNews] = React.useState(null);

    function formatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function getTotalUniquePlayerCount() {
        if (!props.unique) return "N/A";
        let total = 0;
        props.unique.forEach((server) => {
            total += server.TotalCharacters;
        });
        return formatWithCommas(total.toString());
    }

    function getTotalUniqueGuildCount() {
        if (!props.unique) return "N/A";
        let total = 0;
        props.unique.forEach((server) => {
            total += server.TotalGuilds;
        });
        return formatWithCommas(total.toString());
    }

    function getNews() {
        Fetch("https://api.ddoaudit.com/news", 5000)
            .then((val) => {
                setNews(val || []);
            })
            .catch(() => {});
    }

    function getMegaServerLink() {
        return (
            <Link
                id="default_server"
                className="blue-link"
                to={"/servers/eberron"}
                style={{ textDecoration: "underline" }}
            >
                Eberron Mega-Server
            </Link>
        );
    }

    function getDefaultServerLink() {
        let defaultServerName = "";
        if (!props.isLoaded) {
            return <span>unknown (loading...)</span>;
        }
        if (props.isError) {
            return (
                <span style={{ color: "var(--red-text)" }}>
                    unknown (failed to fetch data)
                </span>
            );
        }
        Object.entries(props.gameStatusData.servers).forEach(
            ([serverName, serverData]) => {
                if (serverData.index == 0) {
                    defaultServerName = serverName;
                }
            }
        );
        if (!SERVER_LIST_LOWERCASE.includes(defaultServerName)) {
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
                to={"/servers/" + defaultServerName}
                style={{ textDecoration: "underline" }}
            >
                {toSentenceCase(defaultServerName)}
            </Link>
        );
    }

    function toSentenceCase(str) {
        if (str === null) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getMostPopulatedServerLink(nameonly = false) {
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
        if (nameonly) {
            return mostpopulatedserver;
        }
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
        getNews();
    }, []);

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(FAQ_STRUCTURED)}
            </script>
            <ContentCluster title="Quick Info">
                <ul
                    style={{
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        paddingLeft: "20px",
                        color: "var(--text)",
                    }}
                >
                    <li>The default server is {getDefaultServerLink()}</li>
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
                                : getTotalUniquePlayerCount()}
                        </span>{" "}
                        unique characters and{" "}
                        <span className="lfm-number">
                            {props.unique === null
                                ? "(Loading...)"
                                : getTotalUniqueGuildCount()}
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
            <FAQ
                mostPopulatedServer={getMostPopulatedServerLink()}
                defaultServer={getDefaultServerLink()}
                uniquePlayerCount={getTotalUniquePlayerCount()}
                uniqueGuildCount={getTotalUniqueGuildCount()}
            />
        </>
    );
};

export default QuickInfo;
