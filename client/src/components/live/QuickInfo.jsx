import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Fetch } from "../../services/DataLoader";
import ContentCluster from "../global/ContentCluster";
import FAQ from "./FAQ";
import { SERVER_LIST_LOWERCASE } from "../../constants/Servers";
import News from "./News";

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
                    text: `${props.mostPopulatedServerLink(
                        true
                    )} is DDO's most populated server.`,
                },
            },
            {
                "@type": "Question",
                name: "What is DDO's default server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `${props.defaultServerLink(
                        true
                    )} is currently DDO's default server and will have the most new players.`,
                },
            },
            {
                "@type": "Question",
                name: "How many players does DDO have?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `There have been ${props.totalUniquePlayerCount()} unique characters on DDO in the last 90 days.`,
                },
            },
            {
                "@type": "Question",
                name: "What is DDO's best server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The best server for you will depend on the number of players online during your preferred play time (check our "Servers" page for more information). If you're new to DDO, start on ${props.defaultServerLink(
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
                    text: `Yes, DDO is still active and receives frequent updates and content releases. We've seen ${props.totalUniquePlayerCount()} unique characters and ${props.totalUniqueGuildCount()} unique guilds on DDO in the last 90 days.`,
                },
            },
        ],
    };

    function conditionalQuickInfoContent() {
        if (props.isError) {
            return (
                <span
                    style={{
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text)",
                    }}
                >
                    Content failed to load :(
                </span>
            );
        }

        if (!props.isLoaded) {
            return (
                <span
                    style={{
                        fontSize: "1.5rem",
                        lineHeight: "normal",
                        color: "var(--text)",
                    }}
                >
                    Loading...
                </span>
            );
        }

        return (
            <ul
                style={{
                    fontSize: "1.5rem",
                    lineHeight: "normal",
                    paddingLeft: "20px",
                    color: "var(--text)",
                }}
            >
                <li>The default server is {props.defaultServerLink()}</li>
                <li>
                    The most populated server is{" "}
                    {props.serverdistribution === null
                        ? "(Loading...)"
                        : props.mostPopulatedServerLink()}
                </li>
                <li>
                    In the last quarter, we've seen{" "}
                    <span className="population-number">
                        {props.unique === null
                            ? "(Loading...)"
                            : props.totalUniquePlayerCount()}
                    </span>{" "}
                    unique characters and{" "}
                    <span className="lfm-number">
                        {props.unique === null
                            ? "(Loading...)"
                            : props.totalUniqueGuildCount()}
                    </span>{" "}
                    unique guilds
                </li>
            </ul>
        );
    }

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(FAQ_STRUCTURED)}
            </script>
            <ContentCluster title="Quick Info">
                {conditionalQuickInfoContent()}
            </ContentCluster>
        </>
    );
};

export default QuickInfo;
