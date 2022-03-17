import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Fetch } from "../../services/DataLoader";
import { IsTheBigDay } from "../../services/TheBigDay";
import ContentCluster from "../global/ContentCluster";

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
                name: "Which DDO server is the most populated?",
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
                name: "What is DDO's player count?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `There have been ${GetTotalUniquePlayerCount()} unique characters on DDO in the last 90 days.`,
                },
            },
            {
                "@type": "Question",
                name: "How many players does DDO have?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `There have been ${GetTotalUniquePlayerCount()} unique characters on DDO in the last 90 days.`,
                },
            },
            {
                "@type": "Question",
                name: "What is DDO's best server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The best server for you will depend on the number of players online during your preferred play time - check our 'Servers' page. If you're new to DDO, start on ${getDefaultServerLink(
                        true
                    )} which is currently DDO's default server.`,
                },
            },
            {
                "@type": "Question",
                name: "Is DDO still active in 2022?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `Yes, DDO is still active and receives periodic updates and content releases. There have been ${GetTotalUniquePlayerCount()} unique characters and ${GetTotalUniqueGuildCount()} unique guilds on DDO in the last 90 days.`,
                },
            },
            {
                "@type": "Question",
                name: "Is DDO down?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `Server status can be checked on our 'Live' page. The data is updated every minute.`,
                },
            },
            {
                "@type": "Question",
                name: "Are the DDO servers offline?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `Server status can be checked on our 'Live' page. The data is updated every minute.`,
                },
            },
        ],
    };

    const [news, setNews] = React.useState(null);

    function FormatWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function GetTotalUniquePlayerCount() {
        if (!props.unique) return "N/A";
        let total = 0;
        props.unique.forEach((server) => {
            total += server.TotalCharacters;
        });
        return FormatWithCommas(total.toString());
    }

    function GetTotalUniqueGuildCount() {
        if (!props.unique) return "N/A";
        let total = 0;
        props.unique.forEach((server) => {
            total += server.TotalGuilds;
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

    function getDefaultServerLink(nameonly = false) {
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
            if (server.Order == null) {
                defaultserver = "unknown (servers are offline)";
            } else {
                if (server.Order == 0) {
                    if (defaultserver == "") {
                        defaultserver = server.Name;
                    } else {
                        defaultserver = "unknown (servers are offline)";
                    }
                }
            }
        });
        if (nameonly) {
            return defaultserver;
        }
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
        GetNews();
    }, []);

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(FAQ_STRUCTURED)}
            </script>
            <ContentCluster title="Quick Info">
                {IsTheBigDay() ? (
                    <ul
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            paddingLeft: "20px",
                            color: "var(--text)",
                        }}
                    >
                        <li>The default server is {getMegaServerLink()}</li>
                        <li>
                            The most populated server is {getMegaServerLink()}
                        </li>
                        <li>
                            In the last quarter, we've seen{" "}
                            <span className="population-number">
                                2,147,483,647
                            </span>{" "}
                            unique characters and{" "}
                            <span className="lfm-number">over 9000</span> unique
                            guilds
                        </li>
                    </ul>
                ) : (
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
                )}
            </ContentCluster>
            <ContentCluster title="Of Special Note">
                {IsTheBigDay() ? (
                    <p
                        style={{
                            textAlign: "justify",
                            fontSize: "1.5rem",
                            lineHeight: "normal",
                            color: "var(--text)",
                        }}
                    >
                        <b>April 1, {new Date().getFullYear()}:</b>{" "}
                        <span>
                            Big news! The developers of Dungeons and Dragons
                            Online have decided to merge every server into one
                            mega-server! Check it out!
                        </span>
                    </p>
                ) : news == null ? (
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
